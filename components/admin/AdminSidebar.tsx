import React from 'react';
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
  IconSun,
  IconMoon,
  IconChevronLeft,
  IconChevronRight,
  IconX,
  IconUserCircle,
  IconGlobe,
  IconVideo
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

  const navSections = [
    {
      title: 'Overview',
      dotColor: 'bg-emerald-500',
      items: [
        { id: 'dashboard', label: 'Dashboard Overview', Icon: IconDashboard }
      ]
    },
    {
      title: 'Website & Content (CMS)',
      dotColor: 'bg-blue-500',
      items: [
        { id: 'navigation', label: 'Navigation & Pages', Icon: IconGlobe },
        { id: 'sliders', label: 'Homepage Banners', Icon: IconSliders },
        { id: 'services', label: 'Services & Capabilities', Icon: IconServices },
        { id: 'projects', label: 'Projects & Case Studies', Icon: IconProjects },
        { id: 'videos', label: 'Video Showcase Hub', Icon: IconVideo },
        { id: 'partners', label: 'Technology Partners', Icon: IconPartners },
        { id: 'team', label: 'Management Team', Icon: IconUsers },
        { id: 'blog', label: 'Publications & News', Icon: IconBlog },
        { id: 'media', label: 'Media Library', Icon: IconMedia }
      ]
    },
    {
      title: 'Inbound Desks & Portals',
      dotColor: 'bg-amber-500',
      items: [
        { id: 'inquiries', label: 'Inquiries & RFPs', Icon: IconInquiries, badge: unreadInquiriesCount > 0 ? unreadInquiriesCount : undefined },
        { id: 'vendors', label: 'Vendor Onboarding Desk', Icon: IconVendor, badge: pendingVendorsCount > 0 ? pendingVendorsCount : undefined },
        { id: 'careers', label: 'Careers & CV Inbox', Icon: IconCareers }
      ]
    },
    {
      title: 'Marketing & Outreach',
      dotColor: 'bg-indigo-500',
      items: [
        { id: 'campaigns', label: 'Campaigns & Newsletters', Icon: IconCampaign },
        { id: 'followups', label: 'Follow Up & Broadcast', Icon: IconMail }
      ]
    },
    {
      title: 'Settings & Governance',
      dotColor: 'bg-purple-500',
      items: [
        { id: 'settings', label: 'Corporate & System Settings', Icon: IconSettings },
        { id: 'users', label: 'Admin Team & Roles', Icon: IconUsers },
        { id: 'profile', label: 'Admin Profile & Security', Icon: IconUserCircle }
      ]
    }
  ];

  const handleLinkClick = (tabId: string) => {
    onTabChange(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  React.useEffect(() => {
    if (mobileOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [mobileOpen]);

  const sidebarContent = (
    <div className={`flex flex-col h-full max-h-screen select-none border-r transition-all duration-300 ${
      isDark 
        ? 'bg-slate-950 text-slate-300 border-slate-800/80' 
        : 'bg-white text-slate-800 border-slate-200 shadow-sm'
    } ${isCollapsed ? 'w-20' : 'w-64 xl:w-72'}`}>
      
      {/* Brand Header */}
      <div className={`px-4 py-3.5 border-b flex ${isCollapsed ? 'flex-col justify-center items-center gap-2 py-3' : 'items-center justify-between'} min-h-[68px] shrink-0 ${
        isDark ? 'border-slate-800/80 bg-slate-950' : 'border-slate-200 bg-white'
      }`}>
        <div className={`flex items-center space-x-3 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
          <a 
            href="/admin" 
            onClick={(e) => { e.preventDefault(); handleLinkClick('dashboard'); }}
            title="PIGL Admin Portal"
            className="flex items-center space-x-2.5 focus:outline-none group"
          >
            {!isCollapsed ? (
              <div className="flex items-center space-x-2.5">
                <img
                  src={isDark ? LogoLightImg : LogoDarkImg}
                  alt="PIGL Portal"
                  className="h-8.5 w-auto max-w-[145px] object-contain transition-transform group-hover:scale-105"
                />
                <span className={`text-[9.5px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border font-bold ${
                  isDark ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}>
                  CMS
                </span>
              </div>
            ) : (
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                isDark 
                  ? 'bg-gradient-to-br from-emerald-600/25 to-slate-900 border-emerald-500/40 group-hover:border-emerald-400/80' 
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 group-hover:border-emerald-500 shadow-sm'
              }`}>
                <span className={`font-black text-sm tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>P</span>
              </div>
            )}
          </a>
        </div>

        {/* Mobile Close Button */}
        {mobileOpen && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className={`md:hidden p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label="Close sidebar"
          >
            <IconX className="w-5 h-5" />
          </button>
        )}

        {/* Desktop Collapse Toggle */}
        {!mobileOpen && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`hidden md:flex items-center justify-center p-1.5 rounded-lg transition-colors border ${
              isCollapsed 
                ? isDark
                  ? 'w-8 h-8 bg-slate-900/90 border-slate-800 hover:border-slate-700 text-emerald-400'
                  : 'w-8 h-8 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-700 shadow-sm'
                : isDark
                  ? 'w-7 h-7 bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-white'
                  : 'w-7 h-7 bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 shadow-sm'
            }`}
          >
            {isCollapsed ? <IconChevronRight className="w-4 h-4" /> : <IconChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className={`flex-1 min-h-0 overflow-y-auto overscroll-contain overflow-x-hidden ${isCollapsed ? 'px-2' : 'px-3'} py-3.5 space-y-4 no-scrollbar text-xs`}>
        {navSections.map((section, sIdx) => (
          <div key={section.title || sIdx}>
            {!isCollapsed ? (
              <div className={`px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <span>{section.title}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${section.dotColor}`}></span>
              </div>
            ) : (
              <div className={`my-2 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`} />
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = currentTab === item.id;
                const Icon = item.Icon;
                const badge = (item as any).badge;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id)}
                    title={item.label}
                    className={`w-full flex items-center relative ${
                      isCollapsed 
                        ? 'justify-center h-10 rounded-xl p-0' 
                        : 'justify-between px-3 py-2 rounded-xl'
                    } font-medium transition-all group ${
                      isActive
                        ? isDark
                          ? 'bg-slate-800/95 text-white font-semibold shadow-sm border border-slate-700/80 ring-1 ring-emerald-500/20'
                          : 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-300 shadow-sm ring-1 ring-emerald-600/30'
                        : isDark
                          ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
                          : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive 
                          ? isDark ? 'text-emerald-400' : 'text-emerald-700 font-bold'
                          : isDark ? 'text-slate-400 group-hover:text-emerald-400' : 'text-slate-500 group-hover:text-emerald-700'
                      }`} />
                      {!isCollapsed && <span className="text-[13px] tracking-tight truncate">{item.label}</span>}
                    </div>
                    {!isCollapsed && badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold font-mono ${
                        isActive 
                          ? isDark ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-emerald-600 text-white font-black'
                          : isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {badge}
                      </span>
                    )}
                    {isCollapsed && badge !== undefined && (
                      <span className={`absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center shadow-sm ${
                        isDark ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white'
                      }`}>
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div>
          {!isCollapsed ? (
            <div className={`px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <span>Appearance & Links</span>
            </div>
          ) : (
            <div className={`my-1 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`} />
          )}
          <div className="space-y-0.5">
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`w-full flex items-center ${
                  isCollapsed 
                    ? 'justify-center h-10 rounded-xl p-0' 
                    : 'justify-between px-3 py-2 rounded-xl'
                } font-medium transition-all border ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-900/80 border-slate-800/60'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                  {theme === 'dark' ? (
                    <IconSun className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <IconMoon className="w-4 h-4 text-indigo-600 shrink-0" />
                  )}
                  {!isCollapsed && <span className="text-[13px] tracking-tight">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>}
                </div>
                {!isCollapsed && (
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    isDark ? 'text-slate-400 bg-slate-800' : 'text-slate-600 bg-slate-100'
                  }`}>
                    Toggle
                  </span>
                )}
              </button>
            )}

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              title="View Public Website"
              className={`w-full flex items-center ${
                isCollapsed 
                  ? 'justify-center h-10 rounded-xl p-0' 
                  : 'justify-between px-3 py-2 rounded-xl'
              } font-medium transition-all border border-transparent ${
                isDark
                  ? 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900/80 hover:border-slate-800'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-100 hover:border-slate-200'
              }`}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                <IconExternal className={`w-4 h-4 shrink-0 ${
                  isDark ? 'text-slate-500 group-hover:text-emerald-400' : 'text-slate-500 group-hover:text-emerald-700'
                }`} />
                {!isCollapsed && <span className="text-[13px] tracking-tight">Public Website</span>}
              </div>
              {!isCollapsed && (
                <span className={`text-[10px] font-mono font-bold ${
                  isDark ? 'text-slate-500' : 'text-emerald-700'
                }`}>
                  Live
                </span>
              )}
            </a>
          </div>
        </div>
      </nav>

      {/* User Profile Footer */}
      <div className={`p-3 border-t flex shrink-0 ${
        isCollapsed ? 'flex-col items-center gap-2' : 'items-center justify-between'
      } ${
        isDark ? 'border-slate-800/80 bg-slate-950' : 'border-slate-200 bg-slate-50'
      }`}>
        <button
          onClick={() => handleLinkClick('profile')}
          title={`Signed in as ${effectiveName} (${user?.role || 'Admin'})`}
          className={`flex items-center ${
            isCollapsed ? 'justify-center p-1.5 w-full' : 'space-x-3 p-1.5 flex-1'
          } rounded-xl transition-colors text-left overflow-hidden group ${
            isDark ? 'hover:bg-slate-900/80' : 'hover:bg-slate-200/80'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg border font-bold text-xs flex items-center justify-center flex-shrink-0 overflow-hidden ${
            isDark 
              ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300' 
              : 'bg-emerald-100 border-emerald-300 text-emerald-800'
          }`}>
            {effectiveAvatar ? (
              <img src={effectiveAvatar} alt={effectiveName} className="w-full h-full object-cover" />
            ) : (
              <span>{effectiveName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden flex-1">
              <p className={`text-xs font-bold transition-colors truncate ${
                isDark ? 'text-slate-200 group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-emerald-700'
              }`}>
                {effectiveName}
              </p>
              <p className={`text-[10px] font-mono truncate font-medium ${
                isDark ? 'text-slate-500' : 'text-slate-600'
              }`}>
                {user?.role || 'Super Admin'}
              </p>
            </div>
          )}
        </button>

        <button
          onClick={onLogout}
          title="Sign Out"
          className={`p-2 rounded-xl transition-colors shrink-0 ${
            isCollapsed ? 'w-8 h-8 flex items-center justify-center' : ''
          } ${
            isDark 
              ? 'text-slate-500 hover:text-red-400 hover:bg-slate-900/80' 
              : 'text-slate-500 hover:text-red-600 hover:bg-slate-200/80'
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
      {/* Desktop Sidebar (Fixed to Viewport with Independent Nav Scroll) */}
      <aside className="hidden md:flex flex-shrink-0 h-screen max-h-screen z-40 overflow-hidden select-none">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer (Modal) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full shadow-2xl z-10 transform transition-transform duration-300 ease-in-out animate-slide-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
