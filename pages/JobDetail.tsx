import React, { useState, useEffect } from 'react';
import { useJobOpening, submitJobApplication, usePageHeaders } from '../hooks/useSupabaseData';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';
import EngineerImg from '../assets/teaching.jpeg';
import CareersBg from '../assets/inspiring_next_gen.jpeg';

interface JobDetailProps {
  currentPath: string;
}

const JobDetail: React.FC<JobDetailProps> = ({ currentPath }) => {
  const slugOrId = currentPath.split('/careers/')[1]?.replace(/\/$/, '') || '';
  const { job, loading, allJobs } = useJobOpening(slugOrId);
  const { getPageHeader } = usePageHeaders();
  const pageHeader = getPageHeader('careers');
  const breadcrumbImage = pageHeader.effective_image || CareersBg;

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', coverLetter: '' });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [coverLetterMode, setCoverLetterMode] = useState<'type' | 'upload'>('type');
  const [dragActive, setDragActive] = useState(false);
  const [clDragActive, setClDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submissionPhase, setSubmissionPhase] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [isFlyerZoomed, setIsFlyerZoomed] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Update page title and meta description dynamically for client navigation
  useEffect(() => {
    if (job) {
      document.title = `${job.title} | PIGL Careers Nigeria`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          `${job.title} at Polaris Integrated & GeoSolutions Limited (PIGL). Location: ${job.location}. Employment: ${job.type}. Apply now.`
        );
      }
    }
  }, [job]);

  const handleShare = () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `We are Hiring: ${job?.title} | PIGL Careers`,
      text: `Polaris Integrated & GeoSolutions Limited (PIGL) is hiring a ${job?.title} in ${job?.location}. Apply now!`,
      url: shareUrl
    };

    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      navigator.share(shareData).catch(() => {
        navigator.clipboard.writeText(shareUrl);
        setShareToast('Share link copied to clipboard!');
        setTimeout(() => setShareToast(null), 3000);
      });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShareToast('Share link copied to clipboard! Social preview will show the official hiring flyer.');
        setTimeout(() => setShareToast(null), 3500);
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (['pdf', 'doc', 'docx'].includes(extension || '') && file.size <= 10 * 1024 * 1024) {
        setResumeFile(file);
      } else {
        alert('Please upload a valid PDF or Word document under 10MB.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (['pdf', 'doc', 'docx'].includes(extension || '') && file.size <= 10 * 1024 * 1024) {
        setResumeFile(file);
      } else {
        alert('Please upload a valid PDF or Word document under 10MB.');
      }
    }
  };

  const handleCoverLetterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (['pdf', 'doc', 'docx'].includes(extension || '') && file.size <= 10 * 1024 * 1024) {
        setCoverLetterFile(file);
      } else {
        alert('Please upload a valid PDF or Word document under 10MB.');
      }
    }
  };

  const handleClDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setClDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (['pdf', 'doc', 'docx'].includes(extension || '') && file.size <= 10 * 1024 * 1024) {
        setCoverLetterFile(file);
      } else {
        alert('Please upload a valid PDF or Word document under 10MB.');
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isClosed) {
      alert('Submissions for this position are currently closed.');
      return;
    }
    if (!resumeFile) {
      alert('Please attach your CV / Resume before submitting.');
      return;
    }

    setStatus('submitting');
    setUploadProgress(10);
    setSubmissionPhase('Preparing candidate profile...');

    try {
      setUploadProgress(35);
      setSubmissionPhase('Uploading CV and candidate credentials...');
      await new Promise((r) => setTimeout(r, 600));

      setUploadProgress(70);
      setSubmissionPhase('Registering application with Engineering Desk...');

      const result = await submitJobApplication({
        job_id: job?.id,
        job_title: job?.title || 'General Engineering Role',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        applicant_name: formData.name,
        applicant_email: formData.email,
        applicant_phone: formData.phone,
        resume_file: resumeFile,
        cover_letter: formData.coverLetter,
        cover_letter_file: coverLetterFile || undefined
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit application');
      }

      setUploadProgress(100);
      setSubmissionPhase('Application successfully submitted!');
      setStatus('success');
    } catch (err: any) {
      console.error('Job application submission error:', err);
      setErrorMessage(err.message || 'An error occurred during submission. Please try again.');
      setStatus('error');
    }
  };

  const otherJobs = allJobs
    .filter((j) => j.id !== job?.id && j.status === 'active')
    .slice(0, 3);

  const isClosed = job?.status === 'closed';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
            Loading position details...
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-32 px-4">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 sm:p-10 text-center shadow-sm space-y-5">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-800">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Position Not Found</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            This opening may have been filled, archived, or the link may be outdated. You can explore all our current career opportunities below.
          </p>
          <a
            href="/careers"
            className="inline-block px-6 py-3 bg-emerald-950 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-800 transition-colors"
          >
            ← View All Openings
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans antialiased">
      {/* Hero Header with Background Image & Breadcrumbs */}
      <section className="relative h-[360px] md:h-[420px] flex items-end pb-12 overflow-hidden bg-slate-950 text-white">
        <img
          src={breadcrumbImage}
          alt="Careers at PIGL"
          className="absolute inset-0 w-full h-full object-cover opacity-30 select-none scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
            <a href="/" className="hover:text-emerald-400 transition-colors">Home</a>
            <span>/</span>
            <a href="/careers" className="hover:text-emerald-400 transition-colors">Careers</a>
            <span>/</span>
            <span className="text-emerald-400 truncate max-w-xs">{job.title}</span>
          </nav>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {isClosed ? (
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider rounded-full border border-amber-500/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Not Accepting Submissions
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Vacancy
                </span>
              )}
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                📍 {job.location}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">
                💼 {job.type}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">
                ⏳ {job.experience_level}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {job.title}
            </h1>
          </div>
        </div>
      </section>

      <ReflectiveEnergyLine />

      {/* Main Two-Column Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-6">
          <a
            href="/careers"
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-emerald-800 uppercase tracking-wider transition-colors"
          >
            <span>← Back to all career openings</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Job Description, Responsibilities, Requirements (7 cols on lg, 8 on xl) */}
          <main className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Deactivated Notice Banner */}
            {isClosed && (
              <div className="bg-amber-50/95 border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 text-amber-950 font-black text-sm uppercase tracking-wide">
                  <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Position Deactivated — Not Accepting Submissions</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-normal">
                  Candidate applications and CV uploads for this position are currently closed. The role description remains published for reference. To register your profile for upcoming openings, you may explore other active listings or submit your details to our Talent Network.
                </p>
              </div>
            )}

            {/* About the Role */}
            <section className="bg-white border border-slate-200/90 rounded-2xl p-7 sm:p-10 shadow-xs space-y-5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-4">
                About the Role
              </h2>
              <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 font-normal">
                <p>{job.description}</p>
                <p>
                  As part of the Polaris Integrated & GeoSolutions technical cadre, you will contribute to demanding engineering and site investigation projects supporting leading operators across onshore, swamp, and offshore Nigerian energy corridors.
                </p>
              </div>
            </section>

            {/* Key Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <section className="bg-white border border-slate-200/90 rounded-2xl p-7 sm:p-10 shadow-xs space-y-5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-4">
                  Key Responsibilities
                </h2>
                <ul className="space-y-3.5">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        ✓
                      </div>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Qualifications & Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <section className="bg-white border border-slate-200/90 rounded-2xl p-7 sm:p-10 shadow-xs space-y-5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-4">
                  Qualifications & Requirements
                </h2>
                <ul className="space-y-3.5">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                      <div className="w-5 h-5 rounded-full bg-emerald-950 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        •
                      </div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* What We Offer / Work Culture */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-7 sm:p-10 shadow-md space-y-5">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Working at PIGL
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <h3 className="font-bold text-emerald-400">Advanced Field Technologies</h3>
                  <p className="text-slate-300 leading-relaxed">Work with multi-frequency sensors, piezocone CPT rigs, 3D laser scanners, and marine survey instruments.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <h3 className="font-bold text-emerald-400">Zero-Compromise HSSE</h3>
                  <p className="text-slate-300 leading-relaxed">Safety is our primary operating metric. We protect personnel, clients, and natural habitats.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <h3 className="font-bold text-emerald-400">Indigenous Leadership</h3>
                  <p className="text-slate-300 leading-relaxed">Proudly Nigerian, delivering world-class engineering insights and regional career growth.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <h3 className="font-bold text-emerald-400">Continuous Mentorship</h3>
                  <p className="text-slate-300 leading-relaxed">Learn directly from senior Fellows of NIS and veteran engineering surveyors.</p>
                </div>
              </div>
            </section>

            {/* Bottom Call to Action Card */}
            {isClosed ? (
              <div className="bg-slate-100 border border-slate-300 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Submission Window Closed
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Applications for this role are currently closed</h3>
                  <p className="text-sm text-slate-600">This vacancy is retained for archival reference. Explore our careers portal for currently open positions.</p>
                </div>
                <a
                  href="/careers"
                  className="px-8 py-3.5 bg-emerald-950 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-widest transition-colors shadow-md shrink-0 text-center"
                >
                  Browse Open Vacancies →
                </a>
              </div>
            ) : (
              <div className="bg-white border-2 border-emerald-900/20 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Ready to join our team?</h3>
                  <p className="text-sm text-slate-600">Submit your CV and credentials for immediate review by our recruitment desk.</p>
                </div>
                <button
                  onClick={() => setIsFormModalOpen(true)}
                  className="px-8 py-3.5 bg-emerald-950 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-widest transition-colors shadow-md shrink-0 cursor-pointer"
                >
                  Apply for this Role →
                </button>
              </div>
            )}
          </main>

          {/* Right Column: Sticky Sidebar with Intentional Flyer Presentation & Actions */}
          <aside className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* The Official Role Flyer - Hero Display */}
            {job.image_url && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                <div
                  onClick={() => setIsFlyerZoomed(true)}
                  className={`relative aspect-4/5 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner cursor-pointer group ${
                    isClosed ? 'grayscale contrast-90 opacity-80' : ''
                  }`}
                  title="Tap to zoom flyer"
                >
                  <img
                    src={job.image_url}
                    alt={`${job.title} Official Hiring Graphic`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isClosed && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-3 py-1 bg-amber-500/95 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-md shadow-md">
                        Not Accepting Submissions
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-white/95 text-slate-950 text-xs font-black uppercase tracking-wider rounded-lg shadow-lg">
                      🔍 Tap to Zoom Flyer
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Position Summary & Primary CTA */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
              <h3 className="text-base font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
                Position Summary
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Location</span>
                  <span className="font-bold text-slate-900">{job.location}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Employment Type</span>
                  <span className="font-bold text-slate-900">{job.type}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Experience Level</span>
                  <span className="font-bold text-slate-900">{job.experience_level}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Hiring Desk</span>
                  <span className="font-bold text-emerald-800">Port Harcourt HQ</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Status</span>
                  {isClosed ? (
                    <span className="font-bold text-amber-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Closed / Inactive
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Accepting CVs
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                {isClosed ? (
                  <>
                    <button
                      disabled
                      className="w-full py-3.5 bg-slate-200 text-slate-500 font-black text-xs uppercase tracking-widest cursor-not-allowed flex items-center justify-center space-x-2 rounded-none border border-slate-300"
                    >
                      <span>Not Accepting Submissions</span>
                    </button>
                    <a
                      href="/careers"
                      className="w-full py-3 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider text-center block transition-colors shadow-sm"
                    >
                      Browse Open Vacancies →
                    </a>
                  </>
                ) : (
                  <button
                    onClick={() => setIsFormModalOpen(true)}
                    className="w-full py-3.5 bg-emerald-950 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-widest transition-colors shadow-md cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Apply for this Position</span>
                    <span>→</span>
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors border border-slate-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share this Vacancy</span>
                </button>
              </div>
            </div>

            {/* Inquiries Box */}
            <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider">Recruitment Inquiries</h4>
              <p className="leading-relaxed">
                For questions regarding this vacancy, please contact the Talent Acquisition team at{' '}
                <a href="mailto:careers@polarisigl.com" className="font-bold text-emerald-800 hover:underline">
                  careers@polarisigl.com
                </a>
              </p>
            </div>

            {/* Other Open Positions */}
            {otherJobs.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Other Openings at PIGL
                </h3>
                <div className="space-y-3">
                  {otherJobs.map((oj) => (
                    <a
                      key={oj.id}
                      href={`/careers/${oj.id}`}
                      className="block p-3 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
                    >
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 truncate">
                        {oj.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        📍 {oj.location} • 💼 {oj.type}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Lightbox Zoom for Flyer Graphic */}
      {isFlyerZoomed && job.image_url && (
        <div
          onClick={() => setIsFlyerZoomed(false)}
          className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full max-h-[90vh] flex flex-col items-center animate-scaleIn"
          >
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <h4 className="text-sm font-bold truncate max-w-xs">{job.title}</h4>
              <button
                onClick={() => setIsFlyerZoomed(false)}
                className="p-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <img
              src={job.image_url}
              alt={job.title}
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            <div className="pt-3 w-full flex justify-center">
              <a
                href={job.image_url}
                download={`${job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-flyer.jpg`}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
              >
                Download Flyer Graphic
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 lg:p-8 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg md:max-w-3xl lg:max-w-4xl bg-white shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh] rounded-3xl my-auto">
            {/* Modal Header */}
            <div className="relative p-6 sm:p-8 flex flex-col justify-end text-white overflow-hidden shrink-0">
              <img
                src={EngineerImg}
                alt="PIGL Recruitment"
                className="absolute inset-0 w-full h-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40"></div>

              <div className="relative z-10 space-y-1.5 pr-10">
                <div className="flex flex-wrap items-center gap-2">
                  {isClosed ? (
                    <span className="px-3 py-1 bg-amber-500/25 border border-amber-400/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider rounded-full backdrop-blur-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      Not Accepting Submissions
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold uppercase tracking-wider rounded-full backdrop-blur-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Official Job Application
                    </span>
                  )}
                  <span className="text-slate-300 text-xs font-semibold">📍 {job.location}</span>
                  <span className="text-slate-500 text-xs">•</span>
                  <span className="text-slate-300 text-xs font-semibold">💼 {job.type}</span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                  {job.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm font-medium">
                  Polaris Integrated &amp; GeoSolutions Limited • Engineering Desk
                </p>
              </div>

              <button
                onClick={() => setIsFormModalOpen(false)}
                className="absolute top-5 right-5 z-20 text-white/80 hover:text-white bg-slate-900/60 hover:bg-slate-900 p-2.5 rounded-full backdrop-blur-md transition-colors border border-white/10 cursor-pointer shadow-lg"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              {isClosed && (
                <div className="text-center py-12 px-4 space-y-4 max-w-md mx-auto">
                  <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl font-bold">
                    ⚠️
                  </div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">Submissions Closed</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    This vacancy has been closed by the recruitment desk and is no longer accepting new candidate CVs.
                  </p>
                  <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="/careers"
                      className="px-6 py-3 bg-emerald-950 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors"
                    >
                      Browse Open Positions
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsFormModalOpen(false)}
                      className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {!isClosed && status === 'idle' && (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    {/* Left Column: Personal info */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Engr. Chigozie Okoro"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. chigozie.okoro@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +234 803 123 4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Right Column: Cover Letter (Type or Upload) */}
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Cover Letter (Optional)
                        </label>
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => setCoverLetterMode('type')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              coverLetterMode === 'type'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            ✍️ Type Text
                          </button>
                          <button
                            type="button"
                            onClick={() => setCoverLetterMode('upload')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              coverLetterMode === 'upload'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            📎 Upload File {coverLetterFile && '✓'}
                          </button>
                        </div>
                      </div>

                      {coverLetterMode === 'type' ? (
                        <div className="flex-1 flex flex-col space-y-2">
                          {coverLetterFile && (
                            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                              <span className="font-bold text-emerald-900 truncate">
                                📎 Attached: {coverLetterFile.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => setCoverLetterFile(null)}
                                className="text-rose-600 font-bold hover:underline ml-2 shrink-0 cursor-pointer text-[11px]"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                          <textarea
                            rows={coverLetterFile ? 5 : 7}
                            placeholder="Provide a brief overview of your background, experience with field operations or engineering equipment, and why you are a great fit for this position..."
                            value={formData.coverLetter}
                            onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                            className="w-full flex-1 p-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all leading-relaxed resize-none font-normal"
                          />
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Have a ready document?</span>
                            <button
                              type="button"
                              onClick={() => setCoverLetterMode('upload')}
                              className="font-bold text-emerald-700 hover:underline cursor-pointer"
                            >
                              Upload Cover Letter PDF/DOCX →
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col justify-between space-y-3">
                          <div
                            onDragEnter={(e) => { e.preventDefault(); setClDragActive(true); }}
                            onDragOver={(e) => { e.preventDefault(); setClDragActive(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setClDragActive(false); }}
                            onDrop={handleClDrop}
                            className={`border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center transition-all ${
                              clDragActive
                                ? 'border-emerald-600 bg-emerald-50/70'
                                : coverLetterFile
                                ? 'border-emerald-500 bg-emerald-50/30'
                                : 'border-slate-300 bg-slate-50/70 hover:bg-slate-100/80 hover:border-slate-400'
                            }`}
                          >
                            <input
                              type="file"
                              id="cl-upload-detail"
                              accept=".pdf,.doc,.docx"
                              onChange={handleCoverLetterFileChange}
                              className="hidden"
                            />
                            <label htmlFor="cl-upload-detail" className="cursor-pointer block">
                              {coverLetterFile ? (
                                <div className="space-y-2">
                                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <p className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-xs mx-auto">
                                    {coverLetterFile.name}
                                  </p>
                                  <p className="text-[11px] text-emerald-700 font-medium">
                                    ✓ Document attached ({(coverLetterFile.size / (1024 * 1024)).toFixed(2)} MB) • Click to replace
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-1.5 py-2">
                                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                  </div>
                                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                                    Click or drag & drop your Cover Letter file
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    PDF, DOCX, DOC • Maximum size: 10MB
                                  </p>
                                </div>
                              )}
                            </label>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Prefer to write text?</span>
                            <button
                              type="button"
                              onClick={() => setCoverLetterMode('type')}
                              className="font-bold text-emerald-700 hover:underline cursor-pointer"
                            >
                              ← Type Cover Letter Instead
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Full Width: CV Upload Dropzone */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Attach CV / Resume (PDF or DOCX) *
                      </label>
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
                          dragActive
                            ? 'border-emerald-600 bg-emerald-50/70'
                            : resumeFile
                            ? 'border-emerald-500 bg-emerald-50/30'
                            : 'border-slate-300 bg-slate-50/70 hover:bg-slate-100/80 hover:border-slate-400'
                        }`}
                      >
                        <input
                          type="file"
                          id="resume-upload"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer block">
                          {resumeFile ? (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div className="text-center sm:text-left">
                                <p className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                                  {resumeFile.name}
                                </p>
                                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                                  ✓ File selected ({(resumeFile.size / (1024 * 1024)).toFixed(2)} MB) • Click to replace
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                              </div>
                              <p className="text-sm font-bold text-slate-800">
                                Click to select or drag and drop your CV
                              </p>
                              <p className="text-xs text-slate-500">
                                Supported formats: PDF, DOCX, DOC • Maximum size: 10MB
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      className="w-full py-4 bg-emerald-950 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm uppercase tracking-widest transition-all rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Submit Application for {job.title}</span>
                      <span>→</span>
                    </button>
                    <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                      <span>🔒</span> Transmitted directly to Polaris Integrated Engineering Recruitment Desk • Confidential
                    </p>
                  </div>
                </form>
              )}

              {status === 'submitting' && (
                <div className="py-12 text-center space-y-4">
                  <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700">{submissionPhase}</p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-1.5 transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {status === 'success' && (
                <div className="py-10 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-black text-slate-900">Application Received</h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                    Thank you, {formData.name}. Your application for {job.title} has been recorded. Our talent team will review your profile and reach out.
                  </p>
                  <button
                    onClick={() => {
                      setIsFormModalOpen(false);
                      setStatus('idle');
                      setFormData({ name: '', email: '', phone: '', coverLetter: '' });
                      setResumeFile(null);
                    }}
                    className="px-6 py-2.5 bg-emerald-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-colors rounded-xl"
                  >
                    Done
                  </button>
                </div>
              )}

              {status === 'error' && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto font-bold">
                    !
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Submission Error</h4>
                  <p className="text-xs text-rose-600">{errorMessage}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-60 bg-slate-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center space-x-3 animate-fade-in">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xs font-bold leading-snug">{shareToast}</p>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
