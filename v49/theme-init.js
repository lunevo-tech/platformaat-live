/* 30: zet de weergave (licht of donker) voordat de pagina getekend wordt, zodat er niets flitst.
   Volgorde: eigen keuze van de bezoeker (opgeslagen in localStorage onder «pm-thema»); anders de instelling van het apparaat (prefers-color-scheme). */
(function () {
  var keuze = 'auto';
  try { var v = localStorage.getItem('pm-thema'); if (v === 'light' || v === 'dark') keuze = v; } catch (e) { /* mag ontbreken */ }
  var donker = keuze === 'dark' || (keuze === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  var d = document.documentElement;
  d.setAttribute('data-theme', donker ? 'dark' : 'light');
  d.setAttribute('data-keuze', keuze);
})();
