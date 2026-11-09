import React, { useState } from 'react';
import {
  Campaign,
  CampaignSubmission,
  CampaignFormField,
  LeadFollowUpStatus
} from '../../../types/campaign';
import { updateLeadStatus, addLeadNote, exportLeadsToCsv } from '../../../lib/campaignApi';
import {
  IconSearch,
  IconUsers,
  IconCheck,
  IconPlus,
  IconExternal,
  IconX
} from '../AdminIcons';

interface CampaignLeadsProps {
  campaign: Campaign;
  submissions: CampaignSubmission[];
  fields?: CampaignFormField[];
  adminEmail: string;
  onOpenBoothCapture: () => void;
  onSubmissionsUpdated: (updatedSubs: CampaignSubmission[]) => void;
}

const STATUS_BADGES: Record<LeadFollowUpStatus, { label: string; color: string }> = {
  new: { label: 'New Lead', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
  contacted: { label: 'Contacted', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  in_discussion: { label: 'In Discussion', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' },
  converted: { label: 'Converted', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  closed: { label: 'Closed / Archived', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' }
};

export const CampaignLeads: React.FC<CampaignLeadsProps> = ({
  campaign,
  submissions,
  fields = [],
  adminEmail,
  onOpenBoothCapture,
  onSubmissionsUpdated
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<CampaignSubmission | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Filtered leads
  const filteredSubmissions = submissions.filter(s => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !term ||
      s.visitorName.toLowerCase().includes(term) ||
      s.visitorEmail.toLowerCase().includes(term) ||
      (s.visitorCompany || '').toLowerCase().includes(term) ||
      (s.visitorPhone || '').toLowerCase().includes(term);

    const matchStatus = statusFilter === 'all' || s.followUpStatus === statusFilter;
    const matchSource = sourceFilter === 'all' || s.source === sourceFilter;

    return matchSearch && matchStatus && matchSource;
  });

  // Handle status update
  const handleStatusChange = async (submissionId: string, newStatus: LeadFollowUpStatus) => {
    setIsUpdating(true);
    try {
      const updated = await updateLeadStatus(submissionId, newStatus);
      const nextList = submissions.map(s => (s.id === submissionId ? updated : s));
      onSubmissionsUpdated(nextList);
      if (selectedLead?.id === submissionId) {
        setSelectedLead(updated);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle add note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;

    try {
      const updated = await addLeadNote(selectedLead.id, newNoteText.trim(), adminEmail);
      const nextList = submissions.map(s => (s.id === selectedLead.id ? updated : s));
      onSubmissionsUpdated(nextList);
      setSelectedLead(updated);
      setNewNoteText('');
    } catch (err) {
      console.error(err);
      alert('Failed to add note.');
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    exportLeadsToCsv(campaign, filteredSubmissions, fields);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Leads &amp; Visitor Submissions</h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Stream
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Registered prospects &amp; delegates for <strong>{campaign.name}</strong> ({submissions.length} total) &bull; Synchronizes automatically in real time
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenBoothCapture}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <IconPlus className="w-3.5 h-3.5" />
            Capture Visitor
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={submissions.length === 0}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-40"
          >
            Export to CSV / Excel
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative">
          <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, organization, email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Follow-Up Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="in_discussion">In Discussion</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Acquisition Sources</option>
            <option value="qr_code">Public QR Code</option>
            <option value="direct_link">Shared Campaign Link</option>
            <option value="booth_capture">Administrator Booth Capture</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <IconUsers className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold">No visitor submissions match your filter criteria.</p>
            <p className="text-xs">Share your campaign QR code or use the "Capture Visitor" button to record booth leads.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Visitor / Delegate</th>
                  <th className="px-5 py-3">Organization &amp; Title</th>
                  <th className="px-5 py-3">Contact Details</th>
                  <th className="px-5 py-3">Acquisition Channel</th>
                  <th className="px-5 py-3">Follow-up Pipeline</th>
                  <th className="px-5 py-3">Submission Date</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSubmissions.map(sub => {
                  const badge = STATUS_BADGES[sub.followUpStatus] || STATUS_BADGES.new;
                  return (
                    <tr
                      key={sub.id}
                      onClick={() => setSelectedLead(sub)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{sub.visitorName}</span>
                          {(Date.now() - new Date(sub.createdAt).getTime()) < 300000 && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white animate-pulse shrink-0">
                              NEW
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {sub.id.substring(0, 16)}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {sub.visitorCompany || '—'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {sub.visitorJobTitle || '—'}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="text-slate-800 dark:text-slate-200">
                          {sub.visitorEmail}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {sub.visitorPhone || '—'}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                            sub.source === 'booth_capture'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : sub.source === 'qr_code'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {sub.source === 'booth_capture'
                            ? 'Booth Capture'
                            : sub.source === 'qr_code'
                            ? 'Public QR Code'
                            : 'Shared Link'}
                        </span>
                      </td>

                      <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                        <select
                          value={sub.followUpStatus}
                          onChange={e => handleStatusChange(sub.id, e.target.value as LeadFollowUpStatus)}
                          className={`text-[10px] font-bold uppercase tracking-wider rounded-md px-2 py-1 border-0 cursor-pointer ${badge.color}`}
                        >
                          <option value="new">New Lead</option>
                          <option value="contacted">Contacted</option>
                          <option value="in_discussion">In Discussion</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed / Archived</option>
                        </select>
                      </td>

                      <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                        {new Date(sub.createdAt).toLocaleDateString('en-GB')}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLead(sub)}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          View Details &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* LEAD DETAIL DRAWER / MODAL (Part 8.2) */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
            {/* Drawer Header */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedLead.visitorName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedLead.visitorCompany || 'Independent Delegate'} &bull; {selectedLead.visitorJobTitle || 'Representative'}
                </p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Status and Source row */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Follow-Up Status
                  </span>
                  <select
                    value={selectedLead.followUpStatus}
                    onChange={e => handleStatusChange(selectedLead.id, e.target.value as LeadFollowUpStatus)}
                    className="font-bold text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-slate-900 dark:text-white"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_discussion">In Discussion</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed / Archived</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Collection Channel
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {selectedLead.source === 'booth_capture'
                      ? 'Administrator Booth Capture'
                      : selectedLead.source === 'qr_code'
                      ? 'Public QR Code'
                      : 'Shared Campaign Link'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Captured Timestamp
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {new Date(selectedLead.createdAt).toLocaleString('en-GB')}
                  </span>
                </div>
              </div>

              {/* Complete Form Submission Answers */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Submitted Form Answers
                </h4>
                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  {Object.entries(selectedLead.formData).map(([key, value]) => {
                    // Match with form field label if available
                    const matchedField = fields.find(f => f.id === key);
                    const label = matchedField ? matchedField.label : key.replace(/^f_/, '').replace(/_/g, ' ');
                    return (
                      <div key={key} className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 border-b border-slate-100 dark:border-slate-800/60 pb-2 last:border-0 last:pb-0">
                        <span className="font-semibold text-slate-600 dark:text-slate-400 capitalize">
                          {label}:
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white text-right max-w-sm break-words">
                          {Array.isArray(value) ? value.join(', ') : typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value || '—')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Follow-up Notes & Activity Log */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Follow-up Notes &amp; Activity Log ({selectedLead.notes?.length || 0})
                </h4>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Add follow-up note, meeting outcome, phone summary..."
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Add Note
                  </button>
                </form>

                {selectedLead.notes && selectedLead.notes.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedLead.notes.map(note => (
                      <div
                        key={note.id}
                        className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                      >
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{note.content}</p>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{note.author}</span>
                          <span className="font-mono">{new Date(note.createdAt).toLocaleString('en-GB')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs italic">No activity notes recorded yet.</p>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
