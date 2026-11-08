-- ============================================================
-- KHUTBAH JUMAT
-- Skema, RLS, grants, revision history, audit log, RPC
-- Zona waktu aplikasi: WITA
-- Draf otomatis tidak pernah diterbitkan otomatis.
-- ============================================================

BEGIN;

-- 1. TABEL UTAMA
CREATE TABLE IF NOT EXISTS public.khutbah_jumat (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    week_start date NOT NULL UNIQUE,
    title text NOT NULL,
    theme text NOT NULL,
    language text NOT NULL DEFAULT 'Bugis Latin',
    khutbah_pertama text NOT NULL,
    khutbah_kedua text NOT NULL,
    doa_penutup text NOT NULL,
    referensi jsonb NOT NULL DEFAULT '[]'::jsonb,
    status text NOT NULL DEFAULT 'draft',
    generated_by text,
    model_name text,
    reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at timestamptz,
    review_notes text,
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT khutbah_jumat_status_check
        CHECK (status IN ('draft', 'pending_review', 'approved', 'published', 'rejected')),
    CONSTRAINT khutbah_jumat_referensi_check
        CHECK (jsonb_typeof(referensi) = 'array'),
    CONSTRAINT khutbah_jumat_week_start_check
        CHECK (EXTRACT(ISODOW FROM week_start) = 1)
);

-- 2. RIWAYAT REVISI
CREATE TABLE IF NOT EXISTS public.khutbah_jumat_revisions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    khutbah_id uuid NOT NULL
        REFERENCES public.khutbah_jumat(id) ON DELETE RESTRICT,
    revision_no integer NOT NULL,
    snapshot jsonb NOT NULL,
    changed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_type text NOT NULL,
    change_note text,
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT khutbah_jumat_revisions_number_check
        CHECK (revision_no > 0),
    CONSTRAINT khutbah_jumat_revisions_actor_check
        CHECK (actor_type IN ('admin', 'cron', 'system')),
    CONSTRAINT khutbah_jumat_revisions_unique
        UNIQUE (khutbah_id, revision_no)
);

-- 3. AUDIT LOG
CREATE TABLE IF NOT EXISTS public.khutbah_jumat_audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    khutbah_id uuid NOT NULL
        REFERENCES public.khutbah_jumat(id) ON DELETE RESTRICT,
    actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_type text NOT NULL,
    action text NOT NULL,
    details jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT khutbah_jumat_audit_actor_check
        CHECK (actor_type IN ('admin', 'cron', 'system')),
    CONSTRAINT khutbah_jumat_audit_action_check
        CHECK (action IN (
            'generated',
            'submitted_for_review',
            'edited',
            'approved',
            'rejected',
            'published',
            'unpublished'
        ))
);

-- 4. INDEKS
CREATE INDEX IF NOT EXISTS idx_khutbah_status
    ON public.khutbah_jumat(status);

CREATE INDEX IF NOT EXISTS idx_khutbah_published_at
    ON public.khutbah_jumat(published_at DESC);

CREATE INDEX IF NOT EXISTS idx_khutbah_revisions_parent
    ON public.khutbah_jumat_revisions(khutbah_id, revision_no DESC);

CREATE INDEX IF NOT EXISTS idx_khutbah_audit_parent
    ON public.khutbah_jumat_audit_logs(khutbah_id, created_at DESC);

-- 5. ROW LEVEL SECURITY
ALTER TABLE public.khutbah_jumat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.khutbah_jumat_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.khutbah_jumat_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS khutbah_public_read_published
    ON public.khutbah_jumat;

CREATE POLICY khutbah_public_read_published
    ON public.khutbah_jumat
    FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

-- Tidak ada policy publik untuk tabel revisi dan audit log.

-- 6. HAK AKSES TABEL
REVOKE ALL PRIVILEGES ON TABLE
    public.khutbah_jumat,
    public.khutbah_jumat_revisions,
    public.khutbah_jumat_audit_logs
FROM PUBLIC, anon, authenticated;

GRANT SELECT (
    id,
    week_start,
    title,
    theme,
    language,
    khutbah_pertama,
    khutbah_kedua,
    doa_penutup,
    referensi,
    published_at
)
ON public.khutbah_jumat
TO anon, authenticated;

GRANT ALL PRIVILEGES ON TABLE
    public.khutbah_jumat,
    public.khutbah_jumat_revisions,
    public.khutbah_jumat_audit_logs
TO service_role;

-- 7. RPC GENERATOR DRAF
CREATE OR REPLACE FUNCTION public.generate_khutbah_jumat(
    p_week_start date,
    p_title text,
    p_theme text,
    p_khutbah_pertama text,
    p_khutbah_kedua text,
    p_doa_penutup text,
    p_referensi jsonb DEFAULT '[]'::jsonb,
    p_model_name text DEFAULT NULL::text
)
RETURNS TABLE(
    khutbah_id uuid,
    result_status text,
    was_created boolean
)
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
DECLARE
    v_id uuid;
    v_status text;
    v_created boolean := false;
