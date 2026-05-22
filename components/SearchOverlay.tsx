import React, { useState, useEffect, useRef } from 'react';
import { SERVICES, PROJECTS, TEAM } from '../site_data';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  title: string;
  description: string;
  category: 'Services' | 'Projects' | 'Team' | 'Pages';
  link: string;
  badgeColor: string;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeResultIndex, setActiveResultIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Toggle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
      setActiveResultIndex(-1);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle keyboard events (Esc to close, Arrow keys to navigate, Enter to select)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveResultIndex(prev => {
          const next = prev < results.length - 1 ? prev + 1 : prev;
          scrollToActiveItem(next);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveResultIndex(prev => {
          const next = prev > 0 ? prev - 1 : 0;
          scrollToActiveItem(next);
          return next;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeResultIndex >= 0 && activeResultIndex < results.length) {
          handleSelectResult(results[activeResultIndex].link);
        } else if (results.length > 0) {
          handleSelectResult(results[0].link);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, activeResultIndex]);

  // Scroll active item into view inside results container
  const scrollToActiveItem = (index: number) => {
    if (!resultsContainerRef.current) return;
    const items = resultsContainerRef.current.querySelectorAll('.search-result-item');
    const activeItem = items[index] as HTMLElement;
    if (activeItem) {
      activeItem.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  };

  // Perform search matching
  const performSearch = (searchVal: string) => {
    if (!searchVal.trim()) {
      setResults([]);
      return;
    }

    const terms = searchVal.toLowerCase().split(/\s+/).filter(Boolean);
    const matchesTerms = (text: string) => {
      return terms.every(term => text.toLowerCase().includes(term));
    };

    const searchResults: SearchResult[] = [];

    // 1. Search Services
    SERVICES.forEach(service => {
      const matchText = `${service.title} ${service.description} ${service.items.join(' ')}`;
      if (matchesTerms(matchText)) {
        searchResults.push({
          title: service.title,
          description: service.description,
          category: 'Services',
          link: `#/services/detail?id=${service.id}`,
          badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-100'
        });
      }
    });

    // 2. Search Projects
    PROJECTS.forEach(project => {
      const matchText = `${project.title} ${project.description} ${project.category} ${project.location} ${project.scope || ''}`;
      if (matchesTerms(matchText)) {
        searchResults.push({
          title: project.title,
          description: project.description,
          category: 'Projects',
          link: `#/projects?id=${project.id}`,
          badgeColor: 'bg-orange-50 text-orange-800 border border-orange-100'
        });
      }
    });

    // 3. Search Team Members
    TEAM.forEach(member => {
      const matchText = `${member.name} ${member.role}`;
      if (matchesTerms(matchText)) {
        searchResults.push({
          title: member.name,
          description: `Executive Management | ${member.role}`,
          category: 'Team',
          link: `#/about`,
          badgeColor: 'bg-blue-50 text-blue-800 border border-blue-100'
        });
      }
    });

    // 4. Static Pages / Information Content
    const staticPages = [
      {
        title: 'Careers & Recruiting at PIGL',
        description: 'Explore active jobs, internships, graduate programs, and apply to join our world-class engineering team.',
        matchText: 'careers jobs join team hiring application internships positions next gen recruiting vacancies work',
        link: '#/careers'
      },
      {
        title: 'HSSE & Quality Assurance',
        description: 'Learn about our 100% safety commitment, ISO 9001, 14001, and 45001 certified management systems, and Stop Work Authority.',
        matchText: 'safety hsse health security environment quality iso certification stop work qa qc compliance policy standards excellence',
        link: '#/hsse'
      },
      {
        title: 'Contact Information & Offices',
        description: 'Get in touch for consultations, project estimates, or locate our corporate offices in Port Harcourt, Rivers State.',
        matchText: 'contact phone email address location port harcourt inquiry consult quotation support office map office address',
        link: '#/contact'
      },
      {
        title: 'About PIGL, Mission & Core Values',
        description: 'Discover our 20-year history of technical excellence, our core values of professionalism, innovation, integrity, and safety.',
        matchText: 'about heritage history values ceo executive ceo management leaders mission vision corporate profiles leadership 20 years',
        link: '#/about'
      },
      {
        title: 'News, Press Releases & Corporate Heritage',
        description: 'Stay updated on project milestones, press releases, technology features, and corporate announcements.',
        matchText: 'news media press releases articles linkedin posts insights updates milestones highlights',
        link: '#/news'
      }
    ];

    staticPages.forEach(page => {
      if (matchesTerms(`${page.title} ${page.description} ${page.matchText}`)) {
        searchResults.push({
          title: page.title,
          description: page.description,
          category: 'Pages',
          link: page.link,
          badgeColor: 'bg-slate-100 text-slate-800 border border-slate-200'
        });
      }
    });

    setResults(searchResults);
    setActiveResultIndex(-1);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    performSearch(val);
  };

  const handleSelectResult = (link: string) => {
    onClose();
    window.location.hash = link;

    // Trigger hashchange listener logic immediately
    const event = new HashChangeEvent('hashchange');
    window.dispatchEvent(event);
  };

  const handleTrendingClick = (term: string) => {
    if (term.startsWith('#/')) {
      handleSelectResult(term);
    } else {
      setQuery(term);
      inputRef.current?.focus();
      performSearch(term);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-slate-950/20 backdrop-blur-[2px] flex justify-center items-start pt-[12vh] px-4 transition-all duration-300 animate-fade-in"
      onClick={onClose}
    >
      {/* Spotlight Window Card */}
      <div 
        className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside Spotlight
      >
        
        {/* Search Header Input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100">
          <svg className="w-5 h-5 text-emerald-800 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Spotlight Search..."
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-[17px] font-normal focus:outline-none"
          />
          
          <div className="flex items-center space-x-1.5 ml-2">
            {query && (
              <button 
                onClick={() => { setQuery(''); setResults([]); }}
                className="text-slate-400 hover:text-slate-650 p-1"
                aria-label="Clear text"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 border border-slate-200/85 px-1.5 py-0.5 rounded bg-slate-50">ESC</span>
          </div>
        </div>

        {/* Results Container */}
        <div 
          ref={resultsContainerRef}
          className="overflow-y-auto max-h-[380px] custom-scrollbar"
        >
          {query.trim() === '' ? (
            /* Popular Suggestions State */
            <div className="p-5 animate-fade-in">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">Popular Searches</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleTrendingClick('3D Laser Scanning')}
                  className="flex items-center space-x-3 bg-white hover:bg-slate-50 border border-slate-150 p-3 rounded-lg transition-all duration-300 hover-lift text-left shadow-sm"
                >
                  <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full"></span>
                  <span className="text-[13px] text-slate-700 font-bold">3D Laser Scanning</span>
                </button>
                <button
                  onClick={() => handleTrendingClick('Pipeline Integrity')}
                  className="flex items-center space-x-3 bg-white hover:bg-slate-50 border border-slate-150 p-3 rounded-lg transition-all duration-300 hover-lift text-left shadow-sm"
                >
                  <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                  <span className="text-[13px] text-slate-700 font-bold">Pipeline Integrity</span>
                </button>
                <button
                  onClick={() => handleTrendingClick('#/careers')}
                  className="flex items-center space-x-3 bg-white hover:bg-slate-50 border border-slate-150 p-3 rounded-lg transition-all duration-300 hover-lift text-left shadow-sm"
                >
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  <span className="text-[13px] text-slate-700 font-bold">Careers & Jobs</span>
                </button>
                <button
                  onClick={() => handleTrendingClick('#/hsse')}
                  className="flex items-center space-x-3 bg-white hover:bg-slate-50 border border-slate-150 p-3 rounded-lg transition-all duration-300 hover-lift text-left shadow-sm"
                >
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                  <span className="text-[13px] text-slate-700 font-bold">HSSE Commitment</span>
                </button>
              </div>
            </div>
          ) : results.length > 0 ? (
            /* Active Spotlight Style Results */
            <div className="py-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-4 py-1">
                <span>Suggestions</span>
                <span>{results.length} found</span>
              </div>
              {results.map((result, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectResult(result.link)}
                  className={`search-result-item flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-150 ${
                    activeResultIndex === idx
                      ? 'bg-slate-100 text-slate-900 shadow-inner'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    {/* Compact Badge */}
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 shrink-0 rounded ${result.badgeColor}`}>
                      {result.category}
                    </span>
                    
                    {/* Text block */}
                    <div className="min-w-0 flex-grow">
                      <h4 className="text-sm font-bold text-slate-800 truncate">
                        {result.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                        {result.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Select indicator */}
                  <div className="ml-4 shrink-0 flex items-center text-xs font-bold text-emerald-700 opacity-0 group hover:opacity-100 transition-opacity">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* No Results Found State */
            <div className="py-12 px-6 text-center bg-slate-50/50">
              <svg className="w-10 h-10 text-slate-350 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-slate-700 text-sm font-bold mb-1.5">No results found</h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto font-normal leading-relaxed">
                No matching pages or documents. Try searching for <strong className="text-emerald-700 font-bold">engineering</strong>, <strong className="text-emerald-700 font-bold">subsea</strong>, or <strong className="text-emerald-700 font-bold">safety</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Modal Status Footer Bar */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium">
          <div className="flex items-center space-x-2">
            <span>Use keys</span>
            <span className="bg-white border border-slate-200 px-1 py-0.5 rounded text-[8px] font-bold">↑</span>
            <span className="bg-white border border-slate-200 px-1 py-0.5 rounded text-[8px] font-bold">↓</span>
            <span>to navigate</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="bg-white border border-slate-200 px-1 py-0.5 rounded text-[8px] font-bold">⏎</span>
            <span>to open</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SearchOverlay;
