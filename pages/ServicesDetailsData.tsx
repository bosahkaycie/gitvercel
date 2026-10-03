import { SubService } from '../types';
import {
  GEO_DATA_INTELLIGENCE_SERVICES,
  DIGITAL_MAPPING_SERVICES,
  MARINE_INTELLIGENCE_SERVICES,
  ASSET_INTEGRITY_SERVICES,
  ENGINEERING_SOLUTIONS_SERVICES
} from '../site_data';

export interface ServiceDetail {
  id: string;
  longDescription: string;
  businessValue: string;
  whereWeOperate: string[];
  methodology: string[];
  equipment: string[];
  subServices?: SubService[];
  gallery?: { url: string; title: string; caption: string }[];
  video_url?: string;
  relatedCapabilities: { id: string; title: string }[];
  relevantProjects: string[];
  partnerCallout?: {
    title: string;
    description: string;
    partnerName: string;
    website?: string;
  };
}

/**
 * Transforms various video URLs (YouTube watch, youtu.be, Vimeo, embed) into standard iframe embed URLs.
 */
export const getEmbedVideoUrl = (rawUrl?: string): string | null => {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  // YouTube watch format: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([^&]+)/i);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?rel=0&modestbranding=1`;
  }

  // YouTube short format: https://youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([^?&#]+)/i);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}?rel=0&modestbranding=1`;
  }

  // Already YouTube embed
  if (trimmed.includes('youtube.com/embed') || trimmed.includes('youtube-nocookie.com/embed')) {
    return trimmed;
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return trimmed;
};

