import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AdminCampaigns from './AdminCampaigns';
import AdminDirectFollowUp from './AdminDirectFollowUp';
import AdminServices from './AdminServices';
import AdminProjects from './AdminProjects';
import AdminPartners from './AdminPartners';
import AdminTeam from './AdminTeam';
import AdminVendors from './AdminVendors';
import AdminCareers from './AdminCareers';
import AdminBlog from './AdminBlog';
import AdminSliders from './AdminSliders';
import AdminVideos from './AdminVideos';
import AdminNavigation from './AdminNavigation';
import AdminMedia from './AdminMedia';
import AdminSettings from './AdminSettings';
import AdminInquiries from './AdminInquiries';
import AdminUsers from './AdminUsers';
import AdminProfile from './AdminProfile';
import AdminLogin from './AdminLogin';
import {
  useAdminAuth,
  useServices,
  useProjects,
  usePartners,
  useTeamMembers,
  useVendorApplications,
  useJobOpenings,
  useJobApplications,
  useBlogPosts,
  useSliders,
  useVideos,
  useInquiries,
  useAdminUsers,
  useAuditLogs,
  useEmailCampaigns,
  useEmailSubscribers,
  useFollowUpEmails
} from '../../hooks/useSupabaseData';
import { IconMenu, IconSun, IconMoon, IconExternal } from '../../components/admin/AdminIcons';
import AdminNotificationCenter from '../../components/admin/AdminNotificationCenter';

