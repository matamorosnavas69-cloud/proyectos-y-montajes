import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/rbac';
import { generateTechnicalSheetHTML } from '@/lib/pdf/technical-sheet-template';
import { ArrowLeft, Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TechnicalSheetPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      technicalSheet: {
        include: {
          materials: { orderBy: { order: 'asc' } },
          milestones: { orderBy: { order: 'asc' } },
          qualityChecks: { orderBy: { order: 'asc' } },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const sheet = project.technicalSheet || {
    revision: 'R01',
    specifications: null,
    observations: null,
    pendingItems: null,
    deliveryDate: null,
    deliveryNotes: null,
    deliveryClient: null,
    deliveryDirector: null,
    deliveryInspector: null,
    deliveryStatus: 'PENDIENTE',
    materials: [],
    milestones: [],
    qualityChecks: [],
  };

  const printData = {
    project: {
      title: project.title,
      slug: project.slug,
      category: project.category,
      client: project.client,
      location: project.location,
      city: project.city,
      sqMeters: project.sqMeters,
      duration: project.duration,
      status: project.status,
      director: project.director,
      commercialRep: project.commercialRep,
      internalCode: project.internalCode,
      startDate: project.startDate?.toISOString() || null,
      deliveryDate: project.deliveryDate?.toISOString() || null,
      description: project.description,
      mainImage: project.mainImage,
    },
    sheet: {
      revision: sheet.revision || 'R01',
      specifications: (sheet.specifications as Record<string, unknown>) || null,
      observations: sheet.observations,
      pendingItems: sheet.pendingItems,
      deliveryDate: sheet.deliveryDate?.toISOString() || null,
      deliveryNotes: sheet.deliveryNotes,
      deliveryClient: sheet.deliveryClient,
      deliveryDirector: sheet.deliveryDirector,
      deliveryInspector: sheet.deliveryInspector,
      deliveryStatus: sheet.deliveryStatus,
    },
    materials: sheet.materials || [],
    milestones: sheet.milestones || [],
    qualityChecks: sheet.qualityChecks || [],
  };

  const htmlContent = generateTechnicalSheetHTML(printData);

  return (
    <div className="min-h-screen bg-[#071A12]/95 text-white flex flex-col items-center py-6 px-4">
      {/* Top Action Toolbar */}
      <div className="w-full max-w-[210mm] mb-6 flex flex-wrap items-center justify-between gap-4 bg-[#131d16] border border-brand-green/30 p-4 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/proyectos/${project.id}/ficha-tecnica`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Editor
          </Link>
          <span className="h-4 w-[1px] bg-brand-green/30" />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Revisión:</span>
            <span className="font-mono font-bold text-brand-gold">{sheet.revision || 'R01'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/api/admin/projects/${project.id}/pdf`}
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gold hover:bg-yellow-400 text-brand-dark font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-gold/10 transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" />
            Descargar PDF Oficial
          </a>
        </div>
      </div>

      {/* A4 Paper Container Preview */}
      <div className="w-full max-w-[210mm] bg-white text-black shadow-2xl rounded-sm overflow-hidden border border-gray-300">
        <iframe
          srcDoc={htmlContent}
          title="Previsualización Ficha Técnica"
          className="w-full min-h-[297mm] border-none"
          style={{ height: '1120px' }}
        />
      </div>
    </div>
  );
}
