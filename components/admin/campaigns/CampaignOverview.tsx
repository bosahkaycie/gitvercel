import React from 'react';
import {
  Campaign,
  CampaignSubmission,
  CampaignStatsSummary
} from '../../../types/campaign';
import {
  IconCampaign,
  IconUsers,
  IconMail,
  IconActivity,
  IconTrendingUp,
  IconPlus,
  IconCheck
} from '../AdminIcons';

interface CampaignOverviewProps {
  stats: CampaignStatsSummary;
  campaigns: Campaign[];
  onCreateCampaignClick: () => void;
  onSelectCampaign: (campaign: Campaign) => void;
  onOpenBoothCapture: () => void;
}

export const CampaignOverview: React.FC<CampaignOverviewProps> = ({
  stats,
  campaigns,
  onCreateCampaignClick,
  onSelectCampaign,
  onOpenBoothCapture
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-2xl border border-emerald-900/40 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
            PIGL Business Development &amp; Events
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-3 text-white">
            Campaign &amp; Engagement Manager
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Manage multi-event lead acquisition across international conferences, oil &amp; gas exhibitions, and technical seminars. Generate dynamic forms, shareable QR codes, automated email responses, and track corporate prospects in real-time.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onCreateCampaignClick}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-emerald-900/40 flex items-center gap-2 cursor-pointer"
            >
              <IconPlus className="w-4 h-4" /> Create New Campaign
            </button>
            <button
              onClick={onOpenBoothCapture}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <IconUsers className="w-4 h-4" /> Quick Booth Capture
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid (Part 2.1) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Campaigns */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Campaigns</span>
            <IconCampaign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalCampaigns}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">{stats.activeCampaigns} Active</span>
            <span>&bull;</span>
            <span>{stats.draftCampaigns} Draft</span>
          </div>
        </div>

        {/* Total Visitors Captured */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Leads</span>
            <IconUsers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalSubmissions}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span>{stats.publicSubmissions} via QR/Web</span>
            <span>&bull;</span>
            <span>{stats.boothSubmissions} Booth</span>
          </div>
        </div>

        {/* Automated Emails Dispatched */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Emails Dispatched</span>
            <IconMail className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalEmailsSent}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">100% Automated</span>
            {stats.totalEmailsFailed > 0 && (
              <span className="text-red-500 font-bold">({stats.totalEmailsFailed} failed)</span>
            )}
          </div>
        </div>

        {/* Conversion & Active Status */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Events</span>
            <IconActivity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {stats.activeCampaigns} Live
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Ready for real-time mobile scanning
          </div>
        </div>
      </div>

      {/* Two Column Layout: Active Campaigns Table + Recent Submissions Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Active & Recent Campaigns */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Current Event Campaigns</h3>
              <p className="text-xs text-slate-500">Select any campaign to manage forms, QR codes, and leads</p>
            </div>
            <button
              onClick={onCreateCampaignClick}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
            >
              + New Campaign
            </button>
          </div>

          <div className="space-y-3">
            {campaigns.map(camp => (
              <div
                key={camp.id}
                onClick={() => onSelectCampaign(camp)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600">
                      {camp.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        camp.status === 'active'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : camp.status === 'draft'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                    {camp.eventName} &bull; {camp.eventLocation}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-emerald-600 flex items-center gap-1">
                    Manage &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Recent Leads Feed */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Visitor Submissions</h3>
              <p className="text-xs text-slate-500">Live feed across all active campaigns</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
              LIVE
            </span>
          </div>

          {stats.recentSubmissions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <IconUsers className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p>No recent submissions logged yet.</p>
              <p className="text-[11px]">Submissions from public QR codes and booth staff will stream here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentSubmissions.slice(0, 5).map(sub => (
                <div
                  key={sub.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{sub.visitorName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(sub.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 truncate">
                    {sub.visitorCompany || 'Direct Delegate'} &bull; {sub.visitorEmail}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                      {sub.source === 'booth_capture' ? 'Booth' : 'QR/Web'}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-300">
                      {sub.followUpStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
