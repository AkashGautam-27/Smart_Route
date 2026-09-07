import React from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 font-sans">
      <main className="flex flex-col items-center text-center space-y-6 max-w-2xl px-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-blue-600">
          SmartRoute
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700">
          AI-Powered Public Transport Intelligence Platform
        </h2>
        <p className="text-xl text-gray-500 font-medium tracking-wide">
          Track &rarr; Predict &rarr; Recommend &rarr; Optimize
        </p>
      </main>
    </div>
  );
}
