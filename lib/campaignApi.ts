import {
  Campaign,
  CampaignForm,
  CampaignSubmission,
  CampaignEmailTemplate,
  CampaignEmailLog,
  CampaignStatsSummary,
  CampaignFormField
} from '../types/campaign';
import {
  INITIAL_SAMPLE_CAMPAIGN,
  INITIAL_SAMPLE_FORM,
  INITIAL_SAMPLE_EMAIL_TEMPLATE
} from '../constants/campaignDefaults';

async function fetchApi(action: string, options: RequestInit = {}): Promise<any> {
  const isPost = options.method === 'POST';
  let url = `/api/campaigns?action=${action}`;
  
  try {
    let res = await fetch(url, options);
    if (!res.ok) {
      // Try php endpoint fallback
      const phpUrl = `/api/campaigns.php?action=${action}`;
      const phpRes = await fetch(phpUrl, options);
      if (phpRes.ok) {
        return await phpRes.json();
      }
    }
    return await res.json();
  } catch (err: any) {
    console.warn(`API call /api/campaigns?action=${action} failed, attempting PHP mirror:`, err);
    try {
      const phpUrl = `/api/campaigns.php?action=${action}`;
      const phpRes = await fetch(phpUrl, options);
      return await phpRes.json();
    } catch (e: any) {
      console.error(`Both API endpoints failed:`, e);
      throw e;
    }
  }
}

export async function getCampaigns(): Promise<Campaign[]> {
  try {
    const data = await fetchApi('list');
    if (data?.success && Array.isArray(data.campaigns)) {
      return data.campaigns;
    }
    return [];
  } catch {
    return [];
  }
}

export async function getCampaignBySlug(slug: string): Promise<{ campaign: Campaign; form: CampaignForm | null }> {
  try {
    const data = await fetchApi(`getBySlug&slug=${encodeURIComponent(slug)}`);
    if (data?.success && data.campaign) {
      return {
        campaign: data.campaign,
        form: data.form || null
      };
    }
    throw new Error(data?.error || 'Campaign not found');
  } catch (err: any) {
    throw err;
  }
}

export async function getCampaignDetails(id: string): Promise<{
  campaign: Campaign;
  form: CampaignForm | null;
  emailTemplate: CampaignEmailTemplate | null;
  submissions: CampaignSubmission[];
  emailLogs: CampaignEmailLog[];
}> {
  try {
    const data = await fetchApi(`get&id=${encodeURIComponent(id)}`);
    if (data?.success && data.campaign) {
      return {
        campaign: data.campaign,
        form: data.form || null,
        emailTemplate: data.emailTemplate || null,
        submissions: data.submissions || [],
        emailLogs: data.emailLogs || []
      };
    }
    throw new Error(data?.error || 'Campaign details not found');
  } catch (err: any) {
    throw err;
  }
}

export async function getCampaignStats(): Promise<CampaignStatsSummary> {
  try {
    const data = await fetchApi('stats');
    if (data?.success && data.stats) {
      return data.stats;
    }
    return {
      totalCampaigns: 0,
      activeCampaigns: 0,
      draftCampaigns: 0,
      completedCampaigns: 0,
      totalSubmissions: 0,
      publicSubmissions: 0,
      boothSubmissions: 0,
      totalEmailsSent: 0,
      totalEmailsFailed: 0,
      recentSubmissions: [],
      recentCampaigns: []
    };
  } catch {
    return {
      totalCampaigns: 0,
      activeCampaigns: 0,
      draftCampaigns: 0,
      completedCampaigns: 0,
      totalSubmissions: 0,
      publicSubmissions: 0,
      boothSubmissions: 0,
      totalEmailsSent: 0,
      totalEmailsFailed: 0,
      recentSubmissions: [],
      recentCampaigns: []
    };
  }
}

export async function saveCampaign(campaign: Partial<Campaign>): Promise<Campaign> {
  const data = await fetchApi('saveCampaign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'saveCampaign', campaign })
  });
  if (!data?.success) {
    throw new Error(data?.error || 'Failed to save campaign');
  }
  return data.campaign;
}

export async function deleteCampaign(id: string): Promise<boolean> {
  const data = await fetchApi('deleteCampaign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'deleteCampaign', id })
  });
  if (!data?.success) {
    throw new Error(data?.error || 'Failed to delete campaign');
  }
  return true;
}

