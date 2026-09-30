 
import { Service, Project, TeamMember, LinkedInPost, CoreValue, Partner, SubService } from './types';
import RealityCaptureImg from './assets/digital_intel_scanner.jpg';
import MarineIntelImg from './assets/marine_intel_metocean.jpg';
import GroundIntelImg from './assets/cpt.png';
import SpatialIntelImg from './assets/geomatics_survey.png';
import AssetIntegrityImg from './assets/IMG_6170.jpg';
import PipelineImg from './assets/newpipeline.png';
import RigImg from './assets/rig_positioning.png';
import WaterTreatmentImg from './assets/drilling.png';
import ProcurementImg from './assets/procure.jpg';

import GeosolutionsImg from './assets/DJI_0003.jpg';
import CivilWorksImg from './assets/road-feat-700x500.jpg';
import IntegratedImg from './assets/cabin.png';
import AkkImg from './assets/akk_pipeline.png';
import FacilityImg from './assets/new capture.png';
import DrillingImg from './assets/drilling.png';
import RoadImg from './assets/road.png';
import SubImg from './assets/sub.png';
import SliderImg from './assets/slider.jpeg';
import GreatHallImg from './assets/GREAT HALL.png';
import ChigozieImg from './assets/management/chigozie.png';
import NnennaImg from './assets/management/nnenna.png';
import IsaacImg from './assets/management/isaac.png';
import AnaliImg from './assets/management/Anali.png';
import LayefaImg from './assets/management/layefa.png';
import UjuImg from './assets/management/uju.png';
import BrianImg from './assets/management/brian.png';
import SteveImg from './assets/management/steve.png';
import TechImg from './assets/IMG_6170.jpg';
import NextGenImg from './assets/inspiring_next_gen.jpeg';
import TeamImg from './assets/team.jpeg';
import DigiTwinImg from './assets/digitwin.png';
import OceanImg from './assets/new ocean.png';
import SeismicSurveyImg from './assets/seismic_survey.png';
import AssetManagementImg from './assets/asset_management.png';
import GeomaticsSurveyImg from './assets/geomatics_survey.png';
import Iso9001Img from './assets/Q-Mark (ISO 9001).png';
import Iso45001Img from './assets/Q-Mark (ISO 45001).png';

// Authentic Field Operations & Asset Photography
import OpLogisticsBaseImg from './assets/operations/pigl_logistics_base_aerial.jpg';
import OpMarineCrewImg from './assets/operations/pigl_marine_crew_vessel.jpg';
import OpWeldingImg from './assets/operations/pigl_pipeline_marine_welding.jpg';
import OpGeomaticsImg from './assets/operations/pigl_geomatics_survey_quay.jpg';
import OpWinchPiglImg from './assets/operations/pigl_offshore_winch_pigl_container.jpg';
import OpOffshoreBargeImg from './assets/operations/pigl_offshore_geotech_drilling_barge.jpg';
import OpSubbottomSb216Img from './assets/operations/pigl_subbottom_profiler_sb216s.jpg';
import OpDrillCrewCasingImg from './assets/operations/pigl_offshore_drill_crew_casing.jpg';
import OpLaserCoolerImg from './assets/operations/pigl_3d_laser_scan_facility_cooler.jpg';
import OpLaserManifoldImg from './assets/operations/pigl_3d_laser_scan_manifold_station.jpg';
import OpRealityJettyImg from './assets/operations/pigl_3d_reality_capture_jetty_plant.jpg';
import OpPipelineSwampCatImg from './assets/operations/pigl_pipeline_construction_swamp_cat.jpg';

export const COLORS = {
  primary: '#064E3B',
  secondary: '#059669',
  accent: '#F97316',
  background: '#F8FAFC'
};

export const CONTACT_CONFIG = {
  phone: '+234-(0) 809 7081 333',
  phoneRaw: '+2348097081333',
  emailInfo: 'info@polarisigl.com',
  emailSupport: 'support@polarisigl.com',
  address: '#3, Diamond Close, Castle & Green Estate, Off Eneka Link Road, Port Harcourt, Rivers State, Nigeria',
  addressShort: '#3, Diamond Close, Port Harcourt, Rivers State, Nigeria',
  linkedin: 'https://www.linkedin.com/company/polarisigl/',
  youtube: 'https://www.youtube.com/embed/sExrHCIGkH0'
};

