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

import { compressImageForUpload } from '../utils/imageCompressor';

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

  // Step 1: Client-Side Instant Image Compression (converts oversized photos to WebP under 250KB)
  let uploadFile = file;
  if (!isVideo && file.type.startsWith('image/')) {
    try {
      uploadFile = await compressImageForUpload(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.84,
        mimeType: 'image/webp'
      });
    } catch (compErr) {
      console.warn('Image pre-compression notice:', compErr);
    }
  }

  // Sanitize filename
  const cleanName = uploadFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const isVideoBucket = bucket === 'videos';
  const targetBucket = isVideoBucket ? 'media' : bucket;
  const filePath = isVideoBucket ? `videos/${timestamp}_${cleanName}` : `${timestamp}_${cleanName}`;

  // Tier 1: Hostinger Native Media Upload API (/api/upload via multipart FormData)
  // This saves directly to polarisigl.com/assets/uploads/ with server WebP optimization
  try {
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('filename', cleanName);
    formData.append('bucket', targetBucket);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success && data.url) {
        return {
          url: data.url,
          path: data.relative_url || filePath,
          error: null
        };
      }
    }
  } catch (apiErr) {
    console.warn('/api/upload multipart attempt bypassed, attempting secondary fallback:', apiErr);
  }

  // Tier 1B: JSON Base64 fallback to /api/upload (if FormData was intercepted)
  if (uploadFile.size <= 8 * 1024 * 1024) {
    try {
      const base64Data = await fileToBase64(uploadFile);
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: base64Data,
          filename: cleanName,
          contentType: uploadFile.type || (isVideo ? 'video/mp4' : 'image/webp'),
          bucket: targetBucket
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.success && data.url) {
          return { url: data.url, path: data.relative_url || filePath, error: null };
        }
      }
    } catch (jsonErr) {
      console.warn('/api/upload json fallback bypassed:', jsonErr);
    }
  }

  // Tier 2: Direct Supabase Client Upload (if Supabase is active and unrestricted)
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.storage
        .from(targetBucket)
        .upload(filePath, uploadFile, {
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
        console.warn('Direct Supabase upload notice:', error.message);
      }
    } catch (directErr) {
      console.warn('Direct Supabase storage upload exception:', directErr);
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
    const fallbackBase64 = await fileToBase64(uploadFile);
    return { url: fallbackBase64, path: filePath, error: null };
  } catch (fallbackErr: any) {
    const objectUrl = URL.createObjectURL(uploadFile);
    return { url: objectUrl, path: filePath, error: null };
  }
};
