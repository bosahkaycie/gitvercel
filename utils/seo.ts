/**
 * Polaris Integrated & GeoSolutions Limited (PIGL)
 * Centralised SEO & Metadata Engine
 *
 * Establishes PIGL as the recognised brand identity for
 * Polaris Integrated & GeoSolutions Limited across all search engines.
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SEOConfig {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  breadcrumbs?: BreadcrumbItem[];
  serviceSchema?: {
    name: string;
    description: string;
    serviceType: string;
    divisionName?: string;
    divisionSlug?: string;
    capabilities?: string[];
  };
  noIndex?: boolean;
}

export const PIGL_COMPANY_IDENTITY = {
  legalName: 'Polaris Integrated & GeoSolutions Limited',
  brandName: 'PIGL',
  shortName: 'PIGL',
  alternateNames: [
    'PIGL',
    'Polaris Integrated & GeoSolutions Limited',
    'Polaris Integrated and GeoSolutions',
    'PIGL Nigeria',
    'Polaris GeoSolutions'
  ],
  url: 'https://polarisigl.com/',
  logoUrl: 'https://polarisigl.com/assets/logo_light.png',
  defaultOgImage: 'https://polarisigl.com/assets/slider.jpeg',
  headquarters: {
    streetAddress: '#3 Diamond Close, Castle & Green Estate, Off Eneka Link Road',
    addressLocality: 'Port Harcourt',
    addressRegion: 'Rivers State',
    addressCountry: 'NG',
    postalCode: '500102'
  },
  geoCoordinates: {
    latitude: 4.888581,
    longitude: 7.015744
  },
  contact: {
    phone: '+234-809-7081-333',
    email: 'hello@polarisigl.com',
    supportEmail: 'support@polarisigl.com'
  },
  socialProfiles: [
    'https://www.linkedin.com/company/polarisigl/',
    'https://www.youtube.com/@polarisigl'
  ],
  certifications: ['ISO 9001:2015', 'ISO 45001:2018']
};

/**
 * Standardize page titles ensuring PIGL brand consistency
 */
export function formatSEOTitle(title: string): string {
  if (title.includes('PIGL') || title.includes('Polaris Integrated')) {
    return title;
  }
  return `${title} | PIGL`;
}

/**
 * Core SEO metadata applier. Updates document title, meta tags, OpenGraph,
 * Twitter cards, canonical tags, and structured JSON-LD data.
 */
