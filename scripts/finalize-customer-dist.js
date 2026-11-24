/**
 * The customer app is built from customer.html, so Vite emits dist-customer/customer.html
 * and no index.html. render.yaml publishes ./dist-customer with a rewrite of /* to
 * /index.html, which means every request resolves to a file that does not exist.
 *
 * Copy the built entry point to index.html so the published directory has one.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distCustomer = path.join(path.resolve(__dirname, '..'), 'dist-customer');

const src = path.join(distCustomer, 'customer.html');
const dest = path.join(distCustomer, 'index.html');

if (!fs.existsSync(src)) {
  console.error(`finalize-customer-dist: ${src} not found — did vite build --mode customer run?`);
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log('finalize-customer-dist: wrote dist-customer/index.html');
