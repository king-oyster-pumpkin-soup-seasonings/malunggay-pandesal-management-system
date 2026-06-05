// DATABASE CONNECTION LAYER - “the engine that talks to the database”
// letting all CRUD functions reuse the same connection system

import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
