import React, { useState } from 'react';
import { JobApplication, JobOpening } from '../../types';
import {
  IconCareers,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconDownload,
  IconCheck,
  IconClose,
  IconFileText,
  IconPhone,
  IconMail
} from '../../components/admin/AdminIcons';

interface AdminCareersProps {
  applications: JobApplication[];
  jobs: JobOpening[];
  loading?: boolean;
  appsLoading?: boolean;
  jobsLoading?: boolean;
  onUpdateApplicationStatus?: (id: string, status: JobApplication['status'], notes?: string) => Promise<any>;
  onUpdateAppStatus?: (id: string, status: JobApplication['status'], notes?: string) => Promise<any>;
  onDeleteApplication?: (id: string) => Promise<any>;
  onDeleteApp?: (id: string) => Promise<any>;
  onSaveJob: (job: Partial<JobOpening> & { title: string; department: string }) => Promise<any>;
  onDeleteJob: (id: string) => Promise<any>;
  theme?: 'light' | 'dark';
}

const AdminCareers: React.FC<AdminCareersProps> = ({
  applications,
  jobs,
  loading = false,
  appsLoading = false,
  jobsLoading = false,
  onUpdateApplicationStatus,
  onUpdateAppStatus,
  onDeleteApplication,
  onDeleteApp,
  onSaveJob,
  onDeleteJob,
  theme = 'light'
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'openings'>('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Selected Application Modal / Drawer
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [appNotes, setAppNotes] = useState('');
  const [updatingApp, setUpdatingApp] = useState(false);

  // Job Opening Modal
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
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

  const isDark = theme === 'dark';
  const handleUpdateStatus = onUpdateApplicationStatus || onUpdateAppStatus || (async () => {});
  const handleDeleteApplication = onDeleteApplication || onDeleteApp || (async () => {});

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesSearch =
      app.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.job_title && app.job_title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
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

  const openCreateJobModal = () => {
    setEditingJob(null);
    setJobTitle('');
    setJobDept('Ground Intelligence');
    setJobLocation('Port Harcourt, Rivers State');
    setJobType('Full-time');
    setJobExp('3+ Years');
    setJobDesc('');
    setJobReqsStr('');
    setJobRespStr('');
    setJobStatus('active');
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
      status: jobStatus
    });

    setIsJobModalOpen(false);
  };

  const exportApplicationsToCSV = () => {
    const headers = ['Applicant Name', 'Email', 'Phone', 'Role Applied For', 'Status', 'Applied Date', 'Resume URL', 'Notes'];
    const rows = applications.map(a => [
      `"${a.applicant_name}"`,
      `"${a.applicant_email}"`,
      `"${a.applicant_phone}"`,
      `"${a.job_title || 'General Application'}"`,
      `"${a.status}"`,
      `"${new Date(a.created_at).toLocaleDateString('en-GB')}"`,
      `"${a.resume_url}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);

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
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Careers & Talent Acquisition Desk
            </h1>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
              isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' : 'bg-emerald-100 text-emerald-900 border-emerald-300/60'
            }`}>
              {applications.length} Applications
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Review candidate resumes submitted via /careers and manage open engineering vacancies.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {activeTab === 'applications' ? (
            <button
              onClick={exportApplicationsToCSV}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border shadow-xs ${
                isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <IconDownload className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          ) : (
            <button
              onClick={openCreateJobModal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center space-x-2"
            >
              <IconPlus className="w-4 h-4" />
              <span>Post New Vacancy</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex items-center space-x-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'applications'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <IconFileText className="w-4 h-4" />
          <span>Candidate Applications (CVs)</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
            isDark ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50' : 'bg-emerald-100 text-emerald-900'
          }`}>
            {applications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('openings')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'openings'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <IconCareers className="w-4 h-4" />
          <span>Active Vacancies & Roles</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
            isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-700'
          }`}>
            {jobs.length}
          </span>
        </button>
      </div>

      {/* Applications View */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {/* Filter toolbar */}
          <div className={`p-4 rounded-2xl border shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
          }`}>
            <div className="relative w-full sm:w-84">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <IconSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search candidate name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {['All', 'new', 'shortlisted', 'interviewed', 'hired', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold capitalize whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Applications Table */}
          <div className={`border rounded-2xl shadow-xs overflow-hidden transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
          }`}>
            {appsLoading || loading ? (
              <div className="p-12 text-center text-slate-400 text-sm font-medium">
                <svg className="animate-spin h-6 w-6 text-emerald-500 mx-auto mb-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading applicant submissions...
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm font-medium">
                No candidate applications match your current filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className={`border-b text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <tr>
                      <th className="py-3.5 px-4 sm:px-5">Candidate</th>
                      <th className="py-3.5 px-4 sm:px-5">Applied Role</th>
                      <th className="py-3.5 px-4 sm:px-5">Date</th>
                      <th className="py-3.5 px-4 sm:px-5">Status</th>
                      <th className="py-3.5 px-4 sm:px-5">Resume</th>
                      <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-slate-100 text-slate-800'}`}>
                    {filteredApps.map((app) => (
                      <tr key={app.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/80'}`}>
                        <td className="py-4 px-4 sm:px-5">
                          <div>
                            <div className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {app.applicant_name}
                            </div>
                            <div className={`text-xs font-mono flex items-center space-x-2 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              <span>{app.applicant_email}</span>
                              <span>•</span>
                              <span>{app.applicant_phone}</span>
                            </div>
                          </div>
                        </td>

                        <td className={`py-4 px-4 sm:px-5 font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {app.job_title || 'General Engineering Application'}
                        </td>

                        <td className={`py-4 px-4 sm:px-5 whitespace-nowrap font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>

                        <td className="py-4 px-4 sm:px-5">
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
                        </td>

                        <td className="py-4 px-4 sm:px-5">
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                              isDark 
                                ? 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border-emerald-800/50' 
                                : 'bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white border-emerald-200'
                            }`}
                          >
                            <IconDownload className="w-3.5 h-3.5" />
                            <span>Download CV</span>
                          </a>
                        </td>

                        <td className="py-4 px-4 sm:px-5 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => handleOpenAppModal(app)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
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
                            className="px-2.5 py-1.5 text-xs font-bold text-rose-500 hover:text-white hover:bg-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:hover:bg-rose-800 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {job.department}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase border ${
                    job.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/50' 
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}>
                    {job.status}
                  </span>
                </div>

                <h3 className={`font-bold text-base sm:text-lg leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {job.title}
                </h3>

                <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  📍 {job.location} • 💼 {job.type} • ⏳ {job.experience_level}
                </p>

                <p className={`text-xs sm:text-sm line-clamp-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {job.description}
                </p>
              </div>

              <div className={`pt-4 mt-4 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  onClick={() => openEditJobModal(job)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    isDark 
                      ? 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-800/50' 
                      : 'bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white border border-emerald-200'
                  }`}
                >
                  <IconEdit className="w-3.5 h-3.5" />
                  <span>Edit Role</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete vacancy "${job.title}"?`)) {
                      onDeleteJob(job.id);
                    }
                  }}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-rose-500 hover:text-white hover:bg-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:hover:bg-rose-800 rounded-lg text-xs font-bold transition-colors"
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

              {selectedApp.cover_letter && (
                <div>
                  <span className={`font-bold block mb-1.5 text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Cover Note / Introduction</span>
                  <p className={`p-4 rounded-xl leading-relaxed border ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900 font-medium'
                  }`}>
                    {selectedApp.cover_letter}
                  </p>
                </div>
              )}

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

              <div className={`pt-4 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <a
                  href={selectedApp.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs text-xs uppercase tracking-wider"
                >
                  <IconDownload className="w-4 h-4" />
                  <span>Download Attached Resume</span>
                </a>
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
    </div>
  );
};

export default AdminCareers;
