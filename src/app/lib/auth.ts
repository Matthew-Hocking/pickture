import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { DEFAULT_REGION, RegionCode, SUPPORTED_REGIONS } from "./constants";

export async function getUserRegion(userId?: string): Promise<RegionCode> {
  const clerkId = userId || (await auth()).userId;

  if (!clerkId) {
    return DEFAULT_REGION;
  }

  const user = (await prisma.user.findUnique({
    where: { clerkId: clerkId },
    select: { region: true },
  })) as { region: RegionCode } | null;

  const region = user?.region;
  return region && SUPPORTED_REGIONS.includes(region) ? region : DEFAULT_REGION;
}
