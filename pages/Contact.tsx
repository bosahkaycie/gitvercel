import React from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    service: 'Geosolutions Services',
    message: '',
    website: '' // Honeypot field
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [errors, setErrors] = React.useState<{ [key: string]: boolean }>({});

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const job = params.get('job');
    if (job) {
      setFormData(prev => ({ ...prev, service: job }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  React.useEffect(() => {
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
    const newErrors: { [key: string]: boolean } = {};
    if (!formData.name) newErrors.name = true;
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = true;
    if (!formData.message) newErrors.message = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setStatus({ type: 'error', message: 'Please fix the highlighted errors before submitting.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulated success
      setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully. We will get back to you shortly.' });
      setFormData({ name: '', email: '', service: 'Geosolutions Services', message: '', website: '' }); // Reset form
    } catch (error) {
      console.error('Submission error:', error);
      setStatus({ type: 'error', message: 'Something went wrong. Please try again later or contact us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      
      {/* Clean Hero Header */}
      <section className="bg-slate-50 pt-32 pb-16 md:pt-40 md:pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">
            <a href="#/" className="hover:text-emerald-700 transition-colors">Home</a>
            <span>/</span>
            <span className="text-slate-900">Contact</span>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight mb-8">
              Connect With Us
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-normal leading-relaxed">
              Ready to start your next project? Get in touch with our experts.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-white flex-grow reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Headquarters</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-6 bg-slate-50 p-6 border border-slate-200">
                    <div className="text-2xl">📍</div>
                    <address className="not-italic text-lg text-slate-700 leading-relaxed font-medium">
                      #3, Diamond Close, Castle & Green Estate,<br />
                      Off Eneka Link Road, Port Harcourt,<br />
                      Rivers State, Nigeria
                    </address>
                  </div>
                  
                  <div className="flex items-start space-x-6 bg-slate-50 p-6 border border-slate-200">
                    <div className="text-2xl">📞</div>
                    <div className="text-lg text-slate-700 font-medium">
                      <p>+234-(0) 809 7081 333</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-6 bg-slate-50 p-6 border border-slate-200">
                    <div className="text-2xl">📧</div>
                    <div className="text-lg text-slate-700 font-medium">
                      <p>info@polarisigl.com</p>
                      <p>support@polarisigl.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="w-full h-80 bg-slate-100 relative overflow-hidden border border-slate-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.3045576956447!2d7.015744475813538!3d4.888581039998466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069cde9f8f0e54b%3A0x8a2d82f8aa14068f!2sPolaris%20Consulting%20Company!5e0!3m2!1sen!2sng!4v1770779327700!5m2!1sen!2sng"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="PIGL Location Map"
                ></iframe>
              </div>
            </div>

            {/* Form */}
            <div className="bg-slate-50 p-8 md:p-12 border border-slate-200">
              <h3 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Send a Message</h3>

              {status.message && (
                <div className={`p-6 mb-8 flex items-center space-x-4 border ${status.type === 'success'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                  : 'bg-red-50 border-red-500 text-red-900'
                  }`}>
                  <span className="text-xl">
                    {status.type === 'success' ? '✅' : '⚠️'}
                  </span>
                  <p className="font-bold text-sm tracking-wide">{status.message}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase tracking-wider ${errors.name ? 'text-red-600' : 'text-slate-700'}`}>
                      Full Name {errors.name && '*'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => {
                        handleChange(e);
                        if (errors.name) setErrors({ ...errors, name: false });
                      }}
                      className={`w-full px-6 py-4 bg-white border outline-none transition-colors ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700'
                        }`}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase tracking-wider ${errors.email ? 'text-red-600' : 'text-slate-700'}`}>
                      Email Address {errors.email && '*'}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => {
                        handleChange(e);
                        if (errors.email) setErrors({ ...errors, email: false });
                      }}
                      className={`w-full px-6 py-4 bg-white border outline-none transition-colors ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700'
                        }`}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                
                {/* Honeypot field - Hidden from humans, bots will fill it */}
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
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Service Required</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white border border-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-colors appearance-none"
                  >
                    <option>Geosolutions Services</option>
                    <option>Integrated Services</option>
                    <option>Pipeline Construction</option>
                    <option>Civil Works</option>
                    <option>Other Enquiry</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${errors.message ? 'text-red-600' : 'text-slate-700'}`}>
                    Your Message {errors.message && '*'}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.message) setErrors({ ...errors, message: false });
                    }}
                    className={`w-full px-6 py-4 bg-white border outline-none transition-colors h-40 ${errors.message ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700'
                      }`}
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 bg-emerald-950 text-white font-bold hover:bg-emerald-800 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
