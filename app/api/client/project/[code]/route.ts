import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Search by slug or project ID
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ slug: code }, { id: code }],
      },
      include: {
        technicalSheet: {
          include: {
            milestones: {
              orderBy: { order: 'asc' },
            },
            revisions: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
        images: {
          where: { clientVisible: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Not Found', message: 'Proyecto no encontrado' }, { status: 404 });
    }

    // Calculate progress percentage based on milestones
    const milestones = project.technicalSheet?.milestones || [];
    let progressPercentage = 0;

    if (milestones.length > 0) {
      const completedCount = milestones.filter((m) => m.status === 'COMPLETADO').length;
      progressPercentage = Math.round((completedCount / milestones.length) * 100);
    } else {
      // Fallback based on businessStatus
      const statusWeights: Record<string, number> = {
        PLANNING: 15,
        IN_EXECUTION: 50,
        QUALITY_CONTROL: 85,
        DELIVERED: 100,
        WARRANTY: 100,
        CLOSED: 100,
      };
      progressPercentage = statusWeights[project.businessStatus] || (project.status === 'COMPLETED' ? 100 : 35);
    }

    // Group images by stage
    const imagesByStage: Record<string, Array<{ id: string; url: string; caption?: string | null; stage: string }>> = {
      BEFORE: [],
      PREPARATION: [],
      INSTALLATION: [],
      PROGRESS: [],
      QUALITY: [],
      FINAL: [],
    };

    project.images.forEach((img) => {
      const st = img.stage || 'FINAL';
      if (!imagesByStage[st]) imagesByStage[st] = [];
      imagesByStage[st].push({
        id: img.id,
        url: img.url,
        caption: img.caption,
        stage: st,
      });
    });

    const clientDTO = {
      id: project.id,
      title: project.title,
      slug: project.slug,
      category: project.category,
      client: project.client,
      location: project.location,
      city: project.city,
      mainImage: project.mainImage,
      businessStatus: project.businessStatus,
      progressPercentage,
      sqMeters: project.sqMeters,
      duration: project.duration,
      startDate: project.startDate,
      deliveryDate: project.deliveryDate,
      hasOfficialSheet: Boolean(project.technicalSheet?.sheetStatus === 'ISSUED'),
      sheetRevision: project.technicalSheet?.revision || 'R01',
      milestones: milestones.map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        status: m.status,
        plannedDate: m.plannedDate,
        actualDate: m.actualDate,
        responsible: m.responsible,
      })),
      imagesByStage,
      totalPhotos: project.images.length,
    };

    return NextResponse.json({ success: true, project: clientDTO });
  } catch (error: unknown) {
    console.error('[Client API Project Error]:', error);
    return NextResponse.json(
      { error: 'Error al consultar información del proyecto' },
      { status: 500 }
    );
  }
}
