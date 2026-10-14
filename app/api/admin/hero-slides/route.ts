import { NextRequest, NextResponse } from 'next/server';
import { AuthError, requireAdmin } from '@/lib/auth/rbac';
import {
  getAdminHeroSlides,
  saveAdminHeroSlides,
  ServiceKey,
} from '@/lib/hero-management';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_SERVICES = new Set<string>(['canchas', 'parques', 'paisajismo']);

function errorResponse(error: unknown) {
  const authError = error as AuthError;
  const message = error instanceof Error ? error.message : 'No fue posible procesar la configuración del Hero.';
  return NextResponse.json({ error: message }, { status: authError.status || 400 });
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const serviceParam = request.nextUrl.searchParams.get('service') || 'canchas';
    if (!VALID_SERVICES.has(serviceParam)) {
      return NextResponse.json({ error: 'Servicio no válido.' }, { status: 400 });
    }

    const slides = await getAdminHeroSlides(serviceParam as ServiceKey);
    return NextResponse.json({ success: true, service: serviceParam, slides });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await request.json();
    const { service, slides } = body;

    if (!VALID_SERVICES.has(service)) {
      return NextResponse.json({ error: 'Servicio no válido.' }, { status: 400 });
    }

    if (!Array.isArray(slides)) {
      return NextResponse.json({ error: 'El listado de diapositivas es requerido.' }, { status: 400 });
    }

    const updatedSlides = await saveAdminHeroSlides(
      service as ServiceKey,
      slides,
      user.email || undefined
    );

    return NextResponse.json({
      success: true,
      message: 'Configuración del Hero publicada exitosamente.',
      slides: updatedSlides,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
