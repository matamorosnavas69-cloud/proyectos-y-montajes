import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PortfolioAdminBar from "@/app/components/admin/PortfolioAdminBar";
import { toPublicProject, PublicProjectDTO } from "@/lib/portfolio/serializer";
import { Sparkles, MapPin, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Portafolio de Proyectos | Proyectos y Montajes",
  description: "Explora nuestros proyectos recientes en construcción de canchas deportivas, pistas de pádel, parques infantiles y paisajismo.",
};

export const dynamic = "force-dynamic";

export default async function PortafolioPage() {
  // Query only published projects, ordered by portfolioOrder then recency
  let projects: PublicProjectDTO[] = [];
  try {
    const rawProjects = await prisma.project.findMany({
      where: { published: true },
      orderBy: [
        { portfolioOrder: "asc" },
        { createdAt: "desc" },
      ],
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });
    projects = rawProjects.map(toPublicProject);
  } catch (error) {
    console.error("Error fetching projects from DB:", error);
  }

  const featuredProjects = projects.filter((p) => p.featured);
  const standardProjects = projects;

  return (
    <div className="flex flex-col w-full bg-brand-light min-h-screen">
      {/* Admin Action Bar (visible only to authenticated admins) */}
      <PortfolioAdminBar />

      {/* Hero */}
      <section className="w-full py-28 bg-brand-dark text-center px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-green/20 border border-brand-green/40 text-brand-gold text-xs font-bold uppercase tracking-widest mb-6">
            Ingeniería Deportiva & Paisajismo
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Nuestro <span className="text-brand-gold">Portafolio</span>
          </h1>
          <p className="text-lg md:text-xl font-light text-gray-300 max-w-2xl mx-auto">
            Resultados tangibles y acabados de estándar europeo. Más de 20 años transformando espacios en infraestructuras deportivas de clase mundial.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 w-full space-y-16">
        {/* Featured Section if available */}
        {featuredProjects.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-brand-gold/20 text-brand-gold flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-2xl font-black text-brand-dark">Proyectos Destacados</h2>
                <p className="text-xs text-gray-500">Obras emblemáticas y de alta especificación técnica</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <Link href={`/portafolio/${project.slug}`} key={project.id} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-brand-gold/30 flex flex-col md:flex-row h-full">
                    <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden relative bg-gray-100">
                      {project.mainImage ? (
                        <img
                          src={project.mainImage}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                          Sin Imagen
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-brand-gold text-brand-dark text-[10px] font-black px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
                        Destacado
                      </div>
                    </div>
                    <div className="p-6 md:w-1/2 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] font-black text-brand-green uppercase tracking-wider mb-2">
                          {project.category}
                        </div>
                        <h3 className="text-xl font-black text-brand-dark mb-2 group-hover:text-brand-green transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-500 text-xs mb-3 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span>{project.location || project.city || project.client || "Colombia"}</span>
                        </p>
                        {project.shortDescription && (
                          <p className="text-gray-600 text-xs line-clamp-3 mb-4 leading-relaxed">
                            {project.shortDescription}
                          </p>
                        )}
                      </div>
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-brand-dark">
                        <span className="text-brand-green">{project.sqMeters ? `${project.sqMeters.toLocaleString()} m²` : project.duration}</span>
                        <span className="text-brand-gold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Ver Obra <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Projects Grid */}
        <div className="space-y-6">
          {featuredProjects.length > 0 && (
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-brand-dark">Todos los Proyectos</h2>
              <span className="text-xs text-gray-400 font-bold">({projects.length})</span>
            </div>
          )}

          {projects.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-300 p-8 shadow-sm">
              <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-4 font-black text-2xl">
                🏗️
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-2">Aún no hay proyectos publicados</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
                Inicia sesión como administrador para publicar canchas de pádel, campos sintéticos, parques infantiles y proyectos de paisajismo con fotos directas en Supabase.
              </p>
              <Link
                href="/admin/proyectos"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-gold hover:bg-yellow-400 text-brand-dark font-black text-sm transition-all shadow-md"
              >
                Acceder al Panel Admin
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {standardProjects.map((project) => (
                <Link href={`/portafolio/${project.slug}`} key={project.id} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-flat hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-1">
                    <div className="h-64 w-full overflow-hidden relative bg-gray-100">
                      {project.mainImage ? (
                        <img
                          src={project.mainImage}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                          Sin Imagen
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-brand-green text-white text-[11px] font-black px-3 py-1 rounded-md uppercase tracking-wider shadow-md">
                        {project.category}
                      </div>
                      {Array.isArray(project.gallery) && project.gallery.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow">
                          📷 {project.gallery.length} fotos
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-black text-brand-dark mb-2 group-hover:text-brand-green transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-500 text-xs mb-4 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span>{project.location || project.city || project.client || "Cliente Privado"}</span>
                      </p>
                      
                      {(project.shortDescription || project.description) && (
                        <p className="text-gray-600 text-xs line-clamp-2 mb-4 leading-relaxed">
                          {project.shortDescription || project.description}
                        </p>
                      )}

                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-brand-dark font-bold text-sm">
                        <span className="text-brand-green font-semibold">
                          {project.sqMeters ? `${project.sqMeters.toLocaleString()} m²` : (project.duration || "Ver detalles")}
                        </span>
                        <span className="text-brand-gold group-hover:translate-x-1.5 transition-transform font-bold flex items-center gap-1 text-xs">
                          Explorar Obra &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
