'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ──────────────────────────────────────────────────────────────
 * AUTHORITY SHOWCASE
 * Highlights the most prominent, visually stunning projects
 * to establish brand dominance and credibility.
 * ────────────────────────────────────────────────────────────── */

type FlagshipProject = {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  category: string;
  image: string;
  stats: { value: string; label: string }[];
  description: string;
};

const FLAGSHIPS: FlagshipProject[] = [
  {
    id: 'complejo-padel-smash',
    title: 'Complejo Pádel Smash Club',
    subtitle: 'Diseño Arquitectónico & Ingeniería Deportiva',
    location: 'Colombia',
    category: 'Pádel',
    image: '/images/padel/IMG_3346.PNG',
    stats: [
      { value: '8', label: 'Pistas' },
      { value: '4,800', label: 'm² Totales' },
      { value: 'WPT', label: 'Estándar' },
    ],
    description:
      'Complejo de 8 pistas de pádel con estándar World Padel Tour, iluminación LED de competición, clubhouse, zona CrossFit y arquitectura bioclimática de vanguardia.',
  },
  {
    id: 'cancha-urbana-bucaramanga',
    title: 'Campo Deportivo Urbano',
    subtitle: 'Integración Comunitaria en Espacio Reducido',
    location: 'Bucaramanga, Santander',
    category: 'Fútbol',
    image: '/images/futbol/e4c51ec8-b63f-4eb3-b02d-4171a6eab524.JPG',
    stats: [
      { value: '520', label: 'm²' },
      { value: '2', label: 'Canchas' },
      { value: '1', label: 'Parque Infantil' },
    ],
    description:
      'Transformación integral de una azotea urbana en un complejo recreativo con cancha de fútbol sala, área de juegos infantiles y zonas de descanso con grama decorativa.',
  },
  {
    id: 'cancha-nocturna-residencial',
    title: 'Cancha Nocturna Residencial',
    subtitle: 'Infraestructura Deportiva para Conjuntos de Lujo',
    location: 'Santander',
    category: 'Fútbol',
    image: '/images/futbol/517561f9-e87e-4c53-9046-d16efe3e0ea0.jpg',
    stats: [
      { value: '600', label: 'm²' },
      { value: 'LED', label: 'Iluminación' },
      { value: '8+', label: 'Años de Vida' },
    ],
    description:
      'Cancha de fútbol 5 con grama sintética de alto rendimiento, iluminación LED nocturna y cerramientos profesionales para un complejo residencial de alta gama.',
  },
];

export default function AuthorityShowcase() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      id="autoridad"
      className="w-full py-24 md:py-32 bg-brand-dark font-sans relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px] translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs font-bold tracking-widest uppercase mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Proyectos Emblema
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Autoridad{' '}
              <span className="text-gradient-gold">Comprobada</span>
            </h2>
            <p className="text-gray-400 text-lg mt-4 max-w-xl">
              Proyectos que definen el estándar de la industria. Cada obra es testimonio
              de ingeniería de precisión y materiales de clase mundial.
            </p>
          </div>
          <Link
            href="/portafolio"
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-gold hover:text-brand-dark hover:border-brand-gold transition-all duration-300 self-start md:self-auto"
          >
            Ver Todo el Portafolio
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Flagship grid — bento layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feature card (large) */}
          <div
            className="authority-card rounded-2xl h-[500px] lg:h-auto lg:row-span-2 group cursor-pointer"
            onMouseEnter={() => setHoveredId(FLAGSHIPS[0].id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <img
              src={FLAGSHIPS[0].image}
              alt={FLAGSHIPS[0].title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-10">
              <span className="inline-flex self-start items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-600/80 text-white mb-3 backdrop-blur-sm">
                {FLAGSHIPS[0].category}
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                {FLAGSHIPS[0].title}
              </h3>
              <p className="text-gray-300 text-sm mb-1">{FLAGSHIPS[0].subtitle}</p>
              <p className="text-gray-400 text-xs flex items-center gap-1 mb-6">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {FLAGSHIPS[0].location}
              </p>

              {/* Stats bar */}
              <div className="flex gap-6 flex-wrap">
                {FLAGSHIPS[0].stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-black text-brand-gold">{stat.value}</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Expandable description */}
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  hoveredId === FLAGSHIPS[0].id ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-300 text-sm leading-relaxed border-t border-white/10 pt-4">
                  {FLAGSHIPS[0].description}
                </p>
              </div>
            </div>
          </div>

          {/* Secondary cards */}
          {FLAGSHIPS.slice(1).map((project) => (
            <div
              key={project.id}
              className="authority-card rounded-2xl h-[320px] group cursor-pointer"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="relative z-20 h-full flex flex-col justify-end p-8">
                <span className="inline-flex self-start items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-brand-green/80 text-white mb-3 backdrop-blur-sm">
                  {project.category}
                </span>
                <h3 className="text-2xl font-black text-white mb-1">{project.title}</h3>
                <p className="text-gray-400 text-xs flex items-center gap-1 mb-4">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {project.location}
                </p>

                <div className="flex gap-5">
                  {project.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="text-xl font-black text-brand-gold">{stat.value}</div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expandable description */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    hoveredId === project.id ? 'max-h-32 mt-3 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-gray-300 text-sm leading-relaxed border-t border-white/10 pt-3">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-green/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-lg">Garantía de 5 años</div>
              <div className="text-gray-500 text-xs">En todos nuestros proyectos</div>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-white/10" />

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-lg">Cobertura Nacional</div>
              <div className="text-gray-500 text-xs">Operamos en toda Colombia</div>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-white/10" />

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-lg">Materiales Europeos</div>
              <div className="text-gray-500 text-xs">CCGrass — FIFA Quality</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
