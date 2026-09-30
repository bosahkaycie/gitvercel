import { ServiceDeliverableItem } from '../types';

/**
 * Master Canonical Engineering Knowledge Base for Service Deliverables & Focal Points
 * Contains rich, authentic engineering specifications, output documents, and regulatory standards.
 */
export const MASTER_SERVICE_DELIVERABLES: Record<string, Record<string, ServiceDeliverableItem>> = {
  // 1. Ground Intelligence
  'ground-intelligence': {
    'seismic-services': {
      title: 'Seismic Services (2D/3D digital seismic surveys, node deployment & harvesting)',
      description: 'Comprehensive 2D and 3D digital seismic acquisition, ocean-bottom node (OBN) deployment, cable handling, and high-fidelity seismic data harvesting. We characterize deep geological horizons, delineate subsurface faults, map velocity models, and deliver baseline structural data crucial for field development planning and offshore foundation engineering.',
      deliverablesOutput: 'Processed SEG-Y seismic volumes, digital depth/time structural maps, velocity models, and geophysical survey interpretation reports.',
      standards: 'NUPRC Survey Guidelines, IAGC Geophysical Safety Standards, ISO 19901-8'
    },
    'seabed-mapping': {
      title: 'Seabed Mapping & Sub-Seabed Geophysical Surveys',
      description: 'Multi-sensor marine geophysical investigations utilizing dual-frequency side-scan sonar, sub-bottom profilers (Chirp/Boomer), and multi-beam echo sounders. We identify seabed morphology, shallow gas pockets, paleo-channels, fault scarps, and submarine geo-hazards to establish clean foundation corridors for platforms, pipelines, and drilling units.',
      deliverablesOutput: 'High-resolution acoustic bathymetric surface grids, side-scan sonar mosaic charts, sub-bottom stratigraphy cross-sections, and seabed hazard assessment dossiers.',
      standards: 'IHO S-44 Standards for Hydrographic Surveys (Order 1a/Special Order), IMCA S 015'
    },
    'geotechnical-sampling': {
      title: 'Geotechnical Sampling & In-Situ Soil Mechanics Testing',
      description: 'Execution of seabed and sub-seabed soil sampling using heavy-duty piston corers, gravity corers, vibrocorers, and box samplers combined with downhole in-situ testing. We recover undisturbed soil cores for rigorous triaxial shear, consolidation, moisture, and Atterberg limits laboratory characterization.',
      deliverablesOutput: 'Comprehensive Geotechnical Interpretative Report (GIR), AGS4 digital soil boring logs, laboratory shear strength curves, and soil classification profiles.',
      standards: 'ASTM D1586, ASTM D1587, BS 5930, ISO 19901-8'
    },
    'geotechnical-site-investigations': {
      title: 'Geotechnical site investigations and soil mechanics',
      description: 'Comprehensive onshore, nearshore, and swamp geotechnical engineering campaigns to determine subsurface lithology, soil stratification, groundwater regime, and mechanical behavior. We execute integrated drilling, in-situ probing, and theoretical soil mechanics modeling to establish reliable geotechnical baseline parameters for heavy industrial facilities, process plants, and high-load foundation designs across Nigeria.',
      deliverablesOutput: 'Factual & Interpretative Geotechnical Engineering Reports (FGR/GIR), borehole stratigraphy profiles, bearing capacity recommendation curves, and allowable settlement calculations.',
      standards: 'BS 5930 (Site Investigations), Eurocode 7 (EN 1997-1/2), ASTM D420, NUPRC Civil Engineering Guidelines'
    },
    'cone-penetration-testing': {
      title: 'Hydraulic Cone Penetration Testing (20-Ton CPT & CPTu profiling)',
      description: 'Continuous in-situ hydraulic piezocone penetration testing (CPTu) providing continuous profiling of cone tip resistance (qc), sleeve friction (fs), and dynamic pore pressure dissipation (u2). Enables immediate stratification of soil layers, shear strength determination, and empirical calculation of deep pile capacity in complex Niger Delta clays and sands.',
      deliverablesOutput: 'Continuous digital CPTu profiles (.GEF and .AGS4 format), soil behavior type (SBT) classification charts, undrained shear strength (Su) models, and piling bearing capacity calculations.',
      standards: 'ASTM D5778, Eurocode 7 (BS EN ISO 22476-1), ISSMGE Technical Standards'
    },
    'soil-boring-spt': {
      title: 'Soil boring, standard penetration testing, and sample collection',
      description: 'Deep rotary and percussion soil boring operations executed via track-mounted rigs, swamp buggies, and drilling barges. Continuous Standard Penetration Testing (SPT) performed with calibrated automatic trip hammers at 1.0m to 1.5m depth intervals alongside recovery of undisturbed Shelby tube (U4) samples and split-barrel soil cores for stratigraphical and geotechnical evaluation.',
      deliverablesOutput: 'Certified Soil Boring Logs with continuous N-value plots, core recovery (TCR/RQD) logs, strata lithology descriptions, and undisturbed sample delivery chain-of-custody documentation.',
      standards: 'ASTM D1586 (SPT), ASTM D1587 (Thin-Walled Tube Sampling), BS 1377-9, ISO 22475-1'
    },
    'certified-lab-testing': {
      title: 'Certified laboratory testing for soil and rock',
      description: 'Accredited soil mechanics and rock mechanics testing in accordance with international standards. Comprehensive laboratory procedures include Atterberg limits, sieve particle size distribution, hydrometer sedimentation, Consolidated Undrained (CU) and Unconsolidated Undrained (UU) triaxial compression, one-dimensional oedometer consolidation, permeability, direct shear, and organic matter content testing.',
      deliverablesOutput: 'Certified Laboratory Test Certificates, stress-strain curves, Mohr-Coulomb failure envelopes, e-log p consolidation curves, and geochemical aggressiveness assessment sheets.',
      standards: 'BS 1377 Parts 1–8, ASTM D2850 (Triaxial), ASTM D2435 (Consolidation), ISO/IEC 17025 Laboratory Accreditation'
    },
    'subsurface-geophysical-seismic': {
      title: 'Subsurface geophysical and seismic ground surveys',
      description: 'Non-invasive ground-based geophysical investigations employing 2D/3D Electrical Resistivity Tomography (ERT), Seismic Refraction / MASW (Multichannel Analysis of Surface Waves), and Ground Penetrating Radar (GPR). We map bedrock depths, identify buried utilities and pipelines, detect subsurface sinkholes or voiding, and delineate lithological boundaries across complex site footprints.',
      deliverablesOutput: '2D/3D electrical resistivity inversion profiles, shear-wave velocity (Vs30) tomograms, bedrock elevation contour maps, and subsurface anomaly hazard charts.',
      standards: 'ASTM D6429, ASTM D5777 (Seismic Refraction), ASTM D6432 (GPR), NUPRC Geophysical Guidelines'
    },
    'industrial-water-borehole': {
      title: 'Industrial water borehole drilling and hydrogeology',
      description: 'Turnkey industrial water supply engineering including hydrogeological resistivity probing, deep drilling to productive confined aquifers, geophysical downhole wireline logging, installation of food-grade stainless/UPVC slotted screens, gravel packing, and extensive 72-hour step-drawdown pumping tests to determine aquifer transmissivity and safe yield.',
      deliverablesOutput: 'Borehole Completion Reports, geophysical wireline gamma/resistivity logs, aquifer pumping test drawdown curves, chemical & biological potable water analysis certificates, and sustainable yield recommendations.',
      standards: 'Federal Ministry of Water Resources Borehole Standards, AWWA A100, WHO Potable Water Quality Guidelines'
    },
    'deep-foundation-piling': {
      title: 'Deep foundation and piling capacity analysis',
      description: 'Advanced foundation engineering analyses for cast-in-situ bored piles, driven precast concrete piles, and continuous flight auger (CFA) piles. We compute ultimate and allowable axial compressive, tensile pull-out, and lateral pile load capacities using empirical CPTu and SPT methodologies, coupled with Pile Driving Analyzer (PDA) dynamic load testing and low-strain integrity testing.',
      deliverablesOutput: 'Pile Design & Capacity Engineering Reports, axial load-displacement graphs, lateral pile deflection profiles, and dynamic PDA/PIT load test verification dossiers.',
      standards: 'API RP 2GEO, BS 8004 (Code of Practice for Foundations), ASTM D4945 (High-Strain Dynamic Testing), ASTM D5882 (Pile Integrity Testing)'
    },
    'topographic-surveying-drone': {
      title: 'Topographic surveying, boundary mapping, and drone surveys',
      description: 'High-precision geodetic and topographical site surveys integrating dual-frequency RTK-GNSS total station surveying, high-precision electronic digital leveling, and RTK-equipped aerial photogrammetric LiDAR drone mapping. We produce certified perimeter boundary surveys, digital terrain elevation models (DTM), contour maps, and volumetric cut-and-fill computations.',
      deliverablesOutput: 'Registered Cadastral Boundary Survey Plans, millimeter-accurate Topographical Contour Plans (DWG/DXF/PDF), Digital Terrain Models (DTM/DEM), orthomosaic aerial photography maps, and volume earthwork reports.',
      standards: 'SURCON (Surveyors Council of Nigeria) Regulations, ISO 17123, FGDC Geospatial Positioning Standards'
    },
    'asset-inspection': {
      title: 'Asset Inspection for Offshore Asset Management & Integrity',
      description: 'High-resolution visual, acoustic, and sensor-based underwater inspections of subsea manifolds, jackets, pipelines, riser clamps, and offshore mooring spreads. We detect structural scouring, marine growth, mechanical damage, anode depletion, and seabed freespans to support risk-based maintenance and life-of-field asset integrity.',
      deliverablesOutput: 'Detailed Subsea Structural Integrity Inspection Reports, annotated HD video logs, freespan length tables, and cathodic protection (CP) potential profiling.',
      standards: 'API RP 2SIM (Structural Integrity Management), DNV-RP-F116, ISO 19902'
    },
    'hydrographic-survey': {
      title: 'Hydrographic Survey & High-Precision Seabed Bathymetry',
      description: 'Certified hydrographic surveys combining high-resolution multibeam echo sounders, RTK-GNSS tide telemetry, and sound velocity profiling (SVP). We produce millimeter-calibrated bathymetric models to verify navigable draft clearance, dredged volumes, pipeline trench profiles, and port approach safety.',
      deliverablesOutput: 'Color-coded bathymetric contour charts, digital elevation models (DEM/GeoTIFF), sound velocity profiles, and volumetric dredge computation certificates.',
      standards: 'IHO S-44 (Special Order & Order 1a), NUPRC Hydrographic Regulations'
    },
    'search-and-salvage': {
      title: 'Search and Salvage Operations in Shallow & Deep Waters',
      description: 'Specialized marine asset localization, acoustic search, and recovery operations in shallow coastal estuaries, swamp rivers, and deep continental shelf waters. Utilizing towed side-scan sonar spreads, marine magnetometers, and ROV visual inspection, we locate dropped objects, sunken vessels, lost pipeline strings, and marine infrastructure.',
      deliverablesOutput: 'Target detection coordinates, acoustic sonar imagery dossiers, recovery route engineering plans, and salvage verification sign-off reports.',
      standards: 'IMCA Guidelines for Subsea Operations, UKOOA Offshore Marine Guidelines'
    },
    'environmental-survey': {
      title: 'Environmental Survey, Ecosystem Habitat Classification & Data Interpretation',
      description: 'Comprehensive baseline and post-impact marine environmental monitoring, seabed sediment chemistry testing, benthic macrofaunal taxonomy, and water column physicochemical profiling. We interpret spatial ecological variations to evaluate environmental sensitivities, support EIA approvals, and ensure regulatory compliance.',
      deliverablesOutput: 'Environmental Baseline Survey (EBS) Reports, Post-Impact Assessment (PIA) studies, benthic habitat classification maps, and physicochemical laboratory analysis certificates.',
      standards: 'NUPRC EGASPIN (Environmental Guidelines and Standards for the Petroleum Industry in Nigeria), ISO 14001, FMEnv Guidelines'
    }
  },

  // 2. Digital Intelligence
  'digital-intelligence': {
    'laser-scanning': {
      title: 'High-precision 3D terrestrial and mobile laser scanning',
      description: 'Deployment of high-speed industrial LiDAR scanners (Leica RTC360, Leica ScanStation P50) capturing up to 2 million points per second with millimeter accuracy. Operates safely in hazardous Zone 1/Zone 2 ATEX process environments without facility shutdown, creating dense spatial point clouds of complex processing facilities, manifolds, and structural towers.',
      deliverablesOutput: 'Registered millimeter-accurate point clouds (E57, PTS, RCP/RCS), high-definition HDR 360-degree spherical photo tours, and laser scan registration certificates.',
      standards: 'USIBD Level of Accuracy (LOA 40/50), ASTM E2807, ISO 17123-9'
    },
    'point-cloud-processing': {
      title: 'Point-cloud processing, registration, and 3D modeling',
      description: 'Processing of raw multi-station laser scan scans using Leica Cyclone and Cyclone 3DR suites. Workflow includes target-based and cloud-to-cloud registration, point cloud cleaning, noise removal, georeferencing to national geodetic networks (Minna / WGS84 UTM Zone 31/32N), and segmentation into process disciplines.',
      deliverablesOutput: 'Unified coordinate-registered point cloud databases, spatial alignment verification reports, and decimation datasets optimized for CAD/BIM ingestion.',
      standards: 'Leica Cyclone Advanced Geodetic Standards, ISO 19650-1 & 2'
    },
    'as-built-cad-bim': {
      title: 'As-built 3D CAD and BIM computer models',
      description: 'Direct reverse engineering of physical plant components from dense point clouds into parametric intelligent 3D models. We deliver intelligent piping models (including pipe classes, valve specifications, flange ratings), civil foundations, structural steel framing, and HVAC systems in Autodesk Plant 3D, Revit, and AVEVA PDMS/E3D.',
      deliverablesOutput: 'Native intelligent CAD/BIM models (DWG, RVT, DGN), piping isometric fabrication drawings with bill of materials (BOM), and clash-free structural models.',
      standards: 'ISO 19650 BIM Standards, ASME B31.3 Process Piping, API 570'
    },
    'dimensional-control': {
      title: 'Dimensional control and clash detection before site installation',
      description: 'High-precision laser metrology and automated clash detection simulating the insertion of newly fabricated spools, modular skids, or equipment replacements into existing plant layouts. By identifying hard and soft interferences in Autodesk Navisworks before offshore mobilization, we eliminate costly field hot-cutting and rework.',
      deliverablesOutput: 'Comprehensive Navisworks Clash Matrix Reports, spool verification dimensional control sheets, tie-in coordinate schedules, and fabrication clearance certificates.',
      standards: 'API RP 520 / 521, PIP (Process Industry Practices) Standards'
    },
    'digital-twins': {
      title: 'Digital twins and virtual walkthroughs for operating facilities',
      description: 'Transformation of laser scan point clouds and 3D models into living, interactive digital twins accessible via web browsers. Operating personnel, engineers, and safety teams can perform remote asset walkthroughs, measure clearances, review asset tag documentation, and plan turnaround shutdowns from any global location.',
      deliverablesOutput: 'Cloud-hosted interactive 3D digital twin portals, tag-linked asset equipment databases, virtual reality (VR) walkthrough packages, and asset condition annotations.',
      standards: 'Open Geospatial Consortium (OGC) Standards, ISO 23247 Digital Twin Framework'
    },
    'facility-modifications': {
      title: 'Facility modifications, pipe fitting, and tie-in planning',
      description: 'Precise spatial engineering for brownfield plant expansions, flowline tie-ins, and debottlenecking projects. We verify nozzle orientations, bolt-hole circle alignments, pipe slope gradients, and thermal expansion clearances, ensuring 100% first-time fit for pre-fabricated spools during critical plant turnarounds.',
      deliverablesOutput: 'Tie-in point coordinate packages, pipe cut-length schedules, nozzle orientation verification sheets, and pre-mobilization fit-up simulation reports.',
      standards: 'ASME B16.5 Flanges & Fittings, ASME B31.4 / B31.8 Pipeline Transportation Systems'
    },
    'structural-deformation': {
      title: 'Structural deformation monitoring and geometric checks',
      description: 'Sub-millimeter laser scan and total station monitoring of storage tanks, processing towers, flare stacks, and offshore jacket legs. We measure tank out-of-roundness, verticality tilt, foundation settlement, and structural deflection under thermal or hydrostatic loading over time.',
      deliverablesOutput: 'Heatmap differential deflection color maps, API 653 tank verticality and roundness compliance reports, settlement trend curves, and structural deformation dossiers.',
      standards: 'API 653 (Tank Inspection, Repair, Alteration, and Reconstruction), ISO 17123'
    }
  },

  // 3. Integrated Engineering & Construction Solutions
  'integrated-engineering-construction': {
    'pipeline-fabrication': {
      title: 'Pipeline fabrication, pipe laying, and certified welding',
      description: 'End-to-end onshore and swamp pipeline construction, pipe stringing, beveling, trenching, and field welding for flowlines and hydrocarbon trunklines. Our certified welders and automated welding units execute girth welds under stringent QA/QC protocols across carbon steel, stainless steel, and duplex alloys.',
      deliverablesOutput: 'Welder Performance Qualification Records (WPQR), Weld Inspection Logs, Radiographic / Ultrasonic NDT dossiers, and Pipeline Completion Certificates.',
      standards: 'API 1104, ASME Section IX, NUPRC Pipeline Safety Regulations'
    },
    'hydrostatic-testing': {
      title: 'Hydrostatic pressure testing and corrosion protection',
      description: 'Certified hydrotesting of newly installed and existing pipeline segments up to 1.5x design pressure to confirm structural integrity and leak tightness. Followed by dewatering, pipeline pigging, air drying down to -40°C dew point, nitrogen purging, and application of external field joint coatings (3LPE / heat shrink sleeves).',
      deliverablesOutput: 'Pressure & Temperature Chart Recorder Log Sheets, Pipeline Dewatering & Drying Certificates, Cathodic Protection Baseline Potential Reports, and NUPRC Commissioning Sign-offs.',
      standards: 'ASME B31.8, API RP 1110, NACE SP0169 / SP0286'
    },
    'site-preparation': {
      title: 'Site preparation, piling, and heavy industrial foundations',
      description: 'Heavy civil earthworks, swamp clearing, soil stabilization, and driven/bored piling operations for heavy industrial compressor stations, pump skids, and substation structures. We install driven precast concrete piles, steel tubular piles, and continuous flight auger (CFA) piles engineered to withstand heavy cyclic loads.',
      deliverablesOutput: 'Piling driving logs, Pile Dynamic Analyzer (PDA) load test reports, concrete compressive strength batch certificates, and foundation as-built survey charts.',
      standards: 'Eurocode 7, BS 8004 Code of Practice for Foundations, ASTM D1143'
    },
    'structural-concrete': {
      title: 'Structural concrete and civil infrastructure construction',
      description: 'Construction of heavy reinforced concrete bund walls, containment basins, compressor equipment plinths, drainage culverts, and structural control buildings. Formwork, rebar placement, and high-strength industrial concrete pours are supervised under strict quality controls for durability in aggressive coastal and swamp environments.',
      deliverablesOutput: 'As-built structural concrete drawings, cube compression test break reports, rebar mill test certificates, and civil handover dossiers.',
      standards: 'BS 8110 / BS EN 1992, ACI 318, ASTM C94'
    },
    'access-road': {
      title: 'Access road construction and swamp terrain rehabilitation',
      description: 'Civil engineering construction of heavy-duty macadamized access roads, geotextile-reinforced causeways, and swamp terrain stabilization linking remote oilfield flow stations and drilling locations. Includes river crossing jetties, culvert installations, and post-construction right-of-way revegetation.',
      deliverablesOutput: 'Road alignment plan & profile drawings, soil compaction (Proctor density) test reports, pavement thickness verification certificates, and right-of-way handover dossiers.',
      standards: 'Federal Ministry of Works & Housing Highway Manual, NUPRC Land Use Guidelines'
    },
    'swamp-operations': {
      title: 'Swamp, coastal, and offshore field operations support',
      description: 'Turnkey logistical and field operations management across swamp and coastal energy assets in the Niger Delta. We mobilize pontoon-mounted excavators, workbarges, crew transfer vessels, and specialized equipment spreads with full security escorts and community liaison management.',
      deliverablesOutput: 'Daily Field Progress Reports (DPR), Vessel Mobilization Logs, HSSE Tool-Box Meeting Records, and Marine Safety Clearance Certificates.',
      standards: 'Nigerian Cabotage Act, NIMASA Marine Safety Regulations, ISO 45001'
    },
    'rig-positioning': {
      title: 'Rig positioning and vessel navigation support',
      description: 'Real-time high-precision differential satellite navigation (DGPS/RTK) and subsea acoustic positioning (USBL) for jack-up rigs, semi-submersibles, and drilling barges. We provide real-time anchor spread planning, hazard avoidance, spudcan penetration monitoring, and sub-meter conductor alignment.',
      deliverablesOutput: 'Rig Positioning Verification Certificates, Anchor Pattern Clearance Charts, Spudcan Touchdown Survey Reports, and Final Geodetic Tie-In Reports.',
      standards: 'IMCA M 203 Guidelines for Dynamic Positioning, UKOOA Guidelines for Rig Positioning'
    },
    'tugboat-management': {
      title: 'Tugboat management, anchor handling, and logistics',
      description: 'Operational command and coordination of anchor handling tug supply (AHTS) vessels, towing tugs, and utility craft. We manage complex marine towing operations, anchor deployment/recovery spreads, barge positioning during heavy pipeline laying, and offshore cargo supply runs.',
      deliverablesOutput: 'Towing Master Certificates, Anchor Tension Monitoring Logs, Vessel Daily Movement Sheets, and Marine Operations Risk Assessment (MORA) reports.',
      standards: 'IMCA Marine Operations Guidelines, SOLAS Regulations, NIMASA Marine Standards'
    }
  },

  // 4. Industrial & Environmental Technologies
  'industrial-environmental-technologies': {
    'produced-water': {
      title: 'Produced water and industrial wastewater treatment systems',
      description: 'Design, supply, skid assembly, and commissioning of turnkey produced water treatment units. Utilizing hydrocyclones, induced gas flotation (IGF), and media filtration, we reduce oil-in-water (OIW) concentrations down to <15 ppm, ensuring full compliance for marine overboard discharge or reinjection into disposal wells.',
      deliverablesOutput: 'Water quality laboratory analytical certificates, process flow diagrams (PFD/P&ID), equipment operating manuals, and NUPRC environmental compliance discharge permits.',
      standards: 'NUPRC EGASPIN Part VIII (Effluent Discharge Limits), API 421, OSPAR Convention Guidelines'
    },
    'oil-separation': {
      title: 'Oil separation units and filtration skids for environmental compliance',
      description: 'Supply and installation of advanced coalescing plate separators (CPI), corrugated plate interceptors, and multi-stage polishing filtration skids. These units separate emulsified crude oil and suspended solids from industrial wastewater, preventing environmental spill violations and protecting natural waterways.',
      deliverablesOutput: 'Factory Acceptance Test (FAT) documents, hydrostatic test certificates, separation efficiency performance logs, and statutory environmental discharge approvals.',
      standards: 'ASME Section VIII Div 1 (Pressure Vessels), NUPRC EGASPIN Standards, ISO 14001'
    },
    'water-treatment': {
      title: 'Water treatment plants and subsurface reinjection systems',
      description: 'High-capacity reverse osmosis (RO), ultrafiltration (UF), and multimedia filtration plants treating raw groundwater and surface water for industrial boiler feed, turbine cooling, and subsurface disposal reinjection. Includes chemical dosing packages, high-pressure injection pumps, and SCADA automation.',
      deliverablesOutput: 'Water chemical and microbiological analysis reports, plant operational performance dossiers, mechanical equipment manuals, and reinjection wellhead monitoring logs.',
      standards: 'WHO Drinking Water Guidelines, ASTM D1129, API RP 45 (Analysis of Oilfield Waters)'
    },
    'industrial-valves': {
      title: 'Industrial valves and automated actuator control packages',
      description: 'Procurement, supply, and integration of severe-service gate, ball, globe, check, and butterfly valves fitted with pneumatic, hydraulic, and electric actuators (in partnership with NPK Flanges & Industrial Piping). We configure emergency shutdown valves (ESDV) and flow control packages calibrated to exact process conditions.',
      deliverablesOutput: 'Valve Manufacturer Mill Test Certificates (MTR/EN 10204 3.1), Actuator Torque Calibration Curves, SIL Safety Dossiers, and Pressure Test Verification Sheets.',
      standards: 'API 6D, API 600, ASME B16.34, ISO 15848 (Fugitive Emissions), SIL 3 Certification'
    },
    'valve-servicing': {
      title: 'Flow control valve servicing, calibration, and maintenance',
      description: 'Comprehensive valve overhaul, lapping, seat replacement, repacking, and pressure calibration services executed in our Port Harcourt engineering workshop and via mobile field trailers. Our certified technicians calibrate smart digital positioners, bench-test relief valves (PSV), and restore critical flow control reliability.',
      deliverablesOutput: 'Valve Pressure Test Certificates, Bench Pop-Pressure Calibration Reports, Valve Condition Assessment Dossiers, and Maintenance Warranty Certifications.',
      standards: 'API 598 (Valve Inspection & Testing), API 527 (Seat Tightness of Pressure Relief Valves), ASME Sec VIII'
    },
    'ndt-inspections': {
      title: 'Non-destructive testing, ultrasonic testing, and radiographic inspections',
      description: 'Advanced and conventional Non-Destructive Testing (NDT) services for plant piping, storage vessels, and structural welds. Methods include Phased Array Ultrasonic Testing (PAUT), Time of Flight Diffraction (TOFD), Radiographic Testing (RT), Magnetic Particle (MPI), and Dye Penetrant Testing (DPT).',
      deliverablesOutput: 'Certified NDT Inspection Reports, digital PAUT scan cross-section imagery, radiograph interpretation logs, and welding defect disposition notices.',
      standards: 'ASNT SNT-TC-1A, ISO 9712, ASME Section V (Nondestructive Examination), API 570'
    },
    'corrosion-monitoring': {
      title: 'Corrosion monitoring, wall-thickness measurement, and fitness reviews',
      description: 'Baseline and periodic ultrasonic thickness (UT) gauging, internal corrosion coupon monitoring, and Electrical Resistance (ER) probe analysis on live hydrocarbon process systems. We calculate corrosion rates, remaining asset wall thickness, and execute API 579 Fitness-For-Service (FFS) engineering evaluations.',
      deliverablesOutput: 'Asset Remaining Life Assessment Reports, UT Thickness Grid Contour Maps, Corrosion Rate Trend Analysis Charts, and Fitness-For-Service Engineering Certifications.',
      standards: 'API 579-1 / ASME FFS-1, NACE MR0175 / ISO 15156, API 510 / 570'
    },
    'flow-station-maintenance': {
      title: 'Flow station mechanical maintenance and facility upgrades',
      description: 'Turnkey mechanical maintenance, pipe spool replacement, heat exchanger retubing, pump overhaul, and manifold debottlenecking during scheduled flow station turnarounds. We manage work permits, isolations, hot-work mitigation, and system pre-commissioning for rapid asset restart.',
      deliverablesOutput: 'Turnaround Mechanical Completion Dossiers, Flange Bolt-Torquing Verification Records, Punchlist Sign-Off Certificates, and Pre-Startup Safety Review (PSSR) documents.',
      standards: 'API 686 (Machinery Installation & Maintenance), ASME B31.3, ISO 9001:2015'
    }
  },

  // 5. Offshore Intelligence
  'offshore-intelligence': {
    'marine-geophysical': {
      title: 'Marine geophysical surveys and seabed acoustic mapping',
      description: 'Comprehensive offshore geophysical campaigns utilizing multi-beam bathymetry, side-scan sonar, and sub-bottom seismic profiling across nearshore and deepwater concessions in the Gulf of Guinea. We identify seabed slopes, pockmarks, mega-ripples, and acoustic anomalies to ensure zero-risk drilling and platform placement.',
      deliverablesOutput: 'Comprehensive Marine Geophysical Survey Reports, 3D digital seabed terrain models, acoustic backscatter mosaic charts, and geohazard clearance certificates.',
      standards: 'IHO S-44 Standards for Hydrographic Surveys, IMCA S 015, NUPRC Offshore Regulations'
    },
    'bathymetry-mapping': {
      title: 'High-resolution hydrographic depth mapping and bathymetry',
      description: 'Vessel-mounted high-frequency multibeam echosounder (MBES) surveys coupled with inertial navigation systems (INS) and real-time sound velocity correction. We map seabed elevations with sub-centimeter vertical resolution across shipping fairways, port terminals, and offshore platform locations.',
      deliverablesOutput: 'High-density XYZ bathymetry point clouds, electronic navigational charts (ENC/S-57 format), depth contour drawings, and navigation safety certification.',
      standards: 'IHO Standards for Hydrographic Surveys (Special Order), UKHO Guidelines'
    },
    'sub-bottom-profiling': {
      title: 'Sub-bottom profiling, side-scan sonar, and underwater surveys',
      description: 'High-resolution acoustic sub-bottom penetration profiling (EdgeTech SB-216S towfish) imaging the upper 10–50 meters of sediment stratigraphy. Delineates buried pipelines, boulders, shallow gas accumulations, and sediment boundaries crucial for trenching feasibility and spudcan foundation analysis.',
      deliverablesOutput: 'Digitally processed sub-bottom seismic profiles (SEG-Y format), shallow stratigraphy correlation logs, side-scan sonar contact sheets, and seabed debris listings.',
      standards: 'IMCA S 008, API RP 2GEO (Geotechnical and Foundation Design Considerations)'
    },
    'oceanographic-buoys': {
      title: 'Oceanographic weather buoys, wave monitoring, and current telemetry',
      description: 'Deployment, mooring, and telemetry management of Frankstar Technology oceanographic wave and current buoys. System records significant wave height (Hs), wave period (Tp), wave direction, and multi-depth current velocities via Acoustic Doppler Current Profilers (ADCP).',
      deliverablesOutput: 'Real-time cloud-streamed Metocean Dashboard Telemetry, monthly statistical wave-current climate summaries, extreme value storm analysis, and historical raw data logs.',
      standards: 'WMO (World Meteorological Organization) Standards, IOC/UNESCO Oceanographic Guidelines'
    },
    'meteorological-stations': {
      title: 'Meteorological observation stations and environmental logging',
      description: 'Continuous offshore automated weather stations (AWS) mounted on platforms, FPSOs, and coastal stations measuring wind speed, wind gust, barometric pressure, air temperature, relative humidity, solar radiation, and precipitation to ensure operational safety and regulatory compliance.',
      deliverablesOutput: 'Real-time meteorological telemetry streams, atmospheric weather trend reports, squall event alerts, and statutory annual climatic archives.',
      standards: 'WMO-No. 8 (Guide to Meteorological Instruments and Methods of Observation), ISO 9001'
    },
    'marine-compliance': {
      title: 'Marine environmental compliance and water quality monitoring',
      description: 'Offshore seawater and sediment quality monitoring campaigns collecting CTD (Conductivity, Temperature, Depth) profiles, turbidity, dissolved oxygen, and hydrocarbon trace measurements across offshore exploration blocks and oil terminal tanker loading zones.',
      deliverablesOutput: 'Environmental Compliance Monitoring Reports, CTD depth gradient profile graphs, accredited water chemistry laboratory analysis, and regulatory environmental filings.',
      standards: 'NUPRC EGASPIN Guidelines, OSPAR Environmental Monitoring Standards, MARPOL 73/78'
    },
    'pipeline-route-surveys': {
      title: 'Subsea pipeline route surveys and seabed clearance',
      description: 'Pre-engineering and pre-lay corridor surveys along proposed subsea pipeline and umbilical paths. We combine bathymetry, side-scan sonar, magnetometer sweeps, and sub-bottom profiling to optimize pipeline routes, avoid rock outcrops, and verify required burial depths.',
      deliverablesOutput: 'Detailed Pipeline Alignment Sheets (Plan & Profile), crossing matrix dossiers, seabed obstruction catalogues, and trenching feasibility reports.',
      standards: 'DNV-ST-F101 (Submarine Pipeline Systems), IMCA S 015, API RP 1111'
    },
    'environmental-telemetry': {
      title: 'Real-time environmental data transmission for offshore operations',
      description: 'Secure satellite and cellular telemetry systems relaying live metocean, wave height, current velocity, and squall warnings directly from offshore sensor buoys to onshore operator command centers and bridge navigation consoles, enabling dynamic go/no-go operational decision-making.',
      deliverablesOutput: '24/7 web and mobile live telemetry dashboards, automated SMS/email threshold squall alarms, API data feeds, and monthly uptime telemetry audit certificates.',
      standards: 'NUPRC Offshore Safety Directives, IMCA Marine Guidance, IEC 60945'
    }
  }
};

