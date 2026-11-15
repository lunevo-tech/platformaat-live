// Bouwt V2 van platformaat.be: één map per taal (/nl/, /fr/, /en/), later /de/.
// Gebruik: node _bron/bouw.mjs   (vanuit de map v2)
// Een taal toevoegen: tekst/<code>.mjs maken en de code in TALEN zetten.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const UIT = path.resolve(HIER, '..');
const TALEN = ['nl', 'fr', 'en'];
const BASIS = 'https://platformaat.be/'; // toekomstig adres; V2 staat op noindex zolang het geen «ja» heeft
const AGENDA = 'https://cal.com/platformaat/15min';
const TEL = '+32483851322';
const MAIL = 'info@platformaat.be';
const BEDRIJF = { naam: 'PlatforMaat', nummer: '1004.326.518', btw: 'BE 1004.326.518', adres: 'Meetjeslandstraat 44, 2660 Antwerpen' };

const tekst = {};
for (const t of TALEN) tekst[t] = (await import(`./tekst/${t}.mjs`)).default;

// Pagina's: sleutel → pad per taal (eigen adres per taal). Inhoud staat in _bron/inhoud/*.mjs,
// elk bestand exporteert een lijst { sleutel, slug: {nl,fr,en}, nl: {...}, fr: {...}, en: {...} }.
const PAGINAS = { home: { nl: '', fr: '', en: '' } };
const INHOUD = [];
for (const f of fs.readdirSync(path.join(HIER, 'inhoud')).filter((x) => x.endsWith('.mjs')).sort()) {
  for (const p of (await import(`./inhoud/${f}`)).default) {
    for (const c of TALEN) if (!p[c] || !p.slug[c]) throw new Error(`pagina ${p.sleutel} mist taal ${c}`);
    PAGINAS[p.sleutel] = Object.fromEntries(TALEN.map((c) => [c, `${p.slug[c]}/`]));
    INHOUD.push(p);
  }
}
const bestaat = (sleutel) => Boolean(PAGINAS[sleutel]);
const link = (taal, sleutel, diepte) => `${rel(diepte)}${taal}/${PAGINAS[sleutel][taal]}`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rel = (diepte) => '../'.repeat(diepte);
const url = (taal, sleutel) => `${BASIS}${taal}/${PAGINAS[sleutel][taal]}`;

const ICOON = {
  prijs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12.5 11.5 5H19v7.5L11.5 20z"/><circle cx="15.2" cy="8.8" r="1.4"/></svg>',
  sleutel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="8" cy="12" r="3.5"/><path d="M11.5 12H20m-3 0v3m-3-3v2"/></svg>',
  eu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.4 2.3 3.5 5 3.5 8s-1.1 5.7-3.5 8c-2.4-2.3-3.5-5-3.5-8S9.6 6.3 12 4z"/></svg>',
  pijl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h13m-5-5 5 5-5 5"/></svg>',
};

function maatlat(labels) {
  // getekende maatlat: kleine streepjes per 10, grote per 100, drie mijlpalen
  let streep = '';
  for (let x = 0; x <= 1000; x += 10) {
    const groot = x % 100 === 0;
    streep += `<line class="tick${groot ? ' tick-major' : ''}" x1="${x}" x2="${x}" y1="${groot ? 8 : 20}" y2="32"/>`;
  }
  return `<figure class="ruler" aria-hidden="true"><svg viewBox="-2 0 1004 44" preserveAspectRatio="none">${streep}<rect class="mark" x="0" y="36" width="340" height="4" rx="2"/></svg><figcaption>${labels.map((l) => `<span>${esc(l)}</span>`).join('')}</figcaption></figure>`;
}

const logo = (diepte) => `<picture><source srcset="${rel(diepte)}assets/logo-dark.svg" media="(prefers-color-scheme: dark)"><img src="${rel(diepte)}assets/logo.svg" width="2050" height="305" alt="PlatforMaat"></picture>`;

