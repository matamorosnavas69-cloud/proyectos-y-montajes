'use client';

import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive,
  CheckCircle2,
  FileImage,
  FolderKanban,
  FolderOpen,
  ImagePlus,
  Layers,
  Loader2,
  Pencil,
  RotateCcw,
  Search,
  Sliders,
  Sparkles,
  Tag,
  UploadCloud,
  X,
} from 'lucide-react';
import HeroManagementSection from './HeroManagementSection';
import BeforeAfterManagementSection from './BeforeAfterManagementSection';

type Asset = {
  id?: string;
  filename: string;
  originalCategory?: string;
  url: string;
  bytes: number;
  updatedAt: string;
  category: string;
  subcategory: string;
  title: string;
  badge?: string;
};

type Category = { slug: string; label: string; description: string; assets: Asset[] };
type ArchivedAsset = { id: string; category: string; filename: string; url: string; archivedAt: string; archivedBy?: string };

const CATEGORY_OPTIONS = [
  { slug: 'canchas', label: 'Canchas Deportivas' },
  { slug: 'parques', label: 'Parques Infantiles' },
  { slug: 'piscina', label: 'Piscinas y Zonas Húmedas' },
  { slug: 'golf', label: 'Golf y Putting Greens' },
  { slug: 'residencial', label: 'Residencial y Paisajismo' },
];

const SUBCAT_OPTIONS: Record<string, { id: string; label: string }[]> = {
  canchas: [
    { id: 'padel', label: 'Pádel Panorámico' },
    { id: 'futbol', label: 'Fútbol Sintético' },
    { id: 'golf', label: 'Greens de Golf' },
    { id: 'polideportivo', label: 'Polideportivo' },
    { id: 'general', label: 'General / Canchas' },
  ],
  parques: [
    { id: 'modulos', label: 'Módulos y Castillos' },
    { id: 'caucho', label: 'Pisos de Caucho EPDM' },
    { id: 'inclusivos', label: 'Juegos Inclusivos' },
    { id: 'bio-saludable', label: 'Gimnasios Bio-saludables' },
    { id: 'general', label: 'General / Parques' },
  ],
  piscina: [
    { id: 'piscinas', label: 'Piscinas y Wet Decks' },
    { id: 'deck', label: 'Decks y Soláriums' },
    { id: 'general', label: 'General / Piscinas' },
  ],
  golf: [
    { id: 'golf', label: 'Greens y Putting' },
    { id: 'paisajismo-golf', label: 'Paisajismo de Campo' },
    { id: 'general', label: 'General / Golf' },
  ],
  residencial: [
    { id: 'terrazas', label: 'Terrazas y Áticos' },
    { id: 'jardines', label: 'Jardines Residenciales' },
    { id: 'zonas-comunes', label: 'Zonas Comunes' },
    { id: 'piscinas', label: 'Piscinas Residenciales' },
    { id: 'general', label: 'General / Residencial' },
  ],
};

function formatBytes(value: number) {
  if (!value) return '';
  return value > 1024 * 1024 ? `${(value / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(value / 1024))} KB`;
}

