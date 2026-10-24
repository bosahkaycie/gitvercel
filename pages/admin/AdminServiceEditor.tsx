import React, { useState } from 'react';
import { CMSService, ServiceGalleryImage, ServiceDeliverableItem, SubService } from '../../types';
import ImageUploader from '../../components/admin/ImageUploader';
import { SERVICE_GALLERY_PRESETS, getEmbedVideoUrl } from '../ServicesDetailsData';
import NativeVideoPlayer from '../../components/NativeVideoPlayer';
import { IconPlus, IconTrash, IconCheck } from '../../components/admin/AdminIcons';
import { getDeliverableDetails } from '../../data/serviceDeliverablesData';

interface AdminServiceEditorProps {
  initialData?: CMSService | null;
  onSave: (service: Partial<CMSService> & { title: string; category: string }) => Promise<any>;
  onCancel: () => void;
  theme?: 'light' | 'dark';
}

const SUGGESTED_DELIVERABLES: Record<string, string[]> = {
  'GeoSolutions & Engineering Services': [
    'HR2D/UHR2D seismic surveys',
    'Shallow gas detection & geohazard assessment',
    'Multibeam surveys & seabed mapping',
    'Side-scan sonar & sub-bottom profiling',
    'Cone Penetration Testing (CPT) soundings',
    'Borehole investigations & soil characterisation',
    'Rig positioning & USBL/LBL positioning',
    'GIS, 3D modelling & LiDAR scanning',
    'Scan-to-BIM & digital twins',
    'Soil mechanics & rock laboratory testing'
  ],
  'Metocean & Marine Solutions': [
    'Wave, current & tide measurements',
    'Weather measurements & ADCP current profiling',
    'Oceanographic buoy deployments',
    'Marine weather forecasts & wave models',
    'Benthic surveys & marine environmental monitoring',
    'Water & sediment field sampling',
    'Metocean design criteria & marine risk assessment'
  ],
  'Integrated Construction Services': [
    'Oil and gas pipelines & flowlines installation',
    'Gathering lines, welding & tie-ins',
    'Hydrostatic testing & pre-commissioning',
    'Earthworks & foundations construction',
    'Access roads, drainage & site development',
    'Structural steel & process piping fabrication',
    'Modular facilities & equipment installation',
    'Project delivery & commissioning support'
  ],
  'Industrial Solutions': [
    'Produced water oil-water separation',
    'Produced water filtration & chemical treatment',
    'Modular treatment skids & performance monitoring',
    'Process water & potable water systems',
    'Borehole water treatment & reverse osmosis (RO)',
    'Water-quality & oil-in-water laboratory analysis',
    'Metals & microbiological laboratory testing',
    'Effluent treatment & water recycling plants'
  ]
};

const CATEGORIES_LIST = [
  { name: 'GeoSolutions & Engineering Services (GES)', division: 'GeoSolutions & Engineering Services' as const },
  { name: 'Metocean & Marine Solutions (MMS)', division: 'Metocean & Marine Solutions' as const },
  { name: 'Integrated Construction Services (ICS)', division: 'Integrated Construction Services' as const },
  { name: 'Industrial Solutions (IS)', division: 'Industrial Solutions' as const },
];

export const ALL_OPERATIONAL_ASSETS: { url: string; title: string; caption: string; tag: string }[] = [
  // Ground
  { url: '/assets/cpt.png', title: '20-Ton Hydraulic CPT Penetrometer Rig', caption: 'Continuous hydraulic piezocone penetration testing (CPTu) profiling soil stratigraphy and tip resistance.', tag: 'Ground Intelligence' },
  { url: '/assets/operations/pigl_offshore_geotech_drilling_barge.jpg', title: 'Nearshore & Swamp Geotechnical Drilling Barge', caption: 'Heavy-duty pontoon-mounted drilling platform conducting deep exploratory soil borings in river estuaries.', tag: 'Ground Intelligence' },
  { url: '/assets/operations/pigl_offshore_drill_crew_casing.jpg', title: 'PIGL Offshore Drill Crew Running Heavy Casing', caption: 'Experienced Nigerian drilling personnel installing conductor casing and recovering undisturbed core samples.', tag: 'Ground Intelligence' },
  { url: '/assets/ground_intel_geotech.jpg', title: 'Hydraulic Rig & In-Situ SPT Sampling Unit', caption: 'Standard Penetration Testing and hydraulic coring unit executing geotechnical site characterization.', tag: 'Ground Intelligence' },
  { url: '/assets/drilling.png', title: 'Deep Rotary Geotechnical Borehole Rig', caption: 'High-torque rotary rig recovering continuous rock cores and deep foundation soil mechanics data.', tag: 'Ground Intelligence' },
  { url: '/assets/seismic_survey.png', title: 'High-Resolution Seismic Acquisition Spread', caption: 'Multi-channel digital seismic refraction/reflection spreads mapping bedrock topography and fault lines.', tag: 'Ground Intelligence' },
  // Digital
  { url: '/assets/operations/pigl_3d_reality_capture_jetty_plant.jpg', title: 'Jetty & Petrochemical Facility 3D Reality Capture', caption: 'High-density spherical laser scanning capturing critical pipe racks, manifold valves, and structural geometries.', tag: 'Digital Intelligence' },
  { url: '/assets/operations/pigl_3d_laser_scan_facility_cooler.jpg', title: 'Industrial Gas Facility Fin-Fan Cooler Laser Scan', caption: 'Millimeter-accurate point cloud acquisition on heat exchangers and process piping for brownfield revamp.', tag: 'Digital Intelligence' },
  { url: '/assets/operations/pigl_3d_laser_scan_manifold_station.jpg', title: 'Flow Station Header & Manifold Station Point Cloud', caption: 'Comprehensive spatial capture of complex valve networks and interconnecting spools to eliminate clash rework.', tag: 'Digital Intelligence' },
  { url: '/assets/digital_intel_scanner.jpg', title: 'Leica RTC360 High-Speed Terrestrial 3D Scanner', caption: 'High-speed HDR reality capture instrument deployed in hazardous Nigerian oil and gas operating environments.', tag: 'Digital Intelligence' },
  { url: '/assets/digitwin.png', title: 'Intelligent As-Built BIM / Digital Twin CAD Model', caption: 'Autodesk Plant 3D and Revit parametric models extracted directly from registered laser scan point clouds.', tag: 'Digital Intelligence' },
  { url: '/assets/operations/pigl_geomatics_survey_quay.jpg', title: 'Industrial Quayside & Marine Geomatics Survey', caption: 'High-precision geodetic control networks and dimensional verification surveys along coastal jetty quaysides.', tag: 'Digital Intelligence' },
  // Offshore
  { url: '/assets/marine_intel_metocean.jpg', title: 'Offshore MetOcean Observation & Telemetry Buoy', caption: 'Continuous oceanographic monitoring deploying acoustic Doppler current profilers and wave telemetry.', tag: 'Offshore Intelligence' },
  { url: '/assets/operations/pigl_subbottom_profiler_sb216s.jpg', title: 'Subsea Sub-Bottom Acoustic Profiler SB-216S', caption: 'High-resolution acoustic towfish deployment for shallow seabed stratigraphy, buried pipeline tracking, and gas hazards.', tag: 'Offshore Intelligence' },
  { url: '/assets/operations/pigl_marine_crew_vessel.jpg', title: 'Dedicated Hydrographic Survey Support Vessel', caption: 'PIGL coastal survey craft configured with multi-beam echo sounders, gyrocompasses, and hydroacoustic tracking.', tag: 'Offshore Intelligence' },
  { url: '/assets/operations/pigl_offshore_winch_pigl_container.jpg', title: 'Survey Deck Winch & Instrumented Container', caption: 'Mobilization of deck handling equipment and air-conditioned instrumentation laboratory for offshore geophysics.', tag: 'Offshore Intelligence' },
  { url: '/assets/field_operations_marine.jpg', title: 'Nearshore Bathymetry & Seabed Profiling', caption: 'Dual-frequency acoustic bathymetry, side-scan sonar, and marine magnetics mapping for pipeline landfalls.', tag: 'Offshore Intelligence' },
  { url: '/assets/new-barge.png', title: 'Shallow-Water Geophysical Survey Barge', caption: 'Customized marine barge spread delivering precise navigation and seabed clearance in shallow delta estuaries.', tag: 'Offshore Intelligence' },
  // Asset Integrity
  { url: '/assets/asset_integrity_ndt.jpg', title: 'Pressure Vessel NDT Ultrasonic Scanning', caption: 'Certified Non-Destructive Testing, phased array ultrasonics, and wall-thickness profiling on processing vessels.', tag: 'Asset Integrity' },
  { url: '/assets/IMG_6170.jpg', title: 'PIGL Technical Integrity Inspection Team', caption: 'Certified inspection engineers mobilizing with precision ultrasonic and acoustic emission diagnostic instrumentation.', tag: 'Asset Integrity' },
  { url: '/assets/operations/pigl_pipeline_marine_welding.jpg', title: 'Structural Weld Integrity & Hydrostatic Testing', caption: 'Volumetric weld inspection, PAUT flaw verification, and hydrostatic pressure containment validation.', tag: 'Asset Integrity' },
  { url: '/assets/asset_management.png', title: 'Acoustic Emission Structural Health Monitoring', caption: 'Continuous micro-acoustic fracture sensing and structural life-extension analysis for industrial plants.', tag: 'Asset Integrity' },
  { url: '/assets/engineering_procure_flanges.jpg', title: 'Mechanical Spool & Flange Quality Assurance', caption: 'Critical high-pressure piping component metallurgy verification, bolt tensioning checks, and dimensional audits.', tag: 'Asset Integrity' },
  { url: '/assets/IMG_6558.jpg', title: 'Hydrostatic Field Quality & Pressure Verification', caption: 'API-compliant pressure testing and leak detection on high-pressure pipelines prior to commercial commissioning.', tag: 'Asset Integrity' },
  // EPC / Infrastructure
  { url: '/assets/operations/pigl_pipeline_construction_swamp_cat.jpg', title: 'Swamp Excavator Pipeline Trenching & Clearing', caption: 'Specialized low-ground-pressure swamp cat excavators executing pipeline trenching in waterlogged delta terrain.', tag: 'Infrastructure & EPC' },
  { url: '/assets/newpipeline.png', title: 'Cross-Country Pipeline Stringing & Lowering-In', caption: 'Heavy-duty sideboom crawler fleet stringing and lowering certified welded pipe into prepared swamp trenches.', tag: 'Infrastructure & EPC' },
  { url: '/assets/pigl_pipeline_clearing_aerial.jpg', title: 'Pipeline Right-of-Way (ROW) Aerial Geomatics', caption: 'High-resolution drone aerial mapping and environmental monitoring of cleared pipeline right-of-way corridors.', tag: 'Infrastructure & EPC' },
  { url: '/assets/access-road.jpg', title: 'Heavy Civil Infrastructure & Access Road Construction', caption: 'Heavy-duty crushed aggregate road construction, geotextile stabilization, and hydraulic drainage works.', tag: 'Infrastructure & EPC' },
  { url: '/assets/water_treatment_skid.jpg', title: 'Produced Water & Oil Separation Treatment Skid', caption: 'CoaleXpert high-efficiency modular coalescing water treatment system deployed for environmental discharge compliance.', tag: 'Infrastructure & EPC' },
  { url: '/assets/operations/pigl_logistics_base_aerial.jpg', title: 'PIGL Port Harcourt Operational Base & Yard', caption: 'Aerial view of PIGL engineering fabrication yard, equipment staging area, and vessel berthing quayside.', tag: 'Infrastructure & EPC' }
];