export const CORE_VALUES: CoreValue[] = [
  {
    title: 'Technical Integrity',
    description: 'Uncompromising engineering precision, transparent methodologies, and reliable data that clients and partners can always trust.',
    icon: '⚙️'
  },
  {
    title: 'Safety First (HSSE)',
    description: 'Safety is built into every project, maintaining strict health, safety, and environmental standards to protect our personnel, assets, and host communities.',
    icon: '⛑️'
  },
  {
    title: 'Innovation & Technology',
    description: 'Deploying high-precision 3D laser scanners, oceanographic buoys, and digital modeling tools to solve everyday energy challenges efficiently.',
    icon: '💡'
  },
  {
    title: 'Client Collaboration',
    description: 'Building long-term, transparent relationships with national and international energy companies as a dependable indigenous technical partner.',
    icon: '🛡️'
  }
];

// Services Under Ground Intelligence
export const GROUND_INTELLIGENCE_SERVICES: SubService[] = [
  {
    id: 'seismic-services',
    title: 'Seismic Services',
    description: '2D and 3D digital seismic surveys, data harvesting, node deployment and life of field surveys to support ongoing operations and foundation design.',
    icon: '📊'
  },
  {
    id: 'seabed-mapping',
    title: 'Seabed Mapping',
    description: 'Our geophysical surveys provide detailed information on the seabed and sub-seabed conditions.',
    icon: '🗺️'
  },
  {
    id: 'geotechnical-sampling',
    title: 'Geotechnical Sampling',
    description: 'We collect data from seabed sampling and in-situ testing to provide insights on soil characteristics.',
    icon: '🧪'
  },
  {
    id: 'asset-inspection',
    title: 'Asset Inspection',
    description: 'Our accurate, high-resolution inspection services provide insights to support offshore asset management.',
    icon: '🔍'
  },
  {
    id: 'hydrographic-survey',
    title: 'Hydrographic Survey',
    description: 'Our hydrographic survey services provide high precision seabed maps.',
    icon: '📐'
  },
  {
    id: 'search-and-salvage',
    title: 'Search and Salvage',
    description: 'Location and recovery of lost assets in shallow coastal waters down to the deepest depths of the ocean.',
    icon: '⚓'
  },
  {
    id: 'environmental-survey',
    title: 'Environmental survey',
    description: 'We support the understanding of complex marine ecosystems using habitat classification, statistical analyses, and in-depth data interpretation.',
    icon: '🌿'
  }
];

// Mapping for backward compatibility from old service URLs to the new architecture
export const LEGACY_SERVICE_MAP: Record<string, string> = {
  // Legacy aliases to 5 Canonical Platforms
  'reality-capture': 'digital-intelligence',
  '3d-laser-scanning': 'digital-intelligence',
  'digital-twins': 'digital-intelligence',
  'geophysical-surveys': 'offshore-intelligence',
  'marine-intelligence': 'offshore-intelligence',
  'climate-environmental-metocean': 'offshore-intelligence',
  'metocean': 'offshore-intelligence',
  'hydrographic-survey': 'ground-intelligence',
  'geotechnical-services': 'ground-intelligence',
  'onshore-nearshore-geotechnical': 'ground-intelligence',
  'seismic-services': 'ground-intelligence',
  'seabed-mapping': 'ground-intelligence',
  'geotechnical-sampling': 'ground-intelligence',
  'asset-inspection': 'ground-intelligence',
  'search-and-salvage': 'ground-intelligence',
  'environmental-survey': 'ground-intelligence',
  'geomatics-services': 'ground-intelligence',
  'spatial-intelligence': 'ground-intelligence',
  'geomatics': 'ground-intelligence',
  'pipeline-construction': 'integrated-engineering-construction',
  'infrastructure-construction': 'integrated-engineering-construction',
  'civil-works': 'integrated-engineering-construction',
  'oilfield-services': 'integrated-engineering-construction',
  'field-operations': 'integrated-engineering-construction',
  'asset-integrity-services': 'industrial-environmental-technologies',
  'asset-integrity-management': 'industrial-environmental-technologies',
  'asset-integrity': 'industrial-environmental-technologies',
  'facility-maintenance': 'industrial-environmental-technologies',
  'asset-management': 'industrial-environmental-technologies',
  'water-environmental-solutions': 'industrial-environmental-technologies',
  'engineering-procurement': 'industrial-environmental-technologies',
  'produced-water-treatment': 'industrial-environmental-technologies',
  'industrial-water-treatment': 'industrial-environmental-technologies',
  'water-treatment-plants': 'industrial-environmental-technologies',
  'valves-and-actuators': 'industrial-environmental-technologies',
  'flow-control-and-automation': 'industrial-environmental-technologies'
};

