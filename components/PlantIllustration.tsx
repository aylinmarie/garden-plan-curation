"use client";

import type { Plant } from "@/types/garden";

// TODO: replace with asset lookup from plant illustration library keyed by botanical name
const PLANT_ASSETS: Record<string, string> = {};

function hexToRgba(color: string, alpha: number): string {
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return color;
}

function blobPath(cx: number, cy: number, rx: number, ry: number, seed: number): string {
  const points = 8;
  const angleStep = (Math.PI * 2) / points;
  const jitter = (s: number) => {
    const x = Math.sin(s * 127.1 + seed * 311.7) * 0.5 + 0.5;
    return 0.75 + x * 0.5;
  };
  let d = "";
  for (let i = 0; i < points; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const nextAngle = angle + angleStep;
    const r1 = jitter(i);
    const r2 = jitter(i + 0.5);
    const px = cx + Math.cos(angle) * rx * r1;
    const py = cy + Math.sin(angle) * ry * r1;
    const cp1x = cx + Math.cos(angle + angleStep * 0.4) * rx * r2 * 1.1;
    const cp1y = cy + Math.sin(angle + angleStep * 0.4) * ry * r2 * 1.1;
    const cp2x = cx + Math.cos(nextAngle - angleStep * 0.4) * rx * r2 * 1.1;
    const cp2y = cy + Math.sin(nextAngle - angleStep * 0.4) * ry * r2 * 1.1;
    if (i === 0) {
      d += `M ${px} ${py}`;
    }
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${cx + Math.cos(nextAngle) * rx * jitter(i + 1)} ${cy + Math.sin(nextAngle) * ry * jitter(i + 1)}`;
  }
  return d + " Z";
}

interface PlantIllustrationProps {
  plant: Plant;
  width?: number;
  height?: number;
  showLabel?: boolean;
}

export default function PlantIllustration({
  plant,
  width = 110,
  height = 120,
  showLabel = true,
}: PlantIllustrationProps) {
  const assetUrl = PLANT_ASSETS[plant.botanical_name];

  const filterId = `watercolor-${plant.letter}`;
  const cx = width / 2;
  const cy = height * 0.42;
  const rx = width * 0.38;
  const ry = height * 0.36;

  const fillMain = hexToRgba(plant.bloom_color, 0.62);
  const fillShadow = hexToRgba(plant.bloom_color, 0.35);

  if (assetUrl) {
    return (
      <div className="flex flex-col items-center gap-1">
        <img
          src={assetUrl}
          alt={plant.common_name}
          style={{ width, height }}
          className="object-contain"
        />
        {showLabel && (
          <PlantLabel plant={plant} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label={plant.common_name}
        overflow="visible"
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 0.06"
              numOctaves="4"
              seed={plant.letter.charCodeAt(0)}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
        </defs>

        {/* Shadow blob (offset slightly) */}
        <path
          d={blobPath(cx + 4, cy + 5, rx * 0.88, ry * 0.88, plant.letter.charCodeAt(0) + 7)}
          fill={fillShadow}
          filter={`url(#${filterId})`}
        />

        {/* Main bloom blob */}
        <path
          d={blobPath(cx, cy, rx, ry, plant.letter.charCodeAt(0))}
          fill={fillMain}
          filter={`url(#${filterId})`}
        />

        {/* Letter badge */}
        <circle cx={cx} cy={cy} r={14} fill="white" opacity={0.82} />
        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fontSize={13}
          fontWeight="700"
          fill={plant.bloom_color}
          fontFamily="Georgia, serif"
        >
          {plant.letter}
        </text>
      </svg>
      {showLabel && <PlantLabel plant={plant} />}
    </div>
  );
}

function PlantLabel({ plant }: { plant: Plant }) {
  return (
    <div className="text-center max-w-[110px]">
      <p
        className="text-xs font-semibold leading-tight"
        style={{ color: "var(--warm-brown)" }}
      >
        {plant.common_name}
      </p>
      <p className="text-[10px] opacity-60 leading-tight">
        × {plant.quantity}
      </p>
    </div>
  );
}
