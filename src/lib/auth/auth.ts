import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { changeEmail } from "@/actions/email/change-email";
import { resetPassword } from "@/actions/email/reset-password";
import { verifyEmail } from "@/actions/email/verify-email";
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
      await resetPassword({
        email: user.email,
        name: user.name,
        verificationUrl: url,
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignIn: true,
    sendOnSignUp: true,
    expiresIn: 1 * 60 * 60,
    async sendVerificationEmail({ user, url }) {
      await verifyEmail({
        email: user.email,
        name: user.name,
        verificationUrl: url,
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
        await changeEmail({
          name: user.name,
          oldEmail: user.email,
          newEmail: newEmail,
          verificationUrl: url,
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
