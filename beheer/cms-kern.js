/* Kern van de directe modus van de editor (platformaat.be/beheer). Draait in de browser (window.CmsKern) en in Node (require).
   Principe: de HTML in de repo blijft de bron. Bewerkbare plekken krijgen eenmalig een markering data-cms="t12" (tekst) of data-cms="i3" (afbeelding).
   Opslaan past ALLEEN de gemarkeerde stukken aan, op tekstniveau, in de bron-HTML: het k-de tekststuk van element t12, of één attribuut (src, alt) van afbeelding i3.
   Alles buiten die stukken blijft byte voor byte gelijk. Er wordt nooit HTML ingevoegd: nieuwe tekst gaat altijd als tekst in de bron (& < > worden vervangen door entiteiten).
   Een «tekststuk» is een stuk tekst dat rechtstreeks in het element staat, tussen twee tags of commentaren, en minstens één letter bevat; opmaaktags in het element blijven staan. */
(function (wortel, fabriek) {
  if (typeof module === 'object' && module.exports) module.exports = fabriek(); else wortel.CmsKern = fabriek();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var VOID = { area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1, link: 1, meta: 1, param: 1, source: 1, track: 1, wbr: 1 };
  var RAW = { script: 1, style: 1, textarea: 1, title: 1 };           // inhoud wordt niet ontleed
  var NEGEER = { script: 1, style: 1, svg: 1, noscript: 1, template: 1, textarea: 1, head: 1, select: 1, option: 1, optgroup: 1, iframe: 1, canvas: 1, math: 1 };      // hierbinnen markeren we niets
  var TOKEN = /<!--[\s\S]*?-->|<(script|style|textarea|title)\b(?:"[^"]*"|'[^']*'|[^'">])*>[\s\S]*?<\/\1\s*>|<\/?[a-zA-Z][^\s\/>]*(?:"[^"]*"|'[^']*'|[^'">])*>|<!doctype[^>]*>/gi;
  var LETTER = /[A-Za-z\u00C0-\u024F\u0370-\u03FF\u0400-\u04FF]/;
  var ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', middot: '\u00b7', rarr: '\u2192', larr: '\u2190', hellip: '\u2026', ndash: '\u2013', mdash: '\u2014', laquo: '\u00ab', raquo: '\u00bb', euro: '\u20ac', copy: '\u00a9', times: '\u00d7', rsquo: '\u2019', lsquo: '\u2018', ldquo: '\u201c', rdquo: '\u201d', bull: '\u2022', check: '\u2713', shy: '\u00ad', eacute: '\u00e9', egrave: '\u00e8', agrave: '\u00e0', ecirc: '\u00ea', euml: '\u00eb', ccedil: '\u00e7', ocirc: '\u00f4', uuml: '\u00fc', ouml: '\u00f6', iuml: '\u00ef' };

  function norm(s) { return String(s || '').split(/\s+/).filter(Boolean).join(' '); }
  function ontcijfer(s) {
    return String(s).replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[A-Za-z][A-Za-z0-9]*);/g, function (m, e) {
      if (e.charAt(0) === '#') { var c = e.charAt(1) === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return c > 0 && c < 0x110000 ? String.fromCodePoint(c) : m; }
      return Object.prototype.hasOwnProperty.call(ENT, e) ? ENT[e] : m;
    });
  }
  function ontbrekendeEntiteiten(s) { var r = []; String(s).replace(/&([A-Za-z][A-Za-z0-9]*);/g, function (m, e) { if (!Object.prototype.hasOwnProperty.call(ENT, e)) r.push(m); return m; }); return r; }
  function tekstVoorBron(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n?/g, '\n'); }
  function attrVoorBron(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/[\r\n]+/g, ' '); }

  /* ---------- ontleden: een boom met posities in de bron ---------- */
  function ontleed(bron) {
    var wortel = { tag: '#wortel', s0: 0, s1: 0, e0: bron.length, e1: bron.length, ouder: null, kids: [], open: true }, huidig = wortel, alle = [];
    TOKEN.lastIndex = 0; var m;
    while ((m = TOKEN.exec(bron))) {
      var t = m[0], s0 = m.index, e1 = s0 + t.length;
      if (t.charAt(1) === '!') { huidig.kids.push({ tag: t.slice(2, 4) === '--' ? '#commentaar' : '#doctype', s0: s0, s1: e1, e0: e1, e1: e1, ouder: huidig, kids: [] }); continue; }
      if (m[1]) {          // script/style/textarea/title met inhoud: één knoop
        var st = /^<[a-zA-Z]+(?:"[^"]*"|'[^']*'|[^'">])*>/.exec(t); var begin = st ? st[0].length : 0, sluitAt = t.search(/<\/[a-zA-Z]+\s*>$/);
        var k = { tag: m[1].toLowerCase(), s0: s0, s1: s0 + begin, e0: s0 + sluitAt, e1: e1, ouder: huidig, kids: [], raw: true, attrs: t.slice(0, begin) };
        huidig.kids.push(k); alle.push(k); continue;
      }
      var sluit = t.charAt(1) === '/';
      var naam = /^<\/?([a-zA-Z][^\s\/>]*)/.exec(t)[1].toLowerCase();
      if (sluit) {
        var z = huidig; while (z !== wortel && z.tag !== naam) z = z.ouder;
        if (z === wortel) continue;          // sluittag zonder begintag: negeren
        var y = huidig; while (y !== z) { y.e0 = y.e1 = s0; y.impliciet = true; y = y.ouder; }      // niet zelf gesloten elementen sluiten voor de sluittag van hun ouder
        z.e0 = s0; z.e1 = e1; huidig = z.ouder; continue;
      }
      var el = { tag: naam, s0: s0, s1: e1, e0: e1, e1: e1, ouder: huidig, kids: [], attrs: t };
      huidig.kids.push(el); alle.push(el);
      if (VOID[naam] || /\/>$/.test(t)) continue;
      huidig = el;
    }
    var o = huidig; while (o !== wortel) { o.e0 = o.e1 = bron.length; o.impliciet = true; o = o.ouder; }      // nooit gesloten: loopt tot het einde
    return { wortel: wortel, alle: alle, bron: bron };
  }

  function binnenNegeer(k) { for (var o = k; o; o = o.ouder) if (NEGEER[o.tag]) return true; return false; }
  function segmenten(boom, el) {        // de tekststukken die rechtstreeks in el staan: [{a, z, tekst}] (tekst = ontcijferd)
    var r = [], pos = el.s1, b = boom.bron;
    function voeg(a, z) { if (z > a) { var tk = ontcijfer(b.slice(a, z)); if (LETTER.test(tk)) r.push({ a: a, z: z, tekst: tk }); } }
    for (var i = 0; i < el.kids.length; i++) { var kd = el.kids[i]; voeg(pos, kd.s0); pos = Math.max(pos, kd.e1); }
    voeg(pos, el.e0); return r;
  }
  function dataCms(el) { var m = /\sdata-cms\s*=\s*("([^"]*)"|'([^']*)')/.exec(el.attrs || ''); return m ? (m[2] !== undefined ? m[2] : m[3]) : null; }

  /* ---------- markeren (eenmalig, daarna idempotent) ---------- */
  var LOKAAL_BEELD = /^(?!https?:|\/\/|data:|#|mailto:|tel:)[^?#]+\.(png|jpe?g|webp|svg|gif)$/i;
  function attrWaarde(starttag, naam) {      // positie van de waarde van een attribuut in de starttag (zonder aanhalingstekens als ze er staan)
    var re = new RegExp('(\\s' + naam + '\\s*=\\s*)("([^"]*)"|\'([^\']*)\'|([^\\s"\'=<>`]+))', 'i'), m = re.exec(starttag);
    if (!m) return null;
    var geciteerd = m[3] !== undefined || m[4] !== undefined, waarde = m[3] !== undefined ? m[3] : m[4] !== undefined ? m[4] : m[5];
    var van = m.index + m[1].length + (geciteerd ? 1 : 0);
    return { waarde: waarde, van: van, tot: van + waarde.length, geciteerd: geciteerd };
  }
  function markeer(bron, opties) {
    opties = opties || {};
    var boom = ontleed(bron), max = { t: 0, i: 0 };
    boom.alle.forEach(function (k) { var d = dataCms(k); if (d) { var mm = /^([ti])(\d+)$/.exec(d); if (mm) max[mm[1]] = Math.max(max[mm[1]], +mm[2]); } });
    var inserts = [], uitgesloten = opties.uitsluiten || function () { return false; };
    var body = null; boom.alle.forEach(function (k) { if (k.tag === 'body' && !body) body = k; });
    if (!body) return { html: bron, nieuw: 0, totaal: 0 };
    boom.alle.forEach(function (k) {
      if (k.raw || k.s0 < body.s0 || k.s0 >= body.e0 || binnenNegeer(k) || uitgesloten(k)) return;
      if (dataCms(k)) return;
      var soort = null;
      if (k.tag === 'img') { var s = attrWaarde(k.attrs, 'src'); if (s && LOKAAL_BEELD.test(ontcijfer(s.waarde))) soort = 'i'; }
      else if (segmenten(boom, k).length) soort = 't';
      if (!soort) return;
      var naam = /^<[a-zA-Z][^\s\/>]*/.exec(k.attrs)[0].length;
      inserts.push({ pos: k.s0 + naam, tekst: ' data-cms="' + soort + (++max[soort]) + '"' });
    });
    var uit = bron, i = inserts.length; while (i--) uit = uit.slice(0, inserts[i].pos) + inserts[i].tekst + uit.slice(inserts[i].pos);
    return { html: uit, nieuw: inserts.length };
  }
  function haalMarkering(bron) { return bron.replace(/ data-cms="[ti]\d+"/g, ''); }      // inverse: precies de oorspronkelijke bron

  /* ---------- lezen: wat is er bewerkbaar? ---------- */
  function lijst(bron) {      // [{id, soort:'tekst'|'beeld', tag, stukken:[{k, tekst}] | src, alt}]
    var boom = ontleed(bron), r = [];
    boom.alle.forEach(function (k) {
      var id = dataCms(k); if (!id) return;
      if (id.charAt(0) === 'i') { var s = attrWaarde(k.attrs, 'src'), a = attrWaarde(k.attrs, 'alt'); r.push({ id: id, soort: 'beeld', tag: k.tag, src: s ? ontcijfer(s.waarde) : '', alt: a ? ontcijfer(a.waarde) : '' }); }
      else r.push({ id: id, soort: 'tekst', tag: k.tag, stukken: segmenten(boom, k).map(function (sg, n) { return { k: n, tekst: sg.tekst }; }) });
    });
    return r;
  }

  /* ---------- opslaan: alleen de gemarkeerde stukken aanpassen ---------- */
  function pas(bron, wijzigingen) {
    var boom = ontleed(bron), per = {}, fouten = [], ingrepen = [];
    boom.alle.forEach(function (k) { var d = dataCms(k); if (d) (per[d] = per[d] || []).push(k); });
    (wijzigingen || []).forEach(function (w) {
      var els = per[w.id];
      if (!els) { fouten.push({ id: w.id, reden: 'niet-gevonden' }); return; }
      if (els.length > 1) { fouten.push({ id: w.id, reden: 'dubbel' }); return; }
      var el = els[0];
      if (w.soort === 'attr') {
        var at = attrWaarde(el.attrs, w.naam);
        if (!at) { fouten.push({ id: w.id, reden: 'geen-attribuut' }); return; }
        if (ontcijfer(at.waarde) !== w.orig) { fouten.push({ id: w.id, reden: 'verouderd' }); return; }
        ingrepen.push({ a: el.s0 + at.van, z: el.s0 + at.tot, nieuw: at.geciteerd ? attrVoorBron(w.nieuw) : '"' + attrVoorBron(w.nieuw) + '"' }); return;
      }
      var sg = segmenten(boom, el)[w.k];
      if (!sg) { fouten.push({ id: w.id, reden: 'geen-stuk' }); return; }
      if (norm(sg.tekst) !== norm(w.orig)) { fouten.push({ id: w.id, reden: 'verouderd' }); return; }
      var ruw = bron.slice(sg.a, sg.z), vooraan = ruw.slice(0, ruw.length - ruw.trimStart().length), achteraan = ruw.slice(ruw.trimEnd().length);
      ingrepen.push({ a: sg.a, z: sg.z, nieuw: vooraan + tekstVoorBron(norm(w.nieuw) === '' ? '' : w.nieuw.replace(/^\s+|\s+$/g, '')) + achteraan });
    });
    if (fouten.length) return { html: bron, fouten: fouten };
    ingrepen.sort(function (x, y) { return y.a - x.a; });
    for (var i = 1; i < ingrepen.length; i++) if (ingrepen[i].z > ingrepen[i - 1].a) return { html: bron, fouten: [{ reden: 'overlap' }] };
    var uit = bron; ingrepen.forEach(function (g) { uit = uit.slice(0, g.a) + g.nieuw + uit.slice(g.z); });
    return { html: uit, fouten: [] };
  }

  return { ontleed: ontleed, segmenten: segmenten, markeer: markeer, haalMarkering: haalMarkering, lijst: lijst, pas: pas, norm: norm, ontcijfer: ontcijfer, ontbrekendeEntiteiten: ontbrekendeEntiteiten, tekstVoorBron: tekstVoorBron, LOKAAL_BEELD: LOKAAL_BEELD };
});
