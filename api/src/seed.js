const { getDb } = require("./db");
const { v4: uuid } = require("uuid");

const db = getDb();

/* ── Part Types (the 6 sections, top to bottom) ── */
const partTypes = [
  {
    id: "hoju",
    name_en: "Finial",
    name_jp: "Hōju",
    kanji: "宝珠",
    description: "The decorative jewel or bud at the very top, often shaped as a lotus bud or onion dome. Represents kū (void/spirit).",
    order_index: 0,
    element: "kū (空) void",
  },
  {
    id: "kasa",
    name_en: "Cap",
    name_jp: "Kasa",
    kanji: "笠",
    description: "The umbrella-shaped roof protecting the fire box. Can be hexagonal, square, or round. Represents fū (wind/air).",
    order_index: 1,
    element: "fū (風) wind",
  },
  {
    id: "hibukuro",
    name_en: "Fire Box",
    name_jp: "Hibukuro",
    kanji: "火袋",
    description: "The enclosed chamber where the flame is placed. Features carved openings for light to escape. Represents ka (fire).",
    order_index: 2,
    element: "ka (火) fire",
  },
  {
    id: "chudai",
    name_en: "Middle Platform",
    name_jp: "Chūdai",
    kanji: "中台",
    description: "The platform between fire box and shaft, often decorated with lotus petals. Represents sui (water).",
    order_index: 3,
    element: "sui (水) water",
  },
  {
    id: "sao",
    name_en: "Shaft",
    name_jp: "Sao",
    kanji: "竿",
    description: "The tall pillar connecting the upper lantern to the base. Can be cylindrical, hexagonal, or carved. Represents chi (earth).",
    order_index: 4,
    element: "chi (地) earth",
  },
  {
    id: "kiso",
    name_en: "Base",
    name_jp: "Kiso",
    kanji: "基礎",
    description: "The foundation stone providing stability. Often hexagonal or circular with carved feet.",
    order_index: 5,
    element: "chi (地) earth",
  },
];

