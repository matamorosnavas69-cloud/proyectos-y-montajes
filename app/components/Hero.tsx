import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center bg-brand-dark overflow-hidden font-sans">
      {/* Background authentic construction photography with Next.js Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/padel/IMG_3346.PNG"
          alt="Pistas profesionales de pádel panorámico construidas por Proyectos y Montajes en Colombia"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-center opacity-90 transform scale-100 motion-safe:transition-transform motion-safe:duration-1000"
        />
        {/* Minimal natural vignette preserving authentic photography brilliance while ensuring text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-black/25 to-brand-dark/40 z-10" />
      </div>

      {/* Ambient architectural glow accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[140px] pointer-events-none z-[12]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none z-[12]" />

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-16 sm:px-24 max-w-5xl mx-auto py-48 md:py-64">
        {/* Engineering Authority Badge */}
        <div className="inline-flex items-center gap-10 px-18 py-6 rounded-full bg-brand-green/25 border border-brand-green/60 text-brand-gold mb-24 md:mb-32 backdrop-blur-md badge-glow">
          <span className="relative flex h-[10px] w-[10px]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-brand-gold"></span>
          </span>
          <span className="text-12 font-bold tracking-widest uppercase text-white/95">
            Más de 20 años transformando espacios en Colombia
          </span>
        </div>

        {/* Canonical Engineering Positioning Heading */}
        <h1 className="text-36 sm:text-48 md:text-56 lg:text-64 font-black text-white mb-20 md:mb-28 leading-[1.08] tracking-tight max-w-4xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
          Ingeniería Deportiva, Recreativa y{" "}
          <span className="text-gradient-gold">
            Paisajismo Arquitectónico
          </span>
        </h1>

        {/* Value Proposition Description */}
        <p className="text-16 sm:text-18 md:text-20 text-gray-200 mb-36 md:mb-44 max-w-3xl leading-relaxed font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Especialistas en pistas de Pádel profesionales, canchas de fútbol sintético, parques infantiles seguros y paisajismo corporativo y residencial de alta durabilidad.
        </p>

        {/* Responsive Conversion Action Triggers */}
        <div className="flex flex-col sm:flex-row items-center gap-16 sm:gap-20 w-full sm:w-auto">
          <a
            href="#simulador"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-brand-gold text-brand-dark px-32 sm:px-40 py-16 sm:py-18 rounded-xl font-bold text-16 sm:text-18 hover:bg-yellow-400 transition-all shadow-flat hover:shadow-glow-gold hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Cotizar Mi Proyecto
          </a>
          <Link
            href="/portafolio"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white/5 border border-white/20 text-white px-28 sm:px-36 py-16 sm:py-18 rounded-xl font-semibold text-16 sm:text-18 hover:bg-white/10 hover:border-brand-gold/60 hover:text-brand-gold transition-all backdrop-blur-sm shadow-flat focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            Explorar Obras Reales
          </Link>
        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <div className="absolute bottom-20 sm:bottom-28 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-6 text-brand-gold/80 hover:text-brand-gold transition-colors">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          Descubrir Servicios
        </span>
        <svg
          className="w-20 h-20 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
