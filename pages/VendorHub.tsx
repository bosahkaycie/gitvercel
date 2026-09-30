import React, { useState, useEffect } from 'react';
import VendorsHeroBg from '../assets/slider.jpeg';
import LogoDarkImg from '../assets/LOGO.png';
import Iso9001Img from '../assets/Q-Mark (ISO 9001).png';
import Iso45001Img from '../assets/Q-Mark (ISO 45001).png';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';
import { submitVendorApplication, lookupVendorApplication } from '../hooks/useSupabaseData';
import { VendorApplication, VendorBusinessType, VendorVATStatus } from '../types';

interface VendorHubProps {
  initialTab?: 'register' | 'track';
}

export const NIGERIAN_BANK_GROUPS = [
  {
    group: 'Commercial Banks (CBN Licensed)',
    banks: [
      'Access Bank Plc',
      'Citibank Nigeria Limited',
      'Ecobank Nigeria Limited',
      'Fidelity Bank Plc',
      'First Bank of Nigeria Limited',
      'First City Monument Bank (FCMB) Limited',
      'Globus Bank Limited',
      'Guaranty Trust Bank (GTBank) Limited',
      'Heritage Bank Plc',
      'Keystone Bank Limited',
      'Nova Commercial Bank Limited',
      'Optimus Bank Limited',
      'Parallex Bank Limited',
      'Polaris Bank Limited',
      'PremiumTrust Bank Limited',
      'Providus Bank Limited',
      'Signature Bank Limited',
      'Stanbic IBTC Bank Limited',
      'Standard Chartered Bank Nigeria Limited',
      'Sterling Bank Plc',
      'SunTrust Bank Nigeria Limited',
      'Titan Trust Bank Limited',
      'Union Bank of Nigeria Plc',
      'United Bank for Africa (UBA) Plc',
      'Unity Bank Plc',
      'Wema Bank Plc',
      'Zenith Bank Plc'
    ]
  },
  {
    group: 'Non-Interest & Islamic Banks (CBN Licensed)',
    banks: [
      'Alternative Bank Limited',
      'Jaiz Bank Plc',
      'LOTUS Bank Limited',
      'TAJBank Limited'
    ]
  },
  {
    group: 'Merchant Banks (CBN Licensed)',
    banks: [
      'Coronation Merchant Bank Limited',
      'FBNQuest Merchant Bank Limited',
      'FSDH Merchant Bank Limited',
      'Greenwich Merchant Bank Limited',
      'Rand Merchant Bank Nigeria Limited'
    ]
  },
  {
    group: 'Payment Service Banks (PSB) & Digital Institutions',
    banks: [
      '9 Payment Service Bank (9PSB)',
      'FairMoney Microfinance Bank',
      'Hope Payment Service Bank (Hope PSB)',
      'Kuda Microfinance Bank Limited',
      'MoMo Payment Service Bank (MoMo PSB)',
      'MoneyMaster Payment Service Bank (MoneyMaster PSB)',
      'Moniepoint Microfinance Bank',
      'OPay Digital Services Limited (Paycom)',
      'PalmPay Limited',
      'SmartCash Payment Service Bank',
      'VFD Microfinance Bank (VBank)'
    ]
  },
  {
    group: 'Other Financial Institutions',
    banks: [
      'Other / Foreign Commercial Bank (Specify)'
    ]
  }
];

export const ALL_NIGERIAN_BANKS = NIGERIAN_BANK_GROUPS.flatMap(g => g.banks);

const SERVICE_CATEGORIES = [
  'Survey / Geoscience & Offshore Bathymetry',
  '3D Reality Capture & Digital Twins',
  'Geotechnical Drilling & CPT Testing',
  'Pipeline Inspection & Non-Destructive Testing (NDT)',
  'Produced Water Treatment & Environmental',
  'Logistics, Marine Vessels & Heavy Equipment',
  'Civil Works & Structural Fabrication',
  'Process Automation & Instrumentation',
  'Engineering & Technical Consultancy',
  'Other Specialist Supply / Service'
];

