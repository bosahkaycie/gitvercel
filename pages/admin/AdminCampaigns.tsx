import React, { useState, useRef, useEffect } from 'react';
import {
  EmailCampaign,
  EmailSubscriber,
  ContactInquiry,
  VendorApplication,
  CMSService
} from '../../types';
import {
  IconCampaign,
  IconMail,
  IconSend,
  IconPlus,
  IconSearch,
  IconUsers,
  IconActivity,
  IconCheck,
  IconExternal,
  IconTrendingUp,
  IconPieChart,
  IconTrash
} from '../../components/admin/AdminIcons';
import { sendCorporateEmail } from '../../lib/email';

interface AdminCampaignsProps {
  campaigns: EmailCampaign[];
  subscribers: EmailSubscriber[];
  inquiries?: ContactInquiry[];
  vendors?: VendorApplication[];
  services?: CMSService[];
  loading?: boolean;
  onSaveCampaign: (campaign: Partial<EmailCampaign>) => Promise<{ success: boolean; campaign?: EmailCampaign; error?: string }>;
  onDispatchCampaign: (id: string, count: number, recipientEmails?: string[]) => Promise<{ success: boolean; error?: string }>;
  onDeleteCampaign: (id: string) => Promise<{ success: boolean; error?: string }>;
  onAddSubscriber: (sub: Partial<EmailSubscriber>) => Promise<{ success: boolean; error?: string }>;
  onDeleteSubscriber: (id: string) => Promise<{ success: boolean; error?: string }>;
  theme?: 'light' | 'dark';
}

const EMAIL_TEMPLATES = [
  {
    id: 'geotech_cpt',
    name: 'Ground Intelligence & CPT Investigation',
    category: 'service_promotion' as const,
    subject: 'Advance Your Subsurface Reliability: 20-Ton CPT & Marine Geotechnical Investigation',
    preheader: 'Explore PIGL high-capacity geotechnical investigations, pontoon drilling, and foundation engineering.',
    headline: 'Subsurface Precision for High-Stakes Infrastructure',
    body: `Polaris Integrated & GeoSolutions Limited (PIGL) delivers comprehensive geotechnical characterisation, in-situ soil testing, and geomechanical reporting across swamp, coastal, and onshore terrains in Nigeria.

Our high-capacity 20-Ton Hydraulic CPT rigs and modular pontoon drill units provide engineers with continuous, real-time cone resistance and pore pressure data required for deep foundation, piling, and reclamation engineering.`,
    ctaText: 'Request Geotechnical Scoping',
    ctaUrl: 'https://polarisigl.com/services/ground-intelligence'
  },
  {
    id: 'reality_capture',
    name: '3D Reality Capture & Digital Twins',
    category: 'technology_showcase' as const,
    subject: 'Millimeter-Accurate As-Built Digitalization for Offshore & Industrial Assets',
    preheader: 'Eliminate clash risks and reduce brownfield modification downtime with Leica RTC360 laser scanning.',
    headline: 'Intelligent As-Built Engineering at the Speed of Light',
    body: `Brownfield modifications and asset revamps demand absolute dimensional certainty. PIGL utilizes high-definition 3D laser scanners and drone LiDAR to transform physical plant structures into intelligent BIM models and interactive digital twins.

Identify tie-in clashes before fabrication, streamline equipment changeouts, and preserve lifetime facility intelligence with certified survey accuracy.`,
    ctaText: 'Explore Reality Capture Services',
    ctaUrl: 'https://polarisigl.com/services/digital-intelligence'
  },
  {
    id: 'quarterly_newsletter',
    name: 'PIGL Executive Quarterly Newsletter',
    category: 'newsletter' as const,
    subject: 'PIGL Technical Digest: Safe Operations, Project Milestones & Technology Insights',
    preheader: 'Quarterly review from Polaris Integrated & GeoSolutions Limited.',
    headline: 'Excellence in Engineering & Geosolutions',
    body: `Welcome to the latest edition of the PIGL Technical Digest. In this issue, we highlight our recent successful completion of multi-kilometer pipeline route mapping, over 500,000 continuous LTI-free man-hours, and new technological partnerships expanding our offshore hydrographic survey capabilities.

Read on to learn how our integrated intelligence and engineering solutions are driving efficiency across the West African energy and infrastructure sectors.`,
    ctaText: 'Read Full Case Studies',
    ctaUrl: 'https://polarisigl.com/projects'
  },
  {
    id: 'vendor_compliance',
    name: 'Vendor Re-Qualification Notice',
    category: 'announcement' as const,
    subject: 'Mandatory Vendor Onboarding & Nigerian Tax Compliance (Form VOTC/037)',
    preheader: 'Official procurement compliance update for all technical, marine, and engineering vendors.',
    headline: 'Standardized Vendor Qualification Framework',
    body: `Polaris Integrated & GeoSolutions Limited has launched its updated Digital Vendor Onboarding & Tax Clearance Portal (Form PIGL/F/VOTC/AHR/037).

All active and prospective subcontractors, equipment suppliers, and service providers must verify their company profile, TIN validation, VAT registration, and NUBAN bank details to remain eligible for upcoming procurement tenders.`,
    ctaText: 'Complete Vendor Verification',
    ctaUrl: 'https://polarisigl.com/vendors/portal'
  }
];

