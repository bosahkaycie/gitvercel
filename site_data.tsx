 
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

// 1. GEO DATA INTELLIGENCE SUB-SERVICES
export const GEO_DATA_INTELLIGENCE_SERVICES: SubService[] = [
  {
    id: 'geotechnical-investigation',
    title: 'Geotechnical Investigation & Site Characterisation',
    description: 'Borehole drilling, deep foundation soil boring, standard penetration testing (SPT), and comprehensive in-situ testing for heavy onshore and swamp infrastructure.',
    icon: '🔬'
  },
  {
    id: 'cpt-cptu-testing',
    title: 'Hydraulic CPT & CPTu Testing',
    description: 'Heavy-duty 20-ton piezocone penetration testing (CPTu) providing continuous in-situ tip resistance, sleeve friction, and pore pressure stratigraphy.',
    icon: '🚜'
  },
  {
    id: 'geotechnical-sampling',
    title: 'Geotechnical Sampling & Laboratory Testing',
    description: 'Undisturbed Shelby tube sampling, rock coring, triaxial shearing, consolidation, and geotechnical laboratory analysis for soil mechanics.',
    icon: '🧪'
  },
  {
    id: 'onshore-geophysical',
    title: 'Onshore Geophysical & Seismic Surveys',
    description: '2D/3D terrestrial seismic refraction, reflection profiling, and geological mapping to delineate bedrock depth, rip-ability, and structural faults.',
    icon: '📊'
  },
  {
    id: 'electrical-resistivity',
    title: 'Electrical Resistivity Tomography (ERT)',
    description: 'Multi-electrode resistivity profiling and vertical electrical sounding (VES) for hydrogeology, groundwater mapping, and subsurface fault detection.',
    icon: '⚡'
  },
  {
    id: 'land-geospatial-survey',
    title: 'Land Surveying & Geodetic Control',
    description: 'High-precision cadastral boundary demarcation, route right-of-way (ROW) surveying, geodetic control networks, and enterprise GIS integration.',
    icon: '📐'
  }
];

// Backward compatibility alias
export const GROUND_INTELLIGENCE_SERVICES: SubService[] = GEO_DATA_INTELLIGENCE_SERVICES;

// 2. DIGITAL MAPPING INTELLIGENCE SUB-SERVICES
export const DIGITAL_MAPPING_SERVICES: SubService[] = [
  {
    id: '3d-laser-scanning',
    title: '3D Terrestrial & Mobile Laser Scanning',
    description: 'High-speed millimeter-accurate point cloud acquisition for industrial complexes, flowstations, and offshore topsides using Leica RTC360 spreads.',
    icon: '📸'
  },
  {
    id: 'scan-to-bim',
    title: 'Scan-to-BIM & Intelligent 3D CAD Modeling',
    description: 'Conversion of raw point clouds into parametric as-built BIM/CAD models, piping isometrics, and structural documentation.',
    icon: '💻'
  },
  {
    id: 'dimensional-control',
    title: 'Dimensional Control & Clash Detection',
    description: 'Pre-fabrication interference simulation, geometric verification, and tie-in tolerance validation to eliminate costly field rework.',
    icon: '🎯'
  },
  {
    id: 'digital-twins',
    title: 'Operational Digital Twins & Brownfield Digitalisation',
    description: 'Living 3D cloud-hosted asset models with interactive operational metadata and virtual walkthroughs for facility modification planning.',
    icon: '🌐'
  },
  {
    id: 'topographic-uav-mapping',
    title: 'Topographic Survey & UAV Aerial Mapping',
    description: 'Drone LiDAR and high-resolution aerial photogrammetry generating digital elevation models (DEM) and topographic contours across expansive terrains.',
    icon: '🚁'
  },
  {
    id: 'digital-asset-mapping',
    title: 'Digital Asset Mapping & Deformation Monitoring',
    description: 'High-precision spatial verification, structural deflection checks, and continuous geometric asset monitoring.',
    icon: '🔍'
  }
];