export const applySEO = (config: SEOConfig) => {
  const {
    title,
    description,
    canonicalUrl,
    ogImage = PIGL_COMPANY_IDENTITY.defaultOgImage,
    ogType = 'website',
    keywords = [],
    author = PIGL_COMPANY_IDENTITY.legalName,
    publishedTime,
    modifiedTime,
    category,
    breadcrumbs,
    serviceSchema,
    noIndex = false
  } = config;

  const formattedTitle = formatSEOTitle(title);

  // 1. Document Title
  document.title = formattedTitle;

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
  setMeta('title', formattedTitle);
  if (keywords.length > 0) {
    setMeta('keywords', keywords.join(', '));
  }
  setMeta('author', author);

  // Robots directive
  if (noIndex) {
    setMeta('robots', 'noindex, nofollow');
  } else {
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  }

  // Geographic Meta Tags (Local SEO for Port Harcourt, Rivers State, Nigeria)
  setMeta('geo.region', 'NG-RI');
  setMeta('geo.placename', 'Port Harcourt, Rivers State, Nigeria');
  setMeta('geo.position', `${PIGL_COMPANY_IDENTITY.geoCoordinates.latitude};${PIGL_COMPANY_IDENTITY.geoCoordinates.longitude}`);
  setMeta('ICBM', `${PIGL_COMPANY_IDENTITY.geoCoordinates.latitude}, ${PIGL_COMPANY_IDENTITY.geoCoordinates.longitude}`);

  // 3. Canonical Link
  const currentHref = canonicalUrl || (typeof window !== 'undefined' ? window.location.href.split('?')[0] : 'https://polarisigl.com/');
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', currentHref);

  // 4. OpenGraph Tags
  setMeta('og:locale', 'en_US', true);
  setMeta('og:type', ogType, true);
  setMeta('og:title', formattedTitle, true);
  setMeta('og:description', description, true);
  setMeta('og:url', currentHref, true);
  setMeta('og:site_name', `${PIGL_COMPANY_IDENTITY.brandName} | ${PIGL_COMPANY_IDENTITY.legalName}`, true);
  setMeta('og:image', ogImage.startsWith('http') ? ogImage : `https://polarisigl.com${ogImage}`, true);
  setMeta('og:image:alt', formattedTitle, true);

  // 5. Article-Specific OpenGraph
  if (ogType === 'article') {
    if (publishedTime) setMeta('article:published_time', publishedTime, true);
    if (modifiedTime) setMeta('article:modified_time', modifiedTime, true);
    if (author) setMeta('article:author', author, true);
    if (category) setMeta('article:section', category, true);
    keywords.forEach((tag) => setMeta('article:tag', tag, true));
  }

  // 6. Twitter / X Card Tags
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:site', '@polarisigl');
  setMeta('twitter:creator', '@polarisigl');
  setMeta('twitter:title', formattedTitle);
  setMeta('twitter:description', description);
  setMeta('twitter:url', currentHref);
  setMeta('twitter:image', ogImage.startsWith('http') ? ogImage : `https://polarisigl.com${ogImage}`);

  // 7. Structured Data: Schema.org Graph
  const jsonLdId = 'dynamic-jsonld-schema';
  const existingJsonLd = document.getElementById(jsonLdId);
  if (existingJsonLd) existingJsonLd.remove();

  // Root Organization definition
  const organizationNode = {
    '@type': 'Organization',
    '@id': 'https://polarisigl.com/#organization',
    name: PIGL_COMPANY_IDENTITY.brandName,
    legalName: PIGL_COMPANY_IDENTITY.legalName,
    alternateName: PIGL_COMPANY_IDENTITY.alternateNames,
    url: PIGL_COMPANY_IDENTITY.url,
    logo: {
      '@type': 'ImageObject',
      url: PIGL_COMPANY_IDENTITY.logoUrl,
      caption: `${PIGL_COMPANY_IDENTITY.brandName} - ${PIGL_COMPANY_IDENTITY.legalName}`
    },
    image: PIGL_COMPANY_IDENTITY.defaultOgImage,
    description: 'Polaris Integrated & GeoSolutions Limited (PIGL) is an ISO 9001:2015 & ISO 45001:2018 certified Nigerian engineering company providing multidisciplinary services across GeoSolutions & Engineering, Metocean & Marine Solutions, Integrated Construction, and Industrial Water Treatment.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: PIGL_COMPANY_IDENTITY.headquarters.streetAddress,
      addressLocality: PIGL_COMPANY_IDENTITY.headquarters.addressLocality,
      addressRegion: PIGL_COMPANY_IDENTITY.headquarters.addressRegion,
      addressCountry: PIGL_COMPANY_IDENTITY.headquarters.addressCountry,
      postalCode: PIGL_COMPANY_IDENTITY.headquarters.postalCode
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: PIGL_COMPANY_IDENTITY.geoCoordinates.latitude,
      longitude: PIGL_COMPANY_IDENTITY.geoCoordinates.longitude
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: PIGL_COMPANY_IDENTITY.contact.phone,
        contactType: 'customer service',
        email: PIGL_COMPANY_IDENTITY.contact.email,
        areaServed: 'NG',
        availableLanguage: 'English'
      }
    ],
    sameAs: PIGL_COMPANY_IDENTITY.socialProfiles
  };

  // LocalBusiness / EngineeringService definition (Headquarters & Laboratory)
  const localBusinessNode = {
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': 'https://polarisigl.com/#localbusiness',
    name: `${PIGL_COMPANY_IDENTITY.brandName} Port Harcourt Headquarters`,
    parentOrganization: { '@id': 'https://polarisigl.com/#organization' },
    url: PIGL_COMPANY_IDENTITY.url,
    telephone: PIGL_COMPANY_IDENTITY.contact.phone,
    email: PIGL_COMPANY_IDENTITY.contact.email,
    priceRange: '$$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: PIGL_COMPANY_IDENTITY.headquarters.streetAddress,
      addressLocality: PIGL_COMPANY_IDENTITY.headquarters.addressLocality,
      addressRegion: PIGL_COMPANY_IDENTITY.headquarters.addressRegion,
      addressCountry: PIGL_COMPANY_IDENTITY.headquarters.addressCountry
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: PIGL_COMPANY_IDENTITY.geoCoordinates.latitude,
      longitude: PIGL_COMPANY_IDENTITY.geoCoordinates.longitude
    },
    openingHours: 'Mo,Tu,We,Th,Fr 08:00-17:00'
  };

  const schemaGraph: any[] = [organizationNode, localBusinessNode];

  // Breadcrumbs Schema if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemaGraph.push({
      '@type': 'BreadcrumbList',
      '@id': `${currentHref}#breadcrumb`,
      itemListElement: breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.url.startsWith('http') ? b.url : `https://polarisigl.com${b.url}`
      }))
    });
  }

  // Service Schema if provided
  if (serviceSchema) {
    schemaGraph.push({
      '@type': 'Service',
      '@id': `${currentHref}#service`,
      name: serviceSchema.name,
      serviceType: serviceSchema.serviceType,
      description: serviceSchema.description,
      provider: { '@id': 'https://polarisigl.com/#organization' },
      areaServed: {
        '@type': 'Country',
        name: 'Nigeria'
      },
      category: serviceSchema.divisionName || 'Engineering & Industrial Solutions',
      hasOfferCatalog: serviceSchema.capabilities && serviceSchema.capabilities.length > 0 ? {
        '@type': 'OfferCatalog',
        name: `${serviceSchema.name} Technical Capabilities`,
        itemListElement: serviceSchema.capabilities.map((cap) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: cap
          }
        }))
      } : undefined
    });
  }

  // Article Schema if applicable
  if (ogType === 'article') {
    schemaGraph.push({
      '@type': 'BlogPosting',
      '@id': `${currentHref}#article`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': currentHref
      },
      headline: formattedTitle,
      description: description,
      image: [ogImage.startsWith('http') ? ogImage : `https://polarisigl.com${ogImage}`],
      datePublished: publishedTime || new Date().toISOString(),
      dateModified: modifiedTime || publishedTime || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: author
      },
      publisher: { '@id': 'https://polarisigl.com/#organization' },
      keywords: keywords.join(', ')
    });
  }

  const script = document.createElement('script');
  script.id = jsonLdId;
  script.type = 'application/ld+json';
  script.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemaGraph
  });
  document.head.appendChild(script);
};

/**
 * Apply SEO tailored specifically for a CMS Blog Post
 */
export const applyBlogPostSEO = (post: any) => {
  const title = post.seo_title || `${post.title} | PIGL Technical Insights`;
  const description = post.seo_description || post.excerpt || `Engineering perspective from PIGL on ${post.title}.`;
  const canonicalUrl = post.canonical_url || `https://polarisigl.com/blog/${post.slug}`;
  const ogImage = post.og_image || post.featured_image || PIGL_COMPANY_IDENTITY.defaultOgImage;

  applySEO({
    title,
    description,
    canonicalUrl,
    ogImage,
    ogType: 'article',
    keywords: post.tags || ['PIGL Engineering', 'Nigeria Energy Infrastructure'],
    author: post.author || PIGL_COMPANY_IDENTITY.legalName,
    publishedTime: post.published_at,
    modifiedTime: post.updated_at || post.published_at,
    category: post.category,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: post.title, url: `/blog/${post.slug}` }
    ]
  });
};
