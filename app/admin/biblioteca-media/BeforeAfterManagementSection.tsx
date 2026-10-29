'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sliders,
  Sparkles,
  MapPin,
  Maximize2,
  Clock,
  ArrowRight,
  Split,
  Columns,
  Search,
  X,
  Check,
  Maximize,
  ArrowUpDown,
  Filter,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface BeforeAfterProjectItem {
  id: string;
  title: string;
  location: string;
  category: string;
  categoryColor: string;
  beforeImage: string;
  afterImage: string;
  area?: string | null;
  duration?: string | null;
  sortOrder: number;
  isActive: boolean;
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; badge: string; dot: string; colorClass: string }
> = {
  Pádel: {
    label: 'Pádel',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    dot: 'bg-emerald-400',
    colorClass: 'bg-emerald-600',
  },
  Fútbol: {
    label: 'Fútbol',
    badge: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
    dot: 'bg-lime-400',
    colorClass: 'bg-green-600',
  },
  Parques: {
    label: 'Parques',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    dot: 'bg-amber-400',
    colorClass: 'bg-brand-gold',
  },
  Paisajismo: {
    label: 'Paisajismo',
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    dot: 'bg-teal-400',
    colorClass: 'bg-teal-600',
  },
};

export default function BeforeAfterManagementSection() {
  const [projects, setProjects] = useState<BeforeAfterProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Per-card display mode: 'side-by-side' vs 'slider'
  const [cardModes, setCardModes] = useState<Record<string, 'side-by-side' | 'slider'>>({});
  const [cardSliderPos, setCardSliderPos] = useState<Record<string, number>>({});

  // Fullscreen inspect modal
  const [inspectProject, setInspectProject] = useState<BeforeAfterProjectItem | null>(null);
  const [inspectPos, setInspectPos] = useState(50);

  // Creation / Edition Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<BeforeAfterProjectItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Pádel');
  const [categoryColor, setCategoryColor] = useState('bg-emerald-600');
  const [area, setArea] = useState('');
  const [duration, setDuration] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforeImageUrl, setBeforeImageUrl] = useState('');
  const [afterImageUrl, setAfterImageUrl] = useState('');
  const [beforePreview, setBeforePreview] = useState('');
  const [afterPreview, setAfterPreview] = useState('');
  const [beforeDragOver, setBeforeDragOver] = useState(false);
  const [afterDragOver, setAfterDragOver] = useState(false);

  // Interactive slider inside modal
  const [modalSliderPos, setModalSliderPos] = useState(50);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/before-after', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No fue posible cargar proyectos de Antes y Después.');
      setProjects(data.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Notice auto-dismiss
  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notice]);

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle('');
    setLocation('');
    setCategory('Pádel');
    setCategoryColor(CATEGORY_CONFIG['Pádel']?.colorClass || 'bg-emerald-600');
    setArea('');
    setDuration('');
    setIsActive(true);
    setBeforeFile(null);
    setAfterFile(null);
    setBeforeImageUrl('');
    setAfterImageUrl('');
    setBeforePreview('');
    setAfterPreview('');
    setModalSliderPos(50);
    setIsModalOpen(true);
  };

  const openEditModal = (p: BeforeAfterProjectItem) => {
    setEditingProject(p);
    setTitle(p.title);
    setLocation(p.location);
    setCategory(p.category);
    setCategoryColor(p.categoryColor || CATEGORY_CONFIG[p.category]?.colorClass || 'bg-brand-green');
    setArea(p.area || '');
    setDuration(p.duration || '');
    setIsActive(p.isActive);
    setBeforeFile(null);
    setAfterFile(null);
    setBeforeImageUrl(p.beforeImage);
    setAfterImageUrl(p.afterImage);
    setBeforePreview(p.beforeImage);
    setAfterPreview(p.afterImage);
    setModalSliderPos(50);
    setIsModalOpen(true);
  };

  const handleBeforeFileSelected = (file: File) => {
    setBeforeFile(file);
    setBeforePreview(URL.createObjectURL(file));
  };

  const handleAfterFileSelected = (file: File) => {
    setAfterFile(file);
    setAfterPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título del proyecto es obligatorio.');
      return;
    }
    if (!beforeFile && !beforeImageUrl) {
      setError('La fotografía de Antes es obligatoria.');
      return;
    }
    if (!afterFile && !afterImageUrl) {
      setError('La fotografía de Después es obligatoria.');
      return;
    }

    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const formData = new FormData();
      if (editingProject) {
        formData.append('id', editingProject.id);
      }
      formData.append('title', title.trim());
      formData.append('location', location.trim());
      formData.append('category', category);
      formData.append('categoryColor', categoryColor);
      formData.append('area', area.trim());
      formData.append('duration', duration.trim());
      formData.append('isActive', isActive ? 'true' : 'false');

      if (beforeFile) {
        formData.append('beforeFile', beforeFile);
      } else {
        formData.append('beforeImage', beforeImageUrl);
      }

      if (afterFile) {
        formData.append('afterFile', afterFile);
      } else {
        formData.append('afterImage', afterImageUrl);
      }

      const method = editingProject ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/before-after', {
        method,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar el proyecto.');

      setNotice(editingProject ? 'Proyecto actualizado con éxito.' : 'Proyecto creado exitosamente.');
      setIsModalOpen(false);
      loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando proyecto.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (p: BeforeAfterProjectItem) => {
    try {
      const res = await fetch('/api/admin/before-after', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, isActive: !p.isActive }),
      });
      if (!res.ok) throw new Error('No fue posible cambiar visibilidad.');
      setNotice(p.isActive ? `"${p.title}" ahora está oculto.` : `"${p.title}" publicado en la web.`);
      loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cambiando visibilidad.');
    }
  };

  const deleteProject = async (id: string, projectTitle: string) => {
    if (!confirm(`¿Eliminar definitivamente la comparación "${projectTitle}"?`)) return;
    try {
      const res = await fetch(`/api/admin/before-after?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('No fue posible eliminar el proyecto.');
      setNotice('Proyecto eliminado con éxito.');
      loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando proyecto.');
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIdx];
    newProjects[targetIdx] = temp;

    const reorderPayload = newProjects.map((p, idx) => ({ id: p.id, sortOrder: idx }));
    setProjects(newProjects);

    try {
      await fetch('/api/admin/before-after', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reorder: reorderPayload }),
      });
    } catch (err) {
      console.error('Error reordering projects:', err);
      loadProjects();
    }
  };

  // Filtered & searched projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = selectedFilter === 'all' || p.category.toLowerCase() === selectedFilter.toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedFilter, searchQuery]);

  const activeCount = projects.filter((p) => p.isActive).length;
  const categoriesPresent = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.category)));
  }, [projects]);

  return (
    <div className="space-y-6">
      {/* Header Cockpit Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#121f15] via-[#0d1610] to-[#142318] p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-32 bg-emerald-500/5 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-[11px] font-black uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              CMS de Transformaciones
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Del Terreno al Resultado Final (Antes y Después)
            </h2>
            <p className="text-gray-300 text-sm mt-2 leading-relaxed">
              Administre las parejas fotográficas que demuestran la evolución técnica de las obras en la página de inicio.
              Pruebe el deslizador interactivo en vivo y organice la prioridad de publicación.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Quick Metrics */}
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5">
              <div className="text-center pr-3 border-r border-white/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Total</span>
                <span className="text-xl font-black text-white leading-none">{projects.length}</span>
              </div>
              <div className="text-center pl-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Activas
                </span>
                <span className="text-xl font-black text-emerald-300 leading-none">{activeCount}</span>
              </div>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-gold hover:bg-yellow-400 text-brand-dark font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-glow-gold hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nueva Comparación</span>
            </button>
          </div>
        </div>

        {/* Sub-bar: Category Filters & Search */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-brand-gold text-brand-dark shadow-sm'
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              Todas ({projects.length})
            </button>
            {['Pádel', 'Fútbol', 'Parques', 'Paisajismo'].map((cat) => {
              const count = projects.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
              const isSelected = selectedFilter.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-brand-green text-white border border-brand-green/40 shadow-sm'
                      : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] px-1 rounded bg-black/40 text-gray-300">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por obra o ciudad..."
              className="w-full md:w-64 pl-8 pr-3 py-1.5 text-xs rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between gap-2 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-emerald-400 hover:text-emerald-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-center justify-between gap-2 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="p-16 text-center text-gray-400 flex flex-col items-center justify-center gap-3 bg-[#131d16] border border-white/10 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
            Cargando comparaciones técnicas...
          </span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-16 text-center bg-[#131d16] rounded-2xl border border-dashed border-white/15 shadow-xl">
          <Sliders className="w-12 h-12 text-brand-gold/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            {projects.length === 0
              ? 'No hay proyectos de Antes y Después configurados'
              : 'No se encontraron comparaciones que coincidan'}
          </h3>
          <p className="text-xs text-gray-400 mb-5 max-w-md mx-auto">
            {projects.length === 0
              ? 'Cree su primera comparación fotográfica para activar la sección interactiva en la página principal.'
              : 'Intente cambiar la categoría seleccionada o limpie el término de búsqueda.'}
          </p>
          {projects.length === 0 ? (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark text-xs font-black hover:bg-yellow-400 transition-all shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Crear Primera Comparación
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Restablecer Filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredProjects.map((p, index) => {
            const cardMode = cardModes[p.id] || 'side-by-side';
            const sliderPos = cardSliderPos[p.id] ?? 50;
            const categoryMeta = CATEGORY_CONFIG[p.category] || {
              label: p.category,
              badge: 'bg-brand-gold/20 text-brand-gold border-brand-gold/30',
              dot: 'bg-brand-gold',
            };

            return (
              <article
                key={p.id}
                className={`group relative rounded-2xl border transition-all duration-300 p-5 md:p-6 bg-[#131d16] shadow-xl hover:border-brand-gold/40 ${
                  p.isActive
                    ? 'border-white/10 hover:shadow-glow-gold/10'
                    : 'border-white/5 opacity-65 bg-[#0e1610]'
                }`}
              >
                <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
                  {/* Left: Dual Preview / Interactive Slider Container */}
                  <div className="w-full xl:w-auto shrink-0 flex flex-col gap-2">
                    {/* View mode toggle pill */}
                    <div className="flex items-center justify-between gap-2 text-[10px] text-gray-400 mb-1">
                      <span className="font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-brand-gold" />
                        Vista Previa CMS
                      </span>

                      <div className="inline-flex items-center rounded-lg bg-black/40 border border-white/10 p-0.5">
                        <button
                          type="button"
                          onClick={() => setCardModes((prev) => ({ ...prev, [p.id]: 'side-by-side' }))}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-bold transition-all ${
                            cardMode === 'side-by-side'
                              ? 'bg-brand-green text-white shadow-sm'
                              : 'text-gray-400 hover:text-white'
                          }`}
                          title="Ver fotografías lado a lado"
                        >
                          <Columns className="w-3 h-3" />
                          <span>Lado a Lado</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCardModes((prev) => ({ ...prev, [p.id]: 'slider' }))}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-bold transition-all ${
                            cardMode === 'slider'
                              ? 'bg-brand-gold text-brand-dark shadow-sm'
                              : 'text-gray-400 hover:text-white'
                          }`}
                          title="Probar deslizador interactivo"
                        >
                          <Split className="w-3 h-3" />
                          <span>Split Slider</span>
                        </button>
                      </div>
                    </div>

                    {/* Mode A: Side by Side Dual View */}
                    {cardMode === 'side-by-side' ? (
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full">
                        {/* BEFORE Image */}
                        <div className="group/before relative w-full sm:w-[240px] md:w-[280px] aspect-[16/10] rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-lg shrink-0">
                          <Image
                            src={p.beforeImage}
                            alt={`${p.title} Antes`}
                            fill
                            sizes="300px"
                            className="object-cover transition-transform duration-500 group-hover/before:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md text-gray-200 border border-white/15 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                            Antes • Terreno
                          </span>
                        </div>

                        {/* Connector Icon */}
                        <div className="w-[36px] h-[36px] rounded-full bg-black/60 border border-brand-gold/30 flex items-center justify-center shrink-0 text-brand-gold shadow-md">
                          <ArrowRight className="w-[18px] h-[18px]" />
                        </div>

                        {/* AFTER Image */}
                        <div className="group/after relative w-full sm:w-[240px] md:w-[280px] aspect-[16/10] rounded-2xl overflow-hidden border border-brand-gold/40 bg-black/60 shadow-lg shrink-0">
                          <Image
                            src={p.afterImage}
                            alt={`${p.title} Después`}
                            fill
                            sizes="300px"
                            className="object-cover transition-transform duration-500 group-hover/after:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <span className="absolute bottom-2 right-2 bg-brand-gold text-brand-dark text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
                            Después • Entrega
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Mode B: Live Interactive In-Card Slider */
                      <div className="relative w-full sm:w-[480px] md:w-[560px] aspect-[16/10] rounded-2xl overflow-hidden border border-brand-gold/40 bg-black/60 shadow-xl select-none shrink-0">
                        {/* After Image (Background) */}
                        <Image src={p.afterImage} alt="Después" fill sizes="560px" className="object-cover" />
                        <span className="absolute bottom-2 right-2 z-0 bg-brand-gold text-brand-dark text-[10px] font-black px-2 py-0.5 rounded shadow">
                          Después
                        </span>

                        {/* Before Image (Clipped overlay) */}
                        <div
                          className="absolute inset-0 z-10 overflow-hidden"
                          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                        >
                          <Image src={p.beforeImage} alt="Antes" fill sizes="560px" className="object-cover" />
                          <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20">
                            Antes
                          </span>
                        </div>

                        {/* Draggable Divider Handle */}
                        <div
                          className="absolute top-0 bottom-0 w-[2px] bg-white z-20 pointer-events-none shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                          style={{ left: `${sliderPos}%` }}
                        >
                          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[28px] h-[28px] rounded-full bg-brand-gold text-brand-dark font-black flex items-center justify-center shadow-2xl border-2 border-black text-xs">
                            &harr;
                          </div>
                        </div>

                        {/* Slider control invisible overlay */}
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sliderPos}
                          onChange={(e) =>
                            setCardSliderPos((prev) => ({ ...prev, [p.id]: parseInt(e.target.value, 10) }))
                          }
                          className="absolute inset-0 opacity-0 cursor-ew-resize z-30"
                          aria-label="Ajustar comparación"
                        />
                      </div>
                    )}
                  </div>

                  {/* Center: Information & Metadata */}
                  <div className="flex-grow min-w-0 w-full xl:w-auto">
                    {/* Top Row: Category Chip + Location + Status */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${categoryMeta.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${categoryMeta.dot}`} />
                        {categoryMeta.label}
                      </span>

                      {p.location && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                          <MapPin className="w-3 h-3 text-brand-gold/80" />
                          {p.location}
                        </span>
                      )}

                      {/* Status indicator */}
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          p.isActive
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-white/5 text-gray-400 border border-white/10'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'
                          }`}
                        />
                        {p.isActive ? 'Visible en Inicio' : 'Oculto'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-black text-white tracking-tight leading-snug group-hover:text-brand-gold transition-colors">
                      {p.title}
                    </h3>

                    {/* Engineering Specs Pills */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {p.area && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-gray-300">
                          <Maximize2 className="w-3 h-3 text-emerald-400" />
                          <span>
                            Área: <strong className="text-white font-bold">{p.area}</strong>
                          </span>
                        </div>
                      )}

                      {p.duration && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-gray-300">
                          <Clock className="w-3 h-3 text-brand-gold" />
                          <span>
                            Duración: <strong className="text-white font-bold">{p.duration}</strong>
                          </span>
                        </div>
                      )}

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-gray-300">
                        <ArrowUpDown className="w-3 h-3 text-blue-400" />
                        <span>
                          Prioridad: <strong className="text-white font-bold">#{index + 1}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Modern Action Dock */}
                  <div className="flex items-center gap-2 w-full xl:w-auto justify-end border-t xl:border-t-0 pt-3 xl:pt-0 border-white/10 shrink-0">
                    {/* Fullscreen Inspector Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setInspectProject(p);
                        setInspectPos(50);
                      }}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      title="Inspeccionar a pantalla completa"
                    >
                      <Maximize className="w-[18px] h-[18px]" />
                    </button>

                    {/* Move Up */}
                    <button
                      type="button"
                      onClick={() => moveOrder(index, 'up')}
                      disabled={index === 0}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      title="Subir prioridad en portada"
                    >
                      <MoveUp className="w-[18px] h-[18px]" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      onClick={() => moveOrder(index, 'down')}
                      disabled={index === projects.length - 1}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      title="Bajar prioridad en portada"
                    >
                      <MoveDown className="w-[18px] h-[18px]" />
                    </button>

                    {/* Visibility Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleActive(p)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        p.isActive
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                      title={p.isActive ? 'Visible en el sitio web (clic para ocultar)' : 'Oculto (clic para publicar)'}
                    >
                      {p.isActive ? <Eye className="w-[18px] h-[18px]" /> : <EyeOff className="w-[18px] h-[18px]" />}
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-brand-gold/40 bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all text-xs font-bold shadow-sm"
                      title="Editar comparación y fotos"
                    >
                      <Edit2 className="w-[15px] h-[15px]" />
                      <span className="hidden sm:inline">Editar</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => deleteProject(p.id, p.title)}
                      className="p-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                      title="Eliminar de la galería"
                    >
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* FOOTER METADATA TIP */}
      <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-[11px] text-gray-400 flex items-center justify-between gap-4">
        <p className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0" />
          <span>
            <strong>Consejo Pro:</strong> Suba fotos con la misma perspectiva y encuadre para lograr un efecto de deslizamiento perfecto.
            Formato recomendado: WebP o JPG a 1920×1080 px con peso menor a 5 MB.
          </span>
        </p>
        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 shrink-0 hidden sm:inline">
          Supabase Bucket / before-after
        </span>
      </div>

      {/* MODAL 1: Fullscreen Inspector Lightbox */}
      {inspectProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-5xl rounded-3xl border border-white/15 bg-[#101b13] p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                  {inspectProject.category} • {inspectProject.location}
                </span>
                <h3 className="text-xl font-black text-white">{inspectProject.title}</h3>
              </div>
              <button
                onClick={() => setInspectProject(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Slider Display */}
            <div className="relative flex-1 min-h-[380px] my-4 rounded-2xl overflow-hidden border border-white/10 bg-black select-none">
              <Image src={inspectProject.afterImage} alt="Después" fill className="object-contain" priority />
              <div
                className="absolute inset-0 z-10 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - inspectPos}% 0 0)` }}
              >
                <Image src={inspectProject.beforeImage} alt="Antes" fill className="object-contain" priority />
              </div>

              {/* Slider Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white z-20 pointer-events-none shadow-[0_0_12px_rgba(255,255,255,1)]"
                style={{ left: `${inspectPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-brand-gold text-brand-dark font-black flex items-center justify-center shadow-2xl border-2 border-black text-xs">
                  &harr;
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={inspectPos}
                onChange={(e) => setInspectPos(parseInt(e.target.value, 10))}
                className="absolute inset-0 opacity-0 cursor-ew-resize z-30"
              />

              {/* Floating badges */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <span className="bg-black/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-lg border border-white/20">
                  Antes (Terreno Original)
                </span>
              </div>
              <div className="absolute top-4 right-4 z-20 pointer-events-none">
                <span className="bg-brand-gold text-brand-dark text-xs font-black px-3 py-1 rounded-lg shadow-lg">
                  Después (Obra Culminada)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/10">
              <span>Arrastre el cursor o deslice horizontalmente para evaluar la alineación de perspectivas.</span>
              <button
                type="button"
                onClick={() => setInspectProject(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
              >
                Cerrar Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create / Edit Comparison Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
          <div className="relative bg-[#101b13] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-white/15 my-8 text-white">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-brand-gold/15 text-brand-gold mb-1.5">
                  <Sparkles className="w-3 h-3" />
                  {editingProject ? 'Edición de Obra' : 'Nuevo Registro'}
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {editingProject ? 'Editar Comparación Antes y Después' : 'Nueva Comparación Antes y Después'}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Suba las fotografías gemelas o ingrese sus URLs directas para habilitar el deslizador interactivo.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title input */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Título del Proyecto *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Pistas de Pádel Panorámicas de Competición"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-sm shadow-inner"
                />
              </div>

              {/* Location & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Ubicación (Ciudad, Departamento)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej: Floridablanca, Santander"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-sm shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Categoría / Especialidad
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Pádel', 'Fútbol', 'Parques', 'Paisajismo'].map((cat) => {
                      const isSelected = category === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setCategory(cat);
                            setCategoryColor(CATEGORY_CONFIG[cat]?.colorClass || 'bg-brand-green');
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                            isSelected
                              ? 'bg-brand-gold text-brand-dark border-brand-gold font-black shadow-md'
                              : 'bg-black/30 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Area & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Área Total (Opcional)
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Ej: 850 m²"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-sm shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Duración de Ejecución (Opcional)
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ej: 45 días"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/40 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-sm shadow-inner"
                  />
                </div>
              </div>

              {/* Dual Image Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* BEFORE Image Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setBeforeDragOver(true);
                  }}
                  onDragLeave={() => setBeforeDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setBeforeDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleBeforeFileSelected(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center text-center ${
                    beforeDragOver
                      ? 'border-brand-gold bg-brand-gold/10'
                      : 'border-white/15 bg-black/30 hover:border-white/30'
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    Foto: ANTES (Terreno Inicial) *
                  </span>

                  {beforePreview ? (
                    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 border border-white/15 bg-black shadow-md">
                      <Image src={beforePreview} alt="Vista previa Antes" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setBeforeFile(null);
                          setBeforePreview('');
                          setBeforeImageUrl('');
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/80 text-white hover:text-red-400"
                        title="Quitar imagen"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/10] rounded-xl bg-black/40 border border-white/5 flex flex-col items-center justify-center text-gray-500 mb-3 gap-1">
                      <UploadCloud className="w-8 h-8 text-gray-400" />
                      <span className="text-[11px] text-gray-400">Arrastre imagen aquí</span>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    id="before-file-input"
                    onChange={(e) => e.target.files?.[0] && handleBeforeFileSelected(e.target.files[0])}
                    className="hidden"
                  />
                  <label
                    htmlFor="before-file-input"
                    className="cursor-pointer text-xs font-bold text-brand-dark bg-white hover:bg-gray-100 px-4 py-2 rounded-xl shadow-md transition-all"
                  >
                    Examinar archivo
                  </label>

                  <input
                    type="text"
                    value={beforeImageUrl}
                    onChange={(e) => {
                      setBeforeImageUrl(e.target.value);
                      if (!beforeFile) setBeforePreview(e.target.value);
                    }}
                    placeholder="O pegue URL directa (https://...)"
                    className="mt-2.5 w-full text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-black/40 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-gold"
                  />
                </div>

                {/* AFTER Image Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setAfterDragOver(true);
                  }}
                  onDragLeave={() => setAfterDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setAfterDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleAfterFileSelected(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center text-center ${
                    afterDragOver
                      ? 'border-brand-gold bg-brand-gold/15'
                      : 'border-brand-gold/30 bg-brand-gold/5 hover:border-brand-gold/60'
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-wider text-brand-gold mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-gold" />
                    Foto: DESPUÉS (Resultado Final) *
                  </span>

                  {afterPreview ? (
                    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 border border-brand-gold/40 bg-black shadow-md">
                      <Image src={afterPreview} alt="Vista previa Después" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setAfterFile(null);
                          setAfterPreview('');
                          setAfterImageUrl('');
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/80 text-white hover:text-red-400"
                        title="Quitar imagen"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/10] rounded-xl bg-brand-gold/5 border border-brand-gold/15 flex flex-col items-center justify-center text-brand-gold/60 mb-3 gap-1">
                      <UploadCloud className="w-8 h-8 text-brand-gold" />
                      <span className="text-[11px] text-brand-gold/80">Arrastre imagen aquí</span>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    id="after-file-input"
                    onChange={(e) => e.target.files?.[0] && handleAfterFileSelected(e.target.files[0])}
                    className="hidden"
                  />
                  <label
                    htmlFor="after-file-input"
                    className="cursor-pointer text-xs font-black text-brand-dark bg-brand-gold hover:bg-yellow-400 px-4 py-2 rounded-xl shadow-md transition-all"
                  >
                    Examinar archivo
                  </label>

                  <input
                    type="text"
                    value={afterImageUrl}
                    onChange={(e) => {
                      setAfterImageUrl(e.target.value);
                      if (!afterFile) setAfterPreview(e.target.value);
                    }}
                    placeholder="O pegue URL directa (https://...)"
                    className="mt-2.5 w-full text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-black/40 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Interactive preview slider inside modal if both images are present */}
              {beforePreview && afterPreview && (
                <div className="pt-2">
                  <div className="text-xs font-bold text-gray-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Split className="w-3.5 h-3.5 text-brand-gold" />
                      Prueba Interactiva en Tiempo Real:
                    </span>
                    <span className="text-[10px] text-brand-gold font-bold">
                      Deslice el cursor para comprobar encuadres
                    </span>
                  </div>
                  <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-brand-gold/30 bg-black shadow-inner">
                    <Image src={afterPreview} alt="Después" fill className="object-cover" />
                    <div
                      className="absolute inset-0 z-10 overflow-hidden"
                      style={{ clipPath: `inset(0 ${100 - modalSliderPos}% 0 0)` }}
                    >
                      <Image src={beforePreview} alt="Antes" fill className="object-cover" />
                    </div>
                    {/* Divider Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white z-20 pointer-events-none shadow-[0_0_8px_white]"
                      style={{ left: `${modalSliderPos}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center shadow-2xl font-black text-xs border border-black">
                        &harr;
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={modalSliderPos}
                      onChange={(e) => setModalSliderPos(parseInt(e.target.value, 10))}
                      className="absolute inset-0 opacity-0 cursor-ew-resize z-30"
                    />
                  </div>
                </div>
              )}

              {/* Immediate publish toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="active-toggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-gold bg-black/40 border-white/20 focus:ring-brand-gold focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="active-toggle" className="text-xs font-bold text-gray-200 cursor-pointer">
                  Publicar inmediatamente en el carrusel de inicio
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-xs font-bold hover:bg-white/10 hover:text-white transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-dark text-xs font-black uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-lg hover:shadow-glow-gold flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingProject ? 'Guardar Cambios' : 'Crear Comparación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
