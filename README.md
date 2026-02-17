# Ishi-doro Builder 石灯篭

Design and build Japanese stone lanterns from six classical parts.

## Parts (top to bottom)

| # | Part | Japanese | Kanji | Element |
|---|------|----------|-------|---------|
| 1 | Finial | Hoju | 宝珠 | Void (空) |
| 2 | Cap | Kasa | 笠 | Wind (風) |
| 3 | Fire Box | Hibukuro | 火袋 | Fire (火) |
| 4 | Middle Platform | Chudai | 中台 | Water (水) |
| 5 | Shaft | Sao | 竿 | Earth (地) |
| 6 | Base | Kiso | 基礎 | Earth (地) |

## Architecture

- **Frontend** — Next.js + Tailwind + React Three Fiber (deploy to Vercel)
- **API** — Express + SQLite in Docker (run locally)

## Getting Started

### 1. Start the API (Docker)

```sh
docker compose up -d
```

This runs the parts database API on `http://localhost:4000`.

### 2. Start the frontend

```sh
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Features

- **Gallery** — Browse pre-built traditional designs (Kasuga, Yukimi, Oribe)
- **Builder** — Pick one variant per part, or randomize
- **Blueprint view** — Architectural sketch-style 2D preview
- **3D view** — Interactive Three.js model with orbit controls
- **History** — Click into any part to see its historical context and era
- **Export: Schematics** — IKEA-style step-by-step assembly instructions (JSON)
- **Export: Printer** — OpenSCAD code for ceramic 3D printing

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/part-types` | List the 6 part types |
| GET | `/api/parts/:typeId` | Variants for a part type |
| GET | `/api/parts` | All parts |
| GET | `/api/designs` | All saved designs |
| GET | `/api/designs/:id` | Design with full part data |
| POST | `/api/designs` | Save a custom design |
| GET | `/api/export/schematics/:id` | Assembly schematics |
| GET | `/api/export/printer/:id` | OpenSCAD file download |
