'use client';

import { useUser } from '@clerk/nextjs';
import { SUPER_ADMIN_EMAILS, UserRole } from './constants';
import { isPresentationMode } from './presentation';

export function useRBAC() {
  const { isLoaded, isSignedIn, user } = useUser();

  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase().trim();
  const allEmails = (user?.emailAddresses || []).map((e) => e.emailAddress.toLowerCase().trim());
  const rawRole = (user?.publicMetadata?.role as string) || 'USER';

  const isSuperAdmin = Boolean(
    (email && SUPER_ADMIN_EMAILS.includes(email)) ||
      allEmails.some((e) => SUPER_ADMIN_EMAILS.includes(e)) ||
      rawRole.toUpperCase() === 'SUPER_ADMIN'
  );

  const isAdmin = Boolean(isSignedIn) && (
    isPresentationMode || isSuperAdmin || rawRole.toUpperCase() === 'ADMIN'
  );

  const role: UserRole = isSuperAdmin
    ? 'SUPER_ADMIN'
    : isAdmin
    ? 'ADMIN'
    : (rawRole.toUpperCase() as UserRole) || 'USER';

  return {
    isLoaded,
    isSignedIn: Boolean(isSignedIn),
    user,
    email,
    role,
    isAdmin,
    isSuperAdmin,
    isPresentationMode,
  };
}
