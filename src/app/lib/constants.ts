export type RegionCode =
  | "US"
  | "GB"
  | "CA"
  | "AU"
  | "NZ"
  | "IE"
  | "IN"
  | "SG"
  | "ZA"
;

export const SUPPORTED_REGIONS: RegionCode[] = [
  "US",
  "GB",
  "CA",
  "AU",
  "NZ",
  "IE",
  "IN",
  "SG",
  "ZA",
];

export const REGION_NAMES: Record<RegionCode, string> = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  NZ: "New Zealand",
  IE: "Ireland",
  IN: "India",
  SG: "Singapore",
  ZA: "South Africa",
};

export const DEFAULT_REGION: RegionCode = "US";
