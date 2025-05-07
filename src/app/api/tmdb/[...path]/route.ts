import { RegionCode } from "@/app/lib/constants";
import { NextRequest, NextResponse } from "next/server";

const tmdbBaseUrl = process.env.TMDB_BASE_URL;
const tmdbApiKey = process.env.TMDB_API_READ_ACCESS_TOKEN;

const ALLOWED_ENDPOINTS = [
  "movie",
  "tv",
  "search/movie",
  "search/tv",
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!tmdbBaseUrl || !tmdbApiKey) {
    console.error("Missing TMDB credentials in environment");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const { path } = await params;
    const endpoint = path.join("/");

    const region: RegionCode =
      (searchParams.get("region") as RegionCode) ||
      (request.cookies.get("pickture-region")?.value as RegionCode) ||
      (process.env.DEFAULT_REGION as RegionCode) ||
      "US";

    const isAllowed = ALLOWED_ENDPOINTS.some(
      (allowed) => endpoint === allowed || endpoint.startsWith(`${allowed}/`)
    );

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Endpoint not allowed" },
        { status: 403 }
      );
    }

    const apiParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== "region") {
        apiParams.append(key, value);
      }
    });
    apiParams.append("region", region);

    const url = new URL(`${tmdbBaseUrl}/${endpoint}`);
    url.search = apiParams.toString();

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${tmdbApiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from TMDB" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
