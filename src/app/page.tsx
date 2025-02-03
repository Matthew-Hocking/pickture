import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Search, Check, RefreshCw } from "lucide-react";
import React from "react";
import { Button } from "./components/ui";

const ICON_PROPS = {
  color: "white",
  strokeWidth: 2
};

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const StepTile: React.FC<{ step: Step }> = ({ step }) => (
  <div className="card">
    <div className="flex gap-4 items-center">
      <div className="center w-12 h-12 bg-brand rounded-full">
        {step.icon}
      </div>
      <h3 className="mb-0">{step.title}</h3>
    </div>
    <p className="pt-4">{step.description}</p>
  </div>
);

// Steps component with predefined steps
const StepTiles: React.FC = () => {
  const steps: Step[] = [
    {
      icon: <Search {...ICON_PROPS} />,
      title: "Search",
      description: "Find your favourites!"
    },
    {
      icon: <Check {...ICON_PROPS} />,
      title: "Save",
      description: "Keep track of your top picks in one place - across all streaming services!"
    },
    {
      icon: <RefreshCw {...ICON_PROPS} />,
      title: "Spin",
      description: "Discover something new to watch!"
    }
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-8 pt-4 sm:max-w-md lg:max-w-none">
      {steps.map((step, index) => (
        <StepTile key={index} step={step} />
      ))}
    </div>
  );
};

export default function Home() {
  return (
    <main>
      <div className="bg-gradient-to-b from-surface to-background">
        <div className="container grid place-items-center gap-8 sm:gap-20 py-20 lg:py-[max(15vh,50px)]">
          <div className="text-center">
            <h1>
              <span className="block text-text-primary">Pickture</span>
              <span className="block gradient-text">Just spin and watch</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Take the drama out of movie night and put it where it belongs - on the screen!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto mt-5">
              <SignUpButton mode="modal">
                <Button size="lg">Sign Up</Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button variant="secondary" size="lg">Sign Up</Button>
              </SignInButton>
            </div>
          </div>
          <StepTiles />
        </div>
      </div>
    </main>
  );
}