import { NextRequest, NextResponse } from 'next/server';
import { AuthError, requireAdmin } from '@/lib/auth/rbac';
import { addLibraryAsset, archiveLibraryAsset, listLibraryAssets, renameLibraryAsset } from '@/lib/media-library';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(error: unknown) {
  const authError = error as AuthError;
  const message = error instanceof Error ? error.message : 'No fue posible procesar la biblioteca visual.';
  return NextResponse.json({ error: message }, { status: authError.status || 400 });
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const category = request.nextUrl.searchParams.get('category') || undefined;
    return NextResponse.json({ categories: await listLibraryAssets(category) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const category = formData.get('category');
    const file = formData.get('file');
    const displayName = formData.get('displayName');
    if (typeof category !== 'string' || !(file instanceof File)) {
      return NextResponse.json({ error: 'Categoría y archivo de imagen son obligatorios.' }, { status: 400 });
    }
    const asset = await addLibraryAsset(category, file, typeof displayName === 'string' ? displayName : undefined);
    return NextResponse.json({ success: true, asset }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    if (typeof body.category !== 'string' || typeof body.filename !== 'string' || typeof body.newName !== 'string') {
      return NextResponse.json({ error: 'Categoría, archivo y nuevo nombre son obligatorios.' }, { status: 400 });
    }
    const asset = await renameLibraryAsset(body.category, body.filename, body.newName);
    return NextResponse.json({ success: true, asset });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    if (typeof body.category !== 'string' || typeof body.filename !== 'string') {
      return NextResponse.json({ error: 'Categoría y archivo son obligatorios.' }, { status: 400 });
    }
    await archiveLibraryAsset(body.category, body.filename);
    return NextResponse.json({ success: true, message: 'La imagen fue retirada y archivada de forma recuperable.' });
  } catch (error) {
    return errorResponse(error);
  }
}
