import { render } from "@react-email/render";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import EmailVerification from "@/components/emails/email-verification";
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
