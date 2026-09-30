import React, { useState } from 'react';
import { CMSPartner } from '../../types';
import AdminPartnerEditor from './AdminPartnerEditor';
import {
  IconPartners,
  IconPlus,
  IconEdit,
  IconTrash,
  IconExternal
} from '../../components/admin/AdminIcons';

interface AdminPartnersProps {
  partners: CMSPartner[];
  loading: boolean;
  onSave: (partner: Partial<CMSPartner> & { name: string; role: string }) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  theme?: 'light' | 'dark';
}

const AdminPartners: React.FC<AdminPartnersProps> = ({
  partners,
  loading,
  onSave,
  onDelete,
  theme = 'light'
}) => {
  const [editingPartner, setEditingPartner] = useState<CMSPartner | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const isDark = theme === 'dark';

  const handleSaveAndClose = async (payload: any) => {
    await onSave(payload);
    setEditingPartner(null);
    setIsCreating(false);
  };

  if (isCreating || editingPartner) {
    return (
      <AdminPartnerEditor
        initialData={editingPartner}
        onSave={handleSaveAndClose}
        theme={theme}
        onCancel={() => {
          setEditingPartner(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className={`space-y-6 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Strategic Technology Partnerships
            </h1>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
              isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' : 'bg-emerald-100 text-emerald-900 border-emerald-300/60'
            }`}>
              {partners.length} Active Alliances
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage global technology partners (e.g. Frankstar Technology, CoaleXpert, NPK Automation) and service affiliations.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <IconPlus className="w-4 h-4" />
          <span>Add Technology Partner</span>
        </button>
      </div>

      {/* Partners Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm font-medium">
          <svg className="animate-spin h-6 w-6 text-emerald-500 mx-auto mb-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading technology partners...
        </div>
      ) : partners.length === 0 ? (
        <div className={`p-12 border rounded-2xl text-center text-sm font-medium ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          No technology partners configured yet. Click "Add Technology Partner" to create your first alliance.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className={`border rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between transition-all ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-xl border p-2 flex items-center justify-center overflow-hidden flex-shrink-0 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    {partner.logo_url ? (
                      <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-contain" />
                    ) : (
                      <IconPartners className={`w-7 h-7 ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`} />
                    )}
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase border ${
                    partner.status === 'published' 
                      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/50' 
                      : 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300/60 dark:border-amber-700/50'
                  }`}>
                    {partner.status}
                  </span>
                </div>

                <div>
                  <h3 className={`text-base font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {partner.name}
                  </h3>
                  <p className={`text-xs font-bold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                    {partner.role}
                  </p>
                  <p className={`text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {partner.description}
                  </p>
                </div>

                {partner.capabilities && partner.capabilities.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {partner.capabilities.slice(0, 3).map((cap, i) => (
                      <span key={i} className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}>
                        {cap}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={`p-4 border-t flex items-center justify-between ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-100'
              }`}>
                {partner.website ? (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-emerald-500 font-bold transition-colors"
                  >
                    <span>Website</span>
                    <IconExternal className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Order: #{partner.display_order}</span>
                )}

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingPartner(partner)}
                    className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      isDark 
                        ? 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-800/50' 
                        : 'bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white border border-emerald-200'
                    }`}
                  >
                    <IconEdit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete partner alliance "${partner.name}"?`)) {
                        onDelete(partner.id);
                      }
                    }}
                    className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-rose-500 hover:text-white hover:bg-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:hover:bg-rose-800 rounded-lg text-xs font-bold transition-colors"
                  >
                    <IconTrash className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPartners;
