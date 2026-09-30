import React, { useState, useEffect } from 'react';
import { PROJECTS } from '../site_data';
import { useProjects } from '../hooks/useSupabaseData';
import BrianImg from '../assets/management/brian.png';
import SteveImg from '../assets/management/steve.png';
import ProjectsBg from '../assets/slider.jpeg';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';

const InteractiveProjectCard: React.FC<{
  project: any;
  onExpand: () => void;
}> = ({ project, onExpand }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = React.useState('');
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale(1.01)`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.12s ease-out, box-shadow 0.2s ease-out' : 'transform 0.5s ease-out, box-shadow 0.5s ease-out',
      }}
      className="group border border-slate-200 bg-white flex flex-col hover:border-emerald-700/60 hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-64 overflow-hidden bg-slate-900">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      <div className="p-8 flex-grow flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              {project.category}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Client: {project.client || 'Energy Sector'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-4 tracking-tight group-hover:text-emerald-800 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
            {project.description}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <button
            onClick={onExpand}
            className="w-full py-3 bg-slate-50 hover:bg-emerald-800 text-slate-900 hover:text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center group/btn shadow-sm"
          >
            <span>Explore Technical Case Study</span>
            <span className="ml-2.5 transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const { projects: dynamicProjects, loading } = useProjects();
  const allProjects = dynamicProjects && dynamicProjects.length > 0 ? dynamicProjects : PROJECTS;

  const [filter, setFilter] = useState<'All' | 'Intelligence' | 'Solutions & Engineering' | 'Civil' | 'Pipeline'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredProjects = filter === 'All' ? allProjects : allProjects.filter(p => {
    if (filter === 'Intelligence') {
      return p.category === 'Geosolutions' || p.category === 'Intelligence';
    }
    if (filter === 'Solutions & Engineering') {
      return p.category === 'Integrated' || p.category === 'Solutions & Engineering';
    }
    return p.category === filter;
  });

  const categories: ('All' | 'Intelligence' | 'Solutions & Engineering' | 'Civil' | 'Pipeline')[] = [
    'All', 
    'Intelligence', 
    'Solutions & Engineering', 
    'Civil', 
    'Pipeline'
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
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
      
      const filterParam = params.get('filter');
      if (filterParam) {
        const validCategories = ['All', 'Intelligence', 'Solutions & Engineering', 'Civil', 'Pipeline'];
        if (validCategories.includes(filterParam)) {
          setFilter(filterParam as any);
        }
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate-changed', handleLocationChange);
    handleLocationChange(); // Run initially on mount

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate-changed', handleLocationChange);
    };
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
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={ProjectsBg} 
            alt="PIGL Executed Projects" 
            className="w-full h-full object-cover opacity-35 grayscale-[0.2]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-8">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <span className="text-white">Case studies</span>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
              Executed Projects & Field Case Studies
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-normal leading-relaxed">
              A showcase of engineering precision, 3D reality capture, and zero-incident delivery across complex Nigerian terrain.
            </p>
          </div>
        </div>

        {/* Continuous Reflective Energy Line at the base of the Hero & Breadcrumb section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine dark={true} />
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 md:py-24 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 font-bold text-xs uppercase tracking-wider transition-colors border ${
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
            {filteredProjects.map((project) => (
              <React.Fragment key={project.id}>
                <InteractiveProjectCard
                  project={project}
                  onExpand={() => toggleExpand(project.id)}
                />

                {/* Expanded Detailed Case Study View */}
                {expandedId === project.id && (
                  <div 
                    id={`case-study-${project.id}`}
                    className="lg:col-span-3 md:col-span-2 bg-white border border-slate-200 overflow-hidden animate-fade-in"
                  >
                    {/* Breadcrumbs */}
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-4">
                      <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <a href="/" className="hover:text-emerald-700">Home</a>
                        <span>/</span>
                        <a href="/projects" className="hover:text-emerald-700" onClick={(e) => { e.preventDefault(); setExpandedId(null); }}>Projects</a>
                        <span>/</span>
                        <span className="text-slate-900">{project.title}</span>
                      </nav>
                    </div>
                    <ReflectiveEnergyLine dark={false} />

                    {/* High-Fidelity Hero Section */}
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 lg:py-16 flex flex-col lg:flex-row gap-16 items-center">
                      <div className="lg:w-1/2 space-y-6">
                        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                          <span className="text-emerald-700">{project.category}</span>
                          <span>•</span>
                          <span>PIGL Engineering Case Study</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                          {project.title}
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
                          {project.description}
                        </p>
                      </div>
                      <div className="lg:w-1/2 relative group">
                        <div className="aspect-[4/3] overflow-hidden border border-slate-200">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        {/* Technical Tag Overlay */}
                        <div className="absolute -bottom-6 -left-6 bg-emerald-950 p-6 shadow-2xl hidden md:block">
                          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Execution Status</p>
                          <p className="text-white font-bold">Delivered With Zero LTI</p>
                        </div>
                      </div>
                    </div>

                    {/* Data Grid Summary Bar */}
                    <div className="border-t border-b border-slate-200 bg-slate-50">
                      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                          <div className="py-8 pr-6">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Operational Location</h4>
                            <p className="text-lg font-bold text-slate-900">{project.location || 'Nigeria'}</p>
                          </div>
                          <div className="py-8 px-6 lg:px-10">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Sector Discipline</h4>
                            <p className="text-lg font-bold text-slate-900">{project.category}</p>
                          </div>
                          <div className="py-8 pl-6 lg:pl-10">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Delivery Timeline</h4>
                            <p className="text-lg font-bold text-slate-900">{project.year || '2024'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Content Narrative */}
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-24">
                      <div className="flex flex-col lg:flex-row gap-16">
                        {/* Narrative Column */}
                        <div className="lg:w-2/3 space-y-16">
                          <section>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center">
                              <span className="w-8 h-[2px] bg-emerald-600 mr-4"></span>
                              The Operational Challenge
                            </h3>
                            <div className="text-lg text-slate-600 leading-relaxed font-normal space-y-4">
                              <p>{project.challenge || project.description}</p>
                            </div>
                          </section>

                          <section>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center">
                              <span className="w-8 h-[2px] bg-emerald-600 mr-4"></span>
                              The PIGL Technical Solution
                            </h3>
                            <div className="text-lg text-slate-600 leading-relaxed font-normal space-y-4">
                              <p>{project.solution || project.scope}</p>
                              {project.equipment && (
                                <div className="mt-8 p-8 bg-slate-50 border-l-4 border-emerald-600">
                                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Deployed Instrumentation & Technology:</h4>
                                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {project.equipment.map((item, i) => (
                                      <li key={i} className="flex items-center text-slate-700 text-sm font-bold">
                                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-3"></span>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </section>

                          <section>
                            <div className="bg-emerald-950 p-10 md:p-14 text-white relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16"></div>
                              <h3 className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Measured Result & Client Impact</h3>
                              <p className="text-2xl md:text-3xl font-bold leading-tight tracking-tight italic relative z-10">
                                "{project.results || 'High-fidelity technical deliverables executed with 100% compliance and zero safety incidents.'}"
                              </p>
                              <div className="mt-8 flex items-center space-x-3">
                                <div className="w-10 h-10 bg-emerald-600 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="font-bold text-xs tracking-wider uppercase">ISO 9001:2015 & ISO 45001:2018 Standards Verified</span>
                              </div>
                            </div>
                          </section>
                        </div>

                        {/* Expert Sidebar */}
                        <div className="lg:w-1/3">
                          <div className="sticky top-32 space-y-8">
                            <div className="bg-white border border-slate-200 p-8 shadow-sm">
                              <h4 className="text-lg font-bold text-slate-900 mb-6">Discuss a Similar Scope</h4>
                              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-100">
                                <img 
                                  src={project.id === 'p3' ? BrianImg : SteveImg} 
                                  alt="PIGL Engineering Lead" 
                                  className="w-16 h-16 object-cover grayscale"
                                  loading="lazy"
                                  decoding="async"
                                />
                                <div>
                                  <p className="font-bold text-slate-900">{project.id === 'p3' ? "Brian Akpotowo" : "Steve Ubani"}</p>
                                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider pt-0.5">
                                    {project.id === 'p3' ? "Head, Reality Capture" : "Head, Field Operations"}
                                  </p>
                                </div>
                              </div>
                              <p className="text-slate-600 mb-6 text-sm leading-relaxed font-normal">
                                Connect directly with our engineering team in Port Harcourt to scope your project.
                              </p>
                              <a 
                                href="/contact" 
                                className="block w-full py-3.5 bg-emerald-700 text-white text-center text-xs font-black uppercase tracking-wider hover:bg-emerald-800 transition-colors"
                              >
                                Request Technical Consultation
                              </a>
                            </div>

                            <div className="p-8 bg-slate-900 text-white">
                              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">Core Capabilities</h4>
                              <ul className="space-y-3">
                                <li>
                                  <a href="/services/digital-intelligence" className="text-sm font-bold hover:text-emerald-400 transition-colors flex items-center justify-between group">
                                    Digital Intelligence <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                  </a>
                                </li>
                                <li>
                                  <a href="/services/marine-intelligence" className="text-sm font-bold hover:text-emerald-400 transition-colors flex items-center justify-between group">
                                    Marine Intelligence <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                  </a>
                                </li>
                                <li>
                                  <a href="/services/asset-integrity-management" className="text-sm font-bold hover:text-emerald-400 transition-colors flex items-center justify-between group">
                                    Asset Integrity & Management <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Back Action */}
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 border-t border-slate-100 flex justify-center">
                      <button 
                        onClick={() => {
                          setExpandedId(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} 
                        className="px-8 py-3.5 border-2 border-slate-900 text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                      >
                        ← Back to Project Grid
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
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-sm mb-4 block">Client & Institutional Endorsements</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Institutional Confidence</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white p-10 md:p-12 border border-slate-200 shadow-sm relative">
              <div className="text-5xl text-emerald-700 opacity-20 font-serif absolute top-8 left-8">“</div>
              <p className="text-xl text-slate-700 mb-8 leading-relaxed font-light relative z-10 pt-6">
                "Polaris is one indigenous company we are proud to partner. We are excited with their contributions to local content development."
              </p>
              <div className="flex items-center space-x-4 border-t border-slate-100 pt-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">SW</div>
                <div>
                  <p className="font-bold text-slate-900">Engr. Simbi Wabote</p>
                  <p className="text-xs text-slate-500 font-medium">Former Executive Secretary, NCDMB</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-10 md:p-12 border border-slate-200 shadow-sm relative">
              <div className="text-5xl text-emerald-700 opacity-20 font-serif absolute top-8 left-8">“</div>
              <p className="text-xl text-slate-700 mb-8 leading-relaxed font-light relative z-10 pt-6">
                "I am happy with your growth and innovations to the Energy Industry. Keep it up and maintain the quality standards."
              </p>
              <div className="flex items-center space-x-4 border-t border-slate-100 pt-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">TS</div>
                <div>
                  <p className="font-bold text-slate-900">Chief Timipre Sylva</p>
                  <p className="text-xs text-slate-500 font-medium">Former Minister of State for Petroleum Resources</p>
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
