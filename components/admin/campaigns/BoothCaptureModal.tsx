import React, { useState } from 'react';
import { Campaign, CampaignForm } from '../../../types/campaign';
import { submitCampaignForm } from '../../../lib/campaignApi';
import { IconX, IconCheck, IconUsers } from '../AdminIcons';

interface BoothCaptureModalProps {
  campaign: Campaign;
  form?: CampaignForm | null;
  adminEmail: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BoothCaptureModal: React.FC<BoothCaptureModalProps> = ({
  campaign,
  form,
  adminEmail,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    f_divisions: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

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
    setIsSubmitting(true);
    setErrorMsg(null);

    // Basic validation
    const fullName = formData['f_full_name'] || '';
    const email = formData['f_email'] || '';

    if (!fullName.trim()) {
      setErrorMsg('Delegate Full Name is required.');
      setIsSubmitting(false);
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('A valid corporate email address is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await submitCampaignForm({
        campaignId: campaign.id,
        formId: form?.id || campaign.assignedFormId,
        source: 'booth_capture',
        formData,
        consentGiven: true,
        assignedStaff: adminEmail
      });

      if (res.success) {
        setSuccessMsg(`Visitor successfully registered! Submission Ref: ${res.submissionId}`);
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
    setFormData({ f_divisions: [] });
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto">
        {/* Booth Modal Header */}
        <div className="bg-emerald-950 px-6 py-4 text-white flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <IconUsers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
                  Staff Booth Capture
                </span>
                <span className="text-xs text-emerald-400 font-mono">
                  {campaign.eventName}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Capture Stand Visitor
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {successMsg ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl animate-bounce">
              <IconCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Lead Saved Successfully!</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">{successMsg}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Visitor acknowledgement email has been queued and logged under this campaign.
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={resetForNextVisitor}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
              >
                + Capture Next Visitor
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Visitor Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engr. Babatunde Adeyemi"
                  value={formData['f_full_name'] || ''}
                  onChange={e => handleInputChange('f_full_name', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Corporate Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="babatunde@energyfirm.com"
                  value={formData['f_email'] || ''}
                  onChange={e => handleInputChange('f_email', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Telephone / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+234 803 000 0000"
                  value={formData['f_phone'] || ''}
                  onChange={e => handleInputChange('f_phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. TotalEnergies, NNPC, Seplat"
                  value={formData['f_company'] || ''}
                  onChange={e => handleInputChange('f_company', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Designation / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chief Technical Officer / Project Engineering Manager"
                  value={formData['f_job_title'] || ''}
                  onChange={e => handleInputChange('f_job_title', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* PIGL Divisions Checklist */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                PIGL Operating Divisions of Interest
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'geosolutions', label: 'Geosolutions & Engineering (CPT, 3D Laser Scanning, Geotechnical)' },
                  { id: 'metocean', label: 'Metocean & Marine (Hydrographic, Metocean, Sub-bottom Profiling)' },
                  { id: 'construction', label: 'Integrated Construction (Swamp Pipelines, Structural Works)' },
                  { id: 'industrial', label: 'Industrial Solutions (Cathodic Protection, NDT Asset Integrity)' }
                ].map(item => {
                  const checked = ((formData['f_divisions'] as string[]) || []).includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-colors cursor-pointer select-none ${
                        checked
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500/60 text-emerald-900 dark:text-emerald-200'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCheckboxToggle('f_divisions', item.id)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-medium leading-snug">{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Quick Discussion Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Stand Discussion Notes / Scoping Inquiries
              </label>
              <textarea
                rows={2}
                placeholder="Key points from the conversation, urgent RFP needs, upcoming project tenders..."
                value={formData['f_scope'] || ''}
                onChange={e => handleInputChange('f_scope', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Footer with Staff metadata */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Captured by: <strong className="text-slate-700 dark:text-slate-300">{adminEmail}</strong></span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Recording...' : 'Record Visitor'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
