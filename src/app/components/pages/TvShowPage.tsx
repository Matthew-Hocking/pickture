"use client";

import {
  TvShowCastMember,
  TvShowCrewMember,
  TVShowDetails,
} from "@/app/lib/tmdb/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BookmarkButton, List } from "../ui";
import Link from "next/link";
import { formatDirectorsForDisplay } from "@/app/lib/helpers/directors";

interface TvShowPageProps {
  data: {
    tvShow: TVShowDetails;
    topCast: TvShowCastMember[] | null;
    directors: TvShowCrewMember[] | null;
    similar: TVShowDetails[];
    watchOptions: {
      provider_id: number;
      provider_name: string;
      link: string;
      logo_path: string;
      offers: Array<"Rent" | "Buy" | "Stream">;
    }[];
  };
}

const TvShowPage = ({ data }: TvShowPageProps) => {
  const { tvShow, topCast, directors, similar, watchOptions } = data;

  const formattedDirectors = formatDirectorsForDisplay(directors);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [augmentedSimilar, setAugmentedSimilar] = useState<(
    TVShowDetails & { bookmarked?: boolean }
  )[]>(similar);

  const router = useRouter();

  const handlePosterClick = (id: number) => {
    router.push(`/tv-shows/${id}`);
  };

  useEffect(() => {
    const fetchBookmarkedIds = async () => {
      try {
        const res = await fetch("/api/user/tv-shows/get-saved-ids");
        if (!res.ok) throw new Error("Failed to fetch bookmarked IDs");
        const data = await res.json();
        const ids: number[] = data.ids || [];

        setIsBookmarked(ids.includes(tvShow.id));

        const updatedSimilar = similar.map((sim) => ({
          ...sim,
          bookmarked: ids.includes(sim.id),
        }));

        setAugmentedSimilar(updatedSimilar);
      } catch (error) {
        console.error("Error checking bookmarked movies:", error);
      }
    };

    fetchBookmarkedIds();
  }, [tvShow.id, similar]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div className="relative">
          <BookmarkButton id={tvShow.id} initialBookmarked={isBookmarked} />
          <Image
            src={`https://image.tmdb.org/t/p/w342${tvShow.poster_path}`}
            alt={`Poster of ${tvShow.name}`}
            width={500}
            height={750}
            className="rounded-md shadow-md"
          />
        </div>

        <div className="flex flex-col justify-between md:col-span-2">
          <div>
            <h1 className="text-4xl font-bold mb-2">{tvShow.name}</h1>

            <div className="mb-2 text-gray-500">
              <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
              {" | "}
              <span>
                {tvShow.number_of_seasons} season
                {tvShow.number_of_seasons !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {tvShow.genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/movies/discover?genre=${genre.id}`}
                  className="px-3 py-1 no-underline transition border text-text-secondary hover:bg-gray-100 text-sm hover:text-text-inverted rounded-full"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            <p className="text-sm text-text-secondary mb-4 md:text-base">
              {tvShow.overview}
            </p>

            {watchOptions && watchOptions.length > 0 ? (
              <div className="mb-6">
                {/* Streaming options */}
                {watchOptions.some((opt) => opt.offers.includes("Stream")) && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Streaming now
                    </h3>
                    <div className="flex gap-3 flex-wrap items-center">
                      {watchOptions
                        .filter((opt) => opt.offers.includes("Stream"))
                        .map((opt) => (
                          <a
                            key={`stream-${opt.provider_id}`}
                            href={opt.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={opt.provider_name}
                          >
                            <Image
                              src={`https://image.tmdb.org/t/p/w45${opt.logo_path}`}
                              alt={opt.provider_name}
                              width={45}
                              height={45}
                              className="rounded-md hover:scale-105 transition-transform"
                            />
                          </a>
                        ))}
                    </div>
                  </div>
                )}

                {/* Rent/Buy options */}
                {watchOptions.some(
                  (opt) =>
                    opt.offers.includes("Rent") || opt.offers.includes("Buy")
                ) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Available to rent or buy
                    </h3>
                    <div className="flex gap-3 flex-wrap items-center">
                      {watchOptions
                        .filter(
                          (opt) =>
                            opt.offers.includes("Rent") ||
                            opt.offers.includes("Buy")
                        )
                        .map((opt) => (
                          <a
                            key={`rentbuy-${opt.provider_id}`}
                            href={opt.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={opt.provider_name}
                          >
                            <Image
                              src={`https://image.tmdb.org/t/p/w45${opt.logo_path}`}
                              alt={opt.provider_name}
                              width={45}
                              height={45}
                              className="rounded-md hover:scale-105 transition-transform"
                            />
                          </a>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-sm text-gray-500 italic">
                  No streaming or rental options available for this title in
                  your region.
                </p>
              </div>
            )}
          </div>

          <ul className="text-sm text-gray-500 space-y-1">
            {formattedDirectors && (
              <li>
                <strong>{formattedDirectors.label}:</strong>{" "}
                {formattedDirectors.names}
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Cast members */}
      {topCast?.length ? (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Top Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {topCast.map((actor) => {
              return (
                <div key={actor.id} className="text-center">
                  {actor.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      width={150}
                      height={225}
                      className="rounded-md mx-auto mb-2 shadow-sm"
                    />
                  ) : (
                    <div className="w-[150px] h-[225px] bg-gray-100 rounded-md mx-auto mb-2 flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                  <p className="text-sm font-medium">{actor.name}</p>
                  <p className="text-xs text-gray-500">
                    as{" "}
                    {actor.roles
                      .slice(0, 2)
                      .map((r) => r.character)
                      .join(", ")}
                    {actor.roles.length > 2 && "..."}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">
          No cast information available.
        </p>
      )}

      {augmentedSimilar?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Similar</h2>
          <List results={augmentedSimilar} onClick={handlePosterClick} />
        </div>
      )}
    </div>
  );
};

export default TvShowPage;
