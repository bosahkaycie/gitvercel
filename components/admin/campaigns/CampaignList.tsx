import React, { useState } from 'react';
import { Campaign, CampaignCategory, CampaignStatus } from '../../../types/campaign';
import { deleteCampaign } from '../../../lib/campaignApi';
import {
  IconSearch,
  IconPlus,
  IconUsers,
  IconExternal,
  IconTrash,
  IconSettings
} from '../AdminIcons';

interface CampaignListProps {
  campaigns: Campaign[];
  onCreateClick: () => void;
  onEditCampaign: (campaign: Campaign) => void;
  onOpenQRCode: (campaign: Campaign) => void;
  onOpenBoothCapture: (campaign: Campaign) => void;
  onCampaignsUpdated: (updatedList: Campaign[]) => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  onCreateClick,
  onEditCampaign,
  onOpenQRCode,
  onOpenBoothCapture,
  onCampaignsUpdated
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const filteredCampaigns = campaigns.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !term ||
      c.name.toLowerCase().includes(term) ||
      c.eventName.toLowerCase().includes(term) ||
      c.eventLocation.toLowerCase().includes(term);

    const matchCat = categoryFilter === 'all' || c.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchSearch && matchCat && matchStatus;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete campaign "${name}" and all its recorded leads?`)) {
      return;
    }
    setIsDeletingId(id);
    try {
      await deleteCampaign(id);
      onCampaignsUpdated(campaigns.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete campaign.');
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Event Campaigns</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active and archived conference campaigns ({campaigns.length} total)
          </p>
        </div>

        <button
          onClick={onCreateClick}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
        >
          <IconPlus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative">
          <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Categories</option>
            <option value="Conference">Conference</option>
            <option value="Exhibition">Exhibition</option>
            <option value="Stakeholder Engagement">Stakeholder Engagement</option>
            <option value="Corporate Event">Corporate Event</option>
            <option value="Seminar">Seminar</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {filteredCampaigns.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <p className="text-sm font-semibold">No campaigns match your filter.</p>
            <p className="text-xs">Create your first campaign to begin collecting event leads.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Campaign &amp; Event</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Event Dates</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCampaigns.map(camp => (
                  <tr key={camp.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {camp.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {camp.eventName} &bull; {camp.eventLocation}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-mono mt-1">
                        /campaigns/{camp.slug}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        {camp.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">
                      {camp.eventStartDate} &rarr; {camp.eventEndDate}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          camp.status === 'active'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : camp.status === 'draft'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* QR Code button */}
                        <button
                          type="button"
                          onClick={() => onOpenQRCode(camp)}
                          className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 rounded-lg font-bold text-[11px] cursor-pointer flex items-center gap-1"
                          title="Generate and Download QR Code"
                        >
                          QR Code
                        </button>

                        {/* Booth capture button */}
                        <button
                          type="button"
                          onClick={() => onOpenBoothCapture(camp)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] cursor-pointer flex items-center gap-1"
                          title="Open Stand Visitor Capture"
                        >
                          <IconUsers className="w-3.5 h-3.5" />
                          Booth
                        </button>

                        {/* Edit details */}
                        <button
                          type="button"
                          onClick={() => onEditCampaign(camp)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
                          title="Edit Campaign Details"
                        >
                          <IconSettings className="w-4 h-4" />
                        </button>

                        {/* Open public link */}
                        <a
                          href={`/campaigns/${camp.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg"
                          title="View Public Form"
                        >
                          <IconExternal className="w-4 h-4" />
                        </a>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(camp.id, camp.name)}
                          disabled={isDeletingId === camp.id}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
                          title="Delete Campaign"
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
    </div>
  );
};
