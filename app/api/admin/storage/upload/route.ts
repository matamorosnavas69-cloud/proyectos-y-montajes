import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AuthError } from '@/lib/auth/rbac';
import { createClient } from '@/lib/supabase/client';
import { sanitizeFileName, DEFAULT_BUCKET } from '@/lib/supabase/storage';
import { checkRateLimit } from '@/lib/security/rateLimit';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const authState = await requireAdmin();

    // Rate Limiting Protection (Max 30 uploads per minute per admin)
    const rate = checkRateLimit({
      windowMs: 60000,
      max: 30,
      identifier: authState.userId || 'admin',
      action: 'storage_upload',
    });

    if (!rate.success) {
      return NextResponse.json(
        {
          error: 'Demasiadas solicitudes',
          message: `Límite de subida de archivos superado. Espere ${Math.ceil(rate.resetMs / 1000)} segundos.`,
        },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string | null;
    const isCover = formData.get('isCover') === 'true';
    const caption = formData.get('caption') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Bad Request', message: 'No se envió ningún archivo' }, { status: 400 });
    }

    if (!projectId || typeof projectId !== 'string') {
      return NextResponse.json({ error: 'Bad Request', message: 'ID del proyecto obligatorio' }, { status: 400 });
    }

    // 1. Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: 'Not Found', message: 'Proyecto no encontrado en la base de datos' }, { status: 404 });
    }

    // 2. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Formato no permitido',
          message: `El tipo MIME "${file.type}" no está permitido. Formatos aceptados: JPEG, PNG, WebP, AVIF.`,
        },
        { status: 415 }
      );
    }

    // 3. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'Archivo demasiado grande',
          message: `El tamaño del archivo (${(file.size / 1024 / 1024).toFixed(1)} MB) supera el límite permitido de 10 MB.`,
        },
        { status: 413 }
      );
    }

    // 4. Build secure structured path
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'webp';
    const cleanBase = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ''));
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const folderType = isCover ? 'cover' : 'gallery';
    const storagePath = `projects/${projectId}/${folderType}/${cleanBase}-${uniqueId}.${fileExt}`;

    // 5. Upload via Supabase client
    const supabase = createClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(DEFAULT_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: '31536000', // 1 year CDN cache
        upsert: false,
      });

    if (uploadError) {
      console.error('[Storage API Upload Error]:', uploadError);
      return NextResponse.json(
        { error: 'Error de almacenamiento', message: uploadError.message },
        { status: 502 }
      );
    }

    const { data: publicData } = supabase.storage
      .from(DEFAULT_BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = publicData.publicUrl;

    // 6. Atomically persist image record and enforce cover invariant
    const result = await prisma.$transaction(async (tx) => {
      if (isCover) {
        // Demote previous covers
        await tx.projectImage.updateMany({
          where: { projectId, isCover: true },
          data: { isCover: false },
        });

        // Set mainImage on project
        await tx.project.update({
          where: { id: projectId },
          data: {
            mainImage: publicUrl,
            version: { increment: 1 },
          },
        });
      } else {
        // Add to gallery array if not already present
        const currentGallery = project.gallery || [];
        if (!currentGallery.includes(publicUrl)) {
          await tx.project.update({
            where: { id: projectId },
            data: {
              gallery: [...currentGallery, publicUrl],
              version: { increment: 1 },
            },
          });
        }
      }

      const newImage = await tx.projectImage.create({
        data: {
          projectId,
          url: publicUrl,
          alt: project.title,
          caption: caption || null,
          isCover,
          order: isCover ? 0 : (project.gallery?.length || 0) + 1,
        },
      });

      return newImage;
    });

    console.info(`[Audit Storage] Image uploaded for project "${project.title}" by ${authState.email || authState.userId}: ${storagePath}`);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: storagePath,
      isCover,
      image: result,
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('[API /api/admin/storage/upload Error]:', error);
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al procesar subida de archivo';
    return NextResponse.json({ error: message }, { status });
  }
}
