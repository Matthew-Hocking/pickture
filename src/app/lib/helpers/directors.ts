import { CrewMember } from "../tmdb/types";


export function getDirectorNames(directors: CrewMember[] = []): { label: string; names: string } | null {
  if (!directors.length) return null;
  const label = directors.length === 1 ? 'Director' : 'Directors';
  const names = directors.map((d) => d.name).join(', ');
  return { label, names };
}