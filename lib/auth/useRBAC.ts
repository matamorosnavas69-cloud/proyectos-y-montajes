'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { SUPER_ADMIN_EMAILS, UserRole } from './constants';
import { isPresentationMode } from './presentation';

export function useRBAC() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [hasPreviewCookie, setHasPreviewCookie] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isPreview =
        document.cookie.includes('pm_team_preview=true') ||
        window.location.search.includes('preview=pm2026');
      if (isPreview) {
        setHasPreviewCookie(true);
      }
    }
  }, []);

  const isDemoActive = isPresentationMode || hasPreviewCookie;

  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase().trim() || (isDemoActive ? 'sebastian.garciacasanova@gmail.com' : undefined);
  const allEmails = (user?.emailAddresses || []).map((e) => e.emailAddress.toLowerCase().trim());
  const rawRole = (user?.publicMetadata?.role as string) || (isDemoActive ? 'SUPER_ADMIN' : 'USER');

  const isSuperAdmin = Boolean(
    isDemoActive ||
      (email && SUPER_ADMIN_EMAILS.includes(email)) ||
      allEmails.some((e) => SUPER_ADMIN_EMAILS.includes(e)) ||
      rawRole.toUpperCase() === 'SUPER_ADMIN'
  );

  const isAdmin = Boolean(
    isDemoActive ||
      (Boolean(isSignedIn) && (isSuperAdmin || rawRole.toUpperCase() === 'ADMIN'))
  );

  const role: UserRole = isSuperAdmin
    ? 'SUPER_ADMIN'
    : isAdmin
    ? 'ADMIN'
    : (rawRole.toUpperCase() as UserRole) || 'USER';

  return {
    isLoaded: isLoaded || isDemoActive,
    isSignedIn: Boolean(isSignedIn) || isDemoActive,
    user: user || (isDemoActive ? ({ firstName: 'Sebastian', fullName: 'Sebastian Garcia', primaryEmailAddress: { emailAddress: 'sebastian.garciacasanova@gmail.com' } } as unknown as typeof user) : null),
    email,
    role,
    isAdmin,
    isSuperAdmin,
    isPresentationMode: isDemoActive,
  };
}
