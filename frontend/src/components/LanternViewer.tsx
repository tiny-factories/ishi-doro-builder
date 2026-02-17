"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import type { Part, PartTypeId } from "@/lib/types";

function createPartGeometry(part: Part): THREE.BufferGeometry {
  const g = part.geometry_params;
  const sides = g.sides || g.segments || 6;
  const r = g.radius || 0.3;
  const h = g.height || 0.3;
  const shape = g.shape || "";

  if (shape.includes("roof") || shape.includes("bud") || shape.includes("flame") || shape.includes("onion")) {
    return new THREE.ConeGeometry(r, h, sides);
  }

  if (shape.includes("legs")) {
    return new THREE.TorusGeometry(r * 0.6, r * 0.15, 8, g.legCount || 3);
  }

  if (sides >= 16) {
    return new THREE.CylinderGeometry(r * 0.9, r, h, sides);
  }

  return new THREE.CylinderGeometry(r, r, h, sides);
}

function LanternPart({
  part,
  yOffset,
  hovered,
  onHover,
  onUnhover,
  onClick,
}: {
  part: Part;
  yOffset: number;
  hovered: boolean;
  onHover: () => void;
  onUnhover: () => void;
  onClick: () => void;
}) {
  const geometry = useMemo(() => createPartGeometry(part), [part]);
  const h = part.geometry_params.height || 0.3;

  return (
    <mesh
      geometry={geometry}
      position={[0, yOffset + h / 2, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover();
      }}
      onPointerOut={onUnhover}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <meshStandardMaterial
        color={hovered ? "#d4a574" : "#8b8680"}
        roughness={0.85}
        metalness={0.05}
        emissive={hovered ? "#3d2b1f" : "#000000"}
        emissiveIntensity={hovered ? 0.2 : 0}
      />
    </mesh>
  );
}

export default function LanternViewer({
  parts,
  hoveredPart,
  onHoverPart,
  onClickPart,
  className = "",
}: {
  parts: Partial<Record<PartTypeId, Part>>;
  hoveredPart: PartTypeId | null;
  onHoverPart: (id: PartTypeId | null) => void;
  onClickPart: (id: PartTypeId) => void;
  className?: string;
}) {
  const order: PartTypeId[] = ["kiso", "sao", "chudai", "hibukuro", "kasa", "hoju"];
  const stack: { id: PartTypeId; part: Part; yOffset: number }[] = [];
  let yOffset = 0;

  for (const id of order) {
    const part = parts[id];
    if (!part) continue;
    stack.push({ id, part, yOffset });
    yOffset += part.geometry_params.height || 0.3;
  }

  const centerY = yOffset / 2;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [2.5, 2, 2.5], fov: 35 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
        <directionalLight position={[-3, 4, -3]} intensity={0.3} />

        <group position={[0, -centerY, 0]}>
          {stack.map(({ id, part, yOffset: yo }) => (
            <LanternPart
              key={id}
              part={part}
              yOffset={yo}
              hovered={hoveredPart === id}
              onHover={() => onHoverPart(id)}
              onUnhover={() => onHoverPart(null)}
              onClick={() => onClickPart(id)}
            />
          ))}
        </group>

        <ContactShadows
          position={[0, -centerY - 0.01, 0]}
          opacity={0.4}
          scale={4}
          blur={2}
        />
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.5}
        />
        <Environment preset="apartment" />
      </Canvas>
    </div>
  );
}
