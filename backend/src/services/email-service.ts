import { Resend } from 'resend';
import React from 'react';
import { EmailVerificationTemplate } from '@/templates/emails/EmailVerificationTemplate';
import { ForgotPasswordTemplate } from '@/templates/emails/ForgotPasswordTemplate';
import { ReservationQRTemplate } from '@/templates/emails/ReservationQRTemplate';

interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
  cid: string;
}

interface SendEmailOptions {
  to: string;
  cc?: string | string[];
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}

export interface EmailResult {
  success: boolean;
  error?: string;
}

export function base64ToAttachment(
  base64DataUrl: string,
  filename: string,
  cid: string,
): EmailAttachment | null {
  if (!base64DataUrl || !base64DataUrl.startsWith('data:image/')) {
    return null;
  }

  const matches = base64DataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!matches) {
    return null;
  }

  const contentType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  const ext = contentType.split('/')[1].replace('+xml', '');
  const fullFilename = filename.includes('.') ? filename : `${filename}.${ext}`;

  return {
    filename: fullFilename,
    content: buffer,
    contentType,
    cid,
  };
}

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return null;
  }
  return new Resend(key);
}

function resolveFromHeader(): string {
  return (
    process.env.RESEND_FROM ??
    'Premium Parking <noreply@parkingreservation.online>'
  );
}

export class EmailService {
  private readonly fromHeader: string;

  constructor() {
    this.fromHeader = resolveFromHeader();
  }

  private isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  private configured(): boolean {
    return getResend() !== null;
  }

  async send(options: SendEmailOptions): Promise<EmailResult> {
    const resend = getResend();
    if (!resend) {
      if (this.isProduction()) {
        return {
          success: false,
          error: 'Email service is not configured (RESEND_API_KEY)',
        };
      }
      console.warn(
        `⚠️ Email not sent (no RESEND_API_KEY): ${options.subject} → ${options.to}`,
      );
      return { success: true };
    }

    try {
      const resendAttachments = options.attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
        headers: {
          'Content-ID': `<${att.cid}>`,
          'Content-Disposition': 'inline',
        },
      }));

      const { error } = await resend.emails.send({
        from: this.fromHeader,
        to: options.to,
        ...(options.cc ? { cc: options.cc } : {}),
        subject: options.subject,
        html: options.html,
        attachments: resendAttachments,
      });

      if (error) {
        console.error(
          `❌ Error sending email to ${options.to}: ${error.message}`,
        );
        return {
          success: false,
          error: `Resend error: ${error.message}`,
        };
      }

      return { success: true };
    } catch (error: unknown) {
      return this.mapSendError(error);
    }
  }

  async sendVerificationEmail(
    to: string,
    username: string,
    otp: string,
  ): Promise<EmailResult> {
    if (!this.configured()) {
      if (this.isProduction()) {
        return {
          success: false,
          error: 'Email service is not configured (RESEND_API_KEY)',
        };
      }
      console.warn(`[email] verification OTP for ${to}: ${otp}`);
      return { success: true };
    }

    return this.sendReact(
      to,
      'Verify your email - Premium Parking',
      React.createElement(EmailVerificationTemplate, { username, otp }),
    );
  }

  async sendForgotPasswordEmail(
    to: string,
    username: string,
    otp: string,
  ): Promise<EmailResult> {
    if (!this.configured()) {
      if (this.isProduction()) {
        return {
          success: false,
          error: 'Email service is not configured (RESEND_API_KEY)',
        };
      }
      console.warn(`[email] password reset OTP for ${to}: ${otp}`);
      return { success: true };
    }

    return this.sendReact(
      to,
      'Reset your password - Premium Parking',
      React.createElement(ForgotPasswordTemplate, { username, otp }),
    );
  }

  async sendReservationEmail(
    to: string,
    username: string,
    qrCode: string,
    slotNumber: string,
  ): Promise<EmailResult> {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCode)}`;

    if (!this.configured()) {
      if (this.isProduction()) {
        return {
          success: false,
          error: 'Email service is not configured (RESEND_API_KEY)',
        };
      }
      console.warn(
        `[email] reservation confirmation skipped (no RESEND_API_KEY); ${to} slot ${slotNumber}`,
      );
      return { success: true };
    }

    return this.sendReact(
      to,
      'Reservation Confirmed - Premium Parking',
      React.createElement(ReservationQRTemplate, {
        username,
        qrCodeUrl,
        slotNumber,
      }),
    );
  }

  private async sendReact(
    to: string,
    subject: string,
    component: React.ReactElement,
  ): Promise<EmailResult> {
    const resend = getResend();
    if (!resend) {
      return {
        success: false,
        error: 'Email service is not configured (RESEND_API_KEY)',
      };
    }

    try {
      const { error } = await resend.emails.send({
        from: this.fromHeader,
        to,
        subject,
        react: component,
      });

      if (error) {
        console.error(`❌ Error sending email to ${to}: ${error.message}`);
        return {
          success: false,
          error: `Resend error: ${error.message}`,
        };
      }

      return { success: true };
    } catch (error: unknown) {
      return this.mapSendError(error);
    }
  }

  private mapSendError(error: unknown): EmailResult {
    const resendError = error as {
      code?: number;
      response?: { body?: { errors?: Array<{ message: string }> } };
    };
    const errorCode = resendError.code;

    if (errorCode === 401) {
      console.error(
        '❌ Resend API key is invalid or unauthorized. Check RESEND_API_KEY.',
      );
    } else if (errorCode === 403) {
      console.error(
        '❌ Resend API key cannot send mail. Verify Mail Send permission.',
      );
    } else {
      console.error('❌ Unexpected error while sending email:', error);
    }

    if (resendError.response?.body?.errors) {
      console.error('Resend error details:', resendError.response.body.errors);
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? `${error.message} (code: ${errorCode})`
          : 'Unknown error',
    };
  }
}

export const emailService = new EmailService();
