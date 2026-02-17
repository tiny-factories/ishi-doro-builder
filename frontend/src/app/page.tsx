"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Design, Part, PartTypeId } from "@/lib/types";
import CornerEmbellishment from "@/components/CornerEmbellishment";
import BlueprintSketch from "@/components/BlueprintSketch";

export default function Home() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [designParts, setDesignParts] = useState<Record<string, Partial<Record<PartTypeId, Part>>>>({});
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const d = await api.getDesigns();
        setDesigns(d);

        const partsMap: Record<string, Partial<Record<PartTypeId, Part>>> = {};
        for (const design of d) {
          try {
            const full = await api.getDesign(design.id);
            if (full.parts) partsMap[design.id] = full.parts as Partial<Record<PartTypeId, Part>>;
          } catch {
            /* skip */
          }
        }
        setDesignParts(partsMap);
      } catch {
        /* API not running */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen relative">
      {/* Corner embellishments */}
      <CornerEmbellishment position="top-left" />
      <CornerEmbellishment position="top-right" />
      <CornerEmbellishment position="bottom-left" />
      <CornerEmbellishment position="bottom-right" />

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="text-center mb-20">
          <h1 className="text-4xl font-light tracking-wide text-stone-100 mb-2">
            石灯篭
          </h1>
          <p className="text-sm text-stone-500 tracking-[0.3em] uppercase mb-6">
            Ishi-doro Builder
          </p>
          <div className="w-16 h-px bg-stone-700 mx-auto mb-6" />
          <p className="text-sm text-stone-400 max-w-lg mx-auto leading-relaxed">
            Design Japanese stone lanterns from six classical parts.
            Choose from traditional forms or compose your own.
          </p>
        </header>

        {/* Actions */}
        <div className="flex justify-center gap-4 mb-16">
          <Link
            href="/builder"
            className="px-6 py-3 border border-stone-600 hover:border-stone-400 text-sm text-stone-200 hover:text-stone-50 transition-all uppercase tracking-widest"
          >
            Build Your Own
          </Link>
          <Link
            href="/builder?randomize=true"
            className="px-6 py-3 border border-stone-800 hover:border-stone-600 text-sm text-stone-400 hover:text-stone-200 transition-all uppercase tracking-widest"
          >
            Randomize
          </Link>
        </div>

        {/* Pre-built Gallery */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-stone-800" />
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500">
              Traditional Forms
            </h2>
            <div className="h-px flex-1 bg-stone-800" />
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-sm text-stone-600 animate-pulse">Loading...</p>
            </div>
          ) : designs.length === 0 ? (
            <div className="text-center py-20 border border-stone-800/50">
              <p className="text-sm text-stone-500 mb-2">
                No designs loaded yet.
              </p>
              <p className="text-xs text-stone-600">
                Start the Docker API container to load the parts database.
              </p>
              <code className="text-xs text-stone-600 block mt-2">
                docker compose up -d
              </code>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {designs.map((design) => (
                <Link
                  key={design.id}
                  href={`/design/${design.id}`}
                  onMouseEnter={() => setHoveredId(design.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group border border-stone-800 hover:border-stone-600 transition-all relative overflow-hidden"
                >
                  {/* Blueprint preview */}
                  <div className="aspect-[3/4] bg-slate-950 relative overflow-hidden">
                    {designParts[design.id] ? (
                      <BlueprintSketch parts={designParts[design.id]} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl text-stone-700">石</span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div
                      className={`absolute inset-0 bg-stone-950/60 flex items-center justify-center transition-opacity duration-300 ${
                        hoveredId === design.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <span className="text-xs uppercase tracking-widest text-stone-300 border border-stone-500 px-4 py-2">
                        View &amp; Explore
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-stone-200 mb-1">
                      {design.name}
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                      {design.description}
                    </p>
                    {design.style && (
                      <span className="inline-block mt-2 text-[10px] text-stone-600 uppercase tracking-widest">
                        {design.style} style
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center">
          <div className="w-8 h-px bg-stone-800 mx-auto mb-4" />
          <p className="text-[10px] text-stone-700 uppercase tracking-widest">
            Six parts &middot; Five elements &middot; One lantern
          </p>
        </footer>
      </div>
    </main>
  );
}
