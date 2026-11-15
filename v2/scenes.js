/* W3c: onderdelen-verkenner en beweging. Alles beweegt vanzelf vanaf het laden; niets hangt van scrollen af.
   Pauzeknop: bevriest de beweging op de hele pagina (ook het voorbeeldplatform in het venster). Bij «minder beweging» in het besturingssysteem
   staat elke scène in zijn eindtoestand tot de bezoeker zelf op «Speel beweging af» drukt. De keuze blijft alleen in dit tabblad (sessionStorage). */
'use strict';
(function () {
  var d = document.documentElement;
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var stored = null;
  try { stored = sessionStorage.getItem('pm-beweging'); } catch (e) { /* mag ontbreken */ }
  var playing = stored ? stored === 'aan' : !reduce;
  var buttons = [].slice.call(document.querySelectorAll('.mv-btn'));
  var listeners = [];

  function apply() {
    d.classList.toggle('mv-play', playing);
    d.classList.toggle('mv-pause', !playing);
    [].forEach.call(document.querySelectorAll('svg'), function (s) {
      if (s.pauseAnimations) { if (playing) s.unpauseAnimations(); else s.pauseAnimations(); }
    });
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(!playing));
      var l = b.querySelector('.lbl'); if (l) l.textContent = playing ? 'Pauzeer beweging' : 'Speel beweging af';
    });
    [].forEach.call(document.querySelectorAll('iframe.pf-frame'), function (f) {
      try { f.contentWindow.postMessage({ pmBeweging: playing ? 'aan' : 'uit' }, '*'); } catch (e) { /* mag ontbreken */ }
    });
    listeners.forEach(function (fn) { fn(playing); });
  }
  function set(v) {
    playing = v;
    try { sessionStorage.setItem('pm-beweging', playing ? 'aan' : 'uit'); } catch (e) { /* mag ontbreken */ }
    apply();
  }
  buttons.forEach(function (b) { b.addEventListener('click', function () { set(!playing); }); });
  window.addEventListener('message', function (e) {
    if (e.data && e.data.pmVraagBeweging) { try { e.source.postMessage({ pmBeweging: playing ? 'aan' : 'uit' }, '*'); } catch (err) { /* mag ontbreken */ } }
  });

  /* ---- de verkenner ---- */
  var ex = document.querySelector('[data-explorer]');
  if (ex) {
    var tabs = [].slice.call(ex.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var CYCLE = 9000, cur = 0, timer = null, touched = true /* 30: nooit automatisch wisselen */, hoverT = null;
    ex.style.setProperty('--cycle', CYCLE / 1000 + 's');
    var select = function (i, byUser) {
      cur = i;
      tabs.forEach(function (t, j) { t.setAttribute('aria-selected', String(j === i)); t.tabIndex = j === i ? 0 : -1; panels[j].hidden = j !== i; });
      var tl = tabs[0].parentNode; if (tl.scrollWidth > tl.clientWidth + 2) tl.scrollTo({ left: Math.max(0, tabs[i].offsetLeft - 16), behavior: 'smooth' });
      if (byUser) { touched = true; stop(); } else if (!touched && playing) start();
    };
    var stop = function () { clearTimeout(timer); timer = null; ex.classList.remove('auto'); };
    var start = function () {
      clearTimeout(timer); if (touched || !playing || document.hidden) { ex.classList.remove('auto'); return; }
      ex.classList.remove('auto'); void ex.offsetWidth; ex.classList.add('auto');
      timer = setTimeout(function () { select((cur + 1) % tabs.length, false); }, CYCLE);
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i, true); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1;
        if (n === null) return;
        e.preventDefault(); tabs[n].focus(); select(n, true);
      });
    });
    ex.classList.add('js');
    document.documentElement.classList.add('js');
    select(0, false);
    listeners.push(function (p) { if (p && !touched) start(); else stop(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (playing && !touched) start(); });
    ex.addEventListener('focusin', function () { touched = true; stop(); });
  }
  /* ---- het schema bovenaan ----
     1. de lijnen: altijd van het midden van een kaartje naar het midden van de kern (berekend uit de echte plek, ook bij verandering van breedte)
     2. de beurten: één klok bepaalt wie aan de beurt is. Het kaartje dat oplicht is hetzelfde kaartje waar het pakketje uit vertrekt;
        het pakketje reist over de lijn van dát kaartje, komt in de kern aan (die pulseert) en dan is het volgende kaartje aan de beurt. */
  var bp = document.querySelector('.hero-stage .blueprint');
  if (bp) {
    var svg = bp.querySelector('svg.connections');
    var NS = 'http://www.w3.org/2000/svg';
    var ORDE = ['node-one', 'node-two', 'node-four', 'node-three'];   /* klanten, team, data, pakketten: met de klok mee */
    var pad = [], punt = [], knopen = [];
    var kernEl = bp.querySelector('.core');
    var teken = function () {
      var nodes = [].slice.call(bp.querySelectorAll('.node'));
      if (!svg || !kernEl || nodes.length < 4) return;
      var W = bp.clientWidth, H = bp.clientHeight;
      var cx = W / 2, cy = H / 2, cw = kernEl.offsetWidth, ch = kernEl.offsetHeight;
      var kern = { l: cx - cw / 2, r: cx + cw / 2 };
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      svg.setAttribute('preserveAspectRatio', 'none');
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var maak = function (naam, attrs) { var el = document.createElementNS(NS, naam); for (var k in attrs) el.setAttribute(k, attrs[k]); svg.appendChild(el); return el; };
      pad = []; punt = []; knopen = nodes;
      nodes.forEach(function (n) {
        var x1 = n.offsetLeft, x2 = n.offsetLeft + n.offsetWidth, y1 = n.offsetTop, y2 = n.offsetTop + n.offsetHeight;
        var ny = (y1 + y2) / 2, nx = (x1 + x2) / 2, links = nx < cx, boven = ny < cy;
        var sx = links ? x2 : x1, ex = links ? kern.l : kern.r, d, bx, by;
        if (links ? sx < ex - 12 : sx > ex + 12) {
          /* genoeg ruimte ernaast: vanaf het midden van de zijkant, een halve stap opzij, dan naar het midden van de kern */
          bx = (sx + ex) / 2; by = cy;
          d = 'M' + sx + ' ' + ny + ' H' + bx + ' V' + cy + ' H' + ex;
        } else {
          /* smal scherm: de kaartjes staan deels boven de kern; dan vanaf het midden van onder- of bovenkant, recht naar het midden van de zijkant van de kern */
          var sy = boven ? y2 : y1; bx = nx; by = cy;
          d = 'M' + nx + ' ' + sy + ' V' + cy + ' H' + ex;
        }
        pad.push(maak('path', { d: d }));
        maak('circle', { cx: bx, cy: by, r: 4 });
      });
      nodes.forEach(function () { punt.push(maak('circle', { r: 4.5, 'class': 'pkt', opacity: 0 })); });
    };
    var CYC = 2400, elapsed = 0, last = 0, raf = 0;
    var frame = function (now) {
      raf = requestAnimationFrame(frame);
      if (!last) last = now;
      elapsed += Math.min(now - last, 80); last = now;
      var k = Math.floor(elapsed / CYC) % ORDE.length, local = (elapsed % CYC) / CYC;
      var snd = bp.querySelector('.' + ORDE[k]), idx = knopen.indexOf(snd);
      knopen.forEach(function (n) { n.classList.toggle('is-sending', n === snd && local < 0.3); });
      kernEl.classList.toggle('is-hit', local > 0.82 || local < 0.05);
      punt.forEach(function (c, j) {
        if (j !== idx || local > 0.84 || !pad[j]) { c.setAttribute('opacity', 0); return; }
        var p = Math.min(local / 0.8, 1); p = p * p * (3 - 2 * p);
        var pt = pad[j].getPointAtLength(p * pad[j].getTotalLength());
        c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.setAttribute('opacity', 1);
      });
    };
    var regel = function () {
      var aan = playing;
      if (aan && !raf && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); }
      else if (!aan && raf) { cancelAnimationFrame(raf); raf = 0; }
    };
    teken();
    listeners.push(function () { regel(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; } else regel(); });
    if (window.ResizeObserver) new ResizeObserver(teken).observe(bp);
    window.addEventListener('load', teken); window.addEventListener('resize', teken);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(teken);
    regel();
  }
  apply();
})();