/**
 * Normalizes any deliverable (string or object) to a full ServiceDeliverableItem.
 * Resolves against the Master Engineering Knowledge Base if matching text is found.
 */
export function getDeliverableDetails(
  item: string | ServiceDeliverableItem,
  serviceSlugOrId?: string
): ServiceDeliverableItem {
  if (!item) {
    return {
      title: 'Engineering Deliverable',
      description: 'Technical specification and execution deliverables executed under PIGL engineering quality assurance standards.'
    };
  }

  // If already a rich object with description, use it directly
  if (typeof item === 'object' && item !== null && 'title' in item) {
    if (item.description && item.description.trim().length > 0) {
      return item;
    }
  }

  const rawTitle = typeof item === 'string' ? item : item.title;
  const cleanTitle = rawTitle.trim();
  const lowerTitle = cleanTitle.toLowerCase();

  const srvKey = serviceSlugOrId?.toLowerCase() || '';
  const searchTokens = lowerTitle
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 4);

  // Helper to test if an entry matches
  const matchScore = (entry: ServiceDeliverableItem, key: string): number => {
    const entryLowerTitle = entry.title.toLowerCase();
    const entryTokens = entryLowerTitle.replace(/[^\w\s]/g, ' ').split(/\s+/);
    
    // Direct or substring match
    if (cleanTitle === entry.title || lowerTitle === entryLowerTitle) return 100;
    if (lowerTitle.includes(key) || key.includes(lowerTitle)) return 80;
    if (lowerTitle.includes(entryLowerTitle.slice(0, 18))) return 70;
    if (entryLowerTitle.includes(lowerTitle.slice(0, 18))) return 70;

    // Token intersection score
    let score = 0;
    for (const token of searchTokens) {
      if (entryTokens.includes(token)) score += 15;
      else if (entryLowerTitle.includes(token)) score += 10;
      else if (entry.description.toLowerCase().includes(token)) score += 5;
    }
    return score;
  };

  // 1. Direct search in specific service dictionary if known
  for (const [sKey, dict] of Object.entries(MASTER_SERVICE_DELIVERABLES)) {
    if (srvKey.includes(sKey) || sKey.includes(srvKey)) {
      let bestMatch: ServiceDeliverableItem | null = null;
      let highestScore = 0;
      for (const [dKey, entry] of Object.entries(dict)) {
        const score = matchScore(entry, dKey);
        if (score > highestScore) {
          highestScore = score;
          bestMatch = entry;
        }
      }
      if (bestMatch && highestScore >= 20) {
        return {
          ...bestMatch,
          title: cleanTitle // Preserve the exact title as configured in admin/service
        };
      }
    }
  }

  // 2. Global search across all service dictionaries
  let globalBest: ServiceDeliverableItem | null = null;
  let globalHighestScore = 0;
  for (const dict of Object.values(MASTER_SERVICE_DELIVERABLES)) {
    for (const [dKey, entry] of Object.entries(dict)) {
      const score = matchScore(entry, dKey);
      if (score > globalHighestScore) {
        globalHighestScore = score;
        globalBest = entry;
      }
    }
  }
  if (globalBest && globalHighestScore >= 20) {
    return {
      ...globalBest,
      title: cleanTitle
    };
  }

  // 3. Fallback for custom administrator-defined deliverables without existing knowledge base entry
  return {
    title: cleanTitle,
    description: `Comprehensive engineering field execution, instrumentation deployment, and technical deliverables for ${cleanTitle}. Our certified multi-disciplinary teams deploy calibrated acquisition equipment and strict quality assurance protocols to deliver verified empirical data, regulatory compliance dossiers, and engineering design inputs tailored to operator requirements.`,
    deliverablesOutput: 'Technical data dossiers, QA/QC verification sign-offs, and certified engineering documentation.',
    standards: 'ISO 9001:2015 Quality Management, NUPRC Statutory Regulations'
  };
}
