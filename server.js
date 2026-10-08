import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'sync_state.json');

const PORT = process.env.PORT || 4000;

// Load persisted state if exists
let sharedState = {
  restaurants: [],
  menuItems: [],
  tables: [],
  categories: [],
  challenges: [],
  lastUpdated: Date.now()
};

try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    sharedState = { ...sharedState, ...JSON.parse(raw) };
  }
} catch (e) {
  console.warn('Could not read existing sync_state.json, starting fresh');
}

// SSE Connected Clients Set
const sseClients = new Set();

function broadcastSync(payload) {
  const message = `data: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch (e) {
      sseClients.delete(client);
    }
  }
}

// In-memory rate limiting map: IP -> { count, resetTime }
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 240; // 240 requests/minute per IP

function isAgentOrCrawler(userAgent = '') {
  const ua = userAgent.toLowerCase();
  return (
    ua.includes('bot') ||
    ua.includes('crawler') ||
    ua.includes('spider') ||
    ua.includes('gpt') ||
    ua.includes('claude') ||
    ua.includes('perplexity') ||
    ua.includes('google') ||
    ua.includes('bing') ||
    ua.includes('apple') ||
    ua.includes('ora') ||
    ua.includes('agent') ||
    ua.includes('curl') ||
    ua.includes('wget')
  );
}

function checkRateLimit(ip, userAgent = '') {
  // Never rate-limit search crawlers or AI agents
  if (isAgentOrCrawler(userAgent)) {
    return true;
  }

  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  entry.count++;
  return true;
}

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

// MIME type map
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || '';

  // Enforce Rate Limiting (Protects from runaway loops while permitting crawlers)
  if (!checkRateLimit(clientIp, userAgent)) {
    res.writeHead(429, { 
      'Content-Type': 'application/json',
      'Retry-After': '60'
    });
    res.end(JSON.stringify({ error: 'Too many requests, please slow down.' }));
    return;
  }

  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const acceptHeader = (req.headers['accept'] || '').toLowerCase();
  const wantsMarkdown = acceptHeader.includes('text/markdown');

  // ─────────────────────────────────────────────────────────────
  // 1. API ROUTES
  // ─────────────────────────────────────────────────────────────
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'menuz-sync-api', activeClients: sseClients.size, lastUpdated: sharedState.lastUpdated }));
    return;
  }

  if (url.pathname === '/api/state' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(sharedState));
    return;
  }

  if (url.pathname === '/api/state' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 20 * 1024 * 1024) {
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const update = JSON.parse(body);
        sharedState = {
          ...sharedState,
          ...update,
          lastUpdated: Date.now()
        };

        try {
          fs.writeFileSync(DATA_FILE, JSON.stringify(sharedState, null, 2));
        } catch (err) {
          console.error('Failed to write sync_state.json:', err);
        }

        broadcastSync({
          type: 'SYNC_UPDATE',
          timestamp: sharedState.lastUpdated,
          state: sharedState
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, timestamp: sharedState.lastUpdated, message: 'State synchronized successfully' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  if (url.pathname === '/api/events' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    });
    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders();
    }

    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: Date.now() })}\n\n`);
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // ─────────────────────────────────────────────────────────────
  // 2. MARKDOWN CONTENT NEGOTIATION (acceptmarkdown.com standard)
  // ─────────────────────────────────────────────────────────────
  // Check if agent explicitly requested text/markdown on the homepage or portal pages
  const isHomepageOrPortal =
    url.pathname === '/' ||
    url.pathname === '/index.html' ||
    url.pathname === '/hq' ||
    url.pathname === '/hq/' ||
    url.pathname === '/hq/index.html' ||
    url.pathname === '/owner' ||
    url.pathname === '/owner/' ||
    url.pathname === '/owner/index.html' ||
    url.pathname === '/menu';

  if (wantsMarkdown && isHomepageOrPortal) {
    res.writeHead(200, {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Vary': 'Accept',
      'Cache-Control': 'public, max-age=300'
    });

    if (url.pathname.startsWith('/hq')) {
      const hqMd = `# Menuz Master Admin HQ | Autonomous Platform Command Center

> Centralized governance for Menuz restaurant ecosystem, live table QR provisioning, and POS integrations.

## Overview
Menuz Master Admin HQ provides platform administrators with real-time control across:
- **Pune Restaurant Ecosystem Registry**: 3,000+ verified culinary venues, categorized by cuisine and neighborhood (Koregaon Park, Camp, Kalyani Nagar, FC Road).
- **Interactive Table & QR Code Manager**: Provision unique public tokens and generate printable table QR standees.
- **Bidirectional POS Integration Bridges**: Connects with Petpooja, RoyalPOS, Recaho, and RanceLab with sub-second order push.
- **Floor Operations Control**: Live monitoring of active dining sessions and thermal KOT prints.

## Direct Navigation & Machine Endpoints
- [Customer Discovery & Dining Site](https://stgtrgjrccx.github.io/menuz/)
- [Master Admin HQ Portal](https://stgtrgjrccx.github.io/menuz/hq/)
- [Restaurant Partner Operations Hub](https://stgtrgjrccx.github.io/menuz/owner/)
- [Machine LLM Summary (llms.txt)](https://stgtrgjrccx.github.io/menuz/llms.txt)
- [Full LLM Context (llms-full.txt)](https://stgtrgjrccx.github.io/menuz/llms-full.txt)
- [XML Sitemap](https://stgtrgjrccx.github.io/menuz/sitemap.xml)
`;
      res.end(hqMd);
      return;
    }

    // Default Menuz Markdown Home Body
    let llmsContent = '';
    const llmsPath = path.join(__dirname, 'public', 'llms.txt');
    if (fs.existsSync(llmsPath)) {
      llmsContent = fs.readFileSync(llmsPath, 'utf-8');
    } else {
      llmsContent = `# Menuz | Autonomous Restaurant Operating System & Digital Dining Platform

> Zero-app multiplayer QR ordering, instant ESC/POS kitchen thermal KOT printing, and Google Review reputation engine for restaurants in Pune, India.

## Key Products & Portals
- [Customer Discovery & Menus](https://stgtrgjrccx.github.io/menuz/)
- [Master Admin HQ Command Center](https://stgtrgjrccx.github.io/menuz/hq/)
- [Restaurant Partner Operations Hub](https://stgtrgjrccx.github.io/menuz/owner/)
- [Executive Pitch Deck](https://stgtrgjrccx.github.io/menuz/pitch)
- [Machine Documentation (llms.txt)](https://stgtrgjrccx.github.io/menuz/llms.txt)
- [XML Sitemap](https://stgtrgjrccx.github.io/menuz/sitemap.xml)
`;
    }
    res.end(llmsContent);
    return;
  }

  // ─────────────────────────────────────────────────────────────
  // 3. STATIC FILES & HTML SPA SERVING (WITH VARY: ACCEPT)
  // ─────────────────────────────────────────────────────────────
  // Look in dist-combined, then dist, then public
  let searchDirs = [
    path.join(__dirname, 'dist-combined'),
    path.join(__dirname, 'dist'),
    path.join(__dirname, 'public'),
    path.join(__dirname)
  ];

  let resolvedFile = null;
  let reqPath = url.pathname;
  if (reqPath === '/') reqPath = '/index.html';
  if (reqPath === '/hq' || reqPath === '/hq/') reqPath = '/hq/index.html';
  if (reqPath === '/owner' || reqPath === '/owner/') reqPath = '/owner/index.html';

  for (const dir of searchDirs) {
    const candidate = path.join(dir, reqPath);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      resolvedFile = candidate;
      break;
    }
  }

  if (resolvedFile) {
    const ext = path.extname(resolvedFile).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const headers = {
      'Content-Type': contentType,
      'Vary': 'Accept'
    };
    res.writeHead(200, headers);
    fs.createReadStream(resolvedFile).pipe(res);
    return;
  }

  // ─────────────────────────────────────────────────────────────
  // 4. AGENT-FRIENDLY 404 HANDLER
  // ─────────────────────────────────────────────────────────────
  // If agent requests text/markdown on a non-existent path:
  if (wantsMarkdown) {
    res.writeHead(404, {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Vary': 'Accept'
    });
    const markdown404 = `# 404 Not Found - Menuz Autonomous Restaurant OS

The requested path "${url.pathname}" does not exist on this server.

## Recommended Resources & Machine Links:
- [Customer Discovery & Diner Menus](https://stgtrgjrccx.github.io/menuz/)
- [Master Admin HQ Platform Command Center](https://stgtrgjrccx.github.io/menuz/hq/)
- [Restaurant Partner Operations Hub](https://stgtrgjrccx.github.io/menuz/owner/)
- [AI Agent Documentation (llms.txt)](https://stgtrgjrccx.github.io/menuz/llms.txt)
- [Full LLM Technical Context (llms-full.txt)](https://stgtrgjrccx.github.io/menuz/llms-full.txt)
- [XML Sitemap](https://stgtrgjrccx.github.io/menuz/sitemap.xml)
`;
    res.end(markdown404);
    return;
  }

  // HTML 404 Fallback
  const html404Path = path.join(__dirname, 'public', '404.html');
  if (fs.existsSync(html404Path)) {
    res.writeHead(404, {
      'Content-Type': 'text/html; charset=utf-8',
      'Vary': 'Accept'
    });
    fs.createReadStream(html404Path).pipe(res);
    return;
  }

  res.writeHead(404, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Vary': 'Accept'
  });
  res.end('404 Not Found - Menuz Autonomous Restaurant OS. Explore https://stgtrgjrccx.github.io/menuz/llms.txt for machine documentation.');
});

server.listen(PORT, () => {
  console.log(`Menuz Server running on port ${PORT} with Markdown Content Negotiation & Agent-Ready 404s`);
});
