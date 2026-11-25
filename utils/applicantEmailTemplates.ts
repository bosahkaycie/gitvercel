/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Applicant Email Templates & Corporate HTML Dispatch Formatter
 */

import { buildInterviewQrImageUrl } from './interviewPass';

export type ApplicantEmailType = 'interview' | 'shortlisted' | 'offer' | 'talent_pool' | 'custom';

export interface ApplicantEmailParams {
  type: ApplicantEmailType;
  applicationId?: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewMode?: 'virtual' | 'physical';
  interviewLocation?: string;
  meetingLink?: string;
  interviewerNames?: string;
  specialInstructions?: string;
  nextSteps?: string;
  startDate?: string;
  department?: string;
  customSubject?: string;
  customMessage?: string;
  includeQrPass?: boolean;
}

export function formatReadableDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getDefaultSubject(type: ApplicantEmailType, jobTitle: string, candidateName: string): string {
  const role = jobTitle || 'Specialist Role';
  switch (type) {
    case 'interview':
      return `Invitation for Interview: ${role} - Polaris Integrated & GeoSolutions`;
    case 'shortlisted':
      return `Update on your application for ${role} - Shortlisted - PIGL`;
    case 'offer':
      return `Formal Offer of Employment: ${role} - Polaris Integrated & GeoSolutions`;
    case 'talent_pool':
      return `Status Update: ${role} Application - Polaris Integrated & GeoSolutions`;
    case 'custom':
    default:
      return `Communication regarding your application for ${role} - PIGL`;
  }
}

/**
 * Returns a concise, role-specific preparation instruction for the interview email.
 */
export function getRolePreparationNote(jobTitle: string, interviewMode: 'virtual' | 'physical' = 'physical'): string {
  const r = (jobTitle || '').toLowerCase();
  const isOnline = interviewMode === 'virtual';
  const prefix = isOnline ? 'Please have soft copies of' : 'Please come with copies of';
  const suffix = isOnline ? ' ready for reference during the session.' : '.';

  if (r.includes('survey') || r.includes('hydrographic') || r.includes('geophysical') || r.includes('marine') || r.includes('data processor')) {
    return `${prefix} your educational certificates, relevant professional certifications (e.g., SURCON) and a summary of your survey project experience${suffix}`;
  }
  if (r.includes('civil') || r.includes('pipeline') || r.includes('geotechnical') || r.includes('facilities') || r.includes('engineer')) {
    return `${prefix} your educational certificates, relevant professional certifications (e.g., COREN/NSE) and a portfolio of your engineering projects${suffix}`;
  }
  if (r.includes('project manager') || r.includes('manager')) {
    return `${prefix} your educational certificates, relevant professional certifications and a portfolio of your work${suffix}`;
  }
  return `${prefix} your educational certificates, relevant professional certifications and a portfolio of your work${suffix}`;
}

