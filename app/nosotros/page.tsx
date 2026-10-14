import Link from "next/link";
import QuoteSimulator from "@/app/components/QuoteSimulator";
import BrandIcon from "@/app/components/icons/BrandIcon";
import PadelLinearIcon from "@/app/components/icons/PadelLinearIcon";
import ParquesLinearIcon from "@/app/components/icons/ParquesLinearIcon";
import PaisajismoLinearIcon from "@/app/components/icons/PaisajismoLinearIcon";

export const metadata = {
  title: "Nosotros | 20 Años de Experiencia | Proyectos y Montajes",
  description: "Conoce a Proyectos y Montajes, expertos con más de 20 años de trayectoria en construcción de infraestructura deportiva, parques infantiles y paisajismo.",
};

export default function NosotrosPage() {
  return (
    <div className="flex flex-col w-full bg-brand-light">
      {/* Hero Section */}
      <section className="relative w-full py-32 md:py-48 bg-brand-dark overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-brand-dark/40 z-10"></div>
          <div
            className="w-full h-full bg-cover bg-center opacity-90 transition-opacity duration-700"
            style={{
              backgroundImage:
                "url('/images/padel/IMG_3348.PNG')",
            }}
          ></div>
        </div>
        
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight drop-shadow-lg">
            Nuestra <span className="text-gradient-gold">Trayectoria</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-100 max-w-2xl mx-auto drop-shadow-md">
            Más de dos décadas transformando espacios en Colombia con ingeniería de precisión y materiales de vanguardia.
          </p>
        </div>
      </section>

      {/* The Story */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-brand-dark mb-6">20 Años Construyendo Excelencia</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              En <strong className="text-brand-dark">Proyectos y Montajes</strong>, no somos simplemente instaladores de grama. Somos una empresa de ingeniería especializada en la creación de ecosistemas deportivos, recreativos y paisajísticos que perduran en el tiempo.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Nuestro enfoque principal es la rentabilidad de tu inversión. Entendemos que una cancha de Pádel, una escuela de Fútbol o un complejo residencial requieren infraestructura que resista el tráfico extremo sin perder sus propiedades estéticas ni de seguridad.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="border-l-4 border-brand-green pl-4">
                <div className="text-3xl font-black text-brand-dark">20+</div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Años de Exp.</div>
              </div>
              <div className="border-l-4 border-brand-gold pl-4">
                <div className="text-3xl font-black text-brand-dark">200+</div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Proyectos Entregados</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img src="/images/futbol/3ACAD10F-DF5C-4A03-988E-72406A244748.JPG" alt="CCGrass FIFA Quality — Proveedor certificado" className="rounded-2xl shadow-2xl z-10 relative" />
            <div className="absolute -bottom-8 -left-8 bg-brand-gold p-8 rounded-xl shadow-xl z-20 hidden md:block max-w-xs">
              <p className="font-bold text-brand-dark italic">"Nuestra garantía no es un papel, es la calidad de los materiales europeos con los que construimos."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Materials */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold uppercase tracking-widest mb-3">
            Rigor de Ingeniería
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-16">Calidad y Normativa Internacional</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center p-8 rounded-2xl border border-gray-100 shadow-sm bg-white hover:shadow-xl transition-all duration-300 group hover:border-brand-green/30">
              <div className="w-full h-56 sm:h-64 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <BrandIcon name="padel-court-isometric" size={240} className="drop-shadow-xl select-none" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0 border border-brand-green/20">
                  <PadelLinearIcon size={28} className="text-brand-green" />
                </div>
                <h3 className="text-xl font-black text-brand-dark group-hover:text-brand-green transition-colors">Certificación FIFA &amp; WPT</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed text-center">
                Instalamos gramas sintéticas monofilamento avaladas por laboratorios internacionales, garantizando bote perfecto y tracción biomecánica.
              </p>
            </div>
            
            <div className="flex flex-col items-center p-8 rounded-2xl border border-gray-100 shadow-sm bg-white hover:shadow-xl transition-all duration-300 group hover:border-brand-gold/30">
              <div className="w-full h-56 sm:h-64 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <BrandIcon name="playground-safety-floor" size={240} className="drop-shadow-xl select-none" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center shrink-0 border border-brand-gold/30">
                  <ParquesLinearIcon size={28} className="text-brand-gold" />
                </div>
                <h3 className="text-xl font-black text-brand-dark group-hover:text-brand-gold transition-colors">Norma EN-1177 (Parques)</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed text-center">
                Nuestros pisos de caucho EPDM continuo superan las pruebas de absorción de impacto crítico (HIC), protegiendo la integridad de los niños.
              </p>
            </div>
            
            <div className="flex flex-col items-center p-8 rounded-2xl border border-gray-100 shadow-sm bg-white hover:shadow-xl transition-all duration-300 group hover:border-brand-green/30">
              <div className="w-full h-56 sm:h-64 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <BrandIcon name="landscaping-fibers" size={240} className="drop-shadow-xl select-none" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0 border border-brand-green/20">
                  <PaisajismoLinearIcon size={28} className="text-brand-green" />
                </div>
                <h3 className="text-xl font-black text-brand-dark group-hover:text-brand-green transition-colors">Protección UV Avanzada</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed text-center">
                Fibras de última generación con tratamiento contra la degradación solar. Aseguramos color verde intenso hasta por 8 años a la intemperie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator / Contact */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-black text-brand-dark mb-4">¿Listo para construir con los mejores?</h2>
          <p className="text-gray-600 text-lg">Cotiza tu proyecto y recibe atención prioritaria de nuestros ingenieros.</p>
        </div>
        <QuoteSimulator />
      </section>
    </div>
  );
}
