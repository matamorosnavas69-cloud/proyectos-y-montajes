import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { requireAdmin, AuthError } from '@/lib/auth/rbac';
import { generateTechnicalSheetHTML } from '@/lib/pdf/technical-sheet-template';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

const execFileAsync = promisify(execFile);

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let tempHtmlPath: string | null = null;
  let tempPdfPath: string | null = null;

  try {
    const authState = await requireAdmin();
    const { id } = await params;

    // Rate Limiting Protection (Max 10 PDFs per minute per admin)
    const rate = checkRateLimit({
      windowMs: 60000,
      max: 10,
      identifier: authState.userId || 'admin',
      action: 'pdf_export',
    });

    if (!rate.success) {
      return NextResponse.json(
        {
          error: 'Demasiadas solicitudes',
          message: `Límite de generación de PDF superado. Por favor espere ${Math.ceil(rate.resetMs / 1000)} segundos.`,
        },
        { status: 429 }
      );
    }

    // 1. Fetch project and all technical sheet relations from database
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        technicalSheet: {
          include: {
            materials: { orderBy: { order: 'asc' } },
            milestones: { orderBy: { order: 'asc' } },
            qualityChecks: { orderBy: { order: 'asc' } },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    const sheet = project.technicalSheet || {
      revision: 'R01',
      sheetStatus: 'DRAFT',
      specifications: null,
      observations: null,
      pendingItems: null,
      deliveryDate: null,
      deliveryNotes: null,
      deliveryClient: null,
      deliveryDirector: null,
      deliveryInspector: null,
      deliveryStatus: 'PENDIENTE',
      approvedAt: null,
      approvedBy: null,
      issuedAt: null,
      issuedBy: null,
      materials: [],
      milestones: [],
      qualityChecks: [],
    };

    const printData = {
      project: {
        title: project.title,
        slug: project.slug,
        category: project.category,
        client: project.client,
        location: project.location,
        city: project.city,
        sqMeters: project.sqMeters,
        duration: project.duration,
        status: project.status,
        director: project.director,
        commercialRep: project.commercialRep,
        internalCode: project.internalCode,
        startDate: project.startDate?.toISOString() || null,
        deliveryDate: project.deliveryDate?.toISOString() || null,
        description: project.description,
        mainImage: project.mainImage,
      },
      sheet: {
        revision: sheet.revision || 'R01',
        sheetStatus: sheet.sheetStatus || 'DRAFT',
        specifications: (sheet.specifications as Record<string, unknown>) || null,
        observations: sheet.observations,
        pendingItems: sheet.pendingItems,
        deliveryDate: sheet.deliveryDate?.toISOString() || null,
        deliveryNotes: sheet.deliveryNotes,
        deliveryClient: sheet.deliveryClient,
        deliveryDirector: sheet.deliveryDirector,
        deliveryInspector: sheet.deliveryInspector,
        deliveryStatus: sheet.deliveryStatus,
        approvedAt: sheet.approvedAt?.toISOString() || null,
        approvedBy: sheet.approvedBy || null,
        issuedAt: sheet.issuedAt?.toISOString() || null,
        issuedBy: sheet.issuedBy || null,
      },
      materials: sheet.materials || [],
      milestones: sheet.milestones || [],
      qualityChecks: sheet.qualityChecks || [],
    };

    // 2. Cryptographic Canonical Snapshot Computation (SHA-256)
    const rawCanonicalJson = JSON.stringify(printData);
    const sha256Hash = crypto.createHash('sha256').update(rawCanonicalJson).digest('hex');

    const printDataWithHash = {
      ...printData,
      sha256Hash,
    };

    // 3. Generate pure HTML representation from structured data
    const html = generateTechnicalSheetHTML(printDataWithHash);

    // If caller explicitly requests raw HTML preview
    const { searchParams } = new URL(req.url);
    if (searchParams.get('format') === 'html') {
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // 4. Render PDF via Headless Chromium with hardened flags and resource safeguards
    const tempDir = os.tmpdir();
    const uniqueId = `PM_${project.slug}_${Date.now()}`;
    tempHtmlPath = path.join(tempDir, `${uniqueId}.html`);
    tempPdfPath = path.join(tempDir, `${uniqueId}.pdf`);

    await fs.promises.writeFile(tempHtmlPath, html, 'utf8');

    const chromeExecutable = resolveChromePath();

    await execFileAsync(
      chromeExecutable,
      [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--run-all-compositor-stages-before-draw',
        '--virtual-time-budget=3000',
        `--print-to-pdf=${tempPdfPath}`,
        tempHtmlPath,
      ],
      { timeout: 15000 } // 15-second safety timeout
    );

    const pdfBuffer = await fs.promises.readFile(tempPdfPath);

    // 5. Record immutable revision in TechnicalSheetRevision audit table with SHA-256 verification hash
    if (project.technicalSheet?.id) {
      await prisma.technicalSheetRevision.create({
        data: {
          technicalSheetId: project.technicalSheet.id,
          revisionNumber: sheet.revision || 'R01',
          generatedBy: authState.email || authState.userId,
          approvedBy: sheet.approvedBy || null,
          issuedBy: sheet.issuedBy || authState.email || authState.userId,
          issuedAt: sheet.issuedAt ? new Date(sheet.issuedAt) : new Date(),
          snapshotData: printData as unknown as Prisma.InputJsonValue,
          sha256Hash,
          notes: `Emisión oficial PDF (${sheet.sheetStatus || 'DRAFT'}) — Hash: ${sha256Hash.substring(0, 16)}...`,
        },
      }).catch((e) => console.warn('[PDF Route] Revision logging notice:', e));
    }

    const filename = `PM_FichaTecnica_${project.slug}_${sheet.revision || 'R01'}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    console.error('[API /api/admin/projects/[id]/pdf Error]:', error);
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error durante el renderizado del documento PDF';
    return NextResponse.json({ error: message }, { status });
  } finally {
    // Guaranteed cleanup of temp files to prevent disk leak
    if (tempHtmlPath) {
      await fs.promises.unlink(tempHtmlPath).catch(() => {});
    }
    if (tempPdfPath) {
      await fs.promises.unlink(tempPdfPath).catch(() => {});
    }
  }
}