export function getDefaultMessage(params: ApplicantEmailParams): string {
  const { type, candidateName, jobTitle, interviewDate, interviewTime, interviewMode, meetingLink, interviewLocation, specialInstructions, startDate, department } = params;
  const role = jobTitle || 'the position';
  const formattedDate = formatReadableDate(interviewDate);

  switch (type) {
    case 'interview': {
      const isOnline = interviewMode === 'virtual';
      const modePhrase = isOnline ? 'an online interview' : 'an in-person interview';
      const venueLine = isOnline
        ? `Meeting Link: ${meetingLink || 'A video meeting link will be shared prior to the session.'}`
        : `Venue: ${interviewLocation || 'PIGL Operations Base, #3 Diamond Close, Castle & Green Estate, Off Eneka Link Road, Port Harcourt.'}`;
      const prepLine = (specialInstructions && specialInstructions.trim())
        ? specialInstructions.trim()
        : getRolePreparationNote(role, isOnline ? 'virtual' : 'physical');
      const closingLine = isOnline ? 'We look forward to speaking with you.' : 'We look forward to meeting you.';

      return `Dear ${candidateName},

Thank you for applying for the position of ${role} at Polaris Integrated & GeoSolutions Limited (PIGL).

We are pleased to invite you for ${modePhrase} with our recruitment and technical evaluation team.

Interview Details

Date: ${formattedDate || '[Interview Date]'}
Time: ${interviewTime || '[Interview Time] (WAT)'}
${venueLine}

${prepLine}

Kindly reply to this email to confirm your availability. If you require an alternative interview time, please let us know.

${closingLine}

Kind regards,
Recruitment & Human Resources Team
Polaris Integrated & GeoSolutions Limited (PIGL)`;
    }

    case 'shortlisted': {
      return `Dear ${candidateName},

Thank you for taking the time to apply for the ${role} position at Polaris Integrated & GeoSolutions Limited (PIGL).

We are pleased to inform you that following the review of your credentials and experience, your profile has been shortlisted for the next stage of our selection process.

Our technical evaluation team is currently finalizing interview schedules and assessment frameworks. A member of our Human Resources team will contact you shortly with the exact schedule, format, and details for your interview.

In the meantime, feel free to visit our corporate portal at https://polarisigl.com to learn more about our ongoing marine, geomatics, and energy infrastructure projects.

Thank you once again for your interest in building a career with Polaris Integrated & GeoSolutions.

Warm regards,
Talent Acquisition Team
Polaris Integrated & GeoSolutions Limited`;
    }

    case 'offer': {
      const formattedStartDate = formatReadableDate(startDate);
      return `Dear ${candidateName},

On behalf of Polaris Integrated & GeoSolutions Limited (PIGL), we are thrilled to extend a formal offer of employment for the position of ${role}${department ? ` within our ${department} department` : ''}.

Throughout the interview and screening process, our team was deeply impressed with your technical competence, professional accomplishments, and alignment with PIGL's core values of safety, engineering precision, and client excellence.

Offer Highlights:
• Position: ${role}
• Department: ${department || 'Operations & Engineering'}
• Proposed Start Date: ${formattedStartDate || '[Proposed Start Date]'}
• Location: Port Harcourt Corporate Base / Designated Project Sites

A comprehensive formal offer letter detailing the compensation structure, medical coverage, allowances, statutory benefits, and onboarding documentation is being finalized and will be shared with you shortly.

Please confirm receipt of this notification. We are very excited about the prospect of welcoming you to the Polaris team!

Warm regards,
Executive Management & HR
Polaris Integrated & GeoSolutions Limited`;
    }

    case 'talent_pool': {
      return `Dear ${candidateName},

Thank you for your application for the ${role} position and for your interest in pursuing a career with Polaris Integrated & GeoSolutions Limited (PIGL).

We received an exceptional volume of highly qualified applications for this vacancy. After careful review and benchmarking against our current operational specifications, we have decided to advance with other candidates whose specific background more closely matches the immediate requirements of this role.

However, we were very impressed by your qualifications and engineering background. With your permission, we have retained your resume and application in our active Talent Network database. As new contracts, offshore campaigns, and vacancies arise across our energy and survey divisions, our recruitment team will reach out to you directly.

We genuinely appreciate the time and effort you invested in applying to PIGL, and we wish you every success in your professional endeavors.

Warm regards,
Human Resources & Recruitment
Polaris Integrated & GeoSolutions Limited`;
    }

    case 'custom':
    default: {
      return `Dear ${candidateName},

We are writing with respect to your application for the ${role} opening at Polaris Integrated & GeoSolutions Limited.

[Insert your custom communication here]

If you have any questions, please do not hesitate to reach out by replying directly to this email.

Warm regards,
Recruitment & Human Resources
Polaris Integrated & GeoSolutions Limited`;
    }
  }
}

/**
 * Generates an executive, branded, minimal, and content-focused HTML email
 */
