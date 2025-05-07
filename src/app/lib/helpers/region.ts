import { cookies } from "next/headers";
import { DEFAULT_REGION, RegionCode } from "../constants";

export async function getRegionFromCookie(): Promise<RegionCode> {
  try {
    const cookiesStore = await cookies();
    const cookieRegion = cookiesStore.get('pickture-region')?.value;
    if (cookieRegion) return cookieRegion as RegionCode;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to get cookies:', e);
    }
  }
  
  return (DEFAULT_REGION as RegionCode) || 'US';
}