export const SERVICES: Service[] = [
  // 1. GROUND INTELLIGENCE
  {
    id: 'ground-intelligence',
    serviceNumber: '01',
    title: 'Ground Intelligence',
    tagline: 'Understand the ground, build with confidence.',
    description: 'We perform detailed soil and rock investigations, ground strength testing, foundation studies, and land surveying across Nigeria, providing clear data before construction begins.',
    items: [
      'Seismic Services (2D/3D digital seismic surveys, node deployment & harvesting)',
      'Seabed Mapping & Sub-Seabed Geophysical Surveys',
      'Geotechnical Sampling & In-Situ Soil Mechanics Testing',
      'Asset Inspection for Offshore Asset Management & Integrity',
      'Hydrographic Survey & High-Precision Seabed Bathymetry',
      'Search and Salvage Operations in Shallow & Deep Waters',
      'Environmental Survey, Ecosystem Habitat Classification & Data Interpretation',
      'Hydraulic Cone Penetration Testing (20-Ton CPT & CPTu profiling)'
    ],
    subServices: GROUND_INTELLIGENCE_SERVICES,
    icon: '🔬',
    image: OpDrillCrewCasingImg,
    division: 'Ground Intelligence'
  },

  // 2. DIGITAL INTELLIGENCE
  {
    id: 'digital-intelligence',
    serviceNumber: '02',
    title: 'Digital Intelligence',
    tagline: 'Capture reality, create certainty.',
    description: 'We use high-precision 3D laser scanners to create exact digital computer models of industrial facilities, offshore platforms, and equipment, helping teams plan modifications and prevent installation clashes.',
    items: [
      'High-precision 3D terrestrial and mobile laser scanning',
      'Point-cloud processing, registration, and 3D modeling',
      'As-built 3D CAD and BIM computer models',
      'Dimensional control and clash detection before site installation',
      'Digital twins and virtual walkthroughs for operating facilities',
      'Facility modifications, pipe fitting, and tie-in planning',
      'Structural deformation monitoring and geometric checks'
    ],
    icon: '📸',
    image: OpLaserManifoldImg,
    division: 'Digital Intelligence'
  },

  // 3. INTEGRATED ENGINEERING & CONSTRUCTION SOLUTIONS
  {
    id: 'integrated-engineering-construction',
    serviceNumber: '03',
    title: 'Integrated Engineering & Construction Solutions',
    tagline: 'From engineering insight to physical infrastructure and field delivery.',
    description: 'We build pipelines, perform certified welding and integrity pressure testing, construct civil infrastructure, and manage field operations across land, swamp, and offshore locations.',
    items: [
      'Pipeline fabrication, pipe laying, and certified welding',
      'Hydrostatic pressure testing and corrosion protection',
      'Site preparation, piling, and heavy industrial foundations',
      'Structural concrete and civil infrastructure construction',
      'Access road construction and swamp terrain rehabilitation',
      'Swamp, coastal, and offshore field operations support',
      'Rig positioning and vessel navigation support',
      'Tugboat management, anchor handling, and logistics'
    ],
    icon: '🔧',
    image: OpPipelineSwampCatImg,
    division: 'Integrated Engineering & Construction Solutions'
  },

  // 4. INDUSTRIAL & ENVIRONMENTAL TECHNOLOGIES
  {
    id: 'industrial-environmental-technologies',
    serviceNumber: '04',
    title: 'Industrial & Environmental Technologies',
    tagline: 'Treat water, control flow, and protect asset integrity.',
    description: 'We deliver environmental water treatment systems that remove oil and impurities, supply automated industrial valves, and perform equipment inspections to keep facilities running safely.',
    items: [
      'Produced water and industrial wastewater treatment systems',
      'Oil separation units and filtration skids for environmental compliance',
      'Water treatment plants and subsurface reinjection systems',
      'Industrial valves and automated actuator control packages',
      'Flow control valve servicing, calibration, and maintenance',
      'Non-destructive testing, ultrasonic testing, and radiographic inspections',
      'Corrosion monitoring, wall-thickness measurement, and fitness reviews',
      'Flow station mechanical maintenance and facility upgrades'
    ],
    icon: '💧',
    image: WaterTreatmentImg,
    division: 'Industrial & Environmental Technologies',
    partnerBadge: {
      partnerName: 'CoaleXpert & NPK Automation',
      role: 'Industrial & Environmental Technology Partners'
    }
  },

  // 5. OFFSHORE INTELLIGENCE
  {
    id: 'offshore-intelligence',
    serviceNumber: '05',
    title: 'Offshore Intelligence',
    tagline: 'From seabed conditions to ocean dynamics.',
    description: 'We provide marine geophysical surveys, seabed depth mapping, underwater hazard detection, and continuous weather buoys across coastal, nearshore, and deepwater energy corridors.',
    items: [
      'Marine geophysical surveys and seabed acoustic mapping',
      'High-resolution hydrographic depth mapping and bathymetry',
      'Sub-bottom profiling, side-scan sonar, and underwater surveys',
      'Oceanographic weather buoys, wave monitoring, and current telemetry',
      'Meteorological observation stations and environmental logging',
      'Marine environmental compliance and water quality monitoring',
      'Subsea pipeline route surveys and seabed clearance',
      'Real-time environmental data transmission for offshore operations'
    ],
    icon: '🌊',
    image: OpOffshoreBargeImg,
    division: 'Offshore Intelligence',
    partnerBadge: {
      partnerName: 'Frankstar Technology',
      role: 'Strategic MetOcean Technology Partner'
    }
  }
];

