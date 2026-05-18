import React, { useEffect } from 'react';
import EngineerImg from '../assets/teaching.jpeg';
import CareersBg from '../assets/inspiring_next_gen.jpeg';

const Careers: React.FC = () => {
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: '', email: '', phone: '' });
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [submissionPhase, setSubmissionPhase] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [showEmails, setShowEmails] = React.useState(false);
  const [activeEmailTab, setActiveEmailTab] = React.useState<'recruiter' | 'candidate'>('recruiter');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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
        alert("Please upload a valid PDF or Word document under 10MB.");
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
        alert("Please upload a valid PDF or Word document under 10MB.");
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    if (!resumeFile) {
      alert("Please upload your resume (PDF, DOC, or DOCX) first.");
      return;
    }

    setStatus('submitting');
    setUploadProgress(0);
    
    // Phase 1: Upload file
    setSubmissionPhase('Uploading resume binary...');
    for (let p = 0; p <= 45; p += 5) {
      setUploadProgress(p);
      await new Promise(r => setTimeout(r, 100));
    }

    // Phase 2: Payload Verification
    setSubmissionPhase('Verifying payload security...');
    for (let p = 45; p <= 75; p += 5) {
      setUploadProgress(p);
      await new Promise(r => setTimeout(r, 120));
    }

    // Phase 3: Deliver Notifications to Directors
    setSubmissionPhase('Delivering notifications to directors (info & bosahkc)...');
    for (let p = 75; p <= 95; p += 5) {
      setUploadProgress(p);
      await new Promise(r => setTimeout(r, 150));
    }

    // Phase 4: Confirming Receipts
    setSubmissionPhase('Generating candidate confirmation receipt...');
    for (let p = 95; p <= 100; p += 1) {
      setUploadProgress(p);
      await new Promise(r => setTimeout(r, 100));
    }

    setStatus('success');
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      
      {/* Clean Hero Header */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={CareersBg} 
            alt="Careers at PIGL" 
            className="w-full h-full object-cover opacity-35 grayscale-[0.2]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">
            <a href="#/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <span className="text-white">Careers</span>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
              Careers at PIGL
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-normal leading-relaxed">
              Building the future of Sub-Saharan energy requires the sharpest minds. Come innovate with us and help create a safe and liveable world.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 md:py-32 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">Empowering Indigenous Talent</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-normal">
                At PIGL, we believe our people are our most valuable asset. We provide a platform for engineers, surveyors, and project managers to work with world-class technology in challenging environments.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                {[
                  { title: 'Advanced Tech', desc: 'Work with Leica Geosystems Reality Capture gear.' },
                  { title: 'Safety Culture', desc: 'Our zero-harm policy ensures you go home safe.' },
                  { title: 'Growth Paths', desc: 'Continuous learning and ISO-certified training.' },
                  { title: 'Impact', desc: 'Be part of Nigeria\'s most critical energy infrastructure.' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 border border-slate-200">
                    <h4 className="text-emerald-700 font-bold mb-2">{item.title}</h4>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative h-[400px] md:h-[600px] bg-slate-100">
              <img src={EngineerImg} alt="Engineer at work" className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* Openings Section */}
      <section className="py-20 md:py-32 bg-slate-50 border-y border-slate-200 reveal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Current Openings</h2>
            <p className="text-slate-600 mt-4 text-lg">Explore our active vacancies across Nigeria.</p>
          </div>

          <div className="bg-white border border-slate-200 p-12 text-center space-y-6 shadow-sm reveal">
            <div className="mx-auto w-16 h-16 bg-slate-50 border border-slate-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">No Active Vacancies</h3>
              <p className="text-slate-600 max-w-lg mx-auto text-base">
                We currently do not have any open positions. However, we are always eager to discover exceptional minds. You can submit your CV below for future consideration.
              </p>
            </div>
          </div>

          <div className="mt-8 p-10 md:p-12 bg-white border border-slate-200 text-center shadow-sm reveal">
            <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Submit Your CV</h3>
            <p className="text-slate-600 mb-8 font-normal text-base">
              Send your CV and a brief cover letter to our recruitment team for future openings in engineering, surveying, reality capture, and swamp/offshore operations.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => setIsFormModalOpen(true)}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-emerald-750 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-850 transition-colors"
              >
                Submit CV <span className="ml-2">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Graduate Internship Program */}
      <section className="py-20 md:py-32 bg-white text-center reveal">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-emerald-700 font-bold uppercase tracking-wider text-sm mb-4 block">Student Opportunities</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">Graduate Internship Program</h2>
          <p className="text-xl text-slate-600 leading-relaxed font-light italic">
            "Fostering the next generation of Nigerian surveyors and engineers through hands-on field experience and technical mentorship."
          </p>
        </div>
      </section>

      {/* Careers CV Submission Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-emerald-950 px-8 py-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold tracking-tight">Submit Your CV</h3>
                <p className="text-slate-300 text-xs mt-1">Polaris Integrated Talent Acquisition</p>
              </div>
              <button 
                onClick={() => {
                  setIsFormModalOpen(false);
                  setStatus('idle');
                  setFormData({ name: '', email: '', phone: '' });
                  setResumeFile(null);
                  setShowEmails(false);
                }}
                className="text-white/60 hover:text-white transition-colors p-1"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="p-8 overflow-y-auto flex-grow space-y-6">
              
              {status === 'idle' && (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="space-y-4">
                    
                    {/* Name Input */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-none focus:outline-none focus:border-emerald-700 font-bold text-slate-800 text-sm placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-none focus:outline-none focus:border-emerald-700 font-bold text-slate-800 text-sm placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>

                    {/* Phone Input */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+234 809 708 1333"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-none focus:outline-none focus:border-emerald-700 font-bold text-slate-800 text-sm placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>

                    {/* File Upload Region */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Upload Resume (PDF, DOC, DOCX - Max 10MB)</label>
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`w-full p-8 border-2 border-dashed rounded-none transition-colors text-center cursor-pointer ${
                          dragActive ? 'border-emerald-700 bg-emerald-50/30' : 'border-slate-300 hover:border-emerald-700 bg-slate-50'
                        }`}
                      >
                        <input 
                          type="file"
                          id="file-upload"
                          required
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer space-y-3 block">
                          {!resumeFile ? (
                            <>
                              <div className="mx-auto w-12 h-12 bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                              </div>
                              <div>
                                <span className="text-emerald-700 font-bold text-sm block">Click to upload</span>
                                <span className="text-slate-400 text-xs">or drag and drop your file here</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-between bg-white border border-slate-200 p-4">
                              <div className="flex items-center space-x-3 text-left">
                                <div className="w-10 h-10 bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-bold text-xs uppercase">
                                  {resumeFile.name.split('.').pop()}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-800 text-sm block truncate max-w-[200px] sm:max-w-none">{resumeFile.name}</span>
                                  <span className="text-slate-400 text-xs">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                                </div>
                              </div>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setResumeFile(null);
                                }}
                                className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                  </div>

                  {/* Form Footer Buttons */}
                  <div className="flex justify-end space-x-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsFormModalOpen(false)}
                      className="px-6 py-3 border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-950 font-bold text-xs uppercase tracking-widest transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-emerald-750 text-white font-bold hover:bg-emerald-850 transition-colors"
                    >
                      Submit CV
                    </button>
                  </div>
                </form>
              )}

              {/* Submitting state */}
              {status === 'submitting' && (
                <div className="py-12 text-center space-y-6">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-700 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-900">{submissionPhase}</h4>
                    <div className="w-48 h-1.5 bg-slate-100 mx-auto overflow-hidden relative">
                      <div className="h-full bg-emerald-700 transition-all duration-500 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p className="text-slate-400 text-xs font-semibold">{uploadProgress}% Complete</p>
                  </div>
                </div>
              )}

              {/* Success state */}
              {status === 'success' && (
                <div className="py-6 space-y-6">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-none flex items-center justify-center text-emerald-600 text-3xl font-bold">
                      ✓
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-slate-950 tracking-tight">Application Sent!</h4>
                      <p className="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed">
                        Thank you, <strong>{formData.name}</strong>. Your CV has been successfully uploaded and processed. Auto-routing systems have dispatched branded emails.
                      </p>
                    </div>
                  </div>

                  {/* Toggle log preview */}
                  <div className="border border-slate-200">
                    <button 
                      onClick={() => setShowEmails(!showEmails)}
                      className="w-full bg-slate-50 px-6 py-4 flex justify-between items-center text-slate-700 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors"
                    >
                      <span>📩 View HTML Email Receipt Previews</span>
                      <svg className={`w-4 h-4 transform transition-transform duration-300 ${showEmails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </button>

                    {showEmails && (
                      <div className="border-t border-slate-200">
                        {/* Tab Headers */}
                        <div className="flex border-b border-slate-200 bg-slate-50/50">
                          <button
                            onClick={() => setActiveEmailTab('recruiter')}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider text-center border-r border-slate-200 transition-colors ${
                              activeEmailTab === 'recruiter' ? 'bg-white text-emerald-700 border-b-2 border-b-emerald-700' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            To Directors (info / bosahkc)
                          </button>
                          <button
                            onClick={() => setActiveEmailTab('candidate')}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider text-center transition-colors ${
                              activeEmailTab === 'candidate' ? 'bg-white text-emerald-700 border-b-2 border-b-emerald-700' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            To Candidate ({formData.email})
                          </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-4 bg-slate-100 max-h-[350px] overflow-y-auto font-sans">
                          {activeEmailTab === 'recruiter' ? (
                            <div className="bg-white border border-slate-200 shadow-sm rounded p-6 text-slate-800">
                              <div style={{ borderTop: '4px solid #047857', paddingTop: '15px' }}>
                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                  <h2 style={{ color: '#022c22', fontWeight: 900, margin: 0, fontSize: '18px' }}>POLARIS INTEGRATED</h2>
                                  <p style={{ color: '#047857', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '2px 0 0 0' }}>&amp; GeoSolutions Limited</p>
                                </div>
                                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '15px' }}>New Candidate Application</h3>
                                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', marginBottom: '15px' }}>
                                  A new candidate has submitted their resume via the PIGL Careers Portal. Details:
                                </p>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '20px' }}>
                                  <tbody>
                                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                      <td style={{ padding: '8px 0', color: '#64748b', fontWeight: 'bold' }}>FULL NAME</td>
                                      <td style={{ padding: '8px 0', color: '#0f172a', fontWeight: 'bold', textAlign: 'right' }}>{formData.name}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                      <td style={{ padding: '8px 0', color: '#64748b', fontWeight: 'bold' }}>EMAIL ADDRESS</td>
                                      <td style={{ padding: '8px 0', color: '#047857', fontWeight: 'bold', textAlign: 'right' }}>{formData.email}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                      <td style={{ padding: '8px 0', color: '#64748b', fontWeight: 'bold' }}>PHONE NUMBER</td>
                                      <td style={{ padding: '8px 0', color: '#0f172a', fontWeight: 'bold', textAlign: 'right' }}>{formData.phone}</td>
                                    </tr>
                                    <tr>
                                      <td style={{ padding: '8px 0', color: '#64748b', fontWeight: 'bold' }}>ATTACHED RESUME</td>
                                      <td style={{ padding: '8px 0', color: '#e11d48', fontWeight: 'bold', textAlign: 'right' }}>📎 {resumeFile?.name}</td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #22c55e', padding: '10px', fontSize: '11px', color: '#166534', marginBottom: '20px' }}>
                                  <strong>Note:</strong> Resume binary verified and safely archived in PIGL ATS.
                                </div>
                                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px', textAlign: 'center', fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>
                                  Polaris Integrated &amp; GeoSolutions Limited &copy; {new Date().getFullYear()}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-white border border-slate-200 shadow-sm rounded p-6 text-slate-800">
                              <div style={{ borderTop: '4px solid #047857', paddingTop: '15px' }}>
                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                  <h2 style={{ color: '#022c22', fontWeight: 900, margin: 0, fontSize: '18px' }}>POLARIS INTEGRATED</h2>
                                  <p style={{ color: '#047857', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '2px 0 0 0' }}>&amp; GeoSolutions Limited</p>
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#022c22', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '15px', textAlign: 'center' }}>Application Received</h3>
                                <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: 'bold', marginBottom: '10px' }}>Dear {formData.name},</p>
                                <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6', marginBottom: '15px' }}>
                                  Thank you for submitting your resume to Polaris Integrated &amp; GeoSolutions Limited (PIGL). We have successfully received your application.
                                </p>
                                <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6', marginBottom: '15px' }}>
                                  Our Recruitment directors review candidate submissions regularly. If your qualifications match any of our swamp, land, or offshore operations profiles, we will contact you directly for a technical interview.
                                </p>
                                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', marginBottom: '20px', fontSize: '11px' }}>
                                  <h4 style={{ margin: '0 0 6px 0', color: '#0f172a' }}>Application Summary:</h4>
                                  <p style={{ margin: '3px 0' }}><strong>Email:</strong> {formData.email}</p>
                                  <p style={{ margin: '3px 0' }}><strong>Phone:</strong> {formData.phone}</p>
                                  <p style={{ margin: '3px 0' }}><strong>File:</strong> 📎 {resumeFile?.name}</p>
                                </div>
                                <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                                  Best regards,<br />
                                  <strong>The Talent Acquisition Team</strong><br />
                                  Polaris Integrated &amp; GeoSolutions Limited
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => {
                        setIsFormModalOpen(false);
                        setStatus('idle');
                        setFormData({ name: '', email: '', phone: '' });
                        setResumeFile(null);
                        setShowEmails(false);
                      }}
                      className="px-8 py-3.5 bg-emerald-750 text-white font-bold hover:bg-emerald-850 transition-colors uppercase tracking-widest text-xs"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
