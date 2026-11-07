import React, { useState } from 'react';
import { SocialLinkItem, SocialPlatformId } from '../../types';
import { useSocialLinks } from '../../hooks/useSupabaseData';
import { SOCIAL_PLATFORM_PRESETS, SocialPlatformPreset } from '../../constants/socialPlatforms';
import { SocialIcon } from '../../components/SocialIcon';
import {
  IconPlus,
  IconCheck,
  IconEdit,
  IconTrash,
  IconCopy,
  IconExternal,
  IconArrowUp,
  IconArrowDown,
  IconClose,
  IconAlert,
  IconGlobe,
  IconShare
} from '../../components/admin/AdminIcons';

interface AdminSocialLinksProps {
  theme?: 'light' | 'dark';
}

export const AdminSocialLinks: React.FC<AdminSocialLinksProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';
  const {
    socialLinks,
    loading,
    error,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    toggleActive,
    reorderSocialLinks,
    resetToDefault
  } = useSocialLinks(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SocialLinkItem | null>(null);

  // Form State
  const [formPlatform, setFormPlatform] = useState<SocialPlatformId>('linkedin');
  const [formLabel, setFormLabel] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formHandle, setFormHandle] = useState('');
  const [formBrandColor, setFormBrandColor] = useState('#0A66C2');
  const [formHoverColor, setFormHoverColor] = useState('');
  const [formIconType, setFormIconType] = useState<'preset' | 'custom_svg' | 'custom_image'>('preset');
  const [formCustomSvg, setFormCustomSvg] = useState('');
  const [formCustomIconUrl, setFormCustomIconUrl] = useState('');
  const [formShowFooter, setFormShowFooter] = useState(true);
  const [formShowContact, setFormShowContact] = useState(true);
  const [formShowHeader, setFormShowHeader] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formAriaLabel, setFormAriaLabel] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Reset Confirm State
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Copied State
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Toast Notification
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Open Add Modal with platform defaults
  const handleOpenAdd = (presetPlatform?: SocialPlatformId) => {
    const preset = SOCIAL_PLATFORM_PRESETS.find(p => p.id === (presetPlatform || 'linkedin')) || SOCIAL_PLATFORM_PRESETS[0];
    setEditingItem(null);
    setFormPlatform(preset.id);
    setFormLabel(preset.defaultLabel);
    setFormUrl(preset.defaultUrl);
    setFormHandle('');
    setFormBrandColor(preset.brandColor);
    setFormHoverColor(preset.hoverColor);
    setFormIconType('preset');
    setFormCustomSvg('');
    setFormCustomIconUrl('');
    setFormShowFooter(true);
    setFormShowContact(true);
    setFormShowHeader(false);
    setFormIsActive(true);
    setFormAriaLabel(`PIGL on ${preset.defaultLabel}`);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: SocialLinkItem) => {
    setEditingItem(item);
    setFormPlatform(item.platform);
    setFormLabel(item.label);
    setFormUrl(item.url);
    setFormHandle(item.handle || '');
    setFormBrandColor(item.brand_color || '#059669');
    setFormHoverColor(item.hover_color || '');
    setFormIconType(item.icon_type || 'preset');
    setFormCustomSvg(item.custom_svg || '');
    setFormCustomIconUrl(item.custom_icon_url || '');
    setFormShowFooter(item.show_in_footer ?? true);
    setFormShowContact(item.show_in_contact ?? true);
    setFormShowHeader(item.show_in_header ?? false);
    setFormIsActive(item.is_active);
    setFormAriaLabel(item.aria_label || `PIGL on ${item.label}`);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle Platform Change in Form
  const handlePlatformChange = (pId: SocialPlatformId) => {
    setFormPlatform(pId);
    const preset = SOCIAL_PLATFORM_PRESETS.find(p => p.id === pId);
    if (preset) {
      if (!editingItem || formLabel === '' || SOCIAL_PLATFORM_PRESETS.some(p => p.defaultLabel === formLabel)) {
        setFormLabel(preset.defaultLabel);
      }
      if (!editingItem || formUrl === '' || SOCIAL_PLATFORM_PRESETS.some(p => p.defaultUrl === formUrl)) {
        setFormUrl(preset.defaultUrl);
      }
      setFormBrandColor(preset.brandColor);
      setFormHoverColor(preset.hoverColor);
      setFormAriaLabel(`PIGL on ${preset.defaultLabel}`);
    }
  };

  // Save Link Form
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formLabel.trim()) {
      setFormError('Please enter a display label for this social channel.');
      return;
    }

    if (!formUrl.trim()) {
      setFormError('Please enter the full destination URL.');
      return;
    }

    // Basic URL check
    try {
      new URL(formUrl.trim());
    } catch {
      setFormError('Please enter a valid URL (including https:// or http://).');
      return;
    }

    try {
      if (editingItem) {
        await updateSocialLink(editingItem.id, {
          platform: formPlatform,
          label: formLabel.trim(),
          url: formUrl.trim(),
          handle: formHandle.trim() || undefined,
          brand_color: formBrandColor,
          hover_color: formHoverColor || undefined,
          icon_type: formIconType,
          custom_svg: formCustomSvg.trim() || undefined,
          custom_icon_url: formCustomIconUrl.trim() || undefined,
          show_in_footer: formShowFooter,
          show_in_contact: formShowContact,
          show_in_header: formShowHeader,
          is_active: formIsActive,
          aria_label: formAriaLabel.trim() || `PIGL on ${formLabel.trim()}`
        });
        showToast(`Updated "${formLabel.trim()}" successfully.`);
      } else {
        const nextOrder = socialLinks.length + 1;
        await addSocialLink({
          platform: formPlatform,
          label: formLabel.trim(),
          url: formUrl.trim(),
          handle: formHandle.trim() || undefined,
          brand_color: formBrandColor,
          hover_color: formHoverColor || undefined,
          icon_type: formIconType,
          custom_svg: formCustomSvg.trim() || undefined,
          custom_icon_url: formCustomIconUrl.trim() || undefined,
          show_in_footer: formShowFooter,
          show_in_contact: formShowContact,
          show_in_header: formShowHeader,
          is_active: formIsActive,
          display_order: nextOrder,
          aria_label: formAriaLabel.trim() || `PIGL on ${formLabel.trim()}`
        });
        showToast(`Added "${formLabel.trim()}" successfully.`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save social link.');
    }
  };

  // Reorder Item
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= socialLinks.length) return;

    const list = [...socialLinks];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const reorderedIds = list.map(item => item.id);
    await reorderSocialLinks(reorderedIds);
    showToast(`Updated display order for "${moved.label}".`);
  };

  // Delete Item
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    const target = socialLinks.find(l => l.id === deleteConfirmId);
    await deleteSocialLink(deleteConfirmId);
    setDeleteConfirmId(null);
    showToast(`Removed "${target?.label || 'channel'}" from website.`);
  };

  // Reset to Baseline
  const handleResetConfirm = async () => {
    await resetToDefault();
    setIsResetConfirmOpen(false);
    showToast('Reset social channels to official PIGL baseline defaults.');
  };

  // Copy Link URL
  const handleCopyLink = (item: SocialLinkItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Metrics
  const totalCount = socialLinks.length;
  const activeCount = socialLinks.filter(l => l.is_active).length;
  const footerCount = socialLinks.filter(l => l.is_active && l.show_in_footer).length;
  const contactCount = socialLinks.filter(l => l.is_active && l.show_in_contact).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-2xl border border-emerald-500/30 animate-fade-in">
          <IconCheck className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Social Media Links &amp; Icons
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Live CMS
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage corporate social profiles, destination links, platform icons, brand colors, and frontend display placements.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
              isDark
                ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-700'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs'
            }`}
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={() => handleOpenAdd()}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <IconPlus className="w-4 h-4" />
            <span>Add Social Channel</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Configured</span>
          <div className={`text-xl sm:text-2xl font-extrabold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {totalCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Total channels</span>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 font-mono">Active Live</span>
          <div className="text-xl sm:text-2xl font-extrabold mt-1 text-emerald-600 dark:text-emerald-400">
            {activeCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Visible to visitors</span>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Footer Links</span>
          <div className={`text-xl sm:text-2xl font-extrabold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {footerCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Visible in website footer</span>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Contact Page</span>
          <div className={`text-xl sm:text-2xl font-extrabold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {contactCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Direct contact desks</span>
        </div>
      </div>

      {/* Quick Add Presets Bar */}
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500">
            One-Click Platform Presets
          </span>
          <span className="text-[11px] text-slate-400">
            Click to pre-fill brand styling &amp; icon
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SOCIAL_PLATFORM_PRESETS.map((preset) => {
            const isConfigured = socialLinks.some(l => l.platform === preset.id);
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleOpenAdd(preset.id)}
                className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isConfigured
                    ? isDark
                      ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-emerald-500/60'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-emerald-600 shadow-xs'
                    : isDark
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-400 hover:bg-emerald-900/30'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100/70'
                }`}
                title={preset.description}
              >
                <span
                  className="w-3.5 h-3.5 flex items-center justify-center shrink-0"
                  style={{ color: preset.brandColor }}
                >
                  <SocialIcon platform={preset.id} size={14} />
                </span>
                <span>{preset.name}</span>
                {isConfigured ? (
                  <span className="text-[10px] opacity-60 ml-0.5">✓</span>
                ) : (
                  <span className="text-[10px] text-emerald-500 font-bold ml-0.5">+</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Channel Cards List */}
      <div className="space-y-3">
        {loading && socialLinks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500">Loading social media channels...</p>
          </div>
        ) : socialLinks.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <IconShare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No social channels configured yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add your official corporate LinkedIn, YouTube, X, WhatsApp, or custom web links above.
            </p>
            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
            >
              Add First Channel
            </button>
          </div>
        ) : (
          socialLinks.map((item, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === socialLinks.length - 1;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  !item.is_active
                    ? isDark
                      ? 'bg-slate-900/30 border-slate-800/60 opacity-60'
                      : 'bg-slate-100/60 border-slate-200 opacity-60'
                    : isDark
                      ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-200 shadow-xs hover:shadow-sm'
                }`}
              >
                {/* Left: Reorder Controls & Brand Icon & Details */}
                <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col space-y-1 shrink-0">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => handleMove(idx, 'up')}
                      className={`p-1 rounded transition-colors ${
                        isFirst
                          ? 'opacity-20 cursor-not-allowed text-slate-500'
                          : isDark
                            ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                            : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                      }`}
                      title="Move up"
                    >
                      <IconArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => handleMove(idx, 'down')}
                      className={`p-1 rounded transition-colors ${
                        isLast
                          ? 'opacity-20 cursor-not-allowed text-slate-500'
                          : isDark
                            ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                            : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                      }`}
                      title="Move down"
                    >
                      <IconArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Icon Avatar */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-black/10 text-white"
                    style={{ backgroundColor: item.brand_color || '#059669' }}
                  >
                    <SocialIcon link={item} platform={item.platform} size={22} className="w-5 h-5 fill-current" />
                  </div>

                  {/* Channel Details */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {item.label}
                      </span>
                      {item.handle && (
                        <span className="text-xs font-mono font-medium text-slate-500 truncate">
                          {item.handle}
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold bg-slate-500/10 text-slate-500 border border-slate-500/20">
                        #{item.display_order ?? idx + 1}
                      </span>
                    </div>

                    {/* URL Link */}
                    <div className="flex items-center space-x-2 text-xs">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline truncate max-w-md font-mono flex items-center space-x-1"
                        title={item.url}
                      >
                        <span className="truncate">{item.url}</span>
                        <IconExternal className="w-3 h-3 shrink-0 opacity-70" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right: Placements, Status Toggle & Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/40">
                  {/* Placement Badges */}
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full ${
                        item.show_in_footer
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20 line-through'
                      }`}
                      title={item.show_in_footer ? 'Visible in website footer' : 'Hidden from website footer'}
                    >
                      Footer
                    </span>
                    <span
                      className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full ${
                        item.show_in_contact
                          ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20 line-through'
                      }`}
                      title={item.show_in_contact ? 'Visible on contact page' : 'Hidden from contact page'}
                    >
                      Contact
                    </span>
                  </div>

                  {/* Active Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => toggleActive(item.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      item.is_active ? 'bg-emerald-600' : 'bg-slate-600'
                    }`}
                    title={item.is_active ? 'Click to deactivate (hide from visitors)' : 'Click to activate (make visible)'}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        item.is_active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(item)}
                      className={`p-2 rounded-lg transition-colors ${
                        copiedId === item.id
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : isDark
                            ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                            : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                      }`}
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <IconCheck className="w-4 h-4" /> : <IconCopy className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                      }`}
                      title="Edit channel details"
                    >
                      <IconEdit className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete channel"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Live Frontend Simulation Box */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/40">
          <div>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Frontend Live Preview
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulated display of active channels as seen by website visitors.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-500 font-semibold">
            ● Real-Time Feed
          </span>
        </div>

        {/* Footer Bar Preview */}
        <div className="space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">
              Website Footer (Dark Brand Theme)
            </span>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center space-x-3">
              <span className="text-xs text-slate-400 font-medium">Follow PIGL:</span>
              <div className="flex items-center space-x-2.5">
                {socialLinks.filter(l => l.is_active && l.show_in_footer).length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No channels visible in footer.</span>
                ) : (
                  socialLinks
                    .filter(l => l.is_active && l.show_in_footer)
                    .map(link => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all shadow-sm hover:scale-110"
                        style={{ backgroundColor: link.brand_color || '#059669' }}
                        title={link.label}
                      >
                        <SocialIcon link={link} platform={link.platform} size={18} className="w-4 h-4 fill-current" />
                      </a>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Channel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden my-8 ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="p-5 border-b border-slate-800/40 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingItem ? 'Edit Social Media Channel' : 'Add Social Media Channel'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure platform identity, destination link, and visibility.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
                  <IconAlert className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Platform Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-400 font-mono">
                  Platform Preset
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {SOCIAL_PLATFORM_PRESETS.map((p) => {
                    const isSelected = formPlatform === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePlatformChange(p.id)}
                        className={`p-2 rounded-lg border text-xs font-semibold flex items-center space-x-2 transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                            : isDark
                              ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span style={{ color: isSelected ? '#ffffff' : p.brandColor }}>
                          <SocialIcon platform={p.id} size={14} />
                        </span>
                        <span className="truncate">{p.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Label & Handle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-400 font-mono">
                    Display Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder="e.g. LinkedIn"
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-400 font-mono">
                    Account Handle / ID
                  </label>
                  <input
                    type="text"
                    value={formHandle}
                    onChange={(e) => setFormHandle(e.target.value)}
                    placeholder="e.g. @polarisigl"
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Full Destination URL */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-400 font-mono">
                  Destination URL *
                </label>
                <input
                  type="url"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://..."
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Brand Color & Swatches */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-400 font-mono">
                  Brand Color &amp; Accent
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formBrandColor}
                    onChange={(e) => setFormBrandColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    value={formBrandColor}
                    onChange={(e) => setFormBrandColor(e.target.value)}
                    placeholder="#059669"
                    className={`w-28 px-2.5 py-1.5 rounded-lg border text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <div className="flex items-center space-x-1.5 flex-wrap">
                    {['#0A66C2', '#FF0000', '#25D366', '#000000', '#E4405F', '#1877F2', '#059669'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormBrandColor(c)}
                        className="w-6 h-6 rounded-full border border-black/20 shrink-0 hover:scale-110 transition-transform"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Icon Source Toggle */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-400 font-mono">
                  Icon Source
                </label>
                <div className="flex items-center space-x-4 text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="icon_type"
                      checked={formIconType === 'preset'}
                      onChange={() => setFormIconType('preset')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Preset Brand Icon</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="icon_type"
                      checked={formIconType === 'custom_svg'}
                      onChange={() => setFormIconType('custom_svg')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Custom SVG Markup</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="icon_type"
                      checked={formIconType === 'custom_image'}
                      onChange={() => setFormIconType('custom_image')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Image URL</span>
                  </label>
                </div>

                {formIconType === 'custom_svg' && (
                  <div className="mt-2">
                    <textarea
                      rows={3}
                      value={formCustomSvg}
                      onChange={(e) => setFormCustomSvg(e.target.value)}
                      placeholder='<svg viewBox="0 0 24 24">...</svg>'
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                )}

                {formIconType === 'custom_image' && (
                  <div className="mt-2">
                    <input
                      type="url"
                      value={formCustomIconUrl}
                      onChange={(e) => setFormCustomIconUrl(e.target.value)}
                      placeholder="https://.../icon.png"
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Placements & Active State */}
              <div className="p-3 rounded-xl border bg-slate-500/5 border-slate-500/10 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                  Frontend Placements &amp; Visibility
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formShowFooter}
                      onChange={(e) => setFormShowFooter(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Show in Website Footer</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formShowContact}
                      onChange={(e) => setFormShowContact(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Show on Contact Page</span>
                  </label>
                </div>
                <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Status:</span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className={formIsActive ? 'text-emerald-500 font-bold' : 'text-slate-400'}>
                      {formIsActive ? 'Live & Published Online' : 'Draft / Disabled'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl border ${
                    isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  {editingItem ? 'Save Changes' : 'Create Channel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className={`w-full max-w-sm rounded-2xl border p-5 space-y-4 shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center space-x-3 text-rose-500">
              <IconAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold">Remove Social Channel?</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to remove this channel? It will no longer be visible on the website footer or contact pages.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Baseline Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className={`w-full max-w-md rounded-2xl border p-5 space-y-4 shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center space-x-3 text-emerald-500">
              <IconAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold">Reset to Official Baseline?</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              This will restore PIGL&apos;s verified social channel defaults (LinkedIn, YouTube, WhatsApp, and X/Twitter). Any custom entries will be reset.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetConfirm}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                Reset to Baseline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
