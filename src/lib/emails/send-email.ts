/** biome-ignore-all lint/correctness/noUnusedVariables: *** */

import { render } from "@react-email/render";
import { createTransport } from "nodemailer";
import type { ReactNode } from "react";
import { Resend } from "resend";
import z from "zod";
import { env } from "@/env/server";

const stringSchema = z.string();

const stringsSchema = z.union([z.string(), z.array(stringSchema)]);

export const sendMailSchema = z
  .object({
    displayName: z.string().optional(),
    to: stringsSchema,
    cc: stringsSchema.optional(),
    bcc: stringsSchema.optional(),
    replyTo: stringsSchema.optional(),
    subject: z.string(),
  })
  .and(
    z.union([z.object({ text: z.string() }), z.object({ html: z.string() })]),
  );

// Example of how to infer a TypeScript type from the schema
export type SendMailType = z.infer<typeof sendMailSchema>;

const sendEmailUsingResend = async ({
  displayName,
  ...props
}: SendMailType) => {
  let from = env.RESEND_EMAIL_FROM;

  if (displayName) {
    from = `"${displayName} <${from}>"`;
  }

  const resend = new Resend(env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: from || env.EMAIL_FROM,
    ...props,
  });
};

const sendEmailUsingNodemail = async ({
  displayName,
  ...props
}: SendMailType) => {
  let from = env.EMAIL_FROM;

  if (displayName) {
    from = `"${displayName} <${from}>"`;
  }

  const transporter = createTransport({
    service: "gmail",
    host: env.EMAIL_SERVER_HOST,
    port: env.EMAIL_SERVER_PORT,
    auth: {
      user: env.EMAIL_SERVER_USER,
      pass: env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.verify();

  await transporter.sendMail({
    from: from || env.EMAIL_FROM,
    ...props,
  });
};

export const sendEmail = async (props: SendMailType) => {
  if (env.EMAIL_USE_RESEND) {
    await sendEmailUsingResend(props);
  } else {
    await sendEmailUsingNodemail(props);
  }
};

export async function renderComponent<P>(
  component: (props: P) => ReactNode,
  props: P,
): Promise<string>;
export async function renderComponent<P>(
  component: (props: P) => Promise<ReactNode>,
  props: P,
): Promise<string>;
export async function renderComponent<P>(
  component: ((props: P) => ReactNode) | ((props: P) => Promise<ReactNode>),
  props: P,
): Promise<string> {
  const element = await component(props);
  return render(element);
}
