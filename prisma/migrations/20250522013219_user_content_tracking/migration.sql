-- CreateTable
CREATE TABLE "UserMovieTracking" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "watched" BOOLEAN NOT NULL DEFAULT false,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMovieTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTvShowTracking" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tvShowId" INTEGER NOT NULL,
    "watched" BOOLEAN NOT NULL DEFAULT false,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTvShowTracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMovieTracking_userId_movieId_key" ON "UserMovieTracking"("userId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTvShowTracking_userId_tvShowId_key" ON "UserTvShowTracking"("userId", "tvShowId");

-- AddForeignKey
ALTER TABLE "UserMovieTracking" ADD CONSTRAINT "UserMovieTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMovieTracking" ADD CONSTRAINT "UserMovieTracking_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTvShowTracking" ADD CONSTRAINT "UserTvShowTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTvShowTracking" ADD CONSTRAINT "UserTvShowTracking_tvShowId_fkey" FOREIGN KEY ("tvShowId") REFERENCES "TvShow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
