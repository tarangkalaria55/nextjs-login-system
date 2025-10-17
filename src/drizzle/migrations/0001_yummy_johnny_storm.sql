CREATE TABLE "logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" text NOT NULL,
	"message" text NOT NULL,
	"meta" jsonb,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
