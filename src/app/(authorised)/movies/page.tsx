import { List } from "@/app/components/ui";
import { fetchTMDBData } from "@/app/lib/tmdb/server/tmdb-server";

import { MovieDetails, TVDetails } from "@/app/lib/tmdb/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Movies | Pickture',
  description: 'Explore movies to watch'
}

const CATEGORIES = ["popular", "now_playing", "top_rated"] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_DISPLAY_NAMES: Record<Category, string> = {
  popular: "Popular Movies",
  now_playing: "Now Playing",
  top_rated: "Top Rated"
};

export default async function MoviesPage() {
  type TMDBResponse = { results: (MovieDetails | TVDetails)[] };

  const categoryData: Record<Category, (MovieDetails | TVDetails)[]> = Object.fromEntries(
    await Promise.all(
      CATEGORIES.map(async (category) => {
        const response = await fetchTMDBData<TMDBResponse>(`movie/${category}`);
        return [category, response.results];
      })
    )
  );

  return (
    <div className="space-y-5">
      {CATEGORIES.map((category) => (
        <section key={category} aria-labelledby={`heading-${category}`}>
          <h2 id={`heading-${category}`} className="text-2xl font-bold mb-4">{CATEGORY_DISPLAY_NAMES[category]}</h2>
          <List results={categoryData[category]} />
        </section>
      ))}
    </div>
  )
}