import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { sendEmail } from "@/lib/emails/send-email";
import { sendMailSchema } from "@/lib/emails/send-email-schema";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validationResult = await sendMailSchema.safeParseAsync(body);

  if (!validationResult.success) {
    const error = z.flattenError(validationResult.error).fieldErrors;
    return NextResponse.json({ errors: error }, { status: 400 });
  }

  try {
    await sendEmail(validationResult.data);

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