// 3. MARINE INTELLIGENCE SUB-SERVICES
export const MARINE_INTELLIGENCE_SERVICES: SubService[] = [
  {
    id: 'marine-seabed-survey',
    title: 'Marine Geophysical & Seabed Mapping',
    description: 'Acoustic seabed profiling, shallow sub-bottom stratigraphy, side-scan sonar hazard detection, and subsea pipeline route clearance.',
    icon: '🗺️'
  },
  {
    id: 'hydrographic-bathymetric',
    title: 'Hydrographic & Bathymetric Surveying',
    description: 'Multi-beam and single-beam acoustic echo sounding delivering high-precision seabed bathymetry for navigation, ports, and dredging corridors.',
    icon: '📐'
  },
  {
    id: 'continuous-marine-intelligence',
    title: 'Continuous Marine Intelligence & MetOcean Buoys',
    description: 'Strategic deployment with Frankstar Technology of oceanographic telemetry buoys for real-time wave, current, and tidal dynamics measurement.',
    icon: '🌊'
  },
  {
    id: 'marine-environmental-monitoring',
    title: 'Marine Environmental & Water Quality Telemetry',
    description: 'Continuous real-time marine observation, water quality telemetry, baseline habitat surveys, and regulatory environmental compliance logging.',
    icon: '🌿'
  },
  {
    id: 'marine-positioning',
    title: 'Marine Positioning & Subsea Metrology Support',
    description: 'Surface and acoustic subsea positioning, rig moves, anchor handling, and precision navigation for offshore construction vessels.',
    icon: '🧭'
  },
  {
    id: 'search-and-salvage',
    title: 'Marine Search & Salvage Operations',
    description: 'High-resolution acoustic location and marine salvage recovery of lost submerged assets in shallow coastal and deepwater corridors.',
    icon: '⚓'
  }
];

// 4. ASSET INTEGRITY INTELLIGENCE SUB-SERVICES
export const ASSET_INTEGRITY_SERVICES: SubService[] = [
  {
    id: 'inspection-ndt',
    title: 'Non-Destructive Testing (NDT) & Inspection',
    description: 'Certified visual inspection, phased-array ultrasonics (PAUT), radiographic testing, and magnetic particle testing for critical assets.',
    icon: '🔍'
  },
  {
    id: 'integrity-monitoring',
    title: 'Corrosion Monitoring & Wall-Thickness Profiling',
    description: 'Ultrasonic wall-thickness measurements, corrosion rate analysis, and remaining life assessment for piping, vessels, and storage tanks.',
    icon: '📊'
  },
  {
    id: 'condition-monitoring',
    title: 'Structural Condition & Deformation Monitoring',
    description: 'Acoustic emission flaw detection, geometric integrity verification, and real-time structural health monitoring for industrial assets.',
    icon: '⚙️'
  },
  {
    id: 'maintenance-repairs',
    title: 'Mechanical Maintenance & Rehabilitation',
    description: 'Preventive and corrective mechanical servicing, flowstation maintenance, equipment refurbishment, and field rehabilitation.',
    icon: '🔧'
  },
  {
    id: 'rov-subsea-integrity',
    title: 'ROV Subsea Inspection & Asset Assessment',
    description: 'Remotely operated vehicle (ROV) video audits, underwater pipeline inspection, and marine cathodic protection integrity checks.',
    icon: '🤖'
  },
  {
    id: 'digital-asset-integrity',
    title: 'Digital Asset Integrity Documentation & 3D Records',
    description: 'Interactive digital inspection dossiers, 3D defect mapping, and digital twin integration for lifecycle integrity tracking.',
    icon: '📁'
  }
];

