import React, { useState, useEffect } from 'react';
import ContactBg from '../assets/slider.jpeg';
import InfraSketchImg from '../assets/infrastructure_sketch.jpg';
import { CONTACT_CONFIG } from '../site_data';
import { submitContactInquiry, useSiteSettings } from '../hooks/useSupabaseData';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';

const Contact: React.FC = () => {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Geosolutions Services',
    message: '',
    website: '' // Honeypot anti-spam field
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const params = new URLSearchParams(window.location.search);
    const job = params.get('job');
    if (job) {
      setFormData(prev => ({ ...prev, service: job }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your full name.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please provide details about your enquiry or project scope.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.website) {
      // Honeypot triggered
      return;
    }

    if (!validateForm()) {
      setStatus({ type: 'error', message: 'Please complete all required fields highlighted below before submitting.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      await submitContactInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        service_interest: formData.service,
        message: formData.message.trim()
      });
      
      setStatus({ 
        type: 'success', 
        message: 'Thank you! Your enquiry has been submitted successfully to PIGL. Our engineering desk will review your requirements and respond within one business day.' 
      });
      setFormData({ name: '', email: '', service: 'Geosolutions Services', message: '', website: '' });
      setErrors({});
    } catch (error) {
      console.error('Submission error:', error);
      setStatus({ 
        type: 'error', 
        message: 'Something went wrong submitting your enquiry. Please reach us directly via telephone or email.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp deep link with professional prefilled message
  const rawNumber = (settings?.phone_raw || CONTACT_CONFIG.phoneRaw || '2348097081333').replace(/[^0-9]/g, '');
  const defaultWhatsAppMsg = "Hello PIGL, I would like to make an enquiry about your services.";
  const encodedMessage = encodeURIComponent(defaultWhatsAppMsg);
  const whatsappUrl = settings?.whatsapp_url 
    ? (settings.whatsapp_url.includes('text=') 
        ? settings.whatsapp_url 
        : (settings.whatsapp_url.includes('?') 
            ? `${settings.whatsapp_url}&text=${encodedMessage}` 
            : `${settings.whatsapp_url}?text=${encodedMessage}`))
    : `https://wa.me/${rawNumber}?text=${encodedMessage}`;

  const officeAddress = settings?.address_hq || CONTACT_CONFIG.address;
  const phoneNumber = settings?.phone || CONTACT_CONFIG.phone;
  const phoneRaw = settings?.phone_raw || CONTACT_CONFIG.phoneRaw;
  const emailAddress = settings?.email_info || CONTACT_CONFIG.emailInfo;

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      
      {/* 1. Contact Page Header */}
      <section className="relative bg-slate-950 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={ContactBg} 
            alt="PIGL Engineering Desks" 
            className="w-full h-full object-cover opacity-30 grayscale-[0.2]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 font-mono">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400">Contact</span>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
              The kettle is always on. Let&apos;s Chat!
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
              Whether you have a project enquiry, need technical clarification or would like to discuss a potential engagement, our team is ready to hear from you. We respond within one business day, usually sooner.
            </p>
          </div>
        </div>

        {/* Continuous Reflective Energy Line at the base of the Hero section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine dark={true} />
        </div>
      </section>

      {/* 2. Main Contact Section: Balanced Two-Column Layout */}
      <section className="relative py-16 md:py-24 bg-white flex-grow reveal overflow-hidden">
        {/* Subtle Architectural Infrastructure Line-Art Watermark */}
        <div 
          className="absolute inset-0 pointer-events-none select-none z-0 bg-no-repeat bg-cover bg-bottom opacity-[0.035] mix-blend-multiply filter grayscale contrast-125"
          style={{ backgroundImage: `url(${InfraSketchImg})` }}
          aria-hidden="true"
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14 items-start">
            
            {/* Left Column: Contact Information & Full-Width Map */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Contact Information
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Reach our engineering headquarters in Port Harcourt or engage directly via telephone, email, or WhatsApp.
                </p>
              </div>

              {/* Unified Cohesive Contact Details Card */}
              <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Office Address */}
                  <div className="sm:col-span-2 flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono block">Corporate Headquarters</span>
                      <address className="not-italic text-sm text-slate-800 leading-relaxed font-medium">
                        {officeAddress}
                      </address>
                    </div>
                  </div>

                  {/* Telephone */}
                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono block">Direct Telephone</span>
                      <div>
                        <a 
                          href={`tel:${phoneRaw}`} 
                          className="text-sm font-semibold text-slate-900 hover:text-emerald-700 transition-colors inline-block break-all"
                        >
                          {phoneNumber}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono block">Official Email</span>
                      <div>
                        <a 
                          href={`mailto:${emailAddress}`} 
                          className="text-sm font-semibold text-slate-900 hover:text-emerald-700 transition-colors inline-block break-all"
                        >
                          {emailAddress}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="sm:col-span-2 pt-3 border-t border-slate-200/80 flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono block">Operating Hours</span>
                      <p className="text-sm font-medium text-slate-800">
                        Monday to Friday, 8:00 AM – 5:00 PM (West Africa Time)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Contact Action Card */}
              <div className="bg-slate-900 text-white p-5 sm:p-6 border border-slate-800 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Direct WhatsApp</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Need quick technical feedback or project clarification?
                  </p>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-[#25D366] hover:bg-[#1ebc57] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 group cursor-pointer"
                  aria-label="Chat on WhatsApp with PIGL"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Full-Width Google Map Placement (16:10 Aspect Ratio) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold uppercase tracking-wider text-slate-500">
                    Office Location &amp; Directions
                  </span>
                  <a
                    href="https://maps.google.com/?q=Polaris+Consulting+Company,+Port+Harcourt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 font-bold text-emerald-800 hover:text-emerald-950 transition-colors group"
                    aria-label="Open PIGL location in Google Maps"
                  >
                    <span>Open in Google Maps</span>
                    <span className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">↗</span>
                  </a>
                </div>

                <div className="w-full aspect-[16/10] min-h-[300px] sm:min-h-[340px] bg-slate-100 relative overflow-hidden border border-slate-200/90 rounded-2xl shadow-xs">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.3045576956447!2d7.015744475813538!3d4.888581039998466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069cde9f8f0e54b%3A0x8a2d82f8aa14068f!2sPolaris%20Consulting%20Company!5e0!3m2!1sen!2sng!4v1770779327700!5m2!1sen!2sng"
                    className="w-full h-full border-0 absolute inset-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="PIGL Location Map"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Right Column: Contact & Project Enquiry Form */}
            <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-7 sm:p-9 md:p-10 shadow-xs">
              {status.type === 'success' ? (
                <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-300 shadow-xs text-emerald-800">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="space-y-3 max-w-lg">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Enquiry Submitted Successfully
                    </h3>
                    <p className="text-slate-600 font-medium leading-relaxed text-sm sm:text-base">
                      {status.message}
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus({ type: null, message: '' })}
                    className="px-8 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition-colors uppercase tracking-wider text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                      Send a Message
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Fill out the form below and an engineer will respond within one business day. Required fields are marked with an asterisk (<span className="text-red-600 font-bold">*</span>).
                    </p>
                  </div>

                  {status.type === 'error' && status.message && (
                    <div className="p-4 mb-6 flex items-start space-x-3 border bg-red-50 border-red-300 text-red-900 rounded-xl text-xs sm:text-sm">
                      <span className="text-base leading-none mt-0.5">⚠️</span>
                      <p className="font-medium">{status.message}</p>
                    </div>
                  )}

                  <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    {/* Name Field */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="contact-name"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono"
                      >
                        Full Name <span className="text-red-600 font-bold" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                          errors.name 
                            ? 'border-red-500 ring-1 ring-red-500' 
                            : 'border-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700'
                        }`}
                        placeholder="e.g. Engr. Chidi Okafor"
                        required
                        aria-required="true"
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-600 font-medium">{errors.name}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="contact-email"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono"
                      >
                        Email Address <span className="text-red-600 font-bold" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                          errors.email 
                            ? 'border-red-500 ring-1 ring-red-500' 
                            : 'border-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700'
                        }`}
                        placeholder="e.g. name@company.com"
                        required
                        aria-required="true"
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600 font-medium">{errors.email}</p>
                      )}
                    </div>
                    
                    {/* Honeypot field - Hidden from human users, catches spam bots */}
                    <div className="hidden" aria-hidden="true">
                      <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>
                    
                    {/* Message Field */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="contact-message"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono"
                      >
                        Your Message <span className="text-red-600 font-bold" aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                          errors.message 
                            ? 'border-red-500 ring-1 ring-red-500' 
                            : 'border-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700'
                        }`}
                        placeholder="Please describe your project location, scope, technical parameters or questions..."
                        required
                        aria-required="true"
                        aria-invalid={!!errors.message}
                      ></textarea>
                      {errors.message && (
                        <p className="text-xs text-red-600 font-medium">{errors.message}</p>
                      )}
                    </div>
                    
                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Sending Enquiry...</span>
                          </>
                        ) : (
                          <span>Send Technical Enquiry</span>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
