#!/usr/bin/env node
// Seed data via API without exposing DATABASE_URL to the Node process.
// Required env:
// - PROJECT_ID
// - OPCODE_API_BASE (e.g. http://localhost:9191/api)
// - AUTH_TOKEN (user JWT)

import fs from 'node:fs';
import path from 'node:path';

function parseArg(name, short) {
  const idx = process.argv.findIndex((a) => a === name || a === short);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  const kv = process.argv.find((a) => a.startsWith(name + '='));
  if (kv) return kv.split('=')[1];
  return undefined;
}

async function readStdin() {
  return await new Promise((resolve) => {
    let data = '';
    try { process.stdin.setEncoding('utf8'); } catch {}
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data.trim()))
    process.stdin.resume();
  });
}

const API_BASE = process.env.OPCODE_API_BASE || 'http://localhost:9191/api';
const PROJECT_ID = process.env.PROJECT_ID || '';
let AUTH = parseArg('--token', '-t');
const tokenFile = parseArg('--token-file', '-f');
if (!AUTH && tokenFile) {
  try { AUTH = fs.readFileSync(path.resolve(tokenFile), 'utf8').trim(); } catch {}
}
if (!AUTH && !process.stdin.isTTY) {
  AUTH = await readStdin();
}
if (!AUTH) {
  AUTH = process.env.AUTH_TOKEN || '';
}
const SEED_FILE = process.env.SEED_FILE || 'drizzle/0001_init.sql';

if (!PROJECT_ID || !AUTH) {
  console.error('[seed_via_api] PROJECT_ID and project token are required. Pass token via --token, --token-file, or STDIN.');
  process.exit(1);
}

async function post(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${AUTH}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${t}`);
  }
  return res.json();
}

function readSql(file) {
  const p = path.resolve(process.cwd(), file);
  if (!fs.existsSync(p)) throw new Error(`Seed file not found: ${p}`);
  return fs.readFileSync(p, 'utf8');
}

async function main() {
  const sql = readSql(SEED_FILE);
  // Dry-run first
  const dry = await post(`${API_BASE}/proxy/projects/${PROJECT_ID}/db/sql`, {
    project_id: PROJECT_ID,
    sql,
    dry_run: true,
  });
  console.log('[seed] dry_run:', dry.data || dry);

  // Request approval (for demo; in production use an admin flow)
  // Here we assume plan/approval are not tied to /db/sql; use a generic token if your backend supports it
  // For MVP, we skip automatic approval and require read_only=true or manual approve.
  const res = await post(`${API_BASE}/proxy/projects/${PROJECT_ID}/db/sql`, {
    project_id: PROJECT_ID,
    sql,
    read_only: false,
    approval_token: process.env.APPROVAL_TOKEN || 'PLEASE_REPLACE',
  });
  console.log('[seed] execute:', res.data || res);
}

main().catch((e) => {
  console.error('❌ seed via api failed:', e?.message || e);
  process.exit(1);
});
