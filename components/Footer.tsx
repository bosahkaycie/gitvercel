import React from 'react';
import LogoImg from '../assets/LOGO.png';
import ProfilePDF from '../assets/PIGL COMPANY PROFILE.pdf';

const Footer: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    
    // Auto reset back to normal after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };
  return (
    <footer className="bg-slate-50 text-slate-900 pt-24 pb-12 border-t border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center">
              <img
                src={LogoImg}
                alt="Polaris Integrated & Geosolutions Logo"
                className="h-10 md:h-12 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="text-slate-600 leading-relaxed text-sm max-w-xs font-normal">
              Technical integrity for a safer energy future through high-fidelity engineering and geosolutions across Sub-Saharan Africa.
            </p>
            <div className="pt-2">
              <a href="https://www.linkedin.com/company/polarisigl/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 bg-slate-200 text-slate-600 hover:bg-emerald-600 hover:text-white transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 text-emerald-700">Our Expertise</h4>
            <ul className="space-y-3 text-slate-600 font-semibold text-[13px]">
              <li><a href="#/services" className="hover:text-emerald-700 transition-colors">3D Reality Capture & Laser Scanning</a></li>
              <li><a href="#/services" className="hover:text-emerald-700 transition-colors">Geosolutions</a></li>
              <li><a href="#/services" className="hover:text-emerald-700 transition-colors">Pipeline Integrity</a></li>
              <li><a href="#/services" className="hover:text-emerald-700 transition-colors">Integrated Projects</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 text-emerald-700">Company</h4>
            <ul className="space-y-3 text-slate-600 font-semibold text-[13px]">
              <li><a href="#/about" className="hover:text-emerald-700 transition-colors">About Us</a></li>
              <li><a href="#/projects" className="hover:text-emerald-700 transition-colors">Our Projects</a></li>
              <li><a href="#/news" className="hover:text-emerald-700 transition-colors">News & Insights</a></li>
              <li><a href="#/hsse" className="hover:text-emerald-700 transition-colors">HSSE & Quality</a></li>
              <li><a href="#/careers" className="hover:text-emerald-700 transition-colors">Careers</a></li>
              <li><a href="#/contact" className="hover:text-emerald-700 transition-colors">Contact</a></li>
              <li><a href={ProfilePDF} download="PIGL_Company_Profile.pdf" className="hover:text-emerald-700 transition-colors text-emerald-600">Download Company Profile</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 text-emerald-700">Connect</h4>
            <address className="not-italic space-y-5">
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-slate-400">Office</p>
                <p className="text-slate-600 text-[13px] font-semibold leading-relaxed">
                  #3, Diamond Close, Port Harcourt,<br />
                  Rivers State, Nigeria
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-slate-400">Direct</p>
                <p className="text-slate-600 text-[13px] font-semibold">+234-(0) 809 7081 333</p>
                <p className="text-slate-600 text-[13px] font-semibold">info@polarisigl.com</p>
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
            <form className="flex w-full lg:max-w-md" onSubmit={handleSubscribeSubmit}>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                className="flex-grow px-6 py-4 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 transition-colors text-sm font-semibold"
              />
              <button type="submit" className="px-8 py-4 bg-slate-900 text-white font-bold text-sm hover:bg-emerald-600 transition-all">
                Subscribe
              </button>
            </form>
          )}
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Polaris Integrated & Geosolutions Ltd. All rights reserved.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <a href="#/contact" className="hover:text-emerald-700 transition-colors">Privacy Policy</a>
            <a href="#/contact" className="hover:text-emerald-700 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
