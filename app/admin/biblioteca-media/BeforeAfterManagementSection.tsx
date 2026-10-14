'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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

export default function BeforeAfterManagementSection() {
  const [projects, setProjects] = useState<BeforeAfterProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modal State
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

  // Interactive Slider state for test
  const [previewPosition, setPreviewPosition] = useState(50);

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

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle('');
    setLocation('');
    setCategory('Pádel');
    setCategoryColor('bg-emerald-600');
    setArea('');
    setDuration('');
    setIsActive(true);
    setBeforeFile(null);
    setAfterFile(null);
    setBeforeImageUrl('');
    setAfterImageUrl('');
    setBeforePreview('');
    setAfterPreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: BeforeAfterProjectItem) => {
    setEditingProject(p);
    setTitle(p.title);
    setLocation(p.location);
    setCategory(p.category);
    setCategoryColor(p.categoryColor || 'bg-brand-green');
    setArea(p.area || '');
    setDuration(p.duration || '');
    setIsActive(p.isActive);
    setBeforeFile(null);
    setAfterFile(null);
    setBeforeImageUrl(p.beforeImage);
    setAfterImageUrl(p.afterImage);
    setBeforePreview(p.beforeImage);
    setAfterPreview(p.afterImage);
    setIsModalOpen(true);
  };

  const handleBeforeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setBeforeFile(f);
      setBeforePreview(URL.createObjectURL(f));
    }
  };

  const handleAfterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setAfterFile(f);
      setAfterPreview(URL.createObjectURL(f));
    }
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
      loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cambiando visibilidad.');
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar esta comparación de Antes y Después?')) return;
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

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-dark text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            CMS de Transformaciones
          </div>
          <h2 className="text-2xl font-black text-brand-dark tracking-tight">
            Del Terreno al Resultado Final (Antes y Después)
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Administre las parejas fotográficas que demuestran la evolución técnica de las obras en la página de inicio.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-gold text-brand-dark font-black text-sm hover:bg-yellow-400 transition-all shadow-flat hover:shadow-glow-gold"
        >
          <Plus className="w-4 h-4" />
          Nueva Comparación
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
          <span>Cargando comparaciones...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
          <Sliders className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-700 mb-1">No hay proyectos de Antes y Después configurados</h3>
          <p className="text-sm text-gray-500 mb-4">Cree su primera comparación fotográfica para activar la sección en la web.</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-dark text-white text-sm font-bold"
          >
            <Plus className="w-4 h-4" /> Crear Comparación
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {projects.map((p, index) => (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between ${
                p.isActive ? 'border-gray-200/90' : 'border-gray-200 opacity-60 bg-gray-50/50'
              }`}
            >
              {/* Dual Thumbnail Comparison */}
              <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                  <Image src={p.beforeImage} alt={`${p.title} Antes`} fill sizes="130px" className="object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Antes
                  </span>
                </div>

                <div className="text-gray-400 font-black text-sm">&rarr;</div>

                <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-brand-gold/40 bg-gray-100">
                  <Image src={p.afterImage} alt={`${p.title} Después`} fill sizes="130px" className="object-cover" />
                  <span className="absolute bottom-1 right-1 bg-brand-gold text-brand-dark text-[9px] font-black px-1.5 py-0.5 rounded">
                    Después
                  </span>
                </div>
              </div>

              {/* Information */}
              <div className="flex-grow w-full md:w-auto">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${p.categoryColor}`}>
                    {p.category}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{p.location}</span>
                </div>
                <h3 className="text-lg font-black text-brand-dark">{p.title}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  {p.area && <span>Área: <strong>{p.area}</strong></span>}
                  {p.duration && <span>Duración: <strong>{p.duration}</strong></span>}
                  <span>Posición: #{index + 1}</span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                <button
                  onClick={() => moveOrder(index, 'up')}
                  disabled={index === 0}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                  title="Subir posición"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveOrder(index, 'down')}
                  disabled={index === projects.length - 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                  title="Bajar posición"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleActive(p)}
                  className={`p-2 rounded-lg border ${
                    p.isActive
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 bg-gray-100 text-gray-400'
                  }`}
                  title={p.isActive ? 'Publicado' : 'Oculto'}
                >
                  {p.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => openEditModal(p)}
                  className="p-2 rounded-lg border border-gray-200 text-brand-dark hover:bg-gray-100"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteProject(p.id)}
                  className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation / Edition Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8">
            <h3 className="text-xl font-black text-brand-dark mb-1">
              {editingProject ? 'Editar Comparación' : 'Nueva Comparación Antes y Después'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Suba las fotografías gemelas o ingrese sus URLs para habilitar el deslizador interactivo.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Título del Proyecto *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Pistas de Pádel Panorámicas de Competición"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej: Bucaramanga, Santander"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      if (e.target.value === 'Pádel') setCategoryColor('bg-emerald-600');
                      else if (e.target.value === 'Fútbol') setCategoryColor('bg-green-600');
                      else if (e.target.value === 'Parques') setCategoryColor('bg-brand-gold');
                      else setCategoryColor('bg-amber-600');
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold text-sm bg-white"
                  >
                    <option value="Pádel">Pádel</option>
                    <option value="Fútbol">Fútbol</option>
                    <option value="Parques">Parques</option>
                    <option value="Paisajismo">Paisajismo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Área (opcional)
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Ej: 400 m²"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Duración (opcional)
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ej: 30 días"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold text-sm"
                  />
                </div>
              </div>

              {/* Dual Image Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* BEFORE Image */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center text-center">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-600 mb-2">
                    Foto: ANTES (Terreno / Obra Inicial) *
                  </span>
                  {beforePreview ? (
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-2 border border-gray-200">
                      <Image src={beforePreview} alt="Vista previa Antes" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] rounded-xl bg-gray-200/60 flex items-center justify-center text-gray-400 mb-2">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    id="before-file-input"
                    onChange={handleBeforeFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="before-file-input"
                    className="cursor-pointer text-xs font-bold text-brand-dark bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-100"
                  >
                    Subir Archivo de Antes
                  </label>
                  <input
                    type="text"
                    value={beforeImageUrl}
                    onChange={(e) => {
                      setBeforeImageUrl(e.target.value);
                      if (!beforeFile) setBeforePreview(e.target.value);
                    }}
                    placeholder="O ingrese URL directa"
                    className="mt-2 w-full text-xs px-2.5 py-1.5 rounded border border-gray-200 bg-white"
                  />
                </div>

                {/* AFTER Image */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-brand-gold/40 bg-brand-gold/5 flex flex-col items-center text-center">
                  <span className="text-xs font-black uppercase tracking-wider text-brand-dark mb-2">
                    Foto: DESPUÉS (Resultado Final) *
                  </span>
                  {afterPreview ? (
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-2 border border-brand-gold/30">
                      <Image src={afterPreview} alt="Vista previa Después" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-2">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    id="after-file-input"
                    onChange={handleAfterFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="after-file-input"
                    className="cursor-pointer text-xs font-bold text-brand-dark bg-brand-gold px-3 py-1.5 rounded-lg shadow-sm hover:bg-yellow-400"
                  >
                    Subir Archivo de Después
                  </label>
                  <input
                    type="text"
                    value={afterImageUrl}
                    onChange={(e) => {
                      setAfterImageUrl(e.target.value);
                      if (!afterFile) setAfterPreview(e.target.value);
                    }}
                    placeholder="O ingrese URL directa"
                    className="mt-2 w-full text-xs px-2.5 py-1.5 rounded border border-gray-200 bg-white"
                  />
                </div>
              </div>

              {/* Interactive preview slider inside modal if both images present */}
              {beforePreview && afterPreview && (
                <div className="pt-2">
                  <div className="text-xs font-bold text-gray-600 mb-1 flex items-center justify-between">
                    <span>Prueba Interactiva del Deslizador:</span>
                    <span className="text-[10px] text-brand-gold font-bold">Arrastra el cursor</span>
                  </div>
                  <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-gray-200">
                    {/* After Image underneath */}
                    <Image src={afterPreview} alt="Después" fill className="object-cover" />
                    {/* Before Image clipped */}
                    <div
                      className="absolute inset-0 z-10"
                      style={{ clipPath: `inset(0 ${100 - previewPosition}% 0 0)` }}
                    >
                      <Image src={beforePreview} alt="Antes" fill className="object-cover" />
                    </div>
                    {/* Divider Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white z-20"
                      style={{ left: `${previewPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center shadow-lg text-[10px] font-black">
                        &harr;
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={previewPosition}
                      onChange={(e) => setPreviewPosition(parseInt(e.target.value, 10))}
                      className="absolute inset-0 opacity-0 cursor-ew-resize z-30"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="active-toggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-brand-gold focus:ring-brand-gold"
                />
                <label htmlFor="active-toggle" className="text-xs font-bold text-gray-700">
                  Publicar inmediatamente en el sitio web
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-dark text-sm font-black hover:bg-yellow-400 transition-all shadow-flat flex items-center gap-2 disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
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