export const SERVICE_GALLERY_PRESETS: Record<string, { url: string; title: string; caption: string }[]> = {
  'geo-data-intelligence': [
    {
      url: '/assets/cpt.png',
      title: '20-Ton Heavy-Duty Hydraulic CPT Rig',
      caption: 'Continuous hydraulic piezocone penetration testing (CPTu) providing high-resolution soil mechanics & stratigraphy.'
    },
    {
      url: '/assets/operations/pigl_offshore_geotech_drilling_barge.jpg',
      title: 'Nearshore & Swamp Geotechnical Drilling Barge',
      caption: 'Self-elevating modular pontoon rig conducting marine foundation soil boring and undisturbed tube sampling.'
    },
    {
      url: '/assets/operations/pigl_offshore_drill_crew_casing.jpg',
      title: 'Deep Borehole Casing & Drill Crew Operations',
      caption: 'PIGL geotechnical crew advancing steel casing for deep foundation soil mechanics in marine deltaic terrain.'
    },
    {
      url: '/assets/ground_intel_geotech.jpg',
      title: 'Onshore Soil Boring & SPT Sampling Spread',
      caption: 'Rigid rotary drill unit advancing boreholes with Standard Penetration Testing for heavy industrial plant design.'
    },
    {
      url: '/assets/drilling.png',
      title: 'Hydraulic Rotary Rig in Operational Swamp Terrain',
      caption: 'Rotary coring and deep stratigraphic exploration across remote Nigerian wetland energy corridors.'
    },
    {
      url: '/assets/seismic_survey.png',
      title: 'Subsurface Geophysical Seismic Refraction',
      caption: 'Multi-channel digital seismic recording array for bedrock profiling, rip-ability analysis, and fault detection.'
    }
  ],
  'digital-mapping-intelligence': [
    {
      url: '/assets/operations/pigl_3d_reality_capture_jetty_plant.jpg',
      title: '3D Reality Capture of Gas Processing Jetty',
      caption: 'High-density terrestrial laser scanning of gas processing jetty and manifold piping infrastructure in Rivers State.'
    },
    {
      url: '/assets/operations/pigl_3d_laser_scan_facility_cooler.jpg',
      title: 'Industrial Cooler Array Dimension Control',
      caption: 'Millimeter-accurate point cloud acquisition for structural deformation monitoring and fabrication tie-in validation.'
    },
    {
      url: '/assets/operations/pigl_3d_laser_scan_manifold_station.jpg',
      title: 'Flowstation Production Manifold Scan',
      caption: 'Complex spool geometry capture and clash detection modeling for brownfield piping modifications.'
    },
    {
      url: '/assets/digital_intel_scanner.jpg',
      title: 'Terrestrial Laser Scanning Spread',
      caption: 'Deployment of high-speed Leica RTC360 & P50 survey spreads for sub-centimeter reality capture.'
    },
    {
      url: '/assets/digitwin.png',
      title: 'Intelligent As-Built BIM & Digital Twins',
      caption: 'Parametric CAD feature extraction, clash simulation, and cloud-hosted digital twin asset representations.'
    },
    {
      url: '/assets/operations/pigl_geomatics_survey_quay.jpg',
      title: 'Quayside High-Precision Geomatics Setup',
      caption: 'Geodetic survey network tie-in and reality capture across active marine quayside operating areas.'
    }
  ],
  'marine-intelligence': [
    {
      url: '/assets/marine_intel_metocean.jpg',
      title: 'Offshore MetOcean Observation & Telemetry',
      caption: 'Continuous oceanographic monitoring in partnership with Frankstar Technology deploying acoustic Doppler current profilers.'
    },
    {
      url: '/assets/operations/pigl_subbottom_profiler_sb216s.jpg',
      title: 'Subsea Sub-Bottom Acoustic Profiler SB-216S',
      caption: 'High-resolution acoustic towfish deployment for shallow seabed stratigraphy, buried pipeline tracking, and gas hazards.'
    },
    {
      url: '/assets/operations/pigl_marine_crew_vessel.jpg',
      title: 'Dedicated Hydrographic Survey Support Vessel',
      caption: 'PIGL coastal survey craft configured with multi-beam echo sounders, gyrocompasses, and hydroacoustic tracking.'
    },
    {
      url: '/assets/operations/pigl_offshore_winch_pigl_container.jpg',
      title: 'Survey Deck Winch & Instrumented Container',
      caption: 'Mobilization of deck handling equipment and air-conditioned instrumentation laboratory for offshore geophysics.'
    },
    {
      url: '/assets/field_operations_marine.jpg',
      title: 'Nearshore Bathymetry & Seabed Profiling',
      caption: 'Dual-frequency acoustic bathymetry, side-scan sonar, and marine magnetics mapping for pipeline landfalls.'
    },
    {
      url: '/assets/new barge.png',
      title: 'Shallow-Water Geophysical Survey Barge',
      caption: 'Customized marine barge spread delivering precise navigation and seabed clearance in shallow delta estuaries.'
    }
  ],
  'asset-integrity-intelligence': [
    {
      url: '/assets/asset_integrity_ndt.jpg',
      title: 'Pressure Vessel NDT Integrity Testing',
      caption: 'Certified Non-Destructive Testing, phased array ultrasonics, and wall-thickness profiling on processing vessels.'
    },
    {
      url: '/assets/IMG_6170.jpg',
      title: 'PIGL Technical Integrity Inspection Team',
      caption: 'Certified inspection engineers mobilizing with precision ultrasonic and acoustic emission diagnostic instrumentation.'
    },
    {
      url: '/assets/operations/pigl_pipeline_marine_welding.jpg',
      title: 'Structural Weld Integrity & Hydrostatic Testing',
      caption: 'Volumetric weld inspection, PAUT flaw verification, and hydrostatic pressure containment validation.'
    },
    {
      url: '/assets/asset_management.png',
      title: 'Acoustic Emission Structural Health Monitoring',
      caption: 'Continuous micro-acoustic fracture sensing and structural life-extension analysis for industrial plants.'
    },
    {
      url: '/assets/engineering_procure_flanges.jpg',
      title: 'Mechanical Spool & Flange Quality Assurance',
      caption: 'Critical high-pressure piping component metallurgy verification, bolt tensioning checks, and dimensional audits.'
    },
    {
      url: '/assets/IMG_6558.jpg',
      title: 'Hydrostatic Field Quality & Pressure Verification',
      caption: 'API-compliant pressure testing and leak detection on high-pressure pipelines prior to commercial commissioning.'
    }
  ],
  'engineering-industrial-environmental-solutions': [
    {
      url: '/assets/operations/pigl_pipeline_construction_swamp_cat.jpg',
      title: 'Heavy Swamp-Cat Pipeline ROW Construction',
      caption: 'Excavation, ditching, and amphibious pipe stringing through challenging Niger Delta wetland corridors.'
    },
    {
      url: '/assets/newpipeline.png',
      title: 'Pipeline Trenching & Section Lowering',
      caption: 'API 1104 standard welded pipeline section lowering, backfilling, and cathodic protection installation.'
    },
    {
      url: '/assets/pigl_pipeline_clearing_aerial.jpg',
      title: 'Aerial Drone Survey of Pipeline Right-of-Way',
      caption: 'High-resolution aerial reconnaissance and environmental corridor mapping for pipeline construction clearance.'
    },
    {
      url: '/assets/access road.jpg',
      title: 'Swamp Access Road Civil Construction',
      caption: 'Geotextile subgrade stabilization, structural earthworks, and heavy-haul access road pavement engineering.'
    },
    {
      url: '/assets/water_treatment_skid.jpg',
      title: 'Modular Water Treatment & Injection Skid',
      caption: 'Turnkey engineering, procurement, and fabrication of skid-mounted industrial water treatment modules.'
    },
    {
      url: '/assets/operations/pigl_logistics_base_aerial.jpg',
      title: 'PIGL Heavy Fabrication Yard & Logistics Base',
      caption: 'Dedicated operations yard in Port Harcourt featuring heavy equipment maintenance and marine staging.'
    }
  ]
};

