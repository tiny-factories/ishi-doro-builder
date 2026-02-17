"use client";

import type { Part, PartTypeId } from "@/lib/types";

/**
 * Renders a blueprint-style 2D sketch of the ishi-doro from its parts.
 * Drawn as SVG with dashed construction lines, dimension annotations,
 * and a light cross-hatch fill — like an architectural drawing.
 */
export default function BlueprintSketch({
  parts,
  className = "",
}: {
  parts: Partial<Record<PartTypeId, Part>>;
  className?: string;
}) {
  const order: PartTypeId[] = ["kiso", "sao", "chudai", "hibukuro", "kasa", "hoju"];
  const svgW = 300;
  const svgH = 480;
  const cx = svgW / 2;

  let yBottom = svgH - 30;
  const sections: {
    id: PartTypeId;
    part: Part;
    x: number;
    y: number;
    w: number;
    h: number;
  }[] = [];

  for (const id of order) {
    const part = parts[id];
    if (!part) continue;
    const g = part.geometry_params;
    const drawH = g.height * 200;
    const drawW = g.radius * 300;
    const y = yBottom - drawH;
    sections.push({ id, part, x: cx - drawW, y, w: drawW * 2, h: drawH });
    yBottom = y;
  }

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      className={`w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Grid pattern for blueprint background */}
        <pattern id="bp-grid" width="15" height="15" patternUnits="userSpaceOnUse">
          <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#334155" strokeWidth="0.3" opacity="0.3" />
        </pattern>
        {/* Cross-hatch fill */}
        <pattern id="bp-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="0.4" opacity="0.4" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width={svgW} height={svgH} fill="#0f172a" />
      <rect width={svgW} height={svgH} fill="url(#bp-grid)" />

      {/* Center line */}
      <line
        x1={cx} y1="10" x2={cx} y2={svgH - 10}
        stroke="#475569" strokeWidth="0.5" strokeDasharray="4 4"
      />

      {sections.map(({ id, part, x, y, w, h }, i) => {
        const g = part.geometry_params;
        const sides = g.sides || 32;
        const isRound = sides >= 16;
        const isRoof = id === "kasa";
        const isFinial = id === "hoju";

        let shape;
        if (isFinial) {
          /* Pointed finial shape */
          shape = (
            <polygon
              points={`${cx},${y} ${x + w * 0.65},${y + h} ${x + w * 0.35},${y + h}`}
              fill="url(#bp-hatch)"
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        } else if (isRoof) {
          /* Sloped roof with overhang */
          const overhang = (g.overhang || 0.1) * 100;
          shape = (
            <polygon
              points={`${cx},${y} ${x + w + overhang},${y + h} ${x - overhang},${y + h}`}
              fill="url(#bp-hatch)"
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        } else if (isRound) {
          shape = (
            <ellipse
              cx={cx}
              cy={y + h / 2}
              rx={w / 2}
              ry={h / 2}
              fill="url(#bp-hatch)"
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        } else {
          shape = (
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill="url(#bp-hatch)"
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        }

        return (
          <g key={id}>
            {shape}
            {/* Dimension line on left */}
            <line
              x1={x - 16} y1={y} x2={x - 16} y2={y + h}
              stroke="#64748b" strokeWidth="0.5"
            />
            <line x1={x - 20} y1={y} x2={x - 12} y2={y} stroke="#64748b" strokeWidth="0.5" />
            <line x1={x - 20} y1={y + h} x2={x - 12} y2={y + h} stroke="#64748b" strokeWidth="0.5" />
            {/* Label */}
            <text
              x={x + w + 8}
              y={y + h / 2 + 4}
              fill="#94a3b8"
              fontSize="9"
              fontFamily="monospace"
            >
              {part.name}
            </text>
          </g>
        );
      })}

      {/* Title block */}
      <rect x="10" y={svgH - 26} width={svgW - 20} height="18" fill="none" stroke="#475569" strokeWidth="0.5" />
      <text x="16" y={svgH - 13} fill="#e2e8f0" fontSize="8" fontFamily="monospace">
        ISHI-DORO — STONE LANTERN BLUEPRINT
      </text>
    </svg>
  );
}
