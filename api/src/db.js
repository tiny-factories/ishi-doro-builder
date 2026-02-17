const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "data", "ishi-doro.db");

let db;

function getDb() {
  if (!db) {
    const fs = require("fs");
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
  }
  return db;
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS part_types (
      id TEXT PRIMARY KEY,
      name_en TEXT NOT NULL,
      name_jp TEXT NOT NULL,
      kanji TEXT NOT NULL,
      description TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      element TEXT
    );

    CREATE TABLE IF NOT EXISTS parts (
      id TEXT PRIMARY KEY,
      type_id TEXT NOT NULL REFERENCES part_types(id),
      name TEXT NOT NULL,
      style TEXT NOT NULL,
      description TEXT,
      geometry_params TEXT NOT NULL,
      history TEXT,
      era TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS designs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      style TEXT,
      hoju_id TEXT REFERENCES parts(id),
      kasa_id TEXT REFERENCES parts(id),
      hibukuro_id TEXT REFERENCES parts(id),
      chudai_id TEXT REFERENCES parts(id),
      sao_id TEXT REFERENCES parts(id),
      kiso_id TEXT REFERENCES parts(id),
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

module.exports = { getDb };
