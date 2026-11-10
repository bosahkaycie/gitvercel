import React, { useState, useEffect } from 'react';
import { Campaign, CampaignForm, CampaignFormField } from '../../../types/campaign';
import { getCampaignDetails, submitCampaignForm } from '../../../lib/campaignApi';
import { IconX, IconCheck } from '../AdminIcons';

interface BoothCaptureModalProps {
  campaign: Campaign;
  form?: CampaignForm | null;
  adminEmail: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
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
    placeholder: 'Describe specific project scope, asset location, or inquiry...',
    required: false,
    order: 7
  },
  {
    id: 'consent_ndpa',
    type: 'consent',
    label: 'I consent to Polaris Integrated & GeoSolutions Limited contacting me regarding this inquiry in accordance with NDPA.',
    required: true,
    order: 8
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
  const [activeForm, setActiveForm] = useState<CampaignForm | null>(form || null);
  const [loadingForm, setLoadingForm] = useState<boolean>(!form || (form.campaignId !== campaign.id && form.id !== campaign.assignedFormId));
  const [dynamicValues, setDynamicValues] = useState<Record<string, any>>({});
  const [isStudent, setIsStudent] = useState<boolean>(false);
  const [discussionNotes, setDiscussionNotes] = useState<string>('');
  const [followupAction, setFollowupAction] = useState<string>('technical_proposal');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [lastSubmissionRef, setLastSubmissionRef] = useState<string | null>(null);
  const [lastVisitorName, setLastVisitorName] = useState<string>('');
  const [lastVisitorCompany, setLastVisitorCompany] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load fresh active form configuration matching the campaign
  useEffect(() => {
    let isMounted = true;
    async function loadFreshForm() {
      if (form && (form.campaignId === campaign.id || form.id === campaign.assignedFormId)) {
        setActiveForm(form);
        setLoadingForm(false);
        return;
      }

      setLoadingForm(true);
      try {
        const details = await getCampaignDetails(campaign.id);
        if (isMounted && details.form) {
          setActiveForm(details.form);
        }
      } catch (err) {
        console.warn('Could not load specific form for intake modal:', err);
      } finally {
        if (isMounted) setLoadingForm(false);
      }
    }

    if (isOpen) {
      loadFreshForm();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, campaign.id, campaign.assignedFormId, form]);

  if (!isOpen) return null;

  // Derive active version & fields dynamically from the campaign's form configuration
  const activeVersion = activeForm?.versions?.find(v => v.versionNumber === activeForm.activeVersion)
    || activeForm?.versions?.[(activeForm?.versions?.length || 1) - 1];

  const rawFields = activeVersion?.fields && activeVersion.fields.length > 0
    ? activeVersion.fields
    : DEFAULT_FALLBACK_FIELDS;

  // Sort fields by configured order
  const fields = [...rawFields].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleFieldChange = (fieldId: string, value: any) => {
    setDynamicValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxToggle = (fieldId: string, optionValue: string) => {
    setDynamicValues(prev => {
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
    setIsSubmitting(true);
    setErrorMsg(null);

    // Dynamic field validation - Note: Phone is strictly OPTIONAL across all campaign captures
    for (const f of fields) {
      const isPhone = f.type === 'phone' || f.id.toLowerCase().includes('phone') || f.id.toLowerCase().includes('tel') || f.id.toLowerCase().includes('whatsapp');
      if (f.required && !isPhone && f.type !== 'section_heading' && f.type !== 'descriptive_text') {
        const val = dynamicValues[f.id];
        if (f.type === 'consent') {
          if (val === false) {
            setErrorMsg(`Please confirm consent requirement: "${f.label}"`);
            setIsSubmitting(false);
            return;
          }
          continue;
        }
        if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
          setErrorMsg(`Please provide a value for "${f.label}".`);
          setIsSubmitting(false);
          return;
        }
        if (f.type === 'email' && typeof val === 'string' && !val.includes('@')) {
          setErrorMsg(`Please enter a valid email address for "${f.label}".`);
          setIsSubmitting(false);
          return;
        }
      }
    }

    // Extract standard top-level attributes to populate leads table and email alerts
    const findValueByKeywords = (keywords: string[]) => {
      for (const f of fields) {
        const idLower = f.id.toLowerCase();
        const labelLower = f.label.toLowerCase();
        for (const kw of keywords) {
          if (idLower === kw || idLower.includes(kw) || labelLower.includes(kw)) {
            if (dynamicValues[f.id] !== undefined && dynamicValues[f.id] !== '') {
              return dynamicValues[f.id];
            }
          }
        }
      }
      return '';
    };

    const visitorName = findValueByKeywords(['full_name', 'fullname', 'name']) || 'Stand Visitor';
    const visitorEmail = findValueByKeywords(['email', 'corporate_email']) || '';
    const visitorPhone = findValueByKeywords(['phone', 'whatsapp', 'mobile', 'tel']) || '';
    const visitorCompany = findValueByKeywords(['company', 'organisation', 'organization']) || '';
    const visitorJobTitle = findValueByKeywords(['job_title', 'designation', 'role', 'title']) || '';
    const customInquiry = findValueByKeywords(['custom', 'scope', 'inquiry', 'requirement']) || '';
    const divisions = findValueByKeywords(['service_divisions', 'divisions']) || [];

    const consentField = fields.find(f => f.type === 'consent');
    if (consentField && dynamicValues[consentField.id] === undefined) {
      dynamicValues[consentField.id] = true;
    }

    // Unified payload
    const payloadData: Record<string, any> = {
      ...dynamicValues,
      full_name: visitorName,
      email: visitorEmail,
      phone: visitorPhone,
      company: visitorCompany,
      job_title: visitorJobTitle,
      service_divisions: divisions,
      custom_inquiry_scope: customInquiry,
      discussion_notes: discussionNotes.trim(),
      followup_priority: followupAction,
      is_student: isStudent,
      isStudent: isStudent,

      // Legacy prefix compatibility
      f_full_name: visitorName,
      f_email: visitorEmail,
      f_phone: visitorPhone,
      f_company: visitorCompany,
      f_job_title: visitorJobTitle,
      f_divisions: divisions,
      f_custom_scope: customInquiry,
      f_is_student: isStudent,
      f_scope: [
        customInquiry ? `[Scope]: ${customInquiry}` : '',
        discussionNotes.trim() ? `[Stand Discussion Notes]: ${discussionNotes.trim()}` : ''
      ].filter(Boolean).join('\n\n')
    };

    try {
      const res = await submitCampaignForm({
        campaignId: campaign.id,
        formId: activeForm?.id || campaign.assignedFormId,
        source: 'booth_capture',
        formData: payloadData,
        consentGiven: true,
        assignedStaff: adminEmail
      });

      if (res.success) {
        setSuccessMsg(`Visitor successfully registered!`);
        setLastSubmissionRef(res.submissionId);
        setLastVisitorName(visitorName);
        setLastVisitorCompany(visitorCompany);
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res.error || 'Failed to record visitor submission.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForNextVisitor = () => {
    setDynamicValues({});
    setIsStudent(false);
    setDiscussionNotes('');
    setFollowupAction('technical_proposal');
    setSuccessMsg(null);
    setLastSubmissionRef(null);
    setLastVisitorName('');
    setLastVisitorCompany('');
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
              {activeForm?.title && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline-block" />
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
                    {activeForm.title} (v{activeForm.activeVersion || 1})
                  </span>
                </>
              )}
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Record Stand Visitor
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Capture attendee credentials, technical areas of interest, and custom inquiries using the configured campaign form pattern.
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
        <div className="overflow-y-auto flex-1 p-8 sm:p-10 space-y-8">
          {loadingForm ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Loading Configured Intake Form Pattern...
              </p>
            </div>
          ) : successMsg ? (
            <div className="py-12 text-center max-w-lg mx-auto space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <IconCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">
                  Lead Successfully Logged
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Attendee information for <strong className="text-slate-900">{lastVisitorName || 'Visitor'}</strong> {lastVisitorCompany ? `(${lastVisitorCompany})` : ''} has been securely recorded into the campaign database.
                </p>
                {lastSubmissionRef && (
                  <p className="font-mono text-xs text-slate-600 bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-200 inline-block font-semibold">
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
            <form onSubmit={handleSubmit} id="booth-capture-form" className="space-y-8">
              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* SECTION 1: Configured Campaign Form Fields */}
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Campaign Intake Form Fields
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Matches Visitor Frontend Pattern
                  </span>
                </div>

                <div className="space-y-5">
                  {fields.map(field => {
                    // 1. Section Heading
                    if (field.type === 'section_heading') {
                      return (
                        <div key={field.id} className="pt-4 pb-1 border-b border-slate-100">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            {field.label}
                          </h4>
                          {field.description && (
                            <p className="text-[11px] text-slate-400 mt-0.5">{field.description}</p>
                          )}
                        </div>
                      );
                    }

                    // 2. Descriptive Text
                    if (field.type === 'descriptive_text') {
                      return (
                        <div key={field.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                          {field.label}
                        </div>
                      );
                    }

                    // 3. Long Text (Textarea)
                    if (field.type === 'long_text') {
                      return (
                        <div key={field.id} className="space-y-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          {field.description && (
                            <p className="text-[11px] text-slate-500">{field.description}</p>
                          )}
                          <textarea
                            rows={3}
                            required={field.required}
                            placeholder={field.placeholder || ''}
                            value={dynamicValues[field.id] || ''}
                            onChange={e => handleFieldChange(field.id, e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                          />
                        </div>
                      );
                    }

                    // 4. Dropdown Selection
                    if (field.type === 'dropdown') {
                      return (
                        <div key={field.id} className="space-y-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          <select
                            required={field.required}
                            value={dynamicValues[field.id] || ''}
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

                    // 5. Radio Buttons (Single Choice)
                    if (field.type === 'radio') {
                      const currentVal = dynamicValues[field.id] || '';
                      return (
                        <div key={field.id} className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
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
                      const currentVals = Array.isArray(dynamicValues[field.id]) ? dynamicValues[field.id] : [];
                      return (
                        <div key={field.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
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
                              checked={dynamicValues[field.id] !== undefined ? Boolean(dynamicValues[field.id]) : true}
                              onChange={e => handleFieldChange(field.id, e.target.checked)}
                              className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                            />
                            <span className="text-xs text-slate-600 leading-relaxed">
                              {field.label}
                            </span>
                          </label>
                        </div>
                      );
                    }

                    // 8. Standard single line inputs (short_text, email, phone, number, date)
                    const isPhoneField = field.type === 'phone' || field.id.toLowerCase().includes('phone') || field.id.toLowerCase().includes('tel') || field.id.toLowerCase().includes('whatsapp');
                    const isFieldRequired = field.required && !isPhoneField;

                    return (
                      <div key={field.id} className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          {field.label} {isFieldRequired && <span className="text-red-500">*</span>}
                          {isPhoneField && <span className="text-[11px] font-normal text-slate-400 normal-case ml-1.5">(Optional)</span>}
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
                          required={isFieldRequired}
                          placeholder={field.placeholder || ''}
                          value={dynamicValues[field.id] || ''}
                          onChange={e => handleFieldChange(field.id, e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                        />
                        {field.description && (
                          <p className="text-[11px] text-slate-400">{field.description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Student Identification Checkbox */}
                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="booth_is_student"
                      checked={isStudent}
                      onChange={e => setIsStudent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        <span>Are you a student?</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          🎓 Student Attendee
                        </span>
                      </span>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Check if the visitor is attending as an undergraduate, postgraduate student, or academic delegate.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* SECTION 2: Administrator Stand Discussion & Pipeline Prioritization */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Stand Discussion Summary &amp; Recommended Action
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
                      value={discussionNotes}
                      onChange={e => setDiscussionNotes(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Follow-up Action
                    </label>
                    <select
                      value={followupAction}
                      onChange={e => setFollowupAction(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors cursor-pointer"
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
        {!successMsg && !loadingForm && (
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
