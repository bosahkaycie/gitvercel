 
import { Service, Project, TeamMember, LinkedInPost, CoreValue, Partner, SubService } from './types';
import RealityCaptureImg from './assets/digital_intel_scanner.jpg';
import MarineIntelImg from './assets/marine_intel_metocean.jpg';
import GroundIntelImg from './assets/cpt.webp';
import SpatialIntelImg from './assets/geomatics_survey.webp';
import AssetIntegrityImg from './assets/IMG_6170.jpg';
import PipelineImg from './assets/newpipeline.webp';
import RigImg from './assets/rig_positioning.png';
import WaterTreatmentImg from './assets/drilling.png';
import ProcurementImg from './assets/procure.jpg';

import GeosolutionsImg from './assets/DJI_0003.jpg';
import CivilWorksImg from './assets/road-feat-700x500.jpg';
import IntegratedImg from './assets/cabin.png';
import AkkImg from './assets/akk_pipeline.png';
import FacilityImg from './assets/new_capture.webp';
import DrillingImg from './assets/drilling.png';
import RoadImg from './assets/road.webp';
import SubImg from './assets/sub.png';
import SliderImg from './assets/slider.jpeg';
import GreatHallImg from './assets/GREAT_HALL.webp';
import ChigozieImg from './assets/management/chigozie.webp';
import NnennaImg from './assets/management/nnenna.webp';
import IsaacImg from './assets/management/isaac.webp';
import AnaliImg from './assets/management/Anali.webp';
import LayefaImg from './assets/management/layefa.webp';
import UjuImg from './assets/management/uju.webp';
import BrianImg from './assets/management/brian.webp';
import SteveImg from './assets/management/steve.webp';
import TechImg from './assets/IMG_6170.jpg';
import NextGenImg from './assets/inspiring_next_gen.jpeg';
import TeamImg from './assets/team.jpeg';
import DigiTwinImg from './assets/digitwin.webp';
import OceanImg from './assets/new_ocean.webp';
import SeismicSurveyImg from './assets/seismic_survey.webp';
import AssetManagementImg from './assets/asset_management.png';
import GeomaticsSurveyImg from './assets/geomatics_survey.webp';
import Iso9001Img from './assets/Q-Mark (ISO 9001).png';
import Iso45001Img from './assets/Q-Mark (ISO 45001).png';
import WaterTreatmentSkidImg from './assets/water_treatment_skid.jpg';

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
  phone: '+234 809 7081 333',
  phoneRaw: '+2348097081333',
  emailInfo: 'info@polarisigl.com',
  emailSupport: 'support@polarisigl.com',
  address: '#3 Diamond Close, Castle & Green Estate, Off Eneka Link Road, Port Harcourt, Rivers State, Nigeria',
  addressShort: '#3 Diamond Close, Port Harcourt, Rivers State, Nigeria',
  businessHours: 'Monday to Friday, 8:00 am to 5:00 pm',
  whatsappMessage: 'Hello PIGL, I would like to make an enquiry about your services.',
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

// ==============================================================================
// AUTHORITATIVE FOUR-DIVISION SERVICE ARCHITECTURE
// ==============================================================================

