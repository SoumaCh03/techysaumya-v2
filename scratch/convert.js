const sharp = require('sharp');
const path = require('path');

const svgPath = path.join(__dirname, '../public/favicon.svg');
const publicDir = path.join(__dirname, '../public');

const sizes = [32, 48, 96, 192, 512];

async function convert() {
  for (const size of sizes) {
    const dest = path.join(publicDir, `favicon-${size}.png`);
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(dest);
    console.log(`Generated favicon-${size}.png`);
  }
}

convert().catch(console.error);
