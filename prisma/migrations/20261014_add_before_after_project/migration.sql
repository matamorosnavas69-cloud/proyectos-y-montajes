-- CreateTable
CREATE TABLE "proyectos_y_montajes"."BeforeAfterProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "categoryColor" TEXT NOT NULL DEFAULT 'bg-brand-green',
    "beforeImage" TEXT NOT NULL,
    "afterImage" TEXT NOT NULL,
    "area" TEXT,
    "duration" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BeforeAfterProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BeforeAfterProject_isActive_sortOrder_idx" ON "proyectos_y_montajes"."BeforeAfterProject"("isActive", "sortOrder");
