// Nagebootste GitHub voor de browsertoetsen van de editor: één kleine webserver die
//  (1) de site statisch serveert uit een "gepubliceerde" stand in het geheugen (begint als een kopie van de repo-map), en
//  (2) de stukjes van de GitHub-API nabootst die de editor gebruikt (git/ref, git/commits, git/trees, git/blobs, contents, repo).
// Er gaat niets naar echt GitHub. De repo staat in het geheugen; de bestanden op schijf worden nooit aangepast.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };
const TEKST = /\.(html|css|js|json|svg|txt|xml|md)$/i;
const lf = (s) => s.split(String.fromCharCode(13, 10)).join(String.fromCharCode(10));

function laad(root) {      // pad -> string (tekst, met LF zoals in git) of {b64}
  const m = new Map();
  (function loop(map, rel) {
    for (const f of fs.readdirSync(map, { withFileTypes: true })) {
      if (['.git', 'node_modules'].includes(f.name)) continue;
      const p = path.join(map, f.name), r = rel ? rel + '/' + f.name : f.name;
      if (f.isDirectory()) loop(p, r);
      else if (TEKST.test(f.name)) m.set(r, lf(fs.readFileSync(p, 'utf8')));
      else m.set(r, { b64: fs.readFileSync(p).toString('base64') });
    }
  })(root, '');
  return m;
}

