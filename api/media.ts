import { createClient } from '@supabase/supabase-js';

function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function cleanDisplayFileName(rawName: string): string {
  // Strip leading timestamp like 1793780458365_
  return rawName.replace(/^\d{10,14}_/, '');
}

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

  // GET: List files in bucket
  if (req.method === 'GET') {
    try {
      const urlObj = new URL(req.url, 'http://localhost');
      const requestedBucket = urlObj.searchParams.get('bucket') || 'all';

      const bucketsToList = requestedBucket === 'all'
        ? ['videos', 'services', 'blog', 'sliders', 'media']
        : [requestedBucket];

      const allFiles: any[] = [];

      for (const b of bucketsToList) {
        if (b === 'videos') {
          // 1. Check media/videos/
          try {
            const { data: vidsInSubfolder } = await supabase.storage.from('media').list('videos', {
              limit: 100,
              sortBy: { column: 'created_at', order: 'desc' }
            });

            if (vidsInSubfolder && Array.isArray(vidsInSubfolder)) {
              for (const f of vidsInSubfolder) {
                if (f.name && f.name !== '.emptyFolderPlaceholder') {
                  const filePath = `videos/${f.name}`;
                  const { data: pubData } = supabase.storage.from('media').getPublicUrl(filePath);
                  allFiles.push({
                    id: `media-videos-${f.name}`,
                    rawName: f.name,
                    name: cleanDisplayFileName(f.name),
                    path: filePath,
                    storageBucket: 'media',
                    bucket: 'videos',
                    url: pubData.publicUrl,
                    size: formatBytes(f.metadata?.size || 0),
                    bytes: f.metadata?.size || 0,
                    type: f.metadata?.mimetype || 'video/mp4',
                    updated_at: f.updated_at || f.created_at || new Date().toISOString(),
                    isCloudStorage: true
                  });
                }
              }
            }
          } catch (e) {
            console.warn('Could not list media/videos:', e);
          }

          // 2. Check root of media for video files
          try {
            const { data: rootMedia } = await supabase.storage.from('media').list('', {
              limit: 100,
              sortBy: { column: 'created_at', order: 'desc' }
            });

            if (rootMedia && Array.isArray(rootMedia)) {
              for (const f of rootMedia) {
                if (f.name && /\.(mp4|webm|ogg|mov)$/i.test(f.name)) {
                  const { data: pubData } = supabase.storage.from('media').getPublicUrl(f.name);
                  // Avoid duplicate if already tracked
                  if (!allFiles.some(item => item.rawName === f.name)) {
                    allFiles.push({
                      id: `media-root-${f.name}`,
                      rawName: f.name,
                      name: cleanDisplayFileName(f.name),
                      path: f.name,
                      storageBucket: 'media',
                      bucket: 'videos',
                      url: pubData.publicUrl,
                      size: formatBytes(f.metadata?.size || 0),
                      bytes: f.metadata?.size || 0,
                      type: f.metadata?.mimetype || 'video/mp4',
                      updated_at: f.updated_at || f.created_at || new Date().toISOString(),
                      isCloudStorage: true
                    });
                  }
                }
              }
            }
          } catch (e) {
            console.warn('Could not list root media:', e);
          }
        } else {
          // Standard buckets: services, blog, sliders, media
          try {
            const { data: files } = await supabase.storage.from(b).list('', {
              limit: 100,
              sortBy: { column: 'created_at', order: 'desc' }
            });

            if (files && Array.isArray(files)) {
              for (const f of files) {
                if (f.name && f.name !== '.emptyFolderPlaceholder' && f.name !== 'videos') {
                  const { data: pubData } = supabase.storage.from(b).getPublicUrl(f.name);
                  allFiles.push({
                    id: `${b}-${f.name}`,
                    rawName: f.name,
                    name: cleanDisplayFileName(f.name),
                    path: f.name,
                    storageBucket: b,
                    bucket: b,
                    url: pubData.publicUrl,
                    size: formatBytes(f.metadata?.size || 0),
                    bytes: f.metadata?.size || 0,
                    type: f.metadata?.mimetype || 'image/jpeg',
                    updated_at: f.updated_at || f.created_at || new Date().toISOString(),
                    isCloudStorage: true
                  });
                }
              }
            }
          } catch (e) {
            console.warn(`Could not list bucket ${b}:`, e);
          }
        }
      }

      return res.status(200).json({ success: true, files: allFiles });
    } catch (err: any) {
      console.error('Error listing media:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST: Actions like delete
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { action = 'delete', storageBucket = 'media', bucket, path } = body;

      if (action === 'delete') {
        if (!path) {
          return res.status(400).json({ success: false, error: 'Missing path to delete' });
        }

        const effectiveBucket = storageBucket || (bucket === 'videos' ? 'media' : bucket) || 'media';
        const { error: delErr } = await supabase.storage.from(effectiveBucket).remove([path]);

        if (delErr) {
          console.error('Supabase storage delete error:', delErr);
          return res.status(500).json({ success: false, error: delErr.message });
        }

        return res.status(200).json({
          success: true,
          message: `File "${path}" permanently deleted from ${effectiveBucket} storage.`
        });
      }

      return res.status(400).json({ success: false, error: `Unsupported action: ${action}` });
    } catch (err: any) {
      console.error('Error handling media action:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
