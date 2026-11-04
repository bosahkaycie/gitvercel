import { createClient } from '@supabase/supabase-js';

// Server-side secure Supabase slider management handler
export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
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

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('sliders')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
      return res.status(200).json({ success: true, sliders: data });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { action = 'save', slider, id } = body;

      if (action === 'delete') {
        const targetId = id || slider?.id;
        if (!targetId) {
          return res.status(400).json({ success: false, error: 'Missing slider id to delete.' });
        }
        const { error: delErr } = await supabase.from('sliders').delete().eq('id', targetId);
        if (delErr) {
          return res.status(500).json({ success: false, error: delErr.message });
        }
        return res.status(200).json({ success: true, message: 'Slider deleted successfully' });
      }

      if (!slider || !slider.title) {
        return res.status(400).json({ success: false, error: 'Missing slider data.' });
      }

      // Upsert slider
      const cleanSlider = {
        ...slider,
        desktop_image: slider.desktop_image !== undefined && slider.desktop_image !== null ? String(slider.desktop_image).trim() : '',
        mobile_image: slider.mobile_image !== undefined && slider.mobile_image !== null ? String(slider.mobile_image).trim() : '',
        video_url: slider.video_url ? String(slider.video_url).trim() : null
      };

      const { data: saved, error: saveErr } = await supabase
        .from('sliders')
        .upsert(cleanSlider)
        .select()
        .single();

      if (saveErr) {
        return res.status(500).json({ success: false, error: saveErr.message });
      }

      return res.status(200).json({ success: true, slider: saved });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
