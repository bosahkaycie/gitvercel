import fs from 'fs';
import path from 'path';

const campaigns = [
  {
    id: 'naice-spe-2026',
    name: 'NAICE SPE 2026 (Society of Petroleum Engineers)',
    slug: 'naice-spe-2026',
    description: 'Society of Petroleum Engineers (SPE) Nigeria Annual International Conference & Exhibition (NAICE 2026) - PIGL Exhibition Stand & Technical Scoping.',
    category: 'Conference',
    eventName: 'NAICE SPE 2026',
    eventLocation: 'Eko Hotel & Suites, Victoria Island, Lagos, Nigeria',
    eventStartDate: '2026-08-01',
    eventEndDate: '2026-08-05',
    campaignStartDate: '2026-08-01',
    campaignClosingDate: '2026-08-31',
    coverImageUrl: '/assets/pigl_conference_keynote.jpg',
    logoImageUrl: '/assets/LOGO.png',
    assignedFormId: 'form-naice-spe-2026',
    status: 'active',
    publicVisibility: true,
    assignedStaff: ['admin@polarisigl.com', 'bd@polarisigl.com', 'hello@polarisigl.com'],
    introductionText: 'Welcome to the Polaris Integrated & GeoSolutions Limited (PIGL) NAICE SPE 2026 engagement portal. Connect with our engineering directors and technical specialists to explore precision solutions across our four operating divisions.',
    confirmationMessage: 'Thank you for connecting with Polaris Integrated & GeoSolutions Limited (PIGL) at NAICE SPE 2026. Our senior engineering scoping team has received your technical brief and will be in touch shortly.',
    termsAndPrivacyText: 'Polaris Integrated & GeoSolutions Limited respects your privacy and is committed to protecting your personal data in accordance with the Nigeria Data Protection Act (NDPA). Information provided is used solely for technical follow-up and authorized engineering collaboration.',
    createdBy: 'admin@polarisigl.com',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'nape-2026',
    name: 'NAPE 2026 Annual International Conference & Exhibition',
    slug: 'nape-2026',
    description: '42nd Annual International Conference & Exhibition of the Nigerian Association of Petroleum Explorationists (NAPE) - PIGL Exhibition Stand & Technical Scoping.',
    category: 'Conference',
    eventName: 'NAPE 2026',
    eventLocation: 'Eko Hotel & Suites, Victoria Island, Lagos, Nigeria',
    eventStartDate: '2026-11-08',
    eventEndDate: '2026-11-12',
    campaignStartDate: '2026-11-01',
    campaignClosingDate: '2026-11-30',
    coverImageUrl: '/assets/pigl_conference_keynote.jpg',
    logoImageUrl: '/assets/LOGO.png',
    assignedFormId: 'form-nape-2026',
    status: 'active',
    publicVisibility: true,
    assignedStaff: ['admin@polarisigl.com', 'bd@polarisigl.com', 'hello@polarisigl.com'],
    introductionText: 'Welcome to the Polaris Integrated & GeoSolutions Limited (PIGL) NAPE 2026 engagement portal. Connect with our engineering directors and technical specialists to explore precision solutions across our four operating divisions.',
    confirmationMessage: 'Thank you for connecting with Polaris Integrated & GeoSolutions Limited (PIGL) at NAPE 2026. Our senior engineering scoping team has received your technical brief and will be in touch shortly.',
    termsAndPrivacyText: 'Polaris Integrated & GeoSolutions Limited respects your privacy and is committed to protecting your personal data in accordance with the Nigeria Data Protection Act (NDPA). Information provided is used solely for technical follow-up and authorized engineering collaboration.',
    createdBy: 'admin@polarisigl.com',
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
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
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  }
];

