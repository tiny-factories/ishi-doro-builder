const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const { getDb } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const db = getDb();

/* ── Part Types ── */
app.get("/api/part-types", (_req, res) => {
  const types = db.prepare("SELECT * FROM part_types ORDER BY order_index").all();
  res.json(types);
});

/* ── Parts by type ── */
app.get("/api/parts/:typeId", (req, res) => {
  const parts = db
    .prepare("SELECT * FROM parts WHERE type_id = ? ORDER BY name")
    .all(req.params.typeId);
  res.json(parts.map((p) => ({ ...p, geometry_params: JSON.parse(p.geometry_params) })));
});

/* ── All parts ── */
app.get("/api/parts", (_req, res) => {
  const parts = db.prepare("SELECT * FROM parts ORDER BY type_id, name").all();
  res.json(parts.map((p) => ({ ...p, geometry_params: JSON.parse(p.geometry_params) })));
});

/* ── Single part ── */
app.get("/api/part/:id", (req, res) => {
  const part = db.prepare("SELECT * FROM parts WHERE id = ?").get(req.params.id);
  if (!part) return res.status(404).json({ error: "Part not found" });
  res.json({ ...part, geometry_params: JSON.parse(part.geometry_params) });
});

/* ── Designs ── */
app.get("/api/designs", (_req, res) => {
  const designs = db.prepare("SELECT * FROM designs ORDER BY created_at DESC").all();
  res.json(designs);
});

app.get("/api/designs/:id", (req, res) => {
  const design = db.prepare("SELECT * FROM designs WHERE id = ?").get(req.params.id);
  if (!design) return res.status(404).json({ error: "Design not found" });

  const partTypeIds = ["hoju", "kasa", "hibukuro", "chudai", "sao", "kiso"];
  const parts = {};
  for (const t of partTypeIds) {
    const pid = design[`${t}_id`];
    if (pid) {
      const p = db.prepare("SELECT * FROM parts WHERE id = ?").get(pid);
      if (p) parts[t] = { ...p, geometry_params: JSON.parse(p.geometry_params) };
    }
  }

  res.json({ ...design, parts });
});

/* ── Save a custom design ── */
app.post("/api/designs", (req, res) => {
  const { name, description, style, hoju_id, kasa_id, hibukuro_id, chudai_id, sao_id, kiso_id } =
    req.body;
  const id = uuid();
  db.prepare(
    `INSERT INTO designs (id, name, description, style, hoju_id, kasa_id, hibukuro_id, chudai_id, sao_id, kiso_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, name, description || null, style || "custom", hoju_id, kasa_id, hibukuro_id, chudai_id, sao_id, kiso_id);
  res.status(201).json({ id });
});

/* ── Export: IKEA-style assembly schematics (JSON) ── */
app.get("/api/export/schematics/:designId", (req, res) => {
  const design = db.prepare("SELECT * FROM designs WHERE id = ?").get(req.params.designId);
  if (!design) return res.status(404).json({ error: "Design not found" });

  const partTypeIds = ["kiso", "sao", "chudai", "hibukuro", "kasa", "hoju"];
  const typeInfo = db.prepare("SELECT * FROM part_types ORDER BY order_index").all();
  const steps = [];

  for (let i = 0; i < partTypeIds.length; i++) {
    const t = partTypeIds[i];
    const pid = design[`${t}_id`];
    const typeData = typeInfo.find((ti) => ti.id === t);
    let partData = null;
    if (pid) {
      partData = db.prepare("SELECT * FROM parts WHERE id = ?").get(pid);
      if (partData) partData.geometry_params = JSON.parse(partData.geometry_params);
    }

    steps.push({
      step: i + 1,
      part_type: {
        id: t,
        name_en: typeData?.name_en,
        name_jp: typeData?.name_jp,
        kanji: typeData?.kanji,
        element: typeData?.element,
      },
      part: partData
        ? {
            name: partData.name,
            style: partData.style,
            geometry: partData.geometry_params,
          }
        : null,
      instruction:
        i === 0
          ? `Place the ${typeData?.name_en} (${typeData?.kanji}) on a level surface as the foundation.`
          : `Stack the ${typeData?.name_en} (${typeData?.kanji}) centered on top of the ${partTypeIds[i - 1]}.`,
    });
  }

  res.json({
    design_name: design.name,
    total_steps: steps.length,
    note: "All parts are stacked vertically. Ensure each layer is centered and level before placing the next.",
    steps,
  });
});

/* ── Export: 3D printer / ceramic code (OpenSCAD-style) ── */
app.get("/api/export/printer/:designId", (req, res) => {
  const design = db.prepare("SELECT * FROM designs WHERE id = ?").get(req.params.designId);
  if (!design) return res.status(404).json({ error: "Design not found" });

  const partTypeIds = ["kiso", "sao", "chudai", "hibukuro", "kasa", "hoju"];
  const scadParts = [];
  let yOffset = 0;

  for (const t of partTypeIds) {
    const pid = design[`${t}_id`];
    if (!pid) continue;
    const partData = db.prepare("SELECT * FROM parts WHERE id = ?").get(pid);
    if (!partData) continue;
    const g = JSON.parse(partData.geometry_params);

    const sides = g.sides || 6;
    const r = g.radius || 0.3;
    const h = g.height || 0.3;

    let scad;
    if (sides >= 16) {
      scad = `translate([0, 0, ${yOffset.toFixed(3)}]) cylinder(h=${h}, r1=${r}, r2=${(r * 0.9).toFixed(3)}, $fn=${sides});`;
    } else {
      scad = `translate([0, 0, ${yOffset.toFixed(3)}]) cylinder(h=${h}, r=${r}, $fn=${sides});`;
    }

    scadParts.push(`// ${partData.name} (${t})\n${scad}`);
    yOffset += h;
  }

  const scadCode = [
    `// Ishi-dōrō: ${design.name}`,
    `// Generated by Ishi-dōrō Builder`,
    `// Total height: ${yOffset.toFixed(3)} units`,
    `// Scale to desired size (e.g., scale([100,100,100]) for 100mm)`,
    "",
    `module ishi_doro() {`,
    scadParts.map((s) => "  " + s.replace(/\n/g, "\n  ")).join("\n\n"),
    `}`,
    "",
    `ishi_doro();`,
  ].join("\n");

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", `attachment; filename="${design.name.replace(/\s+/g, "_")}.scad"`);
  res.send(scadCode);
});

app.listen(PORT, () => {
  console.log(`Ishi-dōrō API running on port ${PORT}`);
});