// 5. ENGINEERING, INDUSTRIAL & ENVIRONMENTAL SOLUTIONS SUB-SERVICES
export const ENGINEERING_SOLUTIONS_SERVICES: SubService[] = [
  {
    id: 'produced-water-treatment',
    title: 'Produced Water Treatment & Oil Separation',
    description: 'Advanced oil-water separation systems and treatment skids delivered with CoaleXpert for regulatory compliance and subsurface reinjection.',
    icon: '💧'
  },
  {
    id: 'industrial-wastewater-treatment',
    title: 'Industrial Wastewater & Effluent Treatment',
    description: 'Effluent treatment plants, filtration packages, and water reuse engineering for downstream and industrial facilities.',
    icon: '🧪'
  },
  {
    id: 'flow-control-valves',
    title: 'Flow Control, Industrial Valves & Actuation',
    description: 'Supply of certified industrial ball, gate, butterfly, and control valves with automated electric/pneumatic actuators in alliance with NPK Automation.',
    icon: '🚰'
  },
  {
    id: 'integrated-valve-maintenance',
    title: 'Integrated Valve Maintenance Services',
    description: 'Dedicated valve inspection, servicing, overhaul, actuator calibration, hydro-testing, and complete lifecycle spare parts support.',
    icon: '🛠️'
  },
  {
    id: 'pipeline-construction',
    title: 'Pipeline Fabrication & Civil Construction',
    description: 'API 1104 welding, pipe stringing, swamp pipeline trenching, hydrotesting, heavy piling, access roads, and structural concrete works.',
    icon: '🏗️'
  },
  {
    id: 'environmental-mitigation',
    title: 'Environmental Assessment & Mitigation Services',
    description: 'Industrial environmental compliance, pollution prevention, contaminated land remediation, and specialized waste management solutions.',
    icon: '🌱'
  },
  {
    id: 'field-engineering-support',
    title: 'Field Engineering & Swamp Project Support',
    description: 'Amphibious swamp operations, quayside logistics, rig positioning, tug management, and turnkey field delivery across challenging terrains.',
    icon: '🚜'
  }
];

// Mapping for backward compatibility from old service URLs to the 5 Canonical Platforms
export const LEGACY_SERVICE_MAP: Record<string, string> = {
  // Direct canonical platform mappings
  'ground-intelligence': 'geo-data-intelligence',
  'geo-data-intelligence': 'geo-data-intelligence',
  'digital-intelligence': 'digital-mapping-intelligence',
  'digital-mapping-intelligence': 'digital-mapping-intelligence',
  'offshore-intelligence': 'marine-intelligence',
  'marine-intelligence': 'marine-intelligence',
  'asset-integrity': 'asset-integrity-intelligence',
  'asset-integrity-intelligence': 'asset-integrity-intelligence',
  'integrated-engineering-construction': 'engineering-industrial-environmental-solutions',
  'industrial-environmental-technologies': 'engineering-industrial-environmental-solutions',
  'engineering-industrial-environmental-solutions': 'engineering-industrial-environmental-solutions',

  // Digital Mapping Intelligence aliases
  'reality-capture': 'digital-mapping-intelligence',
  '3d-laser-scanning': 'digital-mapping-intelligence',
  'digital-twins': 'digital-mapping-intelligence',
  'geomatics-services': 'digital-mapping-intelligence',
  'spatial-intelligence': 'digital-mapping-intelligence',
  'geomatics': 'digital-mapping-intelligence',
  'topographic-mapping': 'digital-mapping-intelligence',

  // Marine Intelligence aliases
  'geophysical-surveys': 'marine-intelligence',
  'climate-environmental-metocean': 'marine-intelligence',
  'metocean': 'marine-intelligence',
  'continuous-marine-intelligence': 'marine-intelligence',
  'hydrographic-survey': 'marine-intelligence',
  'seabed-mapping': 'marine-intelligence',
  'search-and-salvage': 'marine-intelligence',
  'environmental-survey': 'marine-intelligence',

  // Geo Data Intelligence aliases
  'geotechnical-services': 'geo-data-intelligence',
  'onshore-nearshore-geotechnical': 'geo-data-intelligence',
  'seismic-services': 'geo-data-intelligence',
  'geotechnical-sampling': 'geo-data-intelligence',
  'geotechnical-investigation': 'geo-data-intelligence',
  'cpt-testing': 'geo-data-intelligence',

  // Asset Integrity Intelligence aliases
  'asset-integrity-services': 'asset-integrity-intelligence',
  'asset-integrity-management': 'asset-integrity-intelligence',
  'facility-maintenance': 'asset-integrity-intelligence',
  'asset-management': 'asset-integrity-intelligence',
  'asset-inspection': 'asset-integrity-intelligence',
  'rov-inspection': 'asset-integrity-intelligence',
  'ndt-inspection': 'asset-integrity-intelligence',

  // Engineering, Industrial & Environmental Solutions aliases
  'pipeline-construction': 'engineering-industrial-environmental-solutions',
  'infrastructure-construction': 'engineering-industrial-environmental-solutions',
  'civil-works': 'engineering-industrial-environmental-solutions',
  'oilfield-services': 'engineering-industrial-environmental-solutions',
  'field-operations': 'engineering-industrial-environmental-solutions',
  'water-engineering': 'engineering-industrial-environmental-solutions',
  'water-environmental-solutions': 'engineering-industrial-environmental-solutions',
  'engineering-procurement': 'engineering-industrial-environmental-solutions',
  'produced-water-treatment': 'engineering-industrial-environmental-solutions',
  'wastewater-treatment': 'engineering-industrial-environmental-solutions',
  'industrial-water-treatment': 'engineering-industrial-environmental-solutions',
  'water-treatment-plants': 'engineering-industrial-environmental-solutions',
  'valves-and-actuators': 'engineering-industrial-environmental-solutions',
  'flow-control-and-automation': 'engineering-industrial-environmental-solutions',
  'integrated-valve-maintenance': 'engineering-industrial-environmental-solutions'
};

