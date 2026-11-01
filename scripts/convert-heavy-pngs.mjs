import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function convertManagement() {
  const dirs = [
    path.join(rootDir, 'assets/management'),
    path.join(rootDir, 'public/assets/management')
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
    for (const f of files) {
      const src = path.join(dir, f);
      const name = path.basename(f, '.png');
      const webpDst = path.join(dir, `${name}.webp`);

      // Create WebP (800x800 max since headshots are never larger than 300px on screen)
      await sharp(src)
        .resize({ width: 800, height: 800, fit: 'cover', withoutEnlargement: true })
        .webp({ quality: 84 })
        .toFile(webpDst);
      
      const webpSize = fs.statSync(webpDst).size;
      console.log(`Created ${webpDst}: ${(webpSize / 1024).toFixed(1)} KB`);

      // Also crush the PNG in-place so fallback is tiny
      const crushedPng = path.join(dir, `${name}.tmp.png`);
      await sharp(src)
        .resize({ width: 800, height: 800, fit: 'cover', withoutEnlargement: true })
        .png({ quality: 75, compressionLevel: 9, palette: true, colours: 256 })
        .toFile(crushedPng);
      
      fs.unlinkSync(src);
      fs.renameSync(crushedPng, src);
      console.log(`Crushed ${src}: ${(fs.statSync(src).size / 1024).toFixed(1)} KB`);
    }
  }
}

async function convertHeavyFiles() {
  const targets = [
    { name: 'road.png', webp: 'road.webp', maxW: 1600 },
    { name: 'GREAT HALL.png', webp: 'GREAT_HALL.webp', maxW: 1600 },
    { name: 'cpt.png', webp: 'cpt.webp', maxW: 1400 },
    { name: 'newpipeline.png', webp: 'newpipeline.webp', maxW: 1600 },
    { name: 'new capture.png', webp: 'new_capture.webp', maxW: 1600 },
    { name: 'new drill.png', webp: 'new_drill.webp', maxW: 1600 },
    { name: 'new ocean.png', webp: 'new_ocean.webp', maxW: 1600 },
    { name: 'new geotech.png', webp: 'new_geotech.webp', maxW: 1600 },
    { name: 'new road.png', webp: 'new_road.webp', maxW: 1600 },
    { name: 'new akk.png', webp: 'new_akk.webp', maxW: 1600 },
    { name: 'new barge.png', webp: 'new_barge.webp', maxW: 1600 },
    { name: 'seismic_survey.png', webp: 'seismic_survey.webp', maxW: 1600 },
    { name: 'geomatics_survey.png', webp: 'geomatics_survey.webp', maxW: 1600 },
    { name: 'digitwin.png', webp: 'digitwin.webp', maxW: 1600 },
  ];

  const baseDirs = [
    path.join(rootDir, 'assets'),
    path.join(rootDir, 'public/assets')
  ];

  for (const dir of baseDirs) {
    for (const t of targets) {
      const src = path.join(dir, t.name);
      if (!fs.existsSync(src)) continue;

      const webpDst = path.join(dir, t.webp);
      await sharp(src)
        .resize({ width: t.maxW, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(webpDst);
      console.log(`Created ${t.webp}: ${(fs.statSync(webpDst).size / 1024).toFixed(1)} KB`);

      // Crush PNG in-place
      const crushedPng = `${src}.crushed.png`;
      await sharp(src)
        .resize({ width: t.maxW, withoutEnlargement: true })
        .png({ quality: 75, compressionLevel: 9, palette: true, colours: 256 })
        .toFile(crushedPng);
      fs.unlinkSync(src);
      fs.renameSync(crushedPng, src);
      console.log(`Crushed ${t.name}: ${(fs.statSync(src).size / 1024).toFixed(1)} KB`);
    }
  }
}

async function main() {
  console.log('--- Converting Heavy PNGs to WebP and Crushing Fallbacks ---');
  await convertManagement();
  await convertHeavyFiles();
  console.log('--- Done converting heavy PNGs ---');
}

main().catch(err => {
  console.error('Conversion failed:', err);
});

