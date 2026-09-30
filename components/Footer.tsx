import React from 'react';
import LogoImg from '../assets/LOGO.png';
import ProfilePDF from '../assets/PIGL COMPANY PROFILE.pdf';
import { CONTACT_CONFIG } from '../site_data';
import Iso9001Img from '../assets/Q-Mark (ISO 9001).png';
import Iso45001Img from '../assets/Q-Mark (ISO 45001).png';
import InfraSketchImg from '../assets/infrastructure_sketch.jpg';
import { useEmailSubscribers, useNavigation, useSiteSettings } from '../hooks/useSupabaseData';

const Footer: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);
  const { addSubscriber } = useEmailSubscribers();
  const { navConfig } = useNavigation();
  const { settings } = useSiteSettings();

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Immediate state feedback for best-in-class UX latency
    setSubscribed(true);
    const submittedEmail = email;
    setEmail('');

    try {
      await addSubscriber({
        email: submittedEmail,
        source: 'newsletter',
        status: 'active',
        tags: ['Website Footer Subscriber']
      });
    } catch (err) {
      console.warn("Mailing subscription notification error:", err);
    }
    
    // Auto reset back to normal after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };
  return (
    <footer className="relative bg-slate-50 text-slate-900 pt-24 pb-12 border-t border-slate-200 font-sans print:hidden overflow-hidden">
      {/* Architectural Infrastructure Line-Art Backdrop */}
      <div 
        className="absolute inset-0 pointer-events-none select-none z-0 bg-no-repeat bg-cover bg-top opacity-10 sm:opacity-12 mix-blend-multiply filter contrast-125 brightness-95 transition-opacity duration-300 [mask-image:linear-gradient(to_bottom,black_0%,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_85%,transparent_100%)]"
        style={{ 
          backgroundImage: `url(${InfraSketchImg})`,
          backgroundPosition: 'center top'
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center">
              <img
                src={LogoImg}
                alt="Polaris Integrated & Geosolutions Logo"
                className="h-12 md:h-16 w-auto object-contain transition-all duration-500 hover:scale-105 hover:-translate-y-1 transform cursor-pointer"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="text-slate-600 leading-relaxed text-sm max-w-xs font-normal">
              Technical integrity for a safer energy future through high-fidelity engineering and geosolutions across Sub-Saharan Africa.
            </p>
            <div className="flex items-center space-x-4 pt-4">
              {/* ISO 9001 Tooltip */}
              <div className="group relative cursor-pointer">
                <img
                  src={Iso9001Img}
                  alt="ISO 9001:2015 Q-Mark"
                  className="h-14 md:h-18 w-auto object-contain opacity-90 hover:opacity-100 transition-all duration-500 hover:scale-105 hover:-translate-y-1 transform"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 rounded-lg bg-slate-900/95 backdrop-blur-sm px-3.5 py-2.5 text-center text-xs font-bold text-white shadow-xl opacity-0 scale-95 origin-bottom group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-50 border border-slate-700/50">
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-0.5">ISO 9001:2015</p>
                  <p className="text-slate-200 text-xs font-medium leading-tight">Quality Management Systems Certified</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95"></div>
                </div>
              </div>

              {/* ISO 45001 Tooltip */}
              <div className="group relative cursor-pointer">
                <img
                  src={Iso45001Img}
                  alt="ISO 45001:2018 Q-Mark"
                  className="h-14 md:h-18 w-auto object-contain opacity-90 hover:opacity-100 transition-all duration-500 hover:scale-105 hover:-translate-y-1 transform"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 rounded-lg bg-slate-900/95 backdrop-blur-sm px-3.5 py-2.5 text-center text-xs font-bold text-white shadow-xl opacity-0 scale-95 origin-bottom group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-50 border border-slate-700/50">
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-0.5">ISO 45001:2018</p>
                  <p className="text-slate-200 text-xs font-medium leading-tight">Occupational Health & Safety Certified</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95"></div>
                </div>
              </div>
            </div>
            <div className="pt-2 flex items-center space-x-3">
              <a href={settings?.linkedin_url || CONTACT_CONFIG.linkedin} target="_blank" rel="noopener noreferrer" aria-label="PIGL on LinkedIn" className="inline-flex items-center justify-center w-10 h-10 bg-slate-200 text-slate-600 hover:bg-emerald-600 hover:text-white transition-all rounded">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href={settings?.youtube_url || "https://www.youtube.com/@polarisigl"} target="_blank" rel="noopener noreferrer" aria-label="PIGL Official YouTube Channel" className="inline-flex items-center justify-center w-10 h-10 bg-slate-200 text-slate-600 hover:bg-red-600 hover:text-white transition-all rounded">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Dynamic Footer Columns */}
          {(navConfig?.footer?.columns && navConfig.footer.columns.length > 0
            ? navConfig.footer.columns.filter(c => c.is_active)
            : [
                {
                  id: 'fcol-capabilities',
                  title: 'Core Capabilities',
                  links: [
                    { id: '1', label: 'Ground Intelligence', href: '/services/ground-intelligence', is_active: true },
                    { id: '2', label: 'Digital Intelligence', href: '/services/digital-intelligence', is_active: true },
                    { id: '3', label: 'Integrated Engineering & Construction Solutions', href: '/services/integrated-engineering-construction', is_active: true },
                    { id: '4', label: 'Industrial & Environmental Technologies', href: '/services/industrial-environmental', is_active: true },
                    { id: '5', label: 'Offshore Intelligence', href: '/services/marine-intelligence', is_active: true },
                    { id: '6', label: 'Explore All Services', href: '/services', is_active: true },
                  ]
                },
                {
                  id: 'fcol-governance',
                  title: 'Company & Governance',
                  links: [
                    { id: '7', label: 'About Us', href: '/about', is_active: true },
                    { id: '8', label: 'Executed Projects & Case Studies', href: '/projects', is_active: true },
                    { id: '9', label: 'Strategic Partnerships', href: '/partners', is_active: true },
                    { id: '10', label: 'Corporate Video Hub', href: '/videos', is_active: true },
                    { id: '11', label: 'Technical Blog', href: '/blog', is_active: true },
                    { id: '12', label: 'HSSE & Quality Policy', href: '/hsse', is_active: true },
                    { id: '13', label: 'Careers at PIGL', href: '/careers', is_active: true },
                    { id: '14', label: 'Vendor Onboarding & Compliance', href: '/vendors', is_active: true },
                  ]
                }
              ]
          ).map((col) => (
            <div key={col.id}>
              <h4 className="text-sm font-bold mb-6 text-emerald-700 uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-3 text-slate-600 font-medium text-sm">
                {col.links.filter(l => l.is_active).map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target={link.is_external ? "_blank" : undefined}
                      rel={link.is_external ? "noopener noreferrer" : undefined}
                      className={link.label.includes('Explore All') ? "text-emerald-700 font-bold hover:text-emerald-800 transition-colors inline-flex items-center space-x-1" : "hover:text-emerald-700 transition-colors"}
                    >
                      <span>{link.label}</span>
                      {link.label.includes('Explore All') && <span>→</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-bold mb-6 text-emerald-700 uppercase tracking-wider">Direct Desks</h4>
            <address className="not-italic space-y-5">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Corporate Head Office</p>
                <p className="text-slate-600 text-sm font-medium leading-relaxed">
                  {settings?.address_short || CONTACT_CONFIG.addressShort}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Inquiries & Operations</p>
                <p className="text-slate-600 text-sm font-medium">
                  <a href={`tel:${settings?.phone_raw || CONTACT_CONFIG.phoneRaw}`} className="hover:text-emerald-700 transition-colors">
                    {settings?.phone || CONTACT_CONFIG.phone}
                  </a>
                </p>
                <p className="text-slate-600 text-sm font-medium">
                  <a href={`mailto:${settings?.email_info || CONTACT_CONFIG.emailInfo}`} className="hover:text-emerald-700 transition-colors">
                    {settings?.email_info || CONTACT_CONFIG.emailInfo}
                  </a>
                </p>
              </div>
              <div className="pt-2">
                <a
                  href={ProfilePDF}
                  download="PIGL_Company_Profile.pdf"
                  className="inline-flex items-center justify-center w-full px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Company Profile</span>
                </a>
              </div>
            </address>
          </div>
        </div>
        
        {/* Newsletter Signup */}
        <div className="border-t border-slate-200 py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-md">
            <h4 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Stay updated</h4>
            <p className="text-slate-600 text-sm font-normal">Receive our latest insights and project updates directly in your inbox.</p>
          </div>
          {subscribed ? (
            <div className="flex items-center space-x-3 text-emerald-800 bg-emerald-50 px-6 py-4 border border-emerald-200 animate-fade-in w-full lg:max-w-md">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-bold tracking-wide">Thank you! You have been successfully subscribed to our updates.</span>
            </div>
          ) : (
            <form className="flex flex-col sm:flex-row w-full lg:max-w-md gap-2 sm:gap-0" onSubmit={handleSubscribeSubmit}>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                className="flex-grow px-4 sm:px-6 py-3.5 sm:py-4 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 transition-colors text-base sm:text-sm font-semibold"
              />
              <button type="submit" className="px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-900 text-white font-bold text-sm hover:bg-emerald-600 transition-all text-center">
                Subscribe
              </button>
            </form>
          )}
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium text-center md:text-left gap-4 md:gap-0">
          <p>© {new Date().getFullYear()} Polaris Integrated & Geosolutions Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 sm:gap-x-8 gap-y-2 mt-4 md:mt-0">
            {(navConfig?.footer?.bottom_links && navConfig.footer.bottom_links.length > 0
              ? navConfig.footer.bottom_links.filter(l => l.is_active)
              : [
                  { id: '1', label: 'Vendor Portal', href: '/vendors', is_active: true },
                  { id: '2', label: 'Privacy Policy', href: '/contact', is_active: true },
                  { id: '3', label: 'Terms of Service', href: '/contact', is_active: true },
                  { id: '4', label: 'CMS Admin', href: '/admin', is_active: true },
                ]
            ).map((bLink) => (
              <a
                key={bLink.id}
                href={bLink.href}
                target={bLink.is_external ? "_blank" : undefined}
                rel={bLink.is_external ? "noopener noreferrer" : undefined}
                className={bLink.href === '/admin' ? "text-slate-400 hover:text-emerald-700 transition-colors flex items-center space-x-1.5" : "hover:text-emerald-700 transition-colors"}
              >
                {bLink.href === '/admin' && (
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                <span>{bLink.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
