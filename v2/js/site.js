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
