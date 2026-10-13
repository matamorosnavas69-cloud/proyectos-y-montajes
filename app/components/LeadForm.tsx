export default function LeadForm() {
  return (
    <section id="quote" className="w-full py-[128px] bg-brand-dark text-white relative overflow-hidden font-sans">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-green/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-4xl mx-auto px-16 text-center relative z-10">
        <h2 className="text-48 font-black mb-32 leading-tight">
          Eleve el nivel de su proyecto <br />
          con <span className="text-brand-gold">Proyectos y Montajes</span>
        </h2>
        <p className="text-[20px] text-gray-300 mb-48 max-w-2xl mx-auto font-light leading-relaxed">
          Déjenos sus datos y un ingeniero especialista se pondrá en contacto para brindarle una
          asesoría técnica y una cotización a medida.
        </p>

        <div className="bg-white/5 p-32 md:p-48 rounded-xl border border-white/10 backdrop-blur-md shadow-2xl">
          <form className="flex flex-col gap-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
              <input
                type="text"
                placeholder="Nombre o Empresa"
                className="w-full px-24 py-16 rounded-md bg-brand-dark/50 border border-white/20 text-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors text-16 shadow-flat"
              />
              <input
                type="email"
                placeholder="Correo Electrónico"
                className="w-full px-24 py-16 rounded-md bg-brand-dark/50 border border-white/20 text-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors text-16 shadow-flat"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
              <input
                type="tel"
                placeholder="Teléfono / WhatsApp"
                className="w-full px-24 py-16 rounded-md bg-brand-dark/50 border border-white/20 text-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors text-16 shadow-flat"
              />
              <div className="relative w-full">
                <select
                  defaultValue=""
                  className="w-full px-24 py-16 rounded-md bg-brand-dark/50 border border-white/20 text-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors appearance-none text-16 shadow-flat"
                >
                  <option value="" disabled>
                    Tipo de Proyecto
                  </option>
                  <option value="padel" className="bg-brand-dark text-white">Cancha de Pádel</option>
                  <option value="futbol" className="bg-brand-dark text-white">Cancha Sintética (Fútbol)</option>
                  <option value="parque" className="bg-brand-dark text-white">Parque Infantil</option>
                  <option value="paisajismo" className="bg-brand-dark text-white">Paisajismo / Terraza</option>
                  <option value="otro" className="bg-brand-dark text-white">Otro</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-16 text-white">
                  <svg className="fill-current h-16 w-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="w-full mt-16 bg-brand-gold text-brand-dark px-32 py-22 rounded-md font-black text-[20px] hover:bg-yellow-400 transition-colors shadow-flat hover:shadow-brand-gold/20"
            >
              Solicitar Asesoría Inmediata
            </button>
            <p className="text-[14px] text-gray-400 mt-16">
              Información confidencial. No compartiremos sus datos con terceros.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
