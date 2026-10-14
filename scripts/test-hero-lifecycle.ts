import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

import { prisma } from '../lib/prisma';
import {
  ensureDefaultSlidesSeeded,
  getPublishedHeroSlides,
  getAdminHeroSlides,
  saveAdminHeroSlides,
  checkAssetActiveInHeroes,
  DEFAULT_HERO_SLIDES,
  ServiceKey,
} from '../lib/hero-management';
import { archiveLibraryAsset, restoreLibraryAsset } from '../lib/media-library';

async function runHeroLifecycleTests() {
  console.log('====================================================');
  console.log('🧪 ANTIGRAVITY — SERVICE HERO CMS LIFECYCLE TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}${detail ? ` (${detail})` : ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` — ${detail}` : ''}`);
      throw new Error(`Assertion failed: ${testName}`);
    }
  }

  try {
    // 0. Initial Seeding Check
    console.log('--- Step 0: Ensure Default Seeding ---');
    await ensureDefaultSlidesSeeded('canchas');
    await ensureDefaultSlidesSeeded('parques');
    await ensureDefaultSlidesSeeded('paisajismo');

    const initialCanchas = await getAdminHeroSlides('canchas');
    assert(initialCanchas.length === 4, 'Initial Seeding Canchas', `${initialCanchas.length} slides seeded`);
    const initialParques = await getAdminHeroSlides('parques');
    assert(initialParques.length === 4, 'Initial Seeding Parques', `${initialParques.length} slides seeded`);
    const initialPaisajismo = await getAdminHeroSlides('paisajismo');
    assert(initialPaisajismo.length === 4, 'Initial Seeding Paisajismo', `${initialPaisajismo.length} slides seeded`);

    // Backup current state to restore at end of tests
    const backupPaisajismo = JSON.parse(JSON.stringify(initialPaisajismo));

    // Case A: Add slide
    console.log('\n--- Case A: Add new slide to Paisajismo ---');
    const newSlidePayload = [
      ...initialPaisajismo.map((s, idx) => ({
        src: s.src,
        alt: s.alt,
        title: s.title,
        location: s.location,
        tag: s.tag,
        focalX: s.focalX,
        focalY: s.focalY,
        sortOrder: idx,
        isActive: s.isActive,
      })),
      {
        src: '/images/drive organice/residencial/IMG_0040.JPEG',
        alt: 'Terraza campestre adicional de alta fidelidad',
        title: 'Terraza Campestre Panorámica',
        location: 'La Calera',
        tag: 'Terraza & Sol',
        focalX: 60,
        focalY: 40,
        sortOrder: initialPaisajismo.length,
        isActive: true,
      },
    ];

    await saveAdminHeroSlides('paisajismo', newSlidePayload, 'qa-test@proyectosymontajes.com');
    const afterAdd = await getAdminHeroSlides('paisajismo');
    assert(afterAdd.length === 5, 'Case A: Add Slide', 'Slide count increased from 4 to 5');
    assert(afterAdd[4].title === 'Terraza Campestre Panorámica', 'Case A: Title Persisted', afterAdd[4].title);
    assert(afterAdd[4].focalX === 60 && afterAdd[4].focalY === 40, 'Case A: Focal Point Persisted', 'X:60 Y:40');

    // Case B: Reorder slides
    console.log('\n--- Case B: Reorder slides ---');
    // Move the newly added 5th slide to position 0 (first slide)
    const reorderedPayload = [
      afterAdd[4],
      afterAdd[0],
      afterAdd[1],
      afterAdd[2],
      afterAdd[3],
    ].map((s, idx) => ({
      src: s.src,
      alt: s.alt,
      title: s.title,
      location: s.location,
      tag: s.tag,
      focalX: s.focalX,
      focalY: s.focalY,
      sortOrder: idx,
      isActive: s.isActive,
    }));

    await saveAdminHeroSlides('paisajismo', reorderedPayload, 'qa-test@proyectosymontajes.com');
    const afterReorder = await getAdminHeroSlides('paisajismo');
    assert(afterReorder[0].title === 'Terraza Campestre Panorámica', 'Case B: Reorder', 'New slide moved to position 0');
    assert(afterReorder[1].src === initialPaisajismo[0].src, 'Case B: Second position', 'Original slide preserved at index 1');

    // Case C: Replace slide image
    console.log('\n--- Case C: Replace slide image ---');
    const verifiedImage = '/images/drive organice/piscina/IMG_0557.JPG';
    const replacedPayload = afterReorder.map((s, idx) => {
      if (idx === 1) {
        return {
          ...s,
          src: verifiedImage,
          alt: 'Nueva piscina atérmica verificada y reemplazada',
          title: 'Piscina Verificada',
        };
      }
      return s;
    });

    await saveAdminHeroSlides('paisajismo', replacedPayload, 'qa-test@proyectosymontajes.com');
    const afterReplace = await getAdminHeroSlides('paisajismo');
    assert(afterReplace[1].src === verifiedImage, 'Case C: Genuine verified image replaced', afterReplace[1].src);

    // Case D: Deactivate slide
    console.log('\n--- Case D: Deactivate slide ---');
    const deactivatedPayload = afterReplace.map((s, idx) => (idx === 0 ? { ...s, isActive: false } : s));
    await saveAdminHeroSlides('paisajismo', deactivatedPayload, 'qa-test@proyectosymontajes.com');

    const adminCheck = await getAdminHeroSlides('paisajismo');
    assert(adminCheck[0].isActive === false, 'Case D: Slide marked inactive in admin');

    const publicCheckD = await getPublishedHeroSlides('paisajismo');
    assert(publicCheckD.length === 4, 'Case D: Public excludes inactive slide', `Public count: ${publicCheckD.length} of 5 total`);
    assert(publicCheckD[0].title !== 'Terraza Campestre Panorámica', 'Case D: Deactivated slide not first in public');

    // Case E: Reactivate slide
    console.log('\n--- Case E: Reactivate slide ---');
    const reactivatedPayload = adminCheck.map((s, idx) => (idx === 0 ? { ...s, isActive: true } : s));
    await saveAdminHeroSlides('paisajismo', reactivatedPayload, 'qa-test@proyectosymontajes.com');

    const publicCheckE = await getPublishedHeroSlides('paisajismo');
    assert(publicCheckE.length === 5, 'Case E: Reactivated slide in public', `Public count: ${publicCheckE.length}`);
    assert(publicCheckE[0].title === 'Terraza Campestre Panorámica', 'Case E: Slide 0 restored in public');

    // Case F: Archival protection for active hero assets
    console.log('\n--- Case F: Archival Protection Rule ---');
    // Try to archive an asset that is currently active in Canchas hero:
    // Canchas hero has: 7ad44112-8715-477f-a253-8cd0c796ba8b.jpg
    const activeFilename = '7ad44112-8715-477f-a253-8cd0c796ba8b.jpg';
    let caughtExpectedError = false;
    try {
      await archiveLibraryAsset('canchas', activeFilename, 'qa-test@proyectosymontajes.com');
    } catch (err: any) {
      caughtExpectedError = true;
      assert(
        err.message.includes('porque está activa en el Hero'),
        'Case F: Active asset blocked from archival',
        err.message
      );
    }
    assert(caughtExpectedError, 'Case F: Archival guard successfully triggered');

    // Case G: Cloud asset support
    console.log('\n--- Case G: Cloud Supabase Storage URL support ---');
    const cloudSlidePayload = [
      ...reactivatedPayload.slice(0, 4),
      {
        src: 'https://vkqyisrjpxzflleqiydx.supabase.co/storage/v1/object/public/project-images/gallery/canchas/hero-sample.webp',
        alt: 'Obra en almacenamiento Supabase Cloud',
        title: 'Proyecto Cloud Storage',
        location: 'Medellín',
        tag: 'Padel Pro',
        focalX: 50,
        focalY: 50,
        sortOrder: 4,
        isActive: true,
      },
    ];
    await saveAdminHeroSlides('paisajismo', cloudSlidePayload, 'qa-test@proyectosymontajes.com');
    const afterCloud = await getAdminHeroSlides('paisajismo');
    assert(afterCloud[4].mediaSource === 'SUPABASE', 'Case G: mediaSource detected as SUPABASE', afterCloud[4].src);

    // Case H: Integrity & Validation Guard
    console.log('\n--- Case H: Validation Guard ---');
    let validationFailed = false;
    try {
      // Attempt to save 0 slides (invalid state)
      await saveAdminHeroSlides('paisajismo', [], 'attacker@test.com');
    } catch (err: any) {
      validationFailed = true;
      assert(err.message.includes('al menos una diapositiva'), 'Case H: Empty slides payload rejected');
    }
    assert(validationFailed, 'Case H: Empty payload guard verified');

    let allInactiveFailed = false;
    try {
      // Attempt to save all slides as inactive
      const allInactive = cloudSlidePayload.map((s) => ({ ...s, isActive: false }));
      await saveAdminHeroSlides('paisajismo', allInactive, 'attacker@test.com');
    } catch (err: any) {
      allInactiveFailed = true;
      assert(err.message.includes('al menos una diapositiva activa'), 'Case H: All-inactive payload rejected');
    }
    assert(allInactiveFailed, 'Case H: All-inactive guard verified');

    // Case H3: Reject non-existent local file
    let nonExistentFailed = false;
    try {
      const nonExistentPayload = [
        {
          src: '/images/drive organice/piscina/IMG_0062.JPG', // Broken non-existent image
          alt: 'Foto rota',
          title: 'Foto inexistente',
          sortOrder: 0,
          isActive: true,
        },
      ];
      await saveAdminHeroSlides('paisajismo', nonExistentPayload, 'qa-test@proyectosymontajes.com');
    } catch (err: any) {
      nonExistentFailed = true;
      assert(
        err.message.includes('no existe físicamente'),
        'Case H3: Non-existent local image rejected',
        err.message
      );
    }
    assert(nonExistentFailed, 'Case H3: Non-existent image guard verified');

    // Case H4: Reject incompatible video format (.mp4)
    let videoFailed = false;
    try {
      const videoPayload = [
        {
          src: '/images/drive organice/piscina/d5f0bddd-9ca0-4966-94b1-246f21ad5175.MP4',
          alt: 'Video no permitido',
          title: 'Video',
          sortOrder: 0,
          isActive: true,
        },
      ];
      await saveAdminHeroSlides('paisajismo', videoPayload, 'qa-test@proyectosymontajes.com');
    } catch (err: any) {
      videoFailed = true;
      assert(
        err.message.includes('Formato multimedia incompatible'),
        'Case H4: Video asset rejected from slider',
        err.message
      );
    }
    assert(videoFailed, 'Case H4: Video format guard verified');

    // Case H5: Reject archived asset (containing /.archive/)
    let archiveFailed = false;
    try {
      const archivedPayload = [
        {
          src: '/images/drive organice/.archive/canchas/foto-archivada.jpg',
          alt: 'Archivada',
          title: 'Archivada',
          sortOrder: 0,
          isActive: true,
        },
      ];
      await saveAdminHeroSlides('paisajismo', archivedPayload, 'qa-test@proyectosymontajes.com');
    } catch (err: any) {
      archiveFailed = true;
      assert(
        err.message.includes('se encuentra archivado'),
        'Case H5: Archived asset rejected from publication',
        err.message
      );
    }
    assert(archiveFailed, 'Case H5: Archived asset guard verified');

    // Case H6: Reject unauthorized external URL
    let domainFailed = false;
    try {
      const untrustedPayload = [
        {
          src: 'https://unauthorized-cdn.com/malicious-photo.jpg',
          alt: 'No confiable',
          title: 'No confiable',
          sortOrder: 0,
          isActive: true,
        },
      ];
      await saveAdminHeroSlides('paisajismo', untrustedPayload, 'qa-test@proyectosymontajes.com');
    } catch (err: any) {
      domainFailed = true;
      assert(
        err.message.includes('Dominio externo no autorizado'),
        'Case H6: Untrusted domain rejected',
        err.message
      );
    }
    assert(domainFailed, 'Case H6: Untrusted domain guard verified');

    // Case I: Public dynamic rendering & cache revalidation
    console.log('\n--- Case I: Public dynamic rendering ---');
    const publicPublished = await getPublishedHeroSlides('paisajismo');
    assert(publicPublished.length >= 4, 'Case I: Public delivery successful', `${publicPublished.length} slides returned`);

    // Restore Paisajismo to clean initial state
    console.log('\n--- Cleanup: Restoring original state ---');
    await saveAdminHeroSlides(
      'paisajismo',
      backupPaisajismo.map((s: any, idx: number) => ({
        src: s.src,
        alt: s.alt,
        title: s.title,
        location: s.location,
        tag: s.tag,
        focalX: s.focalX,
        focalY: s.focalY,
        sortOrder: idx,
        isActive: s.isActive,
      })),
      'qa-test@proyectosymontajes.com'
    );
    const restored = await getAdminHeroSlides('paisajismo');
    assert(restored.length === 4, 'Cleanup: Restored to 4 slides', 'State clean');

    console.log('\n====================================================');
    console.log(`🎉 ALL ${passed}/${total} HERO CMS LIFECYCLE TESTS PASSED!`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED:', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runHeroLifecycleTests();