// DIVISION 01 — GEOSOLUTIONS & ENGINEERING SERVICES (GES) SERVICE FAMILIES
export const GES_SERVICE_FAMILIES: SubService[] = [
  {
    id: 'geohazard-geoscan-seismic',
    title: 'Geohazard, Geoscan & Seismic Services',
    description: 'High-resolution 2D and ultra-high-resolution (UHR) seismic profiling, electrical resistivity tomography, and shallow gas hazard detection to evaluate subsurface drilling and piling risks.',
    icon: '📊'
  },
  {
    id: 'geophysical-hydrographic-survey',
    title: 'Geophysical & Hydrographic Survey Services',
    description: 'Dual-frequency multibeam bathymetry, side-scan sonar imaging, and sub-bottom stratigraphy mapping seabed topography, navigation channels, and pipeline corridors.',
    icon: '🗺️'
  },
  {
    id: 'geotechnical-foundation-engineering',
    title: 'Geotechnical & Foundation Engineering Services',
    description: '20-tonne hydraulic Cone Penetration Testing (CPT), deep borehole drilling, standard penetration testing (SPT), and foundation settlement analysis for onshore, swamp, and nearshore infrastructure.',
    icon: '🔬'
  },
  {
    id: 'precise-positioning-navigation',
    title: 'Precise Positioning & Navigation Services',
    description: 'Differential GNSS (DGNSS) surface positioning, subsea acoustic tracking (USBL/LBL), and geodetic control networks for offshore rigs, barges, and pipelay operations.',
    icon: '🧭'
  },
  {
    id: 'geospatial-reality-capture-digital-engineering',
    title: 'Geospatial, Reality Capture & Digital Engineering',
    description: '3D laser scanning using Leica RTC360 equipment, dimensional control surveys, GIS spatial mapping, and digital twin modelling to support engineering design and prevent installation clashes.',
    icon: '📸'
  },
  {
    id: 'laboratory-services',
    title: 'Laboratory Services',
    description: 'Accredited soil and rock mechanics testing, including triaxial shear, consolidation oedometer tests, and construction materials compliance verification.',
    icon: '🧪'
  }
];

// DIVISION 02 — METOCEAN & MARINE SOLUTIONS (MMS) SERVICE FAMILIES
export const MMS_SERVICE_FAMILIES: SubService[] = [
  {
    id: 'metocean-observation-monitoring',
    title: 'Metocean Observation & Monitoring',
    description: 'Oceanographic buoy deployment and real-time data collection, Acoustic Doppler Current Profiler (ADCP) measurements, directional wave recording, and tidal gauging.',
    icon: '🌊'
  },
  {
    id: 'marine-forecasting-intelligence',
    title: 'Marine Forecasting & Metocean Data',
    description: 'High-resolution hydrodynamic numerical modelling, squall early warning systems, and calibrated weather-window forecasts for offshore drilling and marine logistics.',
    icon: '🌦️'
  },
  {
    id: 'marine-environmental-services',
    title: 'Marine Environmental Services',
    description: 'Offshore baseline environmental surveys, benthic grab sampling, conductivity-temperature-depth (CTD) water column profiling, and sediment characterisation for statutory compliance.',
    icon: '🌿'
  },
  {
    id: 'marine-advisory-operational-support',
    title: 'Marine Advisory & Operational Support',
    description: 'Derivation of 10-year, 50-year, and 100-year extreme metocean design criteria, vessel mooring analyses, and marine warranty engineering advisory.',
    icon: '🛡️'
  }
];

// DIVISION 03 — INTEGRATED CONSTRUCTION SERVICES (ICS) SERVICE FAMILIES
export const ICS_SERVICE_FAMILIES: SubService[] = [
  {
    id: 'pipeline-construction-installation',
    title: 'Pipeline Construction & Installation',
    description: 'Flowline and trunkline installation, trenching, pipe stringing, field joint coating, and pipeline lowering-in, providing engineering and construction support in swamp terrain.',
    icon: '🏗️'
  },
  {
    id: 'civil-infrastructure-construction',
    title: 'Civil & Infrastructure Construction',
    description: 'Heavy industrial foundations, reinforced concrete bund walls, piling caps, access roads, and stormwater drainage for industrial and energy facilities.',
    icon: '🚜'
  },
  {
    id: 'mechanical-fabrication-installation',
    title: 'Mechanical, Fabrication & Installation',
    description: 'Structural steel fabrication, process piping spool manufacture, mechanical equipment alignment, and non-destructive testing (NDT).',
    icon: '⚙️'
  },
  {
    id: 'project-delivery-testing-commissioning',
    title: 'Project Delivery, Testing & Commissioning Support',
    description: 'Hydrostatic pressure testing, pipeline caliper cleaning pigging, nitrogen purging, and statutory pre-commissioning verification for operational handover.',
    icon: '📋'
  }
];

