'use client'

import { REGION_NAMES, RegionCode } from "@/app/lib/constants";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = {
  initialRegion: RegionCode;
};

export default function RegionDropdown({ initialRegion }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleRegionChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newRegion = event.target.value as RegionCode;

    startTransition(async () => {
      const response = await fetch("/api/user/update-region", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region: newRegion }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const result = await response.json();
        console.error("Failed to update region:", result.error);
      }
    });
  }

  return (
    <select
      value={initialRegion}
      onChange={handleRegionChange}
      disabled={isPending}
    >
      {Object.entries(REGION_NAMES).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
}