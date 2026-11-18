// Editor in "directe modus" voor een statische site op GitHub Pages (PlatforMaat). De HTML-bestanden zijn de bron. Je opent de echte pagina, klikt op een tekst of foto,
// past aan en ziet het meteen. Opslaan past ALLEEN de gemarkeerde stukken (data-cms) op tekstniveau aan; de rest van elk bestand blijft byte voor byte gelijk (zie cms-kern.js).
// Vóór elke opslag: verse bron ophalen, wijzigingen doorrekenen, controleren en tonen onder «Wat verandert er?». Dan pas één commit naar GitHub (= live).
// Het toegangstoken blijft in deze browser (localStorage) en gaat alleen naar api.github.com.
// De vorige (blokkeneditor) staat ongewijzigd in /beheer/oud/ en kan altijd terug.
(function () {
  'use strict';
  const SC = document.currentScript, K = window.CmsKern;
  const REPO = SC.dataset.repo, BRANCH = SC.dataset.branch || 'main', NAAM = SC.dataset.naam || 'de site', PREFIX = 'Website aangepast via de editor';
  const API = (location.hostname === 'localhost' && new URLSearchParams(location.search).get('api')) || 'https://api.github.com';      // ?api=... alleen voor tests op localhost
  const BASE = new URL('../', location.href).pathname;      // de site staat één map boven /beheer/
  const TOKKEY = SC.dataset.tokenkey || ('zm-token-' + REPO), TAALKEY = 'zm-editor-taal';
  const STARTPAGINA = 'index.html';
  const LETTER = /[A-Za-zÀ-ɏͰ-ϿЀ-ӿ]/;      // dezelfde regel als in cms-kern.js: alleen tekst met een letter telt als tekststuk
  const NIET = ['beheer/', 'venster/', 'werk-logos/', 'assets/'];

  /* ---------- teksten in drie talen ---------- */
  const TT = {
    nl: {
      titel: '{naam} aanpassen', intro: 'Je opent de echte pagina, klikt op een tekst of foto, past aan en ziet het meteen.', let_op: 'Let op: Opslaan zet je wijziging meteen live. Met «Laatste opslag ongedaan maken» kan je terug.',
      eenmalig: 'Eenmalig inloggen met je GitHub-toegangstoken. Het blijft alleen in deze browser.', token_ph: 'Plak hier je toegangstoken', inloggen: 'Inloggen', controleren: 'Even controleren...',
      token_fout: 'Dit token werkt niet voor deze repo. Het moet toegang hebben tot {repo} met Contents op «Read and write».', geen_schrijf: 'Dit token mag niets opslaan in {repo}. Geef het Contents: «Read and write».',
      token_verlopen: 'Je token is niet meer geldig. Plak een nieuw token.', laden: 'Even laden...', laden_mislukt: 'Laden mislukt', laden_uitleg: 'Kon de pagina\'s niet ophalen ({fout}). Ververs de pagina.',
      pagina: 'Pagina', bewerken_aan: 'Bewerken: aan', bewerken_uit: 'Bewerken: uit (je kan door de site klikken)', hint: 'Klik op een tekst of foto om ze aan te passen', opslaan: 'Opslaan', opslaan_n: 'Opslaan ({n})',
      ongedaan: 'Laatste opslag ongedaan maken', uitloggen: 'Uitloggen', computer: 'Computer', tablet: 'Tablet', telefoon: 'Telefoon', taal: 'Taal van de editor', apparaat: 'Schermgrootte',
      teksten: 'Teksten op deze pagina', wat: 'Wat verandert er?', sluiten: 'Sluiten', voorbeeld: 'Voorbeeld van de site', niet_opgeslagen: 'Je hebt niet-opgeslagen aanpassingen.',
      lijst_titel: 'Teksten op deze pagina', lijst_uitleg: 'Kies een tekst om ze aan te passen. Handig met het toetsenbord.', filter: 'Zoek in de teksten', geen_teksten: 'Geen teksten gevonden.',
      tekst_titel: 'Tekst aanpassen', tekst_uitleg: 'Je ziet de wijziging meteen. Ze gaat pas live na «Opslaan».', tekst_label: 'Tekst', toepassen: 'Toepassen', annuleren: 'Annuleren', orig_terug: 'Oorspronkelijke tekst terugzetten',
      tekst_leeg: 'Laat minstens één letter staan. Een tekst helemaal wissen kan hier niet.', zoeken: 'Zoeken waar deze tekst nog meer staat...', overal: 'Deze tekst staat {n} keer op {m} pagina\'s: {lijst}.', overal_vink: 'Ook op die andere plekken aanpassen (haal het vinkje weg voor alleen hier)',
      niet_titel: 'Tekst niet aanpasbaar', niet_tekst: 'Deze tekst wordt door de site zelf opgebouwd of hoort bij een onderdeel dat de editor niet bewerkt. Ze kan hier niet worden aangepast.',
      foto_titel: 'Foto aanpassen', foto_uitleg: 'Kies een nieuwe foto. Ze vervangt dit bestand ({pad}) overal op de site waar het gebruikt wordt. Ze wordt automatisch verkleind.', foto_kies: 'Nieuwe foto', alt_label: 'Beschrijving van de foto (alt-tekst)',
      foto_terug: 'Wijziging ongedaan maken', foto_vervangen: 'Foto vervangen. Klik op Opslaan om ze live te zetten.', foto_fout: 'Deze foto kon niet worden gelezen.', foto_niet: 'Dit bestand ({pad}) kan hier niet vervangen worden; de beschrijving wel.',
      leeg: 'Nog niets aangepast.', voor: 'Nu', na: 'Straks', terugzetten: 'Terugzetten', foto: 'Foto', foto_nieuw: 'nieuwe foto', alt_van: 'Beschrijving van {pad}', op_pagina: 'Pagina: {naam}', ook_op: 'ook op {n} andere plekken',
      ctrl_titel: 'Controle voor het opslaan', ctrl_struct: 'De opbouw van de pagina\'s (alle elementen en hun eigenschappen) is ongewijzigd.', ctrl_tekst: 'Alleen de {n} gekozen stukken zijn anders; alle andere teksten zijn gelijk.',
      ctrl_bestanden: '{n} bestand(en) worden aangepast: {lijst}.', zet_live: 'Zet live', terug: 'Terug', live_waarschuwing: 'Na «Zet live» staat de wijziging binnen 1 tot 3 minuten op de echte site.',
      f_verouderd: 'Een tekst of beschrijving is intussen aangepast (of de site is nog niet bijgewerkt). Er is niets opgeslagen. Ververs de editor en probeer opnieuw.', f_niet_gevonden: 'Een aangepast stuk staat niet meer in de pagina. Er is niets opgeslagen. Ververs de editor.',
      f_algemeen: 'De controle keurde de wijziging af ({reden}). Er is niets opgeslagen.', f_ctrl: 'De controle vond een onverwacht verschil ({reden}). Er is niets opgeslagen.', niets: 'Niets om op te slaan.',
      intussen: 'De site is intussen door iemand aangepast. Er is niets opgeslagen; de wijzigingen worden opnieuw gecontroleerd.', opgeslagen: 'Opgeslagen. Over ongeveer 1 tot 3 minuten staat het live. Tot dan blijven je aanpassingen hier zichtbaar.',
      publiceren: 'Opgeslagen, wordt gepubliceerd...', klaar: 'Klaar: de site is bijgewerkt.', klaar_kort: 'Klaar', duurt: 'Het publiceren duurt langer dan normaal. Je aanpassingen zijn opgeslagen; kijk straks opnieuw (ververs de pagina).', opgeslagen_kort: 'Opgeslagen',
      mislukt: 'Opslaan mislukt ({fout}). Je aanpassingen staan nog hier; probeer opnieuw.', geen_recht: 'Opslaan mislukt: je token heeft geen schrijfrechten (Contents: Read and write) of is verlopen.', opslaan_bezig: 'Bezig met controleren...', opslaan_bezig2: 'Bezig met opslaan...',
      ong_niet_hier: 'De laatste wijziging komt niet uit deze editor. Ongedaan maken kan dan alleen via GitHub.', ong_vraag: 'De laatste opslag ongedaan maken?\n\n{bericht}\n\nDe site gaat terug naar hoe ze daarvoor was.', ong_verlies: 'Je hebt niet-opgeslagen aanpassingen. Die gaan verloren als je de pagina ververst. Doorgaan met ongedaan maken van de laatste opslag?',
      ong_ok: 'Ongedaan gemaakt. Over ongeveer 1 tot 2 minuten staat de vorige versie weer live.', ong_fout: 'Ongedaan maken mislukt ({fout}).', ong_bericht: 'Laatste opslag van de editor ongedaan gemaakt', pagina_open: 'De pagina kon niet worden geopend.', gevonden: 'Geen pagina\'s gevonden in de repo',
      commit_n: '{n} bestand', commit_m: '{n} bestanden', start_titel: 'Startpagina'
    },
    fr: {
      titel: 'Modifier {naam}', intro: 'Vous ouvrez la vraie page, vous cliquez sur un texte ou une photo, vous la modifiez et vous le voyez tout de suite.', let_op: 'Attention : « Enregistrer » met votre modification en ligne immédiatement. « Annuler le dernier enregistrement » permet de revenir en arrière.',
      eenmalig: 'Connexion unique avec votre jeton d\'accès GitHub. Il reste uniquement dans ce navigateur.', token_ph: 'Collez ici votre jeton d\'accès', inloggen: 'Se connecter', controleren: 'Vérification...',
      token_fout: 'Ce jeton ne fonctionne pas pour ce dépôt. Il doit avoir accès à {repo} avec Contents en « Read and write ».', geen_schrijf: 'Ce jeton ne peut rien enregistrer dans {repo}. Donnez-lui Contents : « Read and write ».',
      token_verlopen: 'Votre jeton n\'est plus valable. Collez-en un nouveau.', laden: 'Chargement...', laden_mislukt: 'Échec du chargement', laden_uitleg: 'Impossible de récupérer les pages ({fout}). Actualisez la page.',
      pagina: 'Page', bewerken_aan: 'Modification : activée', bewerken_uit: 'Modification : désactivée (vous pouvez naviguer sur le site)', hint: 'Cliquez sur un texte ou une photo pour la modifier', opslaan: 'Enregistrer', opslaan_n: 'Enregistrer ({n})',
      ongedaan: 'Annuler le dernier enregistrement', uitloggen: 'Se déconnecter', computer: 'Ordinateur', tablet: 'Tablette', telefoon: 'Téléphone', taal: 'Langue de l\'éditeur', apparaat: 'Taille de l\'écran',
      teksten: 'Textes de cette page', wat: 'Qu\'est-ce qui change ?', sluiten: 'Fermer', voorbeeld: 'Aperçu du site', niet_opgeslagen: 'Vous avez des modifications non enregistrées.',
      lijst_titel: 'Textes de cette page', lijst_uitleg: 'Choisissez un texte pour le modifier. Pratique au clavier.', filter: 'Rechercher dans les textes', geen_teksten: 'Aucun texte trouvé.',
      tekst_titel: 'Modifier le texte', tekst_uitleg: 'Vous voyez la modification tout de suite. Elle ne sera en ligne qu\'après « Enregistrer ».', tekst_label: 'Texte', toepassen: 'Appliquer', annuleren: 'Annuler', orig_terug: 'Rétablir le texte d\'origine',
      tekst_leeg: 'Laissez au moins une lettre. Il n\'est pas possible d\'effacer entièrement un texte ici.', zoeken: 'Recherche des autres endroits où figure ce texte...', overal: 'Ce texte figure {n} fois sur {m} pages : {lijst}.', overal_vink: 'Modifier aussi aux autres endroits (décochez pour modifier uniquement ici)',
      niet_titel: 'Texte non modifiable', niet_tekst: 'Ce texte est construit par le site lui-même ou fait partie d\'un élément que l\'éditeur ne modifie pas. Il ne peut pas être modifié ici.',
      foto_titel: 'Modifier la photo', foto_uitleg: 'Choisissez une nouvelle photo. Elle remplace ce fichier ({pad}) partout sur le site où il est utilisé. Elle est réduite automatiquement.', foto_kies: 'Nouvelle photo', alt_label: 'Description de la photo (texte alternatif)',
      foto_terug: 'Annuler la modification', foto_vervangen: 'Photo remplacée. Cliquez sur Enregistrer pour la mettre en ligne.', foto_fout: 'Cette photo n\'a pas pu être lue.', foto_niet: 'Ce fichier ({pad}) ne peut pas être remplacé ici ; la description, oui.',
      leeg: 'Rien n\'a encore été modifié.', voor: 'Actuel', na: 'Après', terugzetten: 'Rétablir', foto: 'Photo', foto_nieuw: 'nouvelle photo', alt_van: 'Description de {pad}', op_pagina: 'Page : {naam}', ook_op: 'aussi à {n} autres endroits',
      ctrl_titel: 'Vérification avant l\'enregistrement', ctrl_struct: 'La structure des pages (tous les éléments et leurs propriétés) est inchangée.', ctrl_tekst: 'Seuls les {n} éléments choisis sont différents ; tous les autres textes sont identiques.',
      ctrl_bestanden: '{n} fichier(s) seront modifiés : {lijst}.', zet_live: 'Mettre en ligne', terug: 'Retour', live_waarschuwing: 'Après « Mettre en ligne », la modification apparaît sur le vrai site dans 1 à 3 minutes.',
      f_verouderd: 'Un texte ou une description a entre-temps été modifié (ou le site n\'est pas encore à jour). Rien n\'a été enregistré. Actualisez l\'éditeur et réessayez.', f_niet_gevonden: 'Un élément modifié ne figure plus dans la page. Rien n\'a été enregistré. Actualisez l\'éditeur.',
      f_algemeen: 'La vérification a refusé la modification ({reden}). Rien n\'a été enregistré.', f_ctrl: 'La vérification a trouvé une différence inattendue ({reden}). Rien n\'a été enregistré.', niets: 'Rien à enregistrer.',
      intussen: 'Le site a entre-temps été modifié par quelqu\'un. Rien n\'a été enregistré ; les modifications sont vérifiées à nouveau.', opgeslagen: 'Enregistré. Dans environ 1 à 3 minutes, c\'est en ligne. D\'ici là, vos modifications restent visibles ici.',
      publiceren: 'Enregistré, publication en cours...', klaar: 'Terminé : le site est à jour.', klaar_kort: 'Terminé', duurt: 'La publication prend plus de temps que d\'habitude. Vos modifications sont enregistrées ; revenez plus tard (actualisez la page).', opgeslagen_kort: 'Enregistré',
      mislukt: 'Échec de l\'enregistrement ({fout}). Vos modifications sont toujours là ; réessayez.', geen_recht: 'Échec de l\'enregistrement : votre jeton n\'a pas les droits d\'écriture (Contents : Read and write) ou a expiré.', opslaan_bezig: 'Vérification en cours...', opslaan_bezig2: 'Enregistrement en cours...',
      ong_niet_hier: 'La dernière modification ne vient pas de cet éditeur. L\'annulation n\'est alors possible que via GitHub.', ong_vraag: 'Annuler le dernier enregistrement ?\n\n{bericht}\n\nLe site reviendra à son état précédent.', ong_verlies: 'Vous avez des modifications non enregistrées. Elles seront perdues si vous actualisez la page. Annuler quand même le dernier enregistrement ?',
      ong_ok: 'Annulé. Dans environ 1 à 2 minutes, la version précédente est de nouveau en ligne.', ong_fout: 'Échec de l\'annulation ({fout}).', ong_bericht: 'Dernier enregistrement de l\'éditeur annulé', pagina_open: 'La page n\'a pas pu être ouverte.', gevonden: 'Aucune page trouvée dans le dépôt',
      commit_n: '{n} fichier', commit_m: '{n} fichiers', start_titel: 'Page d\'accueil'
    },
    en: {
      titel: 'Edit {naam}', intro: 'You open the real page, click a text or photo, change it and see the result straight away.', let_op: 'Note: Save puts your change live immediately. "Undo last save" takes you back.',
      eenmalig: 'Log in once with your GitHub access token. It stays in this browser only.', token_ph: 'Paste your access token here', inloggen: 'Log in', controleren: 'Checking...',
      token_fout: 'This token does not work for this repository. It needs access to {repo} with Contents set to "Read and write".', geen_schrijf: 'This token cannot save anything in {repo}. Give it Contents: "Read and write".',
      token_verlopen: 'Your token is no longer valid. Paste a new one.', laden: 'Loading...', laden_mislukt: 'Loading failed', laden_uitleg: 'Could not fetch the pages ({fout}). Refresh the page.',
      pagina: 'Page', bewerken_aan: 'Editing: on', bewerken_uit: 'Editing: off (you can click through the site)', hint: 'Click a text or photo to change it', opslaan: 'Save', opslaan_n: 'Save ({n})',
      ongedaan: 'Undo last save', uitloggen: 'Log out', computer: 'Computer', tablet: 'Tablet', telefoon: 'Phone', taal: 'Editor language', apparaat: 'Screen size',
      teksten: 'Texts on this page', wat: 'What changes?', sluiten: 'Close', voorbeeld: 'Preview of the site', niet_opgeslagen: 'You have unsaved changes.',
      lijst_titel: 'Texts on this page', lijst_uitleg: 'Choose a text to change it. Handy with the keyboard.', filter: 'Search the texts', geen_teksten: 'No texts found.',
      tekst_titel: 'Edit text', tekst_uitleg: 'You see the change straight away. It only goes live after "Save".', tekst_label: 'Text', toepassen: 'Apply', annuleren: 'Cancel', orig_terug: 'Restore the original text',
      tekst_leeg: 'Keep at least one letter. A text cannot be deleted completely here.', zoeken: 'Looking for other places with this text...', overal: 'This text appears {n} times on {m} pages: {lijst}.', overal_vink: 'Also change it in those other places (untick to change only here)',
      niet_titel: 'Text cannot be edited', niet_tekst: 'This text is built by the site itself or belongs to a part the editor does not change. It cannot be edited here.',
      foto_titel: 'Edit photo', foto_uitleg: 'Choose a new photo. It replaces this file ({pad}) everywhere on the site where it is used. It is resized automatically.', foto_kies: 'New photo', alt_label: 'Photo description (alt text)',
      foto_terug: 'Undo this change', foto_vervangen: 'Photo replaced. Click Save to put it live.', foto_fout: 'This photo could not be read.', foto_niet: 'This file ({pad}) cannot be replaced here; its description can.',
      leeg: 'Nothing changed yet.', voor: 'Now', na: 'After', terugzetten: 'Restore', foto: 'Photo', foto_nieuw: 'new photo', alt_van: 'Description of {pad}', op_pagina: 'Page: {naam}', ook_op: 'also in {n} other places',
      ctrl_titel: 'Check before saving', ctrl_struct: 'The structure of the pages (all elements and their properties) is unchanged.', ctrl_tekst: 'Only the {n} chosen parts differ; all other texts are identical.',
      ctrl_bestanden: '{n} file(s) will change: {lijst}.', zet_live: 'Go live', terug: 'Back', live_waarschuwing: 'After "Go live" the change appears on the real site within 1 to 3 minutes.',
      f_verouderd: 'A text or description has been changed in the meantime (or the site is not up to date yet). Nothing was saved. Refresh the editor and try again.', f_niet_gevonden: 'A changed part is no longer in the page. Nothing was saved. Refresh the editor.',
      f_algemeen: 'The check rejected the change ({reden}). Nothing was saved.', f_ctrl: 'The check found an unexpected difference ({reden}). Nothing was saved.', niets: 'Nothing to save.',
      intussen: 'The site was changed by someone in the meantime. Nothing was saved; the changes are being checked again.', opgeslagen: 'Saved. It will be live in about 1 to 3 minutes. Until then your changes stay visible here.',
      publiceren: 'Saved, publishing...', klaar: 'Done: the site is up to date.', klaar_kort: 'Done', duurt: 'Publishing takes longer than usual. Your changes are saved; look again later (refresh the page).', opgeslagen_kort: 'Saved',
      mislukt: 'Saving failed ({fout}). Your changes are still here; try again.', geen_recht: 'Saving failed: your token has no write access (Contents: Read and write) or has expired.', opslaan_bezig: 'Checking...', opslaan_bezig2: 'Saving...',
      ong_niet_hier: 'The last change did not come from this editor. Undoing it is then only possible through GitHub.', ong_vraag: 'Undo the last save?\n\n{bericht}\n\nThe site goes back to how it was before.', ong_verlies: 'You have unsaved changes. They are lost if you refresh the page. Undo the last save anyway?',
      ong_ok: 'Undone. In about 1 to 2 minutes the previous version is live again.', ong_fout: 'Undo failed ({fout}).', ong_bericht: 'Last save from the editor undone', pagina_open: 'The page could not be opened.', gevonden: 'No pages found in the repository',
      commit_n: '{n} file', commit_m: '{n} files', start_titel: 'Home page'
    }
  };
  let taal = 'nl'; try { taal = localStorage.getItem(TAALKEY) || ''; } catch (e) {}
  if (!TT[taal]) { const b = (navigator.language || 'nl').slice(0, 2).toLowerCase(); taal = TT[b] ? b : 'nl'; }
  const t = (k, v) => String((TT[taal][k] !== undefined ? TT[taal][k] : TT.nl[k]) || k).replace(/\{(\w+)\}/g, (m, n) => (v && v[n] !== undefined ? v[n] : m));

  /* ---------- hulpjes ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const el = (tag, att, kids) => {
    const e = document.createElement(tag);
    Object.keys(att || {}).forEach((k) => { if (k === 'text') e.textContent = att[k]; else if (k === 'class') e.className = att[k]; else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), att[k]); else e.setAttribute(k, att[k]); });
    (kids || []).forEach((c) => { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  };
  const norm = K.norm;
  const kort = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
  const heeftLetter = (s) => LETTER.test(s);

  let token = null; try { token = localStorage.getItem(TOKKEY); } catch (e) {}
  let paginas = [], bron = {}, afbeeldingen = {};      // paginas: [{pad, naam, verborgen}], bron: pad -> html in de repo (laatst gekende stand), afbeeldingen: pad -> true
  const lijstCache = {};      // pad -> K.lijst(bron[pad])
  const edits = new Map();      // sleutel (pad|id|k) -> {pad,id,k,orig,nieuw,overal,doelen:[{pad,id,k}]}   (niet-opgeslagen tekstwijzigingen)
  const altEdits = new Map();      // pad|id|alt -> {pad,id,orig,nieuw,bestand}
  const beeldEdits = new Map();      // repo-pad -> {blob,url}
  let perSleutel = new Map();      // alle te tonen niet-opgeslagen teksten: pad|id|k -> nieuwe tekst
  const bewaard = new Map(), bewaardAlt = new Map(), beeldBewaard = new Map();      // opgeslagen maar nog niet gepubliceerd: ze blijven zichtbaar tot de site bijgewerkt is
  let wachtTeller = 0, bewerken = true, huidig = STARTPAGINA, frame, doc, hl, paneel, laatsteFocus = null, knopen = [];
  let kopStatus, opslaanKnop, bewerkKnop, pagina, bezig = false, aantalNul = false;

  function gh(pad, opt) {
    opt = opt || {};
    const h = { 'Authorization': 'Bearer ' + token, 'Accept': opt.raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
    if (opt.body) h['Content-Type'] = 'application/json';
    return fetch(API + '/repos/' + REPO + pad, { method: opt.method || 'GET', headers: h, body: opt.body ? JSON.stringify(opt.body) : undefined, cache: 'no-store' }).then((r) => {
      if (!r.ok) {
        const e = new Error('GitHub ' + r.status); e.status = r.status; e.pad = pad || '/'; e.nodig = r.headers.get('x-accepted-github-permissions') || '';
        return r.text().then((tx) => { try { e.uitleg = (JSON.parse(tx).message || '').slice(0, 160); } catch (x) {} throw e; });
      }
      return opt.raw ? r.text() : r.json();
    });
  }
  const reden = (e) => (e && e.status ? ' [GitHub ' + e.status + ' ' + e.pad + (e.uitleg ? ': ' + e.uitleg : '') + (e.nodig ? '; ' + e.nodig : '') + ']' : '');
  const root = el('div', { id: 'zm-ed' }); document.body.appendChild(root);
  document.documentElement.lang = taal;
  function toast(tx, soort) {
    const b = $('#zm-toast') || root.appendChild(el('div', { id: 'zm-toast', role: 'status', 'aria-live': 'polite' }));
    b.className = soort || ''; b.textContent = tx; b.style.display = 'block';
    clearTimeout(toast.t); if (soort !== 'vast') toast.t = setTimeout(() => { b.style.display = 'none'; }, 7000);
  }
  function lijstVan(pad) { return lijstCache[pad] || (lijstCache[pad] = K.lijst(bron[pad])); }

  /* ---------- inloggen en laden ---------- */
  function taalKiezer() {
    return el('select', { 'aria-label': t('taal'), onchange: (ev) => { const nw = ev.target.value; if (aantal() && !confirm(t('niet_opgeslagen'))) { ev.target.value = taal; return; } taal = nw; try { localStorage.setItem(TAALKEY, taal); } catch (e) {} aantalNul = true; location.reload(); } },
      [['nl', 'Nederlands'], ['fr', 'Français'], ['en', 'English']].map((x) => { const o = el('option', { value: x[0], text: x[1] }); if (x[0] === taal) o.selected = true; return o; }));
  }
  function inloggen(fout) {
    root.innerHTML = '';
    const inp = el('input', { type: 'password', placeholder: t('token_ph'), 'aria-label': t('token_ph'), autocomplete: 'off' });
    const knop = el('button', { class: 'zm-groot', text: t('inloggen'), onclick: () => {
      token = inp.value.trim(); if (!token) return; knop.disabled = true; knop.textContent = t('controleren');
      gh('').then((r) => {
        if (r.permissions && r.permissions.push === false) throw new Error('geen schrijfrechten');
        try { localStorage.setItem(TOKKEY, token); } catch (e) {} start();
      }).catch((e) => { token = null; inloggen(e.status === 401 || e.status === 404 ? t('token_fout', { repo: REPO.split('/')[1] }) : e.message === 'geen schrijfrechten' ? t('geen_schrijf', { repo: REPO.split('/')[1] }) : e.message); });
    } });
    inp.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') knop.click(); });
    root.appendChild(el('main', { class: 'zm-login' }, [
      el('div', { style: 'text-align:right' }, [taalKiezer()]),
      el('h1', { text: t('titel', { naam: NAAM }) }), el('p', { text: t('intro') }), el('p', { class: 'zm-fout', text: t('let_op') }), el('p', { class: 'zm-klein', text: t('eenmalig') }),
      inp, knop, fout ? el('p', { class: 'zm-fout', role: 'alert', text: fout }) : null]));
    inp.focus();
  }
  function start() {
    root.innerHTML = '<div class="zm-laden" role="status">' + t('laden') + '</div>';
    gh('/git/trees/' + BRANCH + '?recursive=1').then((tr) => {
      const lijst = tr.tree.filter((x) => x.type === 'blob');
      lijst.forEach((x) => { if (/\.(png|jpe?g|webp|svg|gif)$/i.test(x.path)) afbeeldingen[x.path] = true; });
      paginas = lijst.filter((x) => /\.html$/.test(x.path) && !NIET.some((p) => x.path.indexOf(p) === 0)).map((x) => ({ pad: x.path, verborgen: x.path === '404.html' }));
      if (!paginas.length) throw new Error(t('gevonden'));
      let i = 0;
      const werker = () => { if (i >= paginas.length) return Promise.resolve(); const p = paginas[i++]; return gh('/contents/' + p.pad + '?ref=' + BRANCH, { raw: true }).then((h) => { bron[p.pad] = h; const m = /<title>([\s\S]*?)<\/title>/i.exec(h); p.naam = p.pad === STARTPAGINA ? t('start_titel') : m ? K.ontcijfer(norm(m[1])).split(/\s[|—–-]\s/)[0] : p.pad; }).then(werker); };
      return Promise.all([werker(), werker(), werker(), werker(), werker(), werker()]);
    }).then(() => {
      paginas.sort((a, b) => (a.pad === STARTPAGINA ? -1 : b.pad === STARTPAGINA ? 1 : a.pad < b.pad ? -1 : 1));
      bouwScherm();
    }).catch((e) => {
      if (e.status === 401) { try { localStorage.removeItem(TOKKEY); } catch (x) {} inloggen(t('token_verlopen') + reden(e)); }
      else { root.innerHTML = ''; root.appendChild(el('main', { class: 'zm-login' }, [el('h1', { text: t('laden_mislukt') }), el('p', { role: 'alert', text: t('laden_uitleg', { fout: e.message }) + reden(e) })])); }
    });
  }

  function bouwScherm() {
    root.innerHTML = '';
    pagina = el('select', { 'aria-label': t('pagina'), onchange: () => { gaNaar(pagina.value); } }, paginas.filter((p) => !p.verborgen).map((p) => el('option', { value: p.pad, text: p.naam + (p.pad.indexOf('/') > 0 ? '  (' + p.pad + ')' : '') })));
    bewerkKnop = el('button', { 'aria-pressed': 'true', onclick: () => { bewerken = !bewerken; zetBewerken(); } });
    opslaanKnop = el('button', { class: 'zm-primair', onclick: opslaan });
    const apparaat = el('div', { class: 'zm-app', role: 'group', 'aria-label': t('apparaat') }, [['computer', '100%'], ['tablet', '820px'], ['telefoon', '390px']].map((a, i) => el('button', { class: i ? '' : 'actief', 'aria-pressed': i ? 'false' : 'true', text: t(a[0]), onclick: (ev) => {
      frame.style.width = a[1]; [].forEach.call(ev.target.parentNode.children, (b) => { b.classList.remove('actief'); b.setAttribute('aria-pressed', 'false'); }); ev.target.classList.add('actief'); ev.target.setAttribute('aria-pressed', 'true');
    } })));
    kopStatus = el('span', { class: 'zm-status', role: 'status', 'aria-live': 'polite' });
    root.appendChild(el('header', { class: 'zm-bar' }, [
      el('div', { class: 'zm-r1' }, [el('strong', { text: NAAM }), pagina, bewerkKnop, el('button', { text: t('teksten'), onclick: tekstenLijst }), el('button', { id: 'zm-wat', text: t('wat'), onclick: () => overzicht(null) }), opslaanKnop]),
      el('div', { class: 'zm-r2' }, [apparaat, kopStatus, taalKiezer(), el('button', { text: t('ongedaan'), onclick: ongedaan }),
        el('button', { class: 'zm-uit', text: t('uitloggen'), onclick: () => { try { localStorage.removeItem(TOKKEY); } catch (e) {} location.reload(); } })])
    ]));
    frame = el('iframe', { id: 'zm-frame', title: t('voorbeeld') });
    root.appendChild(el('div', { class: 'zm-stage' }, [frame]));
    frame.addEventListener('load', frameGeladen);
    zetBewerken(); teller();
    window.addEventListener('beforeunload', (e) => { if (aantal() && !aantalNul) { e.preventDefault(); e.returnValue = ''; } });
    gaNaar(STARTPAGINA);
  }
  function gaNaar(p) { huidig = p; pagina.value = p; frame.src = BASE + p + (gaNaar.v ? '?v=' + gaNaar.v : ''); }
  function aantal() {
    let n = beeldEdits.size; edits.forEach((g) => { if (norm(g.nieuw) !== g.orig) n++; }); altEdits.forEach((a) => { if (a.nieuw !== a.orig) n++; }); return n;
  }
  function teller() {
    const n = aantal(); opslaanKnop.textContent = n ? t('opslaan_n', { n }) : t('opslaan'); opslaanKnop.disabled = !n;
    const w = $('#zm-wat'); if (w) w.textContent = n ? t('wat') + ' (' + n + ')' : t('wat');
  }
  function zetBewerken() {
    bewerkKnop.textContent = bewerken ? t('bewerken_aan') : t('bewerken_uit'); bewerkKnop.className = bewerken ? 'zm-aan' : ''; bewerkKnop.setAttribute('aria-pressed', bewerken ? 'true' : 'false');
    if (doc) doc.documentElement.classList.toggle('zm-edit', bewerken);
    if (!bewerken) { sluitPaneel(); verberg(); }
    kopStatus.textContent = bewerken ? t('hint') : '';
  }

  /* ---------- de pagina in het kader ---------- */
  function elementVan(n) { return n.parentNode; }
  function knopenVan(e) { return Array.prototype.filter.call(e.childNodes, (n) => n.nodeType === 3 && heeftLetter(n.nodeValue)); }
  function frameGeladen() {
    try { doc = frame.contentDocument; doc.body; } catch (e) { toast(t('pagina_open'), 'fout'); return; }
    let pad = frame.contentWindow.location.pathname.slice(BASE.length) || STARTPAGINA; if (pad.slice(-1) === '/') pad += 'index.html';
    if (paginas.some((p) => p.pad === pad)) { huidig = pad; if (pagina.querySelector('option[value="' + pad + '"]')) pagina.value = pad; }
    const st = doc.createElement('style'); st.textContent = '.zm-edit *{cursor:text !important}.zm-edit img{cursor:pointer !important}#zm-hl{position:fixed;z-index:2147483647;pointer-events:none;border:2px solid #ff3d7f;background:rgba(255,61,127,.12);border-radius:4px;display:none}';
    doc.head.appendChild(st); hl = doc.createElement('div'); hl.id = 'zm-hl'; doc.body.appendChild(hl);
    knopen = [];
    [].forEach.call(doc.querySelectorAll('[data-cms^="t"]'), (e) => {
      const id = e.getAttribute('data-cms');
      knopenVan(e).forEach((n, k) => { n.__id = id; n.__k = k; n.__key = huidig + '|' + id + '|' + k; n.__raw0 = n.nodeValue; n.__bron = bewaard.has(n.__key) ? norm(bewaard.get(n.__key)) : norm(n.nodeValue); knopen.push(n); });
    });
    [].forEach.call(doc.querySelectorAll('img[data-cms^="i"]'), (img) => { img.__id = img.getAttribute('data-cms'); img.__alt0 = img.getAttribute('alt'); });
    pasToe(); pasBeeldenToe();
    doc.addEventListener('mousemove', beweeg, true); doc.addEventListener('click', klik, true);
    doc.addEventListener('submit', (e) => { if (bewerken) e.preventDefault(); }, true); doc.addEventListener('scroll', verberg, true);
    zetBewerken();
  }
  function zetKnoop(n, tx) { const v = n.nodeValue; n.nodeValue = v.slice(0, v.length - v.trimStart().length) + tx + v.slice(v.trimEnd().length); }
  function herbouw() {
    perSleutel = new Map();
    edits.forEach((g) => { if (norm(g.nieuw) === g.orig) return; (g.overal ? g.doelen : [{ pad: g.pad, id: g.id, k: g.k }]).forEach((d) => perSleutel.set(d.pad + '|' + d.id + '|' + d.k, g.nieuw)); });
  }
  function pasToe() {      // toont per tekststuk: niet-opgeslagen wijziging, anders de opgeslagen (nog niet gepubliceerde) tekst, anders het origineel van de pagina
    knopen.forEach((n) => {
      const w = perSleutel.has(n.__key) ? perSleutel.get(n.__key) : bewaard.has(n.__key) ? bewaard.get(n.__key) : null;
      if (w === null) { if (n.nodeValue !== n.__raw0) n.nodeValue = n.__raw0; } else if (norm(n.nodeValue) !== norm(w)) zetKnoop(n, w);
    });
    if (doc) [].forEach.call(doc.querySelectorAll('img[data-cms^="i"]'), (img) => {
      const sl = huidig + '|' + img.__id + '|alt', a = altEdits.get(sl), w = a && a.nieuw !== a.orig ? a.nieuw : bewaardAlt.has(sl) ? bewaardAlt.get(sl) : null;
      if (w !== null) img.setAttribute('alt', w); else if (img.__alt0 !== null && img.__alt0 !== undefined) img.setAttribute('alt', img.__alt0);
    });
  }
  function nodeOp(x, y) {
    let r; if (doc.caretRangeFromPoint) r = doc.caretRangeFromPoint(x, y);
    else if (doc.caretPositionFromPoint) { const p = doc.caretPositionFromPoint(x, y); if (p) { r = doc.createRange(); r.setStart(p.offsetNode, p.offset); } }
    if (!r || r.startContainer.nodeType !== 3) return null;
    const n = r.startContainer; if (!n.nodeValue.trim() || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.parentNode.nodeName)) return null;
    const rr = doc.createRange(); rr.selectNodeContents(n); const rects = rr.getClientRects();
    for (let i = 0; i < rects.length; i++) { const q = rects[i]; if (x >= q.left - 1 && x <= q.right + 1 && y >= q.top - 1 && y <= q.bottom + 1) return n; }
    return null;
  }
  function beeldPad(img) {
    if (img.__pad !== undefined) return img.__pad;
    const s = img.getAttribute('src') || ''; let pad = null;
    try { const u = new URL(s, frame.contentWindow.location.href); if (u.origin === frame.contentWindow.location.origin) pad = decodeURIComponent(u.pathname.slice(BASE.length)); } catch (e) {}
    if (!pad || !afbeeldingen[pad]) pad = null;
    img.__pad = pad; return pad;
  }
  function doel(x, y) {
    const n = nodeOp(x, y);
    if (n) { const rr = doc.createRange(); rr.selectNodeContents(n); return { soort: 'tekst', node: n, rect: rr.getBoundingClientRect() }; }
    const e = doc.elementFromPoint(x, y), img = e && e.closest && e.closest('img');
    if (img && img.__id) return { soort: 'beeld', img: img, pad: beeldPad(img), rect: img.getBoundingClientRect() };
    return null;
  }
  function verberg() { if (hl) hl.style.display = 'none'; }
  function beweeg(e) { if (!bewerken) return; const d = doel(e.clientX, e.clientY); if (!d) { verberg(); return; } const r = d.rect; hl.style.cssText = 'display:block;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px'; }
  function klik(e) {
    if (!bewerken) return; e.preventDefault(); e.stopPropagation(); if (bezig) return;
    const d = doel(e.clientX, e.clientY); if (!d) { sluitPaneel(); return; }
    if (d.soort === 'tekst') tekstPaneel(d.node); else beeldPaneel(d.img, d.pad);
  }

  /* ---------- panelen ---------- */
  function sluitPaneel() {
    if (paneel) { const f = paneel.__sluit; paneel.remove(); paneel = null; if (f) f(); if (laatsteFocus && laatsteFocus.focus) { try { laatsteFocus.focus(); } catch (e) {} } laatsteFocus = null; }
  }
  function open(titel, inhoud, knoppen) {
    if (!paneel) laatsteFocus = document.activeElement; else { const f = paneel.__sluit; paneel.remove(); paneel = null; if (f) f(); }
    const kop = el('h2', { id: 'zm-ph-titel', text: titel, tabindex: '-1' });
    paneel = el('aside', { class: 'zm-paneel', role: 'dialog', 'aria-labelledby': 'zm-ph-titel' }, [el('div', { class: 'zm-ph' }, [kop, el('button', { class: 'zm-x', text: '×', 'aria-label': t('sluiten'), onclick: sluitPaneel })])].concat(inhoud, [el('div', { class: 'zm-knoppen' }, knoppen)]));
    paneel.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { ev.stopPropagation(); (paneel.__escape || sluitPaneel)(); } });
    root.appendChild(paneel); return paneel;
  }
  function niet(titel, tx) { open(titel, [el('p', { text: tx })], [el('button', { text: t('sluiten'), onclick: sluitPaneel })]).querySelector('#zm-ph-titel').focus(); }
  function pagNaam(pad) { const p = paginas.filter((x) => x.pad === pad)[0]; return p && p.naam || pad; }
  function vindDoelen(orig) {      // alle plekken (pagina, element, stuk) in de repo waar precies deze tekst staat
    const r = [];
    paginas.forEach((p) => lijstVan(p.pad).forEach((x) => { if (x.soort === 'tekst') x.stukken.forEach((s) => { if (norm(s.tekst) === orig) r.push({ pad: p.pad, id: x.id, k: s.k }); }); }));
    return r;
  }
  function tekstPaneel(n) {
    if (!n.__id) { niet(t('niet_titel'), t('niet_tekst')); return; }
    const sl = n.__key, zelf = { pad: huidig, id: n.__id, k: n.__k }, bestaand = edits.get(sl), orig = bestaand ? bestaand.orig : n.__bron;
    let doelen = bestaand ? bestaand.doelen : [zelf], overalAan = bestaand ? bestaand.overal : false, toegepast = false, geannuleerd = false;
    const voor = bestaand ? { nieuw: bestaand.nieuw, overal: bestaand.overal } : null;
    const ta = el('textarea', { rows: '5', id: 'zm-ta', 'aria-describedby': 'zm-ta-hulp' }); ta.value = (perSleutel.has(sl) ? perSleutel.get(sl) : n.nodeValue).trim();
    const hulp = el('p', { id: 'zm-ta-hulp', class: 'zm-klein', text: t('tekst_uitleg') }), melding = el('p', { class: 'zm-fout', role: 'alert' }), rij = el('div', { 'aria-live': 'polite' });
    function zet(v) {
      v = v.replace(/\s*[\r\n]+\s*/g, ' ');
      let g = edits.get(sl); if (!g) { g = { pad: zelf.pad, id: zelf.id, k: zelf.k, orig: orig }; edits.set(sl, g); }
      g.nieuw = v; g.doelen = doelen; g.overal = overalAan; herbouw(); pasToe(); teller();
    }
    function check() { const leeg = !heeftLetter(ta.value); melding.textContent = leeg ? t('tekst_leeg') : ''; toepasKnop.disabled = leeg; return !leeg; }
    const toepasKnop = el('button', { class: 'zm-primair', text: t('toepassen'), onclick: () => { if (!check()) return; toegepast = true; zet(ta.value.trim()); sluitPaneel(); } });
    open(t('tekst_titel'), [hulp, el('label', { for: 'zm-ta', class: 'zm-klein', text: t('tekst_label') }), ta, melding, rij], [toepasKnop,
      el('button', { text: t('annuleren'), onclick: () => { geannuleerd = true; sluitPaneel(); } }),
      el('button', { text: t('orig_terug'), onclick: () => { toegepast = true; ta.value = orig; zet(orig); sluitPaneel(); } })]);
    // Wat je typt blijft staan, ook als je ergens anders klikt zonder op «Toepassen» te drukken. Alleen «Annuleren» of Escape draait het terug.
    const annuleer = () => { geannuleerd = true; sluitPaneel(); };
    paneel.__escape = annuleer;
    paneel.__sluit = () => {
      if (geannuleerd) { if (voor) { const g = edits.get(sl); g.nieuw = voor.nieuw; g.overal = voor.overal; } else edits.delete(sl); herbouw(); pasToe(); teller(); }
      else if (!toegepast && heeftLetter(ta.value)) zet(ta.value.trim());
    };
    ta.focus(); ta.select();
    ta.addEventListener('input', () => { if (check()) zet(ta.value); });
    // elders in de site dezelfde tekst? (zoekt in de bron van alle pagina's)
    if (!bestaand || bestaand.doelen.length < 2) {
      rij.appendChild(el('p', { class: 'zm-klein', text: t('zoeken') }));
      setTimeout(() => {
        const d = vindDoelen(orig); if (!d.some((x) => x.pad === zelf.pad && x.id === zelf.id && x.k === zelf.k)) d.push(zelf);
        rij.innerHTML = ''; if (!paneel || paneel.__escape !== annuleer) return;
        if (d.length > 1) { doelen = d; overalAan = voor ? voor.overal : true; if (norm(ta.value) !== orig) zet(ta.value); toonRij(); }
      }, 0);
    } else toonRij();
    function toonRij() {
      const pags = Array.from(new Set(doelen.map((d) => d.pad))), namen = pags.map((p) => kort(pagNaam(p), 28));
      const vink = el('input', { type: 'checkbox', id: 'zm-overal' }); vink.checked = overalAan;
      vink.addEventListener('change', () => { overalAan = vink.checked; if (edits.get(sl)) zet(ta.value); });
      rij.appendChild(el('div', { class: 'zm-veld' }, [el('span', { text: t('overal', { n: doelen.length, m: pags.length, lijst: namen.slice(0, 6).join(', ') + (namen.length > 6 ? ' +' + (namen.length - 6) : '') }) }), el('label', { for: 'zm-overal' }, [vink, ' ' + t('overal_vink')])]));
    }
  }
  function beeldPaneel(img, pad) {
    const sl = huidig + '|' + img.__id + '|alt', alt0 = altEdits.get(sl) ? altEdits.get(sl).orig : bewaardAlt.has(sl) ? bewaardAlt.get(sl) : img.__alt0;
    const kan = pad && /\.(png|jpe?g|webp)$/i.test(pad), inh = [];
    let bestand = null, alt = null, geannuleerd = false;
    if (kan) {
      const ext = /\.(png|jpe?g|webp)$/i.exec(pad)[1].toLowerCase(), mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      bestand = el('input', { type: 'file', accept: 'image/*', id: 'zm-bestand' });
      bestand.addEventListener('change', () => {
        const f = bestand.files[0]; if (!f) return;
        verkleinen(f, mime).then((blob) => {
          const v = beeldEdits.get(pad); if (v && v.url) URL.revokeObjectURL(v.url);
          beeldEdits.set(pad, { blob: blob, url: URL.createObjectURL(blob) }); pasBeeldenToe(); teller(); toast(t('foto_vervangen'));
        }).catch(() => { toast(t('foto_fout'), 'fout'); });
      });
      inh.push(el('p', { class: 'zm-klein', text: t('foto_uitleg', { pad }) }), el('label', { for: 'zm-bestand', class: 'zm-klein', text: t('foto_kies') }), bestand);
    } else inh.push(el('p', { class: 'zm-klein', text: t('foto_niet', { pad: pad || img.getAttribute('src') || '' }) }));
    if (alt0 !== null && alt0 !== undefined) {
      alt = el('input', { type: 'text', id: 'zm-alt' }); const a = altEdits.get(sl); alt.value = a ? a.nieuw : alt0;
      alt.addEventListener('input', () => {
        const g = altEdits.get(sl) || { pad: huidig, id: img.__id, orig: alt0, bestand: pad }; g.nieuw = alt.value; altEdits.set(sl, g); pasToe(); teller();
      });
      inh.push(el('label', { for: 'zm-alt', class: 'zm-klein', text: t('alt_label') }), alt);
    }
    const voorAlt = altEdits.get(sl) ? altEdits.get(sl).nieuw : null;
    const p = open(t('foto_titel'), inh, [
      el('button', { class: 'zm-primair', text: t('toepassen'), onclick: sluitPaneel }),
      el('button', { text: t('foto_terug'), onclick: () => { geannuleerd = true; sluitPaneel(); } })]);
    p.__escape = sluitPaneel;
    p.__sluit = () => {
      if (!geannuleerd) return;
      const v = beeldEdits.get(pad); if (v) { URL.revokeObjectURL(v.url); beeldEdits.delete(pad); pasBeeldenToe(); }
      if (voorAlt === null) altEdits.delete(sl); else altEdits.get(sl).nieuw = voorAlt;
      pasToe(); teller();
    };
    (bestand || alt || p.querySelector('#zm-ph-titel')).focus();
  }
  function verkleinen(file, mime) {
    return new Promise((ok, nee) => {
      const url = URL.createObjectURL(file), im = new Image();
      im.onload = () => {
        const k = Math.min(1, 1920 / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
        const g = c.getContext('2d'); if (mime === 'image/jpeg') { g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); } g.drawImage(im, 0, 0, c.width, c.height);
        c.toBlob((b) => { URL.revokeObjectURL(url); b ? ok(b) : nee(); }, mime, 0.88);
      };
      im.onerror = () => { URL.revokeObjectURL(url); nee(); }; im.src = url;
    });
  }
  function pasBeeldenToe() {
    if (!doc) return;
    [].forEach.call(doc.querySelectorAll('img'), (img) => {
      const pad = beeldPad(img), v = pad && (beeldEdits.get(pad) || beeldBewaard.get(pad)); if (!v) return;
      if (img.__orig === undefined) img.__orig = img.getAttribute('src');
      img.removeAttribute('srcset'); img.src = v.url;
    });
  }
  function tekstenLijst() {
    if (!doc) return;
    const filter = el('input', { type: 'text', id: 'zm-filter', 'aria-label': t('filter'), placeholder: t('filter') }), ul = el('ul', { class: 'zm-lijst' });
    function vul() {
      const q = norm(filter.value).toLowerCase(); ul.innerHTML = ''; let n = 0;
      knopen.forEach((nd) => {
        const tx = norm(nd.nodeValue); if (!tx || (q && tx.toLowerCase().indexOf(q) < 0)) return; n++;
        ul.appendChild(el('li', {}, [el('button', { text: kort(tx, 90), onclick: () => { const e = nd.parentNode; try { e.scrollIntoView({ block: 'center' }); } catch (x) {} tekstPaneel(nd); } })]));
      });
      if (!n) ul.appendChild(el('li', { class: 'zm-klein', text: t('geen_teksten') }));
    }
    filter.addEventListener('input', vul); vul();
    open(t('lijst_titel'), [el('p', { class: 'zm-klein', text: t('lijst_uitleg') }), filter, ul], [el('button', { text: t('sluiten'), onclick: sluitPaneel })]).querySelector('#zm-ph-titel').focus();
  }

  /* ---------- «Wat verandert er?» ---------- */
  function lijstItems() {      // alles wat nu nog niet is opgeslagen, leesbaar
    const r = [];
    edits.forEach((g, sl) => { if (norm(g.nieuw) === g.orig) return; r.push({ soort: 'tekst', sl: sl, pad: g.pad, voor: g.orig, na: g.nieuw, extra: g.overal && g.doelen.length > 1 ? g.doelen.length - 1 : 0 }); });
    altEdits.forEach((a, sl) => { if (a.nieuw === a.orig) return; r.push({ soort: 'alt', sl: sl, pad: a.pad, voor: a.orig, na: a.nieuw, bestand: a.bestand }); });
    beeldEdits.forEach((v, pad) => { r.push({ soort: 'foto', sl: pad, pad: pad, url: v.url }); });
    return r;
  }
  function overzicht(klaar) {      // klaar: resultaat van voorbereid() als dit het controle-scherm voor opslaan is
    const items = lijstItems(), inh = [];
    if (!items.length) inh.push(el('p', { text: t('leeg') }));
    const perPagina = {}; items.forEach((it) => { (perPagina[it.pad] = perPagina[it.pad] || []).push(it); });
    Object.keys(perPagina).forEach((pad) => {
      inh.push(el('h3', { class: 'zm-h3', text: t('op_pagina', { naam: perPagina[pad][0].soort === 'foto' ? pad : pagNaam(pad) }) }));
      perPagina[pad].forEach((it) => {
        const kn = [];
        if (it.soort === 'foto') kn.push(el('p', {}, [el('strong', { text: t('foto') + ': ' }), it.pad + ' → ' + t('foto_nieuw')]), el('img', { src: it.url, alt: '', class: 'zm-mini' }));
        else {
          kn.push(el('p', { class: it.extra ? 'zm-fout' : 'zm-klein', text: it.soort === 'alt' ? t('alt_van', { pad: it.bestand || '' }) : it.extra ? '⚠ ' + t('ook_op', { n: it.extra }) : '' }));
          kn.push(el('p', { class: 'zm-voor' }, [el('span', { class: 'zm-lbl', text: t('voor') }), ' ' + it.voor]), el('p', { class: 'zm-na' }, [el('span', { class: 'zm-lbl', text: t('na') }), ' ' + it.na]));
        }
        if (!klaar) kn.push(el('button', { class: 'zm-klein-knop', text: t('terugzetten'), onclick: () => { terugzetten(it); overzicht(null); } }));
        inh.push(el('div', { class: 'zm-item' }, kn));
      });
    });
    const knoppen = [];
    if (klaar) {
      inh.unshift(el('div', { class: 'zm-ctrl' }, [el('ul', {}, klaar.controle.map((c) => el('li', { text: '✓ ' + c }))), el('p', { class: 'zm-fout', text: t('live_waarschuwing') })]));
      knoppen.push(el('button', { class: 'zm-primair', text: t('zet_live'), onclick: () => zetLive(klaar) }), el('button', { text: t('terug'), onclick: sluitPaneel }));
    } else knoppen.push(el('button', { text: t('sluiten'), onclick: sluitPaneel }));
    open(klaar ? t('ctrl_titel') : t('wat'), inh, knoppen).querySelector('#zm-ph-titel').focus();
  }
  function terugzetten(it) {
    if (it.soort === 'tekst') edits.delete(it.sl); else if (it.soort === 'alt') altEdits.delete(it.sl); else { const v = beeldEdits.get(it.sl); if (v) URL.revokeObjectURL(v.url); beeldEdits.delete(it.sl); }
    herbouw(); pasToe(); pasBeeldenToe(); if (doc) { [].forEach.call(doc.querySelectorAll('img'), (img) => { if (img.__orig !== undefined && !(beeldPad(img) && (beeldEdits.get(img.__pad) || beeldBewaard.get(img.__pad)))) img.src = img.__orig; }); } teller();
  }

  /* ---------- opslaan: verse bron, doorrekenen, controleren, tonen, dan pas schrijven ---------- */
  function b64(buf) { let s = ''; const a = new Uint8Array(buf); for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); }
  const vorm = (h, maskers) => K.ontleed(h).alle.map((k) => {
    let at = k.attrs || ''; const id = (/ data-cms="([ti]\d+)"/.exec(at) || [])[1];
    if (id && maskers && maskers[id]) at = at.replace(/\s(src|alt)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g, ' $1=#');
    return k.tag + '|' + at;
  }).join('\n');
  function controleer(oud, nieuw, wijz) {      // geeft null als alles klopt, anders een korte reden
    const maskers = {}; wijz.forEach((w) => { if (w.soort === 'attr') maskers[w.id] = true; });
    if (vorm(oud, maskers) !== vorm(nieuw, maskers)) return 'opbouw';
    const verwacht = JSON.stringify(K.lijst(oud).map((x) => {      // het verwachte model: de oude lijst met alleen de gekozen wijzigingen erop
      const m = JSON.parse(JSON.stringify(x));
      wijz.forEach((w) => { if (w.id !== x.id) return; if (w.soort === 'tekst') m.stukken[w.k].tekst = w.nieuw.replace(/^\s+|\s+$/g, ''); else m[w.naam] = w.nieuw; });
      if (m.stukken) m.stukken = m.stukken.map((s) => ({ k: s.k, tekst: K.norm(s.tekst) })); if (m.soort === 'beeld') { m.src = m.src; }
      return m;
    }));
    const werkelijk = JSON.stringify(K.lijst(nieuw).map((x) => { const m = JSON.parse(JSON.stringify(x)); if (m.stukken) m.stukken = m.stukken.map((s) => ({ k: s.k, tekst: K.norm(s.tekst) })); return m; }));
    if (verwacht !== werkelijk) return 'tekst';
    return null;
  }
  function voorbereid() {
    let basisSha, treeSha;
    return gh('/git/ref/heads/' + BRANCH).then((ref) => { basisSha = ref.object.sha; return gh('/git/commits/' + basisSha); }).then((c) => {
      treeSha = c.tree.sha;
      const perPad = {}, add = (pad, w) => { (perPad[pad] = perPad[pad] || []).push(w); };
      edits.forEach((g) => { if (norm(g.nieuw) === g.orig) return; (g.overal ? g.doelen : [{ pad: g.pad, id: g.id, k: g.k }]).forEach((d) => add(d.pad, { soort: 'tekst', id: d.id, k: d.k, orig: g.orig, nieuw: g.nieuw })); });
      altEdits.forEach((a) => { if (a.nieuw !== a.orig) add(a.pad, { soort: 'attr', id: a.id, naam: 'alt', orig: a.orig, nieuw: a.nieuw }); });
      const pads = Object.keys(perPad), uit = { basisSha, treeSha, bestanden: [], beelden: [], controle: [], aantalStukken: 0 };
      return Promise.all(pads.map((p) => gh('/contents/' + p + '?ref=' + basisSha, { raw: true }).then((oud) => ({ pad: p, oud: oud })))).then((geladen) => {
        for (const b of geladen) {
          const wijz = perPad[b.pad], r = K.pas(b.oud, wijz);
          if (r.fouten.length) { const f = r.fouten[0].reden; const e = new Error(f === 'verouderd' ? t('f_verouderd') : f === 'niet-gevonden' || f === 'geen-stuk' ? t('f_niet_gevonden') : t('f_algemeen', { reden: f })); e.nietGh = true; throw e; }
          const probleem = controleer(b.oud, r.html, wijz);
          if (probleem) { const e = new Error(t('f_ctrl', { reden: probleem })); e.nietGh = true; throw e; }
          if (r.html !== b.oud) { uit.bestanden.push({ path: b.pad, tekst: r.html, oud: b.oud }); uit.aantalStukken += wijz.length; }
        }
        beeldEdits.forEach((v, pad) => uit.beelden.push({ path: pad, blob: v.blob }));
        if (!uit.bestanden.length && !uit.beelden.length) { const e = new Error(t('niets')); e.nietGh = true; throw e; }
        if (uit.bestanden.length) { uit.controle.push(t('ctrl_struct')); uit.controle.push(t('ctrl_tekst', { n: uit.aantalStukken })); }
        uit.controle.push(t('ctrl_bestanden', { n: uit.bestanden.length + uit.beelden.length, lijst: (() => { const l = uit.bestanden.map((b) => b.path).concat(uit.beelden.map((b) => b.path)); return l.slice(0, 6).join(', ') + (l.length > 6 ? ' +' + (l.length - 6) : ''); })() }));
        return uit;
      });
    });
  }
  function foutMelding(e) {
    bezig = false;
    teller(); kopStatus.textContent = '';
    toast(e.nietGh ? e.message : e.status === 403 || e.status === 401 ? t('geen_recht') + reden(e) : t('mislukt', { fout: e.message }) + reden(e), 'fout');
  }
  function opslaan() {
    if (!aantal()) return; opslaanKnop.disabled = true; kopStatus.textContent = t('opslaan_bezig');
    voorbereid().then((v) => { teller(); kopStatus.textContent = ''; overzicht(v); }).catch(foutMelding);
  }
  function zetLive(v) {
    sluitPaneel(); bezig = true; opslaanKnop.disabled = true; kopStatus.textContent = t('opslaan_bezig2');
    const werk = [];
    v.bestanden.forEach((b) => werk.push(gh('/git/blobs', { method: 'POST', body: { content: b.tekst, encoding: 'utf-8' } }).then((r) => ({ path: b.path, mode: '100644', type: 'blob', sha: r.sha }))));
    v.beelden.forEach((b) => werk.push(b.blob.arrayBuffer().then((buf) => gh('/git/blobs', { method: 'POST', body: { content: b64(buf), encoding: 'base64' } })).then((r) => ({ path: b.path, mode: '100644', type: 'blob', sha: r.sha }))));
    Promise.all(werk).then((tree) => gh('/git/trees', { method: 'POST', body: { base_tree: v.treeSha, tree: tree } }))
      .then((tr) => { const n = v.bestanden.length + v.beelden.length; return gh('/git/commits', { method: 'POST', body: { message: PREFIX + ' (' + t(n === 1 ? 'commit_n' : 'commit_m', { n }) + ')', tree: tr.sha, parents: [v.basisSha] } }); })
      .then((cm) => gh('/git/refs/heads/' + BRANCH, { method: 'PATCH', body: { sha: cm.sha, force: false } }))
      .then(() => klaarOpgeslagen(v))
      .catch((e) => {
        if (e.status === 422) { bezig = false; toast(t('intussen'), 'fout'); kopStatus.textContent = t('opslaan_bezig'); voorbereid().then((nw) => { teller(); kopStatus.textContent = ''; overzicht(nw); }).catch(foutMelding); }
        else foutMelding(e);
      });
  }
  function klaarOpgeslagen(v) {
    bezig = false;
    const nieuweBron = {}; v.bestanden.forEach((b) => { bron[b.path] = b.tekst; delete lijstCache[b.path]; nieuweBron[b.path] = b.tekst; });
    // Tot de site opnieuw gepubliceerd is, blijven de opgeslagen aanpassingen zichtbaar (en op die plek verder aanpasbaar).
    perSleutel.forEach((tx, sl) => { bewaard.set(sl, tx); });
    altEdits.forEach((a, sl) => { if (a.nieuw !== a.orig) bewaardAlt.set(sl, a.nieuw); });
    const dezeBeelden = new Map(beeldEdits); beeldEdits.forEach((b, pad) => { beeldBewaard.set(pad, b); });
    knopen.forEach((n) => { if (bewaard.has(n.__key)) n.__bron = norm(bewaard.get(n.__key)); });
    edits.clear(); altEdits.clear(); beeldEdits.clear(); herbouw(); teller(); pasToe();
    kopStatus.textContent = t('publiceren'); toast(t('opgeslagen'), 'vast');
    wachtOpPublicatie(nieuweBron, dezeBeelden);
  }
  function wachtOpPublicatie(nieuweBron, beelden) {      // kijkt elke 6 s of de gepubliceerde site de opgeslagen versie bevat (max. 8 min)
    const mijn = ++wachtTeller, begin = Date.now(), pad = Object.keys(nieuweBron)[0], bpad = pad ? null : (Array.from(beelden.keys())[0] || null);
    function klaar() {
      if (mijn !== wachtTeller) return;
      bewaard.clear(); bewaardAlt.clear(); beeldBewaard.forEach((b) => { URL.revokeObjectURL(b.url); }); beeldBewaard.clear();
      gaNaar.v = Date.now(); gaNaar(huidig); toast(t('klaar')); kopStatus.textContent = t('klaar_kort');
    }
    function ronde() {
      if (mijn !== wachtTeller) return;      // er is intussen opnieuw opgeslagen: die ronde neemt het over
      if (Date.now() - begin > 480000) { toast(t('duurt'), 'fout'); kopStatus.textContent = t('opgeslagen_kort'); return; }
      const url = BASE + (pad || bpad) + '?v=' + Date.now();
      const p = pad ? fetch(url, { cache: 'no-store' }).then((r) => (r.ok ? r.text().then((tx) => K.haalMarkering(tx) === K.haalMarkering(nieuweBron[pad]) || tx === nieuweBron[pad]) : false))
        : bpad ? fetch(url, { cache: 'no-store' }).then((r) => (r.ok ? r.arrayBuffer().then((b) => b.byteLength === beelden.get(bpad).blob.size) : false)) : Promise.resolve(true);
      p.then((ok) => { if (ok) klaar(); else setTimeout(ronde, 6000); }).catch(() => { setTimeout(ronde, 6000); });
    }
    setTimeout(ronde, 6000);
  }
  function ongedaan() {
    if (aantal() && !confirm(t('ong_verlies'))) return;
    gh('/git/ref/heads/' + BRANCH).then((ref) => {
      const head = ref.object.sha;
      return gh('/git/commits/' + head).then((c) => {
        if (c.message.indexOf(PREFIX) !== 0) { toast(t('ong_niet_hier'), 'fout'); return; }
        if (!confirm(t('ong_vraag', { bericht: c.message }))) return;
        return gh('/git/commits/' + c.parents[0].sha).then((ouder) => gh('/git/commits', { method: 'POST', body: { message: t('ong_bericht'), tree: ouder.tree.sha, parents: [head] } }))
          .then((cm) => gh('/git/refs/heads/' + BRANCH, { method: 'PATCH', body: { sha: cm.sha, force: false } }))
          .then(() => { wachtTeller++; toast(t('ong_ok'), 'vast'); setTimeout(() => { location.reload(); }, 100000); });
      });
    }).catch((e) => { toast(t('ong_fout', { fout: e.message }) + reden(e), 'fout'); });
  }

  if (token) start(); else inloggen();
})();
