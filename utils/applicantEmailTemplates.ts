/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Applicant Email Templates & Corporate HTML Dispatch Formatter
 */

export type ApplicantEmailType = 'interview' | 'shortlisted' | 'offer' | 'talent_pool' | 'custom';

export interface ApplicantEmailParams {
  type: ApplicantEmailType;
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

export function getDefaultMessage(params: ApplicantEmailParams): string {
  const { type, candidateName, jobTitle, interviewDate, interviewTime, interviewMode, meetingLink, interviewLocation, interviewerNames, specialInstructions, startDate, department } = params;
  const role = jobTitle || 'the position';
  const formattedDate = formatReadableDate(interviewDate);

  switch (type) {
    case 'interview': {
      const modeText = interviewMode === 'virtual' ? 'virtual video conference' : 'in-person meeting';
      const venueText = interviewMode === 'virtual' 
        ? (meetingLink ? `Meeting Link: ${meetingLink}` : 'A video conference link will be shared prior to the session.') 
        : (interviewLocation || 'PIGL Corporate Operations Base, #3 Diamond Close, Castle & Green Estate, Off Eneka Link Road, Port Harcourt, Rivers State');

      return `Dear ${candidateName},

Thank you for your interest in joining Polaris Integrated & GeoSolutions Limited (PIGL) and for submitting your application for the ${role} position.

Following a thorough evaluation of your qualifications and experience, we are pleased to invite you for an interview (${modeText}) with our recruitment and technical evaluation panel.

Interview Details:
• Date: ${formattedDate || '[Interview Date]'}
• Time: ${interviewTime || '[Interview Time] (WAT)'}
• Format: ${interviewMode === 'virtual' ? 'Virtual Video Conference' : 'In-Person Assessment'}
• Location / Access: ${venueText}
• Interview Panel: ${interviewerNames || 'Technical Assessment Committee & HR'}

${specialInstructions ? `Special Instructions / Requirements:\n${specialInstructions}\n` : `Please ensure you have copies of your educational certificates, professional licenses, and relevant project portfolio ready for discussion.`}

Please reply directly to this email to confirm your availability at the scheduled time. If you require any scheduling adjustments, let us know as soon as possible.

We look forward to discussing how your background and skills align with our ongoing engineering and survey operations.

Warm regards,
Recruitment & Human Resources Team
Polaris Integrated & GeoSolutions Limited`;
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
    candidateName,
    jobTitle,
    interviewMode,
    meetingLink,
    customMessage
  } = params;

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
      const escaped = p
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/>');
      return `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.65; color: #1e293b;">${escaped}</p>`;
    })
    .join('');

  // Optional join button for virtual interviews
  const actionButtonHtml = (type === 'interview' && interviewMode === 'virtual' && meetingLink) ? `
    <div style="margin: 20px 0 24px 0;">
      <a href="${meetingLink}" target="_blank" style="display: inline-block; background-color: #065f46; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13.5px; padding: 10px 22px; border-radius: 4px;">
        Join Video Meeting &rarr;
      </a>
    </div>
  ` : '';

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
