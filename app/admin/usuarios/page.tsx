'use client';

import { AlertTriangle, CheckCircle2, KeyRound, LoaderCircle, Search, ShieldCheck, UserCog, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useRBAC } from '@/lib/auth/useRBAC';

type ManagedUser = { id: string; name: string; email: string | null; imageUrl: string; role: string; createdAt: string; lastSignInAt: string | null; banned: boolean };
const roleLabels: Record<string, string> = { SUPER_ADMIN: 'Super Administrador', ADMIN: 'Administrador', FINANCE: 'Finanzas', COMMERCIAL: 'Comercial', PROJECT_MANAGER: 'Gestor de Proyectos', CLIENT: 'Cliente', USER: 'Usuario' };
const roleStyles: Record<string, string> = { SUPER_ADMIN: 'border-brand-gold/40 bg-brand-gold/15 text-brand-gold', ADMIN: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200', FINANCE: 'border-violet-400/30 bg-violet-400/10 text-violet-200', COMMERCIAL: 'border-sky-400/30 bg-sky-400/10 text-sky-200', PROJECT_MANAGER: 'border-orange-400/30 bg-orange-400/10 text-orange-200', CLIENT: 'border-white/15 bg-white/5 text-gray-300', USER: 'border-white/10 bg-white/5 text-gray-400' };

function dateLabel(value: string | null) { return value ? new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : 'Sin inicio de sesión'; }

export default function UserManagementPage() {
  const { isLoaded, isSuperAdmin, isPresentationMode } = useRBAC();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function loadUsers() {
    setLoading(true); setMessage(null);
    try {
      const response = await fetch('/api/admin/users', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No fue posible consultar los usuarios.');
      setUsers(data.users || []); setRoles(data.roles || []);
    } catch (error) { setMessage({ type: 'error', text: error instanceof Error ? error.message : 'No fue posible consultar los usuarios.' }); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (isLoaded && isSuperAdmin) loadUsers(); else if (isLoaded) setLoading(false); }, [isLoaded, isSuperAdmin]);

  async function changeRole(userId: string, role: string) {
    const previous = users.find((user) => user.id === userId);
    if (!previous || previous.role === role) return;
    setUpdatingId(userId); setMessage(null);
    setUsers((current) => current.map((user) => user.id === userId ? { ...user, role } : user));
    try {
      const response = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, role }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'No fue posible actualizar el rol.');
      setUsers((current) => current.map((user) => user.id === userId ? data.user : user));
      setMessage({ type: 'success', text: `${data.user.name}: acceso actualizado.` });
    } catch (error) {
      setUsers((current) => current.map((user) => user.id === userId ? previous : user));
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'No fue posible actualizar el rol.' });
    } finally { setUpdatingId(null); }
  }

  const filteredUsers = useMemo(() => users.filter((user) => `${user.name} ${user.email || ''} ${user.role}`.toLowerCase().includes(query.toLowerCase())), [users, query]);
  const administrators = users.filter((user) => ['SUPER_ADMIN', 'ADMIN'].includes(user.role)).length;

  if (!isLoaded || loading) return <div className="grid min-h-[60vh] place-items-center"><div className="text-center text-gray-400"><LoaderCircle className="mx-auto h-[32px] w-[32px] animate-spin text-brand-gold" /><p className="mt-3 text-sm">Cargando gobierno de accesos…</p></div></div>;

  if (!isSuperAdmin) return <div className="mx-auto max-w-2xl rounded-[24px] border border-amber-400/25 bg-[#131d16] p-[32px] text-center shadow-xl"><div className="mx-auto grid h-[56px] w-[56px] place-items-center rounded-full border border-amber-400/30 bg-amber-400/10 text-brand-gold"><ShieldCheck className="h-[26px] w-[26px]" /></div><h1 className="mt-5 text-2xl font-black text-white">Gestión de usuarios protegida</h1><p className="mx-auto mt-3 max-w-lg leading-relaxed text-gray-400">Esta área puede cambiar los permisos de acceso al panel y está reservada para una cuenta con rol real de Super Administrador.</p>{isPresentationMode && <p className="mt-4 rounded-xl border border-white/10 bg-black/15 p-3 text-sm text-gray-300">El modo presentación permite navegar el panel, pero no elevar ni modificar privilegios de otros usuarios.</p>}</div>;

  return <div className="mx-auto max-w-7xl space-y-6">
    <header className="overflow-hidden rounded-[24px] border border-brand-green/30 bg-[#131d16] p-[24px] shadow-xl md:p-[32px]"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-brand-gold"><KeyRound className="h-[14px] w-[14px]" /> Gobierno de accesos</div><h1 className="mt-4 text-3xl font-black text-white md:text-4xl">Gestión de usuarios</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">Administre los roles operativos del panel. Los perfiles se sincronizan directamente con Clerk y los cambios toman efecto en la siguiente actualización de sesión.</p></div><div className="rounded-2xl border border-white/10 bg-black/15 px-[20px] py-[16px]"><p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Administradores activos</p><p className="mt-1 text-2xl font-black text-brand-gold">{administrators}<span className="text-sm text-gray-500"> / {users.length}</span></p></div></div></header>

    {message && <div role="status" className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100' : 'border-red-400/30 bg-red-400/10 text-red-100'}`}>{message.type === 'success' ? <CheckCircle2 className="h-[18px] w-[18px] shrink-0" /> : <AlertTriangle className="h-[18px] w-[18px] shrink-0" />}{message.text}</div>}

    <section className="rounded-[24px] border border-white/10 bg-[#131d16] p-[16px] shadow-xl md:p-[24px]"><div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h2 className="text-lg font-black text-white">Equipo y permisos</h2><p className="mt-1 text-sm text-gray-500">{filteredUsers.length} usuarios visibles · los cambios protegen el último acceso administrativo.</p></div><label className="relative block w-full md:w-[320px]"><Search className="pointer-events-none absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-gray-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, correo o rol…" className="w-full rounded-xl border border-white/10 bg-brand-dark/70 py-3 pl-[40px] pr-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-brand-gold" /></label></div>
      <div className="overflow-x-auto"><div className="min-w-[820px] overflow-hidden rounded-[16px] border border-white/10"><div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_0.9fr] gap-4 bg-black/20 px-[20px] py-3 text-[10px] font-black uppercase tracking-[0.14em] text-gray-500"><span>Usuario</span><span>Rol de acceso</span><span>Último acceso</span><span>Registro</span><span>Estado</span></div>{filteredUsers.map((user) => <div key={user.id} className="grid grid-cols-[2fr_1.2fr_1fr_1fr_0.9fr] items-center gap-4 border-t border-white/5 px-[20px] py-[16px] transition hover:bg-white/[0.02]"><div className="flex min-w-0 items-center gap-3"><img src={user.imageUrl} alt="" className="h-[38px] w-[38px] rounded-full border border-white/10 object-cover" /><div className="min-w-0"><p className="truncate text-sm font-bold text-white">{user.name}</p><p className="truncate text-xs text-gray-500">{user.email || 'Sin correo principal'}</p></div></div><div><select value={user.role} disabled={updatingId === user.id} onChange={(event) => changeRole(user.id, event.target.value)} className={`w-full rounded-xl border px-3 py-2 text-xs font-bold outline-none disabled:opacity-50 ${roleStyles[user.role] || roleStyles.USER}`} aria-label={`Rol de ${user.name}`}>{roles.map((role) => <option key={role} value={role} className="bg-brand-dark text-white">{roleLabels[role] || role}</option>)}</select></div><p className="text-xs text-gray-400">{dateLabel(user.lastSignInAt)}</p><p className="text-xs text-gray-400">{dateLabel(user.createdAt)}</p><span className={`inline-flex w-fit rounded-full border px-2 py-1 text-[10px] font-bold ${user.banned ? 'border-red-400/30 bg-red-400/10 text-red-200' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'}`}>{user.banned ? 'Restringido' : 'Activo'}</span></div>)}{!filteredUsers.length && <div className="grid min-h-[180px] place-items-center text-sm text-gray-500"><div className="text-center"><UsersRound className="mx-auto h-[28px] w-[28px] text-gray-600" /><p className="mt-3">No hay usuarios para esta búsqueda.</p></div></div>}</div></div>
      <div className="mt-5 flex items-start gap-2 rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-3 text-xs leading-relaxed text-gray-400"><UserCog className="mt-0.5 h-[16px] w-[16px] shrink-0 text-brand-gold" /><p>Super Administrador controla todos los permisos. Administrador gestiona la operación diaria. Los roles especializados limitan el acceso según responsabilidad.</p></div>
    </section>
  </div>;
}
