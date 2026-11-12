// Visuele editor voor een statische site op GitHub Pages (PlatforMaat). Je opent de echte pagina, klikt op een tekst of foto, past aan en ziet het meteen.
// Opslaan schrijft de wijzigingen rechtstreeks in de HTML-bestanden van de repo (één commit) en dus op de live site. «Laatste opslag ongedaan maken» is het vangnet.
// Het toegangstoken blijft in deze browser (localStorage) en gaat alleen naar api.github.com.
(function () {
  'use strict';
  var SC = document.currentScript;
  var REPO = SC.dataset.repo, BRANCH = SC.dataset.branch || 'main', NAAM = SC.dataset.naam || 'de site', PREFIX = 'Website aangepast via de editor';
  var API = (location.hostname === 'localhost' && new URLSearchParams(location.search).get('api')) || 'https://api.github.com';      // ?api=... alleen voor tests op localhost
  var BASE = new URL('../', location.href).pathname;                  // de site staat één map boven /beheer/
  var TOKKEY = SC.dataset.tokenkey || ('zm-token-' + REPO);
  var MULTI = SC.dataset.multi === '1';                                // één repo met meerdere voorbeeldsites in mappen: de site kies je met ?site=<map>
  var MAP = '';
  if (MULTI) { var sm = new URLSearchParams(location.search).get('site'); if (sm && /^[A-Za-z0-9_.-]+$/.test(sm)) { MAP = sm + '/'; NAAM = sm; } }
  var STARTPAGINA = MAP + 'index.html';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (tag, att, kids) {
    var e = document.createElement(tag);
    Object.keys(att || {}).forEach(function (k) { if (k === 'text') e.textContent = att[k]; else if (k === 'class') e.className = att[k]; else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), att[k]); else e.setAttribute(k, att[k]); });
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  };
  var norm = function (s) { return String(s || '').split(/\s+/).filter(Boolean).join(' '); };
  var ontcijfer = function (raw) { var t = document.createElement('textarea'); t.innerHTML = raw; return t.value; };
  var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var DEEL = /(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<!--[\s\S]*?-->)/i;
  var KNOOP = />([^<>]+)</g;

  var token = null; try { token = localStorage.getItem(TOKKEY); } catch (e) {}
  var paginas = [], bron = {}, afbeeldingen = {};      // paginas: [{pad, naam}], bron: pad -> html, afbeeldingen: pad -> true
  var edits = new Map();                                // genormaliseerde originele tekst -> {orig, nieuw, overal, pagina}
  var alias = {}, beeldBewaard = new Map(), wachtTeller = 0;   // alias: tekst zoals nu online -> lijst van opgeslagen vervangingen die nog niet herpubliceerd zijn (zo blijven ze zichtbaar en aanpasbaar); beeldBewaard idem voor foto's
  var beeldEdits = new Map();                           // repo-pad -> {blob, url}
  var bewerken = true, huidig = STARTPAGINA, frame, doc, hl, paneel;
  var kopStatus, opslaanKnop, bewerkKnop, pagina;

  function gh(pad, opt) {
    opt = opt || {};
    var h = { 'Authorization': 'Bearer ' + token, 'Accept': opt.raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
    if (opt.body) h['Content-Type'] = 'application/json';
    return fetch(API + '/repos/' + REPO + pad, { method: opt.method || 'GET', headers: h, body: opt.body ? JSON.stringify(opt.body) : undefined, cache: 'no-store' }).then(function (r) {
      if (!r.ok) {
        var e = new Error('GitHub ' + r.status); e.status = r.status; e.pad = pad || '/';
        e.nodig = r.headers.get('x-accepted-github-permissions') || '';
        return r.text().then(function (t) { try { e.uitleg = (JSON.parse(t).message || '').slice(0, 160); } catch (x) {} throw e; });
      }
      return opt.raw ? r.text() : r.json();
    });
  }
  function reden(e) { return e && e.status ? ' [GitHub ' + e.status + ' bij ' + e.pad + (e.uitleg ? ': ' + e.uitleg : '') + (e.nodig ? '; nodig recht: ' + e.nodig : '') + ']' : ''; }
  var root = el('div', { id: 'zm-ed' }); document.body.appendChild(root);
  function toast(t, soort) {
    var b = $('#zm-toast') || root.appendChild(el('div', { id: 'zm-toast' }));
    b.className = soort || ''; b.textContent = t; b.style.display = 'block';
    clearTimeout(toast.t); if (soort !== 'vast') toast.t = setTimeout(function () { b.style.display = 'none'; }, 7000);
  }

  // ---------- inloggen en laden ----------
  function inloggen(fout) {
    root.innerHTML = '';
    var inp = el('input', { type: 'password', placeholder: 'Plak hier je toegangstoken', autocomplete: 'off' });
    var knop = el('button', { class: 'zm-groot', text: 'Inloggen', onclick: function () {
      token = inp.value.trim(); if (!token) return; knop.disabled = true; knop.textContent = 'Even controleren...';
      gh('').then(function (r) {
        if (r.permissions && r.permissions.push === false) throw new Error('geen schrijfrechten');
        try { localStorage.setItem(TOKKEY, token); } catch (e) {} start();
      }).catch(function (e) { token = null; inloggen((e.status === 401 || e.status === 404 ? 'Dit token werkt niet voor deze repo. Het moet toegang hebben tot ' + REPO.split('/')[1] + ' met Contents op «Read and write».' : e.message === 'geen schrijfrechten' ? 'Dit token mag niets opslaan in ' + REPO.split('/')[1] + '. Zet Contents op «Read and write».' : 'Inloggen lukte niet (' + e.message + ').') + reden(e)); });
    } });
    root.appendChild(el('div', { class: 'zm-login' }, [
      el('h1', { text: NAAM + ' aanpassen' }),
      el('p', { text: 'Je opent de echte pagina, klikt op een tekst of foto, past aan en ziet het meteen.' }),
      el('p', { class: 'zm-fout', text: 'Let op: Opslaan zet je wijziging meteen live. Met «Laatste opslag ongedaan maken» kan je terug.' }),
      el('p', { class: 'zm-klein', text: 'Eenmalig inloggen met je GitHub-toegangstoken. Het blijft alleen in deze browser.' }),
      inp, knop, fout ? el('p', { class: 'zm-fout', text: fout }) : null]));
    inp.focus();
  }
  function start() {
    root.innerHTML = '<div class="zm-laden">Even laden...</div>';
    gh('/git/trees/' + BRANCH + '?recursive=1').then(function (t) {
      var lijst = t.tree.filter(function (x) { return x.type === 'blob'; });
      if (MULTI && !MAP) { kiezer(lijst); return 'kiezer'; }
      lijst.forEach(function (x) { if (/\.(png|jpe?g|webp)$/i.test(x.path)) afbeeldingen[x.path] = true; });
      paginas = lijst.filter(function (x) { return x.path.indexOf(MAP) === 0 && /\.html$/.test(x.path) && x.path.indexOf(MAP + 'venster/') !== 0 && x.path.indexOf(MAP + 'beheer/') !== 0 && x.path.indexOf('beheer/') !== 0; }).map(function (x) { return { pad: x.path, verborgen: x.path === MAP + '404.html' }; });       // de 404-pagina doet mee met «overal aanpassen», maar staat niet in de paginalijst
      if (!paginas.length) throw new Error('geen pagina\'s gevonden in ' + (MAP || 'de repo'));
      var i = 0;
      function werker() { if (i >= paginas.length) return Promise.resolve(); var p = paginas[i++]; return gh('/contents/' + p.pad + '?ref=' + BRANCH, { raw: true }).then(function (h) { bron[p.pad] = h; var m = /<title>([\s\S]*?)<\/title>/i.exec(h); p.naam = p.pad === STARTPAGINA ? 'Startpagina' : m ? ontcijfer(m[1]).split(/\s[—|-]\s/)[0].trim() : p.pad; return werker(); }); }
      return Promise.all([werker(), werker(), werker(), werker(), werker(), werker()]);
    }).then(function (r) {
      if (r === 'kiezer') return;
      paginas.sort(function (a, b) { return a.pad === STARTPAGINA ? -1 : b.pad === STARTPAGINA ? 1 : a.pad < b.pad ? -1 : 1; });
      bouwScherm();
    }).catch(function (e) {
      if (e.status === 401) { try { localStorage.removeItem(TOKKEY); } catch (x) {} inloggen('Je token is niet meer geldig. Plak een nieuw token.' + reden(e)); }
      else { root.innerHTML = ''; root.appendChild(el('div', { class: 'zm-login' }, [el('h1', { text: 'Laden mislukt' }), el('p', { text: 'Kon de pagina\'s niet ophalen (' + e.message + ').' + reden(e) + ' Ververs de pagina.' })])); }
    });
  }

  function kiezer(lijst) {              // alle voorbeeldsites (mappen met een index.html) als kaartjes
    var mappen = {}; lijst.forEach(function (x) { var m = /^([A-Za-z0-9_.-]+)\/index\.html$/.exec(x.path); if (m && m[1] !== 'zm' && m[1].charAt(0) !== '_' && m[1] !== 'beheer') mappen[m[1]] = true; });
    var namen = Object.keys(mappen).sort(function (a, b) { var na = parseInt(a, 10), nb = parseInt(b, 10); return (isNaN(nb) ? -1 : nb) - (isNaN(na) ? -1 : na) || (a < b ? -1 : 1); });
    root.innerHTML = '';
    root.appendChild(el('div', { class: 'zm-login' }, [el('h1', { text: 'Welke voorbeeldsite wil je aanpassen?' }), el('p', { class: 'zm-klein', text: 'De nieuwste staat bovenaan. Je opent de echte pagina, klikt op een tekst of foto en ziet het meteen. Opslaan werkt het voorbeeld bij.' })].concat(
      namen.map(function (n) { return el('p', {}, [el('a', { class: 'zm-groot', style: 'display:inline-flex;align-items:center;text-decoration:none', href: '?site=' + encodeURIComponent(n) + (new URLSearchParams(location.search).get('api') ? '&api=' + encodeURIComponent(new URLSearchParams(location.search).get('api')) : ''), text: n })]); }))));
  }
  function bouwScherm() {
    root.innerHTML = '';
    pagina = el('select', { 'aria-label': 'Pagina', onchange: function () { gaNaar(pagina.value); } }, paginas.filter(function (p) { return !p.verborgen; }).map(function (p) { return el('option', { value: p.pad, text: p.naam + (p.pad.slice(MAP.length).indexOf('/') > 0 ? '  (' + p.pad.slice(MAP.length) + ')' : '') }); }));
    bewerkKnop = el('button', { onclick: function () { bewerken = !bewerken; zetBewerken(); } });
    opslaanKnop = el('button', { class: 'zm-primair', onclick: opslaan });
    var apparaat = el('div', { class: 'zm-app' }, [['Computer', '100%'], ['Tablet', '820px'], ['Telefoon', '390px']].map(function (a, i) {
      return el('button', { class: i ? '' : 'actief', text: a[0], onclick: function (ev) { frame.style.width = a[1]; [].forEach.call(ev.target.parentNode.children, function (b) { b.classList.remove('actief'); }); ev.target.classList.add('actief'); } });
    }));
    kopStatus = el('span', { class: 'zm-status' });
    root.appendChild(el('header', { class: 'zm-bar' }, [
      el('div', { class: 'zm-r1' }, [el('strong', { text: NAAM }), pagina, bewerkKnop, opslaanKnop]),
      el('div', { class: 'zm-r2' }, [apparaat, kopStatus, el('button', { text: 'Laatste opslag ongedaan maken', onclick: ongedaan }),
        el('button', { class: 'zm-uit', text: 'Uitloggen', onclick: function () { try { localStorage.removeItem(TOKKEY); } catch (e) {} location.reload(); } })])
    ]));
    frame = el('iframe', { id: 'zm-frame', title: 'Voorbeeld van de site' });
    root.appendChild(el('main', { class: 'zm-stage' }, [frame]));
    frame.addEventListener('load', frameGeladen);
    zetBewerken(); teller();
    window.addEventListener('beforeunload', function (e) { if (aantal()) { e.preventDefault(); e.returnValue = ''; } });
    gaNaar(STARTPAGINA);
  }
  function gaNaar(p) { huidig = p; pagina.value = p; frame.src = BASE + p + (gaNaar.v ? '?v=' + gaNaar.v : ''); }
  function aantal() { var n = beeldEdits.size; edits.forEach(function (e) { if (norm(e.nieuw) !== e.orig) n++; }); return n; }
  function teller() { var n = aantal(); opslaanKnop.textContent = n ? 'Opslaan (' + n + ')' : 'Opslaan'; opslaanKnop.disabled = !n; }
  function zetBewerken() {
    bewerkKnop.textContent = bewerken ? 'Bewerken: aan' : 'Bewerken: uit (je kan door de site klikken)'; bewerkKnop.className = bewerken ? 'zm-aan' : '';
    if (doc) doc.documentElement.classList.toggle('zm-edit', bewerken);
    if (!bewerken) { sluitPaneel(); verberg(); }
    kopStatus.textContent = bewerken ? 'Klik op een tekst of foto om ze aan te passen' : '';
  }

  // ---------- de pagina in het kader ----------
  function frameGeladen() {
    try { doc = frame.contentDocument; doc.body; } catch (e) { toast('De pagina kon niet worden geopend.', 'fout'); return; }
    var pad = frame.contentWindow.location.pathname.slice(BASE.length) || STARTPAGINA; if (pad.slice(-1) === '/') pad += 'index.html';
    if (paginas.some(function (p) { return p.pad === pad; })) { huidig = pad; pagina.value = pad; }
    var st = doc.createElement('style'); st.textContent = '.zm-edit *{cursor:text !important}.zm-edit img{cursor:pointer !important}#zm-hl{position:fixed;z-index:2147483647;pointer-events:none;border:2px solid #ff3d7f;background:rgba(255,61,127,.12);border-radius:4px;display:none}';
    doc.head.appendChild(st); hl = doc.createElement('div'); hl.id = 'zm-hl'; doc.body.appendChild(hl);
    pasToe(); pasBeeldenToe();
    doc.addEventListener('mousemove', beweeg, true); doc.addEventListener('click', klik, true);
    doc.addEventListener('submit', function (e) { if (bewerken) e.preventDefault(); }, true); doc.addEventListener('scroll', verberg, true);
    zetBewerken();
  }
  function knopen() {
    var w = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { var p = n.parentNode.nodeName; return (p === 'SCRIPT' || p === 'STYLE' || p === 'NOSCRIPT' || !n.nodeValue.trim()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } });
    var r = []; while (w.nextNode()) r.push(w.currentNode); return r;
  }
  function zetKnoop(n, tekst) { var v = n.nodeValue; n.nodeValue = v.slice(0, v.length - v.trimStart().length) + tekst + v.slice(v.trimEnd().length); }
  function basis(n) { return n.__orig || norm(n.nodeValue); }                       // de tekst zoals de pagina nu online staat
  function aliasVoor(b, pag) { var l = alias[b] || []; pag = pag || huidig; for (var i = l.length - 1; i >= 0; i--) if (l[i].overal || l[i].pagina === pag) return l[i]; return null; }
  function sleutel(n) { var a = aliasVoor(basis(n)); return a ? a.key : basis(n); }  // de tekst zoals ze nu in de repo staat
  function pasToe() {
    knopen().forEach(function (n) {
      var b = basis(n), a = aliasVoor(b), e = edits.get(a ? a.key : b);
      var doel = e && (e.overal || e.pagina === huidig) ? e.nieuw : a ? a.tekst : null;
      if (doel === null) return;
      n.__orig = b; if (norm(n.nodeValue) !== norm(doel)) zetKnoop(n, doel);
    });
  }
  function nodeOp(x, y) {
    var r; if (doc.caretRangeFromPoint) r = doc.caretRangeFromPoint(x, y);
    else if (doc.caretPositionFromPoint) { var p = doc.caretPositionFromPoint(x, y); if (p) { r = doc.createRange(); r.setStart(p.offsetNode, p.offset); } }
    if (!r || r.startContainer.nodeType !== 3) return null;
    var n = r.startContainer; if (!n.nodeValue.trim() || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.parentNode.nodeName)) return null;
    var rr = doc.createRange(); rr.selectNodeContents(n); var rects = rr.getClientRects();
    for (var i = 0; i < rects.length; i++) { var q = rects[i]; if (x >= q.left - 1 && x <= q.right + 1 && y >= q.top - 1 && y <= q.bottom + 1) return n; }
    return null;
  }
  function beeldPad(img) {
    if (img.__pad !== undefined) return img.__pad;
    var s = img.getAttribute('src') || '', pad = null;
    try { var u = new URL(s, frame.contentWindow.location.href); if (u.origin === frame.contentWindow.location.origin) pad = decodeURIComponent(u.pathname.slice(BASE.length)); } catch (e) {}
    if (!pad || !afbeeldingen[pad]) pad = null;
    img.__pad = pad; return pad;
  }
  function doel(x, y) {
    var n = nodeOp(x, y);
    if (n) { var rr = doc.createRange(); rr.selectNodeContents(n); return { soort: 'tekst', node: n, rect: rr.getBoundingClientRect() }; }
    var e = doc.elementFromPoint(x, y), img = e && e.closest && e.closest('img'); if (img) { var pad = beeldPad(img); if (pad) return { soort: 'beeld', img: img, pad: pad, rect: img.getBoundingClientRect() }; }
    return null;
  }
  function verberg() { if (hl) hl.style.display = 'none'; }
  function beweeg(e) { if (!bewerken) return; var d = doel(e.clientX, e.clientY); if (!d) { verberg(); return; } var r = d.rect; hl.style.cssText = 'display:block;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px'; }
  function klik(e) {
    if (!bewerken) return; e.preventDefault(); e.stopPropagation();
    var d = doel(e.clientX, e.clientY); if (!d) { sluitPaneel(); return; }
    if (d.soort === 'tekst') tekstPaneel(d); else beeldPaneel(d);
  }

  // ---------- panelen ----------
  function sluitPaneel() { if (paneel) { var f = paneel.__sluit; paneel.remove(); paneel = null; if (f) f(); } }
  function open(titel, inhoud, knoppen) {
    sluitPaneel();
    paneel = el('aside', { class: 'zm-paneel' }, [el('div', { class: 'zm-ph' }, [el('h2', { text: titel }), el('button', { class: 'zm-x', text: '×', 'aria-label': 'Sluiten', onclick: sluitPaneel })])].concat(inhoud, [el('div', { class: 'zm-knoppen' }, knoppen)]));
    root.appendChild(paneel); return paneel;
  }
  function tel(key) {      // op hoeveel pagina's staat deze tekst letterlijk in de HTML
    var n = 0, paginasMet = [];
    paginas.forEach(function (p) { var c = vervangBron(bron[p.pad], key, null).n; if (c) { n++; paginasMet.push(p.pad); } });
    return { n: n, paginas: paginasMet };
  }
  function vervangBron(src, key, nieuw) {              // nieuw === null: alleen tellen
    var delen = src.split(DEEL), n = 0;
    for (var i = 0; i < delen.length; i += 2) {
      delen[i] = delen[i].replace(KNOOP, function (m, raw) {
        var core = raw.trim(); if (!core || norm(ontcijfer(core)) !== key) return m; n++;
        if (nieuw === null) return m;
        return '>' + raw.slice(0, raw.length - raw.trimStart().length) + esc(nieuw) + raw.slice(raw.trimEnd().length) + '<';
      });
    }
    return { src: delen.join(''), n: n };
  }
  function tekstPaneel(d) {
    var n = d.node, key = sleutel(n), bestaand = edits.get(key), orig = bestaand ? bestaand.orig : key;
    var t = tel(key), huidigTekst = bestaand ? bestaand.nieuw : norm(n.nodeValue);
    if (!t.n) { open('Tekst niet aanpasbaar', [el('p', { text: 'Deze tekst wordt door de site zelf opgebouwd en staat niet letterlijk in de pagina. Hij kan hier niet worden aangepast.' })], []); return; }
    var ta = el('textarea', { rows: '5' }); ta.value = huidigTekst;
    var overal = el('input', { type: 'checkbox' }); overal.checked = bestaand ? bestaand.overal : t.n > 1;
    var namen = t.paginas.map(function (pd) { var q = paginas.filter(function (x) { return x.pad === pd; })[0]; var nm = q && q.naam || pd; return nm.length > 28 ? nm.slice(0, 27) + '…' : nm; }), lijst = namen.slice(0, 6).join(', ') + (namen.length > 6 ? ' en ' + (namen.length - 6) + ' andere' : '');
    var rij = t.n > 1 ? el('label', { class: 'zm-veld' }, [el('span', { text: 'Deze tekst staat op ' + t.n + ' pagina\'s: ' + lijst + '.' }), el('span', {}, [overal, ' Ook op die andere pagina\'s aanpassen (haal het vinkje weg voor alleen deze pagina)'])]) : null;
    var toegepast = false, geannuleerd = false, voor = bestaand ? { nieuw: bestaand.nieuw, overal: bestaand.overal } : null;
    function zet(v, ov) {
      var e = edits.get(key) || { orig: orig, pagina: huidig }; e.nieuw = v; e.overal = ov; edits.set(key, e);
      n.__orig = basis(n); pasToe(); teller();
    }
    var p = open('Tekst aanpassen', [el('p', { class: 'zm-klein', text: 'Je ziet de wijziging meteen. Ze gaat pas live na «Opslaan».' }), ta, rij], [
      el('button', { class: 'zm-primair', text: 'Toepassen', onclick: function () { toegepast = true; zet(ta.value.trim(), overal.checked); sluitPaneel(); } }),
      el('button', { text: 'Annuleren', onclick: function () { geannuleerd = true; sluitPaneel(); } }),
      el('button', { text: 'Vorige tekst terugzetten', onclick: function () { toegepast = true; zet(orig, overal.checked); sluitPaneel(); } })]);
    // Wat je typt blijft staan, ook als je ergens anders klikt zonder op «Toepassen» te drukken. Alleen «Annuleren» of Escape draait het terug.
    p.__sluit = function () {
      if (geannuleerd) { if (voor) zet(voor.nieuw, voor.overal); else { edits.delete(key); knopen().forEach(function (k) { if (sleutel(k) === key) { var a = aliasVoor(basis(k)); zetKnoop(k, a ? a.tekst : basis(k)); } }); teller(); } }
      else if (!toegepast) zet(ta.value.trim() || orig, overal.checked);
    };
    ta.focus(); ta.select();
    ta.addEventListener('input', function () { zet(ta.value, overal.checked); });
    ta.addEventListener('keydown', function (e) { if (e.key === 'Escape') { geannuleerd = true; sluitPaneel(); } });
    overal.addEventListener('change', function () { zet(ta.value, overal.checked); });
  }
  function beeldPaneel(d) {
    var img = d.img, pad = d.pad, bestand = el('input', { type: 'file', accept: 'image/*' }), ext = (/\.(png|jpe?g|webp)$/i.exec(pad)[1] || 'png').toLowerCase();
    var mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    bestand.addEventListener('change', function () {
      var f = bestand.files[0]; if (!f) return;
      verkleinen(f, mime).then(function (blob) {
        var v = beeldEdits.get(pad); if (v && v.url) URL.revokeObjectURL(v.url);
        beeldEdits.set(pad, { blob: blob, url: URL.createObjectURL(blob) }); pasBeeldenToe(); teller(); toast('Foto vervangen. Klik op Opslaan om ze live te zetten.');
      }).catch(function () { toast('Deze foto kon niet worden gelezen.', 'fout'); });
    });
    open('Foto aanpassen', [el('p', { class: 'zm-klein', text: 'Kies een nieuwe foto. Ze vervangt dit bestand (' + pad + ') overal op de site waar het gebruikt wordt. Ze wordt automatisch verkleind.' }), bestand], [
      el('button', { text: 'Wijziging ongedaan maken', onclick: function () { var v = beeldEdits.get(pad); if (v) URL.revokeObjectURL(v.url); beeldEdits.delete(pad); if (img.__orig) img.src = img.__orig; teller(); sluitPaneel(); } })]);
  }
  function verkleinen(file, mime) {
    return new Promise(function (ok, nee) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        var k = Math.min(1, 1920 / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
        var g = c.getContext('2d'); if (mime === 'image/jpeg') { g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); } g.drawImage(im, 0, 0, c.width, c.height);
        c.toBlob(function (b) { URL.revokeObjectURL(url); b ? ok(b) : nee(); }, mime, 0.88);
      };
      im.onerror = function () { URL.revokeObjectURL(url); nee(); }; im.src = url;
    });
  }
  function pasBeeldenToe() {
    if (!doc) return;
    [].forEach.call(doc.querySelectorAll('img'), function (img) {
      var pad = beeldPad(img), v = pad && (beeldEdits.get(pad) || beeldBewaard.get(pad)); if (!v) return;
      if (img.__orig === undefined) img.__orig = img.getAttribute('src');
      img.removeAttribute('srcset'); img.src = v.url;
    });
  }

  // ---------- opslaan en ongedaan maken ----------
  function b64(buf) { var s = '', a = new Uint8Array(buf); for (var i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); }
  function verwachtTargets() {
    var t = {}; edits.forEach(function (e, key) {
      if (norm(e.nieuw) === e.orig) return;
      var wl = e.overal ? paginas.map(function (p) { return p.pad; }) : [e.pagina];
      wl.forEach(function (p) { (t[p] = t[p] || []).push([key, e.nieuw]); });
    }); return t;
  }
  function opslaan() {
    if (!aantal()) return; opslaanKnop.disabled = true; kopStatus.textContent = 'Bezig met opslaan...';
    poging(0).then(function (res) {
      Object.keys(res.nieuweBron).forEach(function (p) { bron[p] = res.nieuweBron[p]; });
      // Tot de site opnieuw gepubliceerd is, blijven de opgeslagen aanpassingen zichtbaar (ook op andere pagina's) en aanpasbaar.
      edits.forEach(function (e, key) {
        if (norm(e.nieuw) === e.orig) return;
        var item = { key: norm(e.nieuw), tekst: e.nieuw.trim(), overal: e.overal, pagina: e.pagina };
        var bases = Object.keys(alias); if (bases.indexOf(key) < 0) bases.push(key);
        bases.forEach(function (b) { var a = aliasVoor(b, e.pagina), huidigeSleutel = a ? a.key : b; if (huidigeSleutel === key) (alias[b] = alias[b] || []).push(item); });
      });
      var dezeBeelden = new Map(beeldEdits);
      beeldEdits.forEach(function (v, pad) { beeldBewaard.set(pad, v); });
      edits.clear(); beeldEdits.clear(); teller(); pasToe();
      kopStatus.textContent = 'Opgeslagen, wordt gepubliceerd...';
      toast('Opgeslagen. Over ongeveer 1 tot 3 minuten staat het live. Tot dan blijven je aanpassingen hier zichtbaar.', 'vast');
      wachtOpPublicatie(res.nieuweBron, dezeBeelden);
    }).catch(function (e) {
      teller(); kopStatus.textContent = '';
      toast(e.status === 403 || e.status === 401 ? 'Opslaan mislukt: je token heeft geen schrijfrechten (Contents: Read and write) of is verlopen.' + reden(e) : e.message.indexOf('niet gevonden') >= 0 ? e.message : 'Opslaan mislukt (' + e.message + '). Je aanpassingen staan nog hier; probeer opnieuw.', 'fout');
    });
  }
  function wachtOpPublicatie(nieuweBron, beelden) {       // kijkt elke 6 s of de gepubliceerde site de opgeslagen versie bevat (max. 8 min)
    var mijn = ++wachtTeller, start = Date.now(), pad = Object.keys(nieuweBron)[0], bpad = pad ? null : (Array.from(beelden.keys())[0] || null);
    function klaar() { if (mijn !== wachtTeller) return; gaNaar.v = Date.now(); gaNaar(huidig); toast('Klaar: de site is bijgewerkt.'); kopStatus.textContent = 'Klaar'; }
    function ronde() {
      if (mijn !== wachtTeller) return;                    // er is intussen opnieuw opgeslagen: die ronde neemt het over
      if (Date.now() - start > 480000) { toast('Het publiceren duurt langer dan normaal. Je aanpassingen zijn opgeslagen; kijk straks opnieuw (ververs de pagina).', 'fout'); kopStatus.textContent = 'Opgeslagen'; return; }
      var url = BASE + (pad || bpad) + '?v=' + Date.now();
      var p = pad ? fetch(url, { cache: 'no-store' }).then(function (r) { return r.ok ? r.text().then(function (t) { return t === nieuweBron[pad]; }) : false; })
                  : bpad ? fetch(url, { cache: 'no-store' }).then(function (r) { return r.ok ? r.arrayBuffer().then(function (b) { return b.byteLength === beelden.get(bpad).blob.size; }) : false; }) : Promise.resolve(true);
      p.then(function (ok) { if (ok) klaar(); else setTimeout(ronde, 6000); }).catch(function () { setTimeout(ronde, 6000); });
    }
    setTimeout(ronde, 6000);
  }
  function poging(n) {
    var bestanden = [], nieuweBron = {};
    return gh('/git/ref/heads/' + BRANCH).then(function (ref) {
      var basis = ref.object.sha;
      return gh('/git/commits/' + basis).then(function (c) {
        var targets = verwachtTargets(), werk = [], fouten = [];
        Object.keys(targets).forEach(function (p) {
          werk.push(gh('/contents/' + p + '?ref=' + BRANCH, { raw: true }).then(function (h) {
            var src = h, wijz = false;
            targets[p].forEach(function (kv) { var r = vervangBron(src, kv[0], kv[1]); if (r.n) { src = r.src; wijz = true; } else if (!/^$/.test(kv[0]) && !edits.get(kv[0]).overal) fouten.push(kv[0]); });
            if (wijz) { bestanden.push({ path: p, tekst: src }); nieuweBron[p] = src; }
          }));
        });
        beeldEdits.forEach(function (e, pad) { werk.push(e.blob.arrayBuffer().then(function (buf) { bestanden.push({ path: pad, base64: b64(buf) }); })); });
        return Promise.all(werk).then(function () {
          if (fouten.length) throw new Error('Eén tekst is niet gevonden in de pagina en is niet opgeslagen: ' + fouten[0].slice(0, 50));
          if (!bestanden.length) throw new Error('Niets om op te slaan (de teksten zijn al zo)');
          return Promise.all(bestanden.map(function (b) { return gh('/git/blobs', { method: 'POST', body: b.base64 ? { content: b.base64, encoding: 'base64' } : { content: b.tekst, encoding: 'utf-8' } }).then(function (r) { return { path: b.path, mode: '100644', type: 'blob', sha: r.sha }; }); }));
        }).then(function (tree) { return gh('/git/trees', { method: 'POST', body: { base_tree: c.tree.sha, tree: tree } }); })
          .then(function (t) { return gh('/git/commits', { method: 'POST', body: { message: PREFIX + ' (' + bestanden.length + ' bestand' + (bestanden.length === 1 ? '' : 'en') + ')', tree: t.sha, parents: [basis] } }); })
          .then(function (cm) { return gh('/git/refs/heads/' + BRANCH, { method: 'PATCH', body: { sha: cm.sha, force: false } }).then(function () { return { sha: cm.sha, nieuweBron: nieuweBron }; }); });
      });
    }).catch(function (e) { if (e.status === 422 && n < 2) return poging(n + 1); throw e; });
  }
  function ongedaan() {
    if (aantal() && !confirm('Je hebt niet-opgeslagen aanpassingen. Die gaan verloren als je de pagina ververst. Doorgaan met ongedaan maken van de laatste opslag?')) return;
    gh('/git/ref/heads/' + BRANCH).then(function (ref) {
      var head = ref.object.sha;
      return gh('/git/commits/' + head).then(function (c) {
        if (c.message.indexOf(PREFIX) !== 0) { toast('De laatste wijziging komt niet uit deze editor. Ongedaan maken kan dan alleen via GitHub.', 'fout'); return; }
        if (!confirm('De laatste opslag ongedaan maken?\n\n' + c.message + '\n\nDe site gaat terug naar hoe ze daarvoor was.')) return;
        return gh('/git/commits/' + c.parents[0].sha).then(function (ouder) {
          return gh('/git/commits', { method: 'POST', body: { message: 'Laatste opslag van de editor ongedaan gemaakt', tree: ouder.tree.sha, parents: [head] } });
        }).then(function (cm) { return gh('/git/refs/heads/' + BRANCH, { method: 'PATCH', body: { sha: cm.sha, force: false } }); })
          .then(function () { alias = {}; wachtTeller++; toast('Ongedaan gemaakt. Over ongeveer 1 tot 2 minuten staat de vorige versie weer live.', 'vast'); setTimeout(function () { location.reload(); }, 100000); });
      });
    }).catch(function (e) { toast('Ongedaan maken mislukt (' + e.message + ').', 'fout'); });
  }

  if (token) start(); else inloggen();
})();
