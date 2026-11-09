import React, { useState } from 'react';
import {
  Campaign,
  CampaignEmailTemplate,
  CampaignEmailLog
} from '../../../types/campaign';
import { saveEmailTemplate, retryEmailLog } from '../../../lib/campaignApi';
import { IconCheck, IconMail, IconSend, IconUsers, IconActivity } from '../AdminIcons';

interface CampaignEmailAutomationProps {
  campaign: Campaign;
  template: CampaignEmailTemplate;
  logs: CampaignEmailLog[];
  onTemplateUpdated: (updated: CampaignEmailTemplate) => void;
  onLogsUpdated: (updatedLogs: CampaignEmailLog[]) => void;
}

const SUPPORTED_PLACEHOLDERS = [
  { code: '{{first_name}}', desc: "Visitor's first name" },
  { code: '{{full_name}}', desc: "Visitor's complete name" },
  { code: '{{company_name}}', desc: 'Organization / Company' },
  { code: '{{job_title}}', desc: 'Job designation' },
  { code: '{{email}}', desc: 'Corporate email address' },
  { code: '{{phone}}', desc: 'Phone / WhatsApp number' },
  { code: '{{event_name}}', desc: 'Campaign / Event name' },
  { code: '{{event_location}}', desc: 'Event venue / city' },
  { code: '{{submission_id}}', desc: 'Unique lead reference ID' },
  { code: '{{submission_date}}', desc: 'Date of submission' }
];

export const CampaignEmailAutomation: React.FC<CampaignEmailAutomationProps> = ({
  campaign,
  template,
  logs,
  onTemplateUpdated,
  onLogsUpdated
}) => {
  const [formData, setFormData] = useState<Partial<CampaignEmailTemplate>>({
    ...template,
    internalRecipients: template.internalRecipients || ['admin@polarisigl.com']
  });
  const [internalRecipientsInput, setInternalRecipientsInput] = useState(
    (template.internalRecipients || ['admin@polarisigl.com']).join(', ')
  );
  const [activeTab, setActiveTab] = useState<'editor' | 'logs'>('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [retryingLogId, setRetryingLogId] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const parsedRecipients = internalRecipientsInput
      .split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0 && r.includes('@'));

    try {
      const updated = await saveEmailTemplate({
        ...formData,
        campaignId: campaign.id,
        internalRecipients: parsedRecipients
      });
      onTemplateUpdated(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save email automation settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetry = async (logId: string) => {
    setRetryingLogId(logId);
    try {
      const updatedLog = await retryEmailLog(logId);
      const nextLogs = logs.map(l => (l.id === logId ? updatedLog : l));
      onLogsUpdated(nextLogs);
    } catch (err) {
      console.error(err);
      alert('Retry failed.');
    } finally {
      setRetryingLogId(null);
    }
  };

  const insertPlaceholder = (code: string) => {
    setFormData(prev => ({
      ...prev,
      bodyHtml: (prev.bodyHtml || '') + ` ${code} `
    }));
  };

  return (
    <div className="space-y-6">
      {/* Navigation tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Email Automation Engine</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated visitor acknowledgements &amp; instant executive notifications for <strong>{campaign.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Template Configuration
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <IconActivity className="w-3.5 h-3.5" />
            Dispatch Logs ({logs.length})
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Automation Master Toggle */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <IconMail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Visitor Acknowledgement Automation
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Automatically dispatch a personalized confirmation email when a delegate submits this campaign’s form.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enabled !== false}
                onChange={e => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form Config */}
            <div className="lg:col-span-2 space-y-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Sender Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.senderName || ''}
                    onChange={e => setFormData(prev => ({ ...prev, senderName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Sender Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.senderEmail || ''}
                    onChange={e => setFormData(prev => ({ ...prev, senderEmail: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject || ''}
                  onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Email HTML Body
                  </label>
                  <span className="text-[11px] text-slate-400">Click placeholders on the right to insert</span>
                </div>
                <textarea
                  rows={14}
                  required
                  value={formData.bodyHtml || ''}
                  onChange={e => setFormData(prev => ({ ...prev, bodyHtml: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Internal Stakeholders Notifications */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Internal Team Alert Recipient(s)
                </label>
                <input
                  type="text"
                  placeholder="admin@polarisigl.com, bd@polarisigl.com, md@polarisigl.com"
                  value={internalRecipientsInput}
                  onChange={e => setInternalRecipientsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Separate multiple internal email addresses with commas. Each will receive an immediate notification when a new lead is captured.
                </p>
              </div>
            </div>

            {/* Right 1 Col: Dynamic Placeholders Guide */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Dynamic Placeholders
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any placeholder token below to insert it directly into your email template:
                </p>
                <div className="space-y-2">
                  {SUPPORTED_PLACEHOLDERS.map(p => (
                    <button
                      key={p.code}
                      type="button"
                      onClick={() => insertPlaceholder(p.code)}
                      className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <code className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        {p.code}
                      </code>
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-600">
                        {p.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action save bar */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                {saveSuccess && (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <IconCheck className="w-4 h-4" /> Email template updated!
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <IconSend className="w-4 h-4" />
                  {isSaving ? 'Saving Template...' : 'Save Email Automation'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* EMAIL LOGS VIEW (Part 7.6) */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Automated Email Dispatch Telemetry
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total Recorded: {logs.length}
            </span>
          </div>

          {logs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No emails have been dispatched for this campaign yet. Submissions with valid email addresses will be logged here in real-time.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3">Timestamp</th>
                    <th className="px-6 py-3">Recipient</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Subject</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="px-6 py-3 font-mono text-slate-500">
                        {new Date(log.sentAt).toLocaleString('en-GB')}
                      </td>
                      <td className="px-6 py-3 font-bold text-slate-800 dark:text-white">
                        {log.recipient}
                      </td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-400">
                        {log.emailType === 'visitor_acknowledgement' ? 'Visitor Acknowledgment' : 'Internal Alert'}
                      </td>
                      <td className="px-6 py-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {log.subject}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            log.status === 'sent'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                          }`}
                        >
                          {log.status} (attempt {log.attempts})
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {log.status === 'failed' && (
                          <button
                            type="button"
                            onClick={() => handleRetry(log.id)}
                            disabled={retryingLogId === log.id}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold cursor-pointer"
                          >
                            {retryingLogId === log.id ? 'Retrying...' : 'Retry'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