const AdminServiceEditor: React.FC<AdminServiceEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [category, setCategory] = useState(initialData?.category || CATEGORIES_LIST[0].name);
  const [division, setDivision] = useState<any>(
    initialData?.division || CATEGORIES_LIST[0].division
  );
  const [abbreviation, setAbbreviation] = useState(initialData?.abbreviation || '');
  const [descriptor, setDescriptor] = useState(initialData?.descriptor || '');
  const [positioning, setPositioning] = useState(initialData?.positioning || '');
  const [tagline, setTagline] = useState(initialData?.tagline || '');
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || '');
  const [fullDescription, setFullDescription] = useState(initialData?.full_description || '');
  const [businessValue, setBusinessValue] = useState(initialData?.business_value || '');
  const [heroImage, setHeroImage] = useState(initialData?.hero_image || '/assets/DJI_0003.jpg');
  const [cardImage, setCardImage] = useState(initialData?.card_image || '/assets/DJI_0003.jpg');
  const [heroHeading, setHeroHeading] = useState(initialData?.hero_heading || '');
  const [overviewHeading, setOverviewHeading] = useState(initialData?.overview_heading || '');
  const [engineeringProblemAddressed, setEngineeringProblemAddressed] = useState(initialData?.engineering_problem_addressed || '');

  // SubServices / Core Capabilities State
  const [subServices, setSubServices] = useState<SubService[]>(() => {
    if (initialData?.subServices && initialData.subServices.length > 0) {
      return initialData.subServices;
    }
    return [];
  });
  const [newSubTitle, setNewSubTitle] = useState('');
  const [newSubDesc, setNewSubDesc] = useState('');
  const [newSubIcon, setNewSubIcon] = useState('⚡');
  const [newSubImage, setNewSubImage] = useState('');

  const handleAddSubService = () => {
    if (!newSubTitle.trim()) return;
    const newSub: SubService = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: newSubTitle.trim(),
      description: newSubDesc.trim(),
      icon: newSubIcon.trim() || '⚡',
      image: newSubImage.trim() || undefined,
      display_order: subServices.length + 1
    };
    setSubServices(prev => [...prev, newSub]);
    setNewSubTitle('');
    setNewSubDesc('');
    setNewSubIcon('⚡');
    setNewSubImage('');
  };

  const handleUpdateSubService = (index: number, field: keyof SubService, value: string) => {
    setSubServices(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveSubService = (index: number) => {
    setSubServices(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveSubService = (index: number, direction: 'up' | 'down') => {
    setSubServices(prev => {
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  // Execution Methodology Steps State
  const [methodologyList, setMethodologyList] = useState<string[]>(() => {
    if (initialData?.methodology && initialData.methodology.length > 0) {
      return initialData.methodology;
    }
    return [];
  });
  const [newMethodologyStep, setNewMethodologyStep] = useState('');

  const handleAddMethodologyStep = () => {
    if (!newMethodologyStep.trim()) return;
    setMethodologyList(prev => [...prev, newMethodologyStep.trim()]);
    setNewMethodologyStep('');
  };

  const handleUpdateMethodologyStep = (index: number, value: string) => {
    setMethodologyList(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleRemoveMethodologyStep = (index: number) => {
    setMethodologyList(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveMethodologyStep = (index: number, direction: 'up' | 'down') => {
    setMethodologyList(prev => {
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  // Statutory Standards & Quality Control Codes State
  const [standardsList, setStandardsList] = useState<string[]>(() => {
    if (initialData?.standards && initialData.standards.length > 0) {
      return initialData.standards;
    }
    return [];
  });
  const [newStandard, setNewStandard] = useState('');

  const handleAddStandard = () => {
    if (!newStandard.trim()) return;
    setStandardsList(prev => [...prev, newStandard.trim()]);
    setNewStandard('');
  };

  const handleUpdateStandard = (index: number, value: string) => {
    setStandardsList(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleRemoveStandard = (index: number) => {
    setStandardsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveStandard = (index: number, direction: 'up' | 'down') => {
    setStandardsList(prev => {
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  // Project Deliverables & Technical Data Packages State
  const [keyDeliverablesList, setKeyDeliverablesList] = useState<string[]>(() => {
    if (initialData?.key_deliverables && initialData.key_deliverables.length > 0) {
      return initialData.key_deliverables;
    }
    return [];
  });
  const [newKeyDeliverable, setNewKeyDeliverable] = useState('');

  const handleAddKeyDeliverable = () => {
    if (!newKeyDeliverable.trim()) return;
    setKeyDeliverablesList(prev => [...prev, newKeyDeliverable.trim()]);
    setNewKeyDeliverable('');
  };

  const handleUpdateKeyDeliverable = (index: number, value: string) => {
    setKeyDeliverablesList(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleRemoveKeyDeliverable = (index: number) => {
    setKeyDeliverablesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveKeyDeliverable = (index: number, direction: 'up' | 'down') => {
    setKeyDeliverablesList(prev => {
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  // Service Gallery State
  const [gallery, setGallery] = useState<ServiceGalleryImage[]>(() => {
    if (initialData?.gallery && initialData.gallery.length > 0) {
      return initialData.gallery;
    }
    const preset = (SERVICE_GALLERY_PRESETS && (SERVICE_GALLERY_PRESETS[initialData?.slug || ''] || SERVICE_GALLERY_PRESETS[initialData?.id || ''])) || [];
    return preset;
  });
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState('All');
  const [videoUrl, setVideoUrl] = useState<string>(() => {
    if (initialData?.video_url) {
      if (initialData.video_url.includes('G0hu1YqhpEE')) {
        return '/assets/videos/ground_intelligence.mp4';
      }
      return initialData.video_url;
    }
    if (initialData?.slug === 'ground-intelligence' || initialData?.id === 'ground-intelligence') {
      return '/assets/videos/ground_intelligence.mp4';
    }
    return '';
  });

  const handleAddGalleryItem = (presetItem?: { url: string; title: string; caption: string; alt?: string }) => {
    const newItem: ServiceGalleryImage = {
      id: `gal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      url: presetItem?.url || '',
      title: presetItem?.title || '',
      caption: presetItem?.caption || '',
      alt: presetItem?.alt || presetItem?.title || ''
    };
    setGallery(prev => [...prev, newItem]);
  };

  const handleUpdateGalleryItem = (index: number, field: keyof ServiceGalleryImage, value: string) => {
    setGallery(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveGalleryItem = (index: number) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveGalleryItem = (index: number, direction: 'up' | 'down') => {
    setGallery(prev => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };
  
  // Core Deliverables & Focal Points State
  const [capabilitiesList, setCapabilitiesList] = useState<ServiceDeliverableItem[]>(() => {
    if (initialData?.capabilities && initialData.capabilities.length > 0) {
      return initialData.capabilities.map(item => getDeliverableDetails(item, initialData.slug || initialData.id));
    }
    return [];
  });
  const [capabilitiesMode, setCapabilitiesMode] = useState<'visual' | 'bulk'>('visual');
  const [capabilitiesStr, setCapabilitiesStr] = useState(() => {
    if (initialData?.capabilities && initialData.capabilities.length > 0) {
      return initialData.capabilities.map(item => {
        const d = getDeliverableDetails(item, initialData.slug || initialData.id);
        return d.description ? `${d.title} | ${d.description}` : d.title;
      }).join('\n');
    }
    return '';
  });
  const [newDeliverableTitle, setNewDeliverableTitle] = useState('');
  const [newDeliverableDesc, setNewDeliverableDesc] = useState('');
  const [newDeliverableOutputs, setNewDeliverableOutputs] = useState('');
  const [newDeliverableStandards, setNewDeliverableStandards] = useState('');

  const handleBulkCapabilitiesChange = (val: string) => {
    setCapabilitiesStr(val);
    const parsed = val.split('\n').map(line => {
      const parts = line.split('|');
      const itemTitle = parts[0]?.trim() || '';
      const itemDesc = parts.slice(1).join('|').trim();
      if (!itemTitle) return null;
      return getDeliverableDetails({ title: itemTitle, description: itemDesc }, initialData?.slug || initialData?.id);
    }).filter(Boolean) as ServiceDeliverableItem[];
    setCapabilitiesList(parsed);
  };

  const handleAddDeliverable = (itemToAdd?: string | ServiceDeliverableItem) => {
    let deliverableObj: ServiceDeliverableItem;
    if (typeof itemToAdd === 'string') {
      deliverableObj = getDeliverableDetails(itemToAdd, initialData?.slug || initialData?.id);
    } else if (itemToAdd && typeof itemToAdd === 'object') {
      deliverableObj = getDeliverableDetails(itemToAdd, initialData?.slug || initialData?.id);
    } else {
      const titleVal = newDeliverableTitle.trim();
      if (!titleVal) return;
      deliverableObj = getDeliverableDetails({
        title: titleVal,
        description: newDeliverableDesc.trim(),
        deliverablesOutput: newDeliverableOutputs.trim() || undefined,
        standards: newDeliverableStandards.trim() || undefined
      }, initialData?.slug || initialData?.id);
    }

    if (capabilitiesList.some(c => c.title.toLowerCase() === deliverableObj.title.toLowerCase())) return;
    const updated = [...capabilitiesList, deliverableObj];
    setCapabilitiesList(updated);
    setCapabilitiesStr(updated.map(u => u.description ? `${u.title} | ${u.description}` : u.title).join('\n'));
    if (!itemToAdd) {
      setNewDeliverableTitle('');
      setNewDeliverableDesc('');
      setNewDeliverableOutputs('');
      setNewDeliverableStandards('');
    }
  };

  const handleUpdateDeliverableField = (idx: number, field: keyof ServiceDeliverableItem, newVal: string) => {
    const updated = [...capabilitiesList];
    updated[idx] = {
      ...updated[idx],
      [field]: newVal
    };
    setCapabilitiesList(updated);
    setCapabilitiesStr(updated.map(u => u.description ? `${u.title} | ${u.description}` : u.title).join('\n'));
  };

  const handleRemoveDeliverable = (idx: number) => {
    const updated = capabilitiesList.filter((_, i) => i !== idx);
    setCapabilitiesList(updated);
    setCapabilitiesStr(updated.map(u => u.description ? `${u.title} | ${u.description}` : u.title).join('\n'));
  };

  const handleMoveDeliverable = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= capabilitiesList.length) return;
    const updated = [...capabilitiesList];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setCapabilitiesList(updated);
    setCapabilitiesStr(updated.map(u => u.description ? `${u.title} | ${u.description}` : u.title).join('\n'));
  };

  // Other Technical Lists
  const [benefitsStr, setBenefitsStr] = useState((initialData?.benefits || []).join('\n'));
  const [operatingEnvironmentsStr, setOperatingEnvironmentsStr] = useState((initialData?.operating_environments || []).join('\n'));
  const [equipmentStr, setEquipmentStr] = useState((initialData?.equipment || []).join('\n'));
  
  // Partner Badge
  const [hasPartner, setHasPartner] = useState(Boolean(initialData?.partner_badge));
  const [partnerName, setPartnerName] = useState(initialData?.partner_badge?.partnerName || '');
  const [partnerRole, setPartnerRole] = useState(initialData?.partner_badge?.role || '');
  const [partnerWebsite, setPartnerWebsite] = useState(initialData?.partner_badge?.website || '');

  // Meta & Settings
  const [ctaText, setCtaText] = useState(initialData?.cta_text || 'Request Technical Consultation');
  const [ctaUrl, setCtaUrl] = useState(initialData?.cta_url || '/contact');
  const [displayOrder, setDisplayOrder] = useState<number>(initialData?.display_order || 1);
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(initialData?.status || 'published');
  const [featured, setFeatured] = useState<boolean>(initialData?.featured ?? true);
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || '');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryChange = (catName: string) => {
    setCategory(catName);
    const found = CATEGORIES_LIST.find(c => c.name === catName);
    if (found) {
      setDivision(found.division);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!initialData) {
      // Auto generate slug for new services
      const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setSlug(autoSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a service title.');
      return;
    }

    setError(null);
    setSaving(true);

    const capabilities: ServiceDeliverableItem[] = capabilitiesMode === 'visual'
      ? capabilitiesList.filter(item => Boolean(item.title?.trim()))
      : capabilitiesStr.split('\n').map(line => {
          const parts = line.split('|');
          const itemTitle = parts[0]?.trim() || '';
          const itemDesc = parts.slice(1).join('|').trim();
          if (!itemTitle) return null;
          return getDeliverableDetails({ title: itemTitle, description: itemDesc }, initialData?.slug || slug);
        }).filter(Boolean) as ServiceDeliverableItem[];
    const benefits = benefitsStr.split('\n').map(s => s.trim()).filter(Boolean);
    const operating_environments = operatingEnvironmentsStr.split('\n').map(s => s.trim()).filter(Boolean);
    const equipment = equipmentStr.split('\n').map(s => s.trim()).filter(Boolean);

    const payload = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      division,
      category,
      abbreviation: abbreviation.trim() || undefined,
      descriptor: descriptor.trim() || undefined,
      positioning: positioning.trim() || undefined,
      tagline,
      hero_heading: heroHeading.trim() || undefined,
      short_description: shortDescription,
      overview_heading: overviewHeading.trim() || undefined,
      full_description: fullDescription,
      engineering_problem_addressed: engineeringProblemAddressed.trim() || undefined,
      business_value: businessValue,
      hero_image: heroImage,
      card_image: cardImage || heroImage,
      video_url: videoUrl.trim() || undefined,
      gallery: gallery.filter(img => img.url.trim().length > 0),
      subServices: subServices.filter(s => Boolean(s.title?.trim())),
      capabilities,
      benefits,
      operating_environments,
      technology: equipment,
      methodology: methodologyList.filter(s => Boolean(s.trim())),
      standards: standardsList.filter(s => Boolean(s.trim())),
      key_deliverables: keyDeliverablesList.filter(s => Boolean(s.trim())),
      equipment,
      cta_text: ctaText,
      cta_url: ctaUrl,
      partner_badge: hasPartner && partnerName ? {
        partnerName,
        role: partnerRole,
        website: partnerWebsite
      } : null,
      display_order: Number(displayOrder),
      featured,
      status,
      meta_title: metaTitle || `${title} | PIGL Specialist Engineering`,
      meta_description: metaDescription || shortDescription
    };

    try {
      await onSave(payload);
    } catch (err: any) {
      setError(err?.message || 'Failed to save service.');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans pb-12">
      {/* Top action bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <button
            type="button"
            onClick={onCancel}
            className={`text-xs font-bold transition-colors mb-2 block ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ← Back to Services List
          </button>
          <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {initialData ? `Edit Service: ${initialData.title}` : 'Create New Engineering Service'}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 border rounded-lg text-xs font-bold uppercase transition-colors ${
              isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save & Publish Service'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Fields (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Title & Slug */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              1. Basic Identification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Digital Intelligence"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. digital-intelligence"
                  className={`w-full px-3.5 py-2.5 border rounded-lg font-mono text-sm focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <p className={`text-xs mt-1 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Live URL: /services/{slug}
                </p>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Hero Section Headline (H1)
              </label>
              <input
                type="text"
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                placeholder="e.g. Precision Geodetic Survey, Subsurface Geophysics & Geotechnical Engineering"
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:border-emerald-500 outline-none ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Primary H1 headline on the public service page. Defaults to Service Title if left blank.
              </p>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Approved Division & Taxonomy *
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:border-emerald-500 outline-none ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {CATEGORIES_LIST.map((cat, idx) => (
                  <option key={idx} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Abbreviation
                </label>
                <input
                  type="text"
                  value={abbreviation}
                  onChange={(e) => setAbbreviation(e.target.value)}
                  placeholder="e.g. GES, MMS, ICS, IS"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm font-mono focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Service Descriptor
                </label>
                <input
                  type="text"
                  value={descriptor}
                  onChange={(e) => setDescriptor(e.target.value)}
                  placeholder="e.g. GEOSCIENCE | SURVEY | ENGINEERING | DIGITAL SOLUTIONS"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Positioning Statement
              </label>
              <input
                type="text"
                value={positioning}
                onChange={(e) => setPositioning(e.target.value)}
                placeholder="e.g. Accurate data. Deeper insight. Smarter engineering."
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:border-emerald-500 outline-none ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Technical Tagline / Header Subtitle
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Accurate data. Deeper insight. Smarter engineering."
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:border-emerald-500 outline-none ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              2. Technical Descriptions & Engineering Scope
            </h3>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Overview Section Headline
              </label>
              <input
                type="text"
                value={overviewHeading}
                onChange={(e) => setOverviewHeading(e.target.value)}
                placeholder="e.g. Engineering Scope & Problem Resolution"
                className={`w-full p-3 border rounded-lg text-sm focus:border-emerald-500 outline-none ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Primary section heading for Section B on the public service page.
              </p>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Short Overview (Card & Listings) *
              </label>
              <textarea
                rows={2}
                required
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Concise 1-2 sentence overview for cards and listings..."
                className={`w-full p-3 border rounded-lg text-sm focus:border-emerald-500 outline-none ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Full Technical Description *
              </label>
              <textarea
                rows={6}
                required
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Comprehensive technical description detailing methodologies, scope, and industry applications..."
                className={`w-full p-3 border rounded-lg text-sm focus:border-emerald-500 outline-none leading-relaxed ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Engineering Problem Addressed
              </label>
              <textarea
                rows={3}
                value={engineeringProblemAddressed}
                onChange={(e) => setEngineeringProblemAddressed(e.target.value)}
                placeholder="Explains the geotechnical hazards, operational bottlenecks, or failure modes this service resolves before engineering commitments..."
                className={`w-full p-3 border rounded-lg text-sm focus:border-emerald-500 outline-none leading-relaxed ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Highlighted problem statement callout in Section B on the public service page.
              </p>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Strategic Business Value
              </label>
              <textarea
                rows={3}
                value={businessValue}
                onChange={(e) => setBusinessValue(e.target.value)}
                placeholder="Explain the tangible cost savings, safety impact, and risk reduction for clients..."
                className={`w-full p-3 border rounded-lg text-sm focus:border-emerald-500 outline-none ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Section 3: Core Capabilities / Service Families */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-5 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-emerald-600 rounded-none inline-block"></span>
                  <h3 className={`text-sm sm:text-base font-bold uppercase tracking-wider ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    3. Core Capabilities / Service Families ({subServices.length})
                  </h3>
                </div>
                <p className={`text-xs mt-1 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Principal capability cards displayed on the public service page. Authorised administrators can add, edit, reorder, and remove cards.
                </p>
              </div>
            </div>

            {/* List of subServices */}
            <div className="space-y-3">
              {subServices.length === 0 ? (
                <div className={`p-6 border-2 border-dashed rounded-xl text-center text-xs ${
                  isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  No capability cards configured yet. Add your first capability card below.
                </div>
              ) : (
                subServices.map((sub, idx) => (
                  <div
                    key={sub.id || idx}
                    className={`p-4 border rounded-xl transition-all space-y-3 ${
                      isDark ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <span className="w-7 h-7 flex items-center justify-center rounded-md font-mono text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                          0{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={sub.icon || '⚡'}
                          onChange={(e) => handleUpdateSubService(idx, 'icon', e.target.value)}
                          title="Icon / Emoji"
                          placeholder="Icon"
                          className={`w-12 text-center py-1.5 px-1 text-sm border rounded-lg outline-none ${
                            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                        <input
                          type="text"
                          value={sub.title}
                          onChange={(e) => handleUpdateSubService(idx, 'title', e.target.value)}
                          placeholder="Capability Title"
                          className={`flex-1 py-1.5 px-3 text-sm font-bold border rounded-lg outline-none ${
                            isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600'
                          }`}
                        />
                      </div>

                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSubService(idx, 'up')}
                          className="p-1.5 rounded text-slate-400 hover:text-emerald-500 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30"
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={idx === subServices.length - 1}
                          onClick={() => handleMoveSubService(idx, 'down')}
                          className="p-1.5 rounded text-slate-400 hover:text-emerald-500 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30"
                          title="Move Down"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubService(idx)}
                          className="p-1.5 rounded text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          title="Delete Capability"
                        >
                          <IconTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        value={sub.description}
                        onChange={(e) => handleUpdateSubService(idx, 'description', e.target.value)}
                        placeholder="Concise explanation of the engineering work performed and deliverables..."
                        className={`w-full p-2.5 text-xs border rounded-lg outline-none leading-relaxed ${
                          isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-800 focus:border-emerald-600'
                        }`}
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        value={sub.image || ''}
                        onChange={(e) => handleUpdateSubService(idx, 'image', e.target.value)}
                        placeholder="Optional Capability Image Path (/assets/...)"
                        className={`w-full p-2 text-xs border rounded-lg outline-none font-mono ${
                          isDark ? 'bg-slate-900 border-slate-700 text-slate-300 placeholder:text-slate-600' : 'bg-white border-slate-200 text-slate-700 placeholder:text-slate-400'
                        }`}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add new capability card input */}
            <div className={`p-4 border rounded-xl space-y-3 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-xs font-bold uppercase tracking-wider block ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Add New Capability Card
              </span>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubIcon}
                  onChange={(e) => setNewSubIcon(e.target.value)}
                  placeholder="⚡"
                  title="Emoji / Symbol"
                  className={`w-12 text-center py-2 px-1 text-sm border rounded-lg outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <input
                  type="text"
                  value={newSubTitle}
                  onChange={(e) => setNewSubTitle(e.target.value)}
                  placeholder="Capability Title (e.g. Seabed Mapping & Hydrographic Surveys)..."
                  className={`flex-1 py-2 px-3 text-sm font-bold border rounded-lg outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600'
                  }`}
                />
              </div>

              <textarea
                rows={2}
                value={newSubDesc}
                onChange={(e) => setNewSubDesc(e.target.value)}
                placeholder="Short explanation of the work performed for prospective clients..."
                className={`w-full p-2.5 text-xs border rounded-lg outline-none leading-relaxed ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-800 focus:border-emerald-600'
                }`}
              />

              <input
                type="text"
                value={newSubImage}
                onChange={(e) => setNewSubImage(e.target.value)}
                placeholder="Optional Capability Image Path (/assets/...)"
                className={`w-full p-2 text-xs border rounded-lg outline-none font-mono ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-300 placeholder:text-slate-600' : 'bg-white border-slate-200 text-slate-700 placeholder:text-slate-400'
                }`}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddSubService}
                  disabled={!newSubTitle.trim()}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <IconPlus className="w-4 h-4" />
                  <span>Add Capability Card</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Core Deliverables & Focal Points */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-5 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-emerald-600 rounded-none inline-block"></span>
                  <h3 className={`text-sm sm:text-base font-bold uppercase tracking-wider ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    3. Core Deliverables & Focal Points
                  </h3>
                </div>
                <p className={`text-xs mt-1 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Prominently featured on the Services overview (<span className="font-mono text-emerald-600 dark:text-emerald-400">/services</span>) and technical specification pages (<span className="font-mono text-emerald-600 dark:text-emerald-400">/services/:slug</span>).
                </p>
              </div>

              <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setCapabilitiesMode('visual')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    capabilitiesMode === 'visual'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Interactive Builder
                </button>
                <button
                  type="button"
                  onClick={() => setCapabilitiesMode('bulk')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    capabilitiesMode === 'bulk'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bulk Raw Edit
                </button>
              </div>
            </div>

            {capabilitiesMode === 'visual' ? (
              <div className="space-y-4">
                {/* List of items */}
                <div className="space-y-2.5">
                  {capabilitiesList.length === 0 ? (
                    <div className={`p-6 border-2 border-dashed rounded-xl text-center text-xs ${
                      isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                    }`}>
                      No Core Deliverables & Focal Points added yet. Type a deliverable below or click a suggested tag to start.
                    </div>
                  ) : (
                    capabilitiesList.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 border rounded-xl transition-all space-y-2.5 ${
                          isDark ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Title and Controls Bar */}
                        <div className="flex items-center space-x-2.5">
                          <span className="w-6 h-6 flex items-center justify-center rounded-md font-mono text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                            #{idx + 1}
                          </span>

                          <div className="flex-1">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => handleUpdateDeliverableField(idx, 'title', e.target.value)}
                              placeholder="Deliverable Title (e.g. Seismic Services / Seabed Mapping)"
                              className={`w-full px-3 py-2 text-xs sm:text-sm border rounded-lg outline-none font-bold transition-colors ${
                                isDark
                                  ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500'
                                  : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                              }`}
                            />
                          </div>

                          {/* Reorder Buttons */}
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveDeliverable(idx, 'up')}
                              className="p-1.5 rounded text-slate-400 hover:text-emerald-500 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move Up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={idx === capabilitiesList.length - 1}
                              onClick={() => handleMoveDeliverable(idx, 'down')}
                              className="p-1.5 rounded text-slate-400 hover:text-emerald-500 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move Down"
                            >
                              ▼
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveDeliverable(idx)}
                              className="p-1.5 rounded text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                              title="Delete Deliverable"
                            >
                              <IconTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Detailed Description / Content */}
                        <div>
                          <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            Technical Scope & Content (Displayed in User Popup):
                          </label>
                          <textarea
                            rows={2}
                            value={item.description || ''}
                            onChange={(e) => handleUpdateDeliverableField(idx, 'description', e.target.value)}
                            placeholder="Detailed technical description, scope, and engineering methodology for this deliverable..."
                            className={`w-full px-3 py-2 text-xs border rounded-lg outline-none font-normal leading-relaxed transition-colors ${
                              isDark
                                ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-emerald-500'
                                : 'bg-white border-slate-300 text-slate-800 focus:border-emerald-500'
                            }`}
                          />
                        </div>

                        {/* Optional Outputs & Standards row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                          <div>
                            <input
                              type="text"
                              value={item.deliverablesOutput || ''}
                              onChange={(e) => handleUpdateDeliverableField(idx, 'deliverablesOutput', e.target.value)}
                              placeholder="Key Outputs (e.g. SEG-Y 32-bit seismic volumes, Bathymetric charts)"
                              className={`w-full px-2.5 py-1.5 text-[11px] border rounded-md outline-none ${
                                isDark
                                  ? 'bg-slate-900/60 border-slate-700/80 text-slate-300 focus:border-emerald-500'
                                  : 'bg-white border-slate-200 text-slate-700 focus:border-emerald-500'
                              }`}
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={item.standards || ''}
                              onChange={(e) => handleUpdateDeliverableField(idx, 'standards', e.target.value)}
                              placeholder="Applicable Standards (e.g. IOGP, API, ISO 19901, NUPRC)"
                              className={`w-full px-2.5 py-1.5 text-[11px] border rounded-md outline-none ${
                                isDark
                                  ? 'bg-slate-900/60 border-slate-700/80 text-slate-300 focus:border-emerald-500'
                                  : 'bg-white border-slate-200 text-slate-700 focus:border-emerald-500'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add new deliverable input */}
                <div className={`p-4 border rounded-xl space-y-3 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider block ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Add New Deliverable or Focal Point
                  </span>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newDeliverableTitle}
                      onChange={(e) => setNewDeliverableTitle(e.target.value)}
                      placeholder="Deliverable Title (e.g. Seismic Services, Seabed Mapping, Geotechnical Sampling)..."
                      className={`w-full px-3.5 py-2 text-xs sm:text-sm border rounded-lg outline-none font-bold transition-colors ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500'
                          : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600'
                      }`}
                    />

                    <textarea
                      rows={2}
                      value={newDeliverableDesc}
                      onChange={(e) => setNewDeliverableDesc(e.target.value)}
                      placeholder="Detailed Technical Scope & Description for popup content..."
                      className={`w-full px-3.5 py-2 text-xs border rounded-lg outline-none font-normal leading-relaxed transition-colors ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500'
                          : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-emerald-600'
                      }`}
                    />

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400 italic">
                        Tip: Title and description are immediately available in website popups.
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddDeliverable()}
                        disabled={!newDeliverableTitle.trim()}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center space-x-1.5 shadow-xs whitespace-nowrap cursor-pointer"
                      >
                        <IconPlus className="w-4 h-4" />
                        <span>Add Deliverable</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Division suggestions */}
                {SUGGESTED_DELIVERABLES[category] && (
                  <div className="pt-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider block mb-2 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Quick Suggestions for {category}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_DELIVERABLES[category].map((sug, sIdx) => {
                        const alreadyAdded = capabilitiesList.some(c => c.title.toLowerCase() === sug.toLowerCase());
                        return (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => !alreadyAdded && handleAddDeliverable(sug)}
                            disabled={alreadyAdded}
                            className={`text-xs px-2.5 py-1 rounded-lg border transition-all text-left flex items-center space-x-1.5 ${
                              alreadyAdded
                                ? 'opacity-40 border-slate-300 dark:border-slate-800 line-through cursor-not-allowed'
                                : isDark
                                  ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-emerald-500 hover:text-emerald-400'
                                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-600 hover:text-emerald-700'
                            }`}
                          >
                            <span>+</span>
                            <span>{sug}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Core Deliverables & Focal Points (Format: Title | Detailed Scope Description)
                </label>
                <textarea
                  rows={8}
                  value={capabilitiesStr}
                  onChange={(e) => handleBulkCapabilitiesChange(e.target.value)}
                  placeholder="Seismic Services | 2D and 3D digital seismic surveys, data harvesting, node deployment&#10;Seabed Mapping | Our geophysical surveys provide detailed information on seabed conditions"
                  className={`w-full p-3 font-mono text-xs border rounded-lg focus:border-emerald-500 outline-none leading-relaxed ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
            )}

            {/* Live Website Preview Card */}
            <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live Website Display Preview</span>
                </span>
                <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {capabilitiesList.length} focal point{capabilitiesList.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className={`p-5 rounded-xl border ${
                isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50/80 border-slate-200'
              }`}>
                <h4 className="text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-4">
                  Core Deliverables & Focal Points:
                </h4>
                {capabilitiesList.length === 0 ? (
                  <p className="text-xs italic text-slate-400">Add deliverables above to see the live website layout...</p>
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {capabilitiesList.map((item, i) => (
                      <li key={i} className="flex items-center justify-between space-x-3 text-slate-800 dark:text-slate-200 text-xs sm:text-sm p-3 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                          <span className="flex-shrink-0 w-2 h-2 bg-emerald-600 rounded-none"></span>
                          <span className="leading-tight font-bold">{item.title}</span>
                        </div>
                        <span className="text-slate-400 text-xs flex-shrink-0">→</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Technical Scope, Methodology, Benefits & Environments */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-5 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              5. Delivery Methodology, Equipment & Scope
            </h3>

            {/* Methodology Workflow Steps Manager */}
            <div className={`p-4 border rounded-xl space-y-3 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    Execution Methodology & Quality Control Steps ({methodologyList.length})
                  </label>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Numbered workflow steps (01, 02, 03...) displayed in Section D on the public service page.
                  </p>
                </div>
              </div>

              {/* Steps list */}
              <div className="space-y-2">
                {methodologyList.length === 0 ? (
                  <p className="text-xs italic text-slate-400">No methodology steps added. Add your first step below.</p>
                ) : (
                  methodologyList.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-center space-x-2">
                      <span className="w-6 h-6 flex items-center justify-center rounded font-mono text-[11px] font-bold bg-emerald-700 text-white flex-shrink-0">
                        0{sIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => handleUpdateMethodologyStep(sIdx, e.target.value)}
                        className={`flex-1 p-2 text-xs border rounded-lg outline-none ${
                          isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                      <button
                        type="button"
                        disabled={sIdx === 0}
                        onClick={() => handleMoveMethodologyStep(sIdx, 'up')}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={sIdx === methodologyList.length - 1}
                        onClick={() => handleMoveMethodologyStep(sIdx, 'down')}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveMethodologyStep(sIdx)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 cursor-pointer"
                        title="Remove Step"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add step input */}
              <div className="flex space-x-2 pt-1">
                <input
                  type="text"
                  value={newMethodologyStep}
                  onChange={(e) => setNewMethodologyStep(e.target.value)}
                  placeholder="e.g. Survey Planning & Geodetic Network Establishment..."
                  className={`flex-1 p-2 text-xs border rounded-lg outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddMethodologyStep}
                  disabled={!newMethodologyStep.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  + Add Step
                </button>
              </div>
            </div>

            {/* Quality Standards & Statutory Codes Manager */}
            <div className={`p-4 border rounded-xl space-y-3 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Statutory Engineering Codes & QA/QC Standards ({standardsList.length})
                </label>
                <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Compliance standards (DNV, API, ISO, NUPRC) rendered in Section D on the public service page.
                </p>
              </div>

              <div className="space-y-2">
                {standardsList.length === 0 ? (
                  <p className="text-xs italic text-slate-400">No standards configured. Add a statutory code below.</p>
                ) : (
                  standardsList.map((std, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="w-6 h-6 flex items-center justify-center rounded font-mono text-[11px] font-bold bg-emerald-800 text-emerald-100 flex-shrink-0">
                        ✓
                      </span>
                      <input
                        type="text"
                        value={std}
                        onChange={(e) => handleUpdateStandard(idx, e.target.value)}
                        className={`flex-1 p-2 text-xs border rounded-lg outline-none ${
                          isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveStandard(idx, 'up')}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={idx === standardsList.length - 1}
                        onClick={() => handleMoveStandard(idx, 'down')}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveStandard(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 cursor-pointer"
                        title="Remove Standard"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex space-x-2 pt-1">
                <input
                  type="text"
                  value={newStandard}
                  onChange={(e) => setNewStandard(e.target.value)}
                  placeholder="e.g. ISO 9001:2015 Quality Management Systems..."
                  className={`flex-1 p-2 text-xs border rounded-lg outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddStandard}
                  disabled={!newStandard.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  + Add Standard
                </button>
              </div>
            </div>

            {/* Key Deliverables & Certified Packages Manager */}
            <div className={`p-4 border rounded-xl space-y-3 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Client Project Deliverables & Data Packages ({keyDeliverablesList.length})
                </label>
                <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Key engineering outputs and data packages rendered in Section D on the public service page.
                </p>
              </div>

              <div className="space-y-2">
                {keyDeliverablesList.length === 0 ? (
                  <p className="text-xs italic text-slate-400">No deliverables configured. Add a deliverable package below.</p>
                ) : (
                  keyDeliverablesList.map((deliv, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="w-6 h-6 flex items-center justify-center rounded font-mono text-[11px] font-bold bg-slate-800 text-emerald-400 flex-shrink-0">
                        ●
                      </span>
                      <input
                        type="text"
                        value={deliv}
                        onChange={(e) => handleUpdateKeyDeliverable(idx, e.target.value)}
                        className={`flex-1 p-2 text-xs border rounded-lg outline-none ${
                          isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveKeyDeliverable(idx, 'up')}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={idx === keyDeliverablesList.length - 1}
                        onClick={() => handleMoveKeyDeliverable(idx, 'down')}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyDeliverable(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 cursor-pointer"
                        title="Remove Deliverable"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex space-x-2 pt-1">
                <input
                  type="text"
                  value={newKeyDeliverable}
                  onChange={(e) => setNewKeyDeliverable(e.target.value)}
                  placeholder="e.g. Certified Geotechnical Engineering Soil Investigation Report..."
                  className={`flex-1 p-2 text-xs border rounded-lg outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddKeyDeliverable}
                  disabled={!newKeyDeliverable.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  + Add Deliverable
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Client Benefits & Operational Assurance (One per line)
                </label>
                <textarea
                  rows={4}
                  value={benefitsStr}
                  onChange={(e) => setBenefitsStr(e.target.value)}
                  placeholder="Up to 95% reduction in rework&#10;Single source of truth&#10;Certified to ISO 9001:2015 and ISO 45001:2018"
                  className={`w-full p-3 font-mono text-xs border rounded-lg focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Operating Environments (One per line)
                </label>
                <textarea
                  rows={4}
                  value={operatingEnvironmentsStr}
                  onChange={(e) => setOperatingEnvironmentsStr(e.target.value)}
                  placeholder="Onshore Facilities&#10;Swamp Flow Stations&#10;Offshore Platforms"
                  className={`w-full p-3 font-mono text-xs border rounded-lg focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Equipment & Technology Fleet (One per line)
              </label>
              <textarea
                rows={3}
                value={equipmentStr}
                onChange={(e) => setEquipmentStr(e.target.value)}
                placeholder="Leica RTC360 High-Speed Terrestrial 3D Scanner&#10;Dual-frequency RTK GNSS receivers&#10;Digital hydrographic survey craft"
                className={`w-full p-3 font-mono text-xs border rounded-lg focus:border-emerald-500 outline-none ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Strategic Technology Partner Callout */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <h3 className={`text-sm font-bold uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                4. Strategic Partner Badge (Optional)
              </h3>
              <label className={`flex items-center space-x-2 text-xs font-bold cursor-pointer ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <input
                  type="checkbox"
                  checked={hasPartner}
                  onChange={(e) => setHasPartner(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Enable Partner Badge</span>
              </label>
            </div>

            {hasPartner && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Partner Name</label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="e.g. Frankstar Technology"
                    className={`w-full p-2.5 border rounded-lg text-xs ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Role / Badge Label</label>
                  <input
                    type="text"
                    value={partnerRole}
                    onChange={(e) => setPartnerRole(e.target.value)}
                    placeholder="Strategic Metocean Partner"
                    className={`w-full p-2.5 border rounded-lg text-xs ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Website URL</label>
                  <input
                    type="text"
                    value={partnerWebsite}
                    onChange={(e) => setPartnerWebsite(e.target.value)}
                    placeholder="https://..."
                    className={`w-full p-2.5 border rounded-lg text-xs ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Operational Image Gallery Manager */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-5 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Operational Image Gallery ({gallery.length})
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Manage high-resolution field photography, equipment spreads, and execution imagery displayed on the public service page.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowLibraryModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
                >
                  <span>Browse Authentic Library</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddGalleryItem()}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-colors ${
                    isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>+ Custom Card</span>
                </button>
              </div>
            </div>

            {/* Gallery items list */}
            {gallery.length === 0 ? (
              <div className={`p-8 text-center border-2 border-dashed rounded-xl ${
                isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
              }`}>
                <p className="text-xs font-bold uppercase tracking-wider mb-2">No Gallery Images Configured</p>
                <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
                  Every service page requires authentic operational imagery. Click below to load the recommended presets or select from our asset library.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const preset = (SERVICE_GALLERY_PRESETS && (SERVICE_GALLERY_PRESETS[slug] || SERVICE_GALLERY_PRESETS[initialData?.id || ''])) || [];
                    if (preset.length > 0) setGallery(preset);
                    else setShowLibraryModal(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-500 transition-colors"
                >
                  Load Recommended Operational Preset
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {gallery.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className={`p-4 rounded-xl border transition-all ${
                      isDark ? 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600' : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      {/* Thumbnail & Change action */}
                      <div className="w-full md:w-40 flex-shrink-0 flex flex-col items-center">
                        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-950 flex items-center justify-center relative group">
                          {item.url ? (
                            <img
                              src={item.url}
                              alt={item.title || `Gallery image ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-slate-500 uppercase font-mono">No Image</span>
                          )}
                        </div>
                        <div className="w-full mt-2">
                          <ImageUploader
                            label=""
                            currentUrl={item.url}
                            onUploadComplete={(newUrl) => handleUpdateGalleryItem(idx, 'url', newUrl)}
                            bucket="services"
                            helperText="Upload image"
                            theme={theme}
                          />
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="flex-1 space-y-3 w-full">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Image #{idx + 1}
                          </span>
                          
                          {/* Order & delete controls */}
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryItem(idx, 'up')}
                              disabled={idx === 0}
                              title="Move Up"
                              className={`p-1.5 rounded text-xs transition-colors ${
                                idx === 0 ? 'text-slate-400 opacity-40 cursor-not-allowed' : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200')
                              }`}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryItem(idx, 'down')}
                              disabled={idx === gallery.length - 1}
                              title="Move Down"
                              className={`p-1.5 rounded text-xs transition-colors ${
                                idx === gallery.length - 1 ? 'text-slate-400 opacity-40 cursor-not-allowed' : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200')
                              }`}
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryItem(idx)}
                              title="Remove Image"
                              className="p-1.5 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors ml-1"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Image URL / Asset Path
                          </label>
                          <input
                            type="text"
                            value={item.url}
                            onChange={(e) => handleUpdateGalleryItem(idx, 'url', e.target.value)}
                            placeholder="/assets/... or https://..."
                            className={`w-full p-2 border rounded-lg text-xs font-mono ${
                              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Technical Title
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateGalleryItem(idx, 'title', e.target.value)}
                            placeholder="e.g. 20-Ton Hydraulic CPT Penetrometer Rig"
                            className={`w-full p-2 border rounded-lg text-xs ${
                              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Operational Caption
                          </label>
                          <textarea
                            rows={2}
                            value={item.caption || ''}
                            onChange={(e) => handleUpdateGalleryItem(idx, 'caption', e.target.value)}
                            placeholder="Engineering context, instrumentation specifications, or field location details..."
                            className={`w-full p-2 border rounded-lg text-xs ${
                              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Alt Text (Accessibility & SEO)
                          </label>
                          <input
                            type="text"
                            value={item.alt || ''}
                            onChange={(e) => handleUpdateGalleryItem(idx, 'alt', e.target.value)}
                            placeholder="Descriptive alt text for screen readers..."
                            className={`w-full p-2 border rounded-lg text-xs ${
                              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Operational Video Media Manager */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Operational Video Media
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Configure high-definition native MP4 footage or video links to display in the standard 16:9 format with zero external branding.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {videoUrl && (
                  <button
                    type="button"
                    onClick={() => setVideoUrl('')}
                    className="px-2.5 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 rounded transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Quick Preset Native Operational Footage */}
            <div>
              <span className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                PIGL Native Operational Footage Presets (Zero Branding, 1080p Full HD)
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setVideoUrl('/assets/videos/ground_intelligence.mp4')}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    videoUrl === '/assets/videos/ground_intelligence.mp4'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : isDark
                      ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-500'
                  }`}
                >
                  Ground Intelligence MP4
                </button>
                <button
                  type="button"
                  onClick={() => setVideoUrl('/assets/FRANKSTAR LOOP.mp4')}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    videoUrl === '/assets/FRANKSTAR LOOP.mp4'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : isDark
                      ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-500'
                  }`}
                >
                  MetOcean Buoy Loop MP4
                </button>
                <button
                  type="button"
                  onClick={() => setVideoUrl('/assets/DIGITAL INTELLINGENCE.mp4')}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    videoUrl === '/assets/DIGITAL INTELLINGENCE.mp4'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : isDark
                      ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-500'
                  }`}
                >
                  Digital Reality Capture MP4
                </button>
                <button
                  type="button"
                  onClick={() => setVideoUrl('/assets/OFFSHORE INTELLIGENCE.mp4')}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    videoUrl === '/assets/OFFSHORE INTELLIGENCE.mp4'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : isDark
                      ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-500'
                  }`}
                >
                  Offshore Geophysics MP4
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Video Path or Stream URL (Native MP4 / WebM / YouTube / Vimeo)
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="/assets/videos/ground_intelligence.mp4 or video URL"
                  className={`w-full p-2.5 border rounded-lg text-xs font-mono ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              {videoUrl ? (
                <div>
                  <span className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                    Live 16:9 Native Video Preview (Indigenous Player)
                  </span>
                  <div className="relative aspect-video w-full max-w-xl bg-slate-950 rounded-lg overflow-hidden border border-slate-700 shadow-md">
                    <NativeVideoPlayer
                      src={videoUrl}
                      title={title || 'Operational Video Preview'}
                    />
                  </div>
                </div>
              ) : (
                <div className={`p-4 border border-dashed rounded-lg text-center text-xs ${
                  isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
                }`}>
                  No video URL configured. The service card and technical page will display authentic field photography.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Sidebar Settings & Images (1 col) */}
        <div className="space-y-6">
          
          {/* Status & Display */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              Publishing Settings
            </h3>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Status
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className={`w-full p-2.5 border rounded-lg text-sm font-bold ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="published">Published (Live on Website)</option>
                <option value="draft">Draft (Hidden from Public)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className={`w-full p-2.5 border rounded-lg text-sm ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Lower numbers appear first (e.g. 1 to 9).</p>
            </div>

            <div className="pt-2">
              <label className={`flex items-center space-x-2 text-xs font-bold cursor-pointer ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Featured Service</span>
              </label>
            </div>
          </div>

          {/* Media Images */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              Service Imagery
            </h3>

            <ImageUploader
              label="Hero & Card Image"
              currentUrl={heroImage}
              onUploadComplete={(url) => {
                setHeroImage(url);
                setCardImage(url);
              }}
              bucket="services"
              helperText="High-res engineering / realistic Nigerian field image"
              theme={theme}
            />
          </div>

          {/* CTA Settings */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-3 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              Call to Action
            </h3>

            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Button Text</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className={`w-full p-2.5 border rounded-lg text-xs ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Target URL</label>
              <input
                type="text"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                className={`w-full p-2.5 border rounded-lg text-xs ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* SEO Metadata */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-3 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              SEO Optimization
            </h3>

            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={`${title || 'Service'} | PIGL Specialist Engineering`}
                className={`w-full p-2.5 border rounded-lg text-xs ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Meta Description</label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Concise description for Google search snippets..."
                className={`w-full p-2.5 border rounded-lg text-xs ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
          </div>

        </div>

      </div>

      {/* Authentic Asset Library Selector Modal */}
      {showLibraryModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowLibraryModal(false)}
        >
          <div
            className={`max-w-4xl w-full max-h-[85vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div>
                <h3 className="text-base font-bold">Select From Authentic Operational Photography Library</h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Click any verified engineering photo to add it directly to this service's public gallery.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLibraryModal(false)}
                className={`p-2 rounded-lg text-xs font-bold transition-colors ${
                  isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ✕ Close
              </button>
            </div>

            {/* Filter Tabs */}
            <div className={`px-5 py-3 border-b flex flex-wrap gap-2 text-xs font-bold ${
              isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/70'
            }`}>
              {['All', 'Ground Intelligence', 'Digital Intelligence', 'Offshore Intelligence', 'Asset Integrity', 'Infrastructure & EPC'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setLibraryFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    libraryFilter === tab
                      ? 'bg-emerald-600 text-white'
                      : (isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900')
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Modal Body / Grid */}
            <div className="p-5 overflow-y-auto max-h-[60vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {ALL_OPERATIONAL_ASSETS
                .filter(asset => libraryFilter === 'All' || asset.tag === libraryFilter)
                .map((asset, i) => {
                  const isAlreadyAdded = gallery.some(g => g.url === asset.url);
                  return (
                    <div
                      key={i}
                      className={`border rounded-xl p-3 flex flex-col justify-between transition-all ${
                        isDark ? 'bg-slate-800/70 border-slate-700 hover:border-emerald-500' : 'bg-slate-50 border-slate-200 hover:border-emerald-600'
                      }`}
                    >
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-950 mb-3 relative group">
                        <img
                          src={asset.url}
                          alt={asset.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 backdrop-blur-xs text-[9px] font-mono uppercase text-emerald-400 font-bold rounded">
                          {asset.tag}
                        </span>
                      </div>
                      <div className="space-y-1 mb-3">
                        <h4 className="text-xs font-bold line-clamp-1">{asset.title}</h4>
                        <p className={`text-[11px] line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {asset.caption}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          handleAddGalleryItem({
                            url: asset.url,
                            title: asset.title,
                            caption: asset.caption
                          });
                        }}
                        disabled={isAlreadyAdded}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                          isAlreadyAdded
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {isAlreadyAdded ? '✓ Added to Gallery' : '+ Add to Gallery'}
                      </button>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex justify-between items-center ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {gallery.length} image{gallery.length === 1 ? '' : 's'} currently in service gallery
              </span>
              <button
                type="button"
                onClick={() => setShowLibraryModal(false)}
                className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default AdminServiceEditor;
