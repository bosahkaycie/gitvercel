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
 * Generates an executive, branded, responsive HTML email
 */
export function generateApplicantEmailHtml(params: ApplicantEmailParams): string {
  const {
    type,
    candidateName,
    jobTitle,
    interviewDate,
    interviewTime,
    interviewMode,
    meetingLink,
    interviewLocation,
    interviewerNames,
    specialInstructions,
    startDate,
    department,
    customMessage
  } = params;

  const role = jobTitle || 'Career Opportunity';
  const formattedDate = formatReadableDate(interviewDate);
  const formattedStartDate = formatReadableDate(startDate);

  // Type-specific banner config
  let bannerTitle = 'Application Update';
  let bannerSubtitle = role;
  let bannerBadge = 'Official Notice';
  let badgeBg = '#10b981';

  if (type === 'interview') {
    bannerTitle = 'Interview Invitation';
    bannerBadge = 'Action Required: Confirm Availability';
    badgeBg = '#10b981';
  } else if (type === 'shortlisted') {
    bannerTitle = 'Application Shortlisted';
    bannerBadge = 'Next Stage Qualification';
    badgeBg = '#f59e0b';
  } else if (type === 'offer') {
    bannerTitle = 'Offer of Employment';
    bannerBadge = 'Welcome to the Team';
    badgeBg = '#059669';
  } else if (type === 'talent_pool') {
    bannerTitle = 'Application Status Update';
    bannerBadge = 'Talent Network Archival';
    badgeBg = '#64748b';
  }

  // Format the main body paragraphs
  const messageText = customMessage || getDefaultMessage(params);
  const formattedParagraphs = messageText
    .split('\n\n')
    .map(p => {
      // Escape HTML entities
      const escaped = p
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/>');
      return `<p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 1.65; color: #334155;">${escaped}</p>`;
    })
    .join('');

  // Structured details box for interviews
  let detailsBoxHtml = '';
  if (type === 'interview') {
    const venueValue = interviewMode === 'virtual'
      ? (meetingLink 
          ? `<a href="${meetingLink}" target="_blank" style="color: #059669; font-weight: bold; text-decoration: underline;">${meetingLink}</a>` 
          : 'Virtual Video Conference (Link to follow)')
      : (interviewLocation || 'PIGL Operations Base, #3 Diamond Close, Off Eneka Link Road, Port Harcourt');

    detailsBoxHtml = `
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 5px solid #10b981; border-radius: 8px; padding: 18px 20px; margin: 24px 0;">
        <h4 style="margin: 0 0 12px 0; color: #065f46; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">
          📅 Interview Schedule & Access Details
        </h4>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 13.5px; color: #1e293b; border-collapse: collapse;">
          <tr>
            <td width="30%" style="padding: 6px 0; color: #64748b; font-weight: 600;">Date:</td>
            <td width="70%" style="padding: 6px 0; font-weight: 700; color: #0f172a;">${formattedDate || 'To be confirmed'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Time:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${interviewTime || 'To be announced'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Format:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${interviewMode === 'virtual' ? '🎥 Virtual Video Meeting' : '🏢 In-Person Evaluation'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600; vertical-align: top;">Location / Link:</td>
            <td style="padding: 6px 0; font-weight: 500; color: #0f172a;">${venueValue}</td>
          </tr>
          ${interviewerNames ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Evaluation Panel:</td>
            <td style="padding: 6px 0; color: #0f172a;">${interviewerNames}</td>
          </tr>
          ` : ''}
          ${specialInstructions ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600; vertical-align: top;">Instructions:</td>
            <td style="padding: 6px 0; color: #0f172a;">${specialInstructions}</td>
          </tr>
          ` : ''}
        </table>
        ${interviewMode === 'virtual' && meetingLink ? `
          <div style="margin-top: 16px; text-align: center;">
            <a href="${meetingLink}" target="_blank" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 10px 24px; border-radius: 6px; box-shadow: 0 2px 4px rgba(5,150,105,0.2);">
              🔗 Click Here to Join Meeting
            </a>
          </div>
        ` : ''}
      </div>
    `;
  } else if (type === 'offer') {
    detailsBoxHtml = `
      <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-left: 5px solid #059669; border-radius: 8px; padding: 18px 20px; margin: 24px 0;">
        <h4 style="margin: 0 0 10px 0; color: #065f46; font-size: 14px; text-transform: uppercase; font-weight: 700;">
          🎉 Appointment Summary
        </h4>
        <p style="margin: 4px 0; font-size: 13.5px; color: #1e293b;"><strong>Role:</strong> ${role}</p>
        ${department ? `<p style="margin: 4px 0; font-size: 13.5px; color: #1e293b;"><strong>Department:</strong> ${department}</p>` : ''}
        ${formattedStartDate ? `<p style="margin: 4px 0; font-size: 13.5px; color: #1e293b;"><strong>Proposed Commencement:</strong> ${formattedStartDate}</p>` : ''}
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${bannerTitle} - Polaris Integrated & GeoSolutions</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #334155;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #022c22; padding: 28px 30px; text-align: left; border-bottom: 3px solid #10b981;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.2px;">
                      Polaris Integrated &amp; GeoSolutions
                    </h1>
                    <p style="margin: 4px 0 0 0; color: #6ee7b7; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">
                      Subsurface, Marine &amp; Infrastructure Engineering
                    </p>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #a7f3d0; font-size: 10.5px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px;">
                      Careers Portal
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title Bar -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 16px 30px; border-bottom: 1px solid #e2e8f0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h2 style="margin: 0; font-size: 17px; font-weight: 700; color: #0f172a;">
                      ${bannerTitle}
                    </h2>
                    <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">
                      Position: <strong style="color: #334155;">${role}</strong> &bull; Candidate: <strong style="color: #334155;">${candidateName}</strong>
                    </p>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: ${badgeBg}; color: #ffffff; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
                      ${bannerBadge}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              ${formattedParagraphs}
              ${detailsBoxHtml}

              <!-- Corporate Assurance Note -->
              <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                <p style="margin: 0;">
                  This message is an official corporate transmission from <strong>Polaris Integrated &amp; GeoSolutions Limited (PIGL) Careers Division</strong>. If you did not apply for this opening or received this email in error, please notify our team immediately at <a href="mailto:career@polarisigl.com" style="color: #059669; text-decoration: none;">career@polarisigl.com</a>.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 30px; text-align: center; color: #94a3b8; font-size: 11.5px; line-height: 1.6;">
              <p style="margin: 0 0 8px 0; color: #f1f5f9; font-weight: 700; font-size: 12px;">
                Polaris Integrated &amp; GeoSolutions Limited (PIGL)
              </p>
              <p style="margin: 0 0 8px 0;">
                #3 Diamond Close, Castle &amp; Green Estate, Off Eneka Link Road, Port Harcourt, Rivers State, Nigeria<br>
                Tel: +234 809 7081 333 &bull; Email: <a href="mailto:career@polarisigl.com" style="color: #34d399; text-decoration: none;">career@polarisigl.com</a> &bull; Web: <a href="https://polarisigl.com" target="_blank" style="color: #34d399; text-decoration: none;">polarisigl.com</a>
              </p>
              <p style="margin: 0; color: #64748b; font-size: 10.5px;">
                &copy; ${new Date().getFullYear()} Polaris Integrated &amp; GeoSolutions Limited. All rights reserved.
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
