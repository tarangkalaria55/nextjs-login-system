"use server";

import { render } from "@react-email/render";
import z from "zod";
import ChangeEmailVerification from "@/components/emails/change-email-verification";
import { type SendMailType, sendEmail } from "@/lib/emails/send-email";

const changeEmailSchema = z.object({
  name: z.string(),
  oldEmail: z.email(),
  newEmail: z.email(),
  verificationUrl: z.url(),
});

export async function changeEmail(body: z.infer<typeof changeEmailSchema>) {
  const validationResult = await changeEmailSchema.safeParseAsync(body);

  if (!validationResult.success) {
    const error = z.flattenError(validationResult.error).fieldErrors;
    return { error };
  }

  const { name, oldEmail, newEmail, verificationUrl } = validationResult.data;

  try {
    const html = await render(
      ChangeEmailVerification({
        userName: name,
        oldEmail: oldEmail,
        newEmail: newEmail,
        verificationUrl: verificationUrl,
        expirationTime: "24h",
      }),
    );

    const mailOptions: SendMailType = {
      to: newEmail,
      subject: "Verify email",
      html: html,
    };

    await sendEmail(mailOptions);

    return { data: true };
  } catch (error) {
    return { error };
  }
}
