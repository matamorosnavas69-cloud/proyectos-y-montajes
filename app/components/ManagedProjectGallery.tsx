'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Images, Maximize2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Asset = { filename: string; url: string; bytes: number; updatedAt: string };
type Category = { slug: string; label: string; description: string; assets: Asset[] };

const COPY: Record<string, { eyebrow: string; title: string; intro: string }> = {
  canchas: { eyebrow: 'Ingeniería deportiva', title: 'Espacios que invitan a competir.', intro: 'Superficies, cerramientos y detalles constructivos ejecutados para durar.' },
  parques: { eyebrow: 'Recreación segura', title: 'Juego, seguridad y comunidad.', intro: 'Módulos, pisos de impacto y zonas de encuentro pensadas para el uso diario.' },
  piscina: { eyebrow: 'Bienestar residencial', title: 'Amenidades que elevan el proyecto.', intro: 'Entornos de agua, descanso y acabados que transforman las zonas comunes.' },
  golf: { eyebrow: 'Paisajismo técnico', title: 'Verde preciso, acabado impecable.', intro: 'Greens, recorridos y superficies con definición profesional en cada detalle.' },
  residencial: { eyebrow: 'Espacios compartidos', title: 'El detalle que hace hogar.', intro: 'Paisajismo, terrazas y amenidades que dan valor tangible a cada comunidad.' },
};

const INITIAL_IMAGES = 12;
const IMAGE_BATCH = 12;

function labelFor(asset: Asset, category: Category) {
  const name = asset.filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').replace(/\bimg\b/gi, '').trim();
  return name ? `${category.label} · ${name}` : `${category.label} · Proyecto ejecutado`;
}

