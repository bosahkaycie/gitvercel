import React, { useState, useMemo } from 'react';
import { useBlogPosts, usePageHeaders } from '../hooks/useSupabaseData';
import ConferenceKeynoteImg from '../assets/pigl_conference_keynote.jpg';
import InternationalPartnerImg from '../assets/pigl_international_partner.jpg';
import FieldTeamSwampImg from '../assets/pigl_field_team_swamp.jpg';
import ExhibitionConsultingImg from '../assets/pigl_exhibition_consulting.jpg';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [emailSubscribe, setEmailSubscribe] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const { posts, loading } = useBlogPosts(selectedCategory === 'All' ? undefined : selectedCategory);
  const { getPageHeader } = usePageHeaders();
  const pageHeader = getPageHeader('blog');
  const breadcrumbImage = pageHeader.effective_image || ConferenceKeynoteImg;

  // Dynamic distinct categories extracted from published posts
  const categories = useMemo(() => {
    const list = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));
    // Ensure standard engineering categories are represented if in list
    return ['All', ...list];
  }, [posts]);

  // Filtered and sorted published posts
  const filteredPosts = useMemo(() => {
    let result = posts.filter(post => post.status === 'published');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        post =>
          post.title.toLowerCase().includes(q) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(q)) ||
          (post.category && post.category.toLowerCase().includes(q)) ||
          (post.tags && post.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    // Promoted featured article first, followed by chronologically latest
    return [...result].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });
  }, [posts, searchQuery]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubscribe) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailSubscribe('');
    }, 3500);
  };

  return (
    <div className="flex flex-col bg-slate-50 font-sans min-h-screen">
      
      {/* 1. Header Banner */}
      <section className="relative bg-slate-950 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src={breadcrumbImage} 
            alt="PIGL Engineering Journal & Insights" 
            className="w-full h-full object-cover"
            style={{ opacity: 1 - (pageHeader.overlay_opacity ?? 0.35) }}
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400">Blog</span>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mb-5">
              Engineering Insights &amp; Articles
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
              Deep dives into subsurface characterisation, offshore telemetry, 3D laser capture, and asset assurance across Nigeria's energy sector.
            </p>
          </div>
        </div>

        {/* Continuous Reflective Energy Line at the base of the Hero section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine dark={true} />
        </div>
      </section>

      {/* 2. Filter & Search Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-[64px] lg:top-[80px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, topics or tags..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:border-emerald-700 focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none transition-all"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Articles Equal-Height Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        
        {loading && filteredPosts.length === 0 ? (
          <div className="py-28 text-center text-slate-500">
            <svg className="animate-spin h-10 w-10 text-emerald-700 mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Loading Engineering Journal...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-28 text-center bg-white border border-slate-200 rounded-2xl p-12">
            <p className="text-slate-600 text-base mb-4 font-medium">No publications found matching your search term.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-6 py-2.5 bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            {/* Equal-Height Editorial Article Grid: 3 columns desktop, 2 tablet, 1 mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {filteredPosts.map((post, idx) => {
                const fallbackImg = idx % 2 === 0 ? InternationalPartnerImg : ExhibitionConsultingImg;
                const imgSrc = post.featured_image || (idx === 0 ? FieldTeamSwampImg : fallbackImg);
                
                return (
                  <article
                    key={post.id}
                    className="h-full flex flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:shadow-slate-200/70 hover:border-emerald-700/40 hover:-translate-y-1.5 transition-all duration-300 ease-out group motion-reduce:transition-none motion-reduce:hover:transform-none"
                  >
                    {/* Consistent 16:9 Image Container */}
                    <a
                      href={`/blog/${post.slug}`}
                      className="block relative aspect-[16/9] w-full overflow-hidden bg-slate-900 shrink-0"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <img
                        src={imgSrc}
                        alt={post.title}
                        className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
                        loading={idx < 3 ? 'eager' : 'lazy'}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = FieldTeamSwampImg;
                        }}
                      />
                      {/* Subtle dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                    </a>

                    {/* Editorial Content Container */}
                    <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                      <div>
                        {/* Metadata Row: Category, Date, Reading Time */}
                        <div className="flex flex-wrap items-center text-xs text-slate-500 font-medium gap-x-2 gap-y-1 mb-3 min-h-[36px]">
                          <span className="text-emerald-800 font-bold uppercase tracking-wider text-[11px]">
                            {post.category}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span>
                            {new Date(post.published_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span>{post.read_time || '4 min read'}</span>
                        </div>

                        {/* Title: Clamped to 2 lines for uniform card dimensions */}
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug tracking-tight line-clamp-2 min-h-[3.25rem] sm:min-h-[3.5rem] group-hover:text-emerald-800 transition-colors duration-200">
                          <a href={`/blog/${post.slug}`} className="hover:underline">
                            {post.title}
                          </a>
                        </h2>

                        {/* Excerpt: Clamped to 3 lines */}
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mt-3 line-clamp-3 min-h-[4.25rem]">
                          {post.excerpt || 'Read the full publication and technical analysis from Polaris Integrated & GeoSolutions Limited.'}
                        </p>
                      </div>

                      {/* Editorial Footer: Author & Read Link (Anchored at bottom) */}
                      <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-semibold truncate max-w-[170px]" title={post.author || 'PIGL Technical Editorial'}>
                          {post.author ? `By ${post.author}` : 'PIGL Technical Editorial'}
                        </span>

                        <a
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center text-emerald-800 font-bold uppercase tracking-wider text-[11px] group-hover:text-emerald-950 transition-colors"
                        >
                          <span>Read article</span>
                          <span className="ml-1.5 transform group-hover:translate-x-1 transition-transform duration-200">
                            →
                          </span>
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Newsletter & Technical Briefing CTA Card */}
            <div className="mt-12 bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 rounded-2xl relative overflow-hidden shadow-lg">
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-3xl relative z-10 space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block font-mono">
                  Stay Informed
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Subscribe to PIGL Engineering Briefings
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed font-normal">
                  Receive quarterly technical bulletins, offshore metocean benchmarks, and geospatial innovations directly in your inbox.
                </p>

                {subscribed ? (
                  <div className="bg-emerald-950/80 border border-emerald-700 p-4 rounded-lg text-emerald-300 text-xs font-bold">
                    ✓ Thank you! You have subscribed to PIGL Technical Briefings.
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-2">
                    <input
                      type="email"
                      required
                      value={emailSubscribe}
                      onChange={(e) => setEmailSubscribe(e.target.value)}
                      placeholder="Enter your corporate email address..."
                      className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-emerald-500 outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

export default Blog;
