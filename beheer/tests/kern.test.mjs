// Toetsen voor de kern van de directe modus (beheer/cms-kern.js). Draaien: node --test beheer/tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { paginas } from '../tools/markeer.mjs';
const K = createRequire(import.meta.url)('../cms-kern.js');
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const lf = (s) => s.split(String.fromCharCode(13, 10)).join(String.fromCharCode(10));
const pagina = (p) => lf(fs.readFileSync(path.join(REPO, p), 'utf8'));
const vorm = (h) => K.ontleed(h).alle.map((k) => k.tag + '|' + (k.attrs || '')).join('\n');      // alle tags met hun attributen, in volgorde

const DOC = (b) => '<!doctype html><html><head><title>T</title></head><body>' + b + '</body></html>';

test('markeren zet data-cms op elementen met tekst en op lokale afbeeldingen, en niets anders', () => {
  const h = DOC('<h1>Kop</h1><p>Hallo <b>wereld</b> dag</p><img src="a.png" alt="x"><img src="https://x/y.png"><script>var a="tekst";</script><svg><text>logo</text></svg><div><span>   </span></div>');
  const m = K.markeer(h);
  assert.equal(m.nieuw, 4);
  assert.ok(/<h1 data-cms="t1">Kop<\/h1>/.test(m.html) && /<p data-cms="t2">/.test(m.html) && /<b data-cms="t3">/.test(m.html) && /<img data-cms="i1" src="a.png"/.test(m.html));
  assert.ok(!/<script data-cms/.test(m.html) && !/<svg data-cms/.test(m.html) && !/<div data-cms/.test(m.html));
  assert.equal(K.haalMarkering(m.html), h);
  assert.equal(K.markeer(m.html).html, m.html);      // idempotent
});

test('tekststukken: alleen tekst die rechtstreeks in het element staat, commentaar scheidt, entiteiten worden ontcijferd', () => {
  const m = K.markeer(DOC('<p>Een <em>mooie</em> dag &amp; <!-- c --> nacht &nbsp;<br>laatste</p>'));
  const l = K.lijst(m.html).find((x) => x.tag === 'p');
  assert.deepEqual(l.stukken.map((s) => s.tekst), ['Een ', ' dag & ', ' nacht  ', 'laatste']);
  assert.deepEqual(l.stukken.map((s) => s.k), [0, 1, 2, 3]);
});

test('opslaan zonder wijzigingen laat de bron byte voor byte gelijk', () => {
  for (const p of paginas(REPO)) { const m = K.markeer(pagina(p)).html; assert.equal(K.pas(m, []).html, m, p); }
});

test('een wijziging verandert alleen dat tekststuk (spaties eromheen blijven), niets anders', () => {
  const m = K.markeer(DOC('<p>\n   Hallo <b>wereld</b>\n   dag\n</p>')).html;
  const r = K.pas(m, [{ soort: 'tekst', id: 't1', k: 1, orig: 'dag', nieuw: 'avond & <nacht>' }]);
  assert.deepEqual(r.fouten, []);
  assert.equal(r.html, m.replace('dag', 'avond &amp; &lt;nacht&gt;'));
  assert.equal(vorm(r.html), vorm(m));
});

test('vijandige tekst kan geen html of attribuut invoegen: de structuur blijft gelijk', () => {
  const m = K.markeer(DOC('<p>Hallo wereld</p><a href="/x">Link</a>')).html;
  for (const slecht of ['</p><script>alert(1)</script>', '<img src=x onerror=alert(1)>', '" onclick="x', "'; DROP", '&lt;b&gt;', '&#60;script&#62;', '  regeleinde \n tweede', '<!-- commentaar', '<![CDATA[', 'emoji 😀 éè']) {
    const r = K.pas(m, [{ soort: 'tekst', id: 't1', k: 0, orig: 'Hallo wereld', nieuw: slecht }]);
    assert.deepEqual(r.fouten, []);
    assert.equal(vorm(r.html), vorm(m), 'structuur veranderd door: ' + slecht);
    const l = K.lijst(r.html).find((x) => x.id === 't1');
    assert.equal(K.norm(l.stukken[0].tekst), K.norm(slecht));      // wat je typt staat er letterlijk als tekst
    assert.ok(!/<script|onerror|onclick/.test(K.ontleed(r.html).alle.map((k) => k.attrs).join('')) || /onclick/.test(slecht), 'geen nieuw attribuut');
  }
});

