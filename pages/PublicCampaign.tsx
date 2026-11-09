import React, { useState, useEffect } from 'react';
import { Campaign, CampaignForm, CampaignFormField } from '../types/campaign';
import { getCampaignBySlug, submitCampaignForm } from '../lib/campaignApi';
import LogoImg from '../assets/LOGO.png';

interface PublicCampaignProps {
  currentPath: string;
}

const DEFAULT_FALLBACK_FIELDS: CampaignFormField[] = [
  {
    id: 'full_name',
    type: 'short_text',
    label: 'Full Name',
    placeholder: 'e.g. Engr. Oladipo Adeleke',
    required: true,
    order: 1
  },
  {
    id: 'email',
    type: 'email',
    label: 'Corporate / Official Email Address',
    placeholder: 'e.g. o.adeleke@energyfirm.com',
    required: true,
    order: 2
  },
  {
    id: 'phone',
    type: 'phone',
    label: 'Phone / WhatsApp Number',
    placeholder: '+234 803 000 0000',
    required: false,
    order: 3
  },
  {
    id: 'company',
    type: 'short_text',
    label: 'Company / Operating Organisation',
    placeholder: 'e.g. Shell, NNPC Ltd, Chevron, TotalEnergies, Seplat',
    required: true,
    order: 4
  },
  {
    id: 'job_title',
    type: 'short_text',
    label: 'Job Title / Designation',
    placeholder: 'e.g. Executive Director, Lead Project Engineer',
    required: false,
    order: 5
  },
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
];

