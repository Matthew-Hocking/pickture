import { DEFAULT_REGION, SUPPORTED_REGIONS } from "../lib/constants";

async function getCountryFromIP(ip: string) {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await res.json();

    if (data.status !== "success") {
      console.error("IP lookup failed:", data);
      return DEFAULT_REGION;
    }

    const countryCode = data.countryCode;
    return SUPPORTED_REGIONS.includes(countryCode)
      ? countryCode
      : DEFAULT_REGION;
  } catch (error) {
    console.error("Error fetching country from IP:", error);
    return DEFAULT_REGION;
  }
}

export default getCountryFromIP;
