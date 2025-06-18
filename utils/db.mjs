// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    "postgresql://neondb_owner:npg_P1QznL3gysij@ep-rapid-waterfall-a1bwqcj7-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default connectionPool;
