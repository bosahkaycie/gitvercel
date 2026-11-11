import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

/**
 * Packs multiple PNG buffers into a valid MS Windows ICO binary resource
 */
function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO format
  header.writeUInt16LE(count, 4); // number of images

  let offset = 6 + count * 16;
  const entries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2); // color palette (0 for no palette)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel (32-bit RGBA)
    entry.writeUInt32LE(item.buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data
    entries.push(entry);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map((p) => p.buffer)]);
}

async function generateAllAssets() {
  console.log('--- Generating PIGL Brand SEO & Favicon Assets ---');

  // 1. Prepare base master 512x512 favicon image from clean LOGO.png
  // Crop flame to bottom of PIGL (avoiding subtitle to maximize legibility at small sizes)
  const emblemPigl = await sharp(path.join(projectRoot, 'assets/LOGO.png'))
    .extract({ left: 30, top: 0, width: 960, height: 840 })
    .toBuffer();

  const whiteCircleBadge = Buffer.from(`
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" r="250" fill="#ffffff" />
    </svg>
  `);

  const scaledEmblem = await sharp(emblemPigl)
    .resize(420, 420, { fit: 'contain' })
    .toBuffer();

  const masterFaviconBuffer = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: whiteCircleBadge },
      { input: scaledEmblem, gravity: 'center' }
    ])
    .png()
    .toBuffer();

  // Save 512x512 master favicon and icon-512.png
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), masterFaviconBuffer);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), masterFaviconBuffer);
  console.log('✓ Created public/favicon.png (512x512) & icon-512.png');

  // 2. Multi-size Favicons for Google, Apple, and Android
  const b16 = await sharp(masterFaviconBuffer).resize(16, 16).png().toBuffer();
  const b32 = await sharp(masterFaviconBuffer).resize(32, 32).png().toBuffer();
  const b48 = await sharp(masterFaviconBuffer).resize(48, 48).png().toBuffer();
  const b96 = await sharp(masterFaviconBuffer).resize(96, 96).png().toBuffer();
  const b180 = await sharp(masterFaviconBuffer).resize(180, 180).png().toBuffer();
  const b192 = await sharp(masterFaviconBuffer).resize(192, 192).png().toBuffer();

  // Save discrete sizes
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), b48);
  fs.writeFileSync(path.join(publicDir, 'favicon-96x96.png'), b96);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), b180);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), b192);
  console.log('✓ Created favicon-48x48.png, favicon-96x96.png, apple-touch-icon.png, icon-192.png');

  // 3. Physical favicon.ico at root
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: b16 },
    { width: 32, height: 32, buffer: b32 },
    { width: 48, height: 48, buffer: b48 }
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Created physical public/favicon.ico with 16x16, 32x32, 48x48 layers');

  // 4. Scalable SVG Favicon
  const svgFavicon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="250" fill="#ffffff" stroke="#059669" stroke-width="6"/>
  <image href="data:image/png;base64,${masterFaviconBuffer.toString('base64')}" x="0" y="0" width="512" height="512"/>
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgFavicon);
  console.log('✓ Created public/favicon.svg');

  // 5. Web App Manifest (site.webmanifest)
  const webManifest = {
    name: 'Polaris Integrated & GeoSolutions Limited',
    short_name: 'PIGL',
    description: 'Engineering, GeoSolutions & 3D Reality Capture contractor in Port Harcourt, Nigeria.',
    start_url: '/',
    display: 'standalone',
    background_color: '#064E3B',
    theme_color: '#064E3B',
    icons: [
      {
        src: '/favicon-48x48.png',
        sizes: '48x48',
        type: 'image/png'
      },
      {
        src: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png'
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  };
  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(webManifest, null, 2));
  console.log('✓ Created public/site.webmanifest');

  // 6. 1200x630 Clean High-Resolution Official OG/SEO Image (Simple authentic image, no cluttered graphics)
  const width = 1200;
  const height = 630;

  const ogJpgBuffer = await sharp(path.join(projectRoot, 'assets/slider.jpeg'))
    .resize(width, height, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();

  const ogPngBuffer = await sharp(path.join(projectRoot, 'assets/slider.jpeg'))
    .resize(width, height, { fit: 'cover', position: 'center' })
    .png({ quality: 90 })
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'og-image.jpg'), ogJpgBuffer);
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogPngBuffer);
  console.log('✓ Created clean public/og-image.jpg (1200x630) & og-image.png (1200x630)');

  console.log('--- All SEO & Favicon Assets Generated Successfully ---');
}

generateAllAssets().catch((err) => {
  console.error('Failed to generate assets:', err);
  process.exit(1);
});
