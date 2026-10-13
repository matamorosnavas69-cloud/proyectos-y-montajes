import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LeadForm from "@/app/components/LeadForm";
import { toPublicProject } from "@/lib/portfolio/serializer";
import { getCurrentUserRole } from "@/lib/auth/rbac";
import { MapPin, Calendar, Maximize2, ShieldAlert, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    select: { title: true, description: true, shortDescription: true, mainImage: true, category: true, published: true },
  });

  if (!project || !project.published) {
    return { title: "Proyecto no encontrado | Proyectos y Montajes" };
  }

  const desc = project.shortDescription || project.description?.slice(0, 160) || "Ficha y detalles de obra deportiva o paisajismo.";

  return {
    title: `${project.title} | Proyectos y Montajes`,
    description: desc,
    openGraph: {
      title: `${project.title} | Proyectos y Montajes`,
      description: desc,
      images: project.mainImage ? [{ url: project.mainImage }] : [],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const rawProject = await prisma.project.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!rawProject) {
    notFound();
  }

  const { isAdmin } = await getCurrentUserRole();

  // If unpublished and not admin, hide from public
  if (!rawProject.published && !isAdmin) {
    notFound();
  }

  const project = toPublicProject(rawProject);

  return (
    <div className="flex flex-col w-full bg-brand-light min-h-screen">
      {/* Draft banner for admins */}
      {!rawProject.published && (
        <div className="w-full bg-amber-500/20 border-b border-amber-500/40 px-6 py-2.5 text-center text-xs font-bold text-amber-300 flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Vista previa de Administrador: Este proyecto está en modo borrador y no es visible en el portafolio público.</span>
          <Link href={`/admin/proyectos/${rawProject.id}/ficha-tecnica`} className="underline ml-2 text-white">
            Editar Ficha
          </Link>
        </div>
      )}

      {/* Project Hero */}
      <section className="relative w-full py-36 bg-brand-dark overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-brand-dark/90 mix-blend-multiply z-10" />
          {project.mainImage && (
            <img
              src={project.mainImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center text-white">
          <Link
            href="/portafolio"
            className="inline-flex items-center gap-2 text-brand-gold hover:text-white transition-colors mb-6 font-bold text-xs tracking-widest uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Portafolio
          </Link>
          
          <div className="inline-block mx-auto mb-4 px-3 py-1 rounded-full bg-brand-green/30 border border-brand-green/40 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
            {project.category}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight max-w-4xl mx-auto">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-300 font-medium text-xs sm:text-sm">
            {(project.location || project.city || project.client) && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-gold" />
                {project.location || project.city || project.client}
              </span>
            )}
            {project.sqMeters && (
              <span className="flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-brand-gold" />
                {project.sqMeters.toLocaleString()} m² construidos
              </span>
            )}
            {project.duration && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-gold" />
                {project.duration}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Project Body */}
      <section className="py-20 max-w-5xl mx-auto px-6 w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 -mt-24 relative z-30 border border-gray-100 space-y-12">
          {/* Main Description */}
          <div>
            <h2 className="text-2xl font-black text-brand-dark mb-4">Alcance Técnico & Memoria de Obra</h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
              <p>{project.description || "Proyecto de alta especificación ejecutado bajo normativa técnica internacional y materiales de primera calidad."}</p>
            </div>
          </div>

          {/* Testimonial if exists */}
          {project.testimonialQuote && (
            <div className="bg-[#F4F8F5] p-8 sm:p-10 rounded-2xl border-l-4 border-brand-green">
              <p className="text-lg italic text-brand-dark mb-4 font-serif">
                &ldquo;{project.testimonialQuote}&rdquo;
              </p>
              <div className="font-bold text-brand-dark text-sm">{project.testimonialAuthor}</div>
              <div className="text-xs text-gray-500">{project.testimonialRole}</div>
            </div>
          )}

          {/* Project Image Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-brand-dark">Galería de la Obra</h2>
                <p className="text-xs text-gray-500">Fotografías de acabados, demarcación y detalles constructivos</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.gallery.map((img: string, idx: number) => (
                  <div key={idx} className="h-56 w-full rounded-xl overflow-hidden shadow-sm bg-gray-100 group">
                    <img
                      src={img}
                      alt={`${project.title} - Foto ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to action */}
      <div className="bg-brand-dark text-white text-center py-20 px-6">
        <h2 className="text-3xl font-black mb-4">¿Tiene un proyecto similar en mente?</h2>
        <p className="text-sm text-gray-400 max-w-2xl mx-auto mb-8">
          Permita que nuestro equipo de ingenieros y especialistas evalúe su terreno y dimensione la solución técnica ideal.
        </p>
      </div>
      <div className="-mt-16 pb-20">
        <LeadForm />
      </div>
    </div>
  );
}
