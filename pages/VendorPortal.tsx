import React, { useState, useEffect } from 'react';
import LogoDarkImg from '../assets/LOGO.png';
import VendorsHeroBg from '../assets/slider.jpeg';
import { lookupVendorApplication } from '../hooks/useSupabaseData';
import { VendorApplication } from '../types';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';


const VendorPortal: React.FC = () => {
  const [refInput, setRefInput] = useState('');
  const [identifierInput, setIdentifierInput] = useState('');
  const [application, setApplication] = useState<VendorApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    // Check URL parameters for direct linking
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    const emailParam = params.get('email') || params.get('tin') || params.get('rc');
    if (refParam) {
      setRefInput(refParam);
      if (emailParam) {
        setIdentifierInput(emailParam);
        handleLookup(refParam, emailParam);
      }
    }
  }, []);

  const handleLookup = async (ref: string, ident: string) => {
    if (!ref.trim() || !ident.trim()) {
      setErrorMessage('Please enter both your Application Reference Code and Email, TIN, or RC Number.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSearchAttempted(true);

    try {
      const found = await lookupVendorApplication(ref, ident);
      if (found) {
        setApplication(found);
      } else {
        setApplication(null);
        setErrorMessage('No vendor onboarding record matched the reference code and identifier provided.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('An error occurred during verification lookup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(refInput, identifierInput);
  };


  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: VendorApplication['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Approved PIGL Vendor</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="px-3 py-1 bg-blue-100 border border-blue-300 text-blue-900 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Under Review (Procurement & Finance)</span>
          </span>
        );
      case 'needs_clarification':
        return (
          <span className="px-3 py-1 bg-purple-100 border border-purple-300 text-purple-900 rounded-full text-xs font-bold uppercase tracking-wider">
            Clarification Required
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-rose-100 border border-rose-300 text-rose-900 rounded-full text-xs font-bold uppercase tracking-wider">
            Not Approved
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span>Pending Initial Review</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      
      {/* 1. Immersive Hero Section */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-slate-800 print:hidden no-print" data-print-hidden="true">
        <div className="absolute inset-0 z-0">
          <img 
            src={VendorsHeroBg} 
            alt="PIGL Vendor Verification" 
            className="w-full h-full object-cover opacity-25 grayscale-[0.2]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-950/75"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <a href="/vendors" className="hover:text-white transition-colors">Vendor Onboarding</a>
            <span className="text-slate-600">/</span>
            <span className="text-white">Status Verification Portal</span>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
              Vendor Status & Verification Portal
            </h1>
            <p className="text-base md:text-lg text-slate-300 font-normal leading-relaxed">
              Verify your company's onboarding dossier progress, tax clearance compliance, and download or print official PIGL vendor certification.
            </p>
          </div>
        </div>

        {/* Continuous Reflective Energy Line at the base of the Hero & Breadcrumb section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine dark={true} />
        </div>
      </section>

      {/* 2. Main Portal Layout (Two-Column Grid) */}
      <section className="py-12 md:py-16 bg-slate-50 flex-grow print:p-0 print:m-0 print:bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print:max-w-none print:w-full print:p-0 print:m-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block print:w-full print:gap-0">
            
            {/* Left / Main Section (8 cols) */}
            <div className="lg:col-span-8 space-y-8 print:w-full print:space-y-0 print:block">
              
              {/* Search & Verification Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs print:hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Lookup Onboarding Application
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter your Application Reference Code and registered Contact Email, TIN, or RC.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-mono bg-slate-100 px-3 py-1.5 rounded text-slate-700 font-semibold self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Live Verification Engine</span>
                  </div>
                </div>


                <form onSubmit={onSearchSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Reference Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={refInput}
                      onChange={(e) => setRefInput(e.target.value)}
                      placeholder="PIGL-VEND-2026-XXXX"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 uppercase transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email / TIN / RC <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={identifierInput}
                      onChange={(e) => setIdentifierInput(e.target.value)}
                      placeholder="company@example.com or TIN/RC"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="sm:col-span-1 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm h-[40px] flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-75"
                  >
                    {loading ? (
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <span>Verify Status</span>
                    )}
                  </button>
                </form>

                {errorMessage && (
                  <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-semibold flex items-center space-x-2">
                    <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Application Details Dossier */}
              {application ? (
                <div className="space-y-6 print:space-y-0">
                  
                  {/* Status Bar */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
                    <div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
                        <span className="font-bold text-slate-700">REF: {application.reference_number}</span>
                        <span>•</span>
                        <span>
                          Submitted: {new Date(application.submission_date || application.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                        {application.vendor_legal_name}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {getStatusBadge(application.status)}
                      <button
                        onClick={handlePrint}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-all shadow-xs"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>Print Official Dossier</span>
                      </button>
                    </div>
                  </div>

                  {/* Verification Stage Timeline */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs print:hidden">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 font-mono">
                      Verification Progress Tracker
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                      {[
                        { title: '1. Form Logged', desc: 'Dossier received in system', active: true, done: true },
                        { title: '2. Procurement Scoping', desc: 'Technical & CAC verified', active: application.status !== 'pending', done: ['under_review', 'approved'].includes(application.status) },
                        { title: '3. Tax & Finance Audit', desc: 'TIN, VAT & NUBAN check', active: ['under_review', 'approved'].includes(application.status), done: application.status === 'approved' },
                        { title: '4. Enrolled Vendor', desc: 'Approved for procurement', active: application.status === 'approved', done: application.status === 'approved' }
                      ].map((step, idx) => (
                        <div key={idx} className="space-y-1.5 relative p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            step.done ? 'bg-emerald-600 text-white' :
                            step.active ? 'bg-slate-900 text-emerald-400 ring-2 ring-emerald-500/40' :
                            'bg-slate-200 text-slate-400'
                          }`}>
                            {step.done ? '✓' : idx + 1}
                          </div>
                          <p className={`text-xs font-bold ${step.active ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.title}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-tight">
                            {step.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Complete Document Form (Printable / Official Format) */}
                  <div className="printable-official-dossier bg-white border border-slate-300 rounded-xl p-8 sm:p-12 shadow-sm space-y-8 print:p-0 print:border-none print:shadow-none print:space-y-6">
                    
                    {/* Document Official Table Header */}
                    <div className="border-2 border-slate-900 grid grid-cols-1 md:grid-cols-4 print:grid-cols-4 divide-y md:divide-y-0 md:divide-x-2 print:divide-y-0 print:divide-x-2 divide-slate-900 text-slate-900 print-avoid-break">
                      <div className="p-4 flex items-center justify-center bg-white print:col-span-1">
                        <img src={LogoDarkImg} alt="PIGL" className="h-11 w-auto object-contain" />
                      </div>
                      <div className="p-4 md:col-span-2 print:col-span-2 flex flex-col justify-center text-center bg-white">
                        <h3 className="text-xs font-black uppercase tracking-wider">
                          POLARIS INTEGRATED & GEOSOLUTIONS LIMITED
                        </h3>
                        <p className="text-sm font-black uppercase text-emerald-950 mt-0.5">
                          VENDOR ONBOARDING & TAX COMPLIANCE FORM
                        </p>
                      </div>
                      <div className="p-4 print:col-span-1 flex flex-col justify-center text-xs font-mono bg-white space-y-1">
                        <p><strong>DOC:</strong> PIGL/F/VOTC/AHR/037</p>
                        <p><strong>REV:</strong> 00</p>
                      </div>
                    </div>

                    {/* Section A */}
                    <div className="space-y-3 print-avoid-break">
                      <h4 className="text-xs font-black uppercase tracking-widest bg-slate-100 p-2.5 border-l-4 border-slate-900 text-slate-900">
                        SECTION A: VENDOR IDENTIFICATION
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 text-xs p-2">
                        <div>
                          <span className="text-slate-500 font-bold block">1. Legal Name of Vendor:</span>
                          <span className="font-bold text-slate-900 text-sm">{application.vendor_legal_name}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block">2. Business Type:</span>
                          <span className="font-bold text-slate-900">{application.business_type}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block">3. RC / BN Number:</span>
                          <span className="font-bold font-mono text-slate-900">{application.rc_bn_number}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block">4. Date of Incorporation / Registration:</span>
                          <span className="font-bold text-slate-900">{application.incorporation_date}</span>
                        </div>
                        <div className="md:col-span-2 print:col-span-2">
                          <span className="text-slate-500 font-bold block">5. Registered Business Address:</span>
                          <span className="font-medium text-slate-900">{application.registered_address}</span>
                        </div>
                        <div className="md:col-span-2 print:col-span-2">
                          <span className="text-slate-500 font-bold block">6. Operational Address:</span>
                          <span className="font-medium text-slate-900">{application.operational_address || application.registered_address}</span>
                        </div>
                        <div className="md:col-span-2 print:col-span-2">
                          <span className="text-slate-500 font-bold block">7. Nature of Services Provided:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {application.nature_of_services.map((s, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded text-xs">
                                ✓ {s}
                              </span>
                            ))}
                            {application.nature_of_services_other && (
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded text-xs">
                                Other: {application.nature_of_services_other}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section B & C */}
                    <div className="space-y-3 print-avoid-break">
                      <h4 className="text-xs font-black uppercase tracking-widest bg-slate-100 p-2.5 border-l-4 border-slate-900 text-slate-900">
                        SECTION B & C: TAX INFORMATION & WHT DECLARATION
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 text-xs p-2">
                        <div>
                          <span className="text-slate-500 font-bold block">8. Tax Identification Number (TIN):</span>
                          <span className="font-bold font-mono text-slate-900 text-sm">{application.tin_number}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block">9. VAT Registration Status:</span>
                          <span className="font-bold text-slate-900">{application.vat_status}</span>
                        </div>
                        {application.vat_reg_number && (
                          <div>
                            <span className="text-slate-500 font-bold block">10. VAT Registration Number:</span>
                            <span className="font-bold font-mono text-slate-900">{application.vat_reg_number}</span>
                          </div>
                        )}
                        {application.vat_certificate_url && (
                          <div>
                            <span className="text-slate-500 font-bold block">11. VAT Certificate:</span>
                            <a href={application.vat_certificate_url} target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline">
                              View Attached Certificate ↗
                            </a>
                          </div>
                        )}
                        <div className="md:col-span-2 print:col-span-2 p-3 bg-slate-50 border border-slate-200 rounded">
                          <span className="text-slate-500 font-bold block mb-1">12. Withholding Tax (WHT) Statutory Declarations:</span>
                          <p className="text-[11px] text-slate-700 font-medium">
                            ✓ Statutory WHT deduction acknowledged • ✓ NRS tax remittance confirmed • ✓ WHT Credit Note acknowledged • ✓ Statutory VAT non-deduction affirmed.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section D */}
                    <div className="space-y-3 print-avoid-break">
                      <h4 className="text-xs font-black uppercase tracking-widest bg-slate-100 p-2.5 border-l-4 border-slate-900 text-slate-900">
                        SECTION D: BANK DETAILS
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-4 text-xs p-2">
                        <div>
                          <span className="text-slate-500 font-bold block">13. Bank Name:</span>
                          <span className="font-bold text-slate-900">{application.bank_name}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block">14. Account Name:</span>
                          <span className="font-bold text-slate-900">{application.account_name}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block">15. Account Number:</span>
                          <span className="font-bold font-mono text-slate-900">{application.account_number} ({application.currency || 'NGN'})</span>
                        </div>
                      </div>
                    </div>

                    {/* Section E */}
                    <div className="space-y-3 print-avoid-break">
                      <h4 className="text-xs font-black uppercase tracking-widest bg-slate-100 p-2.5 border-l-4 border-slate-900 text-slate-900">
                        SECTION E: CONTACT PERSON
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 text-xs p-2">
                        <div>
                          <span className="text-slate-500 font-bold block">16. Primary Contact Name:</span>
                          <span className="font-bold text-slate-900">{application.contact_name}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block">17. Designation:</span>
                          <span className="font-bold text-slate-900">{application.contact_designation}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block">18. Phone Number:</span>
                          <span className="font-bold text-slate-900">{application.contact_phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block">19. Email Address:</span>
                          <span className="font-bold text-slate-900">{application.contact_email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Section F */}
                    <div className="space-y-3 print-avoid-break">
                      <h4 className="text-xs font-black uppercase tracking-widest bg-slate-100 p-2.5 border-l-4 border-slate-900 text-slate-900">
                        SECTION F: DECLARATION & UNDERTAKING
                      </h4>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-3">
                        <p className="font-medium text-slate-700 italic">
                          "I/We hereby declare that the information provided in this form is true, correct, and complete..."
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-4 pt-2 border-t border-slate-200 text-xs">
                          <div>
                            <span className="text-slate-500 font-bold block">Representative Name:</span>
                            <span className="font-bold text-slate-900">{application.representative_name}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-bold block">Date:</span>
                            <span className="font-bold font-mono text-slate-900">
                              {new Date(application.submission_date || application.created_at).toLocaleDateString('en-GB')}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-bold block">Digital Signature:</span>
                            {application.signature_url?.startsWith('data:image') ? (
                              <img src={application.signature_url} alt="Signature" className="h-10 object-contain mt-1" />
                            ) : (
                              <span className="font-serif italic font-bold text-slate-900">{application.signature_url || application.representative_name}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section G: FOR COMPANY USE ONLY */}
                    <div className="space-y-3 pt-4 border-t-2 border-dashed border-slate-300 print-avoid-break">
                      <h4 className="text-xs font-black uppercase tracking-widest bg-emerald-950 text-white p-2.5 rounded">
                        SECTION G: FOR COMPANY USE ONLY (POLARIS INTEGRATED & GEOSOLUTIONS LIMITED)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 text-xs p-4 bg-slate-50 border border-slate-200 rounded">
                        <div>
                          <span className="text-slate-500 font-bold block">Reviewed By (Procurement):</span>
                          <span className="font-bold text-slate-900">{application.procurement_reviewer || 'Pending Procurement Officer Assignment'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block">Reviewed By (Finance):</span>
                          <span className="font-bold text-slate-900">{application.finance_reviewer || 'Pending Finance Verification'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block">VAT Status Verified:</span>
                          <span className={`font-bold uppercase ${application.vat_status_verified ? 'text-emerald-700' : 'text-slate-500'}`}>
                            {application.vat_status_verified ? '✓ Verified (Yes)' : 'Pending Verification'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block">Approved Vendor Category:</span>
                          <span className="font-bold text-emerald-950">{application.approved_vendor_category || 'Pending Categorization'}</span>
                        </div>
                        {application.approval_date && (
                          <div className="md:col-span-2 print:col-span-2">
                            <span className="text-slate-500 font-bold block">Date Approved:</span>
                            <span className="font-bold font-mono text-slate-900">
                              {new Date(application.approval_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        )}
                        {application.internal_notes && (
                          <div className="md:col-span-2 print:col-span-2 pt-2 border-t border-slate-200">
                            <span className="text-slate-500 font-bold block">Reviewer Guidance Notes:</span>
                            <span className="text-slate-700 font-medium">{application.internal_notes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Official Document Print Footer */}
                    <div className="pt-4 border-t border-slate-300 hidden print:flex flex-row items-center justify-between text-[10px] text-slate-500 font-mono print-avoid-break">
                      <span>POLARIS INTEGRATED & GEOSOLUTIONS LIMITED</span>
                      <span>OFFICIAL REGISTRATION DOSSIER • CONFIDENTIAL</span>
                      <span>ISO 9001 / ISO 45001</span>
                    </div>

                  </div>

                </div>
              ) : (
                /* Empty state / Prompt */
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    No Application Dossier Displayed
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Please use the lookup box above to query your reference code and registered email or RC/BN to view your active vendor dossier.
                  </p>
                </div>
              )}

            </div>

            {/* Right Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6 print:hidden">
              
              {/* Compliance Standard Card */}
              <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Statutory Standard</span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-white">
                  Form PIGL/F/VOTC/AHR/037
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Standardized mandatory qualification and Nigerian tax compliance framework approved for all PIGL vendors, subcontractors, and equipment suppliers.
                </p>
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Revision Code:</span>
                    <span className="font-mono font-bold text-white">Rev. No. 00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Quality Cert:</span>
                    <span className="font-bold text-white">ISO 9001:2015</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">HSSE Cert:</span>
                    <span className="font-bold text-white">ISO 45001:2018</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tax Authority:</span>
                    <span className="font-bold text-white">NRS / FIRS Certified</span>
                  </div>
                </div>
              </div>

              {/* Required Documents Checklist */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Verification Requirements
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Corporate CAC Certificate:</strong> Valid RC or BN registration.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Tax Identification (TIN):</strong> Validated against NRS tax database.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>VAT Certificate:</strong> Mandatory for VAT payments.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Commercial Bank Details:</strong> 10-digit NUBAN matching registered company name.</span>
                  </li>
                </ul>
              </div>

              {/* Helpdesk Contact */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Procurement Helpdesk
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Need assistance with your submission or clarification on tax compliance?
                </p>
                <div className="space-y-2 text-xs">
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Email:</strong>{' '}
                    <a href="mailto:procurement@polarisigl.com" className="text-emerald-700 font-bold hover:underline">
                      procurement@polarisigl.com
                    </a>
                  </p>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Direct Line:</strong>{' '}
                    <a href="tel:+2348097081333" className="text-emerald-700 font-bold hover:underline">
                      +234 809 708 1333
                    </a>
                  </p>
                  <p className="text-slate-500 text-[11px] pt-1">
                    Port Harcourt Head Office: 16 Trans-Amadi Road, Port Harcourt, Rivers State.
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="/vendors/register"
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow-xs"
                  >
                    <span>Register New Vendor</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default VendorPortal;