function kop(t, sleutel, diepte) {
  const n = t.nav;
  const doel = (k) => (bestaat(k) ? link(t.code, k, diepte) : `${rel(diepte)}${t.code}/#${k}`);
  const items = ['aanbod', 'voorbeelden', 'prijzen', 'werkwijze', 'contact']
    .map((k) => `<li><a href="${doel(k)}"${sleutel === k ? ' aria-current="page"' : ''}>${esc(n[k])}</a></li>`).join('');
  const talen = TALEN.map((c) => {
    const o = tekst[c];
    if (c === t.code) return `<span aria-current="page" lang="${o.hreflang}" title="${esc(o.naam)}">${o.kort}</span>`;
    return `<a href="${rel(diepte)}${c}/${PAGINAS[sleutel][c]}" hreflang="${o.hreflang}" lang="${o.hreflang}" title="${esc(o.naam)}">${o.kort}</a>`;
  }).join('');
  return `<a class="skip" href="#inhoud">${esc(t.skip)}</a>
<header class="site-head"><div class="wrap">
<a class="brand" href="${rel(diepte)}${t.code}/">${logo(diepte)}</a>
<nav class="nav" aria-label="${esc(n.aanbod)}"><ul>${items}</ul></nav>
<details class="menu"><summary>${esc(t.menu)}</summary><div class="menu-panel"><ul>${items}</ul></div></details>
<nav class="lang" aria-label="${esc(t.taalLabel)}">${talen}</nav>
</div></header>`;
}

function voet(t, diepte) {
  const v = t.voet;
  const links = v.links.filter(([, s]) => bestaat(s)).map(([l, s]) => `<li><a href="${rel(diepte)}${t.code}/${PAGINAS[s][t.code]}">${esc(l)}</a></li>`).join('');
  return `<footer class="site-foot"><div class="wrap">
<div class="foot-grid">
<div><span class="foot-logo">${logo(diepte)}</span><p>${esc(v.over)}</p></div>
<div><p class="foot-title">${esc(v.contact)}</p><ul><li><a href="tel:${TEL}">0483 85 13 22</a></li><li><a href="mailto:${MAIL}">${MAIL}</a></li><li>${esc(BEDRIJF.adres)}</li></ul></div>
<div><p class="foot-title">${esc(v.meer)}</p><ul>${links || `<li>${esc(v.cookies)}</li>`}</ul></div>
</div>
<div class="colofon"><span>${BEDRIJF.naam}</span><span>${esc(v.ondernemingsnummer)} ${BEDRIJF.nummer}</span><span>${esc(v.btw)} ${BEDRIJF.btw}</span><span>${esc(BEDRIJF.adres)}</span>${links ? `<span>${esc(v.cookies)}</span>` : ''}</div>
</div></footer>`;
}

function hoofd(t, sleutel, diepte, title, description, extraLd = []) {
  const alt = TALEN.map((c) => `<link rel="alternate" hreflang="${tekst[c].hreflang}" href="${url(c, sleutel)}">`).join('\n');
  const ld = { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: BEDRIJF.naam, url: url(t.code, sleutel), telephone: TEL, email: MAIL, vatID: BEDRIJF.btw, inLanguage: t.hreflang, address: { '@type': 'PostalAddress', streetAddress: 'Meetjeslandstraat 44', postalCode: '2660', addressLocality: 'Antwerpen', addressCountry: 'BE' }, areaServed: 'BE', description };
  return `<!doctype html>
<html lang="${t.hreflang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; form-action 'self' mailto:; base-uri 'self'; object-src 'none'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url(t.code, sleutel)}">
${alt}
<link rel="alternate" hreflang="x-default" href="${BASIS}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:locale" content="${t.hreflang.replace('-', '_')}">
<meta property="og:image" content="${BASIS}assets/og-image.png">
<link rel="icon" href="${rel(diepte)}assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${rel(diepte)}assets/apple-touch-icon.png">
<link rel="preload" href="${rel(diepte)}fonts/hanken-grotesk-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${rel(diepte)}css/site.css">
<script src="${rel(diepte)}js/site.js" defer></script>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
${extraLd.map((x) => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('\n')}
</head>`;
}

