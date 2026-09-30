import { createClient } from '@supabase/supabase-js';

// Server-side secure Supabase media upload handler
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

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ready',
      service: 'Polaris Integrated & GeoSolutions Media Upload API',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { fileBase64, filename, contentType = 'image/jpeg', bucket = 'media' } = body;

    if (!fileBase64) {
      return res.status(400).json({ success: false, error: 'Missing fileBase64 data in payload.' });
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

    // Strip data URL prefix if present (e.g. data:image/png;base64,...)
    const base64Data = fileBase64.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Clean filename and add timestamp
    const cleanName = (filename || 'media_asset').replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const isVideoBucket = bucket === 'videos';
    const filePath = isVideoBucket ? `videos/${timestamp}_${cleanName}` : `${timestamp}_${cleanName}`;

    // Target bucket check: 'videos' is mapped to existing 'media' bucket
    const validBuckets = ['blog', 'services', 'sliders', 'media', 'resumes', 'vendor-documents'];
    const targetBucket = isVideoBucket ? 'media' : (validBuckets.includes(bucket) ? bucket : 'media');

    const { data, error } = await supabase.storage
      .from(targetBucket)
      .upload(filePath, buffer, {
        contentType,
        cacheControl: '31536000',
        upsert: true
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to upload to Supabase storage.'
      });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(targetBucket)
      .getPublicUrl(filePath);

    return res.status(200).json({
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path,
      bucket: targetBucket,
      size: buffer.length
    });

  } catch (err: any) {
    console.error('Error in /api/upload handler:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error during media upload.'
    });
  }
}
