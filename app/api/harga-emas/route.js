import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const revalidate = 60;

export async function GET() {
  try {
    const response = await fetch(
      'https://goldprice.corgano.com/api/v1/latest?currency=IDR',
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Penyedia harga emas tidak dapat diakses.' },
        { status: 502, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const json = await response.json();
    const pricePerGram = Number(json?.data?.currencies?.IDR?.per_gram);
    const asOf = json?.data?.as_of;

    if (!Number.isFinite(pricePerGram) || pricePerGram <= 0 || !asOf) {
      return NextResponse.json(
        { error: 'Data harga emas dari penyedia tidak valid.' },
        { status: 502, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.json(
      {
        pricePerGram,
        asOf,
        source: 'Gold price data by Corgano',
        sourceUrl: 'https://goldprice.corgano.com/',
        note: 'Harga spot indikatif sebelum pajak, biaya, dan premi penjual.',
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: 'Gagal mengambil harga emas dari penyedia.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}