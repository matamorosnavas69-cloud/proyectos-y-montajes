import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadProjectImage } from '@/lib/supabase/storage';
import { AuthError, requireAdmin } from '@/lib/auth/rbac';
import { FALLBACK_BEFORE_AFTER_PROJECTS } from '@/app/api/before-after/route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(error: unknown) {
  const authError = error as AuthError;
  const message = error instanceof Error ? error.message : 'Error procesando solicitud de Antes y Después.';
  return NextResponse.json({ error: message }, { status: authError.status || 400 });
}

// GET: List all Before & After projects for CMS
export async function GET() {
  try {
    await requireAdmin();
    let projects: unknown[] = [];
    try {
      projects = await prisma.beforeAfterProject.findMany({
        orderBy: { sortOrder: 'asc' },
      });
    } catch (dbErr) {
      console.warn('[BeforeAfter] Database unavailable, falling back to static projects:', dbErr);
      projects = FALLBACK_BEFORE_AFTER_PROJECTS.map((p, idx) => ({
        id: p.id,
        title: p.title,
        location: p.location,
        category: p.category,
        categoryColor: p.categoryColor,
        beforeImage: p.beforeImage,
        afterImage: p.afterImage,
        area: p.stats[0]?.value || '850 m²',
        duration: p.stats[1]?.value || '45 días',
        sortOrder: idx,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }
    return NextResponse.json({ projects });
  } catch (error) {
    return errorResponse(error);
  }
}

// POST: Create or upload new Before & After project
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const contentType = request.headers.get('content-type') || '';

    let title = '';
    let location = '';
    let category = 'Canchas';
    let categoryColor = 'bg-brand-green';
    let beforeImage = '';
    let afterImage = '';
    let area = '';
    let duration = '';
    let sortOrder = 0;
    let isActive = true;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = (formData.get('title') as string) || '';
      location = (formData.get('location') as string) || '';
      category = (formData.get('category') as string) || 'Canchas';
      categoryColor = (formData.get('categoryColor') as string) || 'bg-brand-green';
      area = (formData.get('area') as string) || '';
      duration = (formData.get('duration') as string) || '';
      sortOrder = parseInt((formData.get('sortOrder') as string) || '0', 10);
      isActive = formData.get('isActive') !== 'false';

      // Check for file uploads or URL strings
      const beforeFile = formData.get('beforeFile');
      const afterFile = formData.get('afterFile');
      const beforeUrl = formData.get('beforeImage') as string;
      const afterUrl = formData.get('afterImage') as string;

      if (beforeFile instanceof File && beforeFile.size > 0) {
        const uploaded = await uploadProjectImage(beforeFile, 'before-after');
        beforeImage = uploaded.url;
      } else if (beforeUrl) {
        beforeImage = beforeUrl;
      }

      if (afterFile instanceof File && afterFile.size > 0) {
        const uploaded = await uploadProjectImage(afterFile, 'before-after');
        afterImage = uploaded.url;
      } else if (afterUrl) {
        afterImage = afterUrl;
      }
    } else {
      const body = await request.json();
      title = body.title || '';
      location = body.location || '';
      category = body.category || 'Canchas';
      categoryColor = body.categoryColor || 'bg-brand-green';
      beforeImage = body.beforeImage || '';
      afterImage = body.afterImage || '';
      area = body.area || '';
      duration = body.duration || '';
      sortOrder = typeof body.sortOrder === 'number' ? body.sortOrder : 0;
      isActive = body.isActive !== false;
    }

    if (!title.trim() || !beforeImage.trim() || !afterImage.trim()) {
      return NextResponse.json(
        { error: 'Título, imagen de Antes e imagen de Después son campos obligatorios.' },
        { status: 400 }
      );
    }

    // Assign sortOrder if not provided
    if (sortOrder === 0) {
      const count = await prisma.beforeAfterProject.count();
      sortOrder = count;
    }

    const created = await prisma.beforeAfterProject.create({
      data: {
        title: title.trim(),
        location: location.trim() || 'Colombia',
        category: category.trim(),
        categoryColor: categoryColor.trim(),
        beforeImage: beforeImage.trim(),
        afterImage: afterImage.trim(),
        area: area.trim() || null,
        duration: duration.trim() || null,
        sortOrder,
        isActive,
      },
    });

    return NextResponse.json({ success: true, project: created }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

// PUT: Update an existing Before & After project or reorder
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const id = formData.get('id') as string;
      if (!id) {
        return NextResponse.json({ error: 'ID es obligatorio para actualizar.' }, { status: 400 });
      }

      const title = formData.get('title') as string | null;
      const location = formData.get('location') as string | null;
      const category = formData.get('category') as string | null;
      const categoryColor = formData.get('categoryColor') as string | null;
      const area = formData.get('area') as string | null;
      const duration = formData.get('duration') as string | null;
      const sortOrderRaw = formData.get('sortOrder') as string | null;
      const isActiveRaw = formData.get('isActive') as string | null;

      const updateData: Record<string, unknown> = {};
      if (title !== null) updateData.title = title.trim();
      if (location !== null) updateData.location = location.trim();
      if (category !== null) updateData.category = category.trim();
      if (categoryColor !== null) updateData.categoryColor = categoryColor.trim();
      if (area !== null) updateData.area = area.trim() || null;
      if (duration !== null) updateData.duration = duration.trim() || null;
      if (sortOrderRaw !== null) updateData.sortOrder = parseInt(sortOrderRaw, 10);
      if (isActiveRaw !== null) updateData.isActive = isActiveRaw !== 'false';

      const beforeFile = formData.get('beforeFile');
      if (beforeFile instanceof File && beforeFile.size > 0) {
        const uploaded = await uploadProjectImage(beforeFile, 'before-after');
        updateData.beforeImage = uploaded.url;
      } else {
        const beforeImage = formData.get('beforeImage') as string | null;
        if (beforeImage) updateData.beforeImage = beforeImage.trim();
      }

      const afterFile = formData.get('afterFile');
      if (afterFile instanceof File && afterFile.size > 0) {
        const uploaded = await uploadProjectImage(afterFile, 'before-after');
        updateData.afterImage = uploaded.url;
      } else {
        const afterImage = formData.get('afterImage') as string | null;
        if (afterImage) updateData.afterImage = afterImage.trim();
      }

      const updated = await prisma.beforeAfterProject.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({ success: true, project: updated });
    }

    const body = await request.json();

    // Check if batch reorder
    if (Array.isArray(body.reorder)) {
      const updates = body.reorder.map((item: { id: string; sortOrder: number }) =>
        prisma.beforeAfterProject.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      );
      await prisma.$transaction(updates);
      return NextResponse.json({ success: true, message: 'Orden actualizado exitosamente.' });
    }

    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID es obligatorio para actualizar.' }, { status: 400 });
    }

    const updated = await prisma.beforeAfterProject.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    return errorResponse(error);
  }
}

// DELETE: Delete a project
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID es obligatorio para eliminar.' }, { status: 400 });
    }

    await prisma.beforeAfterProject.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Proyecto eliminado exitosamente.' });
  } catch (error) {
    return errorResponse(error);
  }
}
