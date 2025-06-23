import { MovieCrewMember, TvShowCrewMember } from "../tmdb/types";

type Director = MovieCrewMember | TvShowCrewMember

export function extractMovieDirectors(crew: MovieCrewMember[] = []): MovieCrewMember[] {
  return crew
    .filter((member) => member.job === 'Director')
}

export function extractTvDirectors(crew: TvShowCrewMember[] = []): TvShowCrewMember[] {
  return crew
    .filter((member) => member.jobs?.some((job) => job.job === 'Director'))
}

export function formatDirectorsForDisplay(directors: Director[]): { label: string; names: string } | null {
  if (!directors.length) return null;
  const label = directors.length === 1 ? 'Director' : 'Directors';
  const names = directors.map((d) => d.name).join(', ');
  return { label, names };
}