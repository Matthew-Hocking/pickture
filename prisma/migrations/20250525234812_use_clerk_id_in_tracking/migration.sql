/*
  Warnings:

  - You are about to drop the column `userId` on the `UserMovieTracking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkId,movieId]` on the table `UserMovieTracking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `UserMovieTracking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserMovieTracking" DROP CONSTRAINT "UserMovieTracking_userId_fkey";

-- DropIndex
DROP INDEX "UserMovieTracking_userId_idx";

-- DropIndex
DROP INDEX "UserMovieTracking_userId_movieId_key";

-- AlterTable
ALTER TABLE "UserMovieTracking" DROP COLUMN "userId",
ADD COLUMN     "clerkId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "UserMovieTracking_clerkId_idx" ON "UserMovieTracking"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMovieTracking_clerkId_movieId_key" ON "UserMovieTracking"("clerkId", "movieId");

-- AddForeignKey
ALTER TABLE "UserMovieTracking" ADD CONSTRAINT "UserMovieTracking_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;
