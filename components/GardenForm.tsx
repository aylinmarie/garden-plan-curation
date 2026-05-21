"use client";

import { useState } from "react";
import type { GardenInputs, Zone, SoilType, SunExposure, GardenSize } from "@/types/garden";

const ZONES: Zone[] = ["3", "4", "5", "6", "7", "8", "9", "10", "11"];
const SOIL_TYPES: SoilType[] = ["Sandy", "Loamy", "Clay", "Chalky", "Peaty"];
const SUN_OPTIONS: SunExposure[] = [
  "Full Sun (6+ hrs)",
  "Partial Sun/Shade (3–6 hrs)",
  "Full Shade (<3 hrs)",
];
const GARDEN_SIZES: GardenSize[] = [
  "Small (25–50 sq ft)",
  "Medium (50–150 sq ft)",
  "Large (150–300 sq ft)",
];

interface GardenFormProps {
  onSubmit: (inputs: GardenInputs) => void;
  isLoading: boolean;
  defaultValues?: GardenInputs;
}

export default function GardenForm({ onSubmit, isLoading, defaultValues }: GardenFormProps) {
  const [zone, setZone] = useState<Zone>(defaultValues?.zone ?? "6");
  const [soilType, setSoilType] = useState<SoilType>(defaultValues?.soilType ?? "Loamy");
  const [sunExposure, setSunExposure] = useState<SunExposure>(
    defaultValues?.sunExposure ?? "Full Sun (6+ hrs)"
  );
  const [gardenSize, setGardenSize] = useState<GardenSize>(
    defaultValues?.gardenSize ?? "Medium (50–150 sq ft)"
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ zone, soilType, sunExposure, gardenSize });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Zone */}
      <Field label="USDA Hardiness Zone">
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value as Zone)}
          className="form-select"
          disabled={isLoading}
        >
          {ZONES.map((z) => (
            <option key={z} value={z}>
              Zone {z}
            </option>
          ))}
        </select>
      </Field>

      {/* Soil Type */}
      <Field label="Soil Type">
        <select
          value={soilType}
          onChange={(e) => setSoilType(e.target.value as SoilType)}
          className="form-select"
          disabled={isLoading}
        >
          {SOIL_TYPES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      {/* Sun Exposure */}
      <Field label="Sun Exposure">
        <div className="space-y-2">
          {SUN_OPTIONS.map((opt) => (
            <label key={opt} className="radio-label">
              <input
                type="radio"
                name="sun"
                value={opt}
                checked={sunExposure === opt}
                onChange={() => setSunExposure(opt)}
                disabled={isLoading}
                className="radio-input"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      </Field>

      {/* Garden Size */}
      <Field label="Garden Size">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          {GARDEN_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setGardenSize(size)}
              disabled={isLoading}
              className="size-toggle"
              data-active={gardenSize === size}
            >
              {size}
            </button>
          ))}
        </div>
      </Field>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner /> Generating your garden plan…
          </span>
        ) : (
          "Generate Garden Plan"
        )}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: "var(--warm-brown)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
