import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tracked = await prisma.userMovieTracking.findMany({
      where: { clerkId: userId },
      select: {
        movie: {
          select: {
            tmdbId: true
          }
        }
      }
    })

    const ids = tracked.map((entry) => entry.movie.tmdbId);

    if (ids.length === 0) {
      return NextResponse.json({ ids: [] }, { status: 204 });
    }
    
    return NextResponse.json({ ids })
  } catch (error) {
    console.error("Error fetching tracked ids:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}