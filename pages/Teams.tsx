import React, { useState, useEffect, useRef } from 'react';
import { TEAM } from '../site_data';
import { useTeamMembers } from '../hooks/useSupabaseData';
import TeamsHeroBg from '../assets/team_large.jpeg';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';

interface ExtendedTeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  linkedin?: string;
  email?: string;
  department: string;
  display_order: number;
  status: 'active';
  credentials?: string[];
  responsibilities?: string[];
}

const Teams: React.FC = () => {
  const { teamMembers, loading } = useTeamMembers();
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [isFilterTransitioning, setIsFilterTransitioning] = useState<boolean>(false);
  const [visibleCardIds, setVisibleCardIds] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Department metadata and canonical members
  const memberBiographies: Record<string, { bio: string; credentials: string[]; responsibilities: string[] }> = {
    'Dr. Chigozie Dimgba': {
      bio: 'Doctorate in Geodesy and Geomatics Engineering, Fellow of the Nigerian Institution of Surveyors (fnis). Dr. Dimgba brings over 20 years of technical expertise in offshore geodetic positioning, geotechnical investigations, high-density 3D reality capture, and corporate governance across Sub-Saharan Africa.',
      credentials: ['Ph.D Geodesy & Geomatics', 'Fellow, Nigerian Institution of Surveyors (fnis)', 'Registered Surveyor (SURCON)', 'Member, International Federation of Surveyors (FIG)'],
      responsibilities: ['Executive Direction & Corporate Strategy', 'Technical Integrity Oversight', 'Client & Partner Stakeholder Alliances', 'Statutory Industry Governance']
    },
    'Nnenna Ndubuisi': {
      bio: 'Senior corporate governance executive directing institutional administration, statutory compliance, human capital strategy, and organizational efficiency across PIGL\'s multidisciplinary engineering and marine operations.',
      credentials: ['M.Sc. Human Resource Management', 'Certified Member, CIPM', 'Executive Leadership Certification'],
      responsibilities: ['Corporate Governance & Administration', 'Workforce Capability Planning', 'Institutional Regulatory Compliance', 'Stakeholder & Community Relations']
    },
    'Adamu Alumum Isaac': {
      bio: 'Chartered financial strategist with extensive experience across upstream energy financial governance, treasury optimization, capital asset underwriting, and commercial risk mitigation for major infrastructure assignments.',
      credentials: ['Fellow, ICAN', 'B.Sc. Accounting', 'Certified Financial Risk Analyst'],
      responsibilities: ['Financial Strategy & Capital Allocation', 'Commercial Risk Management', 'Project Cost Engineering & Auditing', 'Statutory Fiscal Governance']
    },
    'Analiefo Nzegwu': {
      bio: 'Executive Director of Operations overseeing day-to-day engineering mobilization, marine vessel logistics, calibrated survey fleet operations, and offshore Niger Delta field campaigns.',
      credentials: ['B.Eng. Marine Engineering', 'COREN Registered Engineer', 'Offshore Survival & Safety Certifications (BOSIET)'],
      responsibilities: ['Field Operations & Fleet Mobilization', 'Technical Resource Deployment', 'Asset Integrity Logistics', 'Subsea & Swamp Survey Delivery']
    },
    'Layefa Chituru Igbe': {
      bio: 'Leads strategic commercial partnerships, upstream operator tendering, joint ventures with international technology partners, and technical market expansion throughout West Africa.',
      credentials: ['MBA Commercial Strategy', 'B.Sc. Economics', 'Member, Nigerian Institute of Management'],
      responsibilities: ['Strategic Alliances & Joint Ventures', 'Contract Commercial Scoping', 'Tender Governance & Client Liaison', 'Energy Market Expansion']
    },
    'Uduma Ikpa Obianuju': {
      bio: 'Coordinates project delivery administration, milestone tracking, regulatory documentation, client reporting protocols, and ISO audit alignments for PIGL engineering contracts.',
      credentials: ['B.Sc. Project Management', 'PMP Certified Professional', 'ISO 9001:2015 Lead Auditor'],
      responsibilities: ['Engineering Project Administration', 'Milestone & Deliverable Tracking', 'Quality Audit Documentation', 'Client Governance Protocols']
    },
    'Brian Akpotowo': {
      bio: 'Pioneers high-density 3D reality capture, Leica RTC360 laser scanning campaigns, drone photogrammetry, as-built BIM model conversion, and brownfield digital twin delivery for oil and gas facilities.',
      credentials: ['B.Sc. Geoinformatics', 'Certified Reality Capture Specialist', 'Autodesk Certified BIM Professional'],
      responsibilities: ['3D Terrestrial Laser Scanning Campaigns', 'Intelligent As-Built BIM & CAD Extraction', 'Clash Detection Analysis', 'Offshore Flowstation Digital Twins']
    },
    'Steve Ubani': {
      bio: 'Directs field operational crews, geotechnical hydraulic CPTu pontoon mobilizations, precision geodetic GPS networks, and pipeline route surveys across coastal, swamp, and deepwater corridors.',
      credentials: ['B.Sc. Surveying & Geoinformatics', 'Registered Surveyor (SURCON)', 'Advanced Hydrography Certification'],
      responsibilities: ['Field Crew Mobilization & Superintending', 'In-Situ Geotechnical CPT Rig Operations', 'Topographic & Bathymetric Field Operations', 'Site Safety & Geodetic Data Quality']
    }
  };

  const activeMembers: ExtendedTeamMember[] = (teamMembers && teamMembers.length > 0)
    ? teamMembers.filter(m => m.status === 'active').map((m, idx) => {
        const enriched = memberBiographies[m.name] || {
          bio: m.bio || 'Experienced engineering and technical leader at Polaris Integrated & GeoSolutions Limited.',
          credentials: ['Registered Technical Specialist', 'Engineering Discipline Lead'],
          responsibilities: ['Operational Execution', 'Technical Standards Compliance']
        };
        return {
          id: m.id || `team-${idx + 1}`,
          name: m.name,
          role: m.role,
          image: m.image,
          bio: m.bio || enriched.bio,
          linkedin: m.linkedin || 'https://www.linkedin.com/company/polarisigl/',
          email: m.email || `${m.name.toLowerCase().split(' ')[0]}@polarisigl.com`,
          department: (m as any).department || (idx < 2 ? 'Executive Leadership' : [3, 6, 7].includes(idx) ? 'Technical Operations & Geosciences' : 'QHSE & Commercial Governance'),
          display_order: m.display_order || (idx + 1),
          status: 'active' as const,
          credentials: enriched.credentials,
          responsibilities: enriched.responsibilities
        };
      })
    : TEAM.map((m, idx) => {
        const enriched = memberBiographies[m.name] || {
          bio: 'Experienced engineering and technical leader at Polaris Integrated & GeoSolutions Limited.',
          credentials: ['Registered Technical Specialist'],
          responsibilities: ['Engineering Delivery']
        };
        let dept = 'QHSE & Commercial Governance';
        if (idx === 0 || idx === 1) {
          dept = 'Executive Leadership';
        } else if (m.name.includes('Analiefo') || m.name.includes('Brian') || m.name.includes('Steve')) {
          dept = 'Technical Operations & Geosciences';
        }

        return {
          id: `team-${idx + 1}`,
          name: m.name,
          role: m.role,
          image: m.image,
          bio: enriched.bio,
          linkedin: m.linkedin || 'https://www.linkedin.com/company/polarisigl/',
          email: `${m.name.toLowerCase().split(' ')[0]}@polarisigl.com`,
          department: dept,
          display_order: idx + 1,
          status: 'active' as const,
          credentials: enriched.credentials,
          responsibilities: enriched.responsibilities
        };
      });

  const departments = [
    'All',
    'Executive Leadership',
    'Technical Operations & Geosciences',
    'QHSE & Commercial Governance'
  ];

  const filteredMembers = selectedDept === 'All'
    ? activeMembers
    : activeMembers.filter(m => {
        const dept = m.department || '';
        if (selectedDept === 'Executive Leadership') {
          return dept.includes('Executive') || dept.includes('Management') || dept.includes('Corporate Officers');
        }
        if (selectedDept === 'Technical Operations & Geosciences') {
          return dept.includes('Technical') || dept.includes('Operations') || dept.includes('Intelligence') || dept.includes('Engineering');
        }
        if (selectedDept === 'QHSE & Commercial Governance') {
          return dept.includes('QHSE') || dept.includes('Compliance') || dept.includes('Commercial') || dept.includes('Finance') || dept.includes('Administration');
        }
        return dept === selectedDept;
      });

  // Calculate count per department for polished pill indicators
  const getDeptCount = (deptName: string): number => {
    if (deptName === 'All') return activeMembers.length;
    return activeMembers.filter(m => {
      const d = m.department || '';
      if (deptName === 'Executive Leadership') {
        return d.includes('Executive') || d.includes('Management') || d.includes('Corporate Officers');
      }
      if (deptName === 'Technical Operations & Geosciences') {
        return d.includes('Technical') || d.includes('Operations') || d.includes('Intelligence') || d.includes('Engineering');
      }
      if (deptName === 'QHSE & Commercial Governance') {
        return d.includes('QHSE') || d.includes('Compliance') || d.includes('Commercial') || d.includes('Finance') || d.includes('Administration');
      }
      return d === deptName;
    }).length;
  };

  // Scroll entrance animation using IntersectionObserver
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Mark all cards visible immediately
      const allIds = new Set(filteredMembers.map(m => m.id));
      setVisibleCardIds(allIds);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.getAttribute('data-card-id');
            if (cardId) {
              setVisibleCardIds((prev) => new Set(prev).add(cardId));
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
      }
    );

    const cards = document.querySelectorAll('.team-card-animate');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [filteredMembers]);

  // Handle department change with smooth fade transition
  const handleDepartmentChange = (dept: string) => {
    if (dept === selectedDept) return;
    setIsFilterTransitioning(true);
    setTimeout(() => {
      setSelectedDept(dept);
      setIsFilterTransitioning(false);
    }, 180);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* 1. Hero Section */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={TeamsHeroBg}
            alt="PIGL Engineering and Management Team"
            className="w-full h-full object-cover opacity-25 grayscale-[0.2]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <a href="/about" className="hover:text-white transition-colors">About</a>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400">Teams</span>
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-3 font-mono">
              Leadership & Engineering Disciplines
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Our Teams
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
              Experienced engineering executives, registered hydrographers, geotechnical specialists, and operational leaders bringing technical rigour to every assignment.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine />
        </div>
      </section>

      {/* 2. Department Filters - Modern Pill Navigation */}
      <section className="bg-slate-50 border-b border-slate-200 sticky top-16 md:top-20 z-30 shadow-xs backdrop-blur-md bg-slate-50/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center overflow-x-auto py-3.5 space-x-2.5 scrollbar-none no-scrollbar">
            {departments.map((dept) => {
              const isSelected = selectedDept === dept;
              const count = getDeptCount(dept);
              return (
                <button
                  key={dept}
                  onClick={() => handleDepartmentChange(dept)}
                  className={`group relative px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg whitespace-nowrap transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/10'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span>{dept}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full transition-colors ${
                      isSelected
                        ? 'bg-emerald-950/60 text-emerald-200'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Team Grid with Staggered Entrance & Refined Hover */}
      <section className="py-16 md:py-24 bg-white flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="text-center py-16 text-slate-500 font-mono text-sm">
              Loading team directory...
            </div>
          )}

          <div
            ref={gridRef}
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 lg:gap-8 transition-opacity duration-200 ${
              isFilterTransitioning ? 'opacity-0 scale-[0.99]' : 'opacity-100 scale-100'
            }`}
          >
            {filteredMembers.map((member, idx) => {
              const isVisible = visibleCardIds.has(member.id);
              // Stagger delay calculation: each card delays gently by 60ms up to 360ms
              const staggerDelay = `${Math.min(idx * 60, 360)}ms`;

              return (
                <div
                  key={member.id}
                  data-card-id={member.id}
                  style={{
                    transitionDelay: staggerDelay
                  }}
                  className={`team-card-animate group bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between overflow-hidden relative shadow-xs hover:shadow-2xl hover:shadow-slate-200/90 hover:-translate-y-2 transition-all duration-400 ease-out ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-6'
                  }`}
                >
                  {/* Image Presentation */}
                  <div className="relative aspect-[4/5] bg-slate-900 overflow-hidden rounded-t-2xl">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/management/steve.png';
                      }}
                    />

                    {/* Refined gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />

                    {/* LinkedIn Profile Icon */}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} LinkedIn Profile`}
                        className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-800 hover:bg-emerald-700 hover:text-white flex items-center justify-center shadow-md transition-all duration-200 z-10 hover:scale-110"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                        {member.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mt-1">
                        {member.role}
                      </p>
                      {member.bio && (
                        <p className="text-xs text-slate-600 font-normal leading-relaxed mt-3 pt-3 border-t border-slate-100">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subtle Green Accent Bar on Hover */}
                  <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              );
            })}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-2xl">
              <p className="text-slate-600 font-medium">No team profiles found for this discipline.</p>
            </div>
          )}

          {/* 4. Local Content & Capability Commitment */}
          <div className="mt-20 p-8 md:p-12 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2 font-mono">
                  100% Indigenous Technical Capacity
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 text-white">
                  Local Content & Professional Engineering Standards
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  PIGL operates in strict compliance with the Nigerian Oil and Gas Industry Content Development (NOGICD) Act. Our operational strength lies in our registered surveyors, geophysicists, geotechnical engineers, and laboratory technicians operating calibrated instrumentation across Nigerian land, swamp, and offshore assets.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <a
                  href="/contact"
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-center font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md"
                >
                  Contact Our Engineering Desk
                </a>
                <a
                  href="/careers"
                  className="px-6 py-3.5 border border-slate-700 hover:border-slate-500 text-slate-200 text-center font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                >
                  Join Our Technical Team
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Teams;
