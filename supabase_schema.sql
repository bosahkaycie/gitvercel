-- ==============================================================================
-- POLARIS INTEGRATED & GEOSOLUTIONS LIMITED (PIGL)
-- SUPABASE DATABASE SCHEMA & INITIAL SEED MIGRATION
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop any legacy check constraints if tables previously existed
ALTER TABLE IF EXISTS services DROP CONSTRAINT IF EXISTS services_division_check;
ALTER TABLE IF EXISTS service_categories DROP CONSTRAINT IF EXISTS service_categories_division_check;

-- ==============================================================================
-- 1. SERVICE CATEGORIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    division VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 2. SERVICES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(150) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    division VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    tagline TEXT,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    business_value TEXT,
    hero_image TEXT,
    card_image TEXT,
    capabilities JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    operating_environments TEXT[] DEFAULT '{}',
    technology TEXT[] DEFAULT '{}',
    methodology TEXT[] DEFAULT '{}',
    equipment TEXT[] DEFAULT '{}',
    gallery JSONB DEFAULT '[]'::jsonb,
    video_url TEXT DEFAULT NULL,
    cta_text VARCHAR(100) DEFAULT 'Request Technical Consultation',
    cta_url VARCHAR(255) DEFAULT '/contact',
    partner_badge JSONB DEFAULT NULL,
    display_order INT DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Idempotent schema migration for gallery & video_url columns
ALTER TABLE services ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Seed / update native video URLs for zero third-party branding
UPDATE services SET video_url = '/assets/videos/ground_intelligence.mp4' WHERE slug = 'ground-intelligence' AND (video_url IS NULL OR video_url LIKE '%G0hu1YqhpEE%');
UPDATE sliders SET video_url = '/assets/FRANKSTAR LOOP.mp4' WHERE video_url LIKE '%X0d8DmasSiQ%';

-- Indexes for Services
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_division ON services(division);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);

-- ==============================================================================
-- 3. BLOG CATEGORIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. BLOG POSTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(200) NOT NULL UNIQUE,
    title VARCHAR(300) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    author VARCHAR(100) DEFAULT 'PIGL Technical Communications Desk',
    category VARCHAR(100) DEFAULT 'Technical Updates',
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT false,
    read_time VARCHAR(20) DEFAULT '5 min read',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for Blog Posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);

-- ==============================================================================
-- 5. SLIDERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS sliders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(250),
    description TEXT,
    desktop_image TEXT NOT NULL,
    mobile_image TEXT,
    video_url TEXT,
    cta_text VARCHAR(100) DEFAULT 'Explore Capabilities',
    cta_url VARCHAR(255) DEFAULT '/services',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for Sliders
CREATE INDEX IF NOT EXISTS idx_sliders_is_active ON sliders(is_active);
CREATE INDEX IF NOT EXISTS idx_sliders_display_order ON sliders(display_order);

-- ==============================================================================
-- 6. MEDIA ASSETS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    bucket_id VARCHAR(50) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    alt_text VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_media_bucket ON media_assets(bucket_id);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
DROP POLICY IF EXISTS "Public users can view published services" ON services;
CREATE POLICY "Public users can view published services" 
ON services FOR SELECT 
USING (status = 'published');

DROP POLICY IF EXISTS "Public users can view service categories" ON service_categories;
CREATE POLICY "Public users can view service categories" 
ON service_categories FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Public users can view published blog posts" ON blog_posts;
CREATE POLICY "Public users can view published blog posts" 
ON blog_posts FOR SELECT 
USING (status = 'published');

DROP POLICY IF EXISTS "Public users can view blog categories" ON blog_categories;
CREATE POLICY "Public users can view blog categories" 
ON blog_categories FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Public users can view active sliders" ON sliders;
CREATE POLICY "Public users can view active sliders" 
ON sliders FOR SELECT 
USING (is_active = true);

DROP POLICY IF EXISTS "Public users can view media assets" ON media_assets;
CREATE POLICY "Public users can view media assets" 
ON media_assets FOR SELECT 
USING (true);

-- AUTHENTICATED ADMIN FULL ACCESS POLICIES
DROP POLICY IF EXISTS "Authenticated users have full access to services" ON services;
CREATE POLICY "Authenticated users have full access to services" 
ON services FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users have full access to service_categories" ON service_categories;
CREATE POLICY "Authenticated users have full access to service_categories" 
ON service_categories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users have full access to blog_posts" ON blog_posts;
CREATE POLICY "Authenticated users have full access to blog_posts" 
ON blog_posts FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users have full access to blog_categories" ON blog_categories;
CREATE POLICY "Authenticated users have full access to blog_categories" 
ON blog_categories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users have full access to sliders" ON sliders;
CREATE POLICY "Authenticated users have full access to sliders" 
ON sliders FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users have full access to media_assets" ON media_assets;
CREATE POLICY "Authenticated users have full access to media_assets" 
ON media_assets FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- ==============================================================================
-- 8. STORAGE BUCKET CREATION (Supabase Storage)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('services', 'services', true),
    ('blog', 'blog', true),
    ('sliders', 'sliders', true),
    ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public read access for services bucket" ON storage.objects;
CREATE POLICY "Public read access for services bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'services');

DROP POLICY IF EXISTS "Public read access for blog bucket" ON storage.objects;
CREATE POLICY "Public read access for blog bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'blog');

DROP POLICY IF EXISTS "Public read access for sliders bucket" ON storage.objects;
CREATE POLICY "Public read access for sliders bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'sliders');

DROP POLICY IF EXISTS "Public read access for media bucket" ON storage.objects;
CREATE POLICY "Public read access for media bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Public and authenticated can upload objects" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload objects" ON storage.objects;
CREATE POLICY "Public and authenticated can upload objects" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id IN ('services', 'blog', 'sliders', 'media', 'resumes', 'vendor-documents'));

DROP POLICY IF EXISTS "Public and authenticated can update objects" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update objects" ON storage.objects;
CREATE POLICY "Public and authenticated can update objects" 
ON storage.objects FOR UPDATE 
USING (bucket_id IN ('services', 'blog', 'sliders', 'media', 'resumes', 'vendor-documents'));

DROP POLICY IF EXISTS "Public and authenticated can delete objects" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete objects" ON storage.objects;
CREATE POLICY "Public and authenticated can delete objects" 
ON storage.objects FOR DELETE 
USING (bucket_id IN ('services', 'blog', 'sliders', 'media', 'resumes', 'vendor-documents'));


-- ==============================================================================
-- 9. INITIAL SEED DATA MIGRATION
-- ==============================================================================

-- Service Categories
INSERT INTO service_categories (name, slug, division, display_order) VALUES
('Ground Intelligence', 'ground-intelligence', 'Intelligence', 1),
('Digital Intelligence', 'digital-intelligence', 'Intelligence', 2),
('Integrated Engineering & Construction Solutions', 'integrated-engineering-construction', 'Solutions & Engineering', 3),
('Industrial & Environmental Technologies', 'industrial-environmental-technologies', 'Solutions & Engineering', 4),
('Offshore Intelligence', 'offshore-intelligence', 'Intelligence', 5)
ON CONFLICT (slug) DO NOTHING;

