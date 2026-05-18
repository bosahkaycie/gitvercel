import React, { useEffect } from 'react';
import { ASSETS } from '../site_data';
import NewsBg from '../assets/IMG_6614.jpg';


const News: React.FC = () => {
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

    // Inject SociableKIT script
    const script = document.createElement('script');
    script.src = "https://widgets.sociablekit.com/linkedin-page-posts/widget.js";
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      observer.disconnect();
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col bg-white font-sans">
      
      {/* Hero Section - Fugro Style */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={NewsBg} 
            alt="News Background" 
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
            <span className="text-white">News & Insights</span>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
              Latest Developments
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-normal leading-relaxed">
              Stay updated on our 20-year journey of technical excellence, project milestones, and innovations in the African energy sector.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Sub-Navigation */}
      <div className="w-full bg-white border-b border-slate-200 sticky top-16 md:top-[72px] z-30 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-14">
          <span className="sub-nav-font font-bold text-slate-800 mr-8 whitespace-nowrap">Jump to</span>
          <div className="flex items-center space-x-8">
            {['Highlights', 'Latest news', 'LinkedIn Feed', 'Heritage'].map((item) => (
              <button 
                key={item}
                onClick={() => {
                  const id = item.toLowerCase().replace(' ', '-');
                  const element = document.getElementById(id);
                  if (element) {
                    const yOffset = -120; // Adjust for sticky header
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="sub-nav-font text-slate-600 hover:text-emerald-700 transition-colors whitespace-nowrap"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Feed Section */}
      <section className="py-20 md:py-32 bg-white reveal" id="highlights">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-end mb-16">
            <div className="max-w-2xl">
              <span className="text-emerald-700 font-bold uppercase tracking-widest text-xs mb-4 block">Our Voice</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight" id="latest-news">Highlights & News</h2>
            </div>
            <div className="hidden md:block">
              <a 
                href="https://www.linkedin.com/company/polarisigl/" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center space-x-3 px-6 py-3 border border-slate-200 font-bold text-slate-800 hover:border-emerald-700 hover:text-emerald-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                <span>Follow on LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Varied News Grid - Fugro Inspired */}
          {/* SociableKIT Widget Container */}
          <div className="min-h-[800px] w-full bg-slate-50 border border-slate-100 p-4 md:p-8">
            <div className="sk-ww-linkedin-page-post" data-embed-id="25680745"></div>
          </div>
        </div>
      </section>

      {/* Heritage Section - 20 Years */}
      <section className="py-24 md:py-40 bg-slate-50 border-t border-slate-200 reveal" id="heritage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-emerald-700 font-bold uppercase tracking-widest text-xs mb-4 block">Our Heritage</span>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter mb-8 leading-tight">
                Two Decades of <br /> Engineering Impact.
              </h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-normal">
                <p>
                  Since our inception in 2004, Polaris Integrated and GeoSolutions Limited has evolved from a specialist surveying firm into a multi-disciplinary engineering leader.
                </p>
                <p>
                  Our legacy is built on the success of hundreds of complex projects delivered for global energy leaders, always maintaining our commitment to indigenous talent development and world-class quality standards.
                </p>
              </div>
              <div className="mt-12 flex flex-wrap gap-8">
                <div>
                  <p className="text-4xl font-bold text-slate-900 tracking-tighter">20+</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 mt-2">Years of Excellence</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-slate-900 tracking-tighter">100%</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 mt-2">Indigenous Content</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-slate-900 tracking-tighter">0</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 mt-2">LTI Record</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-slate-200 overflow-hidden border border-slate-300">
                <img 
                  src={ASSETS.team} 
                  alt="Heritage Work" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 border border-slate-200 shadow-xl hidden md:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-2">Established</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">Port Harcourt, 2004</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Widget - Fugro Inspired */}
      <section className="bg-emerald-950 py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">Subscribe to our news alerts</h2>
          <p className="text-emerald-100/60 mb-10 text-lg font-normal">
            Be the first to receive technical insights, project updates, and company announcements.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-emerald-100/30 focus:outline-none focus:border-emerald-500 rounded-none transition-colors"
            />
            <button className="px-10 py-4 bg-white text-emerald-950 font-black text-sm uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
              Sign up now
            </button>
          </form>
          <p className="mt-6 text-[10px] text-emerald-100/30 uppercase tracking-[0.2em] font-medium">
            By subscribing you agree to our privacy policy.
          </p>
        </div>
      </section>

    </div>
  );
};

export default News;
