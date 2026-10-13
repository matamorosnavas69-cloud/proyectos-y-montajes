import Link from 'next/link';

/* ──────────────────────────────────────────────────────────────
 * FEATURED PROJECTS
 * Photo-forward gallery section showcasing real work with
 * an asymmetric masonry grid for visual impact.
 * ────────────────────────────────────────────────────────────── */

const GALLERY_ITEMS = [
  {
    image: '/images/futbol/IMG_0337.JPG',
    title: 'Cancha Club Privado',
    category: 'Fútbol 5',
    span: 'col-span-2 row-span-2',
    height: 'h-[400px] md:h-full',
  },
  {
    image: '/images/padel/7ad44112-8715-477f-a253-8cd0c796ba8b.jpg',
    title: 'Pista de Pádel Cristal',
    category: 'Pádel',
    span: 'col-span-1 row-span-1',
    height: 'h-[220px]',
  },
  {
    image: '/images/futbol/3ACAD10F-DF5C-4A03-988E-72406A244748.JPG',
    title: 'Grama CCGrass FIFA Quality',
    category: 'Materiales',
    span: 'col-span-1 row-span-1',
    height: 'h-[220px]',
  },
  {
    image: '/images/futbol/4628DA9F-CFFA-4742-9DE1-C9BF56C39968.JPG',
    title: 'Cancha Escolar Multiuso',
    category: 'Institucional',
    span: 'col-span-1 row-span-1',
    height: 'h-[220px]',
  },
  {
    image: '/images/padel/IMG_3349.PNG',
    title: 'Fachada Smash Club',
    category: 'Diseño',
    span: 'col-span-1 row-span-1',
    height: 'h-[220px]',
  },
];

export default function FeaturedProjects() {
  return (
    <section className="w-full py-24 md:py-32 bg-brand-light font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-dark/5 border border-brand-dark/10 text-brand-dark text-xs font-bold tracking-widest uppercase mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Nuestro Trabajo
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark leading-tight">
              Proyectos que{' '}
              <span className="text-brand-green">Hablan</span>{' '}
              por Sí Mismos
            </h2>
            <p className="text-gray-500 text-lg mt-4 max-w-xl">
              Cada imagen es un proyecto real entregado. Sin renders, sin filtros — solo 
              calidad verificable.
            </p>
          </div>
          <Link
            href="/portafolio"
            className="inline-flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-green transition-all duration-300 self-start md:self-auto shadow-flat"
          >
            Explorar Portafolio
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Masonry grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto">
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={`${item.span} ${item.height} group relative rounded-2xl overflow-hidden cursor-pointer`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
                <span className="text-brand-gold text-xs font-bold uppercase tracking-widest">
                  {item.category}
                </span>
                <h3 className="text-white text-xl font-black mt-1">{item.title}</h3>
              </div>
              {/* Permanent subtle overlay for text readability on first item */}
              {idx === 0 && (
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 via-transparent to-transparent" />
              )}
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-flat">
          {[
            { value: '20+', label: 'Años de Experiencia', icon: '🏗️' },
            { value: '500+', label: 'Proyectos Entregados', icon: '✅' },
            { value: '98%', label: 'Satisfacción de Clientes', icon: '⭐' },
            { value: '12', label: 'Departamentos Cubiertos', icon: '🇨🇴' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-black text-brand-dark">{stat.value}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
