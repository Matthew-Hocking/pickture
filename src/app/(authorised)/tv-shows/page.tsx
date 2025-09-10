import { TvShowsPage } from "@/app/components/pages";
import { fetchTMDBData } from "@/app/lib/tmdb/server/tmdb-server";
import { TVDetails } from "@/app/lib/tmdb/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Tv Shows | Pickture',
  description: 'Explore shows to watch'
}

const CATEGORIES = [
  'popular',
  'on_the_air',
  'top_rated'
] as const;

type Category = typeof CATEGORIES[number];

export default async function TvShows() {
  type TMDBResponse = { results: TVDetails[] };

  const categoryData: Record<Category, TVDetails[]> = Object.fromEntries(
    await Promise.all(
      CATEGORIES.map(async (category) => {
        const response = await fetchTMDBData<TMDBResponse>(`tv/${category}`);
        return [category, response.results];
      })
    )
  );

  return (
    <TvShowsPage categoryData={categoryData}/>
  )
}