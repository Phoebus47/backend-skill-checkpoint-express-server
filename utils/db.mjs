import dotenv from 'dotenv';

// โหลด .env.local เฉพาะใน development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
}

import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection - เก็บไว้เฉพาะ error handling
connectionPool.on('error', (err) => {
  console.error('❌ Database connection error:', err.message);
});

export default connectionPool;