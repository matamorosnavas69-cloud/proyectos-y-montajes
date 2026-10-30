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

const clerkHandler = clerkMiddleware(
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

        // 3. User authenticated but without administrative role -> Guidance & Onboarding Screen
        if (!isAdmin) {
          if (pathname.startsWith('/api/admin')) {
            return NextResponse.json(
              { error: 'Forbidden', message: 'No tiene permisos de administrador para ejecutar esta acción.' },
              { status: 403 }
            );
          }

          // Return high-end branded onboarding & role request screen
          return new NextResponse(
        `<!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Cuenta Registrada | Proyectos y Montajes</title>
            <style>
              body {
                margin: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #0b120d;
                color: #ffffff;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background-image: radial-gradient(circle at 50% 30%, rgba(27, 94, 32, 0.35) 0%, rgba(11, 18, 13, 1) 75%);
                padding: 24px;
                box-sizing: border-box;
              }
              .card {
                background: rgba(19, 29, 22, 0.92);
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: 20px;
                padding: 44px 36px;
                max-width: 520px;
                width: 100%;
                text-align: center;
                backdrop-filter: blur(20px);
                box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(27, 94, 32, 0.25);
              }
              .badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 14px;
                background: rgba(212, 175, 55, 0.15);
                color: #d4af37;
                border: 1px solid rgba(212, 175, 55, 0.35);
                border-radius: 9999px;
                font-size: 11px;
                font-weight: 800;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                margin-bottom: 20px;
              }
              .email-pill {
                display: inline-block;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #e5e7eb;
                padding: 6px 12px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 16px;
              }
              h1 {
                font-size: 26px;
                font-weight: 900;
                margin: 0 0 12px 0;
                color: #ffffff;
                letter-spacing: -0.02em;
              }
              p {
                color: #9ca3af;
                font-size: 14px;
                line-height: 1.6;
                margin: 0 0 24px 0;
              }
              .actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
              }
              .btn-primary {
                display: block;
                padding: 13px 24px;
                background: #d4af37;
                color: #0b120d;
                font-weight: 900;
                font-size: 13px;
                text-decoration: none;
                border-radius: 10px;
                transition: all 0.2s ease;
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.25);
              }
              .btn-primary:hover {
                background: #e6c65b;
                transform: translateY(-1px);
              }
              .btn-secondary {
                display: block;
                padding: 12px 24px;
                background: rgba(255, 255, 255, 0.05);
                color: #d1d5db;
                border: 1px solid rgba(255, 255, 255, 0.12);
                font-weight: 700;
                font-size: 13px;
                text-decoration: none;
                border-radius: 10px;
                transition: all 0.2s ease;
              }
              .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #ffffff;
              }
              .footer-link {
                margin-top: 20px;
                display: inline-block;
                color: #6b7280;
                font-size: 12px;
                text-decoration: none;
                transition: color 0.2s ease;
              }
              .footer-link:hover {
                color: #d4af37;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="badge">Cuenta Identificada</div>
              <h1>Bienvenido a Proyectos y Montajes</h1>
              ${email ? `<div class="email-pill">${email}</div>` : ''}
              <p>Su usuario ha sido autenticado con éxito. Para acceder al panel operativo, el Super Administrador debe asignarle un rol (Comercial, Gestor de Proyectos o Administrador) desde la consola de Gobierno de Accesos.</p>
              <div class="actions">
                <a href="/admin?preview=pm2026" class="btn-primary">Entrar en Modo Presentación (Demo) &rarr;</a>
                <a href="/sign-in" class="btn-secondary">Iniciar con otra cuenta</a>
              </div>
              <a href="/" class="footer-link">&larr; Volver al sitio web principal</a>
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

/**
 * Resilient Next.js Middleware Wrapper
 * Completely prevents 500 MIDDLEWARE_INVOCATION_FAILED by catching any internal Clerk handshake failures.
 */
export default async function middleware(req: any, event: any) {
  try {
    return await clerkHandler(req, event);
  } catch (err) {
    console.error('[Middleware Safety Wrapper] Rescued from Clerk middleware invocation error:', err);

    // If presentation / team preview is requested, honor it safely
    const previewParam = req.nextUrl?.searchParams?.get('preview');
    const hasPreviewCookie = req.cookies?.get('pm_team_preview')?.value === 'true';
    if (previewParam === 'pm2026' || hasPreviewCookie || isPresentationMode) {
      const res = NextResponse.next();
      res.cookies.set('pm_team_preview', 'true', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      });
      return res;
    }

    // For API calls, return 401 instead of crashing edge runtime
    if (req.nextUrl?.pathname?.startsWith('/api/admin')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Sesión temporalmente no verificada. Inicie sesión.' },
        { status: 401 }
      );
    }

    // Gracefully redirect admin pages to the branded sign-in
    const signInUrl = new URL('/sign-in', req.url);
    if (req.nextUrl?.pathname) {
      signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
    }
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/admin',
    '/api/admin/:path*',
  ],
};
