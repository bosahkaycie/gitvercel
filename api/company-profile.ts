import { createClient } from '@supabase/supabase-js';

// Server-side secure Supabase Company Profile document management handler
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

  const STORAGE_PATH = 'config/company_profile.json';

  const DEFAULT_DOCUMENT = {
    id: 'official-company-profile',
    title: 'Polaris Integrated & GeoSolutions Limited - Official Corporate Profile',
    filename: 'PIGL_Company_Profile.pdf',
    file_url: 'https://jbldpfvceacfonkzzhig.supabase.co/storage/v1/object/public/documents/company-profile/PIGL_Company_Profile.pdf',
    storage_path: 'company-profile/PIGL_Company_Profile.pdf',
    storage_bucket: 'documents',
    file_type: 'application/pdf',
    file_size: 11488310,
    formatted_size: '10.95 MB',
    is_published: true,
    version: '2026.1',
    description: 'Comprehensive corporate overview of PIGL engineering divisions, offshore assets, QA/QC certifications, and track record across Nigeria & West Africa.',
    cover_image_url: '/assets/PIGL COMPANY PROFILE.jpg',
    upload_date: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    updated_by: 'admin@polarisigl.com'
  };

  // 1. GET: Retrieve active company profile document configuration
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.storage.from('media').download(STORAGE_PATH);
      if (error || !data) {
        return res.status(200).json({ success: true, document: DEFAULT_DOCUMENT });
      }
      const text = await data.text();
      const document = JSON.parse(text);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).json({ success: true, document });
    } catch (err: any) {
      return res.status(200).json({ success: true, document: DEFAULT_DOCUMENT, warning: err.message });
    }
  }

  // 2. POST: Handle save, upload, publish, unpublish, and remove actions
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const action = body.action || 'save';
      const adminEmail = body.adminEmail || 'admin@polarisigl.com';

      // Load existing document state
      let currentDoc = { ...DEFAULT_DOCUMENT };
      try {
        const { data: existingData } = await supabase.storage.from('media').download(STORAGE_PATH);
        if (existingData) {
          currentDoc = JSON.parse(await existingData.text());
        }
      } catch {}

      // Action: Upload new PDF document
      if (action === 'upload') {
        const { fileBase64, filename, title, version, description, publishNow = true } = body;
        if (!fileBase64) {
          return res.status(400).json({ success: false, error: 'Missing fileBase64 data in upload payload.' });
        }

        // Validate PDF type
        if (!fileBase64.includes('application/pdf') && !filename?.toLowerCase().endsWith('.pdf')) {
          return res.status(400).json({ success: false, error: 'Invalid file format. Only PDF documents are permitted for the Company Profile.' });
        }

        const base64Data = fileBase64.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // File size check (max 50MB)
        const maxBytes = 50 * 1024 * 1024;
        if (buffer.length > maxBytes) {
          return res.status(400).json({ success: false, error: 'File size exceeds maximum permitted limit of 50MB.' });
        }

        const cleanName = (filename || 'PIGL_Company_Profile.pdf').replace(/[^a-zA-Z0-9.-]/g, '_');
        const timestamp = Date.now();
        const storagePath = `company-profile/${timestamp}_${cleanName}`;

        // Upload to Supabase documents bucket
        const { data: uploadResult, error: uploadErr } = await supabase.storage
          .from('documents')
          .upload(storagePath, buffer, {
            contentType: 'application/pdf',
            cacheControl: '3600',
            upsert: true
          });

        if (uploadErr) {
          console.error('Supabase upload error:', uploadErr);
          return res.status(500).json({ success: false, error: uploadErr.message });
        }

        const { data: pubUrl } = supabase.storage.from('documents').getPublicUrl(storagePath);
        const fileUrl = pubUrl.publicUrl;
        const formattedSize = (buffer.length / (1024 * 1024)).toFixed(2) + ' MB';

        // Register in media_assets table for audit tracking
        try {
          await supabase.from('media_assets').insert({
            filename: cleanName,
            file_path: `documents/${storagePath}`,
            bucket_id: 'documents',
            file_type: 'application/pdf',
            file_size: buffer.length,
            alt_text: title || 'Official PIGL Corporate Profile Document'
          });
        } catch (dbErr) {
          console.warn('media_assets insertion note:', dbErr);
        }

        const updatedDoc = {
          ...currentDoc,
          id: 'official-company-profile',
          title: title || currentDoc.title,
          filename: cleanName,
          file_url: fileUrl,
          storage_path: storagePath,
          storage_bucket: 'documents',
          file_type: 'application/pdf',
          file_size: buffer.length,
          formatted_size: formattedSize,
          is_published: publishNow,
          version: version || currentDoc.version || '2026.1',
          description: description || currentDoc.description,
          upload_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          updated_by: adminEmail
        };

        const { error: saveErr } = await supabase.storage.from('media').upload(STORAGE_PATH, JSON.stringify(updatedDoc), {
          contentType: 'application/json',
          upsert: true
        });

        if (saveErr) {
          return res.status(500).json({ success: false, error: saveErr.message });
        }

        return res.status(200).json({ success: true, document: updatedDoc });
      }

      // Action: Publish
      if (action === 'publish') {
        const updatedDoc = {
          ...currentDoc,
          is_published: true,
          updated_at: new Date().toISOString(),
          updated_by: adminEmail
        };

        await supabase.storage.from('media').upload(STORAGE_PATH, JSON.stringify(updatedDoc), {
          contentType: 'application/json',
          upsert: true
        });

        return res.status(200).json({ success: true, document: updatedDoc });
      }

      // Action: Unpublish
      if (action === 'unpublish') {
        const updatedDoc = {
          ...currentDoc,
          is_published: false,
          updated_at: new Date().toISOString(),
          updated_by: adminEmail
        };

        await supabase.storage.from('media').upload(STORAGE_PATH, JSON.stringify(updatedDoc), {
          contentType: 'application/json',
          upsert: true
        });

        return res.status(200).json({ success: true, document: updatedDoc });
      }

      // Action: Remove
      if (action === 'remove') {
        const updatedDoc = {
          ...currentDoc,
          is_published: false,
          file_url: '',
          filename: '',
          file_size: 0,
          formatted_size: '0 MB',
          updated_at: new Date().toISOString(),
          updated_by: adminEmail
        };

        await supabase.storage.from('media').upload(STORAGE_PATH, JSON.stringify(updatedDoc), {
          contentType: 'application/json',
          upsert: true
        });

        return res.status(200).json({ success: true, document: updatedDoc });
      }

      // Action: Save metadata
      if (action === 'save') {
        const updatedDoc = {
          ...currentDoc,
          ...(body.document || {}),
          updated_at: new Date().toISOString(),
          updated_by: adminEmail
        };

        await supabase.storage.from('media').upload(STORAGE_PATH, JSON.stringify(updatedDoc), {
          contentType: 'application/json',
          upsert: true
        });

        return res.status(200).json({ success: true, document: updatedDoc });
      }

      return res.status(400).json({ success: false, error: `Unknown action: ${action}` });
    } catch (err: any) {
      console.error('Error in /api/company-profile handler:', err);
      return res.status(500).json({ success: false, error: err.message || 'Internal server error.' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
