import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  firstName: string;
  setupUrl: string;
}

const WelcomeEmail = ({ firstName, setupUrl }: WelcomeEmailProps) => {
  const currentYear: number = new Date().getFullYear();

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] p-[32px] max-w-[600px] mx-auto">
            <Section>
              <Text className="text-[32px] font-bold text-gray-900 mb-[16px] text-center">
                Welcome to our platform! 🎉
              </Text>

              <Text className="text-[18px] text-gray-700 mb-[24px]">
                Hi {firstName},
              </Text>

              <Text className="text-[16px] text-gray-600 mb-[16px] leading-[24px]">
                Thank you for joining our community! We're thrilled to have you
                on board and can't wait to help you get the most out of your
                experience.
              </Text>

              <Text className="text-[16px] text-gray-600 mb-[32px] leading-[24px]">
                To get started and unlock all the amazing features we have to
                offer, please take a moment to complete your account setup. It
                only takes a few minutes and will ensure you have the best
                possible experience.
              </Text>

              <Section className="text-center mb-[32px]">
                <Button
                  href={setupUrl}
                  className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border"
                >
                  Complete Setup
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-500 mb-[24px] leading-[20px]">
                If you have any questions or need assistance, our support team
                is here to help. Simply reply to this email or visit our help
                center.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[8px]">
                Welcome aboard!
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[32px]">
                The Team
              </Text>
            </Section>

            <Hr className="border-gray-200 mb-[32px]" />

            <Section>
              <Text className="text-[12px] text-gray-400 text-center mb-[8px] m-0">
                © {currentYear} Your Company Name. All rights reserved.
              </Text>

              <Text className="text-[12px] text-gray-400 text-center mb-[8px] m-0">
                123 Business Street, Suite 100, City, State 12345
              </Text>

              <Text className="text-[12px] text-gray-400 text-center m-0">
                <a href="#" className="text-gray-400 underline">
                  Unsubscribe
                </a>{" "}
                |
                <a href="#" className="text-gray-400 underline ml-[4px]">
                  Privacy Policy
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

WelcomeEmail.PreviewProps = {
  firstName: "John",
  setupUrl: "https://yourapp.com/setup",
} as WelcomeEmailProps;

export default WelcomeEmail;
