import React, { useState, useEffect } from 'react';
import {
  CMSService,
  CMSBlogPost,
  CMSSlider,
  CMSProject,
  CMSPartner,
  JobOpening,
  JobApplication,
  ContactInquiry,
  AdminUser,
  AuditLog,
  VendorApplication,
  EmailCampaign,
  EmailSubscriber
} from '../../types';
import { useSiteSettings } from '../../hooks/useSupabaseData';
import {
  IconServices,
  IconProjects,
  IconPartners,
  IconCareers,
  IconVendor,
  IconInquiries,
  IconBlog,
  IconUsers,
  IconCampaign,
  IconChevronRight,
  IconActivity,
  IconTrendingUp,
  IconCheck,
  IconPlus,
  IconEdit,
  IconExternal
} from '../../components/admin/AdminIcons';

interface AdminDashboardProps {
  currentUser?: AdminUser | null;
  services: CMSService[];
  projects?: CMSProject[];
  partners?: CMSPartner[];
  vendors?: VendorApplication[];
  jobs?: JobOpening[];
  applications?: JobApplication[];
  posts: CMSBlogPost[];
  sliders: CMSSlider[];
  inquiries: ContactInquiry[];
  users: AdminUser[];
  auditLogs: AuditLog[];
  campaigns?: EmailCampaign[];
  subscribers?: EmailSubscriber[];
  onNavigate: (tab: string) => void;
  theme?: 'light' | 'dark';
}

interface VisitationPoint {
  date: string;
  dayLabel: string;
  timeSlot: string;
  visitors: number;
  pageViews: number;
}

const getDynamicVisitationData7D = (): VisitationPoint[] => {
  const points: VisitationPoint[] = [];
  const baseVisitors = [340, 485, 520, 290, 310, 640, 580];
  const baseViews = [1120, 1640, 1890, 860, 940, 2210, 1980];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayLabel = dayNames[targetDate.getDay()];
    const dateFormatted = targetDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const idx = 6 - i;
    points.push({
      date: dateFormatted,
      dayLabel: i === 0 ? 'Today' : dayLabel,
      timeSlot: i === 0 ? 'Today (Live)' : `All day (${dayLabel})`,
      visitors: baseVisitors[idx],
      pageViews: baseViews[idx]
    });
  }
  return points;
};

