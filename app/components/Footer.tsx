export default function Footer() {
  return (
    <footer className="w-full bg-brand-dark text-white border-t border-brand-green/20 pt-48 pb-24 px-16 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-48 mb-32">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-24 font-black text-brand-gold mb-16">Proyectos y Montajes</h3>
          <p className="text-gray-400 max-w-sm mb-24 text-16 leading-relaxed">
            Construyendo espacios premium con más de 20 años de experiencia. Liderando la innovación
            en infraestructura deportiva y paisajismo en Colombia.
          </p>
          <div className="inline-flex items-center gap-8 px-12 py-4 rounded-full bg-brand-green/20 border border-brand-green text-brand-light text-12">
            Expertos en Proyectos Comerciales
          </div>
        </div>

        <div>
          <h4 className="font-bold text-18 mb-16 text-brand-light">Servicios</h4>
          <ul className="space-y-8 text-gray-400 text-16">
            <li>
              <a href="#canchas" className="hover:text-brand-gold transition-colors">
                Canchas de Pádel
              </a>
            </li>
            <li>
              <a href="#canchas" className="hover:text-brand-gold transition-colors">
                Fútbol Sintético
              </a>
            </li>
            <li>
              <a href="#parques" className="hover:text-brand-gold transition-colors">
                Parques Infantiles
              </a>
            </li>
            <li>
              <a href="#jardin" className="hover:text-brand-gold transition-colors">
                Paisajismo y Terrazas
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-18 mb-16 text-brand-light">Contacto</h4>
          <ul className="space-y-8 text-gray-400 text-16">
            <li>Bucaramanga, Colombia</li>
            <li>proyectos@ejemplo.com</li>
            <li>+57 300 000 0000</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-gray-800 pt-24 text-center text-gray-500 text-12">
        &copy; {new Date().getFullYear()} Proyectos y Montajes. Todos los derechos reservados.
      </div>
    </footer>
  );
}
