import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.resolve(__dirname, '../assets');
const MAX_WIDTH = 2000;
const QUALITY = 80;

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

async function optimizeImage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (!supportedExtensions.includes(ext)) return;

    const stats = fs.statSync(filePath);
    const originalSize = (stats.size / (1024 * 1024)).toFixed(2);

    try {
        const image = sharp(filePath);
        const metadata = await image.metadata();

        let pipeline = image;

        // Resize if too wide
        if (metadata.width > MAX_WIDTH) {
            pipeline = pipeline.resize(MAX_WIDTH);
        }

        // Apply compression based on format
        if (ext === '.jpg' || ext === '.jpeg') {
            pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
        } else if (ext === '.png') {
            pipeline = pipeline.png({ quality: QUALITY, palette: true });
        } else if (ext === '.webp') {
            pipeline = pipeline.webp({ quality: QUALITY });
        }

        // Create temporary file to avoid corruption during overwrite
        const tempPath = `${filePath}.tmp`;
        await pipeline.toFile(tempPath);

        // Replace original with optimized
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);

        const newStats = fs.statSync(filePath);
        const newSize = (newStats.size / (1024 * 1024)).toFixed(2);
        const reduction = (((stats.size - newStats.size) / stats.size) * 100).toFixed(1);

        console.log(`✅ Optimized: ${path.relative(ASSETS_DIR, filePath)}`);
        console.log(`   ${originalSize}MB -> ${newSize}MB (-${reduction}%)`);
    } catch (error) {
        console.error(`❌ Error optimizing ${filePath}:`, error.message);
    }
}

async function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            await walkDir(fullPath);
        } else {
            await optimizeImage(fullPath);
        }
    }
}

console.log('🚀 Starting image optimization...');
console.log(`📂 Directory: ${ASSETS_DIR}`);
console.log(`📏 Max Width: ${MAX_WIDTH}px`);
console.log(`✨ Quality: ${QUALITY}%`);
console.log('-----------------------------------');

walkDir(ASSETS_DIR).then(() => {
    console.log('-----------------------------------');
    console.log('✨ Optimization complete!');
});
