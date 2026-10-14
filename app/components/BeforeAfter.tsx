'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

/* ──────────────────────────────────────────────────────────────
 * IMAGE NAMING CONVENTION — Drop files into:
 *   public/images/before-after/
 *
 * Expected filenames:
 *   cancha-futbol-01-before.jpg   cancha-futbol-01-after.jpg
 *   pista-padel-01-before.jpg     pista-padel-01-after.jpg
 *   parque-infantil-01-before.jpg parque-infantil-01-after.jpg
 *   paisajismo-01-before.jpg      paisajismo-01-after.jpg
 *
 * Add more by incrementing the number: cancha-futbol-02-before.jpg, etc.
 * ────────────────────────────────────────────────────────────── */

type BeforeAfterProject = {
  id: string;
  title: string;
  location: string;
  category: string;
  categoryColor: string;
  beforeImage: string;
  afterImage: string;
  stats: { label: string; value: string }[];
};

const PROJECTS: BeforeAfterProject[] = [
  {
    id: 'padel-indoor-01',
    title: 'Pistas de Pádel Panorámicas de Competición',
    location: 'Bucaramanga, Santander',
    category: 'Pádel',
    categoryColor: 'bg-emerald-600',
    beforeImage: '/images/padel/IMG_3348.PNG',
    afterImage: '/images/padel/IMG_3346.PNG',
    stats: [
      { label: 'Área', value: '400 m²' },
      { label: 'Duración', value: '35 días' },
    ],
  },
  {
    id: 'cancha-futbol-01',
    title: 'Campo Sintético de Fútbol 7',
    location: 'Floridablanca, Santander',
    category: 'Fútbol',
    categoryColor: 'bg-green-600',
    beforeImage: '/images/futbol/IMG_7552.JPG',
    afterImage: '/images/futbol/806ebee3-c75b-4dcf-8e3b-eae1d864d211.jpg',
    stats: [
      { label: 'Área', value: '850 m²' },
      { label: 'Duración', value: '45 días' },
    ],
  },
  {
    id: 'terraza-residencial-01',
    title: 'Transformación de Terraza & Jardín Residencial',
    location: 'Ruitoque Condominio, Santander',
    category: 'Paisajismo',
    categoryColor: 'bg-amber-600',
    beforeImage: '/images/drive%20organice/residencial/IMG_1271.PNG',
    afterImage: '/images/drive%20organice/piscina/IMG_8075.JPG',
    stats: [
      { label: 'Área', value: '180 m²' },
      { label: 'Duración', value: '12 días' },
    ],
  },
];

/* ── Fallback Icon (camera with construction) ───── */
function FallbackPlaceholder({ label }: { label: string }) {
  return (
    <div className="image-fallback">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
        />
      </svg>
      <span>{label}</span>
    </div>
  );
}

/* ── Single Slider ──────────────────────────────── */
function Slider({ project }: { project: BeforeAfterProject }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  // Load-first pattern: images are hidden until onLoad fires
  const [beforeLoaded, setBeforeLoaded] = useState(false);
  const [afterLoaded, setAfterLoaded] = useState(false);

  const updatePosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = Math.max(2, Math.min(98, (x / rect.width) * 100));
      setPosition(percent);
    },
    [],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      updatePosition(e.clientX);
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [updatePosition],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
      {/* Slider area */}
      <div
        ref={containerRef}
        className="before-after-container relative w-full lg:w-3/4 aspect-[16/10] rounded-2xl border border-white/10 shadow-2xl"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* AFTER image (full background) */}
        <div className="absolute inset-0 z-10">
          {/* Fallback always rendered underneath */}
          {!afterLoaded && <FallbackPlaceholder label="Imagen Después — Próximamente" />}
          {/* Hidden img probe — becomes visible only on successful load */}
          <img
            src={project.afterImage}
            alt={`${project.title} — Después`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${afterLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setAfterLoaded(true)}
            onError={() => setAfterLoaded(false)}
            draggable={false}
          />
        </div>

        {/* BEFORE image (clipped) */}
        <div
          className="absolute inset-0 z-20"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {!beforeLoaded && <FallbackPlaceholder label="Imagen Antes — Próximamente" />}
          <img
            src={project.beforeImage}
            alt={`${project.title} — Antes`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${beforeLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setBeforeLoaded(true)}
            onError={() => setBeforeLoaded(false)}
            draggable={false}
          />
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 z-30 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10">
          Antes
        </div>
        <div className="absolute top-4 right-4 z-30 bg-brand-gold/90 backdrop-blur-md text-brand-dark text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
          Después
        </div>

        {/* Divider line */}
        <div
          className="before-after-divider"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          <div className="before-after-handle">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L3 10L7 16" stroke="#0b120d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 4L17 10L13 16" stroke="#0b120d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Project info card */}
      <div className="w-full lg:w-1/4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
        <div>
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full text-white mb-4 ${project.categoryColor}`}>
            {project.category}
          </span>
          <h3 className="text-2xl font-black text-white mb-2">{project.title}</h3>
          <p className="text-gray-400 text-sm flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {project.location}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {project.stats.map((stat) => (
            <div key={stat.label} className="border-l-2 border-brand-gold pl-4">
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-xs text-gray-500 flex items-center gap-2">
          <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Arrastra el control para comparar
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────── */
export default function BeforeAfter() {
  const [projects, setProjects] = useState<BeforeAfterProject[]>(PROJECTS);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch('/api/before-after')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
      })
      .catch((err) => {
        console.error('Failed to load before-after projects:', err);
      });
  }, []);

  if (!projects || projects.length === 0) {
    return null;
  }

  const safeIndex = activeIndex < projects.length ? activeIndex : 0;
  const currentProject = projects[safeIndex];

  return (
    <section id="antes-despues" className="w-full py-24 md:py-32 bg-brand-dark font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold tracking-widest uppercase mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
            Transformaciones Reales
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Del Terreno al{' '}
            <span className="text-gradient-gold">Resultado Final</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Cada proyecto comienza con una visión. Compara el antes y después de nuestras
            transformaciones más emblemáticas.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {projects.map((project, idx) => (
            <button
              key={project.id}
              onClick={() => setActiveIndex(idx)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                safeIndex === idx
                  ? 'bg-brand-gold text-brand-dark border-brand-gold shadow-glow-gold'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-brand-gold/40 hover:text-white'
              }`}
            >
              {project.title}
            </button>
          ))}
        </div>

        {/* Active slider */}
        <Slider key={currentProject.id} project={currentProject} />
      </div>
    </section>
  );
}
