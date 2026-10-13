import { auth, currentUser } from '@clerk/nextjs/server';
import { SUPER_ADMIN_EMAILS, UserRole } from './constants';
import { isPresentationMode } from './presentation';
export { SUPER_ADMIN_EMAILS, type UserRole };

export interface AuthError extends Error {
  status?: number;
}

/**
 * Validates if the given role or email qualifies for Admin privileges
 */
export function checkIsAdmin(role?: string | null, email?: string | null): boolean {
  if (email && SUPER_ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
    return true;
  }
  if (!role) return false;
  const upper = role.toUpperCase();
  return upper === 'SUPER_ADMIN' || upper === 'ADMIN';
}

/**
 * Resolves current user authentication and role state on server
 */
export async function getCurrentUserRole() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return {
      userId: null,
      role: 'USER' as UserRole,
      isAdmin: false,
      isSuperAdmin: false,
      email: null,
    };
  }

  // Extract from claims first
  const claims = (sessionClaims ?? {}) as Record<string, unknown>;
  const metadata = ((claims.metadata || claims.publicMetadata) ?? {}) as Record<string, unknown>;
  let role = typeof metadata.role === 'string' ? metadata.role : undefined;

  let email: string | undefined =
    typeof claims.email === 'string'
      ? claims.email
      : typeof claims.primary_email_address === 'string'
      ? claims.primary_email_address
      : Array.isArray(claims.email_addresses) && typeof claims.email_addresses[0] === 'string'
      ? claims.email_addresses[0]
      : undefined;

  // Fallback to full currentUser if claims are missing email or role
  if (!email || !role) {
    try {
      const user = await currentUser();
      if (user) {
        email = user.emailAddresses?.[0]?.emailAddress;
        role = (user.publicMetadata?.role as string) || role;
      }
    } catch (err) {
      console.warn('[RBAC] Could not fetch full currentUser fallback:', err);
    }
  }

  const isSuperAdmin = Boolean(
    (email && SUPER_ADMIN_EMAILS.includes(email.toLowerCase().trim())) ||
      role?.toUpperCase() === 'SUPER_ADMIN'
  );

  const isAdmin = isPresentationMode || isSuperAdmin || role?.toUpperCase() === 'ADMIN';

  return {
    userId,
    role: (isSuperAdmin ? 'SUPER_ADMIN' : isAdmin ? 'ADMIN' : (role as UserRole) || 'USER') as UserRole,
    isAdmin,
    isSuperAdmin,
    email: email || null,
  };
}

/**
 * Server guard: requires the caller to be an authorized Administrator
 * Throws an Error with 401 or 403 code if not authorized.
 */
export async function requireAdmin() {
  const authState = await getCurrentUserRole();

  if (!authState.userId) {
    const error: AuthError = new Error('No autenticado: Inicie sesión para acceder.');
    error.status = 401;
    throw error;
  }

  if (!authState.isAdmin) {
    const error: AuthError = new Error('Acceso denegado: Se requieren permisos de Administrador.');
    error.status = 403;
    throw error;
  }

  return authState;
}

/**
 * Server guard: requires Commercial, Project Manager, Finance, or Admin role
 */
export async function requireUserManager() {
  const authState = await getCurrentUserRole();
  if (!authState.userId) { const error: AuthError = new Error('No autenticado: Inicie sesión para acceder.'); error.status = 401; throw error; }
  if (!authState.isSuperAdmin) { const error: AuthError = new Error('Acceso denegado: La gestión de usuarios requiere un Super Administrador.'); error.status = 403; throw error; }
  return authState;
}

export async function requireStaff() {

  const authState = await getCurrentUserRole();

  if (!authState.userId) {
    const error: AuthError = new Error('No autenticado: Inicie sesión para acceder.');
    error.status = 401;
    throw error;
  }

  const staffRoles: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'FINANCE', 'COMMERCIAL', 'PROJECT_MANAGER'];
  if (!staffRoles.includes(authState.role)) {
    const error: AuthError = new Error('Acceso denegado: Se requieren permisos comerciales o administrativos.');
    error.status = 403;
    throw error;
  }

  return authState;
}

/**
 * Checks whether a given role is allowed to view confidential direct costs, overhead and net margins
 */
export function canViewInternalEconomics(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'FINANCE';
}
