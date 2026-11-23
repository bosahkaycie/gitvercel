/**
 * Polaris Integrated & GeoSolutions (PIGL)
 * Client-Side Instant Image Compression Utility
 * Downscales oversized camera/phone photos and compresses to WebP/JPEG before network transmission
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: 'image/webp' | 'image/jpeg';
}

export const compressImageForUpload = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  // If not an image or is SVG/GIF (which may be animated or vector), preserve original
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  // If already a tiny image (under 120KB), don't re-compress
  if (file.size < 120 * 1024) {
    return file;
  }

  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.84,
    mimeType = 'image/webp'
  } = options;

  return new Promise<File>((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve(file); // Safe fallback
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => resolve(file); // Safe fallback
      img.onload = () => {
        try {
          let { width, height } = img;

          // Proportionally scale down if exceeding maximum bounds
          if (width > maxWidth || height > maxHeight) {
            if (width >= height) {
              height = Math.round((height / width) * maxWidth);
              width = maxWidth;
            } else {
              width = Math.round((width / height) * maxHeight);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve(file);
            return;
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // For PNGs with transparency converting to JPEG, fill white background
          if (mimeType === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob || blob.size >= file.size) {
                // If compressed version is somehow larger or failed, keep original
                resolve(file);
                return;
              }

              const cleanBaseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
              const newExt = mimeType === 'image/webp' ? '.webp' : '.jpg';
              const compressedFile = new File([blob], `${cleanBaseName}${newExt}`, {
                type: mimeType,
                lastModified: Date.now()
              });

              resolve(compressedFile);
            },
            mimeType,
            quality
          );
        } catch (canvasErr) {
          console.warn('Canvas image compression failed, using original file:', canvasErr);
          resolve(file);
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};
