import React, { useState, useEffect } from 'react';
import {
  Campaign,
  CampaignForm,
  CampaignSubmission,
  CampaignEmailTemplate,
  CampaignEmailLog,
  CampaignStatsSummary
} from '../../../types/campaign';
import {
  getCampaigns,
  getCampaignDetails,
  getCampaignStats
} from '../../../lib/campaignApi';
import { CampaignOverview } from '../../../components/admin/campaigns/CampaignOverview';
import { CampaignList } from '../../../components/admin/campaigns/CampaignList';
import { CampaignEditor } from '../../../components/admin/campaigns/CampaignEditor';
import { CampaignFormBuilder } from '../../../components/admin/campaigns/CampaignFormBuilder';
import { CampaignEmailAutomation } from '../../../components/admin/campaigns/CampaignEmailAutomation';
import { CampaignLeads } from '../../../components/admin/campaigns/CampaignLeads';
import { CampaignReports } from '../../../components/admin/campaigns/CampaignReports';
import { CampaignSettings } from '../../../components/admin/campaigns/CampaignSettings';
import { CampaignQRCodeModal } from '../../../components/admin/campaigns/CampaignQRCodeModal';
import { BoothCaptureModal } from '../../../components/admin/campaigns/BoothCaptureModal';
import {
  IconCampaign,
  IconDashboard,
  IconPlus,
  IconFileCheck,
  IconMail,
  IconUsers,
  IconTrendingUp,
  IconSettings,
  IconChevronDown,
  IconExternal
} from '../../../components/admin/AdminIcons';

export type CampaignSubTab =
  | 'overview'
  | 'all'
  | 'create'
  | 'forms'
  | 'emails'
  | 'leads'
  | 'reports'
  | 'settings';

