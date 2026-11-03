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

// Pure JS prerender script
const routes = [
  {
    path: '/',
    title: 'Polaris Integrated & GeoSolutions (PIGL) | Geoscience, Marine, Construction & Industrial Solutions',
    description: 'Polaris Integrated & GeoSolutions Limited provides geoscience and survey services, marine observation, infrastructure construction and industrial water treatment for energy, infrastructure and industrial clients in Nigeria.',
    badge: 'ISO 9001:2015 & ISO 45001:2018 Certified Management Systems',
    h1: 'About PIGL',
    intro: 'Polaris Integrated & GeoSolutions Limited provides geoscience and survey services, marine observation, infrastructure construction and industrial water treatment for energy, infrastructure and industrial clients.',
    sectionsHtml: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
        <article style="padding: 1.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;">
          <h2 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; margin-bottom: 0.75rem;">
            <a href="/services/geosolutions-engineering-services" style="color: #34d399; text-decoration: none;">01. GeoSolutions & Engineering Services (GES)</a>
          </h2>
          <p style="color: #94a3b8; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem;">
            PIGL undertakes geophysical and hydrographic surveys, geotechnical investigations, positioning, geospatial data acquisition and reality capture to support engineering design and infrastructure development.
          </p>
          <a href="/services/geosolutions-engineering-services" style="color: #10b981; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none;">View Capabilities &rarr;</a>
        </article>
        <article style="padding: 1.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;">
          <h2 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; margin-bottom: 0.75rem;">
            <a href="/services/metocean-marine-solutions" style="color: #34d399; text-decoration: none;">02. Metocean & Marine Solutions (MMS)</a>
          </h2>
          <p style="color: #94a3b8; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem;">
            We provide marine observation, oceanographic monitoring, forecasting and environmental survey services to support offshore planning, marine operations and environmental assessment.
          </p>
          <a href="/services/metocean-marine-solutions" style="color: #10b981; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none;">View Capabilities &rarr;</a>
        </article>
        <article style="padding: 1.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;">
          <h2 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; margin-bottom: 0.75rem;">
            <a href="/services/integrated-construction-services" style="color: #34d399; text-decoration: none;">03. Integrated Construction Services (ICS)</a>
          </h2>
          <p style="color: #94a3b8; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem;">
            We undertake pipeline installation, civil infrastructure, mechanical fabrication and installation, and construction support for industrial and energy projects.
          </p>
          <a href="/services/integrated-construction-services" style="color: #10b981; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none;">View Capabilities &rarr;</a>
        </article>
        <article style="padding: 1.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;">
          <h2 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; margin-bottom: 0.75rem;">
            <a href="/services/industrial-solutions" style="color: #34d399; text-decoration: none;">04. Industrial Solutions (IS)</a>
          </h2>
          <p style="color: #94a3b8; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem;">
            We provide produced-water treatment, industrial and domestic water systems, laboratory analysis and wastewater treatment services for industrial and environmental applications.
          </p>
          <a href="/services/industrial-solutions" style="color: #10b981; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none;">View Capabilities &rarr;</a>
        </article>
      </div>
    `
  },
  {
    path: '/services',
    title: 'Specialist Engineering Divisions | PIGL Nigeria',
    description: 'Explore PIGL\'s four operating divisions: GeoSolutions & Engineering Services (GES), Metocean & Marine Solutions (MMS), Integrated Construction Services (ICS), and Industrial Solutions (IS).',
    badge: 'Four Operating Divisions',
    h1: 'Our Services',
    intro: 'Polaris Integrated & GeoSolutions Limited delivers multidisciplinary engineering services across four divisions covering land, swamp, and offshore energy corridors.',
    sectionsHtml: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
        <article style="padding: 1.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-top: 0; margin-bottom: 0.75rem;">
            <a href="/services/geosolutions-engineering-services" style="color: #34d399; text-decoration: none;">01. GeoSolutions & Engineering Services (GES)</a>
          </h2>
          <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.25rem;">
            PIGL undertakes geophysical and hydrographic surveys, geotechnical investigations, positioning, geospatial data acquisition and reality capture to support engineering design and infrastructure development.
          </p>
          <ul style="color: #cbd5e1; font-size: 0.85rem; padding-left: 1.25rem; margin-bottom: 1.25rem; line-height: 1.6;">
            <li>Geohazard, Geoscan & Seismic Surveys</li>
            <li>20-Tonne Hydraulic CPT Testing & Deep Boreholes</li>
            <li>Precise Positioning & Navigation</li>
            <li>Leica RTC360 3D Reality Capture & Digital Twins</li>
          </ul>
          <a href="/services/geosolutions-engineering-services" style="color: #10b981; font-weight: 600; text-decoration: none;">Explore GES Division &rarr;</a>
        </article>
        <article style="padding: 1.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-top: 0; margin-bottom: 0.75rem;">
            <a href="/services/metocean-marine-solutions" style="color: #34d399; text-decoration: none;">02. Metocean & Marine Solutions (MMS)</a>
          </h2>
          <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.25rem;">
            We provide marine observation, oceanographic monitoring, forecasting and environmental survey services to support offshore planning, marine operations and environmental assessment.
          </p>
          <ul style="color: #cbd5e1; font-size: 0.85rem; padding-left: 1.25rem; margin-bottom: 1.25rem; line-height: 1.6;">
            <li>Oceanographic Buoy Telemetry</li>
            <li>Acoustic Doppler Current Profiler (ADCP) Measurements</li>
            <li>Marine Weather Forecasting & Metocean Data</li>
            <li>Marine Environmental Baseline Surveys</li>
          </ul>
          <a href="/services/metocean-marine-solutions" style="color: #10b981; font-weight: 600; text-decoration: none;">Explore MMS Division &rarr;</a>
        </article>
        <article style="padding: 1.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-top: 0; margin-bottom: 0.75rem;">
            <a href="/services/integrated-construction-services" style="color: #34d399; text-decoration: none;">03. Integrated Construction Services (ICS)</a>
          </h2>
          <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.25rem;">
            We undertake pipeline installation, civil infrastructure, mechanical fabrication and installation, and construction support for industrial and energy projects.
          </p>
          <ul style="color: #cbd5e1; font-size: 0.85rem; padding-left: 1.25rem; margin-bottom: 1.25rem; line-height: 1.6;">
            <li>Pipeline Construction & HDD Spool Installations</li>
            <li>Heavy Industrial Civil Infrastructure & Piling</li>
            <li>Structural Mechanical Piping Fabrication</li>
            <li>Engineering & Construction Support in Swamp Terrain</li>
          </ul>
          <a href="/services/integrated-construction-services" style="color: #10b981; font-weight: 600; text-decoration: none;">Explore ICS Division &rarr;</a>
        </article>
        <article style="padding: 1.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;">
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-top: 0; margin-bottom: 0.75rem;">
            <a href="/services/industrial-solutions" style="color: #34d399; text-decoration: none;">04. Industrial Solutions (IS)</a>
          </h2>
          <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.25rem;">
            We provide produced-water treatment, industrial and domestic water systems, laboratory analysis and wastewater treatment services for industrial and environmental applications.
          </p>
          <ul style="color: #cbd5e1; font-size: 0.85rem; padding-left: 1.25rem; margin-bottom: 1.25rem; line-height: 1.6;">
            <li>CoaleXpert Produced Water Treatment Skids</li>
            <li>Industrial & Domestic Potable Water Plants</li>
            <li>Water Quality & Environmental Laboratory Testing</li>
            <li>Wastewater Recovery & Effluent Remediation</li>
          </ul>
          <a href="/services/industrial-solutions" style="color: #10b981; font-weight: 600; text-decoration: none;">Explore IS Division &rarr;</a>
        </article>
      </div>
    `
  },
  {
    path: '/services/geosolutions-engineering-services',
    title: 'GeoSolutions & Engineering Services | PIGL',
    description: 'PIGL undertakes geophysical and hydrographic surveys, geotechnical investigations, positioning, geospatial data acquisition and reality capture to support engineering design and infrastructure development.',
    badge: 'Division 01 — GES',
    h1: 'GeoSolutions & Engineering Services',
    intro: 'PIGL undertakes geophysical and hydrographic surveys, geotechnical investigations, positioning, geospatial data acquisition and reality capture to support engineering design and infrastructure development.',
    sectionsHtml: `
      <section style="margin-bottom: 2.5rem;">
        <h2 style="color: #34d399; font-size: 1.5rem; margin-bottom: 1rem;">Capabilities</h2>
        <ul style="color: #cbd5e1; line-height: 1.8; font-size: 1rem;">
          <li><strong>Geohazard, Geoscan & Seismic Services:</strong> High-resolution marine seismic surveys, shallow gas hazard detection, and sub-bottom acoustic profiling.</li>
          <li><strong>Geophysical & Hydrographic Survey Services:</strong> Multibeam and single-beam bathymetry, side-scan sonar, and seabed terrain modeling.</li>
          <li><strong>Geotechnical & Foundation Engineering Services:</strong> 20-tonne hydraulic Cone Penetration Testing (CPT), deep soil boreholes, soil mechanics testing, and foundation design parameters.</li>
          <li><strong>Precise Positioning & Navigation Services:</strong> DGPS surface navigation, USBL underwater positioning, and offshore rig positioning.</li>
          <li><strong>Geospatial, Reality Capture & Digital Engineering:</strong> Millimeter-accurate Leica RTC360 terrestrial laser scanning, 3D point cloud generation, and digital twin BIM models.</li>
          <li><strong>Laboratory Services:</strong> Comprehensive soil mechanics and water quality testing in accordance with ASTM and BS standards.</li>
        </ul>
      </section>
    `
  },
  {
    path: '/services/metocean-marine-solutions',
    title: 'Metocean & Marine Solutions | PIGL',
    description: 'We provide marine observation, oceanographic monitoring, forecasting and environmental survey services to support offshore planning, marine operations and environmental assessment.',
    badge: 'Division 02 — MMS',
    h1: 'Metocean & Marine Solutions',
    intro: 'We provide marine observation, oceanographic monitoring, forecasting and environmental survey services to support offshore planning, marine operations and environmental assessment.',
    sectionsHtml: `
      <section style="margin-bottom: 2.5rem;">
        <h2 style="color: #34d399; font-size: 1.5rem; margin-bottom: 1rem;">Capabilities</h2>
        <ul style="color: #cbd5e1; line-height: 1.8; font-size: 1rem;">
          <li><strong>Metocean Observation & Monitoring:</strong> Autonomous oceanographic data buoys measuring directional waves, currents, wind, and sea surface temperature with real-time satellite telemetry.</li>
          <li><strong>Acoustic Doppler Current Profiler (ADCP) Measurements:</strong> Full water-column current velocity and directional profiling for offshore installation and pipeline stabilization.</li>
          <li><strong>Marine Forecasting & Metocean Data:</strong> High-resolution operational marine weather forecasting, squall warnings, and marine advisory across the Gulf of Guinea and West Africa.</li>
          <li><strong>Marine Environmental Baseline Surveys:</strong> Hydrochemical sampling, marine ecological baseline assessment, and seabed environmental characterization.</li>
        </ul>
      </section>
    `
  },
  {
    path: '/services/integrated-construction-services',
    title: 'Integrated Construction Services | PIGL',
    description: 'We undertake pipeline installation, civil infrastructure, mechanical fabrication and installation, and construction support for industrial and energy projects.',
    badge: 'Division 03 — ICS',
    h1: 'Integrated Construction Services',
    intro: 'We undertake pipeline installation, civil infrastructure, mechanical fabrication and installation, and construction support for industrial and energy projects.',
    sectionsHtml: `
      <section style="margin-bottom: 2.5rem;">
        <h2 style="color: #34d399; font-size: 1.5rem; margin-bottom: 1rem;">Capabilities</h2>
        <ul style="color: #cbd5e1; line-height: 1.8; font-size: 1rem;">
          <li><strong>Pipeline Construction & Installation:</strong> Mainline pipeline installation, swamp and marsh trenching, horizontal directional drilling (HDD) crossings, and pre-commissioning pressure testing.</li>
          <li><strong>Civil & Infrastructure Construction:</strong> Industrial site preparation, deep piling, structural reinforced concrete foundations, and access corridor civil works.</li>
          <li><strong>Mechanical, Fabrication & Installation:</strong> High-pressure spool fabrication, manifold skid integration, and piping installation conforming to ASME B31.3 / B31.8 standards.</li>
          <li><strong>Swamp Terrain Engineering:</strong> Specialised marsh buggies, amphibious excavators, and construction support in complex Niger Delta wetlands.</li>
        </ul>
      </section>
    `
  },
  {
    path: '/services/industrial-solutions',
    title: 'Industrial Solutions | PIGL',
    description: 'We provide produced-water treatment, industrial and domestic water systems, laboratory analysis and wastewater treatment services for industrial and environmental applications.',
    badge: 'Division 04 — IS',
    h1: 'Industrial Solutions',
    intro: 'We provide produced-water treatment, industrial and domestic water systems, laboratory analysis and wastewater treatment services for industrial and environmental applications.',
    sectionsHtml: `
      <section style="margin-bottom: 2.5rem;">
        <h2 style="color: #34d399; font-size: 1.5rem; margin-bottom: 1rem;">Capabilities</h2>
        <ul style="color: #cbd5e1; line-height: 1.8; font-size: 1rem;">
          <li><strong>Produced Water Treatment Solutions:</strong> Modular coalescing skids in partnership with CoaleXpert, hydrocyclone separation, and hydrocarbon removal to meet regulatory discharge thresholds.</li>
          <li><strong>Industrial & Domestic Water Solutions:</strong> Multi-media filtration plants, reverse osmosis (RO) desalination, and potable water distribution for oilfield camps and industrial facilities.</li>
          <li><strong>Water Quality Laboratory Testing:</strong> Comprehensive physical, chemical, and microbiological water analysis in Port Harcourt laboratory facilities.</li>
          <li><strong>Wastewater Treatment & Resource Recovery:</strong> Industrial effluent treatment, oily sludge remediation, and environmental regulatory compliance.</li>
        </ul>
      </section>
    `
  },
  {
    path: '/about',
    title: 'About PIGL | Engineering & Technical Solutions Company',
    description: 'Polaris Integrated & GeoSolutions Limited (PIGL) is a Nigerian engineering and technical solutions company serving the energy, infrastructure and industrial sectors.',
    badge: 'About PIGL',
    h1: 'About PIGL',
    intro: 'Polaris Integrated & GeoSolutions Limited (PIGL) is a Nigerian engineering and technical solutions company serving the energy, infrastructure and industrial sectors.',
    sectionsHtml: `
      <section style="margin-bottom: 2.5rem;">
        <h2 style="color: #34d399; font-size: 1.5rem; margin-bottom: 1rem;">Engineering and Technical Solutions</h2>
        <p style="color: #cbd5e1; line-height: 1.7; font-size: 1rem; margin-bottom: 1.5rem;">
          Polaris Integrated & GeoSolutions Limited (PIGL) brings together geoscience, marine, digital mapping, construction and industrial solutions to address technical challenges across different operating environments. Our work combines engineering knowledge, specialist equipment, field experience and technology to help clients make informed decisions and deliver their operations effectively.
        </p>
        <h2 style="color: #34d399; font-size: 1.5rem; margin-bottom: 1rem;">Why Clients Work With PIGL</h2>
        <p style="color: #cbd5e1; line-height: 1.7; font-size: 1rem; margin-bottom: 1.5rem;">
          Clients partner with PIGL for our safety in execution, technical and commercial value, engineering capacity and strategic partnerships, and adaptability in solving complex operational problems across Nigeria.
        </p>
        <h2 style="color: #34d399; font-size: 1.5rem; margin-bottom: 1rem;">Our Business Divisions</h2>
        <p style="color: #cbd5e1; line-height: 1.7; font-size: 1rem; margin-bottom: 1.5rem;">
          Our multidisciplinary operations are structured into four divisions: GeoSolutions & Engineering Services (GES), Metocean & Marine Solutions (MMS), Integrated Construction Services (ICS), and Industrial Solutions (IS).
        </p>
        <h2 style="color: #34d399; font-size: 1.5rem; margin-bottom: 1rem;">Quality, Health, Safety & Environment</h2>
        <p style="color: #cbd5e1; line-height: 1.7; font-size: 1rem;">
          PIGL operates dual certified management systems: ISO 9001:2015 for Quality Management and ISO 45001:2018 for Occupational Health and Safety, maintaining an unbroken track record of over 500,000 safe man-hours.
        </p>
      </section>
    `
  },
  {
    path: '/contact',
    title: 'Contact PIGL | Engineering Offices in Port Harcourt & Lagos',
    description: 'Contact Polaris Integrated & GeoSolutions Limited for project consultations, technical scoping, and field mobilisation across Nigeria.',
    badge: 'Technical Consultation',
    h1: 'Contact PIGL',
    intro: 'Contact our lead engineering and technical scoping desks in Port Harcourt and Lagos for project feasibility, surveys, or construction inquiries.',
    sectionsHtml: `
      <section style="margin-bottom: 2.5rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          <div style="padding: 1.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;">
            <h3 style="color: #34d399; font-size: 1.1rem; margin-top: 0; margin-bottom: 0.75rem;">Port Harcourt Headquarters</h3>
            <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
              #3 Diamond Close, Castle & Green Estate, Off Eneka Link Road, Port Harcourt, Rivers State, Nigeria
            </p>
            <p style="color: #94a3b8; font-size: 0.85rem;">Phone: +234-809-7081-333 | +234-803-708-1904</p>
            <p style="color: #94a3b8; font-size: 0.85rem;">Email: hello@polarisigl.com</p>
          </div>
          <div style="padding: 1.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px;">
            <h3 style="color: #34d399; font-size: 1.1rem; margin-top: 0; margin-bottom: 0.75rem;">Lagos Liaison Desk</h3>
            <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
              Commercial Operations & Technical Liaison, Victoria Island, Lagos State, Nigeria
            </p>
            <p style="color: #94a3b8; font-size: 0.85rem;">Phone: +234-809-7081-333</p>
            <p style="color: #94a3b8; font-size: 0.85rem;">Email: hello@polarisigl.com</p>
          </div>
        </div>
      </section>
    `
  },
  {
    path: '/careers',
    title: 'Careers at PIGL | Engineering Opportunities in Nigeria',
    description: 'Join the PIGL engineering team in Port Harcourt and across Nigeria. Grow your career with an indigenous leader in geosolutions and energy infrastructure.',
    badge: 'Join Our Team',
    h1: 'Careers at PIGL',
    intro: 'Join our multidisciplinary engineering teams delivering geotechnical investigations, marine surveys, pipeline construction, and industrial water systems across Nigeria.',
    sectionsHtml: `
      <section style="margin-bottom: 2.5rem;">
        <h2 style="color: #34d399; font-size: 1.5rem; margin-bottom: 1rem;">Technical Disciplines</h2>
        <p style="color: #cbd5e1; line-height: 1.7; font-size: 1rem;">
          We recruit professionals in Geotechnical Engineering, Hydrography, 3D Laser Scanning, Pipeline Engineering, Mechanical Fabrication, and Water Treatment Operations.
        </p>
      </section>
    `
  },
  {
    path: '/partners',
    title: 'Technology Partners & Engineering Alliances | PIGL',
    description: 'PIGL Strategic Alliances & Global Technology Partnerships with Frankstar Technology, CoaleXpert, and NPK Flanges & Industrial Piping.',
    badge: 'Technology Alliances',
    h1: 'Strategic Technology Partners',
    intro: 'PIGL maintains technology alliances and equipment distribution partnerships with global leaders in metocean instrumentation, water treatment skids, and industrial piping.',
    sectionsHtml: `
      <section style="margin-bottom: 2.5rem;">
        <h2 style="color: #34d399; font-size: 1.5rem; margin-bottom: 1rem;">Key Partnerships</h2>
        <ul style="color: #cbd5e1; line-height: 1.8; font-size: 1rem;">
          <li><strong>Frankstar Technology:</strong> Metocean buoys, ADCP telemetry, and real-time oceanographic instrumentation.</li>
          <li><strong>CoaleXpert:</strong> Produced water treatment skids and coalescing separation modules.</li>
          <li><strong>NPK Flanges & Industrial Piping:</strong> Industrial valves, flanges, and high-pressure piping components.</li>
        </ul>
      </section>
    `
  },
  {
    path: '/hsse',
    title: 'HSSEQ Standards & ISO Certifications | PIGL Safety',
    description: 'Health, Safety, Security, Environment & Quality (HSSEQ) at PIGL. Certified ISO 9001:2015 and ISO 45001:2018 with over 500,000+ safe man-hours and zero LTI.',
    badge: 'Certified Management Systems',
    h1: 'HSSE & Quality Assurance',
    intro: 'Health, Safety, Security, Environment, and Quality (HSSEQ) govern every operational phase at PIGL, from field geotechnical drilling to deep swamp pipeline construction.',
    sectionsHtml: `
      <section style="margin-bottom: 2.5rem;">
        <h2 style="color: #34d399; font-size: 1.5rem; margin-bottom: 1rem;">Certifications & Performance</h2>
        <ul style="color: #cbd5e1; line-height: 1.8; font-size: 1rem;">
          <li><strong>ISO 9001:2015:</strong> Quality Management System certified for all engineering and survey operations.</li>
          <li><strong>ISO 45001:2018:</strong> Occupational Health & Safety Management System certified.</li>
          <li><strong>Safety Record:</strong> Over 500,000 continuous safe man-hours without Lost Time Injury (LTI).</li>
          <li><strong>Stop Work Authority:</strong> Every crew member is empowered and obligated to suspend any unsafe act or condition.</li>
        </ul>
      </section>
    `
  },
  {
    path: '/videos',
    title: 'Operations & Engineering Video Library | PIGL Nigeria',
    description: 'Explore Polaris Integrated & GeoSolutions Limited (PIGL) official video hub, corporate documentary, 3D laser scanning field demos, 20-tonne CPT geotechnical testing, and pipeline integrity operations.',
    badge: 'Video Archive',
    h1: 'Operations & Field Execution Videos',
    intro: 'Watch PIGL field operations, corporate documentary, 3D laser scanning demonstrations, 20-tonne hydraulic CPT mobilisations, and pipeline construction.',
    sectionsHtml: `
      <section style="margin-bottom: 2.5rem;">
        <h2 style="color: #34d399; font-size: 1.5rem; margin-bottom: 1rem;">Featured Engineering Demonstrations</h2>
        <p style="color: #cbd5e1; line-height: 1.7; font-size: 1rem;">
          Access the PIGL corporate documentary and technical demonstrations showcasing high-precision site investigation and asset integrity operations across Nigerian energy corridors.
        </p>
      </section>
    `
  },
  {
    path: '/blog',
    title: 'Engineering News & Technical Insights | PIGL Nigeria',
    description: 'Technical updates, project milestones, and engineering insights from Polaris Integrated and GeoSolutions Limited.',
    badge: 'Technical Publications',
    h1: 'Engineering Insights & Technical Articles',
    intro: 'Technical perspectives, case studies, and engineering updates from the PIGL technical desks in Port Harcourt.',
    sectionsHtml: `
      <section style="margin-bottom: 2.5rem;">
        <h2 style="color: #34d399; font-size: 1.5rem; margin-bottom: 1rem;">Articles & Case Studies</h2>
        <p style="color: #cbd5e1; line-height: 1.7; font-size: 1rem;">
          In-depth technical publications on geotechnical investigations, reality capture workflows, metocean telemetry, and pipeline swamp construction.
        </p>
      </section>
    `
  }
];

