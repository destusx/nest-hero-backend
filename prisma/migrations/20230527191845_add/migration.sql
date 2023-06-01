/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `heroes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "heroes_slug_key" ON "heroes"("slug");
