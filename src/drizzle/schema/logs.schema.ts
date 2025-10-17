import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  level: text("level").notNull(),
  message: text("message").notNull(),
  meta: jsonb("meta"), // jsonb is ideal for storing rich, searchable JSON data
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});
