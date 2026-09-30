import React, { useState } from 'react';
import LogoLightImg from '../../assets/logo_light.png';
import SliderHeroBg from '../../assets/slider.jpeg';
import ISO9001Logo from '../../assets/Q-Mark (ISO 9001).png';
import ISO45001Logo from '../../assets/Q-Mark (ISO 45001).png';
import { IconShield, IconLock, IconAlert } from '../../components/admin/AdminIcons';

interface AdminLoginProps {
  onLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your administrator email and password.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const res = await onLogin(email, password);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected login error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-slate-950">
      
      {/* ========================================================================= */}
      {/* Left 50%: Immersive Corporate Engineering Hero Visual */}
      {/* ========================================================================= */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 lg:p-16 overflow-hidden bg-slate-950">
        {/* Background Visual */}
        <div className="absolute inset-0 z-0">
          <img
            src={SliderHeroBg}
            alt="Polaris Integrated Engineering"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transform hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-slate-950" />
        </div>

        {/* Top Branding */}
        <div className="relative z-10">
          <a href="/" className="inline-flex items-center space-x-3 group">
            <img
              src={LogoLightImg}
              alt="Polaris Integrated & Geosolutions"
              className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </a>
          <div className="mt-4 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
              Enterprise Portal • Core CMS
            </span>
          </div>
        </div>

        {/* Middle Narrative */}
        <div className="relative z-10 my-auto max-w-lg space-y-4">
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Engineering Intelligence & Subsurface Assurance.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Authorized portal for managing specialist engineering services, real-time MetOcean intelligence, technical articles, and client RFPs.
          </p>

          <div className="pt-4 flex flex-wrap gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-[11px] font-mono text-slate-300">
              Ground Intelligence (CPT)
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-[11px] font-mono text-slate-300">
              Digital Twins (Leica RTC360)
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-[11px] font-mono text-slate-300">
              Offshore Telemetry
            </div>
          </div>
        </div>

        {/* Bottom Certifications & Security */}
        <div className="relative z-10 pt-8 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={ISO9001Logo} alt="ISO 9001" className="h-8 w-auto opacity-80" />
            <img src={ISO45001Logo} alt="ISO 45001" className="h-8 w-auto opacity-80" />
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
            <IconShield className="w-4 h-4 text-emerald-500" />
            <span>256-bit SSL Protected</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Right 50%: Administrative Sign-In Form */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Header Logo (Visible on mobile/tablets) */}
          <div className="lg:hidden text-center">
            <a href="/" className="inline-block mb-4">
              <img
                src={LogoLightImg}
                alt="PIGL"
                className="h-12 mx-auto object-contain"
              />
            </a>
            <h2 className="text-xl font-bold text-white tracking-tight">
              PIGL Administrator Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Authorized Engineering Personnel & Content Managers
            </p>
          </div>

          {/* Desktop Form Header */}
          <div className="hidden lg:block space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Administrative Sign In
            </h2>
            <p className="text-xs text-slate-400">
              Enter your corporate credentials to manage website services, content, and inquiries.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
            
            {error && (
              <div className="p-3.5 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-start space-x-2">
                <IconAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@polarisigl.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors font-medium placeholder-slate-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors font-medium placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-emerald-950 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <span>Access Management Portal</span>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Helper */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                Default: <strong className="text-slate-200">admin@polarisigl.com</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@polarisigl.com');
                  setPassword('adminpassword123');
                }}
                className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
              >
                Auto-fill
              </button>
            </div>
          </div>

          {/* Footer Back Link */}
          <div className="text-center">
            <a
              href="/"
              className="text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center space-x-1"
            >
              <span>← Return to Polaris Integrated Corporate Website</span>
            </a>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdminLogin;