export default function MediaLibraryPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [topTab, setTopTab] = useState<'library' | 'heroes' | 'before-after' | 'archived'>('library');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'heroes' || tabParam === 'before-after' || tabParam === 'archived' || tabParam === 'library') {
        setTopTab(tabParam as any);
      }
    }
  }, []);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('canchas');
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');
  const [archivedList, setArchivedList] = useState<ArchivedAsset[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);

  // Category & Subcategory UI editor modal state
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [targetCategory, setTargetCategory] = useState<string>('canchas');
  const [targetSubcategory, setTargetSubcategory] = useState<string>('general');
  const [customSubcategory, setCustomSubcategory] = useState<string>('');
  const [targetTitle, setTargetTitle] = useState<string>('');
  const [targetBadge, setTargetBadge] = useState<string>('');
  const [isSavingMetadata, setIsSavingMetadata] = useState(false);

  function openCategoryEditor(asset: Asset) {
    setEditingAsset(asset);
    const cat = asset.category || selectedCategory;
    setTargetCategory(cat);
    const presets = SUBCAT_OPTIONS[cat] || [];
    const isPreset = presets.some((p) => p.id === asset.subcategory);
    if (isPreset) {
      setTargetSubcategory(asset.subcategory || presets[0]?.id || 'general');
      setCustomSubcategory('');
    } else if (asset.subcategory && asset.subcategory !== 'general') {
      setTargetSubcategory('__custom__');
      setCustomSubcategory(asset.subcategory);
    } else {
      setTargetSubcategory(presets[0]?.id || 'general');
      setCustomSubcategory('');
    }
    setTargetTitle(asset.title || '');
    setTargetBadge(asset.badge || '');
  }

  async function handleSaveMetadata(e: React.FormEvent) {
    e.preventDefault();
    if (!editingAsset) return;
    setIsSavingMetadata(true);
    setError(null);
    setNotice(null);

    const finalSubcategory =
      targetSubcategory === '__custom__' ? customSubcategory.trim() : targetSubcategory.trim();

    try {
      const response = await fetch('/api/admin/media-library', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-metadata',
          filename: editingAsset.filename,
          originalCategory: editingAsset.originalCategory || editingAsset.category || selectedCategory,
          newCategory: targetCategory,
          subcategory: finalSubcategory || null,
          title: targetTitle.trim() || null,
          badge: targetBadge.trim() || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No fue posible actualizar la categorización.');
      setNotice(`Categoría y subcategoría actualizadas con éxito.`);
      setEditingAsset(null);
      await loadLibrary();
    } catch (saveErr) {
      setError(saveErr instanceof Error ? saveErr.message : 'Error al guardar metadatos.');
    } finally {
      setIsSavingMetadata(false);
    }
  }

  const loadLibrary = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/media-library', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No fue posible cargar la biblioteca.');
      setCategories(data.categories || []);

      // Also load archived count
      const archRes = await fetch('/api/admin/media-library?view=archived', { cache: 'no-store' });
      const archData = await archRes.json();
      if (archRes.ok && Array.isArray(archData.archived)) {
        setArchivedList(archData.archived);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No fue posible cargar la biblioteca.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadLibrary(); }, [loadLibrary]);

  const activeCategory = categories.find((category) => category.slug === selectedCategory) || categories[0];
  
  const filteredActiveAssets = useMemo(
    () => (activeCategory?.assets || []).filter((asset) => asset.filename.toLowerCase().includes(search.trim().toLowerCase())),
    [activeCategory, search]
  );

  const filteredArchivedAssets = useMemo(
    () => archivedList.filter((a) => a.category === selectedCategory && a.filename.toLowerCase().includes(search.trim().toLowerCase())),
    [archivedList, selectedCategory, search]
  );

  const totalAssets = categories.reduce((total, category) => total + category.assets.length, 0);
  const totalArchived = archivedList.length;

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setError(null); setNotice(null); setIsUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('category', selectedCategory);
        formData.append('file', file);
        const response = await fetch('/api/admin/media-library', { method: 'POST', body: formData });
        const data = await response.json();
        if (!response.ok) throw new Error(`${file.name}: ${data.error || 'No se pudo subir.'}`);
      }
      setNotice(`${files.length} ${files.length === 1 ? 'imagen incorporada' : 'imágenes incorporadas'} a ${activeCategory?.label || 'la categoría'}.`);
      await loadLibrary();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'No fue posible subir las imágenes.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function renameAsset(asset: Asset) {
    const currentName = asset.filename.replace(/\.[^.]+$/, '');
    const nextName = window.prompt('Nombre descriptivo del archivo (la extensión se conserva):', currentName);
    if (!nextName || nextName.trim() === currentName) return;
    setError(null); setNotice(null); setRenaming(asset.filename);
    try {
      const response = await fetch('/api/admin/media-library', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: selectedCategory, filename: asset.filename, newName: nextName.trim() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No fue posible renombrar la imagen.');
      setNotice('Imagen renombrada exitosamente.');
      await loadLibrary();
    } catch (renameError) {
      setError(renameError instanceof Error ? renameError.message : 'No fue posible renombrar la imagen.');
    } finally {
      setRenaming(null);
    }
  }

  async function archiveAsset(asset: Asset) {
    if (!window.confirm(`¿Retirar “${asset.filename}” de ${activeCategory?.label}? Se archivará de forma segura y dejará de mostrarse en la web.`)) return;
    setError(null); setNotice(null);
    try {
      const response = await fetch('/api/admin/media-library', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: selectedCategory, filename: asset.filename })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No fue posible retirar la imagen.');
      setNotice(data.message || 'Imagen retirada y archivada con éxito.');
      await loadLibrary();
    } catch (archiveError) {
      setError(archiveError instanceof Error ? archiveError.message : 'No fue posible retirar la imagen.');
    }
  }

  async function restoreAsset(asset: ArchivedAsset) {
    if (!window.confirm(`¿Restaurar “${asset.filename}” a la galería de ${activeCategory?.label}? Volverá a mostrarse en la web pública.`)) return;
    setError(null); setNotice(null); setRestoring(asset.filename);
    try {
      const response = await fetch('/api/admin/media-library', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore', category: selectedCategory, filename: asset.filename })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No fue posible restaurar la imagen.');
      setNotice(data.message || 'Imagen restaurada a la galería activa.');
      await loadLibrary();
    } catch (restoreError) {
      setError(restoreError instanceof Error ? restoreError.message : 'No fue posible restaurar la imagen.');
    } finally {
      setRestoring(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-brand-green/30 bg-gradient-to-r from-[#0d1610] via-[#142318] to-[#0d1610] p-7 md:p-8 shadow-2xl">
        <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-brand-gold/10 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-[11px] font-black uppercase tracking-widest mb-4">
              <FolderOpen className="w-3.5 h-3.5" /> Biblioteca visual
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Activos de la galería pública</h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              Administre las imágenes que alimentan la galería de inicio por especialidad. Los cambios son controlados por rol y los retiros quedan archivados en base de datos para recuperación.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 shrink-0">
            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Activas</p>
              <p className="text-2xl font-black text-white">{totalAssets}</p>
            </div>
            <div className="rounded-xl border border-brand-gold/20 bg-brand-gold/10 px-4 py-3">
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-gold/80">Archivadas</p>
              <p className="text-2xl font-black text-brand-gold">{totalArchived}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 col-span-2 md:col-span-1">
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Categorías</p>
              <p className="text-2xl font-black text-white">{categories.length || 5}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Section Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
        <button
          onClick={() => {
            setTopTab('library');
            setViewMode('active');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            topTab === 'library'
              ? 'bg-brand-green text-white shadow-lg shadow-brand-green/30 border border-brand-gold/30'
              : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <FolderOpen className="w-4 h-4 text-brand-gold" />
          <span>Biblioteca</span>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-black/40 text-emerald-300 border border-emerald-500/20">
            {totalAssets}
          </span>
        </button>

        <button
          onClick={() => setTopTab('heroes')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            topTab === 'heroes'
              ? 'bg-brand-green text-white shadow-lg shadow-brand-green/30 border border-brand-gold/30'
              : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Sliders className="w-4 h-4 text-brand-gold" />
          <span>Heroes de Servicios</span>
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-brand-gold border border-brand-gold/20">
            Sliders
          </span>
        </button>

        <button
          onClick={() => setTopTab('before-after')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            topTab === 'before-after'
              ? 'bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold text-brand-dark shadow-lg shadow-brand-gold/20 border border-brand-gold'
              : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Sparkles className="w-4 h-4 text-brand-dark" />
          <span>Antes y Después</span>
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/30 text-brand-dark border border-brand-dark/20">
            CMS Visual
          </span>
        </button>

        <button
          onClick={() => {
            setTopTab('archived');
            setViewMode('archived');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            topTab === 'archived'
              ? 'bg-amber-600 text-white shadow-lg border border-amber-500/40'
              : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Archive className="w-4 h-4 text-amber-400" />
          <span>Archivadas</span>
          {totalArchived > 0 && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-black/40 text-amber-300 border border-amber-500/20">
              {totalArchived}
            </span>
          )}
        </button>
      </div>

      {topTab === 'heroes' ? (
        <HeroManagementSection />
      ) : topTab === 'before-after' ? (
        <BeforeAfterManagementSection />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6">
        <aside className="rounded-2xl border border-white/10 bg-[#131d16] p-3 h-fit">
          <p className="px-3 pt-2 pb-3 text-[10px] uppercase font-black tracking-[0.16em] text-gray-400">Especialidad</p>
          <div className="space-y-1">
            {(categories.length ? categories : [{ slug: 'canchas', label: 'Canchas', description: '', assets: [] }]).map((category) => {
              const selected = category.slug === selectedCategory;
              const catArchivedCount = archivedList.filter((a) => a.category === category.slug).length;
              return (
                <button
                  key={category.slug}
                  onClick={() => { setSelectedCategory(category.slug); setSearch(''); }}
                  className={`w-full text-left rounded-xl p-3 transition-all ${
                    selected
                      ? 'bg-brand-green text-white shadow-md border border-brand-green/40'
                      : 'text-gray-200 hover:bg-white/10 hover:text-white bg-white/[0.04] border border-white/5'
                  }`}
                >
                  <div className="flex justify-between gap-3 items-center">
                    <span className={`text-sm font-bold ${selected ? 'text-white' : 'text-gray-200'}`}>
                      {category.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-black ${selected ? 'text-brand-gold' : 'text-gray-300'}`}>
                        {category.assets.length}
                      </span>
                      {catArchivedCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium" title={`${catArchivedCount} archivadas`}>
                          -{catArchivedCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={`mt-1 text-[11px] leading-relaxed ${selected ? 'text-emerald-100/80' : 'text-gray-400'}`}>
                    {category.description}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="min-w-0 rounded-2xl border border-white/10 bg-[#131d16] overflow-hidden">
          <div className="p-5 md:p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black text-white">{activeCategory?.label || 'Biblioteca'}</h2>
                <div className="inline-flex rounded-lg bg-black/40 p-0.5 border border-white/10 text-xs">
                  <button
                    onClick={() => setViewMode('active')}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${
                      viewMode === 'active' ? 'bg-brand-green text-white shadow' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Activas ({activeCategory?.assets.length || 0})
                  </button>
                  <button
                    onClick={() => setViewMode('archived')}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${
                      viewMode === 'archived' ? 'bg-brand-gold text-brand-dark shadow' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Archivadas ({filteredArchivedAssets.length})
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {viewMode === 'active'
                  ? `${filteredActiveAssets.length} de ${activeCategory?.assets.length || 0} imágenes visibles en la web`
                  : `${filteredArchivedAssets.length} imágenes retiradas de la galería pública`}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-gray-500" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar archivo"
                  className="w-full sm:w-48 rounded-xl border border-white/10 bg-brand-dark px-9 py-2.5 text-xs text-white placeholder:text-gray-600 outline-none focus:border-brand-gold"
                />
              </label>
              {viewMode === 'active' && (
                <>
                  <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="hidden" onChange={uploadFiles} />
                  <button
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gold px-4 py-2.5 text-xs font-black text-brand-dark hover:bg-yellow-400 disabled:opacity-60"
                  >
                    <ImagePlus className="w-4 h-4" />
                    {isUploading ? 'Subiendo…' : 'Añadir imágenes'}
                  </button>
                </>
              )}
            </div>
          </div>

          {(notice || error) && (
            <div
              className={`mx-5 md:mx-6 mt-5 flex items-start gap-2 rounded-xl border p-3 text-xs ${
                error ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-brand-green/30 bg-brand-green/10 text-emerald-200'
              }`}
            >
              {error ? <X className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-gold" />}
              <span>{error || notice}</span>
            </div>
          )}

          {loading ? (
            <div className="h-80 flex items-center justify-center gap-3 text-sm text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin text-brand-gold" />
              Cargando biblioteca visual…
            </div>
          ) : viewMode === 'active' ? (
            filteredActiveAssets.length === 0 ? (
              <div className="h-80 flex flex-col items-center justify-center text-center px-6">
                <FileImage className="w-9 h-9 text-gray-600 mb-3" />
                <h3 className="font-bold text-white">No hay imágenes activas que coincidan</h3>
                <p className="mt-1 text-xs text-gray-500">Suba una imagen aprobada o cambie el término de búsqueda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-px bg-white/10">
                {filteredActiveAssets.map((asset) => (
                  <article key={asset.filename} className="group bg-[#101811] p-3 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-all">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-brand-dark">
                      <Image
                        src={asset.url}
                        alt={asset.filename}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Top left badge pill: Custom badge or subcategory */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
                        {asset.badge ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/80 text-brand-gold backdrop-blur-md border border-brand-gold/40 shadow-sm">
                            {asset.badge}
                          </span>
                        ) : asset.subcategory && asset.subcategory !== 'general' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/80 text-emerald-300 backdrop-blur-md border border-emerald-500/40 shadow-sm">
                            {asset.subcategory}
                          </span>
                        ) : null}
                      </div>

                      {/* Action buttons overlay */}
                      <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1.5 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20">
                        <button
                          aria-label={`Editar categoría de ${asset.filename}`}
                          title="Editar categoría y subcategoría"
                          onClick={() => openCategoryEditor(asset)}
                          className="rounded-lg bg-black/60 p-2 text-brand-gold backdrop-blur hover:bg-brand-gold hover:text-brand-dark transition-colors"
                        >
                          <Tag className="w-3.5 h-3.5" />
                        </button>
                        <button
                          aria-label={`Renombrar ${asset.filename}`}
                          title="Renombrar archivo"
                          onClick={() => renameAsset(asset)}
                          disabled={renaming === asset.filename}
                          className="rounded-lg bg-black/60 p-2 text-white backdrop-blur hover:bg-brand-gold hover:text-brand-dark transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          aria-label={`Archivar ${asset.filename}`}
                          title="Archivar imagen"
                          onClick={() => archiveAsset(asset)}
                          className="rounded-lg bg-black/60 p-2 text-white backdrop-blur hover:bg-red-500 transition-colors"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="px-1 pt-3">
                      <div className="flex items-center justify-between gap-1">
                        <p title={asset.title || asset.filename} className="truncate text-xs font-bold text-white">
                          {asset.title || asset.filename}
                        </p>
                        <button
                          onClick={() => openCategoryEditor(asset)}
                          className="text-[10px] text-brand-gold hover:underline font-semibold shrink-0"
                          title="Cambiar categoría / subcategoría"
                        >
                          Editar
                        </button>
                      </div>
                      {asset.title && (
                        <p title={asset.filename} className="truncate text-[10px] text-gray-500 mt-0.5">
                          {asset.filename}
                        </p>
                      )}
                      <p className="mt-1 text-[11px] text-gray-400">
                        {formatBytes(asset.bytes)} · {new Date(asset.updatedAt).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )
          ) : (
            filteredArchivedAssets.length === 0 ? (
              <div className="h-80 flex flex-col items-center justify-center text-center px-6">
                <Archive className="w-9 h-9 text-gray-600 mb-3" />
                <h3 className="font-bold text-white">No hay imágenes archivadas en esta categoría</h3>
                <p className="mt-1 text-xs text-gray-500">Las imágenes que retire de la galería activa aparecerán aquí para su recuperación.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-px bg-white/10">
                {filteredArchivedAssets.map((asset) => (
                  <article key={asset.filename} className="group bg-[#151210] p-3 border border-amber-900/20">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-brand-dark opacity-80 group-hover:opacity-100 transition-opacity">
                      <Image
                        src={asset.url}
                        alt={asset.filename}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover filter grayscale contrast-125"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-amber-300 text-[10px] font-bold backdrop-blur">
                        Archivada
                      </div>
                      <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <button
                          aria-label={`Restaurar ${asset.filename}`}
                          onClick={() => restoreAsset(asset)}
                          disabled={restoring === asset.filename}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white backdrop-blur hover:bg-emerald-500 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Restaurar
                        </button>
                      </div>
                    </div>
                    <div className="px-1 pt-3">
                      <p title={asset.filename} className="truncate text-xs font-bold text-gray-300">{asset.filename}</p>
                      <p className="mt-1 text-[11px] text-amber-400/80">
                        Archivada: {new Date(asset.archivedAt).toLocaleDateString('es-CO')} {asset.archivedBy ? `· ${asset.archivedBy}` : ''}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )
          )}
        </section>
      </div>
      )}

      <p className="flex items-center gap-2 text-[11px] text-gray-500">
        <UploadCloud className="w-3.5 h-3.5 text-brand-gold" />
        JPG, PNG, WebP y AVIF hasta 10 MB. Al retirar una imagen queda archivada en base de datos; puede restaurarla en cualquier momento desde la pestaña &quot;Archivadas&quot;.
      </p>

      {/* Category & Subcategory Editor Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131d16] border border-white/20 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Editar Categoría y Subcategoría</h3>
                  <p className="text-xs text-gray-400">Reasigne la imagen en el ecosistema y galerías públicas</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Asset Preview Mini-card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 mb-5">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                <Image src={editingAsset.url} alt={editingAsset.filename} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate" title={editingAsset.filename}>
                  {editingAsset.filename}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-green/30 text-emerald-200 border border-brand-green/40">
                    {CATEGORY_OPTIONS.find((c) => c.slug === editingAsset.category)?.label || editingAsset.category}
                  </span>
                  {editingAsset.subcategory && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
                      {editingAsset.subcategory}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveMetadata} className="space-y-4">
              {/* Especialidad (Categoría Principal) */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Especialidad (Categoría Principal) *
                </label>
                <select
                  value={targetCategory}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    setTargetCategory(newCat);
                    const presets = SUBCAT_OPTIONS[newCat] || [];
                    setTargetSubcategory(presets[0]?.id || 'general');
                    setCustomSubcategory('');
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/50 text-white font-semibold text-sm shadow-inner focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option
                      key={cat.slug}
                      value={cat.slug}
                      className="bg-[#111c13] text-white py-1.5"
                    >
                      {cat.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-gray-400">
                  Define en qué pestaña del CMS y en qué servicio del portafolio se mostrará esta imagen.
                </p>
              </div>

              {/* Subcategoría */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Subcategoría de Proyecto *
                </label>
                <select
                  value={targetSubcategory}
                  onChange={(e) => setTargetSubcategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/50 text-white font-semibold text-sm shadow-inner focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                >
                  {(SUBCAT_OPTIONS[targetCategory] || []).map((sub) => (
                    <option
                      key={sub.id}
                      value={sub.id}
                      className="bg-[#111c13] text-white py-1.5"
                    >
                      {sub.label}
                    </option>
                  ))}
                  <option
                    value="__custom__"
                    className="bg-[#111c13] text-brand-gold py-1.5 font-bold"
                  >
                    + Otra subcategoría (personalizada)...
                  </option>
                </select>

                {targetSubcategory === '__custom__' && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={customSubcategory}
                      onChange={(e) => setCustomSubcategory(e.target.value)}
                      placeholder="Escriba el nombre de la subcategoría"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/50 text-white placeholder:text-gray-500 text-sm shadow-inner focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                    />
                  </div>
                )}
                <p className="mt-1 text-[11px] text-gray-400">
                  Filtra los proyectos en las galerías interactivas por tipo específico de obra.
                </p>
              </div>

              {/* Título descriptivo (opcional) */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Título Descriptivo (Opcional)
                </label>
                <input
                  type="text"
                  value={targetTitle}
                  onChange={(e) => setTargetTitle(e.target.value)}
                  placeholder="Ej: Pistas de Pádel Panorámicas Club Campestre"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/50 text-white placeholder:text-gray-500 text-sm shadow-inner focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              {/* Etiqueta / Badge (opcional) */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Etiqueta / Badge (Opcional)
                </label>
                <input
                  type="text"
                  value={targetBadge}
                  onChange={(e) => setTargetBadge(e.target.value)}
                  placeholder="Ej: Pádel Panorámico / Césped FIFA"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/50 text-white placeholder:text-gray-500 text-sm shadow-inner focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              {/* Live Preview Pill */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Vista Previa del Badge:
                </span>
                <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/40">
                  {targetBadge.trim() ||
                    (targetSubcategory === '__custom__'
                      ? customSubcategory.trim() || 'Subcategoría'
                      : SUBCAT_OPTIONS[targetCategory]?.find((s) => s.id === targetSubcategory)?.label || targetSubcategory)}
                </span>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  disabled={isSavingMetadata}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingMetadata}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-brand-gold text-brand-dark hover:bg-yellow-400 transition-colors shadow-lg disabled:opacity-50"
                >
                  {isSavingMetadata ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Guardando…
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
