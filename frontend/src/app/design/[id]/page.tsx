"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Design, Part, PartType, PartTypeId } from "@/lib/types";
import CornerEmbellishment from "@/components/CornerEmbellishment";
import BlueprintSketch from "@/components/BlueprintSketch";
import ExportPanel from "@/components/ExportPanel";

const LanternViewer = dynamic(() => import("@/components/LanternViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-stone-950">
      <span className="text-sm text-stone-600 animate-pulse">Loading 3D...</span>
    </div>
  ),
});

const PART_IDS: PartTypeId[] = ["hoju", "kasa", "hibukuro", "chudai", "sao", "kiso"];

export default function DesignDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [design, setDesign] = useState<Design | null>(null);
  const [partTypes, setPartTypes] = useState<PartType[]>([]);
  const [viewMode, setViewMode] = useState<"blueprint" | "3d">("blueprint");
  const [hoveredPart, setHoveredPart] = useState<PartTypeId | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<PartTypeId | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [d, types] = await Promise.all([
          api.getDesign(id),
          api.getPartTypes(),
        ]);
        setDesign(d);
        setPartTypes(types);
      } catch {
        /* handle */
      }
    }
    load();
  }, [id]);

  if (!design) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-sm text-stone-600 animate-pulse">Loading...</span>
      </div>
    );
  }

  const parts = (design.parts || {}) as Partial<Record<PartTypeId, Part>>;
  const detailPart = selectedDetail ? parts[selectedDetail] : null;
  const detailType = selectedDetail
    ? partTypes.find((t) => t.id === selectedDetail)
    : null;

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
              {design.name}
            </h1>
            {design.style && (
              <span className="text-[10px] text-stone-600 uppercase tracking-widest">
                {design.style}
              </span>
            )}
          </div>

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

        {design.description && (
          <p className="text-sm text-stone-400 mb-8 max-w-2xl leading-relaxed">
            {design.description}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Main preview */}
          <div className="aspect-[3/4] max-h-[75vh] border border-stone-800 relative overflow-hidden bg-slate-950">
            {viewMode === "blueprint" ? (
              <BlueprintSketch parts={parts} />
            ) : (
              <LanternViewer
                parts={parts}
                hoveredPart={hoveredPart}
                onHoverPart={setHoveredPart}
                onClickPart={setSelectedDetail}
              />
            )}
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Parts list */}
            <div className="border border-stone-800 bg-stone-950/50">
              <div className="px-4 py-3 border-b border-stone-800">
                <h3 className="text-xs uppercase tracking-widest text-stone-400">
                  Components
                </h3>
              </div>

              <div className="divide-y divide-stone-800/50">
                {PART_IDS.map((pid) => {
                  const part = parts[pid];
                  const pt = partTypes.find((t) => t.id === pid);
                  if (!part || !pt) return null;

                  const isSelected = selectedDetail === pid;

                  return (
                    <button
                      key={pid}
                      onClick={() =>
                        setSelectedDetail(isSelected ? null : pid)
                      }
                      onMouseEnter={() => setHoveredPart(pid)}
                      onMouseLeave={() => setHoveredPart(null)}
                      className={`w-full px-4 py-3 text-left transition-colors ${
                        isSelected
                          ? "bg-stone-800/50"
                          : hoveredPart === pid
                          ? "bg-stone-900/50"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg text-stone-500">{pt.kanji}</span>
                          <div>
                            <div className="text-sm text-stone-200">{part.name}</div>
                            <div className="text-[10px] text-stone-500">
                              {pt.name_en} &middot; {pt.name_jp}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-600 uppercase">
                          {part.style}
                        </span>
                      </div>

                      {/* Expanded detail */}
                      {isSelected && (
                        <div className="mt-3 pl-8 space-y-2">
                          {part.description && (
                            <p className="text-xs text-stone-400 leading-relaxed">
                              {part.description}
                            </p>
                          )}
                          {part.history && (
                            <div className="border-l border-stone-700 pl-3">
                              <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">
                                History
                              </p>
                              <p className="text-xs text-stone-400 leading-relaxed">
                                {part.history}
                              </p>
                              {part.era && (
                                <p className="text-[10px] text-stone-600 mt-1">
                                  {part.era}
                                </p>
                              )}
                            </div>
                          )}
                          {pt.element && (
                            <p className="text-[10px] text-stone-600">
                              Element: {pt.element}
                            </p>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Export panel */}
            <ExportPanel designId={id} />
          </div>
        </div>
      </div>
    </main>
  );
}
