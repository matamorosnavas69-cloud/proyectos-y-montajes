import Link from "next/link";
import BrandIcon from "@/app/components/icons/BrandIcon";

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {/* Canchas — Real image: panoramic field + padel-court-isometric signature */}
          <Link href="/servicios/canchas-deportivas" passHref>
            <div
              id="canchas"
              className="group bg-white rounded-xl overflow-hidden shadow-flat hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full cursor-pointer relative"
            >
              <div className="h-[240px] lg:h-[260px] w-full overflow-hidden relative bg-brand-dark">
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-1000"
                  style={{ backgroundImage: "url('/images/futbol/IMG_7552.JPG')" }}
                />
                <div className="absolute top-4 left-4 z-20 bg-brand-green text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow">
                  Deportes
                </div>
              </div>

              <div className="p-6 lg:p-8 flex flex-col flex-grow relative">
                {/* Floating Architectural Isometric Signature */}
                <div className="-mt-14 mb-4 self-start bg-brand-dark p-2 rounded-xl border border-brand-green/30 shadow-xl z-20 group-hover:border-brand-gold transition-colors">
                  <BrandIcon
                    name="padel-court-isometric"
                    size={64}
                    className="group-hover:scale-105 transition-transform"
                  />
                </div>

                <h3 className="text-2xl font-black text-brand-dark mb-3 group-hover:text-brand-green transition-colors">
                  Canchas y Pistas
                </h3>
                <p className="text-gray-600 mb-6 text-sm lg:text-base flex-grow leading-relaxed">
                  Construcción de pistas de Pádel (estándar WPT), canchas de fútbol sintéticas con certificación FIFA y greens de golf profesionales.
                </p>
                <div className="flex items-center text-brand-dark font-bold text-sm lg:text-base group-hover:text-brand-gold transition-colors pt-3 border-t border-gray-100">
                  Ver Especificaciones Técnicas{" "}
                  <span className="ml-2 group-hover:translate-x-1.5 transition-transform">&rarr;</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Parques Infantiles — Real authentic photo + playground-castle-isometric */}
          <Link href="/servicios/parques-infantiles" passHref>
            <div
              id="parques"
              className="group bg-white rounded-xl overflow-hidden shadow-flat hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full cursor-pointer relative"
            >
              <div className="h-[240px] lg:h-[260px] w-full overflow-hidden relative bg-brand-dark">
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-1000"
                  style={{
                    backgroundImage:
                      "url('/images/drive%20organice/parques/15d81928-0e73-46bd-b651-897cd955e52b.jpg')",
                  }}
                />
                <div className="absolute top-4 left-4 z-20 bg-brand-gold text-brand-dark px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow">
                  Recreación
                </div>
              </div>

              <div className="p-6 lg:p-8 flex flex-col flex-grow relative">
                {/* Floating Architectural Isometric Signature */}
                <div className="-mt-14 mb-4 self-start bg-brand-dark p-2 rounded-xl border border-brand-green/30 shadow-xl z-20 group-hover:border-brand-gold transition-colors">
                  <BrandIcon
                    name="playground-castle-isometric"
                    size={64}
                    className="group-hover:scale-105 transition-transform"
                  />
                </div>

                <h3 className="text-2xl font-black text-brand-dark mb-3 group-hover:text-brand-gold transition-colors">
                  Parques Infantiles
                </h3>
                <p className="text-gray-600 mb-6 text-sm lg:text-base flex-grow leading-relaxed">
                  Módulos de juego de alta seguridad, pisos amortiguantes EPDM continuo y áreas biosaludables para urbanismos y clubes.
                </p>
                <div className="flex items-center text-brand-dark font-bold text-sm lg:text-base group-hover:text-brand-gold transition-colors pt-3 border-t border-gray-100">
                  Explorar Módulos y Pisos{" "}
                  <span className="ml-2 group-hover:translate-x-1.5 transition-transform">&rarr;</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Jardín & Terraza — Real authentic photo + landscaping-pergola-terrace */}
          <Link href="/servicios/paisajismo" passHref>
            <div
              id="jardin"
              className="group bg-white rounded-xl overflow-hidden shadow-flat hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full cursor-pointer relative"
            >
              <div className="h-[240px] lg:h-[260px] w-full overflow-hidden relative bg-brand-dark">
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-1000"
                  style={{
                    backgroundImage:
                      "url('/images/drive%20organice/residencial/IMG_4638.JPG')",
                  }}
                />
                <div className="absolute top-4 left-4 z-20 bg-brand-dark text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border border-white/20 shadow">
                  Paisajismo
                </div>
              </div>

              <div className="p-6 lg:p-8 flex flex-col flex-grow relative">
                {/* Floating Architectural Isometric Signature */}
                <div className="-mt-14 mb-4 self-start bg-brand-dark p-2 rounded-xl border border-brand-green/30 shadow-xl z-20 group-hover:border-brand-gold transition-colors">
                  <BrandIcon
                    name="landscaping-pergola-terrace"
                    size={64}
                    className="group-hover:scale-105 transition-transform"
                  />
                </div>

                <h3 className="text-2xl font-black text-brand-dark mb-3 group-hover:text-brand-green transition-colors">
                  Jardín &amp; Terraza
                </h3>
                <p className="text-gray-600 mb-6 text-sm lg:text-base flex-grow leading-relaxed">
                  Paisajismo residencial y comercial con grama sintética premium, muros verdes verticales y sistemas de drenaje perimetral.
                </p>
                <div className="flex items-center text-brand-dark font-bold text-sm lg:text-base group-hover:text-brand-gold transition-colors pt-3 border-t border-gray-100">
                  Ver Proyectos Residenciales{" "}
                  <span className="ml-2 group-hover:translate-x-1.5 transition-transform">&rarr;</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
