"use client";

import { REGION_NAMES, RegionCode, SUPPORTED_REGIONS } from "@/app/lib/constants";
import { useRegion } from "@/app/context/RegionContext";
import { useTransition } from "react";

export default function RegionDropdown() {
  const { region, setRegion } = useRegion();
  const [isPending, startTransition] = useTransition();

  async function handleRegionChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newRegion = event.target.value;

    startTransition(async () => {
      const response = await fetch("/api/user/update-region", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region: newRegion }),
      });
      
      const result = await response.json();
      console.log("API response:", response.status, result);
    
      if (response.ok) {
        setRegion(newRegion as RegionCode);
      } else {
        console.error("Failed to update region:", result.error);
      }
    });
  }

  return (
    <select value={region} onChange={handleRegionChange} disabled={isPending}>
      {Object.entries(REGION_NAMES).map((region) => (
        <option key={region[0]} value={region[0]}>
          {region[1]}
        </option>
      ))}
    </select>
  )};
