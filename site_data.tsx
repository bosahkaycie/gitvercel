 
import { Service, Project, TeamMember, LinkedInPost, CoreValue } from './types';
import RealityCaptureImg from './assets/DJI_0191.JPG';
import GeosolutionsImg from './assets/DJI_0003.jpg';
import PipelineImg from './assets/DJI_0240.jpg';
import CivilWorksImg from './assets/road-feat-700x500.jpg';
import IntegratedImg from './assets/procure.jpg';
import AkkImg from './assets/akk_pipeline.png';
import RigImg from './assets/rig_positioning.png';
import FacilityImg from './assets/dji_fly_20240925_101740_268_1727256105225_photo.jpg';
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
import HbdImg from './assets/HBD.jpg';
import TechImg from './assets/IMG_6170.jpg';
import NextGenImg from './assets/inspiring_next_gen.jpeg';
import TeamImg from './assets/team.jpeg';
import DigiTwinImg from './assets/digitwin.png';





export const COLORS = {
  primary: '#064E3B',
  secondary: '#059669',
  accent: '#F97316',
  background: '#F8FAFC'
};

export const CORE_VALUES: CoreValue[] = [
  {
    title: 'Professionalism',
    description: 'We adhere to the highest industry standards, delivering excellence through expertise and discipline.',
    icon: ''
  },
  {
    title: 'Innovation',
    description: 'Embracing the latest technology like 3D Reality Capture to solve complex engineering challenges.',
    icon: ''
  },
  {
    title: 'Integrity',
    description: 'Honesty and transparency in all our dealings with clients, stakeholders, and host communities.',
    icon: ''
  },
  {
    title: 'Safety First',
    description: 'Unwavering commitment to 100% safety compliance and ISO certified management systems.',
    icon: ''
  }
];