export const PARTNERS: Partner[] = [
  {
    id: 'frankstar',
    name: 'Frankstar Technology',
    role: 'Strategic MetOcean & Marine Intelligence Partner',
    specialty: 'Oceanographic Observation, MetOcean Buoys & Real-Time Telemetry',
    description: 'Through our partnership with Frankstar Technology, PIGL provides oceanographic weather buoys, wave monitoring, current profiling, and real-time marine weather data to support safe coastal and offshore operations.',
    capabilities: [
      'Oceanographic weather buoys for wave, current, and tidal monitoring',
      'Meteorological weather stations and data loggers',
      'Real-time environmental data transmission',
      'Water quality monitoring and underwater sensors',
      'Marine operational safety monitoring'
    ],
    website: 'https://www.frankstartech.com/',
    serviceId: 'offshore-intelligence',
    serviceTitle: 'Offshore Intelligence'
  },
  {
    id: 'coalexpert',
    name: 'CoaleXpert',
    role: 'Strategic Water & Process-Treatment Technology Partner',
    specialty: 'Advanced Produced-Water Treatment, Oil Separation & Modular Systems',
    description: 'Through our alliance with CoaleXpert, PIGL delivers high-efficiency produced water treatment systems that remove oil and solid particles, ensuring environmental compliance and safe water reinjection for oil and gas facilities.',
    capabilities: [
      'Produced water treatment and oil separation systems',
      'Modular treatment skids and plants',
      'Water filtration for subsurface reinjection and reuse',
      'Environmental regulatory compliance support',
      'Plant optimization and technical field support'
    ],
    website: 'https://coalexpert.pro/',
    serviceId: 'industrial-environmental-technologies',
    serviceTitle: 'Industrial & Environmental Technologies'
  },
  {
    id: 'npk',
    name: 'NPK Automation',
    role: 'Qualified Flow Control & Automation Partner',
    specialty: 'Engineered Valves, Actuators & Automated Flow-Control Packages',
    description: 'In collaboration with NPK Automation, PIGL supplies, tests, and maintains certified industrial valves, automated actuators, and shutdown packages for critical energy infrastructure.',
    capabilities: [
      'Certified industrial valves including ball, gate, globe, and check valves',
      'Electric, pneumatic, and hydraulic actuator systems',
      'Automated valve packages and emergency shutdown controls',
      'Valve assembly, hydro-testing, and calibration',
      'Inspection, lifecycle maintenance, and spare parts support'
    ],
    serviceId: 'industrial-environmental-technologies',
    serviceTitle: 'Industrial & Environmental Technologies'
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'AKK Gas Pipeline Survey & ROW Execution',
    client: 'Brentex / Dover',
    category: 'Intelligence',
    serviceCapability: 'Spatial Intelligence / Ground Intelligence',
    description: 'Comprehensive route surveying, geodetic positioning, and geotechnical investigation for the 40" x 311km mainline installation across northern Nigeria.',
    image: OpPipelineSwampCatImg,
    scope: 'Land survey, geodetic control network, and soil characterization for high-pressure gas infrastructure.',
    challenge: 'Navigating diverse terrains and ensuring data precision across a 311km pipeline route with tight environmental constraints.',
    solution: 'Deployment of high-accuracy GNSS RTK systems and multi-disciplinary survey teams to provide real-time Geo-data integration.',
    equipment: ['Trimble R12 GNSS', 'Electrical Resistivity Tomography', 'In-Situ Soil Samplers'],
    results: 'Project completed ahead of schedule with zero safety incidents.',
    location: 'Kogi / Kaduna, Nigeria',
    year: '2024'
  },
  {
    id: 'p2',
    title: 'Offshore Rig Positioning & Geotechnical Drilling',
    client: 'WAV',
    category: 'Solutions & Engineering',
    serviceCapability: 'Marine Intelligence / Field Operations',
    description: 'High-precision marine survey, seabed soil boring, and real-time rig positioning using DGPS and subsea acoustic telemetry.',
    image: OpOffshoreBargeImg,
    scope: 'Sub-surface hazard mapping, deep borehole sampling, and precise anchoring positioning for drilling platform.',
    challenge: 'Achieving sub-meter accuracy in dynamic swamp environments with limited visibility and complex tidal movements.',
    solution: 'Utilizing advanced DGPS and Multibeam systems coupled with expert hydrographers for real-time positioning feedback.',
    equipment: ['Multibeam Echosounder', 'Gyrocompass Systems', 'USBL Hydroacoustic Transponders'],
    results: 'High-fidelity alignment achieved for complex sub-sea anchoring with zero asset clash.',
    location: 'Escravos, Delta State',
    year: '2023'
  },
  {
    id: 'p3',
    title: 'Facility Reality Capture & Digital Twin',
    client: 'Aradel',
    category: 'Intelligence',
    serviceCapability: 'Digital Intelligence',
    description: 'Full-scale 3D laser scanning and digitization of active brownfield processing assets for intelligent asset management and structural assurance.',
    image: OpLaserManifoldImg,
    scope: 'High-density 3D Laser Scanning of active oil and gas processing facilities.',
    challenge: 'Creating a high-fidelity digital twin of an active brownfield asset without interrupting ongoing production operations.',
    solution: 'Rapid high-definition scanning using Leica 3D laser systems, delivering million-point cloud data with minimal site footprint.',
    equipment: ['Leica RTC360 3D Laser Scanner', 'High-Precision GNSS', 'Leica Cyclone Suite'],
    results: 'Created detailed Digital Twins reducing maintenance planning time by 30%.',
    location: 'Ogbele Field, Rivers State',
    year: '2024'
  },
  {
    id: 'p4',
    title: 'Industrial Borehole & Hydrogeological Investigation',
    client: 'SIRI GLOBAL',
    category: 'Solutions & Engineering',
    serviceCapability: 'Asset Integrity & Management / Ground Intelligence',
    description: 'Hydrogeological mapping, geophysical logging, and structural installation of dual industrial water boreholes at 120M depth.',
    image: DrillingImg,
    scope: 'Aquifer mapping, structural drilling, and water quality testing.',
    equipment: ['Rotary Drilling Rig', 'Geophysical Logging Tools', 'Water Testing Lab Probes'],
    results: 'Sustainable high-capacity water source established for facility operations.',
    location: 'Omoku, Rivers State',
    year: '2023',
    challenge: 'Identifying high-yield aquifers in complex sedimentary structures while ensuring zero cross-contamination with industrial waste.',
    solution: 'Advanced geophysical logging and multi-stage filter placement to ensure long-term borehole productivity.'
  },
  {
    id: 'p5',
    title: 'Access Road Rehabilitation & Swamp Grading',
    client: 'TotalEnergies',
    category: 'Solutions & Engineering',
    serviceCapability: 'Infrastructure & Construction',
    description: 'Structural civil engineering and rehabilitation of heavy-duty access roads serving operational energy sites in the Niger Delta.',
    image: RoadImg,
    scope: 'Grading, drainage clearing, and asphalt reinforcement for heavy industrial loads.',
    equipment: ['Heavy Motor Graders', 'Compaction Rollers', 'Drainage Formwork'],
    results: 'Restored logistical efficiency and route reliability for energy facility transport.',
    location: 'Onne, Rivers State',
    year: '2024',
    challenge: 'Maintaining critical transport routes during peak monsoon season with heavy-duty oilfield traffic.',
    solution: 'Rapid asphalt reinforcement and advanced drainage clearing to prevent water-logging and structural failure.'
  },
  {
    id: 'p6',
    title: 'Civil Infrastructure & Foundation Engineering',
    client: 'Chevron',
    category: 'Solutions & Engineering',
    serviceCapability: 'Infrastructure & Construction',
    description: 'Site preparation, piling, and structural concrete foundation works for new industrial energy facility modules.',
    image: CivilWorksImg,
    scope: 'Piling, site clearing, soil improvement, and high-strength concrete foundation construction.',
    equipment: ['Hydraulic Piling Rigs', 'Concrete Mixers & Batching Plants', 'Total Stations'],
    results: 'Delivered stable, certified foundation base for primary energy processing modules.',
    location: 'Bonny Island, Rivers State',
    year: '2023',
    challenge: 'Preparing site foundations in high-salinity swamp environments with strict environmental footprint restrictions.',
    solution: 'Precision piling and specialized soil stabilization techniques to support heavy modular units.'
  },
  {
    id: 'p7',
    title: 'Marine Sub-Bottom Profiling & Route Survey',
    client: 'Fugro',
    category: 'Intelligence',
    serviceCapability: 'Marine Intelligence',
    description: 'Marine sub-surface acoustic characterization and shallow gas hazard detection for offshore pipeline route selection.',
    image: OpSubbottomSb216Img,
    scope: 'Acoustic profiling of seabed strata, shallow gas detection, and bathymetry using EdgeTech SB-216S Sub-Bottom Profiler.',
    equipment: ['Sub-bottom Profiler', 'Side Scan Sonar', 'Marine Magnetometer'],
    results: 'Critical sub-bottom geological intelligence delivered for secure subsea pipeline laying.',
    location: 'Gulf of Guinea, Nigeria',
    year: '2024',
    challenge: 'Detecting shallow gas pockets and buried obstructions in dynamic shipping channels.',
    solution: 'High-frequency acoustic profiling and side-scan sonar integration for a comprehensive subsurface picture.'
  },
  {
    id: 'p8',
    title: 'Chevron Great Hall Facility 3D Digitisation',
    client: 'Chevron',
    category: 'Intelligence',
    serviceCapability: 'Digital Intelligence',
    description: 'Complete 3D Terrestrial Laser Scanning and As-Built 3D CAD Modelling of Chevron Great Hall Facility.',
    image: GreatHallImg,
    scope: 'High-definition 3D laser scanning and intelligent CAD model generation for structural management.',
    equipment: ['Advanced 3D Laser Scanners', 'Point Cloud Processing Workstations'],
    results: 'Delivered complete millimeter-accurate As-Built 3D model for facility planning.',
    location: 'Warri, Delta State',
    year: '2024',
    challenge: 'Digitizing an active, highly complex facility with intricate pipe runs and restricted access corridors.',
    solution: 'Non-disruptive laser scanning with multi-station cloud registration for high-density point cloud output.'
  }
];

