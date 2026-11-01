import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const TARGET_DIRS = [
  path.join(rootDir, 'assets'),
  path.join(rootDir, 'public/assets')
];

const MAX_WIDTH = 1920;

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'videos' && entry.name !== '.git') {
        await processDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

      const stat = fs.statSync(fullPath);
      // Skip small icons or tiny badges (< 40KB) unless it's a known culprit
      if (stat.size < 40 * 1024) continue;

      const originalSize = stat.size;
      try {
        const metadata = await sharp(fullPath).metadata();
        const width = metadata.width || 0;
        const targetWidth = width > MAX_WIDTH ? MAX_WIDTH : undefined;

        let pipeline = sharp(fullPath);
        if (targetWidth) {
          pipeline = pipeline.resize({ width: targetWidth, withoutEnlargement: true });
        }

        const tempFile = `${fullPath}.opt_tmp`;

        if (ext === '.png') {
          // If PNG is photographic (no alpha or large dimensions), compress with palette and high compression
          if (metadata.hasAlpha) {
            pipeline = pipeline.png({ quality: 80, compressionLevel: 9, palette: true, effort: 8 });
          } else {
            pipeline = pipeline.png({ quality: 80, compressionLevel: 9, palette: true, effort: 8 });
          }
        } else if (ext === '.jpg' || ext === '.jpeg') {
          pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true, progressive: true });
        }

        await pipeline.toFile(tempFile);
        const newStat = fs.statSync(tempFile);

        if (newStat.size < originalSize) {
          fs.unlinkSync(fullPath);
          fs.renameSync(tempFile, fullPath);
          const savedPercent = (((originalSize - newStat.size) / originalSize) * 100).toFixed(1);
          console.log(`Optimized ${entry.name}: ${(originalSize / 1024).toFixed(0)}KB -> ${(newStat.size / 1024).toFixed(0)}KB (-${savedPercent}%)`);
        } else {
          fs.unlinkSync(tempFile);
        }
      } catch (err) {
        console.error(`Failed to optimize ${entry.name}:`, err.message);
      }
    }
  }
}

async function main() {
  console.log('--- Starting Deep Image Optimization ---');
  for (const dir of TARGET_DIRS) {
    console.log(`Scanning directory: ${dir}`);
    await processDirectory(dir);
  }
  console.log('--- Image Optimization Finished ---');
}

main();

