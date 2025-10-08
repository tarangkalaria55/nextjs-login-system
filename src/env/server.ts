import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { baseEnv } from "./base";

export const env = createEnv({
  extends: [baseEnv],
  server: {
    // Better Auth
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),

    // Database
    DATABASE_URL: z.string().min(1),

    // Email Config
    EMAIL_SERVER_USER: z.string().min(1),
    EMAIL_SERVER_PASSWORD: z.string().min(1),
    EMAIL_SERVER_HOST: z.string().min(1),
    EMAIL_SERVER_PORT: z.coerce.number(),
    EMAIL_FROM: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
  ...baseEnv,
});
