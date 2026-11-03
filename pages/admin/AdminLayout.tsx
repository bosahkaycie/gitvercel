import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AdminCampaigns from './AdminCampaigns';
import AdminDirectFollowUp from './AdminDirectFollowUp';
import AdminServices from './AdminServices';
import AdminProjects from './AdminProjects';
import AdminPartners from './AdminPartners';
import AdminTestimonials from './AdminTestimonials';
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
  useTestimonials,
  useInquiries,
  useAdminUsers,
  useAuditLogs,
  useEmailCampaigns,
  useEmailSubscribers,
  useFollowUpEmails
} from '../../hooks/useSupabaseData';
import { IconMenu, IconSun, IconMoon, IconExternal, IconUserCircle, IconSettings, IconLogout, IconChevronDown } from '../../components/admin/AdminIcons';
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
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
  const { sliders, loading: slidersLoading, saveSlider, deleteSlider, resetSliders } = useSliders(true);
  const { videos, loading: videosLoading, saveVideo, deleteVideo } = useVideos(true);
  const { testimonials, loading: testimonialsLoading, saveTestimonial, deleteTestimonial } = useTestimonials(true);
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

  const handleSaveTestimonialWithLog = async (testimonial: any) => {
    const res = await saveTestimonial(testimonial);
    await logAction(`Saved testimonial: ${testimonial.author_name}`, 'testimonial', res?.id || testimonial.id, { author: testimonial.author_name });
    return res;
  };

  const handleDeleteTestimonialWithLog = async (id: string) => {
    const target = testimonials.find(t => t.id === id);
    const res = await deleteTestimonial(id);
    await logAction(`Deleted testimonial: ${target?.author_name || id}`, 'testimonial', id);
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
      case 'testimonials':
        return (
          <AdminTestimonials
            testimonials={testimonials}
            loading={testimonialsLoading}
            onSave={handleSaveTestimonialWithLog}
            onDelete={handleDeleteTestimonialWithLog}
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
            onReset={resetSliders}
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
      case 'corporate-profile':
        return <AdminSettings theme={theme} initialTab="profile" />;
      case 'settings':
        return <AdminSettings theme={theme} initialTab="smtp" />;
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

  const tabMeta: Record<string, { group: string; title: string; description: string }> = {
    dashboard: {
      group: 'Overview',
      title: 'Dashboard Overview',
      description: 'System health, recent activities, inquiry metrics, and core operational statistics.'
    },
    navigation: {
      group: 'Website Management',
      title: 'Navigation & Pages',
      description: 'Configure header navigation structure, dropdown menus, footer link columns, and search engine metadata.'
    },
    sliders: {
      group: 'Website Management',
      title: 'Homepage Banners',
      description: 'Manage high-resolution hero banners, background video loops, headlines, and call-to-action buttons.'
    },
    services: {
      group: 'Website Management',
      title: 'Services & Capabilities',
      description: 'Manage engineering divisions, technical capabilities, equipment specifications, and core deliverables.'
    },
    projects: {
      group: 'Website Management',
      title: 'Projects & Case Studies',
      description: 'Document executed field operations, client references, technical scopes, and project milestones.'
    },
    videos: {
      group: 'Website Management',
      title: 'Video Showcase Hub',
      description: 'Curate corporate video reels, offshore operations footage, and technical demonstration media.'
    },
    partners: {
      group: 'Website Management',
      title: 'Technology Partners',
      description: 'Manage international technology alliances, equipment manufacturer partnerships, and verified logos.'
    },
    testimonials: {
      group: 'Website Management',
      title: 'Client Endorsements & Testimonials',
      description: 'Manage verified client commendations, stakeholder statements, and clearly marked sample draft testimonials.'
    },
    blog: {
      group: 'Website Management',
      title: 'Publications & News',
      description: 'Publish technical articles, corporate announcements, whitepapers, and industry insights.'
    },
    media: {
      group: 'Website Management',
      title: 'Media Library',
      description: 'Centralised repository for high-resolution photography, diagrams, PDFs, and corporate collateral.'
    },
    inquiries: {
      group: 'Business Operations',
      title: 'Inquiries & RFPs',
      description: 'Track, review, assign, and respond to incoming technical inquiries, RFPs, and consultation requests.'
    },
    vendors: {
      group: 'Business Operations',
      title: 'Vendor Onboarding Desk',
      description: 'Review contractor pre-qualification submissions, statutory compliance documentation, and verification status.'
    },
    careers: {
      group: 'Business Operations',
      title: 'Careers & CV Inbox',
      description: 'Post career opportunities, manage openings, and review submitted candidate applications and CVs.'
    },
    campaigns: {
      group: 'Marketing',
      title: 'Campaigns & Newsletters',
      description: 'Draft, schedule, and broadcast email campaigns and newsletters to client and stakeholder lists.'
    },
    followups: {
      group: 'Marketing',
      title: 'Follow Up & Broadcast',
      description: 'Direct communication desk for sending follow-up messages and targeted operational updates.'
    },
    team: {
      group: 'Organisation',
      title: 'Management Team',
      description: 'Maintain executive leadership profiles, qualifications, operational roles, and governance information.'
    },
    'corporate-profile': {
      group: 'Organisation',
      title: 'Corporate Profile & Company Information',
      description: 'Maintain verified corporate details, RC number, headquarters address, telephone contacts, and download profile PDF.'
    },
    settings: {
      group: 'Administration',
      title: 'Corporate & System Settings',
      description: 'Configure corporate contact channels, SMTP email server delivery, and database infrastructure.'
    },
    users: {
      group: 'Administration',
      title: 'Admin Team & Roles',
      description: 'Manage administrative team accounts, role-based access control permissions, and account status.'
    },
    profile: {
      group: 'Administration',
      title: 'Admin Profile & Security',
      description: 'Update your administrator name, avatar, contact email, and secure sign-in password.'
    }
  };

  const currentMeta = tabMeta[currentTab] || {
    group: 'Management',
    title: 'Dashboard Overview',
    description: 'System overview and core operations.'
  };

  return (
    <div className={`pigl-cms h-screen max-h-screen overflow-hidden flex flex-col md:flex-row font-sans transition-colors duration-200 ${
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
        {/* Top Header Bar */}
        <header className={`shrink-0 border-b z-30 transition-colors ${
          theme === 'dark' 
            ? 'bg-slate-900/95 border-slate-800 text-white' 
            : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
        }`}>
          {/* Top Row: Navigation & Action Controls */}
          <div className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
            {/* Left: Mobile Menu & Breadcrumbs */}
            <div className="flex items-center space-x-3 overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Open sidebar menu"
              >
                <IconMenu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </button>

              <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs font-medium truncate">
                <span className="text-slate-600 dark:text-slate-400 font-semibold hidden sm:inline">PIGL CMS</span>
                <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">/</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold hidden sm:inline">{currentMeta.group}</span>
                <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">/</span>
                <span className="font-bold text-slate-900 dark:text-white truncate">{currentMeta.title}</span>
              </nav>
            </div>

            {/* Right: Public Site, Notification, Theme & User Dropdown */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Live Public Site Button */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                title="View live public website"
                className="hidden lg:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700/80"
              >
                <IconExternal className="w-3.5 h-3.5" />
                <span>Live Site</span>
              </a>

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
                className={`p-1.5 sm:p-2 rounded-lg transition-colors border ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {theme === 'dark' ? <IconSun className="w-4 h-4" /> : <IconMoon className="w-4 h-4 text-indigo-600" />}
              </button>

              {/* User Profile & Account Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen(prev => !prev)}
                  className={`flex items-center space-x-2 p-1 sm:px-2.5 sm:py-1.5 rounded-lg transition-all border ${
                    isUserDropdownOpen
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-300 dark:bg-slate-800 dark:border-slate-700'
                      : theme === 'dark'
                      ? 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-800'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}</span>
                    )}
                  </div>
                  <span className="text-xs font-semibold hidden md:inline truncate max-w-[120px]">
                    {user?.full_name || 'My Account'}
                  </span>
                  <IconChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className={`absolute right-0 mt-1.5 w-56 rounded-xl border shadow-xl py-1.5 z-50 text-xs ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800 shadow-lg'
                  }`}>
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold truncate text-slate-900 dark:text-white">
                        {user?.full_name || 'Administrator'}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono truncate">
                        {user?.email}
                      </p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {user?.role || 'Super Admin'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentTab('profile');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full px-3.5 py-2 text-left flex items-center space-x-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <IconUserCircle className="w-4 h-4 text-slate-400" />
                        <span>Admin Profile & Security</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCurrentTab('settings');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full px-3.5 py-2 text-left flex items-center space-x-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <IconSettings className="w-4 h-4 text-slate-400" />
                        <span>Corporate & System Settings</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full px-3.5 py-2 text-left flex items-center space-x-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium"
                      >
                        <IconLogout className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contextual Page Header Row (Consistent Page Title & Short Description) */}
          <div className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {currentMeta.title}
              </h1>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 mt-0.5 leading-normal max-w-3xl font-medium">
                {currentMeta.description}
              </p>
            </div>
          </div>
        </header>

        {/* Main Scrollable Content Area */}
        <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto no-scrollbar scrollbar-none">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


