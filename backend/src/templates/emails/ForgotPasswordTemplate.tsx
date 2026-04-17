import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ForgotPasswordTemplateProps {
  username: string;
  otp: string;
}

export const ForgotPasswordTemplate = ({
  username,
  otp,
}: ForgotPasswordTemplateProps) => (
  <Html>
    <Head />
    <Preview>Reset your password - Premium Parking</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
           <Heading style={h1}>Premium Parking</Heading>
        </Section>
        <Heading style={h2}>Reset Password Request</Heading>
        <Text style={text}>
          Hi {username}, we received a request to reset your password. Use the code below to proceed:
        </Text>
        <Section style={codeContainer}>
          <Text style={code}>{otp}</Text>
        </Section>
        <Text style={text}>
          This code will expire in 10 minutes. If you didn't request a password reset, please secure your account immediately.
        </Text>
        <Text style={footer}>
          &copy; 2026 Premium Parking System. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  maxWidth: '580px',
};

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '40px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  letterSpacing: '-0.02em',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const codeContainer = {
  backgroundColor: '#f3f4f6',
  borderRadius: '4px',
  margin: '24px 0',
  padding: '16px',
  textAlign: 'center' as const,
};

const code = {
  color: '#d97706',
  fontSize: '32px',
  fontWeight: 'bold',
  letterSpacing: '0.25em',
  margin: '0',
};

const footer = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '32px 0 0',
  textAlign: 'center' as const,
};
