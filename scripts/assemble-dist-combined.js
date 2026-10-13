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

if (!fs.existsSync(distCustomer) || !fs.existsSync(distHq)) {
  console.error('Error: Please build customer and hq first (run npm run build:all)');
  process.exit(1);
}

// 1. Ensure target directory structure exists cleanly
if (fs.existsSync(distCombined)) {
  fs.rmSync(distCombined, { recursive: true, force: true });
}
fs.mkdirSync(distCombined, { recursive: true });
fs.mkdirSync(path.join(distCombined, 'customer'), { recursive: true });
fs.mkdirSync(path.join(distCombined, 'hq'), { recursive: true });
if (fs.existsSync(distOwner)) {
  fs.mkdirSync(path.join(distCombined, 'owner'), { recursive: true });
  fs.mkdirSync(path.join(distCombined, 'restaurant'), { recursive: true });
}

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

// 2. Application 1: Copy Master Admin HQ to root and /hq/
console.log('Deploying Master Admin HQ to root and /hq/ ...');
copyDirSync(distHq, distCombined);
copyDirSync(distHq, path.join(distCombined, 'hq'));

// Set static title for HQ
for (const hqHtmlPath of [path.join(distCombined, 'index.html'), path.join(distCombined, 'hq', 'index.html')]) {
  if (fs.existsSync(hqHtmlPath)) {
    let content = fs.readFileSync(hqHtmlPath, 'utf8');
    content = content.replace(/<title>.*?<\/title>/, '<title>Menuz HQ</title>');
    fs.writeFileSync(hqHtmlPath, content);
  }
}

// 3. Application 2: Copy Customer application to /customer/
console.log('Deploying Customer application to /customer/ ...');
copyDirSync(distCustomer, path.join(distCombined, 'customer'));

// Ensure customer entry point is index.html inside /customer/
const customerSubHtml = path.join(distCombined, 'customer', 'customer.html');
const customerSubIndex = path.join(distCombined, 'customer', 'index.html');
if (fs.existsSync(customerSubHtml)) {
  fs.copyFileSync(customerSubHtml, customerSubIndex);
}
for (const custHtmlPath of [customerSubHtml, customerSubIndex]) {
  if (fs.existsSync(custHtmlPath)) {
    let content = fs.readFileSync(custHtmlPath, 'utf8');
    content = content.replace(/<title>.*?<\/title>/, '<title>Menuz Customer</title>');
    fs.writeFileSync(custHtmlPath, content);
  }
}

// 4. Copy Owner distribution if present
if (fs.existsSync(distOwner)) {
  console.log('Deploying Owner distribution to /owner/ and /restaurant/ ...');
  copyDirSync(distOwner, path.join(distCombined, 'owner'));
  copyDirSync(distOwner, path.join(distCombined, 'restaurant'));
  for (const restHtmlPath of [path.join(distCombined, 'owner', 'index.html'), path.join(distCombined, 'restaurant', 'index.html')]) {
    if (fs.existsSync(restHtmlPath)) {
      let content = fs.readFileSync(restHtmlPath, 'utf8');
      content = content.replace(/<title>.*?<\/title>/, '<title>Menuz Restaurant</title>');
      fs.writeFileSync(restHtmlPath, content);
    }
  }
}

// 5. Ensure dedicated PWA manifests and Service Workers are correctly placed
const publicDir = path.join(rootDir, 'public');
const manifestCustomer = path.join(publicDir, 'manifest-customer.json');
const manifestOwner = path.join(publicDir, 'manifest-owner.json');
const manifestHq = path.join(publicDir, 'manifest-hq.json');

if (fs.existsSync(manifestHq)) {
  fs.copyFileSync(manifestHq, path.join(distCombined, 'manifest.json'));
  fs.copyFileSync(manifestHq, path.join(distCombined, 'hq', 'manifest.json'));
}
if (fs.existsSync(manifestCustomer)) {
  fs.copyFileSync(manifestCustomer, path.join(distCombined, 'customer', 'manifest.json'));
}
if (fs.existsSync(manifestOwner) && fs.existsSync(path.join(distCombined, 'owner'))) {
  fs.copyFileSync(manifestOwner, path.join(distCombined, 'owner', 'manifest.json'));
  fs.copyFileSync(manifestOwner, path.join(distCombined, 'restaurant', 'manifest.json'));
}

const swCustomer = path.join(publicDir, 'sw-customer.js');
if (fs.existsSync(swCustomer)) {
  fs.copyFileSync(swCustomer, path.join(distCombined, 'customer', 'sw.js'));
}
if (fs.existsSync(path.join(distCombined, 'sw-customer.js'))) {
  fs.unlinkSync(path.join(distCombined, 'sw-customer.js'));
}
if (fs.existsSync(path.join(distCombined, 'hq', 'sw-customer.js'))) {
  fs.unlinkSync(path.join(distCombined, 'hq', 'sw-customer.js'));
}
if (fs.existsSync(path.join(distCombined, 'customer', 'sw-customer.js'))) {
  fs.unlinkSync(path.join(distCombined, 'customer', 'sw-customer.js'));
}

// 6. Dedicated GitHub Pages SPA 404 fallbacks for both applications
const rootIndexHtml = path.join(distCombined, 'index.html');
const rootFourOhFour = path.join(distCombined, '404.html');
if (fs.existsSync(rootIndexHtml)) {
  fs.copyFileSync(rootIndexHtml, rootFourOhFour);
}

const customerIndexHtml = path.join(distCombined, 'customer', 'index.html');
const customerFourOhFour = path.join(distCombined, 'customer', '404.html');
if (fs.existsSync(customerIndexHtml)) {
  fs.copyFileSync(customerIndexHtml, customerFourOhFour);
}

// 7. Ensure .nojekyll is present at root
fs.writeFileSync(path.join(distCombined, '.nojekyll'), '');

console.log('✅ Successfully assembled dist-combined with completely isolated HQ and Customer applications!');
