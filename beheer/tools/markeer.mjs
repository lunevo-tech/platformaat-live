// Zet eenmalig data-cms-markeringen in de HTML-pagina's van de site (bewerkbare teksten en afbeeldingen). Daarna is de HTML de bron; de editor past alleen de gemarkeerde stukken aan.
// Gebruik (vanuit de repo-map):  node beheer/tools/markeer.mjs            markeert alles wat nog geen markering heeft
//                                node beheer/tools/markeer.mjs --controle  controleert (schrijft niets): elke pagina heeft markeringen, en zonder markeringen is niets veranderd t.o.v. git
// Idempotent: bestaande markeringen blijven; alleen nieuwe plekken krijgen een nieuw nummer. Er wordt nooit iets anders aan de HTML veranderd dan het toevoegen van ` data-cms="..."`.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const K = createRequire(import.meta.url)('../cms-kern.js');
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

// pagina's die de editor niet bewerkt: de editor zelf en het voorbeeldvenster (een demo met eigen script)
const NIET = new Set(['beheer/index.html', 'beheer/oud/index.html', 'venster/index.html']);
// plekken waar het script van de site de tekst zelf zet (die tekst in de bron is dan niet wat de bezoeker ziet): niet markeren
const DYNAMISCH = /\b(id="(demo-content|pf-now|form-status|contact-submit)"|class="(lbl|t-lbl)")/;
const uitsluiten = (el) => { for (let o = el; o; o = o.ouder) if (DYNAMISCH.test(o.attrs || '')) return true; return false; };

export function paginas(root = REPO) {
  const uit = [];
  (function loop(map, rel) {
    for (const f of fs.readdirSync(map, { withFileTypes: true })) {
      const r = rel ? rel + '/' + f.name : f.name;
      if (f.isDirectory()) { if (!['.git', 'node_modules', 'assets', 'werk-logos', 'fonts'].includes(f.name)) loop(path.join(map, f.name), r); }
      else if (/\.html$/.test(f.name) && !NIET.has(r)) uit.push(r);
    }
  })(root, '');
  return uit.sort();
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const controle = process.argv.includes('--controle');
  let nieuw = 0, bestanden = 0, probleem = 0, tekst = 0, beeld = 0;
  for (const p of paginas()) {
    const bron = fs.readFileSync(path.join(REPO, p), 'utf8');
    const m = K.markeer(bron, { uitsluiten });
    if (controle) {
      if (m.nieuw) { console.log('NIEUWE PLEKKEN zonder markering in', p, '(' + m.nieuw + ')'); probleem++; }
      let git = null; try { git = execFileSync('git', ['show', 'HEAD:' + p], { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) {}
      const lf = (x) => x.split(String.fromCharCode(13, 10)).join(String.fromCharCode(10));      // op Windows kan de werkmap CRLF hebben; git bewaart LF
      if (git !== null && lf(K.haalMarkering(git)) !== lf(K.haalMarkering(bron))) { console.log('WIJKT AF van git buiten de markeringen:', p); probleem++; }
    } else if (m.nieuw) { fs.writeFileSync(path.join(REPO, p), m.html); nieuw += m.nieuw; bestanden++; }
    const l = K.lijst(m.html); tekst += l.filter((x) => x.soort === 'tekst').length; beeld += l.filter((x) => x.soort === 'beeld').length;
  }
  console.log((controle ? 'Controle: ' : 'Gemarkeerd: ') + (controle ? '' : nieuw + ' nieuwe plekken in ' + bestanden + ' bestanden; ') + 'totaal ' + tekst + ' tekstelementen en ' + beeld + ' afbeeldingen' + (probleem ? '; PROBLEMEN: ' + probleem : ''));
  process.exit(probleem ? 1 : 0);
}
