import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { GardenInputs, Plant } from "@/types/garden";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const systemPrompt = `You are an expert horticulturalist and garden designer.
Given garden parameters, you return a curated plant list as valid JSON only — no prose, no markdown fences.
Return an array of 6–10 plant objects. Each object must have exactly these fields:
- letter: string (A, B, C…)
- common_name: string
- botanical_name: string
- quantity: number
- mature_height_ft: number
- mature_width_ft: number
- bloom_color: string (valid CSS color like "#e75480" or "lavender")
- bloom_season: string (e.g. "Spring", "Summer", "Fall", "Summer–Fall")
- position: "back" | "middle" | "front"

Rules:
- Plants must be appropriate for the given USDA hardiness zone
- Plants must tolerate the given soil type
- Plants must suit the given sun exposure
- Scale quantity and plant count to match the garden size
- back = tallest plants (shrubs, tall perennials) — placed near fence or wall
- middle = mid-height perennials and ornamental grasses
- front = low-growing edging plants (under 18 inches)
- Choose plants with complementary bloom colors and varied seasons
- Return ONLY the JSON array, nothing else`;

export async function POST(req: NextRequest) {
  try {
    const inputs: GardenInputs = await req.json();

    const userPrompt = `Garden parameters:
- USDA Hardiness Zone: ${inputs.zone}
- Soil Type: ${inputs.soilType}
- Sun Exposure: ${inputs.sunExposure}
- Garden Size: ${inputs.gardenSize}

Return a JSON plant list for this garden.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text : "";

    let plants: Plant[];
    try {
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      plants = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse plant list from AI response", raw },
        { status: 500 }
      );
    }

    return NextResponse.json({ plants });
  } catch (error) {
    console.error("generate-plan error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
