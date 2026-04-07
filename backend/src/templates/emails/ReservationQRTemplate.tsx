import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ReservationQRTemplateProps {
  username: string;
  qrCodeUrl: string;
  slotNumber: string;
}

export const ReservationQRTemplate = ({
  username,
  qrCodeUrl,
  slotNumber,
}: ReservationQRTemplateProps) => (
  <Html>
    <Head />
    <Preview>Your Parking Reservation is confirmed! - Premium Parking</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
           <Heading style={h1}>Premium Parking</Heading>
        </Section>
        <Heading style={h2}>Reservation Confirmed</Heading>
        <Text style={text}>
          Hi {username}, your reservation for slot <strong>{slotNumber}</strong> has been successfully booked.
        </Text>
        
        <Section style={qrContainer}>
          <Text style={qrLabel}>SCAN THIS QR AT THE ENTRANCE</Text>
          <Img
            src={qrCodeUrl}
            alt="Reservation QR Code"
            width="200"
            height="200"
            style={qrImage}
          />
        </Section>

        <Text style={text}>
          Please show this QR code at the entrance to check in.
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

const qrContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
  padding: '24px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px dashed #e5e7eb',
};

const qrLabel = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#6b7280',
  letterSpacing: '0.05em',
  marginBottom: '16px',
};

const qrImage = {
  margin: '0 auto',
};

const footer = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '32px 0 0',
  textAlign: 'center' as const,
};
