import React, { useState, useEffect } from 'react';
import { AdminUser } from '../../types';

interface AdminProfileProps {
  user: AdminUser | null;
  onUpdateProfile: (profileData: Partial<AdminUser>) => Promise<{ success: boolean; error?: string }>;
  onUpdatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  theme?: 'light' | 'dark';
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
];

const AdminProfile: React.FC<AdminProfileProps> = ({
  user,
  onUpdateProfile,
  onUpdatePassword,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';

  // Profile fields state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [jobTitle, setJobTitle] = useState(user?.job_title || 'Managing Director / Principal Engineer');
  const [phone, setPhone] = useState(user?.phone || '+234 803 708 1904');
  const [bio, setBio] = useState(
    user?.bio || 'Leading technical integrity, geotechnical characterisation, 3D reality capture and subsea engineering across Sub-Saharan Africa.'
  );
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  // Keep form state in sync whenever user object updates or resolves from server
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
      if (user.job_title) setJobTitle(user.job_title);
      if (user.phone) setPhone(user.phone);
      if (user.bio) setBio(user.bio);
      if (user.avatar_url !== undefined) setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Handle avatar upload via file reader
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setProfileMessage({ type: 'error', text: 'Image size should be less than 2MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setProfileMessage({ type: 'error', text: 'Full Name is required.' });
      return;
    }

    setProfileSaving(true);
    setProfileMessage(null);

    const result = await onUpdateProfile({
      full_name: fullName.trim(),
      email: email.trim(),
      job_title: jobTitle.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      avatar_url: avatarUrl
    });

    setProfileSaving(false);
    if (result.success) {
      setProfileMessage({ type: 'success', text: 'Administrator profile successfully updated!' });
      setTimeout(() => setProfileMessage(null), 4000);
    } else {
      setProfileMessage({ type: 'error', text: result.error || 'Failed to update profile.' });
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordSaving(true);
    const result = await onUpdatePassword(newPassword);
    setPasswordSaving(false);

    if (result.success) {
      setPasswordMessage({ type: 'success', text: 'Password successfully updated! Please remember your new password.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(null), 5000);
    } else {
      setPasswordMessage({ type: 'error', text: result.error || 'Failed to update password.' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
        isDark 
          ? 'bg-slate-900/90 border-slate-800 text-white' 
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            {/* Avatar Preview */}
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-slate-800 shadow-lg flex items-center justify-center text-2xl font-bold text-white uppercase">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <span>{fullName.charAt(0) || user?.email?.charAt(0) || 'A'}</span>
                )}
              </div>
              <label
                htmlFor="avatar-file-upload"
                className="absolute -bottom-2 -right-2 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md cursor-pointer transition-transform hover:scale-110"
                title="Upload Photo"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
              <input
                id="avatar-file-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {fullName || 'Administrator'}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${
                  isDark 
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' 
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300/60'
                }`}>
                  {user?.role || 'Super Admin'}
                </span>
              </div>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{jobTitle}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                <span>Email: <strong className={`font-mono ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{email}</strong></span>
                <span>•</span>
                <span className={`flex items-center font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Active Session
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border ${
              isDark 
                ? 'bg-slate-800/80 text-slate-300 border-slate-700/60' 
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}>
              ID: {user?.id || 'admin-root'}
            </span>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border ${
              isDark 
                ? 'bg-slate-800/80 text-slate-300 border-slate-700/60' 
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}>
              Auth: Supabase / Local
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Profile Information Form */}
        <div className="lg:col-span-7">
          <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}>
            <div className={`flex items-center space-x-3 mb-6 pb-4 border-b ${
              isDark ? 'border-slate-800/60' : 'border-slate-100'
            }`}>
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-emerald-950/60 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
              }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold">Personal Information</h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Update your executive name, designation and contact details
                </p>
              </div>
            </div>

            {profileMessage && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium border flex items-center space-x-3 ${
                profileMessage.type === 'success'
                  ? isDark 
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' 
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : isDark 
                    ? 'bg-red-950/60 text-red-300 border-red-800' 
                    : 'bg-red-50 text-red-800 border-red-300'
              }`}>
                <span>{profileMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-700'
                  }`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Engr. Chigozie Bosah"
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-700'
                  }`}>
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@polarisigl.com"
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-700'
                  }`}>
                    Designation / Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Managing Director"
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-700'
                  }`}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 708 1904"
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-700'
                }`}>
                  Profile Photo URL (or use file upload button above)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://... or upload above"
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                    }`}
                  />
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="px-3 py-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl text-xs transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Preset Avatars Selection */}
                <div className="mt-3">
                  <span className={`text-[11px] font-medium block mb-2 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                    Or choose a preset avatar:
                  </span>
                  <div className="flex items-center space-x-2.5">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(preset)}
                        className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${
                          avatarUrl === preset ? 'border-emerald-500 scale-110 shadow-md shadow-emerald-500/30' : 'border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-700'
                }`}>
                  Professional Bio / Notes
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell your team about your responsibilities..."
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center space-x-2"
                >
                  {profileSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Change Password & Security Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}>
            <div className={`flex items-center space-x-3 mb-6 pb-4 border-b ${
              isDark ? 'border-slate-800/60' : 'border-slate-100'
            }`}>
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-800'
              }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold">Modify Password</h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Update your secret credentials securely</p>
              </div>
            </div>

            {passwordMessage && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium border flex items-center space-x-3 ${
                passwordMessage.type === 'success'
                  ? isDark 
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' 
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : isDark 
                    ? 'bg-red-950/60 text-red-300 border-red-800' 
                    : 'bg-red-50 text-red-800 border-red-300'
              }`}>
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-700'
                }`}>
                  Current Password (Optional Verification)
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-600'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-700'
                }`}>
                  New Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-600'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-700'
                }`}>
                  Confirm New Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-600'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`flex items-center space-x-1 font-medium transition-colors ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                </button>
                <span className={`font-mono text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Min 6 characters</span>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={passwordSaving || !newPassword}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-amber-600/30 transition-all flex items-center justify-center space-x-2"
                >
                  {passwordSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Update Secret Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Security & Access Card */}
          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
              isDark ? 'text-slate-400' : 'text-slate-800'
            }`}>
              Security Governance
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <span>Role Permission Level:</span>
                <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Full System Access</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Session Security:</span>
                <span className={`font-mono ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>AES-256 JWT Token</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Database Sync:</span>
                <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Active & Encrypted</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
