// Sectoren: overzicht en negen sectorpagina's. Per sector: kort, h1, lead, wat misloopt, wat we bouwen.
const T = {
  nl: { mis: 'Wat vaak misloopt', bouw: 'Wat we kunnen bouwen', faqH: 'Vragen', title: (k) => `Software op maat voor ${k.toLowerCase()} | PlatforMaat`,
    faq: [['Moeten we ons pakket vervangen?', 'Nee. We bouwen het stuk dat ontbreekt en koppelen het aan wat je al gebruikt, voor zover dat pakket het toelaat.'], ['Wat als we maar een klein team zijn?', 'Dan blijft het een kleine, eenvoudige toepassing. Je betaalt alleen voor wat je nodig hebt, met een vaste prijs.']], lees: 'Lees ook', ander: 'Andere sector of je herkent je niet in de lijst? Vertel gerust wat er vastloopt.' },
  fr: { mis: 'Ce qui coince souvent', bouw: 'Ce que nous pouvons développer', faqH: 'Questions', title: (k) => `Logiciel sur mesure pour ${k.toLowerCase()} | PlatforMaat`,
    faq: [['Devons-nous remplacer notre logiciel ?', 'Non. Nous développons la pièce manquante et la relions à ce que vous utilisez déjà, dans la mesure où ce logiciel le permet.'], ['Et si notre équipe est petite ?', 'L’outil reste alors petit et simple. Vous ne payez que ce dont vous avez besoin, à prix fixe.']], lees: 'À lire aussi', ander: 'Votre secteur n’y figure pas ? Dites-nous simplement ce qui coince.' },
  en: { mis: 'What often goes wrong', bouw: 'What we can build', faqH: 'Questions', title: (k) => `Custom software for ${k.toLowerCase()} | PlatforMaat`,
    faq: [['Do we have to replace our current software?', 'No. We build the missing piece and connect it to what you already use, as far as that software allows.'], ['What if our team is small?', 'Then it stays a small, simple tool. You only pay for what you need, at a fixed price.']], lees: 'Read more', ander: 'Not in the list? Just tell us what’s getting stuck.' },
};

function sector(sleutel, slug, data, gids) {
  const p = { sleutel, ouder: 'sectoren', slug };
  for (const c of ['nl', 'fr', 'en']) {
    const d = data[c], t = T[c];
    p[c] = {
      kort: d.kort, title: t.title(d.kort), description: d.lead, h1: d.h1, lead: d.lead,
      blokken: [
        { type: 'lijst', h2: t.mis, items: d.mis },
        { type: 'items', h2: t.bouw, items: d.bouw },
        { type: 'faq', h2: t.faqH, items: t.faq },
        { type: 'links', h2: t.lees, items: gids.map((g) => [g, '']) },
      ],
    };
  }
  return p;
}

