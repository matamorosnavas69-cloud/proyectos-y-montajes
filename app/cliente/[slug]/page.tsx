import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  HardHat,
  Calendar,
  MapPin,
  Clock,
  FileText,
  Download,
  ArrowLeft,
  Layers,
  Camera,
} from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    select: { title: true, client: true },
  });

  if (!project) return { title: 'Obra no encontrada | Portal del Cliente' };

  return {
    title: `Avance de Obra: ${project.title} | Portal del Cliente`,
    description: `Seguimiento técnico, cronograma de hitos y galería de avance de obra para ${project.client || 'Cliente'}.`,
  };
}

export default async function ClientProjectTrackerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await prisma.project.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    include: {
      technicalSheet: {
        include: {
          milestones: { orderBy: { order: 'asc' } },
          revisions: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      },
      images: {
        where: { clientVisible: true },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!project) {
    notFound();
  }

  // Calculate Progress Percentage
  const milestones = project.technicalSheet?.milestones || [];
  let progressPercentage = 0;

  if (milestones.length > 0) {
    const completedCount = milestones.filter((m) => m.status === 'COMPLETADO').length;
    progressPercentage = Math.round((completedCount / milestones.length) * 100);
  } else {
    const statusWeights: Record<string, number> = {
      PLANNING: 20,
      IN_EXECUTION: 55,
      QUALITY_CONTROL: 85,
      DELIVERED: 100,
      WARRANTY: 100,
      CLOSED: 100,
    };
    progressPercentage = statusWeights[project.businessStatus] || (project.status === 'COMPLETED' ? 100 : 35);
  }

  // Group images by stage
  const images = project.images;
  const stages = [
    { key: 'FINAL', label: 'Resultado Final' },
    { key: 'INSTALLATION', label: 'Instalación' },
    { key: 'PREPARATION', label: 'Preparación de Terreno' },
    { key: 'BEFORE', label: 'Estado Inicial (Antes)' },
    { key: 'PROGRESS', label: 'Avance General' },
  ];

  return (
    <div className="min-h-screen bg-[#0a110d] text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="p-4 md:px-8 bg-[#131d16] border-b border-white/10 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/cliente"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Búsqueda</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              En Vivo • Portal del Cliente
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10 w-full space-y-10 flex-1">
        {/* Project Header Card */}
        <div className="bg-[#131d16] border border-brand-green/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="text-[11px] font-black uppercase px-3 py-1 rounded-md bg-brand-green text-white shadow">
                {project.category}
              </span>
              <span className="text-xs text-gray-400 font-semibold">
                Obra: <strong className="text-white">{project.client || 'Cliente Privado'}</strong>
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-3">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
              {(project.city || project.location) && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-gold" />
                  <span>{project.city || project.location}</span>
                </div>
              )}
              {project.sqMeters && (
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>{project.sqMeters.toLocaleString()} m²</span>
                </div>
              )}
              {project.duration && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Plazo estimado: {project.duration}</span>
                </div>
              )}
            </div>

            {/* Progress Bar Component */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-gray-300 flex items-center gap-1.5">
                  <HardHat className="w-4 h-4 text-amber-400" />
                  <span>Avance Físico de Ejecución</span>
                </span>
                <span className="text-base font-black text-brand-gold">{progressPercentage}%</span>
              </div>

              <div className="w-full h-3.5 bg-brand-dark/80 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-brand-green via-emerald-400 to-brand-gold rounded-full transition-all duration-1000 shadow-md"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 text-[11px] text-gray-400 text-center">
                <div className={`p-2 rounded-xl border ${progressPercentage >= 25 ? 'border-brand-green/40 bg-brand-green/10 text-emerald-300 font-bold' : 'border-white/5 bg-white/5'}`}>
                  1. Diseño & Subbase
                </div>
                <div className={`p-2 rounded-xl border ${progressPercentage >= 50 ? 'border-brand-green/40 bg-brand-green/10 text-emerald-300 font-bold' : 'border-white/5 bg-white/5'}`}>
                  2. Montaje Estructural
                </div>
                <div className={`p-2 rounded-xl border ${progressPercentage >= 80 ? 'border-brand-green/40 bg-brand-green/10 text-emerald-300 font-bold' : 'border-white/5 bg-white/5'}`}>
                  3. Acabados & Iluminación
                </div>
                <div className={`p-2 rounded-xl border ${progressPercentage === 100 ? 'border-brand-green/40 bg-brand-green/10 text-emerald-300 font-bold' : 'border-white/5 bg-white/5'}`}>
                  4. Entrega Oficial
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Timeline Section */}
        {milestones.length > 0 && (
          <div className="bg-[#131d16] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-gold" />
                  Cronograma & Hitos de Ejecución
                </h2>
                <p className="text-xs text-gray-400">Puntos de control verificados por el equipo técnico de P&M.</p>
              </div>
              <span className="text-xs font-bold text-gray-400">
                {milestones.filter((m) => m.status === 'COMPLETADO').length} de {milestones.length} completados
              </span>
            </div>

            <div className="space-y-3">
              {milestones.map((m, idx) => {
                const isCompleted = m.status === 'COMPLETADO';
                const isInProgress = m.status === 'EN_PROGRESO';

                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                        : isInProgress
                        ? 'bg-amber-500/10 border-amber-500/30 text-white'
                        : 'bg-brand-dark/50 border-white/5 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                        isCompleted ? 'bg-emerald-500 text-brand-dark' : isInProgress ? 'bg-amber-400 text-brand-dark animate-pulse' : 'bg-white/10 text-gray-400'
                      }`}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <div>
                        <div className="text-xs md:text-sm font-bold text-white">{m.name}</div>
                        {m.description && <p className="text-[11px] text-gray-400">{m.description}</p>}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        isCompleted ? 'bg-emerald-500/20 text-emerald-300' : isInProgress ? 'bg-amber-400/20 text-amber-300' : 'bg-white/10 text-gray-400'
                      }`}>
                        {isCompleted ? 'Completado' : isInProgress ? 'En Proceso' : 'Pendiente'}
                      </span>
                      {m.plannedDate && (
                        <div className="text-[10px] text-gray-500 mt-1">
                          {new Date(m.plannedDate).toLocaleDateString('es-CO')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Visual Gallery by Stage */}
        <div className="bg-[#131d16] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-brand-gold" />
                Evidencia Fotográfica de Obra
              </h2>
              <p className="text-xs text-gray-400">Registro visual del proceso constructivo y acabados.</p>
            </div>
            <span className="text-xs text-gray-400 font-bold">{images.length} fotos</span>
          </div>

          {images.length === 0 ? (
            <div className="p-10 text-center text-gray-500 text-xs bg-brand-dark/40 rounded-2xl border border-white/5">
              El equipo de supervisión subirá fotografías en la próxima inspección técnica.
            </div>
          ) : (
            <div className="space-y-8">
              {stages.map((stage) => {
                const stageImgs = images.filter((img) => (img.stage || 'FINAL') === stage.key);
                if (stageImgs.length === 0) return null;

                return (
                  <div key={stage.key} className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-brand-gold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-gold" />
                      {stage.label} ({stageImgs.length})
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {stageImgs.map((img) => (
                        <div key={img.id} className="group relative rounded-2xl overflow-hidden bg-gray-900 border border-white/10 h-64 shadow-md">
                          <img
                            src={img.url}
                            alt={img.alt || project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {img.caption && (
                            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-[11px] text-white">
                              {img.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Document Vault Section */}
        <div className="bg-[#131d16] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Bóveda Documental Oficial
          </h2>
          <p className="text-xs text-gray-400">Descargue los documentos técnicos y contractuales avalados por Proyectos & Montajes.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-brand-dark/60 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Ficha Técnica de Ingeniería (PDF)</div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  Revisión {project.technicalSheet?.revision || 'R01'} • Especificaciones certificadas
                </div>
              </div>
              <a
                href={`/api/admin/projects/${project.id}/pdf`}
                target="_blank"
                className="px-3.5 py-2 rounded-xl bg-brand-green/30 hover:bg-brand-green/50 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-brand-gold" />
                <span>Descargar</span>
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-brand-dark/60 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Certificado de Garantía P&M</div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  Cobertura por defectos de instalación y materiales
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-brand-gold/15 text-brand-gold rounded-lg border border-brand-gold/30">
                Garantía Activa
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-gray-500 border-t border-white/5">
        <div>PROYECTOS & MONTAJES S.A.S. • Bucaramanga, Santander, Colombia • Soporte: contacto@proyectosymontajes.com</div>
      </footer>
    </div>
  );
}
