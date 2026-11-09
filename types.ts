export interface SubService {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  display_order?: number;
}

export interface ServiceDeliverableItem {
  title: string;
  description: string;
  deliverablesOutput?: string;
  standards?: string;
}

export type DivisionName =
  | 'GeoSolutions & Engineering Services'
  | 'Metocean & Marine Solutions'
  | 'Integrated Construction Services'
  | 'Industrial Solutions'
  | 'Geo Data Intelligence'
  | 'Digital Mapping Intelligence'
  | 'Marine Intelligence'
  | 'Asset Integrity Intelligence'
  | 'Engineering, Industrial & Environmental Solutions'
  | 'Ground Intelligence'
  | 'Digital Intelligence'
  | 'Integrated Engineering & Construction Solutions'
  | 'Industrial & Environmental Technologies'
  | 'Offshore Intelligence'
  | 'Intelligence'
  | 'Solutions & Engineering'
  | string;

export interface Service {
  id: string;
  serviceNumber?: string;
  abbreviation?: string;
  descriptor?: string;
  positioning?: string;
  title: string;
  tagline: string;
  description: string;
  items: (string | ServiceDeliverableItem)[];
  subServices?: SubService[];
  icon: string;
  image: string;
  division: DivisionName;
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
  alt?: string;
}