// Aliases for gallery presets
SERVICE_GALLERY_PRESETS['ground-intelligence'] = SERVICE_GALLERY_PRESETS['geo-data-intelligence'];
SERVICE_GALLERY_PRESETS['digital-intelligence'] = SERVICE_GALLERY_PRESETS['digital-mapping-intelligence'];
SERVICE_GALLERY_PRESETS['offshore-intelligence'] = SERVICE_GALLERY_PRESETS['marine-intelligence'];
SERVICE_GALLERY_PRESETS['asset-integrity'] = SERVICE_GALLERY_PRESETS['asset-integrity-intelligence'];
SERVICE_GALLERY_PRESETS['asset-integrity-management'] = SERVICE_GALLERY_PRESETS['asset-integrity-intelligence'];
SERVICE_GALLERY_PRESETS['integrated-engineering-construction'] = SERVICE_GALLERY_PRESETS['engineering-industrial-environmental-solutions'];
SERVICE_GALLERY_PRESETS['industrial-environmental-technologies'] = SERVICE_GALLERY_PRESETS['engineering-industrial-environmental-solutions'];

export const SERVICE_DETAILS_MAP: Record<string, ServiceDetail> = {
  // 01. GEO DATA INTELLIGENCE
  'geo-data-intelligence': {
    id: 'geo-data-intelligence',
    longDescription: 'PIGL delivers comprehensive subsurface characterisation, ground engineering, and geodetic investigations that turn geological uncertainty into structural engineering confidence. Operating across complex swamp, coastal, land, nearshore, and river crossing environments throughout Nigeria, we conduct deep soil boring, high-capacity hydraulic Cone Penetration Testing (20-Ton CPT/CPTu), Standard Penetration Testing (SPT), and comprehensive geotechnical laboratory testing for soil and rock mechanics. Our capabilities extend to onshore terrestrial seismic refraction/reflection acquisition, electrical resistivity tomography (ERT), industrial borehole drilling, hydrogeological mapping, foundation and deep piling capacity engineering, alongside cadastral land surveying and geodetic control networks.',
    businessValue: 'Prevents catastrophic foundation failure, differential settlement, and pipeline route disputes by establishing verified empirical soil mechanics and sub-centimeter geodetic baselines. Optimizes piling design depths and saves significant civil CAPEX on heavy industrial assets.',
    whereWeOperate: ['Swamp Basins', 'Coastal & Intertidal Zones', 'Onshore Industrial Sites', 'Pipeline Corridors & ROW', 'River Crossings & Jetties'],
    gallery: SERVICE_GALLERY_PRESETS['geo-data-intelligence'],
    video_url: '/assets/videos/ground_intelligence.mp4',
    subServices: GEO_DATA_INTELLIGENCE_SERVICES,
    methodology: [
      'Geotechnical site reconnaissance & in-situ investigation layout planning',
      'Continuous hydraulic Cone Penetration Testing (20-Ton CPT & CPTu profiling)',
      'Rotary borehole drilling, SPT sampling & undisturbed tube coring',
      'Laboratory soil classification, triaxial shear, consolidation & chemical testing',
      'Refraction & reflection seismic data acquisition & geological interpretation',
      'Electrical resistivity tomography (ERT) & vertical electrical sounding',
      'Primary RTK-GNSS geodetic control network establishment & boundary demarcation',
      'Engineering geotechnical reports, bearing capacity & settlement modeling'
    ],
    equipment: [
      'High-Capacity 20-Ton Hydraulic CPT Rigs',
      'Pontoon-Mounted Shallow-Water & Swamp Drilling Units',
      'Rotary Core Drilling Rigs & Split-Spoon Samplers',
      'Automated Triaxial & Direct Shear Testing Systems',
      'Multi-Channel Digital Seismic Recording Instruments',
      'Multi-Electrode Terrameter Resistivity Systems',
      'Trimble R12 & Leica RTK-GNSS Dual-Frequency Receivers'
    ],
    relatedCapabilities: [
      { id: 'digital-mapping-intelligence', title: 'Digital Mapping Intelligence' },
      { id: 'marine-intelligence', title: 'Marine Intelligence' }
    ],
    relevantProjects: ['p1', 'p4', 'p6']
  },

  // 02. DIGITAL MAPPING INTELLIGENCE
  'digital-mapping-intelligence': {
    id: 'digital-mapping-intelligence',
    longDescription: 'PIGL converts complex physical assets, industrial process plants, and brownfield operating environments into millimeter-accurate digital engineering intelligence. Utilizing high-speed terrestrial 3D laser scanners (Leica RTC360), mobile scanning systems, aerial drone LiDAR, and advanced point cloud processing pipelines, we capture intricate processing facilities, offshore production platforms, and structural geometries. The resulting spatial datasets feed directly into intelligent As-Built 3D CAD/BIM models (Autodesk Plant 3D, Revit, Navisworks) and interactive digital twins, providing engineering teams with an absolute single source of truth for brownfield modifications, clash detection, spool verification, topographic mapping, and structural deformation monitoring.',
    businessValue: 'Eliminates brownfield construction clash rework by up to 95%, reduces offsite engineering design cycles by 40%, and enables virtual walkthroughs and asset inspection without mobilizing personnel to high-risk swamp or offshore operating environments.',
    whereWeOperate: ['Onshore Flow Stations', 'Offshore Platforms', 'Gas Processing Plants', 'Refinery & Petrochemical Units', 'Storage Terminals', 'Pipeline Corridors'],
    gallery: SERVICE_GALLERY_PRESETS['digital-mapping-intelligence'],
    subServices: DIGITAL_MAPPING_SERVICES,
    methodology: [
      'Survey control network establishment & geodetic tie-ins',
      'High-density terrestrial 3D laser scanning & aerial LiDAR capture',
      'Point cloud registration, target alignment & noise filtration',
      'Intelligent 3D CAD/BIM feature extraction & parametric modeling',
      'Dimensional control verification, clash analysis & digital twin integration',
      'UAV drone photogrammetry & digital elevation model (DEM) generation',
      'Structural deformation monitoring and geometric baseline audits'
    ],
    equipment: [
      'Leica RTC360 High-Speed 3D Laser Scanner',
      'Leica ScanStation P50 Long-Range Scanner',
      'High-Precision RTK-GNSS Receivers',
      'DJI Enterprise RTK Mapping Drones with Zenmuse Sensors',
      'Leica Cyclone & Cyclone 3DR Processing Suite',
      'Autodesk Revit, Plant 3D & Navisworks Systems'
    ],
    relatedCapabilities: [
      { id: 'geo-data-intelligence', title: 'Geo Data Intelligence' },
      { id: 'asset-integrity-intelligence', title: 'Asset Integrity Intelligence' }
    ],
    relevantProjects: ['p3', 'p8']
  },

  // 03. MARINE INTELLIGENCE
  'marine-intelligence': {
    id: 'marine-intelligence',
    longDescription: 'PIGL\'s Marine Intelligence platform delivers continuous marine environmental observation, ocean dynamics measurement, hydrographic bathymetry, and high-resolution offshore geophysics across Nigeria\'s coastal, nearshore, and deepwater corridors. Through strategic technology partnership with Frankstar Technology, PIGL deploys state-of-the-art MetOcean telemetry buoys, wave monitoring systems, Acoustic Doppler Current Profilers (ADCP), tidal stations, and meteorological observation stations. Combined with our high-resolution multi-beam hydrographic bathymetry, sub-bottom acoustic profiling, side-scan sonar, and marine hazard mapping, we provide offshore operators with real-time marine intelligence for drilling, pipeline routing, search and salvage, and environmental compliance.',
    businessValue: 'Dramatically de-risks offshore drilling, pipeline routing, and marine construction by identifying subsea hazards and seabed scour. Real-time MetOcean data optimizes vessel logistics, gangway operations, and maintains full compliance with NUPRC and international maritime safety standards.',
    whereWeOperate: ['Gulf of Guinea Deepwater', 'Nearshore Energy Corridors', 'Coastal Jetties & Terminals', 'Niger Delta Estuaries', 'Offshore Exploration Blocks'],
    gallery: SERVICE_GALLERY_PRESETS['marine-intelligence'],
    subServices: MARINE_INTELLIGENCE_SERVICES,
    methodology: [
      'Hydrographic survey line planning & geodetic calibration',
      'Multi-sensor geophysical acoustic acquisition (sonar, sub-bottom, magnetics)',
      'Frankstar MetOcean telemetry buoy deployment & real-time telemetry configuration',
      'Wave, current, tide & meteorological data streaming & cloud analytics',
      'Seabed stratigraphic interpretation, gas hazard detection & bathymetric contouring',
      'Offshore acoustic positioning, rig moves & marine navigation support',
      'Marine search, sonar scanning & lost asset salvage recovery'
    ],
    equipment: [
      'Dual-Frequency Multi-Beam Echo Sounders (MBES)',
      'High-Resolution Sub-bottom Profilers (Chirp/Pinger)',
      'Side Scan Sonar Systems & Marine Magnetometers',
      'Acoustic Doppler Current Profilers (ADCP)',
      'Frankstar Oceanographic & MetOcean Telemetry Buoys',
      'Meteorological Observation Stations & Subsea Telemetry Loggers',
      'USBL Hydroacoustic Telemetry & Marine Positioning Sensors'
    ],
    partnerCallout: {
      title: 'Strategic MetOcean Technology Partnership',
      description: 'Through strategic technology partnership with Frankstar Technology, PIGL provides continuous marine intelligence, MetOcean telemetry buoys, wave/current profiling, and meteorological observation systems across Nigerian offshore waters.',
      partnerName: 'Frankstar Technology',
      website: 'https://www.frankstartech.com/'
    },
    relatedCapabilities: [
      { id: 'geo-data-intelligence', title: 'Geo Data Intelligence' },
      { id: 'engineering-industrial-environmental-solutions', title: 'Engineering, Industrial & Environmental Solutions' }
    ],
    relevantProjects: ['p2', 'p7']
  },

  // 04. ASSET INTEGRITY INTELLIGENCE
  'asset-integrity-intelligence': {
    id: 'asset-integrity-intelligence',
    longDescription: 'PIGL\'s Asset Integrity Intelligence platform provides end-to-end inspection, non-destructive testing (NDT), condition monitoring, and lifecycle maintenance for critical energy infrastructure. Our certified inspection engineers deploy advanced phased-array ultrasonic testing (PAUT), radiographic testing, magnetic particle testing, and ultrasonic wall-thickness profiling on processing vessels, pipelines, and storage tanks. We deliver acoustic emission structural health monitoring, corrosion rate analytics, subsea ROV video audits, and mechanical facility maintenance to extend asset operating lifecycles and ensure absolute structural reliability.',
    businessValue: 'Guarantees the pressure and structural containment of high-risk energy assets, eliminates unpredicted shutdowns, ensures full compliance with NUPRC and statutory safety regulations, and prevents costly environmental spill incidents through predictive defect detection.',
    whereWeOperate: ['Upstream Flow Stations', 'Offshore Platforms & FPSOs', 'Refineries & Gas Terminals', 'Cross-Country Pipelines', 'Storage Tank Farms'],
    gallery: SERVICE_GALLERY_PRESETS['asset-integrity-intelligence'],
    subServices: ASSET_INTEGRITY_SERVICES,
    methodology: [
      'Baseline integrity assessments & risk-based inspection (RBI) planning',
      'Advanced Non-Destructive Testing (PAUT, TOFD, MFL, radiographic examination)',
      'Ultrasonic precision wall-thickness measurement & corrosion rate calculation',
      'Acoustic emission sensing & dynamic structural deformation monitoring',
      'Subsea ROV video surveys & marine cathodic protection audits',
      'Mechanical facility maintenance, valve servicing & structural repairs',
      'Fitness-for-Service (FFS) engineering evaluations & digital inspection records'
    ],
    equipment: [
      'Phased Array Ultrasonic Testing (PAUT) & TOFD Flaw Detectors',
      'Magnetic Flux Leakage (MFL) Pipeline Corrosion Scanners',
      'Digital Radiography & Ultrasonic Precision Wall-Thickness Gauges',
      'Acoustic Emission Structural Health Monitoring Sensors',
      'Micro-ROV Subsea Inspection Systems with HD Cameras',
      'Hydrostatic High-Pressure Test Units & Calibration Manifolds'
    ],
    relatedCapabilities: [
      { id: 'digital-mapping-intelligence', title: 'Digital Mapping Intelligence' },
      { id: 'engineering-industrial-environmental-solutions', title: 'Engineering, Industrial & Environmental Solutions' }
    ],
    relevantProjects: ['p3', 'p4', 'p6']
  },

  // 05. ENGINEERING, INDUSTRIAL & ENVIRONMENTAL SOLUTIONS
  'engineering-industrial-environmental-solutions': {
    id: 'engineering-industrial-environmental-solutions',
    longDescription: 'This integrated platform combines PIGL\'s engineering design, produced water treatment, flow control automation, pipeline construction, heavy civil infrastructure, and specialized industrial field execution across Nigeria\'s demanding onshore, swamp, and offshore corridors. Through strategic technology alliance with CoaleXpert, we deliver high-efficiency produced water separation systems and wastewater treatment plants engineered for dispersed oil removal, filtration, and subsurface reinjection. In partnership with NPK Automation, we supply certified industrial valves (ball, gate, globe, butterfly, check) and automated actuators, backed by our dedicated valve overhaul, testing, and lifecycle maintenance services. Our field engineering teams execute API 1104 pipeline fabrication, swamp pipe laying, certified welding, heavy piling, access roads, and comprehensive environmental mitigation.',
    businessValue: 'Delivers turnkey infrastructure built to international API, ASME, and Eurocode standards while ensuring strict NUPRC/EGASPIN environmental discharge compliance. Combines specialized produced water separation, flow control automation, and robust field execution to guarantee uninterrupted plant operations.',
    whereWeOperate: ['Swamp Pipeline Right-of-Ways (ROW)', 'Upstream Flow Stations', 'Gas Terminals & Petrochemical Plants', 'Produced Water Reinjection Facilities', 'Industrial Greenfield Sites'],
    gallery: SERVICE_GALLERY_PRESETS['engineering-industrial-environmental-solutions'],
    subServices: ENGINEERING_SOLUTIONS_SERVICES,
    methodology: [
      'Produced water effluent chemical analysis & oil-in-water characterization',
      'CoaleXpert modular treatment skid deployment, coalescing filtration & oil separation',
      'Industrial wastewater treatment plant design, installation & water reuse conditioning',
      'Valve engineering specification, automated actuator sizing & calibration',
      'Dedicated valve overhaul, hydro-testing, seat leakage testing & lifecycle maintenance',
      'Pipeline ROW clearing, swamp trenching, pipe stringing & API 1104 certified welding',
      '100% radiographic weld inspection, hydrostatic pressure testing & pipeline lowering',
      'Site preparation, hydraulic piling, reinforced concrete works & access road construction',
      'Industrial environmental compliance monitoring, pollution mitigation & waste management'
    ],
    equipment: [
      'CoaleXpert Modular Coalescing & Dispersed Oil Separation Skids',
      'High-Efficiency Multi-Media & Micro-Filtration Units',
      'API/ASME Certified High-Pressure Valve Packages (Ball, Gate, Check, Control)',
      'Electric, Pneumatic & Hydraulic Heavy-Duty Actuators & Valve Test Benches',
      'Automated Pipeline Welding Stations & Pipe Bending Machines',
      'Amphibious Swamp Excavators ("Swamp Cats") & Sideboom Pipe Layers',
      'High-Pressure Hydrostatic Test Pumps & Pipeline Pigging Traps',
      'Hydraulic Piling Rigs & Soil Improvement Systems'
    ],
    partnerCallout: {
      title: 'Water & Flow Control Technology Alliances',
      description: 'Through strategic technology alliances with CoaleXpert (Advanced Produced-Water Treatment & Modular Systems) and NPK Automation (Flow Control Valves & Automated Packages), PIGL provides cutting-edge process separation and engineered flow-control solutions.',
      partnerName: 'CoaleXpert & NPK Automation',
      website: 'https://coalexpert.pro/'
    },
    relatedCapabilities: [
      { id: 'marine-intelligence', title: 'Marine Intelligence' },
      { id: 'asset-integrity-intelligence', title: 'Asset Integrity Intelligence' }
    ],
    relevantProjects: ['p1', 'p2', 'p5', 'p6']
  }
};