export const TEAM: TeamMember[] = [
  {
    name: 'Dr. Chigozie Dimgba',
    role: 'MD/CEO',
    image: ChigozieImg,
    linkedin: 'https://www.linkedin.com/in/chigozie-dimgba-phd-fnis-jp-1b517711/'
  },
  {
    name: 'Nnenna Ndubuisi',
    role: 'Chief Corporate Officer',
    image: NnennaImg,
    linkedin: 'https://www.linkedin.com/company/polarisigl/'
  },
  {
    name: 'Adamu Alumum Isaac',
    role: 'Chief Financial Officer',
    image: IsaacImg,
    linkedin: 'https://www.linkedin.com/company/polarisigl/'
  },
  {
    name: 'Analiefo Nzegwu',
    role: 'ED. Operations',
    image: AnaliImg,
    linkedin: 'https://www.linkedin.com/company/polarisigl/'
  },
  {
    name: 'Layefa Chituru Igbe',
    role: 'Head, Business Development',
    image: LayefaImg,
    linkedin: 'https://www.linkedin.com/company/polarisigl/'
  },
  {
    name: 'Uduma Ikpa Obianuju',
    role: 'Project Administrator',
    image: UjuImg,
    linkedin: 'https://www.linkedin.com/company/polarisigl/'
  },
  {
    name: 'Brian Akpotowo',
    role: 'Head, Digital Twin/Reality Capture',
    image: BrianImg,
    linkedin: 'https://www.linkedin.com/company/polarisigl/'
  },
  {
    name: 'Steve Ubani',
    role: 'Head, Field Operations',
    image: SteveImg,
    linkedin: 'https://www.linkedin.com/company/polarisigl/'
  }
];

