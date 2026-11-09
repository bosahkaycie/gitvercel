import React, { useState, useEffect, useRef } from 'react';
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
  IconExternal,
  IconRefresh,
  IconSparkles,
  IconX
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

const getFallbackForm = (camp: Campaign): CampaignForm => {
  return {
    id: camp.assignedFormId || `form-${camp.id}`,
    campaignId: camp.id,
    title: `${camp.name} Registration Form`,
    description: `Official registration and technical inquiry form for ${camp.name}`,
    activeVersion: 1,
    versions: [
      {
        id: `v1-${camp.id}`,
        versionNumber: 1,
        createdAt: new Date().toISOString(),
        fields: [
          { id: 'full_name', type: 'short_text', label: 'Full Name', required: true, order: 1, placeholder: 'e.g. Engr. Oladipo Adeleke' },
          { id: 'email', type: 'email', label: 'Corporate / Official Email Address', required: true, order: 2, placeholder: 'e.g. name@energyfirm.com' },
          { id: 'phone', type: 'phone', label: 'Phone / WhatsApp Number', required: true, order: 3, placeholder: '+234 803 000 0000' },
          { id: 'company', type: 'short_text', label: 'Company / Operating Organisation', required: true, order: 4, placeholder: 'e.g. Shell, NNPC Ltd, Chevron, TotalEnergies, Seplat' },
          { id: 'job_title', type: 'short_text', label: 'Job Title / Designation', required: false, order: 5, placeholder: 'e.g. Executive Director, Lead Project Engineer' },
          {
            id: 'service_divisions',
            type: 'checkbox',
            label: 'PIGL Operating Divisions of Interest',
            required: false,
            order: 6,
            options: [
              { id: 'opt_geo', label: 'Geosolutions & Engineering (CPT, 3D Laser Scanning, Geotechnical)', value: 'Geosolutions & Engineering' },
              { id: 'opt_marine', label: 'Metocean & Marine Solutions (Hydrographic, Metocean, Sub-bottom)', value: 'Metocean & Marine Solutions' },
              { id: 'opt_const', label: 'Integrated Construction (Swamp Pipelines, Structural Works)', value: 'Integrated Construction' },
              { id: 'opt_ind', label: 'Industrial Solutions (Cathodic Protection, NDT Asset Integrity)', value: 'Industrial Solutions' }
            ]
          },
          {
            id: 'custom_inquiry_scope',
            type: 'long_text',
            label: 'Custom Technical Requirements / Unlisted Inquiries',
            description: 'Type any unlisted scope, specialized equipment, tender timeline, or technical requirement.',
            placeholder: 'Describe your specific project scope, asset location, or inquiry...',
            required: false,
            order: 7
          },
          {
            id: 'consent_ndpa',
            type: 'consent',
            label: 'I consent to Polaris Integrated & GeoSolutions Limited contacting me regarding this inquiry in accordance with the Nigeria Data Protection Act (NDPA).',
            required: true,
            order: 8
          }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

const getFallbackTemplate = (camp: Campaign): CampaignEmailTemplate => {
  const eventName = camp.eventName || camp.name;
  return {
    id: `tmpl-${camp.id}`,
    campaignId: camp.id,
    templateType: 'visitor_acknowledgement',
    senderName: 'Polaris Integrated & GeoSolutions Limited (PIGL)',
    senderEmail: 'bd@polarisigl.com',
    replyTo: 'info@polarisigl.com',
    subject: `Thank You for Connecting with PIGL at ${eventName}`,
    bodyHtml: `<p>Dear {{first_name}},</p><p>Thank you for connecting with Polaris Integrated &amp; GeoSolutions Limited (PIGL) at {{event_name}}.</p><p>Our technical leadership team has received your inquiry regarding our engineering and geomatics services and will be in touch shortly.</p><p>Warm regards,<br><strong>Business Development Directorate</strong><br>Polaris Integrated &amp; GeoSolutions Limited (PIGL)</p>`,
    bodyText: `Dear {{first_name}},\n\nThank you for connecting with Polaris Integrated & GeoSolutions Limited (PIGL) at {{event_name}}.\n\nOur technical leadership team has received your inquiry and will be in touch shortly.\n\nWarm regards,\nBusiness Development Directorate\nPolaris Integrated & GeoSolutions Limited (PIGL)`,
    enabled: true,
    internalRecipients: ['admin@polarisigl.com', 'bd@polarisigl.com'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

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

  // Real-time synchronization state & tracking refs
  const knownSubmissionsRef = useRef<Set<string>>(new Set());
  const isInitialLoadDoneRef = useRef<boolean>(false);
  const isSyncingRef = useRef<boolean>(false);
  const selectedCampaignIdRef = useRef<string>(selectedCampaignId);

  useEffect(() => {
    selectedCampaignIdRef.current = selectedCampaignId;
  }, [selectedCampaignId]);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [newLeadToast, setNewLeadToast] = useState<{
    id: string;
    name: string;
    company: string;
    eventName: string;
  } | null>(null);

  // Synthesize client-side audio chime for instantaneous real-time arrival
  const playNewLeadChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(830.61, now + 0.09); // G#5

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      // Audio autoplay policy restricted or unavailable
    }
  };

  // Silent background sync without full-screen loading spinners
  const silentSync = async (force: boolean = false) => {
    const targetId = selectedCampaignIdRef.current || selectedCampaignId;
    if (!targetId || isSyncingRef.current) return;
    isSyncingRef.current = true;
    setIsSyncing(true);

    try {
      const [details, currentStats] = await Promise.all([
        getCampaignDetails(targetId),
        getCampaignStats()
      ]);

      setStats(currentStats);

      if (details.submissions && Array.isArray(details.submissions)) {
        // Detect newly captured leads
        if (isInitialLoadDoneRef.current) {
          const freshLeads = details.submissions.filter(
            s => !knownSubmissionsRef.current.has(s.id)
          );

          if (freshLeads.length > 0) {
            const newest = freshLeads[0];
            setNewLeadToast({
              id: newest.id,
              name: newest.visitorName || 'New Visitor',
              company: newest.visitorCompany || 'Direct Inquiry',
              eventName: details.campaign?.eventName || details.campaign?.name || 'Active Campaign'
            });
            playNewLeadChime();
          }
        }

        // Register all current IDs
        details.submissions.forEach(s => knownSubmissionsRef.current.add(s.id));
        setSubmissions(details.submissions);
      }

      if (details.emailLogs) {
        setEmailLogs(details.emailLogs);
      }

      isInitialLoadDoneRef.current = true;
    } catch (err) {
      console.warn('Background sync error:', err);
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
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
        selectedCampaignIdRef.current = targetId;
        try {
          const details = await getCampaignDetails(targetId);
          setActiveForm(details.form);
          setActiveEmailTemplate(details.emailTemplate);
          setSubmissions(details.submissions);
          setEmailLogs(details.emailLogs);

          if (details.submissions) {
            details.submissions.forEach(s => knownSubmissionsRef.current.add(s.id));
          }
          isInitialLoadDoneRef.current = true;
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

  // Adaptive background polling & live cross-tab event bus
  useEffect(() => {
    if (!selectedCampaignId) return;

    // 1. Immediate sync check
    silentSync(true);

    // 2. High-speed background polling (every 2.5 seconds)
    const pollInterval = setInterval(() => {
      silentSync();
    }, 2500);

    // 3. Tab Visibility & Window Focus instant sync
    const handleFocusSync = () => {
      silentSync(true);
    };
    window.addEventListener('focus', handleFocusSync);
    document.addEventListener('visibilitychange', handleFocusSync);

    // 4. Cross-Tab Real-time BroadcastChannel
    let broadcastChan: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        broadcastChan = new BroadcastChannel('pigl_lead_realtime_bus');
        broadcastChan.onmessage = (ev) => {
          if (ev.data?.type === 'NEW_LEAD') {
            silentSync(true);
          }
        };
      } catch (e) {}
    }

    // 5. Cross-Window LocalStorage Event
    const handleStorageEvent = (ev: StorageEvent) => {
      if (ev.key === 'pigl_lead_event') {
        silentSync(true);
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocusSync);
      document.removeEventListener('visibilitychange', handleFocusSync);
      window.removeEventListener('storage', handleStorageEvent);
      if (broadcastChan) {
        try {
          broadcastChan.close();
        } catch (e) {}
      }
    };
  }, [selectedCampaignId]);

  // Auto-dismiss new lead toast after 7 seconds
  useEffect(() => {
    if (newLeadToast) {
      const timer = setTimeout(() => {
        setNewLeadToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [newLeadToast]);

  // When selected campaign changes, fetch its children
  const handleSelectCampaign = async (camp: Campaign) => {
    setSelectedCampaignId(camp.id);
    knownSubmissionsRef.current.clear();
    try {
      const details = await getCampaignDetails(camp.id);
      setActiveForm(details.form);
      setActiveEmailTemplate(details.emailTemplate);
      setSubmissions(details.submissions);
      setEmailLogs(details.emailLogs);
      if (details.submissions) {
        details.submissions.forEach(s => knownSubmissionsRef.current.add(s.id));
      }
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
    <div className="space-y-6 relative">
      {/* Real-Time Lead Alert Toast */}
      {newLeadToast && (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-2xl shadow-2xl p-4 flex items-start gap-3.5 animate-in slide-in-from-top-4 duration-300">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
            <IconSparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                New Visitor Captured Live
              </span>
              <span className="text-[11px] text-slate-400">Just now</span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-1">
              {newLeadToast.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {newLeadToast.company} &bull; {newLeadToast.eventName}
            </p>

            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  switchSubTab('leads');
                  setNewLeadToast(null);
                }}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 underline cursor-pointer"
              >
                Open in Leads Table &rarr;
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNewLeadToast(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Module Title & Active Campaign Quick Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Campaigns &amp; Lead Capture
            </h1>

            {/* Real-time live status pill */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                LIVE SYNC
              </span>
              <button
                type="button"
                onClick={() => silentSync(true)}
                className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 cursor-pointer transition-transform hover:rotate-180 duration-300"
                title="Force refresh now"
              >
                <IconRefresh className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time event visitor capture, live leads stream, dynamic forms, and automated acknowledgements.
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
            setCampaigns(prev => {
              const idx = prev.findIndex(c => c.id === saved.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = saved;
                return next;
              }
              return [saved, ...prev];
            });
            setSelectedCampaignId(saved.id);
            setEditingCampaign(null);
            switchSubTab('all');
            setTimeout(() => {
              loadData(saved.id);
            }, 600);
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

      {subTab === 'forms' && selectedCampaign && (
        <CampaignFormBuilder
          campaign={selectedCampaign}
          form={activeForm || getFallbackForm(selectedCampaign)}
          onFormUpdated={updated => setActiveForm(updated)}
        />
      )}

      {subTab === 'emails' && selectedCampaign && (
        <CampaignEmailAutomation
          campaign={selectedCampaign}
          template={activeEmailTemplate || getFallbackTemplate(selectedCampaign)}
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
