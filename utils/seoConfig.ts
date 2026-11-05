/**
 * Master SEO Configuration Dictionary for PIGL Website
 * Defines unique page titles, meta descriptions, target keywords, and breadcrumbs
 * for every public page, operating division, and service in PIGL's approved corporate structure.
 */

export interface PageSEORecord {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  badge?: string;
  h1: string;
  breadcrumbs: { name: string; url: string }[];
  divisionId?: string;
  divisionName?: string;
  capabilities?: string[];
}

export const MASTER_SEO_CONFIG: Record<string, PageSEORecord> = {
  // 1. Core Homepage
  '/': {
    path: '/',
    title: 'PIGL | Polaris Integrated & GeoSolutions Limited - Engineering & Subsurface Intelligence',
    description: 'Polaris Integrated & GeoSolutions Limited (PIGL) is a leading Nigerian engineering contractor providing multidisciplinary solutions across GeoSolutions & Engineering (GES), Metocean & Marine (MMS), Integrated Construction (ICS), and Industrial Solutions (IS). ISO 9001:2015 & ISO 45001:2018 certified.',
    keywords: [
      'PIGL', 'PIGL Nigeria', 'PIGL Port Harcourt', 'PIGL Engineering', 'Polaris Integrated & GeoSolutions Limited',
      'engineering companies in Port Harcourt', 'technical services companies in Nigeria', 'geospatial engineering companies in Nigeria',
      'oil and gas technical service companies Nigeria', '3D laser scanning Nigeria', 'geotechnical investigation Port Harcourt',
      'marine survey Nigeria', 'pipeline construction Nigeria', 'produced water treatment Nigeria'
    ],
    h1: 'Engineering Intelligence & Subsurface Assurance',
    badge: 'ISO 9001:2015 & ISO 45001:2018 Certified Management Systems',
    breadcrumbs: [{ name: 'Home', url: '/' }]
  },

  // 2. About Us
  '/about': {
    path: '/about',
    title: 'About PIGL | Polaris Integrated & GeoSolutions Limited',
    description: 'Polaris Integrated & GeoSolutions Limited (PIGL) is an indigenous Nigerian engineering and technical solutions company headquartered in Port Harcourt, Rivers State. Learn about our leadership, ISO-certified management systems, geotechnical laboratory, and operational excellence.',
    keywords: [
      'About PIGL', 'Polaris Integrated & GeoSolutions Limited corporate profile', 'engineering contractors in Port Harcourt',
      'indigenous engineering companies Nigeria', 'ISO 9001 certified contractors Nigeria', 'ISO 45001 certified engineering Nigeria',
      'PIGL management team', 'geospatial engineering company Port Harcourt'
    ],
    h1: 'Technical Integrity for a Safer Energy Future',
    badge: 'About PIGL',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'About Us', url: '/about' }
    ]
  },

  // 3. Specialist Services Overview
  '/services': {
    path: '/services',
    title: 'Engineering Divisions & Specialist Services | PIGL',
    description: 'Explore PIGL\'s four approved operating divisions: GeoSolutions & Engineering Services (GES), Metocean & Marine Solutions (MMS), Integrated Construction Services (ICS), and Industrial Solutions (IS) serving energy, infrastructure, and maritime sectors across Nigeria.',
    keywords: [
      'PIGL services', 'engineering capabilities Nigeria', 'geosolutions Port Harcourt', 'metocean marine solutions Nigeria',
      'integrated construction services Nigeria', 'industrial solutions Nigeria', 'offshore survey support Nigeria',
      'geotechnical investigation Nigeria', 'pipeline installation contractors Nigeria'
    ],
    h1: 'Multidisciplinary Engineering Divisions',
    badge: 'Core Operating Divisions',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' }
    ]
  },

  // 4. Division 1: GeoSolutions & Engineering Services (GES)
  '/services/geosolutions-engineering-services': {
    path: '/services/geosolutions-engineering-services',
    title: 'GeoSolutions & Engineering Services (GES) | PIGL',
    description: 'PIGL GeoSolutions & Engineering Services (GES): 3D laser scanning, Leica RTC360 reality capture, 20-tonne hydraulic CPT geotechnical investigations, borehole drilling, hydrographic surveys, and marine geophysical surveys across Nigeria and the Gulf of Guinea.',
    keywords: [
      'GeoSolutions & Engineering Services', 'GES PIGL', '3D laser scanning services in Nigeria', 'reality capture companies in Nigeria',
      'geophysical survey companies in Nigeria', 'geotechnical investigation services in Nigeria', 'hydrographic survey services in Nigeria',
      '20-tonne CPT testing Nigeria', 'soil mechanics laboratory Port Harcourt', 'Leica RTC360 laser scanning', 'digital twin modelling Nigeria'
    ],
    h1: 'GeoSolutions & Engineering Services (GES)',
    badge: 'Division 01 — Subsurface & Spatial Intelligence',
    divisionId: 'geosolutions-engineering-services',
    divisionName: 'GeoSolutions & Engineering Services (GES)',
    capabilities: [
      '3D Laser Scanning & Reality Capture (Leica RTC360)',
      'Geotechnical Investigations & 20-tonne CPTu Testing',
      'Marine Geophysical Surveys & Sub-bottom Profiling',
      'Hydrographic & Multibeam Bathymetric Surveys',
      'Precise Positioning, Navigation & Rig Moves',
      'Geospatial Survey & Geomatics Mapping',
      'Soil Mechanics & Geotechnical Laboratory Services'
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'GeoSolutions & Engineering', url: '/services/geosolutions-engineering-services' }
    ]
  },

  // 5. Division 2: Metocean & Marine Solutions (MMS)
  '/services/metocean-marine-solutions': {
    path: '/services/metocean-marine-solutions',
    title: 'Metocean & Marine Solutions (MMS) | PIGL',
    description: 'PIGL Metocean & Marine Solutions (MMS): oceanographic buoy deployment, Acoustic Doppler Current Profiler (ADCP) measurements, directional wave recording, squall early warnings, metocean forecasting, and marine environmental baseline surveys across the Gulf of Guinea.',
    keywords: [
      'Metocean & Marine Solutions', 'MMS PIGL', 'metocean services Nigeria', 'oceanographic monitoring services in Nigeria',
      'marine survey companies in Nigeria', 'ADCP current measurement Nigeria', 'directional wave buoy Nigeria',
      'marine weather forecasting Gulf of Guinea', 'marine environmental baseline surveys Nigeria', 'ROV inspection services Nigeria'
    ],
    h1: 'Metocean & Marine Solutions (MMS)',
    badge: 'Division 02 — Offshore Oceanographic Intelligence',
    divisionId: 'metocean-marine-solutions',
    divisionName: 'Metocean & Marine Solutions (MMS)',
    capabilities: [
      'Oceanographic Buoy Deployment & Monitoring',
      'ADCP Current Profiling & Tidal Gauging',
      'Calibrated Marine Weather & Squall Forecasting',
      'Marine Environmental Baseline & Benthic Surveys',
      'Marine Mooring & Warranty Engineering Advisory',
      'Offshore Survey Vessel Support & Positioning'
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Metocean & Marine Solutions', url: '/services/metocean-marine-solutions' }
    ]
  },

  // 6. Division 3: Integrated Construction Services (ICS)
  '/services/integrated-construction-services': {
    path: '/services/integrated-construction-services',
    title: 'Integrated Construction Services (ICS) | PIGL',
    description: 'PIGL Integrated Construction Services (ICS): flowline and trunkline pipeline construction, swamp pipelaying, civil infrastructure, structural steel fabrication, hydrostatic testing, pipeline caliper pigging, and industrial plant commissioning in Nigeria.',
    keywords: [
      'Integrated Construction Services', 'ICS PIGL', 'pipeline construction companies in Nigeria', 'pipeline installation contractors in Nigeria',
      'flowline and trunkline installation Nigeria', 'civil infrastructure companies in Nigeria', 'mechanical fabrication contractors Port Harcourt',
      'hydrostatic pressure testing Nigeria', 'pipeline caliper pigging Nigeria', 'swamp pipeline construction Nigeria'
    ],
    h1: 'Integrated Construction Services (ICS)',
    badge: 'Division 03 — Infrastructure & Pipeline Engineering',
    divisionId: 'integrated-construction-services',
    divisionName: 'Integrated Construction Services (ICS)',
    capabilities: [
      'Swamp & Onshore Pipeline Construction & Installation',
      'Civil Infrastructure, Foundation Works & Access Roads',
      'Mechanical Piping Spool Fabrication & Equipment Alignment',
      'Non-Destructive Testing (NDT) & Field Joint Coating',
      'Hydrostatic Pressure Testing & Pipeline Caliper Pigging',
      'Plant Pre-Commissioning & Technical Handover Support'
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Integrated Construction', url: '/services/integrated-construction-services' }
    ]
  },

  // 7. Division 4: Industrial Solutions (IS)
  '/services/industrial-solutions': {
    path: '/services/industrial-solutions',
    title: 'Industrial Solutions (IS) | PIGL',
    description: 'PIGL Industrial Solutions (IS): produced water treatment packages, industrial and domestic water solutions, certified water and environmental laboratory testing, wastewater treatment, effluent treatment plants (ETP), and integrated valve maintenance across Nigeria.',
    keywords: [
      'Industrial Solutions', 'IS PIGL', 'produced water treatment services in Nigeria', 'wastewater treatment companies in Nigeria',
      'industrial water treatment services in Nigeria', 'integrated valve maintenance services in Nigeria', 'reverse osmosis desalination Nigeria',
      'effluent treatment plant Port Harcourt', 'water environmental laboratory Port Harcourt', 'oil-in-water analysis Nigeria'
    ],
    h1: 'Industrial Solutions (IS)',
    badge: 'Division 04 — Environmental & Water Infrastructure',
    divisionId: 'industrial-solutions',
    divisionName: 'Industrial Solutions (IS)',
    capabilities: [
      'Produced Water Treatment & Oil-Water Separation Packages',
      'Industrial & Domestic Water Treatment & Reverse Osmosis',
      'Certified Environmental Laboratory Testing (BOD/COD/Metals)',
      'Wastewater Treatment & Effluent Treatment Plants (ETP)',
      'Integrated Valve Maintenance, Servicing & Calibration',
      'Automated Chemical Dosing & Resource Recovery Systems'
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Industrial Solutions', url: '/services/industrial-solutions' }
    ]
  },

  // 8. Corporate Social Responsibility (CSR)
  '/csr': {
    path: '/csr',
    title: 'Corporate Social Responsibility (CSR) & Community Stewardship | PIGL',
    description: 'PIGL is dedicated to sustainable community empowerment across Rivers State and the Niger Delta through STEM education sponsorship, youth vocational engineering training, host community partnerships, and environmental stewardship.',
    keywords: [
      'PIGL CSR', 'PIGL corporate social responsibility', 'host community relations Niger Delta', 'STEM education sponsorship Nigeria',
      'local content development Nigeria', 'youth capacity building Port Harcourt', 'environmental stewardship Niger Delta',
      'community development projects Rivers State'
    ],
    h1: 'Corporate Social Responsibility & Community Stewardship',
    badge: 'Sustainable Community Impact',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'CSR & Community', url: '/csr' }
    ]
  },

  // 9. Leadership & Engineering Teams
  '/teams': {
    path: '/teams',
    title: 'Executive Leadership & Multidisciplinary Engineering Teams | PIGL',
    description: 'Meet the executive leadership and multidisciplinary engineering teams guiding PIGL operations. With extensive industry tenure, our specialists drive geotechnical, oceanographic, and infrastructure projects across West Africa.',
    keywords: [
      'PIGL executive leadership', 'PIGL management team', 'engineering leaders Port Harcourt',
      'geotechnical engineers Nigeria', 'metocean specialists Nigeria', 'survey managers Port Harcourt'
    ],
    h1: 'Multidisciplinary Leadership & Technical Specialists',
    badge: 'Engineering Leadership',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Team', url: '/teams' }
    ]
  },

  // 10. Our Professional Network & Technology Alliances
  '/network': {
    path: '/network',
    title: 'Strategic Alliances & Global Technology Partnerships | PIGL',
    description: 'PIGL maintains exclusive representations and technology partnerships with global industry leaders: Frankstar Technology (oceanographic instrumentation & buoys), CoaleXpert (geotechnical & resource analytics), and NPK Automation (industrial valves & actuation).',
    keywords: [
      'PIGL technology network', 'Frankstar Technology Nigeria', 'CoaleXpert partnership Nigeria',
      'NPK Automation authorized distributor Nigeria', 'oceanographic equipment suppliers Nigeria', 'subsea technology partners Nigeria'
    ],
    h1: 'Strategic Technology Alliances & Representations',
    badge: 'Global Engineering Partnerships',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Our Network', url: '/network' }
    ]
  },

  // 11. Careers
  '/careers': {
    path: '/careers',
    title: 'Careers in Engineering & Geosolutions | PIGL Nigeria',
    description: 'Discover career opportunities at PIGL in Port Harcourt and across our project sites in Nigeria. We recruit geotechnical engineers, hydrographic surveyors, CAD/GIS specialists, 3D laser scanning technicians, and pipeline construction supervisors.',
    keywords: [
      'PIGL careers', 'engineering jobs in Port Harcourt', 'geotechnical engineer vacancies Nigeria', 'surveyor jobs Nigeria',
      'pipeline engineer jobs Port Harcourt', 'oil and gas technical jobs Nigeria', 'PIGL graduate engineering trainee'
    ],
    h1: 'Build Your Engineering Career with PIGL',
    badge: 'Human Capital & Engineering Careers',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Careers', url: '/careers' }
    ]
  },

  // 12. HSSEQ Safety Policy
  '/hsse': {
    path: '/hsse',
    title: 'HSSEQ Standards & ISO Certifications | PIGL Safety Governance',
    description: 'Health, Safety, Security, Environment, and Quality (HSSEQ) governance at PIGL. Certified to ISO 9001:2015 and ISO 45001:2018 with over 500,000+ safe man-hours and zero Lost Time Injuries (LTI) across all onshore and offshore campaigns.',
    keywords: [
      'PIGL HSSE policy', 'ISO 9001:2015 certified contractor Nigeria', 'ISO 45001:2018 occupational safety Nigeria',
      'zero LTI engineering contractor Nigeria', 'health and safety standards Port Harcourt', 'quality management engineering Nigeria'
    ],
    h1: 'Health, Safety, Environment & Quality (HSSEQ)',
    badge: 'ISO 9001:2015 & ISO 45001:2018 Certified',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'HSSE Policy', url: '/hsse' }
    ]
  },

  // 13. Blog & Technical Insights
  '/blog': {
    path: '/blog',
    title: 'Engineering Technical Insights & Project Milestones | PIGL',
    description: 'Explore technical articles, field case studies, and engineering updates from PIGL specialists covering 3D reality capture, 20-tonne CPT soil testing, metocean buoy deployments, and pipeline installation methodologies.',
    keywords: [
      'PIGL technical blog', 'geotechnical case studies Nigeria', '3D laser scanning case study',
      'oceanographic survey insights', 'pipeline installation technical papers Nigeria', 'engineering articles Port Harcourt'
    ],
    h1: 'Technical Insights & Engineering Milestones',
    badge: 'Engineering Knowledge Base',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' }
    ]
  },

  // 14. Operations & Corporate Video Hub
  '/videos': {
    path: '/videos',
    title: 'Official Video Showcase & Corporate Documentary | PIGL',
    description: 'Watch PIGL in action: corporate documentary, sub-centimeter 3D laser scanning field demos, 20-tonne CPT geotechnical soil testing, metocean buoy mobilisations, and pipeline construction in Nigeria.',
    keywords: [
      'PIGL corporate video', 'geotechnical drilling video Nigeria', '3D laser scan demo Nigeria',
      'PIGL corporate documentary', 'pipeline construction video Port Harcourt', 'metocean survey footage'
    ],
    h1: 'Engineering in Action — Video Showcase',
    badge: 'Technical Video Library',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Videos', url: '/videos' }
    ]
  },

  // 15. Contact Us
  '/contact': {
    path: '/contact',
    title: 'Contact PIGL | Engineering Headquarters in Port Harcourt, Nigeria',
    description: 'Contact Polaris Integrated & GeoSolutions Limited (PIGL) for engineering project scoping, tender inquiries, and technical consultation. Headquarters: #3 Diamond Close, Castle & Green Estate, Off Eneka Link Road, Port Harcourt, Rivers State, Nigeria.',
    keywords: [
      'Contact PIGL', 'Polaris Integrated & GeoSolutions Limited contact', 'engineering company address Port Harcourt',
      'geotechnical company phone number Nigeria', 'PIGL office location Rivers State', 'PIGL email hello@polarisigl.com'
    ],
    h1: 'Contact Our Engineering Headquarters',
    badge: 'Port Harcourt Headquarters & Operations',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contact', url: '/contact' }
    ]
  },

  // 16. Vendor Hub
  '/vendors': {
    path: '/vendors',
    title: 'Vendor Onboarding & Compliance Portal | PIGL Procurement',
    description: 'Official digital vendor registration and tax compliance portal for contractors, original equipment manufacturers (OEMs), and technical service providers partnering with Polaris Integrated & GeoSolutions Limited (PIGL).',
    keywords: [
      'PIGL vendor registration', 'Polaris Integrated vendor onboarding', 'PIGL procurement portal',
      'Form PIGL/F/VOTC/AHR/037', 'contractor prequalification Port Harcourt', 'vendor compliance Nigeria'
    ],
    h1: 'Vendor Onboarding & Procurement Portal',
    badge: 'Supply Chain & Procurement',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Vendors', url: '/vendors' }
    ]
  }
};

/**
 * Helper to retrieve SEO configuration for any path with fallback
 */
export function getSEOForPath(pathname: string): PageSEORecord {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (MASTER_SEO_CONFIG[clean]) {
    return MASTER_SEO_CONFIG[clean];
  }

  // Handle service aliases
  if (clean.startsWith('/services/')) {
    const slug = clean.split('/services/')[1];
    // Check direct division match
    const divisionPath = `/services/${slug}`;
    if (MASTER_SEO_CONFIG[divisionPath]) {
      return MASTER_SEO_CONFIG[divisionPath];
    }
  }

  // Generic fallback
  return {
    path: clean,
    title: `${clean.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | PIGL`,
    description: `Engineering solutions and technical capabilities from Polaris Integrated & GeoSolutions Limited (PIGL), Port Harcourt, Nigeria.`,
    keywords: ['PIGL', 'Polaris Integrated & GeoSolutions Limited', 'engineering Nigeria'],
    h1: clean.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: clean.replace(/^\//, '').replace(/-/g, ' '), url: clean }
    ]
  };
}
