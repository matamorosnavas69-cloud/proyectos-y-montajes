'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
} from 'lucide-react';

interface ProjectPortfolioItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  client?: string | null;
  mainImage?: string | null;
  gallery: string[];
  sqMeters?: number | null;
  published: boolean;
  featured: boolean;
  portfolioOrder: number;
}

export default function AdminPortfolioManagerPage() {
  const [projects, setProjects] = useState<ProjectPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (data.success) {
        // Sort by portfolioOrder asc
        const sorted = (data.projects || []).sort(
          (a: ProjectPortfolioItem, b: ProjectPortfolioItem) =>
            (a.portfolioOrder || 0) - (b.portfolioOrder || 0)
        );
        setProjects(sorted);
      }
    } catch (err: unknown) {
      console.error('Error loading portfolio manager projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    try {
      setSavingId(id);
      setStatusMsg(null);

      const res = await fetch(`/api/admin/projects/${id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentPublished }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Error al cambiar visibilidad');
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, published: data.published } : p))
      );
      setStatusMsg({ type: 'success', text: data.message });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar proyecto';
      setStatusMsg({ type: 'error', text: msg });
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      setSavingId(id);
      setStatusMsg(null);

      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Error al actualizar destacado');
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: !currentFeatured } : p))
      );
      setStatusMsg({
        type: 'success',
        text: !currentFeatured ? 'Proyecto marcado como Destacado.' : 'Proyecto desmarcado de Destacados.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar proyecto';
      setStatusMsg({ type: 'error', text: msg });
    } finally {
      setSavingId(null);
    }
  };

  const handleOrderChange = async (id: string, newOrder: number) => {
    try {
      setSavingId(id);
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioOrder: newOrder }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Error al cambiar orden');
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, portfolioOrder: newOrder } : p))
      );
      setStatusMsg({ type: 'success', text: 'Prioridad de orden actualizada.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar orden';
      setStatusMsg({ type: 'error', text: msg });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-brand-green/20">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            Gestión y Control de Portafolio Público
          </h1>
          <p className="text-xs md:text-sm text-gray-400">
            Controle la visibilidad, proyectos destacados y el orden de aparición exacto en{' '}
            <span className="font-mono text-brand-gold">/portafolio</span>.
          </p>
        </div>

        <Link
          href="/portafolio"
          target="_blank"
          className="inline-flex items-center gap-2 bg-brand-green hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors border border-brand-green/40 shadow"
        >
          <Globe className="w-4 h-4 text-brand-gold" />
          <span>Abrir Portafolio Público</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Notification Banner */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
            statusMsg.type === 'success'
              ? 'bg-brand-green/20 border border-brand-green/40 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-[#131d16] border border-brand-green/30 rounded-3xl p-6 shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-brand-gold animate-spin mb-3" />
            <p className="text-xs text-gray-400">Cargando catálogo de portafolio...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-brand-green/20 rounded-2xl p-6">
            <FolderGit2 className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No hay proyectos en el sistema</h3>
            <p className="text-xs text-gray-400 mb-6">Cree su primera obra deportiva o paisajismo en el panel de proyectos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-400 uppercase tracking-wider border-b border-brand-green/20 bg-brand-dark/40">
                <tr>
                  <th className="py-3 px-4 w-20">Prioridad</th>
                  <th className="py-3 px-4">Proyecto / Obra</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4 text-center">Destacado</th>
                  <th className="py-3 px-4 text-center">Mostrar en Portafolio</th>
                  <th className="py-3 px-4 text-right">Previsualizar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-green/10">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Priority Order */}
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <input
                        type="number"
                        value={p.portfolioOrder}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          setProjects((prev) =>
                            prev.map((proj) => (proj.id === p.id ? { ...proj, portfolioOrder: val } : proj))
                          );
                        }}
                        onBlur={(e) => handleOrderChange(p.id, parseInt(e.target.value, 10) || 0)}
                        className="w-16 bg-brand-dark px-2.5 py-1 rounded-lg border border-brand-green/40 text-center text-white focus:outline-none focus:border-brand-gold font-bold text-xs"
                      />
                    </td>

                    {/* Project Title & Thumbnail */}
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 border border-brand-green/30">
                        {p.mainImage ? (
                          <img src={p.mainImage} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-[10px]">
                            Sin Foto
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="line-clamp-1 text-sm">{p.title}</span>
                        <span className="text-[11px] text-gray-400 font-normal">
                          {p.client || 'Cliente Privado'}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-brand-green/30 text-emerald-300 border border-brand-green/40 text-[10px] font-bold uppercase">
                        {p.category}
                      </span>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(p.id, p.featured)}
                        disabled={savingId === p.id}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          p.featured
                            ? 'bg-brand-gold text-brand-dark font-black shadow-md'
                            : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {p.featured ? '★ Destacado' : 'Estándar'}
                      </button>
                    </td>

                    {/* Published Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(p.id, p.published)}
                        disabled={savingId === p.id}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                          p.published
                            ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${p.published ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span>{p.published ? 'Público ✓' : 'Oculto / Privado'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/proyectos/${p.id}/ficha-tecnica`}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold text-xs transition-colors"
                        >
                          Ficha Técnica
                        </Link>
                        <Link
                          href={`/portafolio/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                          title="Ver en portal público"
                        >
                          <ExternalLink className="w-4 h-4 text-brand-gold" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
