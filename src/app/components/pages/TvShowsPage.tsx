'use client'

import { TVShowDetails } from "@/app/lib/tmdb/types"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { List } from "../ui";

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  popular: "Popular",
  on_the_air: "On the air",
  top_rated: "Top rated"
};

interface TvShowsPageProps {
  categoryData: Record<string, TVShowDetails[]>
}

const TvShowsPage = ({ categoryData}: TvShowsPageProps) => {
  const router = useRouter();
  const [augmentedCategoryData, setAugmentedCategoryData] = useState<
    Record<string, (TVShowDetails & { bookmarked?: boolean })[]>
  >(categoryData);

  const handlePosterClick = (id: number) => {
    router.push(`/tv-shows/${id}`);
  };

  useEffect(() => {
    const fetchBookmarkedIds = async () => {
      try {
        const res = await fetch('/api/user/movies/get-saved-ids');
        if (!res.ok) throw new Error('Failed to fetch bookmarked IDs');

        const data = await res.json();

        const ids: number[] = data.ids || [];

        const updated = Object.fromEntries(
          Object.entries(categoryData).map(([category, movies]) => [
            category,
            movies.map((movie) => ({
              ...movie,
              bookmarked: ids.includes(movie.id),
            })),
          ])
        );

        setAugmentedCategoryData(updated);
      } catch (error) {
        console.error('Error fetching bookmarked movie IDs:', error);
      }
    };

    fetchBookmarkedIds();
  }, [categoryData]);

  return (
    <div className="space-y-5">
      {Object.entries(augmentedCategoryData).map(([category, movies]) => (
        <section key={category} aria-labelledby={`heading-${category}`}>
          <h2 id={`heading-${category}`} className="text-2xl font-bold mb-4">
            {CATEGORY_DISPLAY_NAMES[category as keyof typeof CATEGORY_DISPLAY_NAMES]}
          </h2>
          <List results={movies} onClick={handlePosterClick} />
        </section>
      ))}
    </div>
  )
}

export default TvShowsPage