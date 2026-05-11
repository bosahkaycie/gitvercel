import React, { useState, useEffect } from 'react';
import { PROJECTS } from '../site_data';
import BrianImg from '../assets/management/brian.png';
import SteveImg from '../assets/management/steve.png';

const Projects: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Integrated' | 'Geosolutions' | 'Civil' | 'Pipeline'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredProjects = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter);
  const categories: ('All' | 'Integrated' | 'Geosolutions' | 'Civil' | 'Pipeline')[] = ['All', 'Integrated', 'Geosolutions', 'Civil', 'Pipeline'];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const id = params.get('id');
    if (id) {
      setExpandedId(id);
      setTimeout(() => {
        const element = document.getElementById(`case-study-${id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, []);

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
  }, [filter]);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      
      {/* Clean Hero Header */}
      <section className="bg-slate-50 pt-32 pb-16 md:pt-40 md:pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-500 mb-8 tracking-wide">
            <a href="#/" className="hover:text-emerald-700 transition-colors">Home</a>
            <span>/</span>
            <span className="text-emerald-700">Case studies</span>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight mb-8">
              Executed Projects
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-normal leading-relaxed">
              A showcase of operational excellence, precision engineering, and safety-first delivery across the Nigerian energy landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 md:py-24 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 font-bold text-sm transition-colors border ${
                  filter === cat
                    ? 'bg-emerald-950 text-white border-emerald-950'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-700 hover:text-emerald-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project, idx) => (
              <React.Fragment key={project.id}>
                {/* Standard Card View */}
                {expandedId !== project.id && (
                  <div 
                    className="group border border-slate-200 bg-white flex flex-col"
                  >
                    <div className="relative h-64 overflow-hidden bg-slate-100">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors pointer-events-none" />
                    </div>
                    
                    <div className="p-8 flex-grow flex flex-col">
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest mb-3">
                        {project.category}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-6 tracking-tight">
                        {project.title}
                      </h3>
                      
                      <div className="mt-auto">
                        <button
                          onClick={() => {
                            setExpandedId(project.id);
                            setTimeout(() => {
                              document.getElementById(`case-study-${project.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                          }}
                          className="font-bold text-slate-900 hover:text-emerald-700 transition-all inline-flex items-center group/btn"
                        >
                          Explore case study
                          <span className="ml-3 transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}                {/* Expanded Detailed Case Study View (Exact Fugro.com Style) */}
                {expandedId === project.id && (
                  <div 
                    id={`case-study-${project.id}`}
                    className="lg:col-span-3 md:col-span-2 bg-white overflow-hidden animate-fade-in"
                  >
                    {/* Breadcrumbs */}
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-4">
                      <nav className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        <a href="#/" className="hover:text-emerald-700">Home</a>
                        <span>/</span>
                        <a href="#/projects" className="hover:text-emerald-700" onClick={(e) => { e.preventDefault(); setExpandedId(null); }}>Projects</a>
                        <span>/</span>
                        <span className="text-slate-900">{project.title}</span>
                      </nav>
                    </div>

                    {/* High-Fidelity Hero Section */}
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 lg:py-20 flex flex-col lg:flex-row gap-16 items-center">
                      <div className="lg:w-1/2 space-y-8">
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest">
                            {project.category === 'Pipeline' ? 'Energy' : project.category === 'Civil' ? 'Infrastructure' : 'Asset Integrity'}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Case Study</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                          {project.title}
                        </h2>
                        <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-2xl">
                          {project.description}
                        </p>
                      </div>
                      <div className="lg:w-1/2 relative group">
                        <div className="aspect-[4/3] overflow-hidden border border-slate-200">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                        </div>
                        {/* Technical Tag Overlay */}
                        <div className="absolute -bottom-6 -left-6 bg-emerald-950 p-6 shadow-2xl hidden md:block">
                          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                          <p className="text-white font-bold">Successfully Completed</p>
                        </div>
                      </div>
                    </div>

                    {/* Data Grid Summary Bar */}
                    <div className="border-t border-b border-slate-200 bg-white">
                      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200">
                          <div className="py-10 pr-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Client</h4>
                            <p className="text-lg font-bold text-slate-900">{project.client}</p>
                          </div>
                          <div className="py-10 px-6 lg:px-10">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Location</h4>
                            <p className="text-lg font-bold text-slate-900">{project.location || 'Nigeria'}</p>
                          </div>
                          <div className="py-10 px-6 lg:px-10">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Sector</h4>
                            <p className="text-lg font-bold text-slate-900">{project.category}</p>
                          </div>
                          <div className="py-10 pl-6 lg:pl-10">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Year</h4>
                            <p className="text-lg font-bold text-slate-900">{project.year || '2024'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Content Narrative */}
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-32">
                      <div className="flex flex-col lg:flex-row gap-20">
                        {/* Narrative Column */}
                        <div className="lg:w-2/3 space-y-24">
                          <section>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center">
                              <span className="w-8 h-[2px] bg-emerald-600 mr-4"></span>
                              The Challenge
                            </h3>
                            <div className="text-xl text-slate-600 leading-relaxed font-normal space-y-6">
                              <p>{project.challenge || project.description}</p>
                            </div>
                          </section>

                          <section>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center">
                              <span className="w-8 h-[2px] bg-emerald-600 mr-4"></span>
                              The Solution
                            </h3>
                            <div className="text-xl text-slate-600 leading-relaxed font-normal space-y-6">
                              <p>{project.solution || project.scope}</p>
                              {project.equipment && (
                                <div className="mt-10 p-8 bg-slate-50 border-l-4 border-emerald-600">
                                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Deployed Technology</h4>
                                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.equipment.map((item, i) => (
                                      <li key={i} className="flex items-center text-slate-700 text-base font-bold">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3"></span>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </section>

                          <section>
                            <div className="bg-emerald-950 p-12 md:p-20 text-white relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16"></div>
                              <h3 className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-8">Key Result</h3>
                              <p className="text-3xl md:text-5xl font-black leading-tight tracking-tighter italic relative z-10">
                                "{project.results || 'Operational excellence delivered with zero safety incidents.'}"
                              </p>
                              <div className="mt-12 flex items-center space-x-4">
                                <div className="w-12 h-12 bg-emerald-600 flex items-center justify-center rounded-full">
                                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="font-bold text-sm tracking-wide uppercase">ISO 9001:2015 Quality Standards met</span>
                              </div>
                            </div>
                          </section>
                        </div>

                        {/* Expert Sidebar */}
                        <div className="lg:w-1/3">
                          <div className="sticky top-32 space-y-10">
                            <div className="bg-white border border-slate-200 p-8">
                              <h4 className="text-xl font-black text-slate-900 mb-6">Talk to an expert</h4>
                              <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-slate-100">
                                <img 
                                  src={project.id === 'p3' ? BrianImg : SteveImg} 
                                  alt="Expert" 
                                  className="w-20 h-20 object-cover rounded-none grayscale"
                                />
                                <div>
                                  <p className="font-black text-slate-900">{project.id === 'p3' ? "Brian Akpotowo" : "Steve Ubani"}</p>
                                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest pt-1">
                                    {project.id === 'p3' ? "Head, Reality Capture" : "Head, Field Operations"}
                                  </p>
                                </div>
                              </div>
                              <p className="text-slate-600 mb-8 text-sm leading-relaxed">
                                Our specialists are ready to discuss how we can apply high-fidelity Geo-data to your specific project challenges.
                              </p>
                              <a 
                                href="#/contact" 
                                className="block w-full py-4 bg-emerald-700 text-white text-center text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-800 transition-colors"
                              >
                                Get in touch
                              </a>
                            </div>

                            <div className="p-8 bg-slate-900 text-white">
                              <h4 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-4">Related Services</h4>
                              <ul className="space-y-4">
                                <li>
                                  <a href="#/services" className="text-base font-bold hover:text-emerald-400 transition-colors flex items-center justify-between group">
                                    Reality Capture <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#/services" className="text-base font-bold hover:text-emerald-400 transition-colors flex items-center justify-between group">
                                    Marine Survey <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#/services" className="text-base font-bold hover:text-emerald-400 transition-colors flex items-center justify-between group">
                                    Asset Integrity <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Back Action */}
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 border-t border-slate-100 flex justify-center">
                      <button 
                        onClick={() => {
                          setExpandedId(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} 
                        className="px-10 py-4 border-2 border-slate-900 text-slate-900 font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                      >
                        Back to project overview
                      </button>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20 border border-slate-200 bg-slate-50">
              <p className="text-slate-500 text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-slate-50 border-t border-slate-200 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-sm mb-4 block">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Voice of our Partners</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white p-10 md:p-12 border border-slate-200 shadow-sm relative">
              <div className="text-5xl text-emerald-700 opacity-20 font-serif absolute top-8 left-8">“</div>
              <p className="text-xl md:text-2xl text-slate-700 mb-10 leading-relaxed font-light relative z-10 pt-8">
                "Polaris is one indigenous company we are proud to partner. We are excited with their contributions to local content development."
              </p>
              <div className="flex items-center space-x-4 border-t border-slate-100 pt-6">
                <div className="w-12 h-12 bg-slate-100 text-slate-600 flex items-center justify-center font-bold">SW</div>
                <div>
                  <p className="font-bold text-slate-900">Engr. Simbi Wobote</p>
                  <p className="text-sm text-slate-500 font-medium">Executive Secretary NCDMB</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-10 md:p-12 border border-slate-200 shadow-sm relative">
              <div className="text-5xl text-emerald-700 opacity-20 font-serif absolute top-8 left-8">“</div>
              <p className="text-xl md:text-2xl text-slate-700 mb-10 leading-relaxed font-light relative z-10 pt-8">
                "I am happy with your growth and innovations to the Energy Industry. Keep it up and maintain the quality standards."
              </p>
              <div className="flex items-center space-x-4 border-t border-slate-100 pt-6">
                <div className="w-12 h-12 bg-slate-100 text-slate-600 flex items-center justify-center font-bold">TS</div>
                <div>
                  <p className="font-bold text-slate-900">Hon. Timipre Sylvia</p>
                  <p className="text-sm text-slate-500 font-medium">Minister of Petroleum</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
