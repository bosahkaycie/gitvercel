import React, { useState } from 'react';
import { VendorApplication, VendorApplicationStatus } from '../../types';
import {
  IconVendor,
  IconSearch,
  IconEdit,
  IconTrash,
  IconCheckCircle,
  IconFileText,
  IconExternal,
  IconPhone,
  IconMail
} from '../../components/admin/AdminIcons';

interface AdminVendorsProps {
  vendors: VendorApplication[];
  loading: boolean;
  onReview: (
    id: string,
    data: {
      status: VendorApplicationStatus;
      procurement_reviewer?: string;
      finance_reviewer?: string;
      vat_status_verified?: boolean;
      approved_vendor_category?: string;
      internal_notes?: string;
    }
  ) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  theme?: 'light' | 'dark';
}

const CATEGORY_PRESETS = [
  'Survey / Geoscience & Offshore Bathymetry',
  '3D Reality Capture & Digital Twins',
  'Geotechnical Drilling & CPT Testing',
  'Pipeline Inspection & Non-Destructive Testing',
  'Produced Water Treatment & Environmental',
  'Process Automation & Instrumentation',
  'Civil Works & Structural Fabrication',
  'Logistics, Marine Vessels & Heavy Equipment',
  'Consultancy & Advisory Services'
];

const AdminVendors: React.FC<AdminVendorsProps> = ({
  vendors,
  loading,
  onReview,
  onDelete,
  theme = 'light'
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<VendorApplication | null>(null);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);

  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    status: 'pending' as VendorApplicationStatus,
    procurement_reviewer: '',
    finance_reviewer: '',
    vat_status_verified: false,
    approved_vendor_category: '',
    internal_notes: ''
  });
  const [isSavingReview, setIsSavingReview] = useState(false);

  const isDark = theme === 'dark';

  const openReview = (vendor: VendorApplication) => {
    setSelectedVendor(vendor);
    setReviewForm({
      status: vendor.status,
      procurement_reviewer: vendor.procurement_reviewer || '',
      finance_reviewer: vendor.finance_reviewer || '',
      vat_status_verified: vendor.vat_status_verified || false,
      approved_vendor_category: vendor.approved_vendor_category || '',
      internal_notes: vendor.internal_notes || ''
    });
    setIsReviewDrawerOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;

    setIsSavingReview(true);
    try {
      await onReview(selectedVendor.id, reviewForm);
      setIsReviewDrawerOpen(false);
      setSelectedVendor(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update vendor review status.');
    } finally {
      setIsSavingReview(false);
    }
  };

  const filtered = vendors.filter(v => {
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      v.vendor_legal_name.toLowerCase().includes(q) ||
      v.reference_number.toLowerCase().includes(q) ||
      v.rc_bn_number.toLowerCase().includes(q) ||
      v.tin_number.toLowerCase().includes(q) ||
      v.contact_name.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: VendorApplicationStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/50">
            Approved
          </span>
        );
      case 'under_review':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300/60 dark:border-blue-700/50">
            Under Review
          </span>
        );
      case 'needs_clarification':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300/60 dark:border-purple-700/50">
            Needs Clarification
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300/60 dark:border-rose-700/50">
            Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/50">
            Pending
          </span>
        );
    }
  };

  return (
    <div className={`space-y-6 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Vendor Onboarding & Tax Compliance Desk
            </h1>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
              isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' : 'bg-emerald-100 text-emerald-900 border-emerald-300/60'
            }`}>
              FORM VOTC/037
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Review, audit, and approve new and existing vendor credentials (TIN, VAT status, NUBAN, and Section G sign-offs).
          </p>
        </div>

        <a
          href="/vendors/register"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <IconExternal className="w-4 h-4" />
          <span>Open Public Form</span>
        </a>
      </div>

      {/* Toolbar */}
      <div className={`p-4 rounded-2xl border shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="relative w-full sm:w-84">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <IconSearch className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by vendor, reference, TIN, or RC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
              isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Applications' },
            { id: 'pending', label: 'Pending' },
            { id: 'under_review', label: 'Under Review' },
            { id: 'approved', label: 'Approved' },
            { id: 'needs_clarification', label: 'Clarification' },
            { id: 'rejected', label: 'Rejected' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vendors Table */}
      <div className={`border rounded-2xl shadow-xs overflow-hidden transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            <svg className="animate-spin h-6 w-6 text-emerald-500 mx-auto mb-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading vendor applications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            No vendor applications found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className={`border-b text-xs font-bold uppercase tracking-wider ${
                isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <tr>
                  <th className="py-3.5 px-4 sm:px-5">Ref Code & Legal Entity</th>
                  <th className="py-3.5 px-4 sm:px-5">RC/BN & Type</th>
                  <th className="py-3.5 px-4 sm:px-5">Tax (TIN / VAT)</th>
                  <th className="py-3.5 px-4 sm:px-5">Primary Contact</th>
                  <th className="py-3.5 px-4 sm:px-5">Status</th>
                  <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-slate-100 text-slate-800'}`}>
                {filtered.map((v) => (
                  <tr key={v.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/80'}`}>
                    <td className="py-4 px-4 sm:px-5">
                      <div>
                        <span className={`text-xs font-mono font-bold block ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                          {v.reference_number}
                        </span>
                        <p className={`font-bold line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{v.vendor_legal_name}</p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {new Date(v.submission_date || v.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-5">
                      <p className={`font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{v.rc_bn_number}</p>
                      <p className={`text-xs truncate max-w-[150px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{v.business_type}</p>
                    </td>

                    <td className="py-4 px-4 sm:px-5">
                      <p className={`font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>TIN: {v.tin_number}</p>
                      <p className={`text-xs font-bold uppercase ${v.vat_status === 'VAT-Registered' ? (isDark ? 'text-emerald-400' : 'text-emerald-800') : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {v.vat_status}
                      </p>
                    </td>

                    <td className="py-4 px-4 sm:px-5">
                      <p className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{v.contact_name}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{v.contact_phone}</p>
                    </td>

                    <td className="py-4 px-4 sm:px-5">
                      {getStatusBadge(v.status)}
                      {v.approved_vendor_category && (
                        <p className={`text-xs truncate max-w-[140px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {v.approved_vendor_category}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-4 sm:px-5 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openReview(v)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          isDark 
                            ? 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-800/50' 
                            : 'bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white border border-emerald-200'
                        }`}
                      >
                        <IconEdit className="w-3.5 h-3.5" />
                        <span>Inspect & Review</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete vendor registration record for "${v.vendor_legal_name}"?`)) {
                            onDelete(v.id);
                          }
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-rose-500 hover:text-white hover:bg-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:hover:bg-rose-800 rounded-lg text-xs font-bold transition-colors"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal / Drawer */}
      {isReviewDrawerOpen && selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className={`max-w-3xl w-full max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Header */}
            <div className="p-6 bg-slate-950 text-white flex items-center justify-between sticky top-0 z-20 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  {selectedVendor.reference_number} • Form VOTC/037
                </span>
                <h3 className="text-xl font-bold tracking-tight mt-0.5 text-white">
                  {selectedVendor.vendor_legal_name}
                </h3>
              </div>
              <button
                onClick={() => setIsReviewDrawerOpen(false)}
                className="text-slate-400 hover:text-white transition-colors text-sm font-bold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Dossier Summary Grid */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm p-5 rounded-xl border ${
                isDark ? 'bg-slate-950/60 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}>
                <div>
                  <span className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Business Type:
                  </span>
                  <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>{selectedVendor.business_type}</span>
                </div>
                <div>
                  <span className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    RC / BN Number:
                  </span>
                  <span className={`font-bold font-mono text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>{selectedVendor.rc_bn_number}</span>
                </div>
                <div>
                  <span className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Tax Identification (TIN):
                  </span>
                  <span className={`font-bold font-mono text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{selectedVendor.tin_number}</span>
                </div>
                <div>
                  <span className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    VAT Status:
                  </span>
                  <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {selectedVendor.vat_status} {selectedVendor.vat_reg_number ? `(${selectedVendor.vat_reg_number})` : ''}
                  </span>
                </div>

                {/* Primary Contact Person with direct links */}
                <div className={`md:col-span-2 p-4 rounded-xl border shadow-xs ${
                  isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  <span className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Primary Authorized Contact:
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className={`font-extrabold text-sm sm:text-base block ${isDark ? 'text-white' : 'text-slate-950'}`}>
                        {selectedVendor.contact_name}
                      </span>
                      <span className={`text-xs block mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {selectedVendor.contact_designation || 'Authorized Representative'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      {selectedVendor.contact_email && (
                        <a
                          href={`mailto:${selectedVendor.contact_email}`}
                          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold border transition-colors shadow-2xs ${
                            isDark
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 hover:text-emerald-900'
                          }`}
                        >
                          <IconMail className="w-3.5 h-3.5 shrink-0" />
                          <span>{selectedVendor.contact_email}</span>
                        </a>
                      )}
                      {selectedVendor.contact_phone && (
                        <a
                          href={`tel:${selectedVendor.contact_phone}`}
                          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold border transition-colors shadow-2xs ${
                            isDark
                              ? 'bg-blue-950/80 text-blue-300 border-blue-700/80 hover:bg-blue-900'
                              : 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100 hover:text-blue-900'
                          }`}
                        >
                          <IconPhone className="w-3.5 h-3.5 shrink-0" />
                          <span>{selectedVendor.contact_phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Banking Information */}
                <div>
                  <span className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Commercial Bank:
                  </span>
                  <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {selectedVendor.bank_name || 'Not provided'}
                  </span>
                </div>
                <div>
                  <span className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    NUBAN & Currency:
                  </span>
                  <span className={`font-bold font-mono text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {selectedVendor.account_number} ({selectedVendor.currency || 'NGN'})
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Account Holder Name:
                  </span>
                  <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>{selectedVendor.account_name}</span>
                </div>

                {/* Addresses */}
                <div className="md:col-span-2">
                  <span className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Registered Office Address:
                  </span>
                  <span className={`font-semibold block ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{selectedVendor.registered_address}</span>
                  {selectedVendor.operational_address && selectedVendor.operational_address !== selectedVendor.registered_address && (
                    <div className={`mt-2 pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <span className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Operational / Base Yard:
                      </span>
                      <span className={`font-semibold block ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{selectedVendor.operational_address}</span>
                    </div>
                  )}
                </div>

                {/* Nature of Services */}
                <div className="md:col-span-2">
                  <span className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Core Capabilities & Service Categories:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedVendor.nature_of_services.map((s, i) => (
                      <span key={i} className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                      }`}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Uploaded Documents & Declaration Sign-Off */}
                <div className={`md:col-span-2 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
                  isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <span className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Statutory Tax / VAT Document:
                    </span>
                    {selectedVendor.vat_certificate_url ? (
                      <a
                        href={selectedVendor.vat_certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors shadow-2xs ${
                          isDark
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 hover:text-emerald-900'
                        }`}
                      >
                        <IconFileText className="w-3.5 h-3.5" />
                        <span>Inspect Uploaded Certificate / Profile</span>
                        <IconExternal className="w-3 h-3 ml-0.5" />
                      </a>
                    ) : (
                      <span className={`text-xs italic block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        No separate tax document uploaded with initial filing.
                      </span>
                    )}
                  </div>
                  <div className={`sm:border-l sm:pl-4 text-left sm:text-right ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <span className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Declaration Sign-off:
                    </span>
                    <span className={`text-xs font-mono font-bold block ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {selectedVendor.representative_name || selectedVendor.contact_name}
                    </span>
                    <span className={`text-[11px] font-semibold block mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      ✓ Form VOTC/037 Rev. 00 Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* Section G: Internal Review Form */}
              <form onSubmit={handleSaveReview} className={`space-y-5 pt-5 border-t ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div className={`border-b pb-3 flex items-center justify-between ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <h4 className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    Section G: Procurement & Finance Verification
                  </h4>
                  <span className={`text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-md border ${
                    isDark
                      ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                      : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                  }`}>
                    Company Use Only
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                      Application Status <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={reviewForm.status}
                      onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value as VendorApplicationStatus })}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                      }`}
                    >
                      <option value="pending">Pending Review</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved & Enrolled Vendor</option>
                      <option value="needs_clarification">Needs Clarification</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Approved Category */}
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                      Approved Vendor Category
                    </label>
                    <input
                      type="text"
                      list="category-presets"
                      value={reviewForm.approved_vendor_category}
                      onChange={(e) => setReviewForm({ ...reviewForm, approved_vendor_category: e.target.value })}
                      placeholder="e.g. Survey / Geoscience & Offshore Bathymetry"
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 shadow-2xs'
                      }`}
                    />
                    <datalist id="category-presets">
                      {CATEGORY_PRESETS.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  {/* Procurement Reviewer */}
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                      Reviewed By (Procurement Officer)
                    </label>
                    <input
                      type="text"
                      value={reviewForm.procurement_reviewer}
                      onChange={(e) => setReviewForm({ ...reviewForm, procurement_reviewer: e.target.value })}
                      placeholder="e.g. Mrs. Nnenna Adeleke"
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 shadow-2xs'
                      }`}
                    />
                  </div>

                  {/* Finance Reviewer */}
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                      Reviewed By (Finance / Tax Lead)
                    </label>
                    <input
                      type="text"
                      value={reviewForm.finance_reviewer}
                      onChange={(e) => setReviewForm({ ...reviewForm, finance_reviewer: e.target.value })}
                      placeholder="e.g. Mr. Isaac Jumbo"
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 shadow-2xs'
                      }`}
                    />
                  </div>
                </div>

                {/* VAT Status Verified Checkbox */}
                <div className={`p-4 border rounded-xl ${
                  isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-emerald-50/50 border-emerald-200'
                }`}>
                  <label className={`flex items-center space-x-3 cursor-pointer text-xs font-bold ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}>
                    <input
                      type="checkbox"
                      checked={reviewForm.vat_status_verified}
                      onChange={(e) => setReviewForm({ ...reviewForm, vat_status_verified: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-600 w-4 h-4"
                    />
                    <span>VAT Status & NRS Registration Officially Verified</span>
                  </label>
                </div>

                {/* Internal Notes */}
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                    Internal Reviewer Audit Notes & Guidance
                  </label>
                  <textarea
                    rows={3}
                    value={reviewForm.internal_notes}
                    onChange={(e) => setReviewForm({ ...reviewForm, internal_notes: e.target.value })}
                    placeholder="Enter notes on credential verification, tax checks, or required clarifications..."
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 shadow-2xs'
                    }`}
                  />
                </div>

                {/* Submit button */}
                <div className={`flex items-center justify-end space-x-3 pt-5 border-t ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <button
                    type="button"
                    onClick={() => setIsReviewDrawerOpen(false)}
                    className={`px-4 py-2.5 border rounded-xl text-xs font-bold uppercase transition-colors ${
                      isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 shadow-2xs'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingReview}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
                  >
                    {isSavingReview ? 'Saving Section G Review...' : 'Save & Update Status'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminVendors;
