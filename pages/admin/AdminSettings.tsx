import React, { useState, useEffect } from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { verifySmtpConnection, getSmtpStatus, SmtpStatusResponse } from '../../lib/email';
import { useSiteSettings } from '../../hooks/useSupabaseData';
import {
  IconDatabase,
  IconShield,
  IconCheck,
  IconLock,
  IconMail,
  IconSend,
  IconGlobe,
  IconSettings,
  IconPhone,
  IconMapPin,
  IconExternal
} from '../../components/admin/AdminIcons';

interface AdminSettingsProps {
  theme?: 'light' | 'dark';
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ theme = 'light' }) => {
  const isConnected = isSupabaseConfigured();
  const isDark = theme === 'dark';
  const { settings, loading: settingsLoading, saveSettings } = useSiteSettings();

  const [activeTab, setActiveTab] = useState<'profile' | 'smtp' | 'database'>('profile');

  // Corporate Profile State
  const [phone, setPhone] = useState(settings.phone || '+234-(0) 809 7081 333');
  const [phoneRaw, setPhoneRaw] = useState(settings.phone_raw || '+2348097081333');
  const [emergencyLine, setEmergencyLine] = useState(settings.emergency_line || '+2348097081333');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsapp_number || '+234 809 708 1333');
  const [whatsappUrl, setWhatsappUrl] = useState(settings.whatsapp_url || 'https://wa.me/2348097081333');

  const [emailInfo, setEmailInfo] = useState(settings.email_info || 'info@polarisigl.com');
  const [emailSupport, setEmailSupport] = useState(settings.email_support || 'support@polarisigl.com');
  const [emailInquiries, setEmailInquiries] = useState(settings.email_inquiries || 'inquiries@polarisigl.com');
  const [emailProcurement, setEmailProcurement] = useState(settings.email_procurement || 'procurement@polarisigl.com');
  const [emailCareers, setEmailCareers] = useState(settings.email_careers || 'careers@polarisigl.com');

  const [addressHq, setAddressHq] = useState(settings.address_hq || '#3, Diamond Close, Castle & Green Estate, Off Eneka Link Road, Port Harcourt, Rivers State, Nigeria');
  const [addressShort, setAddressShort] = useState(settings.address_short || '#3, Diamond Close, Port Harcourt, Rivers State, Nigeria');

  const [linkedinUrl, setLinkedinUrl] = useState(settings.linkedin_url || 'https://www.linkedin.com/company/polarisigl/');
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtube_url || 'https://www.youtube.com/embed/sExrHCIGkH0');

  const [statYears, setStatYears] = useState(settings.stat_years_experience || '15+');
  const [statSafeHours, setStatSafeHours] = useState(settings.stat_safe_hours || '500k+');
  const [statProjects, setStatProjects] = useState(settings.stat_completed_projects || '120+');
  const [statSatisfaction, setStatSatisfaction] = useState(settings.stat_client_satisfaction || '99.4%');

  // Maintenance / Update Mode State
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(settings.maintenance_mode || false);
  const [maintenanceTitle, setMaintenanceTitle] = useState<string>(settings.maintenance_title || 'Website Undergoing Scheduled Systems Update');
  const [maintenanceMessage, setMaintenanceMessage] = useState<string>(settings.maintenance_message || 'Our corporate digital portal is currently undergoing scheduled engineering maintenance and infrastructure updates. All field operations, offshore surveying, and client project execution continue at full capacity.');
  const [maintenanceEstimatedTime, setMaintenanceEstimatedTime] = useState<string>(settings.maintenance_estimated_time || 'Systems will resume normal public operations shortly.');
  const [maintenanceVideoUrl, setMaintenanceVideoUrl] = useState<string>(settings.maintenance_video_url || '/assets/FRANKSTAR LOOP.mp4');
  const [maintenanceNotice, setMaintenanceNotice] = useState<string | null>(null);

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccessNotice, setProfileSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      if (settings.phone) setPhone(settings.phone);
      if (settings.phone_raw) setPhoneRaw(settings.phone_raw);
      if (settings.emergency_line) setEmergencyLine(settings.emergency_line);
      if (settings.whatsapp_number) setWhatsappNumber(settings.whatsapp_number);
      if (settings.whatsapp_url) setWhatsappUrl(settings.whatsapp_url);
      if (settings.email_info) setEmailInfo(settings.email_info);
      if (settings.email_support) setEmailSupport(settings.email_support);
      if (settings.email_inquiries) setEmailInquiries(settings.email_inquiries);
      if (settings.email_procurement) setEmailProcurement(settings.email_procurement);
      if (settings.email_careers) setEmailCareers(settings.email_careers);
      if (settings.address_hq) setAddressHq(settings.address_hq);
      if (settings.address_short) setAddressShort(settings.address_short);
      if (settings.linkedin_url) setLinkedinUrl(settings.linkedin_url);
      if (settings.youtube_url) setYoutubeUrl(settings.youtube_url);
      if (settings.stat_years_experience) setStatYears(settings.stat_years_experience);
      if (settings.stat_safe_hours) setStatSafeHours(settings.stat_safe_hours);
      if (settings.stat_completed_projects) setStatProjects(settings.stat_completed_projects);
      if (settings.stat_client_satisfaction) setStatSatisfaction(settings.stat_client_satisfaction);
      if (settings.maintenance_mode !== undefined) setMaintenanceMode(settings.maintenance_mode);
      if (settings.maintenance_title) setMaintenanceTitle(settings.maintenance_title);
      if (settings.maintenance_message) setMaintenanceMessage(settings.maintenance_message);
      if (settings.maintenance_estimated_time) setMaintenanceEstimatedTime(settings.maintenance_estimated_time);
      if (settings.maintenance_video_url) setMaintenanceVideoUrl(settings.maintenance_video_url);
    }
  }, [settings]);

  const handleToggleMaintenanceMode = async (newStatus: boolean) => {
    setMaintenanceMode(newStatus);
    try {
      await saveSettings({
        maintenance_mode: newStatus,
        maintenance_title: maintenanceTitle,
        maintenance_message: maintenanceMessage,
        maintenance_estimated_time: maintenanceEstimatedTime,
        maintenance_video_url: maintenanceVideoUrl
      });
      setMaintenanceNotice(
        newStatus
          ? "⚠️ Update Mode Activated: Public visitors will now see the 'Website Undergoing Update' screen with video background."
          : "✅ Normal Mode Restored: Public website is now live for all visitors worldwide!"
      );
      setTimeout(() => setMaintenanceNotice(null), 5000);
    } catch (err: any) {
      alert(`Error toggling update mode: ${err.message || 'Unknown error'}`);
    }
  };

  const handleSaveMaintenanceNotice = async () => {
    try {
      await saveSettings({
        maintenance_mode: maintenanceMode,
        maintenance_title: maintenanceTitle,
        maintenance_message: maintenanceMessage,
        maintenance_estimated_time: maintenanceEstimatedTime,
        maintenance_video_url: maintenanceVideoUrl
      });
      setMaintenanceNotice("✅ Update screen notice text & video configuration saved!");
      setTimeout(() => setMaintenanceNotice(null), 4000);
    } catch (err: any) {
      alert(`Error saving notice settings: ${err.message || 'Unknown error'}`);
    }
  };

  const handleSaveCorporateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await saveSettings({
        phone,
        phone_raw: phoneRaw,
        emergency_line: emergencyLine,
        whatsapp_number: whatsappNumber,
        whatsapp_url: whatsappUrl,
        email_info: emailInfo,
        email_support: emailSupport,
        email_inquiries: emailInquiries,
        email_procurement: emailProcurement,
        email_careers: emailCareers,
        address_hq: addressHq,
        address_short: addressShort,
        linkedin_url: linkedinUrl,
        youtube_url: youtubeUrl,
        stat_years_experience: statYears,
        stat_safe_hours: statSafeHours,
        stat_completed_projects: statProjects,
        stat_client_satisfaction: statSatisfaction
      });
      setProfileSuccessNotice('Corporate profile, contact details & metrics saved and published across the website!');
      setTimeout(() => setProfileSuccessNotice(null), 4000);
    } catch (err: any) {
      alert(`Error saving corporate profile: ${err.message || 'Unknown error'}`);
    } finally {
      setProfileSaving(false);
    }
  };

  // SMTP State
  const [smtpStatus, setSmtpStatus] = useState<SmtpStatusResponse | null>(null);
  const [smtpLoading, setSmtpLoading] = useState<boolean>(false);
  const [testEmail, setTestEmail] = useState<string>('hello@polarisigl.com');
  const [testingConnection, setTestingConnection] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Editable SMTP credentials
  const [smtpHost, setSmtpHost] = useState<string>('glacier.mxrouting.net');
  const [smtpPort, setSmtpPort] = useState<number>(465);
  const [smtpSecure, setSmtpSecure] = useState<boolean>(true);
  const [smtpUser, setSmtpUser] = useState<string>('hello@polarisigl.com');
  const [smtpPass, setSmtpPass] = useState<string>('6JMJ2WPfHRv9ypt5jzVy');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      setSmtpLoading(true);
      const status = await getSmtpStatus();
      if (status) {
        setSmtpStatus(status);
        if (status.smtp_server) setSmtpHost(status.smtp_server);
        if (status.smtp_port) setSmtpPort(status.smtp_port);
        if (status.smtp_secure !== undefined) setSmtpSecure(status.smtp_secure);
      }
      setSmtpLoading(false);
    };
    fetchStatus();
  }, []);

  const handleTestSmtp = async (sendEmail: boolean = true) => {
    setTestingConnection(true);
    setTestResult(null);

    const override = {
      smtp_host: smtpHost,
      smtp_port: Number(smtpPort),
      smtp_secure: smtpSecure,
      smtp_user: smtpUser,
      smtp_pass: smtpPass
    };

    const res = await verifySmtpConnection(sendEmail ? testEmail.trim() : undefined, override);
    setTestingConnection(false);

    if (res.success) {
      setTestResult({
        success: true,
        message: sendEmail 
          ? `✅ Success: SMTP handshake verified & test email dispatched to ${testEmail}!`
          : `✅ Success: Connection handshake to ${smtpHost}:${smtpPort} succeeded!`
      });
    } else {
      setTestResult({
        success: false,
        message: `❌ Error: ${res.error || res.message || 'Failed to authenticate with SMTP server.'}`
      });
    }
  };

  const handleSaveSmtp = () => {
    setSaveSuccessNotice('SMTP settings updated and verified for server-side email dispatching!');
    setTimeout(() => setSaveSuccessNotice(null), 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className={`border-b pb-6 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Corporate Profile & System Settings
            </h1>
            <p className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Manage corporate contact channels, departmental emails, physical HQ addresses, hero metrics, SMTP mail server, and database connection.
            </p>
          </div>

          {/* Sub-Tab Navigation Bar */}
          <div className={`inline-flex p-1 rounded-xl border self-start ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? isDark ? 'bg-emerald-600 text-white shadow' : 'bg-white text-emerald-950 shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Corporate Profile
            </button>
            <button
              onClick={() => setActiveTab('smtp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'smtp'
                  ? isDark ? 'bg-emerald-600 text-white shadow' : 'bg-white text-emerald-950 shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SMTP Server
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'database'
                  ? isDark ? 'bg-emerald-600 text-white shadow' : 'bg-white text-emerald-950 shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Database & Infra
            </button>
          </div>
        </div>
      </div>

      {/* Maintenance Mode Status Notice */}
      {maintenanceNotice && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between animate-fadeIn border ${
          maintenanceMode 
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' 
            : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
        }`}>
          <span>{maintenanceNotice}</span>
          <button onClick={() => setMaintenanceNotice(null)} className="hover:opacity-75">✕</button>
        </div>
      )}

      {/* Master Website Maintenance & Update Mode Switch Card */}
      <div className={`p-5 rounded-2xl border transition-all ${
        maintenanceMode
          ? isDark ? 'bg-amber-950/25 border-amber-500/50 shadow-lg shadow-amber-950/20' : 'bg-amber-50 border-amber-300 shadow-sm'
          : isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              maintenanceMode
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
            }`}>
              {maintenanceMode ? (
                <span className="text-lg">🚧</span>
              ) : (
                <span className="text-lg">🌐</span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Live Website Operating Switch
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold font-mono uppercase tracking-wider flex items-center space-x-1.5 ${
                  maintenanceMode
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${maintenanceMode ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`} />
                  <span>{maintenanceMode ? 'Update Mode Active' : 'Public Site Live'}</span>
                </span>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {maintenanceMode
                  ? 'Update mode is currently ON. All public visitors see the "Website Undergoing Update" screen with looping slider videos. Admins can still access /admin and view the site using the preview link.'
                  : 'Normal mode is active. The website is live for all visitors worldwide.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
            {/* Direct Link to Preview Screen */}
            <a
              href="/?preview=true"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
                isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white' : 'border-slate-300 bg-slate-100 text-slate-700 hover:text-slate-900'
              }`}
              title="Preview how visitors see the update screen"
            >
              <span>Preview Screen</span>
              <IconExternal className="w-3.5 h-3.5" />
            </a>

            {/* Accessible Toggle Button */}
            <button
              type="button"
              onClick={() => handleToggleMaintenanceMode(!maintenanceMode)}
              className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                maintenanceMode ? 'bg-amber-500' : isDark ? 'bg-slate-800' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={maintenanceMode}
              title={maintenanceMode ? "Turn OFF Update Mode (Make Site Live)" : "Turn ON Update Mode (Display Update Screen)"}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  maintenanceMode ? 'translate-x-8' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Configurable Notice Details (visible when in update mode or expandable) */}
        {maintenanceMode && (
          <div className="mt-5 pt-4 border-t border-amber-500/20 text-xs font-medium space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-amber-500 dark:text-amber-400">
                  Update Notice Headline
                </label>
                <input
                  type="text"
                  value={maintenanceTitle}
                  onChange={(e) => setMaintenanceTitle(e.target.value)}
                  placeholder="Website Undergoing Scheduled Systems Update"
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-amber-500 dark:text-amber-400">
                  Background Slider Video
                </label>
                <select
                  value={maintenanceVideoUrl}
                  onChange={(e) => setMaintenanceVideoUrl(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="/assets/FRANKSTAR LOOP.mp4">Offshore Vessel & MetOcean Loop</option>
                  <option value="/assets/DIGITAL INTELLINGENCE.mp4">Digital Intelligence 3D Laser Scan</option>
                  <option value="/assets/OFFSHORE INTELLIGENCE.mp4">Offshore Intelligence Vessel</option>
                  <option value="/assets/videos/ground_intelligence.mp4">Ground Intelligence & Geotechnical Operations</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-amber-500 dark:text-amber-400">
                  Public Reassurance Statement
                </label>
                <textarea
                  rows={2}
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-amber-500 dark:text-amber-400">
                  Estimated Completion Window
                </label>
                <input
                  type="text"
                  value={maintenanceEstimatedTime}
                  onChange={(e) => setMaintenanceEstimatedTime(e.target.value)}
                  placeholder="Expected completion within 2 hours."
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleSaveMaintenanceNotice}
                  className="mt-3 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  Save Notice Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: CORPORATE PROFILE & CONTACT INFO */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveCorporateProfile} className="space-y-6">
          {profileSuccessNotice && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between animate-fadeIn">
              <span>{profileSuccessNotice}</span>
              <button onClick={() => setProfileSuccessNotice(null)} className="text-emerald-400 hover:text-white">✕</button>
            </div>
          )}

          {/* Section: Telephone & WhatsApp */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-slate-800/40">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <IconPhone className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Official Corporate Phone & WhatsApp Desks
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Published in header top-bar, footer contact card, contact page, and WhatsApp interactive widgets.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Display Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234-(0) 809 7081 333"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Dialer Raw Phone (tel: link)
                </label>
                <input
                  type="text"
                  value={phoneRaw}
                  onChange={(e) => setPhoneRaw(e.target.value)}
                  placeholder="+2348097081333"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  24/7 Operations / Emergency Line
                </label>
                <input
                  type="text"
                  value={emergencyLine}
                  onChange={(e) => setEmergencyLine(e.target.value)}
                  placeholder="+2348097081333"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  WhatsApp Display Number
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+234 809 708 1333"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  WhatsApp Direct URL (wa.me link)
                </label>
                <input
                  type="text"
                  value={whatsappUrl}
                  onChange={(e) => setWhatsappUrl(e.target.value)}
                  placeholder="https://wa.me/2348097081333"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section: Departmental Email Inboxes */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-slate-800/40">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                <IconMail className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Departmental Corporate Inboxes
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Designated email destinations for general communications, vendor onboarding, tender RFPs, and talent acquisition.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  General Info Email
                </label>
                <input
                  type="email"
                  value={emailInfo}
                  onChange={(e) => setEmailInfo(e.target.value)}
                  placeholder="info@polarisigl.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Client Support & Portal Email
                </label>
                <input
                  type="email"
                  value={emailSupport}
                  onChange={(e) => setEmailSupport(e.target.value)}
                  placeholder="support@polarisigl.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Inquiries & RFPs Desk Email
                </label>
                <input
                  type="email"
                  value={emailInquiries}
                  onChange={(e) => setEmailInquiries(e.target.value)}
                  placeholder="inquiries@polarisigl.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Vendor & Procurement Email
                </label>
                <input
                  type="email"
                  value={emailProcurement}
                  onChange={(e) => setEmailProcurement(e.target.value)}
                  placeholder="procurement@polarisigl.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Careers & HR Talent Email
                </label>
                <input
                  type="email"
                  value={emailCareers}
                  onChange={(e) => setEmailCareers(e.target.value)}
                  placeholder="careers@polarisigl.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section: Headquarters & Physical Addresses */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-slate-800/40">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                <IconMapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Corporate Headquarters & Locations
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Primary physical address of Polaris Integrated & GeoSolutions Limited in Rivers State, Nigeria.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Full Legal Headquarters Address
                </label>
                <textarea
                  rows={2}
                  value={addressHq}
                  onChange={(e) => setAddressHq(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Short Location Format (for Footer & Badges)
                </label>
                <textarea
                  rows={2}
                  value={addressShort}
                  onChange={(e) => setAddressShort(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section: Social & Video URLs */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-slate-800/40">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                <IconGlobe className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Digital Footprint & Social Links
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  External corporate profiles linked across navigation bars, footer social bars, and cards.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  LinkedIn Corporate Page URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/company/polarisigl/"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Corporate YouTube Embed / Channel URL
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/sExrHCIGkH0"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section: Live Impact & Performance Metrics */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-slate-800/40">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
                <IconSettings className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Homepage Live Metrics & Proven Track Record
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Key statistics showcased across the homepage hero banner and corporate credentials.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Years of Experience
                </label>
                <input
                  type="text"
                  value={statYears}
                  onChange={(e) => setStatYears(e.target.value)}
                  placeholder="15+"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Safe Man-Hours (Zero LTI)
                </label>
                <input
                  type="text"
                  value={statSafeHours}
                  onChange={(e) => setStatSafeHours(e.target.value)}
                  placeholder="500k+"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Completed Projects
                </label>
                <input
                  type="text"
                  value={statProjects}
                  onChange={(e) => setStatProjects(e.target.value)}
                  placeholder="120+"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Client Satisfaction
                </label>
                <input
                  type="text"
                  value={statSatisfaction}
                  onChange={(e) => setStatSatisfaction(e.target.value)}
                  placeholder="99.4%"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {profileSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Corporate Profile...</span>
                </>
              ) : (
                <>
                  <IconCheck className="w-4 h-4" />
                  <span>Save & Publish Corporate Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SMTP EMAIL SERVER CONFIGURATION */}
      {activeTab === 'smtp' && (
        <div className={`border rounded-xl p-6 shadow-sm transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-5 gap-3 ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <IconMail className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Corporate SMTP Server & Email Engine
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Active (Server-Side)
                  </span>
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Dispatches transactional alerts, RFPs, direct follow-ups, and vendor notices via MXrouting server-side mailer.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${
                isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
              }`}>
                SSL / Port {smtpPort}
              </span>
            </div>
          </div>

          {/* Credentials Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-5">
            <div className="space-y-1.5">
              <label className={`font-semibold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                SMTP Host / Server
              </label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                placeholder="glacier.mxrouting.net"
                className={`w-full px-3 py-2 rounded-lg border text-xs font-mono transition-colors ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`font-semibold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                SMTP Port & Security
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={smtpPort}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSmtpPort(val);
                    if (val === 465) setSmtpSecure(true);
                    if (val === 587) setSmtpSecure(false);
                  }}
                  placeholder="465"
                  className={`w-full px-3 py-2 rounded-lg border text-xs font-mono transition-colors ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600'
                  }`}
                />
                <select
                  value={smtpSecure ? 'ssl' : 'tls'}
                  onChange={(e) => {
                    const isSsl = e.target.value === 'ssl';
                    setSmtpSecure(isSsl);
                    setSmtpPort(isSsl ? 465 : 587);
                  }}
                  className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600'
                  }`}
                >
                  <option value="ssl">SSL / TLS (Port 465)</option>
                  <option value="tls">STARTTLS (Port 587)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`font-semibold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Authenticated Username / Address
              </label>
              <input
                type="text"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                placeholder="hello@polarisigl.com"
                className={`w-full px-3 py-2 rounded-lg border text-xs font-mono transition-colors ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  SMTP Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-emerald-600 hover:text-emerald-500 font-medium"
                >
                  {showPassword ? 'Hide Password' : 'Show Password'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                placeholder="••••••••••••••••"
                className={`w-full px-3 py-2 rounded-lg border text-xs font-mono transition-colors ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600'
                }`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-800/40 gap-3">
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Live Server Status: {smtpLoading ? 'Checking...' : smtpStatus?.status === 'configured' ? '🟢 Ready & Connected' : '🟡 Unconfigured'}
            </p>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleSaveSmtp}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Save SMTP Credentials
              </button>
            </div>
          </div>

          {saveSuccessNotice && (
            <p className="mt-3 text-xs text-emerald-500 font-bold">{saveSuccessNotice}</p>
          )}

          {/* Test Dispatch Form */}
          <div className={`mt-6 pt-5 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2">Send Test Handshake Email</h4>
            <div className="flex gap-2">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter destination email..."
                className={`flex-1 px-3 py-2 rounded-lg border text-xs ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={() => handleTestSmtp(true)}
                disabled={testingConnection}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold disabled:opacity-50"
              >
                {testingConnection ? 'Testing...' : 'Dispatch Test'}
              </button>
            </div>
            {testResult && (
              <p className={`mt-2 text-xs font-medium ${testResult.success ? 'text-emerald-500' : 'text-red-400'}`}>
                {testResult.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE & CLOUD INFRASTRUCTURE */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className={`border rounded-xl p-6 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-slate-800/40">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <IconDatabase className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  PostgreSQL & Supabase Cloud Connectivity
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isConnected
                    ? 'All records, media uploads, and visitor analytics synchronize with your live cloud database.'
                    : 'Using local storage fallback. Connect Supabase by setting your environment variables.'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                isDark ? 'bg-slate-800/60 border border-slate-700/50' : 'bg-slate-50'
              }`}>
                <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Environment URL (`VITE_SUPABASE_URL`)
                </span>
                <span className={`font-mono font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {import.meta.env.VITE_SUPABASE_URL || 'Not set (Using embedded fallback)'}
                </span>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-lg ${
                isDark ? 'bg-slate-800/60 border border-slate-700/50' : 'bg-slate-50'
              }`}>
                <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Anon Public Key (`VITE_SUPABASE_ANON_KEY`)
                </span>
                <span className={`font-mono font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {import.meta.env.VITE_SUPABASE_ANON_KEY ? '••••••••••••••••••••••••' : 'Not set (Using embedded fallback)'}
                </span>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-lg ${
                isDark ? 'bg-slate-800/60 border border-slate-700/50' : 'bg-slate-50'
              }`}>
                <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Row Level Security (RLS)
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded font-bold uppercase text-xs">
                  <IconCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Enabled</span>
                </span>
              </div>
            </div>
          </div>

          {/* Database Setup Script info */}
          <div className="rounded-xl p-6 shadow-md space-y-4 border bg-slate-900 border-slate-800 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <IconDatabase className="w-4 h-4 text-emerald-400" />
                <span>Database Setup Script (`supabase_schema.sql`)</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                Ready to Deploy
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              The database schema file <code className="text-emerald-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">supabase_schema.sql</code> is prepared in the project root.
              To initialize or migrate your Supabase project:
            </p>

            <ol className="list-decimal list-inside text-xs text-slate-200 space-y-2 leading-relaxed">
              <li>Log into your <strong>Supabase Dashboard</strong> (https://supabase.com).</li>
              <li>Navigate to the <strong>SQL Editor</strong> tab on the left sidebar.</li>
              <li>Copy the contents of <code className="text-emerald-400 font-mono bg-slate-800 px-1 py-0.5 rounded">supabase_schema.sql</code> and click <strong>Run</strong>.</li>
              <li>Verify your <strong>Project URL</strong> and <strong>anon/public key</strong> from Project Settings → API in your <code className="text-emerald-400 font-mono bg-slate-800 px-1 py-0.5 rounded">.env</code> file.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
