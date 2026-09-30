import React, { useState, useEffect, useRef } from 'react';
import {
  IconBell,
  IconCheck,
  IconInquiries,
  IconVendor,
  IconCareers,
  IconMail,
  IconShield,
  IconX,
  IconExternal,
  IconArrowRight
} from './AdminIcons';
import { ContactInquiry, VendorApplication, JobApplication, DirectFollowUpEmail, AuditLog } from '../../types';

export interface AdminNotification {
  id: string;
  type: 'inquiry' | 'vendor' | 'job' | 'email' | 'system';
  title: string;
  description: string;
  timestamp: string;
  targetTab: string;
  read: boolean;
  priority?: 'high' | 'normal';
}

interface AdminNotificationCenterProps {
  inquiries?: ContactInquiry[];
  vendors?: VendorApplication[];
  applications?: JobApplication[];
  followUps?: DirectFollowUpEmail[];
  auditLogs?: AuditLog[];
  onNavigateTab: (tabId: string) => void;
  theme?: 'light' | 'dark';
}

const READ_NOTIFS_STORAGE_KEY = 'pigl_admin_read_notification_ids';

export const AdminNotificationCenter: React.FC<AdminNotificationCenterProps> = ({
  inquiries = [],
  vendors = [],
  applications = [],
  followUps = [],
  auditLogs = [],
  onNavigateTab,
  theme = 'light'
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(READ_NOTIFS_STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync read IDs with localStorage
  const markAsRead = (id: string) => {
    setReadIds(prev => {
      const updated = new Set(prev);
      updated.add(id);
      try {
        localStorage.setItem(READ_NOTIFS_STORAGE_KEY, JSON.stringify(Array.from(updated)));
      } catch {}
      return updated;
    });
  };

  const markAllAsRead = () => {
    const allIds = new Set<string>();
    notifications.forEach(n => allIds.add(n.id));
    setReadIds(allIds);
    try {
      localStorage.setItem(READ_NOTIFS_STORAGE_KEY, JSON.stringify(Array.from(allIds)));
    } catch {}
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

const ENTITY_NAV_MAP: Record<string, { tab: string; label: string }> = {
  service: { tab: 'services', label: 'Services & Capabilities' },
  blog: { tab: 'blog', label: 'Publications & News' },
  slider: { tab: 'sliders', label: 'Homepage Banners' },
  project: { tab: 'projects', label: 'Projects & Case Studies' },
  partner: { tab: 'partners', label: 'Technology Partners' },
  team_member: { tab: 'team', label: 'Management Team' },
  vendor_application: { tab: 'vendors', label: 'Vendor Desk' },
  job_application: { tab: 'careers', label: 'Careers & Applications' },
  job_opening: { tab: 'careers', label: 'Careers & Openings' },
  inquiry: { tab: 'inquiries', label: 'Inquiries & RFPs' },
  email_campaign: { tab: 'campaigns', label: 'Email Campaigns' },
  email_subscriber: { tab: 'campaigns', label: 'Newsletter Subscribers' },
  admin_user: { tab: 'users', label: 'Admin Security & Roles' },
  media: { tab: 'media', label: 'Media Library' },
  setting: { tab: 'settings', label: 'Database & Settings' }
};

  // Generate dynamic live notifications list
  const notifications: AdminNotification[] = [];

  // 1. Inquiries & RFPs
  inquiries.forEach(inq => {
    const name = inq.name || 'Prospective Client';
    const company = inq.company ? inq.company : 'Direct Client';
    const scope = inq.service_interest || inq.subject || 'Engineering Consultation';
    notifications.push({
      id: `inq-${inq.id}`,
      type: 'inquiry',
      title: inq.status === 'new' ? 'New Project Scope Inquiry' : 'Customer Inquiry Lead',
      description: `${name} (${company}) submitted inquiry for ${scope}.`,
      timestamp: inq.created_at || new Date().toISOString(),
      targetTab: 'inquiries',
      read: readIds.has(`inq-${inq.id}`),
      priority: inq.status === 'new' ? 'high' : 'normal'
    });
  });

  // 2. Vendor Applications
  vendors.forEach(vend => {
    const name = vend.vendor_legal_name || 'Prospective Vendor';
    const ref = vend.reference_number ? ` (Ref: ${vend.reference_number})` : '';
    notifications.push({
      id: `vend-${vend.id}`,
      type: 'vendor',
      title: 'Vendor Onboarding Submission',
      description: `${name} submitted Form VOTC/037${ref}.`,
      timestamp: vend.created_at || vend.submission_date || new Date().toISOString(),
      targetTab: 'vendors',
      read: readIds.has(`vend-${vend.id}`),
      priority: vend.status === 'pending' ? 'high' : 'normal'
    });
  });

  // 3. Job Applications
  applications.forEach(app => {
    const applicant = app.applicant_name || 'Candidate';
    const role = app.job_title || 'Engineering Role';
    notifications.push({
      id: `job-${app.id}`,
      type: 'job',
      title: 'New Career Application',
      description: `${applicant} applied for ${role}.`,
      timestamp: app.created_at || app.applied_at || new Date().toISOString(),
      targetTab: 'careers',
      read: readIds.has(`job-${app.id}`),
      priority: 'normal'
    });
  });

  // 4. Follow Up Dispatches
  followUps.forEach(fol => {
    const recipient = fol.recipient_name || fol.recipient_email || 'Client';
    const subj = fol.subject || 'Corporate Dispatch';
    notifications.push({
      id: `fol-${fol.id}`,
      type: 'email',
      title: 'Outbound Corporate Dispatch',
      description: `Dispatched to ${recipient}: "${subj}"`,
      timestamp: fol.sent_at || new Date().toISOString(),
      targetTab: 'followups',
      read: readIds.has(`fol-${fol.id}`),
      priority: 'normal'
    });
  });

  // 5. System Logs & Audit Trails
  auditLogs.slice(0, 15).forEach(log => {
    const rawAction = log.action || (log as any).action_description || (log as any).description;
    const actor = log.user_email || (log as any).admin_email || (log as any).email || 'PIGL Administrator';
    const entityType = log.entity_type || 'setting';
    const entityConfig = ENTITY_NAV_MAP[entityType] || { tab: 'dashboard', label: 'System Operations' };

    // Format descriptive dynamic title
    let title = 'System Activity Event';
    if (rawAction && typeof rawAction === 'string' && rawAction.trim().length > 0) {
      title = rawAction.trim();
    } else {
      const entityLabel = entityType.replace(/_/g, ' ');
      title = `${entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1)} Event`;
    }

    // Format descriptive detail (actor + affected item)
    let description = `Executed by ${actor} • ${entityConfig.label}`;
    if (log.details?.title) {
      description = `Executed by ${actor} • "${log.details.title}"`;
    } else if (log.details?.name) {
      description = `Executed by ${actor} • "${log.details.name}"`;
    } else if (log.details?.status) {
      description = `Executed by ${actor} • Status set to "${log.details.status}"`;
    } else if (log.details?.count) {
      description = `Executed by ${actor} • ${log.details.count} records affected`;
    } else if (log.entity_id) {
      description = `Executed by ${actor} • Reference ID: ${log.entity_id}`;
    }

    notifications.push({
      id: `log-${log.id}`,
      type: 'system',
      title,
      description,
      timestamp: log.created_at || new Date().toISOString(),
      targetTab: entityConfig.tab,
      read: readIds.has(`log-${log.id}`),
      priority: title.toLowerCase().includes('delete') ? 'high' : 'normal'
    });
  });

  // Sort descending by timestamp
  notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayedNotifications = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const handleNotificationClick = (item: AdminNotification) => {
    markAsRead(item.id);
    onNavigateTab(item.targetTab);
    setIsOpen(false);
  };

  const getIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'inquiry':
        return <IconInquiries className="w-4 h-4 text-emerald-500" />;
      case 'vendor':
        return <IconVendor className="w-4 h-4 text-amber-500" />;
      case 'job':
        return <IconCareers className="w-4 h-4 text-blue-500" />;
      case 'email':
        return <IconMail className="w-4 h-4 text-indigo-500" />;
      default:
        return <IconShield className="w-4 h-4 text-purple-500" />;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    try {
      const now = Date.now();
      const diffMs = now - new Date(timestamp).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return new Date(timestamp).toLocaleDateString();
    } catch {
      return 'Recent';
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Admin Notifications & Activity Feed"
        aria-label="Open notifications"
        className={`relative p-2 rounded-xl transition-all border ${
          isOpen
            ? isDark
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50 shadow-sm'
              : 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm'
            : isDark
              ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 shadow-sm'
        }`}
      >
        <IconBell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center px-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] shadow-sm animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Drawer */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl z-50 overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95 ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'
          }`}>
            <div className="flex items-center space-x-2">
              <IconBell className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Activity Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className={`flex border-b px-4 py-2 gap-2 text-xs font-semibold ${
            isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
          }`}>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-[11px] transition-colors ${
                filter === 'all'
                  ? isDark
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-[11px] transition-colors ${
                filter === 'unread'
                  ? isDark
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 no-scrollbar">
            {displayedNotifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <IconCheck className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                <p className="font-semibold text-slate-500 dark:text-slate-400">All caught up!</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">No unread notifications to display.</p>
              </div>
            ) : (
              displayedNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 flex items-start space-x-3 transition-colors cursor-pointer group ${
                    item.read
                      ? isDark
                        ? 'hover:bg-slate-800/50 opacity-70'
                        : 'hover:bg-slate-50 opacity-80'
                      : isDark
                        ? 'bg-slate-800/40 hover:bg-slate-800/80 font-medium'
                        : 'bg-emerald-50/40 hover:bg-emerald-50/80 font-medium'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 border ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold truncate ${
                        isDark ? 'text-white group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-700'
                      }`}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono ml-2">
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-0.5 line-clamp-2 leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {item.description}
                    </p>
                  </div>

                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5 shadow-sm shadow-emerald-500"></span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer View All */}
          <div className={`p-3 border-t text-center text-xs font-bold ${
            isDark ? 'border-slate-800 bg-slate-950/60 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-600'
          }`}>
            <button
              type="button"
              onClick={() => {
                onNavigateTab('inquiries');
                setIsOpen(false);
              }}
              className="hover:text-emerald-500 inline-flex items-center space-x-1 transition-colors"
            >
              <span>View All Inquiries & Activities</span>
              <IconArrowRight className="w-3 h-3 text-emerald-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationCenter;
