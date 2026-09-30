import React, { useState } from 'react';
import { ContactInquiry } from '../../types';
import {
  IconSearch,
  IconDownload,
  IconTrash,
  IconInquiries,
  IconChevronRight
} from '../../components/admin/AdminIcons';

interface AdminInquiriesProps {
  inquiries: ContactInquiry[];
  loading: boolean;
  onUpdateStatus: (id: string, status: ContactInquiry['status'], notes?: string) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  theme?: 'light' | 'dark';
}

const AdminInquiries: React.FC<AdminInquiriesProps> = ({
  inquiries,
  loading,
  onUpdateStatus,
  onDelete,
  theme = 'light'
}) => {
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [savingNotes, setSavingNotes] = useState<boolean>(false);

  const isDark = theme === 'dark';

  const filtered = inquiries.filter(i => {
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchesSearch =
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.company && i.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      i.service_interest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenDrawer = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setInternalNotes(inquiry.notes || '');
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setSavingNotes(true);
    await onUpdateStatus(selectedInquiry.id, selectedInquiry.status, internalNotes);
    setSelectedInquiry(prev => prev ? { ...prev, notes: internalNotes } : null);
    setSavingNotes(false);
  };

  const handleStatusChange = async (newStatus: ContactInquiry['status']) => {
    if (!selectedInquiry) return;
    await onUpdateStatus(selectedInquiry.id, newStatus, internalNotes);
    setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const exportCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Company', 'Service Interest', 'Status', 'Message', 'Notes'];
    const rows = inquiries.map(i => [
      `"${new Date(i.created_at).toLocaleString()}"`,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.email.replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.company || '').replace(/"/g, '""')}"`,
      `"${i.service_interest.replace(/"/g, '""')}"`,
      `"${i.status}"`,
      `"${i.message.replace(/"/g, '""')}"`,
      `"${(i.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PIGL_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: ContactInquiry['status']) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/50">Pending</span>;
      case 'in_review':
        return <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300/60 dark:border-blue-700/50">In Review</span>;
      case 'responded':
        return <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/50">Responded</span>;
      case 'archived':
        return <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">Archived</span>;
    }
  };

  return (
    <div className={`space-y-6 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Client Consultations & RFPs Desk
            </h1>
            <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
              isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}>
              {inquiries.filter(i => i.status === 'new').length} Pending
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Review incoming project scoping requests, update commercial response status, and record private notes.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 shadow-xs self-start sm:self-auto"
        >
          <IconDownload className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className={`p-4 rounded-2xl border shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="relative w-full md:w-84">
          <IconSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries by client, company, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
              isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Inquiries' },
            { id: 'new', label: 'Pending' },
            { id: 'in_review', label: 'In Review' },
            { id: 'responded', label: 'Responded' },
            { id: 'archived', label: 'Archived' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      <div className={`border rounded-2xl shadow-xs overflow-hidden transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            Loading consultations ledger...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            No inquiries match your current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className={`border-b text-xs font-bold uppercase tracking-wider ${
                isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <tr>
                  <th className="py-3.5 px-4 sm:px-5">Client / Organization</th>
                  <th className="py-3.5 px-4 sm:px-5">Service Scope</th>
                  <th className="py-3.5 px-4 sm:px-5">Status</th>
                  <th className="py-3.5 px-4 sm:px-5">Message Snippet</th>
                  <th className="py-3.5 px-4 sm:px-5">Date Logged</th>
                  <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-slate-100 text-slate-800'}`}>
                {filtered.map((inq) => (
                  <tr
                    key={inq.id}
                    onClick={() => handleOpenDrawer(inq)}
                    className={`transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-4 px-4 sm:px-5">
                      <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {inq.name}
                      </div>
                      <div className={`text-xs font-mono mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {inq.company ? `${inq.company} • ` : ''}{inq.email}
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-5">
                      <span className={`inline-block font-semibold px-2.5 py-1 rounded-md text-xs border ${
                        isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}>
                        {inq.service_interest}
                      </span>
                    </td>

                    <td className="py-4 px-4 sm:px-5">
                      {getStatusBadge(inq.status)}
                    </td>

                    <td className="py-4 px-4 sm:px-5 max-w-xs">
                      <p className={`truncate text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {inq.message}
                      </p>
                    </td>

                    <td className={`py-4 px-4 sm:px-5 font-mono text-xs whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {new Date(inq.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    <td className="py-4 px-4 sm:px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenDrawer(inq)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                            isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          Review
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete inquiry from ${inq.name}?`)) {
                              onDelete(inq.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          title="Delete inquiry"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Drawer Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-2xl shadow-2xl border w-full max-w-2xl overflow-hidden animate-scaleIn ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-bold tracking-tight">{selectedInquiry.name}</h3>
                  {getStatusBadge(selectedInquiry.status)}
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {selectedInquiry.company || 'Direct Consultation'} • {selectedInquiry.email} {selectedInquiry.phone ? `• ${selectedInquiry.phone}` : ''}
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl border ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className={`text-xs uppercase font-bold tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Service Scope</span>
                  <div className={`text-sm font-extrabold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>{selectedInquiry.service_interest}</div>
                </div>
                <div>
                  <span className={`text-xs uppercase font-bold tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Timestamp</span>
                  <div className={`text-xs font-mono font-bold mt-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    {new Date(selectedInquiry.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <span className={`text-xs font-bold uppercase tracking-wider block mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Client Message
                </span>
                <div className={`p-4 border rounded-xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900 font-medium'
                }`}>
                  {selectedInquiry.message}
                </div>
              </div>

              <div>
                <span className={`text-xs font-bold uppercase tracking-wider block mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Update Lead Status
                </span>
                <div className="flex flex-wrap gap-2">
                  {(['new', 'in_review', 'responded', 'archived'] as ContactInquiry['status'][]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedInquiry.status === st
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                          : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      {st === 'new' && 'Pending'}
                      {st === 'in_review' && 'In Review'}
                      {st === 'responded' && 'Responded'}
                      {st === 'archived' && 'Archived'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Internal Engineering & Commercial Notes
                  </span>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Internal only</span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Record proposal notes, assigned lead engineer, or follow-up timelines..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className={`w-full p-3.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 shadow-2xs'
                  }`}
                />
              </div>

              <div className={`flex items-center justify-between pt-4 border-t ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <a
                  href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(`PIGL Response: ${selectedInquiry.service_interest}`)}`}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-2 border ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                      : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
                  }`}
                >
                  <span>Open Email Client</span>
                </a>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(null)}
                    className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-colors ${
                      isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs"
                  >
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;
