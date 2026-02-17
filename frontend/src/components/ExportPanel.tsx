"use client";

import { useState } from "react";
import type { Schematics } from "@/lib/types";
import { api } from "@/lib/api";

export default function ExportPanel({ designId }: { designId: string }) {
  const [schematics, setSchematics] = useState<Schematics | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"none" | "schematics" | "printer">("none");

  const loadSchematics = async () => {
    setLoading(true);
    try {
      const data = await api.getSchematics(designId);
      setSchematics(data);
      setView("schematics");
    } catch {
      /* handle */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-stone-800 bg-stone-950/50">
      <div className="px-4 py-3 border-b border-stone-800">
        <h3 className="text-xs uppercase tracking-widest text-stone-400">Export</h3>
      </div>

      <div className="p-4 flex gap-2">
        <button
          onClick={loadSchematics}
          disabled={loading}
          className="flex-1 text-xs border border-stone-700 hover:border-stone-500 py-2 px-3 text-stone-300 hover:text-stone-100 transition-colors uppercase tracking-wider"
        >
          Assembly Schematics
        </button>
        <a
          href={api.getPrinterExportUrl(designId)}
          download
          className="flex-1 text-xs border border-stone-700 hover:border-stone-500 py-2 px-3 text-stone-300 hover:text-stone-100 transition-colors uppercase tracking-wider text-center"
        >
          Printer Code (.scad)
        </a>
      </div>

      {/* IKEA-style assembly schematics */}
      {view === "schematics" && schematics && (
        <div className="px-4 pb-4">
          <div className="border border-stone-800 p-4 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm text-stone-200 font-medium">
                {schematics.design_name}
              </h4>
              <span className="text-[10px] text-stone-500">
                {schematics.total_steps} steps
              </span>
            </div>

            <p className="text-xs text-stone-500 mb-4 italic">
              {schematics.note}
            </p>

            <div className="space-y-4">
              {schematics.steps.map((step) => (
                <div
                  key={step.step}
                  className="flex gap-4 items-start"
                >
                  {/* Step number circle */}
                  <div className="w-8 h-8 rounded-full border border-stone-600 flex items-center justify-center text-sm text-stone-300 flex-shrink-0 mt-0.5">
                    {step.step}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-stone-200">
                        {step.part_type.kanji} {step.part_type.name_en}
                      </span>
                      {step.part && (
                        <span className="text-[10px] text-stone-500">
                          ({step.part.name})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      {step.instruction}
                    </p>
                    {step.part?.geometry && (
                      <div className="mt-1 flex gap-3">
                        <span className="text-[10px] text-stone-600">
                          h: {step.part.geometry.height}
                        </span>
                        <span className="text-[10px] text-stone-600">
                          r: {step.part.geometry.radius}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Simple icon */}
                  <div className="w-12 h-12 border border-stone-800 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-stone-600">
                      {step.step === 1 && (
                        <rect x="4" y="16" width="16" height="4" fill="currentColor" rx="1" />
                      )}
                      {step.step === 2 && (
                        <rect x="9" y="6" width="6" height="14" fill="currentColor" rx="1" />
                      )}
                      {step.step === 3 && (
                        <rect x="6" y="14" width="12" height="3" fill="currentColor" rx="1" />
                      )}
                      {step.step === 4 && (
                        <rect x="5" y="8" width="14" height="8" fill="currentColor" rx="1" />
                      )}
                      {step.step === 5 && (
                        <polygon points="12,4 22,14 2,14" fill="currentColor" />
                      )}
                      {step.step === 6 && (
                        <polygon points="12,2 15,8 9,8" fill="currentColor" />
                      )}
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Downward arrows between steps for visual flow */}
            <div className="mt-6 flex justify-center">
              <svg viewBox="0 0 40 20" className="w-10 h-5 text-stone-600">
                <polygon points="20,18 8,6 32,6" fill="currentColor" />
              </svg>
            </div>
            <p className="text-center text-[10px] text-stone-600 uppercase tracking-widest mt-1">
              Assembly Complete
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