export async function start(root, opties = {}) {
  let teller = 0;
  const blobs = new Map(), trees = new Map(), commits = new Map();
  const sha = (p) => p + (++teller).toString(16).padStart(8, '0') + 'a'.repeat(31);
  const t0 = sha('t'); trees.set(t0, laad(root));
  const c0 = sha('c'); commits.set(c0, { sha: c0, tree: t0, parents: [], message: 'start' });
  const st = { head: c0, gepubliceerd: t0, verzoeken: [], opgeslagen: [], vertraging: opties.vertraging || 0, bijRef: null, weigerRef: 0 };
  const json = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }); res.end(JSON.stringify(obj)); };
  const lees = (req) => new Promise((ok) => { const d = []; req.on('data', (c) => d.push(c)); req.on('end', () => ok(Buffer.concat(d).toString('utf8'))); });
  const boom = (ref) => trees.get((commits.get(ref) || commits.get(st.head)).tree);
  const zet = (c) => { commits.set(c.sha, c); };
  const timers = new Set();
  const publiceer = () => { const t = commits.get(st.head).tree; if (st.vertraging) { const h = setTimeout(() => { timers.delete(h); st.gepubliceerd = t; }, st.vertraging); timers.add(h); } else st.gepubliceerd = t; };

  async function api(req, res, url) {
    const p = url.pathname.replace(/^\/repos\/[^/]+\/[^/]+/, '') || '/';
    st.verzoeken.push(req.method + ' ' + p);
    if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' }); return res.end(); }
    if (!/^Bearer \S+$/.test(req.headers.authorization || '')) return json(res, 401, { message: 'Bad credentials' });
    let m;
    if (req.method === 'GET' && p === '/') return json(res, 200, { full_name: 'x/y', permissions: { push: true, pull: true } });
    if (req.method === 'GET' && /^\/git\/trees\/[^/]+$/.test(p)) return json(res, 200, { tree: Array.from(boom(st.head).keys()).map((k) => ({ path: k, type: 'blob' })) });
    if (req.method === 'GET' && (m = /^\/contents\/(.+)$/.exec(p))) {
      const pad = decodeURIComponent(m[1]), x = boom(url.searchParams.get('ref') === 'main' ? st.head : url.searchParams.get('ref')).get(pad);
      if (x === undefined) return json(res, 404, { message: 'Not Found' });
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }); return res.end(typeof x === 'string' ? x : Buffer.from(x.b64, 'base64'));
    }
    if (req.method === 'GET' && p === '/git/ref/heads/main') return json(res, 200, { object: { sha: st.head } });
    if (req.method === 'GET' && (m = /^\/git\/commits\/([0-9a-z]+)$/.exec(p))) { const c = commits.get(m[1]); if (!c) return json(res, 404, { message: 'Not Found' }); return json(res, 200, { sha: c.sha, tree: { sha: c.tree }, parents: c.parents.map((s) => ({ sha: s })), message: c.message }); }
    if (req.method === 'POST' && p === '/git/blobs') { const b = JSON.parse(await lees(req)), s = sha('b'); blobs.set(s, b.encoding === 'base64' ? { b64: b.content } : b.content); return json(res, 201, { sha: s }); }
    if (req.method === 'POST' && p === '/git/trees') {
      const b = JSON.parse(await lees(req)), basis = trees.get(b.base_tree); if (!basis) return json(res, 422, { message: 'base tree' });
      const nieuw = new Map(basis); b.tree.forEach((e) => { if (!blobs.has(e.sha)) throw new Error('onbekende blob'); nieuw.set(e.path, blobs.get(e.sha)); });
      const s = sha('t'); trees.set(s, nieuw); return json(res, 201, { sha: s });
    }
    if (req.method === 'POST' && p === '/git/commits') { const b = JSON.parse(await lees(req)); if (!trees.has(b.tree)) return json(res, 422, { message: 'tree' }); const s = sha('c'); zet({ sha: s, tree: b.tree, parents: b.parents, message: b.message }); return json(res, 201, { sha: s }); }
    if (req.method === 'PATCH' && p === '/git/refs/heads/main') {
      const b = JSON.parse(await lees(req)), c = commits.get(b.sha);
      if (st.bijRef) { const f = st.bijRef; st.bijRef = null; f(st); }
      if (st.weigerRef > 0) { st.weigerRef--; return json(res, 422, { message: 'Update is not a fast forward' }); }
      if (!c || c.parents[0] !== st.head || b.force) return json(res, 422, { message: 'Update is not a fast forward' });
      st.head = b.sha; st.opgeslagen.push({ sha: b.sha, bericht: c.message }); publiceer(); return json(res, 200, { object: { sha: b.sha } });
    }
    return json(res, 404, { message: 'Niet nagebootst: ' + req.method + ' ' + p });
  }
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://x');
      if (/^\/repos\//.test(url.pathname)) return await api(req, res, url);
      let rel = decodeURIComponent(url.pathname).replace(/^\//, ''); if (rel === '' || rel.endsWith('/')) rel += 'index.html';
      const x = trees.get(st.gepubliceerd).get(rel);
      if (x === undefined) { res.writeHead(404); return res.end('niet gevonden'); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(rel).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(typeof x === 'string' ? x : Buffer.from(x.b64, 'base64'));
    } catch (e) { res.writeHead(500); res.end(String((e && e.stack) || e)); }
  });
  await new Promise((ok) => server.listen(0, 'localhost', ok));
  const poort = server.address().port;
  return {
    poort, st, basis: 'http://localhost:' + poort,
    editorUrl: (extra) => 'http://localhost:' + poort + '/beheer/index.html?api=' + encodeURIComponent('http://localhost:' + poort) + (extra || ''),
    bestand: (pad, ref) => { const x = boom(ref || st.head).get(pad); return typeof x === 'string' ? x : x ? Buffer.from(x.b64, 'base64') : null; },
    zetBestand: (pad, inhoud) => {      // verander de repo "van buiten" (iemand anders slaat iets op): nieuwe commit bovenop de huidige
      const t = new Map(boom(st.head)); t.set(pad, inhoud); const ts = sha('t'); trees.set(ts, t); const cs = sha('c'); zet({ sha: cs, tree: ts, parents: [st.head], message: 'extern' }); st.head = cs; publiceer();
    },
    aantalCommits: () => { let n = 0, c = commits.get(st.head); while (c && c.parents[0]) { n++; c = commits.get(c.parents[0]); } return n; },
    stop: () => new Promise((ok) => { timers.forEach(clearTimeout); server.closeAllConnections && server.closeAllConnections(); server.close(ok); }),
  };
}
