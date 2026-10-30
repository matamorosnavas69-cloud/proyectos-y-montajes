import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { isPresentationMode } from './lib/auth/presentation';
import { getCleanClerkPublishableKey, getCleanClerkSecretKey } from './lib/auth/clerk-config';

const SUPER_ADMIN_EMAILS = [
  'sebastian.garciacasanova@gmail.com',
  'sebastian,garciacasanova@gmail.com',
];

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
  '/api/admin(.*)',
]);

export default clerkMiddleware(
  async (auth, req) => {
    try {
      const { pathname } = req.nextUrl;

      // Protect admin routes with RBAC
      if (isAdminRoute(req)) {
        const previewParam = req.nextUrl.searchParams.get('preview');
        const hasPreviewCookie = req.cookies.get('pm_team_preview')?.value === 'true';
        const isTeamPreview = isPresentationMode || hasPreviewCookie || previewParam === 'pm2026';

        if (isTeamPreview) {
          const response = NextResponse.next();
          if (previewParam === 'pm2026' || !hasPreviewCookie) {
            response.cookies.set('pm_team_preview', 'true', {
              path: '/',
              maxAge: 60 * 60 * 24 * 7, // 7 days
              sameSite: 'lax',
            });
          }
          return response;
        }

        let userId: string | null = null;
        let sessionClaims: Record<string, unknown> = {};

        try {
          const authData = await auth();
          userId = authData?.userId ?? null;
          sessionClaims = (authData?.sessionClaims ?? {}) as Record<string, unknown>;
        } catch (authError) {
          console.error('[Middleware] Clerk auth error:', authError);
          if (pathname.startsWith('/api/admin')) {
            return NextResponse.json(
              { error: 'Unauthorized', message: 'Error de verificación de sesión.' },
              { status: 401 }
            );
          }
          const signInUrl = new URL('/sign-in', req.url);
          signInUrl.searchParams.set('redirect_url', pathname);
          return NextResponse.redirect(signInUrl);
        }

        // 1. Not signed in -> redirect or 401
        if (!userId) {
          if (pathname.startsWith('/api/admin')) {
            return NextResponse.json(
              { error: 'Unauthorized', message: 'Se requiere inicio de sesión para acceder a la API de administración.' },
              { status: 401 }
            );
          }
          const signInUrl = new URL('/sign-in', req.url);
          signInUrl.searchParams.set('redirect_url', pathname);
          return NextResponse.redirect(signInUrl);
        }

        // 2. Check Admin Role or Super Admin email
        const claims = sessionClaims;
        const metadata = ((claims.metadata || claims.publicMetadata) ?? {}) as Record<string, unknown>;
        const role = typeof metadata.role === 'string' ? metadata.role : '';

        const email = (
          (typeof claims.email === 'string' ? claims.email : '') ||
          (typeof claims.primary_email_address === 'string' ? claims.primary_email_address : '') ||
          (Array.isArray(claims.email_addresses) && typeof claims.email_addresses[0] === 'string' ? claims.email_addresses[0] : '')
        ).toLowerCase();

        const isSuperAdmin = Boolean(
          (email && SUPER_ADMIN_EMAILS.includes(email)) ||
          role.toUpperCase() === 'SUPER_ADMIN'
        );
        const isAdmin = isPresentationMode || isSuperAdmin || role.toUpperCase() === 'ADMIN';

        // 3. Unauthorized role -> 403 Forbidden
        if (!isAdmin) {
          if (pathname.startsWith('/api/admin')) {
            return NextResponse.json(
              { error: 'Forbidden', message: 'No tiene permisos de administrador para ejecutar esta acción.' },
              { status: 403 }
            );
          }

          // Return high-end branded 403 Forbidden screen
          return new NextResponse(
        `<!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>403 - Acceso Restringido | Proyectos y Montajes</title>
            <style>
              body {
                margin: 0;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #0b120d;
                color: #ffffff;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background-image: radial-gradient(circle at 50% 30%, rgba(27, 94, 32, 0.25) 0%, rgba(11, 18, 13, 1) 75%);
              }
              .card {
                background: rgba(19, 29, 22, 0.85);
                border: 1px solid rgba(212, 175, 55, 0.25);
                border-radius: 16px;
                padding: 48px;
                max-width: 480px;
                width: 90%;
                text-align: center;
                backdrop-filter: blur(16px);
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(27, 94, 32, 0.2);
              }
              .badge {
                display: inline-block;
                padding: 6px 14px;
                background: rgba(236, 102, 2, 0.15);
                color: #ec6602;
                border: 1px solid rgba(236, 102, 2, 0.3);
                border-radius: 9999px;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                margin-bottom: 20px;
              }
              h1 {
                font-size: 26px;
                font-weight: 900;
                margin: 0 0 12px 0;
                color: #ffffff;
              }
              p {
                color: #9ca3af;
                font-size: 15px;
                line-height: 1.6;
                margin: 0 0 32px 0;
              }
              .btn {
                display: inline-block;
                padding: 12px 28px;
                background: #d4af37;
                color: #0b120d;
                font-weight: 800;
                font-size: 14px;
                text-decoration: none;
                border-radius: 8px;
                transition: all 0.2s ease;
              }
              .btn:hover {
                background: #e6c65b;
                transform: translateY(-2px);
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="badge">403 Acceso Restringido</div>
              <h1>Permisos Insuficientes</h1>
              <p>Esta sección está reservada exclusivamente para el equipo administrativo de <strong>Proyectos y Montajes</strong>. Si requiere autorización, solicítela al administrador del sistema.</p>
              <a href="/" class="btn">Volver al Sitio Principal</a>
            </div>
          </body>
        </html>`,
        { status: 403, headers: { 'content-type': 'text/html; charset=utf-8' } }
      );
    }
  }
  return NextResponse.next();
} catch (globalErr) {
  console.error('[Middleware] Global error:', globalErr);
  return NextResponse.next();
}
},
{
  publishableKey: getCleanClerkPublishableKey(),
  secretKey: getCleanClerkSecretKey(),
});

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/admin',
    '/api/admin/:path*',
  ],
};