/* ── Part Variants ── */
const partVariants = {
  hoju: [
    {
      name: "Lotus Bud",
      style: "kasuga",
      description: "Classic closed lotus bud finial",
      history: "Standard form seen in Kasuga shrine lanterns since the Nara period.",
      era: "Nara (710–794)",
      geometry_params: JSON.stringify({
        shape: "lotus_bud",
        height: 0.35,
        radius: 0.15,
        segments: 8,
        petalCount: 8,
      }),
    },
    {
      name: "Flame Jewel",
      style: "yukimi",
      description: "Flame-shaped hōshu with swirling tip",
      history: "Evolved in the Muromachi period tea gardens as a more dynamic form.",
      era: "Muromachi (1336–1573)",
      geometry_params: JSON.stringify({
        shape: "flame",
        height: 0.4,
        radius: 0.12,
        segments: 12,
        twist: 0.3,
      }),
    },
    {
      name: "Onion Dome",
      style: "oribe",
      description: "Rounded onion-shaped crown",
      history: "Influenced by continental forms brought via Korean artisans.",
      era: "Azuchi-Momoyama (1568–1600)",
      geometry_params: JSON.stringify({
        shape: "onion",
        height: 0.3,
        radius: 0.18,
        segments: 16,
      }),
    },
  ],
  kasa: [
    {
      name: "Hexagonal Roof",
      style: "kasuga",
      description: "Six-sided sloped roof with curved eaves",
      history: "The hexagonal form is the most traditional, seen at Kasuga Grand Shrine.",
      era: "Nara (710–794)",
      geometry_params: JSON.stringify({
        shape: "hexagonal_roof",
        height: 0.3,
        radius: 0.65,
        sides: 6,
        overhang: 0.12,
        curvature: 0.08,
      }),
    },
    {
      name: "Round Snow-Viewing Cap",
      style: "yukimi",
      description: "Wide, flat circular roof designed to hold snow",
      history: "Yukimi-dōrō caps are broad and flat to cradle snow beautifully in winter gardens.",
      era: "Edo (1603–1868)",
      geometry_params: JSON.stringify({
        shape: "round_flat",
        height: 0.18,
        radius: 0.8,
        sides: 32,
        overhang: 0.2,
        curvature: 0.04,
      }),
    },
    {
      name: "Square Pagoda Roof",
      style: "oribe",
      description: "Four-sided roof with upturned corners",
      history: "Drawn from pagoda architecture, common in Oribe-style lanterns.",
      era: "Azuchi-Momoyama (1568–1600)",
      geometry_params: JSON.stringify({
        shape: "square_roof",
        height: 0.28,
        radius: 0.6,
        sides: 4,
        overhang: 0.15,
        curvature: 0.1,
      }),
    },
  ],
  hibukuro: [
    {
      name: "Hexagonal Fire Box",
      style: "kasuga",
      description: "Six-sided chamber with moon and sun windows",
      history: "Traditional Kasuga form features crescent moon and circular sun openings on alternating panels.",
      era: "Nara (710–794)",
      geometry_params: JSON.stringify({
        shape: "hexagonal_box",
        height: 0.45,
        radius: 0.35,
        sides: 6,
        windowShape: "moon_sun",
        wallThickness: 0.04,
      }),
    },
    {
      name: "Round Chamber",
      style: "yukimi",
      description: "Cylindrical fire box with four arched openings",
      history: "Snow-viewing lanterns use open designs so flame light reflects off fallen snow.",
      era: "Edo (1603–1868)",
      geometry_params: JSON.stringify({
        shape: "cylinder_box",
        height: 0.4,
        radius: 0.3,
        sides: 32,
        windowShape: "arch",
        windowCount: 4,
        wallThickness: 0.035,
      }),
    },
    {
      name: "Square Lattice Box",
      style: "oribe",
      description: "Four-sided fire box with lattice-carved panels",
      history: "Oribe Furuta's tea aesthetic favored geometric lattice patterns.",
      era: "Azuchi-Momoyama (1568–1600)",
      geometry_params: JSON.stringify({
        shape: "square_box",
        height: 0.42,
        radius: 0.32,
        sides: 4,
        windowShape: "lattice",
        wallThickness: 0.04,
      }),
    },
  ],
  chudai: [
    {
      name: "Lotus Platform",
      style: "kasuga",
      description: "Hexagonal platform with inverted lotus petal carving",
      history: "The lotus platform symbolizes Buddhist purity, connecting earth and fire elements.",
      era: "Nara (710–794)",
      geometry_params: JSON.stringify({
        shape: "lotus_platform",
        height: 0.15,
        radius: 0.38,
        sides: 6,
        petalCount: 12,
      }),
    },
    {
      name: "Flat Disc",
      style: "yukimi",
      description: "Simple round disc platform",
      history: "Minimalist form preferred in later tea garden aesthetics.",
      era: "Edo (1603–1868)",
      geometry_params: JSON.stringify({
        shape: "disc",
        height: 0.08,
        radius: 0.35,
        sides: 32,
      }),
    },
    {
      name: "Carved Square Slab",
      style: "oribe",
      description: "Square platform with corner scroll carvings",
      history: "Oribe style features bold geometric carving on support elements.",
      era: "Azuchi-Momoyama (1568–1600)",
      geometry_params: JSON.stringify({
        shape: "square_slab",
        height: 0.12,
        radius: 0.36,
        sides: 4,
        cornerDetail: true,
      }),
    },
  ],
  sao: [
    {
      name: "Tall Hexagonal Shaft",
      style: "kasuga",
      description: "Slender hexagonal pillar, often the tallest part",
      history: "The tall shaft of the Kasuga lantern gives it a stately, towering presence along shrine paths.",
      era: "Nara (710–794)",
      geometry_params: JSON.stringify({
        shape: "hexagonal_shaft",
        height: 0.8,
        radius: 0.14,
        sides: 6,
        taper: 0.02,
      }),
    },
    {
      name: "Short Curved Legs",
      style: "yukimi",
      description: "Three or four curved legs replacing a single shaft",
      history: "Yukimi-dōrō sit low to the ground with curved legs straddling water or moss.",
      era: "Edo (1603–1868)",
      geometry_params: JSON.stringify({
        shape: "curved_legs",
        height: 0.35,
        radius: 0.3,
        legCount: 3,
        curvature: 0.15,
      }),
    },
    {
      name: "Buried Post",
      style: "oribe",
      description: "Shaft partially buried in the ground at an angle",
      history: "Oribe lanterns are distinctively planted directly in the earth at a slight lean.",
      era: "Azuchi-Momoyama (1568–1600)",
      geometry_params: JSON.stringify({
        shape: "buried_post",
        height: 0.6,
        radius: 0.13,
        sides: 4,
        tilt: 0.05,
        buriedRatio: 0.3,
      }),
    },
  ],
  kiso: [
    {
      name: "Hexagonal Base",
      style: "kasuga",
      description: "Broad hexagonal stone base with tiered steps",
      history: "Kasuga bases mirror the hexagonal theme throughout, with three tiers of decreasing radius.",
      era: "Nara (710–794)",
      geometry_params: JSON.stringify({
        shape: "hexagonal_base",
        height: 0.25,
        radius: 0.45,
        sides: 6,
        tiers: 3,
      }),
    },
    {
      name: "Natural Stone",
      style: "yukimi",
      description: "Rough, irregular natural stone slab",
      history: "Snow-viewing lanterns often sit on natural, unworked stones to blend with the garden.",
      era: "Edo (1603–1868)",
      geometry_params: JSON.stringify({
        shape: "natural_stone",
        height: 0.15,
        radius: 0.5,
        irregularity: 0.3,
        segments: 24,
      }),
    },
    {
      name: "Square Pedestal",
      style: "oribe",
      description: "Clean square base with chamfered edges",
      history: "Geometric clarity in the base reflects Oribe's structured approach.",
      era: "Azuchi-Momoyama (1568–1600)",
      geometry_params: JSON.stringify({
        shape: "square_pedestal",
        height: 0.2,
        radius: 0.4,
        sides: 4,
        chamfer: 0.03,
      }),
    },
  ],
};

