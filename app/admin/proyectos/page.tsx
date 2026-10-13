'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileText,
  Eye,
  Copy,
  Download,
  EyeOff,
  Star,
  Building2,
  Check,
  X,
} from 'lucide-react';
import CreateProjectModal from '@/app/components/admin/CreateProjectModal';

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  client?: string | null;
  mainImage?: string | null;
  gallery: string[];
  sqMeters?: number | null;
  duration?: string | null;
  description?: string | null;
  status: string;
  location?: string | null;
  city?: string | null;
  published: boolean;
  featured: boolean;
  portfolioOrder: number;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  'TODAS',
  'Pistas de Pádel',
  'Canchas Sintéticas (Fútbol)',
  'Parques Infantiles',
  'Grama Sintética & Paisajismo',
  'Polideportivos & Múltiples',
  'Mantenimiento Especializado',
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string }> = {
  DRAFT: { label: 'Borrador', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30' },
  QUOTE: { label: 'Cotización', color: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  PLANNING: { label: 'Planeación', color: 'text-blue-300', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  IN_PROGRESS: { label: 'En Ejecución', color: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  COMPLETED: { label: 'Entregado', color: 'text-teal-300', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
  ARCHIVED: { label: 'Archivado', color: 'text-gray-500', bg: 'bg-gray-800/40', border: 'border-gray-700' },
};

function formatRelativeDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} d`;

    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
    });
  } catch {
    return '—';
  }
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODAS');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPublish, setSelectedPublish] = useState('ALL'); // ALL, PUBLISHED, DRAFT
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (err: unknown) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleTogglePublish = async (project: Project) => {
    setPublishingId(project.id);
    setActionMsg(null);
    try {
      const nextState = !project.published;
      const res = await fetch(`/api/admin/projects/${project.id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: nextState }),
      });
      const data = await res.json();

      if (!res.ok) {
        let errorTxt = data.message || data.error || 'No fue posible cambiar la publicación';
        if (data.missingFields && Array.isArray(data.missingFields)) {
          errorTxt += ` Faltan: ${data.missingFields.join(', ')}`;
        }
        throw new Error(errorTxt);
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: nextState } : p))
      );

      setActionMsg({
        type: 'success',
        text: nextState
          ? `Proyecto "${project.title}" ahora está visible en /portafolio.`
          : `Proyecto "${project.title}" retirado de /portafolio (modo privado).`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar visibilidad';
      setActionMsg({ type: 'error', text: msg });
    } finally {
      setPublishingId(null);
    }
  };

  const handleDuplicate = async (project: Project) => {
    setDuplicatingId(project.id);
    setActionMsg(null);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}/duplicate`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Error al duplicar el proyecto');
      }

      setProjects((prev) => [data.project, ...prev]);
      setActionMsg({
        type: 'success',
        text: `Proyecto "${project.title}" duplicado como "${data.project.title}".`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al duplicar el proyecto';
      setActionMsg({ type: 'error', text: msg });
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Está seguro de eliminar definitivamente el proyecto "${title}" y su ficha técnica?\nEsta acción no se puede deshacer.`)) {
      return;
    }

    setDeletingId(id);
    setActionMsg(null);

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Error al eliminar el proyecto');
      }

      setProjects((prev) => prev.filter((p) => p.id !== id));
      setActionMsg({ type: 'success', text: `Proyecto "${title}" eliminado exitosamente.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar el proyecto';
      setActionMsg({ type: 'error', text: msg });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'TODAS' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
    const matchesPublish =
      selectedPublish === 'ALL' ||
      (selectedPublish === 'PUBLISHED' && p.published) ||
      (selectedPublish === 'DRAFT' && !p.published);

    const q = search.trim().toLowerCase();
    const matchesSearch =
      q === '' ||
      p.title.toLowerCase().includes(q) ||
      (p.client && p.client.toLowerCase().includes(q)) ||
      (p.city && p.city.toLowerCase().includes(q)) ||
      (p.location && p.location.toLowerCase().includes(q));

    return matchesCategory && matchesStatus && matchesPublish && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-brand-green/20">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Gestor Integral de Proyectos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold font-bold text-xs">
              {projects.length} {projects.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Administración centralizada de obras, especificaciones técnicas, cronogramas y publicación en el portafolio público.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-brand-gold hover:bg-yellow-400 text-brand-dark px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-gold/10 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {/* Notifications */}
      {actionMsg && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-sm animate-fade-in ${
            actionMsg.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/40 border border-red-500/40 text-red-300'
          }`}
        >
          <div className="flex items-center gap-3">
            {actionMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <span>{actionMsg.text}</span>
          </div>
          <button
            onClick={() => setActionMsg(null)}
            className="text-gray-400 hover:text-white text-xs p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Multi-Filters & Search Bar */}
      <div className="bg-[#131d16] border border-brand-green/30 rounded-2xl p-4 shadow-lg flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por proyecto, cliente, ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-brand-gold"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-brand-gold" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-xs focus:outline-none focus:border-brand-gold"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-brand-dark text-white">
                {cat === 'TODAS' ? 'Todas las Categorías' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-xs focus:outline-none focus:border-brand-gold"
        >
          <option value="ALL">Todos los Estados</option>
          <option value="DRAFT">Borrador</option>
          <option value="QUOTE">Cotización</option>
          <option value="PLANNING">Planeación</option>
          <option value="IN_PROGRESS">En Ejecución</option>
          <option value="COMPLETED">Entregado</option>
          <option value="ARCHIVED">Archivado</option>
        </select>

        {/* Publish Filter */}
        <select
          value={selectedPublish}
          onChange={(e) => setSelectedPublish(e.target.value)}
          className="px-3 py-2 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-xs focus:outline-none focus:border-brand-gold"
        >
          <option value="ALL">Publicación (Todos)</option>
          <option value="PUBLISHED">En Portafolio (Público)</option>
          <option value="DRAFT">Oculto (Privado)</option>
        </select>
      </div>

      {/* Projects Table */}
      <div className="bg-[#131d16] border border-brand-green/30 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-9 h-9 text-brand-gold animate-spin mb-3" />
            <p className="text-xs text-gray-400 tracking-wide">Cargando inventario de proyectos y fichas técnicas...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center p-6">
            <FolderGit2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No se encontraron proyectos</h3>
            <p className="text-xs text-gray-400 mb-6 max-w-md mx-auto">
              {search || selectedCategory !== 'TODAS' || selectedStatus !== 'ALL' || selectedPublish !== 'ALL'
                ? 'No hay registros que coincidan con los filtros aplicados. Pruebe restableciendo la búsqueda.'
                : 'Aún no se han registrado obras en el sistema. Comience creando su primera ficha técnica.'}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-black text-xs uppercase"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Crear Nuevo Proyecto
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-400 uppercase tracking-wider border-b border-brand-green/20 bg-brand-dark/60 text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Proyecto / Obra</th>
                  <th className="py-3.5 px-4 font-bold">Categoría</th>
                  <th className="py-3.5 px-4 font-bold">Estado</th>
                  <th className="py-3.5 px-4 font-bold text-center">Portafolio</th>
                  <th className="py-3.5 px-4 font-bold">Actualizado</th>
                  <th className="py-3.5 px-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-green/10">
                {filteredProjects.map((project) => {
                  const statusInfo = STATUS_MAP[project.status] || STATUS_MAP.IN_PROGRESS;
                  return (
                    <tr key={project.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Project identity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-dark border border-brand-green/30 flex-shrink-0 relative">
                            {project.mainImage ? (
                              <img
                                src={project.mainImage}
                                alt={project.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 text-[10px]">
                                Sin Foto
                              </div>
                            )}
                            {project.featured && (
                              <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-brand-gold flex items-center justify-center shadow">
                                <Star className="w-2.5 h-2.5 text-brand-dark fill-brand-dark" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/proyectos/${project.id}/ficha-tecnica`}
                              className="font-bold text-white hover:text-brand-gold transition-colors text-sm line-clamp-1"
                            >
                              {project.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                              {project.client && (
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-gray-500" />
                                  {project.client}
                                </span>
                              )}
                              {project.city && <span>• {project.city}</span>}
                              {project.sqMeters && <span>• {project.sqMeters.toLocaleString()} m²</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-brand-green/20 text-emerald-300 border border-brand-green/30 text-[10px] font-bold">
                          {project.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full border text-[10px] font-bold inline-flex items-center gap-1.5 ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Portfolio Publication */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleTogglePublish(project)}
                          disabled={publishingId === project.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                            project.published
                              ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                              : 'bg-gray-800/60 border border-gray-700 text-gray-400 hover:bg-gray-700/60'
                          } disabled:opacity-50 cursor-pointer`}
                          title={project.published ? 'Clic para ocultar del portafolio' : 'Clic para publicar en portafolio'}
                        >
                          {publishingId === project.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : project.published ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3] text-brand-gold" />
                              <span>Público (#{project.portfolioOrder})</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-gray-500" />
                              <span>Oculto</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Updated Date */}
                      <td className="py-3.5 px-4 text-gray-400">
                        <span className="font-mono text-[11px]">
                          {formatRelativeDate(project.updatedAt || project.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Editar Ficha Técnica */}
                          <Link
                            href={`/admin/proyectos/${project.id}/ficha-tecnica`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-green/30 hover:bg-brand-green/50 text-emerald-200 border border-brand-green/40 text-[11px] font-bold transition-colors"
                            title="Editar ficha técnica completa"
                          >
                            <FileText className="w-3.5 h-3.5 text-brand-gold" />
                            <span>Editar</span>
                          </Link>

                          {/* Preview Ficha Técnica */}
                          <Link
                            href={`/admin/proyectos/${project.id}/ficha-tecnica/preview`}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-colors"
                            title="Vista previa del documento técnico"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {/* Generar / Descargar PDF */}
                          <a
                            href={`/api/admin/projects/${project.id}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold border border-brand-gold/20 transition-colors"
                            title="Generar y descargar PDF oficial"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>

                          {/* Ver en Portafolio Público (si está publicado) */}
                          <Link
                            href={`/portafolio/${project.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-colors"
                            title="Ver en portafolio público"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Duplicar */}
                          <button
                            onClick={() => handleDuplicate(project)}
                            disabled={duplicatingId === project.id}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-colors disabled:opacity-50"
                            title="Duplicar proyecto"
                          >
                            {duplicatingId === project.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-gold" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Eliminar */}
                          <button
                            onClick={() => handleDelete(project.id, project.title)}
                            disabled={deletingId === project.id}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors disabled:opacity-50"
                            title="Eliminar proyecto"
                          >
                            {deletingId === project.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={(newProj) => {
          fetchProjects();
          setActionMsg({ type: 'success', text: `¡Proyecto "${newProj.title}" creado con éxito!` });
        }}
      />
    </div>
  );
}
