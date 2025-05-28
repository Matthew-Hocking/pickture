/*
  Warnings:

  - Changed the type of `tmdbId` on the `Movie` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "tmdbId",
ADD COLUMN     "tmdbId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Movie_tmdbId_key" ON "Movie"("tmdbId");
