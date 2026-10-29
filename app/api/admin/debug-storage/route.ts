import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_BUCKET } from '@/lib/supabase/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();
    const bucket = DEFAULT_BUCKET;
    const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
    const { data: rootFiles, error: rErr } = await supabase.storage.from(bucket).list('', { limit: 10 });
    const { data: galleryFiles, error: gErr } = await supabase.storage.from(bucket).list('gallery', { limit: 10 });
    const { data: canchasFiles, error: cErr } = await supabase.storage.from(bucket).list('gallery/canchas', { limit: 10 });
    const { data: parquesFiles, error: pErr } = await supabase.storage.from(bucket).list('gallery/parques', { limit: 10 });

    return NextResponse.json({
      bucket,
      buckets: buckets?.map((b) => b.name) || bErr?.message,
      rootFiles: rootFiles?.map((f) => f.name) || rErr?.message,
      galleryFiles: galleryFiles?.map((f) => f.name) || gErr?.message,
      canchasCount: canchasFiles?.length ?? cErr?.message,
      parquesCount: parquesFiles?.length ?? pErr?.message,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
