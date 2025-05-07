import React from "react";
import { Footer, Nav } from "@/app/components/layout";


const Layout = async ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Nav />

      <main className="flex-grow py-8 md:py-12 overflow-x-hidden">
        <div className="container">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
