import React, { useState } from 'react';
import {
  useNavigation,
  DEFAULT_NAVIGATION_CONFIG
} from '../../hooks/useSupabaseData';
import {
  HeaderNavItem,
  HeaderNavSection,
  HeaderNavSubLink,
  FooterColumnItem,
  FooterLinkItem,
  SitePageInfo
} from '../../types';
import {
  IconGlobe,
  IconPlus,
  IconTrash,
  IconEdit,
  IconCheck,
  IconArrowUp,
  IconArrowDown,
  IconExternal,
  IconSearch,
  IconCheckCircle,
  IconGripVertical,
  IconChevronDown,
  IconChevronRight
} from '../../components/admin/AdminIcons';

import AdminPageHeaders from './AdminPageHeaders';

export const AVAILABLE_PAGES = [
  { id: 'p-home', title: 'Home', slug: '/' },
  { id: 'p-about', title: 'About Us', slug: '/about' },
  { id: 'p-teams', title: 'Leadership & Teams', slug: '/teams' },
  { id: 'p-services', title: 'Specialist Services', slug: '/services' },
  { id: 'p-projects', title: 'Projects & Track Record', slug: '/projects' },
  { id: 'p-careers', title: 'Careers & Talent', slug: '/careers' },
  { id: 'p-csr', title: 'Corporate Social Responsibility (CSR)', slug: '/csr' },
  { id: 'p-hsse', title: 'QHSE Standards & Certifications', slug: '/hsse' },
  { id: 'p-network', title: 'Our Network & Base Offices', slug: '/network' },
  { id: 'p-videos', title: 'Media & Technical Videos', slug: '/videos' },
  { id: 'p-blog', title: 'Insights & Technical Blog', slug: '/blog' },
  { id: 'p-vendors', title: 'Vendor & Partner Registration', slug: '/vendors' },
  { id: 'p-contact', title: 'Contact & Quotation', slug: '/contact' }
];

export const AVAILABLE_DIVISIONS = [
  { id: 'd-ges', title: 'GeoSolutions & Engineering Services', acronym: 'GES', slug: '/services/geosolutions-engineering-services' },
  { id: 'd-mms', title: 'Metocean & Marine Solutions', acronym: 'MMS', slug: '/services/metocean-marine-solutions' },
  { id: 'd-irm', title: 'Inspection, Repair & Maintenance', acronym: 'IRM', slug: '/services/integrated-construction-services' },
  { id: 'd-is', title: 'Integrated Marine & Vessel Support', acronym: 'IS', slug: '/services/industrial-solutions' }
];

interface AdminNavigationProps {
  theme?: 'light' | 'dark';
  initialTab?: 'header' | 'footer' | 'pages' | 'headers';
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({ theme = 'light', initialTab }) => {
  const isDark = theme === 'dark';
  const {
    navConfig,
    loading,
    saveHeaderNav,
    saveFooterConfig,
    savePages,
    resetToDefaults
  } = useNavigation(true);

  const [activeTab, setActiveTab] = useState<'header' | 'footer' | 'pages' | 'headers'>(() => initialTab || 'header');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // WordPress-Style Menu State
  const [headerItems, setHeaderItems] = useState<HeaderNavItem[]>(navConfig.header || []);
  const [hasUnsavedHeaderChanges, setHasUnsavedHeaderChanges] = useState(false);
  const [isSavingHeader, setIsSavingHeader] = useState(false);

  // Left Accordion state: 'pages' | 'divisions' | 'custom'
  const [activeAccordion, setActiveAccordion] = useState<'pages' | 'divisions' | 'custom'>('pages');

  // Checkbox selections for batch addition
  const [selectedPages, setSelectedPages] = useState<Record<string, boolean>>({});
  const [selectedDivisions, setSelectedDivisions] = useState<Record<string, boolean>>({});
  const [pageSearchQuery, setPageSearchQuery] = useState('');

  // Custom link form
  const [customLinkName, setCustomLinkName] = useState('');
  const [customLinkUrl, setCustomLinkUrl] = useState('');
  const [customLinkType, setCustomLinkType] = useState<'standard' | 'dropdown' | 'mega' | 'external'>('standard');
  const [customLinkExternal, setCustomLinkExternal] = useState(false);

  // Expanded card in menu tree
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Inline sublink drafts per item
  const [sublinkDrafts, setSublinkDrafts] = useState<Record<string, { label: string; href: string; description: string; badge: string; is_external: boolean }>>({});

  // Synchronize local headerItems whenever navConfig updates
  React.useEffect(() => {
    if (navConfig?.header) {
      setHeaderItems(navConfig.header);
      setHasUnsavedHeaderChanges(false);
    }
  }, [navConfig.header]);

  // Modals state
  const [editingHeaderItem, setEditingHeaderItem] = useState<HeaderNavItem | null>(null);
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [isNewHeaderItem, setIsNewHeaderItem] = useState(false);

  // Sublink modal
  const [targetParentHeaderId, setTargetParentHeaderId] = useState<string | null>(null);
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);
  const [editingSubLink, setEditingSubLink] = useState<HeaderNavSubLink | null>(null);
  const [isSubLinkModalOpen, setIsSubLinkModalOpen] = useState(false);

  // Footer link modal
  const [targetFooterColId, setTargetFooterColId] = useState<string | null>(null);
  const [editingFooterLink, setEditingFooterLink] = useState<FooterLinkItem | null>(null);
  const [isFooterLinkModalOpen, setIsFooterLinkModalOpen] = useState(false);
  const [isBottomLinkModal, setIsBottomLinkModal] = useState(false);

  // Footer column modal
  const [editingFooterCol, setEditingFooterCol] = useState<FooterColumnItem | null>(null);
  const [isFooterColModalOpen, setIsFooterColModalOpen] = useState(false);

