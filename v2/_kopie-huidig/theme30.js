/* 30: knop rechtsonder om de weergave te kiezen: Automatisch (volgt het apparaat) → Licht → Donker → Automatisch.
   De keuze wordt onthouden in localStorage («pm-thema»; bij «Automatisch» wordt ze gewist). Bij «Automatisch» wisselt de site mee als de instelling van het apparaat verandert.
   Er wordt niets verstuurd. Zie de cookiepagina. */
'use strict';
(function () {
  var d = document.documentElement;
  var knop = document.getElementById('theme30');
  var mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
  var NAAM = { auto: 'automatisch', light: 'licht', dark: 'donker' };
  var VOLGT = { auto: 'light', light: 'dark', dark: 'auto' };

  function opgeslagen() {
    try { var v = localStorage.getItem('pm-thema'); return v === 'light' || v === 'dark' ? v : 'auto'; } catch (e) { return 'auto'; }
  }
  function toon(keuze) {
    var donker = keuze === 'dark' || (keuze === 'auto' && mq && mq.matches);
    d.setAttribute('data-theme', donker ? 'dark' : 'light');
    d.setAttribute('data-keuze', keuze);
    var meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = donker ? '#0b101b' : '#14213d';
    if (knop) {
      var l = knop.querySelector('.t-lbl'); if (l) l.textContent = 'Weergave: ' + NAAM[keuze];
      knop.setAttribute('aria-label', 'Weergave: ' + NAAM[keuze] + (keuze === 'auto' ? ' (volgt je apparaat)' : '') + '. Klik om te wisselen naar ' + NAAM[VOLGT[keuze]] + '.');
      knop.setAttribute('data-keuze', keuze);
    }
  }
  function bewaar(keuze) {
    try { if (keuze === 'auto') localStorage.removeItem('pm-thema'); else localStorage.setItem('pm-thema', keuze); } catch (e) { /* mag ontbreken */ }
  }
  if (knop) knop.addEventListener('click', function () { var n = VOLGT[d.getAttribute('data-keuze') || 'auto']; bewaar(n); toon(n); });
  if (mq) { var wissel = function () { if (opgeslagen() === 'auto') toon('auto'); }; if (mq.addEventListener) mq.addEventListener('change', wissel); else if (mq.addListener) mq.addListener(wissel); }
  window.addEventListener('storage', function (e) { if (e.key === 'pm-thema') toon(opgeslagen()); });
  toon(opgeslagen());
})();
