import { SubService } from '../types';
import {
  GES_SERVICE_FAMILIES,
  MMS_SERVICE_FAMILIES,
  ICS_SERVICE_FAMILIES,
  IS_SERVICE_FAMILIES,
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
  engineeringProblemAddressed?: string;
  standards?: string[];
  keyDeliverables?: string[];
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
  // DIVISION 01: GeoSolutions & Engineering Services (GES)
  'geosolutions-engineering-services': [
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
      url: '/assets/operations/pigl_geomatics_survey_quay.jpg',
      title: 'Quayside Geomatics & Engineering Positioning',
      caption: 'Geodetic survey network tie-in, high-precision boundary demarcation, and engineering navigation control.'
    },
    {
      url: '/assets/operations/pigl_3d_reality_capture_jetty_plant.jpg',
      title: '3D Reality Capture & Digital Engineering',
      caption: 'High-density terrestrial laser scanning and Scan-to-BIM modeling of process facilities and pipeline manifolds.'
    },
    {
      url: '/assets/seismic_survey.png',
      title: 'Geohazard, Geoscan & Seismic Investigation',
      caption: 'HR2D/UHR2D seismic data acquisition, shallow gas detection, and subsurface geohazard evaluation.'
    }
  ],

  // DIVISION 02: Metocean & Marine Solutions (MMS)
  'metocean-marine-solutions': [
    {
      url: '/assets/marine_intel_metocean.jpg',
      title: 'Offshore MetOcean Observation & Telemetry',
      caption: 'Continuous oceanographic monitoring in partnership with Frankstar Technology deploying telemetry buoys and current profilers.'
    },
    {
      url: '/assets/operations/pigl_marine_crew_vessel.jpg',
      title: 'Dedicated Marine Survey Support Craft',
      caption: 'PIGL marine operations vessel configured for environmental sampling, oceanographic sensor deployment, and water quality telemetry.'
    },
    {
      url: '/assets/operations/pigl_offshore_winch_pigl_container.jpg',
      title: 'Survey Deck Winch & Instrumented Laboratory',
      caption: 'Mobilization of deck handling equipment and specialized offshore instrumentation laboratory for marine environmental monitoring.'
    },
    {
      url: '/assets/field_operations_marine.jpg',
      title: 'Marine Environmental Field Sampling',
      caption: 'Water column physicochemical profiling, sediment sampling, and marine benthic habitat characterisation.'
    },
    {
      url: '/assets/new-ocean.png',
      title: 'Real-Time Ocean Dynamics & Forecasting',
      caption: 'Deployment of wave models, current modeling, and weather window forecasting for offshore operational safety.'
    },
    {
      url: '/assets/new-barge.png',
      title: 'Nearshore MetOcean Sensor Spread',
      caption: 'Deploying Acoustic Doppler Current Profilers (ADCP) and tidal monitoring stations across delta estuaries.'
    }
  ],

  // DIVISION 03: Integrated Construction Services (ICS)
  'integrated-construction-services': [
    {
      url: '/assets/operations/pigl_pipeline_construction_swamp_cat.jpg',
      title: 'Pipeline Construction in Swamp Terrain',
      caption: 'Amphibious swamp-cat excavation, trenching, and pipeline stringing across challenging wetland corridors.'
    },
    {
      url: '/assets/newpipeline.png',
      title: 'Welded Pipeline Section Lowering & Tie-Ins',
      caption: 'API 1104 standard welded pipeline installation, tie-ins, and hydrostatic testing for oil and gas flowlines.'
    },
    {
      url: '/assets/operations/pigl_pipeline_marine_welding.jpg',
      title: 'Mechanical Fabrication & Certified Welding',
      caption: 'Structural steel fabrication, process piping installation, and non-destructive examination (NDE).'
    },
    {
      url: '/assets/access-road.jpg',
      title: 'Civil & Infrastructure Construction',
      caption: 'Earthworks, foundation construction, access roads, and drainage supporting industrial and energy facilities.'
    },
    {
      url: '/assets/IMG_6558.jpg',
      title: 'Testing, Pre-Commissioning & Quality Assurance',
      caption: 'Rigorous hydrostatic pressure testing, pipeline caliper pigging, and pre-commissioning verification.'
    },
    {
      url: '/assets/operations/pigl_logistics_base_aerial.jpg',
      title: 'PIGL Operations Base & Fabrication Yard',
      caption: 'Integrated Port Harcourt facility providing equipment coordination, fabrication staging, and project delivery support.'
    }
  ],

  // DIVISION 04: Industrial Solutions (IS)
  'industrial-solutions': [
    {
      url: '/assets/water_treatment_skid.jpg',
      title: 'Produced Water Treatment & Oil Separation Skid',
      caption: 'Modular produced water treatment skids deployed with CoaleXpert for oil-water separation and subsurface reinjection.'
    },
    {
      url: '/assets/drilling.png',
      title: 'Industrial & Domestic Water Supply Borehole',
      caption: 'Deep hydrogeological borehole drilling, water abstraction, and water supply engineering for industrial sites.'
    },
    {
      url: '/assets/asset_integrity_ndt.jpg',
      title: 'Water & Environmental Laboratory Analysis',
      caption: 'Rigorous laboratory testing for water quality, oil-in-water concentration, metals, and chemical parameters.'
    },
    {
      url: '/assets/new-capture.png',
      title: 'Industrial Process Water & RO Systems',
      caption: 'Engineered reverse osmosis (RO) systems and treatment packages for domestic and industrial water requirements.'
    },
    {
      url: '/assets/cabin.png',
      title: 'Wastewater Treatment & Resource Recovery',
      caption: 'Effluent treatment plants, filtration skids, and water recycling packages supporting industrial environmental compliance.'
    },
    {
      url: '/assets/engineering_procure_flanges.jpg',
      title: 'Process Equipment & Skids Fabrication',
      caption: 'Turnkey industrial equipment assembly, treatment skids, and lifecycle operations and maintenance support.'
    }
  ]
};

