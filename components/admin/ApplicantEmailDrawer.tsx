import React, { useState, useEffect, useMemo } from 'react';
import { JobApplication } from '../../types';
import { sendCorporateEmail } from '../../lib/email';
import {
  ApplicantEmailType,
  ApplicantEmailParams,
  getDefaultSubject,
  getDefaultMessage,
  generateApplicantEmailHtml,
} from '../../utils/applicantEmailTemplates';
import {
  IconClose,
  IconSend,
  IconCheck,
  IconCheckCircle,
  IconFileText,
  IconExternal,
  IconMail
} from './AdminIcons';

export interface ApplicantEmailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  applications: JobApplication[];
  onStatusUpdated?: (applicationIds: string[], newStatus: JobApplication['status']) => void;
  isDark?: boolean;
}

export const ApplicantEmailDrawer: React.FC<ApplicantEmailDrawerProps> = ({
  isOpen,
  onClose,
  applications,
  onStatusUpdated,
  isDark = false,
}) => {
  const isBulk = applications.length > 1;
  const primaryApp = applications[0] || null;

  // Active view tab: 'compose' vs 'preview'
  const [viewTab, setViewTab] = useState<'compose' | 'preview'>('compose');

  // Email template type
  const [emailType, setEmailType] = useState<ApplicantEmailType>('interview');

  // Interview parameters
  const [interviewDate, setInterviewDate] = useState(() => {
    // Default to tomorrow or 3 days from now
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [interviewTime, setInterviewTime] = useState('11:00 AM (WAT)');
  const [interviewMode, setInterviewMode] = useState<'virtual' | 'physical'>('virtual');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/pigl-technical-interview');
  const [interviewLocation, setInterviewLocation] = useState(
    'PIGL Operations Base, #3 Diamond Close, Castle & Green Estate, Off Eneka Link Road, Port Harcourt.'
  );
  const [interviewerNames, setInterviewerNames] = useState('Recruitment and Technical Evaluation Team');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Offer parameters
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  });
  const [department, setDepartment] = useState('Operations & Engineering');

  // Email subject & body text state
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [isCustomEdited, setIsCustomEdited] = useState(false);

  // Venue Check-In QR Pass toggle (for interview invitations)
  const [includeQrPass, setIncludeQrPass] = useState(true);

  // Status sync option
  const [syncStatus, setSyncStatus] = useState(true);

  // Sending progress & feedback
  const [isSending, setIsSending] = useState(false);
  const [sendingProgress, setSendingProgress] = useState<{ current: number; total: number; name: string } | null>(null);
  const [toastNotification, setToastNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Test email state
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('bosahkc@gmail.com');
  const [showTestInput, setShowTestInput] = useState(false);

  // Target status based on template
  const targetStatus: JobApplication['status'] = useMemo(() => {
    switch (emailType) {
      case 'interview':
        return 'interviewed';
      case 'shortlisted':
        return 'shortlisted';
      case 'offer':
        return 'hired';
      case 'talent_pool':
        return 'rejected';
      default:
        return primaryApp?.status || 'new';
    }
  }, [emailType, primaryApp]);

  // Parameters object generator
  const getParams = (app: JobApplication | null): ApplicantEmailParams => {
    const candidateName = app?.applicant_name
      ? app.applicant_name
      : (isBulk ? '{candidate_name}' : 'Candidate');
    const uniqueRoles = Array.from(new Set(applications.map((a) => a.job_title).filter(Boolean)));
    const resolvedRole = app?.job_title
      ? app.job_title
      : (isBulk && uniqueRoles.length === 1 ? uniqueRoles[0] : (isBulk ? '{job_title}' : 'Engineering Role'));
    return {
      type: emailType,
      applicationId: app?.id || 'preview',
      candidateName,
      candidateEmail: app?.applicant_email || '',
      jobTitle: resolvedRole,
      interviewDate,
      interviewTime,
      interviewMode,
      meetingLink,
      interviewLocation,
      interviewerNames,
      specialInstructions,
      startDate,
      department,
      customSubject: subject,
      customMessage: isCustomEdited ? bodyText : undefined,
      includeQrPass,
    };
  };

  // Recompute default subject and body text when template or parameters change
  useEffect(() => {
    if (!isOpen) return;
    if (!isCustomEdited) {
      if (isBulk) {
        const p = getParams(null);
        setSubject(getDefaultSubject(emailType, p.jobTitle, '{candidate_name}'));
        setBodyText(getDefaultMessage(p));
      } else {
        const p = getParams(primaryApp);
        setSubject(getDefaultSubject(emailType, p.jobTitle, p.candidateName));
        setBodyText(getDefaultMessage(p));
      }
    }
  }, [
    emailType,
    interviewDate,
    interviewTime,
    interviewMode,
    meetingLink,
    interviewLocation,
    interviewerNames,
    specialInstructions,
    startDate,
    department,
    primaryApp,
    isBulk,
    isOpen,
    isCustomEdited
  ]);

  // Reset custom text if user requests
  const handleResetToTemplate = () => {
    setIsCustomEdited(false);
    if (isBulk) {
      const p = getParams(null);
      setSubject(getDefaultSubject(emailType, p.jobTitle, '{candidate_name}'));
      setBodyText(getDefaultMessage(p));
    } else {
      const p = getParams(primaryApp);
      setSubject(getDefaultSubject(emailType, p.jobTitle, p.candidateName));
      setBodyText(getDefaultMessage(p));
    }
    setToastNotification({ message: 'Reset template to defaults', type: 'info' });
    setTimeout(() => setToastNotification(null), 3000);
  };

  // Generated HTML for preview
  const previewHtml = useMemo(() => {
    const p = getParams(primaryApp);
    return generateApplicantEmailHtml({
      ...p,
      customMessage: bodyText,
    });
  }, [primaryApp, emailType, interviewDate, interviewTime, interviewMode, meetingLink, interviewLocation, interviewerNames, specialInstructions, startDate, department, bodyText, includeQrPass]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSending) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSending, onClose]);

  // Send Test Email to Admin
  const handleSendTestEmail = async () => {
    if (!testEmailAddress.trim()) {
      setToastNotification({ message: 'Please enter a test email address.', type: 'error' });
      setTimeout(() => setToastNotification(null), 3000);
      return;
    }

    setIsSendingTest(true);
    try {
      const p = getParams(primaryApp);
      const testHtml = generateApplicantEmailHtml({
        ...p,
        customMessage: bodyText,
      });

      const res = await sendCorporateEmail({
        to: testEmailAddress.trim(),
        from: '"Polaris Careers" <career@polarisigl.com>',
        replyTo: 'career@polarisigl.com',
        subject: `[TEST PREVIEW] ${subject}`,
        html: testHtml,
        text: bodyText,
      });

      if (res.success) {
        setToastNotification({
          message: `Test preview email successfully sent to ${testEmailAddress}!`,
          type: 'success',
        });
        setShowTestInput(false);
      } else {
        setToastNotification({
          message: res.error || 'Failed to dispatch test email.',
          type: 'error',
        });
      }
    } catch (err: any) {
      setToastNotification({ message: err?.message || 'Error sending test email.', type: 'error' });
    } finally {
      setIsSendingTest(false);
      setTimeout(() => setToastNotification(null), 5000);
    }
  };

  // Dispatch Email(s) to Candidate(s)
  const handleSendToCandidates = async () => {
    if (applications.length === 0) return;

    setIsSending(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < applications.length; i++) {
        const app = applications[i];
        setSendingProgress({
          current: i + 1,
          total: applications.length,
          name: app.applicant_name,
        });

        // Personalize body and HTML for this specific candidate
        const candidateName = app.applicant_name || 'Candidate';
        const candidateJob = app.job_title || 'Engineering Role';
        const candidateParams: ApplicantEmailParams = {
          ...getParams(app),
          candidateName,
          candidateEmail: app.applicant_email,
          jobTitle: candidateJob,
        };

        // If template was not customized, generate clean message with candidate's actual name
        let personalizedBody: string;
        if (!isCustomEdited) {
          personalizedBody = getDefaultMessage(candidateParams);
        } else {
          // If admin customized the text, dynamically replace candidate placeholders
          personalizedBody = bodyText
            .replace(/\{candidate_name\}/gi, candidateName)
            .replace(/\{name\}/gi, candidateName)
            .replace(/\{job_title\}/gi, candidateJob);

          if (primaryApp?.applicant_name && primaryApp.applicant_name !== candidateName) {
            personalizedBody = personalizedBody.replace(
              new RegExp(`\\b${primaryApp.applicant_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'),
              candidateName
            );
          }
        }

        const personalizedHtml = generateApplicantEmailHtml({
          ...candidateParams,
          customMessage: personalizedBody,
        });

        const personalizedSubject = (isCustomEdited ? subject : getDefaultSubject(emailType, candidateJob, candidateName))
          .replace(/\{candidate_name\}/gi, candidateName)
          .replace(/\{name\}/gi, candidateName)
          .replace(/\{job_title\}/gi, candidateJob);

        const res = await sendCorporateEmail({
          to: app.applicant_email,
          from: '"Polaris Careers" <career@polarisigl.com>',
          replyTo: 'career@polarisigl.com',
          subject: personalizedSubject,
          html: personalizedHtml,
          text: personalizedBody,
        });

        if (res.success) {
          successCount++;
        } else {
          console.error(`Failed to send to ${app.applicant_email}:`, res.error);
          failCount++;
        }
      }

      // Automatically sync candidate status if option checked
      if (syncStatus && onStatusUpdated && successCount > 0) {
        const appIds = applications.map((a) => a.id);
        onStatusUpdated(appIds, targetStatus);
      }

      if (failCount === 0) {
        setToastNotification({
          message: `Successfully dispatched corporate email to ${successCount} candidate${successCount > 1 ? 's' : ''}!`,
          type: 'success',
        });
        setTimeout(() => {
          setIsSending(false);
          setSendingProgress(null);
          onClose();
        }, 1500);
      } else {
        setToastNotification({
          message: `Dispatched to ${successCount} candidate(s). ${failCount} failed. Check console for details.`,
          type: 'error',
        });
        setIsSending(false);
        setSendingProgress(null);
      }
    } catch (err: any) {
      console.error('Email dispatch loop error:', err);
      setToastNotification({
        message: err?.message || 'Error occurred while sending emails.',
        type: 'error',
      });
      setIsSending(false);
      setSendingProgress(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => !isSending && onClose()}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div
          className={`w-screen max-w-2xl sm:max-w-2xl md:max-w-3xl flex flex-col shadow-2xl border-l transform transition-transform duration-300 ease-in-out ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          {/* Drawer Header */}
          <div
            className={`p-5 sm:p-6 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <IconMail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white truncate flex items-center gap-2">
                  <span>{isBulk ? `Communicate with ${applications.length} Candidates` : `Email: ${primaryApp?.applicant_name}`}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {isBulk ? (
                    <span>Bulk personalized transmission via PIGL corporate mailer</span>
                  ) : (
                    <span>
                      {primaryApp?.applicant_email} &bull; <strong className="text-emerald-600 dark:text-emerald-400">{primaryApp?.job_title || 'General Application'}</strong>
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {primaryApp?.resume_url && !isBulk && (
                <a
                  href={primaryApp.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className={`hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs'
                  }`}
                  title="Review Candidate CV in New Tab"
                >
                  <IconFileText className="w-3.5 h-3.5 text-emerald-500" />
                  <span>View CV</span>
                  <IconExternal className="w-3 h-3 text-slate-400" />
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                disabled={isSending}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close drawer"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Template Selection & View Switcher Bar */}
          <div
            className={`px-5 py-3 border-b flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Template Selector Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => {
                  setEmailType('interview');
                  setIsCustomEdited(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center space-x-1.5 cursor-pointer ${
                  emailType === 'interview'
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>🎙️</span>
                <span>Interview Invite</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmailType('shortlisted');
                  setIsCustomEdited(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center space-x-1.5 cursor-pointer ${
                  emailType === 'shortlisted'
                    ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                    : isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>⭐</span>
                <span>Shortlisted</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmailType('offer');
                  setIsCustomEdited(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center space-x-1.5 cursor-pointer ${
                  emailType === 'offer'
                    ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                    : isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>🎉</span>
                <span>Offer / Hired</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmailType('talent_pool');
                  setIsCustomEdited(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center space-x-1.5 cursor-pointer ${
                  emailType === 'talent_pool'
                    ? 'bg-slate-700 border-slate-700 text-white shadow-xs'
                    : isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>📋</span>
                <span>Talent Pool</span>
              </button>
            </div>

            {/* View Tab Switcher: Edit vs Live Preview */}
            <div className="flex items-center rounded-xl p-1 bg-slate-100 dark:bg-slate-800 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setViewTab('compose')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewTab === 'compose'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                ✏️ Compose
              </button>
              <button
                type="button"
                onClick={() => setViewTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewTab === 'preview'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                👁️ Live Preview
              </button>
            </div>
          </div>

          {/* Drawer Body Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {viewTab === 'compose' ? (
              <>
                {/* Specific Parameters Section for Interview */}
                {emailType === 'interview' && (
                  <div
                    className={`p-4 rounded-2xl border space-y-4 ${
                      isDark
                        ? 'bg-slate-800/40 border-slate-700/80'
                        : 'bg-emerald-50/50 border-emerald-200/80 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">📅</span>
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                          Interview Parameters
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Populates schedule cards & buttons in email
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Interview Date */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Interview Date <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={interviewDate}
                          onChange={(e) => {
                            setInterviewDate(e.target.value);
                            setIsCustomEdited(false);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                            isDark
                              ? 'bg-slate-900 border-slate-700 text-white'
                              : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      {/* Interview Time */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Interview Time & Timezone <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={interviewTime}
                          onChange={(e) => {
                            setInterviewTime(e.target.value);
                            setIsCustomEdited(false);
                          }}
                          placeholder="e.g. 10:00 AM (WAT)"
                          className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                            isDark
                              ? 'bg-slate-900 border-slate-700 text-white'
                              : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      {/* Format / Mode */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Meeting Format
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setInterviewMode('virtual');
                              setIsCustomEdited(false);
                            }}
                            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                              interviewMode === 'virtual'
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                : isDark
                                ? 'bg-slate-900 border-slate-700 text-slate-300'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>🎥</span>
                            <span>Virtual (Google Meet / Zoom)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setInterviewMode('physical');
                              setIsCustomEdited(false);
                            }}
                            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                              interviewMode === 'physical'
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                : isDark
                                ? 'bg-slate-900 border-slate-700 text-slate-300'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>🏢</span>
                            <span>In-Person (Office / Base)</span>
                          </button>
                        </div>
                      </div>

                      {/* Virtual Link or Physical Venue */}
                      {interviewMode === 'virtual' ? (
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Video Meeting Link (Google Meet / Microsoft Teams / Zoom)
                          </label>
                          <input
                            type="url"
                            value={meetingLink}
                            onChange={(e) => {
                              setMeetingLink(e.target.value);
                              setIsCustomEdited(false);
                            }}
                            placeholder="https://meet.google.com/xyz-abcd-efg"
                            className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                              isDark
                                ? 'bg-slate-900 border-slate-700 text-white'
                                : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>
                      ) : (
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Physical Venue / Address
                          </label>
                          <input
                            type="text"
                            value={interviewLocation}
                            onChange={(e) => {
                              setInterviewLocation(e.target.value);
                              setIsCustomEdited(false);
                            }}
                            placeholder="Corporate Base, Port Harcourt..."
                            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                              isDark
                                ? 'bg-slate-900 border-slate-700 text-white'
                                : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>
                      )}

                      {/* Evaluation Panel */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Evaluation Panel / Interviewers
                        </label>
                        <input
                          type="text"
                          value={interviewerNames}
                          onChange={(e) => {
                            setInterviewerNames(e.target.value);
                            setIsCustomEdited(false);
                          }}
                          placeholder="e.g. Technical Screening Committee & HR"
                          className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                            isDark
                              ? 'bg-slate-900 border-slate-700 text-white'
                              : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      {/* Special Instructions */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Custom Instructions (Optional — Leave blank for automatic role-specific text)
                        </label>
                        <textarea
                          rows={2}
                          value={specialInstructions}
                          onChange={(e) => {
                            setSpecialInstructions(e.target.value);
                            setIsCustomEdited(false);
                          }}
                          placeholder="Leave blank to auto-tailor per role (certificates, certifications, portfolio)..."
                          className={`w-full px-3 py-2 rounded-xl text-xs font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                            isDark
                              ? 'bg-slate-900 border-slate-700 text-white'
                              : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      {/* Venue Check-In QR Pass Toggle */}
                      <div className="sm:col-span-2 pt-1">
                        <label
                          className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                            includeQrPass
                              ? isDark
                                ? 'bg-emerald-950/40 border-emerald-700/70'
                                : 'bg-white border-emerald-300'
                              : isDark
                              ? 'bg-slate-900/60 border-slate-700'
                              : 'bg-white/70 border-slate-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={includeQrPass}
                            onChange={(e) => setIncludeQrPass(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                          />
                          <div className="text-xs">
                            <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              Embed Silent Reception Check-In QR Code
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              Embeds only the clean QR code with no visible data. Scanning prompts for the Receptionist Access Code before admitting the candidate.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Offer Parameters */}
                {emailType === 'offer' && (
                  <div
                    className={`p-4 rounded-2xl border space-y-4 ${
                      isDark ? 'bg-slate-800/40 border-slate-700/80' : 'bg-teal-50/50 border-teal-200/80'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">🎉</span>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-teal-800 dark:text-teal-300">
                        Offer & Appointment Details
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Proposed Commencement Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            setIsCustomEdited(false);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:ring-2 focus:ring-teal-500 focus:outline-none ${
                            isDark
                              ? 'bg-slate-900 border-slate-700 text-white'
                              : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Assigned Department
                        </label>
                        <input
                          type="text"
                          value={department}
                          onChange={(e) => {
                            setDepartment(e.target.value);
                            setIsCustomEdited(false);
                          }}
                          placeholder="e.g. Subsurface & Marine Survey"
                          className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:ring-2 focus:ring-teal-500 focus:outline-none ${
                            isDark
                              ? 'bg-slate-900 border-slate-700 text-white'
                              : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Subject Line */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Email Subject Line
                    </label>
                    {isCustomEdited && (
                      <button
                        type="button"
                        onClick={handleResetToTemplate}
                        className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        Reset to Template Default
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      setIsCustomEdited(true);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Email Message Content Area */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Message Content (Plain Text Draft & Placeholders)
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Formatted into executive branded HTML automatically
                    </span>
                  </div>
                  <textarea
                    rows={12}
                    value={bodyText}
                    onChange={(e) => {
                      setBodyText(e.target.value);
                      setIsCustomEdited(true);
                    }}
                    className={`w-full p-4 rounded-xl text-xs font-mono leading-relaxed border focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-slate-200'
                        : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  />
                  <div className="flex items-center gap-1.5 flex-wrap mt-2 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-500">Available Tags:</span>
                    <button
                      type="button"
                      onClick={() => setBodyText((prev) => prev + ' {candidate_name}')}
                      className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 font-mono text-[10px] text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      {'{candidate_name}'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBodyText((prev) => prev + ' {job_title}')}
                      className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 font-mono text-[10px] text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      {'{job_title}'}
                    </button>
                  </div>
                </div>

                {/* Status Synchronization Toggle */}
                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <input
                      id="sync-status-checkbox"
                      type="checkbox"
                      checked={syncStatus}
                      onChange={(e) => setSyncStatus(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="sync-status-checkbox" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      Automatically update candidate status to{' '}
                      <strong className="text-emerald-600 dark:text-emerald-400 uppercase font-bold">
                        "{targetStatus}"
                      </strong>{' '}
                      upon successful delivery
                    </label>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    targetStatus === 'interviewed'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      : targetStatus === 'shortlisted'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : targetStatus === 'hired'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {targetStatus}
                  </span>
                </div>
              </>
            ) : (
              /* Live Branded HTML Email Preview */
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    Previewing exact corporate transmission as sent from <strong className="text-emerald-600 dark:text-emerald-400">career@polarisigl.com</strong>
                  </span>
                  <span className="font-mono text-[11px] font-semibold">
                    Recipient: {isBulk ? `${applications.length} Candidates` : primaryApp?.applicant_email}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-950">
                  <iframe
                    title="Email Preview"
                    srcDoc={previewHtml}
                    className="w-full h-[620px] border-0"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div
            className={`p-4 sm:p-5 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {/* Test Send Button / Dropdown */}
            <div className="flex items-center space-x-2">
              {showTestInput ? (
                <div className="flex items-center space-x-1.5">
                  <input
                    type="email"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="admin@polarisigl.com"
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border focus:outline-none focus:ring-1 focus:ring-emerald-500 w-48 ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    disabled={isSendingTest}
                    onClick={handleSendTestEmail}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 cursor-pointer disabled:opacity-50"
                  >
                    {isSendingTest ? 'Sending...' : 'Send'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTestInput(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <IconClose className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowTestInput(true)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs'
                  }`}
                  title="Send a sample preview to your own inbox"
                >
                  <span>📨 Send Test to Admin</span>
                </button>
              )}
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center space-x-2.5 justify-end">
              <button
                type="button"
                disabled={isSending}
                onClick={onClose}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isDark
                    ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSending}
                onClick={handleSendToCandidates}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-all shadow-md flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>
                      {sendingProgress
                        ? `Sending ${sendingProgress.current} of ${sendingProgress.total}...`
                        : 'Dispatching...'}
                    </span>
                  </>
                ) : (
                  <>
                    <IconSend className="w-4 h-4" />
                    <span>
                      {isBulk
                        ? `Dispatch to All ${applications.length} Candidates`
                        : `Send to ${primaryApp?.applicant_name || 'Candidate'}`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed top-6 right-6 z-60 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center space-x-3 ${
              toastNotification.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-800 text-emerald-200'
                : toastNotification.type === 'error'
                ? 'bg-rose-950/95 border-rose-800 text-rose-200'
                : 'bg-slate-900/95 border-slate-700 text-slate-200'
            }`}
          >
            {toastNotification.type === 'success' ? (
              <IconCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : toastNotification.type === 'error' ? (
              <span className="text-rose-400 text-base font-bold">⚠️</span>
            ) : (
              <span className="text-blue-400 text-base font-bold">ℹ️</span>
            )}
            <p className="text-xs font-semibold">{toastNotification.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantEmailDrawer;
