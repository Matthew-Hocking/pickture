import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Search, Check, RefreshCw } from "lucide-react";
import React from "react";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string
}

interface StepTileProps {
  step: Step;
}

const StepTile: React.FC<StepTileProps> = ({ step }) => (
  <div className="p-6 bg-surface rounded-lg">
    <div className="flex gap-4 items-center">
      <div className="flex items-center justify-center w-12 h-12 bg-brand rounded-full">
        {step.icon}
      </div>
      <h3 className="text-xl text-text-primary font-bold">
        {step.title}
      </h3>
    </div>
    <div className="">
      <p className="pt-4 text-text-secondary">
        {step.description}
      </p>
    </div>
  </div>
);

const StepTiles: React.FC = () => {
  const steps: Step[] = [
    {
      icon: <Search color="white" strokeWidth={3}/>,
      title: "Search",
      description: "Find your favourites!"
    },
    {
      icon: <Check color="white" strokeWidth={3}/>,
      title: "Save",
      description: "Keep track of your top picks in one place - across all streaming services!"
    },
    {
      icon: <RefreshCw color="white" strokeWidth={3}/>,
      title: "Spin",
      description: "Lorem Ipsum"
    }
  ];

  return (
    <div className="">
      <div className="grid lg:grid-cols-3 gap-8 pt-4 sm:max-w-md lg:max-w-none">
        {steps.map((step, index) => (
          <StepTile key={index} step={step} />
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <main>
      <div className="bg-gradient-to-b from-surface to-background">
        <div className="grid place-items-center gap-8 sm:gap-20 py-20 lg:py-[max(15vh,50px)] mx-[max(15vw,50px)]">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block text-text-primary">Pickture</span>
              <span className="block bg-gradient-to-b from-brand to-brand-hover bg-clip-text text-transparent">Just spin and watch</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-text-secondary sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Take the drama out of movie night and put it where it belongs - on the screen!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto mt-5">
              <SignUpButton mode="modal">
                <button className="min-w-[120px] px-6 py-3 font-medium rounded-md text-text-primary bg-brand hover:bg-brand-hover">
                  Sign Up
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className=" min-w-[120px] px-6 py-3 font-medium rounded-md text-text-inverted bg-white hover:bg-gray-100">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
          <div>
            <StepTiles />
          </div>
        </div>
      </div>
    </main>
  );
}
