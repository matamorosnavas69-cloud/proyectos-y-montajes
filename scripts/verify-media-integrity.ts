import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

interface ScanReport {
  scannedComponents: number;
  hardcodedReferences: {
    total: number;
    valid: number;
    broken: { file: string; url: string; reason: string }[];
  };
  galleryIntegrity: {
    service: string;
    totalAssets: number;
    gitTracked: number;
    missingInGit: string[];
    brokenOnDisk: string[];
  }[];
}

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

function getAllSourceFiles(dir: string, list: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '.next') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllSourceFiles(full, list);
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      list.push(full);
    }
  }
  return list;
}

function getGitTrackedFiles(): Set<string> {
  try {
    const raw = execSync('git ls-files "public/images/**"', { cwd: ROOT, encoding: 'utf8' });
    return new Set(raw.trim().split('\n').filter(Boolean));
  } catch {
    return new Set();
  }
}

export async function runMediaIntegrityCheck(): Promise<ScanReport> {
  const gitTracked = getGitTrackedFiles();
  const sourceFiles = getAllSourceFiles(path.join(ROOT, 'app'));
  const imageRegex = /["\x27](\/images\/[^"\x27]+\.(?:jpg|jpeg|png|webp|gif|svg|JPG|JPEG|PNG))["\x27]/g;

  const hardcodedBroken: { file: string; url: string; reason: string }[] = [];
  let totalHardcoded = 0;
  let validHardcoded = 0;

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    let match: RegExpExecArray | null;
    while ((match = imageRegex.exec(content)) !== null) {
      totalHardcoded++;
      const rawUrl = match[1];
      const decoded = decodeURIComponent(rawUrl);
      const diskPath = path.join(PUBLIC_DIR, decoded.replace(/^\//, ''));
      const relativeGitPath = path.join('public', decoded.replace(/^\//, ''));

      if (!fs.existsSync(diskPath)) {
        hardcodedBroken.push({
          file: path.relative(ROOT, file),
          url: rawUrl,
          reason: 'File does not exist on disk',
        });
      } else if (gitTracked.size > 0 && !gitTracked.has(relativeGitPath)) {
        hardcodedBroken.push({
          file: path.relative(ROOT, file),
          url: rawUrl,
          reason: 'File exists on disk but is NOT tracked by Git (will 404 in production)',
        });
      } else {
        validHardcoded++;
      }
    }
  }

  // Check the three service galleries
  const services = ['canchas', 'parques', 'paisajismo'];
  const galleryIntegrity: ScanReport['galleryIntegrity'] = [];

  for (const s of services) {
    try {
      const { listServiceAssets } = await import('../lib/media-library');
      const data = await listServiceAssets(s as any);
      const assets = data.assets || [];

      const missingInGit: string[] = [];
      const brokenOnDisk: string[] = [];

      for (const a of assets) {
        const decoded = decodeURIComponent(a.url).replace(/^\//, '');
        const diskPath = path.join(PUBLIC_DIR, decoded);
        const relativeGit = path.join('public', decoded);

        if (!fs.existsSync(diskPath)) {
          brokenOnDisk.push(a.url);
        } else if (gitTracked.size > 0 && !gitTracked.has(relativeGit)) {
          missingInGit.push(a.url);
        }
      }

      galleryIntegrity.push({
        service: s,
        totalAssets: assets.length,
        gitTracked: assets.length - missingInGit.length,
        missingInGit,
        brokenOnDisk,
      });
    } catch (err) {
      console.error(`Failed to audit service gallery for ${s}:`, err);
    }
  }

  return {
    scannedComponents: sourceFiles.length,
    hardcodedReferences: {
      total: totalHardcoded,
      valid: validHardcoded,
      broken: hardcodedBroken,
    },
    galleryIntegrity,
  };
}

if (require.main === module) {
  runMediaIntegrityCheck().then((report) => {
    console.log('\n========================================');
    console.log('  MEDIA INTEGRITY RECOVERY REPORT');
    console.log('========================================');
    console.log(`Scanned source files: ${report.scannedComponents}`);
    console.log(`Hardcoded image references: ${report.hardcodedReferences.total}`);
    console.log(`  - Valid & deployable: ${report.hardcodedReferences.valid}`);
    console.log(`  - Broken: ${report.hardcodedReferences.broken.length}`);

    if (report.hardcodedReferences.broken.length > 0) {
      console.log('\nBroken references found:');
      for (const b of report.hardcodedReferences.broken) {
        console.log(`  [!] ${b.file}: ${b.url} -> ${b.reason}`);
      }
    }

    console.log('\nGallery Services Audit (Deployable Assets):');
    for (const g of report.galleryIntegrity) {
      console.log(`  * ${g.service.toUpperCase()}: ${g.totalAssets} total, ${g.gitTracked} tracked in Git, ${g.brokenOnDisk.length} broken on disk`);
      if (g.missingInGit.length > 0) {
        console.log(`    Warning: ${g.missingInGit.length} assets untracked by Git (sample: ${g.missingInGit.slice(0, 3).join(', ')})`);
      }
    }
    console.log('========================================\n');
  });
}
