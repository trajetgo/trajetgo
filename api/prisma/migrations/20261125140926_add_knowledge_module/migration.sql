-- CreateEnum
CREATE TYPE "ExternalEntityType" AS ENUM ('COMPANY', 'COUNTRY', 'REGION', 'CITY', 'AGENCY', 'BUS', 'SEAT', 'DRIVER', 'ROUTE', 'SCHEDULE', 'SCHEDULE_DEPARTURE', 'USER');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "scheduleDepartureId" TEXT;

-- CreateTable
CREATE TABLE "external_references" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'TGTL',
    "entityType" "ExternalEntityType" NOT NULL,
    "externalId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "external_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_articles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "categoryId" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "notHelpful" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_search_logs" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "results" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_search_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "external_references_companyId_entityType_entityId_idx" ON "external_references"("companyId", "entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "external_references_companyId_source_entityType_externalId_key" ON "external_references"("companyId", "source", "entityType", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "external_references_companyId_source_entityType_entityId_key" ON "external_references"("companyId", "source", "entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_categories_slug_key" ON "knowledge_categories"("slug");

-- CreateIndex
CREATE INDEX "knowledge_categories_slug_idx" ON "knowledge_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_articles_slug_key" ON "knowledge_articles"("slug");

-- CreateIndex
CREATE INDEX "knowledge_articles_slug_idx" ON "knowledge_articles"("slug");

-- CreateIndex
CREATE INDEX "knowledge_articles_categoryId_idx" ON "knowledge_articles"("categoryId");

-- CreateIndex
CREATE INDEX "knowledge_articles_status_idx" ON "knowledge_articles"("status");

-- CreateIndex
CREATE INDEX "knowledge_articles_publishedAt_idx" ON "knowledge_articles"("publishedAt");

-- CreateIndex
CREATE INDEX "knowledge_search_logs_query_idx" ON "knowledge_search_logs"("query");

-- CreateIndex
CREATE INDEX "knowledge_search_logs_createdAt_idx" ON "knowledge_search_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_scheduleDepartureId_fkey" FOREIGN KEY ("scheduleDepartureId") REFERENCES "schedule_departures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_references" ADD CONSTRAINT "external_references_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_articles" ADD CONSTRAINT "knowledge_articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "knowledge_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_articles" ADD CONSTRAINT "knowledge_articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
