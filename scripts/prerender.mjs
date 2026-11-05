import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('Dist directory does not exist. Run vite build first.');
  process.exit(1);
}

const templatePath = path.join(distDir, 'index.html');
const baseHtml = fs.readFileSync(templatePath, 'utf8');

// Full Comprehensive List of Public Pre-Rendered Routes for PIGL
const routes = [
  {
    path: '/',
    title: 'PIGL | Polaris Integrated & GeoSolutions Limited - Engineering & Subsurface Intelligence',
    description: 'Polaris Integrated & GeoSolutions Limited (PIGL) is a leading Nigerian engineering contractor providing multidisciplinary solutions across GeoSolutions & Engineering (GES), Metocean & Marine (MMS), Integrated Construction (ICS), and Industrial Solutions (IS). ISO 9001:2015 & ISO 45001:2018 certified.',
    badge: 'ISO 9001:2015 & ISO 45001:2018 Certified Management Systems',
    h1: 'Engineering Intelligence & Subsurface Assurance',
    intro: 'Polaris Integrated & GeoSolutions Limited (PIGL) delivers multidisciplinary engineering services across four operating divisions: GeoSolutions & Engineering (GES), Metocean & Marine (MMS), Integrated Construction (ICS), and Industrial Solutions (IS).',
    sectionsHtml: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
        <article style="padding: 1.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;">
          <h2 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; margin-bottom: 0.75rem;">
            <a href="/services/geosolutions-engineering-services" style="color: #34d399; text-decoration: none;">01. GeoSolutions & Engineering Services (GES)</a>
          </h2>
          <p style="color: #94a3b8; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem;">
            PIGL undertakes geophysical and hydrographic surveys, geotechnical investigations, positioning, geospatial data acquisition, Leica RTC360 3D laser scanning, and reality capture to support engineering design and infrastructure development.
          </p>
          <a href="/services/geosolutions-engineering-services" style="color: #10b981; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none;">View Capabilities &rarr;</a>
        </article>
        <article style="padding: 1.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;">
          <h2 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; margin-bottom: 0.75rem;">
            <a href="/services/metocean-marine-solutions" style="color: #34d399; text-decoration: none;">02. Metocean & Marine Solutions (MMS)</a>
          </h2>
          <p style="color: #94a3b8; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem;">
            We provide marine observation, oceanographic monitoring, forecasting and environmental survey services to support offshore planning, marine operations and environmental assessment in the Gulf of Guinea.
          </p>
          <a href="/services/metocean-marine-solutions" style="color: #10b981; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none;">View Capabilities &rarr;</a>
        </article>
        <article style="padding: 1.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;">
          <h2 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; margin-bottom: 0.75rem;">
            <a href="/services/integrated-construction-services" style="color: #34d399; text-decoration: none;">03. Integrated Construction Services (ICS)</a>
          </h2>
          <p style="color: #94a3b8; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem;">
            We undertake pipeline installation, civil infrastructure, mechanical fabrication and installation, and construction support for industrial and energy projects across Nigeria.
          </p>
          <a href="/services/integrated-construction-services" style="color: #10b981; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none;">View Capabilities &rarr;</a>
        </article>
        <article style="padding: 1.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;">
          <h2 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; margin-bottom: 0.75rem;">
            <a href="/services/industrial-solutions" style="color: #34d399; text-decoration: none;">04. Industrial Solutions (IS)</a>
          </h2>
          <p style="color: #94a3b8; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem;">
            We provide produced-water treatment, industrial and domestic water systems, laboratory analysis, wastewater treatment, and integrated valve maintenance services for industrial applications.
          </p>
          <a href="/services/industrial-solutions" style="color: #10b981; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none;">View Capabilities &rarr;</a>
        </article>
      </div>
    `
  },
  {
    path: '/services',
    title: 'Engineering Divisions & Specialist Services | PIGL',
    description: 'Explore PIGL\'s four approved operating divisions: GeoSolutions & Engineering Services (GES), Metocean & Marine Solutions (MMS), Integrated Construction Services (ICS), and Industrial Solutions (IS) serving energy, infrastructure, and maritime sectors across Nigeria.',
    badge: 'Core Operating Divisions',
    h1: 'Multidisciplinary Engineering Divisions',
    intro: 'Four approved operating divisions delivering precision engineering, subsurface characterisation, marine observation, and industrial water infrastructure.',
    sectionsHtml: `
      <section style="margin-bottom: 2rem;">
        <h2 style="color: #34d399; font-size: 1.4rem;">PIGL Technical Service Scope</h2>
        <p style="color: #cbd5e1; line-height: 1.7;">
          Operating from Port Harcourt, Rivers State, PIGL deploys advanced instrumentation including Leica RTC360 3D laser scanners, 20-tonne hydraulic CPT equipment, oceanographic monitoring buoys, and pipeline construction spreads.
        </p>
      </section>
    `
  },
  {
    path: '/services/geosolutions-engineering-services',
    title: 'GeoSolutions & Engineering Services (GES) | PIGL',
    description: 'PIGL GeoSolutions & Engineering Services (GES): 3D laser scanning, Leica RTC360 reality capture, 20-tonne hydraulic CPT geotechnical investigations, borehole drilling, hydrographic surveys, and marine geophysical surveys across Nigeria and the Gulf of Guinea.',
    badge: 'Division 01 — Subsurface & Spatial Intelligence',
    h1: 'GeoSolutions & Engineering Services (GES)',
    intro: 'High-precision geospatial surveys, geotechnical investigations, marine geophysics, and sub-centimeter 3D reality capture for energy and infrastructure projects.',
    sectionsHtml: `
      <section style="margin-bottom: 2rem;">
        <h2 style="color: #34d399; font-size: 1.4rem;">Core Technical Capabilities</h2>
        <ul style="color: #cbd5e1; line-height: 1.8; padding-left: 1.25rem;">
          <li>3D Laser Scanning & Reality Capture using Leica RTC360 equipment (sub-centimeter point cloud acquisition)</li>
          <li>Geotechnical Investigations, 20-tonne hydraulic Cone Penetration Testing (CPTu), and deep borehole drilling</li>
          <li>Marine Geophysical Surveys, high-resolution shallow seismic, sub-bottom profiling, and side-scan sonar</li>
          <li>Hydrographic Surveys, multibeam and single-beam bathymetry, and seabed obstacle mapping</li>
          <li>Precise Positioning, Navigation, DGPS, and offshore rig and barge move support</li>
          <li>Certified Soil Mechanics Laboratory analysis and geotechnical engineering reports</li>
        </ul>
      </section>
    `
  },
  {
    path: '/services/metocean-marine-solutions',
    title: 'Metocean & Marine Solutions (MMS) | PIGL',
    description: 'PIGL Metocean & Marine Solutions (MMS): oceanographic buoy deployment, Acoustic Doppler Current Profiler (ADCP) measurements, directional wave recording, squall early warnings, metocean forecasting, and marine environmental baseline surveys across the Gulf of Guinea.',
    badge: 'Division 02 — Offshore Oceanographic Intelligence',
    h1: 'Metocean & Marine Solutions (MMS)',
    intro: 'Continuous oceanographic monitoring, hydrodynamic modelling, and offshore environmental surveys supporting marine engineering and drilling operations.',
    sectionsHtml: `
      <section style="margin-bottom: 2rem;">
        <h2 style="color: #34d399; font-size: 1.4rem;">Core Technical Capabilities</h2>
        <ul style="color: #cbd5e1; line-height: 1.8; padding-left: 1.25rem;">
          <li>Oceanographic Buoy Deployment, real-time wave, wind, and current monitoring</li>
          <li>Acoustic Doppler Current Profiler (ADCP) column profiling and tidal gauging</li>
          <li>Calibrated Marine Weather & Squall Forecasting for offshore vessel and drilling operations</li>
          <li>Marine Environmental Baseline Surveys, CTD profiling, and benthic sediment grab sampling</li>
          <li>Marine Mooring Analysis and Marine Warranty Survey Advisory</li>
        </ul>
      </section>
    `
  },
  {
    path: '/services/integrated-construction-services',
    title: 'Integrated Construction Services (ICS) | PIGL',
    description: 'PIGL Integrated Construction Services (ICS): flowline and trunkline pipeline construction, swamp pipelaying, civil infrastructure, structural steel fabrication, hydrostatic testing, pipeline caliper pigging, and industrial plant commissioning in Nigeria.',
    badge: 'Division 03 — Infrastructure & Pipeline Engineering',
    h1: 'Integrated Construction Services (ICS)',
    intro: 'Engineering, fabrication, pipeline installation, and civil infrastructure construction across onshore and swamp terrains in Nigeria.',
    sectionsHtml: `
      <section style="margin-bottom: 2rem;">
        <h2 style="color: #34d399; font-size: 1.4rem;">Core Technical Capabilities</h2>
        <ul style="color: #cbd5e1; line-height: 1.8; padding-left: 1.25rem;">
          <li>Swamp and Onshore Pipeline Construction, Flowline and Trunkline installation</li>
          <li>Civil Infrastructure, industrial foundations, reinforced concrete bund walls, and access roads</li>
          <li>Mechanical Piping Spool Fabrication, structural steel erection, and equipment alignment</li>
          <li>Hydrostatic Pressure Testing, Caliper Pigging, Nitrogen Purging, and Pre-Commissioning</li>
        </ul>
      </section>
    `
  },
  {
    path: '/services/industrial-solutions',
    title: 'Industrial Solutions (IS) | PIGL',
    description: 'PIGL Industrial Solutions (IS): produced water treatment packages, industrial and domestic water solutions, certified water and environmental laboratory testing, wastewater treatment, effluent treatment plants (ETP), and integrated valve maintenance across Nigeria.',
    badge: 'Division 04 — Environmental & Water Infrastructure',
    h1: 'Industrial Solutions (IS)',
    intro: 'Industrial water treatment systems, produced water conditioning, certified environmental laboratory analysis, and valve maintenance.',
    sectionsHtml: `
      <section style="margin-bottom: 2rem;">
        <h2 style="color: #34d399; font-size: 1.4rem;">Core Technical Capabilities</h2>
        <ul style="color: #cbd5e1; line-height: 1.8; padding-left: 1.25rem;">
          <li>Produced Water Treatment Systems and coalescing oil-water separation skids</li>
          <li>Industrial and Domestic Water Treatment, Reverse Osmosis (RO) desalination, and filtration plants</li>
          <li>Certified Environmental Testing Laboratory (BOD, COD, oil-in-water, heavy metals)</li>
          <li>Wastewater Treatment, Effluent Treatment Plants (ETP), and chemical dosing systems</li>
          <li>Integrated Valve Maintenance, servicing, actuator calibration, and testing</li>
        </ul>
      </section>
    `
  },
  {
    path: '/about',
    title: 'About PIGL | Polaris Integrated & GeoSolutions Limited',
    description: 'Polaris Integrated & GeoSolutions Limited (PIGL) is an indigenous Nigerian engineering and technical solutions company headquartered in Port Harcourt, Rivers State. Learn about our leadership, ISO-certified management systems, geotechnical laboratory, and operational excellence.',
    badge: 'Corporate Profile',
    h1: 'Technical Integrity for a Safer Energy Future',
    intro: 'PIGL is an ISO 9001:2015 and ISO 45001:2018 certified engineering company delivering precision engineering solutions across Nigeria.',
    sectionsHtml: `
      <section style="margin-bottom: 2rem;">
        <h2 style="color: #34d399; font-size: 1.4rem;">Operational Excellence & Port Harcourt Headquarters</h2>
        <p style="color: #cbd5e1; line-height: 1.7;">
          Headquartered at #3 Diamond Close, Castle & Green Estate, Off Eneka Link Road, Port Harcourt, Rivers State, PIGL maintains comprehensive engineering facilities including soil mechanics and water analysis laboratories, survey logistics quays, and specialized equipment fleets.
        </p>
      </section>
    `
  },
  {
    path: '/csr',
    title: 'Corporate Social Responsibility (CSR) & Community Stewardship | PIGL',
    description: 'PIGL is dedicated to sustainable community empowerment across Rivers State and the Niger Delta through STEM education sponsorship, youth vocational engineering training, host community partnerships, and environmental stewardship.',
    badge: 'Corporate Social Responsibility',
    h1: 'Corporate Social Responsibility & Community Stewardship',
    intro: 'Building lasting value for host communities through STEM education, local content capacity building, and environmental conservation in Nigeria.',
    sectionsHtml: `
      <section style="margin-bottom: 2rem;">
        <h2 style="color: #34d399; font-size: 1.4rem;">Community Stewardship Pillars</h2>
        <ul style="color: #cbd5e1; line-height: 1.8; padding-left: 1.25rem;">
          <li>STEM Education & University Engineering Mentorship across Rivers State</li>
          <li>Local Content & Host Community Apprenticeship (85%+ local Niger Delta workforce)</li>
          <li>Environmental Protection & Zero-Spill Ecological Field Governance</li>
          <li>Clean Potable Water Infrastructure Projects for Riverine Host Communities</li>
        </ul>
      </section>
    `
  },
  {
    path: '/teams',
    title: 'Executive Leadership & Multidisciplinary Engineering Teams | PIGL',
    description: 'Meet the executive leadership and multidisciplinary engineering teams guiding PIGL operations. With extensive industry tenure, our specialists drive geotechnical, oceanographic, and infrastructure projects across West Africa.',
    badge: 'Leadership & Talent',
    h1: 'Executive Leadership & Multidisciplinary Specialists',
    intro: 'Multidisciplinary engineering directors, geotechnical consultants, metocean oceanographers, and project managers leading operations in West Africa.',
    sectionsHtml: `
      <section style="margin-bottom: 2rem;">
        <h2 style="color: #34d399; font-size: 1.4rem;">Multidisciplinary Capability</h2>
        <p style="color: #cbd5e1; line-height: 1.7;">
          Our leadership combines decades of international and indigenous offshore experience, ensuring world-class technical execution on every contract.
        </p>
      </section>
    `
  },
  {
    path: '/network',
    title: 'Strategic Alliances & Global Technology Partnerships | PIGL',
    description: 'PIGL maintains exclusive representations and technology partnerships with global industry leaders: Frankstar Technology (oceanographic instrumentation & buoys), CoaleXpert (geotechnical & resource analytics), and NPK Automation (industrial valves & actuation).',
    badge: 'Global Alliances',
    h1: 'Strategic Technology Alliances & Representations',
    intro: 'Partnering with world-class original equipment manufacturers to bring advanced oceanographic, geotechnical, and automation technologies to Nigeria.',
    sectionsHtml: `
      <section style="margin-bottom: 2rem;">
        <h2 style="color: #34d399; font-size: 1.4rem;">Authorized Technology Partners</h2>
        <ul style="color: #cbd5e1; line-height: 1.8; padding-left: 1.25rem;">
          <li>Frankstar Technology — Oceanographic buoys, ADCPs, and metocean telemetry</li>
          <li>CoaleXpert — Subsurface analytics, laboratory instrumentation, and modeling</li>
          <li>NPK Automation — High-performance industrial valves and pneumatic actuators</li>
        </ul>
      </section>
    `
  },
  {
    path: '/contact',
    title: 'Contact PIGL | Engineering Headquarters in Port Harcourt, Nigeria',
    description: 'Contact Polaris Integrated & GeoSolutions Limited (PIGL) for engineering project scoping, tender inquiries, and technical consultation. Headquarters: #3 Diamond Close, Castle & Green Estate, Off Eneka Link Road, Port Harcourt, Rivers State, Nigeria.',
    badge: 'Commercial Scoping & Inquiries',
    h1: 'Contact Our Engineering Headquarters',
    intro: 'Connect with our engineering desks in Port Harcourt for project feasibility, commercial proposals, and rapid field mobilisation.',
    sectionsHtml: `
      <section style="margin-bottom: 2rem;">
        <h2 style="color: #34d399; font-size: 1.4rem;">Port Harcourt Operational Headquarters</h2>
        <p style="color: #cbd5e1; line-height: 1.7;">
          #3 Diamond Close, Castle & Green Estate, Off Eneka Link Road, Port Harcourt, Rivers State, Nigeria.<br>
          Telephone: +234-809-7081-333 | Email: hello@polarisigl.com
        </p>
      </section>
    `
  },
  {
    path: '/careers',
    title: 'Careers in Engineering & Geosolutions | PIGL Nigeria',
    description: 'Discover career opportunities at PIGL in Port Harcourt and across our project sites in Nigeria. We recruit geotechnical engineers, hydrographic surveyors, CAD/GIS specialists, 3D laser scanning technicians, and pipeline construction supervisors.',
    badge: 'Talent Acquisition',
    h1: 'Build Your Engineering Career with PIGL',
    intro: 'Join an indigenous Nigerian engineering leader where innovation, technical integrity, and safety drive career growth.',
    sectionsHtml: `
      <section style="margin-bottom: 2rem;">
        <h2 style="color: #34d399; font-size: 1.4rem;">Disciplines in Demand</h2>
        <p style="color: #cbd5e1; line-height: 1.7;">
          Geotechnical engineers, hydrographic surveyors, geophysicists, 3D laser scanning technicians, pipeline welding inspectors, and water treatment specialists.
        </p>
      </section>
    `
  },
  {
    path: '/hsse',
    title: 'HSSEQ Standards & ISO Certifications | PIGL Safety Governance',
    description: 'Health, Safety, Security, Environment, and Quality (HSSEQ) governance at PIGL. Certified to ISO 9001:2015 and ISO 45001:2018 with over 500,000+ safe man-hours and zero Lost Time Injuries (LTI) across all onshore and offshore campaigns.',
    badge: 'Safety First Culture',
    h1: 'Health, Safety, Environment & Quality (HSSEQ)',
    intro: 'Safety is built into every project: 500,000+ safe man-hours with zero Lost Time Injuries (LTI) across all field operations.',
    sectionsHtml: `
      <section style="margin-bottom: 2rem;">
        <h2 style="color: #34d399; font-size: 1.4rem;">Certified Management Systems</h2>
        <p style="color: #cbd5e1; line-height: 1.7;">
          PIGL operates under audited ISO 9001:2015 (Quality) and ISO 45001:2018 (Occupational Health & Safety) systems, ensuring total compliance on energy and infrastructure sites.
        </p>
      </section>
    `
  },
  {
    path: '/videos',
    title: 'Official Video Showcase & Corporate Documentary | PIGL',
    description: 'Watch PIGL in action: corporate documentary, sub-centimeter 3D laser scanning field demos, 20-tonne CPT geotechnical soil testing, metocean buoy mobilisations, and pipeline construction in Nigeria.',
    badge: 'Multimedia Showcase',
    h1: 'Engineering in Action — Video Showcase',
    intro: 'Watch official corporate documentaries, field demonstrations, 3D laser scanning point cloud workflows, and offshore geotechnical operations.',
    sectionsHtml: `
      <section style="margin-bottom: 2rem;">
        <h2 style="color: #34d399; font-size: 1.4rem;">Featured Demonstrations</h2>
        <p style="color: #cbd5e1; line-height: 1.7;">
          Explore our video library featuring Leica RTC360 reality capture demonstrations, 20-tonne hydraulic CPT testing, and pipeline welding in swamp terrain.
        </p>
      </section>
    `
  },
  {
    path: '/blog',
    title: 'Engineering Technical Insights & Project Milestones | PIGL',
    description: 'Explore technical articles, field case studies, and engineering updates from PIGL specialists covering 3D reality capture, 20-tonne CPT soil testing, metocean buoy deployments, and pipeline installation methodologies.',
    badge: 'Technical Publications',
    h1: 'Engineering Insights & Technical Articles',
    intro: 'Technical perspectives, case studies, and engineering updates from PIGL engineering desks in Port Harcourt.',
    sectionsHtml: `
      <section style="margin-bottom: 2rem;">
        <h2 style="color: #34d399; font-size: 1.4rem;">Articles & Case Studies</h2>
        <p style="color: #cbd5e1; line-height: 1.7;">
          In-depth technical publications on geotechnical investigations, reality capture workflows, metocean telemetry, and pipeline swamp construction.
        </p>
      </section>
    `
  },
  {
    path: '/vendors',
    title: 'Vendor Onboarding & Compliance Portal | PIGL Procurement',
    description: 'Official digital vendor registration and tax compliance portal for contractors, original equipment manufacturers (OEMs), and technical service providers partnering with Polaris Integrated & GeoSolutions Limited (PIGL).',
    badge: 'Procurement & Supply Chain',
    h1: 'Vendor Onboarding & Procurement Portal',
    intro: 'Pre-qualification and compliance portal for contractors, OEMs, and technical suppliers partnering with PIGL.',
    sectionsHtml: `
      <section style="margin-bottom: 2rem;">
        <h2 style="color: #34d399; font-size: 1.4rem;">Registration Form PIGL/F/VOTC/AHR/037</h2>
        <p style="color: #cbd5e1; line-height: 1.7;">
          Submit corporate pre-qualification documents, tax clearances, DPR/NUPRC permits, and HSE policies for approval by PIGL Procurement.
        </p>
      </section>
    `
  }
];

function generateHtmlForRoute(config) {
  let html = baseHtml;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/s, `<title>${config.title}</title>`);

  // Replace Meta Title Tag
  html = html.replace(
    /<meta\s+name=["']title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="title" content="${config.title}">`
  );

  // Replace Meta Description
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="description" content="${config.description}">`
  );

  // Replace Canonical Link
  const canonicalUrl = `https://polarisigl.com${config.path === '/' ? '/' : config.path}`;
  html = html.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}">`
  );

  // Replace OpenGraph Title & Description & URL & Site Name
  html = html.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:title" content="${config.title}">`
  );
  html = html.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:description" content="${config.description}">`
  );
  html = html.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:url" content="${canonicalUrl}">`
  );
  html = html.replace(
    /<meta\s+property=["']og:site_name["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:site_name" content="PIGL | Polaris Integrated & GeoSolutions Limited">`
  );

  // Replace Twitter Title & Description & URL
  html = html.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:title" content="${config.title}">`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:description" content="${config.description}">`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:url["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:url" content="${canonicalUrl}">`
  );

  // Inject Breadcrumbs Schema
  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: config.path === '/' ? [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://polarisigl.com/' }
    ] : [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://polarisigl.com/' },
      { '@type': 'ListItem', position: 2, name: config.badge || config.h1, item: canonicalUrl }
    ]
  };

  const breadcrumbsTag = `<script type="application/ld+json" id="route-breadcrumb-schema">${JSON.stringify(breadcrumbsSchema)}</script>`;
  html = html.replace('</head>', `  ${breadcrumbsTag}\n</head>`);

  // Replace Fallback Semantic Shell inside <noscript id="crawlable-semantic-shell">
  const noscriptContent = `
  <noscript id="crawlable-semantic-shell">
    <div style="background-color: #020617; color: #f8fafc; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 2rem;">
      <header style="border-bottom: 1px solid #1e293b; padding-bottom: 1.5rem; margin-bottom: 2rem;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <a href="/" style="color: #10b981; font-weight: 800; font-size: 1.25rem; text-decoration: none; letter-spacing: 0.05em;">
            PIGL <span style="color: #cbd5e1; font-weight: 500;">| Polaris Integrated &amp; GeoSolutions Limited</span>
          </a>
          <nav style="display: flex; gap: 1.25rem; flex-wrap: wrap; font-size: 0.9rem;">
            <a href="/" style="color: #94a3b8; text-decoration: none;">Home</a>
            <a href="/about" style="color: #94a3b8; text-decoration: none;">About Us</a>
            <a href="/services" style="color: #94a3b8; text-decoration: none;">Services</a>
            <a href="/csr" style="color: #34d399; text-decoration: none; font-weight: 600;">CSR</a>
            <a href="/teams" style="color: #94a3b8; text-decoration: none;">Team</a>
            <a href="/careers" style="color: #94a3b8; text-decoration: none;">Careers</a>
            <a href="/network" style="color: #94a3b8; text-decoration: none;">Our Network</a>
            <a href="/blog" style="color: #94a3b8; text-decoration: none;">Blog</a>
            <a href="/contact" style="color: #94a3b8; text-decoration: none;">Contact</a>
          </nav>
        </div>
      </header>

      <main style="max-width: 1200px; margin: 0 auto;">
        <div style="max-width: 900px;">
          ${config.badge ? `<div style="display: inline-block; padding: 0.35rem 0.85rem; border-radius: 9999px; background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.8rem; font-weight: 600; margin-bottom: 1.25rem; border: 1px solid rgba(16, 185, 129, 0.3);">
            ${config.badge}
          </div>` : ''}
          <h1 style="font-size: 2.25rem; font-weight: 800; line-height: 1.25; margin: 0 0 1.25rem 0; color: #f8fafc;">
            ${config.h1}
          </h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: #94a3b8; margin-bottom: 2rem;">
            ${config.intro}
          </p>

          ${config.sectionsHtml}

          <div style="border-top: 1px solid #1e293b; padding-top: 1.5rem; color: #94a3b8; font-size: 0.875rem;">
            <p style="font-weight: 600; color: #f8fafc; margin-bottom: 0.25rem;">Operating Headquarters &amp; Laboratory:</p>
            <address style="font-style: normal; margin-bottom: 0.5rem;">#3 Diamond Close, Castle &amp; Green Estate, Off Eneka Link Road, Port Harcourt, Rivers State, Nigeria</address>
            <p style="margin: 0;">Telephone: <a href="tel:+2348097081333" style="color: #34d399; text-decoration: none;">+234-809-7081-333</a> | Email: <a href="mailto:hello@polarisigl.com" style="color: #34d399; text-decoration: none;">hello@polarisigl.com</a></p>
          </div>
        </div>
      </main>
    </div>
  </noscript>`;

  html = html.replace(/<noscript id="crawlable-semantic-shell">[\s\S]*?<\/noscript>/, noscriptContent.trim());

  return html;
}

let generatedCount = 0;

for (const route of routes) {
  const pageHtml = generateHtmlForRoute(route);
  let targetFile;

  if (route.path === '/') {
    targetFile = path.join(distDir, 'index.html');
  } else {
    const routeDir = path.join(distDir, route.path.replace(/^\//, ''));
    fs.mkdirSync(routeDir, { recursive: true });
    targetFile = path.join(routeDir, 'index.html');
  }

  fs.writeFileSync(targetFile, pageHtml, 'utf8');
  console.log(`[prerender] Generated static route: ${route.path} -> ${path.relative(distDir, targetFile)}`);
  generatedCount++;
}

console.log(`[prerender] Successfully generated ${generatedCount} static routes with distinct titles, descriptions, canonical URLs, and H1s.`);
