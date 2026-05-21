import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import type { GardenPlan } from "@/types/garden";

export async function POST(req: NextRequest) {
  try {
    const plan: GardenPlan = await req.json();

    const { data, error } = await getSupabase()
      .from("garden_plans")
      .insert({
        zone: plan.inputs.zone,
        soil_type: plan.inputs.soilType,
        sun_exposure: plan.inputs.sunExposure,
        garden_size: plan.inputs.gardenSize,
        plants: plan.plants,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("save-plan error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