const sectoren = [
  sector('sector-installateurs', { nl: 'sectoren/installateurs', fr: 'secteurs/installateurs', en: 'industries/installers' }, {
    nl: { kort: 'Installateurs', h1: 'Software voor installateurs', lead: 'Voor HVAC-, sanitair- en elektriciteitsbedrijven: offertes, werkbonnen, planning en onderhoudscontracten op één plek.',
      mis: ['Offertes worden met de hand opgebouwd uit prijslijsten, net op de drukste momenten.', 'Werkbonnen komen op papier terug en worden opnieuw ingetikt voor de factuur.', 'Onderhoudscontracten met een vervaldatum zitten in het hoofd van één persoon.', 'Meerwerk wordt gedaan maar niet genoteerd, en dus niet gefactureerd.'],
      bouw: [['Offerteplatform', 'Prijslijsten, kortingen en je marge samen, met een offerte in je huisstijl.'], ['Werkbon-app', 'Foto’s, materiaal en handtekening van de klant, rechtstreeks in je administratie.'], ['Planning', 'Wie staat waar en wat is nog vrij.'], ['Onderhoudskalender', 'Herinneringen aan klant en kantoor, zodat geen contract stil verloopt.']] },
    fr: { kort: 'Installateurs', h1: 'Logiciel pour installateurs', lead: 'Pour les entreprises de chauffage, sanitaire et électricité : devis, bons d’intervention, planning et contrats d’entretien au même endroit.',
      mis: ['Les devis sont construits à la main à partir des listes de prix, justement aux moments les plus chargés.', 'Les bons d’intervention reviennent sur papier et sont ressaisis pour la facture.', 'Les contrats d’entretien à échéance ne sont connus que d’une seule personne.', 'Les travaux supplémentaires sont faits mais pas notés, donc pas facturés.'],
      bouw: [['Outil de devis', 'Listes de prix, remises et marge réunies, avec un devis à vos couleurs.'], ['Application de bons d’intervention', 'Photos, matériel et signature du client, directement dans votre administration.'], ['Planning', 'Qui est où et ce qui reste disponible.'], ['Calendrier d’entretien', 'Des rappels au client et au bureau, pour qu’aucun contrat n’expire en silence.']] },
    en: { kort: 'Installers', h1: 'Software for installers', lead: 'For HVAC, plumbing and electrical firms: quotes, job sheets, scheduling and service contracts in one place.',
      mis: ['Quotes are put together by hand from supplier price lists, right when you are busiest.', 'Job sheets come back on paper and are retyped for the invoice.', 'Service contracts with an expiry date live in one person’s head.', 'Extra work gets done but not recorded, so it isn’t invoiced.'],
      bouw: [['Quoting tool', 'Price lists, discounts and your margin together, with a quote in your branding.'], ['Job sheet app', 'Photos, materials and the customer’s signature, straight into your admin.'], ['Scheduling', 'Who is where and what is still free.'], ['Service calendar', 'Reminders for customer and office, so no contract quietly lapses.']] },
  }, ['gids-offerte', 'gids-koppelingen']),

  sector('sector-bouwafwerking', { nl: 'sectoren/bouwafwerking', fr: 'secteurs/finitions', en: 'industries/building-finishing' }, {
    nl: { kort: 'Bouwafwerking', h1: 'Software voor bouwafwerkers', lead: 'Voor schilders, tegelzetters, stukadoors en andere afwerkers: opmeting, offerte, meerwerk en foto’s per werf op één plek.',
      mis: ['Opmetingen staan in een schriftje en worden thuis omgezet in een offerte.', 'Meerwerk wordt mondeling afgesproken en wordt later een discussie over de factuur.', 'Foto’s van voor en na staan verspreid over telefoons.', 'Planning en bestellingen lopen door elkaar, zodat materiaal te laat of dubbel komt.'],
      bouw: [['Offerte uit je opmeting', 'Je vult de opmeting in en krijgt een duidelijke offerte met jouw prijzen.'], ['Meerwerk op de gsm', 'De klant keurt meteen goed, en het komt in het dossier.'], ['Fotodossier per werf', 'Geordend per ruimte en datum, deelbaar bij oplevering.'], ['Klantportaal', 'Offerte, planning en foto’s op één plek voor je klant.']] },
    fr: { kort: 'Finitions du bâtiment', h1: 'Logiciel pour les métiers de la finition', lead: 'Pour peintres, carreleurs, plafonneurs et autres métiers de la finition : métré, devis, suppléments et photos par chantier au même endroit.',
      mis: ['Les métrés sont notés dans un carnet puis transformés en devis le soir.', 'Les suppléments sont convenus oralement et deviennent ensuite une discussion sur la facture.', 'Les photos avant et après sont éparpillées sur plusieurs téléphones.', 'Planning et commandes se mélangent : le matériel arrive en retard ou en double.'],
      bouw: [['Devis à partir du métré', 'Vous saisissez le métré et obtenez un devis clair avec vos prix.'], ['Suppléments sur mobile', 'Le client valide tout de suite, et c’est versé au dossier.'], ['Dossier photo par chantier', 'Classé par pièce et par date, à partager à la réception.'], ['Portail client', 'Devis, planning et photos au même endroit pour votre client.']] },
    en: { kort: 'Building finishing', h1: 'Software for finishing trades', lead: 'For painters, tilers, plasterers and other finishing trades: measurements, quotes, extra work and photos per site in one place.',
      mis: ['Measurements are noted in a notebook and turned into a quote at home.', 'Extra work is agreed verbally and later becomes an argument about the invoice.', 'Before and after photos are scattered across phones.', 'Scheduling and ordering get mixed up, so materials arrive late or twice.'],
      bouw: [['Quotes from measurements', 'Enter the measurements and get a clear quote with your prices.'], ['Extra work on the phone', 'The customer approves on the spot and it goes into the file.'], ['Photo file per site', 'Sorted by room and date, ready to share at handover.'], ['Customer portal', 'Quote, schedule and photos in one place for your customer.']] },
  }, ['gids-offerte', 'gids-platform']),

  sector('sector-groothandel', { nl: 'sectoren/groothandel', fr: 'secteurs/grossistes', en: 'industries/wholesale' }, {
    nl: { kort: 'Groothandel', h1: 'Software voor groothandels', lead: 'Voor leveranciers aan bedrijven: bestellingen, klantprijzen, voorraad en facturen op één plek.',
      mis: ['Bestellingen uit mails worden met de hand ingetikt.', 'Elke klant heeft eigen prijzen en kortingen, verspreid over bestanden.', 'Klanten bellen om te vragen of iets op voorraad is.', 'Voorraad in het magazijn en op de webshop lopen uit de pas.'],
      bouw: [['Bestelportaal (B2B)', 'Met eigen prijzen per klant en een herbestellijst.'], ['Koppeling met voorraad en boekhouding', 'Prijzen en voorraad op één plek beheerd.'], ['Bestelmails voorbereiden', 'Herkend en klaargezet; een medewerker controleert.'], ['Overzicht per klant', 'Leveringen en facturen die klanten zelf raadplegen.']] },
    fr: { kort: 'Grossistes', h1: 'Logiciel pour grossistes', lead: 'Pour les fournisseurs aux entreprises : commandes, prix clients, stock et factures au même endroit.',
      mis: ['Les commandes reçues par e-mail sont ressaisies à la main.', 'Chaque client a ses prix et remises, éparpillés dans plusieurs fichiers.', 'Les clients appellent pour savoir si un article est en stock.', 'Le stock de l’entrepôt et celui de la boutique en ligne ne correspondent plus.'],
      bouw: [['Portail de commande (B2B)', 'Avec les prix propres à chaque client et une liste de réassort.'], ['Lien avec stock et comptabilité', 'Prix et stock gérés à un seul endroit.'], ['Préparation des e-mails de commande', 'Reconnus et préparés ; un collaborateur vérifie.'], ['Vue par client', 'Livraisons et factures consultables par le client lui-même.']] },
    en: { kort: 'Wholesale', h1: 'Software for wholesalers', lead: 'For B2B suppliers: orders, customer prices, stock and invoices in one place.',
      mis: ['Orders from email are retyped by hand.', 'Every customer has their own prices and discounts, spread across files.', 'Customers call to ask whether something is in stock.', 'Warehouse stock and webshop stock drift apart.'],
      bouw: [['Ordering portal (B2B)', 'With each customer’s own prices and a reorder list.'], ['Link with stock and accounting', 'Prices and stock managed in one place.'], ['Preparing order emails', 'Recognised and prepared; a person checks.'], ['Customer overview', 'Deliveries and invoices customers can look up themselves.']] },
  }, ['gids-koppelingen', 'gids-maatwerk']),

  sector('sector-handelaars', { nl: 'sectoren/handelaars', fr: 'secteurs/commerces', en: 'industries/local-businesses' }, {
    nl: { kort: 'Handelaars en lokale zaken', h1: 'Software voor handelaars en lokale ondernemingen', lead: 'Een website die gevonden wordt, een afsprakensysteem of kleine webshop, en koppelingen met je kassa of boekhouding.',
      mis: ['De website is verouderd en niet bruikbaar op een gsm.', 'Openingsuren staan niet overal gelijk.', 'Afspraken lopen via telefoon, berichtjes en een papieren agenda.', 'Een webshop lijkt te groot of te duur.'],
      bouw: [['Bedrijfswebsite', 'Snel, goed leesbaar op gsm en vindbaar in je regio.'], ['Afspraken of reservaties', 'Passend bij hoe je werkt, zonder abonnement per functie.'], ['Kleine webshop of afhaling', 'Voor een beperkt aanbod.'], ['Koppeling met kassa of boekhouding', 'Zodat je niets overtikt.']] },
    fr: { kort: 'Commerces de proximité', h1: 'Logiciel pour commerces et entreprises locales', lead: 'Un site qu’on trouve, un système de rendez-vous ou une petite boutique, et des liens avec votre caisse ou votre comptabilité.',
      mis: ['Le site est dépassé et inutilisable sur mobile.', 'Les horaires ne sont pas les mêmes partout.', 'Les rendez-vous passent par téléphone, messages et agenda papier.', 'Une boutique en ligne semble trop grande ou trop chère.'],
      bouw: [['Site d’entreprise', 'Rapide, lisible sur mobile et trouvable dans votre région.'], ['Rendez-vous ou réservations', 'Adapté à votre façon de travailler, sans abonnement par fonction.'], ['Petite boutique ou retrait', 'Pour une offre limitée.'], ['Lien avec caisse ou comptabilité', 'Pour ne plus rien ressaisir.']] },
    en: { kort: 'Local businesses', h1: 'Software for shops and local businesses', lead: 'A website people find, a booking system or small online shop, and links with your till or accounting.',
      mis: ['The website is outdated and unusable on a phone.', 'Opening hours differ from place to place.', 'Bookings go through calls, messages and a paper diary.', 'An online shop seems too big or too expensive.'],
      bouw: [['Company website', 'Fast, readable on a phone and findable in your area.'], ['Bookings or reservations', 'Fitted to how you work, without a subscription per feature.'], ['Small shop or click-and-collect', 'For a limited range.'], ['Link with till or accounting', 'So nothing gets retyped.']] },
  }, ['gids-website', 'gids-koppelingen']),

  sector('sector-horeca', { nl: 'sectoren/horeca', fr: 'secteurs/horeca', en: 'industries/hospitality' }, {
    nl: { kort: 'Horeca', h1: 'Software voor de horeca', lead: 'Menu, prijzen en openingsuren uit één bron, voor je website, je kassa en je keuken.',
      mis: ['Een prijswijziging moet op de website, in de kassa en op de kaart apart.', 'Openingsuren en uitzonderingen verschillen tussen Google, de website en de deur.', 'Een standaardkassa past niet bij afhaal en levering.', 'Bestellingen uit verschillende kanalen komen niet samen in de keuken.'],
      bouw: [['Website uit dezelfde bron', 'Menu en uren komen uit dezelfde gegevens als je kassa.'], ['Kassa op maat', 'Menu en prijzen op één plek beheerd.'], ['Afhaal of reservatie', 'Op je website, als je dat wilt.'], ['Keukenscherm', 'Alle bestellingen op één scherm.']] },
    fr: { kort: 'Horeca', h1: 'Logiciel pour l’horeca', lead: 'Menu, prix et horaires à partir d’une seule source, pour votre site, votre caisse et votre cuisine.',
      mis: ['Un changement de prix doit être fait séparément sur le site, à la caisse et sur la carte.', 'Horaires et exceptions diffèrent entre Google, le site et la porte.', 'Une caisse standard ne convient pas au retrait et à la livraison.', 'Les commandes de différents canaux n’arrivent pas ensemble en cuisine.'],
      bouw: [['Site issu de la même source', 'Menu et horaires proviennent des mêmes données que votre caisse.'], ['Caisse sur mesure', 'Menu et prix gérés à un seul endroit.'], ['Retrait ou réservation', 'Sur votre site, si vous le souhaitez.'], ['Écran cuisine', 'Toutes les commandes sur un seul écran.']] },
    en: { kort: 'Hospitality', h1: 'Software for hospitality', lead: 'Menu, prices and opening hours from one source, for your website, till and kitchen.',
      mis: ['A price change has to be made separately on the website, the till and the menu card.', 'Hours and exceptions differ between Google, the website and the door.', 'A standard till doesn’t fit takeaway and delivery.', 'Orders from different channels don’t come together in the kitchen.'],
      bouw: [['Website from the same source', 'Menu and hours come from the same data as your till.'], ['Custom till', 'Menu and prices managed in one place.'], ['Takeaway or reservations', 'On your website, if you want it.'], ['Kitchen screen', 'All orders on one screen.']] },
  }, ['gids-website', 'voorbeelden']),

  sector('sector-boekhouding', { nl: 'sectoren/boekhoudkantoren', fr: 'secteurs/fiduciaires', en: 'industries/accounting-firms' }, {
    nl: { kort: 'Boekhoudkantoren', h1: 'Software voor boekhoudkantoren', lead: 'Een portaal waar klanten aanleveren en zien wat nog ontbreekt, met herinneringen en documentherkenning die een medewerker controleert.',
      mis: ['Klanten sturen documenten per mail, foto of chat, in alle formaten.', 'Wie nog iets moet aanleveren, volgt het kantoor met de hand op.', 'Elk kwartaal worden dezelfde vragen opnieuw gesteld.', 'Documenten worden handmatig herkend, hernoemd en ingebracht.'],
      bouw: [['Klantenportaal', 'Klanten laden op en zien wat nog ontbreekt.'], ['Checklists en herinneringen', 'Per klant en per periode, automatisch.'], ['Documentherkenning met AI', 'Type, datum en bedrag voorbereid; een medewerker controleert.'], ['Overzicht van deadlines', 'De status per klant voor het hele kantoor.']] },
    fr: { kort: 'Fiduciaires', h1: 'Logiciel pour fiduciaires et bureaux comptables', lead: 'Un portail où les clients déposent leurs documents et voient ce qui manque, avec rappels et reconnaissance de documents vérifiée par un collaborateur.',
      mis: ['Les clients envoient leurs documents par e-mail, photo ou messagerie, dans tous les formats.', 'Le suivi de ce qui manque encore se fait à la main.', 'Les mêmes questions reviennent chaque trimestre.', 'Les documents sont identifiés, renommés et encodés à la main.'],
      bouw: [['Portail client', 'Les clients déposent et voient ce qui manque.'], ['Checklists et rappels', 'Par client et par période, automatiquement.'], ['Reconnaissance de documents par IA', 'Type, date et montant préparés ; un collaborateur vérifie.'], ['Vue des échéances', 'Le statut par client pour tout le bureau.']] },
    en: { kort: 'Accounting firms', h1: 'Software for accounting firms', lead: 'A portal where clients upload documents and see what’s missing, with reminders and document recognition checked by a staff member.',
      mis: ['Clients send documents by email, photo or chat, in every format.', 'Chasing what’s still missing is done by hand.', 'The same questions are asked again every quarter.', 'Documents are recognised, renamed and entered manually.'],
      bouw: [['Client portal', 'Clients upload and see what’s still missing.'], ['Checklists and reminders', 'Per client and per period, automatically.'], ['AI document recognition', 'Type, date and amount prepared; a staff member checks.'], ['Deadline overview', 'Status per client for the whole firm.']] },
  }, ['gids-ai', 'gids-avg']),

  sector('sector-ingenieurs', { nl: 'sectoren/ingenieurs-en-keuringsbureaus', fr: 'secteurs/bureaux-etudes-et-controle', en: 'industries/engineering-and-inspection' }, {
    nl: { kort: 'Ingenieurs- en keuringsbureaus', h1: 'Software voor ingenieurs- en keuringsbureaus', lead: 'Dossiers per klant, locatie en installatie, een inspectie-app die een rapportconcept maakt, en herinneringen voor vervaldata.',
      mis: ['Rapporten worden vanuit een oud document opnieuw opgesteld, met oude gegevens erin.', 'Veldnotities en foto’s moeten later in het rapport overgezet worden.', 'Vervaldata van keuringen worden met de hand opgevolgd.', 'Klanten vragen opnieuw naar documenten die al verstuurd zijn.'],
      bouw: [['Dossiersysteem', 'Per klant, locatie en installatie, met alle geschiedenis.'], ['Inspectie-app', 'Jouw checklists, foto’s en opmerkingen worden een rapportconcept.'], ['Rapportsjablonen', 'In je huisstijl: de inspecteur vult in en maakt niet op.'], ['Klantportaal', 'Klanten downloaden zelf rapporten en attesten.']] },
    fr: { kort: 'Bureaux d’études et de contrôle', h1: 'Logiciel pour bureaux d’études et organismes de contrôle', lead: 'Des dossiers par client, site et installation, une application d’inspection qui prépare le rapport, et des rappels d’échéance.',
      mis: ['Les rapports partent d’un ancien document, avec le risque d’y laisser d’anciennes données.', 'Notes de terrain et photos doivent ensuite être reportées dans le rapport.', 'Les échéances des contrôles sont suivies à la main.', 'Les clients redemandent des documents déjà envoyés.'],
      bouw: [['Système de dossiers', 'Par client, site et installation, avec tout l’historique.'], ['Application d’inspection', 'Vos checklists, photos et remarques deviennent un projet de rapport.'], ['Modèles de rapport', 'À vos couleurs : l’inspecteur remplit, sans mettre en page.'], ['Portail client', 'Les clients téléchargent eux-mêmes rapports et attestations.']] },
    en: { kort: 'Engineering and inspection', h1: 'Software for engineering and inspection firms', lead: 'Files per client, site and installation, an inspection app that drafts the report, and expiry reminders.',
      mis: ['Reports start from an old document, risking old data left in.', 'Field notes and photos have to be copied into the report later.', 'Inspection expiry dates are tracked by hand.', 'Clients ask again for documents that were already sent.'],
      bouw: [['File system', 'Per client, site and installation, with full history.'], ['Inspection app', 'Your checklists, photos and notes become a draft report.'], ['Report templates', 'In your branding: the inspector fills in, no formatting.'], ['Client portal', 'Clients download reports and certificates themselves.']] },
  }, ['gids-platform', 'gids-maatwerk']),

  sector('sector-logistiek', { nl: 'sectoren/logistiek', fr: 'secteurs/logistique', en: 'industries/logistics' }, {
    nl: { kort: 'Logistiek en transport', h1: 'Software voor logistiek en transport', lead: 'Ritplanning, een chauffeursapp met bewijs van levering, en facturatie die niet op papier wacht.',
      mis: ['De ritplanning wordt elke ochtend opnieuw in een spreadsheet gemaakt.', 'Leverbonnen komen als foto binnen en worden overgetikt.', 'Klanten vragen waar hun zending is en het kantoor moet de chauffeur bellen.', 'Facturatie vertraagt omdat documenten laat binnenkomen.'],
      bouw: [['Planning', 'Ritten, voertuigen en chauffeurs samen, eenvoudig aan te passen.'], ['Chauffeursapp', 'Afvinken, foto en handtekening, afwijkingen melden.'], ['Status voor klanten', 'Een portaal of automatische berichten.'], ['Koppeling met facturatie', 'Een afgeleverde rit wordt een factuurvoorstel.']] },
    fr: { kort: 'Logistique et transport', h1: 'Logiciel pour la logistique et le transport', lead: 'Planning des tournées, application chauffeur avec preuve de livraison, et une facturation qui n’attend plus le papier.',
      mis: ['Le planning des tournées est refait chaque matin dans un tableur.', 'Les bons de livraison arrivent en photo et sont ressaisis.', 'Les clients demandent où est leur envoi et le bureau doit appeler le chauffeur.', 'La facturation traîne parce que les documents arrivent tard.'],
      bouw: [['Planning', 'Tournées, véhicules et chauffeurs réunis, faciles à ajuster.'], ['Application chauffeur', 'Cocher, photo et signature, signaler les anomalies.'], ['Statut pour les clients', 'Un portail ou des messages automatiques.'], ['Lien avec la facturation', 'Une tournée livrée devient une proposition de facture.']] },
    en: { kort: 'Logistics and transport', h1: 'Software for logistics and transport', lead: 'Route planning, a driver app with proof of delivery, and invoicing that no longer waits for paper.',
      mis: ['The route plan is rebuilt in a spreadsheet every morning.', 'Delivery notes arrive as photos and are retyped.', 'Customers ask where their shipment is and the office has to call the driver.', 'Invoicing is slow because documents arrive late.'],
      bouw: [['Planning', 'Routes, vehicles and drivers together, easy to adjust.'], ['Driver app', 'Tick off, photo and signature, report exceptions.'], ['Status for customers', 'A portal or automatic messages.'], ['Link with invoicing', 'A delivered route becomes a draft invoice.']] },
  }, ['gids-koppelingen', 'gids-platform']),

  sector('sector-productie', { nl: 'sectoren/productiebedrijven', fr: 'secteurs/production', en: 'industries/manufacturing' }, {
    nl: { kort: 'Productiebedrijven', h1: 'Software voor productiebedrijven', lead: 'Orders van offerte tot levering in één overzicht, met een scherm voor de werkplaats en registratie van tijd en materiaal.',
      mis: ['Een order bestaat als mail, Excel-lijn en papieren werkorder, telkens anders.', 'Op de werkvloer weet niet iedereen wat voorrang heeft.', 'Tijd en materiaal per order worden achteraf geschat.', 'Het kantoor kan niet snel zeggen wanneer een order klaar is.'],
      bouw: [['Orderoverzicht', 'Van offerte tot levering één gedeelde waarheid.'], ['Werkplaatsscherm', 'De werkorders van vandaag, in de juiste volgorde.'], ['Registratie', 'Tijd, materiaal en kwaliteitspunten door de medewerker zelf.'], ['Koppeling met boekhouding of ERP', 'Voor facturatie en voorraad.']] },
    fr: { kort: 'Production', h1: 'Logiciel pour entreprises de production', lead: 'Les commandes du devis à la livraison dans une seule vue, avec un écran pour l’atelier et l’enregistrement du temps et du matériel.',
      mis: ['Une commande existe en e-mail, en ligne Excel et en ordre de travail papier, chaque fois différente.', 'À l’atelier, tout le monde ne sait pas ce qui est prioritaire.', 'Temps et matériel par commande sont estimés après coup.', 'Le bureau ne peut pas dire rapidement quand une commande sera prête.'],
      bouw: [['Vue des commandes', 'Du devis à la livraison, une seule version partagée.'], ['Écran d’atelier', 'Les ordres de travail du jour, dans le bon ordre.'], ['Enregistrement', 'Temps, matériel et contrôles qualité saisis par le collaborateur.'], ['Lien avec comptabilité ou ERP', 'Pour la facturation et le stock.']] },
    en: { kort: 'Manufacturing', h1: 'Software for manufacturers', lead: 'Orders from quote to delivery in one overview, with a shop-floor screen and time and material tracking.',
      mis: ['An order exists as an email, a spreadsheet row and a paper work order, each slightly different.', 'Not everyone on the floor knows what has priority.', 'Time and material per order are estimated afterwards.', 'The office can’t quickly say when an order will be ready.'],
      bouw: [['Order overview', 'One shared version from quote to delivery.'], ['Shop-floor screen', 'Today’s work orders, in the right order.'], ['Tracking', 'Time, material and quality checks entered by the worker.'], ['Link with accounting or ERP', 'For invoicing and stock.']] },
  }, ['gids-platform', 'gids-koppelingen']),
];

