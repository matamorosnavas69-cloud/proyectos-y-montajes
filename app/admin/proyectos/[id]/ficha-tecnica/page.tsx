'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import {
  Layers,
  FileText,
  Package,
  Calendar,
  CheckSquare,
  MessageSquare,
  FileCheck,
  ImageIcon,
  Eye,
  Download,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Plus,
  Trash2,
  UploadCloud,
  Star,
} from 'lucide-react';

interface FichaEditorProps {
  params: Promise<{ id: string }>;
}

export interface MaterialItem {
  id?: string;
  name: string;
  supplier?: string | null;
  reference?: string | null;
  quantity?: number | string | null;
  unit?: string | null;
  status: string;
  notes?: string | null;
}

export interface MilestoneItem {
  id?: string;
  name: string;
  description?: string | null;
  plannedDate?: string | null;
  actualDate?: string | null;
  responsible?: string | null;
  status: string;
}

export interface QualityCheckItem {
  id?: string;
  item: string;
  status: string;
  observation?: string | null;
  checkDate?: string | null;
  responsible?: string | null;
}

const STEPS = [
  { id: 1, label: 'Identificación', icon: Layers },
  { id: 2, label: 'Especificaciones', icon: FileText },
  { id: 3, label: 'Materiales', icon: Package },
  { id: 4, label: 'Cronograma', icon: Calendar },
  { id: 5, label: 'Control de Calidad', icon: CheckSquare },
  { id: 6, label: 'Observaciones', icon: MessageSquare },
  { id: 7, label: 'Acta de Entrega', icon: FileCheck },
  { id: 8, label: 'Fotografías', icon: ImageIcon },
];

const DEFAULT_QUALITY_CHECKS = [
  '1. Verificación de Área, Dimensiones y Perímetro',
  '2. Nivelación, Pendientes y Capacidad de Drenaje',
  '3. Recepción e Inspección de Insumos y Certificados',
  '4. Compactación de Sub-base y Base Granular (Proctor)',
  '5. Instalación de Superficie / Grama / Pavimento',
  '6. Demarcación Reglamentaria y Acabados de Cerramiento',
  '7. Pruebas Técnicas de Rodadura, Rebote e Iluminación',
  '8. Limpieza General y Acondicionamiento de Entrega',
];

