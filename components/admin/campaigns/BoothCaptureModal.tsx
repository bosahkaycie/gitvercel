import React, { useState } from 'react';
import { Campaign, CampaignForm } from '../../../types/campaign';
import { submitCampaignForm } from '../../../lib/campaignApi';
import { IconX, IconCheck } from '../AdminIcons';

interface BoothCaptureModalProps {
  campaign: Campaign;
  form?: CampaignForm | null;
  adminEmail: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface OperatingDivisionOption {
  id: string;
  title: string;
  subtitle: string;
}

const PIGL_DIVISIONS: OperatingDivisionOption[] = [
  {
    id: 'geosolutions',
    title: 'Geosolutions & Engineering',
    subtitle: 'CPT sounding, geotechnical drilling, soil mechanics & 3D reality capture'
  },
  {
    id: 'metocean',
    title: 'Metocean & Marine Solutions',
    subtitle: 'Hydrographic surveying, oceanographic modeling, sub-bottom profiling & bathymetry'
  },
  {
    id: 'construction',
    title: 'Integrated Construction',
    subtitle: 'Swamp pipeline construction, structural fabrication, piling & civil infrastructure'
  },
  {
    id: 'industrial',
    title: 'Industrial Solutions',
    subtitle: 'Cathodic protection, NDT asset integrity testing, maintenance & supply chain support'
  }
];

export const BoothCaptureModal: React.FC<BoothCaptureModalProps> = ({
  campaign,
  form,
  adminEmail,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    company: string;
    jobTitle: string;
    divisions: string[];
    hasCustomInquiry: boolean;
    customInquiryText: string;
    discussionNotes: string;
    followupAction: string;
  }>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    divisions: [],
    hasCustomInquiry: false,
    customInquiryText: '',
    discussionNotes: '',
    followupAction: 'technical_proposal'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [lastSubmissionRef, setLastSubmissionRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDivisionToggle = (divisionTitle: string) => {
    setFormData(prev => {
      const exists = prev.divisions.includes(divisionTitle);
      const next = exists
        ? prev.divisions.filter(d => d !== divisionTitle)
        : [...prev.divisions, divisionTitle];
      return { ...prev, divisions: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter the visitor’s full name.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please provide a valid corporate email address.');
      setIsSubmitting(false);
      return;
    }

    // Prepare unified payload
    const payloadData: Record<string, any> = {
      // Standard friendly names
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      job_title: formData.jobTitle.trim(),
      service_divisions: formData.divisions,
      custom_inquiry_scope: formData.customInquiryText.trim(),
      discussion_notes: formData.discussionNotes.trim(),
      followup_priority: formData.followupAction,
      
      // Legacy prefix compatibility
      f_full_name: formData.fullName.trim(),
      f_email: formData.email.trim(),
      f_phone: formData.phone.trim(),
      f_company: formData.company.trim(),
      f_job_title: formData.jobTitle.trim(),
      f_divisions: formData.divisions,
      f_custom_scope: formData.customInquiryText.trim(),
      f_scope: [
        formData.customInquiryText.trim() ? `[Custom Scope]: ${formData.customInquiryText.trim()}` : '',
        formData.discussionNotes.trim() ? `[Notes]: ${formData.discussionNotes.trim()}` : ''
      ].filter(Boolean).join('\n\n')
    };

    try {
      const res = await submitCampaignForm({
        campaignId: campaign.id,
        formId: form?.id || campaign.assignedFormId,
        source: 'booth_capture',
        formData: payloadData,
        consentGiven: true,
        assignedStaff: adminEmail
      });

      if (res.success) {
        setSuccessMsg(`Visitor successfully registered!`);
        setLastSubmissionRef(res.submissionId);
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg('Failed to record submission. Please check network connection.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForNextVisitor = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      divisions: [],
      hasCustomInquiry: false,
      customInquiryText: '',
      discussionNotes: '',
      followupAction: 'technical_proposal'
    });
    setSuccessMsg(null);
    setLastSubmissionRef(null);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in fade-in duration-200">
        
        {/* Architectural Pure-White Header */}
        <div className="bg-white px-8 pt-8 pb-6 border-b border-slate-100 flex items-start justify-between shrink-0">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                PIGL Exhibition Intake
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                {campaign.name || campaign.eventName || 'Stand Lead Intake'}
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Record Stand Visitor
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Capture attendee credentials, technical areas of interest, and custom scopes directly from the conference floor.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 ml-4"
            aria-label="Close dialog"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto flex-1 p-8 sm:p-10 space-y-9">
          {successMsg ? (
            <div className="py-12 text-center max-w-lg mx-auto space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <IconCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">
                  Lead Successfully Logged
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Attendee information for <strong className="text-slate-900">{formData.fullName}</strong> ({formData.company || 'Private Entity'}) has been securely recorded into the campaign database.
                </p>
                {lastSubmissionRef && (
                  <p className="font-mono text-xs text-slate-500 bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-200 inline-block">
                    Reference ID: {lastSubmissionRef}
                  </p>
                )}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={resetForNextVisitor}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Capture Next Visitor
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} id="booth-capture-form" className="space-y-9">
              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Section 1: Visitor Identity & Corporate Profile */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    1. Visitor Identity &amp; Corporate Role
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Engr. Oladipo Adeleke"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Corporate / Official Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. o.adeleke@seplatenergy.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+234 803 000 0000"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Company / Operating Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Seplat Energy Plc, TotalEnergies, NNPC Ltd"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Job Designation / Executive Function
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Executive Director, Deepwater Projects &amp; Asset Integrity"
                      value={formData.jobTitle}
                      onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Operating Divisions of Interest */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    2. PIGL Operating Divisions of Interest
                  </h3>
                  <span className="text-xs text-slate-400 font-normal">Select all that apply</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PIGL_DIVISIONS.map(div => {
                    const isSelected = formData.divisions.includes(div.title);
                    return (
                      <div
                        key={div.id}
                        onClick={() => handleDivisionToggle(div.title)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-slate-50 border-slate-900 shadow-xs ring-1 ring-slate-900'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Handled by container onClick
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                        />
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold text-slate-900">
                            {div.title}
                          </p>
                          <p className="text-xs text-slate-500 leading-snug">
                            {div.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Custom Inquiries & Unlisted Scopes (User Request) */}
              <div className="space-y-4 bg-slate-50/70 p-6 rounded-2xl border border-slate-200">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      3. Custom Technical Requirements / Unlisted Inquiries
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      If the visitor is inquiring about scopes, specialized equipment, cross-disciplinary tenders, or services not listed in the checkboxes above, type their custom requirements below.
                    </p>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={3}
                    placeholder="Type the visitor's custom request or unlisted scope here (e.g. specialized drone photogrammetry, high-temperature pipeline monitoring, offshore equipment rental, environmental permitting, joint venture collaboration)..."
                    value={formData.customInquiryText}
                    onChange={e => setFormData({ ...formData, customInquiryText: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                  />
                </div>
              </div>

              {/* Section 4: Stand Discussion Notes & Follow-up Commitment */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    4. Stand Discussion Summary &amp; Recommended Action
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Discussion Takeaways &amp; Project Details
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Key conversation notes, upcoming tender deadlines, asset geography (swamp, deepwater, land), budget scope..."
                      value={formData.discussionNotes}
                      onChange={e => setFormData({ ...formData, discussionNotes: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Follow-up Action
                    </label>
                    <select
                      value={formData.followupAction}
                      onChange={e => setFormData({ ...formData, followupAction: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                    >
                      <option value="technical_proposal">Technical Proposal / RFP Review</option>
                      <option value="executive_presentation">Executive In-Person Presentation</option>
                      <option value="dossier_email">Send PIGL Corporate Dossier &amp; Profile</option>
                      <option value="virtual_meeting">Schedule Virtual Meeting (Teams)</option>
                      <option value="networking">General Industry Networking</option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                      Determines pipeline prioritization in the Leads dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Clean Intentional Footer */}
        {!successMsg && (
          <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <div className="text-xs text-slate-500">
              Staff Operator: <strong className="text-slate-800">{adminEmail}</strong>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-slate-200 hover:bg-white text-slate-700 font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="booth-capture-form"
                disabled={isSubmitting}
                className="px-7 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Recording Visitor...' : 'Record Visitor'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
