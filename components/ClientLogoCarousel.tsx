import React, { useRef, useState } from 'react';
import { usePartners } from '../hooks/useSupabaseData';
import { IconChevronLeft, IconChevronRight } from './admin/AdminIcons';

export interface ClientRelationshipItem {
  id: string;
  name: string;
  category: 'Direct Client' | 'Project & Delivery Partner' | 'Industry Stakeholder';
  logo_url: string;
  display_order: number;
  status: 'published' | 'draft';
  role?: string;
}

export const INITIAL_CLIENT_RELATIONSHIPS: ClientRelationshipItem[] = [
  {
    id: 'client-shell',
    name: 'Shell',
    category: 'Direct Client',
    role: 'Operating Engagement',
    logo_url: '/assets/clients/shell.svg',
    display_order: 1,
    status: 'published'
  },
  {
    id: 'client-nnpc',
    name: 'NNPC Limited',
    category: 'Industry Stakeholder',
    role: 'National Energy Infrastructure',
    logo_url: '/assets/clients/nnpc.svg',
    display_order: 2,
    status: 'published'
  },
  {
    id: 'client-totalenergies',
    name: 'TotalEnergies',
    category: 'Direct Client',
    role: 'Offshore & Energy Operations',
    logo_url: '/assets/clients/totalenergies.svg',
    display_order: 3,
    status: 'published'
  },
  {
    id: 'client-renaissance',
    name: 'Renaissance Africa Energy Company Limited',
    category: 'Industry Stakeholder',
    role: 'Upstream Asset Operations',
    logo_url: '/assets/clients/renaissance.svg',
    display_order: 4,
    status: 'published'
  },
  {
    id: 'client-newcross',
    name: 'Newcross Exploration & Production',
    category: 'Project & Delivery Partner',
    role: 'Field Development Support',
    logo_url: '/assets/clients/newcross.svg',
    display_order: 5,
    status: 'published'
  },
  {
    id: 'client-panocean',
    name: 'Pan Ocean Oil Corporation (Nigeria) Limited',
    category: 'Project & Delivery Partner',
    role: 'Pipeline & Facility Support',
    logo_url: '/assets/clients/panocean.svg',
    display_order: 6,
    status: 'published'
  },
  {
    id: 'client-matrix',
    name: 'Matrix Energy',
    category: 'Direct Client',
    role: 'Downstream & Terminal Engineering',
    logo_url: '/assets/clients/matrix.svg',
    display_order: 7,
    status: 'published'
  }
];

interface ClientLogoCarouselProps {
  className?: string;
  theme?: 'light' | 'dark';
}

export const ClientLogoCarousel: React.FC<ClientLogoCarouselProps> = ({
  className = '',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Retrieve dynamic partners/clients from CMS if populated, otherwise use approved baseline
  const { partners } = usePartners();
  
  // Find published client relationships from CMS or fallback to INITIAL_CLIENT_RELATIONSHIPS
  const dynamicClients: ClientRelationshipItem[] = (partners || [])
    .filter(p => (p as any).category === 'client_relationship' && p.status === 'published')
    .map(p => ({
      id: p.id,
      name: p.name,
      category: ((p as any).relationship_type || 'Direct Client') as any,
      role: p.role,
      logo_url: p.logo_url || '/assets/clients/shell.svg',
      display_order: p.display_order,
      status: p.status as any
    }));

  const activeClients = dynamicClients.length > 0
    ? dynamicClients.sort((a, b) => a.display_order - b.display_order)
    : INITIAL_CLIENT_RELATIONSHIPS.filter(c => c.status === 'published');

  // Duplicate list to achieve continuous seamless ticker loop
  const displayLogos = [...activeClients, ...activeClients];

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const offset = direction === 'left' ? -260 : 260;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section
      aria-label="Organisations We Have Worked With"
      className={`py-16 md:py-24 border-t border-b transition-colors overflow-hidden relative ${
        isDark
          ? 'bg-slate-950/80 border-slate-800 text-white'
          : 'bg-white border-slate-200/80 text-slate-900'
      } ${className}`}
    >
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <span>Corporate Engagements</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Organisations We Have Worked With
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Over the years, PIGL has contributed technical expertise and specialist services across Nigeria's energy, engineering and industrial sectors. Our experience includes engagements with established organisations and industry stakeholders.
          </p>
        </div>

        {/* Carousel Wrapper with Linear Edge Gradients & Pause Control */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Edge Blur Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-20 pointer-events-none" />

          {/* Manual Scroll Controls */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Scroll logos left"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <IconChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Scroll logos right"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <IconChevronRight className="w-4 h-4" />
          </button>

          {/* Scrolling Track */}
          <div
            ref={scrollContainerRef}
            tabIndex={0}
            role="region"
            aria-label="Interactive logos list"
            className="flex items-center space-x-6 sm:space-x-8 overflow-x-auto scrollbar-none py-4 px-4 overscroll-x-contain focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl"
            style={{
              scrollBehavior: 'smooth'
            }}
          >
            <div 
              className={`flex items-center space-x-6 sm:space-x-8 shrink-0 ${
                isPaused ? '' : 'animate-ticker-marquee motion-reduce:animate-none'
              }`}
            >
              {displayLogos.map((org, index) => (
                <div
                  key={`${org.id}-${index}`}
                  tabIndex={0}
                  role="article"
                  aria-label={`${org.name} - ${org.category}`}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                  className={`group/logo shrink-0 w-52 sm:w-60 h-24 rounded-xl border flex flex-col items-center justify-center p-4 transition-all duration-300 relative cursor-default select-none ${
                    isDark
                      ? 'bg-slate-900/60 border-slate-800/80 hover:border-emerald-600/60 hover:bg-slate-900'
                      : 'bg-slate-50/70 border-slate-200/90 hover:border-emerald-500/70 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <img
                    src={org.logo_url}
                    alt={`${org.name} corporate logo`}
                    className="max-h-11 sm:max-h-12 w-auto max-w-[170px] object-contain transition-all duration-300 filter grayscale contrast-75 opacity-70 group-hover/logo:grayscale-0 group-hover/logo:contrast-100 group-hover/logo:opacity-100 group-hover/logo:scale-105 group-focus/logo:grayscale-0 group-focus/logo:opacity-100 group-focus/logo:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 mt-2 opacity-0 group-hover/logo:opacity-100 group-focus/logo:opacity-100 transition-opacity truncate max-w-[180px]">
                    {org.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogoCarousel;

