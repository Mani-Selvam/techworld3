const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'attached_assets');
const outputDir = assetsDir;

const images = [
  {
    input: 'Techara 1_1758098717539.png',
    baseName: 'hero-sindhu',
    sizes: [400, 800, 1200]
  },
  {
    input: 'Ellipse 17_1758099227458.png',
    baseName: 'hero-circle',
    sizes: [400, 800, 1200]
  }
];

async function convertToWebP() {
  console.log('🔄 Converting PNG images to WebP...\n');

  for (const img of images) {
    const inputPath = path.join(assetsDir, img.input);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`❌ File not found: ${img.input}`);
      continue;
    }

    console.log(`📸 Processing: ${img.input}`);

    for (const width of img.sizes) {
      const outputPath = path.join(outputDir, `${img.baseName}-${width}w.webp`);
      
      try {
        await sharp(inputPath)
          .resize(width, width, {
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: 85, effort: 6 })
          .toFile(outputPath);
        
        const stats = fs.statSync(outputPath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`  ✅ Generated: ${img.baseName}-${width}w.webp (${sizeKB} KB)`);
      } catch (error) {
        console.error(`  ❌ Error generating ${width}w:`, error.message);
      }
    }

    const fullSizeOutput = path.join(outputDir, `${img.baseName}.webp`);
    try {
      await sharp(inputPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(fullSizeOutput);
      
      const stats = fs.statSync(fullSizeOutput);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`  ✅ Generated: ${img.baseName}.webp (${sizeKB} KB)`);
    } catch (error) {
      console.error(`  ❌ Error generating full size:`, error.message);
    }

    console.log('');
  }

  console.log('✨ Conversion complete!\n');
  
  console.log('📊 Size comparison:');
  for (const img of images) {
    const pngPath = path.join(assetsDir, img.input);
    const webpPath = path.join(outputDir, `${img.baseName}.webp`);
    
    if (fs.existsSync(pngPath) && fs.existsSync(webpPath)) {
      const pngSize = (fs.statSync(pngPath).size / 1024).toFixed(1);
      const webpSize = (fs.statSync(webpPath).size / 1024).toFixed(1);
      const savings = ((1 - webpSize / pngSize) * 100).toFixed(0);
      
      console.log(`  ${img.baseName}:`);
      console.log(`    PNG:  ${pngSize} KB`);
      console.log(`    WebP: ${webpSize} KB`);
      console.log(`    Saved: ${savings}%\n`);
    }
  }
}

convertToWebP().catch(console.error);
