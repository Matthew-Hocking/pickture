'use client';

import { List } from "@/app/components/ui";
import { useRegion } from "@/app/context/RegionContext";
import { useEffect, useState } from "react";

const CATEGORIES = ["popular", "now_playing", "top_rated"] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_DISPLAY_NAMES: Record<Category, string> = {
  popular: "Popular Movies",
  now_playing: "Now Playing",
  top_rated: "Top Rated"
};

const CategorySkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="bg-gray-300 rounded h-48 w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function MoviesPage() {
  const { region } = useRegion();
  const [data, setData] = useState<any>(null);
  const [loadingCategories, setLoadingCategories] = useState<Set<Category>>(new Set());

  useEffect(() => {
    const fetchAll = async () => {
      const loadingSet = new Set<Category>(CATEGORIES);
      setLoadingCategories(loadingSet);

      try {
        const promises = CATEGORIES.map(async (category) => {
          const res = await fetch(`/api/tmdb/discover?type=movie&category=${category}&region=${region}`);
          if (!res.ok) throw new Error(`Error fetching ${category}`);
          const json = await res.json();
          return [category, json.results] as const;
        });

        const results = await Promise.all(promises);
        const newData = Object.fromEntries(results);

        setData(newData);
        setLoadingCategories(new Set());
      } catch (err) {
        console.error("Error fetching TMDB data:", err);
        setLoadingCategories(new Set());
      }
    };

    fetchAll();
  }, [region]);

  return (
    <div className="space-y-5">
      {CATEGORIES.map((category) => (
        <section
          key={category}
          aria-labelledby={`heading-${category}`}
          className="movie-category py-4"
        >
          <h2
            id={`heading-${category}`}
            className="text-2xl font-bold mb-4"
          >
            {CATEGORY_DISPLAY_NAMES[category]}
          </h2>

          {loadingCategories.has(category) || !data ? (
            <CategorySkeleton />
          ) : (
            <List results={data[category]} />
          )}
        </section>
      ))}
    </div>
  );
}

