export default function Hero() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-brand-dark overflow-hidden font-sans">
      {/* Abstract background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-dark opacity-70 z-10"></div>
        {/* Real project image — resort-style field with palapa */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/images/futbol/IMG_0337.JPG')",
          }}
        ></div>
      </div>

      {/* Ambient glow accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[120px] z-[5]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[100px] z-[5]" />

      <div className="relative z-20 flex flex-col items-center text-center px-16 max-w-5xl mx-auto mt-48">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-12 px-22 py-8 rounded-full bg-brand-green/30 border border-brand-green/60 text-brand-gold mb-32 backdrop-blur-sm badge-glow">
          <span className="relative flex h-[12px] w-[12px]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-[12px] w-[12px] bg-brand-gold"></span>
          </span>
          <span className="text-12 font-bold tracking-widest uppercase text-white">
            20+ Años de Experiencia
          </span>
        </div>

        <h1 className="text-48 md:text-[72px] font-black text-white mb-32 leading-tight tracking-tight">
          Infraestructura Premium para{" "}
          <span className="text-gradient-gold">
            Espacios de Élite
          </span>
        </h1>

        <p className="text-[20px] md:text-24 text-gray-300 mb-48 max-w-3xl leading-relaxed font-light">
          Especialistas en pistas de Pádel de clase mundial, canchas sintéticas, parques infantiles
          seguros y paisajismo corporativo de alta gama.
        </p>

        <div className="flex flex-col sm:flex-row gap-22 w-full sm:w-auto">
          <a
            href="#simulador"
            className="bg-brand-gold text-brand-dark px-40 py-22 rounded-xl font-bold text-[20px] hover:bg-yellow-400 transition-all shadow-flat hover:shadow-glow-gold hover:-translate-y-1"
          >
            Cotizar Mi Proyecto
          </a>
          <a
            href="#autoridad"
            className="bg-transparent border-2 border-white/30 text-white px-40 py-22 rounded-xl font-bold text-[20px] hover:bg-white hover:text-brand-dark transition-all backdrop-blur-sm shadow-flat"
          >
            Explorar Proyectos
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-20 animate-bounce text-brand-gold">
        <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          ></path>
        </svg>
      </div>
    </section>
  );
}