interface CampaignManagerProps {
  initialSubTab?: CampaignSubTab;
  adminEmail?: string;
  theme?: 'light' | 'dark';
  onNavigateTab?: (tab: string) => void;
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({
  initialSubTab = 'overview',
  adminEmail = 'admin@polarisigl.com',
  theme = 'light',
  onNavigateTab
}) => {
  const [subTab, setSubTab] = useState<CampaignSubTab>(initialSubTab);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [activeForm, setActiveForm] = useState<CampaignForm | null>(null);
  const [activeEmailTemplate, setActiveEmailTemplate] = useState<CampaignEmailTemplate | null>(null);
  const [submissions, setSubmissions] = useState<CampaignSubmission[]>([]);
  const [emailLogs, setEmailLogs] = useState<CampaignEmailLog[]>([]);
  const [stats, setStats] = useState<CampaignStatsSummary>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    draftCampaigns: 0,
    completedCampaigns: 0,
    totalSubmissions: 0,
    publicSubmissions: 0,
    boothSubmissions: 0,
    totalEmailsSent: 0,
    totalEmailsFailed: 0,
    recentSubmissions: [],
    recentCampaigns: []
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [qrModalCampaign, setQrModalCampaign] = useState<Campaign | null>(null);
  const [boothModalCampaign, setBoothModalCampaign] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // Sync with prop when external tab changes
  useEffect(() => {
    if (initialSubTab) {
      if (initialSubTab === 'create') {
        setEditingCampaign(null);
      }
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const switchSubTab = (newSubTab: CampaignSubTab) => {
    if (newSubTab === 'create') {
      setEditingCampaign(null);
    }
    setSubTab(newSubTab);
    if (onNavigateTab) {
      onNavigateTab(`campaign-${newSubTab === 'all' ? 'manager' : newSubTab}`);
    }
  };

  // Load initial data
  const loadData = async (preferredId?: string) => {
    setLoading(true);
    try {
      const [allCamps, currentStats] = await Promise.all([
        getCampaigns(),
        getCampaignStats()
      ]);
      setCampaigns(allCamps);
      setStats(currentStats);

      const targetId = preferredId || selectedCampaignId || (allCamps.length > 0 ? allCamps[0].id : '');
      if (targetId) {
        setSelectedCampaignId(targetId);
        try {
          const details = await getCampaignDetails(targetId);
          setActiveForm(details.form);
          setActiveEmailTemplate(details.emailTemplate);
          setSubmissions(details.submissions);
          setEmailLogs(details.emailLogs);
        } catch (detailErr) {
          console.warn('Could not load details for campaign:', targetId, detailErr);
        }
      }
    } catch (err) {
      console.error('Error initializing campaigns data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // When selected campaign changes, fetch its children
  const handleSelectCampaign = async (camp: Campaign) => {
    setSelectedCampaignId(camp.id);
    try {
      const details = await getCampaignDetails(camp.id);
      setActiveForm(details.form);
      setActiveEmailTemplate(details.emailTemplate);
      setSubmissions(details.submissions);
      setEmailLogs(details.emailLogs);
    } catch (err) {
      console.error(err);
    }
  };

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0] || null;

  const navItems: { id: CampaignSubTab; label: string; icon: React.FC<any> }[] = [
    { id: 'overview', label: 'Overview', icon: IconDashboard },
    { id: 'all', label: 'All Campaigns', icon: IconCampaign },
    { id: 'create', label: 'Create Campaign', icon: IconPlus },
    { id: 'forms', label: 'Form Builder', icon: IconFileCheck },
    { id: 'emails', label: 'Email Automation', icon: IconMail },
    { id: 'leads', label: 'Leads & Submissions', icon: IconUsers },
    { id: 'reports', label: 'Campaign Reports', icon: IconTrendingUp },
    { id: 'settings', label: 'Settings', icon: IconSettings }
  ];

  if (loading && campaigns.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Loading Campaigns &amp; Lead Capture Portal...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Module Title & Active Campaign Quick Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Campaigns &amp; Lead Capture
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Event registration, dynamic form generation, QR codes, automated email workflows, and booth captures.
          </p>
        </div>

        {/* Campaign Switcher Dropdown */}
        {campaigns.length > 0 && selectedCampaign && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Active Context:
            </span>
            <div className="relative">
              <select
                value={selectedCampaignId}
                onChange={e => {
                  const camp = campaigns.find(c => c.id === e.target.value);
                  if (camp) handleSelectCampaign(camp);
                }}
                className="w-full sm:w-64 pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none"
              >
                {campaigns.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.status.toUpperCase()})
                  </option>
                ))}
              </select>
              <IconChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick QR code button */}
            <button
              type="button"
              onClick={() => setQrModalCampaign(selectedCampaign)}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Show Campaign QR Code"
            >
              QR
            </button>
          </div>
        )}
      </div>

      {/* Internal Sub-Navigation Tabs (Matches Part 2 Specifications) */}
      <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl flex items-center gap-1 overflow-x-auto select-none border border-slate-200 dark:border-slate-700/60">
        {navItems.map(item => {
          const isActive = subTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => switchSubTab(item.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.id === 'leads' && submissions.length > 0 && (
                <span className="px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded text-[10px] font-mono">
                  {submissions.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-Tab View Switching */}
      {subTab === 'overview' && (
        <CampaignOverview
          stats={stats}
          campaigns={campaigns}
          onCreateCampaignClick={() => switchSubTab('create')}
          onSelectCampaign={camp => {
            handleSelectCampaign(camp);
            switchSubTab('leads');
          }}
          onOpenBoothCapture={() => {
            if (selectedCampaign) setBoothModalCampaign(selectedCampaign);
          }}
        />
      )}

      {subTab === 'all' && (
        <CampaignList
          campaigns={campaigns}
          onCreateClick={() => switchSubTab('create')}
          onEditCampaign={camp => {
            setEditingCampaign(camp);
            setSubTab('create');
          }}
          onOpenQRCode={camp => setQrModalCampaign(camp)}
          onOpenBoothCapture={camp => setBoothModalCampaign(camp)}
          onCampaignsUpdated={updated => {
            setCampaigns(updated);
            loadData();
          }}
        />
      )}

      {subTab === 'create' && (
        <CampaignEditor
          key={editingCampaign?.id || 'new-campaign'}
          campaign={editingCampaign}
          adminEmail={adminEmail}
          onSaved={saved => {
            loadData(saved.id);
            setEditingCampaign(null);
            switchSubTab('all');
          }}
          onCancel={() => {
            setEditingCampaign(null);
            switchSubTab('all');
          }}
        />
      )}

      {(subTab === 'forms' || subTab === 'emails' || subTab === 'leads' || subTab === 'reports') && campaigns.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl flex items-center justify-center mx-auto text-emerald-600">
            <IconCampaign className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Campaigns Created Yet
          </h3>
          <p className="text-xs text-slate-500">
            Create your first event campaign to begin building customized registration forms, automated email workflows, and capturing leads.
          </p>
          <button
            onClick={() => switchSubTab('create')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <IconPlus className="w-4 h-4" /> Create Campaign Now
          </button>
        </div>
      )}

      {subTab === 'forms' && selectedCampaign && activeForm && (
        <CampaignFormBuilder
          campaign={selectedCampaign}
          form={activeForm}
          onFormUpdated={updated => setActiveForm(updated)}
        />
      )}

      {subTab === 'emails' && selectedCampaign && activeEmailTemplate && (
        <CampaignEmailAutomation
          campaign={selectedCampaign}
          template={activeEmailTemplate}
          logs={emailLogs}
          onTemplateUpdated={updated => setActiveEmailTemplate(updated)}
          onLogsUpdated={updatedLogs => setEmailLogs(updatedLogs)}
        />
      )}

      {subTab === 'leads' && selectedCampaign && (
        <CampaignLeads
          campaign={selectedCampaign}
          submissions={submissions}
          fields={activeForm?.versions.find(v => v.versionNumber === activeForm.activeVersion)?.fields}
          adminEmail={adminEmail}
          onOpenBoothCapture={() => setBoothModalCampaign(selectedCampaign)}
          onSubmissionsUpdated={updatedSubs => setSubmissions(updatedSubs)}
        />
      )}

      {subTab === 'reports' && selectedCampaign && (
        <CampaignReports
          campaign={selectedCampaign}
          submissions={submissions}
          emailLogs={emailLogs}
        />
      )}

      {subTab === 'settings' && <CampaignSettings />}

      {/* Global QR Code Modal */}
      {qrModalCampaign && (
        <CampaignQRCodeModal
          campaign={qrModalCampaign}
          isOpen={Boolean(qrModalCampaign)}
          onClose={() => setQrModalCampaign(null)}
        />
      )}

      {/* Global Booth Capture Modal */}
      {boothModalCampaign && (
        <BoothCaptureModal
          campaign={boothModalCampaign}
          form={activeForm}
          adminEmail={adminEmail}
          isOpen={Boolean(boothModalCampaign)}
          onClose={() => setBoothModalCampaign(null)}
          onSuccess={() => {
            loadData();
          }}
        />
      )}
    </div>
  );
};
