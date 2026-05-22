"use client";

import type { Plant } from "@/types/garden";
import PlantIllustration from "./PlantIllustration";

interface GardenLayoutProps {
  plants: Plant[];
}

export default function GardenLayout({ plants }: GardenLayoutProps) {
  const back = plants.filter((p) => p.position === "back");
  const middle = plants.filter((p) => p.position === "middle");
  const front = plants.filter((p) => p.position === "front");

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        background: "linear-gradient(180deg, #e8f0e2 0%, #d4e8c2 40%, #c8dba8 100%)",
        borderColor: "var(--border)",
      }}
    >
      {/* Fence / wall suggestion at top */}
      <div
        className="w-full py-2 flex items-center justify-center gap-2 text-xs tracking-widest uppercase"
        style={{
          background: "repeating-linear-gradient(90deg, #b5a082 0px, #b5a082 18px, #8c7a5e 18px, #8c7a5e 20px)",
          color: "#faf8f4",
          letterSpacing: "0.15em",
          fontFamily: "var(--font-sans-body), sans-serif",
          textShadow: "0 1px 2px rgba(0,0,0,0.4)",
        }}
      >
        fence / back of bed
      </div>

      <div className="px-4 pb-6 pt-4 space-y-2">
        <PlantRow plants={back} rowLabel="Back" plantSize={100} illustrationHeight={100} />
        <PlantRow plants={middle} rowLabel="Middle" plantSize={90} illustrationHeight={90} />
        <PlantRow plants={front} rowLabel="Front" plantSize={78} illustrationHeight={78} />
      </div>

      {/* Ground strip */}
      <div
        className="w-full h-4"
        style={{
          background: "linear-gradient(180deg, #a0845c 0%, #7a6040 100%)",
        }}
      />
    </div>
  );
}

function PlantRow({
  plants,
  rowLabel,
  plantSize,
  illustrationHeight,
}: {
  plants: Plant[];
  rowLabel: string;
  plantSize: number;
  illustrationHeight: number;
}) {
  if (plants.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-end justify-center flex-wrap gap-1 min-h-[90px]">
        {plants.map((plant) => (
          <PlantIllustration
            key={plant.letter}
            plant={plant}
            width={plantSize}
            height={illustrationHeight}
            showLabel={true}
          />
        ))}
      </div>
      <p
        className="absolute left-2 top-1 text-[10px] uppercase tracking-widest opacity-40"
        style={{ fontFamily: "var(--font-sans-body), sans-serif" }}
      >
        {rowLabel}
      </p>
    </div>
  );
}
