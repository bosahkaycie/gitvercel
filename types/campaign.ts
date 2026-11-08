export type CampaignCategory = 
  | 'Conference'
  | 'Exhibition'
  | 'Stakeholder Engagement'
  | 'Corporate Event'
  | 'Seminar'
  | 'Outreach'
  | 'Business Development'
  | 'Other';

export type CampaignStatus = 
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'paused'
  | 'closed'
  | 'archived';

export type LeadFollowUpStatus = 
  | 'new'
  | 'contacted'
  | 'in_discussion'
  | 'converted'
  | 'closed';

export type SubmissionSource = 
  | 'qr_code'
  | 'direct_link'
  | 'booth_capture';

export type FormFieldType = 
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'phone'
  | 'number'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'file'
  | 'consent'
  | 'section_heading'
  | 'descriptive_text';

export interface FormFieldOption {
  id: string;
  label: string;
  value: string;
}

export interface CampaignFormField {
  id: string;
  type: FormFieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  defaultValue?: string | string[];
  options?: FormFieldOption[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    allowedFileTypes?: string[];
    maxFileSizeMb?: number;
  };
  order: number;
}

export interface CampaignFormVersion {
  id: string;
  versionNumber: number;
  fields: CampaignFormField[];
  createdAt: string;
}

export interface CampaignForm {
  id: string;
  campaignId: string;
  title: string;
  description?: string;
  activeVersion: number;
  versions: CampaignFormVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface CampaignSubmission {
  id: string;
  campaignId: string;
  campaignSlug?: string;
  formId: string;
  formVersionId: string;
  source: SubmissionSource;
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string;
  visitorCompany?: string;
  visitorJobTitle?: string;
  formData: Record<string, any>;
  assignedStaff?: string;
  followUpStatus: LeadFollowUpStatus;
  notes: SubmissionNote[];
  consentGiven: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignEmailTemplate {
  id: string;
  campaignId: string;
  templateType: 'visitor_acknowledgement' | 'internal_notification';
  senderName: string;
  senderEmail: string;
  replyTo?: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  enabled: boolean;
  internalRecipients?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignEmailLog {
  id: string;
  campaignId: string;
  submissionId: string;
  recipient: string;
  emailType: 'visitor_acknowledgement' | 'internal_notification';
  subject: string;
  status: 'sent' | 'failed' | 'queued';
  attempts: number;
  errorDetails?: string;
  sentAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: CampaignCategory | string;
  eventName: string;
  eventLocation: string;
  eventStartDate: string;
  eventEndDate: string;
  campaignStartDate: string;
  campaignClosingDate: string;
  coverImageUrl?: string;
  logoImageUrl?: string;
  assignedFormId: string;
  status: CampaignStatus;
  publicVisibility: boolean;
  assignedStaff: string[];
  introductionText?: string;
  confirmationMessage?: string;
  termsAndPrivacyText?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignStatsSummary {
  totalCampaigns: number;
  activeCampaigns: number;
  draftCampaigns: number;
  completedCampaigns: number;
  totalSubmissions: number;
  publicSubmissions: number;
  boothSubmissions: number;
  totalEmailsSent: number;
  totalEmailsFailed: number;
  recentSubmissions: CampaignSubmission[];
  recentCampaigns: Campaign[];
}
