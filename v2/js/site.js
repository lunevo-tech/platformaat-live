// PlatforMaat V2: alleen het formulier. In deze testversie wordt NIETS verstuurd.
// Spam: verborgen veld (honeypot) en een minimale invultijd.
(function () {
  var form = document.getElementById('vraag');
  if (!form) return;
  var start = Date.now();
  var status = form.querySelector('.form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    if (d.get('website') || Date.now() - start < 3000) return; // waarschijnlijk een robot
    var naam = String(d.get('naam') || '').trim();
    var email = String(d.get('email') || '').trim();
    var bericht = String(d.get('bericht') || '').trim();
    status.hidden = false;
    if (!naam || !email || !bericht) { status.textContent = form.dataset.leeg; return; }
    status.textContent = form.dataset.test;
    var body = bericht + '\n\n' + naam + ' <' + email + '>';
    window.location.href = 'mailto:' + form.dataset.mail + '?subject=' + encodeURIComponent(form.dataset.onderwerp) + '&body=' + encodeURIComponent(body);
  });
})();

// Besparingscalculator: rekent alleen in de browser, verstuurt en bewaart niets.
(function () {
  var f = document.getElementById('calc');
  if (!f) return;
  var out = document.getElementById('calc-uit');
  var eur = new Intl.NumberFormat(f.dataset.lang, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  var num = new Intl.NumberFormat(f.dataset.lang, { maximumFractionDigits: 0 });
  function v(n) { var x = parseFloat(String(f.elements[n].value).replace(',', '.')); return isFinite(x) && x > 0 ? x : 0; }
  function reken() {
    var uren = v('keer') * v('min') / 60 * v('weken');
    var kost = uren * v('uur');
    var pct = Math.min(v('pct'), 100);
    out.textContent = f.dataset.uit.replace('{uren}', num.format(uren)).replace('{kost}', eur.format(kost)).replace('{pct}', num.format(pct)).replace('{winst}', eur.format(kost * pct / 100));
  }
  f.addEventListener('input', reken);
  f.addEventListener('submit', function (e) { e.preventDefault(); });
  reken();
})();