test('verouderde of onbekende bewerkingen worden geweigerd en schrijven niets', () => {
  const m = K.markeer(DOC('<p>Hallo</p><p>Dubbel</p>')).html;
  assert.equal(K.pas(m, [{ soort: 'tekst', id: 't1', k: 0, orig: 'Iets anders', nieuw: 'x' }]).fouten[0].reden, 'verouderd');
  assert.equal(K.pas(m, [{ soort: 'tekst', id: 't9', k: 0, orig: 'Hallo', nieuw: 'x' }]).fouten[0].reden, 'niet-gevonden');
  assert.equal(K.pas(m, [{ soort: 'tekst', id: 't1', k: 5, orig: 'Hallo', nieuw: 'x' }]).fouten[0].reden, 'geen-stuk');
  const dub = m.replace('t2', 't1'); assert.equal(K.pas(dub, [{ soort: 'tekst', id: 't1', k: 0, orig: 'Hallo', nieuw: 'x' }]).fouten[0].reden, 'dubbel');
  const r = K.pas(m, [{ soort: 'tekst', id: 't1', k: 0, orig: 'Hallo', nieuw: 'goed' }, { soort: 'tekst', id: 't2', k: 0, orig: 'fout', nieuw: 'x' }]);
  assert.equal(r.html, m);      // één fout: er wordt niets geschreven
});

test('afbeelding: src en alt aanpassen op attribuutniveau, ook zonder aanhalingstekens', () => {
  const m = K.markeer(DOC('<img src="a.png" alt="Oud &amp; slecht" width="10"><img src=b.png alt=x>')).html;
  const r = K.pas(m, [{ soort: 'attr', id: 'i1', naam: 'src', orig: 'a.png', nieuw: 'assets/nieuw "1".png' }, { soort: 'attr', id: 'i1', naam: 'alt', orig: 'Oud & slecht', nieuw: 'Nieuw <alt> & "x"' }, { soort: 'attr', id: 'i2', naam: 'src', orig: 'b.png', nieuw: 'c.png' }]);
  assert.deepEqual(r.fouten, []);
  assert.ok(r.html.includes('src="assets/nieuw &quot;1&quot;.png" alt="Nieuw &lt;alt&gt; &amp; &quot;x&quot;" width="10"') && r.html.includes('src="c.png"'));
  assert.equal(vorm(r.html).split('\n').length, vorm(m).split('\n').length);
});

test('alle pagina\'s van de site: markeren is omkeerbaar en idempotent, geen onbekende entiteiten, elk marker is uniek', () => {
  for (const p of paginas(REPO)) {
    const h = pagina(p), m = K.markeer(h).html;
    assert.equal(K.haalMarkering(m), h, 'omkeerbaar ' + p);
    assert.equal(K.markeer(m).html, m, 'idempotent ' + p);
    assert.deepEqual(K.ontbrekendeEntiteiten(h), [], 'onbekende entiteiten in ' + p);
    const ids = K.ontleed(m).alle.map((k) => (/ data-cms="([ti]\d+)"/.exec(k.attrs || '') || [])[1]).filter(Boolean);
    assert.equal(new Set(ids).size, ids.length, 'dubbele markering in ' + p);
  }
});

test('willekeurige bewerkingen op echte pagina\'s: alleen het gekozen stuk verandert', () => {
  let seed = 12345; const rnd = (n) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };
  const slechte = ['x', 'Een nieuwe zin met een komma, en een punt.', 'a & b < c > d', '"aanhalingstekens" en \'enkel\'', '</div><script>x</script>', 'lange tekst '.repeat(40)];
  const lijst = paginas(REPO); let gedaan = 0;
  for (let n = 0; n < 300; n++) {
    const p = lijst[rnd(lijst.length)], m = K.markeer(pagina(p)).html, l = K.lijst(m).filter((x) => x.soort === 'tekst' && x.stukken.length);
    const el = l[rnd(l.length)], st = el.stukken[rnd(el.stukken.length)], nieuw = slechte[rnd(slechte.length)];
    const r = K.pas(m, [{ soort: 'tekst', id: el.id, k: st.k, orig: st.tekst, nieuw }]);
    assert.deepEqual(r.fouten, [], p);
    // voor en na het gewijzigde stuk is de bron gelijk
    let a = 0; while (a < m.length && a < r.html.length && m[a] === r.html[a]) a++;
    let z = 0; while (z < m.length - a && z < r.html.length - a && m[m.length - 1 - z] === r.html[r.html.length - 1 - z]) z++;
    const oud = m.slice(a, m.length - z), nw = r.html.slice(a, r.html.length - z);
    assert.ok(nw.length <= tekstLengte(nieuw) + 8, 'te grote ingreep in ' + p);      // de vervanging is niet groter dan de nieuwe tekst (plus omringende spaties)
    void oud;
    assert.equal(vorm(r.html), vorm(m), 'structuur ' + p);
    const nu = K.lijst(r.html).find((x) => x.id === el.id).stukken[st.k].tekst;
    assert.equal(K.norm(nu), K.norm(nieuw));
    gedaan++;
  }
  assert.equal(gedaan, 300);
});
function tekstLengte(s) { return K.tekstVoorBron(s).length; }
