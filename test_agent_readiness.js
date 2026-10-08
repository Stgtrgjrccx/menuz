import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log('--- STARTING AGENT READINESS AUDIT TEST ---');
  let failures = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failures++;
    }
  }

  // 1. Verify robots.txt
  console.log('\n[1] Testing AI Bot Rules in robots.txt:');
  const robotsPath = path.join(__dirname, 'public', 'robots.txt');
  const robotsTxt = fs.readFileSync(robotsPath, 'utf8');
  assert(robotsTxt.includes('GPTBot'), 'robots.txt includes GPTBot');
  assert(robotsTxt.includes('ClaudeBot'), 'robots.txt includes ClaudeBot');
  assert(robotsTxt.includes('PerplexityBot'), 'robots.txt includes PerplexityBot');
  assert(robotsTxt.includes('OraBot'), 'robots.txt includes OraBot');
  assert(robotsTxt.includes('llms.txt'), 'robots.txt links to llms.txt');
  assert(robotsTxt.includes('Allow: /hq'), 'robots.txt explicitly allows /hq');

  // 2. Verify Content Without JavaScript
  console.log('\n[2] Testing Raw HTML Content & Heading Hierarchy:');
  const indexPath = path.join(__dirname, 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  const rootContentMatch = indexHtml.match(/<div id="root">([\s\S]*?)<\/div>/);
  assert(!!rootContentMatch, 'index.html contains <div id="root"> with content');
  const rootText = rootContentMatch ? rootContentMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  console.log(`  Root plain text character count: ${rootText.length}`);
  assert(rootText.length >= 500, `Raw HTML inside #root exceeds 500 characters (actual: ${rootText.length})`);
  assert(/<h1[\s>]/i.test(indexHtml) && indexHtml.includes('</h1>'), 'Contains clear <h1>');
  assert(/<h2[\s>]/i.test(indexHtml) && indexHtml.includes('</h2>'), 'Contains clear <h2>');
  assert(/<h3[\s>]/i.test(indexHtml) && indexHtml.includes('</h3>'), 'Contains clear <h3>');
  assert(indexHtml.includes('<noscript>'), 'Contains <noscript> tag for non-JS environments');
  assert(indexHtml.includes('rel="alternate" type="text/markdown"'), 'Contains Markdown alternate discovery tag');

  // 3 & 4. Verify Server Responses via HTTP
  console.log('\n[3 & 4] Testing Server Content Negotiation and 404s:');

  // Helper function to make HTTP request
  function request(urlPath, headers = {}) {
    return new Promise((resolve, reject) => {
      const req = http.request({
        hostname: '127.0.0.1',
        port: 4000,
        path: urlPath,
        method: 'GET',
        headers
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body
        }));
      });
      req.on('error', reject);
      req.end();
    });
  }

  // Check if server is running; if not, import and start it
  let serverInstance = null;
  try {
    const probe = await request('/');
  } catch (e) {
    console.log('Server not currently running on port 4000. Launching server.js in-process...');
    process.env.PORT = '4000';
    // Dynamically import server
    await import('./server.js');
    await new Promise(r => setTimeout(r, 1000));
  }

  // Test 3: Agent-friendly 404s
  console.log('\n  -> Probing nonexistent path with Accept: text/markdown:');
  const probe404Md = await request('/__ora-404-probe-r34apg2l', {
    'Accept': 'text/markdown',
    'User-Agent': 'OraBot/1.0'
  });
  assert(probe404Md.statusCode === 404, `Status code is 404 (got: ${probe404Md.statusCode})`);
  assert(
    (probe404Md.headers['content-type'] || '').includes('text/markdown'),
    `Content-Type is text/markdown (got: ${probe404Md.headers['content-type']})`
  );
  assert(
    (probe404Md.headers['vary'] || '').toLowerCase().includes('accept'),
    `Vary header includes Accept (got: ${probe404Md.headers['vary']})`
  );
  assert(probe404Md.body.length >= 20, `Markdown 404 body >= 20 chars (got: ${probe404Md.body.length})`);
  assert(probe404Md.body.includes('llms.txt'), 'Markdown 404 links to llms.txt');

  // Test 3b: Nonexistent path with Accept: text/html
  console.log('  -> Probing nonexistent path with Accept: text/html:');
  const probe404Html = await request('/__ora-404-probe-r34apg2l', {
    'Accept': 'text/html',
    'User-Agent': 'Mozilla/5.0'
  });
  assert(probe404Html.statusCode === 404, `Status code is 404 for HTML request (got: ${probe404Html.statusCode})`);

  // Test 4: Markdown content negotiation on Homepage & /hq
  console.log('\n  -> Probing / with Accept: text/markdown:');
  const homeMd = await request('/', {
    'Accept': 'text/markdown',
    'User-Agent': 'OraBot/1.0'
  });
  assert(homeMd.statusCode === 200, `Homepage returns 200 for Markdown (got: ${homeMd.statusCode})`);
  assert(
    (homeMd.headers['content-type'] || '').includes('text/markdown'),
    `Homepage Content-Type is text/markdown (got: ${homeMd.headers['content-type']})`
  );
  assert(
    (homeMd.headers['vary'] || '').toLowerCase().includes('accept'),
    `Homepage Vary header includes Accept (got: ${homeMd.headers['vary']})`
  );
  assert(homeMd.body.includes('# Menuz'), 'Homepage Markdown body contains header # Menuz');
  assert(homeMd.body.length > 500, `Homepage Markdown body length > 500 chars (actual: ${homeMd.body.length})`);

  console.log('  -> Probing /hq with Accept: text/markdown:');
  const hqMd = await request('/hq', {
    'Accept': 'text/markdown',
    'User-Agent': 'GPTBot/1.0'
  });
  assert(hqMd.statusCode === 200, `/hq returns 200 for Markdown (got: ${hqMd.statusCode})`);
  assert(
    (hqMd.headers['content-type'] || '').includes('text/markdown'),
    `/hq Content-Type is text/markdown (got: ${hqMd.headers['content-type']})`
  );
  assert(
    (hqMd.headers['vary'] || '').toLowerCase().includes('accept'),
    `/hq Vary header includes Accept (got: ${hqMd.headers['vary']})`
  );
  assert(hqMd.body.includes('Master Admin HQ'), `/hq Markdown body contains Master Admin HQ context`);

  console.log('  -> Probing / with Accept: text/html:');
  const homeHtml = await request('/', {
    'Accept': 'text/html',
    'User-Agent': 'Mozilla/5.0'
  });
  assert(homeHtml.statusCode === 200, `Homepage returns 200 for HTML (got: ${homeHtml.statusCode})`);
  assert(
    (homeHtml.headers['content-type'] || '').includes('text/html'),
    `Homepage Content-Type is text/html (got: ${homeHtml.headers['content-type']})`
  );
  assert(
    (homeHtml.headers['vary'] || '').toLowerCase().includes('accept'),
    `Homepage Vary header includes Accept for HTML responses (got: ${homeHtml.headers['vary']})`
  );

  // Test 5: Brand name discoverability
  console.log('\n[5] Testing Brand Discoverability:');
  assert(indexHtml.includes('Autonomous Restaurant Operating System'), 'Title/meta contains main product description');
  assert(indexHtml.includes('Digital Dining Platform'), 'Mentions Digital Dining Platform');
  assert(indexHtml.includes('QR Ordering'), 'Mentions QR Ordering product category');
  assert(indexHtml.includes('Schema.org'), 'Contains structured JSON-LD schema');

  console.log('\n--- AUDIT TEST SUMMARY ---');
  if (failures === 0) {
    console.log('🎉 ALL AGENT READINESS TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  } else {
    console.error(`❌ ${failures} TESTS FAILED!\n`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