export const ASSETS = {
  front: SliderImg,
  team: TeamImg
};

export const STRENGTHS = [
  'Technical Integrity & Precision',
  '100% Indigenous Nigerian Capability',
  'High-Fidelity Reality Capture & Digital Twins',
  'Specialist Strategic Technology Partnerships',
  'Dual ISO 9001:2015 & 45001:2018 Certified',
  'Deep Swamp, Coastal & Offshore Expertise'
];

export const HSSE_STATS = [
  { label: 'Lost Time Injuries (LTI)', value: '0', description: 'Zero recordable injuries in the last 5 years.' },
  { label: 'Safe Man-Hours', value: '500k+', description: 'Accumulated across major swamp and offshore operations.' },
  { label: 'Environmental Incidents', value: '0', description: 'Zero spills or environmental non-compliance reports.' },
  { label: 'Technical Audits Passed', value: '100%', description: 'Consistent excellence in IOC and regulatory audits.' }
];

export const HSSE_POLICIES = [
  {
    title: 'Occupational Health & Safety',
    content: 'We prioritize the physical and mental well-being of our workforce through rigorous health screenings and ergonomic field standards.'
  },
  {
    title: 'Operational Safety & Stop Work Authority',
    content: 'Our "Stop Work Authority" empowers every employee and contractor to halt operations immediately if an unsafe condition is identified.'
  },
  {
    title: 'Environmental Protection & Compliance',
    content: 'We employ advanced engineering and geosolutions to minimize operational footprint and protect fragile Niger Delta ecosystems.'
  },
  {
    title: 'Quality Assurance & ISO Standards',
    content: 'Quality is embedded in every workflow. Our ISO 9001:2015-aligned processes guarantee data fidelity and engineering precision.'
  }
];

