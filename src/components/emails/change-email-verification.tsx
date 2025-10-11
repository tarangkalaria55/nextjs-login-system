import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ChangeEmailVerificationProps {
  userName: string;
  newEmail: string;
  oldEmail: string;
  verificationUrl: string;
  expirationTime: string;
}

const ChangeEmailVerification = ({
  userName,
  newEmail,
  oldEmail,
  verificationUrl,
  expirationTime,
}: ChangeEmailVerificationProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Verify your new email address to complete the change</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            <Section>
              <Heading className="text-[24px] font-bold text-gray-900 mb-[24px] text-center">
                Verify Your New Email Address
              </Heading>

              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                Hi {userName},
              </Text>

              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                You recently requested to change your email address from{" "}
                <strong>{oldEmail}</strong> to <strong>{newEmail}</strong>.
              </Text>

              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[24px]">
                To complete this change and verify your new email address,
                please click the button below:
              </Text>

              <Section className="text-center mb-[32px]">
                <Button
                  href={verificationUrl}
                  className="bg-blue-600 text-white px-[24px] py-[12px] rounded-[6px] text-[16px] font-medium no-underline box-border"
                >
                  Verify New Email Address
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 leading-[20px] mb-[16px]">
                If the button doesn't work, you can copy and paste this link
                into your browser:
              </Text>

              <Text className="text-[14px] text-blue-600 break-all mb-[24px]">
                <Link
                  href={verificationUrl}
                  className="text-blue-600 underline"
                >
                  {verificationUrl}
                </Link>
              </Text>

              <Section className="bg-yellow-50 border border-yellow-200 rounded-[6px] p-[16px] mb-[24px]">
                <Text className="text-[14px] text-yellow-800 leading-[20px] mb-[8px] font-medium">
                  ⚠️ Important Security Information:
                </Text>
                <Text className="text-[14px] text-yellow-700 leading-[20px] mb-[8px]">
                  • This verification link will expire on {expirationTime}
                </Text>
                <Text className="text-[14px] text-yellow-700 leading-[20px] mb-[8px]">
                  • If you didn't request this change, please ignore this email
                </Text>
                <Text className="text-[14px] text-yellow-700 leading-[20px]">
                  • Your current email ({oldEmail}) will remain active until
                  verification is complete
                </Text>
              </Section>

              <Text className="text-[14px] text-gray-600 leading-[20px] mb-[24px]">
                Once verified, all future communications will be sent to your
                new email address. You'll also need to use your new email
                address to sign in to your account.
              </Text>

              <Hr className="border-gray-200 my-[24px]" />

              <Text className="text-[12px] text-gray-500 leading-[16px] mb-[8px]">
                Need help? Contact our support team for assistance.
              </Text>

              <Text className="text-[12px] text-gray-500 leading-[16px] mb-[16px]">
                Best regards,
                <br />
                The Security Team
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[32px]" />

            <Section className="text-center">
              <Text className="text-[12px] text-gray-400 leading-[16px] m-0 mb-[8px]">
                Your Company Name
              </Text>
              <Text className="text-[12px] text-gray-400 leading-[16px] m-0 mb-[8px]">
                123 Business Street, Suite 100, Ahmedabad, Gujarat 380001
              </Text>
              <Text className="text-[12px] text-gray-400 leading-[16px] m-0">
                <Link href="#" className="text-gray-400 underline">
                  Unsubscribe
                </Link>{" "}
                | © 2025 Your Company Name. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ChangeEmailVerification.PreviewProps = {
  userName: "Tarang Kalaria",
  newEmail: "tarang.new@example.com",
  oldEmail: "tarangkalaria55@gmail.com",
  verificationUrl: "https://yourapp.com/verify-email?token=abc123xyz789",
  expirationTime: "October 12, 2025 at 9:15 AM IST",
} as ChangeEmailVerificationProps;

export default ChangeEmailVerification;