// Aliases for legacy routing and sub-solution backward compatibility
SERVICE_DETAILS_MAP['ground-intelligence'] = SERVICE_DETAILS_MAP['geo-data-intelligence'];
SERVICE_DETAILS_MAP['digital-intelligence'] = SERVICE_DETAILS_MAP['digital-mapping-intelligence'];
SERVICE_DETAILS_MAP['offshore-intelligence'] = SERVICE_DETAILS_MAP['marine-intelligence'];
SERVICE_DETAILS_MAP['integrated-engineering-construction'] = SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'];
SERVICE_DETAILS_MAP['industrial-environmental-technologies'] = SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'];

SERVICE_DETAILS_MAP['reality-capture'] = SERVICE_DETAILS_MAP['digital-mapping-intelligence'];
SERVICE_DETAILS_MAP['3d-laser-scanning'] = SERVICE_DETAILS_MAP['digital-mapping-intelligence'];
SERVICE_DETAILS_MAP['digital-twins'] = SERVICE_DETAILS_MAP['digital-mapping-intelligence'];
SERVICE_DETAILS_MAP['geomatics-services'] = SERVICE_DETAILS_MAP['digital-mapping-intelligence'];
SERVICE_DETAILS_MAP['spatial-intelligence'] = SERVICE_DETAILS_MAP['digital-mapping-intelligence'];
SERVICE_DETAILS_MAP['geomatics'] = SERVICE_DETAILS_MAP['digital-mapping-intelligence'];

