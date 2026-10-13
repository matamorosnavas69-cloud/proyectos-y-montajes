import Link from "next/link";
import Image from "next/image";
import QuoteSimulator from "@/app/components/QuoteSimulator";
import ServiceShowcaseGallery from "@/app/components/ServiceShowcaseGallery";

export const metadata = {
  title: "Construcción de Canchas Deportivas y Pistas de Pádel | Proyectos y Montajes",
  description: "Especialistas en diseño y construcción de pistas de Pádel, canchas de fútbol sintéticas y campos de golf con estándares profesionales y materiales europeos certificados.",
};

export default function CanchasDeportivasPage() {
  return (
    <div className="flex flex-col w-full bg-brand-light">
      {/* Service Hero — Real padel court image */}
      <section className="relative w-full py-32 md:py-48 bg-brand-dark overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-brand-dark/75 mix-blend-multiply z-10" />
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/images/padel/7ad44112-8715-477f-a253-8cd0c796ba8b.jpg')",
            }}
          />
        </div>
        
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center text-white">
          <Link href="/#servicios" className="inline-flex items-center text-brand-gold hover:text-white transition-colors mb-8 font-bold text-sm tracking-widest uppercase">
            &larr; Volver a Servicios
          </Link>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Canchas <span className="text-brand-green">Deportivas</span> y Pistas de Pádel
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-300 max-w-3xl mx-auto">
            Infraestructura deportiva de alto rendimiento diseñada para maximizar la durabilidad y rentabilidad de tu inversión.
          </p>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-black text-brand-dark mb-6">Especificaciones de Clase Mundial</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Construimos canchas y pistas deportivas bajo las normativas internacionales (WPT para Pádel, FIFA para Fútbol). Utilizamos grama sintética de última generación con monofilamentos texturizados que garantizan un rebote perfecto y previenen lesiones.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-brand-green mr-3">✓</span>
                <span className="text-brand-dark font-medium">Pistas de Pádel con cristal templado de 12mm y estructura galvanizada.</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-green mr-3">✓</span>
                <span className="text-brand-dark font-medium">Canchas de Fútbol 5, 7 y 11 con drenaje optimizado.</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-green mr-3">✓</span>
                <span className="text-brand-dark font-medium">Greens de Golf residenciales y comerciales.</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-green mr-3">✓</span>
                <span className="text-brand-dark font-medium">Iluminación LED deportiva anti-deslumbrante.</span>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/futbol/806ebee3-c75b-4dcf-8e3b-eae1d864d211.jpg"
                alt="Cancha de fútbol con iluminación"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-lg mt-8">
              <Image
                src="/images/futbol/5083d30f-983b-4c09-8fb5-f973e703ac1d.jpg"
                alt="Cancha de fútbol comunitaria"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Material Authority */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <Image
              src="/images/futbol/3ACAD10F-DF5C-4A03-988E-72406A244748.JPG"
              alt="CCGrass FIFA Quality Preferred Producer"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs font-bold tracking-widest uppercase mb-4">
              Proveedor Certificado FIFA
            </div>
            <h2 className="text-3xl font-black text-brand-dark mb-4">Grama CCGrass — FIFA Quality</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Trabajamos exclusivamente con <strong>CCGrass</strong>, el productor preferido de FIFA para grama sintética de alto rendimiento. Cada rollo que instalamos cuenta con certificación de laboratorio y trazabilidad completa de lote.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-l-4 border-brand-green pl-4">
                <div className="text-2xl font-black text-brand-dark">60mm</div>
                <div className="text-xs font-bold text-gray-500 uppercase">Altura de Fibra</div>
              </div>
              <div className="border-l-4 border-brand-gold pl-4">
                <div className="text-2xl font-black text-brand-dark">8+ años</div>
                <div className="text-xs font-bold text-gray-500 uppercase">Vida Útil UV</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-End Showcase Gallery Aligned with Service */}
      <ServiceShowcaseGallery
        service="canchas"
        customEyebrow="Archivo Técnico de Canchas"
        customTitle="Obras que elevan la experiencia de competir."
        customDescription="Explore más de 180 canchas sintéticas, pistas de pádel panorámicas, greens de golf y cerramientos perimetrales ejecutados por nuestro equipo técnico en toda Colombia."
      />

      {/* Embedded Lead Capture */}
      <section id="simulador" aria-labelledby="diagnostic-heading" className="relative overflow-hidden border-t border-gray-200 bg-[#f3f6f2] px-6 py-[72px] md:py-[112px]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-[40px] grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-green">Planificación guiada</p>
              <h2 id="diagnostic-heading" className="mt-3 text-3xl font-black leading-tight text-brand-dark md:text-4xl">Una propuesta precisa empieza con un buen diagnóstico.</h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600 md:pb-1">Comparta los datos esenciales de su proyecto. Nuestro equipo los convierte en una revisión técnica, una visita bien preparada y una propuesta con alcance claro.</p>
          </div>
          <QuoteSimulator />
        </div>
      </section>
    </div>
  );
}
