import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, Plugin } from 'vite';

// Dev middleware to route /customer to customer.html during local dev
function customerDevRewritePlugin(): Plugin {
  return {
    name: 'customer-dev-rewrite',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url === '/customer' || req.url === '/customer/' || req.url.startsWith('/customer?'))) {
          req.url = '/customer.html' + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '');
        }
        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const isCustomer = mode === 'customer';
  const isOwner = mode === 'owner';
  const isHq = mode === 'hq';

  let outDir = 'dist';
  let input = resolve(__dirname, 'index.html');

  if (isCustomer) {
    outDir = 'dist-customer';
    input = resolve(__dirname, 'customer.html');
  } else if (isOwner) {
    outDir = 'dist-owner';
    input = resolve(__dirname, 'index.html');
  } else if (isHq) {
    outDir = 'dist-hq';
    input = resolve(__dirname, 'index.html');
  }

  return {
    plugins: [react(), customerDevRewritePlugin()],
    base: './',
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input,
      },
    },
    server: {
      host: true,
      allowedHosts: true,
    },
  };
});