SERVICE_DETAILS_MAP['geophysical-surveys'] = SERVICE_DETAILS_MAP['marine-intelligence'];
SERVICE_DETAILS_MAP['climate-environmental-metocean'] = SERVICE_DETAILS_MAP['marine-intelligence'];
SERVICE_DETAILS_MAP['metocean'] = SERVICE_DETAILS_MAP['marine-intelligence'];
SERVICE_DETAILS_MAP['continuous-marine-intelligence'] = SERVICE_DETAILS_MAP['marine-intelligence'];
SERVICE_DETAILS_MAP['hydrographic-survey'] = SERVICE_DETAILS_MAP['marine-intelligence'];
SERVICE_DETAILS_MAP['seabed-mapping'] = SERVICE_DETAILS_MAP['marine-intelligence'];
SERVICE_DETAILS_MAP['search-and-salvage'] = SERVICE_DETAILS_MAP['marine-intelligence'];
SERVICE_DETAILS_MAP['environmental-survey'] = SERVICE_DETAILS_MAP['marine-intelligence'];

SERVICE_DETAILS_MAP['geotechnical-services'] = SERVICE_DETAILS_MAP['geo-data-intelligence'];
SERVICE_DETAILS_MAP['onshore-nearshore-geotechnical'] = SERVICE_DETAILS_MAP['geo-data-intelligence'];
SERVICE_DETAILS_MAP['seismic-services'] = SERVICE_DETAILS_MAP['geo-data-intelligence'];
SERVICE_DETAILS_MAP['geotechnical-sampling'] = SERVICE_DETAILS_MAP['geo-data-intelligence'];
SERVICE_DETAILS_MAP['geotechnical-investigation'] = SERVICE_DETAILS_MAP['geo-data-intelligence'];

