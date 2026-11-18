// Bewijs dat de bron en de pagina in de browser dezelfde tekststukken zien: voor elk gemarkeerd element zijn de tekststukken (nummer k) in de bron-HTML
// gelijk aan de tekstknopen in het DOM, op alle pagina's van de site. De editor wijst in de browser een stuk aan (id + k) en pas() past datzelfde stuk in de bron aan.
// Nodig: playwright (zet ZM_PW_MAP op een map met node_modules/playwright-core); zonder playwright wordt deze toets overgeslagen.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { paginas } from '../tools/markeer.mjs';
const K = createRequire(import.meta.url)('../cms-kern.js');
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const lf = (s) => s.split(String.fromCharCode(13, 10)).join(String.fromCharCode(10));
let pw = null;
try { pw = createRequire(process.env.ZM_PW_MAP ? pathToFileURL(path.resolve(process.env.ZM_PW_MAP) + '/') : import.meta.url)('playwright-core'); } catch (e) { try { pw = createRequire(import.meta.url)('playwright'); } catch (x) {} }
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml', '.json': 'application/json' };

test('DOM en bron hebben dezelfde tekststukken per gemarkeerd element (alle pagina\'s)', { skip: !pw && 'playwright niet beschikbaar' }, async () => {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
    const f = path.join(REPO, p); if (!f.startsWith(REPO) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
  });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok)); const BASE = 'http://127.0.0.1:' + server.address().port;
  const browser = await pw.chromium.launch(); const verschillen = []; let elementen = 0;
  try {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    for (const p of paginas(REPO)) {
      const bron = lf(fs.readFileSync(path.join(REPO, p), 'utf8')), verwacht = {};
      K.lijst(bron).filter((x) => x.soort === 'tekst').forEach((x) => { verwacht[x.id] = x.stukken.map((s) => K.norm(s.tekst)); });
      const page = await ctx.newPage(); await page.goto(BASE + '/' + p, { waitUntil: 'load' }); await page.waitForTimeout(600);
      const dom = await page.evaluate(() => {
        const norm = (s) => String(s || '').split(/\s+/).filter(Boolean).join(' '), r = {};
        document.querySelectorAll('[data-cms^="t"]').forEach((e) => { r[e.getAttribute('data-cms')] = Array.from(e.childNodes).filter((n) => n.nodeType === 3 && /[A-Za-zÀ-ɏͰ-ϿЀ-ӿ]/.test(n.nodeValue)).map((n) => norm(n.nodeValue)); });
        return r;
      });
      for (const id of Object.keys(verwacht)) {
        elementen++;
        if (!dom[id]) { verschillen.push(p + ' ' + id + ': element ontbreekt in het DOM'); continue; }
        if (JSON.stringify(dom[id]) !== JSON.stringify(verwacht[id])) verschillen.push(p + ' ' + id + ': DOM ' + JSON.stringify(dom[id]).slice(0, 80) + ' <> bron ' + JSON.stringify(verwacht[id]).slice(0, 80));
      }
      for (const id of Object.keys(dom)) if (!verwacht[id]) verschillen.push(p + ' ' + id + ': in het DOM maar niet in de bron');
      await page.close();
    }
  } finally { await browser.close(); server.close(); }
  console.log('gecontroleerd:', elementen, 'gemarkeerde elementen; verschillen:', verschillen.length);
  assert.deepEqual(verschillen.slice(0, 20), []);
});
