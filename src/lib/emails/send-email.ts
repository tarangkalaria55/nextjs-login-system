import { createTransport } from "nodemailer";
import { env } from "@/env/server";

const transporter = createTransport({
  service: "gmail",
  host: env.EMAIL_SERVER_HOST,
  port: env.EMAIL_SERVER_PORT,
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD,
  },
});

type ManipulateFields<
  T,
  TRequired extends keyof T = never,
  TOptional extends keyof T = never,
> = Omit<T, TRequired | TOptional> &
  Required<Pick<T, TRequired>> &
  Partial<Pick<T, TOptional>>;

// Group properties for clarity
type RequiredFields = "to" | "subject" | "text" | "html";
type OptionalFields = "from";

type MailOptions = Parameters<(typeof transporter)["sendMail"]>[0];
type SendMailType = ManipulateFields<
  MailOptions,
  RequiredFields,
  OptionalFields
>;

export const sendEmail = async ({ from, ...props }: SendMailType) => {
  await transporter.verify();

  await transporter.sendMail({
    from: from || env.EMAIL_FROM,
    ...props,
  });
};