// Aliases for gallery presets
SERVICE_GALLERY_PRESETS['ges'] = SERVICE_GALLERY_PRESETS['geosolutions-engineering-services'];
SERVICE_GALLERY_PRESETS['mms'] = SERVICE_GALLERY_PRESETS['metocean-marine-solutions'];
SERVICE_GALLERY_PRESETS['ics'] = SERVICE_GALLERY_PRESETS['integrated-construction-services'];
SERVICE_GALLERY_PRESETS['is'] = SERVICE_GALLERY_PRESETS['industrial-solutions'];

SERVICE_GALLERY_PRESETS['geo-data-intelligence'] = SERVICE_GALLERY_PRESETS['geosolutions-engineering-services'];
SERVICE_GALLERY_PRESETS['ground-intelligence'] = SERVICE_GALLERY_PRESETS['geosolutions-engineering-services'];
SERVICE_GALLERY_PRESETS['digital-mapping-intelligence'] = SERVICE_GALLERY_PRESETS['geosolutions-engineering-services'];
SERVICE_GALLERY_PRESETS['digital-intelligence'] = SERVICE_GALLERY_PRESETS['geosolutions-engineering-services'];
SERVICE_GALLERY_PRESETS['marine-intelligence'] = SERVICE_GALLERY_PRESETS['metocean-marine-solutions'];
SERVICE_GALLERY_PRESETS['offshore-intelligence'] = SERVICE_GALLERY_PRESETS['metocean-marine-solutions'];
SERVICE_GALLERY_PRESETS['asset-integrity-intelligence'] = SERVICE_GALLERY_PRESETS['integrated-construction-services'];
SERVICE_GALLERY_PRESETS['asset-integrity'] = SERVICE_GALLERY_PRESETS['integrated-construction-services'];
SERVICE_GALLERY_PRESETS['engineering-industrial-environmental-solutions'] = SERVICE_GALLERY_PRESETS['industrial-solutions'];
SERVICE_GALLERY_PRESETS['integrated-engineering-construction'] = SERVICE_GALLERY_PRESETS['integrated-construction-services'];
SERVICE_GALLERY_PRESETS['industrial-environmental-technologies'] = SERVICE_GALLERY_PRESETS['industrial-solutions'];

