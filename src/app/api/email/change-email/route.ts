import { render } from "@react-email/render";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import ChangeEmailVerification from "@/components/emails/change-email-verification";
import { type SendMailType, sendEmail } from "@/lib/emails/send-email";

const changeEmailSchema = z.object({
  name: z.string(),
  oldEmail: z.email(),
  newEmail: z.email(),
  verificationUrl: z.url(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validationResult = await changeEmailSchema.safeParseAsync(body);

  if (!validationResult.success) {
    const error = z.flattenError(validationResult.error).fieldErrors;
    return NextResponse.json({ errors: error }, { status: 400 });
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