export const VendorHub: React.FC<VendorHubProps> = ({ initialTab }) => {
  // Mode: 'register' | 'track'
  const [activeTab, setActiveTab] = useState<'register' | 'track'>(() => {
    if (initialTab) return initialTab;
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('track') || path.includes('portal')) return 'track';
      const search = new URLSearchParams(window.location.search);
      if (search.get('tab') === 'track' || search.get('ref')) return 'track';
    }
    return 'register';
  });

  // Track / Lookup State
  const [refInput, setRefInput] = useState('');
  const [identInput, setIdentInput] = useState('');
  const [lookupResult, setLookupResult] = useState<VendorApplication | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupAttempted, setLookupAttempted] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // Register Form State
  const [formData, setFormData] = useState({
    vendor_legal_name: '',
    business_type: 'Limited Liability Company (Ltd)' as VendorBusinessType,
    rc_bn_number: '',
    incorporation_date: '',
    registered_address: '',
    operational_address: '',
    is_operational_same: true,
    nature_of_services: ['Survey / Geoscience & Offshore Bathymetry'] as string[],
    nature_of_services_other: '',

    // Contact
    contact_name: '',
    contact_designation: '',
    contact_email: '',
    contact_phone: '',

    // Tax
    tin_number: '',
    vat_status: 'VAT-Registered' as VendorVATStatus,
    vat_reg_number: '',
    wht_acknowledged: true,

    // Bank (Optional)
    bank_name: 'Access Bank Plc',
    custom_bank_name: '',
    account_name: '',
    account_number: '',
    currency: 'NGN',

    // Declaration
    declaration_acknowledged: false,
    representative_name: ''
  });

  const [docFile, setDocFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);

    // Parse URL params for auto-lookup if present
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    const emailParam = params.get('email') || params.get('tin') || params.get('rc');
    const tabParam = params.get('tab');

    if (tabParam === 'track' || tabParam === 'register') {
      setActiveTab(tabParam);
    }

    if (refParam) {
      setRefInput(refParam);
      setActiveTab('track');
      if (emailParam) {
        setIdentInput(emailParam);
        performLookup(refParam, emailParam);
      }
    }
  }, []);

  const performLookup = async (ref: string, ident: string) => {
    if (!ref.trim() || !ident.trim()) {
      setLookupError('Please enter both your Application Reference Code and Email, TIN, or RC Number.');
      return;
    }

    setLookupLoading(true);
    setLookupError('');
    setLookupAttempted(true);

    try {
      const found = await lookupVendorApplication(ref.trim(), ident.trim());
      if (found) {
        setLookupResult(found);
      } else {
        setLookupResult(null);
        setLookupError('No vendor onboarding record matched the reference code and identifier provided.');
      }
    } catch (err) {
      console.error('Vendor lookup error:', err);
      setLookupError('An error occurred during verification lookup. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(refInput, identInput);
  };

  const handleServiceCategoryToggle = (category: string) => {
    setFormData(prev => {
      const exists = prev.nature_of_services.includes(category);
      if (exists) {
        return {
          ...prev,
          nature_of_services: prev.nature_of_services.filter(c => c !== category)
        };
      } else {
        return {
          ...prev,
          nature_of_services: [...prev.nature_of_services, category]
        };
      }
    });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Validations
    if (!formData.vendor_legal_name.trim()) {
      setSubmitError('Please enter the Registered Company Legal Name.');
      return;
    }
    if (!formData.rc_bn_number.trim()) {
      setSubmitError('Please provide your Corporate Affairs Commission (CAC) RC or BN Number.');
      return;
    }
    if (formData.nature_of_services.length === 0 && !formData.nature_of_services_other.trim()) {
      setSubmitError('Please select at least one Core Capability or Supply Category.');
      return;
    }
    if (!formData.contact_name.trim() || !formData.contact_email.trim() || !formData.contact_phone.trim()) {
      setSubmitError('Please complete the primary contact person details (Full Name, Email, and Telephone).');
      return;
    }
    if (!formData.tin_number.trim()) {
      setSubmitError('Please provide your Tax Identification Number (TIN).');
      return;
    }
    if (!formData.declaration_acknowledged) {
      setSubmitError('You must check the Authorized Representative Declaration before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const repName = formData.representative_name.trim() || formData.contact_name.trim();
      const services = [...formData.nature_of_services];
      if (formData.nature_of_services_other.trim()) {
        services.push(formData.nature_of_services_other.trim());
      }

      const resolvedBankName = formData.account_number.trim()
        ? (formData.bank_name === 'Other / Foreign Commercial Bank (Specify)'
            ? (formData.custom_bank_name.trim() || 'Other Foreign / Commercial Bank')
            : formData.bank_name)
        : 'To be provided upon PO award';

      const res = await submitVendorApplication({
        vendor_legal_name: formData.vendor_legal_name.trim(),
        business_type: formData.business_type,
        rc_bn_number: formData.rc_bn_number.trim(),
        incorporation_date: formData.incorporation_date || new Date().toISOString().split('T')[0],
        registered_address: formData.registered_address.trim() || 'Nigeria',
        operational_address: formData.is_operational_same ? formData.registered_address.trim() : formData.operational_address.trim(),
        is_operational_same_as_registered: formData.is_operational_same,
        nature_of_services: services,
        tin_number: formData.tin_number.trim(),
        vat_status: formData.vat_status,
        vat_reg_number: formData.vat_reg_number.trim(),
        wht_deduction_acknowledged: formData.wht_acknowledged,
        wht_remittance_acknowledged: formData.wht_acknowledged,
        wht_credit_note_acknowledged: formData.wht_acknowledged,
        vat_non_deduction_acknowledged: formData.wht_acknowledged,
        bank_name: resolvedBankName,
        account_name: formData.account_name.trim() || formData.vendor_legal_name.trim(),
        account_number: formData.account_number.trim() || '0000000000',
        currency: formData.currency,
        contact_name: formData.contact_name.trim(),
        contact_designation: formData.contact_designation.trim() || 'Authorized Representative',
        contact_phone: formData.contact_phone.trim(),
        contact_email: formData.contact_email.trim(),
        declaration_acknowledged: true,
        representative_name: repName,
        signature_data: `Digital Declaration Verified: ${repName} (${new Date().toISOString()})`,
        vat_file: docFile
      });

      if (res.success && res.reference_number) {
        setSubmissionSuccess(res.reference_number);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitError(res.error || 'Failed to submit onboarding profile. Please check your network and try again.');
      }
    } catch (err: any) {
      console.error('Vendor submission error:', err);
      setSubmitError(err.message || 'An unexpected error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. Hero Header */}
      <section className="relative bg-slate-950 pt-28 pb-14 md:pt-36 md:pb-20 overflow-hidden border-b border-slate-800 print:hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={VendorsHeroBg} 
            alt="PIGL Vendor Desk" 
            className="w-full h-full object-cover opacity-25 grayscale-[0.2]"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-950/75"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <span className="text-white">Vendor Desk & Compliance</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <span>Form PIGL/F/VOTC/AHR/037 Rev. 00</span>
                <span>•</span>
                <span>Streamlined Digital Desk</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                PIGL Vendor Onboarding & Verification Portal
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mt-3">
                Mandatory onboarding and Nigerian statutory tax compliance registration for all technical, marine, geomatics, and engineering service providers.
              </p>
            </div>

            {/* Quick ISO Credential Badges */}
            <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0">
              <div className="flex items-center space-x-2 px-3 py-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl">
                <img src={Iso9001Img} alt="ISO 9001" className="h-8 w-auto object-contain" />
                <div className="text-left text-[11px] leading-tight text-slate-300">
                  <span className="font-bold block text-white">ISO 9001:2015</span>
                  Quality Assured
                </div>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl">
                <img src={Iso45001Img} alt="ISO 45001" className="h-8 w-auto object-contain" />
                <div className="text-left text-[11px] leading-tight text-slate-300">
                  <span className="font-bold block text-white">ISO 45001:2018</span>
                  HSSE Certified
                </div>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-8 flex items-center p-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl w-full sm:w-auto sm:inline-flex shadow-xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setSubmissionSuccess(null);
              }}
              className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'register'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>1. New Vendor Registration</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/20 hidden sm:inline-block">
                ~3 Mins
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('track')}
              className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'track'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>2. Track Status & Verification</span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine dark={true} />
        </div>
      </section>

      {/* 2. Main Content Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full flex-1">
        
        {/* ========================================================================= */}
        {/* TAB 1: STREAMLINED 1-PAGE REGISTRATION FORM                               */}
        {/* ========================================================================= */}
        {activeTab === 'register' && (
          <div className="space-y-8 animate-in fade-in duration-300">

            {/* Submission Success Banner */}
            {submissionSuccess ? (
              <div className="bg-white border-2 border-emerald-500 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Registration Successfully Submitted</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Onboarding Dossier Logged
                  </h2>
                  <p className="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed">
                    Your company compliance profile has been logged under <strong>Form PIGL/F/VOTC/AHR/037</strong>. An acknowledgment notice has been dispatched to your email.
                  </p>
                </div>

                <div className="p-6 bg-slate-900 text-white rounded-2xl max-w-md mx-auto shadow-lg space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Official Reference Code</span>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400 tracking-wider">
                    {submissionSuccess}
                  </div>
                  <p className="text-[11px] text-slate-400">Save this code to check your qualification status at any time.</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setRefInput(submissionSuccess);
                      setIdentInput(formData.contact_email);
                      setActiveTab('track');
                      performLookup(submissionSuccess, formData.contact_email);
                    }}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center space-x-2"
                  >
                    <span>Track Status & View Printable Receipt</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionSuccess(null);
                      setFormData({
                        vendor_legal_name: '',
                        business_type: 'Limited Liability Company (Ltd)',
                        rc_bn_number: '',
                        incorporation_date: '',
                        registered_address: '',
                        operational_address: '',
                        is_operational_same: true,
                        nature_of_services: ['Survey / Geoscience & Offshore Bathymetry'],
                        nature_of_services_other: '',
                        contact_name: '',
                        contact_designation: '',
                        contact_email: '',
                        contact_phone: '',
                        tin_number: '',
                        vat_status: 'VAT-Registered',
                        vat_reg_number: '',
                        wht_acknowledged: true,
                        bank_name: 'Access Bank Plc',
                        custom_bank_name: '',
                        account_name: '',
                        account_number: '',
                        currency: 'NGN',
                        declaration_acknowledged: false,
                        representative_name: ''
                      });
                      setDocFile(null);
                    }}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
                  >
                    Register Another Company
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-8">
                
                {submitError && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-xs font-semibold animate-in shake">
                    <svg className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{submitError}</span>
                  </div>
                )}

                {/* 1. Company Profile Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-sm">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        Company & Corporate Identification
                      </h3>
                      <p className="text-xs text-slate-500">Official business registration details registered with CAC.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Registered Company Legal Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.vendor_legal_name}
                        onChange={(e) => setFormData({ ...formData, vendor_legal_name: e.target.value })}
                        placeholder="e.g. Geodynamic Marine & Subsurface Engineering Ltd"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Business Entity Type <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.business_type}
                        onChange={(e) => setFormData({ ...formData, business_type: e.target.value as VendorBusinessType })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-medium"
                      >
                        <option value="Limited Liability Company (Ltd)">Limited Liability Company (Ltd)</option>
                        <option value="Business Name (Sole Proprietor / Partnership)">Business Name (Sole Proprietor / Partnership)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        CAC RC or BN Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.rc_bn_number}
                        onChange={(e) => setFormData({ ...formData, rc_bn_number: e.target.value })}
                        placeholder="e.g. RC 1849204"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-mono font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Date of Incorporation / Registration
                      </label>
                      <input
                        type="date"
                        value={formData.incorporation_date}
                        onChange={(e) => setFormData({ ...formData, incorporation_date: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Registered Corporate Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.registered_address}
                        onChange={(e) => setFormData({ ...formData, registered_address: e.target.value })}
                        placeholder="Plot number, Street, City, State"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Core Capabilities Selection */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Core Supply & Service Capabilities <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {SERVICE_CATEGORIES.map((cat) => {
                        const isSelected = formData.nature_of_services.includes(cat);
                        return (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => handleServiceCategoryToggle(cat)}
                            className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
                                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <span className="truncate pr-2">{cat}</span>
                            <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Primary Contact Representative Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-sm">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        Primary Contact Representative
                      </h3>
                      <p className="text-xs text-slate-500">Corporate point-of-contact for tenders, RFQs, and purchase orders.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Contact Person Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contact_name}
                        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                        placeholder="e.g. Engr. Tariere Briggs"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Designation / Corporate Title
                      </label>
                      <input
                        type="text"
                        value={formData.contact_designation}
                        onChange={(e) => setFormData({ ...formData, contact_designation: e.target.value })}
                        placeholder="e.g. Managing Director / Business Lead"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Official Business Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        placeholder="procurement@company.ng"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Official Telephone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                        placeholder="+234 803 123 4567"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-mono font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Tax Identification & Statutory Compliance Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-sm">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        Tax Identification & Statutory Compliance
                      </h3>
                      <p className="text-xs text-slate-500">Federal Inland Revenue Service (FIRS) credentials and tax certification.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Tax Identification Number (TIN) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.tin_number}
                        onChange={(e) => setFormData({ ...formData, tin_number: e.target.value })}
                        placeholder="e.g. 24819402-0001"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-mono font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Value Added Tax (VAT) Status
                      </label>
                      <select
                        value={formData.vat_status}
                        onChange={(e) => setFormData({ ...formData, vat_status: e.target.value as VendorVATStatus })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-medium"
                      >
                        <option value="VAT-Registered">VAT-Registered Entity</option>
                        <option value="NOT VAT-Registered">NOT VAT-Registered (Exempt / Threshold)</option>
                      </select>
                    </div>

                    {formData.vat_status === 'VAT-Registered' && (
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          VAT Registration Number
                        </label>
                        <input
                          type="text"
                          value={formData.vat_reg_number}
                          onChange={(e) => setFormData({ ...formData, vat_reg_number: e.target.value })}
                          placeholder="e.g. VAT-10928374"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-mono font-medium"
                        />
                      </div>
                    )}

                    {/* Optional File Upload */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Upload Tax Clearance / VAT Certificate or Company Capability Deck (Optional)
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setDocFile(e.target.files[0]);
                            }
                          }}
                          className="text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                        />
                        {docFile && (
                          <span className="text-xs text-emerald-700 font-semibold truncate">
                            ✓ {docFile.name} ({(docFile.size / 1024).toFixed(0)} KB)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Accepts PDF, JPG, PNG up to 10MB.</p>
                    </div>
                  </div>

                  {/* Standard WHT Legal Clause Banner */}
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-xs text-emerald-950">
                    <svg className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div className="space-y-1">
                      <span className="font-bold block text-emerald-900">Standard FIRS Withholding Tax (WHT) Compliance</span>
                      <p className="text-emerald-800/90 leading-relaxed text-[11px]">
                        Pursuant to Nigerian tax regulations, statutory WHT is deducted at the applicable statutory rate on qualifying technical and engineering invoices, with official Electronic Credit Notes promptly provided.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Banking & Settlement Information (Optional / Flexible) */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-black text-sm">
                        4
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                          Settlement Bank Information
                        </h3>
                        <p className="text-xs text-slate-500">Corporate NUBAN banking details for electronic payment disbursement.</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                      Optional Now
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    💡 <strong>Flexible Submission:</strong> You may input your corporate bank details now, or defer this until a purchase order (PO) or subcontract is awarded.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Commercial / Settlement Bank
                      </label>
                      <select
                        value={formData.bank_name}
                        onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-medium"
                      >
                        {NIGERIAN_BANK_GROUPS.map((group) => (
                          <optgroup key={group.group} label={group.group}>
                            {group.banks.map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Account Name
                      </label>
                      <input
                        type="text"
                        value={formData.account_name}
                        onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                        placeholder="Must match CAC Registered Name"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        NUBAN Account Number
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        value={formData.account_number}
                        onChange={(e) => setFormData({ ...formData, account_number: e.target.value.replace(/[^0-9]/g, '') })}
                        placeholder="10 Digits"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-mono font-medium"
                      />
                    </div>
                  </div>

                  {formData.bank_name === 'Other / Foreign Commercial Bank (Specify)' && (
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Specify Bank / Foreign Financial Institution Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.custom_bank_name}
                        onChange={(e) => setFormData({ ...formData, custom_bank_name: e.target.value })}
                        placeholder="e.g. Standard Bank South Africa, HSBC UK, Deutsche Bank, etc."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-medium"
                      />
                    </div>
                  )}
                </div>

                {/* 5. Corporate Declaration & Submit Card */}
                <div className="bg-white border-2 border-emerald-600/30 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                      5
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        Authorized Representative Declaration
                      </h3>
                      <p className="text-xs text-slate-500">Official sign-off confirming truth and authenticity of documentation.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Authorized Representative Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.representative_name}
                        onChange={(e) => setFormData({ ...formData, representative_name: e.target.value })}
                        placeholder={formData.contact_name || 'e.g. Engr. Tariere Briggs'}
                        className="w-full max-w-md px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-medium"
                      />
                    </div>

                    <label className="flex items-start space-x-3 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.declaration_acknowledged}
                        onChange={(e) => setFormData({ ...formData, declaration_acknowledged: e.target.checked })}
                        className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                      />
                      <span className="text-xs text-slate-700 leading-relaxed font-medium">
                        I hereby declare on behalf of <strong>{formData.vendor_legal_name || 'the registering company'}</strong> that the information, statutory tax credentials, and technical representations provided herein are true, authentic, and complete.
                      </span>
                    </label>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      ⚡ <strong>Instant Reference Generation:</strong> Submissions are logged immediately in the PIGL Procurement Registry.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-emerald-950/20 flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Logging Onboarding Profile...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Vendor Registration</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: VENDOR STATUS TRACKER & PRINTABLE DOSSIER                          */}
        {/* ========================================================================= */}
        {activeTab === 'track' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Search Lookup Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs print:hidden">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Verification Engine</span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  Track Application Status & Dossier
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Enter your assigned Application Reference Code along with your registered Contact Email, TIN, or RC Number.
                </p>
              </div>

              <form onSubmit={handleLookupSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Reference Code
                  </label>
                  <input
                    type="text"
                    required
                    value={refInput}
                    onChange={(e) => setRefInput(e.target.value)}
                    placeholder="e.g. PIGL-VEND-2026-8492"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all uppercase"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email, TIN, or RC Number
                  </label>
                  <input
                    type="text"
                    required
                    value={identInput}
                    onChange={(e) => setIdentInput(e.target.value)}
                    placeholder="tariere@company.ng or 24819402"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  {lookupLoading ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <span>Verify Status</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {lookupError && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold">
                  {lookupError}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 gap-2">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Direct live query against PIGL statutory procurement registry.</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  ISO 9001:2015 &amp; ISO 45001:2018 Certified
                </span>
              </div>
            </div>

            {/* Found Record Display */}
            {lookupResult && (
              <div className="space-y-6">

                {/* Progress Status Bar (Print Hidden) */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs print:hidden space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Status</span>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                        {lookupResult.vendor_legal_name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">Ref: {lookupResult.reference_number}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getStatusBadge(lookupResult.status)}
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>Print Dossier</span>
                      </button>
                    </div>
                  </div>

                  {/* 4-Step Progress Lifecycle */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { title: '1. Form Logged', desc: 'Dossier received in system', active: true, done: true },
                      {
                        title: '2. Procurement Review',
                        desc: lookupResult.procurement_reviewer || 'Under review by lead buyer',
                        active: lookupResult.status !== 'pending',
                        done: lookupResult.status === 'under_review' || lookupResult.status === 'approved'
                      },
                      {
                        title: '3. Finance & Tax Verified',
                        desc: lookupResult.vat_status_verified ? 'TIN & NUBAN confirmed' : 'Tax clearance checking',
                        active: lookupResult.status === 'under_review' || lookupResult.status === 'approved',
                        done: lookupResult.status === 'approved' || lookupResult.vat_status_verified
                      },
                      {
                        title: '4. Approved Vendor',
                        desc: lookupResult.status === 'approved' ? (lookupResult.approved_vendor_category || 'Certified Vendor') : 'Awaiting final sign-off',
                        active: lookupResult.status === 'approved',
                        done: lookupResult.status === 'approved'
                      }
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all ${
                          step.done
                            ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                            : step.active
                            ? 'bg-blue-50/50 border-blue-300 text-blue-950'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            step.done ? 'bg-emerald-600 text-white' : step.active ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'
                          }`}>
                            {step.done ? '✓' : idx + 1}
                          </span>
                          <span className="text-xs font-bold truncate">{step.title}</span>
                        </div>
                        <p className="text-[11px] line-clamp-1 opacity-80">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Official Printable Compliance Document */}
                <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-10 shadow-sm print:border-none print:shadow-none print:p-0">
                  <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={LogoDarkImg} alt="PIGL" className="h-12 w-auto object-contain" />
                      <div>
                        <h2 className="text-lg font-black text-slate-950 tracking-tight uppercase">
                          Polaris Integrated & GeoSolutions Limited
                        </h2>
                        <p className="text-xs text-slate-600 font-semibold uppercase">
                          Procurement & Subcontractor Compliance Desk
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-950 block">FORM PIGL/F/VOTC/AHR/037</span>
                      <span className="text-[11px] font-mono text-emerald-700 font-bold block">{lookupResult.reference_number}</span>
                      <span className="text-[10px] text-slate-500 block">Submitted: {new Date(lookupResult.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="py-6 space-y-6 text-xs text-slate-800">
                    {/* Section A */}
                    <div>
                      <h4 className="font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-3">
                        Section A: Vendor Identification
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div><strong className="block text-slate-500">Legal Name:</strong> {lookupResult.vendor_legal_name}</div>
                        <div><strong className="block text-slate-500">Entity Type:</strong> {lookupResult.business_type}</div>
                        <div><strong className="block text-slate-500">RC/BN Number:</strong> {lookupResult.rc_bn_number}</div>
                        <div><strong className="block text-slate-500">Incorporation Date:</strong> {lookupResult.incorporation_date || 'N/A'}</div>
                        <div className="col-span-2"><strong className="block text-slate-500">Registered Office:</strong> {lookupResult.registered_address}</div>
                      </div>
                    </div>

                    {/* Section B & C */}
                    <div>
                      <h4 className="font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-3">
                        Section B & C: Tax Compliance & WHT Undertaking
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div><strong className="block text-slate-500">TIN Number:</strong> {lookupResult.tin_number}</div>
                        <div><strong className="block text-slate-500">VAT Status:</strong> {lookupResult.vat_status}</div>
                        <div><strong className="block text-slate-500">VAT Reg Number:</strong> {lookupResult.vat_reg_number || 'N/A'}</div>
                        <div><strong className="block text-slate-500">WHT Deduction Ack:</strong> {lookupResult.wht_deduction_acknowledged ? 'Verified (Yes)' : 'No'}</div>
                        <div><strong className="block text-slate-500">FIRS Remittance Ack:</strong> {lookupResult.wht_remittance_acknowledged ? 'Verified (Yes)' : 'No'}</div>
                      </div>
                    </div>

                    {/* Section D & E */}
                    <div>
                      <h4 className="font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-3">
                        Section D & E: Primary Representative & Banking
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div><strong className="block text-slate-500">Representative:</strong> {lookupResult.contact_name}</div>
                        <div><strong className="block text-slate-500">Designation:</strong> {lookupResult.contact_designation}</div>
                        <div><strong className="block text-slate-500">Email:</strong> {lookupResult.contact_email}</div>
                        <div><strong className="block text-slate-500">Phone:</strong> {lookupResult.contact_phone}</div>
                        <div><strong className="block text-slate-500">Bank Name:</strong> {lookupResult.bank_name}</div>
                        <div><strong className="block text-slate-500">NUBAN:</strong> {lookupResult.account_number}</div>
                      </div>
                    </div>

                    {/* Section G: Internal Signoff (If Reviewed) */}
                    {lookupResult.status !== 'pending' && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="font-bold uppercase tracking-wider text-slate-900 mb-2">
                          Section G: PIGL Committee Review & Approval
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div><strong className="block text-slate-500">Procurement Reviewer:</strong> {lookupResult.procurement_reviewer || 'Head of Procurement'}</div>
                          <div><strong className="block text-slate-500">Finance Reviewer:</strong> {lookupResult.finance_reviewer || 'Tax & Treasury Desk'}</div>
                          <div><strong className="block text-slate-500">Category Assigned:</strong> {lookupResult.approved_vendor_category || 'General Geoscience & Engineering'}</div>
                          {lookupResult.internal_notes && (
                            <div className="col-span-2 sm:col-span-3">
                              <strong className="block text-slate-500">Committee Notes:</strong> {lookupResult.internal_notes}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t flex items-center justify-between text-[11px] text-slate-400">
                    <span>Polaris Integrated & GeoSolutions Limited • ISO 9001:2015 & ISO 45001:2018</span>
                    <span>Official Procurement Dossier Verification</span>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
};

export default VendorHub;
