import { MovieCrewMember, TvShowCrewMember } from "../tmdb/types";

export function getMovieDirectorNames(crew: MovieCrewMember[] = []): { label: string; names: string } | null {
  const directors = crew.filter((member) => member.job === 'Director');
  if (!directors.length) return null;
  const label = directors.length === 1 ? 'Director' : 'Directors';
  const names = directors.map((d) => d.name).join(', ');
  return { label, names };
}

export function getTvDirectorNames(crew: TvShowCrewMember[] = []): { label: string; names: string } | null {
  const directors = crew.filter((member) =>
    member.jobs.some((job) => job.job === 'Director')
  );
  if (!directors.length) return null;
  const label = directors.length === 1 ? 'Director' : 'Directors';
  const names = directors.map((d) => d.name).join(', ');
  return { label, names };
}