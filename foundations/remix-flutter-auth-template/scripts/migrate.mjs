import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import fs from 'node:fs';
import path from 'node:path';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const neonClient = neon(databaseUrl);

function readSqlMigrations(dir) {
  const abs = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(abs)) {
    throw new Error(`Migrations folder not found: ${abs}`);
  }
  return fs
    .readdirSync(abs)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((f) => ({ file: f, sql: fs.readFileSync(path.join(abs, f), 'utf-8') }));
}

// Execute migrations manually (no journal table; files must be idempotent)
try {
  const migrations = readSqlMigrations('drizzle');
  console.log(`[migrate] Found ${migrations.length} migration file(s).`);

  for (const { file, sql } of migrations) {
    console.log(`[migrate] Applying ${file}...`);
    const statements = sql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const stmt of statements) {
      await neonClient.query(stmt);
    }
  }

  console.log('✅ Migrations applied successfully');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
