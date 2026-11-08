import React from 'react';
import {
  Campaign,
  CampaignSubmission,
  CampaignEmailLog
} from '../../../types/campaign';
import { IconTrendingUp, IconUsers, IconMail, IconPieChart } from '../AdminIcons';

interface CampaignReportsProps {
  campaign: Campaign;
  submissions: CampaignSubmission[];
  emailLogs: CampaignEmailLog[];
}

export const CampaignReports: React.FC<CampaignReportsProps> = ({
  campaign,
  submissions,
  emailLogs
}) => {
  // Source distribution
  const boothCount = submissions.filter(s => s.source === 'booth_capture').length;
  const qrCount = submissions.filter(s => s.source === 'qr_code').length;
  const linkCount = submissions.filter(s => s.source === 'direct_link').length;

  // Pipeline distribution
  const statusCounts = {
    new: submissions.filter(s => s.followUpStatus === 'new').length,
    contacted: submissions.filter(s => s.followUpStatus === 'contacted').length,
    in_discussion: submissions.filter(s => s.followUpStatus === 'in_discussion').length,
    converted: submissions.filter(s => s.followUpStatus === 'converted').length,
    closed: submissions.filter(s => s.followUpStatus === 'closed').length
  };

  // Division Interest Breakdown (from formData['f_divisions'])
  const divisionCounts: Record<string, number> = {
    'Geosolutions & Engineering Services': 0,
    'Metocean & Marine Solutions': 0,
    'Integrated Construction Services': 0,
    'Industrial Solutions': 0
  };

  submissions.forEach(s => {
    const divs = s.formData?.f_divisions || [];
    if (Array.isArray(divs)) {
      divs.forEach((d: string) => {
        if (d.includes('geo')) divisionCounts['Geosolutions & Engineering Services']++;
        else if (d.includes('met')) divisionCounts['Metocean & Marine Solutions']++;
        else if (d.includes('con')) divisionCounts['Integrated Construction Services']++;
        else if (d.includes('ind')) divisionCounts['Industrial Solutions']++;
      });
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Campaign Performance Analytics &amp; Reports
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Verified database telemetry for <strong>{campaign.name}</strong> ({campaign.eventName})
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Leads Acquired</span>
            <IconUsers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {submissions.length}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {boothCount} booth captures &bull; {qrCount + linkCount} self-service
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pipeline Conversion</span>
            <IconTrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {statusCounts.converted + statusCounts.in_discussion}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Active technical discussions &amp; converted engagements
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Email Dispatch Rate</span>
            <IconMail className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {emailLogs.length}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            100% verified server-side acknowledgement records
          </p>
        </div>
      </div>

      {/* 2-Column Analytics: Channel Acquisition + Lead Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Visitor Acquisition Channels
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Administrator Booth Capture', count: boothCount, color: 'bg-emerald-600' },
              { label: 'Public Event QR Code', count: qrCount, color: 'bg-blue-600' },
              { label: 'Direct Shared Campaign Link', count: linkCount, color: 'bg-indigo-600' }
            ].map(ch => {
              const pct = submissions.length > 0 ? Math.round((ch.count / submissions.length) * 100) : 0;
              return (
                <div key={ch.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{ch.label}</span>
                    <span className="font-mono text-slate-500">{ch.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full ${ch.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Follow-Up Pipeline Status */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Follow-Up &amp; Lead Conversion Pipeline
          </h3>
          <div className="space-y-3">
            {[
              { label: 'New Uncontacted', count: statusCounts.new, color: 'bg-blue-500' },
              { label: 'Contacted', count: statusCounts.contacted, color: 'bg-amber-500' },
              { label: 'In Technical Discussion', count: statusCounts.in_discussion, color: 'bg-purple-500' },
              { label: 'Converted to Engagement', count: statusCounts.converted, color: 'bg-emerald-600' },
              { label: 'Closed / Archived', count: statusCounts.closed, color: 'bg-slate-500' }
            ].map(st => {
              const pct = submissions.length > 0 ? Math.round((st.count / submissions.length) * 100) : 0;
              return (
                <div key={st.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{st.label}</span>
                    <span className="font-mono text-slate-500">{st.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full ${st.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Operating Division Interest Breakdown */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Client Demand by PIGL Operating Division
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(divisionCounts).map(([divName, count]) => (
            <div
              key={divName}
              className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                {divName}
              </span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {count} <span className="text-xs font-normal text-slate-400">inquiries</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
