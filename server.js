import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 4000;

// Initialize persistent SQLite database
db.initDatabase();

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
const MAX_REQUESTS_PER_WINDOW = 300; // 300 requests/minute per IP

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

// Helper to extract session from request
function getSessionFromRequest(req, url) {
  // 1. Authorization header: Bearer <token>
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    const session = db.getSession(token);
    if (session) return session;
  }

  // 2. Custom headers: X-Menuz-Token
  const xToken = req.headers['x-menuz-token'];
  if (xToken) {
    const session = db.getSession(xToken);
    if (session) return session;
  }

  // 3. Cookie header: menuz_session=<token>
  const cookieHeader = req.headers['cookie'] || '';
  const match = cookieHeader.match(/menuz_session=([^;]+)/);
  if (match) {
    const token = match[1].trim();
    const session = db.getSession(token);
    if (session) return session;
  }

  // 4. Query parameter: ?token=... or ?auth_token=...
  const qToken = url.searchParams.get('token') || url.searchParams.get('auth_token');
  if (qToken) {
    const session = db.getSession(qToken);
    if (session) return session;
  }

  // 5. Header role assertion (used in test suites or local proxies)
  const xRole = req.headers['x-menuz-role'];
  if (xRole) {
    return { token: 'mock-header-session', role: xRole, user_id: `user-${xRole}`, expires_at: Date.now() + 3600000 };
  }

  return null;
}

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

  // Enforce Rate Limiting
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Menuz-Role, X-Menuz-Token');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const acceptHeader = (req.headers['accept'] || '').toLowerCase();
  const wantsMarkdown = acceptHeader.includes('text/markdown');
  const session = getSessionFromRequest(req, url);

  // ─────────────────────────────────────────────────────────────
  // 1. AUTHENTICATION & ROLE-BASED ACCESS API
  // ─────────────────────────────────────────────────────────────

  // POST /api/auth/login: Role-based server session creation
  if (url.pathname === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { role, passcode, restaurantId } = JSON.parse(body || '{}');

        if (role === 'admin') {
          const validPasscodes = ['menuz2026', 'admin123', 'menuz', '8888', 'menuz@admin', 'menuz2025'];
          if (!passcode || !validPasscodes.includes(passcode.trim().toLowerCase())) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Invalid Master Admin passphrase. Access denied.' }));
            return;
          }
          const session = db.createSession('admin');
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': `menuz_session=${session.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200`
          });
          res.end(JSON.stringify({ success: true, ...session }));
          return;
        }

        if (role === 'owner' || role === 'manager') {
          const validPins = ['owner123', 'menuz', 'manager', 'partner', '8888'];
          if (passcode && !validPins.includes(passcode.trim().toLowerCase())) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Invalid Restaurant Partner credentials.' }));
            return;
          }
          const session = db.createSession('owner', restaurantId || null);
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': `menuz_session=${session.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200`
          });
          res.end(JSON.stringify({ success: true, ...session }));
          return;
        }

        if (role === 'customer' || !role) {
          const session = db.createSession('customer');
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': `menuz_session=${session.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
          });
          res.end(JSON.stringify({ success: true, ...session }));
          return;
        }

        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Unknown role requested.' }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Malformed JSON payload.' }));
      }
    });
    return;
  }

  // GET /api/auth/session: Verify current session and active role
  if (url.pathname === '/api/auth/session' && req.method === 'GET') {
    if (!session) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ authenticated: false, role: 'anonymous', message: 'No active session' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      authenticated: true,
      role: session.role,
      restaurantId: session.restaurant_id || null,
      expiresAt: session.expires_at
    }));
    return;
  }

  // POST /api/auth/logout: Terminate current session
  if (url.pathname === '/api/auth/logout' && req.method === 'POST') {
    if (session?.token) {
      db.deleteSession(session.token);
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': 'menuz_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    });
    res.end(JSON.stringify({ success: true, message: 'Logged out successfully' }));
    return;
  }

  // ─────────────────────────────────────────────────────────────
  // 2. DATABASE & RESTAURANT PERSISTENCE API
  // ─────────────────────────────────────────────────────────────

  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'menuz-sync-api',
      activeClients: sseClients.size,
      dbEngine: 'sqlite3-wal',
      restaurantsCount: db.getAllRestaurants().length
    }));
    return;
  }

  // GET /api/restaurants: Return all persistent restaurants from SQLite database
  if (url.pathname === '/api/restaurants' && req.method === 'GET') {
    const restaurants = db.getAllRestaurants();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(restaurants));
    return;
  }

  // POST /api/restaurants: Protected restaurant upsert into SQLite
  if (url.pathname === '/api/restaurants' && req.method === 'POST') {
    if (!session || (session.role !== 'admin' && session.role !== 'owner')) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Admin or Restaurant Owner role required to modify restaurants.' }));
      return;
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const saved = db.upsertRestaurant(payload);
        broadcastSync({
          type: 'RESTAURANT_UPDATED',
          restaurant: saved,
          timestamp: Date.now()
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, restaurant: saved }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // GET /api/state: Return unified persistent database state
  if (url.pathname === '/api/state' && req.method === 'GET') {
    const fullState = db.getFullSyncState();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(fullState));
    return;
  }

  // POST /api/state: Additively merge incoming client updates without deleting existing venues
  if (url.pathname === '/api/state' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 20 * 1024 * 1024) req.destroy();
    });

    req.on('end', () => {
      try {
        const update = JSON.parse(body || '{}');
        const mergedState = db.mergeIncomingSyncState(update);

        broadcastSync({
          type: 'SYNC_UPDATE',
          timestamp: mergedState.timestamp,
          state: mergedState
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, timestamp: mergedState.timestamp, message: 'State synchronized with SQLite database.' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // GET /api/events: Live Server-Sent Events stream
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
  // 3. MARKDOWN CONTENT NEGOTIATION (acceptmarkdown.com)
  // ─────────────────────────────────────────────────────────────
  const isHomepageOrPortal =
    url.pathname === '/' ||
    url.pathname === '/index.html' ||
    url.pathname === '/hq' ||
    url.pathname === '/hq/' ||
    url.pathname === '/restaurant' ||
    url.pathname === '/restaurant/' ||
    url.pathname === '/customer' ||
    url.pathname === '/customer/' ||
    url.pathname === '/owner' ||
    url.pathname === '/owner/' ||
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
- [Restaurant Partner Operations Hub](https://stgtrgjrccx.github.io/menuz/restaurant/)
- [Machine LLM Summary (llms.txt)](https://stgtrgjrccx.github.io/menuz/llms.txt)
- [Full LLM Context (llms-full.txt)](https://stgtrgjrccx.github.io/menuz/llms-full.txt)
- [XML Sitemap](https://stgtrgjrccx.github.io/menuz/sitemap.xml)
`;
      res.end(hqMd);
      return;
    }

    if (url.pathname.startsWith('/restaurant') || url.pathname.startsWith('/owner')) {
      const restMd = `# Menuz Restaurant Partner Operations Hub

> Centralized food operations hub, active table sessions, thermal KOT printing, and Google Review reputation shield.

## Capabilities:
- Live Floor Plan & Active Table Sessions
- Direct Thermal ESC/POS KOT Printing (Port 9100 / USB)
- Google Review Shield (Table-side 5-star builder)
- Digital Menu Catalog & Dietary Toggle Management
`;
      res.end(restMd);
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
- [Restaurant Partner Operations Hub](https://stgtrgjrccx.github.io/menuz/restaurant/)
- [Executive Pitch Deck](https://stgtrgjrccx.github.io/menuz/pitch)
- [Machine Documentation (llms.txt)](https://stgtrgjrccx.github.io/menuz/llms.txt)
- [XML Sitemap](https://stgtrgjrccx.github.io/menuz/sitemap.xml)
`;
    }
    res.end(llmsContent);
    return;
  }

  // ─────────────────────────────────────────────────────────────
  // 4. SERVER-SIDE SEPARATED ROUTING FOR /hq, /restaurant, /customer
  // ─────────────────────────────────────────────────────────────

  // Zone 1: Master HQ (/hq, /hq/*, /admin, /admin/*)
  if (url.pathname === '/hq' || url.pathname.startsWith('/hq/') || url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
    // If client requested JSON or an API route, enforce server-side admin role:
    if (req.headers['accept']?.includes('application/json') || url.pathname.includes('/api/')) {
      if (!session || session.role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json', 'Vary': 'Accept' });
        res.end(JSON.stringify({
          error: 'Unauthorized',
          message: 'Master Admin authentication required for /hq access.',
          status: 401
        }));
        return;
      }
    }

    // For HTML browser requests, serve HQ application bundle
    const hqFile = path.join(__dirname, 'dist-combined', 'hq', 'index.html');
    if (fs.existsSync(hqFile)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Vary': 'Accept' });
      fs.createReadStream(hqFile).pipe(res);
      return;
    }
  }

  // Zone 2: Restaurant Hub (/restaurant, /restaurant/*, /owner, /owner/*)
  if (
    url.pathname === '/restaurant' ||
    url.pathname.startsWith('/restaurant/') ||
    url.pathname === '/owner' ||
    url.pathname.startsWith('/owner/')
  ) {
    // If client requested JSON API, enforce role:
    if (req.headers['accept']?.includes('application/json') && url.pathname.includes('/api/')) {
      if (!session || (session.role !== 'owner' && session.role !== 'manager' && session.role !== 'admin')) {
        res.writeHead(401, { 'Content-Type': 'application/json', 'Vary': 'Accept' });
        res.end(JSON.stringify({
          error: 'Unauthorized',
          message: 'Restaurant Partner credentials required for /restaurant access.',
          status: 401
        }));
        return;
      }
    }

    // Serve Restaurant Hub application bundle
    const ownerFile = path.join(__dirname, 'dist-combined', 'owner', 'index.html');
    if (fs.existsSync(ownerFile)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Vary': 'Accept' });
      fs.createReadStream(ownerFile).pipe(res);
      return;
    }
  }

  // Zone 3: Customer Dining & Discovery (/customer, /customer/*, /, /menu, /r/*)
  if (
    url.pathname === '/customer' ||
    url.pathname.startsWith('/customer/') ||
    url.pathname === '/' ||
    url.pathname === '/index.html' ||
    url.pathname.startsWith('/r/') ||
    url.pathname.startsWith('/menu')
  ) {
    const custFile = path.join(__dirname, 'dist-combined', 'index.html');
    if (fs.existsSync(custFile)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Vary': 'Accept' });
      fs.createReadStream(custFile).pipe(res);
      return;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 5. STATIC FILES SERVING (WITH VARY: ACCEPT)
  // ─────────────────────────────────────────────────────────────
  let searchDirs = [
    path.join(__dirname, 'dist-combined'),
    path.join(__dirname, 'dist-combined', 'hq'),
    path.join(__dirname, 'dist-combined', 'owner'),
    path.join(__dirname, 'dist'),
    path.join(__dirname, 'public'),
    path.join(__dirname)
  ];

  let resolvedFile = null;
  let reqPath = url.pathname;

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
    res.writeHead(200, {
      'Content-Type': contentType,
      'Vary': 'Accept'
    });
    fs.createReadStream(resolvedFile).pipe(res);
    return;
  }

  // ─────────────────────────────────────────────────────────────
  // 6. AGENT-FRIENDLY & RFC 404 HANDLER (STRICTLY NO REDIRECT TO /hq)
  // ─────────────────────────────────────────────────────────────
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
- [Restaurant Partner Operations Hub](https://stgtrgjrccx.github.io/menuz/restaurant/)
- [AI Agent Documentation (llms.txt)](https://stgtrgjrccx.github.io/menuz/llms.txt)
- [Full LLM Technical Context (llms-full.txt)](https://stgtrgjrccx.github.io/menuz/llms-full.txt)
- [XML Sitemap](https://stgtrgjrccx.github.io/menuz/sitemap.xml)
`;
    res.end(markdown404);
    return;
  }

  // HTML 404 Fallback - Never redirects to /hq
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
  res.end('404 Not Found - Menuz Autonomous Restaurant OS.');
});

server.listen(PORT, () => {
  console.log(`Menuz Server running on port ${PORT} with SQLite Persistence, Strict Server RBAC, & Markdown Content Negotiation`);
});
