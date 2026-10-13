import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  FileText,
  Download,
  Eye,
  ArrowRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Fichas Técnicas de Obra | Proyectos y Montajes Admin',
  description: 'Centro de ingeniería, especificaciones técnicas y generación de fichas de obra.',
};

interface TechnicalSheetProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  client?: string | null;
  location?: string | null;
  city?: string | null;
  internalCode?: string | null;
  sqMeters?: number | null;
  status: string;
  published: boolean;
  technicalSheet?: {
    revision?: string | null;
    deliveryStatus?: string | null;
    materials: Array<{ id: string }>;
    milestones: Array<{ id: string; status: string }>;
    qualityChecks: Array<{ id: string; status: string }>;
    revisions: Array<{ id: string; revisionNumber: string; createdAt: Date }>;
  } | null;
}

export default async function AdminTechnicalSheetsHubPage() {
  let projects: TechnicalSheetProject[] = [];
  try {
    projects = (await prisma.project.findMany({
      include: {
        technicalSheet: {
          include: {
            materials: true,
            milestones: true,
            qualityChecks: true,
            revisions: { orderBy: { createdAt: 'desc' }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })) as unknown as TechnicalSheetProject[];
  } catch (error) {
    console.error('Error fetching technical sheets hub:', error);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#131d16] via-[#1a2e20] to-[#131d16] border border-brand-green/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-xs font-bold uppercase tracking-wider mb-4">
            <FileText className="w-3.5 h-3.5" />
            Ingeniería & Aseguramiento de Calidad
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            Fichas Técnicas Oficiales de Obra
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Centralice la documentación técnica de cada proyecto deportivo y paisajístico. Genere documentos PDF normalizados con código interno, materiales, cronograma de hitos, matriz de calidad y actas de recepción.
          </p>
        </div>
      </div>

      {/* Grid of Technical Sheets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white">Expedientes Técnicos Registrados ({projects.length})</h2>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-[#131d16] border border-dashed border-brand-green/30 rounded-3xl p-8">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No hay fichas técnicas activas</h3>
            <p className="text-xs text-gray-400 mb-6">Cree proyectos desde el panel para parametrizar sus fichas técnicas.</p>
            <Link
              href="/admin/proyectos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-black text-xs uppercase"
            >
              Ir a Proyectos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const sheet = project.technicalSheet;
              const materialsCount = sheet?.materials?.length || 0;
              const qualityCount = sheet?.qualityChecks?.length || 0;
              const conformCount = sheet?.qualityChecks?.filter((qc) => qc.status === 'CONFORME').length || 0;

              return (
                <div
                  key={project.id}
                  className="bg-[#131d16] border border-brand-green/30 hover:border-brand-gold/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all group"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-brand-gold block">
                          {project.internalCode || 'PM-OBR-PENDIENTE'}
                        </span>
                        <h3 className="text-lg font-black text-white group-hover:text-brand-gold transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-gray-300">
                        {sheet?.revision || 'R01'}
                      </span>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <span className="px-2.5 py-1 rounded-full bg-brand-green/30 text-emerald-300 border border-brand-green/40 font-bold uppercase text-[10px]">
                        {project.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-black/40 text-gray-300 border border-white/10">
                        {project.sqMeters ? `${project.sqMeters.toLocaleString()} m²` : 'Área por definir'}
                      </span>
                    </div>

                    {/* Technical Indicators */}
                    <div className="bg-brand-dark/50 p-3.5 rounded-2xl border border-brand-green/20 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-gray-400">
                        <span>Materiales e Insumos:</span>
                        <span className="font-bold text-white">{materialsCount} registrados</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-400">
                        <span>Checklist de Calidad:</span>
                        <span className="font-bold text-emerald-400">
                          {conformCount}/{qualityCount || 8} Conformes
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-gray-400">
                        <span>Acta de Entrega:</span>
                        <span className="font-bold text-brand-gold">
                          {sheet?.deliveryStatus || 'PENDIENTE'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-6 border-t border-brand-green/20 flex items-center justify-between gap-2 mt-6">
                    <Link
                      href={`/admin/proyectos/${project.id}/ficha-tecnica`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold hover:text-yellow-300 transition-colors"
                    >
                      <span>Editar Ficha</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/proyectos/${project.id}/ficha-tecnica/preview`}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                        title="Vista Previa A4"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <a
                        href={`/api/admin/projects/${project.id}/pdf`}
                        download
                        className="p-2 rounded-xl bg-brand-gold hover:bg-yellow-400 text-brand-dark font-black transition-colors"
                        title="Descargar PDF Oficial"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
