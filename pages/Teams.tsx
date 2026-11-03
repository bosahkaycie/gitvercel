import React, { useState, useEffect } from 'react';
import { TEAM } from '../site_data';
import { useTeamMembers } from '../hooks/useSupabaseData';
import TeamsHeroBg from '../assets/team_large.jpeg';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';

const Teams: React.FC = () => {
  const { teamMembers, loading } = useTeamMembers();
  const [selectedDept, setSelectedDept] = useState<string>('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activeMembers = (teamMembers && teamMembers.length > 0)
    ? teamMembers.filter(m => m.status === 'active')
    : TEAM.map((m, idx) => ({
        id: `team-${idx + 1}`,
        name: m.name,
        role: m.role,
        image: m.image,
        bio: `Experienced engineering and technical leader at Polaris Integrated & GeoSolutions Limited.`,
        linkedin: m.linkedin || 'https://www.linkedin.com/company/polarisigl/',
        email: `${m.name.toLowerCase().split(' ')[0]}@polarisigl.com`,
        department: idx < 2 ? 'Executive Leadership' : idx < 6 ? 'Technical Operations & Geosciences' : 'QHSE & Commercial Governance',
        display_order: idx + 1,
        status: 'active' as const
      }));

  const departments = ['All', 'Executive Leadership', 'Technical Operations & Geosciences', 'QHSE & Commercial Governance'];

  const filteredMembers = selectedDept === 'All'
    ? activeMembers
    : activeMembers.filter(m => {
        const dept = (m as any).department || '';
        if (selectedDept === 'Executive Leadership') {
          return dept.includes('Executive') || dept.includes('Management') || dept.includes('Corporate Officers');
        }
        if (selectedDept === 'Technical Operations & Geosciences') {
          return dept.includes('Technical') || dept.includes('Operations') || dept.includes('Intelligence') || dept.includes('Engineering');
        }
        if (selectedDept === 'QHSE & Commercial Governance') {
          return dept.includes('QHSE') || dept.includes('Compliance') || dept.includes('Commercial') || dept.includes('Finance');
        }
        return dept === selectedDept;
      });

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
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-3">
              Leadership & Engineering Disciplines
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
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

      {/* 2. Department Filters */}
      <section className="bg-slate-50 border-b border-slate-200 sticky top-16 md:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center overflow-x-auto py-4 space-x-2 scrollbar-none">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded whitespace-nowrap transition-all ${
                  selectedDept === dept
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Team Grid */}
      <section className="py-16 md:py-24 bg-white flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="text-center py-16 text-slate-500 font-mono text-sm">
              Loading team directory...
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredMembers.map((member, idx) => (
              <div
                key={member.id || idx}
                className="group bg-white border border-slate-200 hover:border-emerald-600/70 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
              >
                <div className="relative aspect-[4/5] bg-slate-900 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/management/steve.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} LinkedIn Profile`}
                      className="absolute bottom-3 right-3 w-8 h-8 rounded bg-white/90 text-slate-900 hover:bg-emerald-600 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md z-10"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block mb-2">
                      {(member as any).department || 'Engineering Leadership'}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-800 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 mt-1">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="text-xs text-slate-500 font-normal leading-relaxed mt-3 pt-3 border-t border-slate-100 line-clamp-3">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-16 bg-slate-50 border border-slate-200">
              <p className="text-slate-600 font-medium">No team profiles found for this discipline.</p>
            </div>
          )}

          {/* 4. Local Content & Capability Commitment */}
          <div className="mt-20 p-8 md:p-12 bg-slate-900 text-white rounded-none border border-slate-800 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">
                  100% Indigenous Technical Capacity
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 text-white">
                  Local Content & Professional Engineering Standards
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  PIGL operates in strict compliance with the Nigerian Oil and Gas Industry Content Development (NOGICD) Act. Our operational strength lies in our registered surveyors, geophysicists, geotechnical engineers, and laboratory technicians operating calibrated instrumentation across Nigerian land, swamp, and offshore assets.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <a
                  href="/contact"
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-center font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  Contact Our Engineering Desk
                </a>
                <a
                  href="/careers"
                  className="px-6 py-3.5 border border-slate-700 hover:border-slate-500 text-slate-200 text-center font-bold text-xs uppercase tracking-wider transition-colors"
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
