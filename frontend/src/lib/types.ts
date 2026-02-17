export interface PartType {
  id: string;
  name_en: string;
  name_jp: string;
  kanji: string;
  description: string;
  order_index: number;
  element: string | null;
}

export interface GeometryParams {
  shape: string;
  height: number;
  radius: number;
  sides?: number;
  segments?: number;
  petalCount?: number;
  twist?: number;
  overhang?: number;
  curvature?: number;
  windowShape?: string;
  windowCount?: number;
  wallThickness?: number;
  cornerDetail?: boolean;
  taper?: number;
  legCount?: number;
  tilt?: number;
  buriedRatio?: number;
  irregularity?: number;
  tiers?: number;
  chamfer?: number;
}

export interface Part {
  id: string;
  type_id: string;
  name: string;
  style: string;
  description: string | null;
  geometry_params: GeometryParams;
  history: string | null;
  era: string | null;
  created_at: string;
}

export interface Design {
  id: string;
  name: string;
  description: string | null;
  style: string | null;
  hoju_id: string | null;
  kasa_id: string | null;
  hibukuro_id: string | null;
  chudai_id: string | null;
  sao_id: string | null;
  kiso_id: string | null;
  parts?: Record<string, Part>;
  created_at: string;
}

export interface SchematicStep {
  step: number;
  part_type: {
    id: string;
    name_en: string;
    name_jp: string;
    kanji: string;
    element: string;
  };
  part: {
    name: string;
    style: string;
    geometry: GeometryParams;
  } | null;
  instruction: string;
}

export interface Schematics {
  design_name: string;
  total_steps: number;
  note: string;
  steps: SchematicStep[];
}

export const PART_TYPE_IDS = ["hoju", "kasa", "hibukuro", "chudai", "sao", "kiso"] as const;
export type PartTypeId = (typeof PART_TYPE_IDS)[number];
