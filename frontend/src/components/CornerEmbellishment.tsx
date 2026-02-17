"use client";

/**
 * Decorative corner accents inspired by ishi-doro motifs:
 * lotus petals, cloud scrolls, and geometric patterns.
 */
export default function CornerEmbellishment({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const rotations: Record<string, string> = {
    "top-left": "rotate(0)",
    "top-right": "rotate(90)",
    "bottom-right": "rotate(180)",
    "bottom-left": "rotate(270)",
  };

  const positions: Record<string, string> = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
  };

  return (
    <div
      className={`absolute ${positions[position]} w-16 h-16 pointer-events-none opacity-30`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: rotations[position] }}
        className="w-full h-full"
      >
        {/* Cloud scroll / karakusa-inspired corner */}
        <path
          d="M0 0 L24 0 C20 4 16 10 16 16 C16 22 20 26 24 28 C18 28 12 24 8 18 C6 22 6 28 10 32 C4 28 0 20 0 12 Z"
          fill="currentColor"
          className="text-stone-600"
        />
        {/* Lotus petal accent */}
        <path
          d="M0 0 Q8 8 4 16 Q0 8 0 0Z"
          fill="currentColor"
          className="text-stone-400"
        />
        {/* Fine line detail */}
        <line x1="0" y1="24" x2="24" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-stone-500" />
        <line x1="0" y1="32" x2="32" y2="0" stroke="currentColor" strokeWidth="0.3" className="text-stone-400" />
      </svg>
    </div>
  );
}
