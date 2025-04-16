import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const region = searchParams.get("region");

  if (!type || !category || !region) {
    return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
  }
  
  const tmdbBaseUrl = process.env.TMDB_BASE_URL;
  const tmdbApiKey = process.env.TMDB_API_READ_ACCESS_TOKEN;

  if (!tmdbBaseUrl || !tmdbApiKey) {
    return NextResponse.json({ error: "TMDB credentials missing in env vars" }, { status: 500 });
  }

  let tmdbUrl: string

  if (type === "movie") {
    tmdbUrl = `${tmdbBaseUrl}/${type}/${category}?region=${region}&language=en-US`;
  } else if (type === "tv") {
    tmdbUrl = `${tmdbBaseUrl}/tv/${category}?language=en-US`;
  } else {
    return NextResponse.json({ error: "Invalid media type" }, { status: 400 });
  }

  try {
    const res = await fetch(tmdbUrl, {
      headers: {
        Authorization: `Bearer ${tmdbApiKey}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 86400 }
    })
  
    if (!res.ok) {
      return NextResponse.json({
        error: `TMDB API responded with status ${res.status}`,
        details: await res.text()
      }, { status: res.status });
    }
  
    const data = await res.json();
  
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
  }
}