export const SERVICE_DETAILS_MAP: Record<string, ServiceDetail> = {
  // DIVISION 01: GEOSOLUTIONS & ENGINEERING SERVICES (GES)
  'geosolutions-engineering-services': {
    id: 'geosolutions-engineering-services',
    engineeringProblemAddressed: "Inadequate ground characterisation, uncharted seabed geohazards, structural foundation settlement, and brownfield spatial clashes directly cause costly piling redesigns, pipeline touchdown failures, and prolonged construction delays across complex Nigerian deltaic and marine terrains.",
    longDescription: "Polaris Integrated & GeoSolutions Limited (PIGL) delivers multidisciplinary site investigation, geophysics, hydrography, 20-ton piezocone penetration testing (CPTu), precise positioning, terrestrial 3D laser scanning (Scan-to-BIM), and accredited materials laboratory testing. Operating across onshore, nearshore, swamp, and deepwater corridors throughout Nigeria and the Gulf of Guinea, we provide verified subsurface and spatial intelligence to support engineering design, statutory regulatory approvals, and field execution.",
    businessValue: "Quantifies subsurface geohazards prior to foundation commitment, optimises deep foundation and piling design depths, eliminates brownfield clash rework through dimensional control, and establishes regulatory compliance across critical infrastructure.",
    standards: [
      'BS 5930 / Eurocode 7 (BS EN 1997) — Geotechnical Investigation & Testing',
      'ASTM D5778 — Standard Test Method for Electronic Friction Cone & Piezocone (CPTu)',
      'IHO S-44 (Special Order / Order 1a) — Standards for Hydrographic Surveys',
      'IMCA S 015 / S 019 — Offshore Hydrographic & Geophysical Survey Guidelines',
      'NUPRC Nigerian Upstream Petroleum Survey & Engineering Regulations',
      'ISO 9001:2015 & ISO 45001:2018 Quality & Safety Standards'
    ],
    keyDeliverables: [
      'Factual & Interpretative Geotechnical Engineering Reports (FGR/GIR)',
      'Continuous digital CPTu soil stratigraphy profiles (.GEF & .AGS4 format)',
      'Multibeam bathymetric bathy-grids, side-scan sonar mosaics & sub-bottom profiles',
      'Certified geodetic control networks & surface/subsea positioning logs',
      'Registered terrestrial 3D laser scan point clouds, as-built CAD & BIM models',
      'Certified laboratory soil mechanics & rock strength test certificates'
    ],
    whereWeOperate: [
      'Swamp Basins & Deltaic Wetlands',
      'Nearshore & Coastal Landfall Corridors',
      'Onshore Industrial Plants & Flowstations',
      'Deepwater Marine Infrastructure Corridors',
      'Pipeline Right-of-Ways (ROW) & Creek Crossings',
      'Port Facilities, Quaysides & Offshore Terminals'
    ],
    gallery: SERVICE_GALLERY_PRESETS['geosolutions-engineering-services'],
    video_url: '/assets/videos/ground_intelligence.mp4',
    subServices: GES_SERVICE_FAMILIES,
    methodology: [
      'High-resolution 2D/UHR seismic profiling & shallow gas geohazard detection',
      'Dual-frequency multibeam bathymetry, side-scan sonar & sub-bottom profiling',
      'Continuous hydraulic 20-ton piezocone penetration testing (CPTu) profiling',
      'Deep rotary soil boring, standard penetration testing (SPT) & undisturbed core sampling',
      'High-precision DGNSS surface positioning, subsea acoustic tracking (USBL/LBL) & rig moves',
      'High-speed terrestrial 3D laser scanning (Scan-to-BIM) & dimensional metrology',
      'Accredited laboratory triaxial shear, consolidation oedometer & materials testing'
    ],
    equipment: [
      '20-Ton Heavy-Duty Hydraulic Piezocone (CPTu) Track & Pontoon Systems',
      'Modular Pontoon Drilling Barges & Deep Rotary Soil Boring Spreads',
      'Dual-Frequency Multibeam Echo Sounders & Digital Dual-Frequency Side-Scan Sonar',
      'High-Resolution Sub-Bottom Profilers (Chirp & Boomer Acoustic Systems)',
      'Leica RTC360 & P50 High-Speed Terrestrial 3D Laser Scanners',
      'Trimble & Leica Dual-Frequency RTK-GNSS Geodetic Systems',
      'Automated Triaxial Shear, Direct Shear & Consolidation Oedometer Test Benches'
    ],
    relatedCapabilities: [
      { id: 'metocean-marine-solutions', title: 'Metocean & Marine Solutions' },
      { id: 'integrated-construction-services', title: 'Integrated Construction Services' }
    ],
    relevantProjects: ['p1', 'p3', 'p4', 'p6', 'p8']
  },

  // DIVISION 02: METOCEAN & MARINE SOLUTIONS (MMS)
  'metocean-marine-solutions': {
    id: 'metocean-marine-solutions',
    engineeringProblemAddressed: "Unpredicted offshore squalls, extreme ocean swell dynamics, strong estuarine tidal currents, and unquantified hydrodynamic loadings threaten marine construction safety, vessel operability, and offshore structural integrity across the Gulf of Guinea.",
    longDescription: "Metocean & Marine Solutions (MMS) delivers dedicated oceanographic data acquisition, metocean observation, real-time wave and current profiling, coastal hydrodynamic numerical modelling, marine meteorological forecasting, and offshore environmental baseline surveys. Deployed in technical partnership with Frankstar Technology, our marine spreads capture verified oceanographic parameters essential for offshore design, vessel operability planning, and marine safety.",
    businessValue: "Reduces vessel standby downtime, establishes calibrated 10/50/100-year structural design criteria, prevents weather-related offshore incidents, and satisfies NUPRC and international environmental compliance mandates.",
    standards: [
      'ISO 19901-1 — Metocean Design & Operating Considerations for Offshore Structures',
      'WMO No. 8 — Guide to Meteorological Instruments & Methods of Observation',
      'IMCA C 018 — Guidance on the Use of Real-Time Metocean Systems in Offshore Operations',
      'NUPRC Environmental Guidelines & Standards for the Petroleum Industry (EGASPIN)',
      'FMEnv Environmental Impact Assessment (EIA) Procedural Guidelines'
    ],
    keyDeliverables: [
      'Certified 10/50/100-Year Metocean Design Criteria Reports',
      'Continuous Acoustic Doppler Current Profiler (ADCP) velocity dossiers',
      'Directional wave spectrum analysis & real-time telemetry feeds',
      'Tidal harmonic constituent tables & hydrodynamic circulation models',
      'Marine environmental baseline survey dossiers (benthic, water column, sediments)',
      'Operational weather-window forecasts & marine warranty advisory reports'
    ],
    whereWeOperate: [
      'Gulf of Guinea Deepwater & Shelf Corridors',
      'Offshore Production Platforms & FPSO Mooring Spreads',
      'Coastal Terminals, Single Point Moorings (SPM) & Tanker Jetties',
      'Nearshore Pipeline Landfalls & Estuarine Channels',
      'Dredging Channels & Marine Approach Corridors'
    ],
    gallery: SERVICE_GALLERY_PRESETS['metocean-marine-solutions'],
    subServices: MMS_SERVICE_FAMILIES,
    methodology: [
      'Directional wave buoy deployment, taut-line mooring & satellite telemetry integration',
      'Continuous bottom-mounted & vessel-mounted ADCP current profile acquisition',
      'High-resolution hydrodynamic numerical modelling & operational window forecasting',
      'Offshore environmental baseline sampling (benthic grab, water column CTD profiling)',
      'Metocean design criteria derivation, joint-probability & extreme value analysis',
      'Marine decision support for rig towing, pipelay barges, and heavy lift operations'
    ],
    equipment: [
      'Frankstar Oceanographic Telemetry Buoys & Directional Wave Sensors',
      'Teledyne RD Instruments Acoustic Doppler Current Profilers (ADCP - 300kHz & 600kHz)',
      'Subsea Acoustic Wave & Tide Gauges with Hydroacoustic Modem Recovery',
      'Automated Marine Meteorological Weather Stations & Ultrasonic Anemometers',
      'Niskin Water Column Samplers, Van Veen Sediment Grabs & Multi-Parameter CTD Probes',
      'Iridium Satellite & Cellular Real-Time Oceanographic Telemetry Modems'
    ],
    partnerCallout: {
      title: 'Strategic MetOcean Technology Partnership',
      description: 'Through our strategic alliance with Frankstar Technology, PIGL deploys calibrated oceanographic weather buoys, directional wave sensors, ADCP current profiling spreads, and real-time meteorological intelligence across Nigerian waters.',
      partnerName: 'Frankstar Technology',
      website: 'https://www.frankstartech.com/'
    },
    relatedCapabilities: [
      { id: 'geosolutions-engineering-services', title: 'GeoSolutions & Engineering Services' },
      { id: 'industrial-solutions', title: 'Industrial Solutions' }
    ],
    relevantProjects: ['p2', 'p7']
  },

  // DIVISION 03: INTEGRATED CONSTRUCTION SERVICES (ICS)
  'integrated-construction-services': {
    id: 'integrated-construction-services',
    engineeringProblemAddressed: "Complex swamp and tidal wetland terrain, corrosive soil chemistry, seasonal flooding, and difficult logistics frequently cause pipeline installation delays, joint weld defects, foundation washout, and prolonged downtime across energy transit corridors.",
    longDescription: "Integrated Construction Services (ICS) is PIGL's engineering delivery arm for oil and gas pipelines, heavy civil infrastructure, mechanical fabrication, and pre-commissioning execution. Operating across onshore, swamp, and coastal corridors, our teams execute API 1104 standard pipeline installation, swamp trenching, field joint coating, river crossings, reinforced concrete foundations, structural steel erection, and pre-commissioning testing to statutory NUPRC standards.",
    businessValue: "Bridges engineering design with field construction execution. Guarantees weld integrity and hydrostatic test compliance, eliminates field rework through geodetic alignment, and achieves structured handover to API, ASME, and NUPRC codes.",
    standards: [
      'API 1104 — Welding of Pipelines & Related Facilities',
      'ASME B31.4 / ASME B31.8 — Liquid & Gas Pipeline Transportation Systems',
      'BS 8010 / ISO 13623 — Petroleum & Natural Gas Pipeline Transportation Systems',
      'BS EN 1992 (Eurocode 2) / BS 8110 — Structural Concrete Design & Construction',
      'NUPRC Pipeline Construction & Hydrotesting Guidelines',
      'ASNT / ISO 9712 — Non-Destructive Examination (NDE) Certification'
    ],
    keyDeliverables: [
      'Certified pipeline as-built alignment sheets & geodetic route profile charts',
      'Certified hydrostatic pressure test charts & deadweight calibration records',
      'Non-destructive examination (NDE) radiographic and ultrasonic inspection dossiers',
      'Civil foundation structural calculations, concrete cube test certificates & compaction logs',
      'Mechanical piping spool fabrication isometric drawings & weld map registers',
      'Pre-commissioning cleaning, caliper pigging & nitrogen purging handover dossiers'
    ],
    whereWeOperate: [
      'Swamp Pipeline Right-of-Ways (ROW) & Wetland Corridors',
      'Onshore Flowstations, Gas Plants & Metering Stations',
      'Industrial Facility Compounds, Access Roads & Creek Crossings',
      'Energy Processing Facilities, Tank Farms & Coastal Terminals',
      'PIGL Port Harcourt Logistics Base & Fabrication Staging Yards'
    ],
    gallery: SERVICE_GALLERY_PRESETS['integrated-construction-services'],
    subServices: ICS_SERVICE_FAMILIES,
    methodology: [
      'Right-of-way (ROW) clearance, swamp-cat excavation, trenching & pipe stringing',
      'API 1104 certified multi-process welding, tie-ins & non-destructive examination (NDE)',
      'Field joint coating, holiday detection & pipeline lowering-in across wet/dry terrain',
      'Hydrostatic pressure testing, caliper cleaning pigging & dewatering campaigns',
      'Heavy civil earthworks, piling caps, reinforced concrete bunds & access road stabilization',
      'Structural steel fabrication, process piping spool installation & equipment alignment',
      'End-to-end project coordination: procurement support, pre-commissioning & statutory handover'
    ],
    equipment: [
      'Amphibious Swamp Excavators ("Swamp Cats") & Dredging Plants',
      'Sideboom Heavy Pipe Layers & Hydraulic Field Pipe Bending Spreads',
      'Certified Multi-Process Diesel Welding Spreads & Field Radiography Sets',
      'High-Pressure Hydrostatic Test Pumps, Deadweight Testers & Chart Recorders',
      'Heavy Earthmoving Fleet (Bulldozers, Motor Graders, Vibratory Rollers)',
      'Laser Geodetic Alignment Spreads & Certified Rigging Hardware'
    ],
    relatedCapabilities: [
      { id: 'geosolutions-engineering-services', title: 'GeoSolutions & Engineering Services' },
      { id: 'industrial-solutions', title: 'Industrial Solutions' }
    ],
    relevantProjects: ['p1', 'p4', 'p5', 'p6']
  },

  // DIVISION 04: INDUSTRIAL SOLUTIONS (IS)
  'industrial-solutions': {
    id: 'industrial-solutions',
    engineeringProblemAddressed: "High oil-in-water (OIW) concentrations in produced water, mineral scaling, strict regulatory discharge penalties, and contaminated water supplies threaten operating licences, disposal well life, and environmental compliance across energy and industrial operations.",
    longDescription: "Industrial Solutions (IS) is PIGL's division for engineered water treatment, separation technology, and environmental laboratory services. In strategic technical partnership with CoaleXpert, PIGL delivers modular produced water treatment systems, coalescing oil-water separation skids, and nutshell filtration units conditioning effluent for subsurface reinjection or compliant discharge. We also engineer industrial reverse osmosis (RO) desalination plants, deep hydrogeological boreholes, effluent treatment plants (ETP), and operate an accredited analytical water laboratory.",
    businessValue: "Guarantees compliance with NUPRC EGASPIN and FMEnv environmental discharge limits, protects disposal wells against formation plugging, provides reliable potable and process water supplies, and supports water resource recovery.",
    standards: [
      'NUPRC Environmental Guidelines & Standards for Petroleum (EGASPIN)',
      'FMEnv National Guidelines for Water Quality & Industrial Effluents',
      'APHA / AWWA Standard Methods for the Examination of Water & Wastewater',
      'ASTM D3921 / ISO 9377-2 — Determination of Oil & Grease / Hydrocarbons in Water',
      'WHO Guidelines for Drinking-Water Quality / NIS 554 Nigerian Potable Standards',
      'ASME Section VIII / B31.3 — Pressure Vessels & Process Piping Construction'
    ],
    keyDeliverables: [
      'Certified water quality analysis reports (oil-in-water, heavy metals, microbiology)',
      'Produced water treatment skid process flow diagrams (PFD) & P&IDs',
      'Statutory environmental discharge compliance monitoring records',
      'Water borehole geophysical wireline logs & 72-hour pumping test dossiers',
      'Reverse osmosis (RO) system commissioning & water conductivity logs',
      'Turnkey equipment operating manuals & preventive maintenance schedules'
    ],
    whereWeOperate: [
      'Upstream Oil & Gas Flowstations & Gathering Centers',
      'Produced Water Disposal & Injection Facilities',
      'Refineries, Petrochemical & Gas Processing Terminals',
      'Industrial Manufacturing Facilities & Power Plants',
      'Remote Operating Bases, Exploration Camps & Communities'
    ],
    gallery: SERVICE_GALLERY_PRESETS['industrial-solutions'],
    subServices: IS_SERVICE_FAMILIES,
    methodology: [
      'Produced water characterisation & oil-in-water concentration profiling',
      'CoaleXpert modular coalescing separation, hydrocyclone & nutshell filtration deployment',
      'Industrial process water & potable reverse osmosis (RO) plant engineering',
      'Deep hydrogeological borehole drilling, wireline logging & 72-hour step-drawdown pumping',
      'Water & environmental laboratory analytics (oil-in-water, metals, microbiology, COD/BOD)',
      'Effluent treatment plant (ETP) design, automated chemical dosing & commissioning',
      'Lifecycle operations support, media regeneration & preventive maintenance'
    ],
    equipment: [
      'CoaleXpert Modular Coalescing Oil-Water Separation Skids (1,000–50,000 bwpd)',
      'High-Efficiency Micro-Filtration, Multi-Media & Nut-Shell Filter Units',
      'Industrial Reverse Osmosis (RO) Desalination & Demineralisation Skids',
      'Laboratory Spectrophotometers, Oil-in-Water Infrared Analyzers & Gas Chromatographs',
      'Atomic Absorption Spectrometers (AAS) & Microbiological Incubation Chambers',
      'Automated Chemical Dosing, Flocculation & pH Neutralisation Packages'
    ],
    partnerCallout: {
      title: 'Produced Water & Separation Technology Partnership',
      description: 'Through our strategic alliance with CoaleXpert, PIGL delivers engineered produced water treatment systems, modular coalescing oil-water separation skids, and advanced industrial filtration modules across Nigerian energy corridors.',
      partnerName: 'CoaleXpert',
      website: 'https://coalexpert.pro/'
    },
    relatedCapabilities: [
      { id: 'geosolutions-engineering-services', title: 'GeoSolutions & Engineering Services' },
      { id: 'integrated-construction-services', title: 'Integrated Construction Services' }
    ],
    relevantProjects: ['p2', 'p5', 'p7']
  }
};