export const SERVICES: Service[] = [
  // 1. GEO DATA INTELLIGENCE
  {
    id: 'geo-data-intelligence',
    serviceNumber: '01',
    title: 'Geo Data Intelligence',
    tagline: 'Understand the ground, build with confidence.',
    description: 'We perform detailed soil and rock investigations, 20-ton hydraulic CPT/CPTu testing, borehole drilling, onshore seismic surveys, and land geodetic surveying across Nigeria, establishing structural certainty before construction begins.',
    items: [
      'Geotechnical & Site Investigation (soil boring, SPT, rock coring)',
      'Hydraulic Cone Penetration Testing (20-Ton CPT & CPTu profiling)',
      'Geotechnical Sampling & Soil Mechanics Laboratory Testing',
      'Onshore Geophysical Surveys & Seismic Refraction Acquisition',
      'Electrical Resistivity Tomography & Subsurface Characterisation',
      'Land Surveying, Geodetic Control Networks & Terrestrial GIS'
    ],
    subServices: GEO_DATA_INTELLIGENCE_SERVICES,
    icon: '🔬',
    image: OpDrillCrewCasingImg,
    division: 'Geo Data Intelligence'
  },

  // 2. DIGITAL MAPPING INTELLIGENCE
  {
    id: 'digital-mapping-intelligence',
    serviceNumber: '02',
    title: 'Digital Mapping Intelligence',
    tagline: 'Capture reality, create certainty.',
    description: 'We deploy millimeter-precision 3D terrestrial laser scanners and UAV photogrammetry to create exact digital twins, scan-to-BIM models, and clash-detection models of industrial facilities and operational terrains.',
    items: [
      'High-precision 3D terrestrial and mobile laser scanning',
      'Scan-to-BIM & Intelligent as-built 3D CAD computer models',
      'Dimensional control and clash detection before site installation',
      'Living digital twins and virtual walkthroughs for operating facilities',
      'Topographic surveying, UAV mapping & digital elevation models',
      'Digital asset mapping, geometric verification & deformation monitoring'
    ],
    subServices: DIGITAL_MAPPING_SERVICES,
    icon: '📸',
    image: OpLaserManifoldImg,
    division: 'Digital Mapping Intelligence'
  },

  // 3. MARINE INTELLIGENCE
  {
    id: 'marine-intelligence',
    serviceNumber: '03',
    title: 'Marine Intelligence',
    tagline: 'From seabed conditions to ocean dynamics.',
    description: 'We provide marine geophysical surveys, high-resolution bathymetric depth mapping, underwater hazard detection, and continuous MetOcean telemetry buoys across coastal, nearshore, and deepwater corridors.',
    items: [
      'Marine geophysical surveys, sub-bottom profiling & side-scan sonar',
      'High-resolution multibeam and single-beam hydrographic bathymetry',
      'Continuous Marine Intelligence & MetOcean telemetry buoys',
      'Oceanographic wave monitoring, current profiling (ADCP) & tidal stations',
      'Marine environmental compliance & water quality telemetry',
      'Subsea marine positioning, metrology & lost asset search and salvage'
    ],
    subServices: MARINE_INTELLIGENCE_SERVICES,
    icon: '🌊',
    image: OpOffshoreBargeImg,
    division: 'Marine Intelligence',
    partnerBadge: {
      partnerName: 'Frankstar Technology',
      role: 'Strategic MetOcean & Marine Intelligence Partner'
    }
  },

  // 4. ASSET INTEGRITY INTELLIGENCE
  {
    id: 'asset-integrity-intelligence',
    serviceNumber: '04',
    title: 'Asset Integrity Intelligence',
    tagline: 'Assure structural reliability, prevent catastrophic downtime.',
    description: 'We deliver advanced Non-Destructive Testing (NDT), ultrasonic wall-thickness profiling, corrosion rate monitoring, subsea ROV inspection, and mechanical facility maintenance to extend industrial asset lifecycles.',
    items: [
      'Non-Destructive Testing (NDT), PAUT & radiographic inspections',
      'Corrosion monitoring, ultrasonic wall-thickness & remaining life reviews',
      'Acoustic emission structural health monitoring & condition assessments',
      'Subsea ROV inspection of marine structures and pipelines',
      'Mechanical facility maintenance, equipment overhauls & repairs',
      'Digital asset inspection records & 3D defect documentation'
    ],
    subServices: ASSET_INTEGRITY_SERVICES,
    icon: '🛡️',
    image: AssetIntegrityImg,
    division: 'Asset Integrity Intelligence'
  },

  // 5. ENGINEERING, INDUSTRIAL & ENVIRONMENTAL SOLUTIONS
  {
    id: 'engineering-industrial-environmental-solutions',
    serviceNumber: '05',
    title: 'Engineering, Industrial & Environmental Solutions',
    tagline: 'From engineered infrastructure to process treatment and industrial flow delivery.',
    description: 'We engineer produced water treatment systems, supply and maintain automated flow control valves, fabricate welded pipelines, execute swamp civil works, and manage complex industrial field operations.',
    items: [
      'Produced water treatment & oil-water separation systems',
      'Industrial wastewater treatment plants & effluent filtration skids',
      'Automated industrial valves, actuators & shutdown packages',
      'Integrated valve inspection, servicing, testing & calibration',
      'API 1104 pipeline fabrication, swamp pipe laying & hydrotesting',
      'Civil infrastructure, heavy piling, access roads & swamp rehabilitation',
      'Environmental mitigation, pollution prevention & industrial waste solutions'
    ],
    subServices: ENGINEERING_SOLUTIONS_SERVICES,
    icon: '🔧',
    image: WaterTreatmentImg,
    division: 'Engineering, Industrial & Environmental Solutions',
    partnerBadge: {
      partnerName: 'CoaleXpert & NPK Automation',
      role: 'Strategic Water, Process & Valve Technology Partners'
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
    serviceId: 'marine-intelligence',
    serviceTitle: 'Marine Intelligence'
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
    serviceId: 'engineering-industrial-environmental-solutions',
    serviceTitle: 'Engineering, Industrial & Environmental Solutions'
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
    website: '',
    serviceId: 'engineering-industrial-environmental-solutions',
    serviceTitle: 'Engineering, Industrial & Environmental Solutions'
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

