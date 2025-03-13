import React from "react";
import { Footer, Nav } from "@/app/components/layout";
import { RegionProvider } from "../context/RegionContext";
import { getUserRegion } from "../lib/auth";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const initialRegion = await getUserRegion();
  return (
    <RegionProvider initialRegion={initialRegion}>
      <div className="flex flex-col min-h-screen bg-background">
        <Nav />

        <main className="flex-grow container py-8 md:py-12">{children}</main>

        <Footer />
      </div>
    </RegionProvider>
  );
};

export default Layout;
