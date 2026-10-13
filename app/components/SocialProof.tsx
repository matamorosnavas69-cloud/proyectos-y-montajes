export default function SocialProof() {
  return (
    <section className="w-full py-48 bg-white border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-16">
        <p className="text-center text-[14px] font-bold text-brand-green uppercase tracking-widest mb-40">
          Autoridad comprobada. Proyectos construidos para líderes del sector.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-48 md:gap-[96px]">
          {/* Logo 1: UPB */}
          <div className="flex items-center gap-12 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500 cursor-pointer">
            <div className="h-48 w-48 bg-gray-200 rounded-full flex items-center justify-center font-black text-gray-500">
              U
            </div>
            <span className="text-24 font-black text-gray-800 tracking-tight">UPB Bucaramanga</span>
          </div>

          {/* Logo 2: Club Atlético Bucaramanga */}
          <div className="flex items-center gap-12 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500 cursor-pointer">
            <div className="h-48 w-48 bg-gray-200 rounded-full flex items-center justify-center font-black text-gray-500">
              CAB
            </div>
            <span className="text-24 font-black text-gray-800 tracking-tight">
              Club Atlético Bucaramanga
            </span>
          </div>

          {/* Additional trust indicator */}
          <div className="flex items-center gap-8">
            <span className="text-48 font-black text-brand-gold">+500</span>
            <span className="text-[14px] font-bold text-gray-500 leading-tight">
              Proyectos
              <br />
              Entregados
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