/* ── Insert ── */
const insertType = db.prepare(`
  INSERT OR REPLACE INTO part_types (id, name_en, name_jp, kanji, description, order_index, element)
  VALUES (@id, @name_en, @name_jp, @kanji, @description, @order_index, @element)
`);

const insertPart = db.prepare(`
  INSERT OR REPLACE INTO parts (id, type_id, name, style, description, geometry_params, history, era)
  VALUES (@id, @type_id, @name, @style, @description, @geometry_params, @history, @era)
`);

const insertDesign = db.prepare(`
  INSERT OR REPLACE INTO designs (id, name, description, style, hoju_id, kasa_id, hibukuro_id, chudai_id, sao_id, kiso_id)
  VALUES (@id, @name, @description, @style, @hoju_id, @kasa_id, @hibukuro_id, @chudai_id, @sao_id, @kiso_id)
`);

const partIds = {};

db.transaction(() => {
  for (const pt of partTypes) {
    insertType.run(pt);
  }

  for (const [typeId, variants] of Object.entries(partVariants)) {
    partIds[typeId] = [];
    for (const v of variants) {
      const id = uuid();
      partIds[typeId].push({ id, style: v.style });
      insertPart.run({
        id,
        type_id: typeId,
        name: v.name,
        style: v.style,
        description: v.description,
        geometry_params: v.geometry_params,
        history: v.history || null,
        era: v.era || null,
      });
    }
  }

  /* ── Pre-built designs ── */
  const byStyle = (typeId, style) =>
    partIds[typeId].find((p) => p.style === style)?.id;

  insertDesign.run({
    id: uuid(),
    name: "Kasuga-dōrō",
    description:
      "The classic tall lantern found lining the paths of Kasuga Grand Shrine in Nara. Stately hexagonal form throughout.",
    style: "kasuga",
    hoju_id: byStyle("hoju", "kasuga"),
    kasa_id: byStyle("kasa", "kasuga"),
    hibukuro_id: byStyle("hibukuro", "kasuga"),
    chudai_id: byStyle("chudai", "kasuga"),
    sao_id: byStyle("sao", "kasuga"),
    kiso_id: byStyle("kiso", "kasuga"),
  });

  insertDesign.run({
    id: uuid(),
    name: "Yukimi-dōrō",
    description:
      "The snow-viewing lantern, low and broad, designed to sit beside ponds and streams. Its wide cap cradles snow in winter.",
    style: "yukimi",
    hoju_id: byStyle("hoju", "yukimi"),
    kasa_id: byStyle("kasa", "yukimi"),
    hibukuro_id: byStyle("hibukuro", "yukimi"),
    chudai_id: byStyle("chudai", "yukimi"),
    sao_id: byStyle("sao", "yukimi"),
    kiso_id: byStyle("kiso", "yukimi"),
  });

  insertDesign.run({
    id: uuid(),
    name: "Oribe-dōrō",
    description:
      "Named after tea master Oribe Furuta. Distinguished by its buried shaft and square forms, blending bold geometry with wabi-sabi.",
    style: "oribe",
    hoju_id: byStyle("hoju", "oribe"),
    kasa_id: byStyle("kasa", "oribe"),
    hibukuro_id: byStyle("hibukuro", "oribe"),
    chudai_id: byStyle("chudai", "oribe"),
    sao_id: byStyle("sao", "oribe"),
    kiso_id: byStyle("kiso", "oribe"),
  });
})();

console.log("Seeded database with part types, variants, and pre-built designs.");