// DIVISION 04 — INDUSTRIAL SOLUTIONS (IS) SERVICE FAMILIES
export const IS_SERVICE_FAMILIES: SubService[] = [
  {
    id: 'produced-water-treatment-solutions',
    title: 'Produced Water Treatment Solutions',
    description: 'High-efficiency coalescing oil-water separation skids and filtration systems conditioning produced water for reinjection or compliant discharge.',
    icon: '💧'
  },
  {
    id: 'industrial-domestic-water-solutions',
    title: 'Industrial & Domestic Water Solutions',
    description: 'Reverse osmosis (RO) desalination, water borehole drilling, and multimedia filtration packages supplying potable and process water.',
    icon: '🚰'
  },
  {
    id: 'water-environmental-laboratory-services',
    title: 'Water & Environmental Laboratory Services',
    description: 'Certified analytical laboratory testing for oil-in-water concentration, heavy metal spectroscopy, biological oxygen demand (BOD), chemical oxygen demand (COD), and microbiological parameters.',
    icon: '🧪'
  },
  {
    id: 'wastewater-treatment-resource-recovery',
    title: 'Wastewater Treatment & Resource Recovery',
    description: 'Industrial wastewater treatment and resource recovery, effluent treatment plants (ETP), sewage treatment packages, and automated chemical dosing supporting environmental compliance.',
    icon: '♻️'
  }
];

// Backwards-compatibility subservice exports
export const GEO_DATA_INTELLIGENCE_SERVICES: SubService[] = GES_SERVICE_FAMILIES;
export const GROUND_INTELLIGENCE_SERVICES: SubService[] = GES_SERVICE_FAMILIES;
export const DIGITAL_MAPPING_SERVICES: SubService[] = GES_SERVICE_FAMILIES;
export const MARINE_INTELLIGENCE_SERVICES: SubService[] = MMS_SERVICE_FAMILIES;
export const ASSET_INTEGRITY_SERVICES: SubService[] = ICS_SERVICE_FAMILIES;
export const ENGINEERING_SOLUTIONS_SERVICES: SubService[] = IS_SERVICE_FAMILIES;