export const PublicCampaign: React.FC<PublicCampaignProps> = ({ currentPath }) => {
  // Extract slug from /campaigns/:slug
  const slug = currentPath.replace(/^\/campaigns\/?/, '').split('/')[0] || '';

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [form, setForm] = useState<CampaignForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Form submission state
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

  // Derive active version & fields dynamically from form builder
  const activeVersion = form?.versions?.find(v => v.versionNumber === form.activeVersion)
    || form?.versions?.[form.versions.length - 1];

  const rawFields = activeVersion?.fields && activeVersion.fields.length > 0
    ? activeVersion.fields
    : DEFAULT_FALLBACK_FIELDS;

  // Sort fields by order
  const fields = [...rawFields].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxToggle = (fieldId: string, optionValue: string) => {
    setFormData(prev => {
      const current = Array.isArray(prev[fieldId]) ? prev[fieldId] : [];
      const exists = current.includes(optionValue);
      const next = exists
        ? current.filter((v: string) => v !== optionValue)
        : [...current, optionValue];
      return { ...prev, [fieldId]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    setFormError(null);

    // Dynamic field validation
    for (const f of fields) {
      if (f.required && f.type !== 'section_heading' && f.type !== 'descriptive_text') {
        const val = formData[f.id];
        if (f.type === 'consent' && !val) {
          setFormError(`Please confirm your agreement: "${f.label}"`);
          return;
        }
        if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
          setFormError(`Please provide a value for "${f.label}".`);
          return;
        }
        if (f.type === 'email' && typeof val === 'string' && !val.includes('@')) {
          setFormError(`Please enter a valid email address for "${f.label}".`);
          return;
        }
      }
    }

    setIsSubmitting(true);

    // Extract standard top-level attributes to populate leads table
    const findValueByKeywords = (keywords: string[]) => {
      for (const f of fields) {
        const idLower = f.id.toLowerCase();
        const labelLower = f.label.toLowerCase();
        for (const kw of keywords) {
          if (idLower === kw || idLower.includes(kw) || labelLower.includes(kw)) {
            if (formData[f.id] !== undefined && formData[f.id] !== '') {
              return formData[f.id];
            }
          }
        }
      }
      return '';
    };

    const visitorName = findValueByKeywords(['full_name', 'fullname', 'name']) || 'Conference Delegate';
    const visitorEmail = findValueByKeywords(['email', 'corporate_email']) || '';
    const visitorPhone = findValueByKeywords(['phone', 'whatsapp', 'mobile', 'tel']) || '';
    const visitorCompany = findValueByKeywords(['company', 'organisation', 'organization']) || '';
    const visitorJobTitle = findValueByKeywords(['job_title', 'designation', 'role', 'title']) || '';
    const customInquiry = findValueByKeywords(['custom', 'scope', 'inquiry', 'requirement', 'notes']) || '';

    const payload: Record<string, any> = {
      ...formData,
      full_name: visitorName,
      email: visitorEmail,
      phone: visitorPhone,
      company: visitorCompany,
      job_title: visitorJobTitle,
      custom_inquiry_scope: customInquiry,
      f_full_name: visitorName,
      f_email: visitorEmail,
      f_phone: visitorPhone,
      f_company: visitorCompany,
      f_job_title: visitorJobTitle,
      f_custom_scope: customInquiry
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
    const confirmationEmail = formData['email'] || formData['f_email'] || 'your corporate address';
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
            <p>&bull; An official acknowledgement has been queued for: <strong className="text-slate-800">{confirmationEmail}</strong></p>
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
  // Main Visitor Form (Dynamically Driven by Form Builder & Light Themed)
  // -------------------------------------------------------------
  const displayTitle = form?.title || `Connect with PIGL at ${campaign.eventName || campaign.name}`;
  const displayDescription = form?.description || campaign.introductionText ||
    `Complete this brief form to connect directly with Polaris Integrated & GeoSolutions Limited (PIGL) during ${campaign.eventName || 'the event'}.`;

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
            {displayTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            {displayDescription}
          </p>
        </div>

        {/* Dynamic Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
              <span className="font-bold">Notice:</span> {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map(field => {
              // 1. Section Heading
              if (field.type === 'section_heading') {
                return (
                  <div key={field.id} className="pt-4 pb-1 border-b border-slate-100">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {field.label}
                    </h2>
                    {field.description && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{field.description}</p>
                    )}
                  </div>
                );
              }

              // 2. Descriptive Text
              if (field.type === 'descriptive_text') {
                return (
                  <div key={field.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                    {field.label}
                  </div>
                );
              }

              // 3. Long Text (Textarea)
              if (field.type === 'long_text') {
                return (
                  <div key={field.id} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.description && (
                      <p className="text-[11px] text-slate-500 leading-relaxed">{field.description}</p>
                    )}
                    <textarea
                      rows={3}
                      required={field.required}
                      placeholder={field.placeholder || ''}
                      value={formData[field.id] || ''}
                      onChange={e => handleFieldChange(field.id, e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                    />
                  </div>
                );
              }

              // 4. Dropdown Select
              if (field.type === 'dropdown') {
                return (
                  <div key={field.id} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      required={field.required}
                      value={formData[field.id] || ''}
                      onChange={e => handleFieldChange(field.id, e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors cursor-pointer"
                    >
                      <option value="">Select an option...</option>
                      {(field.options || []).map(opt => (
                        <option key={opt.id} value={opt.value || opt.label}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {field.description && (
                      <p className="text-[11px] text-slate-400">{field.description}</p>
                    )}
                  </div>
                );
              }

              // 5. Radio Single Choice
              if (field.type === 'radio') {
                const currentVal = formData[field.id] || '';
                return (
                  <div key={field.id} className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.description && (
                      <p className="text-[11px] text-slate-500">{field.description}</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(field.options || []).map(opt => {
                        const optVal = opt.value || opt.label;
                        const isSelected = currentVal === optVal;
                        return (
                          <label
                            key={opt.id}
                            onClick={() => handleFieldChange(field.id, optVal)}
                            className={`p-3 rounded-xl border text-xs font-medium cursor-pointer flex items-center gap-2.5 transition-all select-none ${
                              isSelected
                                ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900 text-slate-900'
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name={field.id}
                              checked={isSelected}
                              onChange={() => {}}
                              className="text-slate-900 focus:ring-slate-900"
                            />
                            <span>{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // 6. Checkboxes (Multi-select)
              if (field.type === 'checkbox') {
                const currentVals = Array.isArray(formData[field.id]) ? formData[field.id] : [];
                return (
                  <div key={field.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <span className="text-[11px] text-slate-400">Select all that apply</span>
                    </div>
                    {field.description && (
                      <p className="text-[11px] text-slate-500">{field.description}</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(field.options || []).map(opt => {
                        const optVal = opt.value || opt.label;
                        const isChecked = currentVals.includes(optVal);
                        return (
                          <label
                            key={opt.id}
                            onClick={() => handleCheckboxToggle(field.id, optVal)}
                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 select-none ${
                              isChecked
                                ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900 text-slate-900'
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                            />
                            <div className="flex-1">
                              <p className="text-xs font-semibold leading-snug">{opt.label}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // 7. Consent Checkbox
              if (field.type === 'consent') {
                return (
                  <div key={field.id} className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        required={field.required}
                        checked={Boolean(formData[field.id])}
                        onChange={e => handleFieldChange(field.id, e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </span>
                    </label>
                  </div>
                );
              }

              // 8. Standard single line inputs (short_text, email, phone, number, date)
              return (
                <div key={field.id} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
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
                    onChange={e => handleFieldChange(field.id, e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                  />
                  {field.description && (
                    <p className="text-[11px] text-slate-400">{field.description}</p>
                  )}
                </div>
              );
            })}

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100">
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
