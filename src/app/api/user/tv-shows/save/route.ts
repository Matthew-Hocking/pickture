import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function Post(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const tmdbId = body.tmdbId;

    if (!tmdbId) {
      return NextResponse.json({ error: "Missing TMDB ID or Media List ID" }, { status: 400 });
    }
  } catch (error) {
    
  }

} 