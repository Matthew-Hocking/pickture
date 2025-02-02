import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Search, Check, RefreshCw } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Pickture</span>
              <span className="block text-indigo-600">Just spin and watch</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Take the drama out of movie night and put it where it belongs - on the screen!
            </p>
            <div className="mt-5 max-w-md mx-auto flex justify-center gap-4 md:mt-8">
              <SignUpButton mode="modal">
                <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Sign Up
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
          
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root rounded-lg bg-white px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                    <Search color="white"/>
                  </div>
                  <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">Search</h3>
                  <p className="mt-5 text-base text-gray-500">
                  Description of your first amazing feature that will help users achieve their goals.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <div className="flow-root rounded-lg bg-white px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                    <Check color="white"/>
                  </div>
                  <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">Save</h3>
                  <p className="mt-5 text-base text-gray-500">
                  Description of your second amazing feature that will help users achieve their goals.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <div className="flow-root rounded-lg bg-white px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                    <RefreshCw color="white"/>
                  </div>
                  <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">Spin</h3>
                  <p className="mt-5 text-base text-gray-500">
                  Description of your third amazing feature that will help users achieve their goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
