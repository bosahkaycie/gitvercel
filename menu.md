# Polaris Integrated & GeoSolutions Limited (PIGL)
# Master Service Architecture & Navigation Taxonomy

This document provides a comprehensive blueprint of all services, sub-services, navigation taxonomy, and menu structures implemented across the PIGL corporate web platform.

---

## 1. Global Navigation Menu Structure

The website navigation is implemented via [`components/Navbar.tsx`](file:///Users/Kaycie/Downloads/PIGL%20Website/components/Navbar.tsx) with a responsive desktop mega menu and a slide-out mobile drawer.

### 1.1 Primary Navigation Items

| # | Menu Item | Route | Menu Type | Sub-items / Behavior |
|---|-----------|-------|-----------|----------------------|
| 1 | **Home** | `/` | Standard Link | Direct page navigation |
| 2 | **About us** | `/about` | Mega Menu | 4 structured sections + Featured corporate card |
| 3 | **Services** | `/services` | Mega Menu | 5 Canonical Master Platforms + Featured preview |
| 4 | **Projects** | `/projects` | Standard Link | Selected case studies & project track record |
| 5 | **Partners** | `/partners` | Standard Link | International OEM & technology alliances (Frankstar, CoaleXpert, NPK) |
| 6 | **Blog** | `/blog` | Standard Link | Technical insights & company news |
| 7 | **Careers** | `/careers` | Standard Link | Job openings & talent acquisition |
| 8 | **Contact Us** | `/contact` | Standard Link | Inquiries & office location |

### 1.2 Utility & Action Controls
- **Search**: Global search modal triggering search across services, projects, and technical updates.
- **Download Profile**: Direct modal for downloading the official `PIGL COMPANY PROFILE.pdf`.
- **Get in touch (CTA)**: High-contrast primary action button leading to `/contact`.

---

## 2. "Services" Mega Menu Architecture

The **Services** navigation menu is organized strictly around the **Five Top-Level Platforms**:

```
Services
├── 01. GEO DATA INTELLIGENCE (/services/geo-data-intelligence)
│   ├── Geotechnical
│   ├── Geophysical
│   └── Geospatial
├── 02. DIGITAL MAPPING INTELLIGENCE (/services/digital-mapping-intelligence)
│   ├── Topographic Mapping
│   ├── 3D Reality Capture
│   ├── Geomatics
│   └── Digital Engineering
├── 03. MARINE INTELLIGENCE (/services/marine-intelligence) [Partner: Frankstar Technology]
│   ├── Marine & Seabed Survey
│   ├── Hydrographic Survey
│   ├── Continuous Marine Intelligence
│   └── MetOcean
├── 04. ASSET INTEGRITY INTELLIGENCE (/services/asset-integrity-intelligence)
│   ├── Inspection & NDT
│   ├── Monitoring
│   ├── Maintenance & Repairs
│   └── ROV & Subsea
└── 05. ENGINEERING, INDUSTRIAL & ENVIRONMENTAL SOLUTIONS (/services/engineering-industrial-environmental-solutions) [Partner: CoaleXpert • NPK Automation]
    ├── Water Engineering
    ├── Wastewater Treatment
    ├── Produced Water Treatment
    ├── Flow Control & Valves
    └── Pipeline & Civil Engineering
```

---

## 3. The 5 Master Service Platforms & Service Families

### 01. GEO DATA INTELLIGENCE
- **Canonical Route**: `/services/geo-data-intelligence`
- **Legacy Aliases**: `/services/ground-intelligence`, `/services/geotechnical-services`, `/services/seismic-services`
- **Tagline**: *"Understand the ground, build with confidence."*
- **Purpose**: Services focused on understanding land, ground, subsurface, and terrestrial geospatial conditions.
- **Primary Service Families**:
  - **A. Geotechnical & Site Investigation**:
    - Geotechnical Investigation
    - Geotechnical Sampling
    - CPT / CPTu (20-Ton Hydraulic)
    - SPT (Standard Penetration Testing)
    - Borehole Investigation & Rotary Coring
    - Soil & Rock Investigation
    - In Situ Testing & Soil Mechanics Laboratory
    - Foundation Investigation
  - **B. Onshore Geophysical Investigation**:
    - Onshore Geophysical Survey
    - Seismic Services (2D/3D Refraction & Reflection)
    - Seismic Refraction
    - Electrical Resistivity Tomography (ERT)
    - Subsurface Characterisation
    - Geological Investigation
  - **C. Land & Geospatial Survey**:
    - Land Surveying & Boundary Demarcation
    - Geodetic Survey & Primary Control Networks
    - Survey Control
    - Terrestrial GIS
    - UAV Survey

---

### 02. DIGITAL MAPPING INTELLIGENCE
- **Canonical Route**: `/services/digital-mapping-intelligence`
- **Legacy Aliases**: `/services/digital-intelligence`, `/services/reality-capture`, `/services/3d-laser-scanning`, `/services/digital-twins`, `/services/spatial-intelligence`
- **Tagline**: *"Capture reality, create certainty."*
- **Purpose**: Services focused on mapping, capturing, modelling, and digitally representing physical environments, facilities, and assets.
- **Primary Service Families**:
  - **A. Topographic & Aerial Mapping**:
    - Topographic Survey
    - UAV Mapping & Drone LiDAR
    - Aerial Mapping & Photogrammetry
    - Digital Terrain Mapping (DEM/DTM)
  - **B. Geomatics & Spatial Data**:
    - Geomatics & Spatial Geodesy
    - GIS Spatial Databases
    - Geospatial Data Acquisition
    - Geospatial Data Processing
  - **C. 3D Reality Capture**:
    - 3D Reality Capture
    - 3D Terrestrial & Mobile Laser Scanning (Leica RTC360 & P50)
    - Point Cloud Acquisition
    - Point Cloud Processing & Registration
    - 3D Modelling
    - As-Built Documentation
  - **D. Digital Engineering**:
    - Scan to BIM & Intelligent 3D CAD
    - BIM Ready Data
    - CAD Ready Data
    - Dimensional Control
    - Clash Detection & Pre-fabrication Verification
    - Operational Digital Twins
    - Brownfield Digitalisation
    - Modification & Tie-In Planning
  - **E. Digital Asset Mapping**:
    - Asset Verification
    - Digital Asset Documentation
    - Geometric Verification
    - Deformation Monitoring

---

### 03. MARINE INTELLIGENCE
- **Canonical Route**: `/services/marine-intelligence`
- **Legacy Aliases**: `/services/offshore-intelligence`, `/services/geophysical-surveys`, `/services/metocean`, `/services/hydrographic-survey`, `/services/seabed-mapping`, `/services/search-and-salvage`
- **Tagline**: *"From seabed conditions to ocean dynamics."*
- **Purpose**: Marine survey, seabed intelligence, hydrography, MetOcean, and marine environmental monitoring.
- **Strategic Technology Partner**: **Frankstar Technology** *(Oceanographic Observation & MetOcean Telemetry)*
- **Primary Service Families**:
  - **A. Marine & Seabed Survey**:
    - Marine Geophysical Survey
    - Marine Seabed Survey
    - Seabed Mapping
    - Sub-Bottom Profiling (Chirp/Pinger towfish)
    - Side-Scan Sonar
    - Seabed Hazard Detection & Pipeline Route Clearance
  - **B. Hydrographic & Bathymetric Survey**:
    - Hydrographic Survey
    - Multibeam Echo Sounding
    - Single-Beam Survey
    - Bathymetric Depth Mapping
    - Channel / Harbour / Port Approach Survey
  - **C. Marine Positioning & Subsea Survey Support**:
    - Marine Positioning
    - Offshore Surface Positioning
    - Subsea Acoustic Positioning (USBL/LBL)
    - Subsea Metrology
  - **D. Search & Salvage**:
    - Search & Salvage Operations
    - Lost Submerged Asset Location
    - Submerged Asset Recovery
  - **E. Continuous Marine Intelligence (MetOcean)**:
    - **MetOcean & Oceanographic Monitoring**:
      - Meteorological Monitoring Stations
      - Oceanographic Monitoring Buoys (Frankstar)
      - Wave Monitoring & Telemetry
      - Current Profiling (ADCP)
      - Tide Measurement & Coastal Gauges
    - **Marine Environmental Intelligence**:
      - Marine Environmental Monitoring
      - Marine Water Quality Monitoring & Telemetry
      - Environmental Baseline Monitoring
      - Marine Ecosystem Monitoring
      - Environmental Data Acquisition
    - **Real-Time Marine Monitoring**:
      - Continuous Data Acquisition
      - Real-Time Data Transmission (Satellite & 4G Telemetry)
      - Remote Marine Monitoring
      - Construction & Dredging Monitoring
      - Operational Marine Safety Monitoring

---

### 04. ASSET INTEGRITY INTELLIGENCE
- **Canonical Route**: `/services/asset-integrity-intelligence`
- **Legacy Aliases**: `/services/asset-integrity`, `/services/asset-integrity-management`, `/services/asset-inspection`, `/services/facility-maintenance`, `/services/ndt-inspection`
- **Tagline**: *"Assure structural reliability, prevent catastrophic downtime."*
- **Purpose**: Inspection, monitoring, maintenance, repair, and integrity management of physical and subsea assets.
- **Primary Service Families**:
  - **A. Inspection & NDT**:
    - Asset Inspection
    - Structural Inspection
    - Visual Inspection
    - Non-Destructive Testing (NDT)
    - Phased Array Ultrasonic Testing (PAUT)
    - Magnetic Particle Testing (MPI)
    - Radiographic Testing (RT)
    - Subsea Structural Inspection
  - **B. Integrity Monitoring**:
    - Corrosion Monitoring & Mapping
    - Ultrasonic Wall Thickness Measurement
    - Structural Health Monitoring
    - Condition Monitoring
    - Deformation Monitoring
    - Asset Condition Assessment & Remaining Life Review
  - **C. Maintenance & Repairs**:
    - Preventive Maintenance
    - Corrective Maintenance
    - Mechanical Maintenance
    - Facility Maintenance & Overhauls
    - Equipment Maintenance
    - Plant Repairs & Rehabilitation
  - **D. ROV & Subsea Integrity**:
    - ROV Inspection
    - Subsea Asset Inspection
    - Pipeline Subsea Inspection
    - Subsea Structure & Jacket Inspection
    - ROV Operational Support
  - **E. Digital Asset Integrity**:
    - Digital Asset Documentation
    - Digital Inspection Records
    - 3D Asset Defect Documentation
    - Digital Twin for Asset Integrity Management

---

### 05. ENGINEERING, INDUSTRIAL & ENVIRONMENTAL SOLUTIONS
- **Canonical Route**: `/services/engineering-industrial-environmental-solutions`
- **Legacy Aliases**: `/services/integrated-engineering-construction`, `/services/industrial-environmental-technologies`, `/services/pipeline-construction`, `/services/water-engineering`, `/services/produced-water-treatment`, `/services/valves-and-actuators`, `/services/integrated-valve-maintenance`
- **Tagline**: *"From engineered infrastructure to process treatment and industrial flow delivery."*
- **Purpose**: Engineering, water, treatment, flow control, valves, infrastructure, and industrial field delivery.
- **Strategic Technology Partners**:
  - **CoaleXpert** *(Industrial Produced Water & Wastewater Separation)*
  - **NPK Automation** *(Industrial Flow Control Valves & Actuators)*
- **Primary Service Families**:
  - **A. Water Engineering**:
    - Water Engineering & Skid Systems
    - Industrial Water Systems
    - Process Water Systems
    - Water Treatment Engineering
    - Water Reuse Systems
  - **B. Wastewater Treatment**:
    - Industrial Wastewater Treatment
    - Effluent Treatment
    - Wastewater Treatment Plants
    - Oil-Water Separation Skids
    - Ultrafiltration & Membrane Polishing
    - Treatment Skids
  - **C. Produced Water Treatment**:
    - Produced Water Treatment & De-oiling (CoaleXpert)
    - Produced Water Separation
    - Oil-in-Water Reduction (< 15 ppm compliance)
    - Produced Water Filtration
    - Produced Water Reuse
    - Produced Water Reinjection Support
    - Treatment Plant Optimisation
  - **D. Environmental & Mitigation Services**:
    - Environmental Assessment & Compliance
    - Terrestrial & Coastal Environmental Monitoring
    - Pollution Prevention
    - Environmental Mitigation
    - Remediation Support
    - Industrial Waste Management Solutions
  - **E. Flow Control & Valve Solutions**:
    - Industrial Valves (Ball, Gate, Globe, Butterfly, Check)
    - Electric, Pneumatic & Hydraulic Actuators
    - Automated Valve Packages
    - Control Valves & Emergency Shutdown Valves (SDV)
  - **F. Integrated Valve Maintenance Services**:
    - Valve Inspection & Bench Testing
    - Valve Servicing & Overhaul
    - Actuator Maintenance & Calibration
    - In-Situ Testing & Pressure Testing
    - Preventive & Corrective Maintenance
    - Spares, Seals & Replacement Support
    - Lifecycle Valve Support
  - **G. Pipeline & Construction**:
    - API 1104 Pipeline Fabrication
    - Pipe Laying & Stringing
    - Pipeline Trenching & Lowering
    - Certified Welding & NDT
    - Hydrostatic Testing
  - **H. Civil & Infrastructure**:
    - Site Preparation & Earthworks
    - Heavy Industrial Piling
    - Structural Concrete Foundations
    - Swamp Access Road Construction
    - Quayside Infrastructure Construction
    - Swamp Terrain Geotextile Rehabilitation
  - **I. Field Engineering & Project Support**:
    - Amphibious Swamp Operations ("Swamp Cats")
    - Nearshore Marine Support
    - Offshore Construction Support
    - Rig Positioning & Tug Management
    - Anchor Handling
    - Field Logistics & Equipment Staging

---

## 4. Main `/services` Landing Page Architecture

The main `/services` landing page functions strictly as a **High-Level Service Discovery Page** as dictated by Master Directives:
- Displays **ONLY** the 5 primary platforms.
- Does **NOT** display exhaustive sub-service catalogues, long bullet lists, or testing method inventories.
- Displays **3–5 representative capabilities** per platform:

| Platform | Representative Capabilities Displayed on `/services` |
|----------|-------------------------------------------------------|
| **01. Geo Data Intelligence** | Geotechnical Investigation • Geophysical Investigation • CPT / Site Investigation • Geospatial Survey |
| **02. Digital Mapping Intelligence** | Topographic Survey • 3D Reality Capture • Geomatics • Digital Engineering |
| **03. Marine Intelligence** | Marine & Seabed Survey • Hydrographic Survey • MetOcean • Continuous Marine Monitoring |
| **04. Asset Integrity Intelligence** | Inspection & NDT • Integrity Monitoring • Maintenance & Repairs • ROV & Subsea Integrity |
| **05. Engineering, Industrial & Environmental Solutions** | Water Engineering • Wastewater Treatment • Produced Water Treatment • Flow Control & Valve Solutions • Pipeline & Civil Engineering |

---

## 5. Strategic Technology Partners & Alignment

| Technology Partner | Primary Canonical Home | Technology Scope |
|--------------------|------------------------|------------------|
| **Frankstar Technology** | `03. Marine Intelligence` → Continuous Marine Intelligence | Oceanographic weather buoys, wave monitoring, ADCP current profiling, satellite marine telemetry |
| **CoaleXpert** | `05. Engineering, Industrial & Environmental Solutions` → Produced Water Treatment | High-efficiency produced water separation, oil-in-water reduction skids, industrial wastewater treatment |
| **NPK Automation** | `05. Engineering, Industrial & Environmental Solutions` → Flow Control & Valve Solutions | Industrial flow control valves, electric/pneumatic automated actuator packages, integrated valve overhaul |

---

## 6. Backward Compatibility & Legacy URL Mapping Matrix

The application provides automatic 301-equivalent redirect handling from historical URLs to the 5 Canonical Platforms via `LEGACY_SERVICE_MAP` in [`site_data.tsx`](file:///Users/Kaycie/Downloads/PIGL%20Website/site_data.tsx) and [`App.tsx`](file:///Users/Kaycie/Downloads/PIGL%20Website/App.tsx):

| Legacy Route | Canonical Target Route | Canonical Platform |
|--------------|------------------------|--------------------|
| `/services/ground-intelligence` | `/services/geo-data-intelligence` | 01. Geo Data Intelligence |
| `/services/geotechnical-services` | `/services/geo-data-intelligence` | 01. Geo Data Intelligence |
| `/services/onshore-nearshore-geotechnical` | `/services/geo-data-intelligence` | 01. Geo Data Intelligence |
| `/services/seismic-services` | `/services/geo-data-intelligence` | 01. Geo Data Intelligence |
| `/services/geotechnical-sampling` | `/services/geo-data-intelligence` | 01. Geo Data Intelligence |
| `/services/cpt-testing` | `/services/geo-data-intelligence` | 01. Geo Data Intelligence |
| `/services/digital-intelligence` | `/services/digital-mapping-intelligence` | 02. Digital Mapping Intelligence |
| `/services/reality-capture` | `/services/digital-mapping-intelligence` | 02. Digital Mapping Intelligence |
| `/services/3d-laser-scanning` | `/services/digital-mapping-intelligence` | 02. Digital Mapping Intelligence |
| `/services/digital-twins` | `/services/digital-mapping-intelligence` | 02. Digital Mapping Intelligence |
| `/services/spatial-intelligence` | `/services/digital-mapping-intelligence` | 02. Digital Mapping Intelligence |
| `/services/geomatics` | `/services/digital-mapping-intelligence` | 02. Digital Mapping Intelligence |
| `/services/geomatics-services` | `/services/digital-mapping-intelligence` | 02. Digital Mapping Intelligence |
| `/services/topographic-mapping` | `/services/digital-mapping-intelligence` | 02. Digital Mapping Intelligence |
| `/services/offshore-intelligence` | `/services/marine-intelligence` | 03. Marine Intelligence |
| `/services/geophysical-surveys` | `/services/marine-intelligence` | 03. Marine Intelligence |
| `/services/hydrographic-survey` | `/services/marine-intelligence` | 03. Marine Intelligence |
| `/services/seabed-mapping` | `/services/marine-intelligence` | 03. Marine Intelligence |
| `/services/metocean` | `/services/marine-intelligence` | 03. Marine Intelligence |
| `/services/continuous-marine-intelligence` | `/services/marine-intelligence` | 03. Marine Intelligence |
| `/services/climate-environmental-metocean` | `/services/marine-intelligence` | 03. Marine Intelligence |
| `/services/environmental-survey` | `/services/marine-intelligence` | 03. Marine Intelligence |
| `/services/search-and-salvage` | `/services/marine-intelligence` | 03. Marine Intelligence |
| `/services/asset-integrity` | `/services/asset-integrity-intelligence` | 04. Asset Integrity Intelligence |
| `/services/asset-integrity-management` | `/services/asset-integrity-intelligence` | 04. Asset Integrity Intelligence |
| `/services/asset-integrity-services` | `/services/asset-integrity-intelligence` | 04. Asset Integrity Intelligence |
| `/services/asset-inspection` | `/services/asset-integrity-intelligence` | 04. Asset Integrity Intelligence |
| `/services/facility-maintenance` | `/services/asset-integrity-intelligence` | 04. Asset Integrity Intelligence |
| `/services/rov-inspection` | `/services/asset-integrity-intelligence` | 04. Asset Integrity Intelligence |
| `/services/ndt-inspection` | `/services/asset-integrity-intelligence` | 04. Asset Integrity Intelligence |
| `/services/integrated-engineering-construction` | `/services/engineering-industrial-environmental-solutions` | 05. Engineering, Industrial & Environmental Solutions |
| `/services/industrial-environmental-technologies` | `/services/engineering-industrial-environmental-solutions` | 05. Engineering, Industrial & Environmental Solutions |
| `/services/pipeline-construction` | `/services/engineering-industrial-environmental-solutions` | 05. Engineering, Industrial & Environmental Solutions |
| `/services/infrastructure-construction` | `/services/engineering-industrial-environmental-solutions` | 05. Engineering, Industrial & Environmental Solutions |
| `/services/civil-works` | `/services/engineering-industrial-environmental-solutions` | 05. Engineering, Industrial & Environmental Solutions |
| `/services/water-engineering` | `/services/engineering-industrial-environmental-solutions` | 05. Engineering, Industrial & Environmental Solutions |
| `/services/produced-water-treatment` | `/services/engineering-industrial-environmental-solutions` | 05. Engineering, Industrial & Environmental Solutions |
| `/services/wastewater-treatment` | `/services/engineering-industrial-environmental-solutions` | 05. Engineering, Industrial & Environmental Solutions |
| `/services/valves-and-actuators` | `/services/engineering-industrial-environmental-solutions` | 05. Engineering, Industrial & Environmental Solutions |
| `/services/flow-control-and-automation` | `/services/engineering-industrial-environmental-solutions` | 05. Engineering, Industrial & Environmental Solutions |
| `/services/integrated-valve-maintenance` | `/services/engineering-industrial-environmental-solutions` | 05. Engineering, Industrial & Environmental Solutions |

---

## 7. Technical Implementation Files

- **Navigation Header & Mega Menu**: [`components/Navbar.tsx`](file:///Users/Kaycie/Downloads/PIGL%20Website/components/Navbar.tsx)
- **Primary Static Catalog & Legacy Map**: [`site_data.tsx`](file:///Users/Kaycie/Downloads/PIGL%20Website/site_data.tsx)
- **Technical Specs & Deliverables Data**: [`pages/ServicesDetailsData.tsx`](file:///Users/Kaycie/Downloads/PIGL%20Website/pages/ServicesDetailsData.tsx)
- **Services Hub Discovery Page**: [`pages/Services.tsx`](file:///Users/Kaycie/Downloads/PIGL%20Website/pages/Services.tsx)
- **Service Detail Dynamic Page**: [`pages/ServiceDetail.tsx`](file:///Users/Kaycie/Downloads/PIGL%20Website/pages/ServiceDetail.tsx)
- **Type Definitions**: [`types.ts`](file:///Users/Kaycie/Downloads/PIGL%20Website/types.ts)
- **CMS / Supabase Data Layer**: [`hooks/useSupabaseData.ts`](file:///Users/Kaycie/Downloads/PIGL%20Website/hooks/useSupabaseData.ts)
