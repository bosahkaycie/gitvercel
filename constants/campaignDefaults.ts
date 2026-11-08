import { Campaign, CampaignForm, CampaignEmailTemplate } from '../types/campaign';

export const DEFAULT_CAMPAIGN_CATEGORIES: string[] = [
  'Conference',
  'Exhibition',
  'Stakeholder Engagement',
  'Corporate Event',
  'Seminar',
  'Outreach',
  'Business Development',
  'Technical Workshop',
  'Other'
];

export const INITIAL_SAMPLE_CAMPAIGN: Campaign = {
  id: 'nog-energy-week-2027',
  name: 'Nigeria Oil & Gas (NOG) Energy Week 2027',
  slug: 'nog-energy-week-2027',
  description: 'Official PIGL Exhibition Booth & Executive Stakeholder Engagement at the ICC Abuja.',
  category: 'Conference',
  eventName: 'NOG Energy Week 2027',
  eventLocation: 'International Conference Centre (ICC), Abuja, Nigeria',
  eventStartDate: '2027-06-28',
  eventEndDate: '2027-07-02',
  campaignStartDate: '2026-11-01',
  campaignClosingDate: '2027-07-15',
  coverImageUrl: '/assets/pigl_conference_keynote.jpg',
  logoImageUrl: '/assets/LOGO.png',
  assignedFormId: 'form-nog-2027',
  status: 'active',
  publicVisibility: true,
  assignedStaff: ['admin@polarisigl.com', 'bd@polarisigl.com'],
  introductionText: 'Welcome to the Polaris Integrated & GeoSolutions Limited (PIGL) engagement portal. Connect with our engineering directors and technical specialists to explore precision solutions across our four operating divisions.',
  confirmationMessage: 'Thank you for connecting with Polaris Integrated & GeoSolutions Limited (PIGL). Our senior engineering scoping team has received your technical brief and will be in touch shortly.',
  termsAndPrivacyText: 'Polaris Integrated & GeoSolutions Limited respects your privacy and is committed to protecting your personal data in accordance with the Nigeria Data Protection Act (NDPA). Information provided is used solely for technical follow-up and authorized engineering collaboration.',
  createdBy: 'admin@polarisigl.com',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const INITIAL_SAMPLE_FORM: CampaignForm = {
  id: 'form-nog-2027',
  campaignId: 'nog-energy-week-2027',
  title: 'PIGL Technical Scoping & Executive Engagement Form',
  description: 'Please provide your contact details and operational interests so we can connect you with the appropriate technical division head.',
  activeVersion: 1,
  versions: [
    {
      id: 'v1-nog-2027',
      versionNumber: 1,
      createdAt: new Date().toISOString(),
      fields: [
        {
          id: 'f_heading_personal',
          type: 'section_heading',
          label: '1. Delegate Information',
          required: false,
          order: 1
        },
        {
          id: 'f_full_name',
          type: 'short_text',
          label: 'Full Name',
          placeholder: 'Engr. / Dr. / Mr. / Ms. Full Name',
          required: true,
          order: 2
        },
        {
          id: 'f_email',
          type: 'email',
          label: 'Official Corporate Email',
          placeholder: 'name@company.com',
          required: true,
          order: 3
        },
        {
          id: 'f_phone',
          type: 'phone',
          label: 'Telephone / Mobile Number',
          placeholder: '+234 800 000 0000',
          required: true,
          order: 4
        },
        {
          id: 'f_company',
          type: 'short_text',
          label: 'Company / Organization',
          placeholder: 'e.g. Shell, NNPC Ltd, Chevron, TotalEnergies',
          required: true,
          order: 5
        },
        {
          id: 'f_job_title',
          type: 'short_text',
          label: 'Designation / Job Title',
          placeholder: 'e.g. Managing Director, Lead Project Engineer',
          required: false,
          order: 6
        },
        {
          id: 'f_heading_services',
          type: 'section_heading',
          label: '2. PIGL Operating Divisions of Interest',
          description: 'Select one or more of PIGL’s specialized engineering divisions relevant to your current projects.',
          required: false,
          order: 7
        },
        {
          id: 'f_divisions',
          type: 'checkbox',
          label: 'PIGL Operating Divisions',
          required: true,
          options: [
            { id: 'geo', label: 'Geosolutions & Engineering Services (CPT, Geotechnical, 3D Reality Capture, Geomatics)', value: 'geosolutions' },
            { id: 'met', label: 'Metocean & Marine Solutions (Hydrographic, Metocean, Sub-bottom Profiling, Rig Positioning)', value: 'metocean' },
            { id: 'con', label: 'Integrated Construction Services (Swamp Pipeline, Structural Fabrication, Civil Works)', value: 'construction' },
            { id: 'ind', label: 'Industrial Solutions (Cathodic Protection, NDT Asset Integrity, Valve Servicing, Water Treatment)', value: 'industrial' }
          ],
          order: 8
        },
        {
          id: 'f_scope',
          type: 'long_text',
          label: 'Project Scope / Technical Requirement Summary',
          placeholder: 'Briefly describe your asset location, terrain, timeline, or scope of inquiry...',
          required: false,
          order: 9
        },
        {
          id: 'f_timeline',
          type: 'dropdown',
          label: 'Anticipated Project Timeline',
          required: false,
          options: [
            { id: 't_immediate', label: 'Immediate (Within 30 Days)', value: 'immediate' },
            { id: 't_q1', label: '1 - 3 Months', value: '1-3_months' },
            { id: 't_q2', label: '3 - 6 Months', value: '3-6_months' },
            { id: 't_future', label: 'Strategic Planning / Future Tender', value: 'future' }
          ],
          order: 10
        },
        {
          id: 'f_consent',
          type: 'consent',
          label: 'I consent to Polaris Integrated & GeoSolutions Limited processing my contact details for professional technical consultation.',
          required: true,
          order: 11
        }
      ]
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const INITIAL_SAMPLE_EMAIL_TEMPLATE: CampaignEmailTemplate = {
  id: 'email-tmpl-nog-2027',
  campaignId: 'nog-energy-week-2027',
  templateType: 'visitor_acknowledgement',
  senderName: 'Polaris Integrated & GeoSolutions Limited (PIGL)',
  senderEmail: 'bd@polarisigl.com',
  replyTo: 'info@polarisigl.com',
  subject: 'Thank You for Connecting with PIGL at {{event_name}}',
  bodyHtml: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <div style="background-color: #0f172a; padding: 28px 32px; text-align: left; border-bottom: 3px solid #059669;">
    <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">POLARIS INTEGRATED &amp; GEOSOLUTIONS</h1>
    <p style="color: #34d399; font-size: 11px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Technical Engagement Desk</p>
  </div>
  
  <div style="padding: 32px; color: #334155; line-height: 1.6; font-size: 15px;">
    <p style="margin-top: 0; font-size: 16px; color: #0f172a;">Dear <strong>{{first_name}}</strong>,</p>
    
    <p>Thank you for visiting the <strong>Polaris Integrated &amp; GeoSolutions Limited (PIGL)</strong> exhibition booth at <strong>{{event_name}}</strong> in {{event_location}}.</p>
    
    <p>We appreciated the opportunity to connect with you and discuss your organization's engineering and operational requirements. Our technical leadership team has logged your submission (Reference: <code>{{submission_id}}</code>) and assigned it to the appropriate division specialists.</p>
    
    <div style="background-color: #f8fafc; border-left: 4px solid #059669; padding: 16px 20px; margin: 24px 0; border-radius: 0 6px 6px 0;">
      <p style="margin: 0; font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">PIGL Operating Divisions</p>
      <ul style="margin: 8px 0 0; padding-left: 18px; font-size: 13px; color: #475569;">
        <li><strong>Geosolutions &amp; Engineering Services:</strong> 20-Ton CPT, Geotechnical Pontoon Drilling, 3D Laser Scanning.</li>
        <li><strong>Metocean &amp; Marine Solutions:</strong> Multibeam Bathymetry, Oceanographic Buoys, Shallow Geophysical.</li>
        <li><strong>Integrated Construction Services:</strong> Swamp Flowline Laying, River Crossing, Structural Fabrication.</li>
        <li><strong>Industrial Solutions:</strong> Asset Integrity NDT, Cathodic Protection, Skid Maintenance.</li>
      </ul>
    </div>
    
    <p>Should you require immediate technical documentation or an engineering capability presentation, please feel free to reply directly to this email or reach us at <a href="mailto:info@polarisigl.com" style="color: #059669; text-decoration: none; font-weight: 600;">info@polarisigl.com</a>.</p>
    
    <p style="margin-bottom: 0;">Warm regards,</p>
    <p style="margin-top: 4px; font-weight: 700; color: #0f172a;">
      Corporate Engagement &amp; Business Development Team<br/>
      <span style="font-weight: 400; font-size: 13px; color: #64748b;">Polaris Integrated &amp; GeoSolutions Limited</span>
    </p>
  </div>
  
  <div style="background-color: #f1f5f9; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
    <p style="margin: 0;">&copy; 2026 Polaris Integrated &amp; GeoSolutions Limited. All rights reserved.</p>
    <p style="margin: 4px 0 0;">Plot 12, Commercial Area, Port Harcourt &amp; Victoria Island, Lagos, Nigeria.</p>
  </div>
</div>
  `,
  bodyText: `Dear {{first_name}},

Thank you for visiting the Polaris Integrated & GeoSolutions Limited (PIGL) exhibition booth at {{event_name}}.

We appreciate the opportunity to connect with you and learn more about your operational interests. Our team looks forward to staying in touch and exploring how our engineering capabilities can support {{company_name}}.

Best regards,
Polaris Integrated & GeoSolutions Limited (PIGL)
info@polarisigl.com | https://polarisigl.com`,
  enabled: true,
  internalRecipients: ['admin@polarisigl.com', 'bd@polarisigl.com'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