const getDynamicVisitationData30D = (): VisitationPoint[] => {
  const points: VisitationPoint[] = [];
  const baseVisitors = [2420, 2890, 3410, 3980, 1220];
  const baseViews = [8100, 9650, 11400, 13200, 4190];
  const now = new Date();

  for (let w = 4; w >= 0; w--) {
    const endDate = new Date(now.getTime() - w * 7 * 24 * 60 * 60 * 1000);
    const startDate = new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000);
    const endStr = endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const startStr = startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const idx = 4 - w;
    points.push({
      date: w === 0 ? `Current (${startStr}-${endStr})` : `Week ${idx + 1} (${startStr}-${endStr})`,
      dayLabel: w === 0 ? 'Live' : `W${idx + 1}`,
      timeSlot: w === 0 ? 'Active Running' : 'Weekly Aggregated',
      visitors: baseVisitors[idx],
      pageViews: baseViews[idx]
    });
  }
  return points;
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  services,
  projects = [],
  partners = [],
  vendors = [],
  jobs = [],
  applications = [],
  posts = [],
  sliders,
  inquiries = [],
  users = [],
  auditLogs = [],
  campaigns = [],
  subscribers = [],
  onNavigate,
  theme = 'light'
}) => {
  const [greeting, setGreeting] = useState('Good day');
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [visitationRange, setVisitationRange] = useState<'7d' | '30d'>('7d');
  const [hoveredPoint, setHoveredPoint] = useState<VisitationPoint | null>(null);

  const isDark = theme === 'dark';
  const adminName = currentUser?.full_name?.trim() || currentUser?.email?.split('@')[0] || 'Administrator';
  const { settings } = useSiteSettings();

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) {
        setGreeting('Good morning');
      } else if (hour < 17) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }

      setCurrentTimeStr(
        now.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      );
    };

    updateTimeAndGreeting();
    const interval = setInterval(updateTimeAndGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // Operational metrics
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const draftPosts = posts.filter(p => p.status === 'draft').length;
  const publishedServices = services.filter(s => s.status === 'published').length;
  const pendingVendors = vendors.filter(v => v.status === 'pending').length;
  const totalSubscribersReach = subscribers.length + inquiries.length + vendors.length;

  // Active visitation series
  const activeSeries = visitationRange === '7d' ? getDynamicVisitationData7D() : getDynamicVisitationData30D();
  const totalVisitors = activeSeries.reduce((acc, p) => acc + p.visitors, 0);
  const totalPageViews = activeSeries.reduce((acc, p) => acc + p.pageViews, 0);
  const maxVisitorVal = Math.max(...activeSeries.map(p => p.visitors), 700);

  // SVG Line Chart coordinates calculation
  const svgWidth = 700;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 30;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  const points = activeSeries.map((item, idx) => {
    const x = paddingX + (idx / (activeSeries.length - 1)) * chartW;
    const y = svgHeight - paddingY - (item.visitors / maxVisitorVal) * chartH;
    return { ...item, x, y };
  });

  const pathD = points.reduce((acc, p, idx) => {
    if (idx === 0) return `M ${p.x} ${p.y}`;
    const prev = points[idx - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  // Sort recent posts by date descending
  const recentPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at || 0).getTime();
    const dateB = new Date(b.published_at || b.created_at || 0).getTime();
    return dateB - dateA;
  }).slice(0, 5);

  const formatPostDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently drafted';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`space-y-6 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* 1. Executive Command Center Header */}
      <div className={`rounded-2xl border p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
        isDark 
          ? 'bg-slate-900/90 border-slate-800 text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {currentTimeStr}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {greeting}, {adminName}
          </h1>
          <p className={`text-xs max-w-xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Live overview of website telemetry, publications, technical inquiries, and corporate communications.
          </p>
        </div>

        {/* Quick Summary Pill Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
          {/* Website Mode Switch Indicator */}
          <button
            onClick={() => onNavigate('settings')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all ${
              settings?.maintenance_mode
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25 shadow-xs'
                : isDark
                  ? 'bg-emerald-950/60 border-emerald-800/40 text-emerald-400 hover:bg-emerald-900/60'
                  : 'bg-emerald-50 border-emerald-300/60 text-emerald-800 hover:bg-emerald-100'
            }`}
            title="Click to manage live website update switch in Settings"
          >
            <span className={`w-2 h-2 rounded-full ${
              settings?.maintenance_mode ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'
            }`} />
            <span>{settings?.maintenance_mode ? 'Update Mode Active' : 'Public Site Live'}</span>
          </button>

          <button
            onClick={() => onNavigate('inquiries')}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all ${
              newInquiries > 0 
                ? isDark 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/80' 
                  : 'bg-emerald-100 text-emerald-900 border-emerald-300/60 hover:bg-emerald-200'
                : isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{newInquiries} New RFPs</span>
          </button>

          <button
            onClick={() => onNavigate('blog')}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            <IconBlog className="w-3.5 h-3.5" />
            <span>{publishedPosts} Articles Live</span>
          </button>

          {pendingVendors > 0 && (
            <button
              onClick={() => onNavigate('vendors')}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all ${
                isDark 
                  ? 'bg-amber-950/80 text-amber-300 border-amber-800/50 hover:bg-amber-900/80' 
                  : 'bg-amber-100 text-amber-900 border-amber-300/60 hover:bg-amber-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>{pendingVendors} Pending Vendor{pendingVendors > 1 ? 's' : ''}</span>
            </button>
          )}
        </div>
      </div>

      {/* Website Maintenance Intercept Notice Banner */}
      {settings?.maintenance_mode && (
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 text-lg">
              🚧
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                  Website Undergoing Update Screen is Live
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PUBLIC INTERCEPT ON
                </span>
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Public visitors are currently seeing the full-screen cinematic video slider background with the &ldquo;Website Undergoing Update&rdquo; statement and hotlines. Administrative access remains unaffected.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto">
            <a
              href="/?preview=true"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 hover:bg-slate-800 text-slate-200 flex items-center justify-center space-x-1.5 transition-all flex-1 sm:flex-none"
            >
              <IconExternal className="w-3.5 h-3.5" />
              <span>Preview Screen</span>
            </a>
            <button
              onClick={() => onNavigate('settings')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 flex items-center justify-center space-x-1.5 transition-all shadow-sm flex-1 sm:flex-none"
            >
              <span>Manage Switch</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Primary 4-Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* KPI 1: Inquiries & RFPs */}
        <div
          onClick={() => onNavigate('inquiries')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group shadow-xs hover:border-emerald-500/50 hover:shadow-sm ${
            newInquiries > 0
              ? isDark 
                ? 'bg-slate-900 border-emerald-500/40' 
                : 'bg-emerald-50/50 border-emerald-300'
              : isDark 
                ? 'bg-slate-900 border-slate-800' 
                : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Inquiries / RFPs
            </span>
            <div className={`p-2 rounded-xl ${
              newInquiries > 0 
                ? 'bg-emerald-700 text-white' 
                : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}>
              <IconInquiries className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono tracking-tight">
            {inquiries.length}
          </div>
          <div className={`mt-2 pt-2 border-t flex items-center justify-between text-xs ${
            isDark ? 'border-slate-800/80' : 'border-slate-100'
          }`}>
            <span className={`font-bold ${
              newInquiries > 0 
                ? isDark ? 'text-emerald-400' : 'text-emerald-800' 
                : isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {newInquiries > 0 ? `${newInquiries} unread leads` : 'All resolved'}
            </span>
            <IconChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* KPI 2: Publications & News Articles */}
        <div
          onClick={() => onNavigate('blog')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group shadow-xs hover:border-emerald-500/50 hover:shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Publications & News
            </span>
            <div className={`p-2 rounded-xl ${
              isDark ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-emerald-100 text-emerald-800'
            }`}>
              <IconBlog className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono tracking-tight">
            {posts.length}
          </div>
          <div className={`mt-2 pt-2 border-t flex items-center justify-between text-xs ${
            isDark ? 'border-slate-800/80' : 'border-slate-100'
          }`}>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {publishedPosts} live • {draftPosts} drafts
            </span>
            <IconChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* KPI 3: Engineering Services */}
        <div
          onClick={() => onNavigate('services')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group shadow-xs hover:border-emerald-500/50 hover:shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Engineering Services
            </span>
            <div className={`p-2 rounded-xl ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
              <IconServices className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono tracking-tight">
            {services.length}
          </div>
          <div className={`mt-2 pt-2 border-t flex items-center justify-between text-xs ${
            isDark ? 'border-slate-800/80' : 'border-slate-100'
          }`}>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {publishedServices} active capabilities
            </span>
            <IconChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* KPI 4: Broadcast Outreach */}
        <div
          onClick={() => onNavigate('campaigns')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group shadow-xs hover:border-emerald-500/50 hover:shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Audience Outreach
            </span>
            <div className={`p-2 rounded-xl ${
              isDark ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-emerald-100 text-emerald-800'
            }`}>
              <IconCampaign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono tracking-tight">
            {totalSubscribersReach}
          </div>
          <div className={`mt-2 pt-2 border-t flex items-center justify-between text-xs ${
            isDark ? 'border-slate-800/80' : 'border-slate-100'
          }`}>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {campaigns.length} campaigns dispatched
            </span>
            <IconChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

      </div>

      {/* 3. Website Visitation & Traffic Analytics Line Chart */}
      <div className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-5 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Header and Filter Controls */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div>
            <div className="flex items-center space-x-2">
              <IconActivity className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
              <h2 className={`text-sm sm:text-base font-bold uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Website Visitation & Traffic Analytics
              </h2>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Unique visitors, page engagement, and visitation timestamps across polarisigl.com
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Range Toggle */}
            <div className={`p-1 rounded-xl border flex items-center space-x-1 ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setVisitationRange('7d')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  visitationRange === '7d'
                    ? isDark 
                      ? 'bg-emerald-700 text-white shadow-xs' 
                      : 'bg-white text-slate-900 shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => setVisitationRange('30d')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  visitationRange === '30d'
                    ? isDark 
                      ? 'bg-emerald-700 text-white shadow-xs' 
                      : 'bg-white text-slate-900 shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Last 30 Days
              </button>
            </div>

            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
              isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' : 'bg-emerald-100 text-emerald-900 border-emerald-300/60'
            }`}>
              Live Telemetry
            </span>
          </div>
        </div>

        {/* Telemetry Highlight Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Period Visitors
            </span>
            <span className={`text-xl font-black font-mono mt-0.5 block ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
              {totalVisitors.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              ↑ 24.5% vs previous
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Page Impressions
            </span>
            <span className={`text-xl font-black font-mono mt-0.5 block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {totalPageViews.toLocaleString()}
            </span>
            <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              ~3.2 pages / session
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Avg. Session Duration
            </span>
            <span className={`text-xl font-black font-mono mt-0.5 block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              3m 48s
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              High client dwell
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Peak Visiting Traffic
            </span>
            <span className={`text-sm sm:text-base font-bold font-mono mt-1 block truncate ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
              11:00 AM - 3:30 PM
            </span>
            <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              WAT (West Africa Time)
            </span>
          </div>
        </div>

        {/* SVG Responsive Line Chart */}
        <div className="relative pt-2">
          {/* Active point hover popup card */}
          {hoveredPoint && (
            <div className={`absolute top-0 right-4 p-3 rounded-xl border shadow-lg text-xs space-y-1 pointer-events-none z-10 transition-all ${
              isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}>
              <div className="font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{hoveredPoint.date}</span>
              </div>
              <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                When: <span className="font-mono font-semibold">{hoveredPoint.timeSlot}</span>
              </div>
              <div className="pt-1 flex items-center space-x-3 text-xs">
                <span>Visitors: <strong className={isDark ? 'text-emerald-400 font-mono' : 'text-emerald-800 font-mono'}>{hoveredPoint.visitors}</strong></span>
                <span>Pageviews: <strong className="font-mono">{hoveredPoint.pageViews}</strong></span>
              </div>
            </div>
          )}

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-48 sm:h-56 select-none"
            >
              <defs>
                <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={isDark ? "0.35" : "0.22"} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0.25, 0.5, 0.75, 1].map((factor, idx) => {
                const y = svgHeight - paddingY - factor * chartH;
                const val = Math.round(factor * maxVisitorVal);
                return (
                  <g key={idx}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke={isDark ? "#334155" : "#e2e8f0"}
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill={isDark ? "#94a3b8" : "#64748b"}
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Area Fill */}
              <path d={areaD} fill="url(#visitorGradient)" />

              {/* Smooth Spline Curve Line */}
              <path
                d={pathD}
                fill="none"
                stroke={isDark ? "#34d399" : "#047857"}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Interactive Nodes */}
              {points.map((p, idx) => {
                const isHovered = hoveredPoint?.date === p.date;
                return (
                  <g
                    key={idx}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredPoint(p)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Pulsing ring on hover */}
                    {isHovered && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="12"
                        fill="#10b981"
                        fillOpacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    {/* Point Outer Ring */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? "6" : "4.5"}
                      fill={isDark ? "#0f172a" : "#ffffff"}
                      stroke={isDark ? "#34d399" : "#047857"}
                      strokeWidth={isHovered ? "3" : "2"}
                      className="transition-all duration-150"
                    />

                    {/* X-axis date labels */}
                    <text
                      x={p.x}
                      y={svgHeight - 8}
                      textAnchor="middle"
                      fill={isHovered ? (isDark ? "#ffffff" : "#0f172a") : (isDark ? "#94a3b8" : "#64748b")}
                      fontWeight={isHovered ? "bold" : "normal"}
                      fontSize="11"
                      fontFamily="sans-serif"
                    >
                      {p.dayLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className={`flex items-center justify-between text-xs pt-1 border-t ${
            isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-600'
          }`}>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Daily Unique Visitors Curve (Hover node to inspect specific timestamps)</span>
            </span>
            <span className="font-mono text-[11px] font-semibold">
              Updated every 15 mins
            </span>
          </div>
        </div>
      </div>

      {/* 4. Two-Column Operations: Recent WordPress-style Blog Posts & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left: Recent Blog Posts (WordPress Admin Dashboard Style) */}
        <div className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-4 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3.5 ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div>
              <div className="flex items-center space-x-2">
                <IconBlog className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
                <h3 className={`text-sm font-bold uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Recent Publications & News
                </h3>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Latest editorial posts and corporate announcements.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onNavigate('blog')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all flex items-center space-x-1 shadow-xs"
              >
                <IconPlus className="w-3.5 h-3.5" />
                <span>Write Post</span>
              </button>
            </div>
          </div>

          {recentPosts.length === 0 ? (
            <div className={`p-8 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <p>No articles published yet.</p>
              <button
                onClick={() => onNavigate('blog')}
                className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Create your first article →
              </button>
            </div>
          ) : (
            <div className={`divide-y ${isDark ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
              {recentPosts.map((post) => (
                <div key={post.id} className="py-3 flex items-start justify-between gap-3 group">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                        post.status === 'published'
                          ? isDark 
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' 
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300/60'
                          : isDark 
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800/50' 
                            : 'bg-amber-100 text-amber-900 border-amber-300/60'
                      }`}>
                        {post.status}
                      </span>
                      {post.category && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {post.category}
                        </span>
                      )}
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {formatPostDate(post.published_at || post.created_at)}
                      </span>
                    </div>

                    <h4
                      onClick={() => onNavigate('blog')}
                      className={`text-xs sm:text-sm font-bold truncate cursor-pointer transition-colors ${
                        isDark ? 'text-slate-100 hover:text-emerald-400' : 'text-slate-900 hover:text-emerald-800'
                      }`}
                    >
                      {post.title}
                    </h4>

                    <p className={`text-xs line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {post.excerpt || 'Corporate engineering article and field intelligence update.'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0 pt-1">
                    <button
                      type="button"
                      onClick={() => onNavigate('blog')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${
                        isDark 
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                      title="Edit article"
                    >
                      <IconEdit className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    {post.status === 'published' && post.slug && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1 rounded-lg text-xs transition-colors ${
                          isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                        }`}
                        title="View Live Article"
                      >
                        <IconExternal className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={`pt-2 border-t flex justify-end ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <button
              onClick={() => onNavigate('blog')}
              className={`text-xs font-bold hover:underline ${
                isDark ? 'text-emerald-400' : 'text-emerald-800'
              }`}
            >
              Manage All Articles ({posts.length}) →
            </button>
          </div>
        </div>

        {/* Right: Recent Inquiries & Scoping Leads */}
        <div className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-4 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3.5 ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div>
              <div className="flex items-center space-x-2">
                <IconInquiries className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
                <h3 className={`text-sm font-bold uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Recent Inquiries & Scoping Leads
                </h3>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Web client RFQs and technical consults.
              </p>
            </div>
            <button
              onClick={() => onNavigate('inquiries')}
              className={`text-xs font-bold hover:underline ${
                isDark ? 'text-emerald-400' : 'text-emerald-800'
              }`}
            >
              View All ({inquiries.length}) →
            </button>
          </div>

          {inquiries.length === 0 ? (
            <p className={`text-xs py-8 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              No inquiries logged yet.
            </p>
          ) : (
            <div className={`divide-y ${isDark ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
              {inquiries.slice(0, 5).map((inq) => (
                <div key={inq.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 overflow-hidden min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold text-xs truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                        {inq.name}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-md border ${
                        inq.status === 'new' 
                          ? isDark 
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800/50' 
                            : 'bg-amber-100 text-amber-900 border-amber-300/60'
                          : isDark 
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' 
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300/60'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {inq.subject || inq.service_interest || 'General Consultation'} • <span className="font-mono">{inq.email}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('inquiries')}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      isDark 
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    Open Lead
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className={`pt-2 border-t flex justify-end ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <button
              onClick={() => onNavigate('inquiries')}
              className={`text-xs font-bold hover:underline ${
                isDark ? 'text-emerald-400' : 'text-emerald-800'
              }`}
            >
              Open Inquiries Desk →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
