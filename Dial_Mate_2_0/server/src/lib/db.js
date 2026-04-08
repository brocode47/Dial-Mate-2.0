/* __imports_rewritten__ */
import sqlite3 from 'https://esm.sh/sqlite3';
import { open } from 'https://esm.sh/sqlite';

let db;

export async function initDb() {
  if (db) return db;

  const filename = process.env.DATABASE_URL || './data.sqlite';
  db = await open({ filename, driver: sqlite3.Database });

  await db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS shops (
      shop TEXT PRIMARY KEY,
      accessToken TEXT NOT NULL,
      installedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      shop TEXT NOT NULL,
      payload TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      status TEXT,
      tag TEXT,
      riskScore INTEGER DEFAULT 0,
      FOREIGN KEY(shop) REFERENCES shops(shop)
    );

    CREATE INDEX IF NOT EXISTS idx_orders_shop_updatedAt ON orders(shop, updatedAt);

    CREATE TABLE IF NOT EXISTS calls (
      id TEXT PRIMARY KEY,
      shop TEXT NOT NULL,
      orderId TEXT NOT NULL,
      outcome TEXT,
      intent TEXT,
      sentiment TEXT,
      durationSec INTEGER,
      recordingUrl TEXT,
      transcript TEXT,
      providerCallSid TEXT,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY(shop) REFERENCES shops(shop)
    );

    CREATE INDEX IF NOT EXISTS idx_calls_shop_createdAt ON calls(shop, createdAt);

    CREATE TABLE IF NOT EXISTS compliance_logs (
      id TEXT PRIMARY KEY,
      shop TEXT NOT NULL,
      event TEXT NOT NULL,
      detail TEXT,
      createdAt INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_logs_shop_createdAt ON compliance_logs(shop, createdAt);
  `);

  return db;
}

export function getDb() {
  if (!db) throw new Error('DB not initialized');
  return db;
}

export function now() {
  return Date.now();
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
