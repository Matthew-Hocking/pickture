import { MovieCrewMember, TvShowCrewMember } from "../tmdb/types";

type Directors = MovieCrewMember[] | TvShowCrewMember[] | null;

export function extractMovieDirectors(
  crew: MovieCrewMember[] = []
): MovieCrewMember[] {
  return crew.filter((member) => member.job === "Director");
}

export function extractTvDirectors(
  crew: TvShowCrewMember[] = []
): TvShowCrewMember[] {
  return crew.filter((member) =>
    member.jobs?.some((job) => job.job === "Director")
  );
}

export function formatDirectorsForDisplay(
  directors: Directors
): { label: string; names: string } | null {
  if (!directors?.length) return null;

  const label = directors.length === 1 ? "Director" : "Directors";
  const names = directors
    .slice(0, 3)
    .map((d) => d?.name)
    .join(", ") + (directors.length > 3 ? "..." : "");
  return { label, names };
}
