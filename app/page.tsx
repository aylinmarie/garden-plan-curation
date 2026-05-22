"use client";

import { useState } from "react";
import GardenForm from "@/components/GardenForm";
import GardenLayout from "@/components/GardenLayout";
import PlantListCard from "@/components/PlantListCard";
import type { GardenInputs, Plant } from "@/types/garden";

type Status = "idle" | "loading" | "success" | "error";
type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [plants, setPlants] = useState<Plant[]>([]);
  const [lastInputs, setLastInputs] = useState<GardenInputs | null>(null);

  async function generate(inputs: GardenInputs) {
    setStatus("loading");
    setErrorMsg("");
    setSaveStatus("idle");
    setLastInputs(inputs);

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Unknown error");
      }
      setPlants(data.plants);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  async function savePlan() {
    if (!lastInputs || plants.length === 0) return;
    setSaveStatus("saving");

    try {
      const res = await fetch("/api/save-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: lastInputs, plants }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Save failed");
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Hero header */}
      <header
        className="border-b px-6 py-8 text-center"
        style={{ borderColor: "var(--border)", background: "var(--parchment)" }}
      >
        <p
          className="text-xs uppercase tracking-[0.25em] mb-2"
          style={{ color: "var(--terracotta)" }}
        >
          Better Homes &amp; Gardens
        </p>
        <h1
          className="font-display text-4xl sm:text-5xl leading-tight"
          style={{ color: "var(--warm-brown)", fontFamily: "var(--font-serif-display), Georgia, serif" }}
        >
          Garden Plan Generator
        </h1>
        <p className="mt-3 text-sm opacity-70 max-w-md mx-auto leading-relaxed">
          Tell us about your garden and we&apos;ll design a beautiful, zone-appropriate
          planting plan just for you.
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">

          {/* LEFT: Input form */}
          <div
            className="rounded-2xl border p-6 lg:sticky lg:top-6"
            style={{ background: "var(--parchment)", borderColor: "var(--border)" }}
          >
            <h2
              className="text-xl mb-6 font-semibold"
              style={{ color: "var(--warm-brown)", fontFamily: "var(--font-serif-display), Georgia, serif" }}
            >
              Your Garden Details
            </h2>
            <GardenForm
              onSubmit={generate}
              isLoading={status === "loading"}
              defaultValues={lastInputs ?? undefined}
            />
          </div>

          {/* RIGHT: Results */}
          <div className="space-y-6">
            {status === "idle" && <EmptyState />}

            {status === "error" && (
              <div
                className="rounded-2xl border p-6 text-sm"
                style={{ borderColor: "#e8b4a0", background: "#fdf0eb" }}
              >
                <p className="font-semibold mb-1" style={{ color: "#b34a1f" }}>
                  Something went wrong
                </p>
                <p className="opacity-70">{errorMsg}</p>
              </div>
            )}

            {status === "loading" && plants.length === 0 && <LoadingState />}

            {plants.length > 0 && (
              <>
                <section>
                  <SectionHeading>Your Garden Layout</SectionHeading>
                  <GardenLayout plants={plants} />
                </section>

                <section>
                  <SectionHeading>Plant List</SectionHeading>
                  <PlantListCard plants={plants} zone={lastInputs?.zone ?? "?"} />
                </section>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => lastInputs && generate(lastInputs)}
                    disabled={status === "loading"}
                    className="btn-secondary"
                  >
                    ↺ Regenerate
                  </button>
                  <button
                    onClick={savePlan}
                    disabled={saveStatus === "saving" || saveStatus === "saved"}
                    className="btn-primary"
                  >
                    {saveStatus === "saving"
                      ? "Saving…"
                      : saveStatus === "saved"
                      ? "✓ Plan Saved"
                      : saveStatus === "error"
                      ? "Save Failed — Retry"
                      : "Save Plan"}
                  </button>
                </div>

                {saveStatus === "error" && (
                  <p className="text-xs" style={{ color: "#b34a1f" }}>
                    Could not save. Check your Supabase configuration.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-2xl mb-4 font-semibold"
      style={{ color: "var(--warm-brown)", fontFamily: "var(--font-serif-display), Georgia, serif" }}
    >
      {children}
    </h2>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-2xl border border-dashed p-12 text-center"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="text-5xl mb-4">🌿</div>
      <p
        className="text-xl mb-2 font-semibold"
        style={{ color: "var(--warm-brown)", fontFamily: "var(--font-serif-display), Georgia, serif" }}
      >
        Your garden plan will appear here
      </p>
      <p className="text-sm opacity-60">
        Fill in your garden details and click Generate to get started.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      className="rounded-2xl border p-12 text-center"
      style={{ background: "var(--parchment)", borderColor: "var(--border)" }}
    >
      <div className="flex justify-center mb-4">
        <svg
          className="animate-spin h-8 w-8"
          style={{ color: "var(--sage)" }}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <p
        className="text-xl mb-1 font-semibold"
        style={{ color: "var(--warm-brown)", fontFamily: "var(--font-serif-display), Georgia, serif" }}
      >
        Curating your plant palette…
      </p>
      <p className="text-sm opacity-60">
        Our garden expert is selecting the perfect plants for your space.
      </p>
    </div>
  );
}
