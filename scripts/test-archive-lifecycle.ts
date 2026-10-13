import { archiveLibraryAsset, restoreLibraryAsset, listCategoryAssets, listArchivedLibraryAssets } from '../lib/media-library';

async function main() {
  console.log('Testing serverless-safe media archive lifecycle...');

  const category = 'canchas';
  const initial = await listCategoryAssets(category);
  console.log(`Initial active canchas assets: ${initial.length}`);

  if (initial.length === 0) {
    throw new Error('No assets found in canchas category to test.');
  }

  const testAsset = initial[0];
  console.log(`Target asset to archive: ${testAsset.filename}`);

  // 1. Archive
  await archiveLibraryAsset(category, testAsset.filename, 'test-suite@proyectosymontajes.com');
  console.log(`Archived ${testAsset.filename}`);

  const afterArchive = await listCategoryAssets(category);
  console.log(`Active canchas assets after archive: ${afterArchive.length}`);

  const existsInActive = afterArchive.some((a) => a.filename === testAsset.filename);
  if (existsInActive) {
    throw new Error(`FAIL: ${testAsset.filename} still appears in active assets!`);
  }

  const archivedList = await listArchivedLibraryAssets(category);
  const existsInArchived = archivedList.some((a) => a.filename === testAsset.filename);
  if (!existsInArchived) {
    throw new Error(`FAIL: ${testAsset.filename} does not appear in archived assets registry!`);
  }
  console.log(`Verified: Asset successfully excluded from active and registered in archive list.`);

  // 2. Restore
  await restoreLibraryAsset(category, testAsset.filename);
  console.log(`Restored ${testAsset.filename}`);

  const afterRestore = await listCategoryAssets(category);
  const restoredInActive = afterRestore.some((a) => a.filename === testAsset.filename);
  if (!restoredInActive) {
    throw new Error(`FAIL: ${testAsset.filename} did not return to active assets after restore!`);
  }

  console.log(`SUCCESS: Full archive and restore lifecycle verified without filesystem dependence!`);
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
