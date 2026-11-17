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
  const [dragActive, setDragActive] = useState(false);
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      alert('Please attach your CV / Resume before submitting.');
      return;
    }

    setStatus('submitting');
    setUploadProgress(10);
    setSubmissionPhase('Preparing candidate profile...');

    try {
      setUploadProgress(35);
      setSubmissionPhase('Uploading CV document...');
      await new Promise((r) => setTimeout(r, 600));

      setUploadProgress(70);
      setSubmissionPhase('Registering application with Engineering Desk...');

      const result = await submitJobApplication({
        job_id: job?.id,
        job_title: job?.title || 'General Engineering Role',
        applicant_name: formData.name,
        applicant_email: formData.email,
        applicant_phone: formData.phone,
        resume_file: resumeFile,
        cover_letter: formData.coverLetter
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
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Vacancy
              </span>
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
          <main className="lg:col-span-7 xl:col-span-8 space-y-10">
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
          </main>

          {/* Right Column: Sticky Sidebar with Intentional Flyer Presentation & Actions */}
          <aside className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* The Official Role Flyer - Hero Display */}
            {job.image_url && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
                <div
                  onClick={() => setIsFlyerZoomed(true)}
                  className="relative aspect-4/5 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner cursor-pointer group"
                  title="Tap to zoom flyer"
                >
                  <img
                    src={job.image_url}
                    alt={`${job.title} Official Hiring Graphic`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
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
                  <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Accepting CVs
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => setIsFormModalOpen(true)}
                  className="w-full py-3.5 bg-emerald-950 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-widest transition-colors shadow-md cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Apply for this Position</span>
                  <span>→</span>
                </button>

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[95vh] rounded-2xl">
            {/* Modal Header */}
            <div className="relative h-28 flex flex-col justify-end p-5 text-white overflow-hidden">
              <img
                src={EngineerImg}
                alt="PIGL Recruitment"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

              <div className="relative z-10">
                <h3 className="text-lg font-black tracking-tight">Apply: {job.title}</h3>
                <p className="text-slate-200 text-xs mt-0.5 font-medium">Polaris Integrated & GeoSolutions Limited</p>
              </div>

              <button
                onClick={() => setIsFormModalOpen(false)}
                className="absolute top-4 right-4 z-20 text-white/80 hover:text-white bg-slate-900/40 p-1.5 rounded-full backdrop-blur-sm cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {status === 'idle' && (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Engr. Chigozie Okoro"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. chigozie.okoro@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +234 803 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Cover Letter / Professional Summary
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Brief overview of your qualifications and experience relevant to this role..."
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none transition-all leading-relaxed"
                    ></textarea>
                  </div>

                  {/* CV Upload Dropzone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Attach CV / Resume (PDF or DOCX) *
                    </label>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                        dragActive ? 'border-emerald-600 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="file"
                        id="resume-upload"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          {resumeFile ? resumeFile.name : 'Click to select or drag and drop your CV'}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Maximum file size: 10MB</p>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-950 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-widest transition-colors shadow-md mt-2 cursor-pointer"
                  >
                    Submit Application
                  </button>
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
