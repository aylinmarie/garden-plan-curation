"use client";

import type { Plant } from "@/types/garden";

interface PlantListCardProps {
  plants: Plant[];
  zone: string;
}

export default function PlantListCard({ plants, zone }: PlantListCardProps) {
  return (
    <div
      className="rounded-2xl border p-6"
      style={{ background: "var(--parchment)", borderColor: "var(--border)" }}
    >
      <h2
        className="font-display text-xl mb-4"
        style={{ color: "var(--warm-brown)" }}
      >
        Plant List
      </h2>
      <div className="space-y-3">
        {plants.map((plant) => (
          <PlantEntry key={plant.letter} plant={plant} zone={zone} />
        ))}
      </div>
    </div>
  );
}

function PlantEntry({ plant, zone }: { plant: Plant; zone: string }) {
  return (
    <div className="flex gap-4 items-start border-b pb-3 last:border-b-0 last:pb-0" style={{ borderColor: "var(--border)" }}>
      {/* Color swatch + letter */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <div
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm"
          style={{
            backgroundColor: plant.bloom_color,
            borderColor: "rgba(0,0,0,0.12)",
            color: getContrastColor(plant.bloom_color),
          }}
        >
          {plant.letter}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span
            className="font-semibold text-sm"
            style={{ color: "var(--foreground)" }}
          >
            {plant.common_name}
          </span>
          <span
            className="text-xs italic opacity-60"
            style={{ color: "var(--foreground)" }}
          >
            {plant.botanical_name}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
          <Tag label={`Qty: ${plant.quantity}`} />
          <Tag label={`Zone ${zone}`} />
          <Tag label={plant.bloom_season} />
          <Tag label={`${plant.mature_height_ft}′ tall`} />
          <Tag label={plant.position} capitalize />
        </div>
      </div>
    </div>
  );
}

function Tag({ label, capitalize }: { label: string; capitalize?: boolean }) {
  return (
    <span
      className={`text-[11px] opacity-70 ${capitalize ? "capitalize" : ""}`}
      style={{ color: "var(--warm-brown)" }}
    >
      {label}
    </span>
  );
}

function getContrastColor(hex: string): string {
  try {
    const color = hex.replace("#", "");
    if (color.length === 3) {
      const r = parseInt(color[0] + color[0], 16);
      const g = parseInt(color[1] + color[1], 16);
      const b = parseInt(color[2] + color[2], 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? "#2c2416" : "#faf8f4";
    }
    if (color.length === 6) {
      const r = parseInt(color.slice(0, 2), 16);
      const g = parseInt(color.slice(2, 4), 16);
      const b = parseInt(color.slice(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? "#2c2416" : "#faf8f4";
    }
  } catch {
    // ignore
  }
  return "#faf8f4";
}
