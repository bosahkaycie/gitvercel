import { SocialPlatformId, SocialLinkItem } from '../types';

export interface SocialPlatformPreset {
  id: SocialPlatformId;
  name: string;
  defaultLabel: string;
  defaultUrl: string;
  urlPlaceholder: string;
  handlePlaceholder: string;
  brandColor: string;
  hoverColor: string;
  description: string;
}

export const SOCIAL_PLATFORM_PRESETS: SocialPlatformPreset[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    defaultLabel: 'LinkedIn',
    defaultUrl: 'https://www.linkedin.com/company/polarisigl/',
    urlPlaceholder: 'https://www.linkedin.com/company/your-company',
    handlePlaceholder: '@polarisigl or polarisigl',
    brandColor: '#0A66C2',
    hoverColor: '#004182',
    description: 'Corporate professional networking, executive posts, and recruitment.'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    defaultLabel: 'YouTube',
    defaultUrl: 'https://www.youtube.com/@polarisigl',
    urlPlaceholder: 'https://www.youtube.com/@polarisigl or /channel/...',
    handlePlaceholder: '@polarisigl',
    brandColor: '#FF0000',
    hoverColor: '#CC0000',
    description: 'Corporate video documentaries, offshore footage, and technical demos.'
  },
  {
    id: 'twitter',
    name: 'X (formerly Twitter)',
    defaultLabel: 'X (Twitter)',
    defaultUrl: 'https://x.com/polarisigl',
    urlPlaceholder: 'https://x.com/polarisigl',
    handlePlaceholder: '@polarisigl',
    brandColor: '#000000',
    hoverColor: '#1DA1F2',
    description: 'Real-time company announcements, industry news, and field updates.'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    defaultLabel: 'WhatsApp',
    defaultUrl: 'https://wa.me/2348097081333',
    urlPlaceholder: 'https://wa.me/2348097081333',
    handlePlaceholder: '+234 809 7081 333',
    brandColor: '#25D366',
    hoverColor: '#128C7E',
    description: 'Direct instant messaging for client enquiries, emergency desks, and RFPs.'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    defaultLabel: 'Instagram',
    defaultUrl: 'https://www.instagram.com/polarisigl',
    urlPlaceholder: 'https://www.instagram.com/your-handle',
    handlePlaceholder: '@polarisigl',
    brandColor: '#E4405F',
    hoverColor: '#C13584',
    description: 'Behind-the-scenes engineering photos, CSR milestones, and site moments.'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    defaultLabel: 'Facebook',
    defaultUrl: 'https://www.facebook.com/polarisigl',
    urlPlaceholder: 'https://www.facebook.com/your-page',
    handlePlaceholder: 'polarisigl',
    brandColor: '#1877F2',
    hoverColor: '#0d65d9',
    description: 'Community engagement, corporate updates, and regional partnerships.'
  },
  {
    id: 'threads',
    name: 'Threads',
    defaultLabel: 'Threads',
    defaultUrl: 'https://www.threads.net/@polarisigl',
    urlPlaceholder: 'https://www.threads.net/@your-handle',
    handlePlaceholder: '@polarisigl',
    brandColor: '#000000',
    hoverColor: '#333333',
    description: 'Short-form engineering discussions and conversational updates.'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    defaultLabel: 'TikTok',
    defaultUrl: 'https://www.tiktok.com/@polarisigl',
    urlPlaceholder: 'https://www.tiktok.com/@your-handle',
    handlePlaceholder: '@polarisigl',
    brandColor: '#000000',
    hoverColor: '#FE2C55',
    description: 'Short-form educational engineering clips and technical showcases.'
  },
  {
    id: 'github',
    name: 'GitHub',
    defaultLabel: 'GitHub',
    defaultUrl: 'https://github.com/polarisigl',
    urlPlaceholder: 'https://github.com/your-org',
    handlePlaceholder: 'polarisigl',
    brandColor: '#24292F',
    hoverColor: '#1B1F23',
    description: 'Open source GIS plugins, geodetic calculators, and technical codebases.'
  },
  {
    id: 'medium',
    name: 'Medium',
    defaultLabel: 'Medium',
    defaultUrl: 'https://medium.com/@polarisigl',
    urlPlaceholder: 'https://medium.com/@your-handle',
    handlePlaceholder: '@polarisigl',
    brandColor: '#000000',
    hoverColor: '#1A8917',
    description: 'In-depth engineering whitepapers and technical articles.'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    defaultLabel: 'Telegram',
    defaultUrl: 'https://t.me/polarisigl',
    urlPlaceholder: 'https://t.me/your-channel',
    handlePlaceholder: '@polarisigl',
    brandColor: '#229ED9',
    hoverColor: '#1B86BA',
    description: 'Broadcast channel for vendor tenders, RFPs, and announcements.'
  },
  {
    id: 'custom',
    name: 'Custom Channel / Website',
    defaultLabel: 'External Channel',
    defaultUrl: 'https://polarisigl.com',
    urlPlaceholder: 'https://example.com/channel',
    handlePlaceholder: 'handle or URL',
    brandColor: '#059669',
    hoverColor: '#047857',
    description: 'Any external web profile, partner directory, or industry registry.'
  }
];

