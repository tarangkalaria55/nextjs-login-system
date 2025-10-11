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
    async sendResetPassword({ user, url, token }) {
      console.log("Reset Password", url, user.name, token);

      const html = await render(
        PasswordResetEmail({
          userEmail: user.email,
          expiryTime: "24h",
          resetLink: url,
        }),
      );

      console.log(html);

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
    async sendVerificationEmail({ user, url, token }) {
      console.log("verify email", url, user.name, token);

      const html = await render(
        EmailVerification({
          userName: user.name,
          userEmail: user.email,
          verificationUrl: url,
          expirationTime: "24h",
        }),
      );

      console.log(html);

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
      async sendChangeEmailVerification({ user, url, token, newEmail }) {
        console.log("change email", url, user.name, token, newEmail);

        const html = await render(
          ChangeEmailVerification({
            userName: user.name,
            oldEmail: user.email,
            newEmail: newEmail,
            verificationUrl: url,
            expirationTime: "24h",
          }),
        );

        console.log(html);

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
