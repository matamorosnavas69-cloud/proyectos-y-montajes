import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-brand-dark border-b border-brand-green/20 text-white shadow-flat backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-16 h-[80px] flex items-center justify-between">
        {/* Logo area */}
        <Link href="/" className="flex flex-col gap-[2px] cursor-pointer">
          <span className="text-24 font-black tracking-tighter text-brand-gold leading-none font-sans">
            PROYECTOS
          </span>
          <span className="text-12 font-semibold tracking-widest text-brand-light leading-none font-sans">
            & MONTAJES
          </span>
        </Link>

        {/* Navigation Segments */}
        <nav className="hidden md:flex items-center gap-32 font-medium font-sans">
          <Link href="/servicios/canchas-deportivas" className="text-gray-300 hover:text-brand-gold transition-colors text-16">
            Canchas Deportivas
          </Link>
          <Link href="/servicios/parques-infantiles" className="text-gray-300 hover:text-brand-gold transition-colors text-16">
            Parques Infantiles
          </Link>
          <Link href="/servicios/paisajismo" className="text-gray-300 hover:text-brand-gold transition-colors text-16">
            Jardín & Terraza
          </Link>
          <Link href="/portafolio" className="text-white hover:text-brand-green transition-colors text-16 font-bold">
            Portafolio
          </Link>
          <Link href="/nosotros" className="text-gray-300 hover:text-brand-gold transition-colors text-16">
            Nosotros
          </Link>
        </nav>

        {/* High-visibility CTA */}
        <Link
          href="/#simulador"
          className="bg-brand-gold text-brand-dark px-16 py-8 rounded-md font-bold hover:bg-yellow-400 transition-all shadow-flat font-sans"
        >
          Cotizar Proyecto
        </Link>
      </div>
    </header>
  );
}
