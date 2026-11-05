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

  // 6. 1200x630 High-Resolution Branded OG/SEO Image
  const width = 1200;
  const height = 630;

  const bgPhoto = await sharp(path.join(projectRoot, 'assets/slider.jpeg'))
    .resize(width, height, { fit: 'cover' })
    .modulate({ brightness: 0.38, saturation: 0.85 })
    .toBuffer();

  const piglBadge = await sharp(masterFaviconBuffer)
    .resize(150, 150)
    .toBuffer();

  const iso9001 = await sharp(path.join(projectRoot, 'assets/Q-Mark (ISO 9001).png'))
    .resize(68, 68, { fit: 'contain' })
    .toBuffer();

  const iso45001 = await sharp(path.join(projectRoot, 'assets/Q-Mark (ISO 45001).png'))
    .resize(68, 68, { fit: 'contain' })
    .toBuffer();

  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#021f17" stop-opacity="0.95"/>
          <stop offset="45%" stop-color="#064E3B" stop-opacity="0.88"/>
          <stop offset="100%" stop-color="#01140e" stop-opacity="0.97"/>
        </linearGradient>

        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10B981" stop-opacity="0.7"/>
          <stop offset="50%" stop-color="#059669" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#34D399" stop-opacity="0.6"/>
        </linearGradient>
      </defs>

      <!-- Gradient wash over photo -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>

      <!-- Subtle Technical Grid Lines -->
      <g stroke="#10b981" stroke-width="1" stroke-opacity="0.07">
        <line x1="0" y1="105" x2="1200" y2="105" />
        <line x1="0" y1="210" x2="1200" y2="210" />
        <line x1="0" y1="315" x2="1200" y2="315" />
        <line x1="0" y1="420" x2="1200" y2="420" />
        <line x1="0" y1="525" x2="1200" y2="525" />
        <line x1="150" y1="0" x2="150" y2="630" />
        <line x1="350" y1="0" x2="350" y2="630" />
        <line x1="550" y1="0" x2="550" y2="630" />
        <line x1="750" y1="0" x2="750" y2="630" />
        <line x1="950" y1="0" x2="950" y2="630" />
        <line x1="1150" y1="0" x2="1150" y2="630" />
      </g>

      <!-- Outer decorative border frame -->
      <rect x="28" y="28" width="${width - 56}" height="${height - 56}" rx="20" fill="none" stroke="url(#borderGrad)" stroke-width="2"/>

      <!-- Top Category Tag -->
      <g transform="translate(245, 78)">
        <rect x="0" y="0" width="370" height="32" rx="16" fill="#064E3B" fill-opacity="0.95" stroke="#10B981" stroke-width="1.5"/>
        <circle cx="16" cy="16" r="4.5" fill="#34D399" />
        <text x="32" y="21" font-family="Plus Jakarta Sans, Inter, sans-serif" font-size="12" font-weight="700" fill="#E6FFFA" letter-spacing="1.5">NIGERIA &amp; GULF OF GUINEA OPERATIONS</text>
      </g>

      <!-- Main Headline: Polaris Integrated & GeoSolutions Limited -->
      <text x="245" y="156" font-family="Plus Jakarta Sans, Inter, sans-serif" font-size="40" font-weight="800" fill="#FFFFFF" letter-spacing="-0.5">
        Polaris Integrated &amp; GeoSolutions Limited
      </text>

      <!-- Brand Callout & Sub-headline -->
      <g transform="translate(245, 185)">
        <text x="0" y="24" font-family="Plus Jakarta Sans, Inter, sans-serif" font-size="24" font-weight="800" fill="#34D399" letter-spacing="0.5">
          PIGL
        </text>
        <text x="75" y="24" font-family="Plus Jakarta Sans, Inter, sans-serif" font-size="24" font-weight="500" fill="#A7F3D0">
          • Engineering, GeoSolutions &amp; 3D Reality Capture
        </text>
      </g>

      <!-- Value Proposition / Capabilities Summary -->
      <text x="70" y="280" font-family="Inter, sans-serif" font-size="19" font-weight="400" fill="#D1FAE5" opacity="0.95">
        Multidisciplinary indigenous contractor delivering high-fidelity 3D Laser Scanning, Digital Twins,
      </text>
      <text x="70" y="312" font-family="Inter, sans-serif" font-size="19" font-weight="400" fill="#D1FAE5" opacity="0.95">
        Metocean observations, geotechnical investigations, and energy infrastructure construction.
      </text>

      <!-- 4 Approved Business Divisions Pills -->
      <g transform="translate(70, 355)">
        <!-- GES -->
        <g transform="translate(0, 0)">
          <rect width="250" height="54" rx="12" fill="#042F24" fill-opacity="0.85" stroke="#059669" stroke-width="1.5"/>
          <text x="18" y="24" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="800" fill="#34D399">GES DIVISION</text>
          <text x="18" y="42" font-family="Inter, sans-serif" font-size="12" font-weight="500" fill="#FFFFFF">GeoSolutions &amp; Engineering</text>
        </g>
        <!-- MMS -->
        <g transform="translate(268, 0)">
          <rect width="250" height="54" rx="12" fill="#042F24" fill-opacity="0.85" stroke="#059669" stroke-width="1.5"/>
          <text x="18" y="24" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="800" fill="#34D399">MMS DIVISION</text>
          <text x="18" y="42" font-family="Inter, sans-serif" font-size="12" font-weight="500" fill="#FFFFFF">Metocean &amp; Marine Solutions</text>
        </g>
        <!-- ICS -->
        <g transform="translate(536, 0)">
          <rect width="250" height="54" rx="12" fill="#042F24" fill-opacity="0.85" stroke="#059669" stroke-width="1.5"/>
          <text x="18" y="24" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="800" fill="#34D399">ICS DIVISION</text>
          <text x="18" y="42" font-family="Inter, sans-serif" font-size="12" font-weight="500" fill="#FFFFFF">Integrated Construction</text>
        </g>
        <!-- IS -->
        <g transform="translate(804, 0)">
          <rect width="256" height="54" rx="12" fill="#042F24" fill-opacity="0.85" stroke="#059669" stroke-width="1.5"/>
          <text x="18" y="24" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="800" fill="#34D399">IS DIVISION</text>
          <text x="18" y="42" font-family="Inter, sans-serif" font-size="12" font-weight="500" fill="#FFFFFF">Industrial Solutions</text>
        </g>
      </g>

      <!-- Bottom Bar Divider -->
      <line x1="70" y1="448" x2="1130" y2="448" stroke="#059669" stroke-width="1.5" stroke-opacity="0.35"/>

      <!-- Footer Credentials / Website -->
      <g transform="translate(70, 470)">
        <text x="0" y="28" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#A7F3D0" letter-spacing="1">
          HEADQUARTERS: PORT HARCOURT, RIVERS STATE, NIGERIA
        </text>
        <text x="0" y="58" font-family="Inter, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF" letter-spacing="0.5">
          polarisigl.com
        </text>
      </g>

      <!-- Right: ISO Certifications Text -->
      <g transform="translate(760, 480)">
        <text x="180" y="16" text-anchor="end" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="700" fill="#34D399" letter-spacing="1.2">CERTIFIED STANDARDS</text>
        <text x="180" y="34" text-anchor="end" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#FFFFFF">ISO 9001:2015</text>
        <text x="180" y="50" text-anchor="end" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#FFFFFF">ISO 45001:2018</text>
      </g>
    </svg>
  `);

  const ogJpgBuffer = await sharp(bgPhoto)
    .composite([
      { input: svgOverlay },
      { input: piglBadge, left: 70, top: 75 },
      { input: iso9001, left: 965, top: 480 },
      { input: iso45001, left: 1045, top: 480 }
    ])
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();

  const ogPngBuffer = await sharp(bgPhoto)
    .composite([
      { input: svgOverlay },
      { input: piglBadge, left: 70, top: 75 },
      { input: iso9001, left: 965, top: 480 },
      { input: iso45001, left: 1045, top: 480 }
    ])
    .png({ quality: 90 })
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'og-image.jpg'), ogJpgBuffer);
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogPngBuffer);
  console.log('✓ Created public/og-image.jpg (1200x630) & og-image.png (1200x630)');

  console.log('--- All SEO & Favicon Assets Generated Successfully ---');
}

generateAllAssets().catch((err) => {
  console.error('Failed to generate assets:', err);
  process.exit(1);
});
