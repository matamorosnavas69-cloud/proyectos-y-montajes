import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 1 minute cache

export interface PublicBeforeAfterProject {
  id: string;
  title: string;
  location: string;
  category: string;
  categoryColor: string;
  beforeImage: string;
  afterImage: string;
  stats: { label: string; value: string }[];
}

// Fallback baseline projects if database is empty
export const FALLBACK_BEFORE_AFTER_PROJECTS: PublicBeforeAfterProject[] = [
  {
    id: 'padel-indoor-01',
    title: 'Pistas de Pádel Panorámicas de Competición',
    location: 'Bucaramanga, Santander',
    category: 'Pádel',
    categoryColor: 'bg-emerald-600',
    beforeImage: '/images/padel/IMG_3348.PNG',
    afterImage: '/images/padel/IMG_3346.PNG',
    stats: [
      { label: 'Área', value: '400 m²' },
      { label: 'Duración', value: '35 días' },
    ],
  },
  {
    id: 'cancha-futbol-01',
    title: 'Campo Sintético de Fútbol 7',
    location: 'Floridablanca, Santander',
    category: 'Fútbol',
    categoryColor: 'bg-green-600',
    beforeImage: '/images/futbol/IMG_7552.JPG',
    afterImage: '/images/futbol/806ebee3-c75b-4dcf-8e3b-eae1d864d211.jpg',
    stats: [
      { label: 'Área', value: '850 m²' },
      { label: 'Duración', value: '45 días' },
    ],
  },
  {
    id: 'terraza-residencial-01',
    title: 'Transformación de Terraza & Jardín Residencial',
    location: 'Ruitoque Condominio, Santander',
    category: 'Paisajismo',
    categoryColor: 'bg-amber-600',
    beforeImage: '/images/drive%20organice/residencial/IMG_1271.PNG',
    afterImage: '/images/drive%20organice/piscina/IMG_8075.JPG',
    stats: [
      { label: 'Área', value: '180 m²' },
      { label: 'Duración', value: '12 días' },
    ],
  },
];

export async function GET() {
  try {
    const dbProjects = await prisma.beforeAfterProject.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    if (dbProjects && dbProjects.length > 0) {
      const formatted: PublicBeforeAfterProject[] = dbProjects.map((p) => {
        const stats: { label: string; value: string }[] = [];
        if (p.area) stats.push({ label: 'Área', value: p.area });
        if (p.duration) stats.push({ label: 'Duración', value: p.duration });

        return {
          id: p.id,
          title: p.title,
          location: p.location,
          category: p.category,
          categoryColor: p.categoryColor || 'bg-brand-green',
          beforeImage: p.beforeImage,
          afterImage: p.afterImage,
          stats: stats.length > 0 ? stats : [{ label: 'Estado', value: 'Entregado' }],
        };
      });

      return NextResponse.json({ projects: formatted, source: 'DATABASE' });
    }

    return NextResponse.json({
      projects: FALLBACK_BEFORE_AFTER_PROJECTS,
      source: 'FALLBACK',
    });
  } catch (error) {
    console.error('[API BeforeAfter] Error querying database:', error);
    return NextResponse.json({
      projects: FALLBACK_BEFORE_AFTER_PROJECTS,
      source: 'FALLBACK_ON_ERROR',
    });
  }
}
