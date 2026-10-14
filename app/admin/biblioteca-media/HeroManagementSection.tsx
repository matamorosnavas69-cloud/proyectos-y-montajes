'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sliders,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Plus,
  Save,
  Monitor,
  Smartphone,
  AlertTriangle,
  Image as ImageIcon,
  Crosshair,
  CheckCircle2,
  X,
  Search,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import ServiceHeroSlider, { HeroSlide } from '@/app/components/ServiceHeroSlider';
import { ServiceKey, SERVICE_LABELS, SERVICE_PATH_MAP, DEFAULT_HERO_SLIDES } from '@/lib/hero-constants';

export interface AdminSlide {
  id: string;
  src: string;
  alt: string;
  title: string;
  location: string;
  tag: string;
  focalX: number;
  focalY: number;
  sortOrder: number;
  isActive: boolean;
  assetId?: string | null;
}

interface LibraryItem {
  filename: string;
  url: string;
  category: string;
}

export default function HeroManagementSection() {
  const [activeService, setActiveService] = useState<ServiceKey>('canchas');
  const [slides, setSlides] = useState<AdminSlide[]>([]);
  const [initialSlides, setInitialSlides] = useState<AdminSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Preview controls
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Asset picker modal state
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerTargetIndex, setPickerTargetIndex] = useState<number | null>(null); // null means 'add new slide'
  const [libraryAssets, setLibraryAssets] = useState<LibraryItem[]>([]);
  const [pickerFilterCategory, setPickerFilterCategory] = useState<string>('all');
  const [pickerSearch, setPickerSearch] = useState('');
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  // Fetch admin slides for active service
  const fetchSlides = useCallback(async (service: ServiceKey) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/hero-slides?service=${service}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No fue posible cargar las diapositivas.');

      const mapped: AdminSlide[] = (data.slides || []).map((s: any, idx: number) => ({
        id: s.id || `slide-${idx}`,
        src: s.src,
        alt: s.alt || '',
        title: s.title || '',
        location: s.location || '',
        tag: s.tag || '',
        focalX: s.focalX ?? 50,
        focalY: s.focalY ?? 50,
        sortOrder: s.sortOrder ?? idx,
        isActive: s.isActive ?? true,
        assetId: s.assetId,
      }));

      setSlides(mapped);
      setInitialSlides(mapped);
      setActiveSlideIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides(activeService);
  }, [activeService, fetchSlides]);

  // Load library assets when picker opens
  const openPicker = async (targetIndex: number | null) => {
    setPickerTargetIndex(targetIndex);
    setIsPickerOpen(true);
    setPickerSearch('');
    if (libraryAssets.length === 0) {
      setLoadingLibrary(true);
      try {
        const res = await fetch('/api/admin/media-library', { cache: 'no-store' });
        const data = await res.json();
        const items: LibraryItem[] = [];
        if (Array.isArray(data.categories)) {
          data.categories.forEach((cat: any) => {
            if (Array.isArray(cat.assets)) {
              cat.assets.forEach((a: any) => {
                items.push({
                  filename: a.filename,
                  url: a.url,
                  category: cat.slug,
                });
              });
            }
          });
        }
        setLibraryAssets(items);
      } catch (err) {
        console.warn('Failed loading library for picker:', err);
      } finally {
        setLoadingLibrary(false);
      }
    }
  };

  const handleSelectAsset = (item: LibraryItem) => {
    if (pickerTargetIndex === null) {
      // Add new slide
      const newSlide: AdminSlide = {
        id: `new-${Date.now()}`,
        src: item.url,
        alt: `Instalación de obra en ${item.category}`,
        title: `Proyecto ${item.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')}`,
        location: 'Colombia',
        tag: SERVICE_LABELS[activeService],
        focalX: 50,
        focalY: 50,
        sortOrder: slides.length,
        isActive: true,
      };
      setSlides((prev) => [...prev, newSlide]);
      setActiveSlideIndex(slides.length);
    } else {
      // Replace existing slide image
      setSlides((prev) =>
        prev.map((s, idx) =>
          idx === pickerTargetIndex
            ? {
                ...s,
                src: item.url,
                alt: s.alt || `Fotografía de ${item.filename}`,
              }
            : s
        )
      );
    }
    setIsPickerOpen(false);
  };

  // Reorder slides
  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    setSlides((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next.map((s, idx) => ({ ...s, sortOrder: idx }));
    });

    setActiveSlideIndex(targetIndex);
  };

  // Toggle slide active status
  const toggleActive = (index: number) => {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // Remove slide from hero
  const removeSlide = (index: number) => {
    if (slides.length <= 1) {
      alert('El Hero debe conservar al menos una diapositiva.');
      return;
    }
    if (!window.confirm('¿Desea retirar esta diapositiva del Hero? (La fotografía no se borrará de la biblioteca)')) {
      return;
    }
    setSlides((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      return next.map((s, idx) => ({ ...s, sortOrder: idx }));
    });
    setActiveSlideIndex((prev) => Math.max(0, prev - 1));
  };

  // Field change
  const updateField = (index: number, field: keyof AdminSlide, value: any) => {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, [field]: value } : s))
    );
  };

  // Check if dirty
  const isDirty = useMemo(() => {
    return JSON.stringify(slides) !== JSON.stringify(initialSlides);
  }, [slides, initialSlides]);

  // Save changes
  const saveChanges = async () => {
    setIsSaving(true);
    setError(null);
    setNotice(null);
    try {
      const payload = slides.map((s, idx) => ({
        id: s.id.startsWith('new-') ? undefined : s.id,
        src: s.src,
        alt: s.alt,
        title: s.title,
        location: s.location || null,
        tag: s.tag || null,
        focalX: s.focalX,
        focalY: s.focalY,
        sortOrder: idx,
        isActive: s.isActive,
      }));

      const res = await fetch('/api/admin/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: activeService, slides: payload }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar los cambios.');

      setNotice('✅ Configuración publicada exitosamente. Los cambios están activos en la web.');
      setInitialSlides(slides);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado al guardar.');
    } finally {
      setIsSaving(false);
    }
  };

  // Discard changes
  const discardChanges = () => {
    if (window.confirm('¿Descartar todos los cambios no guardados?')) {
      setSlides(initialSlides);
      setError(null);
      setNotice(null);
    }
  };

  // Filtered picker items
  const filteredPickerAssets = useMemo(() => {
    return libraryAssets.filter((item) => {
      const matchesCategory =
        pickerFilterCategory === 'all' || item.category === pickerFilterCategory;
      const matchesSearch =
        !pickerSearch.trim() ||
        item.filename.toLowerCase().includes(pickerSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [libraryAssets, pickerFilterCategory, pickerSearch]);

  // Slides ready for preview
  const previewSlides: HeroSlide[] = useMemo(() => {
    const activeOnes = slides.filter((s) => s.isActive);
    if (activeOnes.length === 0) {
      return (DEFAULT_HERO_SLIDES[activeService] || []).map((s) => ({ ...s }));
    }
    return activeOnes.map((s) => ({
      src: s.src,
      alt: s.alt,
      title: s.title,
      location: s.location,
      tag: s.tag,
      focalPoint: `${s.focalX}% ${s.focalY}%`,
      focalX: s.focalX,
      focalY: s.focalY,
    }));
  }, [slides, activeService]);

  const currentSlide = slides[activeSlideIndex] || slides[0];

  return (
    <div className="space-y-6">
      {/* Service Selector & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111c13] border border-white/10 p-4 rounded-2xl shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          {(['canchas', 'parques', 'paisajismo'] as ServiceKey[]).map((key) => {
            const isSelected = activeService === key;
            return (
              <button
                key={key}
                onClick={() => {
                  if (isDirty && !window.confirm('Tiene cambios no guardados. ¿Desea cambiar de servicio sin guardar?')) {
                    return;
                  }
                  setActiveService(key);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-brand-gold text-brand-dark shadow-md font-black'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{key === 'canchas' ? '🎾' : key === 'parques' ? '🏰' : '🌿'}</span>
                <span>{SERVICE_LABELS[key]}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            href={SERVICE_PATH_MAP[activeService]}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-brand-gold bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span>Ver en vivo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {isDirty && (
            <button
              onClick={discardChanges}
              disabled={isSaving}
              className="px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-red-500/20 transition-colors"
            >
              Descartar
            </button>
          )}

          <button
            onClick={saveChanges}
            disabled={!isDirty || isSaving}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all ${
              isDirty
                ? 'bg-brand-green text-white hover:bg-emerald-600 shadow-brand-green/20 cursor-pointer animate-pulse'
                : 'bg-white/10 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Guardando…' : isDirty ? 'Guardar y Publicar' : 'Sin cambios'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {(notice || error) && (
        <div
          className={`flex items-start gap-2 p-3.5 rounded-xl text-xs border ${
            error
              ? 'border-red-500/40 bg-red-500/10 text-red-200'
              : 'border-brand-green/40 bg-brand-green/10 text-emerald-200'
          }`}
        >
          {error ? <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-gold" />}
          <span>{error || notice}</span>
        </div>
      )}

      {/* Main CMS Layout: 2 Columns (Left: Slide List & Inspector / Right: Live Interactive Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Slide Cards & Inspector (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#131d16] border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-gold" />
                  <span>Diapositivas de {SERVICE_LABELS[activeService]}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {slides.length} diapositivas configuradas ({slides.filter((s) => s.isActive).length} activas en la web)
                </p>
              </div>

              <button
                onClick={() => openPicker(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-gold text-brand-dark hover:bg-yellow-400 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir diapositiva</span>
              </button>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center gap-2 text-xs text-gray-400">
                <RefreshCw className="w-4 h-4 animate-spin text-brand-gold" />
                Cargando diapositivas...
              </div>
            ) : slides.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">
                No hay diapositivas configuradas. Añada la primera desde la biblioteca.
              </div>
            ) : (
              <div className="space-y-3">
                {slides.map((slide, idx) => {
                  const isSelected = activeSlideIndex === idx;
                  return (
                    <div
                      key={slide.id}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`group relative rounded-xl border p-3.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-brand-gold/60 bg-[#17251c] shadow-lg ring-1 ring-brand-gold/30'
                          : 'border-white/10 bg-[#0e1610] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Thumbnail with focal point indicator */}
                        <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-black/60 shrink-0 border border-white/10">
                          <Image
                            src={slide.src}
                            alt={slide.alt || 'Miniatura'}
                            fill
                            sizes="80px"
                            style={{ objectPosition: `${slide.focalX}% ${slide.focalY}%` }}
                            className="object-cover"
                          />
                          <div
                            className="absolute w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_6px_#d4af37] border border-black pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${slide.focalX}%`, top: `${slide.focalY}%` }}
                            title={`Punto focal: ${slide.focalX}%, ${slide.focalY}%`}
                          />
                        </div>

                        {/* Title & Tag */}
                        <div className="min-w-0 flex-grow">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-green/30 text-emerald-300">
                              0{idx + 1}
                            </span>
                            <span className="text-[11px] text-brand-gold font-semibold truncate">
                              {slide.tag || 'Sin categoría'}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-white truncate leading-tight">
                            {slide.title || 'Sin título'}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {slide.location || 'Sin ubicación'}
                          </p>
                        </div>

                        {/* Ordering & Visibility Controls */}
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            title="Subir posición"
                            disabled={idx === 0}
                            onClick={() => moveSlide(idx, 'up')}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Bajar posición"
                            disabled={idx === slides.length - 1}
                            onClick={() => moveSlide(idx, 'down')}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title={slide.isActive ? 'Ocultar diapositiva' : 'Activar diapositiva'}
                            onClick={() => toggleActive(idx)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              slide.isActive
                                ? 'text-emerald-400 hover:bg-emerald-500/20'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            {slide.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            title="Retirar diapositiva del Hero"
                            onClick={() => removeSlide(idx)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Slide Metadata & Composition Inspector */}
          {currentSlide && (
            <div className="bg-[#131d16] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-gold" />
                  <span>Editando Diapositiva 0{activeSlideIndex + 1}</span>
                </h4>
                <button
                  onClick={() => openPicker(activeSlideIndex)}
                  className="inline-flex items-center gap-1.5 text-xs text-brand-gold hover:text-yellow-300 font-bold"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Cambiar fotografía</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Título de la Obra
                  </label>
                  <input
                    type="text"
                    value={currentSlide.title}
                    onChange={(e) => updateField(activeSlideIndex, 'title', e.target.value)}
                    placeholder="Ej. Pista de Pádel Panorámica"
                    className="w-full rounded-xl border border-white/10 bg-brand-dark px-3 py-2 text-xs text-white placeholder:text-gray-600 outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Especialidad / Etiqueta
                  </label>
                  <input
                    type="text"
                    value={currentSlide.tag}
                    onChange={(e) => updateField(activeSlideIndex, 'tag', e.target.value)}
                    placeholder="Ej. Pádel Panorámico"
                    className="w-full rounded-xl border border-white/10 bg-brand-dark px-3 py-2 text-xs text-white placeholder:text-gray-600 outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Ubicación / Procedencia
                  </label>
                  <input
                    type="text"
                    value={currentSlide.location}
                    onChange={(e) => updateField(activeSlideIndex, 'location', e.target.value)}
                    placeholder="Ej. Complejo Deportivo Club"
                    className="w-full rounded-xl border border-white/10 bg-brand-dark px-3 py-2 text-xs text-white placeholder:text-gray-600 outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Texto Alternativo (Accesibilidad)
                  </label>
                  <input
                    type="text"
                    value={currentSlide.alt}
                    onChange={(e) => updateField(activeSlideIndex, 'alt', e.target.value)}
                    placeholder="Descripción detallada para lectores de pantalla"
                    className="w-full rounded-xl border border-white/10 bg-brand-dark px-3 py-2 text-xs text-white placeholder:text-gray-600 outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Composition: 2D Focal Point Selector */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Control de Encuadre y Punto Focal</span>
                  </label>
                  <span className="text-[11px] font-mono text-brand-gold">
                    X: {currentSlide.focalX}% · Y: {currentSlide.focalY}%
                  </span>
                </div>

                <p className="text-[11px] text-gray-400 mb-3">
                  Haga clic sobre la imagen para fijar el centro de interés y evitar que canchas o estructuras se recorten.
                </p>

                {/* Interactive Click-to-Point Frame */}
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                    updateField(activeSlideIndex, 'focalX', Math.max(0, Math.min(100, x)));
                    updateField(activeSlideIndex, 'focalY', Math.max(0, Math.min(100, y)));
                  }}
                  className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black cursor-crosshair border border-white/20 group select-none"
                >
                  <Image
                    src={currentSlide.src}
                    alt={currentSlide.alt || 'Encuadre'}
                    fill
                    sizes="400px"
                    style={{ objectPosition: `${currentSlide.focalX}% ${currentSlide.focalY}%` }}
                    className="object-cover pointer-events-none"
                  />
                  {/* Grid Lines */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-white" />
                    <div className="border-r border-white" />
                    <div />
                  </div>
                  {/* Focal Target Reticle */}
                  <div
                    className="absolute w-6 h-6 rounded-full border-2 border-brand-gold bg-brand-gold/20 shadow-[0_0_10px_#d4af37] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
                    style={{ left: `${currentSlide.focalX}%`, top: `${currentSlide.focalY}%` }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  </div>
                </div>

                {/* Preset Quick Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] uppercase font-bold text-gray-500 mr-1">Preajustes:</span>
                  {[
                    { label: 'Centro', x: 50, y: 50 },
                    { label: 'Arriba', x: 50, y: 20 },
                    { label: 'Abajo', x: 50, y: 80 },
                    { label: 'Izquierda', x: 20, y: 50 },
                    { label: 'Derecha', x: 80, y: 50 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        updateField(activeSlideIndex, 'focalX', p.x);
                        updateField(activeSlideIndex, 'focalY', p.y);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-4 sticky top-6">
          <div className="bg-[#131d16] border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-brand-gold" />
                  <span>Previsualización Fiel del Hero</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Componente real con encuadres e indicadores sutiles difuminados
                </p>
              </div>

              {/* Desktop vs Mobile Toggle */}
              <div className="inline-flex rounded-xl bg-black/40 p-1 border border-white/10 text-xs">
                <button
                  onClick={() => setPreviewViewport('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all ${
                    previewViewport === 'desktop'
                      ? 'bg-brand-green text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Escritorio</span>
                </button>
                <button
                  onClick={() => setPreviewViewport('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all ${
                    previewViewport === 'mobile'
                      ? 'bg-brand-gold text-brand-dark shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Móvil</span>
                </button>
              </div>
            </div>

            {/* Embedded Live Preview Container */}
            <div
              className={`mx-auto transition-all duration-300 rounded-2xl overflow-hidden border border-brand-green/30 bg-black shadow-2xl ${
                previewViewport === 'mobile' ? 'max-w-[390px]' : 'w-full'
              }`}
            >
              <div className="transform scale-95 origin-top">
                <ServiceHeroSlider
                  badge={SERVICE_LABELS[activeService]}
                  title={
                    activeService === 'canchas'
                      ? 'Canchas Deportivas y'
                      : activeService === 'parques'
                      ? 'Parques Infantiles y'
                      : 'Diseño de Paisajismo y'
                  }
                  titleAccent={
                    activeService === 'canchas'
                      ? 'Pistas de Pádel'
                      : activeService === 'parques'
                      ? 'Pisos de Seguridad'
                      : 'Terrazas Residenciales'
                  }
                  description={
                    activeService === 'canchas'
                      ? 'Diseñamos y construimos infraestructura deportiva de alto rendimiento bajo estándares WPT y FIFA.'
                      : activeService === 'parques'
                      ? 'Módulos lúdicos certificados, pisos amortiguantes EPDM y circuitos recreativos integrales.'
                      : 'Grama sintética decorativa premium, jardines verticales y sistemas de drenaje sin mantenimiento.'
                  }
                  stats={
                    activeService === 'canchas'
                      ? [
                          { value: '20+ Años', label: 'Experiencia' },
                          { value: 'FIP / WPT', label: 'Medidas' },
                          { value: 'Hasta 8 Años', label: 'Garantía UV' },
                        ]
                      : activeService === 'parques'
                      ? [
                          { value: '20+ Años', label: 'Obras' },
                          { value: 'EN-1177', label: 'Criterio HIC' },
                          { value: 'EPDM', label: 'Caucho Continuo' },
                        ]
                      : [
                          { value: 'Cero Riego', label: 'Eficiencia' },
                          { value: 'Hasta 8 Años', label: 'Garantía UV' },
                          { value: 'Pet-Safe', label: 'Atérmico' },
                        ]
                  }
                  slides={previewSlides}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Asset Picker Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-brand-green/40 bg-[#0d1610] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-brand-gold" />
                  <span>
                    {pickerTargetIndex === null
                      ? 'Seleccionar fotografía para nueva diapositiva'
                      : `Reemplazar fotografía de la Diapositiva 0${pickerTargetIndex + 1}`}
                  </span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Elija una imagen existente de la biblioteca visual para vincular al Hero
                </p>
              </div>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between bg-black/30">
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {['all', 'canchas', 'parques', 'residencial', 'piscina', 'golf'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPickerFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                      pickerFilterCategory === cat
                        ? 'bg-brand-green text-white shadow'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat === 'all' ? 'Todas' : cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="w-full rounded-xl border border-white/10 bg-brand-dark px-8 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            {/* Modal Body: Assets Grid */}
            <div className="p-5 overflow-y-auto flex-grow max-h-[55vh]">
              {loadingLibrary ? (
                <div className="py-20 flex flex-col items-center justify-center gap-2 text-xs text-gray-400">
                  <RefreshCw className="w-6 h-6 animate-spin text-brand-gold" />
                  <span>Cargando biblioteca de imágenes...</span>
                </div>
              ) : filteredPickerAssets.length === 0 ? (
                <div className="py-16 text-center text-xs text-gray-400">
                  No se encontraron fotografías con los filtros aplicados.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredPickerAssets.map((item) => (
                    <div
                      key={item.url}
                      onClick={() => handleSelectAsset(item)}
                      className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-black/60 border border-white/10 hover:border-brand-gold transition-all cursor-pointer shadow-md"
                    >
                      <Image
                        src={item.url}
                        alt={item.filename}
                        fill
                        sizes="200px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">
                          {item.category}
                        </span>
                        <p className="text-[11px] font-semibold text-white truncate">
                          {item.filename}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex justify-end bg-black/40">
              <button
                onClick={() => setIsPickerOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
