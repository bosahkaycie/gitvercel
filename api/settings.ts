import { createClient } from '@supabase/supabase-js';

// Server-side secure Supabase site settings management handler
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

  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: 'Supabase credentials not configured on server.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  const STORAGE_PATH = 'config/site_settings.json';

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.storage.from('media').download(STORAGE_PATH);
      if (error) {
        // Return empty if not found yet
        return res.status(200).json({ success: true, settings: null });
      }
      const text = await data.text();
      const settings = JSON.parse(text);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).json({ success: true, settings });
    } catch (err: any) {
      return res.status(200).json({ success: true, settings: null, warning: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const newSettings = body.settings || body;

      const payload = {
        ...newSettings,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.storage.from('media').upload(STORAGE_PATH, JSON.stringify(payload), {
        contentType: 'application/json',
        upsert: true
      });

      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

      return res.status(200).json({ success: true, settings: payload });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
