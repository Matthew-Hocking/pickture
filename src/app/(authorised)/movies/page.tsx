import { MoviesPage } from "@/app/components/pages";
import { fetchTMDBData } from "@/app/lib/tmdb/server/tmdb-server";
import { MovieDetails } from "@/app/lib/tmdb/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Movies | Pickture',
  description: 'Explore movies to watch'
}

const CATEGORIES = ["popular", "now_playing", "top_rated"] as const;
type Category = typeof CATEGORIES[number];

export default async function Page() {
  type TMDBResponse = { results: MovieDetails[] };

  const categoryData: Record<Category, MovieDetails[]> = Object.fromEntries(
    await Promise.all(
      CATEGORIES.map(async (category) => {
        const response = await fetchTMDBData<TMDBResponse>(`movie/${category}`);
        return [category, response.results];
      })
    )
  );

  return <MoviesPage categoryData={categoryData} />;
}