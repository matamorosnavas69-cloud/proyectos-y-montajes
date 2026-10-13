import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AuthError } from '@/lib/auth/rbac';
import { validateProjectPublishable } from '@/lib/validations/publish';

async function handlePublishToggle(
  req: NextRequest,
  params: Promise<{ id: string }>
) {
  try {
    const authState = await requireAdmin();
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const targetPublished = body.published;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        images: true,
        technicalSheet: {
          include: {
            materials: true,
            milestones: true,
            qualityChecks: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    const nextPublished = typeof targetPublished === 'boolean' ? targetPublished : !project.published;

    // State Machine Transition Validation
    if (nextPublished) {
      const validation = validateProjectPublishable(project);

      if (!validation.canPublish) {
        return NextResponse.json(
          {
            error: 'Publicación rechazada por validación de calidad',
            message: 'El proyecto no cumple con los requisitos indispensables para ser publicado en el portafolio público.',
            missingFields: validation.missingFields,
            reasons: validation.reasons,
          },
          { status: 422 }
        );
      }
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        published: nextPublished,
        version: { increment: 1 },
      },
    });

    console.info(`[Audit RBAC] Project "${project.title}" (${project.id}) publish status changed to ${nextPublished} by ${authState.email || authState.userId}`);

    return NextResponse.json({
      success: true,
      published: updated.published,
      message: updated.published
        ? 'Proyecto validado y publicado exitosamente en el portafolio.'
        : 'Proyecto despublicado (estado privado).',
      project: updated,
    });
  } catch (error: unknown) {
    console.error('[API /api/admin/projects/[id]/publish Error]:', error);
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al cambiar estado de publicación';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handlePublishToggle(req, params);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handlePublishToggle(req, params);
}
