/* 12c Platform: een klein, werkend voorbeeld van een platform op maat (werkomgeving voor het team en portaal voor de klant).
   Gewone JavaScript, geen bibliotheek, geen netwerkverzoeken, niets wordt opgeslagen. Alle gegevens zijn verzonnen en staan alleen in het geheugen van deze pagina.
   Er beweegt niets vanzelf: alles verandert pas na een klik, tik of toets. */
(function () {
  'use strict';
  var root = document.getElementById('pf');
  if (!root) return;

  var cfg = {};
  try { cfg = JSON.parse(document.getElementById('pf-data').textContent); } catch (err) { cfg = {}; }
  var ASST = cfg.assistenten || ['Klantenassistent', 'Planning-assistent', 'Rapport-assistent'];

  var STATUS = [['nieuw', 'Nieuw'], ['bezig', 'In behandeling'], ['wacht', 'Wacht op klant'], ['klaar', 'Klaar']];
  var STATUS_L = { nieuw: 'Nieuw', bezig: 'In behandeling', wacht: 'Wacht op klant', klaar: 'Klaar' };
  var STATUS_S = { nieuw: 'draft', bezig: 'prog', wacht: 'todo', klaar: 'done' };
  var SOORTEN = ['Aanvraag', 'Afspraak', 'Wijziging', 'Onderhoud', 'Levering', 'Rapport'];
  var DAGEN = ['Ma', 'Di', 'Wo', 'Do', 'Vr'];
  var DAG_L = { Ma: 'maandag', Di: 'dinsdag', Wo: 'woensdag', Do: 'donderdag', Vr: 'vrijdag' };
  var KLANTEN = ['Klant A', 'Klant B', 'Klant C', 'Klant D', 'Klant E'];
  var PORTAAL_KLANT = 'Klant B';
  var VANDAAG = 'Ma';
  var VIEWS = [['overzicht', 'Overzicht'], ['dossiers', 'Dossiers'], ['planning', 'Planning'], ['assistent', 'Assistent'], ['koppelingen', 'Koppelingen']];

  var IC = {
    overzicht: 'M2.5 2.5h4.5v4.5H2.5z M9 2.5h4.5v4.5H9z M2.5 9h4.5v4.5H2.5z M9 9h4.5v4.5H9z',
    dossiers: 'M4 2.5h5.5L12.5 5.5V13.5H4z M9.5 2.5v3h3 M6 8.5h4.5 M6 11h4.5',
    planning: 'M2.5 4h11v9.5h-11z M2.5 7h11 M5.5 2.5v3 M10.5 2.5v3',
    assistent: 'M4 3.5h8v10H4z M6.2 2h3.6v2.6H6.2z M6 8h4 M6 10.5h4',
    koppelingen: 'M6.6 9.4l2.8-2.8 M5.2 7.4L4 8.6a2.3 2.3 0 0 0 3.4 3.4l1.2-1.2 M10.8 8.6L12 7.4a2.3 2.3 0 0 0-3.4-3.4L7.4 5.2',
    plus: 'M8 3.5v9 M3.5 8h9',
    close: 'M4 4l8 8 M12 4l-8 8',
    back: 'M10 3.5L5.5 8l4.5 4.5',
    left: 'M9.5 4L5.5 8l4 4',
    right: 'M6.5 4l4 4-4 4',
    reset: 'M3 8a5 5 0 1 0 1.6-3.7 M3 2.8v3.2h3.2',
    check: 'M3.4 7.3l2.4 2.4 4.8-5.2',
    send: 'M2.5 8l11-5-3.5 10-2.5-4z'
  };
  var ic = function (k) { return '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="' + IC[k] + '"/></svg>'; };
  var st = function (k) { return '<svg class="st st-' + k + '" viewBox="0 0 14 14" aria-hidden="true" focusable="false"><use href="#st-' + k + '"/></svg>'; };
  var h = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var $ = function (s, c) { return (c || root).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || root).querySelectorAll(s)); };

  /* ---------- gegevens ---------- */
  function seed() {
    var steps = function () { return Array.prototype.slice.call(arguments).map(function (a) { return { t: a[0], done: !!a[1] }; }); };
    return {
      mode: 'team', view: 'overzicht', sel: null, filter: 'alle', q: '', sort: { k: 'dag', dir: 1 },
      seq: 1051, drafts: {}, chat: [], chatDraft: '', asstSel: 0, asstOn: [true, true, true], focusKey: null,
      d: [
        { id: 'D-1041', titel: 'Nieuwe aanvraag beantwoorden', klant: 'Klant B', soort: 'Aanvraag', status: 'nieuw', dag: 'Ma', rol: 'Medewerker',
          stappen: steps(['Aanvraag gelezen', 1], ['Antwoord voorgesteld', 1], ['Antwoord gecontroleerd', 0], ['Antwoord verstuurd', 0]),
          ai: { naam: ASST[0], tekst: 'Bedankt voor je aanvraag. We hebben ze ontvangen en bekijken ze deze week. Past een gesprek op dinsdag of donderdag?', verstuurd: false, bewerk: false, gecheckt: false },
          berichten: [{ van: 'Klant B', klant: true, uit: 'klant', txt: 'Kunnen jullie meedenken over een koppeling tussen onze pakketten?', t: 'Eerder vandaag' }] },
        { id: 'D-1042', titel: 'Afspraak inplannen', klant: 'Klant A', soort: 'Afspraak', status: 'bezig', dag: 'Ma', rol: 'Planner',
          stappen: steps(['Moment gekozen', 1], ['Bevestiging klaarzetten', 0], ['Bevestiging versturen', 0]), ai: null, berichten: [] },
        { id: 'D-1043', titel: 'Wijziging goedkeuren', klant: 'Klant C', soort: 'Wijziging', status: 'wacht', dag: 'Ma', rol: 'Medewerker',
          stappen: steps(['Wijziging beschreven', 1], ['Voorstel gestuurd', 1], ['Reactie ontvangen', 0]), ai: null,
          berichten: [{ van: 'Team', klant: true, uit: 'team', txt: 'We hebben het voorstel gestuurd. Laat je weten of het zo goed is?', t: 'Eerder vandaag' }] },
        { id: 'D-1044', titel: 'Klantbericht opvolgen', klant: 'Klant B', soort: 'Aanvraag', status: 'bezig', dag: 'Di', rol: 'Medewerker',
          stappen: steps(['Bericht gelezen', 1], ['Antwoord voorgesteld', 1], ['Antwoord gecontroleerd', 0]),
          ai: { naam: ASST[0], tekst: 'Bedankt voor je bericht. We kijken ernaar en laten je morgen weten hoe we verder gaan.', verstuurd: false, bewerk: false, gecheckt: false },
          berichten: [] },
        { id: 'D-1045', titel: 'Onderhoud inplannen', klant: 'Klant D', soort: 'Onderhoud', status: 'nieuw', dag: 'Wo', rol: 'Planner',
          stappen: steps(['Onderdelen nagekeken', 0], ['Moment afgesproken', 0]), ai: null, berichten: [] },
        { id: 'D-1046', titel: 'Levering voorbereiden', klant: 'Klant E', soort: 'Levering', status: 'bezig', dag: 'Wo', rol: 'Medewerker',
          stappen: steps(['Lijst nagekeken', 1], ['Planning gemaakt', 1], ['Klant verwittigd', 0]), ai: null, berichten: [] },
        { id: 'D-1047', titel: 'Wijziging bespreken', klant: 'Klant B', soort: 'Wijziging', status: 'wacht', dag: 'Do', rol: 'Medewerker',
          stappen: steps(['Vraag genoteerd', 1], ['Voorstel gedaan', 1], ['Reactie van de klant', 0]), ai: null,
          berichten: [{ van: 'Team', klant: true, uit: 'team', txt: 'We hebben twee opties uitgewerkt. Welke past het best bij jullie?', t: 'Eerder vandaag' }] },
        { id: 'D-1048', titel: 'Rapport opstellen', klant: 'Klant A', soort: 'Rapport', status: 'bezig', dag: 'Do', rol: 'Medewerker',
          stappen: steps(['Gegevens verzameld', 1], ['Concept gemaakt', 0], ['Concept gecontroleerd', 0]),
          ai: { naam: ASST[2], tekst: 'Dit is een concept van het rapport met de gegevens van deze periode. Een mens leest het na voor het naar de klant gaat.', verstuurd: false, bewerk: false, gecheckt: false },
          berichten: [] },
        { id: 'D-1049', titel: 'Gegevens controleren', klant: 'Klant C', soort: 'Wijziging', status: 'klaar', dag: 'Vr', rol: 'Medewerker',
          stappen: steps(['Gegevens nagekeken', 1], ['Fouten verbeterd', 1]), ai: null, berichten: [] }
      ],
      log: [
        { t: 'Eerder vandaag', x: 'Klant B stuurde een bericht bij D-1041' },
        { t: 'Eerder vandaag', x: 'Team stuurde een voorstel bij D-1043' },
        { t: 'Eerder vandaag', x: 'D-1049 is afgerond' },
        { t: 'Gisteren', x: 'Planning van de week bijgewerkt' }
      ],
      koppel: [
        { id: 'boek', naam: 'Boekhoudpakket', wat: 'Afgeronde dossiers gaan door voor facturatie.', aan: true, bezig: false, sync: 'Vandaag' },
        { id: 'mail', naam: 'E-mailbox', wat: 'Berichten van klanten komen als dossier binnen.', aan: true, bezig: false, sync: 'Vandaag' },
        { id: 'shop', naam: 'Webshop', wat: 'Bestellingen komen binnen als aanvraag.', aan: false, bezig: false, sync: 'Gisteren' },
        { id: 'agenda', naam: 'Agenda', wat: 'Afspraken uit de planning komen in de agenda.', aan: true, bezig: false, sync: 'Vandaag' }
      ]
    };
  }
  var S = seed();
  var timers = {};

  var byId = function (id) { for (var i = 0; i < S.d.length; i++) if (S.d[i].id === id) return S.d[i]; return null; };
  var open = function () { return S.d.filter(function (d) { return d.status !== 'klaar'; }); };
  var concepten = function () { return S.d.filter(function (d) { return d.ai && !d.ai.verstuurd; }); };
  var addLog = function (x) { S.log.unshift({ t: 'Zojuist', x: x }); if (S.log.length > 12) S.log.length = 12; };
  var draft = function (id) { return S.drafts[id] || (S.drafts[id] = { note: '', zicht: false, ai: null, reply: '' }); };

  /* ---------- meldingen ---------- */
  function toast(msg) {
    var t = $('#pf-toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(timers.toast);
    timers.toast = setTimeout(function () { t.classList.remove('is-on'); }, 4200);
  }

  /* ---------- kop en zijbalk ---------- */
  function renderChrome() {
    root.setAttribute('data-mode', S.mode);
    var team = S.mode === 'team';
    $('#pf-bar').innerHTML =
      '<div class="pf-brand"><span class="mk-s" aria-hidden="true"></span><b>Voorbeeldbedrijf</b></div>' +
      '<div class="pf-mode" role="group" aria-label="Kijk als">' +
      '<button type="button" data-act="mode" data-m="team" aria-pressed="' + team + '">Team</button>' +
      '<button type="button" data-act="mode" data-m="klant" aria-pressed="' + !team + '">Klantportaal</button></div>' +
      '<div class="pf-acts">' +
      (team ? '<button type="button" class="pf-btn pf-btn--a" data-act="new">' + ic('plus') + '<span>Nieuw dossier</span><kbd>N</kbd></button>' : '<button type="button" class="pf-btn pf-btn--a" data-act="new">' + ic('plus') + '<span>Nieuwe aanvraag</span></button>') +
      '<button type="button" class="pf-btn" data-act="reset" title="Zet de voorbeeldgegevens terug">' + ic('reset') + '<span>Zet terug</span></button></div>';
    var badge = { dossiers: open().length, assistent: concepten().length };
    $('#pf-side').innerHTML = '<ul>' + VIEWS.map(function (v) {
      var on = S.view === v[0];
      var n = badge[v[0]];
      return '<li><button type="button" data-act="nav" data-v="' + v[0] + '"' + (on ? ' aria-current="page"' : '') + '>' + ic(v[0]) + '<span>' + v[1] + '</span>' + (n ? '<i class="pf-n">' + n + '<span class="vh">' + (v[0] === 'assistent' ? ' te controleren' : ' open') + '</span></i>' : '') + '</button></li>';
    }).join('') + '</ul>';
  }

  /* ---------- hoofdvensters ---------- */
  function renderMain() {
    var m = $('#pf-main');
    var top = m.scrollTop;
    var html;
    if (S.mode === 'klant') html = viewPortaal();
    else if (S.view === 'overzicht') html = viewOverzicht();
    else if (S.view === 'dossiers') html = viewDossiers();
    else if (S.view === 'planning') html = viewPlanning();
    else if (S.view === 'assistent') html = viewAssistent();
    else html = viewKoppelingen();
    m.innerHTML = html;
    m.scrollTop = top;
    if (S.mode === 'team' && S.view === 'dossiers') renderRows();
    if (S.view === 'assistent' && S.mode === 'team') { var l = $('.pf-chatlog'); if (l) l.scrollTop = l.scrollHeight; }
  }

  function badge(s) { return '<span class="bd bd--' + s + '">' + st(STATUS_S[s]) + h(STATUS_L[s]) + '</span>'; }

  function viewOverzicht() {
    var vandaag = open().filter(function (d) { return d.dag === VANDAAG; });
    var tiles = [
      ['Open dossiers', open().length, 'dossiers', 'open'],
      ['Wachten op klant', S.d.filter(function (d) { return d.status === 'wacht'; }).length, 'dossiers', 'wacht'],
      ['Vandaag gepland', vandaag.length, 'planning', ''],
      ['Concepten te controleren', concepten().length, 'assistent', '']
    ];
    return '<div class="pf-head"><h3 class="pf-h">Overzicht</h3><span class="pf-sub">Wat er nu speelt in de voorbeeldgegevens</span></div>' +
      '<ul class="pf-tiles">' + tiles.map(function (t) {
        return '<li><button type="button" data-act="tile" data-v="' + t[2] + '" data-f="' + t[3] + '"><span class="pf-tn">' + t[1] + '</span><span class="pf-tl">' + t[0] + '</span></button></li>';
      }).join('') + '</ul>' +
      '<div class="pf-two"><section aria-labelledby="pf-vd"><h4 class="pf-h2" id="pf-vd">Vandaag (maandag)</h4>' +
      (vandaag.length ? '<ul class="pf-list">' + vandaag.map(function (d) {
        return '<li><button type="button" class="pf-li" data-act="open" data-id="' + d.id + '" data-fk="o-' + d.id + '">' + st(STATUS_S[d.status]) + '<span class="pf-lt">' + h(d.titel) + '</span><span class="pf-lk">' + h(d.klant) + '</span></button></li>';
      }).join('') + '</ul>' : '<p class="pf-empty">Niets meer voor vandaag.</p>') + '</section>' +
      '<section aria-labelledby="pf-ac"><h4 class="pf-h2" id="pf-ac">Activiteit</h4><ol class="pf-log">' + S.log.slice(0, 7).map(function (l) {
        return '<li><span class="pf-lw">' + h(l.t) + '</span><span>' + h(l.x) + '</span></li>';
      }).join('') + '</ol></section></div>';
  }

  var FILTERS = [['alle', 'Alle'], ['open', 'Open'], ['nieuw', 'Nieuw'], ['bezig', 'In behandeling'], ['wacht', 'Wacht op klant'], ['klaar', 'Klaar']];
  function viewDossiers() {
    var cols = [['id', 'Dossier'], ['titel', 'Titel'], ['klant', 'Klant'], ['soort', 'Soort'], ['status', 'Status'], ['dag', 'Dag']];
    return '<div class="pf-head"><h3 class="pf-h">Dossiers</h3><span class="pf-sub" id="pf-count" aria-live="polite"></span></div>' +
      '<div class="pf-tools"><div class="pf-chips" role="group" aria-label="Filter op status">' + FILTERS.map(function (f) {
        return '<button type="button" class="pf-chip" data-act="filter" data-f="' + f[0] + '" aria-pressed="' + (S.filter === f[0]) + '">' + f[1] + '</button>';
      }).join('') + '</div>' +
      '<label class="pf-search" for="pf-q">' + '<span class="vh">Zoek in dossiers</span><input type="search" id="pf-q" placeholder="Zoek in dossiers" value="' + h(S.q) + '" autocomplete="off" spellcheck="false"></label></div>' +
      '<div class="pf-tw"><table class="pf-t"><thead><tr>' + cols.map(function (c) {
        var on = S.sort.k === c[0];
        return '<th scope="col" class="c-' + c[0] + '"' + (on ? ' aria-sort="' + (S.sort.dir > 0 ? 'ascending' : 'descending') + '"' : '') + '><button type="button" data-act="sort" data-s="' + c[0] + '">' + c[1] + '<i aria-hidden="true">' + (on ? (S.sort.dir > 0 ? '↑' : '↓') : '') + '</i></button></th>';
      }).join('') + '</tr></thead><tbody id="pf-rows"></tbody></table></div>';
  }

  function sortVal(d, k) {
    if (k === 'status') return STATUS.map(function (s) { return s[0]; }).indexOf(d.status);
    if (k === 'dag') return DAGEN.indexOf(d.dag);
    return String(d[k]).toLowerCase();
  }
  function list() {
    var q = S.q.trim().toLowerCase();
    var r = S.d.filter(function (d) {
      if (S.filter === 'open' ? d.status === 'klaar' : S.filter !== 'alle' && d.status !== S.filter) return false;
      if (!q) return true;
      return (d.id + ' ' + d.titel + ' ' + d.klant + ' ' + d.soort + ' ' + STATUS_L[d.status] + ' ' + DAG_L[d.dag]).toLowerCase().indexOf(q) > -1;
    });
    r.sort(function (a, b) {
      var x = sortVal(a, S.sort.k), y = sortVal(b, S.sort.k);
      var c = x < y ? -1 : x > y ? 1 : 0;
      return (c || (a.id < b.id ? -1 : 1)) * S.sort.dir;
    });
    return r;
  }
  function renderRows() {
    var body = $('#pf-rows');
    if (!body) return;
    var r = list();
    body.innerHTML = r.length ? r.map(function (d) {
      return '<tr data-id="' + d.id + '"' + (S.sel === d.id ? ' class="is-sel"' : '') + '>' +
        '<td class="c-id">' + d.id + '</td>' +
        '<td class="c-titel"><button type="button" class="pf-rowbtn" data-act="open" data-id="' + d.id + '" data-fk="o-' + d.id + '">' + h(d.titel) + '</button></td>' +
        '<td class="c-klant">' + h(d.klant) + '</td><td class="c-soort">' + h(d.soort) + '</td>' +
        '<td class="c-status">' + badge(d.status) + '</td><td class="c-dag">' + d.dag + '</td></tr>';
    }).join('') : '<tr class="pf-none"><td colspan="6">Geen dossiers gevonden. Wis de zoekterm of kies Alle.</td></tr>';
    var c = $('#pf-count');
    if (c) c.textContent = r.length + ' van ' + S.d.length + ' dossiers';
  }

  function viewPlanning() {
    return '<div class="pf-head"><h3 class="pf-h">Planning</h3><span class="pf-sub">Deze week · schuif een dossier met de pijltjes naar een andere dag</span></div>' +
      '<div class="pf-week">' + DAGEN.map(function (dg, di) {
        var items = S.d.filter(function (d) { return d.dag === dg; });
        return '<section class="pf-day' + (dg === VANDAAG ? ' is-today' : '') + '" aria-labelledby="pf-dh-' + dg + '"><h4 id="pf-dh-' + dg + '"><span>' + dg + '</span>' + (dg === VANDAAG ? '<i>Vandaag</i>' : '') + '</h4>' +
          (items.length ? '<ul>' + items.map(function (d) {
            return '<li class="pf-pc st-' + d.status + '"><button type="button" class="pf-pb" data-act="open" data-id="' + d.id + '" data-fk="o-' + d.id + '">' + st(STATUS_S[d.status]) + '<span class="pf-pt">' + h(d.titel) + '</span><span class="pf-pk">' + h(d.klant) + ' · ' + h(STATUS_L[d.status]) + '</span></button>' +
              '<span class="pf-mv"><button type="button" data-act="shift" data-id="' + d.id + '" data-dir="-1" data-fk="s-' + d.id + '-1" aria-label="Verplaats ' + h(d.titel) + ' (' + d.id + ') een dag eerder"' + (di === 0 ? ' disabled' : '') + '>' + ic('left') + '</button>' +
              '<button type="button" data-act="shift" data-id="' + d.id + '" data-dir="1" data-fk="s-' + d.id + '1" aria-label="Verplaats ' + h(d.titel) + ' (' + d.id + ') een dag later"' + (di === DAGEN.length - 1 ? ' disabled' : '') + '>' + ic('right') + '</button></span></li>';
          }).join('') + '</ul>' : '<p class="pf-empty">Vrij</p>') + '</section>';
      }).join('') + '</div>';
  }

  /* ---------- assistent ---------- */
  function answer(q) {
    var t = q.toLowerCase();
    var lijst = function (arr) { return arr.map(function (d) { return d.id + ' (' + d.titel.toLowerCase() + ')'; }).join(', '); };
    var vd = open().filter(function (d) { return d.dag === VANDAAG; });
    var wacht = S.d.filter(function (d) { return d.status === 'wacht'; });
    var con = concepten();
    if (/vandaag|gepland|planning/.test(t)) return vd.length ? 'Vandaag (' + DAG_L[VANDAAG] + ') staan ' + vd.length + ' open dossiers gepland: ' + lijst(vd) + '.' : 'Vandaag staat er niets open.';
    if (/wacht|klant/.test(t)) return wacht.length ? wacht.length + ' dossiers wachten op een reactie van de klant: ' + lijst(wacht) + '.' : 'Er wacht geen enkel dossier op een klant.';
    if (/controle|concept|check|ai/.test(t)) return con.length ? con.length + ' concepten wachten op controle door een mens: ' + lijst(con) + '. Er wordt niets verstuurd voor iemand ze heeft nagekeken.' : 'Er zijn geen concepten die op controle wachten.';
    if (/open|hoeveel|aantal|dossiers/.test(t)) return 'Er zijn ' + open().length + ' open dossiers en ' + (S.d.length - open().length) + ' afgeronde.';
    return 'Dat kan ik in dit voorbeeld niet beantwoorden. Probeer een van de vragen hierboven.';
  }
  function viewAssistent() {
    var on = S.asstOn[S.asstSel];
    var con = concepten();
    var chat = S.chat.length ? S.chat.map(function (m) { return '<p class="pf-m pf-m--' + m.r + '">' + h(m.x) + '</p>'; }).join('') : '<p class="pf-empty">Stel een vraag, of kies er een hieronder.</p>';
    return '<div class="pf-head"><h3 class="pf-h">Assistent</h3><span class="pf-sub">Antwoorden komen uit de voorbeeldgegevens in dit venster</span></div>' +
      '<div class="pf-two pf-two--a"><section aria-labelledby="pf-as"><h4 class="pf-h2" id="pf-as">Assistenten</h4><ul class="pf-asl">' + ASST.map(function (n, i) {
        return '<li class="' + (i === S.asstSel ? 'is-sel' : '') + '"><button type="button" class="pf-asb" data-act="asst-pick" data-i="' + i + '" aria-pressed="' + (i === S.asstSel) + '"><span class="pf-an">' + h(n) + '</span><span class="pf-as2">' + (S.asstOn[i] ? 'Staat aan' : 'Staat uit') + '</span></button>' +
          '<button type="button" class="pf-sw" role="switch" data-act="asst-toggle" data-i="' + i + '" aria-checked="' + S.asstOn[i] + '" aria-label="' + h(n) + ' aan of uit"><i></i></button></li>';
      }).join('') + '</ul>' +
      '<h4 class="pf-h2">Wachten op controle</h4>' + (con.length ? '<ul class="pf-list">' + con.map(function (d) {
        return '<li><button type="button" class="pf-li" data-act="open" data-id="' + d.id + '" data-fk="o-' + d.id + '">' + st('draft') + '<span class="pf-lt">' + h(d.titel) + '</span><span class="pf-lk">' + d.id + '</span></button></li>';
      }).join('') + '</ul>' : '<p class="pf-empty">Alle concepten zijn nagekeken.</p>') + '</section>' +
      '<section class="pf-chat" aria-labelledby="pf-cs"><h4 class="pf-h2" id="pf-cs">' + h(ASST[S.asstSel]) + '</h4><p class="pf-ai"><span class="ai-c">Je gebruikt een AI-assistent</span></p>' +
      '<div class="pf-chatlog" role="log" aria-live="polite" aria-label="Gesprek met ' + h(ASST[S.asstSel]) + '">' + chat + '</div>' +
      '<div class="pf-chips" role="group" aria-label="Voorbeeldvragen">' + [['Wat staat er vandaag gepland?', 'vandaag'], ['Welke dossiers wachten op de klant?', 'wacht'], ['Welke concepten moet ik nakijken?', 'controle']].map(function (q) {
        return '<button type="button" class="pf-chip" data-act="ask" data-q="' + h(q[0]) + '"' + (on ? '' : ' disabled') + '>' + q[0] + '</button>';
      }).join('') + '</div>' +
      '<form class="pf-ask" data-form="ask"><label class="vh" for="pf-askq">Stel een vraag aan ' + h(ASST[S.asstSel]) + '</label><input id="pf-askq" type="text" placeholder="' + (on ? 'Stel een vraag' : 'Zet de assistent aan om te vragen') + '" value="' + h(S.chatDraft) + '"' + (on ? '' : ' disabled') + ' autocomplete="off"><button type="submit" class="pf-btn pf-btn--a"' + (on ? '' : ' disabled') + '>' + ic('send') + '<span>Vraag</span></button></form>' +
      '<p class="pf-fine">Een mens controleert wat naar een klant gaat.</p></section></div>';
  }

  /* ---------- koppelingen ---------- */
  function viewKoppelingen() {
    return '<div class="pf-head"><h3 class="pf-h">Koppelingen</h3><span class="pf-sub">Het platform praat met de pakketten die je al gebruikt</span></div>' +
      '<ul class="pf-kl">' + S.koppel.map(function (k, i) {
        var stt = k.bezig ? 'Bezig met synchroniseren' : k.aan ? 'Verbonden' : 'Gepauzeerd';
        return '<li class="pf-k' + (k.aan ? '' : ' is-off') + '"><div class="pf-kb"><h4>' + h(k.naam) + '</h4><p>' + h(k.wat) + '</p><p class="pf-ks">' + st(k.bezig ? 'prog' : k.aan ? 'done' : 'todo') + '<span>' + stt + '</span><span class="pf-kt">Laatst: ' + h(k.sync) + '</span></p></div>' +
          '<div class="pf-ka"><button type="button" class="pf-btn" data-act="sync" data-i="' + i + '"' + (!k.aan || k.bezig ? ' disabled' : '') + '>Nu synchroniseren</button>' +
          '<button type="button" class="pf-btn" data-act="koppel-toggle" data-i="' + i + '" aria-pressed="' + !k.aan + '">' + (k.aan ? 'Pauzeer' : 'Hervat') + '</button></div></li>';
      }).join('') + '</ul><p class="pf-fine">In dit voorbeeld gaat er niets echt door. Zo toont het hoe een koppeling in beeld komt.</p>';
  }

  /* ---------- klantportaal ---------- */
  var STAPPEN_P = ['Ontvangen', 'In behandeling', 'Klaar'];
  function portaalStap(s) { return s === 'nieuw' ? 0 : s === 'klaar' ? 2 : 1; }
  function viewPortaal() {
    var mine = S.d.filter(function (d) { return d.klant === PORTAAL_KLANT; });
    return '<div class="pf-head"><h3 class="pf-h">Jouw dossiers</h3><span class="pf-sub">Zo ziet ' + PORTAAL_KLANT + ' het · dezelfde gegevens als het team</span></div>' +
      (mine.length ? '<ul class="pf-pl">' + mine.map(function (d) {
        var cur = portaalStap(d.status);
        var msgs = d.berichten.filter(function (b) { return b.klant; });
        var dr = draft(d.id);
        return '<li class="pf-pd" id="pf-p-' + d.id + '"><div class="pf-pdh"><h4>' + h(d.titel) + '</h4><span class="pf-ref">' + d.id + '</span></div>' +
          '<ol class="pf-steps" aria-label="Voortgang van ' + h(d.titel) + '">' + STAPPEN_P.map(function (s, i) {
            return '<li class="' + (i < cur || d.status === 'klaar' ? 'is-done' : i === cur ? 'is-cur' : '') + '"' + (i === cur ? ' aria-current="step"' : '') + '>' + st(i < cur || d.status === 'klaar' ? 'done' : i === cur ? 'prog' : 'todo') + '<span>' + s + '</span></li>';
          }).join('') + '</ol>' +
          (d.status === 'wacht' ? '<p class="pf-wait">We wachten op jouw reactie.</p>' : '') +
          '<div class="pf-msgs">' + (msgs.length ? msgs.map(function (b) { return '<p class="pf-b pf-b--' + b.uit + '"><span class="pf-bw">' + h(b.van) + ' · ' + h(b.t) + '</span>' + h(b.txt) + '</p>'; }).join('') : '<p class="pf-empty">Nog geen berichten.</p>') + '</div>' +
          (d.status === 'klaar' ? '' : '<form class="pf-reply" data-form="reply" data-id="' + d.id + '"><label for="pf-r-' + d.id + '">' + (d.status === 'wacht' ? 'Jouw reactie' : 'Stel een vraag') + '</label><textarea id="pf-r-' + d.id + '" rows="2" data-draft="reply" data-id="' + d.id + '">' + h(dr.reply) + '</textarea><button type="submit" class="pf-btn pf-btn--a">' + ic('send') + '<span>Verstuur</span></button></form>') + '</li>';
      }).join('') + '</ul>' : '<p class="pf-empty">Je hebt nog geen dossiers.</p>');
  }

  /* ---------- detail van een dossier ---------- */
  function detailHTML(d) {
    var dr = draft(d.id);
    var done = d.stappen.filter(function (s) { return s.done; }).length;
    var pct = d.stappen.length ? Math.round(100 * done / d.stappen.length) : 0;
    var ai = '';
    if (d.ai) {
      var txt = dr.ai === null ? d.ai.tekst : dr.ai;
      if (d.ai.verstuurd) {
        ai = '<section class="pf-aib is-sent" aria-labelledby="pf-aih"><h4 class="pf-h2" id="pf-aih">Antwoord</h4><p class="pf-ai"><span class="ai-c">Je gebruikt een AI-assistent</span><span class="pf-an2">' + h(d.ai.naam) + '</span></p><p class="pf-q">' + h(txt) + '</p><p class="pf-sent">' + st('done') + '<span>Gecontroleerd door een mens en verstuurd</span></p></section>';
      } else {
        ai = '<section class="pf-aib" aria-labelledby="pf-aih"><h4 class="pf-h2" id="pf-aih">Antwoord voor de klant</h4><p class="pf-ai"><span class="ai-c">Je gebruikt een AI-assistent</span><span class="pf-an2">' + h(d.ai.naam) + ' stelt dit voor</span></p>' +
          '<label class="vh" for="pf-aitxt">Voorgesteld antwoord</label><textarea id="pf-aitxt" rows="4" data-draft="ai" data-id="' + d.id + '"' + (d.ai.bewerk ? '' : ' readonly') + '>' + h(txt) + '</textarea>' +
          '<div class="pf-aia"><button type="button" class="pf-btn" data-act="ai-edit" data-id="' + d.id + '" aria-pressed="' + d.ai.bewerk + '">' + (d.ai.bewerk ? 'Klaar met aanpassen' : 'Pas aan') + '</button>' +
          '<label class="pf-ck" for="pf-aic"><input type="checkbox" id="pf-aic" data-act="ai-check" data-id="' + d.id + '"' + (d.ai.gecheckt ? ' checked' : '') + '><span class="pf-box" aria-hidden="true">' + (d.ai.gecheckt ? '<svg viewBox="0 0 14 14"><path d="' + IC.check + '"/></svg>' : '') + '</span><span>Gecontroleerd door een mens</span></label>' +
          '<button type="button" class="pf-btn pf-btn--a" data-act="ai-send" data-id="' + d.id + '"' + (d.ai.gecheckt ? '' : ' disabled') + '>' + ic('send') + '<span>Verstuur naar de klant</span></button></div>' +
          (d.ai.gecheckt ? '' : '<p class="pf-fine">Verzenden kan pas nadat een mens het antwoord heeft gecontroleerd.</p>') + '</section>';
      }
    }
    var msgs = d.berichten.length ? '<ul class="pf-bl">' + d.berichten.map(function (b) {
      return '<li class="pf-b pf-b--' + b.uit + '"><span class="pf-bw">' + h(b.van) + ' · ' + h(b.t) + (b.uit === 'intern' ? ' · alleen intern' : '') + '</span>' + h(b.txt) + '</li>';
    }).join('') + '</ul>' : '<p class="pf-empty">Nog geen berichten.</p>';
    return '<div class="pf-dh"><button type="button" class="pf-back" data-act="close" aria-label="Terug naar de lijst">' + ic('back') + '<span>Terug</span></button><span class="pf-ref">' + d.id + '</span>' + badge(d.status) + '<span class="sp"></span><button type="button" class="pf-x" data-act="close" aria-label="Sluit dossier ' + d.id + '">' + ic('close') + '<kbd>Esc</kbd></button></div>' +
      '<div class="pf-db"><h3 class="pf-dt" id="pf-dt" tabindex="-1">' + h(d.titel) + '</h3>' +
      '<dl class="pf-props"><div><dt>Klant</dt><dd>' + h(d.klant) + '</dd></div><div><dt>Soort</dt><dd>' + h(d.soort) + '</dd></div><div><dt>Verantwoordelijke</dt><dd>' + h(d.rol) + '</dd></div>' +
      '<div><dt><label for="pf-st">Status</label></dt><dd><select id="pf-st" data-act="status" data-id="' + d.id + '">' + STATUS.map(function (s) { return '<option value="' + s[0] + '"' + (d.status === s[0] ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('') + '</select></dd></div>' +
      '<div><dt><label for="pf-dg">Dag</label></dt><dd><select id="pf-dg" data-act="dag" data-id="' + d.id + '">' + DAGEN.map(function (x) { return '<option value="' + x + '"' + (d.dag === x ? ' selected' : '') + '>' + x[0] + x[1] + ' (' + DAG_L[x] + ')</option>'; }).join('') + '</select></dd></div></dl>' +
      '<section aria-labelledby="pf-sh"><h4 class="pf-h2" id="pf-sh">Stappen <span class="pf-cnt">' + done + ' van ' + d.stappen.length + '</span></h4><div class="pf-prog" role="progressbar" aria-label="Voortgang" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><i style="width:' + pct + '%"></i></div>' +
      '<ul class="pf-steps2">' + d.stappen.map(function (s, i) {
        return '<li><label class="pf-ck" for="pf-s-' + i + '"><input type="checkbox" id="pf-s-' + i + '" data-act="step" data-id="' + d.id + '" data-i="' + i + '"' + (s.done ? ' checked' : '') + '><span class="pf-box" aria-hidden="true">' + (s.done ? '<svg viewBox="0 0 14 14"><path d="' + IC.check + '"/></svg>' : '') + '</span><span>' + h(s.t) + '</span></label></li>';
      }).join('') + '</ul></section>' + ai +
      '<section aria-labelledby="pf-bh"><h4 class="pf-h2" id="pf-bh">Berichten</h4>' + msgs +
      '<form class="pf-note" data-form="note" data-id="' + d.id + '"><label for="pf-nt">Notitie of bericht</label><textarea id="pf-nt" rows="2" data-draft="note" data-id="' + d.id + '">' + h(dr.note) + '</textarea>' +
      '<div class="pf-na"><label class="pf-ck" for="pf-zv"><input type="checkbox" id="pf-zv" data-draft="zicht" data-id="' + d.id + '"' + (dr.zicht ? ' checked' : '') + '><span class="pf-box" aria-hidden="true">' + (dr.zicht ? '<svg viewBox="0 0 14 14"><path d="' + IC.check + '"/></svg>' : '') + '</span><span>Zichtbaar voor de klant</span></label><button type="submit" class="pf-btn">Toevoegen</button></div></form></section></div>';
  }
  function renderDetail(focusTitle) {
    var el = $('#pf-detail');
    var d = S.sel && S.mode === 'team' ? byId(S.sel) : null;
    if (!d) { el.hidden = true; el.innerHTML = ''; root.classList.remove('has-detail'); return; }
    var scroll = $('.pf-db', el) ? $('.pf-db', el).scrollTop : 0;
    el.innerHTML = detailHTML(d);
    el.hidden = false;
    root.classList.add('has-detail');
    el.setAttribute('aria-label', 'Dossier ' + d.id + ': ' + d.titel);
    var db = $('.pf-db', el);
    if (db) db.scrollTop = scroll;
    if (focusTitle) { var t = $('#pf-dt'); if (t) t.focus({ preventScroll: true }); }
  }

  /* ---------- dialoog: nieuw dossier of nieuwe aanvraag ---------- */
  var dlg = $('#pf-dlg');
  function openNew() {
    var team = S.mode === 'team';
    var sel = function (id, label, opts) { return '<div class="pf-f"><label for="' + id + '">' + label + '</label><select id="' + id + '">' + opts.map(function (o) { return '<option>' + h(o) + '</option>'; }).join('') + '</select></div>'; };
    dlg.innerHTML = '<form method="dialog" class="pf-nf" novalidate><h3 id="pf-nh">' + (team ? 'Nieuw dossier' : 'Nieuwe aanvraag') + '</h3>' +
      '<div class="pf-f"><label for="pf-nti">' + (team ? 'Titel' : 'Waarmee kunnen we helpen?') + '</label><input id="pf-nti" type="text" maxlength="60" autocomplete="off" aria-describedby="pf-ne"><p class="pf-err" id="pf-ne" role="alert" hidden>' + (team ? 'Geef het dossier een titel.' : 'Vertel kort waarmee we kunnen helpen.') + '</p></div>' +
      (team ? sel('pf-nk', 'Klant', KLANTEN) + sel('pf-ns', 'Soort', SOORTEN) + sel('pf-nd', 'Dag', DAGEN) : '') +
      '<div class="pf-na"><button type="button" class="pf-btn" data-act="new-cancel">Annuleer</button><button type="submit" class="pf-btn pf-btn--a">' + (team ? 'Toevoegen' : 'Verstuur') + '</button></div></form>';
    dlg.setAttribute('aria-labelledby', 'pf-nh');
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    $('#pf-nti', dlg).focus();
  }
  function closeNew() { if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open'); }
  function submitNew() {
    var inp = $('#pf-nti', dlg), err = $('#pf-ne', dlg);
    var titel = inp.value.trim();
    if (!titel) { err.hidden = false; inp.setAttribute('aria-invalid', 'true'); inp.focus(); return; }
    var team = S.mode === 'team';
    var id = 'D-' + (S.seq++);
    var d = {
      id: id, titel: titel, klant: team ? $('#pf-nk', dlg).value : PORTAAL_KLANT, soort: team ? $('#pf-ns', dlg).value : 'Aanvraag', status: 'nieuw', dag: team ? $('#pf-nd', dlg).value : 'Di', rol: 'Medewerker',
      stappen: [{ t: 'Gelezen', done: false }, { t: 'Opgepakt', done: false }], ai: null, berichten: []
    };
    S.d.push(d);
    addLog((team ? 'Nieuw dossier ' : d.klant + ' deed een nieuwe aanvraag: ') + id);
    closeNew();
    if (team) { S.view = 'dossiers'; S.filter = 'alle'; S.q = ''; S.sel = id; renderAll(true); toast('Dossier ' + id + ' is toegevoegd.'); }
    else { renderAll(); toast('Je aanvraag is verstuurd. Het team ziet ze als ' + id + '.'); }
  }

  /* ---------- tekenen ---------- */
  function renderAll(focusTitle) {
    renderChrome();
    renderMain();
    renderDetail(focusTitle);
    restoreFocus();
  }
  function restoreFocus() {
    if (!S.focusKey) return;
    var n = root.querySelector('[data-fk="' + S.focusKey + '"]');
    if (!n || n.disabled) n = S.focusAlt ? root.querySelector('[data-fk="' + S.focusAlt + '"]') : null;
    S.focusKey = null; S.focusAlt = null;
    if (n && !n.disabled) n.focus({ preventScroll: true });
  }
  function refresh() {
    renderChrome();
    renderMain();
    renderDetail(false);
    restoreFocus();
  }

  function selectDossier(id) {
    S.sel = id;
    refresh();
    renderDetail(true);
  }
  function closeDetail() {
    var id = S.sel;
    S.sel = null;
    S.focusKey = id ? 'o-' + id : null;
    refresh();
  }

  /* ---------- acties ---------- */
  function act(el, ev) {
    var a = el.getAttribute('data-act');
    var id = el.getAttribute('data-id');
    var d = id ? byId(id) : null;
    switch (a) {
      case 'nav': S.view = el.getAttribute('data-v'); S.sel = null; S.mode = 'team'; refresh(); $('#pf-main').focus({ preventScroll: true }); break;
      case 'mode': S.mode = el.getAttribute('data-m'); S.sel = null; refresh(); break;
      case 'tile': S.view = el.getAttribute('data-v'); if (el.getAttribute('data-f')) { S.filter = el.getAttribute('data-f'); S.q = ''; } S.sel = null; refresh(); $('#pf-main').focus({ preventScroll: true }); break;
      case 'open': if (d) selectDossier(id); break;
      case 'close': closeDetail(); break;
      case 'filter': S.filter = el.getAttribute('data-f'); $$('.pf-chip', $('#pf-main')).forEach(function (c) { c.setAttribute('aria-pressed', String(c === el)); }); renderRows(); break;
      case 'sort': var k = el.getAttribute('data-s'); S.sort = { k: k, dir: S.sort.k === k ? -S.sort.dir : 1 }; renderMain(); var sb = root.querySelector('[data-s="' + k + '"]'); if (sb) sb.focus({ preventScroll: true }); break;
      case 'shift': if (d) { var i = DAGEN.indexOf(d.dag) + parseInt(el.getAttribute('data-dir'), 10); if (i >= 0 && i < DAGEN.length) { d.dag = DAGEN[i]; addLog('Dossier ' + d.id + ' staat nu op ' + DAG_L[d.dag]); S.focusKey = 's-' + d.id + el.getAttribute('data-dir'); S.focusAlt = 'o-' + d.id; refresh(); renderDetail(false); toast(d.id + ' verplaatst naar ' + DAG_L[d.dag] + '.'); } } break;
      case 'status': if (d) { d.status = el.value; addLog('Dossier ' + d.id + ' staat nu op ' + STATUS_L[d.status].toLowerCase()); S.focusKey = null; renderChrome(); renderMain(); var det = $('#pf-detail'); var badgeEl = $('.bd', det); if (badgeEl) badgeEl.outerHTML = badge(d.status); toast(d.id + ': ' + STATUS_L[d.status] + '.'); } break;
      case 'dag': if (d) { d.dag = el.value; addLog('Dossier ' + d.id + ' staat nu op ' + DAG_L[d.dag]); renderChrome(); renderMain(); toast(d.id + ' staat op ' + DAG_L[d.dag] + '.'); } break;
      case 'step': if (d) { d.stappen[parseInt(el.getAttribute('data-i'), 10)].done = el.checked; var keep = $('.pf-db', $('#pf-detail')); var sc = keep ? keep.scrollTop : 0; renderDetail(false); var kb = $('.pf-db', $('#pf-detail')); if (kb) kb.scrollTop = sc; var again = $('[data-act="step"][data-i="' + el.getAttribute('data-i') + '"]', $('#pf-detail')); if (again) again.focus({ preventScroll: true }); } break;
      case 'ai-check': if (d && d.ai) { d.ai.gecheckt = el.checked; renderDetail(false); var c2 = $('[data-act="ai-check"]', $('#pf-detail')); if (c2) c2.focus({ preventScroll: true }); } break;
      case 'ai-edit': if (d && d.ai) { d.ai.bewerk = !d.ai.bewerk; renderDetail(false); var ta = $('#pf-aitxt'); if (ta && d.ai.bewerk) ta.focus(); else { var eb = $('[data-act="ai-edit"]', $('#pf-detail')); if (eb) eb.focus(); } } break;
      case 'ai-send': if (d && d.ai && d.ai.gecheckt) {
        var dr = draft(d.id);
        var txt = dr.ai === null ? d.ai.tekst : dr.ai;
        d.ai.verstuurd = true; d.ai.tekst = txt; dr.ai = null; d.status = 'wacht';
        d.stappen.forEach(function (s) { s.done = true; });
        d.berichten.push({ van: 'Team', klant: true, uit: 'team', txt: txt, t: 'Zojuist' });
        addLog('Antwoord bij ' + d.id + ' verstuurd na controle');
        refresh(); renderDetail(true);
        toast('Antwoord bij ' + d.id + ' is verstuurd. In dit voorbeeld gaat er niets echt weg.');
      } break;
      case 'asst-pick': S.asstSel = parseInt(el.getAttribute('data-i'), 10); S.focusKey = null; renderMain(); var pb = root.querySelector('[data-act="asst-pick"][data-i="' + S.asstSel + '"]'); if (pb) pb.focus({ preventScroll: true }); break;
      case 'asst-toggle': var ai = parseInt(el.getAttribute('data-i'), 10); S.asstOn[ai] = !S.asstOn[ai]; renderMain(); var tb = root.querySelector('[data-act="asst-toggle"][data-i="' + ai + '"]'); if (tb) tb.focus({ preventScroll: true }); toast(ASST[ai] + (S.asstOn[ai] ? ' staat aan.' : ' staat uit.')); break;
      case 'ask': ask(el.getAttribute('data-q')); break;
      case 'sync': var kk = S.koppel[parseInt(el.getAttribute('data-i'), 10)]; if (kk && kk.aan && !kk.bezig) { kk.bezig = true; renderMain(); var kfocus = root.querySelector('.pf-kl li:nth-child(' + (parseInt(el.getAttribute('data-i'), 10) + 1) + ') .pf-btn:last-child'); if (kfocus) kfocus.focus({ preventScroll: true }); clearTimeout(timers['k' + kk.id]); timers['k' + kk.id] = setTimeout(function () { kk.bezig = false; kk.sync = 'Zojuist'; addLog(kk.naam + ' is gesynchroniseerd'); if (S.view === 'koppelingen' && S.mode === 'team') renderMain(); renderChrome(); toast(kk.naam + ' is gesynchroniseerd.'); }, 1100); } break;
      case 'koppel-toggle': var k2 = S.koppel[parseInt(el.getAttribute('data-i'), 10)]; k2.aan = !k2.aan; if (!k2.aan) { k2.bezig = false; clearTimeout(timers['k' + k2.id]); } addLog(k2.naam + (k2.aan ? ' is hervat' : ' is gepauzeerd')); var ki = el.getAttribute('data-i'); renderMain(); var kt = root.querySelector('[data-act="koppel-toggle"][data-i="' + ki + '"]'); if (kt) kt.focus({ preventScroll: true }); toast(k2.naam + (k2.aan ? ' is weer verbonden.' : ' is gepauzeerd.')); break;
      case 'new': openNew(); break;
      case 'new-cancel': closeNew(); break;
      case 'reset': var keepFocus = true; S = seed(); renderAll(); toast('De voorbeeldgegevens staan weer zoals bij het begin.'); if (keepFocus) { var rb = root.querySelector('[data-act="reset"]'); if (rb) rb.focus({ preventScroll: true }); } break;
    }
  }
  function ask(q) {
    q = String(q || '').trim();
    if (!q || !S.asstOn[S.asstSel]) return;
    S.chat.push({ r: 'u', x: q });
    S.chat.push({ r: 'a', x: answer(q) });
    S.chatDraft = '';
    renderMain();
    var inp = $('#pf-askq'); if (inp) inp.focus({ preventScroll: true });
  }

  /* ---------- gebeurtenissen ---------- */
  root.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act]');
    if (el && root.contains(el)) {
      if (el.tagName === 'SELECT' || (el.tagName === 'INPUT' && el.type === 'checkbox')) return;
      if (el.disabled) return;
      ev.preventDefault();
      act(el, ev);
      return;
    }
    var tr = ev.target.closest('tr[data-id]');
    if (tr && !ev.target.closest('button')) selectDossier(tr.getAttribute('data-id'));
  });
  root.addEventListener('change', function (ev) {
    var el = ev.target;
    if (el.hasAttribute('data-draft')) {
      if (el.getAttribute('data-draft') === 'zicht') {
        draft(el.getAttribute('data-id')).zicht = el.checked;
        var bx = el.parentNode.querySelector('.pf-box');
        if (bx) bx.innerHTML = el.checked ? '<svg viewBox="0 0 14 14"><path d="' + IC.check + '"/></svg>' : '';
      }
      return;
    }
    if (el.hasAttribute('data-act') && (el.tagName === 'SELECT' || el.type === 'checkbox')) act(el);
  });
  root.addEventListener('input', function (ev) {
    var el = ev.target;
    if (el.id === 'pf-q') { S.q = el.value; renderRows(); return; }
    if (el.id === 'pf-askq') { S.chatDraft = el.value; return; }
    var dk = el.getAttribute && el.getAttribute('data-draft');
    if (dk === 'note') draft(el.getAttribute('data-id')).note = el.value;
    else if (dk === 'ai') draft(el.getAttribute('data-id')).ai = el.value;
    else if (dk === 'reply') draft(el.getAttribute('data-id')).reply = el.value;
  });
  root.addEventListener('submit', function (ev) {
    var f = ev.target.closest('form[data-form]');
    if (!f) return;
    ev.preventDefault();
    var kind = f.getAttribute('data-form');
    var id = f.getAttribute('data-id');
    var d = id ? byId(id) : null;
    if (kind === 'ask') { ask($('#pf-askq').value); return; }
    var ta = $('textarea', f);
    var txt = ta ? ta.value.trim() : '';
    if (!txt) { ta.focus(); toast('Schrijf eerst een bericht.'); return; }
    if (kind === 'note' && d) {
      var dr = draft(id);
      d.berichten.push({ van: 'Team', klant: dr.zicht, uit: dr.zicht ? 'team' : 'intern', txt: txt, t: 'Zojuist' });
      addLog((dr.zicht ? 'Bericht aan de klant bij ' : 'Interne notitie bij ') + id);
      dr.note = ''; dr.zicht = false;
      renderChrome(); renderMain(); renderDetail(false);
      var nt = $('#pf-nt'); if (nt) nt.focus({ preventScroll: true });
      toast(dr.zicht ? 'Bericht staat in het klantportaal.' : 'Notitie toegevoegd.');
    } else if (kind === 'reply' && d) {
      var r = draft(id);
      d.berichten.push({ van: d.klant, klant: true, uit: 'klant', txt: txt, t: 'Zojuist' });
      if (d.status === 'wacht') d.status = 'bezig';
      addLog(d.klant + ' reageerde bij ' + id);
      r.reply = '';
      S.focusKey = null;
      refresh();
      var again = root.querySelector('#pf-r-' + id); if (again) again.focus({ preventScroll: true });
      toast('Je bericht is verstuurd. Het team ziet het bij ' + id + '.');
    }
  });
  dlg.addEventListener('submit', function (ev) { ev.preventDefault(); submitNew(); });
  dlg.addEventListener('input', function () { var inp = $('#pf-nti', dlg); if (inp && inp.value.trim()) { $('#pf-ne', dlg).hidden = true; inp.removeAttribute('aria-invalid'); } });
  dlg.addEventListener('click', function (ev) { if (ev.target === dlg) closeNew(); });
  dlg.addEventListener('close', function () { var a = document.activeElement; if (a && a !== document.body && root.contains(a) && !dlg.contains(a)) return; var b = root.querySelector('[data-act="new"]'); if (b) b.focus({ preventScroll: true }); });

  root.addEventListener('keydown', function (ev) {
    var k = ev.key, t = ev.target;
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    if (k === 'Escape' && !dlg.open && S.sel) { ev.preventDefault(); ev.stopPropagation(); closeDetail(); return; }
    if ((k === 'n' || k === 'N') && !typing && !ev.ctrlKey && !ev.metaKey && !ev.altKey && !dlg.open) { ev.preventDefault(); openNew(); return; }
    if ((k === 'ArrowDown' || k === 'ArrowUp') && t.classList && (t.classList.contains('pf-rowbtn') || t.classList.contains('pf-li') || t.classList.contains('pf-pb'))) {
      var all = $$('.' + t.classList[0], $('#pf-main'));
      var i = all.indexOf(t);
      var n = all[i + (k === 'ArrowDown' ? 1 : -1)];
      if (n) { ev.preventDefault(); n.focus(); }
    }
  });

  // startknoppen buiten het venster
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-pf-go]');
    if (!b) return;
    var p = b.getAttribute('data-pf-go').split(':');
    if (p[0] === 'dossier') { S.mode = 'team'; S.view = 'dossiers'; S.filter = 'alle'; S.q = ''; S.sel = p[1]; renderAll(true); }
    else if (p[0] === 'view') { S.mode = 'team'; S.view = p[1]; S.sel = null; renderAll(); }
    else if (p[0] === 'mode') { S.mode = p[1]; S.sel = null; renderAll(); }
    root.scrollIntoView({ block: 'nearest' });
  });

  root.classList.add('is-ready');
  renderAll();
})();
