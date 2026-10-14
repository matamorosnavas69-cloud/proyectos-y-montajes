'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Images,
  Maximize2,
  Play,
  Sparkles,
  Video,
  X,
  CheckCircle2,
} from 'lucide-react';
import { LibraryAsset, ServiceSlug } from '@/lib/media-library';

interface ServiceMeta {
  slug: ServiceSlug;
  name: string;
  eyebrow: string;
  title: string;
  description: string;
  subcategories: readonly { id: string; label: string }[];
}

interface ServiceShowcaseGalleryProps {
  service: ServiceSlug;
  customEyebrow?: string;
  customTitle?: string;
  customDescription?: string;
  simulatorTargetId?: string;
}

const PAGE_SIZE = 12;

export default function ServiceShowcaseGallery({
  service,
  customEyebrow,
  customTitle,
  customDescription,
  simulatorTargetId = 'simulador',
}: ServiceShowcaseGalleryProps) {
  const [serviceMeta, setServiceMeta] = useState<ServiceMeta | null>(null);
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [activeSubcategory, setActiveSubcategory] = useState<string>('todos');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [activeAssetIndex, setActiveAssetIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch service media
  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    fetch(`/api/media-library?service=${encodeURIComponent(service)}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setServiceMeta(data.service);
          setAssets(data.assets || []);
        }
      })
      .catch(() => undefined)
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [service]);

  // Filtered assets based on active subcategory
  const filteredAssets = useMemo(() => {
    if (activeSubcategory === 'todos') return assets;
    if (activeSubcategory === 'videos') return assets.filter((a) => a.type === 'video');
    return assets.filter((a) => a.subcategory === activeSubcategory);
  }, [assets, activeSubcategory]);

  // Counts for each subcategory tab
  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      todos: assets.length,
      videos: assets.filter((a) => a.type === 'video').length,
    };
    assets.forEach((a) => {
      counts[a.subcategory] = (counts[a.subcategory] || 0) + 1;
    });
    return counts;
  }, [assets]);

  // Reset pagination when filter changes
  const handleSubcategoryChange = (subId: string) => {
    setActiveSubcategory(subId);
    setVisibleCount(PAGE_SIZE);
    setActiveAssetIndex(null);
  };

  // Lightbox navigation
  const activeAsset = activeAssetIndex !== null ? filteredAssets[activeAssetIndex] : null;

  const previousAsset = useCallback(() => {
    if (activeAssetIndex === null || filteredAssets.length <= 1) return;
    setActiveAssetIndex((prev) => (prev! - 1 + filteredAssets.length) % filteredAssets.length);
  }, [activeAssetIndex, filteredAssets.length]);

  const nextAsset = useCallback(() => {
    if (activeAssetIndex === null || filteredAssets.length <= 1) return;
    setActiveAssetIndex((prev) => (prev! + 1) % filteredAssets.length);
  }, [activeAssetIndex, filteredAssets.length]);

  const closeLightbox = useCallback(() => {
    setActiveAssetIndex(null);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeAssetIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') previousAsset();
      if (e.key === 'ArrowRight') nextAsset();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeAssetIndex, closeLightbox, previousAsset, nextAsset]);

  const visibleAssets = filteredAssets.slice(0, visibleCount);
  const featured = filteredAssets[0];
  const sideRail = filteredAssets.slice(1, 4);

  const eyebrow = customEyebrow || serviceMeta?.eyebrow || 'Archivo de obra';
  const title = customTitle || serviceMeta?.title || 'Obras ejecutadas con estándar europeo';
  const description =
    customDescription ||
    serviceMeta?.description ||
    'Explore imágenes y videos de obras reales ejecutadas por nuestro equipo técnico.';

  return (
    <section
      id="galeria-de-obras"
      aria-labelledby="gallery-heading"
      className="relative overflow-hidden bg-brand-dark py-24 md:py-32"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(27,94,32,0.22),transparent_40%),radial-gradient(circle_at_85%_85%,rgba(212,175,55,0.12),transparent_45%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-brand-gold">
              <Images className="h-3.5 w-3.5" />
              <span>{eyebrow}</span>
            </div>
            <h2
              id="gallery-heading"
              className="mt-4 text-3xl font-black leading-tight text-white md:text-5xl lg:text-6xl"
            >
              {title}
            </h2>
          </div>
          <p className="text-base leading-relaxed text-gray-300 lg:pb-1 md:text-lg">
            {description}
          </p>
        </div>

        {/* Subcategory Pill Filters */}
        <div
          role="tablist"
          aria-label="Filtros por especialidad de obra"
          className="mb-10 flex gap-2.5 overflow-x-auto pb-2 scrollbar-none"
        >
          {serviceMeta?.subcategories.map((sub) => {
            const count = subcategoryCounts[sub.id] ?? 0;
            const isActive = activeSubcategory === sub.id;

            return (
              <button
                key={sub.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSubcategoryChange(sub.id)}
                className={`group inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition-all duration-200 md:text-sm ${
                  isActive
                    ? 'border-brand-gold bg-brand-gold text-brand-dark shadow-lg shadow-brand-gold/20'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-brand-gold/40 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{sub.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    isActive
                      ? 'bg-black/20 text-brand-dark'
                      : 'bg-black/40 text-brand-gold group-hover:bg-brand-gold/20'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid min-h-[460px] place-items-center rounded-3xl border border-white/10 bg-[#101811] text-center">
            <div className="space-y-4">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
              <p className="text-sm font-medium text-gray-400">
                Cargando archivo visual de obras ejecutadas…
              </p>
            </div>
          </div>
        )}

        {/* Main Visual Matrix */}
        {!isLoading && filteredAssets.length > 0 && (
          <>
            {/* Spotlight Showcase (Hero + Side Rail) */}
            {activeSubcategory === 'todos' && featured && sideRail.length > 0 && (
              <div className="mb-8 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                {/* Hero Feature Card */}
                <button
                  type="button"
                  onClick={() => setActiveAssetIndex(0)}
                  className="group relative min-h-[380px] overflow-hidden rounded-3xl border border-white/15 bg-black/40 text-left shadow-2xl transition-all duration-300 hover:border-brand-gold/50 md:min-h-[500px]"
                >
                  {featured.type === 'video' ? (
                    <div className="relative h-full w-full">
                      <video
                        src={featured.url}
                        muted
                        playsInline
                        loop
                        autoPlay
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-brand-gold backdrop-blur">
                        <Video className="h-3.5 w-3.5" /> Video de Obra
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={featured.url}
                      alt={featured.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 65vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-brand-dark">
                        <Sparkles className="h-3 w-3" />
                        {featured.badge || 'Obra Destacada'}
                      </div>
                      <h3 className="mt-2.5 text-2xl font-black text-white md:text-3xl">
                        {featured.title}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        Ejecución certificada por Proyectos y Montajes
                      </p>
                    </div>

                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-brand-dark">
                      <Maximize2 className="h-5 w-5" />
                    </span>
                  </div>
                </button>

                {/* Side Rail (3 complementary shots) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:grid-rows-3">
                  {sideRail.map((asset, idx) => (
                    <button
                      key={asset.url}
                      type="button"
                      onClick={() => setActiveAssetIndex(idx + 1)}
                      className="group relative min-h-[140px] overflow-hidden rounded-2xl border border-white/10 bg-black/30 text-left transition-all duration-300 hover:border-brand-gold/40"
                    >
                      {asset.type === 'video' ? (
                        <div className="relative h-full w-full">
                          <video
                            src={asset.url}
                            muted
                            playsInline
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 grid place-items-center bg-black/40">
                            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gold text-brand-dark shadow">
                              <Play className="h-4 w-4 fill-current ml-0.5" />
                            </span>
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={asset.url}
                          alt={asset.title}
                          fill
                          sizes="(max-width: 1024px) 33vw, 30vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3.5">
                        <span className="truncate text-xs font-bold text-white">
                          {asset.badge || asset.title}
                        </span>
                        <span className="text-[10px] font-black text-brand-gold">
                          0{idx + 2}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Asymmetric Visual Matrix Grid */}
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 md:gap-5">
              {visibleAssets.map((asset, index) => {
                const isDoubleSpan = index % 9 === 0 && index !== 0;

                return (
                  <button
                    key={asset.url}
                    type="button"
                    onClick={() => setActiveAssetIndex(index)}
                    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121a14] text-left outline-none transition-all duration-300 hover:border-brand-gold/50 focus-visible:ring-2 focus-visible:ring-brand-gold ${
                      isDoubleSpan
                        ? 'col-span-2 row-span-2 min-h-[320px] md:min-h-[420px]'
                        : 'min-h-[190px] md:min-h-[240px]'
                    }`}
                  >
                    {asset.type === 'video' ? (
                      <div className="relative h-full w-full">
                        <video
                          src={asset.url}
                          muted
                          playsInline
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/35 transition group-hover:bg-black/20">
                          <span className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/60 text-white backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-brand-dark">
                            <Play className="h-5 w-5 fill-current ml-0.5" />
                          </span>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={asset.url}
                        alt={asset.title}
                        fill
                        sizes={
                          isDoubleSpan
                            ? '(max-width: 768px) 100vw, 50vw'
                            : '(max-width: 768px) 50vw, 25vw'
                        }
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading={index < 8 ? 'eager' : 'lazy'}
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />

                    {/* Metadata Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-block rounded bg-black/60 border border-brand-gold/30 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-gold backdrop-blur-md shadow-sm">
                          {asset.badge || 'Obra'}
                        </span>
                        {asset.type === 'video' && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-white/80 bg-black/50 px-2 py-0.5 rounded backdrop-blur">
                            <Video className="h-3 w-3 text-brand-gold" />
                            Video
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 group-hover:scale-105">
                      <Maximize2 className="h-4 w-4" />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredAssets.length && (
              <div className="mt-12 flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="inline-flex items-center gap-2.5 rounded-full border border-brand-gold bg-brand-gold px-8 py-4 text-sm font-black text-brand-dark shadow-lg shadow-brand-gold/20 transition-all duration-300 hover:scale-105 hover:bg-white"
                >
                  <span>
                    Ver más proyectos (
                    {Math.min(PAGE_SIZE, filteredAssets.length - visibleCount)} de{' '}
                    {filteredAssets.length - visibleCount})
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-xs text-gray-400">
                  Mostrando {visibleAssets.length} de {filteredAssets.length} obras ejecutadas
                </p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && filteredAssets.length === 0 && (
          <div className="grid min-h-[300px] place-items-center rounded-3xl border border-white/10 bg-[#101811] p-8 text-center">
            <p className="text-base text-gray-400">
              No hay proyectos en esta subcategoría por el momento.
            </p>
          </div>
        )}
      </div>

      {/* Cinematic Fullscreen Lightbox Modal */}
      {activeAsset && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visor ampliado de proyecto"
          onClick={closeLightbox}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-between bg-black/95 p-4 backdrop-blur-2xl md:p-6"
        >
          {/* Top Bar */}
          <div
            className="flex w-full max-w-7xl items-center justify-between border-b border-white/10 pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-brand-gold px-2.5 py-1 text-xs font-black text-brand-dark">
                {activeAsset.badge || 'Obra Real'}
              </span>
              <div>
                <h3 className="text-sm font-bold text-white md:text-base">
                  {activeAsset.title}
                </h3>
                <p className="text-xs text-gray-400">
                  Archivo técnico · Proyectos y Montajes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-mono font-bold text-white">
                {activeAssetIndex! + 1} / {filteredAssets.length}
              </div>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Cerrar visor"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-brand-gold hover:text-brand-dark"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Main Media Stage */}
          <div
            className="relative flex h-[65vh] w-full max-w-6xl items-center justify-center overflow-hidden my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {activeAsset.type === 'video' ? (
              <video
                src={activeAsset.url}
                controls
                autoPlay
                playsInline
                className="max-h-full max-w-full rounded-2xl shadow-2xl"
              />
            ) : (
              <Image
                src={activeAsset.url}
                alt={activeAsset.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            )}

            {/* Left / Right Arrow Buttons */}
            {filteredAssets.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previousAsset}
                  aria-label="Proyecto anterior"
                  className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:scale-110 hover:bg-brand-gold hover:text-brand-dark"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={nextAsset}
                  aria-label="Proyecto siguiente"
                  className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:scale-110 hover:bg-brand-gold hover:text-brand-dark"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Conversion & Filmstrip Bar */}
          <div
            className="flex w-full max-w-7xl flex-col gap-3 border-t border-white/10 pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Filmstrip Mini-Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {filteredAssets.map((thumb, idx) => (
                <button
                  key={thumb.url}
                  type="button"
                  onClick={() => setActiveAssetIndex(idx)}
                  className={`group relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition ${
                    idx === activeAssetIndex
                      ? 'border-brand-gold ring-2 ring-brand-gold/60 scale-105'
                      : 'border-white/15 opacity-60 hover:opacity-100'
                  }`}
                >
                  {thumb.type === 'video' ? (
                    <div className="grid h-full w-full place-items-center bg-gray-900 text-brand-gold">
                      <Play className="h-4 w-4 fill-current" />
                    </div>
                  ) : (
                    <Image
                      src={thumb.url}
                      alt={thumb.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Direct Conversion CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-2.5 border border-white/10">
              <p className="text-xs text-gray-300">
                ¿Planeas un proyecto con especificaciones similares? Nuestro equipo técnico elabora tu diagnóstico.
              </p>
              <Link
                href={`#${simulatorTargetId}`}
                onClick={closeLightbox}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-xs font-black text-brand-dark transition hover:bg-white"
              >
                <span>Cotizar Proyecto Similar</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