const AdminCampaigns: React.FC<AdminCampaignsProps> = ({
  campaigns = [],
  subscribers = [],
  inquiries = [],
  vendors = [],
  services = [],
  loading = false,
  onSaveCampaign,
  onDispatchCampaign,
  onDeleteCampaign,
  onAddSubscriber,
  onDeleteSubscriber,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';

  // Navigation View: 'list' (all campaigns & stats) or 'editor' (full-page dedicated campaign studio)
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [activeSubTab, setActiveSubTab] = useState<'campaigns' | 'subscribers'>('campaigns');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Editor State
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [campTitle, setCampTitle] = useState('');
  const [campSubject, setCampSubject] = useState('');
  const [campPreheader, setCampPreheader] = useState('');
  const [campBcc, setCampBcc] = useState('');
  const [campAudience, setCampAudience] = useState<EmailCampaign['audience_segment']>('all_subscribers');
  const [campCategory, setCampCategory] = useState<EmailCampaign['category']>('service_promotion');
  const [campHeadline, setCampHeadline] = useState('');
  const [campBody, setCampBody] = useState('');
  const [campCtaText, setCampCtaText] = useState('Explore Solutions');
  const [campCtaUrl, setCampCtaUrl] = useState('https://polarisigl.com/services');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  
  // Editor Formats
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual');
  const [rawHtmlCode, setRawHtmlCode] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);

  // Floating Toast State
  const [floatingToast, setFloatingToast] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  } | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setFloatingToast({ type, title, message });
    setTimeout(() => {
      setFloatingToast(cur => (cur?.message === message ? null : cur));
    }, 6000);
  };

  // Test Email & Dispatch State
  const [isTestEmailModalOpen, setIsTestEmailModalOpen] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isDispatchingLive, setIsDispatchingLive] = useState(false);

  // New Subscriber Modal / Drawer state
  const [isSubscriberModalOpen, setIsSubscriberModalOpen] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [subName, setSubName] = useState('');
  const [subCompany, setSubCompany] = useState('');
  const [subTag, setSubTag] = useState('');

  const visualEditorRef = useRef<HTMLDivElement>(null);

  // Stats calculation
  const totalSent = campaigns.filter(c => c.status === 'sent').length;
  const totalSubscribers = subscribers.length;
  const totalDelivered = campaigns.reduce((acc, c) => acc + (c.delivered_count || 0), 0);
  const totalOpened = campaigns.reduce((acc, c) => acc + (c.opened_count || 0), 0);
  const totalClicked = campaigns.reduce((acc, c) => acc + (c.clicked_count || 0), 0);
  const avgOpenRate = totalDelivered > 0 ? Math.round((totalOpened / totalDelivered) * 100) : 62;
  const avgClickRate = totalDelivered > 0 ? Math.round((totalClicked / totalDelivered) * 100) : 24;

  const getAudienceEmails = (seg: EmailCampaign['audience_segment'], bccStr?: string): string[] => {
    const emailSet = new Set<string>();

    if (bccStr) {
      bccStr.split(/[,;\n]/).forEach(e => {
        const clean = e.trim().toLowerCase();
        if (clean && clean.includes('@')) emailSet.add(clean);
      });
    }

    if (seg === 'all_subscribers') {
      subscribers.forEach(s => s.email && emailSet.add(s.email.trim().toLowerCase()));
      (inquiries || []).forEach(i => i.email && emailSet.add(i.email.trim().toLowerCase()));
      (vendors || []).forEach(v => {
        const email = v.contact_email || v.email;
        if (email) emailSet.add(email.trim().toLowerCase());
      });
    } else if (seg === 'inquiries_leads') {
      (inquiries || []).forEach(i => i.email && emailSet.add(i.email.trim().toLowerCase()));
    } else if (seg === 'vendors') {
      (vendors || []).forEach(v => {
        const email = v.contact_email || v.email;
        if (email) emailSet.add(email.trim().toLowerCase());
      });
    } else if (seg === 'newsletter_only') {
      subscribers.filter(s => s.source === 'newsletter').forEach(s => s.email && emailSet.add(s.email.trim().toLowerCase()));
    } else {
      subscribers.forEach(s => s.email && emailSet.add(s.email.trim().toLowerCase()));
    }

    return Array.from(emailSet);
  };

  const calculateAudienceCount = (seg: EmailCampaign['audience_segment'], bccStr?: string) => {
    const emails = getAudienceEmails(seg, bccStr);
    if (emails.length > 0) return emails.length;
    switch (seg) {
      case 'all_subscribers':
        return subscribers.length + inquiries.length + vendors.length;
      case 'inquiries_leads':
        return inquiries.length;
      case 'vendors':
        return vendors.length;
      case 'newsletter_only':
        return subscribers.filter(s => s.source === 'newsletter').length;
      default:
        return subscribers.length;
    }
  };

  const handleApplyTemplate = (tId: string) => {
    const t = EMAIL_TEMPLATES.find(temp => temp.id === tId);
    if (!t) return;
    setCampTitle(t.name);
    setCampSubject(t.subject);
    setCampPreheader(t.preheader);
    setCampCategory(t.category);
    setCampHeadline(t.headline);
    setCampBody(t.body);
    setCampCtaText(t.ctaText);
    setCampCtaUrl(t.ctaUrl);

    const generatedHtml = generateStandardHtml(t.headline, t.body, t.ctaText, t.ctaUrl);
    setRawHtmlCode(generatedHtml);
    if (visualEditorRef.current && editorMode === 'visual') {
      visualEditorRef.current.innerHTML = t.body;
    }
  };

  const generateStandardHtml = (headline: string, body: string, ctaText: string, ctaUrl: string) => {
    return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <div style="background: #022c22; padding: 24px; text-align: center;">
    <h1 style="color: #ffffff; font-size: 16px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">POLARIS INTEGRATED & GEOSOLUTIONS</h1>
    <p style="color: #6ee7b7; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; font-family: monospace;">Intelligence • Solutions • Engineering</p>
  </div>
  <div style="padding: 32px 24px;">
    <h2 style="color: #0f172a; font-size: 20px; font-weight: bold; margin-top: 0;">${headline || campSubject || 'Engineering Update'}</h2>
    <div style="color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-line;">${body}</div>
    <div style="margin-top: 28px; text-align: center;">
      <a href="${ctaUrl || 'https://polarisigl.com/services'}" style="display: inline-block; background: #047857; color: #ffffff; font-size: 13px; font-weight: bold; padding: 12px 28px; border-radius: 6px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">${ctaText || 'Explore Solutions'}</a>
    </div>
  </div>
  <div style="background: #f8fafc; padding: 20px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b;">
    <p style="margin: 0 0 4px 0;"><strong>Polaris Integrated & GeoSolutions Limited (PIGL)</strong></p>
    <p style="margin: 0;">16 Trans-Amadi Industrial Layout, Port Harcourt, Rivers State, Nigeria.</p>
    <p style="margin: 8px 0 0 0;"><a href="https://polarisigl.com" style="color: #047857;">polarisigl.com</a> • <a href="mailto:info@polarisigl.com" style="color: #047857;">info@polarisigl.com</a></p>
  </div>
</div>`;
  };

  const handleOpenNewCampaign = () => {
    setEditingCampaignId(null);
    setCampTitle('');
    setCampSubject('');
    setCampPreheader('');
    setCampBcc('');
    setCampAudience('all_subscribers');
    setCampCategory('service_promotion');
    setCampHeadline('');
    setCampBody('');
    setCampCtaText('');
    setCampCtaUrl('');
    setSelectedServiceId('');
    setRawHtmlCode('');
    setEditorMode('visual');
    if (visualEditorRef.current) {
      visualEditorRef.current.innerHTML = '';
    }
    setViewMode('editor');
  };

  const handleOpenEditCampaign = (camp: EmailCampaign) => {
    setEditingCampaignId(camp.id);
    setCampTitle(camp.title);
    setCampSubject(camp.subject);
    setCampPreheader(camp.preheader || '');
    setCampBcc(camp.bcc_recipients || '');
    setCampAudience(camp.audience_segment);
    setCampCategory(camp.category);
    setCampHeadline(camp.title);
    setRawHtmlCode(camp.content_html || '');
    setCampBody(camp.content_html || '');
    setViewMode('editor');
  };

  const handleSendTestEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetEmail = testEmailAddress.trim() || 'hello@polarisigl.com';
    if (!targetEmail.includes('@')) {
      showToast('error', 'Invalid Email', 'Please provide a valid email address for the test.');
      return;
    }

    setIsSendingTest(true);
    showToast('info', 'Sending Test Email...', `Dispatching live preview to ${targetEmail} via SMTP...`);

    const finalHtml = editorMode === 'html' && rawHtmlCode.trim() 
      ? rawHtmlCode 
      : generateStandardHtml(campHeadline || campSubject, campBody, campCtaText, campCtaUrl);

    try {
      const res = await sendCorporateEmail({
        to: targetEmail,
        subject: `[TEST PREVIEW] ${campSubject || 'PIGL Campaign Update'}`,
        html: finalHtml,
        text: campBody || 'PIGL Campaign Preview'
      });

      setIsSendingTest(false);
      if (res.success) {
        showToast('success', 'Email Sent', `Test preview successfully delivered to ${targetEmail}!`);
        setIsTestEmailModalOpen(false);
      } else {
        showToast('error', 'Test Send Failed', res.error || 'SMTP server rejected the email.');
      }
    } catch (err: any) {
      setIsSendingTest(false);
      showToast('error', 'Test Send Error', err.message || 'Network error occurred while sending test email.');
    }
  };

  const handleSaveAndSend = async (asDraft = false) => {
    const finalHtml = editorMode === 'html' && rawHtmlCode.trim() 
      ? rawHtmlCode 
      : generateStandardHtml(campHeadline || campSubject, campBody, campCtaText, campCtaUrl);

    if (asDraft) {
      const draftPayload: Partial<EmailCampaign> = {
        id: editingCampaignId || undefined,
        title: campTitle || campSubject || 'Untitled Draft',
        subject: campSubject || 'Draft Subject',
        preheader: campPreheader,
        bcc_recipients: campBcc.trim() || undefined,
        audience_segment: campAudience,
        category: campCategory,
        featured_service_id: selectedServiceId,
        content_html: finalHtml,
        status: 'draft',
        recipients_count: 0,
        delivered_count: 0,
        opened_count: 0,
        clicked_count: 0,
      };

      const res = await onSaveCampaign(draftPayload);
      if (res.success) {
        showToast('success', 'Draft Saved', 'Campaign saved to drafts.');
        setViewMode('list');
      } else {
        showToast('error', 'Save Failed', res.error || 'Failed to save draft.');
      }
      return;
    }

    // LIVE DISPATCH
    if (!campSubject.trim()) {
      showToast('error', 'Subject Required', 'Please enter a campaign subject before dispatching.');
      return;
    }

    const recipientEmails = getAudienceEmails(campAudience, campBcc);
    if (recipientEmails.length === 0) {
      showToast(
        'error', 
        'No Recipients Found', 
        'The selected audience segment currently has no subscribers. Add contacts or specify BCC recipient emails to dispatch.'
      );
      return;
    }

    setIsDispatchingLive(true);
    showToast(
      'info', 
      'Sending Campaign...', 
      `Dispatching via corporate SMTP to ${recipientEmails.length} recipient${recipientEmails.length > 1 ? 's' : ''}...`
    );

    try {
      const sendRes = await sendCorporateEmail({
        to: 'hello@polarisigl.com',
        bcc: recipientEmails,
        subject: campSubject,
        html: finalHtml,
        text: campBody
      });

      if (!sendRes.success) {
        setIsDispatchingLive(false);
        showToast('error', 'Dispatch Failed', sendRes.error || 'SMTP server error. Check email deliverability settings.');
        return;
      }

      const campaignPayload: Partial<EmailCampaign> = {
        id: editingCampaignId || undefined,
        title: campTitle || campSubject,
        subject: campSubject,
        preheader: campPreheader,
        bcc_recipients: campBcc.trim() || undefined,
        audience_segment: campAudience,
        category: campCategory,
        featured_service_id: selectedServiceId,
        content_html: finalHtml,
        status: 'sent',
        recipients_count: recipientEmails.length,
        delivered_count: recipientEmails.length,
        opened_count: 0,
        clicked_count: 0,
        sent_at: new Date().toISOString()
      };

      await onSaveCampaign(campaignPayload);
      setIsDispatchingLive(false);
      showToast(
        'success', 
        'Email Sent', 
        `Campaign "${campTitle || campSubject}" successfully delivered to ${recipientEmails.length} recipient${recipientEmails.length > 1 ? 's' : ''}!`
      );
      setViewMode('list');
    } catch (err: any) {
      setIsDispatchingLive(false);
      showToast('error', 'Dispatch Error', err.message || 'An unexpected error occurred during dispatch.');
    }
  };

  const handleInstantDispatch = async (camp: EmailCampaign) => {
    const recipientEmails = getAudienceEmails(camp.audience_segment, camp.bcc_recipients);
    if (recipientEmails.length === 0) {
      showToast('error', 'No Recipients Found', 'No email addresses found for this campaign segment. Please configure BCC or add subscribers.');
      return;
    }

    setDispatchingId(camp.id);
    showToast('info', 'Sending Campaign...', `Dispatching "${camp.title}" to ${recipientEmails.length} recipient(s)...`);

    try {
      const sendRes = await sendCorporateEmail({
        to: 'hello@polarisigl.com',
        bcc: recipientEmails,
        subject: camp.subject,
        html: camp.content_html,
        text: camp.content_text
      });

      if (!sendRes.success) {
        setDispatchingId(null);
        showToast('error', 'Dispatch Failed', sendRes.error || 'SMTP delivery failed.');
        return;
      }

      await onDispatchCampaign(camp.id, recipientEmails.length, recipientEmails);
      setDispatchingId(null);
      showToast('success', 'Email Sent', `Campaign "${camp.title}" successfully dispatched to ${recipientEmails.length} recipient${recipientEmails.length > 1 ? 's' : ''}!`);
    } catch (err: any) {
      setDispatchingId(null);
      showToast('error', 'Dispatch Error', err.message || 'Error occurred while sending campaign.');
    }
  };

  const handleAddSubscriberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;
    await onAddSubscriber({
      email: subEmail,
      name: subName,
      company: subCompany,
      tags: subTag ? subTag.split(',').map(t => t.trim()) : ['Manual Lead'],
      source: 'manual_import',
      status: 'active'
    });
    setSubEmail('');
    setSubName('');
    setSubCompany('');
    setSubTag('');
    setIsSubscriberModalOpen(false);
    showToast('success', 'Subscriber Added', `Subscriber "${subEmail}" added successfully.`);
  };

  // ==========================================
  // VIEW: FULL DEDICATED CAMPAIGN STUDIO
  // ==========================================
  if (viewMode === 'editor') {
    const renderedHtml = editorMode === 'html' && rawHtmlCode.trim() 
      ? rawHtmlCode 
      : generateStandardHtml(campHeadline || campSubject, campBody, campCtaText, campCtaUrl);

    return (
      <div className="space-y-6 animate-fade-in relative">
        {/* Floating Toast Notification */}
        {floatingToast && (
          <aside
            role="status"
            aria-live="polite"
            className="fixed top-6 right-6 z-[99999] max-w-md w-[calc(100vw-3rem)] sm:w-auto animate-fade-in pointer-events-auto"
          >
            <div className={`flex items-start p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all ${
              floatingToast.type === 'success'
                ? 'bg-slate-900/95 text-white border-emerald-500/50 shadow-emerald-950/50'
                : floatingToast.type === 'error'
                ? 'bg-slate-900/95 text-white border-rose-500/50 shadow-rose-950/50'
                : 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/50'
            }`}>
              <div className={`p-2 rounded-xl mr-3.5 shrink-0 ${
                floatingToast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                floatingToast.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {floatingToast.type === 'success' ? (
                  <IconCheck className="w-5 h-5" />
                ) : floatingToast.type === 'error' ? (
                  <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-[220px] mr-2">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
                  {floatingToast.title}
                </p>
                <p className="text-sm font-medium text-slate-200 leading-snug">
                  {floatingToast.message}
                </p>
              </div>
              <button
                onClick={() => setFloatingToast(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </aside>
        )}

        {/* Test Email Modal */}
        {isTestEmailModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <IconMail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Send Test Preview</h3>
                    <p className="text-xs text-slate-400">Test SMTP deliverability instantly</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTestEmailModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSendTestEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Recipient Test Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. your-email@polarisigl.com"
                    value={testEmailAddress}
                    onChange={e => setTestEmailAddress(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Delivered via MXrouting (<code className="text-emerald-400 font-mono">glacier.mxrouting.net:465</code>).
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsTestEmailModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingTest}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-lg flex items-center space-x-2"
                  >
                    {isSendingTest ? (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <IconSend className="w-3.5 h-3.5" />
                    )}
                    <span>{isSendingTest ? 'Sending...' : 'Send Live Test'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Editor Page Header */}
        <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Back to Campaigns"
              >
                &larr; Back
              </button>
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {editingCampaignId ? 'Edit Campaign' : 'Compose Email Campaign'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Full Studio Mode
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  Author rich corporate newsletters, paste raw HTML templates, and preview real-time client rendering.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleSaveAndSend(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setIsTestEmailModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center space-x-1.5"
                title="Send a live preview email to test deliverability"
              >
                <IconMail className="w-3.5 h-3.5" />
                <span>Send Test</span>
              </button>
              <button
                type="button"
                disabled={isDispatchingLive}
                onClick={() => handleSaveAndSend(false)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center space-x-2"
              >
                {isDispatchingLive ? (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <IconSend className="w-3.5 h-3.5" />
                )}
                <span>{isDispatchingLive ? 'Dispatching...' : `Dispatch Campaign (${calculateAudienceCount(campAudience, campBcc)} Recipients)`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Template Selector Bar */}
        <div className={`p-4 rounded-xl border flex flex-wrap items-center gap-2 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <span className={`text-xs font-bold uppercase tracking-wider mr-2 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
            Design Options:
          </span>
          <button
            type="button"
            onClick={handleOpenNewCampaign}
            className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${
              (!campTitle && !campSubject && !campBody && !rawHtmlCode)
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  : 'bg-white hover:bg-slate-200 border-slate-300 text-slate-700 shadow-sm'
            }`}
          >
            ✨ Blank Custom Canvas
          </button>
          <span className="text-slate-500 text-xs mx-1">|</span>
          <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Optional Presets:
          </span>
          {EMAIL_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleApplyTemplate(tpl.id)}
              className={`px-3 py-1.5 border rounded-lg text-xs transition-all ${
                isDark 
                  ? 'bg-slate-800/80 hover:bg-emerald-600 hover:text-white border-slate-700 text-slate-300' 
                  : 'bg-white hover:bg-emerald-600 hover:text-white hover:border-emerald-600 border-slate-300 text-slate-800 font-bold shadow-sm'
              }`}
            >
              {tpl.name}
            </button>
          ))}
        </div>

        {/* Main 2-Column Split: Form on Left, Live HTML Viewer on Right */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Form & Code/Visual Editor (7 cols) */}
          <div className="xl:col-span-7 space-y-6">
            <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Campaign Internal Title *</label>
                  <input
                    type="text"
                    required
                    value={campTitle}
                    onChange={(e) => setCampTitle(e.target.value)}
                    placeholder="e.g. Q1 Geotechnical Capabilities Blast"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Target Audience Segment</label>
                    <select
                      value={campAudience}
                      onChange={(e) => setCampAudience(e.target.value as any)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                        isDark 
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                      }`}
                    >
                      <option value="all_subscribers">All Subscribers & Leads ({subscribers.length + inquiries.length + vendors.length})</option>
                      <option value="inquiries_leads">Inquiries & Prospective Leads ({inquiries.length})</option>
                      <option value="vendors">Subcontractors & Vendors ({vendors.length})</option>
                      <option value="newsletter_only">Newsletter Subscribers ({subscribers.length})</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Campaign Category</label>
                    <select
                      value={campCategory}
                      onChange={(e) => setCampCategory(e.target.value as any)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                        isDark 
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                      }`}
                    >
                      <option value="service_promotion">Service Promotion</option>
                      <option value="technology_showcase">Technology Showcase</option>
                      <option value="newsletter">Quarterly Newsletter</option>
                      <option value="announcement">Corporate Announcement</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Email Subject Line *</label>
                  <input
                    type="text"
                    required
                    value={campSubject}
                    onChange={(e) => setCampSubject(e.target.value)}
                    placeholder="e.g. Subsurface Precision: 20-Ton CPT Operations"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Inbox Preview Text (Preheader)</label>
                  <input
                    type="text"
                    value={campPreheader}
                    onChange={(e) => setCampPreheader(e.target.value)}
                    placeholder="Short text snippet shown in recipient inbox list..."
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                    }`}
                  />
                </div>

                {/* BCC Recipients for Campaign Broadcast */}
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50/80 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <label className="block font-bold text-slate-400 uppercase">
                        BCC Recipients (Blind Carbon Copy)
                      </label>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        Internal Archive
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">Optional</span>
                  </div>
                  <input
                    type="text"
                    value={campBcc}
                    onChange={(e) => setCampBcc(e.target.value)}
                    placeholder="e.g. executive@polarisigl.com, archive@polarisigl.com (comma-separated)"
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' 
                        : 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                    }`}
                  />
                </div>

                {/* Editor Mode Header */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                    <div className="flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setEditorMode('visual')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          editorMode === 'visual' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Visual Formatter
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!rawHtmlCode.trim() && (campHeadline || campBody)) {
                            setRawHtmlCode(renderedHtml);
                          }
                          setEditorMode('html');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          editorMode === 'html' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Paste Raw HTML
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono">
                      {editorMode === 'visual' ? 'Rich Text Mode' : 'HTML Source Mode'}
                    </span>
                  </div>

                  {editorMode === 'visual' ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-bold text-slate-400 uppercase mb-1">Banner Headline</label>
                        <input
                          type="text"
                          value={campHeadline}
                          onChange={(e) => setCampHeadline(e.target.value)}
                          placeholder="e.g. Subsurface Precision for Critical Energy Corridors"
                          className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                            isDark 
                              ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                              : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-400 uppercase mb-1">Main Content Body</label>
                        <textarea
                          rows={8}
                          value={campBody}
                          onChange={(e) => setCampBody(e.target.value)}
                          placeholder="Write your email body copy..."
                          className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors leading-relaxed ${
                            isDark 
                              ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                              : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-400 uppercase mb-1">CTA Button Text</label>
                          <input
                            type="text"
                            value={campCtaText}
                            onChange={(e) => setCampCtaText(e.target.value)}
                            placeholder="Explore Solutions"
                            className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                              isDark 
                                ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                                : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-400 uppercase mb-1">CTA Destination Link</label>
                          <input
                            type="url"
                            value={campCtaUrl}
                            onChange={(e) => setCampCtaUrl(e.target.value)}
                            placeholder="https://polarisigl.com/services"
                            className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                              isDark 
                                ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                                : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 rounded-t-xl border-x border-t border-slate-800 text-[11px] font-mono text-slate-400">
                        <span className="flex items-center space-x-2 text-emerald-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Raw HTML Source Code Editor</span>
                        </span>
                        <span>{rawHtmlCode.length} characters • Visualized on the right</span>
                      </div>
                      <textarea
                        rows={18}
                        value={rawHtmlCode}
                        onChange={(e) => setRawHtmlCode(e.target.value)}
                        placeholder="<!-- Paste your HTML email template with inline styles here -->&#10;<div style='font-family: sans-serif; color: #1e293b; padding: 20px;'>&#10;  <h1 style='color: #059669;'>Polaris Corporate Newsletter</h1>&#10;  <p>Campaign body...</p>&#10;</div>"
                        className="w-full font-mono text-xs p-4 rounded-b-xl bg-slate-950 border border-slate-800 text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed shadow-inner"
                        spellCheck={false}
                      />
                      <p className="text-[11px] text-slate-400">
                        Paste full HTML email markup with inline CSS styling. It renders directly in the live client simulator on the right.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Live HTML Viewer Studio (5 cols) */}
          <div className="xl:col-span-5 space-y-4">
            <div className={`p-6 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Live Client Email Simulator
                  </h3>
                </div>

                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded ${
                      previewDevice === 'desktop' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded ${
                      previewDevice === 'mobile' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Mobile (375px)
                  </button>
                </div>
              </div>

              {/* Rendering Canvas (Rendered directly as it appears without envelope shell) */}
              <div className={`bg-slate-200 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800/80 p-4 min-h-[440px] max-h-[600px] overflow-y-auto no-scrollbar flex flex-col justify-center shadow-inner ${
                previewDevice === 'mobile' ? 'px-2' : ''
              }`}>
                {(editorMode === 'html' ? rawHtmlCode.trim().length > 0 : (campHeadline.trim().length > 0 || campSubject.trim().length > 0 || campBody.trim().length > 0)) ? (
                  <div className="flex justify-center w-full">
                    <div 
                      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                        previewDevice === 'mobile' ? 'max-w-[375px] w-full text-xs' : 'w-full'
                      }`}
                      dangerouslySetInnerHTML={{ __html: renderedHtml }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 space-y-3 my-auto">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <IconCampaign className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Blank Custom Canvas</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                        Compose your custom campaign on the left or paste raw HTML. Your email design will render live here in real-time.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: LIST OF CAMPAIGNS & AUDIENCE
  // ==========================================
  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Floating Toast Notification */}
      {floatingToast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-[99999] max-w-md w-[calc(100vw-3rem)] sm:w-auto animate-fade-in pointer-events-auto"
        >
          <div className={`flex items-start p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all ${
            floatingToast.type === 'success'
              ? 'bg-slate-900/95 text-white border-emerald-500/50 shadow-emerald-950/50'
              : floatingToast.type === 'error'
              ? 'bg-slate-900/95 text-white border-rose-500/50 shadow-rose-950/50'
              : 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/50'
          }`}>
            <div className={`p-2 rounded-xl mr-3.5 shrink-0 ${
              floatingToast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
              floatingToast.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {floatingToast.type === 'success' ? (
                <IconCheck className="w-5 h-5" />
              ) : floatingToast.type === 'error' ? (
                <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-[220px] mr-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
                {floatingToast.title}
              </p>
              <p className="text-sm font-medium text-slate-200 leading-snug">
                {floatingToast.message}
              </p>
            </div>
            <button
              onClick={() => setFloatingToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </aside>
      )}

      {/* Top Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-2xl">
              <IconCampaign className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Campaigns & Newsletters</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Broadcast Suite
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Manage automated marketing blasts, client newsletters, and audience segments with zero pop-up disruption.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenNewCampaign}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center space-x-2"
          >
            <IconPlus className="w-4 h-4" />
            <span>Compose New Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Broadcasts</span>
            <IconSend className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalSent}</p>
          <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Delivered to client list</span>
        </div>

        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Subscribers</span>
            <IconUsers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <p className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalSubscribers}</p>
          <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verified contacts</span>
        </div>

        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Avg Open Rate</span>
            <IconTrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{avgOpenRate}%</p>
          <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>High executive engagement</span>
        </div>

        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Avg Click Rate</span>
            <IconPieChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{avgClickRate}%</p>
          <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Call-to-action responses</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className={`flex items-center space-x-2 border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <button
          onClick={() => setActiveSubTab('campaigns')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
            activeSubTab === 'campaigns'
              ? 'bg-emerald-600 text-white shadow-md'
              : isDark 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Campaigns & Newsletters ({campaigns.length})
        </button>
        <button
          onClick={() => setActiveSubTab('subscribers')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
            activeSubTab === 'subscribers'
              ? 'bg-emerald-600 text-white shadow-md'
              : isDark 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Audience Directory ({subscribers.length})
        </button>
      </div>

      {/* TAB 1: CAMPAIGNS LIST */}
      {activeSubTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns by title, subject or segment..."
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border focus:outline-none ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <button
              onClick={handleOpenNewCampaign}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Compose Campaign</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns
              .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.subject.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((camp) => (
                <div key={camp.id} className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        camp.status === 'sent'
                          ? isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {camp.status === 'sent' ? '✓ Dispatched' : 'Draft'}
                      </span>
                      <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {camp.sent_at ? new Date(camp.sent_at).toLocaleDateString('en-GB') : new Date(camp.created_at).toLocaleDateString('en-GB')}
                      </span>
                    </div>

                    <div>
                      <h3 className={`text-base font-bold tracking-tight leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {camp.title}
                      </h3>
                      <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <strong>Subject:</strong> {camp.subject}
                      </p>
                    </div>

                    <div className={`p-3 border rounded-xl text-xs space-y-1 ${
                      isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className={`flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <span>Audience:</span>
                        <span className={`font-bold uppercase text-[11px] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{camp.audience_segment.replace('_', ' ')}</span>
                      </div>
                      <div className={`flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <span>Recipients:</span>
                        <span className={`font-bold font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{camp.recipients_count || 0}</span>
                      </div>
                      {camp.bcc_recipients && (
                        <div className={`flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          <span>BCC:</span>
                          <span className={`font-mono text-[11px] truncate max-w-[160px] font-semibold ${isDark ? 'text-amber-400' : 'text-amber-700'}`} title={camp.bcc_recipients}>
                            {camp.bcc_recipients}
                          </span>
                        </div>
                      )}
                      {camp.status === 'sent' && (
                        <div className={`flex items-center justify-between pt-1 border-t ${
                          isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                        }`}>
                          <span>Engagement:</span>
                          <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                            {camp.opened_count} opens ({Math.round((camp.opened_count / (camp.recipients_count || 1)) * 100)}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`pt-4 mt-4 border-t flex items-center justify-between ${
                    isDark ? 'border-slate-800/80' : 'border-slate-100'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenEditCampaign(camp)}
                        className={`text-xs font-bold ${
                          isDark ? 'text-emerald-400 hover:text-white' : 'text-emerald-700 hover:text-emerald-900'
                        }`}
                      >
                        Edit / View Studio
                      </button>

                      {camp.status === 'draft' && (
                        <button
                          disabled={dispatchingId === camp.id}
                          onClick={() => handleInstantDispatch(camp)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold"
                        >
                          {dispatchingId === camp.id ? 'Sending...' : 'Dispatch'}
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteCampaign(camp.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 2: SUBSCRIBERS DIRECTORY */}
      {activeSubTab === 'subscribers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subscribers by name, email, or company..."
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border focus:outline-none ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <button
              onClick={() => setIsSubscriberModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Add Subscriber</span>
            </button>
          </div>

          <div className={`rounded-2xl border overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b uppercase font-bold tracking-wider ${
                    isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <th className="py-3.5 px-4">Recipient / Contact</th>
                    <th className="py-3.5 px-4">Company / Organization</th>
                    <th className="py-3.5 px-4">Source</th>
                    <th className="py-3.5 px-4">Tags & Segment</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
                  {subscribers
                    .filter(s => s.email.toLowerCase().includes(searchQuery.toLowerCase()) || (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (s.company || '').toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((sub) => (
                      <tr key={sub.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                        <td className="py-3 px-4">
                          <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{sub.name || 'Subscriber'}</div>
                          <div className={`font-mono text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{sub.email}</div>
                        </td>
                        <td className={`py-3 px-4 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {sub.company || 'Corporate Client'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`capitalize px-2 py-0.5 rounded font-medium text-[11px] ${
                            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {sub.source.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {sub.tags.map((tag, idx) => (
                              <span key={idx} className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                isDark ? 'bg-emerald-950 text-emerald-300 border-emerald-800/60' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                            isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-3">
                          <button
                            onClick={() => onDeleteSubscriber(sub.id)}
                            className="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-semibold"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Subscriber Modal */}
      {isSubscriberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className={`p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4 border ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>Add Verified Subscriber</h3>
              <button
                onClick={() => setIsSubscriberModalOpen(false)}
                className={`text-lg font-bold p-1 rounded-lg ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddSubscriberSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className={`block uppercase font-bold mb-1.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Email Address *</label>
                <input
                  type="email"
                  required
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className={`w-full px-3.5 py-2.5 border rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-400 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 shadow-2xs'
                  }`}
                />
              </div>

              <div>
                <label className={`block uppercase font-bold mb-1.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Contact Name</label>
                <input
                  type="text"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="Engr. John Doe"
                  className={`w-full px-3.5 py-2.5 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-400 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 shadow-2xs'
                  }`}
                />
              </div>

              <div>
                <label className={`block uppercase font-bold mb-1.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Company / Organization</label>
                <input
                  type="text"
                  value={subCompany}
                  onChange={(e) => setSubCompany(e.target.value)}
                  placeholder="e.g. Energy Corporation"
                  className={`w-full px-3.5 py-2.5 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-400 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 shadow-2xs'
                  }`}
                />
              </div>

              <div className={`pt-3 flex justify-end space-x-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  type="button"
                  onClick={() => setIsSubscriberModalOpen(false)}
                  className={`px-4 py-2 border rounded-xl font-bold text-xs uppercase transition-colors ${
                    isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 shadow-2xs'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
                >
                  Save Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCampaigns;
