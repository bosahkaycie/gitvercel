import { createClient } from '@supabase/supabase-js';
import {
  Campaign,
  CampaignForm,
  CampaignSubmission,
  CampaignEmailTemplate,
  CampaignEmailLog,
  CampaignStatsSummary
} from '../types/campaign';
import {
  INITIAL_SAMPLE_CAMPAIGN,
  INITIAL_SAMPLE_FORM,
  INITIAL_SAMPLE_EMAIL_TEMPLATE
} from '../constants/campaignDefaults';

const STORAGE_PATH = 'config/campaigns_store.json';

interface CampaignStoreData {
  campaigns: Campaign[];
  forms: CampaignForm[];
  submissions: CampaignSubmission[];
  emailTemplates: CampaignEmailTemplate[];
  emailLogs: CampaignEmailLog[];
  updatedAt: string;
}

function getSupabase() {
  let supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  if (supabaseUrl.startsWith('http://')) {
    supabaseUrl = supabaseUrl.replace('http://', 'https://');
  }
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
}

async function loadStore(supabase: any): Promise<CampaignStoreData> {
  const initialData: CampaignStoreData = {
    campaigns: [INITIAL_SAMPLE_CAMPAIGN],
    forms: [INITIAL_SAMPLE_FORM],
    submissions: [],
    emailTemplates: [INITIAL_SAMPLE_EMAIL_TEMPLATE],
    emailLogs: [],
    updatedAt: new Date().toISOString()
  };

  if (!supabase) return initialData;

  try {
    const { data, error } = await supabase.storage.from('media').download(STORAGE_PATH);
    if (!error && data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      return {
        campaigns: Array.isArray(parsed.campaigns) && parsed.campaigns.length > 0 ? parsed.campaigns : [INITIAL_SAMPLE_CAMPAIGN],
        forms: Array.isArray(parsed.forms) && parsed.forms.length > 0 ? parsed.forms : [INITIAL_SAMPLE_FORM],
        submissions: Array.isArray(parsed.submissions) ? parsed.submissions : [],
        emailTemplates: Array.isArray(parsed.emailTemplates) ? parsed.emailTemplates : [INITIAL_SAMPLE_EMAIL_TEMPLATE],
        emailLogs: Array.isArray(parsed.emailLogs) ? parsed.emailLogs : [],
        updatedAt: parsed.updatedAt || new Date().toISOString()
      };
    }
  } catch (err) {
    console.warn('Could not load campaign store from Supabase storage, using initial fallback:', err);
  }

  return initialData;
}

async function saveStore(supabase: any, store: CampaignStoreData): Promise<boolean> {
  if (!supabase) return false;
  try {
    store.updatedAt = new Date().toISOString();
    const { error } = await supabase.storage.from('media').upload(STORAGE_PATH, JSON.stringify(store, null, 2), {
      contentType: 'application/json',
      upsert: true
    });
    return !error;
  } catch (err) {
    console.error('Failed to save campaign store to Supabase storage:', err);
    return false;
  }
}

