'use client'

import { List } from "@/app/components/ui";
import { MovieDetails } from "@/app/lib/tmdb/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  popular: "Popular Movies",
  now_playing: "Now Playing",
  top_rated: "Top Rated"
};

interface MoviesClientProps {
  categoryData: Record<string, MovieDetails[]>;
}

export default function MoviesPage({ categoryData }: MoviesClientProps) {
  const router = useRouter();
  const [augmentedCategoryData, setAugmentedCategoryData] = useState<
    Record<string, (MovieDetails & { bookmarked?: boolean })[]>
  >(categoryData);
  

  const handlePosterClick = (id: number) => {
    router.push(`/movies/${id}`);
  };

  useEffect(() => {
    const fetchBookmarkedIds = async () => {
      try {
        const res = await fetch('/api/user/movies/saved-ids');
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

        console.log('updated', updated)

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
  );
}