function generateHtmlForRoute(config) {
  let html = baseHtml;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/s, `<title>${config.title}</title>`);

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

  // Replace OpenGraph Title & Description & URL
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
            <a href="/services" style="color: #94a3b8; text-decoration: none;">Services</a>
            <a href="/services/geosolutions-engineering-services" style="color: #94a3b8; text-decoration: none;">GeoSolutions (GES)</a>
            <a href="/services/metocean-marine-solutions" style="color: #94a3b8; text-decoration: none;">Metocean (MMS)</a>
            <a href="/services/integrated-construction-services" style="color: #94a3b8; text-decoration: none;">Construction (ICS)</a>
            <a href="/services/industrial-solutions" style="color: #94a3b8; text-decoration: none;">Industrial (IS)</a>
            <a href="/about" style="color: #94a3b8; text-decoration: none;">About</a>
            <a href="/contact" style="color: #94a3b8; text-decoration: none;">Contact</a>
          </nav>
        </div>
      </header>

      <main style="max-width: 1200px; margin: 0 auto;">
        <div style="max-width: 900px;">
          <div style="display: inline-block; padding: 0.35rem 0.85rem; border-radius: 9999px; background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.8rem; font-weight: 600; margin-bottom: 1.25rem; border: 1px solid rgba(16, 185, 129, 0.3);">
            ${config.badge}
          </div>
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