export const SERVICES: Service[] = [
  {
    id: 'oil-and-gas',
    title: 'Technical integrity for a safer energy future',
    description: 'Providing high-fidelity engineering and advanced geosolutions for Swamp, Land, and Offshore operations, ensuring safety and operational excellence.',
    icon: '',
    image: DigiTwinImg,
    items: [
      'Swamp & Land Operations',
      'Offshore Engineering Support',
      'Technical Integrity Management',
      'Operational Excellence'
    ]
  },
  {
    id: 'reality-capture',
    title: '3D Reality Capture & Laser Scanning',
    description: 'PIGL delivers high-fidelity 3D Laser Scanning and Digital Twin solutions for precision engineering in Nigeria.',
    icon: '',
    image: RealityCaptureImg,
    items: [
      '3D Laser Scanning & Digital Twins',
      'Advanced Reality Capture Solutions',
      'UAV Aerial Mapping & Photogrammetry',
      'Dimension Control & Alignment'
    ]
  },
  {
    id: 'geosolutions',
    title: 'Geotechnical & Marine Survey',
    description: 'Advanced geophysical surveys and high-accuracy bathymetric mapping for complex offshore and land engineering challenges across Sub-Saharan Africa.',
    icon: '',
    image: GeosolutionsImg,
    items: [
      'Geotechnical & Soil Investigation',
      'Bathymetric & Marine Survey',
      'Sub-bottom Profiling & Hydrography',
      'Offshore Positioning Services'
    ]
  },
  {
    id: 'pipeline',
    title: 'Pipeline integrity and facility construction',
    description: 'Indigenous leader in pipeline maintenance and facility support, specializing in API-standard welding, fabrication, and comprehensive integrity testing.',
    icon: '',
    image: PipelineImg,
    items: [
      'Welding & Precision Fabrication',
      'Pipeline Grinding & Maintenance',
      'Cathodic Protection Systems',
      'Hydrostatic & NDT Testing',
      'Facility Integrity Management'
    ]
  },
  {
    id: 'integrated',
    title: 'Integrated Project Management',
    description: 'Bespoke end-to-end technical support for the oil and gas sector, combining engineering, procurement, and field supervision.',
    icon: '',
    image: IntegratedImg,
    items: [
      'Engineering Procurement',
      'Industrial Water Borehole Drilling',
      'Technical Manpower Supply',
      'Asset Management Solutions'
    ]
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'AKK Gas Pipeline Survey',
    client: 'Brentex / Dover',
    category: 'Pipeline',
    description: 'Comprehensive surveying and geotechnical investigation for the 40" x 311M mainline installation.',
    image: AkkImg,
    scope: 'Land survey and soil characterization for high-pressure gas infrastructure.',
    challenge: 'Navigating diverse terrains and ensuring data precision across a 311km pipeline route with tight environmental constraints.',
    solution: 'Deployment of high-accuracy GNSS systems and multi-disciplinary survey teams to provide real-time Geo-data integration.',
    equipment: ['Trimble R12 GNSS', 'Resistivity Meters'],
    results: 'Project completed ahead of schedule with zero safety incidents.',
    location: 'Kogi/Kaduna, Nigeria',
    year: '2024'
  },
  {
    id: 'p2',
    title: 'Offshore Rig Positioning',
    client: 'WAV',
    category: 'Geosolutions',
    description: 'Marine survey and precise rig positioning using DGPS systems for offshore swamp operations.',
    image: RigImg,
    scope: 'Sub-surface mapping and precise anchoring positioning.',
    challenge: 'Achieving sub-meter accuracy in a dynamic swamp environment with limited visibility and complex tidal movements.',
    solution: 'Utilizing advanced DGPS and Multibeam systems coupled with expert hydrographers for real-time positioning feedback.',
    equipment: ['Multibeam Echosounder', 'Gyrocompass Systems'],
    results: 'High-fidelity alignment achieved for complex sub-sea anchoring.',
    location: 'Escravos, Delta State',
    year: '2023'
  },
  {
    id: 'p3',
    title: 'Facility Reality Capture',
    client: 'Aradel',
    category: 'Geosolutions',
    description: 'Full-scale digitization of brownfield assets for intelligent asset management.',
    image: FacilityImg,
    scope: '3D Laser Scanning of active processing facilities.',
    challenge: 'Creating a high-fidelity digital twin of a brownfield asset without interrupting ongoing production operations.',
    solution: 'Rapid high-definition scanning using advanced 3D laser systems, delivering million-point cloud data with minimal site footprint.',
    equipment: ['Advanced 3D Laser Scanners', 'High-Precision GNSS'],
    results: 'Created detailed Digital Twins reducing maintenance planning time by 30%.',
    location: 'Ogbele Field, Rivers State',
    year: '2024'
  },
  {
    id: 'p4',
    title: 'Industrial Borehole Drilling',
    client: 'SIRI GLOBAL',
    category: 'Integrated',
    description: 'Design and installation of dual industrial water boreholes at 120M depth.',
    image: DrillingImg,
    scope: 'Water table mapping and structural drilling.',
    equipment: ['Rotary Drilling Rig', 'Geophysical Logging Tools'],
    results: 'Sustainable high-capacity water source established for facility operations.',
    location: 'Omoku, Rivers State',
    year: '2023',
    challenge: 'Identifying high-yield aquifers in complex sedimentary structures while ensuring zero cross-contamination with industrial waste.',
    solution: 'Advanced geophysical logging and multi-stage filter placement to ensure long-term borehole productivity.'
  },
  {
    id: 'p5',
    title: 'Access Road Maintenance',
    client: 'TotalEnergies',
    category: 'Civil',
    description: 'Rehabilitation and structural maintenance of heavy-duty access roads for operational sites.',
    image: RoadImg,
    scope: 'Grading, drainage clearing, and asphalt reinforcement.',
    equipment: ['Motor Graders', 'Steam Rollers'],
    results: 'Restored logistical efficiency for facility transport.',
    location: 'Onne, Nigeria',
    year: '2024',
    challenge: 'Maintaining critical transport routes during peak monsoon season with heavy-duty oilfield traffic.',
    solution: 'Rapid asphalt reinforcement and advanced drainage clearing to prevent water-logging and structural failure.'
  },
  {
    id: 'p6',
    title: 'Civil Engineering Works',
    client: 'Chevron',
    category: 'Civil',
    description: 'Site preparation and structural foundations for new industrial facility modules.',
    image: CivilWorksImg,
    scope: 'Piling, site clearing, and leveling.',
    equipment: ['Excavators', 'Piling Rigs'],
    results: 'Stable foundational base delivered for primary infrastructure.',
    location: 'Bonny Island, Nigeria',
    year: '2023',
    challenge: 'Preparing site foundations in high-salinity swamp environments with strict environmental footprint restrictions.',
    solution: 'Precision piling and specialized soil stabilization techniques to support heavy modular units.'
  },
  {
    id: 'p7',
    title: 'Sub-bottom Profiling',
    client: 'Fugro',
    category: 'Geosolutions',
    description: 'Marine sub-surface characterization for pipeline route selection.',
    image: SubImg,
    scope: 'Acoustic profiling of sea-bed strata.',
    equipment: ['Sub-bottom Profiler', 'Side Scan Sonar'],
    results: 'Critical geological data provided for secure pipeline anchoring.',
    location: 'Gulf of Guinea',
    year: '2024',
    challenge: 'Detecting shallow gas pockets and buried obstructions in deep-water shipping channels.',
    solution: 'High-frequency acoustic profiling and side-scan sonar integration for a complete sub-surface picture.'
  },
  {
    id: 'p8',
    title: 'Chevron Great Hall Facility',
    client: 'Chevron',
    category: 'Geosolutions',
    description: '3D Laser Scanning and Modelling of Chevron Great Hall Facility, Warri.',
    image: GreatHallImg,
    scope: 'High-definition 3D digitization for facility management.',
    equipment: ['Advanced 3D Scanners', 'Modelling Software'],
    results: 'Detailed As-Built 3D Model delivered.',
    location: 'Warri, Delta State',
    year: '2024',
    challenge: 'Digitizing a highly complex, aging facility with thousands of intricate pipe runs and limited access points.',
    solution: 'Using advanced laser scanning technology for rapid 3D point cloud generation and intelligent modeling to create a comprehensive digital twin.'
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
  front: DigiTwinImg,
  team: TeamImg
};

export const STRENGTHS = [
  'Quality Project Execution',
  'Satisfied Client Base',
  'Bespoke Engineering Solutions',
  'Cost Effective Delivery',
  'ISO Certified Systems',
  'State-of-the-Art 3D Reality Capture'
];

export const HSSE_STATS = [
  { label: 'Lost Time Injuries (LTI)', value: '0', description: 'Zero recordable injuries in the last 5 years.' },
  { label: 'Safe Man-Hours', value: '500k+', description: 'Accumulated across major swamp and offshore operations.' },
  { label: 'Environmental Incidents', value: '0', description: 'Zero spills or environmental non-compliance reports.' },
  { label: 'Technical Audits Passed', value: '100%', description: 'Consistent excellence in IOC and regulatory audits.' }
];

export const HSSE_POLICIES = [
  {
    title: 'Occupational Health',
    content: 'We prioritize the physical and mental well-being of our workforce through rigorous health screenings and ergonomic field standards.'
  },
  {
    title: 'Operational Safety',
    content: 'Our "Stop Work Authority" empowers every employee to halt operations if they perceive a safety risk, ensuring zero compromise.'
  },
  {
    title: 'Environmental Protection',
    content: 'We employ advanced geosolutions to minimize our operational footprint and protect the fragile ecosystems where we work.'
  },
  {
    title: 'Quality Excellence',
    content: 'Quality is not an act, but a habit. Our ISO-aligned processes ensure data fidelity and engineering precision in every deliverable.'
  }
];

export const CERTIFICATIONS = [
  { title: 'ISO 9001:2015', organization: 'Quality Management Systems', status: 'Certified' },
  { title: 'ISO 45001:2018', organization: 'Occupational Health & Safety', status: 'Certified' },
  { title: 'DPR/NUPRC Permit', organization: 'Oil & Gas Service Category', status: 'Active' },
  { title: 'COREN Certified', organization: 'Council for the Regulation of Engineering in Nigeria', status: 'Active' }
];