// Comprehensive routing map for clean redirection from all legacy paths & shorthands to the 4 approved divisions
export const LEGACY_SERVICE_MAP: Record<string, string> = {
  // Direct shorthand aliases
  'ges': 'geosolutions-engineering-services',
  'mms': 'metocean-marine-solutions',
  'ics': 'integrated-construction-services',
  'is': 'industrial-solutions',

  // Division 01: GeoSolutions & Engineering Services (GES) mappings
  'geosolutions-engineering-services': 'geosolutions-engineering-services',
  'geosolutions-engineering': 'geosolutions-engineering-services',
  'geo-solutions-engineering': 'geosolutions-engineering-services',
  'geo-data-intelligence': 'geosolutions-engineering-services',
  'ground-intelligence': 'geosolutions-engineering-services',
  'digital-mapping-intelligence': 'geosolutions-engineering-services',
  'digital-intelligence': 'geosolutions-engineering-services',
  'reality-capture': 'geosolutions-engineering-services',
  '3d-laser-scanning': 'geosolutions-engineering-services',
  'digital-twins': 'geosolutions-engineering-services',
  'geomatics-services': 'geosolutions-engineering-services',
  'spatial-intelligence': 'geosolutions-engineering-services',
  'geomatics': 'geosolutions-engineering-services',
  'topographic-mapping': 'geosolutions-engineering-services',
  'geotechnical-services': 'geosolutions-engineering-services',
  'onshore-nearshore-geotechnical': 'geosolutions-engineering-services',
  'seismic-services': 'geosolutions-engineering-services',
  'geotechnical-sampling': 'geosolutions-engineering-services',
  'geotechnical-investigation': 'geosolutions-engineering-services',
  'cpt-testing': 'geosolutions-engineering-services',
  'geohazard-geoscan-seismic': 'geosolutions-engineering-services',
  'geophysical-hydrographic-survey': 'geosolutions-engineering-services',
  'geotechnical-foundation-engineering': 'geosolutions-engineering-services',
  'precise-positioning-navigation': 'geosolutions-engineering-services',
  'geospatial-reality-capture-digital-engineering': 'geosolutions-engineering-services',
  'laboratory-services': 'geosolutions-engineering-services',
  'geophysical-surveys': 'geosolutions-engineering-services',
  'hydrographic-survey': 'geosolutions-engineering-services',
  'seabed-mapping': 'geosolutions-engineering-services',
  'subsurface-intelligence': 'geosolutions-engineering-services',
  'geospatial-intelligence': 'geosolutions-engineering-services',

  // Division 02: Metocean & Marine Solutions (MMS) mappings
  'metocean-marine-solutions': 'metocean-marine-solutions',
  'metocean-marine': 'metocean-marine-solutions',
  'marine-intelligence': 'metocean-marine-solutions',
  'offshore-intelligence': 'metocean-marine-solutions',
  'continuous-marine-intelligence': 'metocean-marine-solutions',
  'metocean': 'metocean-marine-solutions',
  'climate-environmental-metocean': 'metocean-marine-solutions',
  'metocean-observation-monitoring': 'metocean-marine-solutions',
  'marine-forecasting-intelligence': 'metocean-marine-solutions',
  'marine-environmental-services': 'metocean-marine-solutions',
  'marine-advisory-operational-support': 'metocean-marine-solutions',
  'environmental-survey': 'metocean-marine-solutions',
  'search-and-salvage': 'metocean-marine-solutions',

  // Division 03: Integrated Construction Services (ICS) mappings
  'integrated-construction-services': 'integrated-construction-services',
  'integrated-engineering-construction': 'integrated-construction-services',
  'integrated-construction': 'integrated-construction-services',
  'pipeline-construction': 'integrated-construction-services',
  'pipeline-construction-installation': 'integrated-construction-services',
  'infrastructure-construction': 'integrated-construction-services',
  'civil-infrastructure-construction': 'integrated-construction-services',
  'civil-infrastructure': 'integrated-construction-services',
  'civil-works': 'integrated-construction-services',
  'mechanical-fabrication': 'integrated-construction-services',
  'mechanical-fabrication-installation': 'integrated-construction-services',
  'construction-project-management': 'integrated-construction-services',
  'project-delivery-testing-commissioning': 'integrated-construction-services',
  'project-delivery': 'integrated-construction-services',
  'asset-integrity': 'integrated-construction-services',
  'asset-integrity-intelligence': 'integrated-construction-services',
  'asset-integrity-services': 'integrated-construction-services',
  'asset-integrity-management': 'integrated-construction-services',
  'facility-maintenance': 'integrated-construction-services',
  'asset-inspection': 'integrated-construction-services',
  'rov-inspection': 'integrated-construction-services',
  'ndt-inspection': 'integrated-construction-services',
  'oilfield-services': 'integrated-construction-services',
  'field-operations': 'integrated-construction-services',

  // Division 04: Industrial Solutions (IS) mappings
  'industrial-solutions': 'industrial-solutions',
  'industrial-environmental-technologies': 'industrial-solutions',
  'industrial-environmental': 'industrial-solutions',
  'engineering-industrial-environmental-solutions': 'industrial-solutions',
  'produced-water-treatment': 'industrial-solutions',
  'produced-water-treatment-solutions': 'industrial-solutions',
  'industrial-domestic-water-solutions': 'industrial-solutions',
  'wastewater-treatment': 'industrial-solutions',
  'wastewater-treatment-resource-recovery': 'industrial-solutions',
  'water-environmental-laboratory-services': 'industrial-solutions',
  'industrial-water-treatment': 'industrial-solutions',
  'water-treatment-plants': 'industrial-solutions',
  'water-engineering': 'industrial-solutions',
  'water-environmental-solutions': 'industrial-solutions',
  'valves-and-actuators': 'industrial-solutions',
  'flow-control-and-automation': 'industrial-solutions',
  'integrated-valve-maintenance': 'industrial-solutions',
  'energy-transition': 'industrial-solutions'
};

