import { CMSBlogPost } from '../types';

export interface SEOConfig {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
}

/**
 * Updates page SEO tags, OpenGraph metadata, Twitter Cards, and canonical URL.
 */
export const applySEO = (config: SEOConfig) => {
  const {
    title,
    description,
    canonicalUrl,
    ogImage = 'https://polarisigl.com/assets/IMG_6170.jpg',
    ogType = 'website',
    keywords = [],
    author = 'Polaris Integrated & GeoSolutions Limited',
    publishedTime,
    modifiedTime,
    category
  } = config;

  // 1. Document Title
  document.title = title;

  // Helper to safely set meta tags
  const setMeta = (nameOrProp: string, value: string, isProperty = false) => {
    const selector = isProperty ? `meta[property="${nameOrProp}"]` : `meta[name="${nameOrProp}"]`;
    let meta = document.querySelector(selector);
    if (!meta) {
      meta = document.createElement('meta');
      if (isProperty) {
        meta.setAttribute('property', nameOrProp);
      } else {
        meta.setAttribute('name', nameOrProp);
      }
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', value);
  };

  // 2. Standard Search Meta
  setMeta('description', description);
  if (keywords.length > 0) {
    setMeta('keywords', keywords.join(', '));
  }
  setMeta('author', author);
  setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  // 3. Canonical Link
  const currentHref = canonicalUrl || window.location.href.split('?')[0];
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', currentHref);

  // 4. OpenGraph (Facebook, LinkedIn, Slack)
  setMeta('og:locale', 'en_US', true);
  setMeta('og:type', ogType, true);
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:url', currentHref, true);
  setMeta('og:site_name', 'Polaris Integrated & GeoSolutions Limited', true);
  setMeta('og:image', ogImage.startsWith('http') ? ogImage : `https://polarisigl.com${ogImage}`, true);
  setMeta('og:image:alt', title, true);

  // 5. Article-Specific OpenGraph
  if (ogType === 'article') {
    if (publishedTime) setMeta('article:published_time', publishedTime, true);
    if (modifiedTime) setMeta('article:modified_time', modifiedTime, true);
    if (author) setMeta('article:author', author, true);
    if (category) setMeta('article:section', category, true);
    keywords.forEach((tag) => setMeta('article:tag', tag, true));
  }

  // 6. Twitter Card
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:site', '@polarisigl');
  setMeta('twitter:creator', '@polarisigl');
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', ogImage.startsWith('http') ? ogImage : `https://polarisigl.com${ogImage}`);

  // 7. Schema.org JSON-LD Structured Data
  const jsonLdId = 'dynamic-jsonld-schema';
  const existingJsonLd = document.getElementById(jsonLdId);
  if (existingJsonLd) existingJsonLd.remove();

  let schema: any;

  if (ogType === 'article') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': currentHref
      },
      headline: title,
      description: description,
      image: [ogImage.startsWith('http') ? ogImage : `https://polarisigl.com${ogImage}`],
      datePublished: publishedTime || new Date().toISOString(),
      dateModified: modifiedTime || publishedTime || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: author
      },
      publisher: {
        '@type': 'Organization',
        name: 'Polaris Integrated & GeoSolutions Limited',
        logo: {
          '@type': 'ImageObject',
          url: 'https://polarisigl.com/assets/logo_light.png'
        }
      },
      keywords: keywords.join(', ')
    };
  } else {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Polaris Integrated and GeoSolutions Limited (PIGL)',
      url: 'https://polarisigl.com/',
      logo: 'https://polarisigl.com/assets/logo_light.png',
      sameAs: [
        'https://www.linkedin.com/company/polarisigl/'
      ],
      description: description
    };
  }

  const script = document.createElement('script');
  script.id = jsonLdId;
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
};

/**
 * Apply SEO tailored specifically for a CMS Blog Post
 */
export const applyBlogPostSEO = (post: CMSBlogPost) => {
  const title = post.seo_title || `${post.title} | PIGL Technical Insights`;
  const description = post.seo_description || post.excerpt;
  const canonicalUrl = post.canonical_url || `https://polarisigl.com/blog/${post.slug}`;
  const ogImage = post.og_image || post.featured_image || 'https://polarisigl.com/assets/IMG_6170.jpg';

  applySEO({
    title,
    description,
    canonicalUrl,
    ogImage,
    ogType: 'article',
    keywords: post.tags,
    author: post.author,
    publishedTime: post.published_at,
    modifiedTime: post.updated_at || post.published_at,
    category: post.category
  });
};