-- Services Seed Data
INSERT INTO services (
    slug, title, division, category, tagline, short_description, full_description, business_value,
    hero_image, card_image, capabilities, benefits, operating_environments, technology, methodology, equipment,
    cta_text, cta_url, partner_badge, display_order, featured, status, meta_title, meta_description
) VALUES
(
    'ground-intelligence',
    'Ground Intelligence',
    'Ground Intelligence',
    'Ground Intelligence',
    'Understand the ground. Build with confidence.',
    'Comprehensive subsurface characterisation, geotechnical investigations, high-capacity hydraulic CPT, soil boring, rock mechanics, seismic studies, industrial water boreholes, and precision geomatics surveying across Nigeria.',
    'PIGL delivers comprehensive subsurface characterisation and geomatics investigations that turn geological uncertainty into structural engineering confidence. Operating across complex swamp, coastal, land, nearshore, and river crossing environments throughout Nigeria, we conduct deep soil boring, high-capacity hydraulic Cone Penetration Testing (CPT/CPTu), Standard Penetration Testing (SPT), and comprehensive geotechnical laboratory testing for soil and rock mechanics. Our capabilities extend to land-based seismic refraction/reflection acquisition, industrial water borehole drilling and hydrogeological mapping, foundation and deep piling capacity engineering, alongside high-precision land surveying, geodetic positioning networks, enterprise GIS mapping, and UAV drone photogrammetry.',
    'Prevents catastrophic foundation failure, differential settlement, and pipeline route disputes by establishing verified empirical soil mechanics and sub-centimeter geodetic baselines. Optimizes piling design depths and saves significant civil CAPEX on heavy industrial assets.',
    '/assets/cpt.png',
    '/assets/cpt.png',
    '["Geotechnical Site Characterisation & Soil Mechanics", "Hydraulic Cone Penetration Testing (CPT & CPTu)", "Soil Boring, SPT & Undisturbed Core Sampling", "Geotechnical Laboratory Testing (Soil & Rock)", "Land & Subsurface Geophysical / Seismic Investigation", "Industrial Water Boreholes & Hydrogeology", "Deep Foundation & Piling Capacity Engineering", "Geomatics, RTK-GNSS Control & UAV Drone Mapping"]'::jsonb,
    '["Optimized foundation and piling engineering", "Sub-centimeter geodetic and cadastral accuracy", "Empirical soil mechanics to ASTM, BS and Eurocode standards"]'::jsonb,
    ARRAY['Swamp Basins', 'Coastal & Intertidal Zones', 'Onshore Industrial Sites', 'Pipeline Corridors & ROW', 'River Crossings & Jetties'],
    ARRAY['20-Ton Hydraulic CPT Rigs', 'Pontoon Drilling Units', 'Rotary Core Rigs', 'Trimble R12 RTK-GNSS', 'DJI Enterprise RTK Mapping Drones'],
    ARRAY['Geotechnical site reconnaissance & in-situ investigation layout planning', 'Continuous hydraulic Cone Penetration Testing (20-Ton CPT & CPTu profiling)', 'Rotary borehole drilling, SPT sampling & undisturbed tube coring', 'Laboratory soil classification, triaxial shear, consolidation & chemical testing', 'Refraction & reflection seismic data acquisition & structural interpretation', 'Industrial water borehole drilling & aquifer analysis', 'Primary RTK-GNSS geodetic control network establishment & UAV aerial mapping'],
    ARRAY['High-Capacity 20-Ton Hydraulic CPT Rigs', 'Pontoon-Mounted Shallow-Water & Swamp Drilling Units', 'Rotary Core Drilling Rigs & Split-Spoon Samplers', 'Automated Triaxial & Direct Shear Testing Systems', 'Multi-Channel Digital Seismic Recording Instruments', 'Trimble R12 & Leica RTK-GNSS Dual-Frequency Receivers', 'DJI Enterprise RTK Mapping Drones with Zenmuse Sensors'],
    'Request Geotechnical & Geomatics Scoping',
    '/contact',
    NULL,
    1,
    true,
    'published',
    'Ground Intelligence & Geotechnical Soil Mechanics | PIGL',
    'High-capacity CPT testing, deep soil boring, seismic investigations, and precision geomatics surveying across Nigeria.'
),
(
    'digital-intelligence',
    'Digital Intelligence',
    'Digital Intelligence',
    'Digital Intelligence',
    'Capture reality. Create certainty.',
    'High-fidelity 3D terrestrial & mobile laser scanning, reality capture, and digital twin engineering. We convert complex brownfield facilities, offshore platforms, and physical assets into precise, BIM/CAD-ready engineering intelligence.',
    'PIGL converts complex physical assets, industrial process plants, and brownfield operating environments into millimeter-accurate digital engineering intelligence. Utilizing high-speed terrestrial 3D laser scanners (Leica RTC360), mobile scanning systems, aerial LiDAR, and advanced point cloud processing pipelines, we capture intricate processing facilities, offshore production platforms, and structural geometries. The resulting spatial datasets feed directly into intelligent As-Built 3D CAD/BIM models (Autodesk Plant 3D, Revit, Navisworks) and interactive digital twins, providing engineering teams with an absolute single source of truth for brownfield modifications, clash detection, spool verification, and structural deformation monitoring.',
    'Eliminates brownfield construction clash rework by up to 95%, reduces offsite engineering design cycles by 40%, and enables virtual walkthroughs and asset inspection without mobilizing personnel to high-risk swamp or offshore operating environments.',
    '/assets/digital_intel_scanner.jpg',
    '/assets/digital_intel_scanner.jpg',
    '["3D Terrestrial & Mobile Laser Scanning (Leica RTC360)", "Point-Cloud Processing, Registration & Modeling", "Intelligent As-Built 3D CAD / BIM Digitalisation", "Dimensional Control & Clash Detection Verification", "Brownfield Facility Digital Twins & Virtual Asset Walkthroughs", "Brownfield Modification, Spool Fit & Tie-In Support", "Structural Deformation & Geometric Assurance Profiling"]'::jsonb,
    '["Up to 95% reduction in brownfield rework", "Millimeter-accurate single source of truth", "Remote asset inspection reducing field exposure"]'::jsonb,
    ARRAY['Onshore Flow Stations', 'Offshore Platforms', 'Gas Processing Plants', 'Refinery & Petrochemical Units', 'Storage Terminals'],
    ARRAY['Leica RTC360 High-Speed 3D Laser Scanner', 'Leica ScanStation P50', 'Leica Cyclone Suite', 'Autodesk Revit & Plant 3D'],
    ARRAY['Survey control network establishment & geodetic tie-ins', 'High-density terrestrial 3D laser scanning & aerial LiDAR capture', 'Point cloud registration, target alignment & noise filtration', 'Intelligent 3D CAD/BIM feature extraction & parametric modeling', 'Dimensional control verification, clash analysis & digital twin integration'],
    ARRAY['Leica RTC360 High-Speed 3D Laser Scanner', 'Leica ScanStation P50 Long-Range Scanner', 'High-Precision RTK-GNSS Receivers', 'Leica Cyclone & Cyclone 3DR Processing Suite'],
    'Request Reality Capture Scoping',
    '/contact',
    NULL,
    2,
    true,
    'published',
    'Digital Intelligence & 3D Reality Capture | PIGL',
    'Millimeter-accurate 3D laser scanning and digital twins for brownfield facilities across Nigeria.'
),
(
    'integrated-engineering-construction',
    'Integrated Engineering & Construction Solutions',
    'Integrated Engineering & Construction Solutions',
    'Integrated Engineering & Construction Solutions',
    'From engineering intelligence to physical infrastructure and field delivery.',
    'API-standard pipeline fabrication and laying, certified precision welding, hydrostatic testing, heavy civil infrastructure, piling, deep foundations, access road construction & swamp rehabilitation, backed by comprehensive swamp, nearshore, and deepwater field delivery.',
    'This platform integrates PIGL''s engineering design, pipeline construction, heavy civil infrastructure, and specialized field delivery capabilities across Nigeria''s demanding onshore, swamp, and offshore corridors. We execute API-standard pipeline fabrication and laying, certified precision welding, and hydrostatic integrity testing. Our civil engineering team delivers site preparation, hydraulic piling, deep foundations, structural concrete works, and heavy-duty access road construction and swamp rehabilitation. To support complex field campaigns, our licensed mariners and hydrographers provide swamp and offshore rig positioning (DGPS/USBL), tug management, dynamic anchor tracking, barge and pontoon logistics, and complete project delivery support.',
    'Delivers leak-free high-pressure pipelines and heavy structural foundations built to international API, ASME, and Eurocode standards, combined with high-precision marine navigation that eliminates offshore rig moves and barge collision hazards.',
    '/assets/newpipeline.png',
    '/assets/newpipeline.png',
    '["API-Standard Pipeline Fabrication, Laying & Welding", "Hydrostatic Integrity Testing & Cathodic Protection", "Site Preparation, Piling & Heavy Industrial Foundations", "Structural Concrete & Civil Infrastructure Construction", "Access Road Construction & Swamp Terrain Rehabilitation", "Swamp, Nearshore & Deepwater Field Operations Support", "Offshore & Swamp Rig Positioning (DGPS/USBL)", "Tug Management, Anchor Handling & Vessel Logistics"]'::jsonb,
    '["Seamless execution in complex Niger Delta swamp terrains", "API 1104 certified pipeline welding standards", "Zero-collision track record on high-risk rig moves and anchor placements"]'::jsonb,
    ARRAY['Swamp Pipeline Right-of-Ways (ROW)', 'Onshore Gas Infrastructure Corridors', 'Offshore Rig Drilling Locations', 'Coastal Jetties & Facilities', 'Access Roads & Intertidal Terminals'],
    ARRAY['Automated Pipeline Welding Stations', 'Sideboom Pipe Layers', 'Hydraulic Piling Rigs', 'Dual RTK-DGPS Positioning Systems', 'Sonardyne USBL Telemetry'],
    ARRAY['Right-of-Way (ROW) clearing, swamp grading, ditching & trenching', 'Pipe stringing, cold bending & API-standard certified welding', '100% NDT inspection of welded joints via automated radiography/PAUT', 'Pipe lowering, backfilling, cathodic protection & hydrostatic testing', 'Hydraulic piling, structural reinforced concrete pouring & access road stabilization', 'Rig move pre-job hazard analysis, seabed verification & DGPS/USBL positioning', 'Multi-tug management, dynamic anchor handling & as-laid charting'],
    ARRAY['Automated Pipeline Welding Stations & Pipe Bending Rigs', 'Sideboom Pipe Layers & Heavy Swamp Excavators', 'High-Pressure Hydrostatic Test Pumps & Pigging Traps', 'Hydraulic Piling Rigs & Soil Improvement Systems', 'Dual RTK-DGPS Positioning Systems & USBL Hydroacoustic Telemetry', 'Fiber-Optic Gyrocompasses & QPS Qinsy Marine Navigation Software'],
    'Scope Engineering & Construction Project',
    '/contact',
    NULL,
    3,
    true,
    'published',
    'Integrated Engineering & Construction Solutions | PIGL Nigeria',
    'Pipeline construction, civil works, piling, access roads, and field delivery support across Nigeria.'
),
(
    'industrial-environmental-technologies',
    'Industrial & Environmental Technologies',
    'Industrial & Environmental Technologies',
    'Industrial & Environmental Technologies',
    'Treat water. Control flow. Protect asset integrity.',
    'Authoritative industrial technology platform comprising Water & Environmental Technologies (produced water treatment, reinjection & industrial filtration), Flow Control & Automation (valves, actuators & control packages), and Asset Integrity assurance (NDT, corrosion monitoring & facility maintenance).',
    'PIGL''s authoritative industrial technology platform brings together three core operational divisions: (A) Water & Environmental Technologies, (B) Flow Control & Automation, and (C) Asset Integrity. Through strategic alliance with CoaleXpert, we provide high-efficiency produced water and oily wastewater treatment solutions engineered for dispersed oil removal, suspended solids filtration, subsurface reinjection, and environmental discharge compliance. In partnership with NPK Automation, we deliver API/ASME-certified industrial valves (ball, gate, globe, butterfly, check), electric, pneumatic, and hydraulic actuators, and complete automated shutdown and flow-control packages. Our certified inspection engineers deploy Advanced Non-Destructive Testing (NDT - PAUT, MFL, radiography), ultrasonic thickness gauging, corrosion monitoring, and Fitness-for-Service (FFS) assessments, backed by facility maintenance.',
    'Ensures absolute environmental regulatory compliance (NUPRC/NMDPRA), protects reinjection wells from oil fouling, guarantees the severe-service pressure integrity of mission-critical piping systems, and extends the safe operating life of mature energy infrastructure.',
    '/assets/drilling.png',
    '/assets/drilling.png',
    '["Produced Water & Industrial Wastewater Treatment (CoaleXpert)", "Dispersed Oil Removal & Modular Treatment Skids", "Water Treatment Plants, Polishing & Reinjection Systems", "Engineered Valves & Automated Actuator Packages (NPK Automation)", "Flow Control Engineering, Valve Servicing & Calibration", "Advanced Non-Destructive Testing (NDT - PAUT, MFL, Radiography)", "Corrosion Audits, Wall-Thickness & Fitness-for-Service (FFS)", "Flow Station Mechanical Maintenance & Facility Upgrades"]'::jsonb,
    '["Guaranteed compliance with NUPRC/NMDPRA environmental discharge guidelines", "Zero counterfeit risk with 100% certified valve & piping metallurgy", "Early defect detection preventing catastrophic blowouts and downtime"]'::jsonb,
    ARRAY['Upstream Flow Stations', 'Offshore Production Facilities', 'Refineries & Petrochemical Plants', 'Crude Oil Storage Terminals', 'Cross-Country Pipeline Networks'],
    ARRAY['CoaleXpert Modular Coalescing Skids', 'API/ASME Certified Valve Packages', 'Electric & Hydraulic Actuators', 'Phased Array Ultrasonic Testing (PAUT)', 'MFL Pipeline Scanners'],
    ARRAY['Produced water effluent chemical analysis & oil-in-water characterization', 'CoaleXpert modular treatment skid deployment, coalescing filtration & oil separation', 'Water polishing, filtration & conditioning for subsurface reinjection/reuse', 'Valve engineering specification, actuator sizing, assembly & hydro-testing', 'Baseline integrity audits, corrosion mapping & wall-thickness profiling', 'Advanced Non-Destructive Testing (PAUT, TOFD, MFL, digital radiography)', 'Fitness-for-Service (FFS) evaluations & mechanical facility maintenance'],
    ARRAY['CoaleXpert Modular Coalescing & Dispersed Oil Separation Skids', 'High-Efficiency Multi-Media & Micro-Filtration Units', 'API/ASME Certified High-Pressure Valve Packages (Ball, Gate, Check)', 'Electric, Pneumatic & Hydraulic Heavy-Duty Actuators', 'Phased Array Ultrasonic Testing (PAUT) & TOFD Flaw Detectors', 'Magnetic Flux Leakage (MFL) Pipeline Corrosion Scanners', 'Digital Radiography & Ultrasonic Precision Wall-Thickness Gauges'],
    'Consult Industrial & Environmental Specialists',
    '/contact',
    '{"partnerName": "CoaleXpert & NPK Automation", "role": "Industrial & Environmental Technology Partners"}'::jsonb,
    4,
    true,
    'published',
    'Industrial & Environmental Technologies | PIGL',
    'Produced water treatment, flow control valves, and asset integrity NDT assurance across Nigeria.'
),
(
    'offshore-intelligence',
    'Offshore Intelligence',
    'Offshore Intelligence',
    'Offshore Intelligence',
    'From seabed conditions to ocean dynamics.',
    'High-resolution offshore marine geophysics, sub-bottom acoustic profiling, hydrographic bathymetry, oceanographic telemetry, and continuous MetOcean monitoring deployed across Nigerian coastal, nearshore, and deepwater corridors.',
    'PIGL''s Offshore Intelligence platform delivers continuous marine environmental observation, ocean dynamics measurement, hydrographic bathymetry, and high-resolution offshore geophysics across Nigeria''s coastal, nearshore, and deepwater corridors. Through strategic technology partnership with Frankstar Technology, PIGL deploys state-of-the-art MetOcean telemetry buoys, wave monitoring systems, Acoustic Doppler Current Profilers (ADCP), tidal stations, and meteorological observation stations. Combined with our high-resolution multi-beam hydrographic bathymetry, sub-bottom acoustic profiling, side-scan sonar, and marine hazard mapping, we provide offshore operators with real-time marine intelligence for drilling, pipeline routing, and environmental compliance.',
    'Dramatically de-risks offshore drilling, pipeline routing, and marine construction by identifying subsea hazards and seabed scour. Real-time MetOcean data optimizes vessel logistics, gangway operations, and maintains full compliance with NUPRC and international maritime safety standards.',
    '/assets/marine_intel_metocean.jpg',
    '/assets/marine_intel_metocean.jpg',
    '["High-Resolution Marine Geophysical & Acoustic Surveys", "Multi-Beam Echo Sounder (MBES) Hydrographic Bathymetry", "Sub-Bottom Profiling, Side-Scan Sonar & Magnetometry", "MetOcean Telemetry Buoys & Wave/Current Monitoring (Frankstar)", "Meteorological Observation Stations & Oceanographic Logging", "Marine Environmental Compliance, Water Quality & Hazard Detection", "Subsea Pipeline Route Characterisation & Hazard Clearance", "Real-Time Marine Data Transmission & Operational Monitoring"]'::jsonb,
    '["Prevents costly subsea pipeline routing and drilling hazards", "Real-time wave, current, tide and weather telemetry", "Full compliance with NUPRC & IMO hydrographic standards"]'::jsonb,
    ARRAY['Gulf of Guinea Deepwater', 'Nearshore Energy Corridors', 'Coastal Jetties & Terminals', 'Niger Delta Estuaries', 'Offshore Exploration Blocks'],
    ARRAY['Multi-Beam Echo Sounders (MBES)', 'Sub-bottom Profilers (Chirp/Pinger)', 'Side Scan Sonar', 'Frankstar MetOcean Buoys', 'ADCP Current Profilers'],
    ARRAY['Hydrographic survey line planning & geodetic calibration', 'Multi-sensor geophysical acoustic acquisition (sonar, sub-bottom, magnetics)', 'Frankstar MetOcean telemetry buoy deployment & real-time telemetry configuration', 'Wave, current, tide & meteorological data streaming & cloud analytics', 'Seabed stratigraphic interpretation, gas hazard detection & bathymetric contouring', 'Integrated marine engineering reporting & GIS charting'],
    ARRAY['Dual-Frequency Multi-Beam Echo Sounders (MBES)', 'High-Resolution Sub-bottom Profilers', 'Side Scan Sonar Systems & Marine Magnetometers', 'Acoustic Doppler Current Profilers (ADCP)', 'Frankstar Oceanographic & MetOcean Telemetry Buoys', 'Meteorological Observation Stations & Subsea Telemetry Loggers'],
    'Consult Offshore Geoscientists',
    '/contact',
    '{"partnerName": "Frankstar Technology", "role": "Strategic MetOcean Technology Partner"}'::jsonb,
    5,
    true,
    'published',
    'Offshore Intelligence & MetOcean Monitoring | PIGL',
    'Offshore bathymetric surveys, marine geophysics, and real-time metocean telemetry for the Nigerian energy sector.'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    division = EXCLUDED.division,
    category = EXCLUDED.category,
    tagline = EXCLUDED.tagline,
    short_description = EXCLUDED.short_description,
    full_description = EXCLUDED.full_description,
    business_value = EXCLUDED.business_value,
    capabilities = EXCLUDED.capabilities,
    benefits = EXCLUDED.benefits,
    operating_environments = EXCLUDED.operating_environments,
    technology = EXCLUDED.technology,
    methodology = EXCLUDED.methodology,
    equipment = EXCLUDED.equipment,
    partner_badge = EXCLUDED.partner_badge,
    display_order = EXCLUDED.display_order,
    status = EXCLUDED.status,
    updated_at = timezone('utc'::text, now());

-- Blog Categories
INSERT INTO blog_categories (name, slug, display_order) VALUES
('Technical Updates', 'technical-updates', 1),
('Project Milestones', 'project-milestones', 2),
('Industry Insights', 'industry-insights', 3),
('HSSEQ & Safety', 'hsseq-safety', 4),
('Company News', 'company-news', 5)
ON CONFLICT (slug) DO NOTHING;

-- Blog Posts Seed Data
INSERT INTO blog_posts (
    slug, title, excerpt, content, featured_image, author, category, tags, status, featured, published_at, seo_title, seo_description
) VALUES
(
    'pigl-deploys-leica-rtc360-digital-twins-niger-delta',
    'PIGL Deploys Leica RTC360 High-Density 3D Laser Scanning for Niger Delta Brownfield Digital Twins',
    'Polaris Integrated & GeoSolutions Limited (PIGL) has achieved a significant engineering milestone with the deployment of high-speed Leica RTC360 laser scanning across key offshore flow stations in the Niger Delta.',
    '## Revolutionizing Brownfield Asset Management in Sub-Saharan Africa

Polaris Integrated & GeoSolutions Limited (PIGL) continues to pioneer digital transformation across the Nigerian oil and gas landscape. Our reality capture teams recently concluded an extensive 3D laser scanning campaign on critical brownfield production assets in the Niger Delta.

### Millimeter Precision in High-Risk Environments

Operating in hazardous offshore production environments demands extreme precision without compromising personnel safety. Deploying the **Leica RTC360**, our engineering surveyors captured over 150 high-resolution spherical scans per day with integrated High-Dynamic-Range (HDR) imagery.

Key technical deliverables included:
- **Registered Point Clouds**: Millimeter-accurate geometric models of complex pipe racks, manifold skids, and structural steelworks.
- **Intelligent As-Built 3D CAD**: Converted directly into Autodesk Plant 3D and Revit formats for brownfield engineering modifications.
- **Clash Detection**: Pinpointing over 45 potential construction interferences prior to spool fabrication, eliminating expensive field rework.

> *"By converting physical facilities into living digital twins, we give operators total clarity over their assets from anywhere in the world, reducing offshore mobilization requirements and ensuring 100% first-time-fit engineering."*
> — **Engr. Chigozie Bosah**, Managing Director, PIGL

### Environmental & Safety Impact

Through digital reality capture, asset owners avoided more than 300 hours of hot-work field measuring and reduced overall shutdown duration by 35%. PIGL remains dedicated to driving safety, efficiency, and engineering excellence across Nigeria''s energy corridors.',
    '/assets/IMG_6170.jpg',
    'Engr. Chigozie Bosah',
    'Technical Updates',
    ARRAY['3D Reality Capture', 'Digital Twins', 'Leica RTC360', 'Brownfield Engineering', 'Niger Delta'],
    'published',
    true,
    '2026-08-15 09:00:00+00',
    'PIGL Deploys Leica RTC360 3D Laser Scanning for Brownfield Digital Twins',
    'Learn how PIGL utilizes Leica RTC360 laser scanning to produce millimeter-precise 3D digital twins for offshore energy facilities.'
),
(
    'strategic-technology-alliance-frankstar-technology',
    'PIGL Announces Strategic Technology Partnership with Frankstar Technology for Oceanographic & Metocean Systems',
    'PIGL enters into a strategic alliance with Frankstar Technology to deploy advanced oceanographic monitoring buoys, wave telemetry, and marine meteorological observation systems across the Gulf of Guinea.',
    '## Strengthening Offshore Marine Intelligence Across Nigeria

Polaris Integrated & GeoSolutions Limited (PIGL) is pleased to announce a strategic partnership with **Frankstar Technology**, an international innovator in oceanographic and meteorological sensor engineering.

This collaboration expands PIGL''s **Marine Intelligence** capabilities, enabling real-time telemetry, wave height monitoring, current profiling, and deepwater meteorological tracking for offshore oil and gas operators.

### Technical Synergy & Fleet Capabilities

Under this alliance, PIGL integrates Frankstar''s state-of-the-art oceanographic buoys and subsea sensors with our local marine hydrographic survey fleet in Port Harcourt.

```
+-----------------------------+------------------------------------+
| Capability                  | Operational Benefit                |
+-----------------------------+------------------------------------+
| Real-time Wave Telemetry    | Optimizes offshore vessel loading  |
| ADCP Current Profiling      | Safe subsea pipeline installation  |
| Meteorological Telemetry    | Early storm & squall warning       |
| Solar & Wave-Powered Buoys  | Autonomous 12-month field tracking |
+-----------------------------+------------------------------------+
```

### Supporting NUPRC & Marine Safety Compliance

With stringent regulatory oversight in Nigerian offshore waters, accurate metocean data is essential for Environmental Impact Assessments (EIAs), rig positioning, and spill trajectory modeling. PIGL and Frankstar deliver turnkey data streams accessible via secure cloud dashboards.',
    '/assets/marine_intel_metocean.jpg',
    'PIGL Marine Technical Team',
    'Project Milestones',
    ARRAY['Marine Intelligence', 'Frankstar Technology', 'Metocean', 'Oceanography', 'Gulf of Guinea'],
    'published',
    true,
    '2026-07-20 10:30:00+00',
    'PIGL and Frankstar Technology Strategic Marine Alliances',
    'PIGL and Frankstar Technology announce strategic alliance for advanced metocean telemetry and marine monitoring across Nigerian offshore waters.'
),
(
    'pigl-achieves-500000-safe-man-hours-zero-lti',
    'Polaris Integrated & GeoSolutions Achieves 500,000+ Safe Man-Hours with Zero LTI',
    'PIGL celebrates over 500,000 consecutive safe work hours without a Lost Time Injury (LTI), underscoring our relentless commitment to ISO 45001:2018 and ISO 9001:2015 standards.',
    '## Safety Engineered into Every Operation

At Polaris Integrated & GeoSolutions Limited (PIGL), safety is not merely a policy—it is the foundational standard of our corporate culture. We are proud to announce the achievement of **over 500,000 safe man-hours with zero Lost Time Injuries (LTI)** across all onshore, swamp, and offshore engineering operations.

### Rigorous HSSEQ Implementation

Operating across challenging terrains—including mangrove swamps, intertidal mudflats, and offshore platforms—requires uncompromising discipline. Our ISO 45001:2018 certified occupational health and safety system ensures:

1. **Daily Toolbox Talks & Job Safety Analyses (JSA)** conducted prior to every field deployment.
2. **Comprehensive Journey Management Plans** for marine vessels and road logistics.
3. **Continuous HSSE Training** for all geotechnical drillers, survey crew members, and engineering personnel.
4. **Empowered Stop-Work Authority** exercised by every team member without hesitation.

> *"Reaching 500,000 safe man-hours with zero LTI reflects the dedication of our field technicians and engineers who prioritize safety every single day. We will continue setting the benchmark for indigenous engineering reliability."*

PIGL remains committed to delivering world-class engineering solutions while protecting our personnel, our clients, and the natural environment.',
    '/assets/management/layefa.png',
    'Layefa Oruoghor (HSSE Manager)',
    'HSSEQ & Safety',
    ARRAY['HSSE', 'ISO 45001', 'Safety Milestone', 'Zero LTI', 'Indigenous Engineering'],
    'published',
    false,
    '2026-06-10 14:00:00+00',
    'PIGL Achieves 500,000 Safe Man-Hours with Zero LTI',
    'Polaris Integrated & GeoSolutions marks 500,000 safe man-hours with zero LTI across complex swamp and offshore operations.'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    excerpt = EXCLUDED.excerpt,
    content = EXCLUDED.content,
    featured_image = EXCLUDED.featured_image,
    author = EXCLUDED.author,
    category = EXCLUDED.category,
    tags = EXCLUDED.tags,
    status = EXCLUDED.status,
    featured = EXCLUDED.featured,
    updated_at = timezone('utc'::text, now());

-- Homepage Sliders Seed Data
INSERT INTO sliders (
    title, subtitle, description, desktop_image, mobile_image, video_url, cta_text, cta_url, display_order, is_active
) VALUES
(
    'Pioneering Sub-Surface & Digital Geosolutions',
    'Indigenous Engineering Excellence Across Sub-Saharan Africa',
    'Delivering high-precision 3D reality capture, marine geophysics, geotechnical soil mechanics, and asset assurance for energy leaders.',
    '/assets/DJI_0003.jpg',
    '/assets/DJI_0003.jpg',
    '/assets/FRANKSTAR LOOP.mp4',
    'Explore Our Capabilities',
    '/services',
    1,
    true
),
(
    'Subsea Marine Intelligence & Metocean Systems',
    'In Partnership with Frankstar Technology',
    'Deploying oceanographic buoys, multi-beam acoustic bathymetry, and sub-bottom profiling to safeguard offshore marine assets.',
    '/assets/marine_intel_metocean.jpg',
    '/assets/marine_intel_metocean.jpg',
    NULL,
    'Discover Marine Intelligence',
    '/services/marine-intelligence',
    2,
    true
),
(
    'Asset Integrity & Advanced NDT Technologies',
    'In Partnership with CoaleXpert',
    'Certified non-destructive testing, acoustic emission structural monitoring, and life-extension assurance for industrial facilities.',
    '/assets/IMG_6170.jpg',
    '/assets/IMG_6170.jpg',
    NULL,
    'View Asset Integrity Solutions',
    '/services/asset-integrity-management',
    3,
    true
)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 10. ADMIN USERS & PRIVILEGES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Content Editor' NOT NULL,
    avatar_url TEXT,
    job_title TEXT,
    phone VARCHAR(50),
    bio TEXT,
    status VARCHAR(20) DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read admin users" ON admin_users;
CREATE POLICY "Public read admin users" ON admin_users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Full access to admin users" ON admin_users;
CREATE POLICY "Full access to admin users" ON admin_users FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed initial Admin Users
INSERT INTO admin_users (email, full_name, role, status) VALUES
('admin@polarisigl.com', 'PIGL System Administrator', 'Super Admin', 'active'),
('chigozie.bosah@polarisigl.com', 'Engr. Chigozie Bosah', 'Super Admin', 'active'),
('communications@polarisigl.com', 'Technical Editorial Desk', 'Content Editor', 'active')
ON CONFLICT (email) DO NOTHING;

-- ==============================================================================
-- 11. CONTACT INQUIRIES & RFPS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    company VARCHAR(255),
    service_interest VARCHAR(255) DEFAULT 'General Consultation',
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'in_review', 'responded', 'archived')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert contact inquiries" ON contact_inquiries;
CREATE POLICY "Public insert contact inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Full access to contact inquiries" ON contact_inquiries;
CREATE POLICY "Full access to contact inquiries" ON contact_inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed initial inquiry examples
INSERT INTO contact_inquiries (name, email, phone, company, service_interest, message, status) VALUES
('Engr. Tunde Adeleke', 'tunde.adeleke@energycorp.ng', '+234 803 123 4567', 'West Africa Gas & Energy', 'Ground Intelligence', 'Requesting comprehensive geotechnical soil investigation and 20-ton CPT testing for proposed flowstation expansion in Rivers State.', 'in_review'),
('Capt. Marcus Davies', 'm.davies@offshorelogistics.com', '+234 812 987 6543', 'Atlantic Marine Services', 'Offshore Intelligence', 'Inquiring regarding Metocean telemetry buoy deployment and multi-beam bathymetric survey for deepwater drilling corridor.', 'new')
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 12. AUDIT LOGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(255),
    details JSONB DEFAULT '{}'::jsonb,
    user_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated read audit logs" ON audit_logs;
CREATE POLICY "Authenticated read audit logs" ON audit_logs FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated insert audit logs" ON audit_logs;
CREATE POLICY "Authenticated insert audit logs" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ==============================================================================
-- 13. STRATEGIC TECHNOLOGY PARTNERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS partners (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(150) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    specialty VARCHAR(255),
    description TEXT,
    capabilities JSONB DEFAULT '[]'::jsonb,
    website TEXT,
    logo_url TEXT,
    image_url TEXT,
    service_id VARCHAR(100) DEFAULT 'offshore-intelligence',
    service_title VARCHAR(255) DEFAULT 'Offshore Intelligence',
    display_order INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'published' NOT NULL CHECK (status IN ('published', 'draft', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read published partners" ON partners;
CREATE POLICY "Public read published partners" ON partners FOR SELECT USING (true);
DROP POLICY IF EXISTS "Full access to partners" ON partners;
CREATE POLICY "Full access to partners" ON partners FOR ALL USING (true) WITH CHECK (true);

-- Seed initial Partners
INSERT INTO partners (id, slug, name, role, specialty, description, capabilities, website, logo_url, service_id, service_title, display_order, status) VALUES
('frankstar', 'frankstar-technology', 'Frankstar Technology', 'Exclusive Nigerian Marine Intelligence & Metocean Partner', 'Autonomous Oceanographic & Metocean Systems', 'PIGL partners exclusively with Frankstar Technology to deploy state-of-the-art metocean telemetry buoys, acoustic Doppler current profilers (ADCP), and autonomous offshore environmental observation platforms across Nigerian territorial waters.', '["Metocean Telemetry Buoy Systems","ADCP Current Profile Characterization","Deepwater Acoustic Profiling","Satellite-Linked Environmental Telemetry","Wave Spectrum & Hydrodynamic Modeling"]'::jsonb, 'http://www.frankstar.com.cn/', '/assets/frankstar_logo.png', 'offshore-intelligence', 'Offshore Intelligence', 1, 'published'),
('coalexpert', 'coalexpert-environmental', 'CoaleXpert', 'Specialized Environmental & Water Separation Partner', 'Advanced Industrial Coalescing Separation Systems', 'In partnership with CoaleXpert, PIGL delivers high-efficiency produced water separation units, specialized industrial coalescers, and oily water treatment solutions engineered specifically for high-capacity Niger Delta flowstations.', '["High-Efficiency Coalescing Separators","Produced Water Treatment & Oil Recovery","Produced Water Polishing & Compliance Systems","Oily Water Effluent Management","Refinery Drain & Sump Treatment Systems"]'::jsonb, '', '', 'industrial-environmental-technologies', 'Industrial & Environmental Technologies', 2, 'published'),
('npk', 'npk-automation', 'NPK Automation', 'Global Procurement & Instrumentation Affiliate', 'Industrial Process Automation & Valve Solutions', 'Through our strategic procurement relationship with NPK Automation, PIGL sources and qualifies critical path equipment including specialized actuators, industrial safety valves, and hazardous area sensors meeting strict ISO and API certifications.', '["Automated Control Valve Assemblies","Explosion-Proof Instrumentation & Transmitters","Hazardous Area Sensor Packages","Pipeline Integrity Spares & Flow Components","Rapid Spares Qualification & SCM"]'::jsonb, '', '', 'integrated-engineering-construction-solutions', 'Integrated Engineering & Construction Solutions', 3, 'published')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 14. EXECUTED PROJECTS & CASE STUDIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    client VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    year VARCHAR(20) DEFAULT '2024',
    location VARCHAR(255) DEFAULT 'Nigeria',
    description TEXT,
    challenge TEXT,
    solution TEXT,
    scope TEXT,
    results TEXT,
    equipment JSONB DEFAULT '[]'::jsonb,
    image TEXT,
    featured BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'published' NOT NULL CHECK (status IN ('published', 'draft', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read published projects" ON projects;
CREATE POLICY "Public read published projects" ON projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Full access to projects" ON projects;
CREATE POLICY "Full access to projects" ON projects FOR ALL USING (true) WITH CHECK (true);

-- Seed initial Projects
INSERT INTO projects (id, title, client, category, year, location, description, challenge, solution, scope, results, equipment, image, featured, status) VALUES
('p1', '3D Terrestrial Laser Scanning & Digital Twin for Offshore Platform', 'Major IOC Operator', 'Intelligence', '2024', 'Offshore Niger Delta, Nigeria', 'High-accuracy reality capture and comprehensive 3D CAD modeling of topside process piping, structural decks, and emergency egress corridors on an active production platform.', 'Brownfield offshore modifications with complex congested piping without shutdown.', 'Deployed high-speed Leica RTC360 laser scanners with sub-millimeter precision to produce full point cloud digital twins.', 'Complete 3D reality capture, clash detection analysis, and As-Built intelligent BIM generation.', 'Zero shutdown time, 100% clash elimination before prefabrication, zero safety incidents.', '["Leica RTC360 3D Laser Scanner","Leica Cyclone 3D Processing Engine","PointCab Software Suite","Intelligent BIM Modeling Workstation"]'::jsonb, '/assets/projects/laser_scanning.jpg', true, 'published'),
('p2', 'Geotechnical Soil Investigation & 20-Ton CPT Foundation Scoping', 'Leading Energy Consortium', 'Intelligence', '2024', 'Rivers State Swamp & Coastal Basin', 'In-situ geotechnical exploration, deep borehole rotary coring, and continuous piezocone penetration testing (CPTu) for proposed high-pressure gas processing terminal.', 'Challenging soft intertidal marsh soil prone to severe differential settlement.', 'Utilized 20-ton hydraulic CPT rigs mounted on amphibious tracks with specialized piezocone logging.', 'Borehole drilling to 45m depth, CPTu soundings to refusal, and laboratory soil mechanics testing.', 'Prevented catastrophic foundation failure and optimized piling engineering design by 22%.', '["20-Ton Heavy-Duty Hydraulic CPT Rig","High-Capacity Rotary Core Drill Unit","Specialized Piezocone Logging Modules","Soil Mechanics Laboratory Test Cells"]'::jsonb, '/assets/cpt.png', true, 'published'),
('p3', 'High-Precision Pipeline Right-of-Way (RoW) Topographic & Route Survey', 'Gas Transmission Utility', 'Pipeline', '2023', 'Delta & Edo State Corridor, Nigeria', 'Multi-kilometer geodesic topographic alignment and utility corridor mapping for a 36-inch cross-country natural gas pipeline expansion.', 'Dense rainforest canopy, river crossings, and existing energized underground utilities.', 'Combined Dual-Frequency GNSS RTK base/rover setups with total station cross-sections and sub-bottom profiling at water crossings.', 'Cadastral demarcation, topographic profiling, underground utility identification, and GIS mapping.', 'Completed survey 14 days ahead of construction schedule with zero HSE non-conformances.', '["Leica Viva GNSS RTK Receivers","Leica TS16 Robotic Total Stations","Digital Levels with Invar Staffs","Geographic Information System (GIS) Engines"]'::jsonb, '/assets/slider.jpeg', false, 'published')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 15. CAREERS: JOB OPENINGS & VACANCIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS job_openings (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(255) DEFAULT 'Port Harcourt / Lagos, Nigeria',
    type VARCHAR(50) DEFAULT 'Full-time',
    experience_level VARCHAR(50) DEFAULT '3+ Years',
    description TEXT,
    requirements JSONB DEFAULT '[]'::jsonb,
    responsibilities JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'closed', 'draft')),
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read active jobs" ON job_openings;
CREATE POLICY "Public read active jobs" ON job_openings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Full access to job openings" ON job_openings;
CREATE POLICY "Full access to job openings" ON job_openings FOR ALL USING (true) WITH CHECK (true);

-- Seed initial Job Openings
INSERT INTO job_openings (id, title, department, location, type, experience_level, description, requirements, responsibilities, status, display_order) VALUES
('job-1', 'Senior Geotechnical Engineer', 'Ground Intelligence', 'Port Harcourt, Rivers State', 'Full-time', '5+ Years', 'Lead geotechnical site characterisation campaigns, 20-ton CPTu data interpretation, foundation design analysis, and technical report delivery for major offshore and swamp infrastructure projects.', '["B.Sc / M.Sc in Civil / Geotechnical Engineering","COREN Registered or eligible","Proficiency with CPTu interpretation and foundation settlement analysis","Demonstrated experience in Niger Delta terrain"]'::jsonb, '["Oversee in-situ field testing and borehole drilling crews","Prepare comprehensive Geotechnical Interpretative Reports (GIR)","Liaise directly with client engineering teams on piling and soil mechanics"]'::jsonb, 'active', 1),
('job-2', 'Reality Capture & 3D Laser Scanning Specialist', 'Digital Intelligence', 'Lagos / Field Deployments', 'Full-time', '3+ Years', 'Execute high-precision 3D terrestrial laser scanning (TLS) campaigns using Leica RTC360 scanners and generate registered point clouds, As-Built 3D CAD models, and intelligent BIM digital twins.', '["Degree in Geomatics, Surveying, Mechanical or Civil Engineering","Hands-on expertise with Leica RTC360 / BLK360 hardware","Proficiency in Leica Cyclone, Register 360, Autodesk Revit/Plant 3D"]'::jsonb, '["Conduct on-site 3D laser scanning on offshore platforms and industrial plants","Perform target and cloud-to-cloud registration with sub-millimeter error tolerances","Produce 3D As-Built CAD models and clash detection deliverables"]'::jsonb, 'active', 2)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 16. CAREERS: JOB APPLICATIONS & CV INBOX TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS job_applications (
    id VARCHAR(100) PRIMARY KEY,
    job_id VARCHAR(100),
    job_title VARCHAR(255) DEFAULT 'General Application',
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(100) NOT NULL,
    resume_url TEXT NOT NULL,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'shortlisted', 'interviewed', 'hired', 'rejected')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert job applications" ON job_applications;
CREATE POLICY "Public insert job applications" ON job_applications FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Full access to job applications" ON job_applications;
CREATE POLICY "Full access to job applications" ON job_applications FOR ALL USING (true) WITH CHECK (true);

-- Seed initial Application examples
INSERT INTO job_applications (id, job_id, job_title, applicant_name, applicant_email, applicant_phone, resume_url, cover_letter, status) VALUES
('app-1', 'job-1', 'Senior Geotechnical Engineer', 'Engr. Emeka Okonkwo', 'e.okonkwo@example.com', '+234 803 765 4321', '/assets/PIGL COMPANY PROFILE.pdf', 'Over 7 years of geotechnical field investigation and foundation analysis experience in the Niger Delta basin.', 'new'),
('app-2', 'job-2', 'Reality Capture & 3D Laser Scanning Specialist', 'David Alabi', 'david.alabi@example.com', '+234 814 555 1234', '/assets/PIGL COMPANY PROFILE.pdf', 'Certified Leica Cyclone user with 4 years experience scanning brownfield flowstations and offshore rigs.', 'shortlisted')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 17. SITE SETTINGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS site_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'site-config',
    company_name VARCHAR(255) DEFAULT 'Polaris Integrated & GeoSolutions Limited',
    primary_email VARCHAR(255) DEFAULT 'info@polarisigl.com',
    primary_phone VARCHAR(100) DEFAULT '+234 809 708 1333',
    address_port_harcourt TEXT DEFAULT '10 Okuru Road, Off Peter Odili Road, Trans-Amadi Industrial Layout, Port Harcourt, Rivers State, Nigeria',
    address_lagos TEXT DEFAULT 'Victoria Island, Lagos State, Nigeria',
    social_linkedin TEXT DEFAULT 'https://linkedin.com/company/polaris-integrated-geosolutions',
    social_twitter TEXT DEFAULT 'https://x.com/polarisigl',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read site settings" ON site_settings;
CREATE POLICY "Public read site settings" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Full access to site settings" ON site_settings;
CREATE POLICY "Full access to site settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

INSERT INTO site_settings (id, company_name, primary_email, primary_phone) VALUES
('site-config', 'Polaris Integrated & GeoSolutions Limited', 'info@polarisigl.com', '+234 809 708 1333')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 18. STORAGE BUCKETS INITIALIZATION
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES
('cms-images', 'cms-images', true),
('resumes', 'resumes', true),
('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Resumes bucket policy
DROP POLICY IF EXISTS "Public upload to resumes" ON storage.objects;
CREATE POLICY "Public upload to resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');
DROP POLICY IF EXISTS "Public view resumes" ON storage.objects;
CREATE POLICY "Public view resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');

-- ==============================================================================
-- 19. VENDOR ONBOARDING & TAX COMPLIANCE (PIGL/F/VOTC/AHR/037)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS vendor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT UNIQUE NOT NULL,
  form_code TEXT NOT NULL DEFAULT 'PIGL/F/VOTC/AHR/037 Rev. No. 00',
  vendor_legal_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  rc_bn_number TEXT NOT NULL,
  incorporation_date TEXT,
  registered_address TEXT NOT NULL,
  operational_address TEXT,
  is_operational_same_as_registered BOOLEAN NOT NULL DEFAULT true,
  nature_of_services JSONB NOT NULL DEFAULT '[]'::jsonb,
  nature_of_services_other TEXT,
  tin_number TEXT NOT NULL,
  vat_status TEXT NOT NULL,
  vat_reg_number TEXT,
  vat_certificate_url TEXT,
  wht_deduction_acknowledged BOOLEAN NOT NULL DEFAULT true,
  wht_remittance_acknowledged BOOLEAN NOT NULL DEFAULT true,
  wht_credit_note_acknowledged BOOLEAN NOT NULL DEFAULT true,
  vat_non_deduction_acknowledged BOOLEAN NOT NULL DEFAULT true,
  bank_name TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  currency TEXT DEFAULT 'NGN',
  contact_name TEXT NOT NULL,
  contact_designation TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  declaration_acknowledged BOOLEAN NOT NULL DEFAULT true,
  representative_name TEXT NOT NULL,
  signature_url TEXT,
  stamp_url TEXT,
  submission_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  procurement_reviewer TEXT,
  finance_reviewer TEXT,
  vat_status_verified BOOLEAN DEFAULT false,
  approved_vendor_category TEXT,
  approval_date TIMESTAMPTZ,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure all columns exist for existing database installations
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS reference_number TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS vendor_legal_name TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS rc_bn_number TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS incorporation_date TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS registered_address TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS operational_address TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS is_operational_same_as_registered BOOLEAN DEFAULT true;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS nature_of_services JSONB DEFAULT '[]'::jsonb;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS nature_of_services_other TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS vat_reg_number TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS wht_deduction_acknowledged BOOLEAN DEFAULT true;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS wht_remittance_acknowledged BOOLEAN DEFAULT true;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS wht_credit_note_acknowledged BOOLEAN DEFAULT true;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS vat_non_deduction_acknowledged BOOLEAN DEFAULT true;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS account_number TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'NGN';
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS contact_designation TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS representative_name TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS signature_url TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS stamp_url TEXT;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS submission_date TIMESTAMPTZ DEFAULT now();
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS vat_status_verified BOOLEAN DEFAULT false;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS approval_date TIMESTAMPTZ;
ALTER TABLE vendor_applications ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Indexing for lookup speed
CREATE INDEX IF NOT EXISTS idx_vendor_apps_ref_num ON vendor_applications(reference_number);
CREATE INDEX IF NOT EXISTS idx_vendor_apps_legal_name ON vendor_applications(vendor_legal_name);
CREATE INDEX IF NOT EXISTS idx_vendor_apps_tin ON vendor_applications(tin_number);
CREATE INDEX IF NOT EXISTS idx_vendor_apps_status ON vendor_applications(status);

-- Enable RLS
ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;

-- Policies for vendor applications
DROP POLICY IF EXISTS "Public users can submit vendor applications" ON vendor_applications;
CREATE POLICY "Public users can submit vendor applications" ON vendor_applications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public users can track vendor applications" ON vendor_applications;
CREATE POLICY "Public users can track vendor applications" ON vendor_applications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage vendor applications" ON vendor_applications;
CREATE POLICY "Admins can manage vendor applications" ON vendor_applications FOR ALL USING (true);

-- Storage bucket for vendor documents
INSERT INTO storage.buckets (id, name, public) VALUES
('vendor-documents', 'vendor-documents', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public upload to vendor-documents" ON storage.objects;
CREATE POLICY "Public upload to vendor-documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vendor-documents');

DROP POLICY IF EXISTS "Public view vendor-documents" ON storage.objects;
CREATE POLICY "Public view vendor-documents" ON storage.objects FOR SELECT USING (bucket_id = 'vendor-documents');

-- =====================================================================
-- EMAIL CAMPAIGNS, SUBSCRIBERS & DIRECT FOLLOW-UP BROADCASTS
-- =====================================================================

CREATE TABLE IF NOT EXISTS email_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  company TEXT,
  source TEXT NOT NULL DEFAULT 'newsletter',
  status TEXT NOT NULL DEFAULT 'active',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_emailed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON email_subscribers(status);

ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can subscribe" ON email_subscribers;
CREATE POLICY "Public can subscribe" ON email_subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can manage subscribers" ON email_subscribers;
CREATE POLICY "Admins can manage subscribers" ON email_subscribers FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS email_campaigns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  preheader TEXT,
  bcc_recipients TEXT,
  audience_segment TEXT NOT NULL DEFAULT 'all_subscribers',
  target_tag TEXT,
  category TEXT NOT NULL DEFAULT 'service_promotion',
  content_html TEXT NOT NULL,
  content_text TEXT,
  featured_service_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  recipients_count INT NOT NULL DEFAULT 0,
  delivered_count INT NOT NULL DEFAULT 0,
  opened_count INT NOT NULL DEFAULT 0,
  clicked_count INT NOT NULL DEFAULT 0,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_by TEXT DEFAULT 'admin@polarisigl.com',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage campaigns" ON email_campaigns;
CREATE POLICY "Admins can manage campaigns" ON email_campaigns FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS direct_followups (
  id TEXT PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  bcc_recipients TEXT,
  subject TEXT NOT NULL,
  message TEXT,
  template_type TEXT DEFAULT 'rfp_consultation',
  related_entity_type TEXT,
  related_entity_id TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_by TEXT NOT NULL DEFAULT 'admin@polarisigl.com',
  status TEXT NOT NULL DEFAULT 'sent'
);

ALTER TABLE direct_followups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage direct followups" ON direct_followups;
CREATE POLICY "Admins can manage direct followups" ON direct_followups FOR ALL USING (true);

-- =====================================================================
-- WEBSITE VISITATION & TRAFFIC TELEMETRY
-- =====================================================================

CREATE TABLE IF NOT EXISTS website_telemetry (
  id TEXT PRIMARY KEY,
  page_path TEXT NOT NULL,
  session_id TEXT,
  visitor_id TEXT,
  referrer TEXT,
  user_agent TEXT,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure all columns exist for existing database tables
ALTER TABLE website_telemetry ADD COLUMN IF NOT EXISTS visitor_id TEXT;
ALTER TABLE website_telemetry ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE website_telemetry ADD COLUMN IF NOT EXISTS referrer TEXT;
ALTER TABLE website_telemetry ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE website_telemetry ADD COLUMN IF NOT EXISTS visited_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_telemetry_visited_at ON website_telemetry(visited_at);
CREATE INDEX IF NOT EXISTS idx_telemetry_page_path ON website_telemetry(page_path);
CREATE INDEX IF NOT EXISTS idx_telemetry_visitor_id ON website_telemetry(visitor_id);

ALTER TABLE website_telemetry ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can insert telemetry" ON website_telemetry;
CREATE POLICY "Public can insert telemetry" ON website_telemetry FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can view telemetry" ON website_telemetry;
CREATE POLICY "Admins can view telemetry" ON website_telemetry FOR ALL USING (true);

-- =====================================================================
-- EXECUTIVE MANAGEMENT TEAM TABLE & RLS
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT DEFAULT 'Executive Management',
    image TEXT NOT NULL,
    bio TEXT,
    linkedin TEXT,
    email TEXT,
    display_order INT DEFAULT 1,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all columns exist for existing installations
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Executive Management';
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS linkedin TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;

CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON public.team_members(status);
CREATE INDEX IF NOT EXISTS idx_team_members_department ON public.team_members(department);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public can view active team members" ON public.team_members;
CREATE POLICY "Public can view active team members"
ON public.team_members FOR SELECT
USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;
CREATE POLICY "Admins can manage team members"
ON public.team_members FOR ALL
USING (true);

-- Seed Initial Management Team Members
INSERT INTO public.team_members (id, name, role, department, image, bio, linkedin, email, display_order, status)
VALUES
    ('team-1', 'Dr. Chigozie Dimgba', 'MD/CEO', 'Executive Management', '/assets/management/chigozie.png', 'Managing Director and Chief Executive Officer guiding PIGL technical vision and strategic energy alliances.', 'https://www.linkedin.com/in/chigozie-dimgba-phd-fnis-jp-1b517711/', 'chigozie.dimgba@polarisigl.com', 1, 'active'),
    ('team-2', 'Nnenna Ndubuisi', 'Chief Corporate Officer', 'Executive Management', '/assets/management/nnenna.png', 'Leads corporate governance, organizational compliance, and institutional administration.', 'https://www.linkedin.com/company/polarisigl/', 'nnenna.ndubuisi@polarisigl.com', 2, 'active'),
    ('team-3', 'Adamu Alumum Isaac', 'Chief Financial Officer', 'Finance & Accounting', '/assets/management/isaac.png', 'Oversees capital allocation, fiscal planning, and commercial strategy across all regional projects.', 'https://www.linkedin.com/company/polarisigl/', 'isaac.adamu@polarisigl.com', 3, 'active'),
    ('team-4', 'Analiefo Nzegwu', 'ED. Operations', 'Operations & Engineering', '/assets/management/Anali.png', 'Directs offshore, swamp, and land engineering operations, field execution, and asset delivery.', 'https://www.linkedin.com/company/polarisigl/', 'analiefo.nzegwu@polarisigl.com', 4, 'active'),
    ('team-5', 'Layefa Chituru Igbe', 'Head, Business Development', 'Business Development', '/assets/management/layefa.png', 'Leads commercial client partnerships, bid management, and energy sector alliances.', 'https://www.linkedin.com/company/polarisigl/', 'layefa.igbe@polarisigl.com', 5, 'active'),
    ('team-6', 'Uduma Ikpa Obianuju', 'Company Secretary / Legal Adviser', 'Legal & Regulatory Compliance', '/assets/management/uju.png', 'Manages legal affairs, contracts, statutory regulatory compliance, and corporate secretariat.', 'https://www.linkedin.com/company/polarisigl/', 'obianuju.uduma@polarisigl.com', 6, 'active'),
    ('team-7', 'Brian Akpotowo', 'Head, Technical Services', 'Technical Services & Geomatics', '/assets/management/brian.png', 'Drives advanced geomatics, hydrographic survey, and dimensional reality capture solutions.', 'https://www.linkedin.com/company/polarisigl/', 'brian.akpotowo@polarisigl.com', 7, 'active'),
    ('team-8', 'Steve Ubani', 'Head, QHSSE', 'QHSSE & Compliance', '/assets/management/steve.png', 'Champions Goal Zero safety culture, environmental stewardship, and ISO 9001 / ISO 45001 compliance.', 'https://www.linkedin.com/company/polarisigl/', 'steve.ubani@polarisigl.com', 8, 'active')
ON CONFLICT (id) DO NOTHING;

