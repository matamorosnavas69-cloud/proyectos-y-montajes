import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AuthError } from '@/lib/auth/rbac';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_BUCKET } from '@/lib/supabase/storage';
import fs from 'fs';

function resolveChromePath(): string {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const knownPaths = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
  ];
  for (const p of knownPaths) {
    if (fs.existsSync(p)) return p;
  }
  return 'google-chrome';
}

export async function GET() {
  try {
    await requireAdmin();

    const startTime = Date.now();

    // 1. Database Health & Latency Check
    let dbStatus = 'UNHEALTHY';
    let dbLatencyMs = 0;
    let projectCount = 0;
    let leadCount = 0;

    try {
      const dbStart = Date.now();
      const count = await prisma.project.count();
      const leads = await prisma.lead.count();
      dbLatencyMs = Date.now() - dbStart;
      projectCount = count;
      leadCount = leads;
      dbStatus = dbLatencyMs < 2000 ? 'HEALTHY' : 'DEGRADED';
    } catch (dbErr) {
      console.error('[Health Check DB Error]:', dbErr);
      dbStatus = 'DOWN';
    }

    // 2. Storage Health Check
    let storageStatus = 'UNHEALTHY';
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage.from(DEFAULT_BUCKET).list('', { limit: 1 });
      if (!error && data !== null) {
        storageStatus = 'HEALTHY';
      } else {
        storageStatus = 'DEGRADED';
      }
    } catch (storageErr) {
      console.error('[Health Check Storage Error]:', storageErr);
      storageStatus = 'DOWN';
    }

    // 3. PDF Engine Check
    const chromePath = resolveChromePath();
    const pdfStatus = fs.existsSync(chromePath) ? 'HEALTHY' : 'DEGRADED';

    // 4. Memory & Performance
    const memory = process.memoryUsage();
    const rssMB = Math.round(memory.rss / 1024 / 1024);
    const heapUsedMB = Math.round(memory.heapUsed / 1024 / 1024);

    const overallHealthy = dbStatus === 'HEALTHY' && storageStatus !== 'DOWN' && pdfStatus === 'HEALTHY';

    return NextResponse.json({
      status: overallHealthy ? 'HEALTHY' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
      services: {
        api: {
          status: 'HEALTHY',
          uptimeSeconds: Math.round(process.uptime()),
          nodeVersion: process.version,
        },
        database: {
          status: dbStatus,
          schema: 'proyectos_y_montajes',
          latencyMs: dbLatencyMs,
          totalProjects: projectCount,
          totalLeads: leadCount,
        },
        storage: {
          status: storageStatus,
          bucket: DEFAULT_BUCKET,
        },
        pdfEngine: {
          status: pdfStatus,
          binary: chromePath,
          standard: 'A4 European Construction Technical Sheet',
        },
        auth: {
          status: 'HEALTHY',
          provider: 'Clerk Core RBAC',
        },
      },
      system: {
        rssMemoryMB: rssMB,
        heapUsedMB: heapUsedMB,
      },
    });
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al verificar salud del sistema';
    return NextResponse.json({ error: message }, { status });
  }
}
