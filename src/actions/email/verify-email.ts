import { render } from "@react-email/render";
import z from "zod";
import EmailVerification from "@/components/emails/email-verification";
import { type SendMailType, sendEmail } from "@/lib/emails/send-email";

const changeEmailSchema = z.object({
  name: z.string(),
  email: z.email(),
  verificationUrl: z.url(),
});

export async function verifyEmail(body: z.infer<typeof changeEmailSchema>) {
  const validationResult = await changeEmailSchema.safeParseAsync(body);

  if (!validationResult.success) {
    const error = z.flattenError(validationResult.error).fieldErrors;
    return { error };
  }

  const { name, email, verificationUrl } = validationResult.data;

  try {
    const html = await render(
      EmailVerification({
        userName: name,
        userEmail: email,
        verificationUrl: verificationUrl,
        expirationTime: "24h",
      }),
    );

    const mailOptions: SendMailType = {
      to: email,
      subject: "Verify email",
      html: html,
    };

    await sendEmail(mailOptions);

    return { data: true };
  } catch (error) {
    return { error };
  }
}
