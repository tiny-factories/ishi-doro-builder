import type { PartType, Part, Design, Schematics } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getPartTypes: () => fetcher<PartType[]>("/api/part-types"),
  getParts: (typeId: string) => fetcher<Part[]>(`/api/parts/${typeId}`),
  getAllParts: () => fetcher<Part[]>("/api/parts"),
  getPart: (id: string) => fetcher<Part>(`/api/part/${id}`),
  getDesigns: () => fetcher<Design[]>("/api/designs"),
  getDesign: (id: string) => fetcher<Design>(`/api/designs/${id}`),
  getSchematics: (designId: string) => fetcher<Schematics>(`/api/export/schematics/${designId}`),
  getPrinterExportUrl: (designId: string) => `${API_BASE}/api/export/printer/${designId}`,

  saveDesign: async (design: {
    name: string;
    description?: string;
    style?: string;
    hoju_id: string;
    kasa_id: string;
    hibukuro_id: string;
    chudai_id: string;
    sao_id: string;
    kiso_id: string;
  }) => {
    const res = await fetch(`${API_BASE}/api/designs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(design),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json() as Promise<{ id: string }>;
  },
};
