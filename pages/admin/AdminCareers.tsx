import React, { useState, useRef, useEffect } from 'react';
import { JobApplication, JobOpening } from '../../types';
import { useSiteSettings, extractCoverLetterMeta } from '../../hooks/useSupabaseData';
import { downloadApplicationsZip, DownloadProgress } from '../../utils/cvDownloader';
import { fetchVenueCheckIns, resetVenueCheckIn, VenueCheckInRecord } from '../../utils/interviewPass';
import { ApplicantEmailDrawer } from '../../components/admin/ApplicantEmailDrawer';
import {
  IconCareers,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconDownload,
  IconCheck,
  IconCheckCircle,
  IconClose,
  IconFileText,
  IconPhone,
  IconMail,
  IconUpload,
  IconCopy,
  IconShare,
  IconEye,
  IconChevronDown,
  IconChevronRight,
  IconExternal,
  IconUsers,
  IconPieChart,
  IconTrendingUp,
  IconFilter
} from '../../components/admin/AdminIcons';

interface AdminCareersProps {
  applications: JobApplication[];
  jobs: JobOpening[];
  loading?: boolean;
  appsLoading?: boolean;
  jobsLoading?: boolean;
  onRefreshApplications?: () => void | Promise<any>;
  onUpdateApplicationStatus?: (id: string, status: JobApplication['status'], notes?: string, extraFields?: Partial<JobApplication>) => Promise<any>;
  onUpdateAppStatus?: (id: string, status: JobApplication['status'], notes?: string, extraFields?: Partial<JobApplication>) => Promise<any>;
  onDeleteApplication?: (id: string) => Promise<any>;
  onDeleteApp?: (id: string) => Promise<any>;
  onBulkUpdateApplicationStatus?: (ids: string[], status: JobApplication['status']) => Promise<any>;
  onBulkDeleteApplications?: (ids: string[]) => Promise<any>;
  onSaveJob: (job: Partial<JobOpening> & { title: string; department: string }) => Promise<any>;
  onDeleteJob: (id: string) => Promise<any>;
  theme?: 'light' | 'dark';
}