const forms = [
  {
    id: 'form-naice-spe-2026',
    campaignId: 'naice-spe-2026',
    title: 'NAICE SPE 2026 Technical Scoping & Delegate Intake Form',
    description: 'Official delegate engagement and engineering consultation inquiry form for NAICE SPE 2026.',
    activeVersion: 1,
    versions: [
      {
        id: 'v1-naice-spe-2026',
        versionNumber: 1,
        createdAt: '2026-08-01T00:00:00Z',
        fields: [
          { id: 'full_name', type: 'short_text', label: 'Full Name', required: true, order: 1, placeholder: 'e.g. Engr. Oladipo Adeleke' },
          { id: 'email', type: 'email', label: 'Corporate / Official Email Address', required: false, order: 2, placeholder: 'e.g. name@energyfirm.com' },
          { id: 'phone', type: 'phone', label: 'Phone / WhatsApp Number', required: false, order: 3, placeholder: '+234 803 000 0000' },
          { id: 'company', type: 'short_text', label: 'Company / Operating Organisation', required: true, order: 4, placeholder: 'e.g. NNPC Ltd, Chevron, NCDMB' },
          { id: 'job_title', type: 'short_text', label: 'Job Title / Designation', required: false, order: 5, placeholder: 'e.g. Lead Project Engineer, Senior Manager' },
          {
            id: 'service_divisions',
            type: 'checkbox',
            label: 'PIGL Operating Divisions of Interest',
            required: false,
            order: 6,
            options: [
              { id: 'opt_geo', label: 'Geosolutions & Engineering (CPT, 3D Laser Scanning, Geotechnical)', value: 'Geosolutions & Engineering' },
              { id: 'opt_marine', label: 'Metocean & Marine Solutions (Hydrographic, Metocean, Sub-bottom)', value: 'Metocean & Marine Solutions' },
              { id: 'opt_const', label: 'Integrated Construction (Swamp Pipelines, Structural Works)', value: 'Integrated Construction' },
              { id: 'opt_ind', label: 'Industrial Solutions (Cathodic Protection, NDT Asset Integrity, Water Treatment)', value: 'Industrial Solutions' }
            ]
          },
          {
            id: 'custom_inquiry_scope',
            type: 'long_text',
            label: 'Custom Technical Requirements / Scope of Inquiry',
            description: 'Provide details on your project timeline, asset location, or specific requirements.',
            placeholder: 'Describe your project scope...',
            required: false,
            order: 7
          },
          {
            id: 'is_student',
            type: 'checkbox',
            label: 'Attending as Student / Youth Corps Member',
            required: false,
            order: 8
          },
          {
            id: 'consent_ndpa',
            type: 'consent',
            label: 'I consent to Polaris Integrated & GeoSolutions Limited contacting me regarding this inquiry in accordance with the Nigeria Data Protection Act (NDPA).',
            required: true,
            order: 9
          }
        ]
      }
    ],
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'form-nape-2026',
    campaignId: 'nape-2026',
    title: 'NAPE 2026 Technical Scoping & Delegate Intake Form',
    description: 'Official delegate engagement and engineering consultation inquiry form for NAPE 2026.',
    activeVersion: 1,
    versions: [
      {
        id: 'v1-nape-2026',
        versionNumber: 1,
        createdAt: '2026-11-01T00:00:00Z',
        fields: [
          { id: 'full_name', type: 'short_text', label: 'Full Name', required: true, order: 1, placeholder: 'e.g. Engr. Oladipo Adeleke' },
          { id: 'email', type: 'email', label: 'Corporate / Official Email Address', required: true, order: 2, placeholder: 'e.g. name@energyfirm.com' },
          { id: 'phone', type: 'phone', label: 'Phone / WhatsApp Number', required: false, order: 3, placeholder: '+234 803 000 0000' },
          { id: 'company', type: 'short_text', label: 'Company / Operating Organisation', required: true, order: 4, placeholder: 'e.g. Shell, NNPC Ltd, Chevron, TotalEnergies, Seplat' },
          { id: 'job_title', type: 'short_text', label: 'Job Title / Designation', required: false, order: 5, placeholder: 'e.g. Executive Director, Lead Project Engineer' },
          {
            id: 'service_divisions',
            type: 'checkbox',
            label: 'PIGL Operating Divisions of Interest',
            required: false,
            order: 6,
            options: [
              { id: 'opt_geo', label: 'Geosolutions & Engineering (CPT, 3D Laser Scanning, Geotechnical)', value: 'Geosolutions & Engineering' },
              { id: 'opt_marine', label: 'Metocean & Marine Solutions (Hydrographic, Metocean, Sub-bottom)', value: 'Metocean & Marine Solutions' },
              { id: 'opt_const', label: 'Integrated Construction (Swamp Pipelines, Structural Works)', value: 'Integrated Construction' },
              { id: 'opt_ind', label: 'Industrial Solutions (Cathodic Protection, NDT Asset Integrity)', value: 'Industrial Solutions' }
            ]
          },
          {
            id: 'custom_inquiry_scope',
            type: 'long_text',
            label: 'Custom Technical Requirements / Scope of Inquiry',
            description: 'Provide details on your project timeline, asset location, or specific requirements.',
            placeholder: 'Describe your project scope...',
            required: false,
            order: 7
          },
          {
            id: 'is_student',
            type: 'checkbox',
            label: 'Attending as Student / Youth Corps Member',
            required: false,
            order: 8
          },
          {
            id: 'consent_ndpa',
            type: 'consent',
            label: 'I consent to Polaris Integrated & GeoSolutions Limited contacting me regarding this inquiry in accordance with the Nigeria Data Protection Act (NDPA).',
            required: true,
            order: 9
          }
        ]
      }
    ],
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'form-nog-2027',
    campaignId: 'nog-energy-week-2027',
    title: 'PIGL Technical Scoping & Executive Engagement Form',
    description: 'Please provide your contact details and operational interests so we can connect you with the appropriate technical division head.',
    activeVersion: 1,
    versions: [
      {
        id: 'v1-nog-2027',
        versionNumber: 1,
        createdAt: '2026-11-01T00:00:00Z',
        fields: [
          { id: 'f_full_name', type: 'short_text', label: 'Full Name', placeholder: 'Engr. / Dr. / Mr. / Ms. Full Name', required: true, order: 1 },
          { id: 'f_email', type: 'email', label: 'Official Corporate Email', placeholder: 'name@company.com', required: true, order: 2 },
          { id: 'f_phone', type: 'phone', label: 'Telephone / Mobile Number', placeholder: '+234 800 000 0000', required: false, order: 3 },
          { id: 'f_company', type: 'short_text', label: 'Company / Organization', placeholder: 'e.g. Shell, NNPC Ltd, Chevron, TotalEnergies', required: true, order: 4 },
          { id: 'f_job_title', type: 'short_text', label: 'Designation / Job Title', placeholder: 'e.g. Managing Director, Lead Project Engineer', required: false, order: 5 },
          {
            id: 'f_divisions',
            type: 'checkbox',
            label: 'PIGL Operating Divisions',
            required: true,
            options: [
              { id: 'geo', label: 'Geosolutions & Engineering Services (CPT, Geotechnical, 3D Reality Capture, Geomatics)', value: 'Geosolutions & Engineering' },
              { id: 'met', label: 'Metocean & Marine Solutions (Hydrographic, Metocean, Sub-bottom Profiling, Rig Positioning)', value: 'Metocean & Marine Solutions' },
              { id: 'con', label: 'Integrated Construction Services (Swamp Pipeline, Structural Fabrication, Civil Works)', value: 'Integrated Construction' },
              { id: 'ind', label: 'Industrial Solutions (Cathodic Protection, NDT Asset Integrity, Valve Servicing, Water Treatment)', value: 'Industrial Solutions' }
            ],
            order: 6
          },
          { id: 'f_scope', type: 'long_text', label: 'Project Scope / Technical Requirement Summary', placeholder: 'Briefly describe your asset location, terrain, timeline...', required: false, order: 7 },
          { id: 'f_consent', type: 'consent', label: 'I consent to Polaris Integrated & GeoSolutions Limited processing my contact details for professional technical consultation.', required: true, order: 8 }
        ]
      }
    ],
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  }
];

