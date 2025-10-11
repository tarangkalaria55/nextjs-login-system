import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface EmailVerificationProps {
  userEmail: string;
  verificationUrl: string;
  userName?: string;
  expirationTime?: string;
}

const EmailVerification = ({
  userEmail,
  verificationUrl,
  userName = "there",
  expirationTime = "24 hours",
}: EmailVerificationProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>
          Verify your email address to complete your account setup
        </Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="mx-auto bg-white rounded-[8px] px-[40px] py-[40px] max-w-[600px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[24px] font-bold text-gray-900 m-0 mb-[8px]">
                Verify Your Email Address
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                Complete your account setup by verifying your email
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-900 mb-[16px] m-0">
                Hi {userName},
              </Text>
              <Text className="text-[16px] text-gray-700 mb-[16px] m-0 leading-[24px]">
                Thanks for signing up! To complete your account setup and start
                using our platform, please verify your email address by clicking
                the button below.
              </Text>
              <Text className="text-[14px] text-gray-600 mb-[24px] m-0">
                Email to verify: <strong>{userEmail}</strong>
              </Text>
            </Section>

            {/* Verification Button */}
            <Section className="text-center mb-[32px]">
              <Button
                href={verificationUrl}
                className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
              >
                Verify Email Address
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-[32px]">
              <Text className="text-[14px] text-gray-600 mb-[12px] m-0">
                If the button doesn't work, you can copy and paste this link
                into your browser:
              </Text>
              <Text className="text-[14px] text-blue-600 break-all m-0">
                <Link
                  href={verificationUrl}
                  className="text-blue-600 underline"
                >
                  {verificationUrl}
                </Link>
              </Text>
            </Section>

            {/* Security Notice */}
            <Section className="bg-gray-50 p-[20px] rounded-[8px] mb-[32px]">
              <Text className="text-[14px] text-gray-700 mb-[8px] m-0 font-semibold">
                Security Notice:
              </Text>
              <Text className="text-[14px] text-gray-600 m-0 leading-[20px]">
                This verification link will expire in {expirationTime}. If you
                didn't create an account, you can safely ignore this email.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-solid border-gray-200 pt-[24px]">
              <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                This email was sent to {userEmail}
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                123 Business Street, Suite 100, Ahmedabad, Gujarat 380001, India
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0">
                <Link href="#" className="text-gray-500 underline mr-[16px]">
                  Unsubscribe
                </Link>
                <Link href="#" className="text-gray-500 underline">
                  Privacy Policy
                </Link>
              </Text>
              <Text className="text-[12px] text-gray-400 text-center m-0 mt-[16px]">
                © 2024 Your Company Name. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailVerification.PreviewProps = {
  userEmail: "tarangkalaria55@gmail.com",
  verificationUrl: "https://yourapp.com/verify?token=abc123xyz789",
  userName: "Tarang",
  expirationTime: "24 hours",
} as EmailVerificationProps;

export default EmailVerification;
