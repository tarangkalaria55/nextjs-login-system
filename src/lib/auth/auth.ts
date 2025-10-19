import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/drizzle/db";
import { env } from "@/env/server";
import { logger as winstonLogger } from "../logger";

export const auth = betterAuth({
  appName: "Nextjs App",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [nextCookies()],
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 1 * 60 * 60,
    async sendResetPassword({ user, url }) {
      await fetch(`${env.BETTER_AUTH_URL}/api/email/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          verificationUrl: url,
        }),
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignIn: true,
    sendOnSignUp: true,
    expiresIn: 1 * 60 * 60,
    async sendVerificationEmail({ user, url }) {
      await fetch(`${env.BETTER_AUTH_URL}/api/email/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          verificationUrl: url,
        }),
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 2,
    updateAge: 60 * 60 * 24,
  },
  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification({ user, url, newEmail }) {
        await fetch(`${env.BETTER_AUTH_URL}/api/email/change-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            oldEmail: user.email,
            newEmail: newEmail,
            verificationUrl: url,
          }),
        });
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (_ctx) => {
      console.log("createAuthMiddleware", _ctx.path);
      return;
    }),
  },
  logger: {
    disabled: false,
    disableColors: false,
    level: "info",
    log(level, message, ...args) {
      winstonLogger.log(level, message, ...args);
    },
  },
});