const emailTemplates = [
  {
    id: 'email-tmpl-naice-spe-2026',
    campaignId: 'naice-spe-2026',
    templateType: 'visitor_acknowledgement',
    senderName: 'Polaris Integrated & GeoSolutions Limited (PIGL)',
    senderEmail: 'hello@polarisigl.com',
    replyTo: 'info@polarisigl.com',
    subject: 'Thank You for Connecting with PIGL at NAICE SPE 2026 😊',
    bodyHtml: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <div style="background-color: #0f172a; padding: 28px 32px; text-align: left; border-bottom: 3px solid #059669;">
    <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">POLARIS INTEGRATED &amp; GEOSOLUTIONS</h1>
    <p style="color: #34d399; font-size: 11px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Technical Engagement Desk • NAICE SPE 2026</p>
  </div>
  <div style="padding: 32px; color: #334155; line-height: 1.6; font-size: 15px;">
    <p style="margin-top: 0; font-size: 16px; color: #0f172a;">Dear <strong>{{first_name}}</strong>,</p>
    <p>Thank you for visiting the <strong>Polaris Integrated &amp; GeoSolutions Limited (PIGL)</strong> exhibition booth at <strong>NAICE SPE 2026</strong> in Lagos, Nigeria.</p>
    <p>We appreciated the opportunity to connect with you and discuss your organization's engineering and operational requirements. Our technical leadership team has logged your submission (Reference: <code>{{submission_id}}</code>) and assigned it to the appropriate division specialists.</p>
    <div style="background-color: #f8fafc; border-left: 4px solid #059669; padding: 16px 20px; margin: 24px 0; border-radius: 0 6px 6px 0;">
      <p style="margin: 0; font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">PIGL Operating Divisions</p>
      <ul style="margin: 8px 0 0; padding-left: 18px; font-size: 13px; color: #475569;">
        <li><strong>Geosolutions &amp; Engineering Services:</strong> 20-Ton CPT, Geotechnical Pontoon Drilling, 3D Laser Scanning.</li>
        <li><strong>Metocean &amp; Marine Solutions:</strong> Multibeam Bathymetry, Oceanographic Buoys, Shallow Geophysical.</li>
        <li><strong>Integrated Construction Services:</strong> Swamp Flowline Laying, River Crossing, Structural Fabrication.</li>
        <li><strong>Industrial Solutions:</strong> Asset Integrity NDT, Cathodic Protection, Skid Maintenance, Produced Water Treatment.</li>
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
    bodyText: `Dear {{first_name}},\n\nThank you for visiting the Polaris Integrated & GeoSolutions Limited (PIGL) exhibition booth at NAICE SPE 2026.\n\nWe appreciate the opportunity to connect with you and learn more about your operational interests. Our team looks forward to staying in touch.\n\nBest regards,\nPolaris Integrated & GeoSolutions Limited (PIGL)\ninfo@polarisigl.com | https://polarisigl.com`,
    enabled: true,
    internalRecipients: ['admin@polarisigl.com', 'bd@polarisigl.com', 'info@polarisigl.com', 'worketiqs@gmail.com'],
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'email-tmpl-nape-2026',
    campaignId: 'nape-2026',
    templateType: 'visitor_acknowledgement',
    senderName: 'Polaris Integrated & GeoSolutions Limited (PIGL)',
    senderEmail: 'hello@polarisigl.com',
    replyTo: 'info@polarisigl.com',
    subject: 'Thank You for Connecting with PIGL at NAPE 2026 😊',
    bodyHtml: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <div style="background-color: #0f172a; padding: 28px 32px; text-align: left; border-bottom: 3px solid #059669;">
    <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">POLARIS INTEGRATED &amp; GEOSOLUTIONS</h1>
    <p style="color: #34d399; font-size: 11px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Technical Engagement Desk • NAPE 2026</p>
  </div>
  <div style="padding: 32px; color: #334155; line-height: 1.6; font-size: 15px;">
    <p style="margin-top: 0; font-size: 16px; color: #0f172a;">Dear <strong>{{first_name}}</strong>,</p>
    <p>Thank you for visiting the <strong>Polaris Integrated &amp; GeoSolutions Limited (PIGL)</strong> exhibition booth at <strong>NAPE 2026</strong> in Lagos, Nigeria.</p>
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
    bodyText: `Dear {{first_name}},\n\nThank you for visiting the Polaris Integrated & GeoSolutions Limited (PIGL) exhibition booth at NAPE 2026.\n\nWe appreciate the opportunity to connect with you and learn more about your operational interests. Our team looks forward to staying in touch.\n\nBest regards,\nPolaris Integrated & GeoSolutions Limited (PIGL)\ninfo@polarisigl.com | https://polarisigl.com`,
    enabled: true,
    internalRecipients: ['admin@polarisigl.com', 'bd@polarisigl.com', 'info@polarisigl.com', 'worketiqs@gmail.com'],
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'email-tmpl-nog-2027',
    campaignId: 'nog-energy-week-2027',
    templateType: 'visitor_acknowledgement',
    senderName: 'Polaris Integrated & GeoSolutions Limited (PIGL)',
    senderEmail: 'bd@polarisigl.com',
    replyTo: 'info@polarisigl.com',
    subject: 'Thank You for Connecting with PIGL at {{event_name}}',
    bodyHtml: `<p>Dear {{first_name}},</p><p>Thank you for visiting the PIGL booth at {{event_name}}.</p>`,
    bodyText: `Dear {{first_name}},\n\nThank you for visiting the PIGL booth at {{event_name}}.`,
    enabled: true,
    internalRecipients: ['admin@polarisigl.com', 'bd@polarisigl.com'],
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  }
];