BEGIN
    IF p_week_start IS NULL
       OR EXTRACT(ISODOW FROM p_week_start) <> 1 THEN
        RAISE EXCEPTION 'week_start harus merupakan tanggal hari Senin.';
    END IF;

    IF NULLIF(btrim(p_title), '') IS NULL
       OR NULLIF(btrim(p_theme), '') IS NULL
       OR NULLIF(btrim(p_khutbah_pertama), '') IS NULL
       OR NULLIF(btrim(p_khutbah_kedua), '') IS NULL
       OR NULLIF(btrim(p_doa_penutup), '') IS NULL THEN
        RAISE EXCEPTION 'Judul, tema, kedua khutbah, dan doa wajib diisi.';
    END IF;

    IF p_referensi IS NULL
       OR jsonb_typeof(p_referensi) <> 'array' THEN
        RAISE EXCEPTION 'Referensi harus berupa JSON array.';
    END IF;

    IF COALESCE(auth.role(), '') <> 'service_role' THEN
        RAISE EXCEPTION 'Tidak memiliki izin menjalankan generator.'
            USING ERRCODE = '42501';
    END IF;

    PERFORM pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtext('khutbah_jumat'),
        p_week_start - DATE '2000-01-01'
    );

    SELECT k.id, k.status
    INTO v_id, v_status
    FROM public.khutbah_jumat AS k
    WHERE k.week_start = p_week_start;

    IF FOUND THEN
        RETURN QUERY SELECT v_id, v_status, false;
        RETURN;
    END IF;

    INSERT INTO public.khutbah_jumat (
        week_start, title, theme, language,
        khutbah_pertama, khutbah_kedua, doa_penutup,
        referensi, status, generated_by, model_name,
        created_at, updated_at
    )
    VALUES (
        p_week_start, btrim(p_title), btrim(p_theme), 'Bugis Latin',
        btrim(p_khutbah_pertama), btrim(p_khutbah_kedua),
        btrim(p_doa_penutup), p_referensi, 'draft', 'gemini',
        NULLIF(btrim(p_model_name), ''), now(), now()
    )
    RETURNING id, status INTO v_id, v_status;

    INSERT INTO public.khutbah_jumat_revisions (
        khutbah_id, revision_no, snapshot,
        changed_by, actor_type, change_note
    )
    VALUES (
        v_id, 1,
        jsonb_build_object(
            'week_start', p_week_start,
            'title', btrim(p_title),
            'theme', btrim(p_theme),
            'language', 'Bugis Latin',
            'khutbah_pertama', btrim(p_khutbah_pertama),
            'khutbah_kedua', btrim(p_khutbah_kedua),
            'doa_penutup', btrim(p_doa_penutup),
            'referensi', p_referensi,
            'status', 'draft',
            'model_name', NULLIF(btrim(p_model_name), '')
        ),
        NULL, 'cron', 'Draf pertama dibuat otomatis.'
    );

    INSERT INTO public.khutbah_jumat_audit_logs (
        khutbah_id, actor_id, actor_type, action, details
    )
    VALUES (
        v_id, NULL, 'cron', 'generated',
        jsonb_build_object(
            'week_start', p_week_start,
            'model_name', NULLIF(btrim(p_model_name), ''),
            'initial_status', 'draft'
        )
    );

    v_created := true;
    RETURN QUERY SELECT v_id, v_status, v_created;
END;
$function$;

-- 8. RPC PENGELOLAAN DAN ALUR PERSETUJUAN
CREATE OR REPLACE FUNCTION public.manage_khutbah_jumat(
    p_action text,
    p_khutbah_id uuid,
    p_actor_id uuid,
    p_title text DEFAULT NULL::text,
    p_theme text DEFAULT NULL::text,
    p_khutbah_pertama text DEFAULT NULL::text,
    p_khutbah_kedua text DEFAULT NULL::text,
    p_doa_penutup text DEFAULT NULL::text,
    p_referensi jsonb DEFAULT NULL::jsonb,
    p_review_notes text DEFAULT NULL::text
)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
DECLARE
    v_row public.khutbah_jumat%ROWTYPE;
    v_revision_no integer;
    v_audit_action text;