export async function saveCampaignForm(payload: {
  formId: string;
  campaignId: string;
  title: string;
  description?: string;
  fields: CampaignFormField[];
}): Promise<CampaignForm> {
  const data = await fetchApi('saveForm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'saveForm', ...payload })
  });
  if (!data?.success) {
    throw new Error(data?.error || 'Failed to save form');
  }
  return data.form;
}

export async function saveEmailTemplate(template: Partial<CampaignEmailTemplate>): Promise<CampaignEmailTemplate> {
  const data = await fetchApi('saveEmailTemplate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'saveEmailTemplate', template })
  });
  if (!data?.success) {
    throw new Error(data?.error || 'Failed to save email template');
  }
  return data.template;
}

export async function submitCampaignForm(payload: {
  campaignId: string;
  formId?: string;
  source: 'qr_code' | 'direct_link' | 'booth_capture';
  formData: Record<string, any>;
  consentGiven: boolean;
  assignedStaff?: string;
}): Promise<{ success: boolean; submissionId: string; message: string }> {
  const data = await fetchApi('submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'submit', ...payload })
  });
  if (!data?.success) {
    throw new Error(data?.error || 'Submission failed');
  }
  return data;
}

export async function updateLeadStatus(submissionId: string, status: string): Promise<CampaignSubmission> {
  const data = await fetchApi('updateLeadStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'updateLeadStatus', submissionId, status })
  });
  if (!data?.success) {
    throw new Error(data?.error || 'Failed to update lead status');
  }
  return data.submission;
}

export async function addLeadNote(submissionId: string, note: string, author?: string): Promise<CampaignSubmission> {
  const data = await fetchApi('addLeadNote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'addLeadNote', submissionId, note, author })
  });
  if (!data?.success) {
    throw new Error(data?.error || 'Failed to add note');
  }
  return data.submission;
}

export async function retryEmailLog(logId: string): Promise<CampaignEmailLog> {
  const data = await fetchApi('retryEmail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'retryEmail', logId })
  });
  if (!data?.success) {
    throw new Error(data?.error || 'Failed to retry email');
  }
  return data.log;
}

/**
 * Enterprise Safe CSV Export with Formula Injection Protection (Part 8.5)
 */
export function exportLeadsToCsv(
  campaign: Campaign,
  submissions: CampaignSubmission[],
  fields: CampaignFormField[]
) {
  // Filter out headings and descriptive text
  const inputFields = fields.filter(f => f.type !== 'section_heading' && f.type !== 'descriptive_text');

  const headers = [
    'Submission ID',
    'Date Submitted',
    'Source',
    'Visitor Name',
    'Email Address',
    'Phone Number',
    'Company',
    'Job Title',
    'Follow-up Status',
    'Assigned Staff',
    ...inputFields.map(f => f.label)
  ];

  const escapeCsv = (val: any): string => {
    if (val === null || val === undefined) return '""';
    let str = String(val);
    // Formula injection protection: prepend apostrophe if starts with =, +, -, @
    if (/^[=+\-@]/.test(str)) {
      str = "'" + str;
    }
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = submissions.map(sub => {
    const dynamicValues = inputFields.map(f => {
      const v = sub.formData[f.id] !== undefined ? sub.formData[f.id] : (sub.formData[f.label] || '');
      if (Array.isArray(v)) return v.join('; ');
      if (typeof v === 'boolean') return v ? 'Yes' : 'No';
      return v;
    });

    return [
      escapeCsv(sub.id),
      escapeCsv(new Date(sub.createdAt).toLocaleString('en-GB')),
      escapeCsv(sub.source === 'booth_capture' ? 'Booth Capture' : sub.source === 'qr_code' ? 'QR Code' : 'Direct Link'),
      escapeCsv(sub.visitorName),
      escapeCsv(sub.visitorEmail),
      escapeCsv(sub.visitorPhone || ''),
      escapeCsv(sub.visitorCompany || ''),
      escapeCsv(sub.visitorJobTitle || ''),
      escapeCsv(sub.followUpStatus.toUpperCase()),
      escapeCsv(sub.assignedStaff || ''),
      ...dynamicValues.map(escapeCsv)
    ].join(',');
  });

  // UTF-8 BOM (\uFEFF) ensures Excel opens foreign characters and accents properly
  const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `PIGL_Leads_${campaign.slug}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