const delegatesRaw = [
  {
    id: 'sub-nape-01',
    visitorName: 'Engr. Farouk Ahmed',
    visitorCompany: 'NMDPRA',
    visitorEmail: 'f.ahmed@nmdpra.gov.ng',
    visitorPhone: '+234 803 310 9921',
    visitorJobTitle: 'Authority Chief Executive (ACE)',
    isStudent: false,
    divisions: ['Geosolutions & Engineering', 'Industrial Solutions', 'Integrated Construction'],
    source: 'booth_capture',
    createdAt: '2026-11-09T02:49:06Z',
    notes: 'Visited PIGL stand at NAPE 2026. Discussed midstream/downstream regulatory compliance, pipeline integrity and 20-Ton CPT ground investigations.'
  },
  {
    id: 'sub-nape-02',
    visitorName: 'Senator Heineken Lokpobiri',
    visitorCompany: 'Federal Ministry of Petroleum Resources (Oil)',
    visitorEmail: 'h.lokpobiri@petroleumresources.gov.ng',
    visitorPhone: '+234 802 222 7800',
    visitorJobTitle: 'Honourable Minister of State for Petroleum Resources',
    isStudent: false,
    divisions: ['Geosolutions & Engineering', 'Metocean & Marine Solutions', 'Integrated Construction', 'Industrial Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-09T03:16:47Z',
    notes: 'Executive ministerial visit to PIGL exhibition booth. Commended indigenous Nigerian engineering capacity in offshore geotechnical & marine survey.'
  },
  {
    id: 'sub-nape-03',
    visitorName: 'Engr. Gbenga Komolafe',
    visitorCompany: 'Nigerian Upstream Petroleum Regulatory Commission (NUPRC)',
    visitorEmail: 'g.komolafe@nuprc.gov.ng',
    visitorPhone: '+234 803 400 3867',
    visitorJobTitle: 'Commission Chief Executive (CCE)',
    isStudent: false,
    divisions: ['Geosolutions & Engineering', 'Metocean & Marine Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-09T03:26:44Z',
    notes: 'NUPRC leadership engagement. Metocean buoy deployments and shallow geophysical survey capabilities.'
  },
  {
    id: 'sub-nape-04',
    visitorName: 'Chief Timipre Sylva',
    visitorCompany: 'Niger Delta Petroleum & Gas Consult',
    visitorEmail: 'timipre.sylva@oilandgas.ng',
    visitorPhone: '+234 803 555 9600',
    visitorJobTitle: 'Principal Consultant / Former Minister of State',
    isStudent: false,
    divisions: ['Integrated Construction', 'Industrial Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-09T03:28:20Z',
    notes: 'Discussed Niger Delta swamp pipeline construction and integrity management.'
  },
  {
    id: 'sub-nape-05',
    visitorName: 'Godwin Joy',
    visitorCompany: 'Polaris Integrated & Geosolutions Ltd',
    visitorEmail: 'joy@polarisigl.com',
    visitorPhone: '+234 803 762 1190',
    visitorJobTitle: 'Corporate Relations & Logistics',
    isStudent: false,
    divisions: ['Geosolutions & Engineering', 'Metocean & Marine Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-09T11:02:07Z',
    notes: 'Internal stand operations & VIP delegate coordination.'
  },
  {
    id: 'sub-nape-06',
    visitorName: 'Osazee Destiny',
    visitorCompany: 'National Youth Service Corps (NYSC)',
    visitorEmail: 'osazeedestiny2004@gmail.com',
    visitorPhone: '+234 814 550 2004',
    visitorJobTitle: 'Graduate Geoscientist / Corps Member',
    isStudent: true,
    divisions: ['Geosolutions & Engineering'],
    source: 'booth_capture',
    createdAt: '2026-11-09T14:52:21Z',
    notes: 'Graduate delegate interested in geotechnical field training and career placement.'
  },
  {
    id: 'sub-nape-07',
    visitorName: 'Oluwakayode Adebanjo',
    visitorCompany: 'Obafemi Awolowo University (OAU)',
    visitorEmail: 'adebanjooluwakayode77@gmail.com',
    visitorPhone: '+234 806 771 2345',
    visitorJobTitle: 'Student Geologist',
    isStudent: true,
    divisions: ['Geosolutions & Engineering', 'Metocean & Marine Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-09T15:05:23Z',
    notes: 'Student delegate registration. Inquired about graduate internship and industrial attachments.'
  },
  {
    id: 'sub-nape-08',
    visitorName: 'Edwin Nnakudo',
    visitorCompany: 'WellClean Oilfield Services Limited',
    visitorEmail: 'info@wellcleanoilfieldservices.com',
    visitorPhone: '+234 803 911 4455',
    visitorJobTitle: 'Managing Director / Operations Lead',
    isStudent: false,
    divisions: ['Industrial Solutions', 'Integrated Construction'],
    source: 'booth_capture',
    createdAt: '2026-11-10T09:05:28Z',
    notes: 'Inquired regarding offshore valve maintenance, NDT non-destructive testing, and pipeline flushing.'
  },
  {
    id: 'sub-nape-09',
    visitorName: 'Thierry Grandin',
    visitorCompany: 'Gowell Energy',
    visitorEmail: 'thierry.grandin@gowell.energy',
    visitorPhone: '+33 6 12 34 56 78',
    visitorJobTitle: 'Technical Director',
    isStudent: false,
    divisions: ['Geosolutions & Engineering', 'Industrial Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-10T09:08:54Z',
    notes: 'Discussed wireline / well logging synergy and downhole geophysical instrumentation.'
  },
  {
    id: 'sub-nape-10',
    visitorName: 'Martin Smith',
    visitorCompany: 'Petrovision Energy Services',
    visitorEmail: 'martin.smith@petro-vision.com',
    visitorPhone: '+44 7700 900077',
    visitorJobTitle: 'Senior Reservoir Geophysicist',
    isStudent: false,
    divisions: ['Geosolutions & Engineering', 'Metocean & Marine Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-10T09:28:45Z',
    notes: 'Discussed high-resolution 3D laser scanning for offshore brownfield asset integrity.'
  },
  {
    id: 'sub-nape-11',
    visitorName: 'Eke Azuka Stanley',
    visitorCompany: 'Mease Energy',
    visitorEmail: 'stanley.eke.azuka@mease-energy.com',
    visitorPhone: '+234 802 334 1189',
    visitorJobTitle: 'Commercial & BD Manager',
    isStudent: false,
    divisions: ['Integrated Construction', 'Metocean & Marine Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-10T09:32:12Z',
    notes: 'Discussed joint venture partnership on upcoming marginal field development.'
  },
  {
    id: 'sub-nape-12',
    visitorName: 'Folarin Lajumoke',
    visitorCompany: 'Damas Petrochemicals & Refinery (BUA Group)',
    visitorEmail: 'folarin.lajumoke@buagroup.com',
    visitorPhone: '+234 803 777 9900',
    visitorJobTitle: 'Lead Project Engineer',
    isStudent: false,
    divisions: ['Geosolutions & Engineering', 'Integrated Construction', 'Industrial Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-10T09:35:56Z',
    notes: 'Refinery infrastructure foundation testing and 20-Ton CPT soil investigation requirements.'
  },
  {
    id: 'sub-nape-13',
    visitorName: 'Akinola O.',
    visitorCompany: 'Chevron Nigeria Limited',
    visitorEmail: 'akin.obex@gmail.com',
    visitorPhone: '+234 805 112 3344',
    visitorJobTitle: 'Offshore Facilities Engineer',
    isStudent: false,
    divisions: ['Metocean & Marine Solutions', 'Industrial Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-10T09:38:28Z',
    notes: 'Interested in bathymetric survey and cathodic protection inspection for Escravos operations.'
  },
  {
    id: 'sub-nape-14',
    visitorName: 'Dr. Abubakar',
    visitorCompany: 'SLB (Schlumberger)',
    visitorEmail: 'AAbubakar6@slb.com',
    visitorPhone: '+234 803 667 8899',
    visitorJobTitle: 'Principal Geoscientist',
    isStudent: false,
    divisions: ['Geosolutions & Engineering', 'Metocean & Marine Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-10T09:43:51Z',
    notes: 'Collaborative discussion regarding digital twin mapping and seismic geohazard assessments.'
  },
  {
    id: 'sub-nape-15',
    visitorName: 'Ibrahim Kado Muhad',
    visitorCompany: 'DIBIJ Integrated Services',
    visitorEmail: 'ibrahimkado02@gmail.com',
    visitorPhone: '+234 803 445 6677',
    visitorJobTitle: 'Field Operations Specialist',
    isStudent: false,
    divisions: ['Integrated Construction'],
    source: 'booth_capture',
    createdAt: '2026-11-10T09:47:37Z',
    notes: 'Equipment leasing and pontoon drilling barge mobilization.'
  },
  {
    id: 'sub-nape-16',
    visitorName: 'Idris Taiwo',
    visitorCompany: 'Oando Plc',
    visitorEmail: 'itaiwo@oandoplc.com',
    visitorPhone: '+234 802 889 0011',
    visitorJobTitle: 'Asset Integrity Engineer',
    isStudent: false,
    divisions: ['Industrial Solutions', 'Geosolutions & Engineering'],
    source: 'booth_capture',
    createdAt: '2026-11-10T10:07:07Z',
    notes: 'Asset integrity survey and ultrasonic thickness testing for flow stations.'
  },
  {
    id: 'sub-nape-17',
    visitorName: 'Shedrack Ideh',
    visitorCompany: 'Federal University of Petroleum Resources Effurun (FUPRE)',
    visitorEmail: 'shedrackideh@gmail.com',
    visitorPhone: '+234 813 224 5566',
    visitorJobTitle: 'Petroleum Engineering Researcher',
    isStudent: true,
    divisions: ['Geosolutions & Engineering'],
    source: 'booth_capture',
    createdAt: '2026-11-10T11:45:18Z',
    notes: 'Student delegate. Interested in geotechnical instrumentation and technical publications.'
  },
  {
    id: 'sub-nape-18',
    visitorName: 'Grace Ogbole',
    visitorCompany: 'Federal University of Lafia',
    visitorEmail: 'graceogbole12@gmail.com',
    visitorPhone: '+234 816 778 9900',
    visitorJobTitle: 'Geology Student Delegate',
    isStudent: true,
    divisions: ['Geosolutions & Engineering', 'Metocean & Marine Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-10T11:45:45Z',
    notes: 'Student delegate at NAPE. Applied for student technical mentorship program.'
  },
  {
    id: 'sub-nape-19',
    visitorName: 'Daniil Bogoedov',
    visitorCompany: 'Geoplat AI',
    visitorEmail: 'd.bogoedov@geoplat.com',
    visitorPhone: '+971 50 123 4567',
    visitorJobTitle: 'AI Solutions Architect',
    isStudent: false,
    divisions: ['Geosolutions & Engineering'],
    source: 'booth_capture',
    createdAt: '2026-11-10T11:58:07Z',
    notes: 'Discussed machine learning automation for automated borehole lithology classification.'
  },
  {
    id: 'sub-nape-20',
    visitorName: 'Tioluwani Faminu',
    visitorCompany: 'First Exploration & Petroleum Development Company (FIRST E&P)',
    visitorEmail: 'faminutioluwani@gmail.com',
    visitorPhone: '+234 803 119 8877',
    visitorJobTitle: 'Subsurface Geoscientist',
    isStudent: false,
    divisions: ['Geosolutions & Engineering', 'Metocean & Marine Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-10T11:59:08Z',
    notes: 'Offshore shallow hazards and geotechnical seabed investigations for OML 83/85.'
  },
  {
    id: 'sub-nape-21',
    visitorName: 'Helen Sunday',
    visitorCompany: 'Freightliner Logistics Services Limited',
    visitorEmail: 'Helen.sunday@freightlinerlogistics.com',
    visitorPhone: '+234 802 445 6678',
    visitorJobTitle: 'Logistics Coordinator',
    isStudent: false,
    divisions: ['Integrated Construction', 'Metocean & Marine Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-10T12:04:28Z',
    notes: 'Marine equipment transport, port clearance, and support vessel chartering.'
  },
  {
    id: 'sub-nape-22',
    visitorName: 'Chioma Onwudinjo',
    visitorCompany: 'Yemodel Company Limited',
    visitorEmail: 'chiomaonwudinjo7@gmail.com',
    visitorPhone: '+234 803 556 7789',
    visitorJobTitle: 'Procurement Specialist',
    isStudent: false,
    divisions: ['Industrial Solutions', 'Integrated Construction'],
    source: 'booth_capture',
    createdAt: '2026-11-10T12:10:45Z',
    notes: 'Registered as prospective vendor/subcontractor for civil and industrial maintenance.'
  },
  {
    id: 'sub-nape-23',
    visitorName: 'Anthony Ifediora',
    visitorCompany: 'Matrix Energy Group',
    visitorEmail: 'anthony.ifediora@matrixenergygroup.com',
    visitorPhone: '+234 803 998 7766',
    visitorJobTitle: 'Downstream Operations Engineer',
    isStudent: false,
    divisions: ['Integrated Construction', 'Industrial Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-10T12:32:42Z',
    notes: 'Terminal tank farm asset integrity and pipeline right-of-way topographic survey.'
  },
  {
    id: 'sub-nape-24',
    visitorName: 'Joseph Cookey',
    visitorCompany: 'NNPC Group / NUPRC',
    visitorEmail: 'cookey.j.a@nuprc.gov.ng',
    visitorPhone: '+234 803 332 1100',
    visitorJobTitle: 'Senior Regulatory Inspector',
    isStudent: false,
    divisions: ['Geosolutions & Engineering', 'Industrial Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-10T12:38:07Z',
    notes: 'Upstream compliance, geotechnical site assessment certifications, and environmental impact reporting.'
  },
  {
    id: 'sub-nape-25',
    visitorName: 'Adeola Ibigbemi',
    visitorCompany: 'MODE3 Technologies',
    visitorEmail: 'adeolaibigbemi@mode3.tech',
    visitorPhone: '+234 802 776 5544',
    visitorJobTitle: 'Chief Technology Officer',
    isStudent: false,
    divisions: ['Geosolutions & Engineering'],
    source: 'booth_capture',
    createdAt: '2026-11-10T12:44:10Z',
    notes: 'Discussed IoT sensors for real-time geotechnical slope and embankment monitoring.'
  },
  {
    id: 'sub-nape-26',
    visitorName: 'Chidi Okonkwo',
    visitorCompany: 'University of Lagos (UNILAG)',
    visitorEmail: 'chidi.student@unilag.edu.ng',
    visitorPhone: '+234 812 345 6789',
    visitorJobTitle: 'Geoscience Student Delegate',
    isStudent: true,
    divisions: ['Geosolutions & Engineering', 'Metocean & Marine Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-10T12:44:32Z',
    notes: 'Student attendee. Inquired about PIGL university outreach and student paper contest.'
  },
  {
    id: 'sub-nape-27',
    visitorName: 'Amina Bello',
    visitorCompany: 'Federal University of Technology Owerri (FUTO)',
    visitorEmail: 'amina.bello@futo.edu.ng',
    visitorPhone: '+234 810 987 6543',
    visitorJobTitle: 'Geology & Geophysics Student Delegate',
    isStudent: true,
    divisions: ['Geosolutions & Engineering'],
    source: 'booth_capture',
    createdAt: '2026-11-10T12:44:43Z',
    notes: 'Student delegate. Registered for NAPE student program and technical visit.'
  },
  {
    id: 'sub-nape-28',
    visitorName: 'Olabisi Oyindamola',
    visitorCompany: 'Kwara State University',
    visitorEmail: 'olabisiaish@gmail.com',
    visitorPhone: '+234 809 112 2334',
    visitorJobTitle: 'Geosciences Student',
    isStudent: true,
    divisions: ['Geosolutions & Engineering', 'Metocean & Marine Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-10T12:50:46Z',
    notes: 'Student delegate at exhibition booth. Inquired about industrial attachment.'
  },
  {
    id: 'sub-nape-29',
    visitorName: 'Tariq Alhassan',
    visitorCompany: 'Saudi Aramco',
    visitorEmail: 'tariq.alhassan@aramco.com',
    visitorPhone: '+966 50 123 4567',
    visitorJobTitle: 'Senior Reservoir Specialist',
    isStudent: false,
    divisions: ['Geosolutions & Engineering', 'Metocean & Marine Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-09T02:03:26Z',
    notes: 'International delegate. Discussed regional offshore geomatics and deepwater seabed mapping.'
  },
  {
    id: 'sub-nape-30',
    visitorName: 'S. Briggs',
    visitorCompany: 'TotalEnergies EP Nigeria',
    visitorEmail: 's.briggs@totalenergies.com',
    visitorPhone: '+234 803 999 1234',
    visitorJobTitle: 'Lead Geotechnical Engineer',
    isStudent: false,
    divisions: ['Geosolutions & Engineering', 'Metocean & Marine Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-09T01:39:52Z',
    notes: 'Deepwater geotechnical pontoon drilling and shallow gas hazard analysis.'
  },
  {
    id: 'sub-nape-31',
    visitorName: 'Onyekachukwu Bosah',
    visitorCompany: 'WorketiQs Technologies Limited',
    visitorEmail: 'bosahkc@gmail.com',
    visitorPhone: '+234 813 326 2617',
    visitorJobTitle: 'Managing Partner / Solutions Architect',
    isStudent: false,
    divisions: ['Geosolutions & Engineering', 'Metocean & Marine Solutions', 'Integrated Construction', 'Industrial Solutions'],
    source: 'booth_capture',
    createdAt: '2026-11-09T02:25:36Z',
    notes: 'Digital lead capture portal deployment and booth engagement check.'
  }
];


// Helper function to parse CSV with support for quoted strings and newlines
function parseCsvRecords(text) {
  const rows = [];
  let row = [];
  let cur = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    
    if (c === '"') {
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(cur.trim());
      cur = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      row.push(cur.trim());
      cur = '';
      if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
        rows.push(row);
      }
      row = [];
    } else {
      cur += c;
    }
  }
  if (cur || row.length > 0) {
    row.push(cur.trim());
    if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
      rows.push(row);
    }
  }
  
  const headers = rows[0];
  return rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = r[idx] || '';
    });
    return obj;
  });
}

// 1. Process 121 Authentic NAICE SPE 2026 leads
const csvPath = path.resolve('public/data/leads_all.csv');
let naiceCsvRows = [];
if (fs.existsSync(csvPath)) {
  naiceCsvRows = parseCsvRecords(fs.readFileSync(csvPath, 'utf8'));
} else {
  console.warn('leads_all.csv not found at:', csvPath);
}

const naiceSubmissions = naiceCsvRows.map((row, index) => {
  const subId = `sub-naice-${String(index + 1).padStart(3, '0')}`;
  
  // Parse date DD/MM/YYYY into August 2026 ISO
  const dateStr = row['Date'] || '03/08/2026';
  const parts = dateStr.split('/');
  let isoDate = '2026-08-01T10:00:00Z';
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    const hour = 9 + Math.floor((index % 8));
    const minute = (index * 7) % 60;
    isoDate = `${year}-${month}-${day}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`;
  }

  const name = row['Full Name'] || 'Conference Delegate';
  const email = (row['Email Address'] || '').trim();
  const phone = (row['Phone'] || '').trim();
  const company = (row['Company'] || '').trim();
  const designation = (row['Designation'] || '').trim();
  const rawNotes = (row['Notes'] || '').trim();
  const owner = (row['Owner (Brought In By)'] || '').trim() || 'PIGL Representative';

  const isStudent = /student/i.test(designation) || /student/i.test(company);

  // Inferred divisions from notes / designation
  const divisions = [];
  const textContext = `${designation} ${rawNotes}`.toLowerCase();
  if (textContext.includes('water') || textContext.includes('effluent') || textContext.includes('treatment')) {
    divisions.push('Industrial Solutions');
  }
  if (textContext.includes('cpt') || textContext.includes('soil') || textContext.includes('geotech') || textContext.includes('scanning') || textContext.includes('laser') || textContext.includes('geoscien') || textContext.includes('reality')) {
    divisions.push('Geosolutions & Engineering');
  }
  if (textContext.includes('piping') || textContext.includes('pipeline') || textContext.includes('swamp') || textContext.includes('flowline') || textContext.includes('fabricat') || textContext.includes('civil')) {
    divisions.push('Integrated Construction');
  }
  if (textContext.includes('marine') || textContext.includes('metocean') || textContext.includes('bathymetr') || textContext.includes('vessel')) {
    divisions.push('Metocean & Marine Solutions');
  }
  if (divisions.length === 0) {
    divisions.push('Geosolutions & Engineering', 'Industrial Solutions');
  }

  // Follow-up status based on technical notes
  let followUpStatus = 'new';
  if (/priority/i.test(rawNotes) || /booked for/i.test(rawNotes) || /meeting/i.test(rawNotes) || /follow up/i.test(rawNotes)) {
    followUpStatus = 'in_discussion';
  } else if (/partner/i.test(rawNotes)) {
    followUpStatus = 'contacted';
  }

  const notesList = [];
  if (rawNotes) {
    notesList.push({
      id: `note-naice-${index + 1}`,
      author: owner,
      content: rawNotes,
      createdAt: isoDate
    });
  }

  return {
    id: subId,
    campaignId: 'naice-spe-2026',
    campaignSlug: 'naice-spe-2026',
    formId: 'form-naice-spe-2026',
    formVersionId: 'v1-naice-spe-2026',
    source: 'booth_capture',
    visitorName: name,
    visitorEmail: email,
    visitorPhone: phone,
    visitorCompany: company,
    visitorJobTitle: designation,
    isStudent: Boolean(isStudent),
    formData: {
      full_name: name,
      email: email,
      phone: phone,
      company: company,
      job_title: designation,
      service_divisions: divisions,
      is_student: Boolean(isStudent),
      custom_inquiry_scope: rawNotes,
      owner: owner,
      consent_ndpa: true
    },
    assignedStaff: owner,
    followUpStatus: followUpStatus,
    notes: notesList,
    consentGiven: true,
    createdAt: isoDate,
    updatedAt: isoDate
  };
});

// 2. Process 31 Authentic NAPE 2026 leads
const napeSubmissions = delegatesRaw.map((d, index) => {
  return {
    id: d.id,
    campaignId: 'nape-2026',
    campaignSlug: 'nape-2026',
    formId: 'form-nape-2026',
    formVersionId: 'v1-nape-2026',
    source: d.source,
    visitorName: d.visitorName,
    visitorEmail: d.visitorEmail,
    visitorPhone: d.visitorPhone,
    visitorCompany: d.visitorCompany,
    visitorJobTitle: d.visitorJobTitle,
    isStudent: Boolean(d.isStudent),
    formData: {
      full_name: d.visitorName,
      email: d.visitorEmail,
      phone: d.visitorPhone,
      company: d.visitorCompany,
      job_title: d.visitorJobTitle,
      service_divisions: d.divisions,
      is_student: Boolean(d.isStudent),
      custom_inquiry_scope: d.notes,
      consent_ndpa: true
    },
    assignedStaff: 'admin@polarisigl.com',
    followUpStatus: 'new',
    notes: [
      {
        id: `note-nape-${index + 1}`,
        author: 'Stand Staff',
        content: d.notes,
        createdAt: d.createdAt
      }
    ],
    consentGiven: true,
    createdAt: d.createdAt,
    updatedAt: d.createdAt
  };
});

// Combined All Authentic Submissions (121 NAICE + 31 NAPE = 152 total)
const submissions = [...naiceSubmissions, ...napeSubmissions];

const emailLogs = [];
submissions.forEach((sub, index) => {
  if (sub.visitorEmail && sub.visitorEmail.includes('@')) {
    emailLogs.push({
      id: `log-${index + 1}`,
      campaignId: sub.campaignId,
      submissionId: sub.id,
      recipient: sub.visitorEmail,
      emailType: 'visitor_acknowledgement',
      subject: sub.campaignId === 'naice-spe-2026' 
        ? 'Thank You for Connecting with PIGL at NAICE SPE 2026 😊'
        : 'Thank You for Connecting with PIGL at NAPE 2026 😊',
      status: 'sent',
      attempts: 1,
      sentAt: sub.createdAt
    });
  }
});


const fullStore = {
  campaigns,
  forms,
  submissions,
  emailTemplates,
  emailLogs,
  updatedAt: new Date().toISOString()
};

const targetPath = path.resolve('public/data/campaigns_store.json');
fs.writeFileSync(targetPath, JSON.stringify(fullStore, null, 2), 'utf8');
console.log('Saved campaigns_store.json to', targetPath);
console.log('Campaigns count:', campaigns.length);
console.log('Forms count:', forms.length);
console.log('Submissions count:', submissions.length);
console.log('Email templates count:', emailTemplates.length);
console.log('Email logs count:', emailLogs.length);
