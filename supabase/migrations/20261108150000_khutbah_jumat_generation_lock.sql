BEGIN;

-- Kunci eksklusif untuk satu proses generator per pekan.
CREATE TABLE public.khutbah_jumat_generation_locks (
    week_start date PRIMARY KEY,
    lock_token uuid NOT NULL,
    locked_until timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT khutbah_generation_lock_monday_check
        CHECK (EXTRACT(ISODOW FROM week_start) = 1)
);

ALTER TABLE public.khutbah_jumat_generation_locks
    ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.khutbah_jumat_generation_locks
    FROM PUBLIC, anon, authenticated;

GRANT ALL ON TABLE public.khutbah_jumat_generation_locks
    TO service_role;

-- Klaim kunci secara atomik. Kunci kedaluwarsa dapat diambil alih.
CREATE OR REPLACE FUNCTION public.claim_khutbah_jumat_generation_lock(
    p_week_start date,
    p_lock_token uuid,
    p_lease_seconds integer DEFAULT 300
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO ''
AS $function$
DECLARE
    v_rows integer;
BEGIN
    IF COALESCE(auth.role(), '') <> 'service_role' THEN
        RAISE EXCEPTION 'Akses tidak diizinkan.';
    END IF;

    IF p_week_start IS NULL
       OR EXTRACT(ISODOW FROM p_week_start) <> 1 THEN
        RAISE EXCEPTION 'Tanggal pekan harus hari Senin.';
    END IF;

    IF p_lock_token IS NULL THEN
        RAISE EXCEPTION 'Token pengunci wajib diisi.';
    END IF;

    IF p_lease_seconds IS NULL
       OR p_lease_seconds < 60
       OR p_lease_seconds > 900 THEN
        RAISE EXCEPTION 'Masa penguncian harus 60 sampai 900 detik.';
    END IF;

    INSERT INTO public.khutbah_jumat_generation_locks AS current_lock (
        week_start,
        lock_token,
        locked_until
    )
    VALUES (
        p_week_start,
        p_lock_token,
        pg_catalog.now() + (p_lease_seconds * interval '1 second')
    )
    ON CONFLICT (week_start)
    DO UPDATE SET
        lock_token = EXCLUDED.lock_token,
        locked_until = EXCLUDED.locked_until
    WHERE current_lock.locked_until <= pg_catalog.now()
       OR current_lock.lock_token = EXCLUDED.lock_token;

    GET DIAGNOSTICS v_rows = ROW_COUNT;

    RETURN v_rows = 1;
END;
$function$;

-- Hanya pemegang token yang sama dapat melepaskan kunci.
CREATE OR REPLACE FUNCTION public.release_khutbah_jumat_generation_lock(
    p_week_start date,
    p_lock_token uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO ''
AS $function$
DECLARE
    v_rows integer;
BEGIN
    IF COALESCE(auth.role(), '') <> 'service_role' THEN
        RAISE EXCEPTION 'Akses tidak diizinkan.';
    END IF;

    IF p_week_start IS NULL OR p_lock_token IS NULL THEN
        RAISE EXCEPTION 'Tanggal pekan dan token wajib diisi.';
    END IF;

    DELETE FROM public.khutbah_jumat_generation_locks
    WHERE week_start = p_week_start
      AND lock_token = p_lock_token;

    GET DIAGNOSTICS v_rows = ROW_COUNT;

    RETURN v_rows = 1;
END;
$function$;

REVOKE ALL ON FUNCTION public.claim_khutbah_jumat_generation_lock(
    date, uuid, integer
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.claim_khutbah_jumat_generation_lock(
    date, uuid, integer
) TO service_role;

REVOKE ALL ON FUNCTION public.release_khutbah_jumat_generation_lock(
    date, uuid
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.release_khutbah_jumat_generation_lock(
    date, uuid
) TO service_role;

COMMIT;