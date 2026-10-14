import Link from "next/link";
import BrandIcon from "@/app/components/icons/BrandIcon";
import PadelLinearIcon from "@/app/components/icons/PadelLinearIcon";
import ParquesLinearIcon from "@/app/components/icons/ParquesLinearIcon";
import PaisajismoLinearIcon from "@/app/components/icons/PaisajismoLinearIcon";

export default function Services() {
  return (
    <section id="servicios" className="w-full py-[128px] bg-brand-light font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <div className="text-center mb-[80px]">
          <h2 className="text-4xl lg:text-5xl font-black text-brand-dark mb-4">Nuestros Pilares de Negocio</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg lg:text-xl">
            Diseñamos, construimos y mantenemos instalaciones de alto rendimiento que transforman
            espacios y rentabilizan inversiones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 pt-8">
          {/* Canchas — Real image: panoramic field + padel-court-isometric signature */}
          <Link href="/servicios/canchas-deportivas" passHref>
            <div
              id="canchas"
              className="group bg-white rounded-2xl overflow-visible shadow-flat hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full cursor-pointer relative"
            >
              <div className="h-[220px] lg:h-[240px] w-full overflow-hidden rounded-t-2xl relative bg-brand-dark">
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-1000"
                  style={{ backgroundImage: "url('/images/futbol/IMG_7552.JPG')" }}
                />
                <div className="absolute top-4 left-4 z-20 bg-brand-green text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                  Deportes
                </div>
              </div>

              <div className="p-6 lg:p-8 flex flex-col flex-grow relative">
                {/* Floating Architectural Isometric Signature — Completely unconfined and 300%+ enlarged */}
                <div className="-mt-24 sm:-mt-28 mb-3 self-center sm:self-start z-20 transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl">
                  <BrandIcon
                    name="padel-court-isometric"
                    width={220}
                    height={220}
                    className="select-none pointer-events-none drop-shadow-2xl"
                  />
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center shrink-0 border border-brand-green/25 shadow-sm">
                    <PadelLinearIcon size={40} className="text-brand-green" />
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark group-hover:text-brand-green transition-colors">
                    Canchas y Pistas
                  </h3>
                </div>

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
              className="group bg-white rounded-2xl overflow-visible shadow-flat hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full cursor-pointer relative"
            >
              <div className="h-[220px] lg:h-[240px] w-full overflow-hidden rounded-t-2xl relative bg-brand-dark">
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-1000"
                  style={{
                    backgroundImage:
                      "url('/images/drive%20organice/parques/15d81928-0e73-46bd-b651-897cd955e52b.jpg')",
                  }}
                />
                <div className="absolute top-4 left-4 z-20 bg-brand-gold text-brand-dark px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                  Recreación
                </div>
              </div>

              <div className="p-6 lg:p-8 flex flex-col flex-grow relative">
                {/* Floating Architectural Isometric Signature — Completely unconfined and 300%+ enlarged */}
                <div className="-mt-24 sm:-mt-28 mb-3 self-center sm:self-start z-20 transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl">
                  <BrandIcon
                    name="playground-castle-isometric"
                    width={220}
                    height={220}
                    className="select-none pointer-events-none drop-shadow-2xl"
                  />
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-brand-gold/15 flex items-center justify-center shrink-0 border border-brand-gold/30 shadow-sm">
                    <ParquesLinearIcon size={40} className="text-brand-gold" />
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark group-hover:text-brand-gold transition-colors">
                    Parques Infantiles
                  </h3>
                </div>

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
              className="group bg-white rounded-2xl overflow-visible shadow-flat hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full cursor-pointer relative"
            >
              <div className="h-[220px] lg:h-[240px] w-full overflow-hidden rounded-t-2xl relative bg-brand-dark">
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-1000"
                  style={{
                    backgroundImage:
                      "url('/images/drive%20organice/residencial/IMG_4638.JPG')",
                  }}
                />
                <div className="absolute top-4 left-4 z-20 bg-brand-dark text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20 shadow-md">
                  Paisajismo
                </div>
              </div>

              <div className="p-6 lg:p-8 flex flex-col flex-grow relative">
                {/* Floating Architectural Isometric Signature — Completely unconfined and 300%+ enlarged */}
                <div className="-mt-24 sm:-mt-28 mb-3 self-center sm:self-start z-20 transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl">
                  <BrandIcon
                    name="landscaping-pergola-terrace"
                    width={220}
                    height={220}
                    className="select-none pointer-events-none drop-shadow-2xl"
                  />
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center shrink-0 border border-brand-green/25 shadow-sm">
                    <PaisajismoLinearIcon size={40} className="text-brand-green" />
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark group-hover:text-brand-green transition-colors">
                    Jardín &amp; Terraza
                  </h3>
                </div>

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
