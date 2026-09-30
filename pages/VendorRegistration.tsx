import React, { useState, useRef, useEffect } from 'react';
import LogoDarkImg from '../assets/LOGO.png';
import VendorsHeroBg from '../assets/slider.jpeg';
import { submitVendorApplication } from '../hooks/useSupabaseData';
import { VendorBusinessType, VendorVATStatus } from '../types';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';

const NIGERIAN_BANKS = [
  'Access Bank Plc',
  'Zenith Bank Plc',
  'Guaranty Trust Bank (GTBank)',
  'First Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Fidelity Bank Plc',
  'Stanbic IBTC Bank',
  'Ecobank Nigeria',
  'Sterling Bank Plc',
  'Union Bank of Nigeria',
  'Wema Bank Plc',
  'FCMB (First City Monument Bank)',
  'Keystone Bank',
  'Polaris Bank Limited',
  'Jaiz Bank Plc',
  'Taj Bank',
  'Standard Chartered Bank Nigeria',
  'Citibank Nigeria',
  'Other Commercial / Merchant Bank'
];

const SERVICE_NATURE_OPTIONS = [
  'Consultancy',
  'Engineering / Technical',
  'Survey / Geoscience',
  'Logistics / Support Services',
  'Other (specify)'
];

const VendorRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Section A
    vendor_legal_name: '',
    business_type: 'Limited Liability Company (Ltd)' as VendorBusinessType,
    rc_bn_number: '',
    incorporation_date: '',
    registered_address: '',
    operational_address: '',
    is_operational_same_as_registered: true,
    nature_of_services: ['Survey / Geoscience'] as string[],
    nature_of_services_other: '',

    // Section B
    tin_number: '',
    vat_status: 'VAT-Registered' as VendorVATStatus,
    vat_reg_number: '',

    // Section C
    wht_deduction_acknowledged: true,
    wht_remittance_acknowledged: true,
    wht_credit_note_acknowledged: true,
    vat_non_deduction_acknowledged: true,

    // Section D
    bank_name: 'Zenith Bank Plc',
    custom_bank_name: '',
    account_name: '',
    account_number: '',
    currency: 'NGN',

    // Section E
    contact_name: '',
    contact_designation: '',
    contact_phone: '',
    contact_email: '',

    // Section F
    declaration_acknowledged: false,
    representative_name: '',
    signature_type: 'draw' as 'draw' | 'type',
    typed_signature: '',
    official_stamp_attached: false
  });

  // Attachments
  const [vatFile, setVatFile] = useState<File | null>(null);
  const [stampFile, setStampFile] = useState<File | null>(null);

  // Signature Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width || 1);
    const scaleY = canvas.height / (rect.height || 1);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width || 1);
    const scaleY = canvas.height / (rect.height || 1);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#022c22'; // deep emerald navy
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawnSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  // Toggle Nature of services
  const handleNatureToggle = (option: string) => {
    setFormData(prev => {
      const exists = prev.nature_of_services.includes(option);
      return {
        ...prev,
        nature_of_services: exists
          ? prev.nature_of_services.filter(s => s !== option)
          : [...prev.nature_of_services, option]
      };
    });
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    setErrorMessage('');

    if (step === 1) {
      if (!formData.vendor_legal_name.trim()) {
        setErrorMessage('Please enter the legal name of the vendor/company.');
        return false;
      }
      if (!formData.rc_bn_number.trim()) {
        setErrorMessage('Please enter your RC or BN Registration Number.');
        return false;
      }
      if (!formData.incorporation_date) {
        setErrorMessage('Please enter the date of incorporation/registration.');
        return false;
      }
      if (!formData.registered_address.trim()) {
        setErrorMessage('Please enter the registered business address.');
        return false;
      }
      if (!formData.is_operational_same_as_registered && !formData.operational_address.trim()) {
        setErrorMessage('Please specify your operational address.');
        return false;
      }
      if (formData.nature_of_services.length === 0) {
        setErrorMessage('Please select at least one nature of service provided.');
        return false;
      }
      if (formData.nature_of_services.includes('Other (specify)') && !formData.nature_of_services_other.trim()) {
        setErrorMessage('Please specify your other nature of service.');
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!formData.tin_number.trim()) {
        setErrorMessage('Please provide your Tax Identification Number (TIN).');
        return false;
      }
      if (formData.vat_status === 'VAT-Registered' && !formData.vat_reg_number.trim()) {
        setErrorMessage('Please provide your VAT Registration Number or Tax Identification.');
        return false;
      }
      if (!formData.wht_deduction_acknowledged || !formData.wht_remittance_acknowledged || !formData.wht_credit_note_acknowledged || !formData.vat_non_deduction_acknowledged) {
        setErrorMessage('You must acknowledge all Withholding Tax (WHT) statutory declarations to proceed.');
        return false;
      }
      return true;
    }

    if (step === 3) {
      const activeBank = formData.bank_name === 'Other Commercial / Merchant Bank' ? formData.custom_bank_name : formData.bank_name;
      if (!activeBank.trim()) {
        setErrorMessage('Please select or specify your bank name.');
        return false;
      }
      if (!formData.account_name.trim()) {
        setErrorMessage('Please enter the bank account name (matching your company registration).');
        return false;
      }
      if (!formData.account_number.trim() || formData.account_number.length < 10) {
        setErrorMessage('Please enter a valid 10-digit NUBAN account number.');
        return false;
      }
      return true;
    }

    if (step === 4) {
      if (!formData.contact_name.trim()) {
        setErrorMessage('Please provide the primary contact person name.');
        return false;
      }
      if (!formData.contact_designation.trim()) {
        setErrorMessage('Please provide the contact person designation / title.');
        return false;
      }
      if (!formData.contact_phone.trim()) {
        setErrorMessage('Please enter a valid phone number.');
        return false;
      }
      if (!formData.contact_email.trim() || !formData.contact_email.includes('@')) {
        setErrorMessage('Please enter a valid corporate email address.');
        return false;
      }
      return true;
    }

    if (step === 5) {
      if (!formData.declaration_acknowledged) {
        setErrorMessage('You must accept the declaration and undertaking before final submission.');
        return false;
      }
      if (!formData.representative_name.trim()) {
        setErrorMessage('Please enter the full name of the authorized vendor representative.');
        return false;
      }
      if (formData.signature_type === 'draw' && !hasDrawnSignature) {
        setErrorMessage('Please draw your digital signature on the pad or switch to typed sign-off.');
        return false;
      }
      if (formData.signature_type === 'type' && !formData.typed_signature.trim()) {
        setErrorMessage('Please type your full legal signature.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setErrorMessage('');

    let signatureData = '';
    if (formData.signature_type === 'draw' && canvasRef.current) {
      signatureData = canvasRef.current.toDataURL('image/png');
    } else {
      signatureData = `Typed Signature: ${formData.typed_signature.trim()} [Authorized Representative: ${formData.representative_name}]`;
    }

    try {
      const activeBank = formData.bank_name === 'Other Commercial / Merchant Bank' ? formData.custom_bank_name : formData.bank_name;

      const result = await submitVendorApplication({
        vendor_legal_name: formData.vendor_legal_name.trim(),
        business_type: formData.business_type,
        rc_bn_number: formData.rc_bn_number.trim(),
        incorporation_date: formData.incorporation_date,
        registered_address: formData.registered_address.trim(),
        operational_address: formData.is_operational_same_as_registered ? formData.registered_address.trim() : formData.operational_address.trim(),
        is_operational_same_as_registered: formData.is_operational_same_as_registered,
        nature_of_services: formData.nature_of_services,
        nature_of_services_other: formData.nature_of_services_other.trim(),
        tin_number: formData.tin_number.trim(),
        vat_status: formData.vat_status,
        vat_reg_number: formData.vat_reg_number.trim(),
        wht_deduction_acknowledged: formData.wht_deduction_acknowledged,
        wht_remittance_acknowledged: formData.wht_remittance_acknowledged,
        wht_credit_note_acknowledged: formData.wht_credit_note_acknowledged,
        vat_non_deduction_acknowledged: formData.vat_non_deduction_acknowledged,
        bank_name: activeBank,
        account_name: formData.account_name.trim(),
        account_number: formData.account_number.trim(),
        currency: formData.currency,
        contact_name: formData.contact_name.trim(),
        contact_designation: formData.contact_designation.trim(),
        contact_phone: formData.contact_phone.trim(),
        contact_email: formData.contact_email.trim(),
        declaration_acknowledged: formData.declaration_acknowledged,
        representative_name: formData.representative_name.trim(),
        vat_file: vatFile,
        signature_data: signatureData,
        stamp_file: stampFile
      });

      if (result.success && result.reference_number) {
        setSubmissionSuccess(result.reference_number);
        setCurrentStep(6);
      } else {
        setErrorMessage(result.error || 'Failed to submit application. Please check your connection and try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An unexpected error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Vendor Identification', code: 'Section A' },
    { num: 2, label: 'Tax & Compliance', code: 'Sections B & C' },
    { num: 3, label: 'Bank Details', code: 'Section D' },
    { num: 4, label: 'Contact Person', code: 'Section E' },
    { num: 5, label: 'Declaration & Sign-off', code: 'Section F' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      
      {/* 1. Immersive Hero Section */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img 
            src={VendorsHeroBg} 
            alt="PIGL Vendor Registration" 
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
            <span className="text-white">Digital Registration Form</span>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
              Vendor Registration & Compliance Form
            </h1>
            <p className="text-base md:text-lg text-slate-300 font-normal leading-relaxed">
              Complete the structured 5-step digital onboarding dossier (Sections A through F) for technical qualification and Nigerian tax clearance with Polaris Integrated & GeoSolutions Limited.
            </p>
          </div>
        </div>

        {/* Continuous Reflective Energy Line at the base of the Hero & Breadcrumb section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine dark={true} />
        </div>
      </section>

      {/* 2. Main Form Layout (Two-Column Grid) */}
      <section className="py-12 md:py-16 bg-slate-50 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left / Main Form Wizard (8 cols) */}
            <div className="lg:col-span-8 space-y-6">

        {/* Multi-Step Stepper Header */}
        {currentStep <= 5 && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            {/* Mobile View: Dynamic Progress Bar & Step Name */}
            <div className="sm:hidden space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.code}
                </span>
                <span className="text-xs font-bold text-slate-800 truncate max-w-[50%]">
                  {steps[currentStep - 1]?.label}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Tablet & Desktop View: Multi-Step Stepper */}
            <div className="hidden sm:block overflow-x-auto">
              <div className="flex items-center justify-between min-w-[600px] gap-2">
                {steps.map((st) => {
                  const isPassed = currentStep > st.num;
                  const isCurrent = currentStep === st.num;

                  return (
                    <div key={st.num} className="flex-1 flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-all ${
                        isPassed ? 'bg-emerald-600 text-white' :
                        isCurrent ? 'bg-slate-900 text-emerald-400 ring-2 ring-emerald-500/50' :
                        'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {isPassed ? '✓' : st.num}
                      </div>
                      <div className="overflow-hidden">
                        <p className={`text-[10px] font-mono uppercase tracking-wider font-bold truncate ${
                          isCurrent ? 'text-emerald-700' : 'text-slate-400'
                        }`}>
                          {st.code}
                        </p>
                        <p className={`text-xs font-bold truncate ${
                          isCurrent ? 'text-slate-900' : isPassed ? 'text-slate-700' : 'text-slate-400'
                        }`}>
                          {st.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center space-x-3 animate-fade-in shadow-xs">
            <svg className="w-5 h-5 flex-shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-10 shadow-xs">
          
          {/* STEP 1: SECTION A - VENDOR IDENTIFICATION */}
          {currentStep === 1 && (
            <form onSubmit={handleNext} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 font-mono">
                  1.0 Section A
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Vendor Identification
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  To be completed by all new and existing vendors before engagement and invoice processing.
                </p>
              </div>

              <div className="space-y-4">
                {/* 1. Legal Name of Vendor */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    1. Legal Name of Vendor <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vendor_legal_name}
                    onChange={(e) => setFormData({ ...formData, vendor_legal_name: e.target.value })}
                    placeholder="e.g. Apex Marine & Geotechnical Services Nigeria Limited"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-700 focus:bg-white transition-all"
                  />
                </div>

                {/* 2. Business Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    2. Business Type (tick one) <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Business Name (Sole Proprietor / Partnership)',
                      'Limited Liability Company (Ltd)'
                    ].map((type) => (
                      <label
                        key={type}
                        className={`p-3.5 border flex items-center space-x-3 cursor-pointer transition-all ${
                          formData.business_type === type
                            ? 'border-emerald-700 bg-emerald-50/50 text-emerald-950 font-bold'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="business_type"
                          value={type}
                          checked={formData.business_type === type}
                          onChange={(e) => setFormData({ ...formData, business_type: e.target.value as VendorBusinessType })}
                          className="text-emerald-700 focus:ring-emerald-700"
                        />
                        <span className="text-xs">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3 & 4. RC/BN Number & Date of Incorporation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      3. RC / BN Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.rc_bn_number}
                      onChange={(e) => setFormData({ ...formData, rc_bn_number: e.target.value })}
                      placeholder="e.g. RC 1489201 or BN 2894102"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-700 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      4. Date of Incorporation / Registration <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.incorporation_date}
                      onChange={(e) => setFormData({ ...formData, incorporation_date: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-700 focus:bg-white"
                    />
                  </div>
                </div>

                {/* 5. Registered Business Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    5. Registered Business Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.registered_address}
                    onChange={(e) => setFormData({ ...formData, registered_address: e.target.value })}
                    placeholder="Enter official registered office address as filed with CAC..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>

                {/* 6. Operational Address */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      6. Operational Address (if different)
                    </label>
                    <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_operational_same_as_registered}
                        onChange={(e) => setFormData({ ...formData, is_operational_same_as_registered: e.target.checked })}
                        className="rounded text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>Same as Registered Address</span>
                    </label>
                  </div>

                  {!formData.is_operational_same_as_registered && (
                    <textarea
                      rows={2}
                      required
                      value={formData.operational_address}
                      onChange={(e) => setFormData({ ...formData, operational_address: e.target.value })}
                      placeholder="Enter physical operational office / workshop / yard address..."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-700 focus:bg-white"
                    />
                  )}
                </div>

                {/* 7. Nature of Services Provided */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    7. Nature of Services Provided (select all applicable) <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SERVICE_NATURE_OPTIONS.map((opt) => {
                      const isSelected = formData.nature_of_services.includes(opt);
                      return (
                        <label
                          key={opt}
                          className={`p-3 border flex items-center space-x-3 cursor-pointer text-xs transition-all ${
                            isSelected
                              ? 'border-emerald-700 bg-emerald-50/60 font-bold text-emerald-950'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleNatureToggle(opt)}
                            className="rounded text-emerald-700 focus:ring-emerald-700"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>

                  {formData.nature_of_services.includes('Other (specify)') && (
                    <div className="mt-3">
                      <input
                        type="text"
                        required
                        value={formData.nature_of_services_other}
                        onChange={(e) => setFormData({ ...formData, nature_of_services_other: e.target.value })}
                        placeholder="Please specify nature of services provided..."
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-700"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Form Navigation Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <a
                  href="/vendors"
                  className="px-6 py-2.5 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </a>
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-sm flex items-center space-x-2"
                >
                  <span>Proceed to Section B (Tax Info)</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: SECTION B & C - TAX INFORMATION & WHT DECLARATION */}
          {currentStep === 2 && (
            <form onSubmit={handleNext} className="space-y-8">
              {/* Section B */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 font-mono">
                    2.0 Section B
                  </span>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Tax Information
                  </h2>
                </div>

                {/* 8. Tax Identification Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    8. Tax Identification Number (TIN) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tin_number}
                    onChange={(e) => setFormData({ ...formData, tin_number: e.target.value })}
                    placeholder="e.g. 20491823-0001 (10 to 14-digit NRS TIN)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>

                {/* 9. VAT Registration Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    9. VAT Registration Status (tick one) <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['VAT-Registered', 'NOT VAT-Registered'].map((status) => (
                      <label
                        key={status}
                        className={`p-3.5 border flex items-center space-x-3 cursor-pointer transition-all ${
                          formData.vat_status === status
                            ? 'border-emerald-700 bg-emerald-50/50 text-emerald-950 font-bold'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="vat_status"
                          value={status}
                          checked={formData.vat_status === status}
                          onChange={(e) => setFormData({ ...formData, vat_status: e.target.value as VendorVATStatus })}
                          className="text-emerald-700 focus:ring-emerald-700"
                        />
                        <span className="text-xs">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 10. VAT Reg Number if VAT-registered */}
                {formData.vat_status === 'VAT-Registered' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      10. If VAT-Registered, provide VAT Registration Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.vat_reg_number}
                      onChange={(e) => setFormData({ ...formData, vat_reg_number: e.target.value })}
                      placeholder="e.g. VAT-10829471"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                )}

                {/* 11. Attach copy of VAT Registration Certificate */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    11. Attach Copy of VAT Registration Certificate (PDF / Image - Max 10MB)
                  </label>
                  <div className="p-4 border-2 border-dashed border-slate-300 bg-slate-50 text-center hover:border-emerald-700 transition-colors">
                    <input
                      type="file"
                      id="vat-file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => setVatFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="vat-file" className="cursor-pointer space-y-1 block">
                      {vatFile ? (
                        <div className="text-xs font-bold text-emerald-800 flex items-center justify-center space-x-2">
                          <span>✓ Attached: {vatFile.name} ({(vatFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs font-bold text-emerald-700">Click to attach VAT Certificate</p>
                          <p className="text-[11px] text-slate-500">PDF, PNG, JPG accepted (Optional for Non-VAT registered)</p>
                        </>
                      )}
                    </label>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 mt-1 italic">
                    Note: VAT will only be paid to VAT-registered vendors.
                  </p>
                </div>
              </div>

              {/* Section C: Withholding Tax Declaration */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 font-mono">
                    3.0 Section C
                  </span>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Withholding Tax (WHT) Declaration
                  </h2>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 space-y-3">
                  <p className="text-xs font-bold text-slate-900">
                    12. Vendor acknowledges and agrees that:
                  </p>

                  <div className="space-y-2.5 text-xs text-slate-700">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.wht_deduction_acknowledged}
                        onChange={(e) => setFormData({ ...formData, wht_deduction_acknowledged: e.target.checked })}
                        className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>Withholding Tax (WHT) will be deducted at applicable statutory rates from all invoices.</span>
                    </label>

                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.wht_remittance_acknowledged}
                        onChange={(e) => setFormData({ ...formData, wht_remittance_acknowledged: e.target.checked })}
                        className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>WHT will be remitted to the Nigeria Revenue Service (NRS) in accordance with Federal tax regulations.</span>
                    </label>

                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.wht_credit_note_acknowledged}
                        onChange={(e) => setFormData({ ...formData, wht_credit_note_acknowledged: e.target.checked })}
                        className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>A WHT Credit Note will be issued upon remittance and confirmation from NRS portal.</span>
                    </label>

                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.vat_non_deduction_acknowledged}
                        onChange={(e) => setFormData({ ...formData, vat_non_deduction_acknowledged: e.target.checked })}
                        className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>VAT will NOT be deducted from invoices where valid statutory exemptions or direct remittance rules apply.</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Navigation Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2.5 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold uppercase tracking-wider"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-sm flex items-center space-x-2"
                >
                  <span>Proceed to Section D (Bank Details)</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SECTION D - BANK DETAILS */}
          {currentStep === 3 && (
            <form onSubmit={handleNext} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 font-mono">
                  4.0 Section D
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Bank Details & Remittance
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Provide verified corporate bank account details for electronic invoice settlements.
                </p>
              </div>

              <div className="space-y-4">
                {/* 13. Bank Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    13. Bank Name <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.bank_name}
                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-700"
                  >
                    {NIGERIAN_BANKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {formData.bank_name === 'Other Commercial / Merchant Bank' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Specify Financial Institution Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.custom_bank_name}
                      onChange={(e) => setFormData({ ...formData, custom_bank_name: e.target.value })}
                      placeholder="e.g. Standard Chartered Bank"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                )}

                {/* 14. Account Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    14. Account Name (Must match CAC Registered Name) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    placeholder="e.g. Apex Marine & Geotechnical Services Nigeria Ltd"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                {/* 15. Account Number & Currency */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      15. Account Number (10-Digit NUBAN) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      required
                      value={formData.account_number}
                      onChange={(e) => setFormData({ ...formData, account_number: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="e.g. 1015829401"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    >
                      <option value="NGN">NGN (Nigerian Naira)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="GBP">GBP (British Pound)</option>
                      <option value="EUR">EUR (Euro)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Navigation Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2.5 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold uppercase tracking-wider"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-sm flex items-center space-x-2"
                >
                  <span>Proceed to Section E (Contact Person)</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SECTION E - CONTACT PERSON */}
          {currentStep === 4 && (
            <form onSubmit={handleNext} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 font-mono">
                  5.0 Section E
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Primary Contact Person
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Designate an authorized representative for operational notices, purchase orders, and payment remittance slips.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 16. Primary Contact Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    16. Primary Contact Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    placeholder="e.g. Engr. Kenneth Nwachukwu"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                {/* 17. Designation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    17. Designation / Corporate Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact_designation}
                    onChange={(e) => setFormData({ ...formData, contact_designation: e.target.value })}
                    placeholder="e.g. Managing Director / Finance Manager"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                {/* 18. Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    18. Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="e.g. +234 803 456 7890"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                {/* 19. Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    19. Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="e.g. k.nwachukwu@apexgeospatial.ng"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              {/* Form Navigation Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2.5 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold uppercase tracking-wider"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-sm flex items-center space-x-2"
                >
                  <span>Proceed to Section F (Declaration & Sign-off)</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: SECTION F - DECLARATION & UNDERTAKING */}
          {currentStep === 5 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 font-mono">
                  6.0 Section F
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Declaration & Undertaking
                </h2>
              </div>

              {/* Legal Declaration Box */}
              <div className="p-5 bg-slate-50 border border-slate-200 space-y-3 text-xs leading-relaxed text-slate-700 font-medium">
                <p className="font-bold text-slate-900">
                  I/We hereby declare that the information provided in this form is <span className="underline">true, correct, and complete</span>.
                </p>
                <p className="font-semibold text-slate-800">
                  I/We understand that:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                  <li>False or misleading information may result in delayed payment or termination of engagement.</li>
                  <li>VAT will only be paid where a valid VAT registration exists.</li>
                  <li>Withholding Tax will be deducted and remitted in accordance with Nigerian tax laws.</li>
                </ul>

                <div className="pt-2 border-t border-slate-200/80">
                  <label className="flex items-center space-x-3 cursor-pointer text-slate-900 font-bold">
                    <input
                      type="checkbox"
                      required
                      checked={formData.declaration_acknowledged}
                      onChange={(e) => setFormData({ ...formData, declaration_acknowledged: e.target.checked })}
                      className="rounded text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>I have read, understood, and solemnly affirm this declaration on behalf of the Vendor.</span>
                  </label>
                </div>
              </div>

              {/* Vendor Representative Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vendor Representative Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.representative_name}
                  onChange={(e) => setFormData({ ...formData, representative_name: e.target.value })}
                  placeholder="e.g. Engr. Kenneth Nwachukwu"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-700"
                />
              </div>

              {/* Signature Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Digital Signature / Corporate Endorsement <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, signature_type: 'draw' })}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                        formData.signature_type === 'draw' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Draw Signature Pad
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, signature_type: 'type' })}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                        formData.signature_type === 'type' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Type Sign-off
                    </button>
                  </div>
                </div>

                {formData.signature_type === 'draw' ? (
                  <div className="space-y-2">
                    <div className="border border-slate-300 bg-slate-50 rounded-none overflow-hidden touch-none relative">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={140}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-[140px] bg-white cursor-crosshair"
                      />
                      <div className="absolute bottom-2 right-2">
                        <button
                          type="button"
                          onClick={clearCanvas}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase rounded"
                        >
                          Clear Pad
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Use your mouse or touchscreen to draw your official signature.
                    </p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      required
                      value={formData.typed_signature}
                      onChange={(e) => setFormData({ ...formData, typed_signature: e.target.value })}
                      placeholder="Type your full legal name as authorized corporate signature"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-sm font-serif italic text-slate-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                )}
              </div>

              {/* Official Stamp Upload (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Company Stamp / Seal (Optional Image / PDF)
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <input
                    type="file"
                    id="stamp-file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setStampFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="stamp-file" className="cursor-pointer text-xs text-emerald-700 font-bold hover:underline">
                    {stampFile ? `Attached: ${stampFile.name}` : 'Click to attach corporate stamp image'}
                  </label>
                  {stampFile && (
                    <button
                      type="button"
                      onClick={() => setStampFile(null)}
                      className="text-xs text-rose-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Form Navigation Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold uppercase tracking-wider"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-3.5 bg-emerald-950 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Transmitting Compliance Dossier...</span>
                    </>
                  ) : (
                    <span>Submit Completed Onboarding Form ✓</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 6: CONFIRMATION & REFERENCE CODE */}
          {currentStep === 6 && submissionSuccess && (
            <div className="py-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 text-3xl font-black">
                ✓
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
                  Form PIGL/F/VOTC/AHR/037 Rev. 00 Successfully Logged
                </span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Vendor Onboarding Dossier Submitted
                </h2>
                <p className="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed">
                  Thank you, <strong>{formData.vendor_legal_name}</strong>. Your vendor registration and tax compliance records have been transmitted directly to PIGL Procurement & Finance teams.
                </p>
              </div>

              {/* Reference Code Badge Box */}
              <div className="p-6 bg-slate-900 text-white rounded-none border border-slate-800 max-w-md mx-auto space-y-2 shadow-lg">
                <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                  Your Application Reference Code
                </p>
                <p className="text-2xl sm:text-3xl font-mono font-black text-emerald-400 tracking-wider select-all">
                  {submissionSuccess}
                </p>
                <p className="text-[11px] text-slate-400 font-mono pt-1">
                  Keep this code safe to track verification status and download your approved vendor certificate.
                </p>
              </div>

              {/* Summary of submitted details */}
              <div className="max-w-md mx-auto p-4 bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 font-medium text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Legal Entity:</span>
                  <span className="font-bold text-slate-900">{formData.vendor_legal_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">RC/BN Number:</span>
                  <span className="font-bold font-mono text-slate-900">{formData.rc_bn_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">TIN Number:</span>
                  <span className="font-bold font-mono text-slate-900">{formData.tin_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank & Account:</span>
                  <span className="font-bold text-slate-900">{formData.bank_name} ({formData.account_number})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <span className="font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Pending Review</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={`/vendors/portal?ref=${submissionSuccess}`}
                  className="px-8 py-3.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-sm"
                >
                  View Status in Vendor Portal →
                </a>
                <a
                  href="/"
                  className="px-6 py-3.5 border border-slate-300 hover:border-slate-900 text-slate-700 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-colors"
                >
                  Return to Home
                </a>
              </div>
            </div>
          )}

        </div>
            </div>

            {/* Right Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Form Standard Info Card */}
              <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Official Form Standard</span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-white">
                  Form PIGL/F/VOTC/AHR/037
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Statutory Nigerian vendor onboarding & tax compliance questionnaire required by PIGL Procurement and HSSEQ governance.
                </p>
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Document Code:</span>
                    <span className="font-mono font-bold text-white">VOTC/AHR/037</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Revision:</span>
                    <span className="font-mono font-bold text-white">Rev. No. 00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Quality Standard:</span>
                    <span className="font-bold text-white">ISO 9001:2015</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">HSSE Standard:</span>
                    <span className="font-bold text-white">ISO 45001:2018</span>
                  </div>
                </div>
              </div>

              {/* Required Documentation Checklist */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Required Checklist
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">1.</span>
                    <span><strong>CAC Certificate:</strong> Corporate Affairs Commission registration (RC or BN).</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">2.</span>
                    <span><strong>TIN Certificate:</strong> Tax Identification Number matching registered entity.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">3.</span>
                    <span><strong>VAT Certificate:</strong> Required if registered for Value Added Tax.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">4.</span>
                    <span><strong>Bank Account (NUBAN):</strong> 10-digit account under the exact legal company name.</span>
                  </li>
                </ul>
              </div>

              {/* Statutory Note Card */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-5 text-amber-900 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                  <svg className="w-4 h-4 text-amber-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Statutory Tax Note</span>
                </p>
                <p className="text-xs leading-relaxed text-amber-950/90 font-medium">
                  "VAT will only be paid to VAT-registered vendors. Withholding Tax (WHT) will be deducted at the statutory rate and remitted to the relevant tax authority."
                </p>
              </div>

              {/* Helpdesk Contact */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Procurement Support
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Questions regarding vendor onboarding? Contact our procurement team directly:
                </p>
                <div className="space-y-1.5 text-xs">
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Email:</strong>{' '}
                    <a href="mailto:procurement@polarisigl.com" className="text-emerald-700 font-bold hover:underline">
                      procurement@polarisigl.com
                    </a>
                  </p>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Phone:</strong>{' '}
                    <a href="tel:+2348097081333" className="text-emerald-700 font-bold hover:underline">
                      +234 809 708 1333
                    </a>
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default VendorRegistration;
