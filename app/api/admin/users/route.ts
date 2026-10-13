import { clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { AuthError, requireUserManager, SUPER_ADMIN_EMAILS } from '@/lib/auth/rbac';

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'FINANCE', 'COMMERCIAL', 'PROJECT_MANAGER', 'CLIENT', 'USER'] as const;
type ManagedRole = (typeof ROLES)[number];

function roleFor(user: { publicMetadata: unknown; primaryEmailAddress?: { emailAddress: string } | null }): ManagedRole {
  const metadata = (user.publicMetadata ?? {}) as Record<string, unknown>;
  const requested = typeof metadata.role === 'string' ? metadata.role.toUpperCase() : 'USER';
  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase().trim();
  if (email && SUPER_ADMIN_EMAILS.includes(email)) return 'SUPER_ADMIN';
  return ROLES.includes(requested as ManagedRole) ? requested as ManagedRole : 'USER';
}

function isAdminRole(role: ManagedRole) { return role === 'SUPER_ADMIN' || role === 'ADMIN'; }
function serializeUser(user: { id: string; firstName?: string | null; lastName?: string | null; username?: string | null; imageUrl: string; createdAt: number; lastSignInAt?: number | null; banned: boolean; primaryEmailAddress?: { emailAddress: string } | null; publicMetadata: unknown }) {
  return { id: user.id, name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'Usuario sin nombre', email: user.primaryEmailAddress?.emailAddress || null, imageUrl: user.imageUrl, role: roleFor(user), createdAt: new Date(user.createdAt).toISOString(), lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt).toISOString() : null, banned: user.banned };
}

export async function GET() {
  try { const client = await clerkClient(); await requireUserManager(); const response = await client.users.getUserList({ limit: 100, orderBy: '-created_at' }); return NextResponse.json({ users: response.data.map(serializeUser), totalCount: response.totalCount, roles: ROLES }); }
  catch (error) { const authError = error as AuthError; return NextResponse.json({ error: error instanceof Error ? error.message : 'No fue posible consultar los usuarios.' }, { status: authError.status || 500 }); }
}

export async function PATCH(request: NextRequest) {
  try {
    const actor = await requireUserManager();
    const { userId, role } = await request.json();
    const normalizedRole = typeof role === 'string' ? role.toUpperCase() as ManagedRole : null;
    if (typeof userId !== 'string' || !normalizedRole || !ROLES.includes(normalizedRole)) return NextResponse.json({ error: 'Bad Request', message: 'Usuario o rol no válido.' }, { status: 400 });
    const client = await clerkClient();
    const target = await client.users.getUser(userId);
    const currentRole = roleFor(target);
    if (target.id === actor.userId && !isAdminRole(normalizedRole)) return NextResponse.json({ error: 'Conflict', message: 'No puede retirar su propio acceso administrativo desde esta sesión.' }, { status: 409 });
    if (isAdminRole(currentRole) && !isAdminRole(normalizedRole)) { const allUsers = await client.users.getUserList({ limit: 100 }); if (allUsers.data.filter((user) => isAdminRole(roleFor(user))).length <= 1) return NextResponse.json({ error: 'Conflict', message: 'Debe conservar al menos un administrador operativo.' }, { status: 409 }); }
    const metadata = (target.publicMetadata ?? {}) as Record<string, unknown>;
    const updated = await client.users.updateUserMetadata(userId, { publicMetadata: { ...metadata, role: normalizedRole } });
    return NextResponse.json({ user: serializeUser(updated), message: 'Rol actualizado correctamente.' });
  } catch (error) { const authError = error as AuthError; return NextResponse.json({ error: error instanceof Error ? error.message : 'No fue posible actualizar el rol.' }, { status: authError.status || 500 }); }
}