export default function ManagedProjectGallery() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeSlug, setActiveSlug] = useState('canchas');
  const [visibleCount, setVisibleCount] = useState(INITIAL_IMAGES);
  const [activeImage, setActiveImage] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/media-library', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        const nextCategories = data?.categories || [];
        setCategories(nextCategories);
        if (nextCategories.length && !nextCategories.some((item: Category) => item.slug === activeSlug)) setActiveSlug(nextCategories[0].slug);
      })
      .catch(() => undefined);
  }, []);

  const category = useMemo(() => categories.find((item) => item.slug === activeSlug) || categories[0], [activeSlug, categories]);
  const images = category?.assets || [];
  const copy = category ? COPY[category.slug] || { eyebrow: 'Archivo de obra', title: category.label, intro: category.description } : COPY.canchas;
  const visibleImages = images.slice(0, visibleCount);
  const featured = images[0];
  const rail = images.slice(1, 5);

  function chooseCategory(slug: string) { setActiveSlug(slug); setVisibleCount(INITIAL_IMAGES); setActiveImage(null); }
  function previousImage() { if (activeImage !== null) setActiveImage((activeImage - 1 + images.length) % images.length); }
  function nextImage() { if (activeImage !== null) setActiveImage((activeImage + 1) % images.length); }

  return (
    <section id="galeria" className="relative overflow-hidden bg-[#f5f7f4] py-[88px] md:py-[128px]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-[32px] lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-green"><Images className="h-[14px] w-[14px]" /> Archivo de obra vivo</div>
            <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[0.98] text-brand-dark md:text-6xl">Obras reales, vistas como se deben ver.</h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-gray-600 lg:pb-1">Explore el archivo visual de Proyectos y Montajes por especialidad. La biblioteca se actualiza desde el equipo y cada imagen puede ampliarse para revisar el trabajo en detalle.</p>
        </div>

        <div role="tablist" aria-label="Categorías del archivo de obra" className="mt-[40px] flex gap-2 overflow-x-auto border-b border-gray-200 pb-4">
          {categories.length ? categories.map((item) => <button key={item.slug} type="button" role="tab" aria-selected={item.slug === category?.slug} onClick={() => chooseCategory(item.slug)} className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold transition ${item.slug === category?.slug ? 'border-brand-dark bg-brand-dark text-white shadow-lg shadow-brand-dark/15' : 'border-transparent bg-white text-gray-600 hover:border-brand-green/25 hover:text-brand-green'}`}><span>{item.label}</span><span className={`ml-2 text-[10px] ${item.slug === category?.slug ? 'text-brand-gold' : 'text-gray-400'}`}>{item.assets.length}</span></button>) : <div className="h-[42px] w-[480px] animate-pulse rounded-full bg-gray-200" />}
        </div>

        {category && featured ? <>
          <div className="mt-[32px] grid gap-[20px] lg:grid-cols-[1.3fr_0.7fr]">
            <button type="button" onClick={() => setActiveImage(0)} className="group relative min-h-[390px] overflow-hidden rounded-[28px] bg-brand-dark text-left shadow-2xl outline-none ring-offset-4 ring-offset-[#f5f7f4] focus-visible:ring-2 focus-visible:ring-brand-gold md:min-h-[540px]">
              <Image src={featured.url} alt={labelFor(featured, category)} fill sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 md:p-[32px]"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-gold">{copy.eyebrow}</p><h3 className="mt-2 max-w-xl text-2xl font-black leading-tight text-white md:text-4xl">{copy.title}</h3></div><span className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur transition group-hover:bg-brand-gold group-hover:text-brand-dark"><Maximize2 className="h-[18px] w-[18px]" /></span></div>
            </button>
            <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-1 lg:grid-rows-4">
              {rail.map((asset, index) => <button key={asset.url} type="button" onClick={() => setActiveImage(index + 1)} className="group relative min-h-[120px] overflow-hidden rounded-[18px] bg-brand-dark text-left outline-none ring-offset-2 ring-offset-[#f5f7f4] focus-visible:ring-2 focus-visible:ring-brand-gold"><Image src={asset.url} alt={labelFor(asset, category)} fill sizes="(max-width: 1024px) 50vw, 30vw" className="object-cover transition duration-500 group-hover:scale-105" /><span className="absolute inset-0 bg-black/15 transition group-hover:bg-black/0" /><span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold text-white backdrop-blur">{String(index + 2).padStart(2, '0')}</span></button>)}
              {Array.from({ length: Math.max(0, 4 - rail.length) }).map((_, index) => <div key={index} className="min-h-[120px] animate-pulse rounded-[18px] bg-brand-dark/10" />)}
            </div>
          </div>

          <div className="mt-[32px] flex flex-col gap-3 border-y border-gray-200 py-[18px] sm:flex-row sm:items-center sm:justify-between"><p className="max-w-2xl text-sm leading-relaxed text-gray-600">{copy.intro}</p><p className="shrink-0 text-sm font-black text-brand-dark"><span className="text-brand-gold">{images.length}</span> imágenes disponibles</p></div>

          <div className="mt-[32px] grid grid-cols-2 gap-[14px] md:grid-cols-3 lg:grid-cols-4">
            {visibleImages.map((asset, index) => <button key={asset.url} type="button" onClick={() => setActiveImage(index)} className={`group relative overflow-hidden rounded-[18px] bg-brand-dark text-left outline-none ring-offset-2 ring-offset-[#f5f7f4] focus-visible:ring-2 focus-visible:ring-brand-gold ${index % 7 === 0 ? 'col-span-2 row-span-2 min-h-[300px]' : 'min-h-[170px] md:min-h-[220px]'}`}><Image src={asset.url} alt={labelFor(asset, category)} fill sizes={index % 7 === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'} className="object-cover transition duration-700 group-hover:scale-105" loading={index > 5 ? 'lazy' : 'eager'} /><span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80" /><span className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-[0.14em] text-white/90">Obra {String(index + 1).padStart(2, '0')}</span><span className="absolute right-3 top-3 grid h-[30px] w-[30px] place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition group-hover:opacity-100"><Maximize2 className="h-[14px] w-[14px]" /></span></button>)}
          </div>

          {visibleCount < images.length && <div className="mt-[36px] flex justify-center"><button type="button" onClick={() => setVisibleCount((count) => count + IMAGE_BATCH)} className="inline-flex items-center gap-2 rounded-xl border border-brand-green/25 bg-white px-5 py-3 text-sm font-black text-brand-dark shadow-sm transition hover:border-brand-gold hover:bg-brand-gold"><span>Ver {Math.min(IMAGE_BATCH, images.length - visibleCount)} imágenes más</span><ArrowRight className="h-[16px] w-[16px]" /></button></div>}
        </> : <div className="mt-[32px] grid min-h-[420px] place-items-center rounded-[28px] bg-brand-dark text-center text-gray-400"><div><Images className="mx-auto h-[36px] w-[36px] text-brand-gold" /><p className="mt-4 text-sm">Cargando el archivo visual de obra…</p></div></div>}
      </div>

      {activeImage !== null && category && images[activeImage] && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md md:p-8" role="dialog" aria-modal="true" aria-label="Imagen ampliada de proyecto" onClick={() => setActiveImage(null)}>
        <div className="relative flex h-full max-h-[860px] w-full max-w-7xl items-center justify-center overflow-hidden rounded-[24px] border border-white/15 bg-[#0b120d]" onClick={(event) => event.stopPropagation()}>
          <Image src={images[activeImage].url} alt={labelFor(images[activeImage], category)} fill sizes="100vw" className="object-contain" priority />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-6 pb-6 pt-[88px]"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-gold">{category.label} · Archivo de obra</p><p className="mt-2 text-sm font-bold text-white">{labelFor(images[activeImage], category)}</p></div>
          <button type="button" onClick={() => setActiveImage(null)} className="absolute right-4 top-4 grid h-[42px] w-[42px] place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-brand-gold hover:text-brand-dark" aria-label="Cerrar galería"><X className="h-[20px] w-[20px]" /></button>
          {images.length > 1 && <><button type="button" onClick={previousImage} className="absolute left-4 top-1/2 grid h-[44px] w-[44px] -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-brand-gold hover:text-brand-dark" aria-label="Imagen anterior"><ChevronLeft className="h-[24px] w-[24px]" /></button><button type="button" onClick={nextImage} className="absolute right-4 top-1/2 grid h-[44px] w-[44px] -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-brand-gold hover:text-brand-dark" aria-label="Imagen siguiente"><ChevronRight className="h-[24px] w-[24px]" /></button></>}
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/60 px-3 py-2 text-[11px] font-bold text-white backdrop-blur">{activeImage + 1} / {images.length}</div>
        </div>
      </div>}
    </section>
  );
}
