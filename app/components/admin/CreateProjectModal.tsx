'use client';

import { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Star,
  Sparkles,
  Layers,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { uploadProjectImage } from '@/lib/supabase/storage';

export interface ProjectData {
  id: string;
  title: string;
  slug: string;
  category: string;
  client?: string | null;
  mainImage?: string | null;
  gallery: string[];
  sqMeters?: number | null;
  duration?: string | null;
  description?: string | null;
  createdAt: string;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (newProject: ProjectData) => void;
}

interface UploadedImage {
  url: string;
  name: string;
  isMain: boolean;
}

const CATEGORIES = [
  'Pistas de Pádel',
  'Canchas Sintéticas (Fútbol)',
  'Parques Infantiles',
  'Grama Sintética & Paisajismo',
  'Polideportivos & Múltiples',
  'Mantenimiento Especializado',
];

export default function CreateProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
}: CreateProjectModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [client, setClient] = useState('');
  const [sqMeters, setSqMeters] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');

  // Testimonial
  const [testimonialQuote, setTestimonialQuote] = useState('');
  const [testimonialAuthor, setTestimonialAuthor] = useState('');
  const [testimonialRole, setTestimonialRole] = useState('');
  const [showTestimonialSection, setShowTestimonialSection] = useState(false);

  // Media
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Auto-generate slug preview
  const slugPreview = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    setErrorMsg(null);
    const fileList = Array.from(files);

    try {
      const newlyUploaded: UploadedImage[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        setUploadProgressText(`Subiendo foto ${i + 1} de ${fileList.length} (${file.name})...`);

        const { url } = await uploadProjectImage(file, 'proyectos');
        newlyUploaded.push({
          url,
          name: file.name,
          isMain: images.length === 0 && newlyUploaded.length === 0,
        });
      }

      setImages((prev) => {
        const updated = [...prev, ...newlyUploaded];
        // If no main image exists, set the first one as main
        if (!updated.some((img) => img.isMain) && updated.length > 0) {
          updated[0].isMain = true;
        }
        return updated;
      });
      setUploadProgressText('');
    } catch (err: unknown) {
      console.error('[CreateProjectModal] Image upload error:', err);
      const msg = err instanceof Error ? err.message : 'Error al subir imágenes a Supabase Storage';
      setErrorMsg(msg);
    } finally {
      setIsUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetMainImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isMain: i === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isMain)) {
        filtered[0].isMain = true;
      }
      return filtered;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setErrorMsg('Por favor ingrese el título del proyecto.');
      return;
    }

    if (images.length === 0) {
      setErrorMsg('Debe subir al menos una imagen para el proyecto.');
      return;
    }

    setIsSubmitting(true);

    try {
      const mainImg = images.find((img) => img.isMain) || images[0];
      const galleryUrls = images.map((img) => img.url);

      const payload = {
        title: title.trim(),
        category,
        client: client.trim() || undefined,
        sqMeters: sqMeters ? parseInt(sqMeters, 10) : undefined,
        duration: duration.trim() || undefined,
        description: description.trim() || undefined,
        mainImage: mainImg?.url,
        gallery: galleryUrls,
        testimonialQuote: testimonialQuote.trim() || undefined,
        testimonialAuthor: testimonialAuthor.trim() || undefined,
        testimonialRole: testimonialRole.trim() || undefined,
      };

      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Error al crear el proyecto');
      }

      setSuccessMsg('¡Proyecto publicado exitosamente!');

      if (onProjectCreated) {
        onProjectCreated(data.project);
      }

      setTimeout(() => {
        onClose();
        // Reset state
        setTitle('');
        setClient('');
        setSqMeters('');
        setDuration('');
        setDescription('');
        setImages([]);
        setTestimonialQuote('');
        setTestimonialAuthor('');
        setTestimonialRole('');
        setSuccessMsg(null);
      }, 1200);
    } catch (err: unknown) {
      console.error('[CreateProjectModal] Submit error:', err);
      const msg = err instanceof Error ? err.message : 'Error al guardar el proyecto en el sistema';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#131d16] border border-brand-green/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-brand-green/20 bg-brand-dark flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/20 border border-brand-green/40 flex items-center justify-center text-brand-gold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Subir Nuevo Proyecto
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                  Admin
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Añadir al portafolio oficial con fotografías y especificaciones técnicas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-white">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-brand-green/20 border border-brand-green/40 flex items-center gap-3 text-emerald-300 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-brand-gold" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Section 1: General Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-brand-gold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              Información General de la Obra
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">
                  Título del Proyecto <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cancha de Pádel Panorámica - Club Campestre"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-sm"
                />
                {slugPreview && (
                  <p className="text-[11px] text-gray-400">
                    URL: <span className="text-brand-gold font-mono">/portafolio/{slugPreview}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">
                  Categoría <span className="text-red-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/40 rounded-lg text-white focus:outline-none focus:border-brand-gold text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-brand-dark text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Cliente / Ubicación</label>
                <input
                  type="text"
                  placeholder="Ej: Club Campestre, Bucaramanga"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Área Construida (M²)</label>
                <input
                  type="number"
                  placeholder="Ej: 800"
                  value={sqMeters}
                  onChange={(e) => setSqMeters(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Duración de Ejecución</label>
                <input
                  type="text"
                  placeholder="Ej: 4 semanas"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Supabase Storage Multi-Image Upload */}
          <div className="space-y-4 pt-2 border-t border-brand-green/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-brand-gold uppercase tracking-wider">
                <ImageIcon className="w-4 h-4" />
                Fotografías del Proyecto (Bucket Supabase) <span className="text-red-400">*</span>
              </div>
              <span className="text-xs text-gray-400">
                {images.length} foto{images.length === 1 ? '' : 's'} cargada{images.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Drag and drop trigger container */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-brand-green/40 hover:border-brand-gold/80 rounded-xl p-6 text-center cursor-pointer bg-brand-dark/40 hover:bg-brand-dark/70 transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={handleFilesSelected}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-brand-green/20 group-hover:bg-brand-gold/20 flex items-center justify-center text-brand-gold transition-colors">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-200">
                  Haz clic o arrastra múltiples imágenes aquí
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Formatos soportados: WEBP, JPG, PNG, AVIF (Sube a Supabase automáticamente)
                </p>
              </div>
            </div>

            {isUploadingImages && (
              <div className="p-3 bg-brand-dark/90 rounded-lg border border-brand-gold/30 flex items-center gap-3 text-xs text-brand-gold animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{uploadProgressText || 'Cargando imágenes en Supabase Storage...'}</span>
              </div>
            )}

            {/* Uploaded images thumbnails preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`relative rounded-xl overflow-hidden border-2 group bg-black/40 aspect-video ${
                      img.isMain
                        ? 'border-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                        : 'border-brand-green/30 hover:border-brand-green'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Main image badge */}
                    {img.isMain ? (
                      <div className="absolute top-2 left-2 bg-brand-gold text-brand-dark px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-current" />
                        Portada
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetMainImage(index)}
                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 bg-black/70 hover:bg-brand-gold hover:text-brand-dark text-white text-[10px] font-bold px-2 py-0.5 rounded transition-all"
                      >
                        Hacer Portada
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-md transition-all"
                      title="Eliminar imagen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Technical Scope & Description */}
          <div className="space-y-2 pt-2 border-t border-brand-green/20">
            <div className="flex items-center gap-2 text-sm font-bold text-brand-gold uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              Memoria Técnica / Descripción
            </div>
            <textarea
              rows={4}
              placeholder="Describa los desafíos técnicos resueltos, materiales utilizados (ej. grama monofilamento 12.000 Dtex, cerramiento en vidrio templado 12mm, iluminación LED 200W) y resultados..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-brand-dark/80 border border-brand-green/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-sm"
            />
          </div>

          {/* Section 4: Testimonial (Optional Accordion) */}
          <div className="pt-2 border-t border-brand-green/20">
            <button
              type="button"
              onClick={() => setShowTestimonialSection(!showTestimonialSection)}
              className="flex items-center justify-between w-full text-left py-2 text-sm font-bold text-gray-300 hover:text-brand-gold transition-colors"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-gold" />
                Testimonio del Cliente (Opcional)
              </span>
              <span className="text-xs text-brand-gold underline">
                {showTestimonialSection ? 'Ocultar' : '+ Añadir'}
              </span>
            </button>

            {showTestimonialSection && (
              <div className="space-y-3 mt-3 p-4 bg-brand-dark/50 rounded-xl border border-brand-green/20">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Cita o Comentario del Cliente</label>
                  <textarea
                    rows={2}
                    placeholder="Ej: 'El acabado de las canchas superó todas nuestras expectativas en tiempo récord...'"
                    value={testimonialQuote}
                    onChange={(e) => setTestimonialQuote(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-green/30 rounded-lg text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Nombre del Cliente</label>
                    <input
                      type="text"
                      placeholder="Ej: Ing. Carlos Gómez"
                      value={testimonialAuthor}
                      onChange={(e) => setTestimonialAuthor(e.target.value)}
                      className="w-full px-3 py-2 bg-brand-dark border border-brand-green/30 rounded-lg text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Cargo / Entidad</label>
                    <input
                      type="text"
                      placeholder="Ej: Director Deportivo Club Campestre"
                      value={testimonialRole}
                      onChange={(e) => setTestimonialRole(e.target.value)}
                      className="w-full px-3 py-2 bg-brand-dark border border-brand-green/30 rounded-lg text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-brand-green/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isUploadingImages}
              className="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-white/5 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImages}
              className="px-6 py-2.5 rounded-lg bg-brand-gold hover:bg-yellow-400 text-brand-dark font-black text-sm shadow-lg hover:shadow-brand-gold/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando en Sistema...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Publicar Proyecto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
