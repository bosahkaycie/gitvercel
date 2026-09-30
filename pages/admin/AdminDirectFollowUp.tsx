import React, { useState, useEffect, useRef } from 'react';
import {
  DirectFollowUpEmail,
  ContactInquiry,
  VendorApplication,
  EmailSubscriber
} from '../../types';
import {
  IconMail,
  IconSend,
  IconUsers,
  IconCheck,
  IconSearch,
  IconTrash,
  IconExternal,
  IconArrowRight,
  IconChevronRight
} from '../../components/admin/AdminIcons';
import LogoDarkImg from '../../assets/LOGO.png';

interface AdminDirectFollowUpProps {
  followUps: DirectFollowUpEmail[];
  inquiries: ContactInquiry[];
  vendors: VendorApplication[];
  subscribers: EmailSubscriber[];
  loading?: boolean;
  onSendFollowUp: (payload: {
    recipient_email: string;
    recipient_name?: string;
    recipient_company?: string;
    bcc_recipients?: string;
    bcc_list?: string[];
    subject: string;
    body: string;
    inquiry_id?: string;
    vendor_id?: string;
    template_used?: string;
    recipients_count?: number;
    recipients_list?: string[];
  }) => Promise<{ success: boolean; error?: string }>;
  theme?: 'light' | 'dark';
}

const DEFAULT_FOLLOWUP_TEMPLATES = [
  {
    id: 'rfp_consultation',
    name: 'RFP & Engineering Consultation Follow-Up',
    subject: 'Polaris Integrated & GeoSolutions: Technical Scoping for Your Inquiry',
    content: `<div style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <div style="background-color: #022c22; padding: 24px; text-align: center; border-bottom: 4px solid #10b981;">
    <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">Polaris Integrated & GeoSolutions Limited</h2>
    <p style="color: #6ee7b7; margin: 4px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase;">Engineering Intelligence • Subsurface Characterisation • Field Execution</p>
  </div>
  <div style="padding: 28px 24px; background-color: #ffffff;">
    <p style="font-size: 15px; color: #334155; margin-top: 0;">Dear Esteemed Client / Partner,</p>
    <p style="font-size: 14px; color: #475569;">Thank you for contacting the engineering desks at <strong>Polaris Integrated & GeoSolutions Limited (PIGL)</strong> regarding your upcoming project scope.</p>
    <p style="font-size: 14px; color: #475569;">Our technical directors have reviewed your operational parameters. We are fully equipped to deploy our specialized <strong>20-Ton Hydraulic CPT units</strong>, <strong>Leica RTC360 3D reality capture scanners</strong>, and certified field teams across your project corridor.</p>
    <div style="background-color: #f8fafc; border-left: 4px solid #059669; padding: 14px 16px; margin: 20px 0; border-radius: 0 6px 6px 0;">
      <p style="margin: 0; font-size: 13px; font-weight: 600; color: #0f172a;">Next Technical Milestone:</p>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">We would appreciate scheduling a 15-minute scoping call or technical briefing with your engineering lead to finalize geotechnical specifications.</p>
    </div>
    <div style="text-align: center; margin: 28px 0 16px 0;">
      <a href="https://polarisigl.com/contact" style="background-color: #059669; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 13px; display: inline-block;">Confirm Technical Scoping Call</a>
    </div>
    <p style="font-size: 13px; color: #64748b; margin-top: 24px;">Warm regards,<br><strong style="color: #0f172a;">Engr. Chigozie Bosah</strong><br>Managing Director, PIGL<br><span style="font-size: 12px; color: #94a3b8;">Port Harcourt Desk: +234 803 708 1904</span></p>
  </div>
  <div style="background-color: #f1f5f9; padding: 14px 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
    &copy; 2026 Polaris Integrated & GeoSolutions Limited. ISO 9001:2015 & ISO 45001:2018 Certified.
  </div>
</div>`
  },
  {
    id: 'vendor_verification',
    name: 'Vendor Qualification & Tax Verification',
    subject: 'PIGL Vendor Onboarding (Form VOTC/037): Compliance Status Update',
    content: `<div style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <div style="background-color: #0f172a; padding: 22px; text-align: center; border-bottom: 4px solid #f59e0b;">
    <h2 style="color: #ffffff; margin: 0; font-size: 19px; font-weight: 700;">Polaris Integrated & GeoSolutions Limited</h2>
    <p style="color: #fbbf24; margin: 4px 0 0 0; font-size: 11px; font-weight: 700; text-transform: uppercase;">Procurement & Subcontractor Compliance Desk</p>
  </div>
  <div style="padding: 26px 22px; background-color: #ffffff;">
    <p style="font-size: 14px; color: #334155; margin-top: 0;">Dear Subcontractor / Supply Partner,</p>
    <p style="font-size: 14px; color: #475569;">This is an official communication regarding your company onboarding profile under <strong>Form PIGL/F/VOTC/AHR/037 (Rev 00)</strong>.</p>
    <p style="font-size: 14px; color: #475569;">To ensure compliance with Nigerian tax regulations and PIGL Tier-1 procurement standards, please confirm that your statutory documents (TIN Validation, VAT Certificate, and Active NUBAN Bank Details) are current.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="https://polarisigl.com/vendors/portal" style="background-color: #f59e0b; color: #0f172a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 800; font-size: 13px; display: inline-block;">Access Vendor Compliance Portal</a>
    </div>
    <p style="font-size: 13px; color: #64748b;">Sincerely,<br><strong style="color: #0f172a;">PIGL Procurement & Finance Team</strong><br>Port Harcourt, Rivers State, Nigeria</p>
  </div>
</div>`
  },
  {
    id: 'general_announcement',
    name: 'Corporate Engineering Update / Announcement',
    subject: 'PIGL Technical Milestone: Enhanced Marine & Geotechnical Capacity',
    content: `<div style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
  <div style="background-color: #064e3b; padding: 24px; text-align: center; border-bottom: 4px solid #34d399;">
    <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">Polaris Integrated & GeoSolutions</h2>
    <p style="color: #a7f3d0; margin: 4px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase;">Technical Milestone & Capacity Briefing</p>
  </div>
  <div style="padding: 28px 24px; background-color: #ffffff;">
    <h3 style="color: #064e3b; margin-top: 0; font-size: 17px; font-weight: 700;">Delivering High-Assurance Field Execution Across Nigeria</h3>
    <p style="font-size: 14px; color: #475569;">We are pleased to inform our clients and industry partners of our expanded field fleet capabilities, including amphibious swamp pontoon drilling rigs and real-time oceanographic metocean buoys.</p>
    <ul style="font-size: 13px; color: #334155; padding-left: 20px;">
      <li style="margin-bottom: 8px;"><strong>In-Situ 20T CPT:</strong> Continuous soil resistance profiling to 30m+ depth.</li>
      <li style="margin-bottom: 8px;"><strong>3D Digital Twins:</strong> Sub-centimeter point clouds for brownfield revamp.</li>
      <li style="margin-bottom: 8px;"><strong>HSSEQ Excellence:</strong> Zero LTI over 500,000+ safe project hours.</li>
    </ul>
    <div style="text-align: center; margin: 24px 0 8px 0;">
      <a href="https://polarisigl.com/services" style="background-color: #064e3b; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 13px; display: inline-block;">Explore Capabilities</a>
    </div>
  </div>
</div>`
  }
];

