import Link from "next/link";
import BrandLogo from "@/app/components/brand/BrandLogo";

export default function Footer() {
  return (
    <footer className="w-full bg-brand-dark text-white border-t border-brand-green/20 pt-48 pb-28 px-16 sm:px-24 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-36 lg:gap-48 mb-36">
        {/* Brand Column */}
        <div className="col-span-1 sm:col-span-2">
          <div className="mb-20">
            <BrandLogo
              variant="institutional"
              theme="dark"
              height={76}
              className="hover:opacity-95 transition-opacity"
            />
          </div>
          <p className="text-gray-400 max-w-md mb-20 text-15 sm:text-16 leading-relaxed">
            Más de 20 años de experiencia transformando espacios en Colombia.
            Ingeniería de vanguardia en infraestructura deportiva de alto rendimiento,
            parques recreativos y paisajismo arquitectónico.
          </p>
          <div className="inline-flex items-center gap-8 px-14 py-6 rounded-full bg-brand-green/20 border border-brand-green/60 text-brand-gold text-12 font-medium">
            <span className="w-6 h-6 rounded-full bg-brand-gold animate-pulse" />
            Construcción Comercial y Residencial
          </div>
        </div>

        {/* Services Column */}
        <div>
          <h4 className="font-bold text-16 sm:text-18 mb-16 text-white tracking-wide">
            Especialidades
          </h4>
          <ul className="space-y-10 text-gray-400 text-14 sm:text-15">
            <li>
              <Link
                href="/servicios/canchas-deportivas"
                className="hover:text-brand-gold transition-colors inline-block py-2"
              >
                Pistas de Pádel & Fútbol Sintético
              </Link>
            </li>
            <li>
              <Link
                href="/servicios/parques-infantiles"
                className="hover:text-brand-gold transition-colors inline-block py-2"
              >
                Parques Infantiles & Pisos de Seguridad
              </Link>
            </li>
            <li>
              <Link
                href="/servicios/paisajismo"
                className="hover:text-brand-gold transition-colors inline-block py-2"
              >
                Jardines & Terrazas Arquitectónicas
              </Link>
            </li>
            <li>
              <Link
                href="/portafolio"
                className="hover:text-brand-gold transition-colors inline-block py-2"
              >
                Portafolio de Obras Concluidas
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Channels Column */}
        <div>
          <h4 className="font-bold text-16 sm:text-18 mb-16 text-white tracking-wide">
            Atención & Cobertura
          </h4>
          <ul className="space-y-10 text-gray-400 text-14 sm:text-15">
            <li className="flex items-start gap-8">
              <span className="text-brand-gold font-bold">Sede:</span>
              <span>Bucaramanga, Santander, Colombia</span>
            </li>
            <li className="flex items-start gap-8">
              <span className="text-brand-gold font-bold">Cobertura:</span>
              <span>Proyectos a nivel nacional</span>
            </li>
            <li className="pt-8">
              <Link
                href="/#simulador"
                className="inline-flex items-center gap-6 text-brand-gold hover:text-yellow-400 font-semibold transition-colors"
              >
                <span>Cotizar Proyecto en Línea &rarr;</span>
              </Link>
            </li>
            <li>
              <Link
                href="/cliente"
                className="inline-flex items-center gap-6 text-gray-400 hover:text-white transition-colors"
              >
                <span>Acceso a Portal de Clientes &rarr;</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal & Credits bar */}
      <div className="max-w-7xl mx-auto border-t border-gray-800/80 pt-24 flex flex-col sm:flex-row items-center justify-between gap-12 text-gray-500 text-12">
        <p>
          &copy; {new Date().getFullYear()} Proyectos y Montajes. Todos los derechos reservados.
        </p>
        <p className="text-gray-500 text-11">
          Ingeniería deportiva, recreativa y paisajismo arquitectónico en Colombia.
        </p>
      </div>
    </footer>
  );
}
