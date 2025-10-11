import "../../env/config";

import { render } from "@react-email/components";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import ChangeEmailVerification from "@/components/emails/change-email-verification";
import EmailVerification from "@/components/emails/email-verification";
import PasswordResetEmail from "@/components/emails/password-reset-email";
import { db } from "@/drizzle/db";
import { env } from "@/env/server";
import { sendEmail } from "../emails/send-email";

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
      const html = await render(
        PasswordResetEmail({
          userEmail: user.email,
          expiryTime: "1h",
          resetLink: url,
        }),
      );

      await sendEmail({
        to: user.email,
        subject: "Reset Password",
        html: html,
        text: "",
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignIn: true,
    sendOnSignUp: true,
    expiresIn: 1 * 60 * 60,
    async sendVerificationEmail({ user, url }) {
      const html = await render(
        EmailVerification({
          userName: user.name,
          userEmail: user.email,
          verificationUrl: url,
          expirationTime: "1h",
        }),
      );

      await sendEmail({
        to: user.email,
        subject: "Verify email",
        html: html,
        text: "",
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification({ user, url, newEmail }) {
        const html = await render(
          ChangeEmailVerification({
            userName: user.name,
            oldEmail: user.email,
            newEmail: newEmail,
            verificationUrl: url,
            expirationTime: "24h",
          }),
        );

        await sendEmail({
          to: newEmail,
          subject: "Verify email",
          html: html,
          text: "",
        });
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (_ctx) => {
      console.log("auth middleware", _ctx.path);
      return;
    }),
  },
});
