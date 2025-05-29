import { prisma } from "@/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const tmdbId = body.tmdbId;

    if (isNaN(tmdbId)) {
      return NextResponse.json({ error: "Invalid tmdbId" }, { status: 400 });
    }

    const movie = await prisma.movie.findUnique({
      where: { tmdbId },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    await prisma.userMovieTracking.delete({
      where: {
        clerkId_movieId: {
          clerkId: userId,
          movieId: movie.id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tracked movie:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}