export const CERTIFICATIONS = [
  { title: 'ISO 9001:2015', organization: 'Quality Management Systems', status: 'Certified', image: Iso9001Img },
  { title: 'ISO 45001:2018', organization: 'Occupational Health & Safety', status: 'Certified', image: Iso45001Img },
  { title: 'NUPRC / NMDPRA Permit', organization: 'Oil & Gas Service Category', status: 'Active' },
  { title: 'NCDMB Certified', organization: 'Nigerian Content Development & Monitoring Board', status: 'Active (100% Indigenous)' },
  { title: 'COREN Registered', organization: 'Council for the Regulation of Engineering in Nigeria', status: 'Active' }
];

export interface OperationPhoto {
  id: string;
  title: string;
  category: 'Offshore & Marine' | '3D Reality Capture' | 'Pipelines & Infrastructure' | 'Ground Truth & Geomatics' | 'Logistics & Safety';
  image: string;
  description: string;
  location?: string;
}

export const OPERATIONS_GALLERY: OperationPhoto[] = [
  {
    id: 'op-barge',
    title: 'Offshore Geotechnical Drilling Vessel',
    category: 'Offshore & Marine',
    image: OpOffshoreBargeImg,
    description: 'Active offshore soil boring and seabed geotechnical drilling rig operating in deep marine energy corridors.',
    location: 'Offshore Gulf of Guinea'
  },
  {
    id: 'op-manifold-scan',
    title: 'High-Density 3D Laser Scanning of Facility Manifold',
    category: '3D Reality Capture',
    image: OpLaserManifoldImg,
    description: 'Precision millimeter-accurate point cloud reality capture on active oil & gas processing manifolds and piping arrays.',
    location: 'Flowstation Processing Asset'
  },
  {
    id: 'op-swamp-pipeline',
    title: 'Heavy Swamp Pipeline ROW Execution & Laying',
    category: 'Pipelines & Infrastructure',
    image: OpPipelineSwampCatImg,
    description: 'Caterpillar earthmoving, swamp excavator trenching, and side-boom pipelayer handling heavy-wall coated export line to coast.',
    location: 'Coastal Pipeline Right-of-Way'
  },
  {
    id: 'op-drill-crew',
    title: 'Offshore Drill Floor Operations & Casing String',
    category: 'Offshore & Marine',
    image: OpDrillCrewCasingImg,
    description: 'Certified PIGL offshore drilling specialists managing heavy casing installation and deepwater geotechnical sampling.',
    location: 'Marine Drilling Vessel'
  },
  {
    id: 'op-sb216-profiler',
    title: 'EdgeTech SB-216S Sub-Bottom Profiler Deployment',
    category: 'Offshore & Marine',
    image: OpSubbottomSb216Img,
    description: 'Deploying high-resolution acoustic sub-bottom towfish for seabed stratigraphy and shallow gas hazard detection.',
    location: 'Offshore Pipeline Corridor'
  },
  {
    id: 'op-logistics-base',
    title: 'PIGL Integrated Logistics Yard & Staging Base',
    category: 'Logistics & Safety',
    image: OpLogisticsBaseImg,
    description: 'Aerial drone perspective of the PIGL field equipment yard, operations cabins, and heavy equipment mobilization hub.',
    location: 'Port Harcourt Regional Operations Base'
  },
  {
    id: 'op-welding',
    title: 'Certified Offshore Structural & Pipeline Welding',
    category: 'Pipelines & Infrastructure',
    image: OpWeldingImg,
    description: 'API-certified marine welding and fabrication under stringent HSSE and quality assurance protocols.',
    location: 'Marine Fabrication Works'
  },
  {
    id: 'op-vessel-crew',
    title: 'Marine Crew Safety Protocol on Platt Joe Joe Lagos',
    category: 'Logistics & Safety',
    image: OpMarineCrewImg,
    description: 'Offshore operations personnel in high-visibility protective gear maintaining Goal Zero standards at sea.',
    location: 'Vessel Platt Joe Joe Lagos'
  },
  {
    id: 'op-cooler-scan',
    title: 'Industrial Heat Exchanger 3D Reality Capture',
    category: '3D Reality Capture',
    image: OpLaserCoolerImg,
    description: 'Leica 3D laser scanner surveying overhead process cooling units for clash-free brownfield retrofit engineering.',
    location: 'Refinery & Petrochemical Facility'
  },
  {
    id: 'op-jetty-reality',
    title: 'Marine Jetty Multi-Level Reality Capture',
    category: '3D Reality Capture',
    image: OpRealityJettyImg,
    description: 'Comprehensive dimensional control and as-built verification of marine terminal pipe racks and structural steel.',
    location: 'Marine Terminal Jetty'
  },
  {
    id: 'op-quay-survey',
    title: 'Harbour Waterfront Geomatic Surveying',
    category: 'Ground Truth & Geomatics',
    image: OpGeomaticsImg,
    description: 'Geomatic engineer establishing high-precision geodetic control using Leica total station at harbour facility.',
    location: 'Harbour Maritime Quay'
  },
  {
    id: 'op-winch-container',
    title: 'Offshore Winch & Branded Operations Container',
    category: 'Logistics & Safety',
    image: OpWinchPiglImg,
    description: 'Offshore technician operating hydraulic cable reel winch on deck beside branded PIGL offshore container.',
    location: 'Offshore Survey Vessel'
  }
];

