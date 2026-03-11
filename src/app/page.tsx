"use client";

import SpoonityCalculator from "./spoonityCalculator";
import { PricingProvider } from "./context/PricingContext";

export default function Home() {
  return (
    <PricingProvider>
      <div className="bg-[rgb(247, 247, 247)]">
        <SpoonityCalculator />
      </div>
    </PricingProvider>
  );
}
