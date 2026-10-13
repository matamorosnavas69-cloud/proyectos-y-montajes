import { NextRequest, NextResponse } from 'next/server';
import { listLibraryAssets, listServiceAssets, ServiceSlug } from '@/lib/media-library';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const serviceParam = request.nextUrl.searchParams.get('service');
    if (serviceParam && ['canchas', 'parques', 'paisajismo'].includes(serviceParam)) {
      const data = await listServiceAssets(serviceParam as ServiceSlug);
      return NextResponse.json(data);
    }

    const category = request.nextUrl.searchParams.get('category') || undefined;
    const categories = await listLibraryAssets(category);
    return NextResponse.json({ categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No fue posible consultar la biblioteca visual.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
