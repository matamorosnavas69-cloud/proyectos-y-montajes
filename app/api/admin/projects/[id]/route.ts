import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AuthError } from '@/lib/auth/rbac';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Not Found', message: 'Proyecto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error interno';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const {
      title,
      category,
      client,
      sqMeters,
      duration,
      description,
      mainImage,
      gallery,
      testimonialQuote,
      testimonialAuthor,
      testimonialRole,
    } = body;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Not Found', message: 'Proyecto no encontrado' }, { status: 404 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: title !== undefined && typeof title === 'string' ? title.trim() : existing.title,
        category: category !== undefined && typeof category === 'string' ? category.trim() : existing.category,
        client: client !== undefined ? (typeof client === 'string' && client.trim() ? client.trim() : null) : existing.client,
        mainImage: mainImage !== undefined ? (typeof mainImage === 'string' ? mainImage : null) : existing.mainImage,
        gallery: Array.isArray(gallery) ? gallery : existing.gallery,
        sqMeters: sqMeters !== undefined ? (sqMeters ? Number(sqMeters) : null) : existing.sqMeters,
        duration: duration !== undefined ? (typeof duration === 'string' && duration.trim() ? duration.trim() : null) : existing.duration,
        description: description !== undefined ? (typeof description === 'string' && description.trim() ? description.trim() : null) : existing.description,
        testimonialQuote: testimonialQuote !== undefined ? (typeof testimonialQuote === 'string' && testimonialQuote.trim() ? testimonialQuote.trim() : null) : existing.testimonialQuote,
        testimonialAuthor: testimonialAuthor !== undefined ? (typeof testimonialAuthor === 'string' && testimonialAuthor.trim() ? testimonialAuthor.trim() : null) : existing.testimonialAuthor,
        testimonialRole: testimonialRole !== undefined ? (typeof testimonialRole === 'string' && testimonialRole.trim() ? testimonialRole.trim() : null) : existing.testimonialRole,
      },
    });

    return NextResponse.json({ success: true, message: 'Proyecto actualizado con éxito.', project: updated });
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al actualizar el proyecto';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Not Found', message: 'Proyecto no encontrado' }, { status: 404 });
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Proyecto eliminado con éxito.' });
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al eliminar el proyecto';
    return NextResponse.json({ error: message }, { status });
  }
}
