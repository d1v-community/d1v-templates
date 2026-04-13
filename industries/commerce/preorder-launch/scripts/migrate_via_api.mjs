#!/usr/bin/env node
// Apply SQL migrations by calling the opcode-api proxy (preferred) or backend_admin API.
// This avoids requiring DATABASE_URL in the Node process and keeps secrets server-side.
//
// Required env vars (set by platform or your shell):
// - PROJECT_ID: target project id
// - OPCODE_API_BASE: e.g. http://localhost:9191/api (preferred)
//   or BACKEND_ADMIN_API_BASE: e.g. http://localhost:8999/api
// - AUTH_TOKEN: Bearer token (user JWT)
// - MIGRATIONS_FOLDER: path to SQL files (defaults to 'drizzle')

import fs from 'node:fs';
import path from 'node:path';

const API_BASE = process.env.OPCODE_API_BASE || process.env.BACKEND_ADMIN_API_BASE || 'http://localhost:9191/api';
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

let TOKEN = parseArg('--token', '-t');
const tokenFile = parseArg('--token-file', '-f');
if (!TOKEN && tokenFile) {
  try { TOKEN = fs.readFileSync(path.resolve(tokenFile), 'utf8').trim(); } catch {}
}
if (!TOKEN && !process.stdin.isTTY) {
  TOKEN = await readStdin();
}
if (!TOKEN) {
  TOKEN = process.env.AUTH_TOKEN || '';
}
const PROJECT_ID = process.env.PROJECT_ID || '';
const MIGRATIONS_FOLDER = process.env.MIGRATIONS_FOLDER || 'drizzle';

if (!PROJECT_ID) {
  console.error('[migrate_via_api] PROJECT_ID is required');
  process.exit(1);
}
if (!TOKEN) {
  console.error('[migrate_via_api] Missing project token. Pass via --token, --token-file, or STDIN.');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`,
};

async function postJson(url, body) {
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

function readSqlMigrations(dir) {
  const abs = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(abs)) {
    throw new Error(`Migrations folder not found: ${abs}`);
  }
  const files = fs.readdirSync(abs)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  if (!files.length) {
    throw new Error(`No .sql files found in ${abs}`);
  }
  const contents = files.map((f) => fs.readFileSync(path.join(abs, f), 'utf8'));
  // Join with a separator to avoid accidental token concatenation
  const sql = contents.join('\n\n-- \n');
  return { files, sql };
}

async function main() {
  const { files, sql } = readSqlMigrations(MIGRATIONS_FOLDER);

  console.log(`[migrate_via_api] Read ${files.length} migration file(s):`);
  files.forEach((f) => console.log(`  - ${f}`));

  // 1) Plan (proxy path)
  const proxyBase = API_BASE.includes('/proxy') || API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}`;
  const planEndpoint = `${proxyBase}${proxyBase.endsWith('/api') ? '/proxy' : ''}/migrations/plan`;
  const valEndpoint = `${proxyBase}${proxyBase.endsWith('/api') ? '/proxy' : ''}/migrations/validate`;
  const apprBase = `${proxyBase}${proxyBase.endsWith('/api') ? '/proxy' : ''}/migrations/approvals`;
  const execEndpoint = `${proxyBase}${proxyBase.endsWith('/api') ? '/proxy' : ''}/migrations/execute`;

  const planResp = await postJson(planEndpoint, {
    project_id: PROJECT_ID,
    intent: `Apply ${files.length} SQL migration(s)`,
    proposed_sql: sql,
  });
  const plan = planResp.data || planResp;
  const planId = plan.plan_id;
  if (!planId) throw new Error('Missing plan_id in response');
  console.log(`[migrate_via_api] Created plan: ${planId}`);

  // 2) Validate (shadow branch or dry-run)
  const valResp = await postJson(valEndpoint, { plan_id: planId, project_id: PROJECT_ID });
  const val = valResp.data || valResp;
  console.log(`[migrate_via_api] Validate stage=${val.stage} status=${val.status} statements=${val.statement_count}`);
  if (Array.isArray(val.warnings) && val.warnings.length) {
    console.log('[migrate_via_api] Warnings:');
    val.warnings.forEach((w) => console.log('  -', w));
  }
  if (val.status !== 'success') {
    throw new Error('Validation failed');
  }

  // 3) Request approval → auto-review → Execute (prod)
  const appr = await postJson(apprBase, { plan_id: planId, risk_summary: `Apply ${files.length} migrations`, project_id: PROJECT_ID });
  const approval = appr.data || appr;
  const approvalId = approval.approval_id;
  console.log(`[migrate_via_api] Approval requested: ${approvalId}`);
  // try auto-review (dev/staging)
  const auto = await postJson(`${apprBase}/${approvalId}/auto-review`, {});
  const autoRes = auto.data || auto;
  console.log(`[migrate_via_api] Auto-review status=${autoRes.status} score=${autoRes.risk_score}`);
  if (autoRes.status !== 'approved') {
    throw new Error(`Auto-review rejected: ${(autoRes.reasons || []).join('; ')}`);
  }
  const approvalToken = autoRes.approval_token;
  if (!approvalToken) throw new Error('Missing approval_token after auto-review');

  const execResp = await postJson(execEndpoint, { plan_id: planId, approval_token: approvalToken, project_id: PROJECT_ID });
  const exec = execResp.data || execResp;
  console.log(`[migrate_via_api] Execute stage=${exec.stage} status=${exec.status}`);
  if (exec.status !== 'success') {
    throw new Error('Execution failed');
  }

  console.log('✅ Migrations applied successfully via backend_admin API');
}

main().catch((err) => {
  console.error('❌ Migration via API failed:', err?.message || err);
  process.exit(1);
});
