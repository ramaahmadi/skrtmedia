const sharp = require('sharp');
const fs = require('fs');

// Read the SVG file
const svgBuffer = fs.readFileSync('./public/skrt-square.svg');

// Generate 192x192 icon
sharp(svgBuffer)
  .resize(192, 192)
  .png()
  .toFile('./public/icon-192.png')
  .then(() => console.log('icon-192.png created'))
  .catch(err => console.error('Error creating icon-192.png:', err));

// Generate 512x512 icon
sharp(svgBuffer)
  .resize(512, 512)
  .png()
  .toFile('./public/icon-512.png')
  .then(() => console.log('icon-512.png created'))
  .catch(err => console.error('Error creating icon-512.png:', err));
