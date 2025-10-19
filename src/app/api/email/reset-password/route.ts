import { render } from "@react-email/render";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import PasswordResetEmail from "@/components/emails/password-reset-email";
import { type SendMailType, sendEmail } from "@/lib/emails/send-email";

const changeEmailSchema = z.object({
  name: z.string(),
  email: z.email(),
  verificationUrl: z.url(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validationResult = await changeEmailSchema.safeParseAsync(body);

  if (!validationResult.success) {
    const error = z.flattenError(validationResult.error).fieldErrors;
    return NextResponse.json({ errors: error }, { status: 400 });
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

    await sendEmail(mailOptions, { useResend: false });

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error sending email", error },
      { status: 500 },
    );
  }
}