export interface CMSService {
  id: string;
  slug: string;
  title: string;
  hero_heading?: string;
  abbreviation?: string;
  descriptor?: string;
  positioning?: string;
  division: DivisionName;
  category: string;
  tagline?: string;
  short_description: string;
  overview_heading?: string;
  full_description: string;
  engineering_problem_addressed?: string;
  business_value?: string;
  hero_image?: string;
  card_image?: string;
  capabilities: (string | ServiceDeliverableItem)[];
  subServices?: SubService[];
  benefits: string[];
  operating_environments: string[];
  technology: string[];
  methodology: string[];
  standards?: string[];
  equipment: string[];
  key_deliverables?: string[];
  gallery?: ServiceGalleryImage[];
  video_url?: string;
  cta_text?: string;
  cta_url?: string;
  partner_badge?: {
    partnerName: string;
    role: string;
    website?: string;
    title?: string;
    description?: string;
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
  relationship_type?: 'Strategic and Technical Relationships' | 'Authorised Distributorships and Representations' | 'Technology and Delivery Collaborations' | string;
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
  relationship_type?: 'Strategic and Technical Relationships' | 'Authorised Distributorships and Representations' | 'Technology and Delivery Collaborations' | string;
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

export interface CompanyProfileDocument {
  id: string;
  title: string;
  filename: string;
  file_url: string;
  storage_path?: string;
  storage_bucket?: string;
  file_type: string;
  file_size: number;
  formatted_size?: string;
  is_published: boolean;
  version?: string;
  description?: string;
  cover_image_url?: string;
  upload_date: string;
  updated_at: string;
  updated_by?: string;
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
  hero_slide_interval?: number;
  maintenance_mode?: boolean;
  maintenance_title?: string;
  maintenance_message?: string;
  maintenance_estimated_time?: string;
  maintenance_bg_type?: 'video' | 'image';
  maintenance_video_url?: string;
  maintenance_image_url?: string;
  updated_at?: string;
}

export interface CMSTestimonial {
  id: string;
  quote: string;
  author_name: string;
  author_title: string;
  author_company?: string;
  author_initials?: string;
  is_placeholder: boolean;
  status: 'published' | 'draft';
  display_order: number;
  created_at?: string;
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

export type AdminRole = 'Super Admin' | 'Campaign Manager' | 'Content Editor' | 'Inquiries Manager' | 'Viewer';

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

export interface ClientRelationshipItem {
  id: string;
  name: string;
  category: 'Direct Client' | 'Project & Delivery Partner' | 'Industry Stakeholder';
  role?: string;
  logo_url: string;
  website?: string;
  display_order: number;
  status: 'published' | 'draft';
}

export const DEFAULT_CLIENT_RELATIONSHIPS: ClientRelationshipItem[] = [
  {
    id: 'client-shell',
    name: 'Shell',
    category: 'Direct Client',
    role: 'Operating Engagement',
    logo_url: '/assets/clients/shell.svg',
    display_order: 1,
    status: 'published'
  },
  {
    id: 'client-nnpc',
    name: 'NNPC Limited',
    category: 'Industry Stakeholder',
    role: 'National Energy Infrastructure',
    logo_url: '/assets/clients/nnpc.svg',
    display_order: 2,
    status: 'published'
  },
  {
    id: 'client-totalenergies',
    name: 'TotalEnergies',
    category: 'Direct Client',
    role: 'Offshore & Energy Operations',
    logo_url: '/assets/clients/totalenergies.svg',
    display_order: 3,
    status: 'published'
  },
  {
    id: 'client-renaissance',
    name: 'Renaissance Africa Energy Company Limited',
    category: 'Industry Stakeholder',
    role: 'Upstream Asset Operations',
    logo_url: '/assets/clients/renaissance.svg',
    display_order: 4,
    status: 'published'
  },
  {
    id: 'client-newcross',
    name: 'Newcross Exploration & Production',
    category: 'Project & Delivery Partner',
    role: 'Field Development Support',
    logo_url: '/assets/clients/newcross.svg',
    display_order: 5,
    status: 'published'
  },
  {
    id: 'client-panocean',
    name: 'Pan Ocean Oil Corporation (Nigeria) Limited',
    category: 'Project & Delivery Partner',
    role: 'Pipeline & Facility Support',
    logo_url: '/assets/clients/panocean.svg',
    display_order: 6,
    status: 'published'
  },
  {
    id: 'client-matrix',
    name: 'Matrix Energy',
    category: 'Direct Client',
    role: 'Downstream & Terminal Engineering',
    logo_url: '/assets/clients/matrix.svg',
    display_order: 7,
    status: 'published'
  }
];

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
  entity_type: 'service' | 'blog' | 'slider' | 'video' | 'navigation' | 'media' | 'admin_user' | 'setting' | 'inquiry' | 'project' | 'partner' | 'team_member' | 'job_opening' | 'job_application' | 'vendor_application' | 'email_campaign' | 'email_subscriber' | 'testimonial';
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
  badge?: string;
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
  type: 'standard' | 'dropdown' | 'mega' | 'external';
  layout?: 'links' | 'services' | 'projects';
  is_active: boolean;
  order: number;
  badge?: string;
  is_external?: boolean;
  dropdown_items?: HeaderNavSubLink[];
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
  breadcrumb_image?: string;
  header_bg_image?: string;
  is_published: boolean;
  show_in_header: boolean;
  show_in_footer: boolean;
  updated_at?: string;
}

export interface PageHeaderConfig {
  id: string;            // e.g. "about", "services", "projects", "teams", "network", "careers", "blog", "contact", "hsse", "videos", "vendors"
  page_slug: string;     // e.g. "/about", "/services"
  page_name: string;     // e.g. "About Us", "Our Services"
  breadcrumb_title?: string;
  breadcrumb_image?: string; // Persistent URL of uploaded breadcrumb background
  header_bg_image?: string;  // Persistent URL for top header background
  overlay_opacity?: number;  // 0.1 to 0.9 (defaults to 0.35)
  fallback_image?: string;   // Baseline default image to use when removed
  updated_at?: string;
  updated_by?: string;       // Email of admin who updated
}

export interface HeaderBackgroundSettings {
  top_header_bg_image?: string; // Top header background image
  top_header_overlay_opacity?: number;
  top_header_active?: boolean;
  updated_at?: string;
  updated_by?: string;
}

export interface SiteHeadersData {
  pages: Record<string, PageHeaderConfig>;
  top_header: HeaderBackgroundSettings;
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

export type SocialPlatformId =
  | 'linkedin'
  | 'youtube'
  | 'twitter' // X
  | 'instagram'
  | 'facebook'
  | 'whatsapp'
  | 'tiktok'
  | 'threads'
  | 'github'
  | 'medium'
  | 'telegram'
  | 'custom';

export interface SocialLinkItem {
  id: string;
  platform: SocialPlatformId;
  label: string; // e.g. "LinkedIn", "YouTube", "X (Twitter)"
  url: string; // e.g. "https://www.linkedin.com/company/polarisigl/"
  handle?: string; // e.g. "@polarisigl"
  icon_type?: 'preset' | 'custom_svg' | 'custom_image';
  custom_svg?: string;
  custom_icon_url?: string;
  brand_color?: string; // hex color for brand hover/pill
  hover_color?: string;
  is_active: boolean; // toggle visibility
  display_order: number;
  show_in_footer: boolean;
  show_in_contact: boolean;
  show_in_header?: boolean;
  aria_label?: string;
  updated_at?: string;
  created_at?: string;
}