const AdminDirectFollowUp: React.FC<AdminDirectFollowUpProps> = ({
  followUps = [],
  inquiries = [],
  vendors = [],
  subscribers = [],
  loading = false,
  onSendFollowUp,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';

  // Form State (Clean Blank Slate - No Pre-population)
  const [recipientInput, setRecipientInput] = useState('');
  const [recipientsList, setRecipientsList] = useState<string[]>([]);
  const [bccInput, setBccInput] = useState('');
  const [bccList, setBccList] = useState<string[]>([]);
  const [showBccField, setShowBccField] = useState(false);
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [quickSelectFilter, setQuickSelectFilter] = useState<'all' | 'inquiries' | 'vendors' | 'subscribers'>('all');
  const [searchRecipientQuery, setSearchRecipientQuery] = useState('');
  
  // UI Status
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');

  const editorRef = useRef<HTMLDivElement>(null);

  // Sync visual editor content on editorMode change
  useEffect(() => {
    if (editorMode === 'visual' && editorRef.current) {
      editorRef.current.innerHTML = emailBody;
    }
  }, [editorMode]);

  const handleApplyTemplate = (templateId: string) => {
    if (!templateId || selectedTemplate === templateId) {
      // Toggle / Reset to blank canvas
      setSelectedTemplate('');
      setSubject('');
      setEmailBody('');
      if (editorRef.current && editorMode === 'visual') {
        editorRef.current.innerHTML = '';
      }
      return;
    }

    const tpl = DEFAULT_FOLLOWUP_TEMPLATES.find(t => t.id === templateId);
    if (tpl) {
      setSelectedTemplate(templateId);
      setSubject(tpl.subject);
      setEmailBody(tpl.content);
      if (editorRef.current && editorMode === 'visual') {
        editorRef.current.innerHTML = tpl.content;
      }
    }
  };

  // Add recipient handler
  const handleAddRecipient = (emailToAdd: string) => {
    const cleaned = emailToAdd.trim().toLowerCase();
    if (!cleaned) return;

    // Check if comma or space separated list was pasted
    const parts = cleaned.split(/[\s,;]+/).filter(e => e.includes('@') && e.includes('.'));
    if (parts.length > 0) {
      setRecipientsList(prev => {
        const set = new Set([...prev, ...parts]);
        return Array.from(set);
      });
      setRecipientInput('');
      return;
    }

    if (cleaned.includes('@') && cleaned.includes('.') && !recipientsList.includes(cleaned)) {
      setRecipientsList(prev => [...prev, cleaned]);
      setRecipientInput('');
    }
  };

  const handleRemoveRecipient = (emailToRemove: string) => {
    setRecipientsList(prev => prev.filter(e => e !== emailToRemove));
  };

  const handleKeyDownRecipientInput = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
      e.preventDefault();
      handleAddRecipient(recipientInput);
    }
  };

  // Add BCC recipient handler
  const handleAddBcc = (emailToAdd: string) => {
    const cleaned = emailToAdd.trim().toLowerCase();
    if (!cleaned) return;

    const parts = cleaned.split(/[\s,;]+/).filter(e => e.includes('@') && e.includes('.'));
    if (parts.length > 0) {
      setBccList(prev => {
        const set = new Set([...prev, ...parts]);
        return Array.from(set);
      });
      setBccInput('');
      return;
    }

    if (cleaned.includes('@') && cleaned.includes('.') && !bccList.includes(cleaned)) {
      setBccList(prev => [...prev, cleaned]);
      setBccInput('');
    }
  };

  const handleRemoveBcc = (emailToRemove: string) => {
    setBccList(prev => prev.filter(e => e !== emailToRemove));
  };

  const handleKeyDownBccInput = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
      e.preventDefault();
      handleAddBcc(bccInput);
    }
  };

  // Rich text formatting execution
  const executeFormatting = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setEmailBody(editorRef.current.innerHTML);
    }
  };

  const handleInsertButton = () => {
    const text = prompt('Enter button text:', 'Explore Capabilities');
    const url = prompt('Enter button link URL:', 'https://polarisigl.com/services');
    if (text && url) {
      const btnHtml = `<div style="text-align: center; margin: 20px 0;"><a href="${url}" style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 13px; display: inline-block;">${text}</a></div>`;
      document.execCommand('insertHTML', false, btnHtml);
      if (editorRef.current) {
        setEmailBody(editorRef.current.innerHTML);
      }
    }
  };

  const handleVisualEditorInput = () => {
    if (editorRef.current) {
      setEmailBody(editorRef.current.innerHTML);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // If recipientInput has text, add it
    if (recipientInput.trim()) {
      handleAddRecipient(recipientInput);
    }

    // If bccInput has text, add it
    if (bccInput.trim()) {
      handleAddBcc(bccInput);
    }

    const allRecipients = recipientsList.length > 0 
      ? recipientsList 
      : recipientInput.trim() ? [recipientInput.trim().toLowerCase()] : [];

    const allBcc = bccList.length > 0
      ? bccList
      : bccInput.trim() ? [bccInput.trim().toLowerCase()] : [];

    if (allRecipients.length === 0) {
      setStatusMessage({ type: 'error', text: 'Please add at least one valid recipient email address.' });
      return;
    }

    if (!subject.trim()) {
      setStatusMessage({ type: 'error', text: 'Please provide an email subject.' });
      return;
    }

    if (!emailBody.trim()) {
      setStatusMessage({ type: 'error', text: 'Email content body cannot be empty.' });
      return;
    }

    setSending(true);

    const primaryRecipient = allRecipients[0];
    const payload = {
      recipient_email: primaryRecipient,
      recipient_name: allRecipients.length > 1 ? `${allRecipients.length} Selected Recipients` : primaryRecipient.split('@')[0],
      bcc_recipients: allBcc.join(', '),
      bcc_list: allBcc,
      subject: subject.trim(),
      body: emailBody,
      template_used: selectedTemplate,
      recipients_count: allRecipients.length,
      recipients_list: allRecipients
    };

    const res = await onSendFollowUp(payload);
    setSending(false);

    if (res.success) {
      const bccNotice = allBcc.length > 0 ? ` (BCC: ${allBcc.length} recipient${allBcc.length > 1 ? 's' : ''})` : '';
      setStatusMessage({
        type: 'success',
        text: `Email successfully dispatched to ${allRecipients.length} primary recipient${allRecipients.length > 1 ? 's' : ''}${bccNotice}!`
      });
      // Reset or keep template
      setRecipientsList([]);
      setRecipientInput('');
      setBccList([]);
      setBccInput('');
      setTimeout(() => setStatusMessage(null), 5000);
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to dispatch email.' });
    }
  };

  // Contacts for quick selection safely initialized
  const quickContacts = [
    ...(inquiries || []).map(i => ({ email: i.email || '', name: i.name || '', type: 'Inquiry Client', source: 'Inquiry' })),
    ...(vendors || []).map(v => ({ email: v.email || '', name: v.vendor_legal_name || (v as any).company_name || '', type: 'Vendor Partner', source: 'Vendor' })),
    ...(subscribers || []).map(s => ({ email: s.email || '', name: s.email ? s.email.split('@')[0] : '', type: 'Newsletter Subscriber', source: 'Subscriber' }))
  ].filter((c, idx, self) => c.email && self.findIndex(t => t.email.toLowerCase() === c.email.toLowerCase()) === idx);

  const filteredQuickContacts = quickContacts.filter(c => {
    const nameStr = c.name || '';
    const emailStr = c.email || '';
    const q = (searchRecipientQuery || '').toLowerCase();
    const matchesSearch = nameStr.toLowerCase().includes(q) || emailStr.toLowerCase().includes(q);
    if (quickSelectFilter === 'inquiries') return matchesSearch && c.source === 'Inquiry';
    if (quickSelectFilter === 'vendors') return matchesSearch && c.source === 'Vendor';
    if (quickSelectFilter === 'subscribers') return matchesSearch && c.source === 'Subscriber';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl border ${
              isDark ? 'bg-emerald-950/80 border-emerald-800/60 text-emerald-400' : 'bg-emerald-100 border-emerald-300/60 text-emerald-900'
            }`}>
              <IconMail className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Follow Up and Broadcast</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${
                  isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' : 'bg-emerald-100 text-emerald-900 border-emerald-300/60'
                }`}>
                  Full Page Mode
                </span>
              </div>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Compose rich HTML-formatted corporate follow-ups, paste raw HTML templates, and dispatch to single or multiple recipients with live preview.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className={`flex items-center space-x-2 p-1.5 rounded-xl border ${
            isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setActiveTab('compose')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'compose'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Compose & Live Editor
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'history'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Dispatch History</span>
              {(followUps || []).length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isDark ? 'bg-slate-800 text-emerald-300' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {followUps.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {statusMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-[99999] max-w-md w-[calc(100vw-3rem)] sm:w-auto animate-fade-in pointer-events-auto"
        >
          <div className={`flex items-start p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all ${
            statusMessage.type === 'success'
              ? 'bg-slate-900/95 text-white border-emerald-500/50 shadow-emerald-950/50'
              : 'bg-slate-900/95 text-white border-rose-500/50 shadow-rose-950/50'
          }`}>
            <div className={`p-2 rounded-xl mr-3.5 shrink-0 ${
              statusMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {statusMessage.type === 'success' ? (
                <IconCheck className="w-5 h-5" />
              ) : (
                <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-[220px] mr-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
                {statusMessage.type === 'success' ? 'Email Sent' : 'Delivery Notice'}
              </p>
              <p className="text-sm font-medium text-slate-200 leading-snug">
                {statusMessage.text}
              </p>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
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

      {/* Main Tab Views */}
      {activeTab === 'compose' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column: Form & Editor */}
          <div className="xl:col-span-7 space-y-6">
            <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}>
              <form onSubmit={handleSend} className="space-y-6">
                             {/* Preset Template Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                      Corporate Template Preset
                    </label>
                    <span className={`text-[11px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>1-Click Apply</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {DEFAULT_FOLLOWUP_TEMPLATES.map(tpl => {
                      const isSelected = selectedTemplate === tpl.id;
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => handleApplyTemplate(tpl.id)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between group ${
                            isSelected
                              ? isDark
                                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md ring-1 ring-emerald-500/40'
                                : 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md ring-2 ring-emerald-600/30 font-bold'
                              : isDark
                                ? 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-900/60'
                                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1.5 mb-1">
                            <strong className={`block font-bold truncate ${
                              isSelected
                                ? isDark ? 'text-emerald-300' : 'text-emerald-950'
                                : isDark ? 'text-slate-200 group-hover:text-white' : 'text-slate-900 group-hover:text-emerald-900'
                            }`}>
                              {tpl.name}
                            </strong>
                            <div className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                              isSelected
                                ? isDark ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white'
                                : isDark
                                  ? 'bg-slate-800 text-emerald-400 group-hover:bg-emerald-500/30'
                                  : 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200'
                            }`}>
                              <IconArrowRight className="w-2.5 h-2.5" />
                            </div>
                          </div>
                          <span className={`text-[10px] block truncate font-mono ${
                            isSelected
                              ? isDark ? 'text-emerald-400/90' : 'text-emerald-800 font-semibold'
                              : isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {tpl.subject}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Multiple Recipients Input & Tag Pills */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                      Recipients (Single or Multiple) *
                    </label>
                    <span className={`text-[11px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                      {recipientsList.length} recipient{recipientsList.length !== 1 ? 's' : ''} added
                    </span>
                  </div>

                  {/* Recipient Pills */}
                  {recipientsList.length > 0 && (
                    <div className={`flex flex-wrap gap-1.5 mb-2.5 p-2 rounded-xl border max-h-28 overflow-y-auto no-scrollbar ${
                      isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                    }`}>
                      {recipientsList.map((recEmail, idx) => (
                        <span
                          key={idx}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                            isDark 
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80' 
                              : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          }`}
                        >
                          <span>{recEmail}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRecipient(recEmail)}
                            className={isDark ? 'text-emerald-400 hover:text-white p-0.5' : 'text-emerald-800 hover:text-red-600 p-0.5'}
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                      <button
                        type="button"
                        onClick={() => setRecipientsList([])}
                        className={`text-[10px] font-bold px-2 py-1 ${isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-600 hover:text-red-600'}`}
                      >
                        Clear All
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={recipientInput}
                      onChange={(e) => setRecipientInput(e.target.value)}
                      onKeyDown={handleKeyDownRecipientInput}
                      placeholder="Type or paste emails separated by commas or enter..."
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                        isDark 
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                          : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddRecipient(recipientInput)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-colors shrink-0 ${
                        isDark 
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      }`}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* BCC (Blind Carbon Copy) Recipients Section */}
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-amber-50/40 border-amber-200/80'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-amber-950'}`}>
                        BCC Recipients (Blind Carbon Copy)
                      </label>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Private Copy
                      </span>
                    </div>
                    <span className={`text-[11px] font-mono ${isDark ? 'text-slate-500' : 'text-amber-900/80'}`}>
                      {bccList.length} BCC added
                    </span>
                  </div>

                  {/* BCC Pills */}
                  {bccList.length > 0 && (
                    <div className={`flex flex-wrap gap-1.5 mb-2.5 p-2 rounded-xl border max-h-24 overflow-y-auto no-scrollbar ${
                      isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-white border-amber-200'
                    }`}>
                      {bccList.map((bccEmail, idx) => (
                        <span
                          key={idx}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                            isDark 
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80' 
                              : 'bg-amber-100 text-amber-950 border border-amber-300'
                          }`}
                        >
                          <span>{bccEmail}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBcc(bccEmail)}
                            className={isDark ? 'text-amber-400 hover:text-white p-0.5' : 'text-amber-800 hover:text-red-600 p-0.5'}
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                      <button
                        type="button"
                        onClick={() => setBccList([])}
                        className={`text-[10px] font-bold px-2 py-1 ${isDark ? 'text-slate-400 hover:text-red-400' : 'text-amber-800 hover:text-red-600'}`}
                      >
                        Clear All
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={bccInput}
                      onChange={(e) => setBccInput(e.target.value)}
                      onKeyDown={handleKeyDownBccInput}
                      placeholder="e.g. leadership@polarisigl.com, audit@polarisigl.com..."
                      className={`flex-1 px-4 py-2 rounded-xl text-xs border focus:outline-none transition-colors ${
                        isDark 
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' 
                          : 'bg-white border-slate-300 text-slate-900 focus:border-amber-600'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddBcc(bccInput)}
                      className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-sm"
                    >
                      + Add BCC
                    </button>
                  </div>
                </div>

                {/* Subject Line */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    Email Subject Line *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Polaris Integrated & GeoSolutions: Technical Scoping Proposal"
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                        : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600'
                    }`}
                  />
                </div>

                {/* Editor Mode Header Toolbar */}
                <div>
                  <div className={`flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    <div className={`flex items-center space-x-1 p-1 rounded-xl border ${
                      isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditorMode('visual');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          editorMode === 'visual'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Visual Formatter
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (editorMode === 'visual' && editorRef.current) {
                            setEmailBody(editorRef.current.innerHTML);
                          }
                          setEditorMode('html');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                          editorMode === 'html'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>Paste Raw HTML</span>
                      </button>
                    </div>

                    {/* Rich text tools (only in visual mode) */}
                    {editorMode === 'visual' && (
                      <div className="flex flex-wrap items-center gap-1">
                        <button
                          type="button"
                          onClick={() => executeFormatting('bold')}
                          title="Bold (Ctrl+B)"
                          className={`px-2 py-1 rounded text-xs font-bold border ${
                            isDark 
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                              : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
                          }`}
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => executeFormatting('italic')}
                          title="Italic (Ctrl+I)"
                          className={`px-2 py-1 rounded text-xs italic font-serif border ${
                            isDark 
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                              : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
                          }`}
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() => executeFormatting('underline')}
                          title="Underline (Ctrl+U)"
                          className={`px-2 py-1 rounded text-xs underline border ${
                            isDark 
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                              : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
                          }`}
                        >
                          U
                        </button>
                        <button
                          type="button"
                          onClick={() => executeFormatting('insertUnorderedList')}
                          title="Bullet List"
                          className={`px-2 py-1 rounded text-xs border ${
                            isDark 
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                              : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
                          }`}
                        >
                          • List
                        </button>
                        <button
                          type="button"
                          onClick={handleInsertButton}
                          title="Insert Action Button"
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center space-x-1 shadow-sm"
                        >
                          <span>+ Button CTA</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Visual vs Raw HTML Editor Area */}
                  {editorMode === 'visual' ? (
                    <div
                      ref={editorRef}
                      contentEditable
                      onInput={handleVisualEditorInput}
                      className={`min-h-[300px] p-4 rounded-xl text-sm border focus:outline-none overflow-y-auto leading-relaxed ${
                        isDark 
                          ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500' 
                          : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600 shadow-sm'
                      }`}
                      style={{ whiteSpace: 'pre-wrap' }}
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className={`flex items-center justify-between px-3.5 py-2 rounded-t-xl border-x border-t text-[11px] font-mono ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-700'
                      }`}>
                        <span className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Raw HTML Source Code Editor</span>
                        </span>
                        <span>{emailBody.length} characters • Visualized on the right</span>
                      </div>
                      <textarea
                        rows={18}
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="<!-- Paste your raw HTML email template code here -->&#10;<div style='font-family: Arial, sans-serif; color: #1e293b; padding: 24px;'>&#10;  <h2 style='color: #059669;'>Polaris Integrated &amp; GeoSolutions</h2>&#10;  <p>Your HTML email message body...</p>&#10;</div>"
                        className={`w-full font-mono text-xs p-4 rounded-b-xl border focus:outline-none focus:ring-1 leading-relaxed shadow-inner ${
                          isDark 
                            ? 'bg-slate-950 border-slate-800 text-emerald-400 focus:border-emerald-500 focus:ring-emerald-500' 
                            : 'bg-slate-900 border-slate-800 text-emerald-400 focus:border-emerald-600 focus:ring-emerald-600'
                        }`}
                        spellCheck={false}
                      />
                      <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Paste and edit raw HTML email markup with inline CSS. All edits render live in the right email visualizer.
                      </p>
                    </div>
                  )}
                </div>

                {/* Dispatch Button */}
                <div className={`pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <div className={`text-xs flex items-center space-x-2 ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Direct SMTP Dispatch Engine</span>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
                  >
                    {sending ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Dispatching Email...</span>
                      </>
                    ) : (
                      <>
                        <IconSend className="w-4 h-4" />
                        <span>
                          Dispatch Follow-Up {recipientsList.length > 0 ? `(${recipientsList.length})` : ''}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Live HTML Viewer & Quick Add Contacts */}
          <div className="xl:col-span-5 space-y-6">
            
            {/* Live HTML Viewer */}
            <div className={`p-6 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}>
              <div className={`flex items-center justify-between mb-4 pb-3 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Live HTML Email Viewer
                  </h2>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                }`}>
                  Email Visualizer
                </span>
              </div>

              {/* Live HTML Email Frame */}
              <div className="bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 min-h-[420px] max-h-[600px] overflow-y-auto no-scrollbar shadow-inner flex flex-col justify-center">
                {emailBody && emailBody.trim().length > 0 ? (
                  <div 
                    className="email-preview-container bg-white rounded-lg shadow-sm p-5 text-slate-900"
                    dangerouslySetInnerHTML={{ __html: emailBody }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-10 space-y-3 my-auto">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <IconSend className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Live Email Visualizer</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                        Start composing in the visual editor or paste raw HTML. Your custom email design will render live here as you create it.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Contacts Directory */}
            <div className={`p-6 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  Quick-Add Recipients from Database
                </h3>
                <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{quickContacts.length} Contacts</span>
              </div>

              {/* Filter pills & search */}
              <div className="space-y-2 mb-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchRecipientQuery}
                    onChange={(e) => setSearchRecipientQuery(e.target.value)}
                    placeholder="Search name or email..."
                    className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                        : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600 shadow-sm'
                    }`}
                  />
                  <IconSearch className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                </div>

                <div className="flex items-center space-x-1 text-[10px]">
                  {(['all', 'inquiries', 'vendors', 'subscribers'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setQuickSelectFilter(f)}
                      className={`px-2.5 py-1 rounded-lg capitalize font-bold transition-colors ${
                        quickSelectFilter === f 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : isDark 
                            ? 'bg-slate-800 text-slate-400 hover:text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1.5 no-scrollbar">
                {filteredQuickContacts.slice(0, 15).map((contact, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                      recipientsList.includes(contact.email.toLowerCase())
                        ? isDark ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : isDark ? 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="overflow-hidden mr-2">
                      <strong className={`block font-bold truncate ${
                        isDark ? 'text-slate-200' : 'text-slate-900'
                      }`}>
                        {contact.name}
                      </strong>
                      <span className={`text-[11px] font-mono truncate block ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {contact.email}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">{contact.type}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (recipientsList.includes(contact.email.toLowerCase())) {
                          handleRemoveRecipient(contact.email.toLowerCase());
                        } else {
                          handleAddRecipient(contact.email.toLowerCase());
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                        recipientsList.includes(contact.email.toLowerCase())
                          ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      }`}
                    >
                      {recipientsList.includes(contact.email.toLowerCase()) ? 'Remove' : '+ Add'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* History View */
        <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between mb-6 pb-4 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div>
              <h2 className="text-lg font-bold">Follow Up and Broadcast Log</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Chronological ledger of dispatched one-to-one and multi-recipient communications
              </p>
            </div>
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-lg ${
              isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}>
              Total Dispatches: {(followUps || []).length}
            </span>
          </div>

          {followUps.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <IconMail className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
              <p className="text-sm">No direct follow-ups or broadcasts logged yet.</p>
              <button
                onClick={() => setActiveTab('compose')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Compose First Follow-Up
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {followUps.map(f => (
                <div
                  key={f.id}
                  className={`p-5 rounded-xl border transition-all ${
                    isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {f.status || 'sent'}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-white">{f.subject}</h3>
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      {new Date(f.sent_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-3">
                    <span>Recipient: <strong className="text-slate-200 font-mono">{f.recipient_email}</strong></span>
                    {f.recipient_name && <span>Name: <strong className="text-slate-200">{f.recipient_name}</strong></span>}
                    {f.bcc_recipients && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 font-mono text-[11px]">
                        <span>BCC:</span>
                        <strong>{f.bcc_recipients}</strong>
                      </span>
                    )}
                    {f.template_used && <span>Template: <strong className="text-emerald-400">{f.template_used}</strong></span>}
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 font-mono max-h-32 overflow-y-auto border border-slate-800">
                    <div dangerouslySetInnerHTML={{ __html: f.body }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDirectFollowUp;
