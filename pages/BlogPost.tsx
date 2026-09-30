import React, { useEffect, useState } from 'react';
import { useBlogPost, useBlogPosts } from '../hooks/useSupabaseData';
import { applyBlogPostSEO } from '../utils/seo';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';

interface BlogPostProps {
  currentPath: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ currentPath }) => {
  const slug = currentPath.split('/blog/')[1] || '';
  const { post, loading } = useBlogPost(slug);
  const { posts: allPosts } = useBlogPosts();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (post) {
      applyBlogPostSEO(post);
    }
  }, [post]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const relatedPosts = allPosts.filter(p => p.slug !== slug).slice(0, 3);

  const renderSimpleMarkdown = (text: string) => {
    const html = text
      .replace(/^### (.*$)/gim, '<h3 class="text-xl sm:text-2xl font-black text-slate-950 mt-8 mb-3 tracking-tight">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl sm:text-3xl font-black text-slate-950 mt-10 mb-4 border-b border-slate-200 pb-3 tracking-tight">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl sm:text-4xl font-black text-slate-950 mt-10 mb-4 tracking-tight">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-950">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-emerald-700 bg-emerald-50/70 pl-6 py-4 my-8 text-slate-800 italic font-serif text-lg leading-relaxed shadow-sm">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc text-slate-700 my-2 leading-relaxed">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal text-slate-700 my-2 leading-relaxed">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-800 underline font-semibold hover:text-emerald-950 transition-colors">$1</a>')
      .replace(/\n\n/g, '<p class="mb-6 text-slate-700 leading-relaxed text-base sm:text-lg font-normal"></p>')
      .replace(/\n/g, '<br/>');

    return { __html: html };
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading && !post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans bg-white">
        <svg className="animate-spin h-10 w-10 text-emerald-800 mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Loading Technical Article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans px-4 text-center bg-white">
        <h2 className="text-3xl font-black text-slate-900 mb-3">Publication Not Found</h2>
        <p className="text-slate-600 text-sm max-w-md mb-8">The requested technical article could not be located or may have been archived.</p>
        <a
          href="/blog"
          className="px-6 py-3 bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 transition-colors"
        >
          ← Return to Blog
        </a>
      </div>
    );
  }

  return (
    <article className="bg-white font-sans text-slate-900">
      
      {/* Dynamic Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-100 z-[60]">
        <div 
          className="h-full bg-emerald-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 1. Header Banner */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={post.featured_image || '/assets/IMG_6170.jpg'}
            alt={post.title}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400 truncate max-w-[200px]">{post.category}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-6 border-t border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-black flex items-center justify-center text-xs">
                {post.author.charAt(0)}
              </div>
              <span className="font-semibold text-white">{post.author}</span>
            </div>
            <span>•</span>
            <span>{new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>•</span>
            <span>{post.read_time || '5 min read'}</span>
          </div>
        </div>

        {/* Continuous Reflective Energy Line at the base of the Hero & Breadcrumb section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine dark={true} />
        </div>
      </section>

      {/* 2. Main Article Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Featured Image */}
        {post.featured_image && (
          <div className="overflow-hidden border border-slate-200 mb-10 shadow-md">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto max-h-[520px] object-cover"
            />
          </div>
        )}

        {/* Lead Excerpt */}
        {post.excerpt && (
          <div className="p-6 sm:p-8 bg-slate-50 border-l-4 border-emerald-800 text-lg sm:text-xl text-slate-800 font-medium leading-relaxed mb-10">
            {post.excerpt}
          </div>
        )}

        {/* Article Markdown Body */}
        <div
          className="prose prose-slate max-w-none text-slate-800 text-base sm:text-lg leading-relaxed space-y-6"
          dangerouslySetInnerHTML={renderSimpleMarkdown(post.content)}
        />

        {/* Article Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">
              Tags:
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share & Interactive Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Share this publication</p>
            <p className="text-xs text-slate-500">Spread technical insights across your professional network</p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-white border border-slate-300 hover:border-emerald-700 hover:text-emerald-800 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              {copied ? '✓ Link Copied' : 'Copy Link'}
            </button>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              LinkedIn
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - Read more: ${window.location.href}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Technical Consultation CTA Card */}
        <div className="mt-14 p-8 sm:p-10 bg-slate-950 text-white border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block">
              Direct Engineering Consultation
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Have an asset or field challenge?
            </h3>
            <p className="text-sm text-slate-300 font-normal leading-relaxed">
              Connect with Polaris Integrated & GeoSolutions technical specialists in Port Harcourt, Lagos, or Abuja.
            </p>
          </div>
          <a
            href="/contact"
            className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-colors"
          >
            Request Consultation →
          </a>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-12 border-t-2 border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Related Articles & Publications
              </h3>
              <a
                href="/blog"
                className="text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 transition-colors"
              >
                View All Articles →
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <a
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="bg-white border border-slate-200 hover:border-emerald-700/60 transition-all flex flex-col group hover:shadow-lg"
                >
                  <div className="h-40 bg-slate-900 overflow-hidden">
                    <img
                      src={rel.featured_image || '/assets/IMG_6170.jpg'}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      {rel.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-emerald-800 transition-colors leading-snug">
                      {rel.title}
                    </h4>
                    <span className="text-xs text-slate-500 pt-2 block font-medium">
                      {new Date(rel.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
};

export default BlogPost;