export function generateApplicantEmailHtml(params: ApplicantEmailParams): string {
  const {
    type,
    applicationId,
    candidateName,
    jobTitle,
    interviewDate,
    interviewTime,
    interviewMode,
    meetingLink,
    customMessage,
    includeQrPass = type === 'interview',
  } = params;

  const escapeHtml = (val: string) =>
    val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Email title for head/preview
  let cleanTitle = 'Application Update';
  if (type === 'interview') cleanTitle = 'Interview Invitation';
  else if (type === 'shortlisted') cleanTitle = 'Application Shortlisted';
  else if (type === 'offer') cleanTitle = 'Offer of Employment';
  else if (type === 'talent_pool') cleanTitle = 'Application Status Update';

  // Format the body paragraphs cleanly
  const messageText = customMessage || getDefaultMessage(params);
  const formattedParagraphs = messageText
    .split('\n\n')
    .map(p => {
      const trimmed = p.trim();
      const escaped = trimmed
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/>');

      if (trimmed === 'Interview Details' || trimmed === 'Offer Highlights:') {
        return `<p style="margin: 20px 0 8px 0; font-size: 15px; font-weight: 700; color: #0f172a;">${escaped}</p>`;
      }
      return `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.65; color: #1e293b;">${escaped}</p>`;
    })
    .join('');

  // Optional join button for virtual interviews
  const actionButtonHtml = (type === 'interview' && interviewMode === 'virtual' && meetingLink) ? `
    <div style="margin: 18px 0 22px 0;">
      <a href="${meetingLink}" target="_blank" style="display: inline-block; background-color: #065f46; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13.5px; padding: 10px 22px; border-radius: 4px;">
        Join Video Meeting &rarr;
      </a>
    </div>
  ` : '';

  // Silent, unobtrusive embedded QR code (no text or data displayed alongside it; gated for office administrators)
  const qrPassHtml = (type === 'interview' && includeQrPass) ? (() => {
    const qrUrl = buildInterviewQrImageUrl({
      applicationId: applicationId || 'preview',
      candidateName: candidateName || 'Candidate',
      jobTitle: jobTitle || 'Role',
      interviewDate: interviewDate || '',
      interviewTime: interviewTime || '',
    }, 150);

    return `
      <div style="margin: 22px 0 4px 0; line-height: 0;">
        <img src="${qrUrl}" alt="" width="96" height="96" style="display: block; width: 96px; height: 96px; border: 0;" />
      </div>
    `;
  })() : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanTitle} - Polaris Integrated &amp; GeoSolutions</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          
          <!-- Header Banner: Provided Official Brand Banner -->
          <tr>
            <td style="padding: 0; line-height: 0; background-color: #ffffff;">
              <img src="https://polarisigl.com/assets/email-header.jpg" alt="Polaris Integrated &amp; GeoSolutions Ltd" width="600" style="display: block; width: 100%; max-width: 600px; height: auto; border: 0;" />
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 32px 32px 28px 32px; font-size: 15px; line-height: 1.65; color: #1e293b;">
              ${formattedParagraphs}
              ${actionButtonHtml}
              ${qrPassHtml}
            </td>
          </tr>

          <!-- Minimal, Clean Footer -->
          <tr>
            <td style="padding: 22px 32px; border-top: 1px solid #e2e8f0; background-color: #f8fafc; font-size: 12px; color: #64748b; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 700; color: #334155;">
                Polaris Integrated &amp; GeoSolutions Limited (PIGL)
              </p>
              <p style="margin: 0 0 4px 0;">
                #3 Diamond Close, Castle &amp; Green Estate, Off Eneka Link Road, Port Harcourt, Rivers State, Nigeria
              </p>
              <p style="margin: 0;">
                Phone: +234 809 7081 333 &bull; Email: <a href="mailto:career@polarisigl.com" style="color: #065f46; font-weight: 600; text-decoration: none;">career@polarisigl.com</a> &bull; Web: <a href="https://polarisigl.com" target="_blank" style="color: #065f46; font-weight: 600; text-decoration: none;">polarisigl.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
