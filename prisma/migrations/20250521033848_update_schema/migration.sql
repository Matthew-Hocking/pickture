/*
  Warnings:

  - You are about to drop the column `movieListId` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the `MovieList` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imdbId` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaListId` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseDate` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `runtime` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voteAverage` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voteCount` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OfferType" AS ENUM ('Stream', 'Rent', 'Buy');

-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_movieListId_fkey";

-- DropForeignKey
ALTER TABLE "MovieList" DROP CONSTRAINT "MovieList_userId_fkey";

-- DropIndex
DROP INDEX "User_clerkId_idx";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "movieListId",
ADD COLUMN     "imdbId" TEXT NOT NULL,
ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "mediaListId" INTEGER NOT NULL,
ADD COLUMN     "overview" TEXT,
ADD COLUMN     "posterPath" TEXT,
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "runtime" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "voteAverage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "voteCount" INTEGER NOT NULL;

-- DropTable
DROP TABLE "MovieList";

-- CreateTable
CREATE TABLE "MediaList" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TvShow" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tmdbId" TEXT NOT NULL,
    "mediaListId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastSyncedAt" TIMESTAMP(3),

    CONSTRAINT "TvShow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieCastMember" (
    "movieId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "character" TEXT NOT NULL,
    "profilePath" TEXT,

    CONSTRAINT "MovieCastMember_pkey" PRIMARY KEY ("movieId","name")
);

-- CreateTable
CREATE TABLE "TvShowCastMember" (
    "tvShowId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "character" TEXT NOT NULL,
    "profilePath" TEXT,

    CONSTRAINT "TvShowCastMember_pkey" PRIMARY KEY ("tvShowId","name")
);

-- CreateTable
CREATE TABLE "MovieCrewMember" (
    "creditId" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profilePath" TEXT,
    "movieId" INTEGER NOT NULL,

    CONSTRAINT "MovieCrewMember_pkey" PRIMARY KEY ("creditId")
);

-- CreateTable
CREATE TABLE "TvShowCrewMember" (
    "creditId" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profilePath" TEXT,
    "tvShowId" INTEGER NOT NULL,

    CONSTRAINT "TvShowCrewMember_pkey" PRIMARY KEY ("creditId")
);

-- CreateTable
CREATE TABLE "WatchProvider" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "logoPath" TEXT NOT NULL,

    CONSTRAINT "WatchProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieWatchProvider" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "offers" "OfferType"[],

    CONSTRAINT "MovieWatchProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TvShowWatchProvider" (
    "id" SERIAL NOT NULL,
    "tvShowId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "offers" "OfferType"[],

    CONSTRAINT "TvShowWatchProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MovieGenres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MovieGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TvShowGenres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TvShowGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "TvShow_tmdbId_key" ON "TvShow"("tmdbId");

-- CreateIndex
CREATE INDEX "_MovieGenres_B_index" ON "_MovieGenres"("B");

-- CreateIndex
CREATE INDEX "_TvShowGenres_B_index" ON "_TvShowGenres"("B");

-- AddForeignKey
ALTER TABLE "MediaList" ADD CONSTRAINT "MediaList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_mediaListId_fkey" FOREIGN KEY ("mediaListId") REFERENCES "MediaList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TvShow" ADD CONSTRAINT "TvShow_mediaListId_fkey" FOREIGN KEY ("mediaListId") REFERENCES "MediaList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCastMember" ADD CONSTRAINT "MovieCastMember_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TvShowCastMember" ADD CONSTRAINT "TvShowCastMember_tvShowId_fkey" FOREIGN KEY ("tvShowId") REFERENCES "TvShow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCrewMember" ADD CONSTRAINT "MovieCrewMember_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TvShowCrewMember" ADD CONSTRAINT "TvShowCrewMember_tvShowId_fkey" FOREIGN KEY ("tvShowId") REFERENCES "TvShow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieWatchProvider" ADD CONSTRAINT "MovieWatchProvider_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieWatchProvider" ADD CONSTRAINT "MovieWatchProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "WatchProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TvShowWatchProvider" ADD CONSTRAINT "TvShowWatchProvider_tvShowId_fkey" FOREIGN KEY ("tvShowId") REFERENCES "TvShow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TvShowWatchProvider" ADD CONSTRAINT "TvShowWatchProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "WatchProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieGenres" ADD CONSTRAINT "_MovieGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieGenres" ADD CONSTRAINT "_MovieGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TvShowGenres" ADD CONSTRAINT "_TvShowGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TvShowGenres" ADD CONSTRAINT "_TvShowGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "TvShow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
