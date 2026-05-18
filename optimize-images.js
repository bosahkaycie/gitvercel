import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, 'assets');

async function getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return null; // Skip non-image files
  }

  const stats = await fs.promises.stat(filePath);
  const oldSize = stats.size;

  if (oldSize === 0) return null;

  try {
    const tempPath = `${filePath}.tmp`;
    let pipeline = sharp(filePath);

    if (ext === '.png') {
      pipeline = pipeline.png({ 
        quality: 80, 
        compressionLevel: 9, 
        palette: true 
      });
    } else {
      pipeline = pipeline.jpeg({ 
        quality: 80, 
        progressive: true,
        mozjpeg: true
      });
    }

    await pipeline.toFile(tempPath);

    const tempStats = await fs.promises.stat(tempPath);
    const newSize = tempStats.size;

    if (newSize < oldSize) {
      // Overwrite the original file with optimized version
      await fs.promises.rename(tempPath, filePath);
      const savings = oldSize - newSize;
      const percent = ((savings / oldSize) * 100).toFixed(1);
      console.log(`✓ Optimized ${path.relative(__dirname, filePath)}: ${(oldSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024 / 1024).toFixed(2)}MB (-${percent}%)`);
      return { oldSize, newSize, savings };
    } else {
      // Temp file is larger or same size, clean it up
      await fs.promises.unlink(tempPath);
      // console.log(`- Skipped ${path.relative(__dirname, filePath)} (already optimal)`);
      return { oldSize, newSize: oldSize, savings: 0 };
    }
  } catch (error) {
    console.error(`✗ Error processing ${path.relative(__dirname, filePath)}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('----------------------------------------------------');
  console.log('PIGL Image Asset Optimization Engine starting...');
  console.log(`Target Directory: ${ASSETS_DIR}`);
  console.log('----------------------------------------------------');

  if (!fs.existsSync(ASSETS_DIR)) {
    console.error('Assets directory not found!');
    process.exit(1);
  }

  const allFiles = await getFiles(ASSETS_DIR);
  let totalOldSize = 0;
  let totalNewSize = 0;
  let optimizedCount = 0;

  for (const file of allFiles) {
    const result = await optimizeImage(file);
    if (result) {
      totalOldSize += result.oldSize;
      totalNewSize += result.newSize;
      if (result.savings > 0) {
        optimizedCount++;
      }
    }
  }

  const totalSavings = totalOldSize - totalNewSize;
  const totalPercent = totalOldSize > 0 ? ((totalSavings / totalOldSize) * 100).toFixed(1) : 0;

  console.log('----------------------------------------------------');
  console.log('Image Optimization Summary:');
  console.log(`Total Images Processed: ${allFiles.filter(f => ['.jpg', '.jpeg', '.png'].includes(path.extname(f).toLowerCase())).length}`);
  console.log(`Successfully Shrunk: ${optimizedCount} images`);
  console.log(`Original Size: ${(totalOldSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized Size: ${(totalNewSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total Space Saved: ${(totalSavings / 1024 / 1024).toFixed(2)} MB (-${totalPercent}%)`);
  console.log('----------------------------------------------------');
}

main().catch(console.error);
