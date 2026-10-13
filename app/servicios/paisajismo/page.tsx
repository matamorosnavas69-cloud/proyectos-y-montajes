import Link from "next/link";
import Image from "next/image";
import QuoteSimulator from "@/app/components/QuoteSimulator";
import ServiceShowcaseGallery from "@/app/components/ServiceShowcaseGallery";

export const metadata = {
  title: "Paisajismo y Terrazas con Grama Sintética | Proyectos y Montajes",
  description: "Transformamos espacios. Instalación de grama sintética decorativa para jardines, terrazas y zonas comunes. Máxima estética y cero mantenimiento.",
};

export default function PaisajismoPage() {
  return (
    <div className="flex flex-col w-full bg-brand-light">
      {/* Service Hero */}
      <section className="relative w-full py-32 md:py-48 bg-brand-dark overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-brand-dark/80 mix-blend-multiply z-10" />
          <Image
            src="/images/drive%20organice/residencial/IMG_4638.JPG"
            alt="Paisajismo Residencial y Comercial"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center text-white">
          <Link href="/#servicios" className="inline-flex items-center text-brand-gold hover:text-white transition-colors mb-8 font-bold text-sm tracking-widest uppercase">
            &larr; Volver a Servicios
          </Link>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Diseño de <span className="text-white border-b-4 border-brand-green">Paisajismo</span> Residencial
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-300 max-w-3xl mx-auto">
            Grama sintética decorativa premium que aporta vida, frescura y elegancia a cualquier espacio interior o exterior sin el costo de mantenimiento.
          </p>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-black text-brand-dark mb-6">Estética Permanente, Cero Riego</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Adecuamos terrazas de apartamentos, jardines de casas campestres y zonas comunes de conjuntos cerrados. Nuestra grama decorativa cuenta con protección UV, sistema de drenaje rápido y una apariencia &ldquo;Real Feel&rdquo; idéntica al pasto natural.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-brand-green mr-3">✓</span>
                <span className="text-brand-dark font-medium">Ahorro de hasta un 90% en la factura de agua.</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-green mr-3">✓</span>
                <span className="text-brand-dark font-medium">Protección UV contra decoloración (garantía de hasta 8 años).</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-green mr-3">✓</span>
                <span className="text-brand-dark font-medium">Seguro para niños y amigable con mascotas (Pet-Friendly).</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-green mr-3">✓</span>
                <span className="text-brand-dark font-medium">Libre de alergias, pesticidas e insectos.</span>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/drive%20organice/residencial/IMG_1271.PNG"
                alt="Terraza residencial con grama sintética"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-lg mt-8">
              <Image
                src="/images/drive%20organice/piscina/IMG_8075.JPG"
                alt="Zona de piscina y deck con césped decorativo"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* High-End Showcase Gallery Aligned with Service */}
      <ServiceShowcaseGallery
        service="paisajismo"
        customEyebrow="Archivo Técnico de Paisajismo"
        customTitle="Espacios exteriores que se disfrutan todos los días."
        customDescription="Explore más de 390 intervenciones reales en zonas comunes, terrazas en áticos, jardines campestres y entornos de piscina ejecutados con grama decorativa atérmica de alta durabilidad."
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
