import React, { useState } from 'react';
import { CMSPartner } from '../../types';
import ImageUploader from '../../components/admin/ImageUploader';

interface AdminPartnerEditorProps {
  initialData?: CMSPartner | null;
  onSave: (partner: Partial<CMSPartner> & { name: string; role: string }) => Promise<any>;
  onCancel: () => void;
  theme?: 'light' | 'dark';
}

const SERVICE_PLATFORMS = [
  { id: 'offshore-intelligence', title: 'Offshore Intelligence' },
  { id: 'ground-intelligence', title: 'Ground Intelligence' },
  { id: 'digital-intelligence', title: 'Digital Intelligence' },
  { id: 'integrated-engineering-construction', title: 'Integrated Engineering & Construction Solutions' },
  { id: 'industrial-environmental-technologies', title: 'Industrial & Environmental Technologies' }
];

const AdminPartnerEditor: React.FC<AdminPartnerEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [name, setName] = useState(initialData?.name || '');
  const [role, setRole] = useState(initialData?.role || '');
  const [specialty, setSpecialty] = useState(initialData?.specialty || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [website, setWebsite] = useState(initialData?.website || '');
  const [logoUrl, setLogoUrl] = useState(initialData?.logo_url || '');
  const [serviceId, setServiceId] = useState(initialData?.service_id || SERVICE_PLATFORMS[0].id);
  const [capabilitiesStr, setCapabilitiesStr] = useState((initialData?.capabilities || []).join('\n'));
  const [displayOrder, setDisplayOrder] = useState<number>(initialData?.display_order || 1);
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(initialData?.status || 'published');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      setError('Please provide partner name and role designation.');
      return;
    }

    setError(null);
    setSaving(true);

    const capabilities = capabilitiesStr.split('\n').map(s => s.trim()).filter(Boolean);
    const selectedService = SERVICE_PLATFORMS.find(s => s.id === serviceId);

    const payload = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      name,
      role,
      specialty,
      description,
      capabilities,
      website,
      logo_url: logoUrl,
      service_id: serviceId,
      service_title: selectedService?.title || 'Specialist Engineering',
      display_order: Number(displayOrder),
      status
    };

    try {
      await onSave(payload);
    } catch (err: any) {
      setError(err?.message || 'Failed to save partner.');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans pb-16">
      {/* Top action bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <button
            type="button"
            onClick={onCancel}
            className={`text-xs font-bold transition-colors mb-2 block ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ← Back to Partners List
          </button>
          <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {initialData ? `Edit Partner: ${initialData.name}` : 'Add New Strategic Technology Partner'}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 border rounded-lg text-xs font-bold uppercase transition-colors ${
              isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save & Publish Partner'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              1. Partner Profile & Affiliation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Partner Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Frankstar Technology"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:border-emerald-500 outline-none font-bold ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Alliance Role / Title *
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Strategic MetOcean & Marine Intelligence Partner"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Technical Specialty / Focus Area
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g. Oceanographic Buoys & Real-Time Telemetry"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-xs focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Official Website URL
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.frankstartech.com/"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-xs font-mono focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Associated PIGL Service Platform
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-xs focus:border-emerald-500 outline-none font-medium ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {SERVICE_PLATFORMS.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Partnership Narrative & Synergy Description *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain how this partnership empowers PIGL engineering delivery in Nigeria..."
                className={`w-full p-3 border rounded-lg text-sm focus:border-emerald-500 outline-none leading-relaxed ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Key Joint Capabilities & Technologies (One per line)
              </label>
              <textarea
                rows={4}
                value={capabilitiesStr}
                onChange={(e) => setCapabilitiesStr(e.target.value)}
                placeholder="MetOcean Telemetry Buoys (Wave, Current & Tidal)&#10;Meteorological Observation Stations&#10;Real-Time Environmental Data Transmission"
                className={`w-full p-3 font-mono text-xs border rounded-lg focus:border-emerald-500 outline-none ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings (1 col) */}
        <div className="space-y-6">
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              Status & Order
            </h3>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Status
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className={`w-full p-2.5 border rounded-lg text-sm font-bold ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="published">Published (Live on Website)</option>
                <option value="draft">Draft (Admin Only)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className={`w-full p-2.5 border rounded-lg text-sm ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              Partner Logo / Badge
            </h3>

            <ImageUploader
              label="Partner Logo (PNG with transparent bg recommended)"
              currentUrl={logoUrl}
              onUploadComplete={(url) => setLogoUrl(url)}
              bucket="media"
              helperText="Partner brand logo asset"
              theme={theme}
            />
          </div>
        </div>

      </div>
    </form>
  );
};

export default AdminPartnerEditor;
