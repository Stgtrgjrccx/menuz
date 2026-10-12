import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const distCombined = path.join(rootDir, 'dist-combined');
const distCustomer = path.join(rootDir, 'dist-customer');
const distOwner = path.join(rootDir, 'dist-owner');
const distHq = path.join(rootDir, 'dist-hq');

console.log('--- Assembling dist-combined for Production & GitHub Pages ---');

if (!fs.existsSync(distCustomer) || !fs.existsSync(distOwner) || !fs.existsSync(distHq)) {
  console.error('Error: Please build customer, owner, and hq first (run npm run build:all)');
  process.exit(1);
}

// 1. Ensure target directory structure exists
fs.mkdirSync(distCombined, { recursive: true });
fs.mkdirSync(path.join(distCombined, 'customer'), { recursive: true });
fs.mkdirSync(path.join(distCombined, 'owner'), { recursive: true });
fs.mkdirSync(path.join(distCombined, 'restaurant'), { recursive: true });
fs.mkdirSync(path.join(distCombined, 'hq'), { recursive: true });

// Helper to recursively copy directories
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 2. Copy Customer distribution to root AND /customer/
console.log('Copying dist-customer to root and /customer/ ...');
copyDirSync(distCustomer, distCombined);
copyDirSync(distCustomer, path.join(distCombined, 'customer'));

// 3. Copy Owner distribution to /owner/ AND /restaurant/
console.log('Copying dist-owner to /owner/ and /restaurant/ ...');
copyDirSync(distOwner, path.join(distCombined, 'owner'));
copyDirSync(distOwner, path.join(distCombined, 'restaurant'));

// 4. Copy HQ distribution to /hq/
console.log('Copying dist-hq to /hq/ ...');
copyDirSync(distHq, path.join(distCombined, 'hq'));

// 5. Ensure GitHub Pages SPA fallback 404.html
const indexHtml = path.join(distCombined, 'index.html');
const fourOhFour = path.join(distCombined, '404.html');
if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, fourOhFour);
}

// 6. Ensure .nojekyll is present
fs.writeFileSync(path.join(distCombined, '.nojekyll'), '');

console.log('✅ Successfully assembled dist-combined with isolated customer, restaurant, and hq portals!');