const AdminCareers: React.FC<AdminCareersProps> = ({
  applications = [],
  jobs = [],
  loading = false,
  appsLoading = false,
  jobsLoading = false,
  onRefreshApplications,
  onUpdateApplicationStatus,
  onUpdateAppStatus,
  onDeleteApplication,
  onDeleteApp,
  onBulkUpdateApplicationStatus,
  onBulkDeleteApplications,
  onSaveJob,
  onDeleteJob,
  theme = 'light'
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'openings'>('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live Venue Check-Ins synced from QR pass scans at the interview venue
  const [venueCheckIns, setVenueCheckIns] = useState<Record<string, VenueCheckInRecord>>({});

  const loadVenueCheckIns = async () => {
    const records = await fetchVenueCheckIns();
    setVenueCheckIns(records);
  };

  useEffect(() => {
    loadVenueCheckIns();
    const interval = setInterval(loadVenueCheckIns, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleResetVenueCheckIn = async (appId: string, candidateName: string) => {
    const ok = await resetVenueCheckIn(appId);
    if (ok) {
      setVenueCheckIns((prev) => {
        const next = { ...prev };
        delete next[appId];
        return next;
      });
      setBulkActionToast({
        message: `Cleared venue check-in status for ${candidateName}.`,
        type: 'info',
      });
      setTimeout(() => setBulkActionToast(null), 3500);
    }
  };

  const renderVenueBadge = (app: JobApplication) => {
    const checkin = venueCheckIns[app.id];
    if (!checkin) return null;
    return (
      <div
        className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-300 border border-emerald-400/70 dark:border-emerald-700 shadow-2xs"
        title={`Checked in at venue: ${checkin.checkedInTimeDisplay} (${checkin.checkedInDateDisplay})`}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <span>At Venue{checkin.checkedInTimeDisplay ? ` • ${checkin.checkedInTimeDisplay}` : ''}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleResetVenueCheckIn(app.id, app.applicant_name);
          }}
          className="ml-0.5 text-emerald-700 dark:text-emerald-400 hover:text-rose-600 dark:hover:text-rose-400 font-black cursor-pointer"
          title="Clear venue check-in status"
        >
          ×
        </button>
      </div>
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        onRefreshApplications ? onRefreshApplications() : Promise.resolve(),
        loadVenueCheckIns(),
      ]);
      setToggleToast('Live applications & venue check-ins refreshed');
      setTimeout(() => setToggleToast(null), 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Grouping & Sorting state for Applications
  const [appsViewMode, setAppsViewMode] = useState<'grouped' | 'table'>('grouped');
  const [selectedPostingFilter, setSelectedPostingFilter] = useState<string>('All');
  const [postingSort, setPostingSort] = useState<'most_applicants' | 'default' | 'title_asc'>('most_applicants');
  const [collapsedPostings, setCollapsedPostings] = useState<Record<string, boolean>>({});
  
  // Selected Application Modal / Drawer
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [appNotes, setAppNotes] = useState('');
  const [updatingApp, setUpdatingApp] = useState(false);

  // Job Opening Modal
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  // Positions & Applicant Statistics Pop-up Modal
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [statsViewFilter, setStatsViewFilter] = useState<'open_only' | 'all'>('open_only');
  const [statsSearchQuery, setStatsSearchQuery] = useState('');
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Ground Intelligence');
  const [jobLocation, setJobLocation] = useState('Port Harcourt, Rivers State');
  const [jobType, setJobType] = useState<'Full-time' | 'Contract' | 'Part-time'>('Full-time');
  const [jobExp, setJobExp] = useState('3+ Years');
  const [jobDesc, setJobDesc] = useState('');
  const [jobReqsStr, setJobReqsStr] = useState('');
  const [jobRespStr, setJobRespStr] = useState('');
  const [jobStatus, setJobStatus] = useState<'active' | 'closed' | 'draft'>('active');
  const [jobImage, setJobImage] = useState<string>('');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [copiedJobId, setCopiedJobId] = useState<string | null>(null);
  const [previewFlyerUrl, setPreviewFlyerUrl] = useState<string | null>(null);
  const jobFileInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === 'dark';
  const handleUpdateStatus = onUpdateApplicationStatus || onUpdateAppStatus || (async () => {});
  const handleDeleteApplication = onDeleteApplication || onDeleteApp || (async () => {});

  const { settings, saveSettings } = useSiteSettings();
  const [isTogglingGeneralApp, setIsTogglingGeneralApp] = useState(false);
  const [toggleToast, setToggleToast] = useState<string | null>(null);

  const generalAppEnabled = settings?.enable_general_application !== false;

  const handleToggleGeneralApp = async () => {
    setIsTogglingGeneralApp(true);
    const nextState = !generalAppEnabled;
    try {
      await saveSettings({ enable_general_application: nextState });
      setToggleToast(
        nextState
          ? 'General Talent Network Submission turned ON (visible on Careers page)'
          : 'General Talent Network Submission turned OFF (hidden from Careers page)'
      );
      setTimeout(() => setToggleToast(null), 3500);
    } catch (e) {
      console.error('Failed to toggle general application:', e);
    } finally {
      setIsTogglingGeneralApp(false);
    }
  };

  const safeApps = Array.isArray(applications) ? applications : [];
  const safeJobs = Array.isArray(jobs) ? jobs : [];

  // Match application to job opening by ID or Title
  const matchJobForApp = (app: JobApplication): JobOpening | undefined => {
    if (!app) return undefined;
    if (app.job_id) {
      const byId = safeJobs.find(
        (j) => j && (j.id === app.job_id || j.id?.toLowerCase() === app.job_id?.toLowerCase())
      );
      if (byId) return byId;
    }
    if (app.job_title) {
      const raw = app.job_title.toLowerCase().trim();
      const byTitle = safeJobs.find((j) => {
        if (!j || !j.title) return false;
        const jTitle = j.title.toLowerCase().trim();
        return (
          jTitle === raw ||
          raw.includes(jTitle) ||
          jTitle.includes(raw) ||
          jTitle.replace(/[^a-z0-9]/g, '') === raw.replace(/[^a-z0-9]/g, '')
        );
      });
      if (byTitle) return byTitle;
    }
    return undefined;
  };

  const getPostingAppCount = (jobId: string) =>
    safeApps.filter((a) => matchJobForApp(a)?.id === jobId).length;
  const generalAppCount = safeApps.filter((a) => !matchJobForApp(a)).length;

  const openPublishedJobs = safeJobs.filter((j) => j && j.status === 'active');
  const activeVacancyApplicantsCount = safeApps.filter((a) => {
    const job = matchJobForApp(a);
    return Boolean(job && job.status === 'active');
  }).length;

  const getJobDetailStats = (jobId: string) => {
    const jobApps = safeApps.filter((a) => matchJobForApp(a)?.id === jobId);
    return {
      total: jobApps.length,
      newCount: jobApps.filter((a) => !a.status || a.status === 'New').length,
      shortlistedCount: jobApps.filter((a) => a.status === 'Shortlisted').length,
      interviewedCount: jobApps.filter((a) => a.status === 'Interviewed').length,
      hiredCount: jobApps.filter((a) => a.status === 'Hired').length,
      rejectedCount: jobApps.filter((a) => a.status === 'Rejected').length
    };
  };

  const handleSelectPostingFromStats = (jobId: string) => {
    setSelectedPostingFilter(jobId);
    setActiveTab('applications');
    setIsStatsModalOpen(false);
  };

  // Bulk Selection & Action State
  const [selectedAppIds, setSelectedAppIds] = useState<Set<string>>(new Set());
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [bulkActionToast, setBulkActionToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Bulk CV Download State
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [downloadModalTitle, setDownloadModalTitle] = useState('');
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  // Applicant Email Communication Drawer State (Option C: Slide-Over Panel)
  const [emailDrawerApps, setEmailDrawerApps] = useState<JobApplication[]>([]);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);

  const handleOpenEmailForCandidate = (app: JobApplication) => {
    setEmailDrawerApps([app]);
    setIsEmailDrawerOpen(true);
  };

  const handleOpenEmailForSelected = () => {
    const selectedApps = safeApps.filter((a) => selectedAppIds.has(a.id));
    if (selectedApps.length === 0) return;
    setEmailDrawerApps(selectedApps);
    setIsEmailDrawerOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setIsDownloadMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAppsForCategory = (categoryId: string): JobApplication[] => {
    if (categoryId === 'All') return safeApps;
    if (categoryId === 'general') return safeApps.filter((a) => !matchJobForApp(a));
    return safeApps.filter((a) => matchJobForApp(a)?.id === categoryId);
  };

  const getCategoryTitle = (categoryId: string): string => {
    if (categoryId === 'All') return 'All Positions';
    if (categoryId === 'general') return 'General Applications';
    const job = safeJobs.find((j) => j.id === categoryId);
    return job?.title || 'Position';
  };

  const handleToggleSelectApp = (id: string) => {
    setSelectedAppIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllVisible = (apps: JobApplication[]) => {
    const allSelected = apps.length > 0 && apps.every((a) => selectedAppIds.has(a.id));
    if (allSelected) {
      setSelectedAppIds((prev) => {
        const next = new Set(prev);
        apps.forEach((a) => next.delete(a.id));
        return next;
      });
    } else {
      setSelectedAppIds((prev) => {
        const next = new Set(prev);
        apps.forEach((a) => next.add(a.id));
        return next;
      });
    }
  };

  const handleClearSelection = () => {
    setSelectedAppIds(new Set());
  };

  const handleBulkStatusChange = async (newStatus: JobApplication['status']) => {
    const ids = Array.from(selectedAppIds);
    if (ids.length === 0) return;

    setIsBulkUpdating(true);
    try {
      if (onBulkUpdateApplicationStatus) {
        await onBulkUpdateApplicationStatus(ids, newStatus);
      } else {
        await Promise.all(ids.map((id) => handleUpdateStatus(id, newStatus)));
      }
      setBulkActionToast({
        message: `Successfully marked ${ids.length} candidate${ids.length > 1 ? 's' : ''} as "${newStatus}"!`,
        type: 'success'
      });
      setTimeout(() => setBulkActionToast(null), 4000);
      handleClearSelection();
    } catch (err: any) {
      console.error('Bulk status update error:', err);
      setBulkActionToast({ message: 'Failed to complete bulk status update.', type: 'error' });
      setTimeout(() => setBulkActionToast(null), 4000);
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleExecuteBulkDelete = async () => {
    const ids = Array.from(selectedAppIds);
    if (ids.length === 0) return;

    setIsBulkUpdating(true);
    try {
      if (onBulkDeleteApplications) {
        await onBulkDeleteApplications(ids);
      } else {
        await Promise.all(ids.map((id) => handleDeleteApplication(id)));
      }
      setBulkActionToast({
        message: `Permanently removed ${ids.length} candidate application${ids.length > 1 ? 's' : ''}.`,
        type: 'info'
      });
      setTimeout(() => setBulkActionToast(null), 4000);
      handleClearSelection();
      setIsBulkDeleteModalOpen(false);
    } catch (err: any) {
      console.error('Bulk delete error:', err);
      setBulkActionToast({ message: 'Failed to delete selected applications.', type: 'error' });
      setTimeout(() => setBulkActionToast(null), 4000);
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleDownloadCVs = async (targetApps: JobApplication[], categoryTitle: string) => {
    const appsWithCV = targetApps.filter((a) => Boolean(a.resume_url));
    if (appsWithCV.length === 0) {
      setBulkActionToast({
        message: `No candidate CVs found to download for "${categoryTitle}".`,
        type: 'info'
      });
      setTimeout(() => setBulkActionToast(null), 4000);
      return;
    }

    setIsDownloadingZip(true);
    setDownloadModalTitle(categoryTitle);
    setDownloadProgress({
      current: 0,
      total: appsWithCV.length,
      currentName: 'Connecting to files...',
      percent: 0
    });

    try {
      const result = await downloadApplicationsZip({
        applications: appsWithCV,
        zipTitle: `PIGL_CVs_${categoryTitle.replace(/[^a-zA-Z0-9]/g, '_')}`,
        onProgress: (prog) => {
          setDownloadProgress(prog);
        }
      });

      setBulkActionToast({
        message: `Downloaded ${result.downloadedCount} CV${result.downloadedCount > 1 ? 's' : ''} in ${result.zipName}!`,
        type: 'success'
      });
      setTimeout(() => setBulkActionToast(null), 5000);
    } catch (err: any) {
      console.error('ZIP download error:', err);
      setBulkActionToast({
        message: err?.message || 'Failed to generate CVs archive.',
        type: 'error'
      });
      setTimeout(() => setBulkActionToast(null), 5000);
    } finally {
      setIsDownloadingZip(false);
      setDownloadProgress(null);
    }
  };

  const handleDownloadSelectedCVs = () => {
    const selectedApps = safeApps.filter((a) => selectedAppIds.has(a.id));
    handleDownloadCVs(selectedApps, `${selectedApps.length}_Selected_Candidates`);
  };

  const toggleCollapsePosting = (jobId: string) => {
    setCollapsedPostings((prev) => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const expandAllPostings = () => {
    setCollapsedPostings({});
  };

  const collapseAllPostings = () => {
    const allCollapsed: Record<string, boolean> = { general: true };
    safeJobs.forEach((j) => {
      if (j?.id) allCollapsed[j.id] = true;
    });
    setCollapsedPostings(allCollapsed);
  };

  const filteredApps = safeApps.filter((app) => {
    if (!app) return false;
    const matchedJob = matchJobForApp(app);
    const matchesPosting =
      selectedPostingFilter === 'All'
        ? true
        : selectedPostingFilter === 'general'
        ? !matchedJob
        : matchedJob?.id === selectedPostingFilter;

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'at_venue' ? Boolean(venueCheckIns[app.id]) : app.status === statusFilter);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (app.applicant_name && app.applicant_name.toLowerCase().includes(q)) ||
      (app.applicant_email && app.applicant_email.toLowerCase().includes(q)) ||
      (app.applicant_phone && app.applicant_phone.toLowerCase().includes(q)) ||
      (app.job_title && app.job_title.toLowerCase().includes(q)) ||
      (matchedJob && matchedJob.title && matchedJob.title.toLowerCase().includes(q));

    return matchesPosting && matchesStatus && Boolean(matchesSearch);
  });

  const handleOpenAppModal = (app: JobApplication) => {
    setSelectedApp(app);
    setAppNotes(app.notes || '');
  };

  const handleSaveAppNotes = async (newStatus: JobApplication['status']) => {
    if (!selectedApp) return;
    setUpdatingApp(true);
    await handleUpdateStatus(selectedApp.id, newStatus, appNotes);
    setSelectedApp(prev => prev ? { ...prev, status: newStatus, notes: appNotes } : null);
    setUpdatingApp(false);
  };

  // Local Image Upload from device storage
  const handleJobImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setJobImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyJobShareLink = (jobId: string) => {
    const shareUrl = `https://polarisigl.com/careers?job=${encodeURIComponent(jobId)}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedJobId(jobId);
      setTimeout(() => setCopiedJobId(null), 2500);
    });
  };

  const handleToggleJobStatus = async (job: JobOpening) => {
    const nextStatus: 'active' | 'closed' = job.status === 'active' ? 'closed' : 'active';
    try {
      await onSaveJob({
        ...job,
        status: nextStatus
      });
      setToggleToast(
        nextStatus === 'active'
          ? `"${job.title}" is now ACTIVE and accepting applications.`
          : `"${job.title}" is now DISABLED. It displays "Not Accepting Submissions" on the website.`
      );
      setTimeout(() => setToggleToast(null), 3500);
    } catch (err) {
      console.error('Failed to toggle job status:', err);
    }
  };

  const openCreateJobModal = () => {
    setEditingJob(null);
    setJobTitle('');
    setJobDept('Ground Intelligence');
    setJobLocation('Port Harcourt (On-site)');
    setJobType('Full-time');
    setJobExp('3+ Years');
    setJobDesc('');
    setJobReqsStr('');
    setJobRespStr('');
    setJobStatus('active');
    setJobImage('');
    setImageInputMode('upload');
    setIsJobModalOpen(true);
  };

  const openEditJobModal = (job: JobOpening) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobDept(job.department);
    setJobLocation(job.location);
    setJobType(job.type);
    setJobExp(job.experience_level);
    setJobDesc(job.description);
    setJobReqsStr(job.requirements.join('\n'));
    setJobRespStr(job.responsibilities.join('\n'));
    setJobStatus(job.status);
    setJobImage(job.image_url || '');
    setImageInputMode(job.image_url && job.image_url.startsWith('data:') ? 'upload' : 'url');
    setIsJobModalOpen(true);
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    const requirements = jobReqsStr.split('\n').map(s => s.trim()).filter(Boolean);
    const responsibilities = jobRespStr.split('\n').map(s => s.trim()).filter(Boolean);

    await onSaveJob({
      ...(editingJob ? { id: editingJob.id } : {}),
      title: jobTitle,
      department: jobDept,
      location: jobLocation,
      type: jobType,
      experience_level: jobExp,
      description: jobDesc,
      requirements,
      responsibilities,
      status: jobStatus,
      image_url: jobImage
    });

    setIsJobModalOpen(false);
  };

  const exportApplicationsToCSV = () => {
    const headers = ['Applicant Name', 'Email', 'Phone', 'Role Applied For', 'Status', 'Applied Date', 'Resume URL', 'Cover Letter File URL', 'Cover Letter Text', 'Notes'];
    const rows = safeApps.map(a => {
      const { coverLetterUrl, coverLetterText } = extractCoverLetterMeta(a.cover_letter);
      const attachedClUrl = a.cover_letter_url || coverLetterUrl || '';
      const clText = coverLetterText || (!attachedClUrl ? a.cover_letter || '' : '');
      const dateStr = a.created_at ? new Date(a.created_at).toLocaleDateString('en-GB') : '';
      return [
        `"${(a.applicant_name || '').replace(/"/g, '""')}"`,
        `"${(a.applicant_email || '').replace(/"/g, '""')}"`,
        `"${(a.applicant_phone || '').replace(/"/g, '""')}"`,
        `"${(a.job_title || 'General Application').replace(/"/g, '""')}"`,
        `"${a.status || 'new'}"`,
        `"${dateStr}"`,
        `"${a.resume_url || ''}"`,
        `"${attachedClUrl}"`,
        `"${clText.replace(/"/g, '""')}"`,
        `"${(a.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PIGL_Job_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`space-y-6 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Tab Switcher & Actions (No Duplicate Title) */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'applications'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <IconFileText className="w-4 h-4" />
            <span>Candidate Applications</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
              isDark ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50' : 'bg-emerald-100 text-emerald-900'
            }`}>
              {applications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('openings')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'openings'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <IconCareers className="w-4 h-4" />
            <span>Job Openings</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
              isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-700'
            }`}>
              {jobs.length}
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-2.5 pb-3 sm:pb-0">
          {activeTab === 'applications' ? (
            <>
              <button
                type="button"
                onClick={() => setIsStatsModalOpen(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border shadow-xs cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:border-emerald-500/50'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-emerald-600/50'
                }`}
                title="View Statistics for Open / Published Positions"
              >
                <IconPieChart className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Position Stats</span>
              </button>

              {/* Bulk CV Downloads Dropdown Menu */}
              <div className="relative" ref={downloadMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
                  disabled={isDownloadingZip || safeApps.length === 0}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border shadow-xs cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:border-emerald-500/50'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-emerald-600/50'
                  }`}
                  title="Download CVs in bulk (All categories or by specific role)"
                >
                  <IconDownload className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Download CVs</span>
                  <IconChevronDown className={`w-3 h-3 transition-transform ${isDownloadMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDownloadMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Bulk CV Archives (ZIP)
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Download candidate resumes packaged into compressed ZIP files.
                      </div>
                    </div>

                    <div className="py-1">
                      {/* Option: Download ALL CVs */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsDownloadMenuOpen(false);
                          handleDownloadCVs(safeApps, 'All_Positions');
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isDark ? 'hover:bg-emerald-950/60 text-emerald-300' : 'hover:bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="text-base">📦</span>
                          <div>
                            <div className="font-bold text-xs">Download All Categories</div>
                            <div className="text-[10px] font-normal text-slate-400">All candidate submissions combined</div>
                          </div>
                        </div>
                        <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-bold">
                          {safeApps.filter((a) => a.resume_url).length} CVs
                        </span>
                      </button>
                    </div>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Download by Category:
                    </div>

                    <div className="max-h-60 overflow-y-auto py-1 space-y-0.5">
                      {safeJobs.map((job) => {
                        const jobApps = safeApps.filter((a) => matchJobForApp(a)?.id === job.id);
                        const cvCount = jobApps.filter((a) => a.resume_url).length;
                        return (
                          <button
                            key={job.id}
                            type="button"
                            disabled={cvCount === 0}
                            onClick={() => {
                              setIsDownloadMenuOpen(false);
                              handleDownloadCVs(jobApps, job.title);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                              cvCount === 0
                                ? 'opacity-40 cursor-not-allowed'
                                : isDark ? 'hover:bg-slate-800 text-slate-200 cursor-pointer' : 'hover:bg-slate-100 text-slate-800 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <span className="text-xs">📁</span>
                              <span className="truncate">{job.title}</span>
                            </div>
                            <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                              cvCount > 0
                                ? isDark ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-emerald-700'
                                : 'text-slate-400'
                            }`}>
                              {cvCount} CV{cvCount !== 1 ? 's' : ''}
                            </span>
                          </button>
                        );
                      })}

                      {/* General Talent Pool */}
                      {(() => {
                        const generalApps = safeApps.filter((a) => !matchJobForApp(a));
                        const generalCvCount = generalApps.filter((a) => a.resume_url).length;
                        return (
                          <button
                            type="button"
                            disabled={generalCvCount === 0}
                            onClick={() => {
                              setIsDownloadMenuOpen(false);
                              handleDownloadCVs(generalApps, 'General_Applications');
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                              generalCvCount === 0
                                ? 'opacity-40 cursor-not-allowed'
                                : isDark ? 'hover:bg-slate-800 text-slate-200 cursor-pointer' : 'hover:bg-slate-100 text-slate-800 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <span className="text-xs">📁</span>
                              <span className="truncate">General Applications</span>
                            </div>
                            <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                              generalCvCount > 0
                                ? isDark ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-amber-700'
                                : 'text-slate-400'
                            }`}>
                              {generalCvCount} CV{generalCvCount !== 1 ? 's' : ''}
                            </span>
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>

              {onRefreshApplications && (
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing || appsLoading}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border shadow-xs cursor-pointer ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Fetch fresh applications from live database"
                >
                  <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              )}
              <button
                onClick={exportApplicationsToCSV}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border shadow-xs cursor-pointer ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <IconDownload className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={() => setIsStatsModalOpen(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border shadow-xs cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:border-emerald-500/50'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-emerald-600/50'
                }`}
                title="View Statistics for Open / Published Positions"
              >
                <IconPieChart className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Position Stats</span>
              </button>
              <button
                onClick={openCreateJobModal}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center space-x-2 cursor-pointer"
              >
                <IconPlus className="w-4 h-4" />
                <span>Post New Vacancy</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toggleToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/40 text-emerald-200 px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fadeIn">
          <IconCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toggleToast}</span>
        </div>
      )}

      {/* General Application Toggle Switch Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            generalAppEnabled
              ? isDark ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}>
            <IconFileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight">General Talent Network Application</h3>
              <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${
                generalAppEnabled
                  ? isDark ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50' : 'bg-emerald-100 text-emerald-900'
                  : isDark ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50' : 'bg-amber-100 text-amber-900'
              }`}>
                {generalAppEnabled ? 'Active / Visible' : 'Off / Hidden'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
              {generalAppEnabled
                ? 'The General Talent Network Submission card is currently visible at the bottom of the careers page.'
                : 'Turned off. Candidates will focus exclusively on active listed job postings.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0 self-end md:self-center pt-2 md:pt-0">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={generalAppEnabled}
              onChange={handleToggleGeneralApp}
              disabled={isTogglingGeneralApp}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 select-none">
            {generalAppEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      {/* Applications View */}
      {activeTab === 'applications' && (
        <div className="space-y-5">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className={`p-4 rounded-2xl border shadow-2xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Live Submissions</div>
              <div className="text-xl sm:text-2xl font-black mt-1 text-emerald-500">{applications.length}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Recorded in portal database</div>
            </div>
            <div className={`p-4 rounded-2xl border shadow-2xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Direct Vacancies</div>
              <div className="text-xl sm:text-2xl font-black mt-1 text-blue-500">{applications.length - generalAppCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Applied to active roles</div>
            </div>
            <div className={`p-4 rounded-2xl border shadow-2xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">General Talent Pool</div>
              <div className="text-xl sm:text-2xl font-black mt-1 text-purple-500">{generalAppCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Spontaneous applications</div>
            </div>
            <div className={`p-4 rounded-2xl border shadow-2xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">New / Unreviewed</div>
              <div className="text-xl sm:text-2xl font-black mt-1 text-amber-500">{applications.filter(a => a.status === 'new').length}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Candidates awaiting action</div>
            </div>
          </div>
          {/* Active Job Postings Horizontal Filter Chips */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs px-1">
              <span className={`font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Filter by Vacancy Posting:
              </span>
              <div className="flex items-center space-x-2.5">
                <span className="text-slate-400 font-mono text-[11px]">
                  {applications.length} Total Applications Recorded
                </span>
                {/* 1-Click Category Download Button */}
                {(() => {
                  const catApps = getAppsForCategory(selectedPostingFilter);
                  const cvCount = catApps.filter((a) => a.resume_url).length;
                  const catTitle = getCategoryTitle(selectedPostingFilter);
                  return (
                    <button
                      type="button"
                      onClick={() => handleDownloadCVs(catApps, catTitle)}
                      disabled={isDownloadingZip || cvCount === 0}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border shadow-2xs ${
                        cvCount === 0
                          ? 'opacity-40 cursor-not-allowed border-slate-300 dark:border-slate-700 text-slate-400'
                          : isDark
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900/60 cursor-pointer'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 cursor-pointer'
                      }`}
                      title={`Download all CVs for ${catTitle} in a ZIP file`}
                    >
                      <IconDownload className="w-3.5 h-3.5" />
                      <span>Download {selectedPostingFilter === 'All' ? 'All' : catTitle} CVs ({cvCount})</span>
                    </button>
                  );
                })()}
              </div>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
              <button
                type="button"
                onClick={() => setSelectedPostingFilter('All')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 border cursor-pointer ${
                  selectedPostingFilter === 'All'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>All Postings</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  selectedPostingFilter === 'All'
                    ? 'bg-emerald-900 text-emerald-100'
                    : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                }`}>
                  {applications.length}
                </span>
              </button>

              {jobs.map((job) => {
                const count = getPostingAppCount(job.id);
                const isSelected = selectedPostingFilter === job.id;
                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => setSelectedPostingFilter(job.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 border cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate max-w-[220px]">{job.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      count > 0 
                        ? (isSelected ? 'bg-emerald-900 text-emerald-100' : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/50') 
                        : (isSelected ? 'bg-emerald-900 text-emerald-200' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600')
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setSelectedPostingFilter('general')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 border cursor-pointer ${
                  selectedPostingFilter === 'general'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>General Submissions</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  selectedPostingFilter === 'general'
                    ? 'bg-emerald-900 text-emerald-100'
                    : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}>
                  {generalAppCount}
                </span>
              </button>
            </div>
          </div>

          {/* Filter Toolbar & View Mode Switcher */}
          <div className={`p-4 rounded-2xl border shadow-xs flex flex-col lg:flex-row gap-4 items-center justify-between transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
          }`}>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-80">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 dark:text-slate-400">
                  <IconSearch className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search candidate name, email, phone, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500'
                  }`}
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['All', 'new', 'shortlisted', 'interviewed', 'hired', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
                {(() => {
                  const checkedInCount = safeApps.filter((a) => Boolean(venueCheckIns[a.id])).length;
                  return (
                    <button
                      type="button"
                      onClick={() => setStatusFilter('at_venue')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 border ${
                        statusFilter === 'at_venue'
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : checkedInCount > 0
                          ? isDark
                            ? 'bg-emerald-950/60 border-emerald-700/70 text-emerald-300 hover:bg-emerald-900/60'
                            : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                          : isDark
                          ? 'border-slate-700 text-slate-400 hover:bg-slate-800'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                      title="Filter candidates who have been scanned & checked in at the interview venue"
                    >
                      <span className={`inline-block w-2 h-2 rounded-full ${checkedInCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                      <span>At Venue ({checkedInCount})</span>
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center space-x-2 shrink-0 self-end lg:self-center">
              <div className={`p-1 rounded-xl border flex items-center space-x-1 ${
                isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setAppsViewMode('grouped')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    appsViewMode === 'grouped'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Group applications into actively listed job postings"
                >
                  <IconCareers className="w-3.5 h-3.5" />
                  <span>Grouped by Role</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAppsViewMode('table')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    appsViewMode === 'table'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="View flat table of all candidate submissions"
                >
                  <IconFileText className="w-3.5 h-3.5" />
                  <span>All Table</span>
                </button>
              </div>
            </div>
          </div>

          {/* Group Sorting & Bulk Controls (Only in Grouped Mode) */}
          {appsViewMode === 'grouped' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs px-1">
              <div className="flex items-center space-x-2.5">
                <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Sort Vacancy Groups:
                </span>
                <select
                  value={postingSort}
                  onChange={(e) => setPostingSort(e.target.value as any)}
                  className={`px-3 py-1.5 rounded-xl border font-bold text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer ${
                    isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="most_applicants">Most Candidates First</option>
                  <option value="title_asc">Alphabetical (A - Z)</option>
                  <option value="default">Default Listing Order</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={expandAllPostings}
                  className="text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Expand All Groups
                </button>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <button
                  type="button"
                  onClick={collapseAllPostings}
                  className="text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Collapse All Groups
                </button>
              </div>
            </div>
          )}

          {/* Prominent In-Page Sticky Bulk Actions Toolbar */}
          {selectedAppIds.size > 0 && (
            <div className="sticky top-2 z-40 mb-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white border-2 border-emerald-500 shadow-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center space-x-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-black text-xs shadow-md">
                  {selectedAppIds.size}
                </span>
                <div>
                  <div className="text-sm font-black text-white flex items-center gap-2">
                    <span>{selectedAppIds.size} Candidate{selectedAppIds.size > 1 ? 's' : ''} Selected</span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-700/60">
                      Batch Actions Ready
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">Choose an action to execute across all marked candidates:</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* 1. SHORTLIST SELECTED */}
                <button
                  type="button"
                  disabled={isBulkUpdating}
                  onClick={() => handleBulkStatusChange('shortlisted')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer transition-all disabled:opacity-50"
                  title="Mark all marked candidates as Shortlisted in batch"
                >
                  <span className="text-sm">⭐</span>
                  <span>{isBulkUpdating ? 'Updating...' : `Shortlist Selected (${selectedAppIds.size})`}</span>
                </button>

                {/* 2. EMAIL SELECTED */}
                <button
                  type="button"
                  disabled={isBulkUpdating}
                  onClick={handleOpenEmailForSelected}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer transition-all disabled:opacity-50"
                  title="Compose and send personalized emails to all selected candidates"
                >
                  <IconMail className="w-4 h-4" />
                  <span>Email Selected ({selectedAppIds.size})</span>
                </button>

                {/* 3. DOWNLOAD CVS */}
                <button
                  type="button"
                  disabled={isBulkUpdating || isDownloadingZip}
                  onClick={handleDownloadSelectedCVs}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all disabled:opacity-50"
                  title="Download ZIP archive of selected candidates' CVs"
                >
                  <IconDownload className="w-3.5 h-3.5" />
                  <span>Download CVs</span>
                </button>

                {/* 4. OTHER STATUS DROPDOWN */}
                <select
                  disabled={isBulkUpdating}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkStatusChange(e.target.value as any);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="" disabled>Change Status ▾</option>
                  <option value="shortlisted" className="bg-slate-900 text-white">⭐ Shortlist</option>
                  <option value="interviewed" className="bg-slate-900 text-white">📅 Mark as Interviewed</option>
                  <option value="hired" className="bg-slate-900 text-white">🎉 Mark as Hired</option>
                  <option value="rejected" className="bg-slate-900 text-white">📁 Talent Pool / Rejected</option>
                  <option value="new" className="bg-slate-900 text-white">🔄 Reset to New</option>
                </select>

                {/* 5. DELETE */}
                <button
                  type="button"
                  disabled={isBulkUpdating}
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all disabled:opacity-50"
                  title="Delete selected candidates"
                >
                  <IconTrash className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                {/* 6. DESELECT ALL */}
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="px-2.5 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-xs font-bold cursor-pointer transition-colors"
                >
                  ✕ Deselect
                </button>
              </div>
            </div>
          )}

          {/* Applications Content: Loading / Grouped View / Table View */}
          {appsLoading || loading ? (
            <div className={`border rounded-2xl p-12 text-center text-slate-400 text-sm font-medium ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
            }`}>
              <svg className="animate-spin h-6 w-6 text-emerald-500 mx-auto mb-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading applicant submissions...
            </div>
          ) : appsViewMode === 'table' ? (
            /* Flat Table of All Filtered Applications */
            <div className={`border rounded-2xl shadow-xs overflow-hidden transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
            }`}>
              {filteredApps.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-sm font-medium">
                  No candidate applications match your current filters.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className={`border-b text-xs font-bold uppercase tracking-wider ${
                      isDark ? 'bg-slate-800/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      {selectedAppIds.size > 0 && (
                        <tr className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white border-b border-emerald-700/60">
                          <td colSpan={7} className="py-2.5 px-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center space-x-2 text-xs font-bold">
                                <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full text-xs font-black">
                                  {selectedAppIds.size}
                                </span>
                                <span>Candidates Selected</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  disabled={isBulkUpdating}
                                  onClick={() => handleBulkStatusChange('shortlisted')}
                                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black flex items-center space-x-1 shadow-xs cursor-pointer"
                                >
                                  <span>⭐</span>
                                  <span>Shortlist ({selectedAppIds.size})</span>
                                </button>
                                <button
                                  type="button"
                                  disabled={isBulkUpdating}
                                  onClick={handleOpenEmailForSelected}
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-black flex items-center space-x-1 shadow-xs cursor-pointer"
                                >
                                  <IconMail className="w-3.5 h-3.5" />
                                  <span>Email ({selectedAppIds.size})</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={handleClearSelection}
                                  className="text-slate-400 hover:text-white text-xs underline cursor-pointer ml-2"
                                >
                                  Deselect
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      <tr>
                        <th className="py-3.5 px-3 sm:px-4 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={filteredApps.length > 0 && filteredApps.every((a) => selectedAppIds.has(a.id))}
                            onChange={() => handleSelectAllVisible(filteredApps)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                            title="Select / deselect all visible applications"
                          />
                        </th>
                        <th className="py-3.5 px-4 sm:px-5">Candidate</th>
                        <th className="py-3.5 px-4 sm:px-5">Applied Role</th>
                        <th className="py-3.5 px-4 sm:px-5">Date</th>
                        <th className="py-3.5 px-4 sm:px-5">Status</th>
                        <th className="py-3.5 px-4 sm:px-5">Documents</th>
                        <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-slate-100 text-slate-800'}`}>
                      {filteredApps.map((app) => {
                        const { coverLetterUrl } = extractCoverLetterMeta(app.cover_letter);
                        const attachedClUrl = app.cover_letter_url || coverLetterUrl;
                        const isSelected = selectedAppIds.has(app.id);
                        return (
                        <tr
                          key={app.id}
                          className={`transition-colors ${
                            isSelected
                              ? isDark
                                ? 'bg-emerald-950/40 border-l-4 border-l-emerald-500'
                                : 'bg-emerald-50/80 border-l-4 border-l-emerald-600'
                              : isDark
                              ? 'hover:bg-slate-800/50'
                              : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="py-4 px-3 sm:px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectApp(app.id)}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                              title={`Select ${app.applicant_name}`}
                            />
                          </td>
                          <td className="py-4 px-4 sm:px-5">
                            <div>
                              <div className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {app.applicant_name}
                              </div>
                              <div className={`text-xs font-mono flex items-center space-x-2 mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                <span>{app.applicant_email}</span>
                                <span>•</span>
                                <span>{app.applicant_phone}</span>
                              </div>
                            </div>
                          </td>

                          <td className={`py-4 px-4 sm:px-5 font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {app.job_title || 'General Engineering Application'}
                          </td>

                          <td className={`py-4 px-4 sm:px-5 whitespace-nowrap font-mono text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>

                          <td className="py-4 px-4 sm:px-5">
                            <div className="flex flex-col items-start">
                              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase border ${
                                app.status === 'new'
                                  ? 'bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300/60 dark:border-blue-700/50'
                                  : app.status === 'shortlisted'
                                  ? 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300/60 dark:border-purple-700/50'
                                  : app.status === 'interviewed'
                                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300/60 dark:border-amber-700/50'
                                  : app.status === 'hired'
                                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/50'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                              }`}>
                                {app.status}
                              </span>
                              {renderVenueBadge(app)}
                            </div>
                          </td>

                          <td className="py-4 px-4 sm:px-5">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5">
                              <a
                                href={app.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                                  isDark 
                                    ? 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border-emerald-800/50' 
                                    : 'bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white border-emerald-200'
                                }`}
                                title="Download candidate CV / Resume"
                              >
                                <IconDownload className="w-3.5 h-3.5" />
                                <span>CV</span>
                              </a>
                              {attachedClUrl && (
                                <a
                                  href={attachedClUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                                    isDark 
                                      ? 'bg-purple-950/80 hover:bg-purple-800 text-purple-300 border-purple-800/50' 
                                      : 'bg-purple-50 hover:bg-purple-700 text-purple-800 hover:text-white border-purple-200'
                                  }`}
                                  title="Download attached cover letter document"
                                >
                                  <IconDownload className="w-3.5 h-3.5" />
                                  <span>Cover Letter</span>
                                </a>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-4 sm:px-5 text-right space-x-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleOpenEmailForCandidate(app)}
                              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all border inline-flex items-center space-x-1 cursor-pointer ${
                                isDark
                                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-2xs'
                              }`}
                              title={`Send email to ${app.applicant_name}`}
                            >
                              <IconMail className="w-3.5 h-3.5" />
                              <span className="hidden xl:inline">Email</span>
                            </button>
                            <button
                              onClick={() => handleOpenAppModal(app)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                              }`}
                            >
                              Review & Status
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove application from ${app.applicant_name}?`)) {
                                  handleDeleteApplication(app.id);
                                }
                              }}
                              className="px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:hover:bg-rose-800 rounded-lg transition-colors border border-rose-200 dark:border-rose-900/40 cursor-pointer"
                            >
                              Delete
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
          ) : (
            /* Grouped View by Actively Listed Job Postings */
            <div className="space-y-6">
              {/* Actively Listed Job Groups */}
              {(() => {
                const targetJobs = jobs.filter((j) => {
                  if (selectedPostingFilter === 'general') return false;
                  if (selectedPostingFilter === 'All') return true;
                  return j.id === selectedPostingFilter;
                });

                const sortedJobs = [...targetJobs].sort((a, b) => {
                  if (postingSort === 'most_applicants') {
                    const diff = getPostingAppCount(b.id) - getPostingAppCount(a.id);
                    if (diff !== 0) return diff;
                    return a.title.localeCompare(b.title);
                  }
                  if (postingSort === 'title_asc') {
                    return a.title.localeCompare(b.title);
                  }
                  return (a.display_order ?? 0) - (b.display_order ?? 0);
                });

                return sortedJobs.map((job) => {
                  const jobApps = filteredApps.filter((a) => matchJobForApp(a)?.id === job.id);
                  const totalPostingApps = getPostingAppCount(job.id);
                  const isCollapsed = !!collapsedPostings[job.id];

                  // Count breakdown
                  const newCount = jobApps.filter((a) => a.status === 'new').length;
                  const shortlistedCount = jobApps.filter((a) => a.status === 'shortlisted').length;
                  const interviewedCount = jobApps.filter((a) => a.status === 'interviewed').length;
                  const hiredCount = jobApps.filter((a) => a.status === 'hired').length;

                  return (
                    <div
                      key={job.id}
                      className={`border rounded-2xl shadow-xs overflow-hidden transition-all ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
                      }`}
                    >
                      {/* Job Header Card */}
                      <div
                        onClick={() => toggleCollapsePosting(job.id)}
                        className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-colors ${
                          isDark ? 'hover:bg-slate-850/50' : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
                          {job.image_url ? (
                            <img
                              src={job.image_url}
                              alt={job.title}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewFlyerUrl(job.image_url!);
                              }}
                              className="w-12 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                              title="Click to zoom hiring flyer"
                            />
                          ) : (
                            <div className={`w-12 h-14 rounded-xl flex items-center justify-center shrink-0 border ${
                              isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                              <IconCareers className="w-5 h-5" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className={`font-black text-sm sm:text-base leading-snug truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {job.title}
                              </h3>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                                job.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/50'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                              }`}>
                                {job.status}
                              </span>

                              {/* Total Applicant Count Badge */}
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                                totalPostingApps > 0
                                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/70'
                                  : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                {totalPostingApps} {totalPostingApps === 1 ? 'Candidate' : 'Candidates'}
                              </span>
                            </div>

                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2 font-medium">
                              <span>🏢 {job.department}</span>
                              <span>•</span>
                              <span>📍 {job.location}</span>
                              <span>•</span>
                              <span>💼 {job.type}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Right Actions */}
                        <div
                          className="flex items-center space-x-2 shrink-0 self-end md:self-center pt-2 md:pt-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {totalPostingApps > 0 && (
                            <button
                              type="button"
                              onClick={() => handleDownloadCVs(jobApps, job.title)}
                              disabled={isDownloadingZip}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                                isDark
                                  ? 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border-emerald-800'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                              }`}
                              title={`Download all CVs for ${job.title} in a ZIP file`}
                            >
                              <IconDownload className="w-3.5 h-3.5" />
                              <span>Download CVs ({jobApps.filter(a => a.resume_url).length})</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleCopyJobShareLink(job.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                              copiedJobId === job.id
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : isDark
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                            title="Copy direct link to this vacancy"
                          >
                            <IconShare className="w-3.5 h-3.5" />
                            <span>{copiedJobId === job.id ? 'Copied Link!' : 'Share Role'}</span>
                          </button>

                          <a
                            href={`/careers/${job.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                              isDark
                                ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700'
                                : 'bg-white hover:bg-slate-50 text-emerald-700 border-slate-200'
                            }`}
                            title="Open live public position page in new tab"
                          >
                            <IconExternal className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">View Public Page</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => toggleCollapsePosting(job.id)}
                            className={`p-1.5 rounded-lg border text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
                              isDark ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-white'
                            }`}
                            title={isCollapsed ? 'Expand candidate list' : 'Collapse candidate list'}
                          >
                            <IconChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isCollapsed ? '-rotate-90' : 'rotate-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Section: Candidates breakdown and table */}
                      {!isCollapsed && (
                        <div className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
                          {/* Status Breakdown Bar if candidates exist */}
                          {totalPostingApps > 0 && (
                            <div className={`px-4 sm:px-5 py-2.5 text-xs flex flex-wrap items-center gap-2 border-b ${
                              isDark ? 'bg-slate-950/40 border-slate-800/80 text-slate-400' : 'bg-slate-50/70 border-slate-100 text-slate-600'
                            }`}>
                              <span className="font-semibold uppercase tracking-wider text-[11px]">Pipeline Status:</span>
                              {newCount > 0 && (
                                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                  {newCount} New
                                </span>
                              )}
                              {shortlistedCount > 0 && (
                                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300">
                                  {shortlistedCount} Shortlisted
                                </span>
                              )}
                              {interviewedCount > 0 && (
                                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                                  {interviewedCount} Interviewed
                                </span>
                              )}
                              {hiredCount > 0 && (
                                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                                  {hiredCount} Hired
                                </span>
                              )}
                              {jobApps.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSelectAllVisible(jobApps)}
                                  className="ml-auto text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <span>{jobApps.every(a => selectedAppIds.has(a.id)) ? 'Deselect Role' : `Select All (${jobApps.length})`}</span>
                                </button>
                              )}
                            </div>
                          )}

                          {jobApps.length === 0 ? (
                            totalPostingApps === 0 ? (
                              <div className="p-8 text-center text-slate-400 text-xs sm:text-sm">
                                <p className="font-medium">No candidates have applied for this vacancy yet.</p>
                                <button
                                  type="button"
                                  onClick={() => handleCopyJobShareLink(job.id)}
                                  className="mt-3 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                                >
                                  <IconShare className="w-3.5 h-3.5" />
                                  <span>Copy Share Link to Announce Vacancy</span>
                                </button>
                              </div>
                            ) : (
                              <div className="p-8 text-center text-slate-400 text-xs sm:text-sm font-medium">
                                No candidates for this role match your current search/status filter.
                              </div>
                            )
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs sm:text-sm">
                                <thead className={`border-b text-xs font-bold uppercase tracking-wider ${
                                  isDark ? 'bg-slate-800/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}>
                                  {jobApps.some((a) => selectedAppIds.has(a.id)) && (
                                    <tr className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white border-b border-emerald-700/60">
                                      <td colSpan={6} className="py-2 px-4">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                          <div className="flex items-center space-x-2 text-xs font-bold">
                                            <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full text-xs font-black">
                                              {jobApps.filter((a) => selectedAppIds.has(a.id)).length}
                                            </span>
                                            <span>selected in this role</span>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <button
                                              type="button"
                                              disabled={isBulkUpdating}
                                              onClick={() => handleBulkStatusChange('shortlisted')}
                                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black flex items-center space-x-1 shadow-xs cursor-pointer"
                                            >
                                              <span>⭐</span>
                                              <span>Shortlist Selected</span>
                                            </button>
                                            <button
                                              type="button"
                                              disabled={isBulkUpdating}
                                              onClick={handleOpenEmailForSelected}
                                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-black flex items-center space-x-1 shadow-xs cursor-pointer"
                                            >
                                              <IconMail className="w-3.5 h-3.5" />
                                              <span>Email Selected</span>
                                            </button>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                  <tr>
                                    <th className="py-3 px-3 sm:px-4 w-10 text-center">
                                      <input
                                        type="checkbox"
                                        checked={jobApps.length > 0 && jobApps.every((a) => selectedAppIds.has(a.id))}
                                        onChange={() => handleSelectAllVisible(jobApps)}
                                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                                        title="Select / deselect all in this role"
                                      />
                                    </th>
                                    <th className="py-3 px-4 sm:px-5">Candidate</th>
                                    <th className="py-3 px-4 sm:px-5">Date</th>
                                    <th className="py-3 px-4 sm:px-5">Status</th>
                                    <th className="py-3 px-4 sm:px-5">Documents</th>
                                    <th className="py-3 px-4 sm:px-5 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-slate-100 text-slate-800'}`}>
                                  {jobApps.map((app) => {
                                    const { coverLetterUrl } = extractCoverLetterMeta(app.cover_letter);
                                    const attachedClUrl = app.cover_letter_url || coverLetterUrl;
                                    const isSelected = selectedAppIds.has(app.id);
                                    return (
                                    <tr
                                      key={app.id}
                                      className={`transition-colors ${
                                        isSelected
                                          ? isDark
                                            ? 'bg-emerald-950/40 border-l-4 border-l-emerald-500'
                                            : 'bg-emerald-50/80 border-l-4 border-l-emerald-600'
                                          : isDark
                                          ? 'hover:bg-slate-800/50'
                                          : 'hover:bg-slate-50/80'
                                      }`}
                                    >
                                      <td className="py-3.5 px-3 sm:px-4 text-center">
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() => handleToggleSelectApp(app.id)}
                                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                                          title={`Select ${app.applicant_name}`}
                                        />
                                      </td>
                                      <td className="py-3.5 px-4 sm:px-5">
                                        <div>
                                          <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {app.applicant_name}
                                          </div>
                                          <div className={`text-xs font-mono flex items-center space-x-2 mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            <span>{app.applicant_email}</span>
                                            <span>•</span>
                                            <span>{app.applicant_phone}</span>
                                          </div>
                                        </div>
                                      </td>

                                      <td className={`py-3.5 px-4 sm:px-5 whitespace-nowrap font-mono text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                      </td>

                                      <td className="py-3.5 px-4 sm:px-5">
                                        <div className="flex flex-col items-start">
                                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase border ${
                                            app.status === 'new'
                                              ? 'bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300/60 dark:border-blue-700/50'
                                              : app.status === 'shortlisted'
                                              ? 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300/60 dark:border-purple-700/50'
                                              : app.status === 'interviewed'
                                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300/60 dark:border-amber-700/50'
                                              : app.status === 'hired'
                                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/50'
                                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                                          }`}>
                                            {app.status}
                                          </span>
                                          {renderVenueBadge(app)}
                                        </div>
                                      </td>

                                      <td className="py-3.5 px-4 sm:px-5">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5">
                                          <a
                                            href={app.resume_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                                              isDark 
                                                ? 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border-emerald-800/50' 
                                                : 'bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white border-emerald-200'
                                            }`}
                                            title="Download candidate CV / Resume"
                                          >
                                            <IconDownload className="w-3.5 h-3.5" />
                                            <span>CV</span>
                                          </a>
                                          {attachedClUrl && (
                                            <a
                                              href={attachedClUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                                                isDark 
                                                  ? 'bg-purple-950/80 hover:bg-purple-800 text-purple-300 border-purple-800/50' 
                                                  : 'bg-purple-50 hover:bg-purple-700 text-purple-800 hover:text-white border-purple-200'
                                              }`}
                                              title="Download attached cover letter document"
                                            >
                                              <IconDownload className="w-3.5 h-3.5" />
                                              <span>Cover Letter</span>
                                            </a>
                                          )}
                                        </div>
                                      </td>

                                      <td className="py-3.5 px-4 sm:px-5 text-right space-x-2 whitespace-nowrap">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenEmailForCandidate(app)}
                                          className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all border inline-flex items-center space-x-1 cursor-pointer ${
                                            isDark
                                              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                                              : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-2xs'
                                          }`}
                                          title={`Send email to ${app.applicant_name}`}
                                        >
                                          <IconMail className="w-3.5 h-3.5" />
                                          <span className="hidden xl:inline">Email</span>
                                        </button>
                                        <button
                                          onClick={() => handleOpenAppModal(app)}
                                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                                            isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                          }`}
                                        >
                                          Review & Status
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (confirm(`Remove application from ${app.applicant_name}?`)) {
                                              handleDeleteApplication(app.id);
                                            }
                                          }}
                                          className="px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:hover:bg-rose-800 rounded-lg transition-colors border border-rose-200 dark:border-rose-900/40 cursor-pointer"
                                        >
                                          Delete
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
                      )}
                    </div>
                  );
                });
              })()}

              {/* General Talent Network Submissions Section */}
              {(selectedPostingFilter === 'All' || selectedPostingFilter === 'general') && (() => {
                const generalApps = filteredApps.filter((a) => !matchJobForApp(a));
                const totalGeneral = generalAppCount;
                const isCollapsed = !!collapsedPostings['general'];

                return (
                  <div
                    className={`border rounded-2xl shadow-xs overflow-hidden transition-all ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
                    }`}
                  >
                    <div
                      onClick={() => toggleCollapsePosting('general')}
                      className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-colors ${
                        isDark ? 'hover:bg-slate-850/50' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
                        <div className={`w-12 h-14 rounded-xl flex items-center justify-center shrink-0 border ${
                          isDark ? 'bg-blue-950/80 text-blue-400 border-blue-800/60' : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          <IconFileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className={`font-black text-sm sm:text-base leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              General Talent Network Submissions
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 border border-blue-300/60 dark:border-blue-800/50">
                              {totalGeneral} {totalGeneral === 1 ? 'Candidate' : 'Candidates'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Spontaneous applications and candidates submitted without a specific active vacancy link.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
                        {totalGeneral > 0 && (
                          <button
                            type="button"
                            onClick={() => handleDownloadCVs(generalApps, 'General_Applications')}
                            disabled={isDownloadingZip}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                              isDark
                                ? 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border-amber-800'
                                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                            }`}
                            title="Download all General Talent CVs in a ZIP file"
                          >
                            <IconDownload className="w-3.5 h-3.5" />
                            <span>Download CVs ({generalApps.filter((a) => a.resume_url).length})</span>
                          </button>
                        )}
                        {generalApps.length > 0 && (
                          <button
                            type="button"
                            onClick={() => handleSelectAllVisible(generalApps)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                              isDark ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-white text-slate-700'
                            }`}
                          >
                            {generalApps.every((a) => selectedAppIds.has(a.id)) ? 'Deselect All' : `Select All (${generalApps.length})`}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleCollapsePosting('general')}
                          className={`p-1.5 rounded-lg border text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
                            isDark ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-white'
                          }`}
                          title={isCollapsed ? 'Expand candidate list' : 'Collapse candidate list'}
                        >
                          <IconChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isCollapsed ? '-rotate-90' : 'rotate-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {!isCollapsed && (
                      <div className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
                        {generalApps.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 text-xs sm:text-sm font-medium">
                            {totalGeneral === 0
                              ? 'No general talent network applications have been submitted yet.'
                              : 'No general applications match your current search/status filter.'}
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm">
                              <thead className={`border-b text-xs font-bold uppercase tracking-wider ${
                                isDark ? 'bg-slate-800/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}>
                                {generalApps.some((a) => selectedAppIds.has(a.id)) && (
                                  <tr className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white border-b border-emerald-700/60">
                                    <td colSpan={7} className="py-2 px-4">
                                      <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center space-x-2 text-xs font-bold">
                                          <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full text-xs font-black">
                                            {generalApps.filter((a) => selectedAppIds.has(a.id)).length}
                                          </span>
                                          <span>selected in general talent</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <button
                                            type="button"
                                            disabled={isBulkUpdating}
                                            onClick={() => handleBulkStatusChange('shortlisted')}
                                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black flex items-center space-x-1 shadow-xs cursor-pointer"
                                          >
                                            <span>⭐</span>
                                            <span>Shortlist Selected</span>
                                          </button>
                                          <button
                                            type="button"
                                            disabled={isBulkUpdating}
                                            onClick={handleOpenEmailForSelected}
                                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-black flex items-center space-x-1 shadow-xs cursor-pointer"
                                          >
                                            <IconMail className="w-3.5 h-3.5" />
                                            <span>Email Selected</span>
                                          </button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                                <tr>
                                  <th className="py-3 px-3 sm:px-4 w-10 text-center">
                                    <input
                                      type="checkbox"
                                      checked={generalApps.length > 0 && generalApps.every((a) => selectedAppIds.has(a.id))}
                                      onChange={() => handleSelectAllVisible(generalApps)}
                                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                                      title="Select / deselect all in general talent"
                                    />
                                  </th>
                                  <th className="py-3 px-4 sm:px-5">Candidate</th>
                                  <th className="py-3 px-4 sm:px-5">Specified Role/Specialty</th>
                                  <th className="py-3 px-4 sm:px-5">Date</th>
                                  <th className="py-3 px-4 sm:px-5">Status</th>
                                  <th className="py-3 px-4 sm:px-5">Documents</th>
                                  <th className="py-3 px-4 sm:px-5 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-slate-100 text-slate-800'}`}>
                                {generalApps.map((app) => {
                                  const { coverLetterUrl } = extractCoverLetterMeta(app.cover_letter);
                                  const attachedClUrl = app.cover_letter_url || coverLetterUrl;
                                  const isSelected = selectedAppIds.has(app.id);
                                  return (
                                  <tr
                                    key={app.id}
                                    className={`transition-colors ${
                                      isSelected
                                        ? isDark
                                          ? 'bg-emerald-950/40 border-l-4 border-l-emerald-500'
                                          : 'bg-emerald-50/80 border-l-4 border-l-emerald-600'
                                        : isDark
                                        ? 'hover:bg-slate-800/50'
                                        : 'hover:bg-slate-50/80'
                                    }`}
                                  >
                                    <td className="py-3.5 px-3 sm:px-4 text-center">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleToggleSelectApp(app.id)}
                                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                                        title={`Select ${app.applicant_name}`}
                                      />
                                    </td>
                                    <td className="py-3.5 px-4 sm:px-5">
                                      <div>
                                        <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                          {app.applicant_name}
                                        </div>
                                        <div className={`text-xs font-mono flex items-center space-x-2 mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                          <span>{app.applicant_email}</span>
                                          <span>•</span>
                                          <span>{app.applicant_phone}</span>
                                        </div>
                                      </div>
                                    </td>

                                    <td className={`py-3.5 px-4 sm:px-5 font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                      {app.job_title || 'General Engineering Application'}
                                    </td>

                                    <td className={`py-3.5 px-4 sm:px-5 whitespace-nowrap font-mono text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                      {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>

                                    <td className="py-3.5 px-4 sm:px-5">
                                      <div className="flex flex-col items-start">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase border ${
                                          app.status === 'new'
                                            ? 'bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300/60 dark:border-blue-700/50'
                                            : app.status === 'shortlisted'
                                            ? 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300/60 dark:border-purple-700/50'
                                            : app.status === 'interviewed'
                                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300/60 dark:border-amber-700/50'
                                            : app.status === 'hired'
                                            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/50'
                                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                                        }`}>
                                          {app.status}
                                        </span>
                                        {renderVenueBadge(app)}
                                      </div>
                                    </td>

                                    <td className="py-3.5 px-4 sm:px-5">
                                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5">
                                        <a
                                          href={app.resume_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                                            isDark 
                                              ? 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border-emerald-800/50' 
                                              : 'bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white border-emerald-200'
                                          }`}
                                          title="Download candidate CV / Resume"
                                        >
                                          <IconDownload className="w-3.5 h-3.5" />
                                          <span>CV</span>
                                        </a>
                                        {attachedClUrl && (
                                          <a
                                            href={attachedClUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                                              isDark 
                                                ? 'bg-purple-950/80 hover:bg-purple-800 text-purple-300 border-purple-800/50' 
                                                : 'bg-purple-50 hover:bg-purple-700 text-purple-800 hover:text-white border-purple-200'
                                            }`}
                                            title="Download attached cover letter document"
                                          >
                                            <IconDownload className="w-3.5 h-3.5" />
                                            <span>Cover Letter</span>
                                          </a>
                                        )}
                                      </div>
                                    </td>

                                    <td className="py-3.5 px-4 sm:px-5 text-right space-x-2 whitespace-nowrap">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEmailForCandidate(app)}
                                        className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all border inline-flex items-center space-x-1 cursor-pointer ${
                                          isDark
                                            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                                            : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-2xs'
                                        }`}
                                        title={`Send email to ${app.applicant_name}`}
                                      >
                                        <IconMail className="w-3.5 h-3.5" />
                                        <span className="hidden xl:inline">Email</span>
                                      </button>
                                      <button
                                        onClick={() => handleOpenAppModal(app)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                                          isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                        }`}
                                      >
                                        Review & Status
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm(`Remove application from ${app.applicant_name}?`)) {
                                            handleDeleteApplication(app.id);
                                          }
                                        }}
                                        className="px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:hover:bg-rose-800 rounded-lg transition-colors border border-rose-200 dark:border-rose-900/40 cursor-pointer"
                                      >
                                        Delete
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
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Job Openings View */}
      {activeTab === 'openings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`border rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                {/* Flyer graphic thumbnail */}
                {job.image_url ? (
                  <div className={`relative w-full aspect-4/5 rounded-xl overflow-hidden bg-slate-950/20 border border-slate-200 dark:border-slate-800 group ${
                    job.status !== 'active' ? 'grayscale opacity-75' : ''
                  }`}>
                    <img
                      src={job.image_url}
                      alt={job.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewFlyerUrl(job.image_url!)}
                        className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <IconEye className="w-3.5 h-3.5" />
                        <span>View Flyer</span>
                      </button>
                    </div>
                    {job.status === 'active' ? (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-xs">
                        Flyer Attached
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                        Not Accepting Submissions
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="w-full py-4 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-center text-xs text-slate-400">
                    No flyer graphic attached
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    {job.department}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleJobStatus(job)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                      job.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50 hover:bg-emerald-100' 
                        : 'bg-amber-50 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700/50 hover:bg-amber-100'
                    }`}
                    title={job.status === 'active' ? 'Click to disable and stop accepting submissions' : 'Click to enable and resume accepting submissions'}
                  >
                    <span className={`w-2 h-2 rounded-full ${job.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span>{job.status === 'active' ? 'Active / Open' : 'Disabled (Closed)'}</span>
                  </button>
                </div>

                <h3 className={`font-bold text-base sm:text-lg leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {job.title}
                </h3>

                <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  📍 {job.location} • 💼 {job.type} • ⏳ {job.experience_level}
                </p>

                <p className={`text-xs sm:text-sm line-clamp-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {job.description}
                </p>
              </div>

              <div className={`pt-4 mt-4 border-t flex flex-wrap items-center justify-between gap-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleJobStatus(job)}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      job.status === 'active'
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    }`}
                    title={job.status === 'active' ? 'Disable this vacancy so it stops accepting submissions' : 'Activate this vacancy to accept submissions'}
                  >
                    <span>{job.status === 'active' ? 'Disable' : 'Enable'}</span>
                  </button>

                  <button
                    onClick={() => openEditJobModal(job)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isDark 
                        ? 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-800/50' 
                        : 'bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white border border-emerald-200'
                    }`}
                  >
                    <IconEdit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleCopyJobShareLink(job.id)}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors border cursor-pointer ${
                      copiedJobId === job.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : isDark
                          ? 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                    title="Copy shareable link with flyer preview"
                  >
                    {copiedJobId === job.id ? <IconCheck className="w-3.5 h-3.5" /> : <IconShare className="w-3.5 h-3.5" />}
                    <span>{copiedJobId === job.id ? 'Copied!' : 'Share'}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Delete vacancy "${job.title}"?`)) {
                      onDeleteJob(job.id);
                    }
                  }}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-rose-500 hover:text-white hover:bg-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:hover:bg-rose-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <IconTrash className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Application Review Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-2xl shadow-2xl border w-full max-w-xl overflow-hidden animate-scaleIn ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold tracking-tight">
                  Candidate Application: {selectedApp.applicant_name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Applied for: {selectedApp.job_title || 'General Engineering Role'}
                </p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-white p-1">
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl border ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className={`font-bold block mb-1.5 text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Email</span>
                  <a
                    href={`mailto:${selectedApp.applicant_email}`}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                      isDark
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    <span>{selectedApp.applicant_email}</span>
                  </a>
                </div>
                <div>
                  <span className={`font-bold block mb-1.5 text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Phone</span>
                  <a
                    href={`tel:${selectedApp.applicant_phone}`}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                      isDark
                        ? 'bg-blue-950/80 text-blue-300 border-blue-700/80 hover:bg-blue-900'
                        : 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                    }`}
                  >
                    <span>{selectedApp.applicant_phone}</span>
                  </a>
                </div>
              </div>

              {/* Cover Letter Note and/or Attached Document */}
              {(() => {
                const { coverLetterUrl, coverLetterText } = extractCoverLetterMeta(selectedApp.cover_letter);
                const attachedFileUrl = selectedApp.cover_letter_url || coverLetterUrl;
                const displayText = coverLetterText || (!attachedFileUrl ? selectedApp.cover_letter : '');

                if (!displayText && !attachedFileUrl) return null;

                return (
                  <div className="space-y-3">
                    <span className={`font-bold block text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Cover Letter / Candidate Statement</span>
                    {attachedFileUrl && (
                      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDark ? 'bg-purple-950/40 border-purple-800/60' : 'bg-purple-50/70 border-purple-200'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isDark ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700'
                          }`}>
                            DOC
                          </div>
                          <div>
                            <div className={`font-bold text-xs sm:text-sm ${isDark ? 'text-purple-200' : 'text-purple-900'}`}>
                              Attached Cover Letter Document
                            </div>
                            <div className={`text-xs ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                              Uploaded directly by candidate
                            </div>
                          </div>
                        </div>
                        <a
                          href={attachedFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-xs text-xs uppercase tracking-wider transition-colors"
                        >
                          <IconDownload className="w-3.5 h-3.5" />
                          <span>Download Document</span>
                        </a>
                      </div>
                    )}
                    {displayText && (
                      <div>
                        {attachedFileUrl && (
                          <span className={`font-bold block mb-1 text-2xs uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Typed Note</span>
                        )}
                        <p className={`p-4 rounded-xl leading-relaxed whitespace-pre-line border ${
                          isDark ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900 font-medium'
                        }`}>
                          {displayText}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div>
                <span className={`font-bold block mb-1.5 text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Recruiter & Interview Notes</span>
                <textarea
                  rows={3}
                  value={appNotes}
                  onChange={(e) => setAppNotes(e.target.value)}
                  placeholder="Record interview impressions, technical assessment scores, or salary expectations..."
                  className={`w-full p-3.5 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 shadow-2xs'
                  }`}
                />
              </div>

              <div>
                <span className={`font-bold block mb-2 text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Update Candidate Stage:</span>
                <div className="flex flex-wrap gap-2">
                  {(['new', 'shortlisted', 'interviewed', 'hired', 'rejected'] as JobApplication['status'][]).map(st => (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingApp}
                      onClick={() => handleSaveAppNotes(st)}
                      className={`px-3.5 py-2 rounded-xl font-bold uppercase text-xs transition-all border ${
                        selectedApp.status === st
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                          : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      {st === selectedApp.status ? `✓ ${st}` : st}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`pt-4 border-t flex flex-wrap items-center justify-between gap-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const app = selectedApp;
                      setSelectedApp(null);
                      handleOpenEmailForCandidate(app);
                    }}
                    className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs text-xs uppercase tracking-wider cursor-pointer transition-all"
                  >
                    <IconMail className="w-4 h-4" />
                    <span>Email Candidate</span>
                  </button>
                  <a
                    href={selectedApp.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs text-xs uppercase tracking-wider"
                  >
                    <IconDownload className="w-4 h-4" />
                    <span>Download CV</span>
                  </a>
                  {(() => {
                    const clUrl = selectedApp.cover_letter_url || extractCoverLetterMeta(selectedApp.cover_letter).coverLetterUrl;
                    if (!clUrl) return null;
                    return (
                      <a
                        href={clUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-xs text-xs uppercase tracking-wider"
                      >
                        <IconDownload className="w-4 h-4" />
                        <span>Download Cover Letter</span>
                      </a>
                    );
                  })()}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className={`px-4 py-2.5 font-bold rounded-xl text-xs ${
                    isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post / Edit Vacancy Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-2xl shadow-2xl border w-full max-w-lg overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold tracking-tight">
                  {editingJob ? 'Edit Engineering Vacancy' : 'Post New Engineering Vacancy'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Publish open positions to the PIGL Careers page.
                </p>
              </div>
              <button onClick={() => setIsJobModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleJobSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Job Title *</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Lead MetOcean Telemetry Specialist"
                  className={`w-full px-3.5 py-2.5 border rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 shadow-2xs'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Department</label>
                  <select
                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                    className={`w-full px-3.5 py-2.5 border rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                    }`}
                  >
                    <option value="Ground Intelligence">Ground Intelligence</option>
                    <option value="Digital Intelligence">Digital Intelligence</option>
                    <option value="Offshore Intelligence">Offshore Intelligence</option>
                    <option value="Integrated Engineering">Integrated Engineering</option>
                    <option value="Industrial Technologies">Industrial Technologies</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Location</label>
                  <input
                    type="text"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className={`w-full px-3.5 py-2.5 border rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Employment Type</label>
                  <select
                    value={jobType}
                    onChange={(e: any) => setJobType(e.target.value)}
                    className={`w-full px-3.5 py-2.5 border rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                    }`}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Experience Level</label>
                  <input
                    type="text"
                    value={jobExp}
                    onChange={(e) => setJobExp(e.target.value)}
                    placeholder="e.g. 5+ Years"
                    className={`w-full px-3.5 py-2.5 border rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 shadow-2xs'
                    }`}
                  />
                </div>
              </div>

              {/* Listing Status: Active vs Disabled */}
              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                  Listing Status & Availability *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setJobStatus('active')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      jobStatus === 'active'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                        : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="font-bold text-xs uppercase">Active / Accepting CVs</span>
                    </div>
                    <p className="text-[11px] opacity-80 mt-1 leading-snug">
                      Open vacancy. Candidates can apply and submit CVs directly.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setJobStatus('closed')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      jobStatus === 'closed'
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
                        : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="font-bold text-xs uppercase">Disabled / Closed</span>
                    </div>
                    <p className="text-[11px] opacity-80 mt-1 leading-snug">
                      Displays in grayscale with "Not Accepting Submissions".
                    </p>
                  </button>
                </div>
              </div>

              {/* Job Flyer / Promotional Graphic from Local Storage or URL */}
              <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center justify-between">
                  <label className={`block text-xs font-bold uppercase ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                    Job Flyer / Promotional Graphic
                  </label>
                  <div className="flex items-center space-x-1 bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                        imageInputMode === 'upload'
                          ? 'bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-xs'
                          : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Local File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                        imageInputMode === 'url'
                          ? 'bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-xs'
                          : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Presets / URL
                    </button>
                  </div>
                </div>

                {imageInputMode === 'upload' ? (
                  <div>
                    <input
                      ref={jobFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleJobImageFile}
                      className="hidden"
                    />

                    {jobImage ? (
                      <div className="relative rounded-xl border p-3 flex items-center space-x-3 bg-emerald-500/5 border-emerald-500/30">
                        <img
                          src={jobImage}
                          alt="Job flyer preview"
                          className="w-14 h-18 object-cover rounded-lg border border-emerald-500/40 shadow-xs"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            Flyer attached from storage
                          </p>
                          <p className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {jobImage.startsWith('data:') ? 'Local storage image file' : jobImage}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              type="button"
                              onClick={() => jobFileInputRef.current?.click()}
                              className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                            >
                              Choose Different File
                            </button>
                            <span className="text-slate-400">•</span>
                            <button
                              type="button"
                              onClick={() => setJobImage('')}
                              className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => jobFileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                          isDark
                            ? 'border-slate-700 hover:border-emerald-500 bg-slate-950/40 hover:bg-slate-950/70'
                            : 'border-slate-300 hover:border-emerald-600 bg-white hover:bg-emerald-50/30'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-1.5">
                          <IconUpload className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Upload flyer image from local storage
                        </p>
                        <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          PNG, JPG, JPEG, or WEBP (used in job listing & link previews)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={jobImage}
                      onChange={(e) => setJobImage(e.target.value)}
                      placeholder="e.g. /assets/careers/project-surveyor.jpg or https://..."
                      className={`w-full px-3 py-2 border rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 shadow-2xs'
                      }`}
                    />
                    
                    {/* Official Presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className={`text-[10px] font-bold uppercase self-center mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        PIGL Flyers:
                      </span>
                      {[
                        { label: 'Digital Asset Mgr', path: '/assets/careers/digital-asset-manager.jpg' },
                        { label: 'Hydrographic', path: '/assets/careers/hydrographic-surveyor.jpg' },
                        { label: 'Project Surveyor', path: '/assets/careers/project-surveyor.jpg' },
                        { label: 'Geophysical', path: '/assets/careers/geophysical-surveyor.jpg' },
                        { label: 'Data Processor', path: '/assets/careers/data-processor-marine-survey.jpg' },
                        { label: 'Project Mgr', path: '/assets/careers/project-manager.jpg' }
                      ].map((preset) => (
                        <button
                          key={preset.path}
                          type="button"
                          onClick={() => setJobImage(preset.path)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors border cursor-pointer ${
                            jobImage === preset.path
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : isDark
                                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {jobImage && (
                      <div className="mt-2 flex items-center space-x-3 p-2 border rounded-lg border-emerald-500/30 bg-emerald-500/5">
                        <img
                          src={jobImage}
                          alt="Flyer preview"
                          className="w-10 h-14 object-cover rounded border border-emerald-500/40"
                          onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 truncate">{jobImage}</p>
                          <button
                            type="button"
                            onClick={() => setJobImage('')}
                            className="text-[10px] font-bold text-rose-500 hover:underline mt-0.5 cursor-pointer"
                          >
                            Clear flyer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Role Overview</label>
                <textarea
                  rows={2}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  className={`w-full p-3 border rounded-xl leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Requirements (One per line)</label>
                <textarea
                  rows={3}
                  value={jobReqsStr}
                  onChange={(e) => setJobReqsStr(e.target.value)}
                  className={`w-full p-3 font-mono text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Responsibilities (One per line)</label>
                <textarea
                  rows={3}
                  value={jobRespStr}
                  onChange={(e) => setJobRespStr(e.target.value)}
                  className={`w-full p-3 font-mono text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                  }`}
                />
              </div>

              <div className={`pt-4 border-t flex items-center justify-end space-x-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className={`px-4 py-2.5 font-bold rounded-xl text-xs uppercase border transition-colors ${
                    isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 shadow-2xs'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs uppercase tracking-wider transition-colors"
                >
                  {editingJob ? 'Update Vacancy' : 'Publish Vacancy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Open Positions & Applicant Statistics Pop-up Modal */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className={`rounded-2xl shadow-2xl border w-full max-w-3xl overflow-hidden animate-scaleIn max-h-[92vh] flex flex-col ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <IconPieChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    Open Positions &amp; Applicant Statistics
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Live
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time applicant distribution across active and published engineering openings.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStatsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Subheader / Quick Controls */}
            <div className={`px-5 py-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              {/* Segmented Filter */}
              <div className="flex items-center space-x-1.5 p-1 rounded-xl border text-xs font-semibold shrink-0 bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setStatsViewFilter('open_only')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    statsViewFilter === 'open_only'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Open / Published ({openPublishedJobs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatsViewFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    statsViewFilter === 'all'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All Positions ({safeJobs.length})
                </button>
              </div>

              {/* Search Inside Stats */}
              <div className="relative flex-1 max-w-xs">
                <IconSearch className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={statsSearchQuery}
                  onChange={(e) => setStatsSearchQuery(e.target.value)}
                  placeholder="Filter positions by title..."
                  className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              {/* Top KPI Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Open Vacancies
                  </div>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                    {openPublishedJobs.length}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Active &amp; published
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Direct Applicants
                  </div>
                  <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">
                    {activeVacancyApplicantsCount}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Targeted active roles
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    General Talent
                  </div>
                  <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">
                    {generalAppCount}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Spontaneous submissions
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Total Submissions
                  </div>
                  <div className="text-xl font-black text-slate-800 dark:text-white mt-1 font-mono">
                    {safeApps.length}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Recorded in database
                  </div>
                </div>
              </div>

              {/* Positions List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {statsViewFilter === 'open_only' ? 'Active Published Vacancies' : 'All Configured Vacancies'} ({(statsViewFilter === 'open_only' ? openPublishedJobs : safeJobs).length})
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Sorted by applicant volume
                  </span>
                </div>

                {(statsViewFilter === 'open_only' ? openPublishedJobs : safeJobs).length === 0 ? (
                  <div className={`p-8 text-center rounded-xl border ${
                    isDark ? 'bg-slate-800/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    No positions found matching your criteria.
                  </div>
                ) : (
                  (statsViewFilter === 'open_only' ? openPublishedJobs : safeJobs)
                    .filter((job) => {
                      if (!statsSearchQuery.trim()) return true;
                      const q = statsSearchQuery.toLowerCase().trim();
                      return (
                        job.title?.toLowerCase().includes(q) ||
                        job.department?.toLowerCase().includes(q) ||
                        job.location?.toLowerCase().includes(q)
                      );
                    })
                    .sort((a, b) => getPostingAppCount(b.id) - getPostingAppCount(a.id))
                    .map((job) => {
                      const count = getPostingAppCount(job.id);
                      const stats = getJobDetailStats(job.id);
                      const pctOfTotal = safeApps.length > 0 ? Math.round((count / safeApps.length) * 100) : 0;
                      const isOpen = job.status === 'active';

                      return (
                        <div
                          key={job.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isDark
                              ? 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/80'
                              : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-2xs'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                  {job.title}
                                </h5>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                                    isOpen
                                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                                  }`}
                                >
                                  {isOpen ? 'Active / Open' : 'Closed / Disabled'}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                  isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {job.type || 'Full-time'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
                                <span>{job.department}</span>
                                <span>&bull;</span>
                                <span>{job.location}</span>
                                <span>&bull;</span>
                                <span>{job.experience_level || '3+ Years'}</span>
                              </p>
                            </div>

                            {/* Applicant Big Counter Badge */}
                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                              <div className="text-right">
                                <div className="flex items-baseline justify-end gap-1.5">
                                  <span className={`text-xl font-black font-mono ${
                                    count > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                                  }`}>
                                    {count}
                                  </span>
                                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    {count === 1 ? 'Applicant' : 'Applicants'}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {pctOfTotal}% of all candidate submissions
                                </div>
                              </div>

                              {count > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadCVs(getAppsForCategory(job.id), job.title);
                                  }}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center space-x-1 cursor-pointer ${
                                    isDark
                                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs'
                                  }`}
                                  title={`Download ZIP of all ${count} CVs for ${job.title}`}
                                >
                                  <IconDownload className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>CVs ({count})</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleSelectPostingFromStats(job.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center space-x-1 cursor-pointer ${
                                  count > 0
                                    ? isDark
                                      ? 'bg-emerald-950/70 border-emerald-700/80 text-emerald-300 hover:bg-emerald-900'
                                      : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                                    : isDark
                                    ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                                }`}
                                title="View applications for this position"
                              >
                                <span>View</span>
                                <IconChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Progress fill bar */}
                          <div className="mt-3">
                            <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                              isDark ? 'bg-slate-700/60' : 'bg-slate-100'
                            }`}>
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  count > 0 ? 'bg-emerald-500' : 'bg-transparent'
                                }`}
                                style={{ width: `${Math.min(100, Math.max(count > 0 ? 8 : 0, pctOfTotal))}%` }}
                              />
                            </div>
                          </div>

                          {/* Pipeline Breakdown Pills */}
                          {count > 0 && (
                            <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/50 flex items-center gap-2 flex-wrap text-[11px]">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pipeline:</span>
                              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-semibold">
                                New: {stats.newCount}
                              </span>
                              {stats.shortlistedCount > 0 && (
                                <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 font-semibold">
                                  Shortlisted: {stats.shortlistedCount}
                                </span>
                              )}
                              {stats.interviewedCount > 0 && (
                                <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900 font-semibold">
                                  Interviewed: {stats.interviewedCount}
                                </span>
                              )}
                              {stats.hiredCount > 0 && (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-semibold">
                                  Hired: {stats.hiredCount}
                                </span>
                              )}
                              {stats.rejectedCount > 0 && (
                                <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-semibold">
                                  Rejected: {stats.rejectedCount}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                )}

                {/* General Talent Network Card */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-800/30 border-dashed border-slate-700'
                      : 'bg-slate-50/70 border-dashed border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                          General Talent Network (Spontaneous Applications)
                        </h5>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          generalAppEnabled
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                        }`}>
                          {generalAppEnabled ? 'Intake Active' : 'Intake Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Candidates submitted through the spontaneous open inquiry form without selecting a specific opening.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1.5">
                          <span className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">
                            {generalAppCount}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Applicants
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {safeApps.length > 0 ? Math.round((generalAppCount / safeApps.length) * 100) : 0}% of all submissions
                        </div>
                      </div>

                      {generalAppCount > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadCVs(getAppsForCategory('general'), 'General Talent Network');
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center space-x-1 cursor-pointer ${
                            isDark
                              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs'
                          }`}
                          title={`Download ZIP of all ${generalAppCount} CVs for General Talent Network`}
                        >
                          <IconDownload className="w-3.5 h-3.5 text-amber-500" />
                          <span>CVs ({generalAppCount})</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleSelectPostingFromStats('general')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center space-x-1 cursor-pointer ${
                          isDark
                            ? 'bg-amber-950/70 border-amber-800 text-amber-300 hover:bg-amber-900'
                            : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                        }`}
                        title="View general applicants"
                      >
                        <span>View</span>
                        <IconChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 sm:p-5 border-t flex items-center justify-between shrink-0 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Total: <strong className="text-slate-800 dark:text-slate-200">{openPublishedJobs.length}</strong> open positions &bull; <strong className="text-slate-800 dark:text-slate-200">{safeApps.length}</strong> total submissions
              </div>
              <button
                type="button"
                onClick={() => setIsStatsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flyer Image Preview Lightbox Modal */}
      {previewFlyerUrl && (
        <div className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPreviewFlyerUrl(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-colors"
            >
              <IconClose className="w-6 h-6" />
            </button>
            <img
              src={previewFlyerUrl}
              alt="Hiring Flyer"
              className="max-h-[85vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}

      {/* Floating Bulk Actions Bar */}
      {selectedAppIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900/95 dark:bg-slate-900/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 sm:gap-4 flex-wrap max-w-[95vw]">
            <div className="flex items-center gap-2 border-r border-slate-700 pr-3 sm:pr-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-xs">
                {selectedAppIds.size}
              </span>
              <span className="text-xs font-bold whitespace-nowrap">
                {selectedAppIds.size === 1 ? 'Candidate' : 'Candidates'} Selected
              </span>
            </div>

            {/* Quick Shortlist Button (Bulk) */}
            <button
              type="button"
              disabled={isBulkUpdating}
              onClick={() => handleBulkStatusChange('shortlisted')}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
              title="Shortlist selected candidates in bulk"
            >
              <span>⭐</span>
              <span>Shortlist Selected</span>
            </button>

            {/* Change Status Dropdown */}
            <div className="relative group">
              <select
                disabled={isBulkUpdating}
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkStatusChange(e.target.value as JobApplication['status']);
                  }
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
              >
                <option value="" disabled>Change Status to...</option>
                <option value="new">Mark as New</option>
                <option value="shortlisted">⭐ Shortlist</option>
                <option value="interviewed">🎙️ Interviewed</option>
                <option value="hired">🎉 Hired</option>
                <option value="rejected">❌ Rejected</option>
              </select>
            </div>

            {/* Download Selected CVs */}
            <button
              type="button"
              disabled={isBulkUpdating || isDownloadingZip}
              onClick={handleDownloadSelectedCVs}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              title="Download ZIP of all selected candidate CVs"
            >
              <IconDownload className="w-3.5 h-3.5" />
              <span>Download CVs ({selectedAppIds.size})</span>
            </button>

            {/* Email Selected Candidates */}
            <button
              type="button"
              disabled={isBulkUpdating}
              onClick={handleOpenEmailForSelected}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              title="Compose and send personalized emails to all selected candidates"
            >
              <IconMail className="w-3.5 h-3.5" />
              <span>Email ({selectedAppIds.size})</span>
            </button>

            {/* Delete Selected */}
            <button
              type="button"
              disabled={isBulkUpdating}
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer disabled:opacity-50"
              title="Delete selected candidates"
            >
              <IconTrash className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>

            {/* Deselect All */}
            <button
              type="button"
              onClick={handleClearSelection}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear selection"
            >
              <IconClose className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl p-6 shadow-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <IconTrash className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Delete Selected Candidates</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to permanently delete <strong className="text-rose-600 dark:text-rose-400">{selectedAppIds.size}</strong> selected applicant submission{selectedAppIds.size > 1 ? 's' : ''}?
            </p>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                disabled={isBulkUpdating}
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border ${
                  isDark
                    ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isBulkUpdating}
                onClick={handleExecuteBulkDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
              >
                {isBulkUpdating ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <IconTrash className="w-3.5 h-3.5" />
                    <span>Delete {selectedAppIds.size} {selectedAppIds.size > 1 ? 'Applications' : 'Application'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ZIP Download Progress Modal */}
      {isDownloadingZip && downloadProgress && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl p-6 shadow-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 animate-bounce">
                <IconDownload className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                  {downloadModalTitle ? `Packaging CVs: ${downloadModalTitle}` : 'Packaging CV Archive...'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Compacting and bundling candidate CVs into a clean ZIP...
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-600 dark:text-slate-300">
                  {downloadProgress.current} of {downloadProgress.total} CVs fetched
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                  {downloadProgress.percent}%
                </span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden ${
                isDark ? 'bg-slate-800' : 'bg-slate-100'
              }`}>
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.max(4, downloadProgress.percent)}%` }}
                />
              </div>
              {downloadProgress.currentName && (
                <p className="text-[11px] text-slate-400 truncate">
                  Processing: <span className="font-semibold text-slate-700 dark:text-slate-300">{downloadProgress.currentName}</span>
                </p>
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Please keep this tab open. Your ZIP download will start automatically once ready.
            </p>
          </div>
        </div>
      )}

      {/* Bulk Action Toast Notification */}
      {bulkActionToast && (
        <div className="fixed top-6 right-6 z-60 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center space-x-3 ${
            bulkActionToast.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-800 text-emerald-200'
              : bulkActionToast.type === 'error'
              ? 'bg-rose-950/95 border-rose-800 text-rose-200'
              : 'bg-slate-900/95 border-slate-700 text-slate-200'
          }`}>
            {bulkActionToast.type === 'success' ? (
              <IconCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : bulkActionToast.type === 'error' ? (
              <span className="text-rose-400 text-base font-bold">⚠️</span>
            ) : (
              <span className="text-blue-400 text-base font-bold">ℹ️</span>
            )}
            <p className="text-xs font-semibold">{bulkActionToast.message}</p>
          </div>
        </div>
      )}

      {/* Candidate Communication Slide-Over Drawer (Option C) */}
      <ApplicantEmailDrawer
        isOpen={isEmailDrawerOpen}
        onClose={() => setIsEmailDrawerOpen(false)}
        applications={emailDrawerApps}
        onStatusUpdated={async (ids, newStatus) => {
          if (onBulkUpdateApplicationStatus) {
            await onBulkUpdateApplicationStatus(ids, newStatus);
          } else {
            await Promise.all(ids.map((id) => handleUpdateStatus(id, newStatus)));
          }
          setBulkActionToast({
            message: `Updated status for ${ids.length} candidate${ids.length > 1 ? 's' : ''} to "${newStatus}".`,
            type: 'success',
          });
          setTimeout(() => setBulkActionToast(null), 4000);
          handleClearSelection();
        }}
        isDark={isDark}
      />
    </div>
  );
};

export default AdminCareers;
