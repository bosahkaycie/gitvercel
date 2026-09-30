// Client-side Email & SMTP Dispatch Utility
// Calls server-side endpoint /api/send-email to keep SMTP credentials 100% private and secure.

export interface SendEmailPayload {
  to?: string | string[];
  bcc?: string | string[];
  cc?: string | string[];
  replyTo?: string;
  subject: string;
  html?: string;
  text?: string;
  config_override?: {
    smtp_host?: string;
    smtp_port?: number;
    smtp_secure?: boolean;
    smtp_user?: string;
    smtp_pass?: string;
  };
}

export interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  code?: string;
  details?: any;
}

export interface SmtpVerifyResponse {
  success: boolean;
  message: string;
  test_sent_to?: string | null;
  messageId?: string | null;
  error?: string;
  code?: string;
}

export interface SmtpStatusResponse {
  status: string;
  smtp_server: string;
  smtp_port: number;
  smtp_secure: boolean;
  smtp_user_configured: boolean;
  smtp_user_display: string | null;
  service: string;
  timestamp: string;
}

/**
 * Dispatch an email via the serverless SMTP engine
 */
export async function sendCorporateEmail(payload: SendEmailPayload): Promise<SendEmailResponse> {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'send',
        ...payload,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || `HTTP ${res.status}: Failed to send email`,
        code: data.code,
      };
    }

    return {
      success: true,
      messageId: data.messageId,
      details: data,
    };
  } catch (err: any) {
    console.warn('sendCorporateEmail network error:', err);
    return {
      success: false,
      error: err.message || 'Network connection to email dispatcher failed.',
    };
  }
}

/**
 * Test and verify SMTP server credentials and connectivity
 */
export async function verifySmtpConnection(
  testEmail?: string,
  configOverride?: SendEmailPayload['config_override']
): Promise<SmtpVerifyResponse> {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'verify',
        test_email: testEmail,
        config_override: configOverride,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.error || `HTTP ${res.status}: SMTP Verification Failed`,
        error: data.error,
        code: data.code,
      };
    }

    return {
      success: true,
      message: data.message || 'SMTP Server verified successfully!',
      test_sent_to: data.test_sent_to,
      messageId: data.messageId,
    };
  } catch (err: any) {
    console.warn('verifySmtpConnection network error:', err);
    return {
      success: false,
      message: err.message || 'Failed to connect to SMTP serverless endpoint.',
      error: err.message,
    };
  }
}

/**
 * Fetch server-side SMTP configuration status
 */
export async function getSmtpStatus(): Promise<SmtpStatusResponse | null> {
  try {
    const res = await fetch('/api/send-email', {
      method: 'GET',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
