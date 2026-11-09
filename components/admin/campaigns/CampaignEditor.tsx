import React, { useState, useEffect } from 'react';
import {
  Campaign,
  CampaignCategory,
  CampaignStatus
} from '../../../types/campaign';
import { DEFAULT_CAMPAIGN_CATEGORIES } from '../../../constants/campaignDefaults';
import { saveCampaign } from '../../../lib/campaignApi';
import { IconCheck, IconExternal, IconX } from '../AdminIcons';

interface CampaignEditorProps {
  campaign?: Campaign | null;
  onSaved: (savedCampaign: Campaign) => void;
  onCancel: () => void;
  adminEmail: string;
}

export const CampaignEditor: React.FC<CampaignEditorProps> = ({
  campaign,
  onSaved,
  onCancel,
  adminEmail
}) => {
  const isEditing = Boolean(campaign?.id);

  const getInitialState = (): Partial<Campaign> => {
    if (campaign) return { ...campaign };
    return {
      name: '',
      slug: '',
      description: '',
      category: 'Conference',
      eventName: '',
      eventLocation: '',
      eventStartDate: new Date().toISOString().split('T')[0],
      eventEndDate: new Date().toISOString().split('T')[0],
      campaignStartDate: new Date().toISOString().split('T')[0],
      campaignClosingDate: '',
      coverImageUrl: '/assets/pigl_conference_keynote.jpg',
      logoImageUrl: '/assets/LOGO.png',
      status: 'draft',
      publicVisibility: true,
      assignedStaff: [adminEmail],
      introductionText: 'Welcome to the PIGL engagement portal. Connect with our engineering directors and technical specialists.',
      confirmationMessage: 'Thank you for connecting with Polaris Integrated & GeoSolutions Limited (PIGL). Our technical leadership team has received your submission.',
      termsAndPrivacyText: 'Polaris Integrated & GeoSolutions Limited respects your privacy and complies with the Nigeria Data Protection Act (NDPA).'
    };
  };

  const [formData, setFormData] = useState<Partial<Campaign>>(getInitialState);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setFormData(getInitialState());
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [campaign?.id, adminEmail]);

  // Auto slug generator from name
  const handleNameChange = (name: string) => {
    const updates: Partial<Campaign> = { name };
    if (!isEditing || !formData.slug) {
      updates.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    if (!formData.eventName) {
      updates.eventName = name;
    }
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    if (!formData.name?.trim()) {
      setErrorMsg('Campaign name is required.');
      setIsSaving(false);
      return;
    }

    if (!formData.slug?.trim()) {
      setErrorMsg('Campaign URL slug is required.');
      setIsSaving(false);
      return;
    }

    try {
      const saved = await saveCampaign(formData);
      setSuccessMsg(`Campaign "${saved.name}" successfully ${isEditing ? 'updated' : 'created'}! Redirecting to campaign manager...`);
      setTimeout(() => {
        onSaved(saved);
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save campaign.');
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Editor Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isEditing ? `Edit Campaign: ${campaign?.name}` : 'Create New Campaign & Event'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure event dates, public URL slug, brand styling, and lifecycle status.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
        >
          <IconX className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <IconX className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
            <IconCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Section 1: Campaign Identity */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            1. Campaign Identity &amp; Classification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Campaign / Initiative Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. NOG Energy Week 2027"
                value={formData.name || ''}
                onChange={e => handleNameChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Public URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-700 border border-r-0 border-slate-300 dark:border-slate-700 rounded-l-xl text-xs text-slate-500 font-mono">
                  /campaigns/
                </span>
                <input
                  type="text"
                  required
                  placeholder="nog-energy-week-2027"
                  value={formData.slug || ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                    }))
                  }
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-r-xl text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Campaign Category
              </label>
              <select
                value={formData.category || 'Conference'}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as CampaignCategory }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {DEFAULT_CAMPAIGN_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Operational Status (Lifecycle)
              </label>
              <select
                value={formData.status || 'draft'}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as CampaignStatus }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="draft">Draft (Private / Not Public)</option>
                <option value="scheduled">Scheduled (Activates on Start Date)</option>
                <option value="active">Active (Live &amp; Accepting Submissions)</option>
                <option value="paused">Paused (Temporarily Halts Submissions)</option>
                <option value="closed">Closed (Event Concluded)</option>
                <option value="archived">Archived (Historical Reference)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Executive Description
              </label>
              <textarea
                rows={2}
                placeholder="Objectives of this engagement, target stakeholder profile, expected attendance..."
                value={formData.description || ''}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Event Venue & Timeline */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            2. Event Venue &amp; Active Dates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Host Event / Conference Name
              </label>
              <input
                type="text"
                placeholder="e.g. NOG Energy Week 2027"
                value={formData.eventName || ''}
                onChange={e => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Venue Location
              </label>
              <input
                type="text"
                placeholder="e.g. International Conference Centre, Abuja, Nigeria"
                value={formData.eventLocation || ''}
                onChange={e => setFormData(prev => ({ ...prev, eventLocation: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Event Start Date
              </label>
              <input
                type="date"
                value={formData.eventStartDate || ''}
                onChange={e => setFormData(prev => ({ ...prev, eventStartDate: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Event End Date
              </label>
              <input
                type="date"
                value={formData.eventEndDate || ''}
                onChange={e => setFormData(prev => ({ ...prev, eventEndDate: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Form Opens (Campaign Start)
              </label>
              <input
                type="date"
                value={formData.campaignStartDate || ''}
                onChange={e => setFormData(prev => ({ ...prev, campaignStartDate: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Form Closes (Campaign Closing)
              </label>
              <input
                type="date"
                value={formData.campaignClosingDate || ''}
                onChange={e => setFormData(prev => ({ ...prev, campaignClosingDate: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Public Page Content & NDPA Notice */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            3. Public Form Experience &amp; Consent
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Public Header Welcome Message
              </label>
              <textarea
                rows={2}
                value={formData.introductionText || ''}
                onChange={e => setFormData(prev => ({ ...prev, introductionText: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Post-Submission Success Message
              </label>
              <textarea
                rows={2}
                value={formData.confirmationMessage || ''}
                onChange={e => setFormData(prev => ({ ...prev, confirmationMessage: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Privacy Policy &amp; Consent Text (NDPA Compliance)
              </label>
              <textarea
                rows={2}
                value={formData.termsAndPrivacyText || ''}
                onChange={e => setFormData(prev => ({ ...prev, termsAndPrivacyText: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Saving Campaign...' : isEditing ? 'Save Changes' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
};