SERVICE_DETAILS_MAP['asset-integrity-management'] = SERVICE_DETAILS_MAP['asset-integrity-intelligence'];
SERVICE_DETAILS_MAP['asset-integrity-services'] = SERVICE_DETAILS_MAP['asset-integrity-intelligence'];
SERVICE_DETAILS_MAP['asset-integrity'] = SERVICE_DETAILS_MAP['asset-integrity-intelligence'];
SERVICE_DETAILS_MAP['facility-maintenance'] = SERVICE_DETAILS_MAP['asset-integrity-intelligence'];
SERVICE_DETAILS_MAP['asset-management'] = SERVICE_DETAILS_MAP['asset-integrity-intelligence'];
SERVICE_DETAILS_MAP['asset-inspection'] = SERVICE_DETAILS_MAP['asset-integrity-intelligence'];
SERVICE_DETAILS_MAP['rov-inspection'] = SERVICE_DETAILS_MAP['asset-integrity-intelligence'];
SERVICE_DETAILS_MAP['ndt-inspection'] = SERVICE_DETAILS_MAP['asset-integrity-intelligence'];

SERVICE_DETAILS_MAP['infrastructure-construction'] = SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'];
SERVICE_DETAILS_MAP['pipeline-construction'] = SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'];
SERVICE_DETAILS_MAP['civil-works'] = SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'];
SERVICE_DETAILS_MAP['field-operations'] = SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'];
SERVICE_DETAILS_MAP['oilfield-services'] = SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'];
SERVICE_DETAILS_MAP['water-environmental-solutions'] = SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'];
SERVICE_DETAILS_MAP['engineering-procurement'] = SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'];
SERVICE_DETAILS_MAP['produced-water-treatment'] = SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'];
SERVICE_DETAILS_MAP['industrial-water-treatment'] = SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'];
SERVICE_DETAILS_MAP['water-treatment-plants'] = SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'];
SERVICE_DETAILS_MAP['valves-and-actuators'] = SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'];
SERVICE_DETAILS_MAP['flow-control-and-automation'] = SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'];
SERVICE_DETAILS_MAP['integrated-valve-maintenance'] = SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'];

