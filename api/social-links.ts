import { createClient } from '@supabase/supabase-js';
import { DEFAULT_SOCIAL_LINKS } from '../constants/socialPlatforms';

// Server-side secure Supabase social links management handler
export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  if (supabaseUrl.startsWith('http://')) {
    supabaseUrl = supabaseUrl.replace('http://', 'https://');
  }
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: 'Supabase credentials not configured on server.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  const STORAGE_PATH = 'config/social_links.json';

  // 1. GET: Retrieve social links configuration
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.storage.from('media').download(STORAGE_PATH);
      if (error || !data) {
        return res.status(200).json({ success: true, social_links: DEFAULT_SOCIAL_LINKS });
      }

      const text = await data.text();
      const parsed = JSON.parse(text);
      const links = Array.isArray(parsed) ? parsed : (parsed.social_links || DEFAULT_SOCIAL_LINKS);

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).json({ success: true, social_links: links });
    } catch (err: any) {
      return res.status(200).json({ success: true, social_links: DEFAULT_SOCIAL_LINKS, warning: err.message });
    }
  }

  // 2. POST: Save updated social links configuration
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const links = body.social_links || (Array.isArray(body) ? body : DEFAULT_SOCIAL_LINKS);

      const payload = {
        social_links: links,
        updated_at: new Date().toISOString(),
        updated_by: body.updated_by || 'admin@polarisigl.com'
      };

      const { error } = await supabase.storage.from('media').upload(
        STORAGE_PATH,
        JSON.stringify(payload, null, 2),
        {
          contentType: 'application/json',
          upsert: true
        }
      );

      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

      return res.status(200).json({ success: true, social_links: links, updated_at: payload.updated_at });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