const AdminLayout: React.FC = () => {
  const { user, loading: authLoading, isAuthenticated, login, logout, updateProfile, updatePassword } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('pigl_admin_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pigl_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('pigl_admin_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('pigl_admin_theme', next);
      } catch {}
      return next;
    });
  };

  const { services, loading: servicesLoading, saveService, deleteService } = useServices(true);
  const { projects, loading: projectsLoading, saveProject, deleteProject } = useProjects(true);
  const { partners, loading: partnersLoading, savePartner, deletePartner } = usePartners(true);
  const { teamMembers, loading: teamLoading, saveTeamMember, deleteTeamMember, importTeamMembers } = useTeamMembers(true);
  const { vendors, loading: vendorsLoading, reviewApplication, deleteVendor } = useVendorApplications();
  const { jobs, loading: jobsLoading, saveJob, deleteJob } = useJobOpenings(true);
  const { applications, loading: appsLoading, updateApplicationStatus, deleteApplication } = useJobApplications();
  const { posts, loading: blogsLoading, savePost, deletePost } = useBlogPosts(undefined, true);
  const { sliders, loading: slidersLoading, saveSlider, deleteSlider } = useSliders(true);
  const { videos, loading: videosLoading, saveVideo, deleteVideo } = useVideos(true);
  const { inquiries, loading: inquiriesLoading, updateInquiryStatus, deleteInquiry } = useInquiries();
  const { users, loading: usersLoading, saveUser, deleteUser, toggleUserStatus } = useAdminUsers();
  const { logs: auditLogs, logAction } = useAuditLogs();
  
  const { campaigns, loading: campaignsLoading, saveCampaign, dispatchCampaign, deleteCampaign } = useEmailCampaigns();
  const { subscribers, loading: subscribersLoading, addSubscriber, deleteSubscriber } = useEmailSubscribers();
  const { followUps, loading: followUpsLoading, sendFollowUp } = useFollowUpEmails();

  const handleReviewVendorWithLog = async (id: string, data: any) => {
    const targetVendor = vendors.find(v => v.id === id);
    const vendorName = targetVendor?.vendor_legal_name || targetVendor?.reference_number || `ID ${id}`;
    const res = await reviewApplication(id, data);
    await logAction(
      `Updated Vendor Section G review: ${vendorName} (${data.status.toUpperCase()})`,
      'vendor_application',
      id,
      {
        vendor_legal_name: targetVendor?.vendor_legal_name,
        reference_number: targetVendor?.reference_number,
        ...data
      }
    );
    return res;
  };

  const handleDeleteVendorWithLog = async (id: string) => {
    const targetVendor = vendors.find(v => v.id === id);
    const vendorName = targetVendor?.vendor_legal_name || `ID ${id}`;
    const res = await deleteVendor(id);
    await logAction(
      `Deleted vendor application: ${vendorName}`,
      'vendor_application',
      id,
      { vendor_legal_name: targetVendor?.vendor_legal_name, reference_number: targetVendor?.reference_number }
    );
    return res;
  };

  const handleSaveServiceWithLog = async (service: any) => {
    const res = await saveService(service);
    await logAction(`Saved service: ${service.title}`, 'service', service.id || service.slug, { title: service.title });
    return res;
  };

  const handleDeleteServiceWithLog = async (id: string) => {
    const res = await deleteService(id);
    await logAction(`Deleted service ID: ${id}`, 'service', id);
    return res;
  };

  const handleSaveProjectWithLog = async (project: any) => {
    const res = await saveProject(project);
    await logAction(`Saved project: ${project.title}`, 'project', project.id, { title: project.title });
    return res;
  };

  const handleDeleteProjectWithLog = async (id: string) => {
    const res = await deleteProject(id);
    await logAction(`Deleted project ID: ${id}`, 'project', id);
    return res;
  };

  const handleSavePartnerWithLog = async (partner: any) => {
    const res = await savePartner(partner);
    await logAction(`Saved technology partner: ${partner.name}`, 'partner', partner.id, { name: partner.name });
    return res;
  };

  const handleDeletePartnerWithLog = async (id: string) => {
    const res = await deletePartner(id);
    await logAction(`Deleted partner ID: ${id}`, 'partner', id);
    return res;
  };

  const handleSaveTeamMemberWithLog = async (member: any) => {
    const res = await saveTeamMember(member);
    await logAction(`Saved team member: ${member.name} (${member.role})`, 'team_member', member.id, { name: member.name, role: member.role });
    return res;
  };

  const handleDeleteTeamMemberWithLog = async (id: string) => {
    const res = await deleteTeamMember(id);
    await logAction(`Deleted team member ID: ${id}`, 'team_member', id);
    return res;
  };

  const handleImportTeamMembersWithLog = async (members: any[]) => {
    const res = await importTeamMembers(members);
    await logAction(`Imported ${members.length} executive team members from file`, 'team_member', undefined, { count: members.length });
    return res;
  };

  const handleSaveBlogWithLog = async (post: any) => {
    const res = await savePost(post);
    await logAction(`Saved article: ${post.title}`, 'blog', post.id || post.slug, { title: post.title });
    return res;
  };

  const handleDeleteBlogWithLog = async (id: string) => {
    const res = await deletePost(id);
    await logAction(`Deleted blog post ID: ${id}`, 'blog', id);
    return res;
  };

  const handleSaveVideoWithLog = async (video: any) => {
    const res = await saveVideo(video);
    await logAction(`Saved video showcase: ${video.title}`, 'video', res.id, { title: video.title, category: video.category });
    return res;
  };

  const handleDeleteVideoWithLog = async (id: string) => {
    const target = videos.find(v => v.id === id);
    const res = await deleteVideo(id);
    await logAction(`Deleted video showcase: ${target?.title || id}`, 'video', id);
    return res;
  };

  if (authLoading) {
    const isDark = theme === 'dark';
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-sans transition-colors ${
        isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'
      }`}>
        <svg className="animate-spin h-8 w-8 text-emerald-600 mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className={`text-xs font-mono tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-600 font-bold'}`}>
          Verifying PIGL Administrator Access...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;
  const pendingVendorsCount = vendors.filter(v => v.status === 'pending').length;

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <AdminDashboard
            currentUser={user}
            services={services}
            projects={projects}
            partners={partners}
            vendors={vendors}
            jobs={jobs}
            applications={applications}
            posts={posts}
            sliders={sliders}
            inquiries={inquiries}
            users={users}
            auditLogs={auditLogs}
            campaigns={campaigns}
            subscribers={subscribers}
            onNavigate={(tab) => setCurrentTab(tab)}
            theme={theme}
          />
        );
      case 'campaigns':
        return (
          <AdminCampaigns
            campaigns={campaigns}
            subscribers={subscribers}
            inquiries={inquiries}
            vendors={vendors}
            services={services}
            loading={campaignsLoading || subscribersLoading || followUpsLoading}
            onSaveCampaign={saveCampaign}
            onDispatchCampaign={dispatchCampaign}
            onDeleteCampaign={deleteCampaign}
            onAddSubscriber={addSubscriber}
            onDeleteSubscriber={deleteSubscriber}
            theme={theme}
          />
        );
      case 'followups':
        return (
          <AdminDirectFollowUp
            followUps={followUps}
            inquiries={inquiries}
            vendors={vendors}
            subscribers={subscribers}
            loading={followUpsLoading}
            onSendFollowUp={sendFollowUp}
            theme={theme}
          />
        );
      case 'services':
        return (
          <AdminServices
            services={services}
            loading={servicesLoading}
            onSave={handleSaveServiceWithLog}
            onDelete={handleDeleteServiceWithLog}
            theme={theme}
          />
        );
      case 'projects':
        return (
          <AdminProjects
            projects={projects}
            loading={projectsLoading}
            onSave={handleSaveProjectWithLog}
            onDelete={handleDeleteProjectWithLog}
            theme={theme}
          />
        );
      case 'partners':
        return (
          <AdminPartners
            partners={partners}
            loading={partnersLoading}
            onSave={handleSavePartnerWithLog}
            onDelete={handleDeletePartnerWithLog}
            theme={theme}
          />
        );
      case 'team':
        return (
          <AdminTeam
            teamMembers={teamMembers}
            loading={teamLoading}
            onSave={handleSaveTeamMemberWithLog}
            onDelete={handleDeleteTeamMemberWithLog}
            onImport={handleImportTeamMembersWithLog}
            theme={theme}
          />
        );
      case 'vendors':
        return (
          <AdminVendors
            vendors={vendors}
            loading={vendorsLoading}
            onReview={handleReviewVendorWithLog}
            onDelete={handleDeleteVendorWithLog}
            theme={theme}
          />
        );
      case 'careers':
        return (
          <AdminCareers
            jobs={jobs}
            jobsLoading={jobsLoading}
            onSaveJob={saveJob}
            onDeleteJob={deleteJob}
            applications={applications}
            appsLoading={appsLoading}
            onUpdateApplicationStatus={updateApplicationStatus}
            onDeleteApplication={deleteApplication}
            theme={theme}
          />
        );
      case 'inquiries':
        return (
          <AdminInquiries
            inquiries={inquiries}
            loading={inquiriesLoading}
            onUpdateStatus={updateInquiryStatus}
            onDelete={deleteInquiry}
            theme={theme}
          />
        );
      case 'blog':
        return (
          <AdminBlog
            posts={posts}
            loading={blogsLoading}
            onSave={handleSaveBlogWithLog}
            onDelete={handleDeleteBlogWithLog}
            theme={theme}
          />
        );
      case 'sliders':
        return (
          <AdminSliders
            sliders={sliders}
            loading={slidersLoading}
            onSave={saveSlider}
            onDelete={deleteSlider}
            theme={theme}
          />
        );
      case 'videos':
        return (
          <AdminVideos
            videos={videos}
            loading={videosLoading}
            onSave={handleSaveVideoWithLog}
            onDelete={handleDeleteVideoWithLog}
            theme={theme}
          />
        );
      case 'navigation':
        return <AdminNavigation theme={theme} />;
      case 'profile':
        return (
          <AdminProfile
            user={user}
            onUpdateProfile={updateProfile}
            onUpdatePassword={updatePassword}
            theme={theme}
          />
        );
      case 'users':
        return (
          <AdminUsers
            users={users}
            loading={usersLoading}
            onSave={saveUser}
            onDelete={deleteUser}
            onToggleStatus={toggleUserStatus}
            currentUserRole={user?.role}
            theme={theme}
          />
        );
      case 'media':
        return <AdminMedia theme={theme} />;
      case 'settings':
        return <AdminSettings theme={theme} />;
      default:
        return (
          <AdminDashboard
            services={services}
            projects={projects}
            partners={partners}
            vendors={vendors}
            jobs={jobs}
            applications={applications}
            posts={posts}
            sliders={sliders}
            inquiries={inquiries}
            users={users}
            auditLogs={auditLogs}
            campaigns={campaigns}
            subscribers={subscribers}
            onNavigate={(tab) => setCurrentTab(tab)}
            theme={theme}
          />
        );
    }
  };

  const tabLabels: Record<string, string> = {
    dashboard: 'Dashboard Overview',
    campaigns: 'Email Campaigns & Newsletters',
    followups: 'Follow Up and Broadcast',
    services: 'Services & Capabilities',
    projects: 'Projects & Case Studies',
    partners: 'Technology Partners',
    team: 'Executive Management Team',
    vendors: 'Vendor Onboarding Desk',
    careers: 'Careers & Applications',
    inquiries: 'Inquiries & RFPs',
    blog: 'Publications & News',
    sliders: 'Homepage Banners',
    videos: 'Video Showcase & Corporate Reels',
    navigation: 'Navigation & Page Architecture',
    profile: 'Administrator Profile & Security',
    users: 'Admin Team & Roles',
    media: 'Media Library',
    settings: 'Database & Infrastructure'
  };

  return (
    <div className={`h-screen max-h-screen overflow-hidden flex flex-col md:flex-row font-sans transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Sidebar with Desktop Collapse & Mobile Slide Drawer */}
      <AdminSidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onLogout={logout}
        user={user}
        adminEmail={user?.email}
        unreadInquiriesCount={newInquiriesCount}
        pendingVendorsCount={pendingVendorsCount}
        theme={theme}
        onToggleTheme={toggleTheme}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Wrapper (Fixed Header + Independent Scroll Area) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden">
        {/* Top Header Bar (Responsive for Mobile & Desktop) */}
        <header className={`h-16 shrink-0 border-b px-4 sm:px-6 flex items-center justify-between z-30 transition-colors ${
          theme === 'dark' 
            ? 'bg-slate-900/90 border-slate-800 backdrop-blur-md text-white' 
            : 'bg-white/95 border-slate-200 backdrop-blur-md text-slate-900 shadow-sm'
        }`}>
          {/* Left: Mobile Hamburger Menu & Active Page Title */}
          <div className="flex items-center space-x-3 sm:space-x-4 overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Open sidebar menu"
            >
              <IconMenu className="w-5 h-5 text-emerald-500" />
            </button>

            <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold truncate">
              <span className="text-slate-400 hidden sm:inline">PIGL Portal</span>
              <span className="text-slate-500 hidden sm:inline">/</span>
              <span className="text-emerald-500 font-bold truncate">
                {tabLabels[currentTab] || 'Management'}
              </span>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Real-time Activity Notification Bell */}
            <AdminNotificationCenter
              inquiries={inquiries}
              vendors={vendors}
              applications={applications}
              followUps={followUps}
              auditLogs={auditLogs}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              theme={theme}
            />

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className={`p-2 rounded-xl transition-all border ${
                theme === 'dark' 
                  ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 shadow-sm'
              }`}
            >
              {theme === 'dark' ? <IconSun className="w-4 h-4" /> : <IconMoon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Profile Quick Access Pill */}
            <button
              type="button"
              onClick={() => setCurrentTab('profile')}
              title="Edit Admin Profile & Password"
              className={`flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl transition-all border ${
                currentTab === 'profile'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : theme === 'dark'
                    ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}</span>
                )}
              </div>
              <span className="text-xs font-semibold hidden md:inline truncate max-w-[120px]">
                {user?.full_name || 'My Profile'}
              </span>
            </button>

            {/* Live Public Site Button */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-700"
            >
              <IconExternal className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </a>
          </div>
        </header>

        {/* Main Scrollable Content Area (Smooth scrolling with invisible scrollbar) */}
        <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto no-scrollbar scrollbar-none">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