  // Page editor modal
  const [editingPage, setEditingPage] = useState<SitePageInfo | null>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);

  // Reset confirmation modal
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Expandable header sections
  const [expandedHeaderIds, setExpandedHeaderIds] = useState<Record<string, boolean>>({
    'nav-about': true
  });

  // Collapsible mega menu sections
  const [collapsedSectionIds, setCollapsedSectionIds] = useState<Record<string, boolean>>({});

  const toggleCollapseSection = (sectionId: string) => {
    setCollapsedSectionIds(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleExpandHeader = (id: string) => {
    setExpandedHeaderIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // ----------------------------------------------------------------------------
  // WORDPRESS-STYLE MENU BUILDER HANDLERS
  // ----------------------------------------------------------------------------
  const handleAddSelectedPages = () => {
    const toAdd = Object.keys(selectedPages).filter(k => selectedPages[k]);
    if (toAdd.length === 0) {
      showToast('Please select at least one page to add');
      return;
    }

    const newItems = [...headerItems];
    toAdd.forEach(slug => {
      const pageInfo = AVAILABLE_PAGES.find(p => p.slug === slug) || navConfig.pages.find(p => p.slug === slug);
      const title = pageInfo ? pageInfo.title : slug;
      newItems.push({
        id: `nav-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: title,
        href: slug,
        type: 'standard',
        is_active: true,
        order: newItems.length + 1
      });
    });

    setHeaderItems(newItems);
    setSelectedPages({});
    setHasUnsavedHeaderChanges(true);
    showToast(`Added ${toAdd.length} page(s) to menu`);
  };

  const handleAddSelectedDivisions = () => {
    const toAdd = Object.keys(selectedDivisions).filter(k => selectedDivisions[k]);
    if (toAdd.length === 0) {
      showToast('Please select at least one division to add');
      return;
    }

    const newItems = [...headerItems];
    toAdd.forEach(slug => {
      const div = AVAILABLE_DIVISIONS.find(d => d.slug === slug);
      if (!div) return;
      newItems.push({
        id: `nav-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: div.acronym ? `${div.acronym} - ${div.title}` : div.title,
        href: div.slug,
        type: 'standard',
        badge: div.acronym,
        is_active: true,
        order: newItems.length + 1
      });
    });

    setHeaderItems(newItems);
    setSelectedDivisions({});
    setHasUnsavedHeaderChanges(true);
    showToast(`Added ${toAdd.length} division(s) to menu`);
  };

  const handleAddCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLinkName.trim() || !customLinkUrl.trim()) {
      showToast('Please enter both Link Text and URL');
      return;
    }

    const newItems = [
      ...headerItems,
      {
        id: `nav-${Date.now()}`,
        name: customLinkName.trim(),
        href: customLinkUrl.trim(),
        type: customLinkType,
        is_external: customLinkExternal,
        is_active: true,
        order: headerItems.length + 1,
        dropdown_items: []
      }
    ];

    setHeaderItems(newItems);
    setCustomLinkName('');
    setCustomLinkUrl('');
    setCustomLinkType('standard');
    setCustomLinkExternal(false);
    setHasUnsavedHeaderChanges(true);
    showToast('Custom link added to menu');
  };

  const handleMoveHeaderItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= headerItems.length) return;
    const newItems = [...headerItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    newItems.forEach((item, idx) => { item.order = idx + 1; });
    setHeaderItems(newItems);
    setHasUnsavedHeaderChanges(true);
  };

  const handleToggleHeaderItemActive = (id: string) => {
    const newItems = headerItems.map(item => {
      if (item.id === id) {
        return { ...item, is_active: !item.is_active };
      }
      return item;
    });
    setHeaderItems(newItems);
    setHasUnsavedHeaderChanges(true);
  };

  const handleDeleteHeaderItem = (id: string) => {
    if (!window.confirm('Are you sure you want to remove this navigation item from the menu?')) return;
    const newItems = headerItems.filter(item => item.id !== id);
    newItems.forEach((item, idx) => { item.order = idx + 1; });
    setHeaderItems(newItems);
    if (expandedCardId === id) setExpandedCardId(null);
    setHasUnsavedHeaderChanges(true);
    showToast('Navigation item removed');
  };

  const handleUpdateHeaderItem = (id: string, patch: Partial<HeaderNavItem>) => {
    const newItems = headerItems.map(item => {
      if (item.id === id) {
        return { ...item, ...patch };
      }
      return item;
    });
    setHeaderItems(newItems);
    setHasUnsavedHeaderChanges(true);
  };

  const handleAddSubLinkToItem = (itemId: string) => {
    const draft = sublinkDrafts[itemId] || { label: '', href: '', description: '', badge: '', is_external: false };
    if (!draft.label.trim() || !draft.href.trim()) {
      showToast('Please provide a label and URL for the sub-link');
      return;
    }
    const newSubLink: HeaderNavSubLink = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      label: draft.label.trim(),
      href: draft.href.trim(),
      description: draft.description.trim() || undefined,
      badge: draft.badge.trim() || undefined,
      is_external: draft.is_external
    };
    const newItems = headerItems.map(item => {
      if (item.id === itemId) {
        const currentSubLinks = item.dropdown_items || (item.sections ? item.sections.flatMap(s => s.links) : []) || [];
        return {
          ...item,
          dropdown_items: [...currentSubLinks, newSubLink]
        };
      }
      return item;
    });
    setHeaderItems(newItems);
    setSublinkDrafts(prev => ({
      ...prev,
      [itemId]: { label: '', href: '', description: '', badge: '', is_external: false }
    }));
    setHasUnsavedHeaderChanges(true);
    showToast('Sub-link added to dropdown');
  };

  const handleDeleteSubLinkFromItem = (itemId: string, subLinkId: string) => {
    const newItems = headerItems.map(item => {
      if (item.id === itemId) {
        const currentSubLinks = item.dropdown_items || (item.sections ? item.sections.flatMap(s => s.links) : []) || [];
        return {
          ...item,
          dropdown_items: currentSubLinks.filter(l => l.id !== subLinkId)
        };
      }
      return item;
    });
    setHeaderItems(newItems);
    setHasUnsavedHeaderChanges(true);
  };

  const handleMoveSubLinkInItem = (itemId: string, index: number, direction: 'up' | 'down') => {
    const newItems = headerItems.map(item => {
      if (item.id === itemId) {
        const currentSubLinks = [...(item.dropdown_items || (item.sections ? item.sections.flatMap(s => s.links) : []) || [])];
        const targetIdx = direction === 'up' ? index - 1 : index + 1;
        if (targetIdx < 0 || targetIdx >= currentSubLinks.length) return item;
        const temp = currentSubLinks[index];
        currentSubLinks[index] = currentSubLinks[targetIdx];
        currentSubLinks[targetIdx] = temp;
        return { ...item, dropdown_items: currentSubLinks };
      }
      return item;
    });
    setHeaderItems(newItems);
    setHasUnsavedHeaderChanges(true);
  };

  const handleSaveAllHeaderNav = async () => {
    setIsSavingHeader(true);
    const normalized = headerItems.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));
    const res = await saveHeaderNav(normalized);
    setIsSavingHeader(false);
    if (res !== false) {
      setHasUnsavedHeaderChanges(false);
      showToast('Navigation menu saved and live on website!');
    } else {
      showToast('Error saving navigation menu');
    }
  };

  // ----------------------------------------------------------------------------
  // HEADER HANDLERS (LEGACY / MODALS)
  // ----------------------------------------------------------------------------
  const handleMoveHeader = async (index: number, direction: 'up' | 'down') => {
    const items = [...navConfig.header];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;

    // re-index order
    items.forEach((item, idx) => {
      item.order = idx + 1;
    });

    await saveHeaderNav(items);
    showToast('Menu order updated successfully');
  };

  const handleToggleHeaderActive = async (id: string) => {
    const items = navConfig.header.map(item => {
      if (item.id === id) {
        return { ...item, is_active: !item.is_active };
      }
      return item;
    });
    await saveHeaderNav(items);
    showToast('Navigation visibility toggled');
  };

  const handleDeleteHeader = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this navigation item from the header?')) return;
    const items = navConfig.header.filter(item => item.id !== id);
    items.forEach((item, idx) => { item.order = idx + 1; });
    await saveHeaderNav(items);
    showToast('Navigation item removed');
  };

  const handleSaveHeaderModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHeaderItem) return;

    let items = [...navConfig.header];
    if (isNewHeaderItem) {
      items.push({
        ...editingHeaderItem,
        id: editingHeaderItem.id || `nav-${Date.now()}`,
        order: items.length + 1
      });
    } else {
      items = items.map(item => item.id === editingHeaderItem.id ? editingHeaderItem : item);
    }

    await saveHeaderNav(items);
    setIsHeaderModalOpen(false);
    setEditingHeaderItem(null);
    showToast(isNewHeaderItem ? 'New header link added' : 'Header link updated');
  };

  // Sub-links handlers
  const handleSaveSubLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetParentHeaderId || !targetSectionId || !editingSubLink) return;

    const items = navConfig.header.map(item => {
      if (item.id === targetParentHeaderId && item.sections) {
        const updatedSections = item.sections.map(sec => {
          if (sec.id === targetSectionId) {
            const isNew = !sec.links.some(l => l.id === editingSubLink.id);
            const updatedLinks = isNew
              ? [...sec.links, { ...editingSubLink, id: editingSubLink.id || `sub-${Date.now()}` }]
              : sec.links.map(l => l.id === editingSubLink.id ? editingSubLink : l);
            return { ...sec, links: updatedLinks };
          }
          return sec;
        });
        return { ...item, sections: updatedSections };
      }
      return item;
    });

    await saveHeaderNav(items);
    setIsSubLinkModalOpen(false);
    setEditingSubLink(null);
    showToast('Sub-link saved successfully');
  };

  const handleDeleteSubLink = async (parentId: string, secId: string, linkId: string) => {
    if (!window.confirm('Delete this sub-menu link?')) return;
    const items = navConfig.header.map(item => {
      if (item.id === parentId && item.sections) {
        const updatedSections = item.sections.map(sec => {
          if (sec.id === secId) {
            return { ...sec, links: sec.links.filter(l => l.id !== linkId) };
          }
          return sec;
        });
        return { ...item, sections: updatedSections };
      }
      return item;
    });

    await saveHeaderNav(items);
    showToast('Sub-link removed');
  };

  const handleAddSection = async (parentId: string) => {
    const title = window.prompt('Enter title for new sub-section (e.g. "Special Initiatives"):');
    if (!title) return;

    const items = navConfig.header.map(item => {
      if (item.id === parentId) {
        const sections = item.sections || [];
        return {
          ...item,
          sections: [
            ...sections,
            {
              id: `sec-${Date.now()}`,
              title,
              links: []
            }
          ]
        };
      }
      return item;
    });

    await saveHeaderNav(items);
    showToast('New section added');
  };

  // ----------------------------------------------------------------------------
  // FOOTER HANDLERS
  // ----------------------------------------------------------------------------
  const handleMoveFooterColumn = async (index: number, direction: 'left' | 'right') => {
    const columns = [...navConfig.footer.columns];
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= columns.length) return;

    const temp = columns[index];
    columns[index] = columns[targetIdx];
    columns[targetIdx] = temp;
    columns.forEach((col, idx) => { col.order = idx + 1; });

    await saveFooterConfig(columns, navConfig.footer.bottom_links);
    showToast('Footer columns reordered');
  };

  const handleToggleFooterColActive = async (id: string) => {
    const columns = navConfig.footer.columns.map(col => {
      if (col.id === id) return { ...col, is_active: !col.is_active };
      return col;
    });
    await saveFooterConfig(columns, navConfig.footer.bottom_links);
    showToast('Footer column visibility updated');
  };

  const handleDeleteFooterCol = async (id: string) => {
    if (!window.confirm('Delete this footer column and all its links?')) return;
    const columns = navConfig.footer.columns.filter(col => col.id !== id);
    await saveFooterConfig(columns, navConfig.footer.bottom_links);
    showToast('Footer column removed');
  };

  const handleSaveFooterColModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFooterCol) return;

    let columns = [...navConfig.footer.columns];
    const exists = columns.some(c => c.id === editingFooterCol.id);
    if (exists) {
      columns = columns.map(c => c.id === editingFooterCol.id ? editingFooterCol : c);
    } else {
      columns.push({
        ...editingFooterCol,
        id: editingFooterCol.id || `fcol-${Date.now()}`,
        order: columns.length + 1,
        links: editingFooterCol.links || []
      });
    }

    await saveFooterConfig(columns, navConfig.footer.bottom_links);
    setIsFooterColModalOpen(false);
    setEditingFooterCol(null);
    showToast('Footer column saved');
  };

  // Footer Links Handlers
  const handleMoveFooterLink = async (colId: string, linkIdx: number, direction: 'up' | 'down') => {
    const columns = navConfig.footer.columns.map(col => {
      if (col.id === colId) {
        const links = [...col.links];
        const targetIdx = direction === 'up' ? linkIdx - 1 : linkIdx + 1;
        if (targetIdx >= 0 && targetIdx < links.length) {
          const temp = links[linkIdx];
          links[linkIdx] = links[targetIdx];
          links[targetIdx] = temp;
          links.forEach((l, idx) => { l.order = idx + 1; });
          return { ...col, links };
        }
      }
      return col;
    });

    await saveFooterConfig(columns, navConfig.footer.bottom_links);
    showToast('Footer links reordered');
  };

  const handleDeleteFooterLink = async (colId: string, linkId: string) => {
    if (!window.confirm('Remove this link from the footer column?')) return;
    const columns = navConfig.footer.columns.map(col => {
      if (col.id === colId) {
        return { ...col, links: col.links.filter(l => l.id !== linkId) };
      }
      return col;
    });

    await saveFooterConfig(columns, navConfig.footer.bottom_links);
    showToast('Footer link deleted');
  };

  const handleSaveFooterLinkModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFooterLink) return;

    if (isBottomLinkModal) {
      let bottomLinks = [...navConfig.footer.bottom_links];
      const exists = bottomLinks.some(l => l.id === editingFooterLink.id);
      if (exists) {
        bottomLinks = bottomLinks.map(l => l.id === editingFooterLink.id ? editingFooterLink : l);
      } else {
        bottomLinks.push({
          ...editingFooterLink,
          id: editingFooterLink.id || `bot-${Date.now()}`,
          order: bottomLinks.length + 1
        });
      }
      await saveFooterConfig(navConfig.footer.columns, bottomLinks);
    } else if (targetFooterColId) {
      const columns = navConfig.footer.columns.map(col => {
        if (col.id === targetFooterColId) {
          const exists = col.links.some(l => l.id === editingFooterLink.id);
          const links = exists
            ? col.links.map(l => l.id === editingFooterLink.id ? editingFooterLink : l)
            : [...col.links, { ...editingFooterLink, id: editingFooterLink.id || `flink-${Date.now()}`, order: col.links.length + 1 }];
          return { ...col, links };
        }
        return col;
      });
      await saveFooterConfig(columns, navConfig.footer.bottom_links);
    }

    setIsFooterLinkModalOpen(false);
    setEditingFooterLink(null);
    setTargetFooterColId(null);
    setIsBottomLinkModal(false);
    showToast('Footer link saved successfully');
  };

  // ----------------------------------------------------------------------------
  // PAGES & SEO HANDLERS
  // ----------------------------------------------------------------------------
  const handleSavePageModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    let pages = [...navConfig.pages];
    const exists = pages.some(p => p.id === editingPage.id);
    if (exists) {
      pages = pages.map(p => p.id === editingPage.id ? { ...editingPage, updated_at: new Date().toISOString() } : p);
    } else {
      pages.push({
        ...editingPage,
        id: editingPage.id || `pg-${Date.now()}`,
        updated_at: new Date().toISOString()
      });
    }

    await savePages(pages);
    setIsPageModalOpen(false);
    setEditingPage(null);
    showToast('Page configuration saved');
  };

  const handleDeletePage = async (id: string) => {
    if (!window.confirm('Delete this page definition? Note: Standard core pages should not be deleted.')) return;
    const pages = navConfig.pages.filter(p => p.id !== id);
    await savePages(pages);
    showToast('Page removed');
  };

  // Reset to default corporate navigation
  const handleConfirmReset = async () => {
    await resetToDefaults();
    setIsResetConfirmOpen(false);
    showToast('Navigation restored to PIGL corporate defaults');
  };

  const filteredPages = navConfig.pages.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.meta_title && p.meta_title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`space-y-6 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center space-x-3 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl animate-fade-in text-sm font-semibold">
          <IconCheckCircle className="w-5 h-5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Actions & Status Toolbar */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
      }`}>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-mono font-bold">
            {navConfig.header.filter(h => h.is_active).length} Header Items
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-mono font-bold">
            {navConfig.footer.columns.length} Footer Columns
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-mono font-bold">
            {navConfig.pages.length} Configured Pages
          </span>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center space-x-1.5 ${
              isDark
                ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                : 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800'
            }`}
          >
            <span>Live Site Preview</span>
            <IconExternal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </a>

          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-500/40 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('header')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'header'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <span>Top Header Navigation</span>
          <span className="px-2 py-0.5 text-[11px] rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-mono font-bold">
            {navConfig.header.filter(h => h.is_active).length} Active
          </span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'footer'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <span>Footer Columns & Links</span>
          <span className="px-2 py-0.5 text-[11px] rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-mono font-bold">
            {navConfig.footer.columns.length} Columns
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'pages'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <span>Pages & SEO Metadata</span>
          <span className="px-2 py-0.5 text-[11px] rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-mono font-bold">
            {navConfig.pages.length} Pages
          </span>
        </button>

        <button
          onClick={() => setActiveTab('headers')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'headers'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <span>Breadcrumbs & Headers</span>
        </button>
      </div>

      {activeTab === 'headers' && (
        <AdminPageHeaders theme={theme} />
      )}

      {/* ==================================================================== */}
      {/* TAB 1: HEADER NAVIGATION (WORDPRESS-STYLE MENU BUILDER)              */}
      {/* ==================================================================== */}
      {activeTab === 'header' && (
        <div className="space-y-6">
          {/* Top Status & Save Bar */}
          <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
          }`}>
            <div>
              <div className="flex items-center space-x-2.5">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Main Navigation Menu
                </h3>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {headerItems.filter(i => i.is_active).length} Active Items
                </span>
                {hasUnsavedHeaderChanges && (
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
                    ● Unsaved Changes
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                WordPress-style navigation manager. Choose between <strong>Direct Links</strong>, <strong>Ordinary Dropdowns</strong>, or <strong>Mega Menus</strong>.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                type="button"
                onClick={handleSaveAllHeaderNav}
                disabled={isSavingHeader}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md ${
                  hasUnsavedHeaderChanges
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-slate-900'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                } disabled:opacity-50`}
              >
                <IconCheck className="w-4 h-4" />
                <span>{isSavingHeader ? 'Saving Menu...' : 'Save Menu'}</span>
              </button>
            </div>
          </div>

          {/* 2-Column WordPress Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* -------------------------------------------------------------- */}
            {/* LEFT COLUMN: ADD MENU ITEMS ACCORDION                         */}
            {/* -------------------------------------------------------------- */}
            <div className="lg:col-span-4 space-y-3.5">
              <div className="px-1 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Add Menu Items
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  Select &amp; click Add
                </span>
              </div>

              {/* Accordion 1: Pages */}
              <div className={`rounded-xl border overflow-hidden transition-all ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
              }`}>
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'pages' ? ('' as any) : 'pages')}
                  className="w-full p-3.5 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span>Site Pages</span>
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      {AVAILABLE_PAGES.length}
                    </span>
                  </div>
                  {activeAccordion === 'pages' ? (
                    <IconChevronDown className="w-4 h-4 text-slate-500" />
                  ) : (
                    <IconChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {activeAccordion === 'pages' && (
                  <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-3 animate-fade-in">
                    {/* Search filter inside pages */}
                    <div className="relative mt-2">
                      <IconSearch className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Filter pages..."
                        value={pageSearchQuery}
                        onChange={e => setPageSearchQuery(e.target.value)}
                        className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>

                    {/* Checkboxes scroll list */}
                    <div className="max-h-56 overflow-y-auto space-y-1 pr-1 border border-slate-100 dark:border-slate-800 rounded-lg p-2">
                      {AVAILABLE_PAGES
                        .filter(p => p.title.toLowerCase().includes(pageSearchQuery.toLowerCase()) || p.slug.toLowerCase().includes(pageSearchQuery.toLowerCase()))
                        .map(page => {
                          const isChecked = Boolean(selectedPages[page.slug]);
                          return (
                            <label
                              key={page.id}
                              className={`flex items-start space-x-2.5 p-2 rounded-md cursor-pointer text-xs transition-colors ${
                                isChecked
                                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={e => {
                                  setSelectedPages({
                                    ...selectedPages,
                                    [page.slug]: e.target.checked
                                  });
                                }}
                                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                              />
                              <div className="min-w-0 flex-1">
                                <span className="font-semibold block truncate">{page.title}</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{page.slug}</span>
                              </div>
                            </label>
                          );
                        })}
                    </div>

                    {/* Actions bar for pages */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const allChecked = AVAILABLE_PAGES.every(p => selectedPages[p.slug]);
                          if (allChecked) {
                            setSelectedPages({});
                          } else {
                            const next: Record<string, boolean> = {};
                            AVAILABLE_PAGES.forEach(p => { next[p.slug] = true; });
                            setSelectedPages(next);
                          }
                        }}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      >
                        {AVAILABLE_PAGES.every(p => selectedPages[p.slug]) ? 'Deselect All' : 'Select All'}
                      </button>

                      <button
                        type="button"
                        onClick={handleAddSelectedPages}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                      >
                        Add to Menu
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Operating Divisions */}
              <div className={`rounded-xl border overflow-hidden transition-all ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
              }`}>
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'divisions' ? ('' as any) : 'divisions')}
                  className="w-full p-3.5 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span>Operating Divisions</span>
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                      Core 4
                    </span>
                  </div>
                  {activeAccordion === 'divisions' ? (
                    <IconChevronDown className="w-4 h-4 text-slate-500" />
                  ) : (
                    <IconChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {activeAccordion === 'divisions' && (
                  <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 animate-fade-in">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                      PIGL's approved 4 business divisions:
                    </p>
                    <div className="space-y-1.5">
                      {AVAILABLE_DIVISIONS.map(div => {
                        const isChecked = Boolean(selectedDivisions[div.slug]);
                        return (
                          <label
                            key={div.id}
                            className={`flex items-start space-x-2.5 p-2 rounded-md cursor-pointer text-xs transition-colors ${
                              isChecked
                                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e => {
                                setSelectedDivisions({
                                  ...selectedDivisions,
                                  [div.slug]: e.target.checked
                                });
                              }}
                              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-slate-900 dark:text-white">{div.acronym}</span>
                                <span className="text-[10px] text-slate-500">({div.title})</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono truncate block">{div.slug}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddSelectedDivisions}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                      >
                        Add to Menu
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Custom Links */}
              <div className={`rounded-xl border overflow-hidden transition-all ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
              }`}>
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'custom' ? ('' as any) : 'custom')}
                  className="w-full p-3.5 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span>Custom Links</span>
                    <span className="text-[10px] text-slate-500 font-normal">URL &amp; Label</span>
                  </div>
                  {activeAccordion === 'custom' ? (
                    <IconChevronDown className="w-4 h-4 text-slate-500" />
                  ) : (
                    <IconChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {activeAccordion === 'custom' && (
                  <form onSubmit={handleAddCustomLink} className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-3 animate-fade-in">
                    <div className="mt-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        URL *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="https://... or /path"
                        value={customLinkUrl}
                        onChange={e => setCustomLinkUrl(e.target.value)}
                        className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none font-mono ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        Link Text *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Client Portal, Careers"
                        value={customLinkName}
                        onChange={e => setCustomLinkName(e.target.value)}
                        className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        Menu Type
                      </label>
                      <select
                        value={customLinkType}
                        onChange={e => setCustomLinkType(e.target.value as any)}
                        className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      >
                        <option value="standard">Standard Direct Link</option>
                        <option value="dropdown">Ordinary Dropdown (with sub-links)</option>
                        <option value="mega">Mega Menu (multi-column)</option>
                        <option value="external">External Link</option>
                      </select>
                    </div>

                    <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={customLinkExternal}
                        onChange={e => setCustomLinkExternal(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                      />
                      <span>Open link in new tab</span>
                    </label>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                      >
                        Add to Menu
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* RIGHT COLUMN: MENU STRUCTURE TREE CANVAS                       */}
            {/* -------------------------------------------------------------- */}
            <div className="lg:col-span-8 space-y-3.5">
              <div className="flex items-center justify-between px-1">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Menu Structure
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Drag/reorder items, choose dropdown or mega menu, and manage sub-items.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newId = `nav-${Date.now()}`;
                      const newItem: HeaderNavItem = {
                        id: newId,
                        name: 'New Link',
                        href: '/',
                        type: 'standard',
                        is_active: true,
                        order: headerItems.length + 1
                      };
                      setHeaderItems([...headerItems, newItem]);
                      setExpandedCardId(newId);
                      setHasUnsavedHeaderChanges(true);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors"
                  >
                    <IconPlus className="w-3.5 h-3.5" />
                    <span>Quick Item</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {headerItems.map((item, idx) => {
                  const isExpanded = expandedCardId === item.id;
                  const isDropdown = item.type === 'dropdown';
                  const isMega = item.type === 'mega';
                  const isExternal = item.type === 'external';

                  const subLinksList: HeaderNavSubLink[] = item.dropdown_items?.length
                    ? item.dropdown_items
                    : (item.sections && item.sections.length > 0
                        ? item.sections.flatMap(s => s.links || [])
                        : []);

                  const totalMegaLinks = item.sections?.reduce((acc, s) => acc + s.links.length, 0) || 0;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                        isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                      } ${!item.is_active ? 'opacity-65' : ''} ${
                        isExpanded ? 'ring-2 ring-emerald-500/50 shadow-md' : ''
                      }`}
                    >
                      {/* Item Main Header Bar */}
                      <div className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center space-x-3 min-w-0">
                          {/* Reorder Buttons */}
                          <div className="flex items-center space-x-1 shrink-0">
                            <IconGripVertical className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                            <div className="flex flex-col space-y-0.5">
                              <button
                                disabled={idx === 0}
                                onClick={() => handleMoveHeaderItem(idx, 'up')}
                                className="p-0.5 text-slate-600 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-20 transition-colors"
                                title="Move item up"
                              >
                                <IconArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                disabled={idx === headerItems.length - 1}
                                onClick={() => handleMoveHeaderItem(idx, 'down')}
                                className="p-0.5 text-slate-600 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-20 transition-colors"
                                title="Move item down"
                              >
                                <IconArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Item Identity */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {item.name}
                              </span>

                              {/* Menu Type Badge */}
                              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                                isMega
                                  ? 'bg-purple-100 text-purple-900 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300 dark:border-purple-800/60'
                                  : isDropdown
                                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60'
                                    : isExternal
                                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60'
                                      : 'bg-blue-100 text-blue-900 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300 dark:border-blue-800/60'
                              }`}>
                                {isMega ? 'Mega Menu' : isDropdown ? 'Ordinary Dropdown' : isExternal ? 'External Link' : 'Direct Link'}
                              </span>

                              {/* Sublink Count Tag */}
                              {isDropdown && (
                                <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                  {subLinksList.length} sub-links
                                </span>
                              )}

                              {isMega && (
                                <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300">
                                  {totalMegaLinks} links ({item.sections?.length || 0} sections)
                                </span>
                              )}

                              {!item.is_active && (
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                  Hidden
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 text-xs font-mono text-slate-600 dark:text-slate-400 mt-1">
                              <span>Path: <strong className="text-slate-900 dark:text-slate-200 font-semibold">{item.href}</strong></span>
                              {item.badge && (
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold">• Badge: "{item.badge}"</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Top Bar Actions */}
                        <div className="flex items-center space-x-2 self-end md:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleHeaderItemActive(item.id)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                              item.is_active
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                                : 'border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {item.is_active ? 'Visible' : 'Hidden'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpandedCardId(isExpanded ? null : item.id)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors flex items-center space-x-1 ${
                              isExpanded
                                ? 'bg-slate-900 text-white dark:bg-slate-700 border-slate-900 dark:border-slate-700'
                                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{isExpanded ? 'Close' : 'Configure'}</span>
                            {isExpanded ? <IconChevronDown className="w-3.5 h-3.5" /> : <IconChevronRight className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteHeaderItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Remove menu item"
                          >
                            <IconTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Settings Drawer */}
                      {isExpanded && (
                        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-5 animate-fade-in">
                          {/* Row 1: Label & Route */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                                Navigation Label *
                              </label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={e => handleUpdateHeaderItem(item.id, { name: e.target.value })}
                                className={`w-full px-3.5 py-2 text-xs rounded-lg border outline-none font-bold ${
                                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                                }`}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                                Destination URL / Path *
                              </label>
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  value={item.href}
                                  onChange={e => handleUpdateHeaderItem(item.id, { href: e.target.value })}
                                  className={`flex-1 px-3.5 py-2 text-xs rounded-lg border outline-none font-mono ${
                                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                                  }`}
                                />
                                <select
                                  onChange={e => {
                                    if (e.target.value) {
                                      handleUpdateHeaderItem(item.id, { href: e.target.value });
                                    }
                                  }}
                                  value=""
                                  className={`px-2 py-2 text-xs rounded-lg border outline-none ${
                                    isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-700'
                                  }`}
                                  title="Pick existing site page route"
                                >
                                  <option value="">Pick page...</option>
                                  {AVAILABLE_PAGES.map(p => (
                                    <option key={p.id} value={p.slug}>{p.title} ({p.slug})</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Row 2: Menu Display Type (Radio Cards) */}
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                              Menu Display Type
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {/* Option 1: Direct Link */}
                              <div
                                onClick={() => handleUpdateHeaderItem(item.id, { type: 'standard' })}
                                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                  item.type === 'standard' || item.type === 'external'
                                    ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-400/40'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                    item.type === 'standard' || item.type === 'external' ? 'border-blue-600 bg-blue-600' : 'border-slate-400'
                                  }`}>
                                    {(item.type === 'standard' || item.type === 'external') && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </span>
                                  <span className="font-bold text-xs">Standard Direct Link</span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-5">
                                  Directly navigates to the page URL without opening a menu.
                                </p>
                              </div>

                              {/* Option 2: Ordinary Dropdown */}
                              <div
                                onClick={() => {
                                  // initialize dropdown_items if empty
                                  const current = item.dropdown_items?.length
                                    ? item.dropdown_items
                                    : (item.sections?.flatMap(s => s.links) || []);
                                  handleUpdateHeaderItem(item.id, {
                                    type: 'dropdown',
                                    dropdown_items: current
                                  });
                                }}
                                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                  item.type === 'dropdown'
                                    ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400/40'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                    item.type === 'dropdown' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-400'
                                  }`}>
                                    {item.type === 'dropdown' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </span>
                                  <span className="font-bold text-xs">Ordinary Dropdown</span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-5">
                                  Standard vertical dropdown card with sleek list of sub-links.
                                </p>
                              </div>

                              {/* Option 3: Mega Menu */}
                              <div
                                onClick={() => handleUpdateHeaderItem(item.id, { type: 'mega' })}
                                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                  item.type === 'mega'
                                    ? 'border-purple-500 bg-purple-50/80 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 ring-2 ring-purple-400/40'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                    item.type === 'mega' ? 'border-purple-600 bg-purple-600' : 'border-slate-400'
                                  }`}>
                                    {item.type === 'mega' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </span>
                                  <span className="font-bold text-xs">Mega Menu (Retained)</span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-5">
                                  Full-width corporate showcase with multi-column sections &amp; featured teaser.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Row 3: Auxiliary settings */}
                          <div className="flex flex-wrap items-center gap-6 pt-1">
                            <div className="flex items-center space-x-2">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                Optional Badge:
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 'NEW', 'PORTAL'"
                                value={item.badge || ''}
                                onChange={e => handleUpdateHeaderItem(item.id, { badge: e.target.value })}
                                className={`px-2.5 py-1 text-xs rounded-md border outline-none ${
                                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                                }`}
                              />
                            </div>

                            <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(item.is_external)}
                                onChange={e => handleUpdateHeaderItem(item.id, { is_external: e.target.checked })}
                                className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                              />
                              <span>Open link in new tab</span>
                            </label>

                            <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.is_active}
                                onChange={e => handleUpdateHeaderItem(item.id, { is_active: e.target.checked })}
                                className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                              />
                              <span>Visible in Top Header</span>
                            </label>
                          </div>

                          {/* -------------------------------------------------------- */}
                          {/* SUB-SECTION A: ORDINARY DROPDOWN SUB-LINKS MANAGER       */}
                          {/* -------------------------------------------------------- */}
                          {item.type === 'dropdown' && (
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                                    Ordinary Dropdown Sub-Items ({subLinksList.length})
                                  </h4>
                                  <p className="text-[11px] text-slate-500">
                                    Links that will appear in the clean vertical dropdown under "{item.name}".
                                  </p>
                                </div>
                              </div>

                              {/* Sub-links List */}
                              <div className="space-y-2">
                                {subLinksList.map((sub, sIdx) => (
                                  <div
                                    key={sub.id || sIdx}
                                    className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                                      isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-2 min-w-0">
                                      <div className="flex flex-col space-y-0.5 shrink-0">
                                        <button
                                          disabled={sIdx === 0}
                                          onClick={() => handleMoveSubLinkInItem(item.id, sIdx, 'up')}
                                          className="p-0.5 text-slate-400 hover:text-emerald-600 disabled:opacity-20"
                                        >
                                          <IconArrowUp className="w-2.5 h-2.5" />
                                        </button>
                                        <button
                                          disabled={sIdx === subLinksList.length - 1}
                                          onClick={() => handleMoveSubLinkInItem(item.id, sIdx, 'down')}
                                          className="p-0.5 text-slate-400 hover:text-emerald-600 disabled:opacity-20"
                                        >
                                          <IconArrowDown className="w-2.5 h-2.5" />
                                        </button>
                                      </div>

                                      <div className="min-w-0">
                                        <div className="flex items-center space-x-2">
                                          <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                            {sub.label}
                                          </span>
                                          {sub.badge && (
                                            <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800">
                                              {sub.badge}
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate block">
                                          {sub.href} {sub.description ? `— ${sub.description}` : ''}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteSubLinkFromItem(item.id, sub.id)}
                                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                                        title="Remove sublink"
                                      >
                                        <IconTrash className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}

                                {subLinksList.length === 0 && (
                                  <div className="p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-500 italic">
                                    No sub-links in this dropdown yet. Use the form below to add one.
                                  </div>
                                )}
                              </div>

                              {/* Inline Adder Card */}
                              <div className={`p-3.5 rounded-xl border ${
                                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-emerald-50/40 border-emerald-200/60'
                              }`}>
                                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300 block mb-2.5">
                                  + Add Sub-Link to this Dropdown
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                                  <div className="sm:col-span-4">
                                    <input
                                      type="text"
                                      placeholder="Sub-link Label *"
                                      value={sublinkDrafts[item.id]?.label || ''}
                                      onChange={e => {
                                        const cur = sublinkDrafts[item.id] || { label: '', href: '', description: '', badge: '', is_external: false };
                                        setSublinkDrafts({ ...sublinkDrafts, [item.id]: { ...cur, label: e.target.value } });
                                      }}
                                      className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none ${
                                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                                      }`}
                                    />
                                  </div>

                                  <div className="sm:col-span-4">
                                    <input
                                      type="text"
                                      placeholder="URL Path (/route or https://) *"
                                      value={sublinkDrafts[item.id]?.href || ''}
                                      onChange={e => {
                                        const cur = sublinkDrafts[item.id] || { label: '', href: '', description: '', badge: '', is_external: false };
                                        setSublinkDrafts({ ...sublinkDrafts, [item.id]: { ...cur, href: e.target.value } });
                                      }}
                                      className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none font-mono ${
                                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                                      }`}
                                    />
                                  </div>

                                  <div className="sm:col-span-4">
                                    <select
                                      onChange={e => {
                                        if (e.target.value) {
                                          const p = AVAILABLE_PAGES.find(x => x.slug === e.target.value);
                                          const cur = sublinkDrafts[item.id] || { label: '', href: '', description: '', badge: '', is_external: false };
                                          setSublinkDrafts({
                                            ...sublinkDrafts,
                                            [item.id]: {
                                              ...cur,
                                              href: e.target.value,
                                              label: cur.label || (p ? p.title : '')
                                            }
                                          });
                                        }
                                      }}
                                      value=""
                                      className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none ${
                                        isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-700'
                                      }`}
                                    >
                                      <option value="">Or autofill from page...</option>
                                      {AVAILABLE_PAGES.map(p => (
                                        <option key={p.id} value={p.slug}>{p.title}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="sm:col-span-8">
                                    <input
                                      type="text"
                                      placeholder="Optional short description (e.g. 'Engineering careers & talent opportunities')"
                                      value={sublinkDrafts[item.id]?.description || ''}
                                      onChange={e => {
                                        const cur = sublinkDrafts[item.id] || { label: '', href: '', description: '', badge: '', is_external: false };
                                        setSublinkDrafts({ ...sublinkDrafts, [item.id]: { ...cur, description: e.target.value } });
                                      }}
                                      className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none ${
                                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                                      }`}
                                    />
                                  </div>

                                  <div className="sm:col-span-4 flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => handleAddSubLinkToItem(item.id)}
                                      className="w-full sm:w-auto px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                                    >
                                      + Add Sub-link
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* -------------------------------------------------------- */}
                          {/* SUB-SECTION B: MEGA MENU SECTIONS & FEATURED CARD        */}
                          {/* -------------------------------------------------------- */}
                          {item.type === 'mega' && (
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-xs font-black uppercase tracking-wider text-purple-900 dark:text-purple-300">
                                    Mega Menu Columns &amp; Sections ({item.sections?.length || 0})
                                  </h4>
                                  <p className="text-[11px] text-slate-500">
                                    Organise multiple categorized columns with nested links.
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleAddSection(item.id)}
                                  className="text-xs font-bold text-purple-700 dark:text-purple-300 hover:underline flex items-center space-x-1"
                                >
                                  <IconPlus className="w-3.5 h-3.5" />
                                  <span>Add Section</span>
                                </button>
                              </div>

                              {/* Sections Grid */}
                              {item.sections && item.sections.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                  {item.sections.map((section) => (
                                    <div
                                      key={section.id}
                                      className={`rounded-lg border overflow-hidden ${
                                        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-300 shadow-2xs'
                                      }`}
                                    >
                                      <div className="p-2.5 bg-slate-100 dark:bg-slate-900/60 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center space-x-1.5">
                                          <span className="text-xs font-bold text-slate-900 dark:text-white">{section.title}</span>
                                          <span className="text-[10px] font-mono text-slate-500">({section.links.length})</span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setTargetParentHeaderId(item.id);
                                            setTargetSectionId(section.id);
                                            setEditingSubLink({ id: '', label: '', href: '', description: '' });
                                            setIsSubLinkModalOpen(true);
                                          }}
                                          className="text-[11px] font-bold text-purple-700 dark:text-purple-300 hover:underline"
                                        >
                                          + Add Link
                                        </button>
                                      </div>

                                      <div className="p-2 space-y-1 bg-slate-50/60 dark:bg-transparent">
                                        {section.links.map((sublink) => (
                                          <div
                                            key={sublink.id}
                                            className="flex items-center justify-between py-1 px-2 rounded bg-white dark:bg-slate-900 text-xs border border-slate-200/90 dark:border-slate-800/80"
                                          >
                                            <div className="min-w-0 pr-2">
                                              <p className="font-semibold text-slate-800 dark:text-white truncate">{sublink.label}</p>
                                              <p className="text-[10px] text-slate-500 font-mono truncate">{sublink.href}</p>
                                            </div>
                                            <div className="flex items-center space-x-1 shrink-0">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setTargetParentHeaderId(item.id);
                                                  setTargetSectionId(section.id);
                                                  setEditingSubLink({ ...sublink });
                                                  setIsSubLinkModalOpen(true);
                                                }}
                                                className="p-1 text-slate-500 hover:text-emerald-600"
                                              >
                                                <IconEdit className="w-3 h-3" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleDeleteSubLink(item.id, section.id, sublink.id)}
                                                className="p-1 text-slate-400 hover:text-red-600"
                                              >
                                                <IconTrash className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 italic">
                                  This mega menu is dynamically driven by the services catalog or has no custom sections.
                                </p>
                              )}

                              {/* Featured Teaser Card settings */}
                              <div className={`p-3.5 rounded-xl border ${
                                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-purple-50/40 border-purple-200/60'
                              }`}>
                                <span className="text-[11px] font-black uppercase tracking-wider text-purple-900 dark:text-purple-300 block mb-2">
                                  Featured Callout Teaser Card
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  <input
                                    type="text"
                                    placeholder="Teaser Category (e.g. Corporate Overview)"
                                    value={item.featured?.category || ''}
                                    onChange={e => {
                                      const cur = item.featured || { category: '', title: '', description: '', link: '' };
                                      handleUpdateHeaderItem(item.id, { featured: { ...cur, category: e.target.value } });
                                    }}
                                    className={`px-3 py-1.5 text-xs rounded-lg border outline-none ${
                                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                                    }`}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Teaser Title"
                                    value={item.featured?.title || ''}
                                    onChange={e => {
                                      const cur = item.featured || { category: '', title: '', description: '', link: '' };
                                      handleUpdateHeaderItem(item.id, { featured: { ...cur, title: e.target.value } });
                                    }}
                                    className={`px-3 py-1.5 text-xs rounded-lg border outline-none ${
                                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                                    }`}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Target Link URL (/about or /services)"
                                    value={item.featured?.link || ''}
                                    onChange={e => {
                                      const cur = item.featured || { category: '', title: '', description: '', link: '' };
                                      handleUpdateHeaderItem(item.id, { featured: { ...cur, link: e.target.value } });
                                    }}
                                    className={`px-3 py-1.5 text-xs rounded-lg border outline-none font-mono ${
                                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                                    }`}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Cover Image URL (/assets/...)"
                                    value={item.featured?.image || ''}
                                    onChange={e => {
                                      const cur = item.featured || { category: '', title: '', description: '', link: '' };
                                      handleUpdateHeaderItem(item.id, { featured: { ...cur, image: e.target.value } });
                                    }}
                                    className={`px-3 py-1.5 text-xs rounded-lg border outline-none font-mono ${
                                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Card Footer Actions */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={() => handleDeleteHeaderItem(item.id)}
                              className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
                            >
                              Remove Menu Item
                            </button>

                            <button
                              type="button"
                              onClick={() => setExpandedCardId(null)}
                              className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors"
                            >
                              Done Editing
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {headerItems.length === 0 && (
                  <div className={`p-8 rounded-2xl border text-center ${
                    isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      No menu items currently in the header navigation.
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Select pages or divisions from the left column to add them to your menu.
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Action Bar */}
              <div className="flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline font-semibold"
                >
                  Reset Menu to PIGL Defaults
                </button>

                <button
                  type="button"
                  onClick={handleSaveAllHeaderNav}
                  disabled={isSavingHeader}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md disabled:opacity-50"
                >
                  <IconCheck className="w-4 h-4" />
                  <span>{isSavingHeader ? 'Saving Menu...' : 'Save Navigation Menu'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: FOOTER NAVIGATION                                             */}
      {/* ==================================================================== */}
      {activeTab === 'footer' && (
        <div className="space-y-8">
          {/* Columns Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Footer Navigation Columns
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Manage the columns shown on the desktop and tablet footer grid.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingFooterCol({
                    id: '',
                    title: '',
                    order: navConfig.footer.columns.length + 1,
                    is_active: true,
                    links: []
                  });
                  setIsFooterColModalOpen(true);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <IconPlus className="w-3.5 h-3.5" />
                <span>Add Footer Column</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {navConfig.footer.columns.map((col, cIdx) => (
                <div
                  key={col.id}
                  className={`rounded-xl border p-5 flex flex-col justify-between ${
                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div>
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                          Column {cIdx + 1}
                        </span>
                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                          {col.title}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          disabled={cIdx === 0}
                          onClick={() => handleMoveFooterColumn(cIdx, 'left')}
                          className="p-1 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-20"
                          title="Move left"
                        >
                          ←
                        </button>
                        <button
                          disabled={cIdx === navConfig.footer.columns.length - 1}
                          onClick={() => handleMoveFooterColumn(cIdx, 'right')}
                          className="p-1 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-20"
                          title="Move right"
                        >
                          →
                        </button>
                        <button
                          onClick={() => {
                            setEditingFooterCol({ ...col });
                            setIsFooterColModalOpen(true);
                          }}
                          className="p-1 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                        >
                          <IconEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFooterCol(col.id)}
                          className="p-1 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                        >
                          <IconTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Column Links List */}
                    <div className="py-3 space-y-1.5">
                      {col.links.map((link, lIdx) => (
                        <div
                          key={link.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                              {link.label}
                            </span>
                            <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-medium block truncate">
                              {link.href}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              disabled={lIdx === 0}
                              onClick={() => handleMoveFooterLink(col.id, lIdx, 'up')}
                              className="p-0.5 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-20"
                            >
                              <IconArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              disabled={lIdx === col.links.length - 1}
                              onClick={() => handleMoveFooterLink(col.id, lIdx, 'down')}
                              className="p-0.5 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-20"
                            >
                              <IconArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                setTargetFooterColId(col.id);
                                setIsBottomLinkModal(false);
                                setEditingFooterLink({ ...link });
                                setIsFooterLinkModalOpen(true);
                              }}
                              className="p-1 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                            >
                              <IconEdit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteFooterLink(col.id, link.id)}
                              className="p-1 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                            >
                              <IconTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTargetFooterColId(col.id);
                      setIsBottomLinkModal(false);
                      setEditingFooterLink({
                        id: '',
                        label: '',
                        href: '',
                        is_active: true,
                        order: col.links.length + 1
                      });
                      setIsFooterLinkModalOpen(true);
                    }}
                    className="w-full mt-2 py-2 border border-dashed border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 hover:border-emerald-500 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                  >
                    <IconPlus className="w-3 h-3" />
                    <span>Add Link to {col.title}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Copyright Bar Links */}
          <div className={`p-6 rounded-xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Footer Bottom Bar Quick Links
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Links displayed adjacent to the copyright note (e.g. Vendor Portal, Privacy Policy, Terms).
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsBottomLinkModal(true);
                  setTargetFooterColId(null);
                  setEditingFooterLink({
                    id: '',
                    label: '',
                    href: '',
                    is_active: true,
                    order: navConfig.footer.bottom_links.length + 1
                  });
                  setIsFooterLinkModalOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors"
              >
                + Add Bottom Link
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {navConfig.footer.bottom_links.map((link) => (
                <div
                  key={link.id}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex items-center space-x-2 text-xs"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{link.label}</span>
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-medium">({link.href})</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBottomLinkModal(true);
                      setEditingFooterLink({ ...link });
                      setIsFooterLinkModalOpen(true);
                    }}
                    className="text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                  >
                    <IconEdit className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: PAGES DIRECTORY & SEO                                         */}
      {/* ==================================================================== */}
      {activeTab === 'pages' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <IconSearch className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search pages by title or route..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 text-xs rounded-lg border outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-500'
                }`}
              />
            </div>

            <button
              onClick={() => {
                setEditingPage({
                  id: '',
                  title: '',
                  slug: '/',
                  description: '',
                  meta_title: '',
                  meta_description: '',
                  is_published: true,
                  show_in_header: false,
                  show_in_footer: false
                });
                setIsPageModalOpen(true);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm self-start sm:self-auto"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Add Custom Page</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPages.map((page) => {
              const metaTitleLen = (page.meta_title || `${page.title} | PIGL`).length;
              const metaDescLen = (page.meta_description || '').length;

              return (
                <div
                  key={page.id}
                  className={`p-4 sm:p-5 rounded-xl border flex flex-col justify-between transition-all ${
                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                            {page.title}
                          </h4>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            page.is_published
                              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}>
                            {page.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold block mt-0.5">
                          {page.slug}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingPage({ ...page });
                            setIsPageModalOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit Page SEO"
                        >
                          <IconEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePage(page.id)}
                          className="p-1.5 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                          title="Delete Page"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                      {page.description || 'No internal description.'}
                    </p>

                    {/* SEO Preview Box & Metrics */}
                    <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                      isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'
                    }`}>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-slate-400">
                        <span className="font-bold uppercase tracking-wider">Search Snippet Preview</span>
                        <div className="flex items-center space-x-2 font-medium">
                          <span>Title: {metaTitleLen}c</span>
                          <span>Desc: {metaDescLen}c</span>
                        </div>
                      </div>
                      <p className="font-semibold text-blue-700 dark:text-blue-400 text-xs truncate">
                        {page.meta_title || `${page.title} | PIGL`}
                      </p>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                        {page.meta_description || 'High-fidelity 3D reality capture, geotechnical investigations, and digital twins across Sub-Saharan Africa.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3.5 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      {page.show_in_header && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                          In Header
                        </span>
                      )}
                      {page.show_in_footer && (
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                          In Footer
                        </span>
                      )}
                    </div>

                    <a
                      href={page.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400 flex items-center space-x-1 font-semibold"
                    >
                      <span>View Route</span>
                      <IconExternal className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: HEADER LINK EDITOR                                          */}
      {/* ==================================================================== */}
      {isHeaderModalOpen && editingHeaderItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {isNewHeaderItem ? 'Add Top Menu Item' : 'Edit Top Menu Item'}
              </h3>
              <button
                onClick={() => setIsHeaderModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveHeaderModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Menu Label *
                </label>
                <input
                  type="text"
                  required
                  value={editingHeaderItem.name}
                  onChange={e => setEditingHeaderItem({ ...editingHeaderItem, name: e.target.value })}
                  placeholder="e.g. Services, About Us, Sustainability"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500' : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    URL Route / Path *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingHeaderItem.href}
                    onChange={e => setEditingHeaderItem({ ...editingHeaderItem, href: e.target.value })}
                    placeholder="e.g. /about or https://..."
                    className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none font-mono ${
                      isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500' : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Display Type
                  </label>
                  <select
                    value={editingHeaderItem.type}
                    onChange={e => setEditingHeaderItem({ ...editingHeaderItem, type: e.target.value as any })}
                    className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white' : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900'
                    }`}
                  >
                    <option value="standard">Standard Link</option>
                    <option value="mega">Mega Menu Dropdown</option>
                    <option value="external">External Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Optional Badge Tag
                </label>
                <input
                  type="text"
                  value={editingHeaderItem.badge || ''}
                  onChange={e => setEditingHeaderItem({ ...editingHeaderItem, badge: e.target.value })}
                  placeholder="e.g. 'NEW', 'ISO', 'PORTAL'"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500' : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-500'
                  }`}
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="headerIsActive"
                  checked={editingHeaderItem.is_active}
                  onChange={e => setEditingHeaderItem({ ...editingHeaderItem, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="headerIsActive" className="text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                  Visible in Top Navigation Bar
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsHeaderModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Save Menu Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: SUB-LINK EDITOR                                             */}
      {/* ==================================================================== */}
      {isSubLinkModalOpen && editingSubLink && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Edit Dropdown Sub-Link</h3>
              <button
                onClick={() => setIsSubLinkModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSubLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Link Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingSubLink.label}
                  onChange={e => setEditingSubLink({ ...editingSubLink, label: e.target.value })}
                  placeholder="e.g. Core Values"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500' : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  URL / Target Route *
                </label>
                <input
                  type="text"
                  required
                  value={editingSubLink.href}
                  onChange={e => setEditingSubLink({ ...editingSubLink, href: e.target.value })}
                  placeholder="e.g. /about?section=values"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none font-mono ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500' : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={editingSubLink.description || ''}
                  onChange={e => setEditingSubLink({ ...editingSubLink, description: e.target.value })}
                  placeholder="e.g. Professionalism, innovation, integrity and safety"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500' : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-500'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSubLinkModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Save Sub-Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: FOOTER LINK & COLUMN EDITORS                                */}
      {/* ==================================================================== */}
      {isFooterColModalOpen && editingFooterCol && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-black text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
              Edit Footer Column
            </h3>
            <form onSubmit={handleSaveFooterColModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Column Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingFooterCol.title}
                  onChange={e => setEditingFooterCol({ ...editingFooterCol, title: e.target.value })}
                  placeholder="e.g. Core Capabilities, Governance"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500' : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-500'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFooterColModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Save Column
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isFooterLinkModalOpen && editingFooterLink && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-black text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
              {isBottomLinkModal ? 'Edit Bottom Bar Link' : 'Edit Footer Link'}
            </h3>
            <form onSubmit={handleSaveFooterLinkModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Link Label *
                </label>
                <input
                  type="text"
                  required
                  value={editingFooterLink.label}
                  onChange={e => setEditingFooterLink({ ...editingFooterLink, label: e.target.value })}
                  placeholder="e.g. Executed Projects"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500' : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  URL Route *
                </label>
                <input
                  type="text"
                  required
                  value={editingFooterLink.href}
                  onChange={e => setEditingFooterLink({ ...editingFooterLink, href: e.target.value })}
                  placeholder="e.g. /projects or /services/ground-intelligence"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none font-mono ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500' : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-500'
                  }`}
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="flinkActive"
                  checked={editingFooterLink.is_active}
                  onChange={e => setEditingFooterLink({ ...editingFooterLink, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="flinkActive" className="text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                  Visible in Footer
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFooterLinkModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: PAGE & SEO METADATA EDITOR                                  */}
      {/* ==================================================================== */}
      {isPageModalOpen && editingPage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-xl p-6 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Edit Page Metadata & SEO</h3>
              <button
                onClick={() => setIsPageModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePageModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPage.title}
                    onChange={e => setEditingPage({ ...editingPage, title: e.target.value })}
                    placeholder="e.g. Careers"
                    className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500' : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Slug / Route URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPage.slug}
                    onChange={e => setEditingPage({ ...editingPage, slug: e.target.value })}
                    placeholder="e.g. /careers"
                    className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none font-mono ${
                      isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500' : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Google SEO Meta Title (Recommended: &lt;60 chars)
                </label>
                <input
                  type="text"
                  value={editingPage.meta_title || ''}
                  onChange={e => setEditingPage({ ...editingPage, meta_title: e.target.value })}
                  placeholder="e.g. Careers at Polaris Integrated & GeoSolutions Limited"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500' : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-500'
                  }`}
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-1 block">
                  Current length: {(editingPage.meta_title || '').length} characters
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Google SEO Meta Description (Recommended: &lt;160 chars)
                </label>
                <textarea
                  rows={3}
                  value={editingPage.meta_description || ''}
                  onChange={e => setEditingPage({ ...editingPage, meta_description: e.target.value })}
                  placeholder="Brief summary appearing in Google search snippets..."
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500' : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-500'
                  }`}
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-1 block">
                  Current length: {(editingPage.meta_description || '').length} characters
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="pgHeader"
                    checked={editingPage.show_in_header}
                    onChange={e => setEditingPage({ ...editingPage, show_in_header: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="pgHeader" className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    Show link in Header
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="pgFooter"
                    checked={editingPage.show_in_footer}
                    onChange={e => setEditingPage({ ...editingPage, show_in_footer: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="pgFooter" className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    Show link in Footer
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPageModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Save Page Metadata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 5: RESET CONFIRMATION                                          */}
      {/* ==================================================================== */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-black text-red-500 flex items-center space-x-2">
              <span>⚠️ Restore Default Navigation?</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This action will reset the top header navigation, mega-menus, and footer columns back to the official corporate layout. Any custom links you created will be replaced by the defaults.
            </p>
            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Yes, Restore Defaults
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminNavigation;
