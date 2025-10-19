import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "@/env/server";
import * as schema from "./schema";

function configureDrizzle() {
  if (env.IS_NEON_DATABASE) {
    const sql = neon(env.DATABASE_URL);
    const db = drizzleNeon({ client: sql, schema: schema });
    return db;
  } else {
    const pool = new Pool({
      connectionString: env.DATABASE_URL,
    });
    const db = drizzleNode({ client: pool, schema: schema });
    return db;
  }
}

export const db = configureDrizzle();

export type DbType = typeof db;
