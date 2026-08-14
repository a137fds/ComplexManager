import 'dotenv/config';
import { Pool } from 'pg';

function createPool() {
  return new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_ADMIN_USER || process.env.SQL_USER,
    password: process.env.SQL_ADMIN_PASSWORD || process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    port: process.env.SQL_PORT ? Number(process.env.SQL_PORT) : 5432,
    ssl: process.env.SQL_SSL === 'true' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 15000,
  });
}

export async function ensureSchema() {
  const pool = createPool();
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Complex" (
        "ComplexID" SERIAL PRIMARY KEY,
        "ComplexName" TEXT NOT NULL,
        "Address" TEXT NOT NULL,
        "ChangeUserID" TEXT,
        "ChangeDate" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "Building" (
        "BuildingID" SERIAL PRIMARY KEY,
        "ComplexID" INTEGER NOT NULL REFERENCES "Complex"("ComplexID") ON DELETE CASCADE,
        "BuildingName" TEXT NOT NULL,
        "ChangeUserID" TEXT,
        "ChangeDate" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS "Building_ComplexID_idx"
        ON "Building" ("ComplexID");

      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "uid" TEXT NOT NULL UNIQUE,
        "email" TEXT,
        "display_name" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW()
      );
    `);
  } finally {
    await pool.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  ensureSchema()
    .then(() => console.log('PostgreSQL schema is ready.'))
    .catch((error) => {
      console.error('Failed to initialize PostgreSQL schema:', error);
      process.exitCode = 1;
    });
}
