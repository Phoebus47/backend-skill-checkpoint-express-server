// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    "postgresql://postgres:Tnk-852813@localhost:5432/quora_mock",
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default connectionPool;
