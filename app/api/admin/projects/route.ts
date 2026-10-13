import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AuthError } from '@/lib/auth/rbac';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (category && category !== 'ALL') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { client: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, projects });
  } catch (error: unknown) {
    console.error('[API /api/admin/projects GET Error]', error);
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Guard with RBAC
    const authUser = await requireAdmin();

    // 2. Parse payload
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

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'El título del proyecto es obligatorio.' },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'La categoría del proyecto es obligatoria.' },
        { status: 400 }
      );
    }

    // 3. Compute unique slug
    let baseSlug = slugify(title);
    if (!baseSlug) baseSlug = `proyecto-${Date.now()}`;
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await prisma.project.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 4. Create in DB
    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        slug: uniqueSlug,
        category: category.trim(),
        client: client && typeof client === 'string' ? client.trim() : null,
        mainImage: typeof mainImage === 'string' ? mainImage : null,
        gallery: Array.isArray(gallery) ? gallery : [],
        sqMeters: sqMeters ? Number(sqMeters) : null,
        duration: duration && typeof duration === 'string' ? duration.trim() : null,
        description: description && typeof description === 'string' ? description.trim() : null,
        testimonialQuote: testimonialQuote && typeof testimonialQuote === 'string' ? testimonialQuote.trim() : null,
        testimonialAuthor: testimonialAuthor && typeof testimonialAuthor === 'string' ? testimonialAuthor.trim() : null,
        testimonialRole: testimonialRole && typeof testimonialRole === 'string' ? testimonialRole.trim() : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Proyecto creado exitosamente.',
      project,
      createdBy: authUser.email || authUser.userId,
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('[API /api/admin/projects POST Error]', error);
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al guardar el proyecto';
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
