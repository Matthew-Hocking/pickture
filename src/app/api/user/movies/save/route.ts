import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { fetchMovieBundle } from "@/app/lib/tmdb/server/tmdb-server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const tmdbId = body.tmdbId;

    if (!tmdbId) {
      return NextResponse.json({ error: "Missing TMDB ID or Media List ID" }, { status: 400 });
    }

    const { movie, topCast, directors, watchOptions } = await fetchMovieBundle(tmdbId);

    // Upsert genres
    const connectOrCreateGenres = movie.genres.map((genre: any) => ({
      where: { tmdbId: genre.id },
      create: {
        tmdbId: genre.id,
        name: genre.name,
      },
    }));

    // Upsert movie
    const dbMovie = await prisma.movie.upsert({
      where: { tmdbId },
      update: {}, // optionally add updates here
      create: {
        tmdbId,
        title: movie.title,
        imdbId: movie.imdb_id,
        overview: movie.overview,
        posterPath: movie.poster_path,
        releaseDate: new Date(movie.release_date),
        runtime: movie.runtime,
        status: movie.status,
        tagline: movie.tagline,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        genres: {
          connectOrCreate: connectOrCreateGenres,
        },
      },
    });

    // Connect cast members
    await prisma.movieCastMember.deleteMany({
      where: {
        movieId: dbMovie.id
      }
    })

    if (topCast?.length) {
      await prisma.movieCastMember.createMany({
        data: topCast.map((member: any) => ({
          movieId: dbMovie.id,
          name: member.name,
          character: member.character,
          profilePath: member.profile_path
        })),
        skipDuplicates: true
      })
    }

    // Connect directors
    await prisma.movieCrewMember.deleteMany({
      where: {
        movieId: dbMovie.id
      }
    })

    if (directors?.length) {
      await prisma.movieCrewMember.createMany({
        data: directors.map((director) => ({
          creditId: director.credit_id,
          movieId: dbMovie.id,
          name: director.name,
          job: director.job,
          profilePath: director.profile_path
        })),
        skipDuplicates: true
      })
    }

    // Connect watch providers
    if (watchOptions?.length) {
      await Promise.all(
        watchOptions.map((option) =>
          prisma.watchProvider.upsert({
            where: { id: option.provider_id },
            update: {
              name: option.provider_name,
              logoPath: option.logo_path,
            },
            create: {
              id: option.provider_id,
              name: option.provider_name,
              logoPath: option.logo_path,
            },
          })
        )
      );

      await prisma.movieWatchProvider.deleteMany({
        where: { movieId: dbMovie.id },
      });

      await Promise.all(
        watchOptions.map((option) =>
          prisma.movieWatchProvider.create({
            data: {
              movieId: dbMovie.id,
              providerId: option.provider_id,
              link: option.link,
              offers: option.offers,
            },
          })
        )
      );
    }

    // Connect movie to user's tracking
    await prisma.userMovieTracking.upsert({
      where: {
        clerkId_movieId: {
          clerkId: userId,
          movieId: dbMovie.id,
        },
      },
      create: {
        clerkId: userId,
        movieId: dbMovie.id,
        watched: false,
        liked: false,
        addedAt: new Date()
      },
      update: {},
    });

    return NextResponse.json({ success: true, movieId: dbMovie.id });
  } catch (err) {
    console.error("Error saving movie:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}