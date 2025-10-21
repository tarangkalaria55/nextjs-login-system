import { render } from "@react-email/render";
import z from "zod";
import PasswordResetEmail from "@/components/emails/password-reset-email";
import { type SendMailType, sendEmail } from "@/lib/emails/send-email";

const changeEmailSchema = z.object({
  name: z.string(),
  email: z.email(),
  verificationUrl: z.url(),
});

export async function resetPassword(body: z.infer<typeof changeEmailSchema>) {
  const validationResult = await changeEmailSchema.safeParseAsync(body);

  if (!validationResult.success) {
    const error = z.flattenError(validationResult.error).fieldErrors;
    return { error };
  }

  const { email, verificationUrl } = validationResult.data;

  try {
    const html = await render(
      PasswordResetEmail({
        userEmail: email,
        expiryTime: "1h",
        resetLink: verificationUrl,
      }),
    );

    const mailOptions: SendMailType = {
      to: email,
      subject: "Reset Password",
      html: html,
    };

    await sendEmail(mailOptions);

    return { data: true };
  } catch (error) {
    return { error };
  }
}
