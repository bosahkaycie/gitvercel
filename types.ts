export interface SubService {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface ServiceDeliverableItem {
  title: string;
  description: string;
  deliverablesOutput?: string;
  standards?: string;
}

export interface Service {
  id: string;
  serviceNumber?: string;
  title: string;
  tagline: string;
  description: string;
  items: (string | ServiceDeliverableItem)[];
  subServices?: SubService[];
  icon: string;
  image: string;
  division: 'Ground Intelligence' | 'Digital Intelligence' | 'Integrated Engineering & Construction Solutions' | 'Industrial & Environmental Technologies' | 'Offshore Intelligence' | 'Intelligence' | 'Solutions & Engineering';
  partnerBadge?: {
    partnerName: string;
    role: string;
  };
}

export interface ServiceGalleryImage {
  id?: string;
  url: string;
  title?: string;
  caption?: string;
}

export interface CMSService {
  id: string;
  slug: string;
  title: string;
  division: 'Ground Intelligence' | 'Digital Intelligence' | 'Integrated Engineering & Construction Solutions' | 'Industrial & Environmental Technologies' | 'Offshore Intelligence' | 'Intelligence' | 'Solutions & Engineering';
  category: string;
  tagline?: string;
  short_description: string;
  full_description: string;
  business_value?: string;
  hero_image?: string;
  card_image?: string;
  capabilities: (string | ServiceDeliverableItem)[];
  subServices?: SubService[];
  benefits: string[];
  operating_environments: string[];
  technology: string[];
  methodology: string[];
  equipment: string[];
  gallery?: ServiceGalleryImage[];
  video_url?: string;
  cta_text?: string;
  cta_url?: string;
  partner_badge?: {
    partnerName: string;
    role: string;
    website?: string;
  } | null;
  display_order: number;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CMSBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  read_time?: string;
  published_at: string;
  seo_title?: string;
  seo_description?: string;
  focus_keyword?: string;
  canonical_url?: string;
  og_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CMSSlider {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  desktop_image: string;
  mobile_image?: string;
  video_url?: string;
  cta_text?: string;
  cta_url?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CMSCategory {
  id: string;
  name: string;
  slug: string;
  division?: 'Intelligence' | 'Solutions & Engineering';
  display_order?: number;
}

export interface CMSMediaAsset {
  id: string;
  filename: string;
  file_path: string;
  bucket_id: 'services' | 'blog' | 'sliders' | 'media';
  file_type?: string;
  file_size?: number;
  alt_text?: string;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  role: string;
  specialty: string;
  description: string;
  capabilities: string[];
  website?: string;
  logo_url?: string;
  serviceId: string;
  serviceTitle: string;
}

export interface CMSPartner {
  id: string;
  slug?: string;
  name: string;
  role: string;
  specialty: string;
  description: string;
  capabilities: string[];
  website?: string;
  logo_url?: string;
  service_id?: string;
  service_title?: string;
  display_order: number;
  status: 'published' | 'draft' | 'archived';
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: 'Intelligence' | 'Solutions & Engineering' | 'Pipeline' | 'Civil' | 'Geosolutions' | 'Integrated';
  serviceCapability?: string;
  description: string;
  image: string;
  results?: string;
  equipment?: string[];
  scope?: string;
  challenge?: string;
  solution?: string;
  location?: string;
  year?: string;
}

export interface CMSProject {
  id: string;
  slug?: string;
  title: string;
  client: string;
  category: string;
  service_capability?: string;
  description: string;
  image?: string;
  gallery?: string[];
  results?: string;
  equipment?: string[];
  scope?: string;
  challenge?: string;
  solution?: string;
  location?: string;
  year?: string;
  display_order: number;
  featured: boolean;
  status: 'published' | 'draft' | 'archived';
  created_at?: string;
  updated_at?: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Part-time';
  experience_level: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: 'active' | 'closed' | 'draft';
  display_order: number;
  created_at?: string;
}

export interface JobApplication {
  id: string;
  job_id?: string;
  job_title?: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  resume_url: string;
  cover_letter?: string;
  status: 'new' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
  notes?: string;
  created_at: string;
}

export interface SiteSettings {
  id?: string;
  phone: string;
  phone_raw: string;
  email_info: string;
  email_support: string;
  email_inquiries?: string;
  email_procurement?: string;
  email_careers?: string;
  address_hq: string;
  address_short?: string;
  linkedin_url: string;
  youtube_url: string;
  whatsapp_url?: string;
  whatsapp_number?: string;
  emergency_line?: string;
  stat_years_experience?: string;
  stat_safe_hours?: string;
  stat_completed_projects?: string;
  stat_client_satisfaction?: string;
  maintenance_mode?: boolean;
  maintenance_title?: string;
  maintenance_message?: string;
  maintenance_estimated_time?: string;
  maintenance_video_url?: string;
  updated_at?: string;
}

export interface CMSVideoItem {
  id: string;
  youtubeId: string;
  title: string;
  category: 'documentary' | 'ground' | 'digital' | 'pipeline' | 'marine' | 'hsse' | string;
  categoryLabel: string;
  duration: string;
  publishDate: string;
  description: string;
  highlights: string[];
  thumbnail: string;
  display_order?: number;
  featured?: boolean;
  status?: 'published' | 'draft';
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
}

export interface CMSTeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  linkedin?: string;
  email?: string;
  department?: string;
  display_order: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface LinkedInPost {
  id: string;
  title?: string;
  date: string;
  content: string;
  image?: string;
  link: string;
}

export interface CoreValue {
  title: string;
  description: string;
  icon: string;
}

export type AdminRole = 'Super Admin' | 'Content Editor' | 'Inquiries Manager' | 'Viewer';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  avatar_url?: string;
  job_title?: string;
  phone?: string;
  bio?: string;
  status: 'active' | 'suspended';
  created_at: string;
  last_login_at?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_interest: string;
  message: string;
  status: 'new' | 'in_review' | 'responded' | 'archived';
  notes?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity_type: 'service' | 'blog' | 'slider' | 'video' | 'navigation' | 'media' | 'admin_user' | 'setting' | 'inquiry' | 'project' | 'partner' | 'team_member' | 'job_opening' | 'job_application' | 'vendor_application' | 'email_campaign' | 'email_subscriber';
  entity_id?: string;
  details?: Record<string, any>;
  user_email: string;
  created_at: string;
}

export type VendorBusinessType = 'Business Name (Sole Proprietor / Partnership)' | 'Limited Liability Company (Ltd)';
export type VendorVATStatus = 'VAT-Registered' | 'NOT VAT-Registered';
export type VendorApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'needs_clarification';

export interface VendorApplication {
  id: string;
  reference_number: string; // e.g. PIGL-VEND-2026-0842
  form_code: string; // PIGL/F/VOTC/AHR/037 Rev. No. 00

  // SECTION A: VENDOR IDENTIFICATION
  vendor_legal_name: string;
  business_type: VendorBusinessType;
  rc_bn_number: string;
  incorporation_date: string;
  registered_address: string;
  operational_address?: string;
  is_operational_same_as_registered: boolean;
  nature_of_services: string[];
  nature_of_services_other?: string;

  // SECTION B: TAX INFORMATION
  tin_number: string;
  vat_status: VendorVATStatus;
  vat_reg_number?: string;
  vat_certificate_url?: string;

  // SECTION C: WITHHOLDING TAX (WHT) DECLARATION
  wht_deduction_acknowledged: boolean;
  wht_remittance_acknowledged: boolean;
  wht_credit_note_acknowledged: boolean;
  vat_non_deduction_acknowledged: boolean;

  // SECTION D: BANK DETAILS
  bank_name: string;
  account_name: string;
  account_number: string;
  currency?: string;

  // SECTION E: CONTACT PERSON
  contact_name: string;
  contact_designation: string;
  contact_phone: string;
  contact_email: string;

  // SECTION F: DECLARATION & UNDERTAKING
  declaration_acknowledged: boolean;
  representative_name: string;
  signature_url?: string;
  stamp_url?: string;
  submission_date: string;

  // SECTION G: FOR COMPANY USE ONLY (Internal Review)
  status: VendorApplicationStatus;
  procurement_reviewer?: string;
  finance_reviewer?: string;
  vat_status_verified?: boolean;
  approved_vendor_category?: string;
  approval_date?: string;
  internal_notes?: string;

  created_at: string;
  updated_at?: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  name?: string;
  company?: string;
  source: 'newsletter' | 'contact_form' | 'vendor_portal' | 'manual';
  status: 'active' | 'unsubscribed' | 'bounced';
  tags: string[];
  created_at: string;
  last_emailed_at?: string;
}

export interface EmailCampaign {
  id: string;
  title: string;
  subject: string;
  preheader?: string;
  audience_segment: 'all_subscribers' | 'inquiries_leads' | 'vendors' | 'newsletter_only' | 'custom';
  target_tag?: string;
  bcc_recipients?: string;
  category: 'service_promotion' | 'technology_showcase' | 'newsletter' | 'announcement' | 'follow_up';
  content_html: string;
  content_text?: string;
  featured_service_id?: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipients_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  scheduled_at?: string;
  sent_at?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface DirectFollowUpEmail {
  id: string;
  recipient_email: string;
  recipient_name: string;
  bcc_recipients?: string;
  subject: string;
  message: string;
  template_type: 'rfp_followup' | 'vendor_clarification' | 'service_intro' | 'meeting_invite';
  related_entity_type?: 'inquiry' | 'vendor' | 'job_application';
  related_entity_id?: string;
  sent_at: string;
  sent_by: string;
  status: 'sent' | 'failed';
}

// ==============================================================================
// 16. DYNAMIC NAVIGATION & PAGE MANAGEMENT TYPES
// ==============================================================================
export interface HeaderNavSubLink {
  id: string;
  label: string;
  href: string;
  description?: string;
  is_external?: boolean;
}

export interface HeaderNavSection {
  id: string;
  title: string;
  links: HeaderNavSubLink[];
}

export interface HeaderNavItem {
  id: string;
  name: string;
  href: string;
  type: 'standard' | 'mega' | 'external';
  layout?: 'links' | 'services' | 'projects';
  is_active: boolean;
  order: number;
  badge?: string;
  sections?: HeaderNavSection[];
  featured?: {
    category: string;
    title: string;
    description: string;
    image?: string;
    link: string;
  };
}

export interface FooterLinkItem {
  id: string;
  label: string;
  href: string;
  is_external?: boolean;
  is_active: boolean;
  order: number;
}

export interface FooterColumnItem {
  id: string;
  title: string;
  order: number;
  is_active: boolean;
  links: FooterLinkItem[];
}

export interface SitePageInfo {
  id: string;
  title: string;
  slug: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  show_in_header: boolean;
  show_in_footer: boolean;
  updated_at?: string;
}

export interface NavigationConfig {
  header: HeaderNavItem[];
  footer: {
    columns: FooterColumnItem[];
    bottom_links: FooterLinkItem[];
  };
  pages: SitePageInfo[];
  updated_at?: string;
}

