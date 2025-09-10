import { prisma } from "@/app/lib/prisma";
import { fetchTvShowBundle } from "@/app/lib/tmdb/server/tmdb-server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const tmdbId = body.tmdbId;

    if (!tmdbId) {
      return NextResponse.json(
        { error: "Missing TMDB ID or Media List ID" },
        { status: 400 }
      );
    }

    const { tvShow, topCast, directors, watchOptions } = await fetchTvShowBundle(tmdbId);

    // Upsert genres
    const connectOrCreateGenres = tvShow.genres.map((genre: any) => ({
      where: { tmdbId: genre.id },
      create: {
        tmdbId: genre.id,
        name: genre.name,
      },
    }));

    // Upsert tv-show
    const dbTvShow = await prisma.tvShow.upsert({
      where: { tmdbId },
      update: {},
      create: {
        tmdbId,
        name: tvShow.name,
      }
    });
  } catch (error) {}
}
