import React from 'react';

export interface ServiceDetail {
  id: string;
  longDescription: string;
  businessValue: string;
  methodology: string[];
  equipment: string[];
}

export const SERVICE_DETAILS_MAP: Record<string, ServiceDetail> = {
  'geophysical-surveys': {
    id: 'geophysical-surveys',
    longDescription: 'Our Geophysical Surveys provide highly-accurate marine and land geophysics targeting sub-surface mapping. Leveraging high-resolution sensors, we map stratigraphic layers, outline geological hazards, and identify archaeological features. This service is essential for pre-construction engineering, marine cable route planning, pipeline routing, and general offshore safety.',
    businessValue: 'Reduces geotechnical risk by up to 80% during pre-construction engineering phases. Helps operators identify hazard areas (like gas pockets, shallow gas pockets, bedrock outcrops, or legacy debris) to prevent costly offshore drilling failures or routing errors.',
    methodology: [
      'Site reconnaissance and grid planning',
      'Sensor calibration and line survey mobilization',
      'Multi-sensor data acquisition (sonar, sub-bottom, magnetics)',
      'Data processing, noise reduction, and seismic interpretation',
      'Comprehensive GIS mapping, geological cross-sections, and reporting'
    ],
    equipment: [
      'Multi-beam Echo Sounders',
      'Sub-bottom Profilers',
      'Marine Magnetometers',
      'Side Scan Sonar Systems',
      'Seismic Refraction Array'
    ]
  },
  'geotechnical-services': {
    id: 'geotechnical-services',
    longDescription: 'Our Geotechnical Services focus on understanding the mechanical properties of soil and rock to ensure foundation stability and structural integrity. We conduct extensive in-situ testing, gather core samples, and execute detailed laboratory tests under ISO-certified quality controls. Our engineering analyses support deep pile foundation designs, slope stability modeling, and settlement predictions.',
    businessValue: 'Guarantees foundation design integrity for high-stakes oil platforms, skyscrapers, and industrial plants. Ensures absolute safety and compliance with international ASTM and Eurocode standards, preventing catastrophic settlement.',
    methodology: [
      'Borehole drilling and rock coring',
      'In-situ testing (Cone Penetration Testing, SPT)',
      'Soil sampling and laboratory analysis (moisture, shear strength)',
      'Foundation capacity calculations and settlement profiling',
      'Final engineering geotechnical report generation'
    ],
    equipment: [
      'High-Capacity CPT Rig',
      'Standard Penetration Testing (SPT) Kit',
      'Triaxial Shear Laboratory Systems',
      'Automatic Soil Compactors',
      'Slope Stability Modeling Software'
    ]
  },
  'climate-environmental-metocean': {
    id: 'climate-environmental-metocean',
    longDescription: 'We provide comprehensive oceanographic, meteorological, and environmental impact assessments designed to protect coastal assets and monitor ecological parameters. By analyzing winds, waves, currents, and water quality, we empower maritime operations to adapt to extreme weather events, build resilient sea defenses, and maintain regulatory compliance.',
    businessValue: 'Minimizes weather-related operational downtime for offshore platforms and ports. Protects shoreline infrastructure from sea-level rise and storm surges while securing environmental licenses from regulatory bodies like NUPRC.',
    methodology: [
      'Metocean buoy deployment and telemetry calibration',
      'Long-term data collection (wave heights, currents, winds)',
      'Water quality and environmental sample gathering',
      'Statistical modeling of extreme meteorological events',
      'Environmental Impact Assessment (EIA) drafting'
    ],
    equipment: [
      'Oceanographic Metocean Buoys',
      'Acoustic Doppler Current Profilers (ADCP)',
      'Meteorological Weather Stations',
      'Multiparameter Water Quality Probes',
      'Wave and Tide Sensors'
    ]
  },
  'geomatics-services': {
    id: 'geomatics-services',
    longDescription: 'Our Geomatics Services bridge the gap between spatial data capture and engineering modeling. We deliver high-precision land surveys, boundary surveys, UAV aerial photogrammetry, and specialized GIS systems. This high-fidelity spatial data serves as the baseline for all master planning, pipeline routing, and civil design.',
    businessValue: 'Ensures absolute geometric accuracy for pipeline right-of-way (ROW), utility mapping, and land acquisition. Prevents boundary disputes, reduces survey costs by 60% through UAV automation, and feeds precise coordinate data directly into CAD design suites.',
    methodology: [
      'Control network establishment using GNSS RTK',
      'Aerial UAV flight path planning and capture',
      'Terrestrial topographic mapping and boundary detailing',
      'Photogrammetry processing and orthomosaic generation',
      'GIS database construction and attribute mapping'
    ],
    equipment: [
      'Leica RTK GNSS Receivers',
      'Precision Survey Drones (UAV)',
      'Digital Terrestrial Levels',
      'Pix4D Photogrammetry Software',
      'ArcGIS Enterprise Suite'
    ]
  },
  'seismic-services': {
    id: 'seismic-services',
    longDescription: 'We offer advanced seismic data acquisition, processing, and interpretation workflows to characterize sub-surface reserves and structural fault networks. By utilizing high-fidelity geophones and seismic sources, we map deep stratigraphic horizons and help geoscientists visualize structural traps with maximum precision.',
    businessValue: 'Maximizes drilling success rates by providing crystal-clear images of sub-surface hydrocarbons or aquifers. Helps energy companies optimize reservoir models, plan drilling targets, and reduce exploration expenditure.',
    methodology: [
      'Seismic line modeling and grid layout',
      'Receiver line installation and geophone planting',
      'Seismic source execution (vibroseis or impulsive)',
      'Data recording and seismic noise attenuation processing',
      'Structural fault modeling and reservoir mapping'
    ],
    equipment: [
      'Multi-Channel Seismic Recorder',
      'High-Fidelity Land Geophones',
      'Vibroseis Impulsive Sources',
      'Seismic Data Processing Workstations',
      'Petrel Interpretation Software'
    ]
  },
  'oilfield-services': {
    id: 'oilfield-services',
    longDescription: 'Our Oilfield Services supply specialized technical support for marine vessels, offshore rig positioning, tug management, and anchor handling operations. We integrate precise GNSS positioning, acoustic telemetry, and real-time visualization systems to guide high-stakes drilling platforms and construction barges into position safely.',
    businessValue: 'Protects multi-million dollar drilling rigs and offshore platforms during critical relocation maneuvers. Prevents pipeline collisions by mapping nearby sea-bottom assets and tracking anchors dynamically in real-time.',
    methodology: [
      'Rig positioning system mobilization and check',
      'Acoustic beacon deployment and calibration',
      'Anchor monitoring and tug management integration',
      'Real-time marine navigation and collision warning tracking',
      'Final rig positioning certification and handover'
    ],
    equipment: [
      'High-Precision RTK-GNSS Receivers',
      'Ultra-Short Baseline (USBL) Acoustics',
      'Gyroscopic Compass Systems',
      'Hydroacoustic Transponders',
      'Qinsy Navigation Software'
    ]
  },
  'onshore-nearshore-geotechnical': {
    id: 'onshore-nearshore-geotechnical',
    longDescription: 'Tailored specifically for shallow-water, nearshore, and coastal interfaces, this service bridges marine geotechnics and land-based drilling. We operate specialized jack-up barges and pontoon-mounted drill rigs to collect soil samples, execute CPTs, and evaluate coastal strata for jetties, bridges, and shore protection.',
    businessValue: 'Secures foundation design for critical nearshore structures like ports, loading docks, and river crossings. Mitigates liquefaction and coastal erosion risks, ensuring stable offshore-to-onshore pipeline transitions.',
    methodology: [
      'Jack-up barge positioning and stabilization',
      'Nearshore borehole drilling and SPT sampling',
      'Pontoon-based Cone Penetration Testing',
      'Strata profiling and marine sediment laboratory checks',
      'Coastal stability and pile load reports'
    ],
    equipment: [
      'Specialized Geotechnical Pontoon',
      'Shallow-Water Jack-Up Barge',
      'Marine Drilling Rig',
      'Piston Soil Samplers',
      'Continuous CPT Logging System'
    ]
  },
  'asset-integrity-services': {
    id: 'asset-integrity-services',
    longDescription: 'We deliver rigorous technical assurance, non-destructive testing (NDT), corrosion monitoring, and advanced structural health inspections to protect operational assets. Our certified engineers inspect pipelines, storage tanks, and structural columns to identify micro-cracks, wall thinning, and degradation before failures occur.',
    businessValue: 'Extends asset operating life, prevents catastrophic environmental spills, and ensures compliance with strict HSSE regulations. Avoids unplanned shutdown costs through early detection of structural vulnerabilities.',
    methodology: [
      'Inspection scope definition and asset mapping',
      'Non-Destructive Testing (Ultrasonic, Magnetic Particle)',
      'Corrosion rate profiling and wall thickness measurements',
      'Structural stress analysis and defect cataloging',
      'Fitness-for-Service (FFS) reporting and recommendations'
    ],
    equipment: [
      'Phased Array Ultrasonic Testing (PAUT)',
      'Magnetic Flux Leakage (MFL) Scanners',
      'Digital Radiography Systems',
      'Corrosion Thickness Gauges',
      'Structural Finite Element Software'
    ]
  },
  'pipeline-construction': {
    id: 'pipeline-construction',
    longDescription: 'PIGL is a leading provider of indigenous pipeline construction, welding, and installation. We manage complex onshore pipeline projects from initial route surveying and clearing through trenching, welding, non-destructive testing, hydrostatic testing, and ultimate commissioning. Our work adheres to the highest API and ASME specifications.',
    businessValue: 'Delivers robust, leak-proof energy transport conduits with maximum local content integration. Ensures zero-leak assurance during hydrostatic testing, complying with strict NUPRC safety and environmental guidelines.',
    methodology: [
      'Route clearing and right-of-way (ROW) grading',
      'Pipe stringing, bending, and specialized welding',
      'Welding inspection using automated NDT',
      'Trenching, pipe lowering, and backfilling',
      'Hydrostatic testing and nitrogen purging/commissioning'
    ],
    equipment: [
      'Automated Pipeline Welding Rigs',
      'Sideboom Pipe Lifters',
      'Trenching Heavy Excavators',
      'High-Volume Hydrostatic Test Pumps',
      'Phased Array Ultrasonic (PAUT) Systems'
    ]
  },
  'facility-maintenance': {
    id: 'facility-maintenance',
    longDescription: 'We provide comprehensive operations and maintenance (O&M) services for oil and gas flow stations, processing plants, and marine terminals. Our engineers manage routine mechanical maintenance, electrical system calibrations, valve refurbishments, and instrumentation troubleshooting to guarantee peak plant efficiency.',
    businessValue: 'Minimizes unplanned plant shutdowns and optimizes processing throughput. Extends the service lifetime of high-value turbines, pumps, and control systems while maintaining strict HSSE safety baselines.',
    methodology: [
      'Preventive maintenance scheduling and audit',
      'Mechanical asset servicing (turbines, pumps, valves)',
      'Electrical loop testing and calibration of instrumentation',
      'Defect remediation and emergency shutdown (ESD) checks',
      'Performance optimization reporting'
    ],
    equipment: [
      'Pneumatic Calibration Kits',
      'Vibration Analysis Monitors',
      'Laser Shaft Alignment Tools',
      'Industrial Valve Greasing Pumps',
      'Thermal Imaging Cameras'
    ]
  },
  'asset-management': {
    id: 'asset-management',
    longDescription: 'Our Asset Management solutions utilize advanced digital workflows to optimize lifecycle operations, inventory tracking, and predictive maintenance programs. We integrate physical engineering assets with Enterprise Asset Management (EAM) platforms to track depreciation, calculate reliability metrics, and optimize spare parts logistics.',
    businessValue: 'Boosts asset utilization by up to 25% and reduces spare parts inventory holding costs. Translates complex mechanical performance data into actionable financial and operational insights for corporate leadership.',
    methodology: [
      'Asset register audits and barcoding/RFID mapping',
      'EAM database configuration and synchronization',
      'Reliability-Centered Maintenance (RCM) modeling',
      'Predictive maintenance scheduling',
      'Operational dashboard tracking and lifecycle auditing'
    ],
    equipment: [
      'RFID and Barcode Asset Scanner Systems',
      'Enterprise Asset Management (EAM) Software',
      'Predictive Reliability Algorithms',
      'Vibration Sensors',
      'Cloud-Based Data Dashboards'
    ]
  },
  'reality-capture': {
    id: 'reality-capture',
    longDescription: 'PIGL is the regional pioneer in 3D Reality Capture, laser scanning, and Digital Twins. We deploy premium 3D laser scanners and aerial LiDAR systems to capture physical plants, offshore platforms, and infrastructure with millimeter-level accuracy. This point-cloud data is processed into intelligent, photorealistic 3D CAD models and interactive digital twins.',
    businessValue: 'Enables offsite inspection, clash detection, and brownfield engineering modifications with zero travel risks. Accelerates design times by 40% and completely eliminates standard construction clash re-work.',
    methodology: [
      'High-density terrestrial laser scanning setup',
      'LiDAR drone mapping flights',
      'Point cloud registration and noise filtering',
      'Intelligent 3D CAD modeling from registered clouds',
      'Digital Twin dashboard rendering and integration'
    ],
    equipment: [
      'Leica RTC360 3D Laser Scanner',
      'LiDAR Drone Systems',
      'Leica Cyclone point cloud software',
      'Autodesk Revit & Plant 3D Suites',
      'Interactive Digital Twin Dashboards'
    ]
  },
  'civil-works': {
    id: 'civil-works',
    longDescription: 'We manage complex civil infrastructure projects including foundation engineering, drainage networks, site grading, piling, and concrete works for oil field camps and industrial complexes. Our civil engineering teams ensure robust site preparation, structural foundations, and erosion controls that stand up to harsh environmental conditions.',
    businessValue: 'Delivers solid, long-lasting site infrastructure and foundations to support high-weight mechanical assets. Ensures environmental compliance with drainage and runoff regulations in tropical storm-prone zones.',
    methodology: [
      'Site clearing, excavation, and grading control',
      'Piling and soil improvement works',
      'Reinforcement steel tying and formwork setup',
      'High-strength concrete pouring and curing quality checks',
      'Drainage construction and site paving'
    ],
    equipment: [
      'Piling Rigs',
      'Concrete Mixer Trucks',
      'Heavy Road Graders',
      'Total Station Survey Instruments',
      'Concrete Compression Testing Machines'
    ]
  }
};
