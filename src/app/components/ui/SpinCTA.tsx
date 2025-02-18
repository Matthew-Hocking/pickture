import { Filter } from "lucide-react";
import Link from "next/link";
import React from "react";

const SpinCTA = () => {
  return (
    <div>
      <div className="inline-flex rounded-lg overflow-hidden">
        <button className="transition bg-brand font-medium px-5 py-2 border-r border-background hover:bg-brand-hover">
          Spin
        </button>

        <Link href="/spin" className="bg-brand px-4 py-2 hover:bg-brand-hover">
          <Filter color="white" />
        </Link>
      </div>
    </div>
  );
};

export default SpinCTA;
