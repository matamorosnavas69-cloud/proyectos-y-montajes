"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BadgeCheck, Check, X } from "lucide-react";

const KEY = "pym-popup-closed";
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;
const POOL = ["/hero/cancha.png", "/hero/cancha2.png", "/hero/cancha3.png", "/hero/cancha4.png", "/hero/cancha5.png", "/hero/parque.png", "/hero/parque2.png", "/hero/balcones y terrazasa 1.png", "/hero/balcones y terrazasa2.png"];
const PROJECTS = ["Cancha deportiva", "Pádel", "Parque infantil", "Terraza", "Balcón", "Otro"];

export default function SubscribePopup() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [seen, setSeen] = useState(false);
  const [imgs, setImgs] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!open) return;
    setImgs([...POOL].sort(() => Math.random() - 0.5).slice(0, 3)); // ponytail: sort-shuffle is fine for 9 items
    const t = window.setInterval(() => setIdx((i) => (i + 1) % 3), 3500);
    return () => window.clearInterval(t);
  }, [open]);

  useEffect(() => {
    try { if (Date.now() - Number(localStorage.getItem(KEY) || 0) < SNOOZE_MS) { setSeen(true); return; } } catch {}
    const show = () => setOpen(true);
    const timer = window.setTimeout(show, 9000);
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0) show(); };
    document.addEventListener("mouseleave", onLeave);
    return () => { window.clearTimeout(timer); document.removeEventListener("mouseleave", onLeave); };
  }, []);

  const close = () => {
    setOpen(false);
    setSeen(true);
    try { localStorage.setItem(KEY, String(Date.now())); } catch {}
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return seen ? (
    <button type="button" onClick={() => { setStatus("idle"); setOpen(true); }} className="fixed bottom-5 right-5 z-[90] rounded-full bg-brand-gold px-5 py-3 text-sm font-extrabold text-brand-dark shadow-xl transition hover:-translate-y-0.5 hover:bg-white">Cotización gratis</button>
  ) : null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    const project = String(f.get("project"));
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: f.get("name"), phone: f.get("phone"), email: f.get("email"), website: f.get("website"),
        projectType: project, notes: `Pop up de la landing: pidió cotización gratis y guía de elección. Proyecto: ${project}.`,
      }),
    }).catch(() => null);
    if (res?.ok) { setStatus("done"); try { localStorage.setItem(KEY, String(Date.now())); } catch {} return; }
    const data = await res?.json().catch(() => null);
    setError(data?.message || "No pudimos enviar tus datos. Intenta de nuevo.");
    setStatus("idle");
  }

  const field = "w-full rounded-lg border border-brand-dark/20 bg-white px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-dark/45 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-sm" onClick={close}>
      <div role="dialog" aria-modal="true" aria-label="Cotización gratis" onClick={(e) => e.stopPropagation()} className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-[1fr_1.1fr]">
        <button type="button" onClick={close} aria-label="Cerrar" className="absolute right-3 top-3 z-20 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"><X className="h-5 w-5" /></button>

        <div className="relative min-h-[200px] md:min-h-[520px]">
          {imgs.map((src, i) => <Image key={src} src={src} alt="Proyecto de grama sintética" fill sizes="(min-width: 768px) 380px, 100vw" className={`object-cover transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`} />)}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
            <span className="inline-block rounded-full bg-brand-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-dark">100% gratis</span>
            <ul className="mt-3 space-y-1.5 text-sm font-medium">
              {["Cotización sin compromiso", "Guía de elección de grama", "Garantía por escrito"].map((t) => <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0 text-brand-gold" />{t}</li>)}
            </ul>
          </div>
        </div>

        <div className="p-6 text-brand-dark sm:p-8">
          {status === "done" ? (
            <div className="flex h-full flex-col items-center justify-center py-8 text-center">
              <BadgeCheck className="h-14 w-14 text-brand-gold" />
              <h2 className="mt-4 text-2xl font-semibold">¡Listo!</h2>
              <p className="mt-2 text-sm text-brand-dark/75">Un especialista te contactará pronto con tu cotización y la guía de elección.</p>
              <button type="button" onClick={close} className="mt-6 rounded-full bg-brand-dark px-6 py-2.5 text-sm font-bold text-white">Seguir explorando</button>
            </div>
          ) : (
            <>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark/60">Cotización gratis</p>
              <h2 className="mt-2 text-3xl font-bold leading-tight">Tu cancha, con <span className="rounded bg-brand-gold px-1.5">garantía</span> por escrito</h2>
              <p className="mt-3 text-sm text-brand-dark/75">Déjanos tus datos y te enviamos la cotización y la guía «Cómo elegir grama sintética según su uso».</p>
              <form onSubmit={submit} className="mt-5 space-y-3">
                <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <input name="name" required placeholder="Tu nombre" autoComplete="name" className={field} />
                <input name="phone" type="tel" placeholder="WhatsApp" autoComplete="tel" className={field} />
                <input name="email" type="email" placeholder="Correo (si no das WhatsApp)" autoComplete="email" className={field} />
                <select name="project" defaultValue={PROJECTS[0]} className={field}>{PROJECTS.map((p) => <option key={p}>{p}</option>)}</select>
                <label className="flex items-start gap-2 text-xs text-brand-dark/65"><input type="checkbox" required className="mt-0.5" />Autorizo el tratamiento de mis datos para recibir información de mi proyecto. Sin spam.</label>
                {error && <p className="text-xs text-red-600">{error}</p>}
                <button type="submit" disabled={status === "sending"} className="min-h-12 w-full rounded-full bg-brand-gold px-6 text-sm font-extrabold text-brand-dark shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-dark hover:text-white disabled:opacity-60">{status === "sending" ? "Enviando…" : "Quiero mi cotización gratis →"}</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
