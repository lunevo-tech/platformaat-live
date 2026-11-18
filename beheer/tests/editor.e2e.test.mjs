// Browsertoetsen van de nieuwe editor (directe modus) tegen een nagebootste GitHub (mock-github.mjs): er gaat niets naar echt GitHub of naar platformaat.be.
// Nodig: playwright (zet ZM_PW_MAP op een map met node_modules/playwright-core); zonder playwright wordt dit bestand overgeslagen.
// Draaien:  ZM_PW_MAP=<map> node --test beheer/tests/editor.e2e.test.mjs      (ZM_BROWSERS=chromium,webkit voor meer browsers)
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { start } from './mock-github.mjs';
import { paginas } from '../tools/markeer.mjs';

const K = createRequire(import.meta.url)('../cms-kern.js');
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const lf = (s) => s.split(String.fromCharCode(13, 10)).join(String.fromCharCode(10));
const lees = (p) => lf(fs.readFileSync(path.join(REPO, p), 'utf8'));
let pw = null;
try { pw = createRequire(process.env.ZM_PW_MAP ? pathToFileURL(path.resolve(process.env.ZM_PW_MAP) + '/') : import.meta.url)('playwright-core'); } catch (e) { try { pw = createRequire(import.meta.url)('playwright'); } catch (x) {} }
const BROWSERS = (process.env.ZM_BROWSERS || 'chromium').split(',');
const TOKKEY = 'zm-token-lunevo-tech/platformaat-live';
const skip = !pw && 'playwright niet beschikbaar';

// het verschil tussen twee versies van een bestand: alles wat voor en na het veranderde stuk gelijk is, valt weg
function verschil(a, b) {
  let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
  let z = 0; while (z < a.length - i && z < b.length - i && a[a.length - 1 - z] === b[b.length - 1 - z]) z++;
  return { oud: a.slice(i, a.length - z), nieuw: b.slice(i, b.length - z), begin: i };
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function nieuweSessie(browserNaam, opties = {}) {
  const mock = await start(REPO, opties.mock), browser = await pw[browserNaam].launch(), ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 }, acceptDownloads: false });
  await ctx.addInitScript(([k, taal, token]) => { try { if (token) localStorage.setItem(k, 'testtoken'); if (taal && !localStorage.getItem('zm-editor-taal')) localStorage.setItem('zm-editor-taal', taal); } catch (e) {} }, [TOKKEY, opties.taal || 'nl', opties.token !== false]);
  const page = await ctx.newPage(), fouten = [];
  page.on('pageerror', (e) => fouten.push(String(e))); page.on('console', (m) => { if (m.type() === 'error') fouten.push('console: ' + m.text()); }); page.on('dialog', (d) => d.accept());
  await page.goto(mock.editorUrl());
  const s = { mock, browser, page, fouten, async sluit() { await browser.close(); await mock.stop(); } };
  return s;
}
async function wachtOpFrame(page) {
  await page.waitForSelector('#zm-frame');
  await page.waitForFunction(() => { const f = document.getElementById('zm-frame'); try { return f.contentDocument && f.contentDocument.readyState === 'complete' && f.contentDocument.querySelectorAll('[data-cms]').length > 5 && f.contentDocument.getElementById('zm-hl'); } catch (e) { return false; } }, null, { timeout: 15000 });
  return page.frames().find((f) => f !== page.mainFrame());
}
async function klikOp(page, frame, selector, n = 0) {      // echte muisklik midden op het eerste tekststuk van een element in het kader
  const r = await frame.evaluate(([sel, nr]) => {
    const e = document.querySelectorAll(sel)[nr]; e.scrollIntoView({ block: 'center', behavior: 'instant' });
    const nd = Array.from(e.childNodes).find((x) => x.nodeType === 3 && /[A-Za-z]/.test(x.nodeValue)); const rg = document.createRange(); rg.selectNodeContents(nd); const b = rg.getClientRects()[0];
    return { x: b.left + Math.min(b.width / 2, 30), y: b.top + b.height / 2 };
  }, [selector, n]);
  const fb = await (await page.$('#zm-frame')).boundingBox();
  await page.mouse.move(fb.x + r.x, fb.y + r.y); await page.mouse.click(fb.x + r.x, fb.y + r.y);
  await page.waitForSelector('.zm-paneel textarea'); await alleenHier(page);
}
async function alleenHier(page) {      // de editor zoekt dezelfde tekst op andere pagina's (standaard aangevinkt, net als de oude editor); de meeste toetsen willen alleen deze plek
  await page.waitForFunction(() => !document.body.textContent.includes('Zoeken waar deze tekst'));
  const v = await page.$('#zm-overal'); if (v) await v.uncheck();
}
Object.assign(Object, {});
const Sessie = null; void Sessie;

