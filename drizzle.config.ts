import "./src/env/config";

import { defineConfig } from "drizzle-kit";
import { env } from "@/env/server";

export default defineConfig({
  schema: "./src/drizzle/schema/*",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
