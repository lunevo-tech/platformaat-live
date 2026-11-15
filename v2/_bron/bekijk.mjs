// Lokale voorbeeldserver voor V2 (alleen op deze pc, poort 4810). Stoppen: venster sluiten.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { exec } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };
http.createServer((q, r) => {
  let f = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(root) || path.basename(f).startsWith('_') || f.includes(`${path.sep}_`)) { r.writeHead(404); return r.end('niet gevonden'); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end('niet gevonden'); }
  r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
}).listen(4810, '127.0.0.1', () => { console.log('V2 draait op http://localhost:4810/  (venster sluiten = stoppen)'); exec('start http://localhost:4810/'); });