for (const browserNaam of BROWSERS) {
  const T = (naam, fn) => test(naam + ' [' + browserNaam + ']', { skip, timeout: 120000 }, async () => { const s = {}; try { await fn(s); } finally { if (s.s) await s.s.sluit(); } });
  const open = async (s, o) => { s.s = await nieuweSessie(browserNaam, o); if (o && o.token === false) return s.s; s.s.frame = await wachtOpFrame(s.s.page); return s.s; };

  T('inloggen met een token en de pagina openen', async (s) => {
    const x = await open(s, { token: false });
    await x.page.fill('input[type=password]', 'testtoken'); await x.page.click('button.zm-groot');
    x.frame = await wachtOpFrame(x.page);
    assert.ok(await x.page.$('#zm-frame')); assert.deepEqual(x.fouten, []);
  });

  T('tekst aanpassen met een echte klik: één commit, alleen dat stuk verandert, rest byte voor byte gelijk', async (s) => {
    const x = await open(s), voor = lees('index.html');
    assert.equal(await x.page.isDisabled('.zm-primair'), true, 'Opslaan staat uit zonder wijziging');
    await klikOp(x.page, x.frame, 'h1[data-cms]');
    await x.page.waitForSelector('.zm-paneel textarea');
    const oudTekst = (await x.page.inputValue('.zm-paneel textarea')).trim();
    await x.page.fill('.zm-paneel textarea', 'Een nieuwe kop & <b>test</b>');
    // meteen zichtbaar in de pagina
    assert.match(await x.frame.evaluate(() => document.querySelector('h1[data-cms]').textContent), /Een nieuwe kop & <b>test<\/b>/);
    await x.page.click('.zm-paneel >> text=Toepassen');
    assert.match(await x.page.textContent('.zm-primair'), /Opslaan \(1\)/);
    await x.page.click('.zm-primair'); await x.page.waitForSelector('.zm-paneel button:has-text("Zet live")');
    const tekst = await x.page.textContent('.zm-paneel');
    assert.match(tekst, /Controle voor het opslaan/); assert.match(tekst, /Een nieuwe kop/); assert.match(tekst, /ongewijzigd/); assert.match(tekst, /1 bestand/);
    assert.equal(x.mock.aantalCommits(), 0, 'nog niets geschreven vóór «Zet live»');
    await x.page.click('.zm-paneel button:has-text("Zet live")');
    await x.page.waitForFunction(() => /Opgeslagen/.test(document.getElementById('zm-toast')?.textContent || ''), null, { timeout: 15000 });
    assert.equal(x.mock.aantalCommits(), 1); assert.match(x.mock.st.opgeslagen[0].bericht, /^Website aangepast via de editor \(1 bestand\)/);
    const na = x.mock.bestand('index.html'), d = verschil(voor, na);
    assert.equal(d.nieuw.trim(), esc('Een nieuwe kop & <b>test</b>')); assert.equal(K.norm(K.ontcijfer(d.oud)), K.norm(oudTekst));
    assert.equal(K.haalMarkering(na).length - K.haalMarkering(voor).length, d.nieuw.length - d.oud.length);
    // de andere bestanden zijn identiek aan de repo
    for (const p of paginas(REPO)) if (p !== 'index.html') assert.equal(x.mock.bestand(p), lees(p), p);
    assert.deepEqual(K.ontleed(na).alle.map((k) => k.tag + '|' + k.attrs), K.ontleed(voor).alle.map((k) => k.tag + '|' + k.attrs), 'opbouw ongewijzigd (ook geen nieuwe tags uit de ingetypte tekst)');
    assert.deepEqual(x.fouten, []);
  });

  T('dezelfde tekst opnieuw invullen is geen wijziging; Opslaan blijft uit', async (s) => {
    const x = await open(s);
    await klikOp(x.page, x.frame, 'h1[data-cms]'); await x.page.waitForSelector('.zm-paneel textarea');
    const t0 = await x.page.inputValue('.zm-paneel textarea');
    await x.page.fill('.zm-paneel textarea', '   ' + t0.trim() + '  '); await x.page.click('.zm-paneel >> text=Toepassen');
    assert.equal(await x.page.isDisabled('.zm-primair'), true); assert.equal(x.mock.aantalCommits(), 0);
  });

  T('lege of letterloze tekst wordt geweigerd', async (s) => {
    const x = await open(s);
    await klikOp(x.page, x.frame, 'h1[data-cms]'); await x.page.waitForSelector('.zm-paneel textarea');
    await x.page.fill('.zm-paneel textarea', '123'); assert.match(await x.page.textContent('.zm-paneel'), /minstens één letter/);
    assert.equal(await x.page.isDisabled('.zm-paneel >> text=Toepassen'), true);
  });

  T('Annuleren en Escape draaien de wijziging terug', async (s) => {
    const x = await open(s), voor = await x.frame.evaluate(() => document.querySelector('h1[data-cms]').textContent);
    await klikOp(x.page, x.frame, 'h1[data-cms]'); await x.page.fill('.zm-paneel textarea', 'Tijdelijk'); await x.page.click('.zm-paneel >> text=Annuleren');
    assert.equal(await x.frame.evaluate(() => document.querySelector('h1[data-cms]').textContent), voor);
    await klikOp(x.page, x.frame, 'h1[data-cms]'); await x.page.fill('.zm-paneel textarea', 'Tijdelijk 2'); await x.page.keyboard.press('Escape');
    assert.equal(await x.frame.evaluate(() => document.querySelector('h1[data-cms]').textContent), voor); assert.equal(await x.page.isDisabled('.zm-primair'), true);
  });

  T('toetsenbord: tekstenlijst met filter opent het paneel, Escape sluit en geeft de focus terug', async (s) => {
    const x = await open(s);
    await x.page.focus('text=Teksten op deze pagina'); await x.page.keyboard.press('Enter');
    await x.page.waitForSelector('.zm-paneel[role=dialog]'); await x.page.fill('#zm-filter', 'a');
    await x.page.click('.zm-lijst button >> nth=0'); await x.page.waitForSelector('.zm-paneel textarea');
    assert.equal(await x.page.evaluate(() => document.activeElement && document.activeElement.tagName), 'TEXTAREA');
    await x.page.keyboard.press('Escape'); assert.equal(await x.page.$('.zm-paneel'), null);
    assert.ok(await x.page.evaluate(() => document.activeElement && document.activeElement !== document.body), 'focus is niet verloren');
  });

  T('Wat verandert er? toont de wijziging en Terugzetten haalt ze weer weg', async (s) => {
    const x = await open(s);
    await klikOp(x.page, x.frame, 'h1[data-cms]'); await x.page.fill('.zm-paneel textarea', 'Nieuwe test kop'); await x.page.click('.zm-paneel >> text=Toepassen');
    await x.page.click('#zm-wat'); await x.page.waitForSelector('.zm-item');
    assert.match(await x.page.textContent('.zm-item'), /Nieuwe test kop/);
    await x.page.click('.zm-item >> text=Terugzetten'); assert.match(await x.page.textContent('.zm-paneel'), /Nog niets aangepast/);
    assert.equal(await x.page.isDisabled('.zm-primair'), true);
  });

  T('verouderde bron: als iemand anders de tekst intussen veranderde, wordt er niets opgeslagen', async (s) => {
    const x = await open(s), voor = lees('index.html');
    const l = K.lijst(voor).find((e) => e.soort === 'tekst' && e.tag === 'h1'), oud = l.stukken[0].tekst;
    const at = voor.indexOf('data-cms="' + l.id + '"'), j = voor.indexOf(esc(oud), at) + esc(oud).length;      // juist in de h1 (de tekst staat ook in title en meta)
    x.mock.zetBestand('index.html', voor.slice(0, j) + ' (extern gewijzigd)' + voor.slice(j));
    await klikOp(x.page, x.frame, 'h1[data-cms]'); await x.page.fill('.zm-paneel textarea', 'Mijn versie'); await x.page.click('.zm-paneel >> text=Toepassen');
    await x.page.click('.zm-primair'); await x.page.waitForFunction(() => /niets opgeslagen/i.test(document.getElementById('zm-toast')?.textContent || ''));
    assert.equal(x.mock.aantalCommits(), 1, 'alleen de externe commit'); assert.equal(x.mock.bestand('index.html').includes('Mijn versie'), false);
    assert.equal(await x.page.$('.zm-paneel button:has-text("Zet live")'), null);
  });

  T('wedloop: de site verandert tussen controle en «Zet live»: niets overschreven, opnieuw gecontroleerd', async (s) => {
    const x = await open(s), anders = paginas(REPO).find((p) => p !== 'index.html');
    await klikOp(x.page, x.frame, 'h1[data-cms]'); await x.page.fill('.zm-paneel textarea', 'Wedloop kop'); await x.page.click('.zm-paneel >> text=Toepassen');
    await x.page.click('.zm-primair'); await x.page.waitForSelector('.zm-paneel button:has-text("Zet live")');
    x.mock.zetBestand(anders, lees(anders) + '\n<!-- extern -->\n');      // iemand anders slaat iets op
    await x.page.click('.zm-paneel button:has-text("Zet live")');
    await x.page.waitForFunction(() => /intussen/.test(document.getElementById('zm-toast')?.textContent || ''), null, { timeout: 10000 });
    await x.page.waitForSelector('.zm-paneel button:has-text("Zet live")');      // nieuwe controle
    assert.equal(x.mock.aantalCommits(), 1, 'nog niets van ons geschreven');
    await x.page.click('.zm-paneel button:has-text("Zet live")'); await x.page.waitForFunction(() => /Opgeslagen/.test(document.getElementById('toast')?.textContent || document.getElementById('zm-toast')?.textContent || ''), null, { timeout: 10000 });
    assert.equal(x.mock.aantalCommits(), 2); assert.ok(x.mock.bestand('index.html').includes('Wedloop kop')); assert.ok(x.mock.bestand(anders).includes('<!-- extern -->'), 'de externe wijziging is behouden');
  });

  T('vijandige tekst: geen nieuwe tags of attributen in de bron', async (s) => {
    const x = await open(s), voor = lees('index.html');
    await klikOp(x.page, x.frame, 'h1[data-cms]'); await x.page.fill('.zm-paneel textarea', '</h1><script>alert(1)</script><img src=x onerror=alert(2)> "quote" &amp; &lt;');
    await x.page.click('.zm-paneel >> text=Toepassen'); await x.page.click('.zm-primair'); await x.page.waitForSelector('.zm-paneel button:has-text("Zet live")'); await x.page.click('.zm-paneel button:has-text("Zet live")');
    await x.page.waitForFunction(() => /Opgeslagen/.test(document.getElementById('zm-toast')?.textContent || ''), null, { timeout: 10000 });
    const na = x.mock.bestand('index.html');
    assert.deepEqual(K.ontleed(na).alle.map((k) => k.tag + '|' + k.attrs), K.ontleed(voor).alle.map((k) => k.tag + '|' + k.attrs));
    assert.ok(!/<script>alert\(1\)/.test(na) && !/onerror=alert/.test(na.replace(/&lt;img[^&]*/g, '')));
    assert.deepEqual(x.fouten, []);
  });

  T('foto vervangen en beschrijving aanpassen', async (s) => {
    const x = await open(s);
    const info = await x.frame.evaluate(() => { const i = Array.from(document.querySelectorAll('img[data-cms^="i"]')).find((im) => /\.(png|jpe?g|webp)$/i.test(im.getAttribute('src') || '') && im.getAttribute('alt') !== null && im.getBoundingClientRect().width > 20); return i ? { sel: i.getAttribute('data-cms'), src: i.getAttribute('src'), alt: i.getAttribute('alt') } : null; });
    assert.ok(info, 'een foto met alt op de startpagina');
    await x.frame.evaluate((id) => document.querySelector('img[data-cms="' + id + '"]').scrollIntoView({ block: 'center', behavior: 'instant' }), info.sel); await x.page.waitForTimeout(400);      // de site scrolt zacht: even wachten
    const r = await x.frame.evaluate((id) => { const b = document.querySelector('img[data-cms="' + id + '"]').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, info.sel);
    const fb = await (await x.page.$('#zm-frame')).boundingBox(); await x.page.mouse.click(fb.x + r.x, fb.y + r.y);
    await x.page.waitForSelector('.zm-paneel input[type=file]');
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEElEQVR4nGP4z8DwHwyBNAA5qQr5dHgIqQAAAABJRU5ErkJggg==', 'base64');
    const pad = info.src.replace(/^\//, ''), is = /\.png$/i.test(pad);
    await x.page.setInputFiles('.zm-paneel input[type=file]', { name: 'nieuw.png', mimeType: 'image/png', buffer: png });
    await x.page.waitForFunction(() => /Foto vervangen/.test(document.getElementById('zm-toast')?.textContent || ''), null, { timeout: 10000 });
    await x.page.fill('#zm-alt', 'Een nieuwe beschrijving & meer'); await x.page.click('.zm-paneel >> text=Toepassen');
    assert.match(await x.page.textContent('.zm-primair'), /Opslaan \(2\)/);
    await x.page.click('.zm-primair'); await x.page.waitForSelector('.zm-paneel button:has-text("Zet live")'); assert.match(await x.page.textContent('.zm-paneel'), /nieuwe foto/);
    await x.page.click('.zm-paneel button:has-text("Zet live")'); await x.page.waitForFunction(() => /Opgeslagen/.test(document.getElementById('zm-toast')?.textContent || ''), null, { timeout: 10000 });
    assert.equal(x.mock.aantalCommits(), 1); const nieuw = x.mock.bestand(pad), oud = fs.readFileSync(path.join(REPO, pad));
    assert.ok(Buffer.isBuffer(nieuw) && !nieuw.equals(oud), 'het beeldbestand is vervangen (zelfde pad)'); void is;
    const na = x.mock.bestand('index.html'), voor = lees('index.html'), d = verschil(voor, na);
    assert.ok(d.nieuw.includes('Een nieuwe beschrijving &amp; meer') && K.ontcijfer(d.oud) === info.alt, 'alleen de alt-waarde veranderd');
    for (const p of paginas(REPO)) if (p !== 'index.html') assert.equal(x.mock.bestand(p), lees(p), p);
  });

  T('dezelfde tekst op meer pagina\'s: standaard overal, met vinkje alleen hier', async (s) => {
    const x = await open(s);
    // zoek een tekststuk dat op de startpagina én op minstens 2 andere pagina's staat
    const tellers = new Map(); paginas(REPO).forEach((p) => { const gezien = new Set(); K.lijst(lees(p)).forEach((e) => { if (e.soort === 'tekst') e.stukken.forEach((st) => gezien.add(K.norm(st.tekst))); }); gezien.forEach((tx) => { if (tx.length > 8) (tellers.get(tx) || tellers.set(tx, []).get(tx)).push(p); }); });
    const kandidaat = Array.from(tellers.entries()).find(([tx, ps]) => ps.includes('index.html') && ps.length >= 3 && ps.length <= 12);
    assert.ok(kandidaat, 'een gedeelde tekst gevonden'); const [tekst, pagina] = kandidaat;
    await x.page.click('text=Teksten op deze pagina'); await x.page.fill('#zm-filter', tekst.slice(0, 25));
    await x.page.click('.zm-lijst button >> nth=0'); await x.page.waitForSelector('.zm-paneel textarea');
    await x.page.waitForSelector('#zm-overal'); assert.equal(await x.page.isChecked('#zm-overal'), true); assert.match(await x.page.textContent('.zm-paneel'), new RegExp('op ' + pagina.length + ' pagina'));
    await x.page.fill('.zm-paneel textarea', 'Gedeelde nieuwe tekst'); await x.page.click('.zm-paneel >> text=Toepassen');
    await x.page.click('.zm-primair'); await x.page.waitForSelector('.zm-paneel button:has-text("Zet live")'); await x.page.click('.zm-paneel button:has-text("Zet live")');
    await x.page.waitForFunction(() => /Opgeslagen/.test(document.getElementById('zm-toast')?.textContent || ''), null, { timeout: 10000 });
    const gewijzigd = paginas(REPO).filter((p) => x.mock.bestand(p) !== lees(p)).sort();
    assert.deepEqual(gewijzigd, pagina.slice().sort());
    for (const p of gewijzigd) { const d = verschil(lees(p), x.mock.bestand(p)); assert.equal(d.nieuw.trim(), 'Gedeelde nieuwe tekst'); assert.equal(K.norm(K.ontcijfer(d.oud)), tekst); }
  });

  T('taal van de editor: Frans en Engels', async (s) => {
    const x = await open(s, { taal: 'fr' });
    assert.ok(await x.page.$('text=Enregistrer')); assert.ok(await x.page.$('text=Qu\'est-ce qui change ?')); assert.equal(await x.page.evaluate(() => document.documentElement.lang), 'fr');
    await x.page.selectOption('select[aria-label="Langue de l\'éditeur"]', 'en'); await x.page.waitForSelector('text=What changes?');
    assert.ok(await x.page.$('text=Undo last save')); assert.equal(await x.page.evaluate(() => document.documentElement.lang), 'en');
  });

  T('na de publicatie meldt de editor «Klaar» en toont de gepubliceerde pagina', async (s) => {
    const x = await open(s, { mock: { vertraging: 2500 } });
    await klikOp(x.page, x.frame, 'h1[data-cms]'); await x.page.fill('.zm-paneel textarea', 'Gepubliceerde kop'); await x.page.click('.zm-paneel >> text=Toepassen');
    await x.page.click('.zm-primair'); await x.page.waitForSelector('.zm-paneel button:has-text("Zet live")'); await x.page.click('.zm-paneel button:has-text("Zet live")');
    await x.page.waitForFunction(() => /Klaar: de site is bijgewerkt/.test(document.getElementById('zm-toast')?.textContent || ''), null, { timeout: 30000 });
    const f = await wachtOpFrame(x.page); assert.match(await f.evaluate(() => document.querySelector('h1[data-cms]').textContent), /Gepubliceerde kop/);
    assert.equal(await x.page.isDisabled('.zm-primair'), true);
  });

  T('laatste opslag ongedaan maken zet de site terug', async (s) => {
    const x = await open(s), voor = lees('index.html');
    await klikOp(x.page, x.frame, 'h1[data-cms]'); await x.page.fill('.zm-paneel textarea', 'Te herstellen kop'); await x.page.click('.zm-paneel >> text=Toepassen');
    await x.page.click('.zm-primair'); await x.page.waitForSelector('.zm-paneel button:has-text("Zet live")'); await x.page.click('.zm-paneel button:has-text("Zet live")');
    await x.page.waitForFunction(() => /Opgeslagen/.test(document.getElementById('zm-toast')?.textContent || ''), null, { timeout: 10000 });
    assert.notEqual(x.mock.bestand('index.html'), voor);
    await x.page.click('text=Laatste opslag ongedaan maken'); await x.page.waitForFunction(() => /Ongedaan gemaakt/.test(document.getElementById('zm-toast')?.textContent || ''), null, { timeout: 10000 });
    assert.equal(x.mock.bestand('index.html'), voor, 'precies zoals voor de opslag'); assert.equal(x.mock.aantalCommits(), 2);
  });

  T('na opslaan blijft de wijziging zichtbaar en kan ze opnieuw aangepast worden (voor de publicatie klaar is)', async (s) => {
    const x = await open(s, { mock: { vertraging: 60000 } });      // de "site" wordt pas na 60 s bijgewerkt
    await klikOp(x.page, x.frame, 'h1[data-cms]'); await x.page.fill('.zm-paneel textarea', 'Eerste versie kop'); await x.page.click('.zm-paneel >> text=Toepassen');
    await x.page.click('.zm-primair'); await x.page.waitForSelector('.zm-paneel button:has-text("Zet live")'); await x.page.click('.zm-paneel button:has-text("Zet live")');
    await x.page.waitForFunction(() => /Opgeslagen/.test(document.getElementById('zm-toast')?.textContent || ''), null, { timeout: 10000 });
    assert.match(await x.frame.evaluate(() => document.querySelector('h1[data-cms]').textContent), /Eerste versie kop/);
    await klikOp(x.page, x.frame, 'h1[data-cms]'); await x.page.waitForSelector('.zm-paneel textarea');
    assert.match(await x.page.inputValue('.zm-paneel textarea'), /Eerste versie kop/); await x.page.fill('.zm-paneel textarea', 'Tweede versie kop'); await x.page.click('.zm-paneel >> text=Toepassen');
    await x.page.click('.zm-primair'); await x.page.waitForSelector('.zm-paneel button:has-text("Zet live")'); await x.page.click('.zm-paneel button:has-text("Zet live")');
    await x.page.waitForFunction(() => /Opgeslagen/.test(document.getElementById('zm-toast')?.textContent || ''), null, { timeout: 10000 });
    for (let i = 0; i < 100 && x.mock.aantalCommits() < 2; i++) await new Promise((ok) => setTimeout(ok, 100));
    assert.equal(x.mock.aantalCommits(), 2); const d = verschil(lees('index.html'), x.mock.bestand('index.html')); assert.equal(d.nieuw.trim(), 'Tweede versie kop');
  });
}

test('de oude editor staat nog ongewijzigd in beheer/oud en verwijst naar zijn eigen bestanden', () => {
  const idx = lees('beheer/oud/index.html'); assert.match(idx, /src="editor\.js"/); assert.match(idx, /href="editor\.css"/); assert.ok(fs.existsSync(path.join(REPO, 'beheer/oud/editor.js')));
  assert.match(lees('beheer/oud/editor.js'), /new URL\('\.\.\/\.\.\/', location\.href\)/);
});