export default function TechnicalSheetEditorPage({ params }: FichaEditorProps) {
  const { id } = use(params);

  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Core Project State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pistas de Pádel');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [sqMeters, setSqMeters] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('IN_PROGRESS');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [director, setDirector] = useState('');
  const [commercialRep, setCommercialRep] = useState('');
  const [internalCode, setInternalCode] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [portfolioOrder, setPortfolioOrder] = useState('0');
  const [slug, setSlug] = useState('');

  // Technical Sheet State
  const [revision, setRevision] = useState('R01');
  const [sheetStatus, setSheetStatus] = useState('DRAFT');
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [observations, setObservations] = useState('');
  const [pendingItems, setPendingItems] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliveryClient, setDeliveryClient] = useState('');
  const [deliveryDirector, setDeliveryDirector] = useState('');
  const [deliveryInspector, setDeliveryInspector] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('PENDIENTE');

  // Relational Modules State
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [qualityChecks, setQualityChecks] = useState<QualityCheckItem[]>([]);
  const [images, setImages] = useState<Array<{ url: string; isCover: boolean }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Concurrency & Debounce autosave ref
  const versionRef = useRef<number>(1);
  const latestRequestIdRef = useRef<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  // Fetch initial project data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/projects/${id}/technical-sheet`);
        const data = await res.json();

        if (data.project) {
          const p = data.project;
          const s = p.technicalSheet || {};

          setTitle(p.title || '');
          setSlug(p.slug || '');
          setCategory(p.category || 'Pistas de Pádel');
          setClient(p.client || '');
          setLocation(p.location || '');
          setCity(p.city || '');
          setSqMeters(p.sqMeters ? String(p.sqMeters) : '');
          setDuration(p.duration || '');
          setStatus(p.status || 'IN_PROGRESS');
          setBudget(p.budget ? String(p.budget) : '');
          setStartDate(p.startDate ? p.startDate.split('T')[0] : '');
          setDeliveryDate(p.deliveryDate ? p.deliveryDate.split('T')[0] : '');
          setDirector(p.director || '');
          setCommercialRep(p.commercialRep || '');
          setInternalCode(p.internalCode || '');
          setDescription(p.description || '');
          setShortDescription(p.shortDescription || '');
          setPublished(Boolean(p.published));
          setFeatured(Boolean(p.featured));
          setPortfolioOrder(String(p.portfolioOrder || 0));

          setRevision(s.revision || 'R01');
          setSheetStatus(s.sheetStatus || 'DRAFT');
          versionRef.current = s.version || 1;
          setSpecs(s.specifications || {});
          setObservations(s.observations || '');
          setPendingItems(s.pendingItems || '');
          setDeliveryNotes(s.deliveryNotes || '');
          setDeliveryClient(s.deliveryClient || p.client || '');
          setDeliveryDirector(s.deliveryDirector || p.director || '');
          setDeliveryInspector(s.deliveryInspector || '');
          setDeliveryStatus(s.deliveryStatus || 'PENDIENTE');

          setMaterials(s.materials && s.materials.length > 0 ? s.materials : []);
          setMilestones(s.milestones && s.milestones.length > 0 ? s.milestones : []);
          
          if (s.qualityChecks && s.qualityChecks.length > 0) {
            setQualityChecks(s.qualityChecks);
          } else {
            setQualityChecks(
              DEFAULT_QUALITY_CHECKS.map((item, idx) => ({
                item,
                status: 'CONFORME',
                observation: 'Verificado según estándar P&M',
                order: idx,
              }))
            );
          }

          // Format images
          const initialImgs: Array<{ url: string; isCover: boolean }> = [];
          if (p.mainImage) {
            initialImgs.push({ url: p.mainImage, isCover: true });
          }
          if (Array.isArray(p.gallery)) {
            p.gallery.forEach((url: string) => {
              if (url !== p.mainImage) {
                initialImgs.push({ url, isCover: false });
              }
            });
          }
          setImages(initialImgs);
        }
      } catch (err: unknown) {
        console.error('Error fetching technical sheet:', err);
      } finally {
        setLoading(false);
        setTimeout(() => {
          isInitialLoadRef.current = false;
        }, 800);
      }
    }
    loadData();
  }, [id]);

  // Autosave function with optimistic concurrency control and stale-response protection
  const triggerSave = async () => {
    const requestId = ++latestRequestIdRef.current;
    setSaveStatus('saving');
    setSaveError(null);

    try {
      const coverImg = images.find((img) => img.isCover)?.url || images[0]?.url || null;
      const galleryUrls = images.map((img) => img.url);

      const payload = {
        expectedVersion: versionRef.current,
        projectData: {
          title,
          category,
          client,
          location,
          city,
          sqMeters: sqMeters ? Number(sqMeters) : null,
          duration,
          status,
          budget: budget ? Number(budget) : null,
          startDate: startDate || null,
          deliveryDate: deliveryDate || null,
          director,
          commercialRep,
          internalCode,
          description,
          shortDescription,
          published,
          featured,
          portfolioOrder: Number(portfolioOrder) || 0,
          mainImage: coverImg,
          gallery: galleryUrls,
        },
        sheetData: {
          revision,
          sheetStatus,
          specifications: specs,
          observations,
          pendingItems,
          deliveryNotes,
          deliveryClient,
          deliveryDirector,
          deliveryInspector,
          deliveryStatus,
        },
        materials,
        milestones,
        qualityChecks,
      };

      const res = await fetch(`/api/admin/projects/${id}/technical-sheet`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Discard stale out-of-order response
      if (requestId < latestRequestIdRef.current) {
        return;
      }

      if (res.status === 409) {
        setSaveStatus('error');
        setSaveError('Conflicto: otra sesión modificó esta ficha. Recargue la página.');
        alert('⚠️ Conflicto de Concurrencia detectado:\nEl expediente fue actualizado por otra sesión o pestaña. Se recomienda recargar la página para no sobrescribir información reciente.');
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Error al guardar');
      }

      if (typeof data.version === 'number') {
        versionRef.current = data.version;
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: unknown) {
      console.error('Autosave error:', err);
      setSaveStatus('error');
      const msg = err instanceof Error ? err.message : 'Error al guardar en el servidor';
      setSaveError(msg);
    }
  };

  // Debounced change listener
  const handleChangeWithAutosave = () => {
    if (isInitialLoadRef.current) return;
    setSaveStatus('saving');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      triggerSave();
    }, 1200);
  };

  // Toggle publish status via dedicated state-machine validator API
  const handleTogglePublish = async () => {
    try {
      setSaveStatus('saving');
      const res = await fetch(`/api/admin/projects/${id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      });
      const data = await res.json();

      if (res.status === 422) {
        const missingList = data.missingFields ? data.missingFields.map((f: string) => `• ${f}`).join('\n') : '';
        const reasonsList = data.reasons ? data.reasons.map((r: string) => `  - ${r}`).join('\n') : '';
        alert(`⚠️ Publicación Bloqueada por Control de Calidad:\n\n${data.message}\n\nRequisitos Pendientes:\n${missingList}\n\nMotivos Técnicos:\n${reasonsList}`);
        setSaveStatus('idle');
        return;
      }

      if (!res.ok) {
        alert(`${data.error}: ${data.message}`);
        setSaveStatus('idle');
        return;
      }

      setPublished(data.published);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar visibilidad';
      alert(msg);
      setSaveStatus('error');
    }
  };

  // Handle image upload via secure server API (/api/admin/storage/upload)
  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newUrls: Array<{ url: string; isCover: boolean }> = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('projectId', id);
        formData.append('isCover', images.length === 0 && i === 0 ? 'true' : 'false');

        const res = await fetch('/api/admin/storage/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || data.error || 'Error al subir imagen');
        }

        newUrls.push({ url: data.url, isCover: Boolean(data.isCover) });
      }

      setImages((prev) => [...prev, ...newUrls]);
      handleChangeWithAutosave();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir fotos';
      alert(msg);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-brand-gold animate-spin mb-4" />
        <p className="text-xs text-gray-400">Cargando estudio técnico y ficha de obra...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Sticky Top Action Bar */}
      <div className="sticky top-16 z-30 bg-[#131d16]/95 border border-brand-green/30 backdrop-blur-md rounded-2xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/proyectos"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            title="Volver al inventario"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-black text-white line-clamp-1">{title || 'Nueva Ficha Técnica'}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-green/30 text-emerald-300 border border-brand-green/40">
                {category}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Código: <span className="font-mono text-brand-gold">{internalCode || 'Sin Asignar'}</span> • Rev: {revision}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Autosave Status Indicator */}
          <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-black/40 border border-white/10">
            {saveStatus === 'saving' && (
              <>
                <Loader2 className="w-3.5 h-3.5 text-brand-gold animate-spin" />
                <span className="text-gray-300">Guardando...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Guardado ✓</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                <span className="text-red-300" title={saveError || undefined}>
                  {saveError || 'Error al guardar'}
                </span>
              </>
            )}
            {saveStatus === 'idle' && (
              <span className="text-gray-400 text-[11px]">Sincronizado</span>
            )}
          </div>

          {/* Published Toggle */}
          <button
            onClick={handleTogglePublish}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              published
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/40'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${published ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
            <span>{published ? 'En Portafolio' : 'Borrador'}</span>
          </button>

          {/* Preview Button */}
          <Link
            href={`/admin/proyectos/${id}/ficha-tecnica/preview`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors border border-white/15"
          >
            <Eye className="w-3.5 h-3.5 text-brand-gold" />
            <span className="hidden sm:inline">Vista Previa</span>
          </Link>

          {/* PDF Download Button */}
          <a
            href={`/api/admin/projects/${id}/pdf`}
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-gold hover:bg-yellow-400 text-brand-dark text-xs font-black transition-all shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </a>

          {/* Manual Save Force */}
          <button
            onClick={triggerSave}
            type="button"
            className="p-2 rounded-lg bg-brand-green/40 hover:bg-brand-green text-emerald-300 hover:text-white transition-colors"
            title="Guardar forzado"
          >
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Navigation Tabs */}
      <div className="bg-[#131d16] border border-brand-green/30 rounded-2xl p-2 shadow-lg overflow-x-auto">
        <div className="flex items-center gap-1 min-w-[720px]">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-green text-white border border-brand-gold/30 shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-gold' : 'text-gray-500'}`} />
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT PANELS */}
      <div className="bg-[#131d16] border border-brand-green/30 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8">
        {/* STEP 1: IDENTIFICACIÓN */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white mb-1">Identificación y Parámetros del Proyecto</h2>
              <p className="text-xs text-gray-400">Datos corporativos, cliente, ubicación geográfica y responsabilidades de obra.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Nombre de la Obra / Proyecto</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                  placeholder="Ej: Cancha de Pádel Panorámica - Club Campestre"
                />
                {slug && (
                  <p className="text-[11px] text-gray-500 font-mono">
                    Ruta en portafolio: <span className="text-brand-gold">/portafolio/{slug}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Código Interno de Ficha</label>
                <input
                  type="text"
                  value={internalCode}
                  onChange={(e) => { setInternalCode(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold font-mono"
                  placeholder="Ej: PM-PAD-2026-004"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Cliente / Razón Social</label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => { setClient(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                  placeholder="Ej: Club Campestre Bucaramanga"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Ubicación / Dirección</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                  placeholder="Ej: Km 5 Vía Ruitoque"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Ciudad / Departamento</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => { setCity(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                  placeholder="Ej: Bucaramanga, Santander"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                >
                  <option value="Pistas de Pádel">Pistas de Pádel</option>
                  <option value="Canchas Sintéticas (Fútbol)">Canchas Sintéticas (Fútbol)</option>
                  <option value="Parques Infantiles">Parques Infantiles</option>
                  <option value="Grama Sintética & Paisajismo">Grama Sintética & Paisajismo</option>
                  <option value="Polideportivos & Múltiples">Polideportivos & Múltiples</option>
                  <option value="Mantenimiento Especializado">Mantenimiento Especializado</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Estado de Obra</label>
                <select
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                >
                  <option value="DRAFT">Borrador / Cotización</option>
                  <option value="PLANNING">Planeación / Replanteo</option>
                  <option value="IN_PROGRESS">En Ejecución</option>
                  <option value="COMPLETED">Entregado a Satisfacción</option>
                  <option value="ARCHIVED">Archivado</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Estado Expediente Técnico</label>
                <select
                  value={sheetStatus}
                  onChange={(e) => { setSheetStatus(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-gold/40 rounded-xl text-brand-gold font-semibold text-sm focus:outline-none focus:border-brand-gold"
                >
                  <option value="DRAFT">Borrador de Ficha</option>
                  <option value="IN_PROGRESS">En Elaboración Técnica</option>
                  <option value="READY_FOR_REVIEW">Listo para Revisión</option>
                  <option value="APPROVED">Aprobado por Dirección</option>
                  <option value="ISSUED">Emitido Oficialmente</option>
                  <option value="ARCHIVED">Archivado</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Área Construida (M²)</label>
                <input
                  type="number"
                  value={sqMeters}
                  onChange={(e) => { setSqMeters(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                  placeholder="Ej: 800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Plazo de Ejecución</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => { setDuration(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                  placeholder="Ej: 4 semanas"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Director de Obra</label>
                <input
                  type="text"
                  value={director}
                  onChange={(e) => { setDirector(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                  placeholder="Ej: Ing. Mauricio Suárez"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Responsable Comercial</label>
                <input
                  type="text"
                  value={commercialRep}
                  onChange={(e) => { setCommercialRep(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                  placeholder="Ej: Andrés Pardo"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <span>Presupuesto (COP - Confidencial)</span>
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => { setBudget(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-amber-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 font-mono"
                  placeholder="Ej: 145000000"
                />
                <p className="text-[10px] text-gray-500">Nunca se mostrará en el portafolio público.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ESPECIFICACIONES TÉCNICAS */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white mb-1">Especificaciones Técnicas de Ingeniería</h2>
              <p className="text-xs text-gray-400">
                Parámetros constructivos adaptados a la categoría <span className="text-brand-gold font-bold">{category}</span>.
              </p>
            </div>

            {category.includes('Pádel') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Estructura & Vidrios</label>
                  <input
                    type="text"
                    value={specs.estructuraVidrios || ''}
                    onChange={(e) => { setSpecs({ ...specs, estructuraVidrios: e.target.value }); handleChangeWithAutosave(); }}
                    className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                    placeholder="Ej: Panorámica con vidrio templado de seguridad 12mm cantos pulidos"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Superficie / Césped de Pádel</label>
                  <input
                    type="text"
                    value={specs.cespedPadel || ''}
                    onChange={(e) => { setSpecs({ ...specs, cespedPadel: e.target.value }); handleChangeWithAutosave(); }}
                    className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                    placeholder="Ej: Monofilamento texturizado 12mm 10.000 Dtex azul oficial WPT"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Iluminación Deportiva</label>
                  <input
                    type="text"
                    value={specs.iluminacion || ''}
                    onChange={(e) => { setSpecs({ ...specs, iluminacion: e.target.value }); handleChangeWithAutosave(); }}
                    className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                    placeholder="Ej: 8 proyectores LED 200W con óptica asimétrica >300 lux"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Sub-base & Drenaje</label>
                  <input
                    type="text"
                    value={specs.subbase || ''}
                    onChange={(e) => { setSpecs({ ...specs, subbase: e.target.value }); handleChangeWithAutosave(); }}
                    className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                    placeholder="Ej: Solera de hormigón pulido 10cm con pendiente 0.8% y canaleta perimetral"
                  />
                </div>
              </div>
            )}

            {category.includes('Fútbol') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Grama Sintética Deportiva</label>
                  <input
                    type="text"
                    value={specs.gramaSintetica || ''}
                    onChange={(e) => { setSpecs({ ...specs, gramaSintetica: e.target.value }); handleChangeWithAutosave(); }}
                    className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                    placeholder="Ej: Monofilamento 50mm con nervio central, 12.000 Dtex, protección UV"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Relleno de Lastrado & Amortiguación</label>
                  <input
                    type="text"
                    value={specs.relleno || ''}
                    onChange={(e) => { setSpecs({ ...specs, relleno: e.target.value }); handleChangeWithAutosave(); }}
                    className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                    placeholder="Ej: Arena de sílice 25 kg/m² + Caucho SBR criogénico 8 kg/m²"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Malla & Cerramiento Perimetral</label>
                  <input
                    type="text"
                    value={specs.cerramiento || ''}
                    onChange={(e) => { setSpecs({ ...specs, cerramiento: e.target.value }); handleChangeWithAutosave(); }}
                    className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                    placeholder="Ej: Malla eslabonada calibre 10 galvanizada + red de nylon contra impactos 6m alto"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Filtros y Drenaje Pluvial</label>
                  <input
                    type="text"
                    value={specs.drenaje || ''}
                    onChange={(e) => { setSpecs({ ...specs, drenaje: e.target.value }); handleChangeWithAutosave(); }}
                    className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                    placeholder="Ej: Filtros en espina de pescado con tubería perforada 4 pulgadas y geotextil"
                  />
                </div>
              </div>
            )}

            {category.includes('Paisajismo') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Grama Decorativa / Paisajismo</label>
                  <input
                    type="text"
                    value={specs.gramaPaisajismo || ''}
                    onChange={(e) => { setSpecs({ ...specs, gramaPaisajismo: e.target.value }); handleChangeWithAutosave(); }}
                    className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                    placeholder="Ej: Césped decorativo 35mm cuatricolor tacto natural con microperforaciones"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Preparación del Terreno & Geotextil</label>
                  <input
                    type="text"
                    value={specs.terreno || ''}
                    onChange={(e) => { setSpecs({ ...specs, terreno: e.target.value }); handleChangeWithAutosave(); }}
                    className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                    placeholder="Ej: Retiro de capa vegetal, geomalla antihierba y base de triturado compactado"
                  />
                </div>
              </div>
            )}

            {category.includes('Parques') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Estructuras & Juegos Infantiles</label>
                  <input
                    type="text"
                    value={specs.juegos || ''}
                    onChange={(e) => { setSpecs({ ...specs, juegos: e.target.value }); handleChangeWithAutosave(); }}
                    className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                    placeholder="Ej: Módulo multijuegos en acero galvanizado con pintura electrostática y plástico rotomoldeado"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Piso Amortiguante de Seguridad</label>
                  <input
                    type="text"
                    value={specs.pisoSeguridad || ''}
                    onChange={(e) => { setSpecs({ ...specs, pisoSeguridad: e.target.value }); handleChangeWithAutosave(); }}
                    className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                    placeholder="Ej: Piso continuo de caucho EPDM 40mm con certificación de caída crítica HIC"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5 pt-4 border-t border-brand-green/20">
              <label className="text-xs font-bold text-gray-300">Memoria Técnica Resumida / Alcance General</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => { setDescription(e.target.value); handleChangeWithAutosave(); }}
                className="w-full px-4 py-3 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                placeholder="Describa el alcance general de ingeniería, normas técnicas aplicadas y solución constructiva..."
              />
            </div>
          </div>
        )}

        {/* STEP 3: MATERIALES */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Registro de Materiales e Insumos</h2>
                <p className="text-xs text-gray-400">Control de insumos de obra, cantidades, proveedores y estado de recepción.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMaterials([
                    ...materials,
                    { name: '', supplier: '', reference: '', quantity: '', unit: 'm²', status: 'SOLICITADO', notes: '' },
                  ]);
                  handleChangeWithAutosave();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-gold text-brand-dark font-black text-xs uppercase hover:bg-yellow-400 transition-all"
              >
                <Plus className="w-4 h-4" />
                Agregar Material
              </button>
            </div>

            {materials.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-brand-green/30 rounded-2xl p-6">
                <Package className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No hay materiales registrados aún.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-gray-400 uppercase tracking-wider border-b border-brand-green/20 bg-brand-dark/40">
                    <tr>
                      <th className="py-2.5 px-3">Material</th>
                      <th className="py-2.5 px-3">Proveedor</th>
                      <th className="py-2.5 px-3">Referencia</th>
                      <th className="py-2.5 px-3">Cantidad</th>
                      <th className="py-2.5 px-3">Unidad</th>
                      <th className="py-2.5 px-3">Estado</th>
                      <th className="py-2.5 px-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-green/10">
                    {materials.map((m, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={m.name || ''}
                            onChange={(e) => {
                              const updated = [...materials];
                              updated[idx].name = e.target.value;
                              setMaterials(updated);
                              handleChangeWithAutosave();
                            }}
                            className="w-full bg-brand-dark px-2.5 py-1.5 rounded-lg border border-brand-green/30 text-white text-xs"
                            placeholder="Grama, arena, etc."
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={m.supplier || ''}
                            onChange={(e) => {
                              const updated = [...materials];
                              updated[idx].supplier = e.target.value;
                              setMaterials(updated);
                              handleChangeWithAutosave();
                            }}
                            className="w-full bg-brand-dark px-2.5 py-1.5 rounded-lg border border-brand-green/30 text-white text-xs"
                            placeholder="Proveedor"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={m.reference || ''}
                            onChange={(e) => {
                              const updated = [...materials];
                              updated[idx].reference = e.target.value;
                              setMaterials(updated);
                              handleChangeWithAutosave();
                            }}
                            className="w-full bg-brand-dark px-2.5 py-1.5 rounded-lg border border-brand-green/30 text-white text-xs font-mono"
                            placeholder="Ref 50mm"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={m.quantity || ''}
                            onChange={(e) => {
                              const updated = [...materials];
                              updated[idx].quantity = e.target.value;
                              setMaterials(updated);
                              handleChangeWithAutosave();
                            }}
                            className="w-20 bg-brand-dark px-2.5 py-1.5 rounded-lg border border-brand-green/30 text-white text-xs"
                            placeholder="800"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={m.unit || 'm²'}
                            onChange={(e) => {
                              const updated = [...materials];
                              updated[idx].unit = e.target.value;
                              setMaterials(updated);
                              handleChangeWithAutosave();
                            }}
                            className="w-16 bg-brand-dark px-2.5 py-1.5 rounded-lg border border-brand-green/30 text-white text-xs"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={m.status || 'SOLICITADO'}
                            onChange={(e) => {
                              const updated = [...materials];
                              updated[idx].status = e.target.value;
                              setMaterials(updated);
                              handleChangeWithAutosave();
                            }}
                            className="bg-brand-dark px-2.5 py-1.5 rounded-lg border border-brand-green/30 text-white text-xs"
                          >
                            <option value="SOLICITADO">SOLICITADO</option>
                            <option value="EN_TRANSITO">EN TRÁNSITO</option>
                            <option value="RECIBIDO">RECIBIDO</option>
                            <option value="INSTALADO">INSTALADO</option>
                          </select>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setMaterials(materials.filter((_, i) => i !== idx));
                              handleChangeWithAutosave();
                            }}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: CRONOGRAMA */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Cronograma de Hitos Constructivos</h2>
                <p className="text-xs text-gray-400">Seguimiento de fases, fechas programadas vs reales y responsables.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMilestones([
                    ...milestones,
                    { name: '', description: '', plannedDate: '', actualDate: '', responsible: 'Director Obra', status: 'PENDIENTE' },
                  ]);
                  handleChangeWithAutosave();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-gold text-brand-dark font-black text-xs uppercase hover:bg-yellow-400 transition-all"
              >
                <Plus className="w-4 h-4" />
                Agregar Hito
              </button>
            </div>

            {milestones.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-brand-green/30 rounded-2xl p-6">
                <Calendar className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No hay hitos programados todavía.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {milestones.map((ms, idx) => (
                  <div key={idx} className="bg-brand-dark/60 p-4 rounded-xl border border-brand-green/20 flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px]">
                      <label className="text-[10px] text-gray-400 uppercase font-bold">Hito</label>
                      <input
                        type="text"
                        value={ms.name || ''}
                        onChange={(e) => {
                          const updated = [...milestones];
                          updated[idx].name = e.target.value;
                          setMilestones(updated);
                          handleChangeWithAutosave();
                        }}
                        className="w-full bg-brand-dark px-3 py-1.5 rounded-lg border border-brand-green/30 text-white text-xs font-semibold"
                        placeholder="Ej: Replanteo y Movimiento de Tierras"
                      />
                    </div>

                    <div className="w-36">
                      <label className="text-[10px] text-gray-400 uppercase font-bold">Fecha Planeada</label>
                      <input
                        type="date"
                        value={ms.plannedDate ? ms.plannedDate.split('T')[0] : ''}
                        onChange={(e) => {
                          const updated = [...milestones];
                          updated[idx].plannedDate = e.target.value;
                          setMilestones(updated);
                          handleChangeWithAutosave();
                        }}
                        className="w-full bg-brand-dark px-2.5 py-1.5 rounded-lg border border-brand-green/30 text-white text-xs"
                      />
                    </div>

                    <div className="w-36">
                      <label className="text-[10px] text-gray-400 uppercase font-bold">Responsable</label>
                      <input
                        type="text"
                        value={ms.responsible || ''}
                        onChange={(e) => {
                          const updated = [...milestones];
                          updated[idx].responsible = e.target.value;
                          setMilestones(updated);
                          handleChangeWithAutosave();
                        }}
                        className="w-full bg-brand-dark px-2.5 py-1.5 rounded-lg border border-brand-green/30 text-white text-xs"
                        placeholder="Director / Contratista"
                      />
                    </div>

                    <div className="w-36">
                      <label className="text-[10px] text-gray-400 uppercase font-bold">Estado</label>
                      <select
                        value={ms.status || 'PENDIENTE'}
                        onChange={(e) => {
                          const updated = [...milestones];
                          updated[idx].status = e.target.value;
                          setMilestones(updated);
                          handleChangeWithAutosave();
                        }}
                        className="w-full bg-brand-dark px-2.5 py-1.5 rounded-lg border border-brand-green/30 text-white text-xs font-bold"
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="EN_PROGRESO">EN PROGRESO</option>
                        <option value="COMPLETADO">COMPLETADO</option>
                        <option value="RETRASADO">RETRASADO</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setMilestones(milestones.filter((_, i) => i !== idx));
                        handleChangeWithAutosave();
                      }}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 5: CONTROL DE CALIDAD */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white mb-1">Checklist de Control de Calidad e Inspección</h2>
              <p className="text-xs text-gray-400">Verificación normativa, tolerancias dimensionales y firmas de no objeción.</p>
            </div>

            <div className="space-y-3">
              {qualityChecks.map((qc, idx) => (
                <div key={idx} className="bg-brand-dark/60 p-4 rounded-xl border border-brand-green/20 flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[260px]">
                    <div className="text-xs font-bold text-white mb-1">{qc.item}</div>
                    <input
                      type="text"
                      value={qc.observation || ''}
                      onChange={(e) => {
                        const updated = [...qualityChecks];
                        updated[idx].observation = e.target.value;
                        setQualityChecks(updated);
                        handleChangeWithAutosave();
                      }}
                      className="w-full bg-brand-dark px-3 py-1.5 rounded-lg border border-brand-green/30 text-white text-xs"
                      placeholder="Observaciones técnicas de inspección en campo..."
                    />
                  </div>

                  <div className="w-36">
                    <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Resultado</label>
                    <select
                      value={qc.status || 'CONFORME'}
                      onChange={(e) => {
                        const updated = [...qualityChecks];
                        updated[idx].status = e.target.value;
                        setQualityChecks(updated);
                        handleChangeWithAutosave();
                      }}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold border ${
                        qc.status === 'CONFORME'
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          : qc.status === 'NO_CONFORME'
                          ? 'bg-red-950/60 border-red-500/40 text-red-300'
                          : 'bg-brand-dark border-brand-green/30 text-white'
                      }`}
                    >
                      <option value="CONFORME">CONFORME ✓</option>
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="NO_CONFORME">NO CONFORME ✕</option>
                      <option value="SUBSANADO">SUBSANADO</option>
                    </select>
                  </div>

                  <div className="w-36">
                    <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Inspector</label>
                    <input
                      type="text"
                      value={qc.responsible || ''}
                      onChange={(e) => {
                        const updated = [...qualityChecks];
                        updated[idx].responsible = e.target.value;
                        setQualityChecks(updated);
                        handleChangeWithAutosave();
                      }}
                      className="w-full bg-brand-dark px-2.5 py-1.5 rounded-lg border border-brand-green/30 text-white text-xs"
                      placeholder="Inspector QA"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: OBSERVACIONES */}
        {activeStep === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white mb-1">Observaciones Técnicas & Punch List</h2>
              <p className="text-xs text-gray-400">Notas de campo de ingeniería, recomendaciones y pendientes menores antes de la entrega.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Observaciones Técnicas Generales</label>
                <textarea
                  rows={5}
                  value={observations}
                  onChange={(e) => { setObservations(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-3 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                  placeholder="Registre condiciones climáticas de la instalación, particularidades del terreno o instrucciones especiales..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Lista de Pendientes (Punch List)</label>
                <textarea
                  rows={4}
                  value={pendingItems}
                  onChange={(e) => { setPendingItems(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-3 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                  placeholder="Detalles de pintura final, ajuste de redes, limpieza de perfiles..."
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: ACTA DE ENTREGA */}
        {activeStep === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white mb-1">Acta de Entrega y Recepción Técnica</h2>
              <p className="text-xs text-gray-400">Cierre contractual de obra, certificación de satisfacción y preparación de firmas.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Representante del Cliente (Firma)</label>
                <input
                  type="text"
                  value={deliveryClient}
                  onChange={(e) => { setDeliveryClient(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                  placeholder="Nombre de quien recibe"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Director de Proyecto P&M</label>
                <input
                  type="text"
                  value={deliveryDirector}
                  onChange={(e) => { setDeliveryDirector(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                  placeholder="Ingeniero Director"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Auditor / Inspector de Calidad</label>
                <input
                  type="text"
                  value={deliveryInspector}
                  onChange={(e) => { setDeliveryInspector(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                  placeholder="Auditor Técnico"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Estado Final de Recepción</label>
                <select
                  value={deliveryStatus}
                  onChange={(e) => { setDeliveryStatus(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold font-bold"
                >
                  <option value="APROBADO">APROBADO A SATISFACCIÓN</option>
                  <option value="OBSERVACIONES">RECIBIDO CON OBSERVACIONES MENORES</option>
                  <option value="PENDIENTE">PENDIENTE DE INSPECCIÓN FINAL</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Revisión de Documento</label>
                <input
                  type="text"
                  value={revision}
                  onChange={(e) => { setRevision(e.target.value); handleChangeWithAutosave(); }}
                  className="w-full px-4 py-2.5 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold font-mono"
                  placeholder="R01, R02, R03"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">Notas Adicionales del Acta de Entrega</label>
              <textarea
                rows={3}
                value={deliveryNotes}
                onChange={(e) => { setDeliveryNotes(e.target.value); handleChangeWithAutosave(); }}
                className="w-full px-4 py-3 bg-brand-dark/80 border border-brand-green/30 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold"
                placeholder="Se hace entrega de llaves, manuales de mantenimiento preventivo y certificado de garantía europea..."
              />
            </div>
          </div>
        )}

        {/* STEP 8: FOTOGRAFÍAS */}
        {activeStep === 8 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Fotografías de Obra & Portada del Portafolio</h2>
                <p className="text-xs text-gray-400">Suba imágenes de alta resolución a Supabase Storage y marque la imagen principal.</p>
              </div>

              <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-yellow-400 text-brand-dark font-black text-xs uppercase cursor-pointer transition-all shadow-md">
                <UploadCloud className="w-4 h-4" />
                <span>{isUploading ? 'Subiendo...' : 'Subir Fotos'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  onChange={handleUploadImages}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            {images.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-brand-green/30 rounded-2xl p-6">
                <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-300">Aún no hay fotos cargadas</p>
                <p className="text-xs text-gray-400 mt-1">Haga clic en &quot;Subir Fotos&quot; para cargar las imágenes de la obra.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-2xl overflow-hidden border-2 aspect-video bg-black/40 group ${
                      img.isCover
                        ? 'border-brand-gold shadow-[0_0_20px_rgba(200,169,75,0.3)]'
                        : 'border-brand-green/30 hover:border-brand-green'
                    }`}
                  >
                    <img src={img.url} alt={`Foto ${idx}`} className="w-full h-full object-cover" />

                    {img.isCover ? (
                      <div className="absolute top-2 left-2 bg-brand-gold text-brand-dark px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-current" />
                        Portada
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = images.map((im, i) => ({ ...im, isCover: i === idx }));
                          setImages(updated);
                          handleChangeWithAutosave();
                        }}
                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 bg-black/80 hover:bg-brand-gold hover:text-brand-dark text-white text-[10px] font-bold px-2 py-0.5 rounded transition-all"
                      >
                        Hacer Portada
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm('¿Eliminar esta fotografía de la obra?')) return;
                        try {
                          await fetch('/api/admin/storage/delete', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ projectId: id, url: img.url }),
                          });
                        } catch (e) {
                          console.warn('Error deleting from storage:', e);
                        }
                        const updated = images.filter((_, i) => i !== idx);
                        if (updated.length > 0 && !updated.some((im) => im.isCover)) {
                          updated[0].isCover = true;
                        }
                        setImages(updated);
                        handleChangeWithAutosave();
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-600/90 text-white p-1 rounded-md transition-all"
                      title="Eliminar fotografía"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step Navigation Bottom Buttons */}
        <div className="pt-6 border-t border-brand-green/20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
            disabled={activeStep === 1}
            className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-bold text-xs transition-colors disabled:opacity-30 cursor-pointer"
          >
            ← Paso Anterior
          </button>

          <div className="text-xs text-gray-400 font-semibold">
            Paso {activeStep} de {STEPS.length}
          </div>

          <button
            type="button"
            onClick={() => setActiveStep((prev) => Math.min(STEPS.length, prev + 1))}
            disabled={activeStep === STEPS.length}
            className="px-6 py-2.5 rounded-xl bg-brand-green hover:bg-emerald-700 text-white font-bold text-xs transition-colors disabled:opacity-30 cursor-pointer"
          >
            Siguiente Paso →
          </button>
        </div>
      </div>
    </div>
  );
}