BEGIN
    IF p_actor_id IS NULL THEN
        RAISE EXCEPTION 'Identitas admin wajib tersedia.';
    END IF;

    SELECT *
    INTO v_row
    FROM public.khutbah_jumat
    WHERE id = p_khutbah_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Naskah khutbah tidak ditemukan.';
    END IF;

    CASE p_action
        WHEN 'edit' THEN
            IF v_row.status NOT IN ('draft', 'rejected') THEN
                RAISE EXCEPTION 'Naskah hanya dapat diedit saat berstatus draft atau rejected.';
            END IF;

            IF p_referensi IS NOT NULL
               AND jsonb_typeof(p_referensi) <> 'array' THEN
                RAISE EXCEPTION 'Referensi harus berupa JSON array.';
            END IF;

            UPDATE public.khutbah_jumat
            SET
                title = COALESCE(NULLIF(btrim(p_title), ''), title),
                theme = COALESCE(NULLIF(btrim(p_theme), ''), theme),
                khutbah_pertama = COALESCE(
                    NULLIF(btrim(p_khutbah_pertama), ''),
                    khutbah_pertama
                ),
                khutbah_kedua = COALESCE(
                    NULLIF(btrim(p_khutbah_kedua), ''),
                    khutbah_kedua
                ),
                doa_penutup = COALESCE(
                    NULLIF(btrim(p_doa_penutup), ''),
                    doa_penutup
                ),
                referensi = COALESCE(p_referensi, referensi),
                status = 'draft',
                reviewed_by = NULL,
                reviewed_at = NULL,
                review_notes = NULL,
                updated_at = now()
            WHERE id = p_khutbah_id
            RETURNING * INTO v_row;

            v_audit_action := 'edited';

        WHEN 'submit_for_review' THEN
            IF v_row.status <> 'draft' THEN
                RAISE EXCEPTION 'Hanya naskah draft yang dapat diajukan.';
            END IF;

            UPDATE public.khutbah_jumat
            SET status = 'pending_review', updated_at = now()
            WHERE id = p_khutbah_id
            RETURNING * INTO v_row;

            v_audit_action := 'submitted_for_review';

        WHEN 'approve' THEN
            IF v_row.status <> 'pending_review' THEN
                RAISE EXCEPTION 'Hanya naskah yang menunggu tinjauan dapat disetujui.';
            END IF;

            UPDATE public.khutbah_jumat
            SET
                status = 'approved',
                reviewed_by = p_actor_id,
                reviewed_at = now(),
                review_notes = NULLIF(btrim(p_review_notes), ''),
                updated_at = now()
            WHERE id = p_khutbah_id
            RETURNING * INTO v_row;

            v_audit_action := 'approved';

        WHEN 'reject' THEN
            IF v_row.status <> 'pending_review' THEN
                RAISE EXCEPTION 'Hanya naskah yang menunggu tinjauan dapat ditolak.';
            END IF;

            IF NULLIF(btrim(p_review_notes), '') IS NULL THEN
                RAISE EXCEPTION 'Alasan penolakan wajib diisi.';
            END IF;

            UPDATE public.khutbah_jumat
            SET
                status = 'rejected',
                reviewed_by = p_actor_id,
                reviewed_at = now(),
                review_notes = btrim(p_review_notes),
                updated_at = now()
            WHERE id = p_khutbah_id
            RETURNING * INTO v_row;

            v_audit_action := 'rejected';

        WHEN 'publish' THEN
            IF v_row.status <> 'approved' THEN
                RAISE EXCEPTION 'Naskah harus disetujui sebelum diterbitkan.';
            END IF;

            UPDATE public.khutbah_jumat
            SET
                status = 'published',
                published_at = now(),
                updated_at = now()
            WHERE id = p_khutbah_id
            RETURNING * INTO v_row;

            v_audit_action := 'published';

        WHEN 'unpublish' THEN
            IF v_row.status <> 'published' THEN
                RAISE EXCEPTION 'Hanya naskah terbit yang dapat ditarik.';
            END IF;

            UPDATE public.khutbah_jumat
            SET
                status = 'approved',
                published_at = NULL,
                updated_at = now()
            WHERE id = p_khutbah_id
            RETURNING * INTO v_row;

            v_audit_action := 'unpublished';

        ELSE
            RAISE EXCEPTION 'Tindakan tidak dikenal: %', p_action;
    END CASE;

    IF p_action = 'edit' THEN
        SELECT COALESCE(MAX(revision_no), 0) + 1
        INTO v_revision_no
        FROM public.khutbah_jumat_revisions
        WHERE khutbah_id = p_khutbah_id;

        INSERT INTO public.khutbah_jumat_revisions (
            khutbah_id, revision_no, snapshot,
            changed_by, actor_type, change_note
        )
        VALUES (
            p_khutbah_id, v_revision_no, to_jsonb(v_row),
            p_actor_id, 'admin', 'Perubahan naskah oleh admin'
        );
    END IF;

    INSERT INTO public.khutbah_jumat_audit_logs (
        khutbah_id, actor_id, actor_type, action, details
    )
    VALUES (
        p_khutbah_id, p_actor_id, 'admin', v_audit_action,
        jsonb_build_object(
            'status', v_row.status,
            'revision_no', v_revision_no,
            'review_notes', NULLIF(btrim(p_review_notes), '')
        )
    );

    RETURN jsonb_build_object(
        'ok', true,
        'khutbah_id', v_row.id,
        'status', v_row.status,
        'revision_no', v_revision_no,
        'action', v_audit_action
    );
END;
$function$;

-- 9. PEMBATASAN EKSEKUSI RPC
REVOKE ALL ON FUNCTION public.generate_khutbah_jumat(
    date, text, text, text, text, text, jsonb, text
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.generate_khutbah_jumat(
    date, text, text, text, text, text, jsonb, text
) TO service_role;

REVOKE ALL ON FUNCTION public.manage_khutbah_jumat(
    text, uuid, uuid, text, text, text, text, text, jsonb, text
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.manage_khutbah_jumat(
    text, uuid, uuid, text, text, text, text, text, jsonb, text
) TO service_role;

COMMIT;