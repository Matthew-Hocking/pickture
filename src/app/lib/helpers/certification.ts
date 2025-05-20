import { RegionCertifications } from "../tmdb/types";

export function getCertification(regionData?: RegionCertifications): string | null {
  if (!regionData || !Array.isArray(regionData.release_dates)) return null;

  const valid = regionData.release_dates.find(
    (rd) => rd.certification && rd.certification.trim() !== ''
  );

  return valid?.certification || null;
}