import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';

const neonClient = neon(process.env.DATABASE_URL);
const client = Object.assign(
  (text, params, options) => neonClient.query(text, params, options),
  { transaction: neonClient.transaction?.bind(neonClient) },
);
const db = drizzle(client);

const userId = crypto.randomUUID();

async function main() {
  await db.execute(sql`insert into users (id, username, display_name, email) values (${userId}, 'demo', 'Demo User', 'demo@example.com') on conflict (id) do nothing`);
  console.log('Seed complete:', { userId });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
