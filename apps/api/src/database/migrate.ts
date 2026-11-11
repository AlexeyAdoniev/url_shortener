import { Pool } from 'pg';
import { CREATE_URLS_TABLE_SQL } from './schema.js';

async function migrate(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query(CREATE_URLS_TABLE_SQL);
  } finally {
    console.log('table created');
    await pool.end();
  }
}

await migrate();
