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
const MAX_REQUESTS_PER_WINDOW = 120; // 120 requests/minute per IP

function checkRateLimit(ip) {
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

const server = http.createServer((req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';

  // Enforce Rate Limiting (Protects from runaway loops / billing spikes)
  if (!checkRateLimit(clientIp)) {
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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Health check
  if (url.pathname === '/' || url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'menuz-sync-api', activeClients: sseClients.size, lastUpdated: sharedState.lastUpdated }));
    return;
  }

  // Get current shared state
  if (url.pathname === '/api/state' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(sharedState));
    return;
  }

  // Update shared state from Admin HQ
  if (url.pathname === '/api/state' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Protect against gigantic payloads (max 20MB)
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

        // Persist asynchronously
        try {
          fs.writeFileSync(DATA_FILE, JSON.stringify(sharedState, null, 2));
        } catch (err) {
          console.error('Failed to write sync_state.json:', err);
        }

        // Broadcast to all connected customer and owner browsers in realtime
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

  // Server-Sent Events (SSE) Real-Time Stream
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

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
  console.log(`Menuz Realtime Cloud Sync API running on port ${PORT}`);
});
