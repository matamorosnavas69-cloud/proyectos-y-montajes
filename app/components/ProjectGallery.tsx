'use client';

import Image from 'next/image';
import { useState } from 'react';

type GalleryCategory = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  images: Array<{ src: string; alt: string; position?: string }>;
};

const ASSET_ROOT = '/images/drive%20organice';

const CATEGORIES: GalleryCategory[] = [
  {
    id: 'canchas', label: 'Canchas', eyebrow: 'Ingeniería deportiva',
    title: 'Espacios que invitan a competir.',
    description: 'Superficies de alto desempeño, iluminación y cerramientos pensados para el uso intenso y la experiencia del jugador.',
    images: [
      { src: `${ASSET_ROOT}/canchas/IMG_7552.JPG`, alt: 'Cancha deportiva terminada' },
      { src: `${ASSET_ROOT}/canchas/3ACAD10F-DF5C-4A03-988E-72406A244748.JPG`, alt: 'Detalle de cancha con grama sintética' },
      { src: `${ASSET_ROOT}/canchas/4628DA9F-CFFA-4742-9DE1-C9BF56C39968.JPG`, alt: 'Cancha deportiva institucional' },
      { src: `${ASSET_ROOT}/canchas/IMG_0219.JPG`, alt: 'Infraestructura para cancha deportiva' },
    ],
  },
  {
    id: 'parques', label: 'Parques', eyebrow: 'Recreación segura',
    title: 'Juego, seguridad y comunidad.',
    description: 'Áreas recreativas que equilibran materiales durables, recorridos seguros y una presencia visual memorable para cada comunidad.',
    images: [
      { src: `${ASSET_ROOT}/parques/IMG_0311.JPG`, alt: 'Parque infantil terminado' },
      { src: `${ASSET_ROOT}/parques/IMG_4683.JPG`, alt: 'Zona recreativa para niños' },
      { src: `${ASSET_ROOT}/parques/IMG_2430.JPG`, alt: 'Módulos de juego infantil' },
      { src: `${ASSET_ROOT}/parques/IMG_4678.JPG`, alt: 'Detalle de instalación recreativa' },
    ],
  },
  {
    id: 'piscina', label: 'Piscinas', eyebrow: 'Bienestar residencial',
    title: 'Amenidades que elevan el proyecto.',
    description: 'Entornos acuáticos y zonas de descanso ejecutados con cuidado por el detalle, el confort y la durabilidad exterior.',
    images: [
      { src: `${ASSET_ROOT}/piscina/b2ad76f9-f7f7-4058-a6d2-233768567a03.JPG`, alt: 'Piscina de proyecto residencial' },
      { src: `${ASSET_ROOT}/piscina/IMG_0557.JPG`, alt: 'Zona de piscina terminada' },
      { src: `${ASSET_ROOT}/piscina/IMG_7986.JPG`, alt: 'Detalle de área de piscina' },
      { src: `${ASSET_ROOT}/piscina/119d77c7-874f-4b38-aaec-b487cec9a707.jpg`, alt: 'Amenidad acuática exterior' },
    ],
  },
  {
    id: 'golf', label: 'Golf', eyebrow: 'Paisajismo técnico',
    title: 'Verde preciso, acabado impecable.',
    description: 'Soluciones de paisajismo deportivo para superficies que deben verse impecables, responder bien y mantenerse en el tiempo.',
    images: [
      { src: `${ASSET_ROOT}/golf/IMG_8333.JPG`, alt: 'Superficie de golf y paisajismo' },
      { src: `${ASSET_ROOT}/golf/IMG_8194.JPG`, alt: 'Detalle de paisaje deportivo' },
      { src: `${ASSET_ROOT}/golf/IMG_5661.JPG`, alt: 'Área verde de golf' },
      { src: `${ASSET_ROOT}/golf/IMG_6978.JPG`, alt: 'Intervención de paisajismo para golf' },
    ],
  },
  {
    id: 'residencial', label: 'Residencial', eyebrow: 'Espacios compartidos',
    title: 'El detalle que hace hogar.',
    description: 'Intervenciones para conjuntos y proyectos residenciales que aportan valor, identidad y experiencias cotidianas de calidad.',
    images: [
      { src: `${ASSET_ROOT}/residencial/IMG_5682.JPEG`, alt: 'Zona residencial intervenida' },
      { src: `${ASSET_ROOT}/residencial/IMG_4638.JPG`, alt: 'Espacio común residencial' },
      { src: `${ASSET_ROOT}/residencial/4FC28C5F-B07D-4998-A253-243A3FF09A81.jpg`, alt: 'Proyecto residencial terminado' },
      { src: `${ASSET_ROOT}/residencial/IMG_4441.JPG`, alt: 'Área exterior en conjunto residencial' },
    ],
  },
];

export default function ProjectGallery() {
  const [activeCategory, setActiveCategory] = useState(0);
  const category = CATEGORIES[activeCategory];

  return (
    <section id="galeria" className="bg-white py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-20 items-end mb-12">
          <div>
            <p className="text-brand-green text-xs font-black uppercase tracking-[0.2em] mb-5">Archivo de obra</p>
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark leading-[1.05]">Una galería diseñada para ver el trabajo de cerca.</h2>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl lg:pb-1">Seleccionamos una muestra de proyectos reales por especialidad. La composición cambia con cada línea de negocio para que cada imagen tenga el espacio que merece.</p>
        </div>

        <div role="tablist" aria-label="Especialidades del portafolio" className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {CATEGORIES.map((item, index) => {
            const isActive = index === activeCategory;
            return <button key={item.id} type="button" role="tab" aria-selected={isActive} aria-controls={`gallery-panel-${item.id}`} onClick={() => setActiveCategory(index)} className={`shrink-0 rounded-full px-5 py-3 text-sm font-bold transition-all duration-300 ${isActive ? 'bg-brand-dark text-white shadow-lg shadow-brand-dark/15' : 'bg-brand-light text-gray-600 hover:bg-brand-green/10 hover:text-brand-green'}`}>{item.label}</button>;
          })}
        </div>

        <div id={`gallery-panel-${category.id}`} role="tabpanel" className="grid grid-cols-1 lg:grid-cols-[0.78fr_1.22fr] gap-6 lg:gap-8">
          <div className="bg-brand-dark rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[280px] lg:min-h-full">
            <div>
              <p className="text-brand-gold text-xs font-black uppercase tracking-[0.18em] mb-5">{category.eyebrow}</p>
              <h3 className="text-3xl md:text-4xl text-white font-black leading-tight">{category.title}</h3>
              <p className="text-gray-400 mt-6 leading-relaxed">{category.description}</p>
            </div>
            <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between text-sm"><span className="text-white font-bold">Proyectos reales</span><span className="text-brand-gold font-black">0{activeCategory + 1} / 05</span></div>
          </div>

          <div className="grid grid-cols-2 grid-rows-[minmax(180px,1.45fr)_minmax(130px,0.8fr)] gap-4 md:gap-5 min-h-[430px] md:min-h-[540px]">
            {category.images.map((image, index) => (
              <figure key={image.src} className={`group relative overflow-hidden rounded-2xl bg-brand-dark ${index === 0 ? 'col-span-2' : ''}`}>
                <Image src={image.src} alt={image.alt} fill sizes={index === 0 ? '(max-width: 1024px) 100vw, 55vw' : '(max-width: 768px) 50vw, 28vw'} className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" priority={activeCategory === 0 && index === 0} />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                {index === 0 && <figcaption className="absolute bottom-5 left-6 text-white text-sm font-bold tracking-wide">{category.label} · Proyectos y Montajes</figcaption>}
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
