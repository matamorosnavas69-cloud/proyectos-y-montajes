-- CreateTable: Add ServiceHeroSlide for Visual Hero CMS (Additive, idempotent)
CREATE TABLE IF NOT EXISTS "proyectos_y_montajes"."ServiceHeroSlide" (
    "id" TEXT NOT NULL,
    "serviceSlug" TEXT NOT NULL,
    "section" TEXT NOT NULL DEFAULT 'hero',
    "assetId" TEXT,
    "mediaSource" TEXT NOT NULL DEFAULT 'LOCAL',
    "src" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "tag" TEXT,
    "focalX" INTEGER NOT NULL DEFAULT 50,
    "focalY" INTEGER NOT NULL DEFAULT 50,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceHeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ServiceHeroSlide_serviceSlug_section_isActive_sortOrder_idx" 
ON "proyectos_y_montajes"."ServiceHeroSlide"("serviceSlug", "section", "isActive", "sortOrder");
