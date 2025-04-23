import Image from "next/image";
import SpoonityCalculator from "./spoonityCalculator";
export default function Home() {
  return (
    <div className="bg-[rgb(247, 247, 247)]">
      <SpoonityCalculator />
    </div>
  );
}
