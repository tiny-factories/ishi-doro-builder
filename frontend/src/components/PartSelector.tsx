"use client";

import { useState } from "react";
import type { Part, PartType, PartTypeId } from "@/lib/types";

export default function PartSelector({
  partType,
  variants,
  selected,
  onSelect,
  isActive,
  onActivate,
}: {
  partType: PartType;
  variants: Part[];
  selected: Part | null;
  onSelect: (part: Part) => void;
  isActive: boolean;
  onActivate: () => void;
}) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div
      className={`border transition-all duration-300 ${
        isActive
          ? "border-stone-400 bg-stone-900/80"
          : "border-stone-800 bg-stone-950/50 hover:border-stone-600"
      }`}
    >
      {/* Header */}
      <button
        onClick={onActivate}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl text-stone-500 font-serif">{partType.kanji}</span>
          <div>
            <div className="text-sm font-medium text-stone-200">
              {partType.name_en}
            </div>
            <div className="text-xs text-stone-500">{partType.name_jp}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selected && (
            <span className="text-xs text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
              {selected.name}
            </span>
          )}
          {partType.element && (
            <span className="text-[10px] text-stone-600">{partType.element}</span>
          )}
        </div>
      </button>

      {/* Expanded panel */}
      {isActive && (
        <div className="px-4 pb-4 border-t border-stone-800">
          <p className="text-xs text-stone-500 mt-3 mb-3">{partType.description}</p>

          <div className="grid grid-cols-1 gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => onSelect(v)}
                className={`text-left p-3 border transition-all ${
                  selected?.id === v.id
                    ? "border-stone-400 bg-stone-800"
                    : "border-stone-800 hover:border-stone-600 bg-stone-900/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-200">{v.name}</span>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                    {v.style}
                  </span>
                </div>
                {v.description && (
                  <p className="text-xs text-stone-500 mt-1">{v.description}</p>
                )}

                {/* History panel */}
                {selected?.id === v.id && v.history && (
                  <div className="mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHistory(!showHistory);
                      }}
                      className="text-[10px] text-stone-400 hover:text-stone-300 uppercase tracking-widest"
                    >
                      {showHistory ? "— hide history" : "+ history"}
                    </button>
                    {showHistory && (
                      <div className="mt-2 pl-3 border-l border-stone-700">
                        <p className="text-xs text-stone-400 leading-relaxed">
                          {v.history}
                        </p>
                        {v.era && (
                          <p className="text-[10px] text-stone-600 mt-1">
                            Period: {v.era}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Randomize button */}
          <button
            onClick={() => {
              const rand = variants[Math.floor(Math.random() * variants.length)];
              onSelect(rand);
            }}
            className="mt-3 w-full text-xs text-stone-500 hover:text-stone-300 border border-stone-800 hover:border-stone-600 py-2 transition-colors uppercase tracking-widest"
          >
            Randomize
          </button>
        </div>
      )}
    </div>
  );
}
