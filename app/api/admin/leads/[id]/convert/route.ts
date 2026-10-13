import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AuthError } from '@/lib/auth/rbac';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authState = await requireAdmin();
    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { projects: true },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Not Found', message: 'Prospecto no encontrado' }, { status: 404 });
    }

    if (lead.projects.length > 0) {
      return NextResponse.json(
        {
          error: 'Conflict',
          message: `Este prospecto ya fue convertido en el proyecto "${lead.projects[0].title}".`,
          project: lead.projects[0],
        },
        { status: 409 }
      );
    }

    // Generate unique slug
    const baseSlug = slugify(lead.company ? `${lead.company}-${lead.projectType}` : `${lead.name}-${lead.projectType}`);
    let uniqueSlug = baseSlug || `obra-${Date.now()}`;
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create project
      const project = await tx.project.create({
        data: {
          title: lead.company ? `${lead.projectType} - ${lead.company}` : `${lead.projectType} - ${lead.name}`,
          slug: uniqueSlug,
          category: lead.projectType,
          client: lead.company || lead.name,
          location: lead.location,
          city: lead.city,
          budget: lead.quotedAmount || lead.estimatedBudget || null,
          businessStatus: 'APPROVED',
          status: 'PLANNING',
          published: false,
          leadId: lead.id,
          description: lead.notes || `Proyecto originado desde prospecto comercial (${lead.source}).`,
        },
      });

      // 2. Initialize technical sheet
      await tx.technicalSheet.create({
        data: {
          projectId: project.id,
          revision: 'R01',
          currentRevision: 'R01',
          sheetStatus: 'DRAFT',
          specifications: {},
          deliveryStatus: 'PENDIENTE',
          generatedBy: authState.email || authState.userId,
          version: 1,
        },
      });

      // 3. Mark lead as GANADO and record conversion activity
      await tx.lead.update({
        where: { id: lead.id },
        data: {
          status: 'GANADO',
        },
      });

      await tx.leadActivity.create({
        data: {
          leadId: lead.id,
          type: 'STATUS_CHANGE',
          description: `Prospecto ganado y convertido exitosamente en Obra Oficial "${project.title}" por ${authState.email || authState.userId}`,
          author: authState.email || authState.userId,
        },
      });

      return project;
    });

    console.info(`[Audit CRM] Lead "${lead.name}" (${lead.id}) converted to project "${result.title}" (${result.id})`);

    return NextResponse.json(
      {
        success: true,
        message: `Prospecto convertido exitosamente en el proyecto "${result.title}".`,
        project: result,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al convertir prospecto';
    return NextResponse.json({ error: message }, { status });
  }
}