// Aliases for legacy routing and shorthand backward compatibility
SERVICE_DETAILS_MAP['ges'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['mms'] = SERVICE_DETAILS_MAP['metocean-marine-solutions'];
SERVICE_DETAILS_MAP['ics'] = SERVICE_DETAILS_MAP['integrated-construction-services'];
SERVICE_DETAILS_MAP['is'] = SERVICE_DETAILS_MAP['industrial-solutions'];

// Backward compatibility: Geo Data & Digital Mapping -> GES
SERVICE_DETAILS_MAP['geo-data-intelligence'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['ground-intelligence'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['digital-mapping-intelligence'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['digital-intelligence'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['reality-capture'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['3d-laser-scanning'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['digital-twins'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['geomatics-services'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['spatial-intelligence'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['geomatics'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['topographic-mapping'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['geotechnical-services'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['onshore-nearshore-geotechnical'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['seismic-services'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['geotechnical-sampling'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['geotechnical-investigation'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['cpt-testing'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['geophysical-surveys'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['hydrographic-survey'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];
SERVICE_DETAILS_MAP['seabed-mapping'] = SERVICE_DETAILS_MAP['geosolutions-engineering-services'];

// Backward compatibility: Marine & Offshore -> MMS
SERVICE_DETAILS_MAP['marine-intelligence'] = SERVICE_DETAILS_MAP['metocean-marine-solutions'];
SERVICE_DETAILS_MAP['offshore-intelligence'] = SERVICE_DETAILS_MAP['metocean-marine-solutions'];
SERVICE_DETAILS_MAP['continuous-marine-intelligence'] = SERVICE_DETAILS_MAP['metocean-marine-solutions'];
SERVICE_DETAILS_MAP['climate-environmental-metocean'] = SERVICE_DETAILS_MAP['metocean-marine-solutions'];
SERVICE_DETAILS_MAP['metocean'] = SERVICE_DETAILS_MAP['metocean-marine-solutions'];
SERVICE_DETAILS_MAP['environmental-survey'] = SERVICE_DETAILS_MAP['metocean-marine-solutions'];
SERVICE_DETAILS_MAP['search-and-salvage'] = SERVICE_DETAILS_MAP['metocean-marine-solutions'];

// Backward compatibility: Construction & Asset Integrity -> ICS
SERVICE_DETAILS_MAP['integrated-engineering-construction'] = SERVICE_DETAILS_MAP['integrated-construction-services'];
SERVICE_DETAILS_MAP['pipeline-construction'] = SERVICE_DETAILS_MAP['integrated-construction-services'];
SERVICE_DETAILS_MAP['infrastructure-construction'] = SERVICE_DETAILS_MAP['integrated-construction-services'];
SERVICE_DETAILS_MAP['civil-works'] = SERVICE_DETAILS_MAP['integrated-construction-services'];
SERVICE_DETAILS_MAP['asset-integrity-intelligence'] = SERVICE_DETAILS_MAP['integrated-construction-services'];
SERVICE_DETAILS_MAP['asset-integrity-management'] = SERVICE_DETAILS_MAP['integrated-construction-services'];
SERVICE_DETAILS_MAP['asset-integrity-services'] = SERVICE_DETAILS_MAP['integrated-construction-services'];
SERVICE_DETAILS_MAP['asset-integrity'] = SERVICE_DETAILS_MAP['integrated-construction-services'];
SERVICE_DETAILS_MAP['facility-maintenance'] = SERVICE_DETAILS_MAP['integrated-construction-services'];
SERVICE_DETAILS_MAP['asset-management'] = SERVICE_DETAILS_MAP['integrated-construction-services'];
SERVICE_DETAILS_MAP['asset-inspection'] = SERVICE_DETAILS_MAP['integrated-construction-services'];
SERVICE_DETAILS_MAP['rov-inspection'] = SERVICE_DETAILS_MAP['integrated-construction-services'];
SERVICE_DETAILS_MAP['ndt-inspection'] = SERVICE_DETAILS_MAP['integrated-construction-services'];
SERVICE_DETAILS_MAP['field-operations'] = SERVICE_DETAILS_MAP['integrated-construction-services'];
SERVICE_DETAILS_MAP['oilfield-services'] = SERVICE_DETAILS_MAP['integrated-construction-services'];

// Backward compatibility: Industrial Solutions & Water -> IS
SERVICE_DETAILS_MAP['industrial-environmental-technologies'] = SERVICE_DETAILS_MAP['industrial-solutions'];
SERVICE_DETAILS_MAP['engineering-industrial-environmental-solutions'] = SERVICE_DETAILS_MAP['industrial-solutions'];
SERVICE_DETAILS_MAP['water-environmental-solutions'] = SERVICE_DETAILS_MAP['industrial-solutions'];
SERVICE_DETAILS_MAP['engineering-procurement'] = SERVICE_DETAILS_MAP['industrial-solutions'];
SERVICE_DETAILS_MAP['produced-water-treatment'] = SERVICE_DETAILS_MAP['industrial-solutions'];
SERVICE_DETAILS_MAP['industrial-water-treatment'] = SERVICE_DETAILS_MAP['industrial-solutions'];
SERVICE_DETAILS_MAP['water-treatment-plants'] = SERVICE_DETAILS_MAP['industrial-solutions'];
SERVICE_DETAILS_MAP['valves-and-actuators'] = SERVICE_DETAILS_MAP['industrial-solutions'];
SERVICE_DETAILS_MAP['flow-control-and-automation'] = SERVICE_DETAILS_MAP['industrial-solutions'];
SERVICE_DETAILS_MAP['integrated-valve-maintenance'] = SERVICE_DETAILS_MAP['industrial-solutions'];