const overzicht = {
  sleutel: 'sectoren',
  slug: { nl: 'sectoren', fr: 'secteurs', en: 'industries' },
  nl: { kort: 'Sectoren', title: 'Sectoren: software op maat per bedrijfstak | PlatforMaat', description: 'Wat er per sector vaak misloopt en wat we kunnen bouwen: installateurs, bouwafwerking, groothandel, horeca, boekhouding, logistiek, productie en meer.', h1: 'Per sector', lead: 'Elke sector heeft zijn eigen vastlopers. Kies de jouwe.', blokken: [{ type: 'links', h2: 'Sectoren', items: sectoren.map((s) => [s.sleutel, s.nl.lead]) }, { type: 'tekst', p: [T.nl.ander] }] },
  fr: { kort: 'Secteurs', title: 'Secteurs : logiciel sur mesure par métier | PlatforMaat', description: 'Ce qui coince souvent dans chaque secteur et ce que nous pouvons développer : installateurs, finitions, grossistes, horeca, fiduciaires, logistique, production et plus.', h1: 'Par secteur', lead: 'Chaque secteur a ses propres points de blocage. Choisissez le vôtre.', blokken: [{ type: 'links', h2: 'Secteurs', items: sectoren.map((s) => [s.sleutel, s.fr.lead]) }, { type: 'tekst', p: [T.fr.ander] }] },
  en: { kort: 'Industries', title: 'Industries: custom software by sector | PlatforMaat', description: 'What often goes wrong in each industry and what we can build: installers, finishing trades, wholesale, hospitality, accounting, logistics, manufacturing and more.', h1: 'By industry', lead: 'Every industry has its own sticking points. Pick yours.', blokken: [{ type: 'links', h2: 'Industries', items: sectoren.map((s) => [s.sleutel, s.en.lead]) }, { type: 'tekst', p: [T.en.ander] }] },
};

export default [overzicht, ...sectoren];
