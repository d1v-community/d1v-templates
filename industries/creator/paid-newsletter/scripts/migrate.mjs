import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const neonClient = neon(databaseUrl);

// Execute migration file manually
try {
  const migrationFile = resolve('drizzle', '0000_init.sql');
  const sql = readFileSync(migrationFile, 'utf-8');

  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);

  // Execute each statement
  for (const stmt of statements) {
    await neonClient.query(stmt);
  }

  console.log('Migration applied successfully');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