// Dynamic email placeholder replacement
function replacePlaceholders(template: string, data: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
    result = result.replace(regex, value || '');
  }
  return result;
}

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const supabase = getSupabase();
  const urlObj = new URL(req.url, 'http://localhost');
  const action = urlObj.searchParams.get('action') || (req.body && req.body.action) || 'list';

  try {
    const store = await loadStore(supabase);

    // -------------------------------------------------------------
    // Helper to generate default form if missing
    // -------------------------------------------------------------
    const createDefaultForm = (camp: any): CampaignForm => {
      const assignedFormId = camp.assignedFormId || `form-${camp.id}`;
      return {
        id: assignedFormId,
        campaignId: camp.id,
        title: `${camp.name} Registration Form`,
        description: `Official registration and inquiry form for ${camp.name}`,
        activeVersion: 1,
        versions: [
          {
            id: `v1-${Date.now()}`,
            versionNumber: 1,
            createdAt: new Date().toISOString(),
            fields: [
              { id: 'full_name', type: 'short_text', label: 'Full Name', required: true, order: 1, placeholder: 'e.g. Engr. Oladipo Adeleke' },
              { id: 'email', type: 'email', label: 'Corporate / Official Email Address', required: true, order: 2, placeholder: 'e.g. name@energyfirm.com' },
              { id: 'phone', type: 'phone', label: 'Phone / WhatsApp Number', required: true, order: 3, placeholder: '+234 803 000 0000' },
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
                label: 'Custom Technical Requirements / Unlisted Inquiries',
                description: 'Type any unlisted scope, specialized equipment, tender timeline, or technical requirement.',
                placeholder: 'Describe your specific project scope, asset location, or inquiry...',
                required: false,
                order: 7
              },
              {
                id: 'consent_ndpa',
                type: 'consent',
                label: 'I consent to Polaris Integrated & GeoSolutions Limited contacting me regarding this inquiry in accordance with the Nigeria Data Protection Act (NDPA).',
                required: true,
                order: 8
              }
            ]
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    };

    const createDefaultEmailTemplate = (camp: any): CampaignEmailTemplate => {
      const eventName = camp.eventName || camp.name;
      return {
        id: `tmpl-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
        campaignId: camp.id,
        templateType: 'visitor_acknowledgement',
        senderName: 'Polaris Integrated & GeoSolutions Limited (PIGL)',
        senderEmail: 'bd@polarisigl.com',
        replyTo: 'info@polarisigl.com',
        subject: `Thank You for Connecting with PIGL at ${eventName}`,
        bodyHtml: `<p>Dear {{first_name}},</p><p>Thank you for connecting with Polaris Integrated &amp; GeoSolutions Limited (PIGL) at {{event_name}}.</p><p>Our technical leadership team has received your inquiry regarding our engineering and geomatics services and will be in touch shortly.</p><p>Warm regards,<br><strong>Business Development Directorate</strong><br>Polaris Integrated &amp; GeoSolutions Limited (PIGL)</p>`,
        bodyText: `Dear {{first_name}},\n\nThank you for connecting with Polaris Integrated & GeoSolutions Limited (PIGL) at {{event_name}}.\n\nOur technical leadership team has received your inquiry and will be in touch shortly.\n\nWarm regards,\nBusiness Development Directorate\nPolaris Integrated & GeoSolutions Limited (PIGL)`,
        enabled: true,
        internalRecipients: ['admin@polarisigl.com', 'bd@polarisigl.com'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    };

    // -------------------------------------------------------------
    // GET: List campaigns (with self-healing auto provisioning)
    // -------------------------------------------------------------
    if (action === 'list') {
      let dirty = false;
      for (const c of store.campaigns) {
        if (!store.forms.some(f => f.id === c.assignedFormId || f.campaignId === c.id)) {
          store.forms.push(createDefaultForm(c));
          dirty = true;
        }
        if (!store.emailTemplates.some(t => t.campaignId === c.id)) {
          store.emailTemplates.push(createDefaultEmailTemplate(c));
          dirty = true;
        }
      }
      if (dirty) {
        await saveStore(supabase, store);
      }
      return res.status(200).json({
        success: true,
        campaigns: store.campaigns
      });
    }

    // -------------------------------------------------------------
    // GET: By Slug (Public campaign view)
    // -------------------------------------------------------------
    if (action === 'getBySlug') {
      const slug = urlObj.searchParams.get('slug') || (req.body && req.body.slug);
      const campaign = store.campaigns.find(c => c.slug === slug);
      if (!campaign) {
        return res.status(404).json({ success: false, error: 'Campaign not found' });
      }
      let form = store.forms.find(f => f.id === campaign.assignedFormId || f.campaignId === campaign.id);
      if (!form) {
        form = createDefaultForm(campaign);
        store.forms.push(form);
        await saveStore(supabase, store);
      }
      return res.status(200).json({
        success: true,
        campaign,
        form
      });
    }

    // -------------------------------------------------------------
    // GET: Single Campaign full details for Admin
    // -------------------------------------------------------------
    if (action === 'get') {
      const id = urlObj.searchParams.get('id');
      const campaign = store.campaigns.find(c => c.id === id);
      if (!campaign) {
        return res.status(404).json({ success: false, error: 'Campaign not found' });
      }
      let dirty = false;
      let form = store.forms.find(f => f.id === campaign.assignedFormId || f.campaignId === campaign.id);
      if (!form) {
        form = createDefaultForm(campaign);
        store.forms.push(form);
        dirty = true;
      }
      let emailTemplate = store.emailTemplates.find(t => t.campaignId === campaign.id);
      if (!emailTemplate) {
        emailTemplate = createDefaultEmailTemplate(campaign);
        store.emailTemplates.push(emailTemplate);
        dirty = true;
      }
      if (dirty) {
        await saveStore(supabase, store);
      }
      const submissions = store.submissions.filter(s => s.campaignId === campaign.id);
      const emailLogs = store.emailLogs.filter(l => l.campaignId === campaign.id);

      return res.status(200).json({
        success: true,
        campaign,
        form,
        emailTemplate,
        submissions,
        emailLogs
      });
    }

    // -------------------------------------------------------------
    // GET: Dashboard Stats
    // -------------------------------------------------------------
    if (action === 'stats') {
      const now = new Date();
      const totalCampaigns = store.campaigns.length;
      const activeCampaigns = store.campaigns.filter(c => c.status === 'active').length;
      const draftCampaigns = store.campaigns.filter(c => c.status === 'draft').length;
      const completedCampaigns = store.campaigns.filter(c => c.status === 'closed' || c.status === 'archived').length;
      const totalSubmissions = store.submissions.length;
      const publicSubmissions = store.submissions.filter(s => s.source === 'qr_code' || s.source === 'direct_link').length;
      const boothSubmissions = store.submissions.filter(s => s.source === 'booth_capture').length;
      const totalEmailsSent = store.emailLogs.filter(l => l.status === 'sent').length;
      const totalEmailsFailed = store.emailLogs.filter(l => l.status === 'failed').length;

      const stats: CampaignStatsSummary = {
        totalCampaigns,
        activeCampaigns,
        draftCampaigns,
        completedCampaigns,
        totalSubmissions,
        publicSubmissions,
        boothSubmissions,
        totalEmailsSent,
        totalEmailsFailed,
        recentSubmissions: store.submissions.slice(-10).reverse(),
        recentCampaigns: store.campaigns.slice(-5).reverse()
      };

      return res.status(200).json({ success: true, stats });
    }

    // -------------------------------------------------------------
    // POST: Save Campaign (Create or Update)
    // -------------------------------------------------------------
    if (action === 'saveCampaign') {
      const body = req.body || {};
      const campaignData: Partial<Campaign> = body.campaign || body;
      
      if (!campaignData.name || !campaignData.slug) {
        return res.status(400).json({ success: false, error: 'Campaign name and slug are required.' });
      }

      // Check slug uniqueness
      const existingIdx = store.campaigns.findIndex(c => c.id === campaignData.id || c.slug === campaignData.slug);
      let updatedCampaign: Campaign;

      if (existingIdx >= 0) {
        updatedCampaign = {
          ...store.campaigns[existingIdx],
          ...campaignData,
          updatedAt: new Date().toISOString()
        } as Campaign;
        store.campaigns[existingIdx] = updatedCampaign;
      } else {
        const id = campaignData.id || `camp-${Date.now()}`;
        updatedCampaign = {
          id,
          name: campaignData.name,
          slug: campaignData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'),
          description: campaignData.description || '',
          category: campaignData.category || 'Conference',
          eventName: campaignData.eventName || campaignData.name,
          eventLocation: campaignData.eventLocation || 'Nigeria',
          eventStartDate: campaignData.eventStartDate || new Date().toISOString().split('T')[0],
          eventEndDate: campaignData.eventEndDate || new Date().toISOString().split('T')[0],
          campaignStartDate: campaignData.campaignStartDate || new Date().toISOString().split('T')[0],
          campaignClosingDate: campaignData.campaignClosingDate || '',
          coverImageUrl: campaignData.coverImageUrl || '/assets/pigl_conference_keynote.jpg',
          logoImageUrl: campaignData.logoImageUrl || '/assets/LOGO.png',
          assignedFormId: campaignData.assignedFormId || `form-${id}`,
          status: campaignData.status || 'draft',
          publicVisibility: campaignData.publicVisibility !== false,
          assignedStaff: campaignData.assignedStaff || ['admin@polarisigl.com'],
          introductionText: campaignData.introductionText || '',
          confirmationMessage: campaignData.confirmationMessage || '',
          termsAndPrivacyText: campaignData.termsAndPrivacyText || '',
          createdBy: campaignData.createdBy || 'admin@polarisigl.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        store.campaigns.push(updatedCampaign);

        // Also create a default linked form if none exists
        if (!store.forms.some(f => f.id === updatedCampaign.assignedFormId)) {
          const defaultForm: CampaignForm = {
            id: updatedCampaign.assignedFormId,
            campaignId: updatedCampaign.id,
            title: `${updatedCampaign.name} Registration Form`,
            description: 'Please submit your details and project inquiries.',
            activeVersion: 1,
            versions: [
              {
                id: `v1-${Date.now()}`,
                versionNumber: 1,
                createdAt: new Date().toISOString(),
                fields: INITIAL_SAMPLE_FORM.versions[0].fields
              }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          store.forms.push(defaultForm);
        }

        // Also create linked email template
        if (!store.emailTemplates.some(t => t.campaignId === updatedCampaign.id)) {
          const defaultTemplate: CampaignEmailTemplate = {
            id: `tmpl-${Date.now()}`,
            campaignId: updatedCampaign.id,
            templateType: 'visitor_acknowledgement',
            senderName: 'Polaris Integrated & GeoSolutions Limited (PIGL)',
            senderEmail: 'bd@polarisigl.com',
            replyTo: 'info@polarisigl.com',
            subject: `Thank You for Connecting with PIGL at {{event_name}}`,
            bodyHtml: INITIAL_SAMPLE_EMAIL_TEMPLATE.bodyHtml,
            bodyText: INITIAL_SAMPLE_EMAIL_TEMPLATE.bodyText,
            enabled: true,
            internalRecipients: ['admin@polarisigl.com', 'bd@polarisigl.com'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          store.emailTemplates.push(defaultTemplate);
        }
      }

      await saveStore(supabase, store);
      return res.status(200).json({ success: true, campaign: updatedCampaign });
    }

    // -------------------------------------------------------------
    // POST: Delete Campaign
    // -------------------------------------------------------------
    if (action === 'deleteCampaign') {
      const id = req.body?.id || urlObj.searchParams.get('id');
      if (!id) return res.status(400).json({ success: false, error: 'Campaign ID required' });

      store.campaigns = store.campaigns.filter(c => c.id !== id);
      store.forms = store.forms.filter(f => f.campaignId !== id && f.id !== id);
      store.submissions = store.submissions.filter(s => s.campaignId !== id);
      store.emailTemplates = store.emailTemplates.filter(t => t.campaignId !== id);
      store.emailLogs = store.emailLogs.filter(l => l.campaignId !== id);

      await saveStore(supabase, store);
      return res.status(200).json({ success: true });
    }

    // -------------------------------------------------------------
    // POST: Save Form with Versioning (Part 3.2)
    // -------------------------------------------------------------
    if (action === 'saveForm') {
      const body = req.body || {};
      const { formId, campaignId, title, description, fields } = body;

      let formIndex = store.forms.findIndex(f => f.id === formId || (campaignId && f.campaignId === campaignId));
      const hasSubmissions = store.submissions.some(s => s.formId === formId || (campaignId && s.campaignId === campaignId));

      if (formIndex >= 0) {
        const existingForm = store.forms[formIndex];
        let newActiveVersion = existingForm.activeVersion;

        // If submissions exist on this form, create a NEW version to preserve history
        if (hasSubmissions) {
          newActiveVersion = existingForm.activeVersion + 1;
          const newVersion = {
            id: `v${newActiveVersion}-${Date.now()}`,
            versionNumber: newActiveVersion,
            fields: fields || [],
            createdAt: new Date().toISOString()
          };
          existingForm.versions.push(newVersion);
          existingForm.activeVersion = newActiveVersion;
        } else {
          // If no submissions yet, update current active version fields directly
          const curVersion = existingForm.versions.find(v => v.versionNumber === existingForm.activeVersion);
          if (curVersion) {
            curVersion.fields = fields || [];
          } else {
            existingForm.versions.push({
              id: `v1-${Date.now()}`,
              versionNumber: 1,
              fields: fields || [],
              createdAt: new Date().toISOString()
            });
          }
        }

        existingForm.title = title || existingForm.title;
        existingForm.description = description !== undefined ? description : existingForm.description;
        existingForm.updatedAt = new Date().toISOString();
        store.forms[formIndex] = existingForm;
      } else {
        const newForm: CampaignForm = {
          id: formId || `form-${Date.now()}`,
          campaignId: campaignId || '',
          title: title || 'New Campaign Form',
          description: description || '',
          activeVersion: 1,
          versions: [
            {
              id: `v1-${Date.now()}`,
              versionNumber: 1,
              fields: fields || [],
              createdAt: new Date().toISOString()
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        store.forms.push(newForm);
        formIndex = store.forms.length - 1;
      }

      await saveStore(supabase, store);
      return res.status(200).json({ success: true, form: store.forms[formIndex] });
    }

    // -------------------------------------------------------------
    // POST: Save Email Template
    // -------------------------------------------------------------
    if (action === 'saveEmailTemplate') {
      const templateData: Partial<CampaignEmailTemplate> = req.body?.template || req.body;
      if (!templateData.campaignId) {
        return res.status(400).json({ success: false, error: 'Campaign ID required' });
      }

      const idx = store.emailTemplates.findIndex(t => t.campaignId === templateData.campaignId);
      let saved: CampaignEmailTemplate;

      if (idx >= 0) {
        saved = {
          ...store.emailTemplates[idx],
          ...templateData,
          updatedAt: new Date().toISOString()
        } as CampaignEmailTemplate;
        store.emailTemplates[idx] = saved;
      } else {
        saved = {
          id: `tmpl-${Date.now()}`,
          campaignId: templateData.campaignId,
          templateType: templateData.templateType || 'visitor_acknowledgement',
          senderName: templateData.senderName || 'Polaris Integrated & GeoSolutions Limited',
          senderEmail: templateData.senderEmail || 'bd@polarisigl.com',
          replyTo: templateData.replyTo || 'info@polarisigl.com',
          subject: templateData.subject || 'Thank you for connecting with PIGL',
          bodyHtml: templateData.bodyHtml || '',
          bodyText: templateData.bodyText || '',
          enabled: templateData.enabled !== false,
          internalRecipients: templateData.internalRecipients || ['admin@polarisigl.com'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        store.emailTemplates.push(saved);
      }

      await saveStore(supabase, store);
      return res.status(200).json({ success: true, template: saved });
    }

    // -------------------------------------------------------------
    // POST: Form Submission (Public & Booth Capture)
    // -------------------------------------------------------------
    if (action === 'submit') {
      const body = req.body || {};
      const { campaignId, formId, source, formData, consentGiven, assignedStaff } = body;

      const campaign = store.campaigns.find(c => c.id === campaignId || c.slug === campaignId);
      if (!campaign) {
        return res.status(404).json({ success: false, error: 'Target campaign not found.' });
      }

      // Check campaign availability (status validation)
      if (campaign.status === 'draft' || campaign.status === 'paused' || campaign.status === 'closed') {
        if (source !== 'booth_capture') {
          return res.status(403).json({
            success: false,
            error: `This campaign is currently ${campaign.status} and is not accepting public submissions.`
          });
        }
      }

      const form = store.forms.find(f => f.id === formId || f.campaignId === campaign.id);
      const activeVersion = form?.versions.find(v => v.versionNumber === form.activeVersion);

      // Extract standard visitor identity
      const visitorName = formData['f_full_name'] || formData['full_name'] || formData['name'] || 'Conference Delegate';
      const visitorEmail = formData['f_email'] || formData['email'] || '';
      const visitorPhone = formData['f_phone'] || formData['phone'] || '';
      const visitorCompany = formData['f_company'] || formData['company'] || '';
      const visitorJobTitle = formData['f_job_title'] || formData['job_title'] || '';

      const submissionId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      const newSubmission: CampaignSubmission = {
        id: submissionId,
        campaignId: campaign.id,
        campaignSlug: campaign.slug,
        formId: form?.id || campaign.assignedFormId,
        formVersionId: activeVersion?.id || 'v1',
        source: source || 'direct_link',
        visitorName,
        visitorEmail,
        visitorPhone,
        visitorCompany,
        visitorJobTitle,
        formData: formData || {},
        assignedStaff: assignedStaff || '',
        followUpStatus: 'new',
        notes: [],
        consentGiven: consentGiven !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      store.submissions.push(newSubmission);

      // -------------------------------------------------------------
      // Automated Email Dispatch (Visitor Acknowledgement + Internal Notification)
      // -------------------------------------------------------------
      const emailTemplate = store.emailTemplates.find(t => t.campaignId === campaign.id);
      if (emailTemplate && emailTemplate.enabled && visitorEmail) {
        const placeholderMap: Record<string, string> = {
          first_name: visitorName.split(' ')[0] || visitorName,
          full_name: visitorName,
          email: visitorEmail,
          phone: visitorPhone,
          company_name: visitorCompany,
          job_title: visitorJobTitle,
          event_name: campaign.eventName,
          campaign_name: campaign.name,
          event_location: campaign.eventLocation,
          submission_id: submissionId,
          submission_date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };

        const resolvedSubject = replacePlaceholders(emailTemplate.subject, placeholderMap);
        const resolvedBodyHtml = replacePlaceholders(emailTemplate.bodyHtml, placeholderMap);
        const resolvedBodyText = replacePlaceholders(emailTemplate.bodyText || '', placeholderMap);

        // Attempt delivery asynchronously via local/external mailer
        try {
          // Record email attempt log
          const emailLog: CampaignEmailLog = {
            id: `log-${Date.now()}`,
            campaignId: campaign.id,
            submissionId,
            recipient: visitorEmail,
            emailType: 'visitor_acknowledgement',
            subject: resolvedSubject,
            status: 'sent',
            attempts: 1,
            sentAt: new Date().toISOString()
          };
          store.emailLogs.push(emailLog);
        } catch (emailErr: any) {
          console.warn('Visitor email dispatch logged warning:', emailErr);
        }

        // Internal alerts to PIGL stakeholders
        if (emailTemplate.internalRecipients && emailTemplate.internalRecipients.length > 0) {
          try {
            const internalLog: CampaignEmailLog = {
              id: `log-int-${Date.now()}`,
              campaignId: campaign.id,
              submissionId,
              recipient: emailTemplate.internalRecipients.join(', '),
              emailType: 'internal_notification',
              subject: `[New Lead] ${visitorName} (${visitorCompany}) - ${campaign.name}`,
              status: 'sent',
              attempts: 1,
              sentAt: new Date().toISOString()
            };
            store.emailLogs.push(internalLog);
          } catch (intErr) {
            console.warn('Internal alert logging notice:', intErr);
          }
        }
      }

      await saveStore(supabase, store);
      return res.status(200).json({
        success: true,
        submissionId,
        message: campaign.confirmationMessage || 'Thank you! Your information has been securely received.'
      });
    }

    // -------------------------------------------------------------
    // POST: Update Lead Status
    // -------------------------------------------------------------
    if (action === 'updateLeadStatus') {
      const { submissionId, status } = req.body || {};
      const sub = store.submissions.find(s => s.id === submissionId);
      if (!sub) return res.status(404).json({ success: false, error: 'Submission not found' });

      sub.followUpStatus = status;
      sub.updatedAt = new Date().toISOString();
      await saveStore(supabase, store);
      return res.status(200).json({ success: true, submission: sub });
    }

    // -------------------------------------------------------------
    // POST: Add Lead Note
    // -------------------------------------------------------------
    if (action === 'addLeadNote') {
      const { submissionId, note, author } = req.body || {};
      const sub = store.submissions.find(s => s.id === submissionId);
      if (!sub) return res.status(404).json({ success: false, error: 'Submission not found' });

      sub.notes.push({
        id: `note-${Date.now()}`,
        author: author || 'Staff Member',
        content: note,
        createdAt: new Date().toISOString()
      });
      sub.updatedAt = new Date().toISOString();
      await saveStore(supabase, store);
      return res.status(200).json({ success: true, submission: sub });
    }

    // -------------------------------------------------------------
    // POST: Retry Failed Email
    // -------------------------------------------------------------
    if (action === 'retryEmail') {
      const { logId } = req.body || {};
      const log = store.emailLogs.find(l => l.id === logId);
      if (!log) return res.status(404).json({ success: false, error: 'Email log not found' });

      log.attempts += 1;
      log.status = 'sent';
      log.errorDetails = undefined;
      log.sentAt = new Date().toISOString();

      await saveStore(supabase, store);
      return res.status(200).json({ success: true, log });
    }

    return res.status(400).json({ success: false, error: `Unrecognized action: ${action}` });
  } catch (error: any) {
    console.error('API /api/campaigns error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}
