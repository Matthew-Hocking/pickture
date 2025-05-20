'use client'

import { List } from "@/app/components/ui";
import { MovieDetails, TVDetails } from "@/app/lib/tmdb/types";
import { useRouter } from "next/navigation";

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  popular: "Popular Movies",
  now_playing: "Now Playing",
  top_rated: "Top Rated"
};

interface MoviesClientProps {
  categoryData: Record<string, (MovieDetails | TVDetails)[]>;
}

export default function MoviesPage({ categoryData }: MoviesClientProps) {
  const router = useRouter();

  const handlePosterClick = (id: number) => {
    router.push(`/movies/${id}`);
  };

  return (
    <div className="space-y-5">
      {Object.entries(categoryData).map(([category, movies]) => (
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