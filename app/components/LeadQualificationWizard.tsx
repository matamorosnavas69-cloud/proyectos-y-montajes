'use client';

import { FormEvent, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, CalendarClock, CheckCircle2, ClipboardCheck, MapPin, MessageCircle, Ruler, ShieldCheck } from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 5;

const PROJECT_TYPES = ['Pistas de Pádel', 'Canchas Sintéticas (Fútbol)', 'Parques Infantiles', 'Grama Sintética & Paisajismo', 'Piscinas & Amenidades', 'Golf & Greens', 'Mantenimiento Especializado', 'Otro'];
const BUDGETS = [
  { label: 'Hasta $30 M', value: 15000000 },
  { label: '$30–80 M', value: 55000000 },
  { label: '$80–200 M', value: 140000000 },
  { label: 'Más de $200 M', value: 250000000 },
  { label: 'Necesito orientación', value: 0 },
];

export default function LeadQualificationWizard() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', company: '', role: '', phone: '', email: '', preferredChannel: 'WhatsApp',
    projectType: '', customerSegment: '', area: '', siteCondition: '', city: '', location: '',
    timeline: '', budget: '', decisionAuthority: '', availability: '', details: '', website: '',
  });

  const selectedBudget = BUDGETS.find((budget) => budget.label === form.budget)?.value || 0;
  const completeness = useMemo(() => [form.name, form.phone, form.projectType, form.city, form.area, form.budget, form.timeline].filter(Boolean).length, [form]);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  function next() {
    setError(null);
    if (step === 1 && (!form.name.trim() || !form.phone.trim())) return setError('Indíquenos su nombre y un WhatsApp para asignar el asesor correcto.');
    if (step === 2 && (!form.projectType || !form.customerSegment)) return setError('Seleccione el tipo de proyecto y el contexto de uso.');
    if (step === 3 && (!form.city.trim() || !form.area || !form.siteCondition)) return setError('Necesitamos ciudad, área aproximada y condición actual para revisar viabilidad.');
    if (step === 4 && (!form.budget || !form.timeline || !form.decisionAuthority)) return setError('Complete presupuesto, momento de decisión y horizonte de inicio.');
    setStep((current) => Math.min(current + 1, 5) as Step);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (form.website) return;
    setError(null); setIsSubmitting(true);
    const notes = [
      'BRIEF DE CALIFICACIÓN WEB',
      `Canal preferido: ${form.preferredChannel}`,
      `Cargo / rol: ${form.role || 'No informado'}`,
      `Segmento: ${form.customerSegment}`,
      `Área estimada: ${form.area} m²`,
      `Condición actual: ${form.siteCondition}`,
      `Presupuesto orientativo: ${form.budget}`,
      `Inicio esperado: ${form.timeline}`,
      `Decisión: ${form.decisionAuthority}`,
      `Disponibilidad: ${form.availability || 'Por coordinar'}`,
      form.details ? `Notas del cliente: ${form.details}` : '',
      `Completitud inicial: ${completeness}/7`,
    ].filter(Boolean).join('\n');

    try {
      const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        name: form.name, company: form.company, email: form.email, phone: form.phone, projectType: form.projectType,
        city: form.city, location: form.location, notes, estimatedBudget: selectedBudget || undefined,
        desiredStart: form.timeline, source: 'WEBSITE',
      }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'No fue posible registrar su solicitud.');
      setStep(5);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No fue posible registrar su solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectionClass = (selected: boolean) => `rounded-xl border p-[16px] text-left text-sm font-bold transition-all ${selected ? 'border-brand-gold bg-brand-gold/10 text-white shadow-lg shadow-brand-gold/5' : 'border-white/10 bg-white/[0.03] text-gray-300 hover:border-brand-green/60 hover:bg-brand-green/10'}`;

  return (
    <div id="simulador" className="w-full max-w-5xl mx-auto overflow-hidden rounded-[32px] border border-brand-green/30 bg-[#101811] shadow-2xl">
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-brand-dark via-[#142318] to-brand-dark px-6 py-7 md:px-[40px] md:py-[32px]">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl" />
        <div className="relative flex flex-col md:flex-row gap-5 md:items-center md:justify-between">
          <div><div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-brand-gold"><ClipboardCheck className="w-3.5 h-3.5" /> Diagnóstico de proyecto</div><h2 className="mt-3 text-2xl md:text-3xl font-black text-white">Hablemos con contexto, no con formularios genéricos.</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">Su brief llega estructurado al equipo comercial para priorizar la revisión técnica, la visita y la propuesta.</p></div>
          <div className="shrink-0 rounded-2xl border border-white/10 bg-black/20 px-[16px] py-3"><p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Brief completado</p><p className="text-xl font-black text-brand-gold">{completeness}<span className="text-sm text-gray-500">/7</span></p></div>
        </div>
        <div className="relative mt-7 grid grid-cols-4 gap-2">{['Contacto', 'Proyecto', 'Viabilidad', 'Decisión'].map((label, index) => <div key={label} className="space-y-2"><div className={`h-1 rounded-full ${step >= index + 1 ? 'bg-brand-gold' : 'bg-white/10'}`} /><p className={`text-[10px] font-bold uppercase tracking-wide ${step >= index + 1 ? 'text-white' : 'text-gray-600'}`}>{label}</p></div>)}</div>
      </div>

      <form onSubmit={submit} className="p-6 md:p-[40px]">
        {error && <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update('website', event.target.value)} className="hidden" aria-hidden="true" />

        {step === 1 && <div className="animate-fade-in space-y-6"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-brand-gold">01 · Responsable del proyecto</p><h3 className="mt-2 text-2xl font-black text-white">¿Con quién coordinamos el diagnóstico?</h3></div><div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]"><Field label="Nombre completo" required><input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Nombre y apellido" className={inputClass} /></Field><Field label="WhatsApp" required><input required type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="300 000 0000" className={inputClass} /></Field><Field label="Empresa o entidad"><input value={form.company} onChange={(event) => update('company', event.target.value)} placeholder="Conjunto, club, colegio…" className={inputClass} /></Field><Field label="Correo de trabajo"><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="nombre@empresa.com" className={inputClass} /></Field><Field label="Rol en la decisión"><input value={form.role} onChange={(event) => update('role', event.target.value)} placeholder="Administrador, arquitecto, propietario…" className={inputClass} /></Field><Field label="Canal preferido"><select value={form.preferredChannel} onChange={(event) => update('preferredChannel', event.target.value)} className={inputClass}><option>WhatsApp</option><option>Llamada</option><option>Correo</option></select></Field></div></div>}

        {step === 2 && <div className="animate-fade-in space-y-6"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-brand-gold">02 · Alcance de la obra</p><h3 className="mt-2 text-2xl font-black text-white">¿Qué necesita transformar?</h3></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{PROJECT_TYPES.map((type) => <button type="button" key={type} onClick={() => update('projectType', type)} className={selectionClass(form.projectType === type)}>{type}</button>)}</div><div><p className="mb-3 text-sm font-bold text-gray-300">Tipo de cliente / uso principal</p><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{['Conjunto residencial', 'Club / deportivo', 'Colegio', 'Público o comercial'].map((segment) => <button type="button" key={segment} onClick={() => update('customerSegment', segment)} className={selectionClass(form.customerSegment === segment)}>{segment}</button>)}</div></div></div>}

        {step === 3 && <div className="animate-fade-in space-y-6"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-brand-gold">03 · Viabilidad técnica</p><h3 className="mt-2 text-2xl font-black text-white">Dé al ingeniero una primera lectura del sitio.</h3></div><div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]"><Field label="Ciudad" required><input required value={form.city} onChange={(event) => update('city', event.target.value)} placeholder="Bucaramanga" className={inputClass} /></Field><Field label="Barrio, dirección o referencia"><input value={form.location} onChange={(event) => update('location', event.target.value)} placeholder="Ubicación aproximada" className={inputClass} /></Field><Field label="Área aproximada (m²)" required><input required min="1" type="number" value={form.area} onChange={(event) => update('area', event.target.value)} placeholder="Ej. 800" className={inputClass} /></Field><Field label="Condición actual" required><select required value={form.siteCondition} onChange={(event) => update('siteCondition', event.target.value)} className={inputClass}><option value="">Seleccione una opción</option><option>Placa o base existente</option><option>Terreno natural / requiere preparación</option><option>Remodelación de instalación existente</option><option>No estoy seguro, requiero visita</option></select></Field></div><div className="rounded-2xl border border-brand-green/30 bg-brand-green/10 p-[16px] text-sm text-emerald-100 flex gap-3"><MapPin className="w-5 h-5 shrink-0 text-brand-gold" /><p>La visita técnica se agenda después de revisar accesos, base, pendientes y alcance. No publicamos un precio definitivo sin validación en sitio.</p></div></div>}

        {step === 4 && <div className="animate-fade-in space-y-6"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-brand-gold">04 · Prioridad comercial</p><h3 className="mt-2 text-2xl font-black text-white">Alineemos inversión, tiempo y decisión.</h3></div><div><p className="mb-3 text-sm font-bold text-gray-300">Rango de inversión previsto</p><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">{BUDGETS.map((budget) => <button type="button" key={budget.label} onClick={() => update('budget', budget.label)} className={selectionClass(form.budget === budget.label)}>{budget.label}</button>)}</div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]"><Field label="¿Cuándo desea iniciar?" required><select required value={form.timeline} onChange={(event) => update('timeline', event.target.value)} className={inputClass}><option value="">Seleccione un horizonte</option><option>Inmediato (0–30 días)</option><option>Próximo trimestre</option><option>Más adelante este año</option><option>En planeación / sin fecha</option></select></Field><Field label="Decisión de compra" required><select required value={form.decisionAuthority} onChange={(event) => update('decisionAuthority', event.target.value)} className={inputClass}><option value="">Seleccione una opción</option><option>Decido directamente</option><option>Participo con comité / junta</option><option>Estoy comparando opciones</option></select></Field><Field label="Mejor momento para contactar"><input value={form.availability} onChange={(event) => update('availability', event.target.value)} placeholder="Ej. lunes a viernes, 2–5 pm" className={inputClass} /></Field><Field label="Notas adicionales"><input value={form.details} onChange={(event) => update('details', event.target.value)} placeholder="Accesos, restricciones, referencia…" className={inputClass} /></Field></div></div>}

        {step === 5 && <div className="animate-fade-in py-[16px] text-center"><div className="mx-auto flex h-[64px] w-[64px] items-center justify-center rounded-full border border-brand-green/40 bg-brand-green/20"><CheckCircle2 className="w-[32px] h-[32px] text-brand-gold" /></div><h3 className="mt-5 text-2xl font-black text-white">Su diagnóstico ya está en la cola técnica.</h3><p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-400">Recibimos el brief con alcance, viabilidad y prioridad comercial. Un especialista revisará la información y coordinará el siguiente paso por {form.preferredChannel.toLowerCase()}.</p><div className="mx-auto mt-7 grid max-w-2xl grid-cols-1 sm:grid-cols-3 gap-3 text-left"><Summary icon={<Building2 />} label="Proyecto" value={form.projectType} /><Summary icon={<Ruler />} label="Área" value={`${form.area} m²`} /><Summary icon={<CalendarClock />} label="Horizonte" value={form.timeline} /></div><div className="mt-[32px] flex justify-center items-center gap-2 text-xs text-gray-500"><ShieldCheck className="w-[16px] h-[16px] text-brand-gold" /> Sus datos se usan únicamente para evaluar esta solicitud.</div></div>}

        {step < 5 && <div className="mt-[32px] flex items-center justify-between border-t border-white/10 pt-6"><button type="button" onClick={() => { setError(null); setStep((current) => Math.max(current - 1, 1) as Step); }} disabled={step === 1} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-400 hover:text-white disabled:opacity-0"><ArrowLeft className="w-[16px] h-[16px]" /> Atrás</button>{step < 4 ? <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-brand-gold px-5 py-3 text-sm font-black text-brand-dark hover:bg-yellow-400">Continuar <ArrowRight className="w-[16px] h-[16px]" /></button> : <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-brand-gold px-5 py-3 text-sm font-black text-brand-dark hover:bg-yellow-400 disabled:opacity-60">{isSubmitting ? 'Registrando…' : 'Solicitar diagnóstico'} <MessageCircle className="w-[16px] h-[16px]" /></button>}</div>}
      </form>
    </div>
  );
}

const inputClass = 'w-full rounded-xl border border-white/10 bg-brand-dark/70 px-[16px] py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-gray-300">{label}{required && <span className="ml-1 text-brand-gold">*</span>}</span>{children}</label>;
}

function Summary({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.03] p-[16px]"><div className="flex items-center gap-2 text-brand-gold">{icon}<span className="text-[10px] font-black uppercase tracking-widest">{label}</span></div><p className="mt-2 text-sm font-bold text-white">{value}</p></div>;
}
