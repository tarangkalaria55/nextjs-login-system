import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["active", "inactive", "archived"]);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  name: text("name").notNull(),
  status: statusEnum("status").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull(),
  availableAt: timestamp("available_at").notNull(),
});
