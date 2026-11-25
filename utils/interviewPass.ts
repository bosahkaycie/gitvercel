/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Interview Venue QR Pass URL Encoder & Live Check-In API Client
 */

export interface InterviewPassPayload {
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  interviewDate?: string;
  interviewTime?: string;
}

export interface VenueCheckInRecord {
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  interviewDate?: string;
  interviewTime?: string;
  checkedInAt: string;
  checkedInTimeDisplay: string;
  checkedInDateDisplay: string;
  attendantNote?: string;
}

export interface ReceptionistGateCode {
  accessCode: string;
  generatedAt?: string | null;
  generatedDisplay?: string | null;
}

const PASS_BASE_URL = 'https://polarisigl.com/interview-pass';
const PROD_CHECKIN_API = 'https://polarisigl.com/api/interview-checkin.php';

function toBase64UrlUtf8(input: string): string {
  try {
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = typeof btoa === 'function'
      ? btoa(binary)
      : Buffer.from(bytes).toString('base64');
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

/**
 * Generates the mobile check-in URL encoded inside the email QR code.
 */
export function buildInterviewPassUrl(payload: InterviewPassPayload): string {
  const compact = {
    id: payload.applicationId || 'preview',
    n: payload.candidateName || 'Candidate',
    r: payload.jobTitle || 'Role',
    dt: payload.interviewDate || '',
    tm: payload.interviewTime || '',
  };
  const encoded = toBase64UrlUtf8(JSON.stringify(compact));
  return `${PASS_BASE_URL}?d=${encodeURIComponent(encoded)}`;
}

/**
 * Generates an email-client-safe HTTPS PNG QR code image URL (works in Gmail, Outlook, Apple Mail).
 */
export function buildInterviewQrImageUrl(payload: InterviewPassPayload, size = 150): string {
  const passUrl = buildInterviewPassUrl(payload);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&ecc=M&color=0f172a&bgcolor=ffffff&data=${encodeURIComponent(passUrl)}`;
}

function getCheckInApiUrl(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'polarisigl.com' || host === 'www.polarisigl.com') {
      return '/api/interview-checkin.php';
    }
  }
  return PROD_CHECKIN_API;
}

/**
 * Fetches all live venue check-ins from Hostinger.
 */
export async function fetchVenueCheckIns(): Promise<Record<string, VenueCheckInRecord>> {
  try {
    const res = await fetch(`${getCheckInApiUrl()}?_t=${Date.now()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return {};
    const data = await res.json();
    if (data && data.success && data.checkins && typeof data.checkins === 'object') {
      return data.checkins as Record<string, VenueCheckInRecord>;
    }
    return {};
  } catch (err) {
    console.warn('Could not fetch live venue check-ins:', err);
    return {};
  }
}

/**
 * Removes/resets a candidate's venue check-in status (admin action).
 */
export async function resetVenueCheckIn(applicationId: string): Promise<boolean> {
  try {
    const res = await fetch(`${getCheckInApiUrl()}?id=${encodeURIComponent(applicationId)}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data && data.success);
  } catch (err) {
    console.warn('Could not reset venue check-in:', err);
    return false;
  }
}

/**
 * Fetches the current active admin-generated Receptionist Access Code.
 */
export async function fetchReceptionistGateCode(): Promise<ReceptionistGateCode | null> {
  try {
    const res = await fetch(`${getCheckInApiUrl()}?action=get-code&_t=${Date.now()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.success && data.accessCode) {
      return {
        accessCode: data.accessCode,
        generatedAt: data.generatedAt || null,
        generatedDisplay: data.generatedDisplay || null,
      };
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch receptionist access code:', err);
    return null;
  }
}

/**
 * Generates and activates a new unique Receptionist Access Code (invalidating any old code).
 */
export async function generateNewReceptionistGateCode(): Promise<ReceptionistGateCode | null> {
  try {
    const res = await fetch(`${getCheckInApiUrl()}?action=generate-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.success && data.accessCode) {
      return {
        accessCode: data.accessCode,
        generatedAt: data.generatedAt || null,
        generatedDisplay: data.generatedDisplay || null,
      };
    }
    return null;
  } catch (err) {
    console.warn('Could not generate new receptionist access code:', err);
    return null;
  }
}
