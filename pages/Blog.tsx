import React, { useState } from 'react';
import { useBlogPosts } from '../hooks/useSupabaseData';
import NewsBg from '../assets/IMG_6614.jpg';
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

  const categories = ['All', 'Articles', 'Technical Updates', 'News'];

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
  const regularPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubscribe) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailSubscribe('');
    }, 3000);
  };

  return (
    <div className="flex flex-col bg-slate-50 font-sans min-h-screen">
      
      {/* 1. Header Banner */}
      <section className="relative bg-slate-950 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src={ConferenceKeynoteImg} 
            alt="PIGL Engineering Journal & Insights" 
            className="w-full h-full object-cover opacity-25"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400">Blog</span>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mb-5">
              Engineering Insights & Articles
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
              Deep dives into subsurface characterisation, offshore telemetry, 3D laser capture, and asset assurance across Nigeria's energy sector.
            </p>
          </div>
        </div>

        {/* Continuous Reflective Energy Line at the base of the Hero & Breadcrumb section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine dark={true} />
        </div>
      </section>

      {/* 2. Filter & Search Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-[64px] lg:top-[80px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-sm'
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
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 text-slate-900 focus:border-emerald-700 focus:bg-white focus:ring-1 focus:ring-emerald-700 outline-none transition-all"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Articles Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {loading && filteredPosts.length === 0 ? (
          <div className="py-28 text-center text-slate-500">
            <svg className="animate-spin h-10 w-10 text-emerald-700 mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Loading Engineering Journal...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-28 text-center bg-white border border-slate-200 p-12">
            <p className="text-slate-600 text-base mb-4 font-medium">No publications found matching your search term.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-6 py-2.5 bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Featured Article - Magazine Hero Layout */}
            {featuredPost && (
              <div className="relative bg-white border border-slate-200 overflow-hidden shadow-lg hover:border-emerald-700/60 transition-all duration-300 group">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-7 h-72 sm:h-96 lg:h-[480px] relative overflow-hidden bg-slate-900">
                    <img
                      src={featuredPost.featured_image || FieldTeamSwampImg}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow">
                        Featured Cover Story
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 bg-white">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-xs text-slate-500 font-semibold">
                        <span className="text-emerald-700 font-bold uppercase tracking-wider">{featuredPost.category}</span>
                        <span>•</span>
                        <span>{new Date(featuredPost.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>{featuredPost.read_time || '5 min read'}</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 leading-tight group-hover:text-emerald-800 transition-colors">
                        <a href={`/blog/${featuredPost.slug}`}>
                          {featuredPost.title}
                        </a>
                      </h2>

                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal line-clamp-4">
                        {featuredPost.excerpt}
                      </p>

                      {featuredPost.tags && featuredPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {featuredPost.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-black text-emerald-900 text-sm">
                          {featuredPost.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{featuredPost.author}</p>
                          <p className="text-[11px] text-slate-500">Engineering Contributor</p>
                        </div>
                      </div>

                      <a
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider transition-colors group-hover:translate-x-1 duration-300"
                      >
                        Read Article <span className="ml-1.5">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Regular Posts Grid */}
            {regularPosts.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                      Latest Articles & Technical Publications
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Showing {regularPosts.length} published intelligence insights</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post, idx) => (
                    <article
                      key={post.id}
                      className="bg-white border border-slate-200 hover:border-emerald-700/60 transition-all duration-300 flex flex-col group hover:shadow-xl"
                    >
                      <div className="h-56 bg-slate-900 relative overflow-hidden">
                        <img
                          src={post.featured_image || (idx % 2 === 0 ? InternationalPartnerImg : ExhibitionConsultingImg)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center text-xs text-slate-500 space-x-2 font-medium">
                            <span className="text-emerald-700 font-bold uppercase tracking-wider">{post.category}</span>
                            <span>•</span>
                            <span>{new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <span>•</span>
                            <span>{post.read_time || '4 min read'}</span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">
                            <a href={`/blog/${post.slug}`}>
                              {post.title}
                            </a>
                          </h4>

                          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-normal">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-slate-500 font-semibold truncate max-w-[150px]">
                            By {post.author}
                          </span>
                          <a
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-emerald-800 group-hover:text-emerald-950 group-hover:translate-x-1 transition-all"
                          >
                            Read More <span className="ml-1">→</span>
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter & Technical Briefing CTA Card */}
            <div className="bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 mt-16 relative overflow-hidden">
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-3xl relative z-10 space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                  Stay Informed
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Subscribe to PIGL Engineering Briefings
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed font-normal">
                  Receive quarterly technical bulletins, offshore metocean benchmarks, and geospatial innovations directly in your inbox.
                </p>

                {subscribed ? (
                  <div className="bg-emerald-950 border border-emerald-700 p-4 text-emerald-300 text-xs font-bold">
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
                      className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 outline-none"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-colors"
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
