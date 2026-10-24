# Polaris Integrated & GeoSolutions Limited (PIGL)
# Master Service Architecture & Navigation Taxonomy

This document provides a comprehensive blueprint of all services, sub-services, navigation taxonomy, and menu structures implemented across the PIGL corporate web platform.

---

## 1. Global Navigation Menu Structure

The website navigation is implemented via [`components/Navbar.tsx`](file:///Users/Kaycie/Downloads/Companies/PIGL/Projects/PIGL%20Website/components/Navbar.tsx) with a responsive desktop mega menu and a slide-out mobile drawer.

### 1.1 Primary Navigation Items

| # | Menu Item | Route | Menu Type | Sub-items / Behavior |
|---|-----------|-------|-----------|----------------------|
| 1 | **Home** | `/` | Standard Link | Direct page navigation |
| 2 | **About us** | `/about` | Mega Menu | 4 structured sections + Featured corporate card |
| 3 | **Services** | `/services` | Mega Menu | 4 Authoritative Divisions + Featured preview |
| 4 | **Projects** | `/projects` | Standard Link | Selected case studies & project track record |
| 5 | **Partners** | `/partners` | Standard Link | International OEM & technology alliances (Frankstar, CoaleXpert, NPK) |
| 6 | **Blog** | `/blog` | Standard Link | Technical insights & company news |
| 7 | **Careers** | `/careers` | Standard Link | Job openings & talent acquisition |
| 8 | **Contact Us** | `/contact` | Standard Link | Inquiries & office location |

### 1.2 Utility & Action Controls
- **Search**: Global search modal triggering search across services, service families, projects, and technical updates.
- **Download Profile**: Direct modal for downloading the official `PIGL COMPANY PROFILE.pdf`.
- **Get in touch (CTA)**: High-contrast primary action button leading to `/contact`.

---

## 2. "Services" Mega Menu Architecture

The **Services** navigation menu is organized strictly around the **Four Authoritative Divisions**:

```
PIGL SERVICES
|
├── 01. GEOSOLUTIONS & ENGINEERING SERVICES (GES) (/services/geosolutions-engineering-services)
│   ├── Geohazard, Geoscan & Seismic
│   ├── Geophysical & Hydrographic Survey
│   ├── Geotechnical & Foundation Engineering
│   ├── Positioning & Navigation
│   ├── Geospatial, Reality Capture & Digital Engineering
│   └── Laboratory Services
│
├── 02. METOCEAN & MARINE SOLUTIONS (MMS) (/services/metocean-marine-solutions) [Partner: Frankstar Technology]
│   ├── Metocean Observation & Monitoring
│   ├── Marine Forecasting & Intelligence
│   ├── Marine Environmental Services
│   └── Marine Advisory & Operational Support
│
├── 03. INTEGRATED CONSTRUCTION SERVICES (ICS) (/services/integrated-construction-services)
│   ├── Pipeline Construction & Installation
│   ├── Civil & Infrastructure Construction
│   ├── Mechanical, Fabrication & Installation
│   └── Project Delivery, Testing & Commissioning Support
│
└── 04. INDUSTRIAL SOLUTIONS (IS) (/services/industrial-solutions) [Partner: CoaleXpert]
    ├── Produced Water Treatment
    ├── Industrial & Domestic Water
    ├── Water & Environmental Laboratory
    └── Wastewater Treatment & Resource Recovery
```

---

## 3. The 4 Authoritative Divisions & Service Families

### 01. GEOSOLUTIONS & ENGINEERING SERVICES (GES)
- **Canonical Route**: `/services/geosolutions-engineering-services`
- **Abbreviation**: GES
- **Descriptor**: GEOSCIENCE | SURVEY | ENGINEERING | DIGITAL SOLUTIONS
- **Division Positioning**: *"Accurate data. Deeper insight. Smarter engineering."*
- **Purpose**: Present PIGL's geoscience, site investigation, geophysical surveying, hydrographic surveying, positioning, geospatial, digital engineering and geotechnical laboratory capabilities.
- **Service Families (6)**:
  1. **Geohazard, Geoscan & Seismic Services**:
     - HR2D/UHR2D seismic surveys
     - Shallow gas detection
     - Geohazard assessment
  2. **Geophysical & Hydrographic Survey Services**:
     - Multibeam surveys
     - Side-scan sonar
     - Sub-bottom profiling
     - Seabed mapping
  3. **Geotechnical & Foundation Engineering Services**:
     - Cone Penetration Testing (CPT)
     - Borehole investigations
     - Jack-up foundation investigations
     - Soil characterisation
  4. **Precise Positioning & Navigation Services**:
     - Rig positioning
     - Differential GNSS (DGNSS)
     - USBL/LBL positioning
     - Marine construction surveys
  5. **Geospatial, Reality Capture & Digital Engineering**:
     - GIS
     - 3D modelling
     - LiDAR scanning
     - Scan-to-BIM
     - Digital twins
  6. **Laboratory Services**:
     - Soil mechanics testing
     - Rock testing
     - Construction materials testing

---

### 02. METOCEAN & MARINE SOLUTIONS (MMS)
- **Canonical Route**: `/services/metocean-marine-solutions`
- **Abbreviation**: MMS
- **Descriptor**: METOCEAN | MARINE INTELLIGENCE | ENVIRONMENTAL SOLUTIONS
- **Division Positioning**: *"Real-time ocean insight. Safer operations. Informed decisions."*
- **Strategic Alliance**: Frankstar Technology
- **Purpose**: Present marine and ocean observation, forecasting, marine environmental monitoring and operational advisory services.
- **Service Families (4)**:
  1. **Metocean Observation & Monitoring**:
     - Wave measurements
     - Current measurements
     - Tide measurements
     - Weather measurements
     - Acoustic Doppler Current Profilers (ADCP)
     - Buoy deployments
  2. **Marine Forecasting & Intelligence**:
     - Marine weather forecasts
     - Wave models
     - Current models
     - Weather windows
  3. **Marine Environmental Services**:
     - Benthic surveys
     - Water sampling
     - Sediment sampling
     - Marine environmental monitoring
  4. **Marine Advisory & Operational Support**:
     - Metocean design criteria
     - Marine risk assessment
     - Operational decision support

---

### 03. INTEGRATED CONSTRUCTION SERVICES (ICS)
- **Canonical Route**: `/services/integrated-construction-services`
- **Abbreviation**: ICS
- **Descriptor**: PIPELINE | INFRASTRUCTURE | MECHANICAL | CONSTRUCTION DELIVERY
- **Division Positioning**: *"From engineering preparation to successful project delivery."*
- **Purpose**: Present PIGL's pipeline, civil infrastructure, mechanical installation and construction delivery capabilities.
- **Service Families (4)**:
  1. **Pipeline Construction & Installation**:
     - Oil and gas pipelines
     - Flowlines
     - Gathering lines
     - Welding
     - Tie-ins
     - Hydrostatic testing
  2. **Civil & Infrastructure Construction**:
     - Earthworks
     - Foundations
     - Access roads
     - Drainage
     - Site development
  3. **Mechanical, Fabrication & Installation**:
     - Structural steel
     - Process piping
     - Equipment installation
     - Modular facilities
  4. **Project Delivery, Testing & Commissioning Support**:
     - Engineering support
     - Procurement support
     - Installation coordination
     - Testing
     - Pre-commissioning
     - Commissioning
     - Handover

---

### 04. INDUSTRIAL SOLUTIONS (IS)
- **Canonical Route**: `/services/industrial-solutions`
- **Abbreviation**: IS
- **Descriptor**: WATER TREATMENT | PROCESS SOLUTIONS | ENVIRONMENTAL SERVICES
- **Division Positioning**: *"Cleaner water. Healthier communities. Sustainable industries."*
- **Strategic Alliance**: CoaleXpert
- **Purpose**: Present PIGL's produced-water, industrial/domestic water, laboratory and wastewater treatment capabilities.
- **Service Families (4)**:
  1. **Produced Water Treatment Solutions**:
     - Oil-water separation
     - Filtration
     - Chemical treatment
     - Modular treatment skids
     - Performance monitoring
  2. **Industrial & Domestic Water Solutions**:
     - Process water
     - Potable water
     - Borehole water treatment
     - Reverse osmosis (RO) systems
     - Water supply
  3. **Water & Environmental Laboratory Services**:
     - Water-quality analysis
     - Oil-in-water analysis
     - Metals analysis
     - Microbiological testing
     - Chemical testing
  4. **Wastewater Treatment & Resource Recovery**:
     - Effluent treatment
     - Water recycling
     - Packaged treatment plants
     - Operations and maintenance

---

## 4. Legacy URL Routing & Redirect Map

To ensure no broken links or SEO loss, all prior and intermediate URLs are automatically rewritten to the four canonical routes via `LEGACY_SERVICE_MAP`:

| Legacy / Intermediate Route | Redirects to Canonical Route |
|-----------------------------|------------------------------|
| `/services/geo-data-intelligence` | `/services/geosolutions-engineering-services` |
| `/services/ground-intelligence` | `/services/geosolutions-engineering-services` |
| `/services/digital-mapping-intelligence` | `/services/geosolutions-engineering-services` |
| `/services/digital-intelligence` | `/services/geosolutions-engineering-services` |
| `/services/reality-capture` | `/services/geosolutions-engineering-services` |
| `/services/marine-intelligence` | `/services/metocean-marine-solutions` |
| `/services/offshore-intelligence` | `/services/metocean-marine-solutions` |
| `/services/continuous-marine-intelligence` | `/services/metocean-marine-solutions` |
| `/services/asset-integrity-intelligence` | `/services/integrated-construction-services` |
| `/services/integrated-engineering-construction` | `/services/integrated-construction-services` |
| `/services/engineering-industrial-environmental-solutions` | `/services/industrial-solutions` |
| `/services/industrial-environmental` | `/services/industrial-solutions` |
| `/services/water-engineering` | `/services/industrial-solutions` |
| Shorthand `/services/ges` | `/services/geosolutions-engineering-services` |
| Shorthand `/services/mms` | `/services/metocean-marine-solutions` |
| Shorthand `/services/ics` | `/services/integrated-construction-services` |
| Shorthand `/services/is` | `/services/industrial-solutions` |
