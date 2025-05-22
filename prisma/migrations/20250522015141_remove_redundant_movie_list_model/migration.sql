/*
  Warnings:

  - You are about to drop the column `mediaListId` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `mediaListId` on the `TvShow` table. All the data in the column will be lost.
  - You are about to drop the `MediaList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MediaList" DROP CONSTRAINT "MediaList_userId_fkey";

-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_mediaListId_fkey";

-- DropForeignKey
ALTER TABLE "TvShow" DROP CONSTRAINT "TvShow_mediaListId_fkey";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "mediaListId";

-- AlterTable
ALTER TABLE "TvShow" DROP COLUMN "mediaListId";

-- DropTable
DROP TABLE "MediaList";

-- CreateIndex
CREATE INDEX "UserMovieTracking_userId_idx" ON "UserMovieTracking"("userId");

-- CreateIndex
CREATE INDEX "UserTvShowTracking_userId_idx" ON "UserTvShowTracking"("userId");
