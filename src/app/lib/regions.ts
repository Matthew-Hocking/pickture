export type RegionCode =
  | "US"
  | "GB"
  | "CA"
  | "AU"
  | "NZ"
  | "IE"
;

export const SUPPORTED_REGIONS: RegionCode[] = [
  "US",
  "GB",
  "CA",
  "AU",
  "NZ",
  "IE"
];

export const REGION_NAMES: Record<RegionCode, string> = {
  AU: "Australia",
  CA: "Canada",
  IE: "Ireland",
  NZ: "New Zealand",
  GB: "United Kingdom",
  US: "United States",
};

export const DEFAULT_REGION: RegionCode = "US";
