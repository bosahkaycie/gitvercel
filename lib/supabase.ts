import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase
const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawUrl.startsWith('http://') ? rawUrl.replace('http://', 'https://') : rawUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    (supabaseUrl.startsWith('https://') || supabaseUrl.startsWith('http://')) &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder')
  );
};

// Singleton Supabase Client
let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return clientInstance;
};

export const supabase = getSupabaseClient();

// Media Upload Helper
export interface UploadResult {
  url: string;
  path: string;
  error: string | null;
}

// Convert file to Base64 data URL
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const uploadMediaFile = async (
  file: File,
  bucket: 'services' | 'blog' | 'sliders' | 'media' | 'videos' = 'media'
): Promise<UploadResult> => {
  const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov)$/i.test(file.name);
  // Validation: Size limit (50MB for video, 15MB for images/docs)
  const MAX_SIZE = isVideo ? 50 * 1024 * 1024 : 15 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { url: '', path: '', error: `File exceeds maximum ${isVideo ? '50MB' : '15MB'} limit.` };
  }

  // Validation: Format
  const validFormats = [
    'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf',
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
  ];
  if (!validFormats.includes(file.type) && !isVideo) {
    return { url: '', path: '', error: 'Invalid file format. Supported: JPG, PNG, WEBP, SVG, GIF, PDF, MP4, WebM, OGG, MOV.' };
  }

  // Sanitize filename
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const isVideoBucket = bucket === 'videos';
  const targetBucket = isVideoBucket ? 'media' : bucket;
  const filePath = isVideoBucket ? `videos/${timestamp}_${cleanName}` : `${timestamp}_${cleanName}`;

  const client = getSupabaseClient();

  // Tier 1: For large files (> 4MB) or if direct client is ready, upload directly to Supabase Storage
  // (Prevents Vercel 4.5MB serverless payload limit from failing on large video files)
  if (client && file.size > 4 * 1024 * 1024) {
    try {
      const { data, error } = await client.storage
        .from(targetBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data?.path) {
        const { data: publicUrlData } = client.storage
          .from(targetBucket)
          .getPublicUrl(data.path);

        if (publicUrlData?.publicUrl) {
          return { url: publicUrlData.publicUrl, path: data.path, error: null };
        }
      } else if (error) {
        console.warn('Direct upload warning:', error.message);
      }
    } catch (directErr) {
      console.warn('Direct Supabase storage upload notice:', directErr);
    }
  }

  // Tier 2: Try secure Serverless Upload Endpoint (/api/upload) for files under 4MB
  if (file.size <= 4 * 1024 * 1024) {
    try {
      const base64Data = await fileToBase64(file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: base64Data,
          filename: cleanName,
          contentType: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
          bucket: targetBucket
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.url) {
          return { url: data.url, path: data.path || filePath, error: null };
        }
      }
    } catch (apiErr) {
      console.warn('/api/upload attempt bypassed or failed, trying direct Supabase client:', apiErr);
    }
  }

  // Tier 3: Direct Supabase Client fallback for files <= 4MB if /api/upload failed
  if (client) {
    try {
      const { data, error } = await client.storage
        .from(targetBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data?.path) {
        const { data: publicUrlData } = client.storage
          .from(targetBucket)
          .getPublicUrl(data.path);

        if (publicUrlData?.publicUrl) {
          return { url: publicUrlData.publicUrl, path: data.path, error: null };
        }
      }
    } catch (directErr) {
      console.warn('Direct Supabase storage upload notice:', directErr);
    }
  }

  // Tier 3: Seamless Local Data URL Fallback
  // For video files, do NOT return base64 fallback to prevent breaking browser localStorage quota (5MB)
  if (isVideo) {
    return {
      url: '',
      path: '',
      error: 'Failed to upload video to cloud storage. Please check your network connection and try again.'
    };
  }

  try {
    const fallbackBase64 = await fileToBase64(file);
    return { url: fallbackBase64, path: filePath, error: null };
  } catch (fallbackErr: any) {
    const objectUrl = URL.createObjectURL(file);
    return { url: objectUrl, path: filePath, error: null };
  }
};
