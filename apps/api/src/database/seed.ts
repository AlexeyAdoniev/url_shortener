import { Pool } from 'pg';
import { CREATE_URLS_TABLE_SQL } from './schema.js';

async function seed(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query(CREATE_URLS_TABLE_SQL);
    await pool.query(
      `INSERT INTO urls (short_id, original_url)
       VALUES ($1, $2)
       ON CONFLICT (short_id) DO NOTHING`,
      ['nest', 'https://nestjs.com/'],
    );
  } finally {
    console.log('db seeded');
    await pool.end();
  }
}

await seed();
