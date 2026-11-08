import React, { useState, useEffect } from 'react';
import { Campaign, CampaignForm, CampaignFormField } from '../types/campaign';
import { getCampaignBySlug, submitCampaignForm } from '../lib/campaignApi';
import LogoImg from '../assets/LOGO.png';

interface PublicCampaignProps {
  currentPath: string;
}

export const PublicCampaign: React.FC<PublicCampaignProps> = ({ currentPath }) => {
  // Extract slug from /campaigns/:slug
  const slug = currentPath.replace(/^\/campaigns\/?/, '').split('/')[0] || '';

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [form, setForm] = useState<CampaignForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form submission state
  const [formData, setFormData] = useState<Record<string, any>>({});
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

  const activeVersion = form?.versions.find(v => v.versionNumber === form.activeVersion) || form?.versions[0];
  const fields = activeVersion?.fields || [];

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxToggle = (fieldId: string, optionValue: string) => {
    const current = (formData[fieldId] as string[]) || [];
    const next = current.includes(optionValue)
      ? current.filter(v => v !== optionValue)
      : [...current, optionValue];
    setFormData(prev => ({ ...prev, [fieldId]: next }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    setIsSubmitting(true);
    setFormError(null);

    // Validate required fields
    for (const f of fields) {
      if (f.required && f.type !== 'section_heading' && f.type !== 'descriptive_text') {
        const val = formData[f.id];
        if (f.type === 'consent' && !val) {
          setFormError(`Please confirm your agreement to: "${f.label}"`);
          setIsSubmitting(false);
          return;
        }
        if (!val || (Array.isArray(val) && val.length === 0)) {
          setFormError(`Field "${f.label}" is required.`);
          setIsSubmitting(false);
          return;
        }
      }
    }

    try {
      const res = await submitCampaignForm({
        campaignId: campaign.id,
        formId: form?.id || campaign.assignedFormId,
        source,
        formData,
        consentGiven: true
      });

      if (res.success) {
        setSubmissionId(res.submissionId);
        setSubmitSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setFormError('Submission failed. Please check your network and try again.');
      }
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
          Loading Official Engagement Portal...
        </h2>
      </div>
    );
  }

  // Error state / 404
  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <img src={LogoImg} alt="PIGL" className="h-10 mx-auto mb-6 opacity-90" />
          <h1 className="text-xl font-bold text-white mb-2">Campaign Portal Unavailable</h1>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            {error || 'The requested event engagement campaign does not exist or has been relocated.'}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
          >
            Visit PIGL Corporate Website
          </a>
        </div>
      </div>
    );
  }

  // Inactive / Paused / Draft states for public visitors
  if (campaign.status !== 'active') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="max-w-lg bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <img src={LogoImg} alt="PIGL" className="h-10 mx-auto mb-6 opacity-90" />
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 rounded-md border border-slate-700">
            {campaign.eventName}
          </span>
          <h1 className="text-2xl font-bold text-white mt-4 mb-2">{campaign.name}</h1>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            {campaign.status === 'paused'
              ? 'Submissions for this event are temporarily paused. Please check back shortly or contact our technical team directly.'
              : campaign.status === 'closed'
              ? 'This event has formally concluded. Thank you to all delegates and stakeholders who engaged with PIGL.'
              : 'This event campaign is currently in preparation and will open to delegates soon.'}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
          >
            Explore PIGL Engineering Services
          </a>
        </div>
      </div>
    );
  }

  // Success Confirmation Screen (Part 4.3)
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center animate-fadeIn">
        <div className="max-w-lg w-full bg-slate-900 border border-emerald-900/60 p-8 sm:p-10 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-6 text-2xl">
            ✓
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
            Reference: {submissionId}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4 tracking-tight">
            Thank You for Connecting!
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            {campaign.confirmationMessage ||
              'Your details have been securely recorded. Our technical division leads will review your inquiry and connect with you shortly.'}
          </p>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-left text-slate-400 space-y-1 mb-8">
            <p className="font-semibold text-slate-300">Confirmation Summary:</p>
            <p>&bull; Event: <strong className="text-white">{campaign.eventName}</strong></p>
            <p>&bull; Venue: <strong className="text-white">{campaign.eventLocation}</strong></p>
            <p>&bull; An official acknowledgement email has been queued to your corporate address.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg"
            >
              Visit PIGL Corporate Portal
            </a>
            <button
              onClick={() => {
                setSubmitSuccess(false);
                setFormData({});
              }}
              className="px-6 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Public Standalone Form (Part 4.1)
  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-emerald-500 selection:text-white pb-16">
      {/* Focused Header (NO Main Website Nav) */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src={LogoImg} alt="PIGL" className="h-9 w-auto" />
            <div className="border-l border-slate-700 pl-3">
              <span className="text-xs font-bold tracking-tight text-white block uppercase">
                Polaris Integrated &amp; GeoSolutions
              </span>
              <span className="text-[10px] text-emerald-400 font-mono block">
                Official Engagement Desk
              </span>
            </div>
          </a>

          <div className="hidden sm:flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              {campaign.category}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Event Hero Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-8">
          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[11px] font-bold uppercase tracking-wider">
                {campaign.eventName}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {campaign.eventLocation}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {campaign.name}
            </h1>

            {campaign.introductionText && (
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl pt-2">
                {campaign.introductionText}
              </p>
            )}
          </div>

          <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Dynamic Form Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="pb-6 border-b border-slate-100 dark:border-slate-800 mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {form?.title || 'Delegate & Stakeholder Registration'}
            </h2>
            {form?.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {form.description}
              </p>
            )}
          </div>

          {formError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-400 text-xs font-semibold">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map(field => {
              if (field.type === 'section_heading') {
                return (
                  <div key={field.id} className="pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {field.label}
                    </h3>
                    {field.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{field.description}</p>
                    )}
                  </div>
                );
              }

              if (field.type === 'descriptive_text') {
                return (
                  <p key={field.id} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {field.label}
                  </p>
                );
              }

              if (field.type === 'consent') {
                return (
                  <div key={field.id} className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        required={field.required}
                        checked={Boolean(formData[field.id])}
                        onChange={e => handleInputChange(field.id, e.target.checked)}
                        className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </span>
                    </label>
                  </div>
                );
              }

              if (field.type === 'checkbox' && field.options) {
                return (
                  <div key={field.id} className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.description && (
                      <p className="text-xs text-slate-500">{field.description}</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {field.options.map(opt => {
                        const checked = ((formData[field.id] as string[]) || []).includes(opt.value);
                        return (
                          <label
                            key={opt.id}
                            className={`flex items-start gap-2.5 p-3 rounded-xl border transition-colors cursor-pointer select-none text-xs ${
                              checked
                                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500/60 text-emerald-900 dark:text-emerald-200'
                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleCheckboxToggle(field.id, opt.value)}
                              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="font-medium leading-snug">{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              if (field.type === 'radio' && field.options) {
                return (
                  <div key={field.id} className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="space-y-2">
                      {field.options.map(opt => (
                        <label
                          key={opt.id}
                          className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={field.id}
                            required={field.required}
                            value={opt.value}
                            checked={formData[field.id] === opt.value}
                            onChange={e => handleInputChange(field.id, e.target.value)}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              }

              if (field.type === 'dropdown' && field.options) {
                return (
                  <div key={field.id} className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      required={field.required}
                      value={formData[field.id] || ''}
                      onChange={e => handleInputChange(field.id, e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="">Select an option...</option>
                      {field.options.map(opt => (
                        <option key={opt.id} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === 'long_text') {
                return (
                  <div key={field.id} className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                      rows={3}
                      required={field.required}
                      placeholder={field.placeholder || ''}
                      value={formData[field.id] || ''}
                      onChange={e => handleInputChange(field.id, e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                );
              }

              // Standard inputs (short_text, email, phone, number, date)
              return (
                <div key={field.id} className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={
                      field.type === 'email'
                        ? 'email'
                        : field.type === 'phone'
                        ? 'tel'
                        : field.type === 'number'
                        ? 'number'
                        : field.type === 'date'
                        ? 'date'
                        : 'text'
                    }
                    required={field.required}
                    placeholder={field.placeholder || ''}
                    value={formData[field.id] || ''}
                    onChange={e => handleInputChange(field.id, e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  {field.description && (
                    <p className="text-[11px] text-slate-400">{field.description}</p>
                  )}
                </div>
              );
            })}

            {/* Privacy note */}
            {campaign.termsAndPrivacyText && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed pt-2">
                {campaign.termsAndPrivacyText}
              </p>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-emerald-900/30 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Transmitting Inquiries...' : 'Submit Engagement Inquiry'}
              </button>
            </div>
          </form>
        </div>

        {/* Minimal Footer */}
        <footer className="mt-12 text-center text-xs text-slate-500 space-y-1">
          <p>&copy; {new Date().getFullYear()} Polaris Integrated &amp; GeoSolutions Limited (PIGL). All rights reserved.</p>
          <p className="text-slate-600">Nigeria Energy &amp; Geosolutions Infrastructure Operations</p>
        </footer>
      </main>
    </div>
  );
};
export default PublicCampaign;