// Master Authoritative Services Array: Four Divisions
export const SERVICES: Service[] = [
  // 01. GEOSOLUTIONS & ENGINEERING SERVICES (GES)
  {
    id: 'geosolutions-engineering-services',
    serviceNumber: '01',
    abbreviation: 'GES',
    descriptor: 'GEOSCIENCE | SURVEY | ENGINEERING | DIGITAL SOLUTIONS',
    positioning: 'Geophysical surveys, geotechnical investigations, positioning, and reality capture.',
    title: 'GeoSolutions & Engineering Services',
    tagline: 'Geoscience, Geotechnics, Survey & 3D Reality Capture',
    description: "PIGL undertakes geophysical and hydrographic surveys, geotechnical investigations, positioning, geospatial data acquisition and reality capture to support engineering design and infrastructure development.",
    items: [
      'Geohazard, Geoscan & Seismic Services',
      'Geophysical & Hydrographic Survey Services',
      'Geotechnical & Foundation Engineering Services',
      'Precise Positioning & Navigation Services',
      'Geospatial, Reality Capture & Digital Engineering',
      'Laboratory Services'
    ],
    subServices: GES_SERVICE_FAMILIES,
    icon: '🔬',
    image: OpDrillCrewCasingImg,
    division: 'GeoSolutions & Engineering Services'
  },

  // 02. METOCEAN & MARINE SOLUTIONS (MMS)
  {
    id: 'metocean-marine-solutions',
    serviceNumber: '02',
    abbreviation: 'MMS',
    descriptor: 'METOCEAN | MARINE OBSERVATION | ENVIRONMENTAL SOLUTIONS',
    positioning: 'Marine observation, oceanographic monitoring, and environmental surveys.',
    title: 'Metocean & Marine Solutions',
    tagline: 'Oceanographic Monitoring, Metocean Forecasting & Marine Surveys',
    description: "We provide marine observation, oceanographic monitoring, forecasting and environmental survey services to support offshore planning, marine operations and environmental assessment.",
    items: [
      'Metocean Observation & Monitoring',
      'Marine Forecasting & Metocean Data',
      'Marine Environmental Services',
      'Marine Advisory & Operational Support'
    ],
    subServices: MMS_SERVICE_FAMILIES,
    icon: '🌊',
    image: OpOffshoreBargeImg,
    division: 'Metocean & Marine Solutions',
    partnerBadge: {
      partnerName: 'Frankstar Technology',
      role: 'Strategic Metocean Technology Partner'
    }
  },

  // 03. INTEGRATED CONSTRUCTION SERVICES (ICS)
  {
    id: 'integrated-construction-services',
    serviceNumber: '03',
    abbreviation: 'ICS',
    descriptor: 'PIPELINE | INFRASTRUCTURE | MECHANICAL | CONSTRUCTION DELIVERY',
    positioning: 'Pipeline installation, civil infrastructure, and mechanical fabrication.',
    title: 'Integrated Construction Services',
    tagline: 'Pipeline Construction, Civil Infrastructure & Field Fabrication',
    description: "We undertake pipeline installation, civil infrastructure, mechanical fabrication and installation, and construction support for industrial and energy projects.",
    items: [
      'Pipeline Construction & Installation',
      'Civil & Infrastructure Construction',
      'Mechanical, Fabrication & Installation',
      'Project Delivery, Testing & Commissioning Support'
    ],
    subServices: ICS_SERVICE_FAMILIES,
    icon: '🏗️',
    image: OpPipelineSwampCatImg,
    division: 'Integrated Construction Services'
  },

  // 04. INDUSTRIAL SOLUTIONS (IS)
  {
    id: 'industrial-solutions',
    serviceNumber: '04',
    abbreviation: 'IS',
    descriptor: 'WATER TREATMENT | PROCESS SOLUTIONS | ENVIRONMENTAL SERVICES',
    positioning: 'Produced water treatment, water systems, and laboratory analysis.',
    title: 'Industrial Solutions',
    tagline: 'Produced Water Treatment, Process Water & Water Testing',
    description: "We provide produced-water treatment, industrial and domestic water systems, laboratory analysis and wastewater treatment services for industrial and environmental applications.",
    items: [
      'Produced Water Treatment Solutions',
      'Industrial & Domestic Water Solutions',
      'Water & Environmental Laboratory Services',
      'Wastewater Treatment & Resource Recovery'
    ],
    subServices: IS_SERVICE_FAMILIES,
    icon: '💧',
    image: WaterTreatmentSkidImg,
    division: 'Industrial Solutions',
    partnerBadge: {
      partnerName: 'CoaleXpert',
      role: 'Strategic Produced Water & Separation Partner'
    }
  }
];

