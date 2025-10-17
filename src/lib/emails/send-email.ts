import { createTransport } from "nodemailer";
import { env } from "@/env/server";
import type { SendMailOptionsType } from "./send-email-schema";

const transporter = createTransport({
  service: "gmail",
  host: env.EMAIL_SERVER_HOST,
  port: env.EMAIL_SERVER_PORT,
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD,
  },
});

// type ManipulateFields<
//   T,
//   TRequired extends keyof T = never,
//   TOptional extends keyof T = never,
// > = Omit<T, TRequired | TOptional> &
//   Required<Pick<T, TRequired>> &
//   Partial<Pick<T, TOptional>>;

// type MailOptions = Parameters<(typeof transporter)["sendMail"]>[0] & {
//   displayName?: string;
// };

// // Group properties for clarity
// type RequiredFields = "to" | "subject" | "text" | "html";
// type OptionalFields = "from" | "displayName";

// type SendMailType = ManipulateFields<
//   MailOptions,
//   RequiredFields,
//   OptionalFields
// >;

export const sendEmail = async ({
  from,
  displayName,
  ...props
}: SendMailOptionsType) => {
  await transporter.verify();

  if (!from) {
    from = env.EMAIL_FROM;
  }

  if (displayName) {
    from = `"${displayName} <${from}>"`;
  }

  await transporter.sendMail({
    from: from || env.EMAIL_FROM,
    ...props,
  });
};
