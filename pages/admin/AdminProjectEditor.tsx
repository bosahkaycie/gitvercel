import React, { useState } from 'react';
import { CMSProject } from '../../types';
import ImageUploader from '../../components/admin/ImageUploader';

interface AdminProjectEditorProps {
  initialData?: CMSProject | null;
  onSave: (project: Partial<CMSProject> & { title: string; client: string }) => Promise<any>;
  onCancel: () => void;
  theme?: 'light' | 'dark';
}

const CATEGORIES = [
  'Intelligence',
  'Solutions & Engineering',
  'Pipeline',
  'Civil',
  'Geosolutions',
  'Integrated'
];

const AdminProjectEditor: React.FC<AdminProjectEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [title, setTitle] = useState(initialData?.title || '');
  const [client, setClient] = useState(initialData?.client || '');
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [serviceCapability, setServiceCapability] = useState(initialData?.service_capability || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [scope, setScope] = useState(initialData?.scope || '');
  const [challenge, setChallenge] = useState(initialData?.challenge || '');
  const [solution, setSolution] = useState(initialData?.solution || '');
  const [results, setResults] = useState(initialData?.results || '');
  const [location, setLocation] = useState(initialData?.location || 'Niger Delta, Nigeria');
  const [year, setYear] = useState(initialData?.year || '2024');
  const [image, setImage] = useState(initialData?.image || '');
  const [equipmentStr, setEquipmentStr] = useState((initialData?.equipment || []).join('\n'));
  const [displayOrder, setDisplayOrder] = useState<number>(initialData?.display_order || 1);
  const [featured, setFeatured] = useState<boolean>(initialData?.featured ?? true);
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(initialData?.status || 'published');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) {
      setError('Please provide both a project title and client name.');
      return;
    }

    setError(null);
    setSaving(true);

    const equipment = equipmentStr.split('\n').map(s => s.trim()).filter(Boolean);

    const payload = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      title,
      client,
      category,
      service_capability: serviceCapability || category,
      description,
      scope: scope || description,
      challenge,
      solution,
      results,
      location,
      year,
      image,
      gallery: image ? [image] : [],
      equipment,
      display_order: Number(displayOrder),
      featured,
      status
    };

    try {
      await onSave(payload);
    } catch (err: any) {
      setError(err?.message || 'Failed to save project.');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans pb-16">
      {/* Action Header */}
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
            ← Back to Projects List
          </button>
          <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {initialData ? `Edit Project: ${initialData.title}` : 'Add New Project / Case Study'}
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
            {saving ? 'Saving...' : 'Save & Publish Project'}
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
          
          {/* Core Info */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              1. Project Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AKK Gas Pipeline Geodetic & Subsurface Survey"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:border-emerald-500 outline-none font-bold ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Client / Operator Name *
                </label>
                <input
                  type="text"
                  required
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. TotalEnergies, Shell, Chevron, NNPC, Brentex"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-xs focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Location / Terrain
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bonny Island, Rivers State"
                  className={`w-full px-3 py-2 border rounded-lg text-xs focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Year of Execution
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2024"
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-mono focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Project Summary / Overview *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="High-level engineering narrative explaining the project background..."
                className={`w-full p-3 border rounded-lg text-sm focus:border-emerald-500 outline-none leading-relaxed ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Case Study Depth: Challenge, Solution, Results */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              2. Technical Scope & Case Study
            </h3>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Scope of Work
              </label>
              <textarea
                rows={2}
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Specific engineering deliverables (e.g. 311km pipeline route survey, 20-ton CPTu soundings)..."
                className={`w-full p-3 border rounded-lg text-xs focus:border-emerald-500 outline-none ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Engineering Challenge
                </label>
                <textarea
                  rows={3}
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="Complex geotechnical conditions, tight shutdowns, extreme swamp terrain..."
                  className={`w-full p-3 border rounded-lg text-xs focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  PIGL Technical Solution
                </label>
                <textarea
                  rows={3}
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="How PIGL deployed specialized equipment, calibrated sensors, and precision analysis..."
                  className={`w-full p-3 border rounded-lg text-xs focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Results & Client Impact
              </label>
              <textarea
                rows={2}
                value={results}
                onChange={(e) => setResults(e.target.value)}
                placeholder="e.g. Zero rework, completed 3 weeks ahead of schedule, zero LTI incidents..."
                className={`w-full p-3 border rounded-lg text-xs focus:border-emerald-500 outline-none ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Specialist Equipment Deployed (One per line)
              </label>
              <textarea
                rows={3}
                value={equipmentStr}
                onChange={(e) => setEquipmentStr(e.target.value)}
                placeholder="Leica RTC360 High-Speed 3D Laser Scanner&#10;20-Ton Hydraulic CPT Rig&#10;RTK-GNSS Dual-Frequency Receivers"
                className={`w-full p-3 font-mono text-xs border rounded-lg focus:border-emerald-500 outline-none ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
          </div>

        </div>

        {/* Sidebar Settings & Media (1 col) */}
        <div className="space-y-6">
          
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              Publishing Options
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
                Display Order Sequence
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

            <div className="pt-2">
              <label className={`flex items-center space-x-2 text-xs font-bold cursor-pointer ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Featured on Homepage & Highlights</span>
              </label>
            </div>
          </div>

          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              Project Field Image
            </h3>

            <ImageUploader
              label="Field Photography"
              currentUrl={image}
              onUploadComplete={(url) => setImage(url)}
              bucket="services"
              helperText="High-res engineering / realistic Nigerian field image"
              theme={theme}
            />
          </div>

        </div>

      </div>
    </form>
  );
};

export default AdminProjectEditor;
