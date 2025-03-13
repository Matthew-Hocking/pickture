"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { SUPPORTED_REGIONS, type RegionCode } from "../lib/constants";

type RegionContextType = {
  region: RegionCode;
  setRegion: (region: RegionCode) => void;
};

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({
  initialRegion,
  children,
}: {
  initialRegion: RegionCode;
  children: React.ReactNode;
}) {
  const [region, setRegion] = useState(initialRegion);

  useEffect(() => {
    localStorage.setItem("pickture-region", region);
  }, [region]);

  useEffect(() => {
    const storedRegion = localStorage.getItem("pickture-region");
    if (storedRegion && SUPPORTED_REGIONS.includes(storedRegion as RegionCode)) {
      setRegion(storedRegion as RegionCode);
    }
  }, []);

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context)
    throw new Error("useRegion must be used within a RegionProvider");
  return context;
}