// ---------- algemene pagina ----------
// Blokken in de inhoud:
//   { h1, lead, title, description }                      bovenaan (verplicht)
//   blokken: [
//     { type: 'tekst', h2, p: [..] }
//     { type: 'items', h2, intro?, items: [[titel, tekst], ..] }
//     { type: 'lijst', h2, items: [..] }
//     { type: 'stappen', h2, items: [[titel, tekst], ..] }
//     { type: 'faq', h2, items: [[vraag, antwoord], ..] }
//     { type: 'links', h2, items: [[sleutel, uitleg], ..] }   interne links naar andere pagina's
//     { type: 'prijzen', h2, items: [[naam, bedrag, sub, tekst], ..], noot? }
//     { type: 'case', ... }  zie caseBlok()
//     { type: 'tabel', h2, kop: [..], rijen: [[..], ..] }
//   ]
// Tekst mag eenvoudige opmaak bevatten via **vet** en [linktekst](sleutel) naar een andere pagina.
function opmaak(s, t, d) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\(([a-z0-9-]+)\)/g, (m, txt, k) => (bestaat(k) ? `<a href="${link(t.code, k, d)}">${txt}</a>` : txt));
}

function caseBlok(b, t, d) {
  // Een echte naam of logo verschijnt alleen met echt: true én een ingevulde toestemming.
  // Een echte case zonder ingevulde toestemming wordt helemaal niet getoond (geen naam, geen cijfers).
  const toon = b.echt === true && String(b.toestemming || '').trim() !== '';
  if (b.echt === true && !toon) return '';
  const naam = toon ? b.echteNaam : b.naam;
  const label = toon ? (b.labelEcht ? `<p class="tag">${esc(b.labelEcht)}</p>` : '') : `<p class="tag">${esc(t.voorbeeldLabel)}</p>`;
  return `<article class="example case"><h3>${esc(naam)}</h3>${b.p.map((x) => `<p>${opmaak(x, t, d)}</p>`).join('')}${b.rijen ? `<dl>${b.rijen.map(([a, c]) => `<dt>${esc(a)}</dt><dd>${esc(c)}</dd>`).join('')}</dl>` : ''}${label}</article>`;
}

