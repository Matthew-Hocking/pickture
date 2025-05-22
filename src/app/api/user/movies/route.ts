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
    const { tmdbId } = body;

    if (!tmdbId) {
      return NextResponse.json({ error: "Missing TMDB ID" }, { status: 400 });
    }

    const { movie } = await fetchMovieBundle(tmdbId)

    // 3. Upsert movie in DB
    const tmdbMovie = await prisma.movie.upsert({
      where: { tmdbId },
      create: {
        tmdbId,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        genres: {
          connectOrCreate: movie.genres.map((genre: any) => ({
            where: { tmdbId: genre.id },
            create: {
              tmdbId: genre.id,
              name: genre.name,
            },
          })),
        },
      },
    });

    // 4. Connect movie to user
    await prisma.userMovie.create({
      data: {
        userId,
        movieId: movie.id,
      },
    });

    return NextResponse.json({ success: true, movieId: movie.id });
  } catch (err) {
    console.error("Error saving movie:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}