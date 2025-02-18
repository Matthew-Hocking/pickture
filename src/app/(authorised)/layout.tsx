import React from "react";
import { Footer, Nav } from "@/app/components/layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Nav />

      <main className="flex-grow container py-8 md:py-12">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
