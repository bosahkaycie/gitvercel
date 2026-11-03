import React, { useState, useEffect } from 'react';
import LogoDarkImg from '../../assets/LOGO.png';
import LogoLightImg from '../../assets/logo_light.png';
import { AdminUser } from '../../types';
import {
  IconDashboard,
  IconServices,
  IconProjects,
  IconPartners,
  IconCareers,
  IconVendor,
  IconInquiries,
  IconBlog,
  IconSliders,
  IconUsers,
  IconMedia,
  IconSettings,
  IconExternal,
  IconLogout,
  IconCampaign,
  IconMail,
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconX,
  IconUserCircle,
  IconGlobe,
  IconVideo,
  IconBuilding,
  IconShield
} from './AdminIcons';

interface AdminSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  user?: AdminUser | null;
  adminEmail?: string;
  unreadInquiriesCount?: number;
  pendingVendorsCount?: number;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  Icon: React.FC<any>;
  badge?: number;
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onTabChange,
  onLogout,
  user,
  adminEmail = 'admin@polarisigl.com',
  unreadInquiriesCount = 0,
  pendingVendorsCount = 0,
  theme = 'light',
  onToggleTheme,
  isCollapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile
}) => {
  const isDark = theme === 'dark';
  const effectiveEmail = user?.email || adminEmail;
  const effectiveName = user?.full_name || effectiveEmail.split('@')[0];
  const effectiveAvatar = user?.avatar_url;

  // Persisted group collapse state
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('pigl_admin_sidebar_groups');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => {
      const next = { ...prev, [groupId]: !prev[groupId] };
      try {
        localStorage.setItem('pigl_admin_sidebar_groups', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const navGroups: NavGroup[] = [
    {
      id: 'overview',
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard Overview', Icon: IconDashboard }
      ]
    },
    {
      id: 'website',
      title: 'Website Management',
      items: [
        { id: 'navigation', label: 'Navigation & Pages', Icon: IconGlobe },
        { id: 'sliders', label: 'Homepage Banners', Icon: IconSliders },
        { id: 'services', label: 'Services & Capabilities', Icon: IconServices },
        { id: 'projects', label: 'Projects & Case Studies', Icon: IconProjects },
        { id: 'videos', label: 'Video Showcase Hub', Icon: IconVideo },
        { id: 'partners', label: 'Technology Partners', Icon: IconPartners },
        { id: 'testimonials', label: 'Client Endorsements', Icon: IconPartners },
        { id: 'blog', label: 'Publications & News', Icon: IconBlog },
        { id: 'media', label: 'Media Library', Icon: IconMedia }
      ]
    },
    {
      id: 'operations',
      title: 'Business Operations',
      items: [
        {
          id: 'inquiries',
          label: 'Inquiries & RFPs',
          Icon: IconInquiries,
          badge: unreadInquiriesCount > 0 ? unreadInquiriesCount : undefined
        },
        {
          id: 'vendors',
          label: 'Vendor Onboarding Desk',
          Icon: IconVendor,
          badge: pendingVendorsCount > 0 ? pendingVendorsCount : undefined
        },
        { id: 'careers', label: 'Careers & CV Inbox', Icon: IconCareers }
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing',
      items: [
        { id: 'campaigns', label: 'Campaigns & Newsletters', Icon: IconCampaign },
        { id: 'followups', label: 'Follow Up & Broadcast', Icon: IconMail }
      ]
    },
    {
      id: 'organisation',
      title: 'Organisation',
      items: [
        { id: 'team', label: 'Management Team', Icon: IconUsers },
        { id: 'corporate-profile', label: 'Corporate Profile', Icon: IconBuilding }
      ]
    },
    {
      id: 'administration',
      title: 'Administration',
      items: [
        { id: 'settings', label: 'Corporate & System Settings', Icon: IconSettings },
        { id: 'users', label: 'Admin Team & Roles', Icon: IconShield },
        { id: 'profile', label: 'Admin Profile & Security', Icon: IconUserCircle }
      ]
    }
  ];

  const handleLinkClick = (tabId: string) => {
    onTabChange(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  useEffect(() => {
    if (mobileOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [mobileOpen]);

  const sidebarContent = (
    <div
      className={`flex flex-col h-full max-h-screen select-none border-r transition-all duration-300 font-sans ${
        isDark
          ? 'bg-slate-950 text-slate-300 border-slate-800'
          : 'bg-white text-slate-800 border-slate-200 shadow-xs'
      } ${isCollapsed ? 'w-[72px]' : 'w-[250px]'}`}
    >
      {/* Brand Header */}
      <div
        className={`px-4 py-3.5 border-b flex items-center ${
          isCollapsed ? 'justify-center' : 'justify-between'
        } h-16 shrink-0 ${
          isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'
        }`}
      >
        <a
          href="/admin"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('dashboard');
          }}
          title="PIGL CMS Dashboard"
          className="flex items-center space-x-2.5 focus:outline-none group overflow-hidden"
        >
          {!isCollapsed ? (
            <div className="flex items-center space-x-2">
              <img
                src={isDark ? LogoLightImg : LogoDarkImg}
                alt="PIGL Portal"
                className="h-7 w-auto max-w-[130px] object-contain transition-transform group-hover:scale-102"
              />
              <span
                className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded font-bold border ${
                  isDark
                    ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80'
                    : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                }`}
              >
                CMS
              </span>
            </div>
          ) : (
            <div
              className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-emerald-400 group-hover:border-emerald-500'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 group-hover:border-emerald-400'
              }`}
            >
              <span className="font-extrabold text-sm tracking-wider">P</span>
            </div>
          )}
        </a>

        {/* Mobile Close Button */}
        {mobileOpen && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className={`md:hidden p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label="Close sidebar"
          >
            <IconX className="w-5 h-5" />
          </button>
        )}

        {/* Desktop Collapse Toggle */}
        {!mobileOpen && onToggleCollapse && !isCollapsed && (
          <button
            onClick={onToggleCollapse}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
            className={`hidden md:flex items-center justify-center w-7 h-7 rounded-lg transition-colors border ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <IconChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Nav Links (Scrollable with clean vertical hierarchy) */}
      <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-2.5 py-3 space-y-3.5 no-scrollbar">
        {navGroups.map((group) => {
          const isGroupCollapsed = Boolean(collapsedGroups[group.id]);
          const hasActiveItem = group.items.some((item) => item.id === currentTab);

          return (
            <div key={group.id} className="space-y-1">
              {/* Group Heading (Collapsible on Desktop/Mobile) */}
              {!isCollapsed ? (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full px-2 py-1 text-[11px] font-bold uppercase tracking-wider flex items-center justify-between rounded hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors ${
                    hasActiveItem
                      ? 'text-emerald-800 dark:text-emerald-400'
                      : isDark
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  }`}
                >
                  <span className="truncate">{group.title}</span>
                  <span className="text-slate-400 dark:text-slate-500 shrink-0 ml-1">
                    {isGroupCollapsed ? (
                      <IconChevronRight className="w-3 h-3" />
                    ) : (
                      <IconChevronDown className="w-3 h-3" />
                    )}
                  </span>
                </button>
              ) : (
                <div
                  className={`my-2 border-t ${
                    isDark ? 'border-slate-800/80' : 'border-slate-100'
                  }`}
                />
              )}

              {/* Group Items (Hidden if group is collapsed) */}
              {(!isGroupCollapsed || isCollapsed) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = currentTab === item.id;
                    const Icon = item.Icon;
                    const badge = item.badge;

                    return (
                      <div key={item.id} className="relative group/tooltip">
                        <button
                          type="button"
                          onClick={() => handleLinkClick(item.id)}
                          className={`w-full flex items-center transition-all ${
                            isCollapsed
                              ? 'justify-center h-9 w-full rounded-lg p-0'
                              : 'justify-between px-2.5 py-2 rounded-lg'
                          } text-[13px] font-medium ${
                            isActive
                              ? isDark
                                ? 'bg-emerald-950/40 text-emerald-300 font-bold border border-emerald-800/80 shadow-2xs'
                                : 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-300/90 shadow-2xs'
                              : isDark
                              ? 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
                              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/90 border border-transparent'
                          }`}
                        >
                          <div
                            className={`flex items-center min-w-0 ${
                              isCollapsed ? 'justify-center' : 'space-x-2.5'
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 shrink-0 transition-colors ${
                                isActive
                                  ? isDark
                                    ? 'text-emerald-400'
                                    : 'text-emerald-700'
                                  : isDark
                                  ? 'text-slate-400 group-hover/tooltip:text-slate-200'
                                  : 'text-slate-600 group-hover/tooltip:text-slate-900'
                              }`}
                            />
                            {!isCollapsed && (
                              <span className="truncate tracking-tight">{item.label}</span>
                            )}
                          </div>

                          {!isCollapsed && badge !== undefined && (
                            <span
                              className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono shrink-0 ${
                                isActive
                                  ? isDark
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-emerald-700 text-white'
                                  : isDark
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/70'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {badge}
                            </span>
                          )}

                          {isCollapsed && badge !== undefined && (
                            <span
                              className={`absolute top-1 right-1 min-w-[14px] h-3.5 px-0.5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                                isDark
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {badge}
                            </span>
                          )}
                        </button>

                        {/* Collapsed Mode Floating Tooltip */}
                        {isCollapsed && (
                          <div className="hidden md:group-hover/tooltip:flex absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 items-center pointer-events-none">
                            <div
                              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap shadow-lg border ${
                                isDark
                                  ? 'bg-slate-900 text-white border-slate-700'
                                  : 'bg-slate-900 text-white border-slate-800'
                              }`}
                            >
                              <span>{item.label}</span>
                              {badge !== undefined && (
                                <span className="ml-1.5 px-1 py-0.2 rounded bg-emerald-500 text-slate-950 font-bold text-[10px]">
                                  {badge}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Expand Button when Collapsed */}
      {isCollapsed && onToggleCollapse && (
        <div className="p-2 border-t border-slate-200 dark:border-slate-800 flex justify-center shrink-0">
          <button
            type="button"
            onClick={onToggleCollapse}
            title="Expand sidebar"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <IconChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* User Account / Profile Footer (Fixed, Non-overlapping) */}
      <div
        className={`p-2.5 border-t flex shrink-0 ${
          isCollapsed ? 'flex-col items-center gap-1.5' : 'items-center justify-between'
        } ${
          isDark
            ? 'border-slate-800 bg-slate-950'
            : 'border-slate-200 bg-slate-50/70'
        }`}
      >
        <button
          type="button"
          onClick={() => handleLinkClick('profile')}
          title={`Signed in as ${effectiveName}`}
          className={`flex items-center ${
            isCollapsed ? 'justify-center p-1 w-full' : 'space-x-2.5 p-1.5 flex-1 min-w-0'
          } rounded-lg transition-colors text-left overflow-hidden ${
            isDark ? 'hover:bg-slate-900/80' : 'hover:bg-slate-200/80'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-md border font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden ${
              isDark
                ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                : 'bg-emerald-100 border-emerald-200 text-emerald-800'
            }`}
          >
            {effectiveAvatar ? (
              <img
                src={effectiveAvatar}
                alt={effectiveName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{effectiveName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden min-w-0 flex-1">
              <p
                className={`text-xs font-bold truncate leading-tight ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                {effectiveName}
              </p>
              <p
                className={`text-[11px] font-mono truncate leading-tight mt-0.5 font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {user?.role || 'Administrator'}
              </p>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={onLogout}
          title="Sign Out"
          className={`p-1.5 rounded-lg transition-colors shrink-0 ${
            isDark
              ? 'text-slate-500 hover:text-red-400 hover:bg-slate-900'
              : 'text-slate-400 hover:text-red-600 hover:bg-slate-200/80'
          }`}
          aria-label="Sign Out"
        >
          <IconLogout className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed 250px) */}
      <aside className="hidden md:flex shrink-0 h-screen max-h-screen z-40 overflow-hidden select-none">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity duration-300"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative flex-1 flex flex-col max-w-[280px] w-full shadow-2xl z-10 transform transition-transform duration-300 ease-in-out">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
