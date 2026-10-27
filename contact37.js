/* 37: contactformulier dat echt kan verzenden. Eén instelling in de kop van de pagina bepaalt waar het naartoe gaat:
     <meta name="contact-api" content="aan">                      «uit» (preview) = er wordt niets verstuurd; «aan» = verzenden is actief
     <meta name="contact-endpoint" content="https://…/api/contact"> waarheen het formulier post; zonder deze meta: «api/contact» op hetzelfde domein
   Wisselen van mailaanbieder of platform raakt de website dus niet: alleen die ene regel verwijst naar iets anders.
   Contract van de route: JSON { name, email, interest, message, website } -> 200 { sent: true } of een fout { sent: false, message }. Zie previews/_contact-server.
   Mislukt verzenden (of staat het uit), dan blijft je tekst staan en kun je het bericht kopiëren of in je mailapp openen. Er is geen opslag in de pagina. */
'use strict';
(function () {
  var form = document.getElementById('project-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var knop = document.getElementById('contact-submit');
  var preview = document.getElementById('preview-note');
  var mailapp = document.getElementById('mailapp');
  var MAIL = 'info@platformaat.be';
  var bezig = false;

  function meta(naam) { var m = document.querySelector('meta[name="' + naam + '"]'); return m ? m.getAttribute('content') : ''; }
  var actief = meta('contact-api') === 'aan' && location.protocol !== 'file:';   /* nooit vanaf een lokaal bestand */
  var endpoint = meta('contact-endpoint') || 'api/contact';
  if (actief && preview) preview.hidden = true;

  function meld(tekst, soort) { status.textContent = tekst; status.setAttribute('data-kind', soort || ''); }
  function waarden() {
    var f = new FormData(form), o = {};
    f.forEach(function (v, k) { o[k] = typeof v === 'string' ? v : ''; });
    return o;
  }
  function tekst() {
    var w = waarden();
    return 'Hallo PlatforMaat,\n\nMijn naam is ' + (w.name || '').trim() + '.\nMijn e-mailadres: ' + (w.email || '').trim() + '\nIk denk aan: ' + (w.interest || '') + '\n\n' + (w.message || '').trim() + (w.bron ? '\n\nHoe vond je ons: ' + w.bron : '');
  }
  function ververs() {
    if (mailapp) mailapp.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Projectvraag: ' + (waarden().interest || '')) + '&body=' + encodeURIComponent(tekst());
  }

  form.addEventListener('input', function (e) { if (e.target.setCustomValidity) e.target.setCustomValidity(''); ververs(); });
  form.addEventListener('change', ververs);
  ververs();

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (bezig) return;
    var velden = form.querySelectorAll('[required]');
    for (var i = 0; i < velden.length; i++) {
      var el = velden[i];
      el.setCustomValidity(el.value.trim() ? (el.type === 'email' && !el.checkValidity() ? 'Vul een geldig e-mailadres in.' : '') : 'Vul dit veld even in.');
    }
    if (!form.reportValidity()) return;
    var w = waarden();
    if (w.website) { meld('Bedankt.', 'success'); form.reset(); return; }   /* lokveld voor spam: stil negeren */
    if (!actief) {
      meld('Dit is een preview: er is niets verstuurd. Je tekst blijft staan. Kopieer je bericht of open het in je mailapp.', 'error');
      return;
    }
    bezig = true; knop.disabled = true; var oud = knop.textContent; knop.textContent = 'Bezig met versturen…';
    meld('Je vraag wordt verstuurd…');
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: w.name, email: w.email, interest: w.interest, message: w.message + (w.bron ? '\n\nHoe vond je ons: ' + w.bron : ''), website: w.website || '' }), signal: AbortSignal.timeout ? AbortSignal.timeout(25000) : undefined })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }, function () { return { ok: false, j: null }; }); })
      .then(function (x) {
        if (!x.ok || !x.j || x.j.sent !== true) { meld((x.j && x.j.message) || 'Versturen lukt nu niet. Je tekst blijft staan; probeer later opnieuw of mail ons rechtstreeks.', 'error'); return; }
        meld('Bedankt! Je vraag is verstuurd naar ' + MAIL + '. We nemen contact met je op via je e-mailadres.', 'success');
        form.reset(); ververs();
      })
      .catch(function () { meld('We konden de verzending niet bevestigen. Je tekst blijft staan. Mail ons bij twijfel rechtstreeks, zodat je niets dubbel stuurt.', 'error'); })
      .then(function () { bezig = false; knop.disabled = false; knop.textContent = oud; });
  });

  var kopieer = form.querySelector('.copy-message');
  if (kopieer) kopieer.addEventListener('click', function () {
    var w = waarden();
    if (!(w.message || '').trim()) { meld('Schrijf eerst je bericht; dan kun je het kopiëren.', 'error'); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(tekst()).then(function () { meld('Je bericht is gekopieerd. Plak het in een e-mail naar ' + MAIL + '. Er is nog niets verstuurd.'); }, function () { meld('Kopiëren is niet beschikbaar. Selecteer je tekst en kopieer die zelf; je invoer blijft staan.', 'error'); });
    } else meld('Kopiëren is niet beschikbaar. Selecteer je tekst en kopieer die zelf; je invoer blijft staan.', 'error');
  });
})();
