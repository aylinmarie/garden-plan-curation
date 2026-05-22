export type Zone = "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11";
export type SoilType = "Sandy" | "Loamy" | "Clay" | "Chalky" | "Peaty";
export type SunExposure =
  | "Full Sun (6+ hrs)"
  | "Partial Sun/Shade (3–6 hrs)"
  | "Full Shade (<3 hrs)";
export type GardenSize =
  | "Small (25–50 sq ft)"
  | "Medium (50–150 sq ft)"
  | "Large (150–300 sq ft)";

export interface GardenInputs {
  zone: Zone;
  soilType: SoilType;
  sunExposure: SunExposure;
  gardenSize: GardenSize;
}

export interface Plant {
  letter: string;
  common_name: string;
  botanical_name: string;
  quantity: number;
  mature_height_ft: number;
  mature_width_ft: number;
  bloom_color: string;
  bloom_season: string;
  position: "back" | "middle" | "front";
}

export interface GardenPlan {
  inputs: GardenInputs;
  plants: Plant[];
}