export const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: 'social-linkedin',
    platform: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/company/polarisigl/',
    handle: '@polarisigl',
    icon_type: 'preset',
    brand_color: '#0A66C2',
    hover_color: '#004182',
    is_active: true,
    display_order: 1,
    show_in_footer: true,
    show_in_contact: true,
    show_in_header: false,
    aria_label: 'PIGL on LinkedIn',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'social-youtube',
    platform: 'youtube',
    label: 'YouTube',
    url: 'https://www.youtube.com/@polarisigl',
    handle: '@polarisigl',
    icon_type: 'preset',
    brand_color: '#FF0000',
    hover_color: '#CC0000',
    is_active: true,
    display_order: 2,
    show_in_footer: true,
    show_in_contact: true,
    show_in_header: false,
    aria_label: 'PIGL Official YouTube Channel',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'social-whatsapp',
    platform: 'whatsapp',
    label: 'WhatsApp Business',
    url: 'https://wa.me/2348097081333',
    handle: '+234 809 7081 333',
    icon_type: 'preset',
    brand_color: '#25D366',
    hover_color: '#128C7E',
    is_active: true,
    display_order: 3,
    show_in_footer: true,
    show_in_contact: true,
    show_in_header: false,
    aria_label: 'Chat with PIGL on WhatsApp',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'social-twitter',
    platform: 'twitter',
    label: 'X (Twitter)',
    url: 'https://x.com/polarisigl',
    handle: '@polarisigl',
    icon_type: 'preset',
    brand_color: '#000000',
    hover_color: '#1DA1F2',
    is_active: false,
    display_order: 4,
    show_in_footer: true,
    show_in_contact: true,
    show_in_header: false,
    aria_label: 'PIGL on X (Twitter)',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'social-instagram',
    platform: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/polarisigl',
    handle: '@polarisigl',
    icon_type: 'preset',
    brand_color: '#E4405F',
    hover_color: '#C13584',
    is_active: false,
    display_order: 5,
    show_in_footer: true,
    show_in_contact: true,
    show_in_header: false,
    aria_label: 'PIGL on Instagram',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'social-facebook',
    platform: 'facebook',
    label: 'Facebook',
    url: 'https://www.facebook.com/polarisigl',
    handle: 'polarisigl',
    icon_type: 'preset',
    brand_color: '#1877F2',
    hover_color: '#0d65d9',
    is_active: false,
    display_order: 6,
    show_in_footer: true,
    show_in_contact: true,
    show_in_header: false,
    aria_label: 'PIGL on Facebook',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z'
  }
];
