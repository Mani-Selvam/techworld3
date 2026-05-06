import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ASSETS_DIR = join(__dirname, '..', 'attached_assets');
const OUTPUT_DIR = ASSETS_DIR;

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const QUALITY = 85;
const RESPONSIVE_WIDTHS = [400, 800, 1200];

async function optimizeImage(inputPath, outputPath, width = null) {
  try {
    let pipeline = sharp(inputPath);
    
    if (width) {
      pipeline = pipeline.resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    await pipeline
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(outputPath);
    
    console.log(`✅ Created: ${basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
  }
}

async function processImages() {
  console.log('🖼️  Starting image optimization...\n');
  
  const files = readdirSync(ASSETS_DIR);
  
  for (const file of files) {
    const filePath = join(ASSETS_DIR, file);
    const ext = extname(file).toLowerCase();
    
    if (!statSync(filePath).isFile() || !IMAGE_EXTENSIONS.includes(ext)) {
      continue;
    }
    
    const baseName = basename(file, ext);
    
    const baseOutput = join(OUTPUT_DIR, `${baseName}.webp`);
    await optimizeImage(filePath, baseOutput);
    
    for (const width of RESPONSIVE_WIDTHS) {
      const responsiveOutput = join(OUTPUT_DIR, `${baseName}-${width}w.webp`);
      await optimizeImage(filePath, responsiveOutput, width);
    }
  }
  
  console.log('\n✨ Image optimization complete!');
}

processImages().catch(console.error);
