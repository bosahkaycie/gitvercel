import React, { useState, useEffect } from 'react';
import { Campaign, CampaignForm } from '../types/campaign';
import { getCampaignBySlug, submitCampaignForm } from '../lib/campaignApi';
import LogoImg from '../assets/LOGO.png';

interface PublicCampaignProps {
  currentPath: string;
}

interface DivisionCardOption {
  id: string;
  title: string;
  description: string;
}

const PIGL_DIVISIONS: DivisionCardOption[] = [
  {
    id: 'geosolutions',
    title: 'Geosolutions & Engineering',
    description: 'CPT sounding, geotechnical drilling, soil mechanics & 3D reality capture'
  },
  {
    id: 'metocean',
    title: 'Metocean & Marine Solutions',
    description: 'Hydrographic surveying, oceanographic modeling, bathymetry & sub-bottom profiling'
  },
  {
    id: 'construction',
    title: 'Integrated Construction',
    description: 'Swamp pipeline construction, structural fabrication, piling & civil works'
  },
  {
    id: 'industrial',
    title: 'Industrial Solutions',
    description: 'Cathodic protection, NDT asset integrity testing & maintenance operations'
  }
];

export const PublicCampaign: React.FC<PublicCampaignProps> = ({ currentPath }) => {
  // Extract slug from /campaigns/:slug
  const slug = currentPath.replace(/^\/campaigns\/?/, '').split('/')[0] || '';

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [form, setForm] = useState<CampaignForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form submission state
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    company: string;
    jobTitle: string;
    divisions: string[];
    customScope: string;
    consent: boolean;
  }>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    divisions: [],
    customScope: '',
    consent: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Detect collection source: check URL query params for ?source=qr
  const [source, setSource] = useState<'qr_code' | 'direct_link'>('direct_link');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('source') === 'qr' || params.get('ref') === 'qr') {
        setSource('qr_code');
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadCampaign() {
      setLoading(true);
      setError(null);
      try {
        const res = await getCampaignBySlug(slug);
        if (isMounted) {
          setCampaign(res.campaign);
          setForm(res.form);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'The requested campaign could not be loaded.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (slug) {
      loadCampaign();
    } else {
      setError('No campaign specified.');
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleDivisionToggle = (title: string) => {
    setFormData(prev => {
      const exists = prev.divisions.includes(title);
      const next = exists
        ? prev.divisions.filter(d => d !== title)
        : [...prev.divisions, title];
      return { ...prev, divisions: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    if (!formData.fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Please provide a valid corporate or official email address.');
      return;
    }

    if (!formData.consent) {
      setFormError('Please confirm your consent to allow PIGL to follow up with your inquiry.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const payload = {
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      job_title: formData.jobTitle.trim(),
      service_divisions: formData.divisions,
      custom_inquiry_scope: formData.customScope.trim(),
      f_full_name: formData.fullName.trim(),
      f_email: formData.email.trim(),
      f_phone: formData.phone.trim(),
      f_company: formData.company.trim(),
      f_job_title: formData.jobTitle.trim(),
      f_divisions: formData.divisions,
      f_custom_scope: formData.customScope.trim()
    };

    try {
      const res = await submitCampaignForm({
        campaignId: campaign.id,
        formId: form?.id || campaign.assignedFormId || `form-${campaign.id}`,
        source,
        formData: payload,
        consentGiven: true
      });

      if (res.success) {
        setSubmissionId(res.submissionId);
        setSubmitSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setFormError(res.error || 'Submission failed. Please check your network and try again.');
      }
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // Loading State (Pure Light Theme)
  // -------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-10 h-10 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Loading Official PIGL Visitor Portal...
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Error / Unavailable State (Pure Light Theme)
  // -------------------------------------------------------------
  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center">
          <img src={LogoImg} alt="PIGL" className="h-10 mx-auto mb-5 object-contain" />
          <h1 className="text-lg font-bold text-slate-900 mb-2">Campaign Portal Unavailable</h1>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            {error || 'The requested event engagement campaign does not exist or has concluded.'}
          </p>
          <a
            href="/"
            className="inline-block px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs"
          >
            Visit PIGL Corporate Website
          </a>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Inactive / Paused / Draft State (Pure Light Theme)
  // -------------------------------------------------------------
  if (campaign.status !== 'active') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 sm:p-10 rounded-2xl shadow-sm text-center">
          <img src={LogoImg} alt="PIGL" className="h-10 mx-auto mb-6 object-contain" />
          <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 rounded-full border border-slate-200 mb-3">
            {campaign.eventName || campaign.name}
          </span>
          <h1 className="text-xl font-bold text-slate-900 mb-2">{campaign.name}</h1>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            {campaign.status === 'paused'
              ? 'Submissions for this event are temporarily paused. Please check back shortly or connect with our technical directors directly.'
              : campaign.status === 'closed'
              ? 'This event engagement has formally concluded. Thank you to all delegates who visited our exhibition stand.'
              : 'This event campaign is currently in preparation and will open to attendees shortly.'}
          </p>
          <a
            href="/"
            className="inline-block px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs"
          >
            Explore PIGL Engineering Services
          </a>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Success Confirmation Screen (Pure Light Theme)
  // -------------------------------------------------------------
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-lg w-full bg-white border border-slate-200 p-8 sm:p-12 rounded-2xl shadow-sm relative text-center">
          {/* Brand Logo */}
          <img src={LogoImg} alt="PIGL" className="h-10 mx-auto mb-6 object-contain" />

          {/* Success Check Pill */}
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✓
          </div>

          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
            Reference ID: {submissionId || 'PIGL-DELEGATE'}
          </span>

          <h1 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
            Thank You for Connecting!
          </h1>

          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            {campaign.confirmationMessage ||
              'Your details have been securely recorded. Our technical leadership team will review your inquiry and follow up with technical documentation.'}
          </p>

          {/* Event Context Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-left text-slate-600 space-y-1.5 mb-6">
            <p className="font-semibold text-slate-900">Engagement Record:</p>
            <p>&bull; Event: <strong className="text-slate-800">{campaign.eventName}</strong></p>
            {campaign.eventLocation && (
              <p>&bull; Venue: <strong className="text-slate-800">{campaign.eventLocation}</strong></p>
            )}
            <p>&bull; An official acknowledgement has been queued for: <strong className="text-slate-800">{formData.email}</strong></p>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/assets/PIGL COMPANY PROFILE.pdf"
              download="PIGL_Company_Profile.pdf"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              Download PIGL Profile (PDF)
            </a>
            <a
              href="/"
              className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center"
            >
              Explore PIGL Services
            </a>
          </div>

          <p className="text-[11px] text-slate-400 mt-8">
            Need urgent assistance? Contact our Business Development office at{' '}
            <a href="mailto:bd@polarisigl.com" className="text-slate-900 font-medium underline">
              bd@polarisigl.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Main Visitor Form (Straightforward, Light Theme)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Pristine Light Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <a href="/" className="inline-block" title="Polaris Integrated & GeoSolutions Limited">
            <img src={LogoImg} alt="PIGL Logo" className="h-9 sm:h-10 w-auto object-contain" />
          </a>

          <div className="text-right">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
              {campaign.eventName || 'PIGL Event Intake'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Intro Card */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Connect with PIGL
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            {campaign.introductionText ||
              `Complete this brief form to connect directly with Polaris Integrated & GeoSolutions Limited (PIGL) during ${campaign.eventName || 'the event'}.`}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
              <span className="font-bold">Error:</span> {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Attendee Contact Details */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-100">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  1. Your Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engr. Oladipo Adeleke"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Corporate / Official Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. o.adeleke@energyfirm.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+234 803 000 0000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Company / Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shell, NNPC Ltd, TotalEnergies, Seplat"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Job Designation / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Managing Director, Lead Project Engineer, Asset Manager"
                  value={formData.jobTitle}
                  onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                />
              </div>
            </div>

            {/* 2. Areas of Technical Interest */}
            <div className="space-y-3">
              <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. PIGL Operating Divisions of Interest
                </h2>
                <span className="text-[11px] text-slate-400">Select any that apply</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PIGL_DIVISIONS.map(div => {
                  const isChecked = formData.divisions.includes(div.title);
                  return (
                    <label
                      key={div.id}
                      onClick={() => handleDivisionToggle(div.title)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Handled by container onClick
                        className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900 leading-snug">
                          {div.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {div.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 3. Custom Requirements / Unlisted Inquiries (Spacious Textarea) */}
            <div className="space-y-2">
              <div className="pb-2 border-b border-slate-100">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  3. Custom Technical Inquiries &amp; Scope Requirements
                </h2>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                If you have a specialized requirement, unlisted equipment need, upcoming RFP, or specific project location, describe it below:
              </p>
              <textarea
                rows={3}
                placeholder="e.g. Deepwater autonomous pipeline bathymetry, specialized drone LiDAR survey for swamp terrain, cathodic protection inspection timeline, joint venture collaboration..."
                value={formData.customScope}
                onChange={e => setFormData({ ...formData, customScope: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
              />
            </div>

            {/* 4. Consent and Privacy (NDPA) */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                />
                <span className="text-xs text-slate-500 leading-relaxed">
                  I consent to Polaris Integrated &amp; GeoSolutions Limited (PIGL) recording my details to follow up with technical documentation, proposals, and industry updates in accordance with the Nigeria Data Protection Act (NDPA).
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Your Details...
                  </>
                ) : (
                  'Submit Details & Connect with PIGL'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Clean Light Footer */}
        <footer className="mt-12 text-center text-xs text-slate-400 space-y-1">
          <p>&copy; {new Date().getFullYear()} Polaris Integrated &amp; GeoSolutions Limited (PIGL).</p>
          <p className="text-slate-500">Corporate Headquarters: Plot 4, Block 113, Admiralty Way, Lekki Phase 1, Lagos</p>
        </footer>
      </main>
    </div>
  );
};

export default PublicCampaign;