function blok(b, t, d, i) {
  const id = `b${i}`;
  const kopje = b.h2 ? `<h2 id="${id}">${esc(b.h2)}</h2>` : '';
  const intro = b.intro ? `<p class="lead-sm">${opmaak(b.intro, t, d)}</p>` : '';
  const wrapS = (inner, cls = '') => `<section class="band${cls}"${b.h2 ? ` aria-labelledby="${id}"` : ''}><div class="wrap">${kopje ? `<div class="band-head">${kopje}${intro}</div>` : ''}${inner}</div></section>`;
  switch (b.type) {
    case 'tekst': return wrapS(`<div class="prose">${b.p.map((x) => `<p>${opmaak(x, t, d)}</p>`).join('')}</div>`);
    case 'items': return wrapS(`<dl class="offer">${b.items.map(([k, v]) => `<div><dt>${opmaak(k, t, d)}</dt><dd>${opmaak(v, t, d)}</dd></div>`).join('')}</dl>`);
    case 'lijst': return wrapS(`<ul class="checks">${b.items.map((x) => `<li>${opmaak(x, t, d)}</li>`).join('')}</ul>`);
    case 'stappen': return wrapS(`<ol class="steps">${b.items.map(([k, v]) => `<li><h3>${esc(k)}</h3><p>${opmaak(v, t, d)}</p></li>`).join('')}</ol>`);
    case 'faq': return wrapS(`<div class="faq">${b.items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${opmaak(a, t, d)}</p></details>`).join('')}</div>`);
    case 'links': return wrapS(`<ul class="cards">${b.items.filter(([k]) => bestaat(k)).map(([k, v]) => `<li><a href="${link(t.code, k, d)}"><strong>${esc(titelVan(k, t.code))}</strong><span>${esc(v)}</span></a></li>`).join('')}</ul>`);
    case 'prijzen': return wrapS(`<div class="prices">${b.items.map(([k, bedrag, sub, v]) => `<article class="price"><h3>${esc(k)}</h3><p class="amount">${esc(bedrag)}<small>${esc(sub)}</small></p><p>${opmaak(v, t, d)}</p></article>`).join('')}</div>${b.noot ? `<p class="note">${opmaak(b.noot, t, d)}</p>` : ''}`);
    case 'cases': return wrapS(`<div class="examples">${b.items.map((c) => caseBlok(c, t, d)).join('')}</div>`);
    case 'tabel': return wrapS(`<div class="table-wrap" tabindex="0" role="region" aria-labelledby="${id}"><table><thead><tr>${b.kop.map((x) => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${b.rijen.map((r) => `<tr>${r.map((x, j) => (j === 0 ? `<th scope="row">${esc(x)}</th>` : `<td>${opmaak(x, t, d)}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`);
    case 'calculator': return wrapS(`<form class="calc" id="calc" data-uit="${esc(b.uit)}" data-lang="${t.hreflang}">${b.velden.map(([k, l, v]) => `<label>${esc(l)}<input name="${k}" type="number" inputmode="decimal" min="0" step="any" value="${v}"></label>`).join('')}<p class="calc-out" id="calc-uit" role="status" aria-live="polite"></p><p class="note">${esc(b.noot)}</p></form>`);
    default: throw new Error(`onbekend bloktype ${b.type}`);
  }
}

const titelVan = (sleutel, taal) => {
  const p = INHOUD.find((x) => x.sleutel === sleutel);
  return p ? (p[taal].kort || p[taal].h1) : sleutel;
};

function slotBlok(t, d) {
  const s = t.slot;
  return `<section class="band contact" aria-labelledby="t-slot"><div class="wrap contact-grid">
<div class="band-head"><h2 id="t-slot">${esc(s.h2)}</h2><p>${esc(s.p)}</p></div>
<ul class="reach"><li><a class="btn btn-main" href="${AGENDA}" rel="noopener">${esc(t.home.agenda)} ${ICOON.pijl}</a></li><li><a href="tel:${TEL}">0483 85 13 22</a></li><li><a href="mailto:${MAIL}">${MAIL}</a></li></ul>
</div></section>`;
}

function pagina(p, c) {
  const t = tekst[c], x = p[c], d = 1 + p.slug[c].split('/').length;
  const ld = [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'PlatforMaat', item: url(c, 'home') },
    ...(p.ouder ? [{ '@type': 'ListItem', position: 2, name: titelVan(p.ouder, c), item: url(c, p.ouder) }] : []),
    { '@type': 'ListItem', position: p.ouder ? 3 : 2, name: x.kort || x.h1, item: url(c, p.sleutel) }] }];
  const faq = (x.blokken || []).find((b) => b.type === 'faq');
  if (faq) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/\*\*|\[|\]\([a-z0-9-]+\)/g, '') } })) });
  const kruim = `<nav class="crumbs" aria-label="${esc(t.kruimLabel)}"><ol><li><a href="${link(c, 'home', d)}">PlatforMaat</a></li>${p.ouder ? `<li><a href="${link(c, p.ouder, d)}">${esc(titelVan(p.ouder, c))}</a></li>` : ''}<li aria-current="page">${esc(x.kort || x.h1)}</li></ol></nav>`;
  return `${hoofd(t, p.sleutel, d, x.title, x.description, ld)}
<body>
${kop(t, p.sleutel, d)}
<main id="inhoud">
<section class="page-hero"><div class="wrap">${kruim}<h1>${esc(x.h1)}</h1>${x.lead ? `<p class="hero-lead">${opmaak(x.lead, t, d)}</p>` : ''}</div></section>
${(x.blokken || []).map((b, i) => blok(b, t, d, i)).join('\n')}
${p.geenSlot ? '' : slotBlok(t, d)}
</main>
${voet(t, d)}
</body>
</html>
`;
}

function home(t) {
  const h = t.home, f = h.form, d = 1;
  const feitIcoon = [ICOON.prijs, ICOON.sleutel, ICOON.eu];
  return `${hoofd(t, 'home', d, h.title, h.description)}
<body>
${kop(t, 'home', d)}
<main id="inhoud">
<section class="hero"><div class="wrap">
<div class="hero-grid">
<div><h1>${h.h1}</h1><p class="hero-lead">${esc(h.lead)}</p>
<div class="hero-actions"><a class="btn btn-main" href="${AGENDA}" rel="noopener">${esc(h.cta)} ${ICOON.pijl}</a><a class="btn btn-quiet" href="tel:${TEL}">${esc(h.bel)}</a></div></div>
<ul class="facts">${h.feiten.map(([k, v], i) => `<li>${feitIcoon[i]}<span><strong>${esc(k)}</strong>${esc(v)}</span></li>`).join('')}</ul>
</div>
${maatlat(h.maatlat)}
</div></section>

<section class="band" id="aanbod" aria-labelledby="t-aanbod"><div class="wrap">
<div class="band-head"><h2 id="t-aanbod">${esc(h.aanbodTitel)}</h2><p>${esc(h.aanbodIntro)}</p></div>
<dl class="offer">${h.aanbod.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
</div></section>

<section class="band" aria-labelledby="t-waarom"><div class="wrap why">
<div class="band-head"><h2 id="t-waarom">${esc(h.waaromTitel)}</h2><p>${esc(h.waaromIntro)}</p></div>
<ol>${h.waarom.map(([k, v]) => `<li><div><h3>${esc(k)}</h3><p>${esc(v)}</p></div></li>`).join('')}</ol>
</div></section>

<section class="band" id="voorbeelden" aria-labelledby="t-vb"><div class="wrap">
<div class="band-head"><h2 id="t-vb">${esc(h.vbTitel)}</h2><p>${esc(h.vbIntro)}</p></div>
<div class="examples">${h.vb.map(([k, v, rijen]) => `<article class="example"><h3>${esc(k)}</h3><p>${esc(v)}</p><dl>${rijen.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl><p class="tag">${esc(h.vbTag)}</p></article>`).join('')}</div>
</div></section>

<section class="band" id="prijzen" aria-labelledby="t-prijs"><div class="wrap">
<div class="band-head"><h2 id="t-prijs">${esc(h.prijsTitel)}</h2><p>${esc(h.prijsIntro)}</p></div>
<div class="prices">${h.prijzen.map(([k, bedrag, sub, v]) => `<article class="price"><h3>${esc(k)}</h3><p class="amount">${esc(bedrag)}<small>${esc(sub)}</small></p><p>${esc(v)}</p></article>`).join('')}</div>
<p class="note">${esc(h.prijsNoot)}</p>
</div></section>

<section class="band" id="werkwijze" aria-labelledby="t-stap"><div class="wrap">
<div class="band-head"><h2 id="t-stap">${esc(h.stapTitel)}</h2><p>${esc(h.stapIntro)}</p></div>
<ol class="steps">${h.stappen.map(([k, v]) => `<li><h3>${esc(k)}</h3><p>${esc(v)}</p></li>`).join('')}</ol>
</div></section>

<section class="band contact" id="contact" aria-labelledby="t-contact"><div class="wrap contact-grid">
<div><div class="band-head"><h2 id="t-contact">${esc(h.contactTitel)}</h2><p>${esc(h.contactIntro)}</p></div>
<ul class="reach"><li><a class="btn btn-main" href="${AGENDA}" rel="noopener">${esc(h.agenda)} ${ICOON.pijl}</a></li><li><a href="tel:${TEL}">0483 85 13 22</a></li><li><a href="mailto:${MAIL}">${MAIL}</a></li><li class="soft">${esc(BEDRIJF.adres)}</li></ul></div>
<form id="vraag" novalidate data-mail="${MAIL}" data-onderwerp="${esc(f.onderwerp)}" data-test="${esc(f.test)}" data-leeg="${esc(f.leeg)}">
<h3>${esc(f.titel)}</h3>
<label>${esc(f.naam)}<input name="naam" autocomplete="name" required></label>
<label>${esc(f.email)}<input name="email" type="email" autocomplete="email" required></label>
<label>${esc(f.bericht)}<textarea name="bericht" required></textarea></label>
<label class="hp" aria-hidden="true">${esc(f.hp)}<input name="website" tabindex="-1" autocomplete="off"></label>
<button class="btn btn-main" type="submit">${esc(f.knop)} ${ICOON.pijl}</button>
<p class="form-status" role="status" hidden></p>
<p class="form-legal">${esc(f.legal)}${bestaat('privacy') ? ` <a href="${PAGINAS.privacy[t.code]}">${esc(f.privacy)}</a>` : ''}</p>
</form>
</div></section>
</main>
${voet(t, d)}
</body>
</html>
`;
}

function kiezer() {
  const nl = tekst.nl;
  const alt = TALEN.map((c) => `<link rel="alternate" hreflang="${tekst[c].hreflang}" href="${url(c, 'home')}">`).join('\n');
  return `<!doctype html>
<html lang="nl-BE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; base-uri 'self'; object-src 'none'">
<title>${esc(nl.kies.title)}</title>
<meta name="description" content="${esc(nl.kies.lead)}">
${alt}
<link rel="alternate" hreflang="x-default" href="${BASIS}">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="css/site.css">
</head>
<body>
<main class="chooser"><div>
<span class="chooser-logo">${logo(0)}</span><h1 class="sr">PlatforMaat</h1>
<ul>${TALEN.map((c) => `<li lang="${tekst[c].hreflang}"><a class="btn btn-quiet" href="${c}/" hreflang="${tekst[c].hreflang}">${esc(tekst[c].naam)} ${ICOON.pijl}</a><p class="chooser-lead">${esc(tekst[c].kies.lead)}</p></li>`).join('')}</ul>
</div></main>
</body>
</html>
`;
}

for (const c of TALEN) {
  fs.mkdirSync(path.join(UIT, c), { recursive: true });
  fs.writeFileSync(path.join(UIT, c, 'index.html'), home(tekst[c]));
}
fs.writeFileSync(path.join(UIT, 'index.html'), kiezer());
let n = 0;
for (const p of INHOUD) for (const c of TALEN) {
  const map = path.join(UIT, c, p.slug[c]);
  fs.mkdirSync(map, { recursive: true });
  fs.writeFileSync(path.join(map, 'index.html'), pagina(p, c));
  n++;
}
// 404: één pagina in drie talen (GitHub Pages toont /404.html voor elk onbekend adres)
fs.writeFileSync(path.join(UIT, '404.html'), fout404());
// sitemap met hreflang-alternates
const sm = Object.keys(PAGINAS).map((k) => TALEN.map((c) => `<url><loc>${url(c, k)}</loc>${TALEN.map((a) => `<xhtml:link rel="alternate" hreflang="${tekst[a].hreflang}" href="${url(a, k)}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${BASIS}"/></url>`).join('\n')).join('\n');
fs.writeFileSync(path.join(UIT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sm}\n</urlset>\n`);
console.log(`gebouwd: ${TALEN.length} startpagina's, ${n} pagina's, taalkeuze, 404, sitemap (${Object.keys(PAGINAS).length * TALEN.length} adressen)`);

function fout404() {
  // absolute paden, want 404 kan op elke diepte getoond worden; V2 staat nu onder /v2/
  const b = '/v2/';
  return `<!doctype html>
<html lang="nl-BE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; base-uri 'self'; object-src 'none'">
<title>Pagina niet gevonden · Page introuvable · Page not found | PlatforMaat</title>
<meta name="description" content="Deze pagina bestaat niet. Cette page n’existe pas. This page does not exist.">
<link rel="icon" href="${b}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${b}css/site.css">
</head>
<body>
<main class="chooser" id="inhoud"><div>
<span class="chooser-logo"><img src="${b}assets/logo.svg" width="2050" height="305" alt="PlatforMaat"></span>
<h1>${esc(tekst.nl.fout.h1)}</h1>
<ul>${TALEN.map((c) => `<li lang="${tekst[c].hreflang}"><p class="chooser-lead">${esc(tekst[c].fout.p)}</p><a class="btn btn-quiet" href="${b}${c}/">${esc(tekst[c].fout.knop)} ${ICOON.pijl}</a></li>`).join('')}</ul>
</div></main>
</body>
</html>
`;
}
