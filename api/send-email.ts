import nodemailer, { SendMailOptions } from 'nodemailer';

// Helper to sanitize and get SMTP configuration from environment or admin payload
function getSmtpConfig(override?: any) {
  const host = override?.smtp_host || process.env.SMTP_HOST || 'glacier.mxrouting.net';
  const port = Number(override?.smtp_port || process.env.SMTP_PORT || 465);
  const secure = override?.smtp_secure !== undefined 
    ? Boolean(override.smtp_secure) 
    : (process.env.SMTP_SECURE === 'true' || port === 465);
  const user = override?.smtp_user || process.env.SMTP_USER || 'hello@polarisigl.com';
  const pass = override?.smtp_pass || process.env.SMTP_PASS || '';
  const defaultFrom = process.env.SMTP_FROM || `"Polaris Integrated & GeoSolutions" <${user}>`;

  return { host, port, secure, user, pass, defaultFrom };
}

function createTransporter(config: ReturnType<typeof getSmtpConfig>) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure, // true for 465, false for other ports
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      // MXrouting certificates are valid and secure
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2'
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Health check / SMTP status overview (without exposing secrets)
    const config = getSmtpConfig();
    return res.status(200).json({
      status: 'ready',
      smtp_server: config.host,
      smtp_port: config.port,
      smtp_secure: config.secure,
      smtp_user_configured: Boolean(config.user),
      smtp_user_display: config.user ? `${config.user.substring(0, 3)}***@${config.user.split('@')[1] || ''}` : null,
      service: 'Polaris Integrated & GeoSolutions Serverless Mail Dispatcher',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { action = 'send', to, bcc, cc, replyTo, subject, html, text, config_override, test_email } = body;

    const config = getSmtpConfig(config_override);
    const transporter = createTransporter(config);

    // 1. Connection Diagnostic & Verification Action
    if (action === 'verify' || action === 'test_connection') {
      try {
        await transporter.verify();
        
        let testSendResult = null;
        if (test_email) {
          testSendResult = await transporter.sendMail({
            from: config.defaultFrom,
            to: test_email,
            subject: '✅ PIGL Email Server Diagnostic - SMTP Verified',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #10b981; border-radius: 8px;">
                <div style="background-color: #022c22; padding: 16px; text-align: center; border-radius: 6px;">
                  <h2 style="color: #ffffff; margin: 0;">Polaris Integrated & GeoSolutions</h2>
                  <p style="color: #6ee7b7; margin: 4px 0 0 0; font-size: 12px; font-weight: bold;">SMTP Server Diagnostic Test</p>
                </div>
                <div style="padding: 20px 0;">
                  <p style="color: #0f172a; font-size: 15px;"><strong>SMTP Server Connection Successful!</strong></p>
                  <p style="color: #475569; font-size: 13px;">Your email dispatch configuration on <strong>${config.host}:${config.port}</strong> (User: ${config.user}) is fully active, authenticated, and ready to send corporate communications.</p>
                  <div style="background-color: #f8fafc; padding: 12px; border-left: 4px solid #10b981; font-family: monospace; font-size: 12px; color: #334155;">
                    Timestamp: ${new Date().toISOString()}<br>
                    Host: ${config.host}<br>
                    Encryption: ${config.secure ? 'SSL (Port 465)' : 'TLS/STARTTLS'}
                  </div>
                </div>
                <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">© ${new Date().getFullYear()} Polaris Integrated & GeoSolutions Limited.</p>
              </div>
            `,
            text: `PIGL Email Server Diagnostic Test - Successful connection on ${config.host}:${config.port} at ${new Date().toISOString()}`
          });
        }

        return res.status(200).json({
          success: true,
          message: `SMTP connection to ${config.host}:${config.port} verified successfully!`,
          test_sent_to: test_email || null,
          messageId: testSendResult?.messageId || null
        });
      } catch (verifyError: any) {
        console.error('SMTP Verification Error:', verifyError);
        return res.status(500).json({
          success: false,
          error: `SMTP Verification Failed: ${verifyError.message || verifyError}`,
          code: verifyError.code || 'SMTP_VERIFY_ERROR'
        });
      }
    }

    // 2. Dispatch Corporate Email Action
    if (!to && !bcc) {
      return res.status(400).json({
        success: false,
        error: 'Missing recipient. "to" or "bcc" must be provided.'
      });
    }

    if (!subject) {
      return res.status(400).json({
        success: false,
        error: 'Missing email subject.'
      });
    }

    if (!html && !text) {
      return res.status(400).json({
        success: false,
        error: 'Missing email body (HTML or plain text required).'
      });
    }

    const mailOptions: SendMailOptions = {
      from: config.defaultFrom,
      to: to || undefined,
      bcc: bcc || undefined,
      cc: cc || undefined,
      replyTo: replyTo || config.user,
      subject: subject,
      html: html || undefined,
      text: text || undefined,
      headers: {
        'X-Entity-Ref-ID': `PIGL-${Date.now()}`,
        'X-Mailer': 'PIGL Corporate Dispatch Engine/1.0'
      }
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
      sent_at: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error in /api/send-email:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Mail Server Error',
      code: error.code || 'MAIL_DISPATCH_FAILED'
    });
  }
}
