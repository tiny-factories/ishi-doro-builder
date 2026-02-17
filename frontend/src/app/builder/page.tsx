"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Part, PartType, PartTypeId } from "@/lib/types";
import CornerEmbellishment from "@/components/CornerEmbellishment";
import BlueprintSketch from "@/components/BlueprintSketch";
import PartSelector from "@/components/PartSelector";

const LanternViewer = dynamic(() => import("@/components/LanternViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-stone-950">
      <span className="text-sm text-stone-600 animate-pulse">Loading 3D...</span>
    </div>
  ),
});

const PART_IDS: PartTypeId[] = ["hoju", "kasa", "hibukuro", "chudai", "sao", "kiso"];

function BuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shouldRandomize = searchParams.get("randomize") === "true";

  const [partTypes, setPartTypes] = useState<PartType[]>([]);
  const [allVariants, setAllVariants] = useState<Record<string, Part[]>>({});
  const [selected, setSelected] = useState<Partial<Record<PartTypeId, Part>>>({});
  const [activePart, setActivePart] = useState<PartTypeId>("hoju");
  const [hoveredPart, setHoveredPart] = useState<PartTypeId | null>(null);
  const [viewMode, setViewMode] = useState<"blueprint" | "3d">("blueprint");
  const [saving, setSaving] = useState(false);
  const [designName, setDesignName] = useState("");
  const [showSave, setShowSave] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const types = await api.getPartTypes();
        setPartTypes(types);

        const variants: Record<string, Part[]> = {};
        for (const t of PART_IDS) {
          variants[t] = await api.getParts(t);
        }
        setAllVariants(variants);

        if (shouldRandomize) {
          const randomParts: Partial<Record<PartTypeId, Part>> = {};
          for (const t of PART_IDS) {
            const v = variants[t];
            if (v && v.length > 0) {
              randomParts[t] = v[Math.floor(Math.random() * v.length)];
            }
          }
          setSelected(randomParts);
        }
      } catch {
        /* API not running */
      }
    }
    load();
  }, [shouldRandomize]);

  const randomizeAll = () => {
    const randomParts: Partial<Record<PartTypeId, Part>> = {};
    for (const t of PART_IDS) {
      const v = allVariants[t];
      if (v && v.length > 0) {
        randomParts[t] = v[Math.floor(Math.random() * v.length)];
      }
    }
    setSelected(randomParts);
  };

  const allSelected = PART_IDS.every((id) => selected[id]);

  const saveDesign = async () => {
    if (!allSelected || !designName.trim()) return;
    setSaving(true);
    try {
      const result = await api.saveDesign({
        name: designName.trim(),
        hoju_id: selected.hoju!.id,
        kasa_id: selected.kasa!.id,
        hibukuro_id: selected.hibukuro!.id,
        chudai_id: selected.chudai!.id,
        sao_id: selected.sao!.id,
        kiso_id: selected.kiso!.id,
      });
      router.push(`/design/${result.id}`);
    } catch {
      /* handle */
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen relative">
      <CornerEmbellishment position="top-left" />
      <CornerEmbellishment position="top-right" />
      <CornerEmbellishment position="bottom-left" />
      <CornerEmbellishment position="bottom-right" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
            >
              &larr; Gallery
            </Link>
            <div className="h-4 w-px bg-stone-800" />
            <h1 className="text-lg font-light text-stone-200 tracking-wide">
              Builder
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={randomizeAll}
              className="text-xs text-stone-500 hover:text-stone-300 border border-stone-800 hover:border-stone-600 px-3 py-1.5 transition-all uppercase tracking-wider"
            >
              Randomize All
            </button>
            <div className="flex border border-stone-800">
              <button
                onClick={() => setViewMode("blueprint")}
                className={`text-xs px-3 py-1.5 transition-colors ${
                  viewMode === "blueprint"
                    ? "bg-stone-800 text-stone-200"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                Blueprint
              </button>
              <button
                onClick={() => setViewMode("3d")}
                className={`text-xs px-3 py-1.5 transition-colors ${
                  viewMode === "3d"
                    ? "bg-stone-800 text-stone-200"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                3D
              </button>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Preview */}
          <div className="aspect-[3/4] max-h-[75vh] border border-stone-800 relative overflow-hidden bg-slate-950">
            {viewMode === "blueprint" ? (
              <BlueprintSketch parts={selected} />
            ) : (
              <LanternViewer
                parts={selected}
                hoveredPart={hoveredPart}
                onHoverPart={setHoveredPart}
                onClickPart={setActivePart}
              />
            )}
          </div>

          {/* Part selectors */}
          <div className="space-y-2">
            <div className="mb-4">
              <h2 className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-1">
                Select Parts
              </h2>
              <p className="text-[10px] text-stone-600">
                Choose one variant for each of the six sections, top to bottom.
              </p>
            </div>

            {PART_IDS.map((id) => {
              const pt = partTypes.find((t) => t.id === id);
              if (!pt) return null;
              return (
                <PartSelector
                  key={id}
                  partType={pt}
                  variants={allVariants[id] || []}
                  selected={selected[id] || null}
                  onSelect={(part) =>
                    setSelected((prev) => ({ ...prev, [id]: part }))
                  }
                  isActive={activePart === id}
                  onActivate={() => setActivePart(id)}
                />
              );
            })}

            {/* Save */}
            {allSelected && (
              <div className="mt-4 pt-4 border-t border-stone-800">
                {!showSave ? (
                  <button
                    onClick={() => setShowSave(true)}
                    className="w-full py-3 border border-stone-600 hover:border-stone-400 text-sm text-stone-200 hover:text-stone-50 transition-all uppercase tracking-widest"
                  >
                    Save Design
                  </button>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={designName}
                      onChange={(e) => setDesignName(e.target.value)}
                      placeholder="Name your lantern..."
                      className="w-full bg-stone-900 border border-stone-700 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 focus:border-stone-500 focus:outline-none"
                    />
                    <button
                      onClick={saveDesign}
                      disabled={saving || !designName.trim()}
                      className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-sm text-stone-200 transition-colors uppercase tracking-widest disabled:opacity-40"
                    >
                      {saving ? "Saving..." : "Confirm"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-sm text-stone-600 animate-pulse">Loading...</span>
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}
