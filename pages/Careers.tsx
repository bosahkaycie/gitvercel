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
    
    // Phase 1: Upload resume
    setSubmissionPhase('Uploading resume...');
    for (let p = 0; p <= 35; p += 5) {
      setUploadProgress(p);
      await new Promise(r => setTimeout(r, 80));
    }

    // Phase 2: Verify document structure
    setSubmissionPhase('Verifying document structure...');
    for (let p = 35; p <= 70; p += 5) {
      setUploadProgress(p);
      await new Promise(r => setTimeout(r, 90));
    }

    // Phase 3: Finalizing application
    setSubmissionPhase('Finalizing application...');
    for (let p = 70; p <= 100; p += 5) {
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
                className="inline-flex items-center justify-center px-8 py-3.5 bg-emerald-950 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-800 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[95vh]">
            
            {/* Modal Header with Image */}
            <div className="relative h-28 flex flex-col justify-end p-5 text-white overflow-hidden">
              {/* Background Image */}
              <img 
                src={EngineerImg} 
                alt="PIGL Recruitment" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-lg font-black tracking-tight">Submit Your CV</h3>
                <p className="text-slate-200 text-[10px] mt-0.5 font-medium">Polaris Integrated & GeoSolutions Limited</p>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => {
                  setIsFormModalOpen(false);
                  setStatus('idle');
                  setFormData({ name: '', email: '', phone: '' });
                  setResumeFile(null);
                  setShowEmails(false);
                }}
                className="absolute top-3 right-3 z-20 text-white hover:text-emerald-400 transition-colors p-1.5 bg-slate-950/40 backdrop-blur-sm"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="p-5 overflow-y-auto flex-grow space-y-4">
              
              {status === 'idle' && (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-3">
                    
                    {/* Name Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-none focus:outline-none focus:border-emerald-700 font-bold text-slate-800 text-xs placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-none focus:outline-none focus:border-emerald-700 font-bold text-slate-800 text-xs placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>

                    {/* Phone Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+234 809 708 1333"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-none focus:outline-none focus:border-emerald-700 font-bold text-slate-800 text-xs placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>

                    {/* File Upload Region */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Upload Resume (PDF, DOC, DOCX - Max 10MB)</label>
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`w-full p-4 border-2 border-dashed rounded-none transition-colors text-center cursor-pointer ${
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
                        <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
                          {!resumeFile ? (
                            <>
                              <div className="mx-auto w-8 h-8 bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                              </div>
                              <div>
                                <span className="text-emerald-700 font-bold text-xs block">Click to upload</span>
                                <span className="text-slate-400 text-[10px]">or drag and drop here</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-between bg-white border border-slate-200 p-2.5">
                              <div className="flex items-center space-x-2 text-left">
                                <div className="w-8 h-8 bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-bold text-[10px] uppercase">
                                  {resumeFile.name.split('.').pop()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="font-bold text-slate-800 text-xs block truncate max-w-[150px]">{resumeFile.name}</span>
                                  <span className="text-slate-400 text-[10px]">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB</span>
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
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                  </div>

                  {/* Form Footer Buttons */}
                  <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsFormModalOpen(false)}
                      className="px-5 py-2 border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-950 font-bold text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-emerald-950 text-white font-bold hover:bg-emerald-800 transition-colors text-xs"
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
                <div className="py-8 space-y-6">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-none flex items-center justify-center text-emerald-600 text-3xl font-bold">
                      ✓
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-slate-950 tracking-tight">Application Submitted</h4>
                      <p className="text-slate-600 max-w-sm mx-auto text-sm leading-relaxed">
                        Thank you, <strong>{formData.name}</strong>. Your CV has been successfully uploaded. Our recruitment team will review your application and get in touch if your qualifications match our active or future project profiles.
                      </p>
                    </div>
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
                      className="px-8 py-3 bg-emerald-950 text-white font-bold hover:bg-emerald-800 transition-colors text-xs"
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
