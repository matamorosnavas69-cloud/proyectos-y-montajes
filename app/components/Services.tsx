import Link from "next/link";

export default function Services() {
  return (
    <section id="servicios" className="w-full py-[128px] bg-brand-light font-sans">
      <div className="max-w-7xl mx-auto px-16">
        <div className="text-center mb-[80px]">
          <h2 className="text-48 font-black text-brand-dark mb-24">Nuestros Pilares de Negocio</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-[20px]">
            Diseñamos, construimos y mantenemos instalaciones de alto rendimiento que transforman
            espacios y rentabilizan inversiones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-40">
          {/* Canchas — Real image: panoramic field */}
          <Link href="/servicios/canchas-deportivas" passHref>
            <div
              id="canchas"
              className="group bg-white rounded-xl overflow-hidden shadow-flat hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full cursor-pointer"
            >
              <div className="h-[288px] w-full overflow-hidden relative bg-brand-dark">
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-all duration-500 z-10"></div>
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-1000"
                  style={{
                    backgroundImage:
                      "url('/images/futbol/IMG_7552.JPG')",
                  }}
                ></div>
                <div className="absolute bottom-16 left-16 z-20 bg-brand-green text-white px-16 py-4 rounded-sm text-[14px] font-bold">
                  Deportes
                </div>
              </div>
              <div className="p-40 flex flex-col flex-grow">
                <h3 className="text-[28px] font-black text-brand-dark mb-16 group-hover:text-brand-green transition-colors">
                  Canchas y Pistas
                </h3>
                <p className="text-gray-600 mb-32 text-18 flex-grow leading-relaxed">
                  Construcción de pistas de Pádel (estándar WPT), canchas de fútbol de grama sintética y greens de golf con especificaciones profesionales.
                </p>
                <div className="flex items-center text-brand-dark font-bold text-18 group-hover:text-brand-gold transition-colors">
                  Ver Especificaciones{" "}
                  <span className="ml-8 group-hover:translate-x-2 transition-transform">&rarr;</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Parques Infantiles — Unsplash placeholder until images arrive */}
          <Link href="/servicios/parques-infantiles" passHref>
            <div
              id="parques"
              className="group bg-white rounded-xl overflow-hidden shadow-flat hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full cursor-pointer"
            >
              <div className="h-[288px] w-full overflow-hidden relative bg-brand-dark">
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-all duration-500 z-10"></div>
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-1000"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=2070&auto=format&fit=crop')",
                  }}
                ></div>
                <div className="absolute bottom-16 left-16 z-20 bg-brand-gold text-brand-dark px-16 py-4 rounded-sm text-[14px] font-bold">
                  Recreación
                </div>
              </div>
              <div className="p-40 flex flex-col flex-grow">
                <h3 className="text-[28px] font-black text-brand-dark mb-16 group-hover:text-brand-gold transition-colors">
                  Parques Infantiles
                </h3>
                <p className="text-gray-600 mb-32 text-18 flex-grow leading-relaxed">
                  Módulos de juego seguros, duraderos y visualmente atractivos para conjuntos residenciales, colegios y parques públicos.
                </p>
                <div className="flex items-center text-brand-dark font-bold text-18 group-hover:text-brand-gold transition-colors">
                  Ver Catálogo{" "}
                  <span className="ml-8 group-hover:translate-x-2 transition-transform">&rarr;</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Jardín & Terraza — Real image: rooftop complex */}
          <Link href="/servicios/paisajismo" passHref>
            <div
              id="jardin"
              className="group bg-white rounded-xl overflow-hidden shadow-flat hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full cursor-pointer"
            >
              <div className="h-[288px] w-full overflow-hidden relative bg-brand-dark">
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-all duration-500 z-10"></div>
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-1000"
                  style={{
                    backgroundImage:
                      "url('/images/futbol/IMG_0070.JPG')",
                  }}
                ></div>
                <div className="absolute bottom-16 left-16 z-20 bg-brand-dark text-white px-16 py-4 rounded-sm text-[14px] font-bold border border-white/20">
                  Paisajismo
                </div>
              </div>
              <div className="p-40 flex flex-col flex-grow">
                <h3 className="text-[28px] font-black text-brand-dark mb-16 group-hover:text-brand-dark transition-colors">
                  Jardín &amp; Terraza
                </h3>
                <p className="text-gray-600 mb-32 text-18 flex-grow leading-relaxed">
                  Paisajismo comercial y residencial. Transformamos áreas comunes y terrazas en entornos estéticos de alto confort usando grama sintética decorativa.
                </p>
                <div className="flex items-center text-brand-dark font-bold text-18 group-hover:text-brand-gold transition-colors">
                  Descubrir Más{" "}
                  <span className="ml-8 group-hover:translate-x-2 transition-transform">&rarr;</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