export const PARTNERS: Partner[] = [
  {
    id: 'frankstar',
    name: 'Frankstar Technology',
    role: 'Strategic Metocean Technology Partner',
    specialty: 'Oceanographic Observation, Metocean Buoys & Real-Time Telemetry',
    description: 'Through our partnership with Frankstar Technology, PIGL provides oceanographic weather buoys, wave monitoring, current profiling, and real-time marine weather data to support safe coastal and offshore operations.',
    capabilities: [
      'Oceanographic weather buoys for wave, current, and tidal monitoring',
      'Meteorological weather stations and data loggers',
      'Real-time environmental data transmission',
      'Water quality monitoring and underwater sensors',
      'Marine operational safety monitoring'
    ],
    website: 'https://www.frankstartech.com/',
    serviceId: 'metocean-marine-solutions',
    serviceTitle: 'Metocean & Marine Solutions'
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
    serviceId: 'industrial-solutions',
    serviceTitle: 'Industrial Solutions'
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
    serviceId: 'industrial-solutions',
    serviceTitle: 'Industrial Solutions'
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'AKK Gas Pipeline Survey & ROW Execution',
    client: 'Brentex / Dover',
    category: 'Geoscience & Engineering',
    serviceCapability: 'Spatial Data & Geotechnical Surveys',
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
    category: 'Marine & Positioning',
    serviceCapability: 'Marine Geophysics & Rig Positioning',
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
    category: '3D Reality Capture',
    serviceCapability: '3D Laser Scanning & Reality Capture',
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
    category: 'Ground Engineering',
    serviceCapability: 'Hydrogeological Surveys & Deep Boreholes',
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
    category: 'Marine Geophysics',
    serviceCapability: 'Sub-Bottom Profiling & Bathymetry',
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
    title: 'Chevron Great Hall Facility 3D Laser Scanning',
    client: 'Chevron',
    category: '3D Reality Capture',
    serviceCapability: 'Terrestrial Laser Scanning & CAD Modelling',
    description: 'Complete 3D Terrestrial Laser Scanning and As-Built 3D CAD Modelling of Chevron Great Hall Facility.',
    image: GreatHallImg,
    scope: 'High-definition 3D laser scanning and intelligent CAD model generation for structural management.',
    equipment: ['Advanced 3D Laser Scanners', 'Point Cloud Processing Workstations'],
    results: 'Delivered complete millimetre-accurate As-Built 3D model for facility planning.',
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

