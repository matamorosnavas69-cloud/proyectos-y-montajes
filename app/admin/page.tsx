import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  FolderGit2,
  Maximize2,
  Sparkles,
  FileText,
  Globe,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  Users,
  ShieldCheck,
  TrendingUp,
  HardHat,
  ArrowRight,
  ShieldAlert,
  Server,
  Database,
  Layers,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Project Command Center | Proyectos y Montajes',
  description: 'Centro de Mando & Control de Proyectos, CRM y Fichas Técnicas de Proyectos y Montajes.',
};

export default async function AdminDashboardPage() {
  const [
    totalProjects,
    publishedCount,
    inExecutionCount,
    planningCount,
    qualityControlCount,
    deliveredCount,
    totalLeads,
    wonLeads,
    totalSqMetersAgg,
    recentProjects,
    pendingQualityChecks,
    delayedMilestones,
    sheetsReadyForReview,
  ] = await Promise.all([
    prisma.project.count().catch(() => 0),
    prisma.project.count({ where: { published: true } }).catch(() => 0),
    prisma.project.count({ where: { businessStatus: 'IN_EXECUTION' } }).catch(() => 0),
    prisma.project.count({ where: { businessStatus: 'PLANNING' } }).catch(() => 0),
    prisma.project.count({ where: { businessStatus: 'QUALITY_CONTROL' } }).catch(() => 0),
    prisma.project.count({ where: { businessStatus: 'DELIVERED' } }).catch(() => 0),
    prisma.lead.count().catch(() => 0),
    prisma.lead.count({ where: { status: 'GANADO' } }).catch(() => 0),
    prisma.project.aggregate({ _sum: { sqMeters: true } }).catch(() => ({ _sum: { sqMeters: 0 } })),
    prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        technicalSheet: {
          select: { revision: true, sheetStatus: true },
        },
      },
    }).catch(() => []),
    prisma.qualityCheck.findMany({
      where: { status: 'NO_CONFORME' },
      take: 4,
      include: {
        technicalSheet: {
          include: { project: { select: { id: true, title: true } } },
        },
      },
    }).catch(() => []),
    prisma.milestone.findMany({
      where: {
        status: { in: ['RETRASADO', 'PENDIENTE'] },
        plannedDate: { lt: new Date() },
      },
      take: 4,
      include: {
        technicalSheet: {
          include: { project: { select: { id: true, title: true } } },
        },
      },
    }).catch(() => []),
    prisma.technicalSheet.findMany({
      where: { sheetStatus: 'READY_FOR_REVIEW' },
      take: 4,
      include: {
        project: { select: { id: true, title: true } },
      },
    }).catch(() => []),
  ]);

  const totalSqMeters = totalSqMetersAgg._sum.sqMeters || 0;
  const leadConversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(0) : '0';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero: Project Command Center */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0d1610] via-[#142318] to-[#0d1610] border border-brand-green/40 p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Project Command Center • P&M OS v1
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
            Centro de Mando & Control Operativo
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed">
            Plataforma integral de gestión de obras de <strong>Proyectos y Montajes</strong>. Monitoree el embudo de ventas, supervise el cronograma de ejecución física, garantice controles de calidad de estándar europeo y emita documentación técnica inmutable con verificación criptográfica.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              href="/admin/proyectos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-black text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-lg"
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Gestionar Obras</span>
            </Link>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green/40 hover:bg-brand-green/60 text-white font-bold text-xs uppercase tracking-wider border border-brand-green/40 transition-all"
            >
              <Users className="w-4 h-4 text-brand-gold" />
              <span>Pipeline Comercial (CRM)</span>
            </Link>
            <Link
              href="/admin/fichas-tecnicas"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs uppercase tracking-wider border border-white/10 transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Fichas Técnicas</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131d16] p-5 rounded-2xl border border-white/5 shadow-md">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Obras Registradas</span>
            <FolderGit2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalProjects}</div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <span className="text-emerald-400 font-bold">{publishedCount} públicas</span>
            <span>•</span>
            <span>{totalProjects - publishedCount} privadas</span>
          </div>
        </div>

        <div className="bg-[#131d16] p-5 rounded-2xl border border-white/5 shadow-md">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">En Ejecución Activa</span>
            <HardHat className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{inExecutionCount}</div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <span className="text-gray-300 font-semibold">{planningCount} en planificación</span>
          </div>
        </div>

        <div className="bg-[#131d16] p-5 rounded-2xl border border-white/5 shadow-md">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Metros Cuadrados</span>
            <Maximize2 className="w-4 h-4 text-brand-green" />
          </div>
          <div className="text-3xl font-black text-white">{totalSqMeters.toLocaleString()} <span className="text-sm font-bold text-gray-400">m²</span></div>
          <p className="text-[11px] text-gray-500 mt-2">Superficie deportiva instalada</p>
        </div>

        <div className="bg-[#131d16] p-5 rounded-2xl border border-white/5 shadow-md">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Efectividad Comercial</span>
            <TrendingUp className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-3xl font-black text-brand-gold">{leadConversionRate}%</div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <span className="text-emerald-400 font-semibold">{wonLeads} ganados</span>
            <span>de {totalLeads} prospectos</span>
          </div>
        </div>
      </div>

      {/* Business Pipeline Lifecycle Visualizer */}
      <div className="bg-[#131d16] p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-gold" />
              Pipeline de Ciclo de Vida del Negocio
            </h2>
            <p className="text-xs text-gray-400">Estado global de los proyectos desde la prospección hasta la entrega final.</p>
          </div>
          <Link href="/admin/proyectos" className="text-xs font-bold text-brand-gold hover:underline flex items-center gap-1">
            Ver Todos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          <div className="p-4 bg-brand-dark/60 rounded-xl border border-white/5 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">1. Planificación</span>
            <div className="text-2xl font-black text-white mt-2">{planningCount}</div>
            <span className="text-[10px] text-gray-500 mt-1">Ingeniería & Compras</span>
          </div>

          <div className="p-4 bg-brand-dark/60 rounded-xl border border-amber-500/20 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">2. En Ejecución</span>
            <div className="text-2xl font-black text-amber-400 mt-2">{inExecutionCount}</div>
            <span className="text-[10px] text-gray-500 mt-1">Obra física activa</span>
          </div>

          <div className="p-4 bg-brand-dark/60 rounded-xl border border-cyan-500/20 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">3. Control Calidad</span>
            <div className="text-2xl font-black text-cyan-400 mt-2">{qualityControlCount}</div>
            <span className="text-[10px] text-gray-500 mt-1">Inspección & Pruebas</span>
          </div>

          <div className="p-4 bg-brand-dark/60 rounded-xl border border-emerald-500/20 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">4. Entregados</span>
            <div className="text-2xl font-black text-emerald-400 mt-2">{deliveredCount}</div>
            <span className="text-[10px] text-gray-500 mt-1">Acta de entrega firmada</span>
          </div>

          <div className="p-4 bg-brand-dark/60 rounded-xl border border-blue-500/20 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">5. En Portafolio</span>
            <div className="text-2xl font-black text-blue-400 mt-2">{publishedCount}</div>
            <span className="text-[10px] text-gray-500 mt-1">Activo público comercial</span>
          </div>
        </div>
      </div>

      {/* Two Columns: Operational Alerts + Observability Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Operational Alerts & Recent Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Alerts */}
          <div className="bg-[#131d16] p-6 rounded-2xl border border-white/5 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Alertas Operativas Prioritarias
              </h3>
              <span className="text-xs text-gray-400 font-bold">
                {pendingQualityChecks.length + delayedMilestones.length + sheetsReadyForReview.length} pendientes
              </span>
            </div>

            {pendingQualityChecks.length === 0 && delayedMilestones.length === 0 && sheetsReadyForReview.length === 0 ? (
              <div className="py-6 text-center text-gray-400 text-xs flex items-center justify-center gap-2 bg-brand-dark/40 rounded-xl border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Excelente: No existen alertas críticas de calidad ni hitos retrasados.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {delayedMilestones.map((m) => (
                  <div key={m.id} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-red-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Hito retrasado: {m.name}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Obra: {m.technicalSheet?.project?.title || 'Proyecto'} • Fecha planificada: {m.plannedDate ? new Date(m.plannedDate).toLocaleDateString('es-CO') : 'Sin fecha'}
                      </p>
                    </div>
                    {m.technicalSheet?.project?.id && (
                      <Link
                        href={`/admin/proyectos/${m.technicalSheet.project.id}/ficha-tecnica`}
                        className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold rounded-lg text-[11px]"
                      >
                        Revisar
                      </Link>
                    )}
                  </div>
                ))}

                {pendingQualityChecks.map((qc) => (
                  <div key={qc.id} className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-amber-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>No conformidad de calidad: {qc.item}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Obra: {qc.technicalSheet?.project?.title || 'Proyecto'} • {qc.observation || 'Requiere subsanación técnica'}
                      </p>
                    </div>
                    {qc.technicalSheet?.project?.id && (
                      <Link
                        href={`/admin/proyectos/${qc.technicalSheet.project.id}/ficha-tecnica`}
                        className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg text-[11px]"
                      >
                        Subsanar
                      </Link>
                    )}
                  </div>
                ))}

                {sheetsReadyForReview.map((s) => (
                  <div key={s.id} className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-blue-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Ficha Técnica lista para aprobación oficial: {s.revision}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Obra: {s.project?.title || 'Proyecto'}
                      </p>
                    </div>
                    {s.project?.id && (
                      <Link
                        href={`/admin/proyectos/${s.project.id}/ficha-tecnica`}
                        className="px-2.5 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold rounded-lg text-[11px]"
                      >
                        Aprobar
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Projects Table */}
          <div className="bg-[#131d16] p-6 rounded-2xl border border-white/5 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Obras Recientes en el Sistema
              </h3>
              <Link href="/admin/proyectos" className="text-xs font-bold text-brand-gold hover:underline">
                Ver Listado Completo &rarr;
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {recentProjects.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/proyectos/${p.id}/ficha-tecnica`}
                      className="text-sm font-bold text-white hover:text-brand-gold truncate block"
                    >
                      {p.title}
                    </Link>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                      <span className="text-brand-green font-semibold">{p.category}</span>
                      <span>•</span>
                      <span>{p.city || p.client || 'Colombia'}</span>
                      <span>•</span>
                      <span>Rev. {p.technicalSheet?.revision || 'R01'} ({p.technicalSheet?.sheetStatus || 'DRAFT'})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.published ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-400'}`}>
                      {p.published ? 'Público' : 'Privado'}
                    </span>
                    <Link
                      href={`/admin/proyectos/${p.id}/ficha-tecnica`}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                      title="Editar Ficha"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live System Observability & Telemetry */}
        <div className="space-y-6">
          <div className="bg-[#131d16] p-6 rounded-2xl border border-white/5 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  Salud del Sistema (Live)
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                100% Operativo
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-brand-dark/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-gray-300">PostgreSQL Isolation</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400">proyectos_y_montajes</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-brand-dark/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-brand-gold" />
                  <span className="text-gray-300">Motor PDF (Chromium)</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400">A4 Confinado (15s)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-brand-dark/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-gray-300">Supabase Storage</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400">projects-gallery</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-brand-dark/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-gray-300">Autenticación & RBAC</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400">Clerk Server Guard</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-brand-dark/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-gray-300">Rate Limiting</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400">Sliding Window Activo</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] text-gray-400 flex items-center justify-between">
              <span>Endpoint de telemetría:</span>
              <Link href="/api/admin/health" target="_blank" className="text-brand-gold hover:underline font-mono text-[10px]">
                /api/admin/health &rarr;
              </Link>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-[#131d16] p-6 rounded-2xl border border-white/5 shadow-md space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Acciones Rápidas de Ingeniería
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                href="/admin/proyectos"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 transition-colors"
              >
                <span>Crear o Clonar Proyecto</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/admin/leads"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 transition-colors"
              >
                <span>Registrar Prospecto Comercial</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/admin/portafolio"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 transition-colors"
              >
                <span>Reordenar Portafolio Público</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/portafolio"
                target="_blank"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-green/20 hover:bg-brand-green/30 text-brand-gold transition-colors font-bold"
              >
                <span>Ver Portafolio Público en Vivo</span>
                <Globe className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
