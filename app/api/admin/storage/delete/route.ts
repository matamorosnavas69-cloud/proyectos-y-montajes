import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AuthError } from '@/lib/auth/rbac';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_BUCKET } from '@/lib/supabase/storage';

export async function POST(req: NextRequest) {
  try {
    const authState = await requireAdmin();
    const body = await req.json();
    const { url, projectId, imageId } = body;

    if (!projectId || (!url && !imageId)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'projectId y url o imageId requeridos' },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { images: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Not Found', message: 'Proyecto no encontrado' }, { status: 404 });
    }

    // Identify image record
    const targetImg = project.images.find(
      (img) => (imageId && img.id === imageId) || (url && img.url === url)
    );

    const targetUrl = targetImg?.url || url;

    // Delete from Supabase Storage
    const supabase = createClient();
    try {
      // Extract path from public URL if possible
      const bucketMarker = `/${DEFAULT_BUCKET}/`;
      if (targetUrl.includes(bucketMarker)) {
        const relativePath = targetUrl.split(bucketMarker)[1];
        if (relativePath) {
          await supabase.storage.from(DEFAULT_BUCKET).remove([decodeURIComponent(relativePath)]);
        }
      }
    } catch (storageErr) {
      console.warn('[Storage Delete Warning]:', storageErr);
    }

    // Update database inside transaction
    await prisma.$transaction(async (tx) => {
      if (targetImg?.id) {
        await tx.projectImage.delete({ where: { id: targetImg.id } });
      }

      const remainingGallery = (project.gallery || []).filter((u) => u !== targetUrl);
      const isDeletingCover = project.mainImage === targetUrl || targetImg?.isCover;

      await tx.project.update({
        where: { id: projectId },
        data: {
          gallery: remainingGallery,
          mainImage: isDeletingCover ? (remainingGallery[0] || null) : project.mainImage,
          version: { increment: 1 },
        },
      });
    });

    console.info(`[Audit Storage] Image deleted from project "${project.title}" by ${authState.email || authState.userId}`);

    return NextResponse.json({
      success: true,
      message: 'Imagen eliminada exitosamente.',
    });
  } catch (error: unknown) {
    console.error('[API /api/admin/storage/delete Error]:', error);
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al eliminar la imagen';
    return NextResponse.json({ error: message }, { status });
  }
}
