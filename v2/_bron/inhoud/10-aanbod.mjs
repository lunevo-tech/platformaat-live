// Aanbod: overzicht en zes diensten. NL = je-vorm, FR = vous (Wallonie/Bruxelles), EN = international.
const dienst = (sleutel, slug, nl, fr, en) => ({ sleutel, ouder: 'aanbod', slug, nl, fr, en });

export default [
  {
    sleutel: 'aanbod',
    slug: { nl: 'aanbod', fr: 'services', en: 'services' },
    nl: {
      kort: 'Aanbod', title: 'Aanbod: software, websites, koppelingen en AI | PlatforMaat',
      description: 'Maatwerksoftware, websites en webshops, koppelingen, AI, advies en onderhoud voor kmo’s in België. Elk onderdeel apart of samen.',
      h1: 'Wat we bouwen',
      lead: 'Zes onderdelen. Je kiest er één, of we combineren ze tot één systeem.',
      blokken: [
        { type: 'links', h2: 'Kies een onderdeel', items: [
          ['maatwerk', 'Offertes, planning, werkbonnen of een klantenportaal, gebouwd rond je werkwijze.'],
          ['websites', 'Bedrijfssites, webshops en apps die op gsm net zo goed werken.'],
          ['koppelingen', 'Je pakketten laten samenwerken, zodat niemand nog overtypt.'],
          ['ai', 'Mails en documenten laten voorbereiden, met een mens die controleert.'],
          ['advies', 'Eerst uitzoeken wat nodig is, met schetsen en een klikbaar prototype.'],
          ['onderhoud', 'Hosting in de EU, updates, back-ups en kleine aanpassingen.'],
        ] },
        { type: 'tekst', h2: 'Waar je op kunt rekenen', p: [
          'Elk project start klein, met een vaste prijs. Je gegevens blijven van jou. Bij maatwerk dat voor jou gebouwd is, krijg je ook de code en de documentatie.',
          'Lees verder bij [Prijzen](prijzen) of [Werkwijze](werkwijze).',
        ] },
      ],
    },
    fr: {
      kort: 'Services', title: 'Services : logiciels, sites web, connexions et IA | PlatforMaat',
      description: 'Logiciels sur mesure, sites web et boutiques en ligne, connexions entre logiciels, IA, conseil et maintenance pour les PME en Belgique.',
      h1: 'Ce que nous réalisons',
      lead: 'Six domaines. Vous en choisissez un, ou nous les assemblons en un seul outil.',
      blokken: [
        { type: 'links', h2: 'Choisissez un domaine', items: [
          ['maatwerk', 'Devis, planning, bons d’intervention ou portail client, pensés autour de votre façon de travailler.'],
          ['websites', 'Sites d’entreprise, boutiques en ligne et applications, aussi efficaces sur mobile.'],
          ['koppelingen', 'Vos logiciels échangent leurs données. Fini la ressaisie.'],
          ['ai', 'E-mails et documents préparés par l’IA, toujours vérifiés par une personne.'],
          ['advies', 'Définir d’abord le besoin réel, avec des maquettes et un prototype cliquable.'],
          ['onderhoud', 'Hébergement dans l’UE, mises à jour, sauvegardes et petites adaptations.'],
        ] },
        { type: 'tekst', h2: 'Ce sur quoi vous pouvez compter', p: [
          'Chaque projet commence petit, à prix fixe. Vos données restent les vôtres. Pour un développement réalisé spécialement pour vous, le code et la documentation vous reviennent aussi.',
          'Pour aller plus loin : [Tarifs](prijzen) ou [Méthode](werkwijze).',
        ] },
      ],
    },
    en: {
      kort: 'Services', title: 'Services: software, websites, integrations and AI | PlatforMaat',
      description: 'Custom software, websites and online shops, integrations, AI, advice and maintenance for small businesses in Belgium.',
      h1: 'What we build',
      lead: 'Six areas. Pick one, or we combine them into a single system.',
      blokken: [
        { type: 'links', h2: 'Choose an area', items: [
          ['maatwerk', 'Quotes, scheduling, job sheets or a customer portal, shaped around how you work.'],
          ['websites', 'Company sites, online shops and apps that work just as well on a phone.'],
          ['koppelingen', 'Get your tools to share data, so nobody retypes anything.'],
          ['ai', 'Email and documents prepared by AI, always checked by a person.'],
          ['advies', 'Work out what you need first, with sketches and a clickable prototype.'],
          ['onderhoud', 'EU hosting, updates, backups and small changes.'],
        ] },
        { type: 'tekst', h2: 'What you can count on', p: [
          'Every project starts small, at a fixed price. Your data stays yours. For software built specifically for you, the code and documentation are yours too.',
          'Read on: [Pricing](prijzen) or [How it works](werkwijze).',
        ] },
      ],
    },
  },

  dienst('maatwerk', { nl: 'aanbod/maatwerksoftware', fr: 'services/logiciel-sur-mesure', en: 'services/custom-software' },
    {
      kort: 'Maatwerksoftware en portalen', title: 'Maatwerksoftware en portalen voor kmo’s | PlatforMaat',
      description: 'Een eigen systeem voor offertes, planning, werkbonnen of klanten, gebouwd rond hoe jouw team werkt. Vaste prijs, code en gegevens van jou.',
      h1: 'Maatwerksoftware en portalen',
      lead: 'Als geen standaardpakket past bij hoe je werkt, bouwen we het stuk dat ontbreekt.',
      blokken: [
        { type: 'items', h2: 'Waarvoor je het gebruikt', items: [
          ['Offertes en werkbonnen', 'Prijzen uit één lijst, een offerte als pdf, en een werkbon die de technieker op zijn gsm invult.'],
          ['Planning', 'Wie gaat waar naartoe, met welk materiaal. Iedereen ziet dezelfde planning.'],
          ['Klantenportaal', 'Klanten volgen zelf hun aanvraag, documenten en facturen, zonder te bellen.'],
          ['Intern platform', 'Eén plek voor wat nu in Excel, mailboxen en schriftjes zit.'],
        ] },
        { type: 'lijst', h2: 'Zo houden we het beheersbaar', items: [
          'We beginnen met één werkproces dat vastloopt, niet met alles tegelijk.',
          'Je probeert elke stap uit voor de volgende begint.',
          'Rollen en rechten: elke medewerker ziet wat hij nodig heeft.',
          'De code en de gegevens staan op jouw naam, met documentatie.',
        ] },
        { type: 'links', h2: 'Hangt samen met', items: [['koppelingen', 'Je software praat met je boekhouding en agenda.'], ['advies', 'Elk maatwerk begint met een plan.'], ['onderhoud', 'Na de oplevering blijft het werken.']] },
      ],
    },
    {
      kort: 'Logiciel sur mesure et portails', title: 'Logiciel sur mesure et portails pour PME | PlatforMaat',
      description: 'Votre propre outil pour les devis, le planning, les bons d’intervention ou le suivi client, pensé autour de votre équipe. Prix fixe, code et données à vous.',
      h1: 'Logiciel sur mesure et portails',
      lead: 'Quand aucun logiciel standard ne colle à votre façon de travailler, nous développons la pièce qui manque.',
      blokken: [
        { type: 'items', h2: 'À quoi il sert', items: [
          ['Devis et bons d’intervention', 'Les prix d’une seule liste, un devis en PDF, et un bon que le technicien remplit sur son téléphone.'],
          ['Planning', 'Qui va où, avec quel matériel. Tout le monde voit le même planning.'],
          ['Portail client', 'Vos clients suivent eux-mêmes leur demande, leurs documents et leurs factures, sans devoir appeler.'],
          ['Plateforme interne', 'Un seul endroit pour ce qui traîne aujourd’hui dans Excel, les boîtes mail et les carnets.'],
        ] },
        { type: 'lijst', h2: 'Comment nous gardons le projet maîtrisable', items: [
          'Nous commençons par un seul processus qui bloque, pas par tout à la fois.',
          'Vous testez chaque étape avant de passer à la suivante.',
          'Rôles et droits : chaque collaborateur voit ce dont il a besoin.',
          'Le code et les données sont à votre nom, avec la documentation.',
        ] },
        { type: 'links', h2: 'Voir aussi', items: [['koppelingen', 'Votre logiciel dialogue avec votre comptabilité et votre agenda.'], ['advies', 'Tout sur-mesure commence par un plan.'], ['onderhoud', 'Après la livraison, tout continue de fonctionner.']] },
      ],
    },
    {
      kort: 'Custom software and portals', title: 'Custom software and portals for small businesses | PlatforMaat',
      description: 'Your own system for quotes, scheduling, job sheets or customers, built around how your team works. Fixed price, code and data stay yours.',
      h1: 'Custom software and portals',
      lead: 'When no off-the-shelf package fits the way you work, we build the missing piece.',
      blokken: [
        { type: 'items', h2: 'What it’s for', items: [
          ['Quotes and job sheets', 'Prices from one list, a quote as a PDF, and a job sheet the technician fills in on a phone.'],
          ['Scheduling', 'Who goes where, with which materials. Everyone sees the same schedule.'],
          ['Customer portal', 'Customers follow their request, documents and invoices themselves, without calling.'],
          ['Internal platform', 'One place for what now lives in spreadsheets, inboxes and notebooks.'],
        ] },
        { type: 'lijst', h2: 'How we keep it manageable', items: [
          'We start with one process that keeps getting stuck, not everything at once.',
          'You try out each step before the next one starts.',
          'Roles and permissions: each person sees what they need.',
          'Code and data are in your name, with documentation.',
        ] },
        { type: 'links', h2: 'Related', items: [['koppelingen', 'Your software talks to your accounting and calendar.'], ['advies', 'Every custom build starts with a plan.'], ['onderhoud', 'It keeps working after delivery.']] },
      ],
    }),

  dienst('websites', { nl: 'aanbod/websites-webshops-apps', fr: 'services/sites-web-boutiques-applications', en: 'services/websites-shops-apps' },
    {
      kort: 'Websites, webshops en apps', title: 'Websites, webshops en apps voor kmo’s | PlatforMaat',
      description: 'Bedrijfswebsites, webshops en apps die snel laden, goed werken op gsm en die je zelf kunt bijwerken. Domein en teksten op jouw naam.',
      h1: 'Websites, webshops en apps',
      lead: 'Een site of app die vertrouwen geeft en je een telefoontje of aanvraag oplevert.',
      blokken: [
        { type: 'items', h2: 'Wat we maken', items: [
          ['Bedrijfswebsite', 'Snel, goed leesbaar op gsm, vindbaar in Google, en je past zelf de teksten aan.'],
          ['Webshop', 'Producten tonen, bestellen en betalen, gekoppeld aan je voorraad of boekhouding als dat nodig is.'],
          ['App voor klanten of team', 'Voor één afgebakend proces, zoals afspraken, bestellingen of werkbonnen onderweg.'],
        ] },
        { type: 'lijst', h2: 'Altijd inbegrepen', items: [
          'Domeinnaam, teksten en code op jouw naam.',
          'Toegankelijk en snel, ook op een trage verbinding.',
          'Geen cookies die toestemming vragen, tenzij je dat zelf wilt.',
        ] },
        { type: 'links', h2: 'Hangt samen met', items: [['prijzen', 'Websitepakketten vanaf € 790.'], ['onderhoud', 'Hosting, e-mail en updates.'], ['koppelingen', 'Een webshop die met je pakketten praat.']] },
      ],
    },
    {
      kort: 'Sites web, boutiques et applications', title: 'Sites web, boutiques en ligne et applications pour PME | PlatforMaat',
      description: 'Sites d’entreprise, boutiques en ligne et applications rapides, efficaces sur mobile et que vous mettez à jour vous-même. Domaine et textes à votre nom.',
      h1: 'Sites web, boutiques et applications',
      lead: 'Un site ou une application qui inspire confiance et vous amène des appels ou des demandes.',
      blokken: [
        { type: 'items', h2: 'Ce que nous réalisons', items: [
          ['Site d’entreprise', 'Rapide, lisible sur mobile, trouvable sur Google, et vous modifiez les textes vous-même.'],
          ['Boutique en ligne', 'Présenter, commander et payer, relié à votre stock ou à votre comptabilité si nécessaire.'],
          ['Application pour clients ou équipe', 'Pour un processus bien délimité : rendez-vous, commandes ou bons d’intervention sur le terrain.'],
        ] },
        { type: 'lijst', h2: 'Toujours compris', items: [
          'Nom de domaine, textes et code à votre nom.',
          'Accessible et rapide, même avec une connexion lente.',
          'Aucun cookie soumis à consentement, sauf si vous le souhaitez.',
        ] },
        { type: 'links', h2: 'Voir aussi', items: [['prijzen', 'Sites web à partir de 790 €.'], ['onderhoud', 'Hébergement, e-mail et mises à jour.'], ['koppelingen', 'Une boutique reliée à vos logiciels.']] },
      ],
    },
    {
      kort: 'Websites, shops and apps', title: 'Websites, online shops and apps for small businesses | PlatforMaat',
      description: 'Company websites, online shops and apps that load fast, work well on phones and that you can update yourself. Domain and content in your name.',
      h1: 'Websites, shops and apps',
      lead: 'A site or app that earns trust and brings in calls and enquiries.',
      blokken: [
        { type: 'items', h2: 'What we make', items: [
          ['Company website', 'Fast, easy to read on a phone, findable on Google, and you edit the text yourself.'],
          ['Online shop', 'Show, order and pay, linked to your stock or accounting where needed.'],
          ['App for customers or staff', 'For one clearly scoped process, such as bookings, orders or job sheets on the road.'],
        ] },
        { type: 'lijst', h2: 'Always included', items: [
          'Domain name, content and code in your name.',
          'Accessible and fast, even on a slow connection.',
          'No consent-requiring cookies unless you want them.',
        ] },
        { type: 'links', h2: 'Related', items: [['prijzen', 'Website packages from €790.'], ['onderhoud', 'Hosting, email and updates.'], ['koppelingen', 'A shop that talks to your other tools.']] },
      ],
    }),

  dienst('koppelingen', { nl: 'aanbod/koppelingen', fr: 'services/connexions', en: 'services/integrations' },
    {
      kort: 'Koppelingen en data', title: 'Koppelingen tussen je pakketten en dashboards | PlatforMaat',
      description: 'Boekhouding, mailbox, webshop en agenda laten samenwerken, zodat gegevens maar één keer ingevoerd worden. Met dashboards en migraties.',
      h1: 'Koppelingen, automatisering en data',
      lead: 'Wat je pakketten niet samen doen, verbinden we. Gegevens voer je dan maar één keer in.',
      blokken: [
        { type: 'items', h2: 'Wat dat oplevert', items: [
          ['Pakketten die samenwerken', 'Een bestelling in de webshop wordt een factuur in de boekhouding en een levering in de agenda.'],
          ['Dashboards en rapporten', 'Cijfers uit verschillende bronnen op één scherm, zonder zoeken.'],
          ['Gegevens verhuizen', 'Naar een nieuw systeem, met een controle achteraf op wat is overgenomen.'],
        ] },
        { type: 'tekst', h2: 'Een mens houdt het overzicht', p: ['Wat een koppeling automatisch doorstuurt, kun je nakijken. Loopt er iets mis, dan krijg je een melding in plaats van stille fouten.', 'Meer uitleg in de gids over [koppelingen tussen pakketten](gids-koppelingen).'] },
        { type: 'links', h2: 'Hangt samen met', items: [['maatwerk', 'Koppelingen horen vaak bij maatwerk.'], ['ai', 'AI leest gegevens uit en stelt voor.'], ['onderhoud', 'Een koppeling moet bijgehouden worden.']] },
      ],
    },
    {
      kort: 'Connexions et données', title: 'Connexions entre logiciels et tableaux de bord | PlatforMaat',
      description: 'Comptabilité, boîte mail, boutique et agenda qui échangent leurs données : on encode une seule fois. Tableaux de bord et migrations inclus.',
      h1: 'Connexions, automatisation et données',
      lead: 'Ce que vos logiciels ne font pas ensemble, nous le relions. Vous n’encodez plus qu’une fois.',
      blokken: [
        { type: 'items', h2: 'Ce que cela apporte', items: [
          ['Des logiciels qui collaborent', 'Une commande sur la boutique devient une facture en comptabilité et une livraison dans l’agenda.'],
          ['Tableaux de bord et rapports', 'Les chiffres de plusieurs sources sur un seul écran, sans chercher.'],
          ['Migration des données', 'Vers un nouveau système, avec un contrôle de ce qui a été repris.'],
        ] },
        { type: 'tekst', h2: 'Une personne garde la main', p: ['Ce qu’une connexion transmet automatiquement reste vérifiable. En cas de problème, vous recevez une alerte au lieu d’erreurs silencieuses.', 'Plus d’explications dans le guide sur les [connexions entre logiciels](gids-koppelingen).'] },
        { type: 'links', h2: 'Voir aussi', items: [['maatwerk', 'Les connexions accompagnent souvent le sur-mesure.'], ['ai', 'L’IA lit les données et fait des propositions.'], ['onderhoud', 'Une connexion doit être entretenue.']] },
      ],
    },
    {
      kort: 'Integrations and data', title: 'Integrations between your tools and dashboards | PlatforMaat',
      description: 'Accounting, inbox, online shop and calendar sharing data, so everything is entered once. Including dashboards and data migrations.',
      h1: 'Integrations, automation and data',
      lead: 'Where your tools don’t work together, we connect them. You enter data once.',
      blokken: [
        { type: 'items', h2: 'What you get', items: [
          ['Tools that cooperate', 'An order in your shop becomes an invoice in accounting and a delivery in the calendar.'],
          ['Dashboards and reports', 'Figures from several sources on one screen, without hunting for them.'],
          ['Data migration', 'To a new system, with a check afterwards on what was carried over.'],
        ] },
        { type: 'tekst', h2: 'A person stays in control', p: ['Whatever an integration passes on automatically can be checked. If something fails, you get an alert instead of silent errors.', 'More in the guide on [integrations between tools](gids-koppelingen).'] },
        { type: 'links', h2: 'Related', items: [['maatwerk', 'Integrations often come with custom software.'], ['ai', 'AI reads data and makes suggestions.'], ['onderhoud', 'Integrations need upkeep.']] },
      ],
    }),

  dienst('ai', { nl: 'aanbod/ai', fr: 'services/ia', en: 'services/ai' },
    {
      kort: 'AI die werk overneemt', title: 'AI in je kmo, met een mens die controleert | PlatforMaat',
      description: 'AI-assistenten en automatisering die mails en documenten voorbereiden. Je ziet altijd dat het een AI is en een mens keurt goed.',
      h1: 'AI die werk uit handen neemt',
      lead: 'AI als assistent, als automatisering of ingebouwd in wat je al gebruikt. Met een concreet doel voorop.',
      blokken: [
        { type: 'items', h2: 'Waar het helpt', items: [
          ['Assistent voor klanten of team', 'Met een functienaam en zonder gezicht. Er staat altijd bij dat het een AI is.'],
          ['Mails en documenten voorbereiden', 'Uitlezen, sorteren en een concept klaarzetten. Een mens keurt goed voor er iets vertrekt.'],
          ['Ingebouwd in je software', 'In de pakketten die je al hebt, in plaats van nog een nieuw programma.'],
        ] },
        { type: 'lijst', h2: 'Onze regels voor AI', items: [
          'Je ziet altijd wanneer je met een AI werkt, zoals de AI-verordening vraagt.',
          'Een mens controleert wat de AI uitleest of voorstelt.',
          'Geen nagemaakte stemmen of gezichten zonder schriftelijke toestemming.',
          'We kijken eerst of AI echt de beste oplossing is.',
        ] },
        { type: 'links', h2: 'Lees ook', items: [['gids-ai', 'Wat AI vandaag in een kmo kan en wat niet.'], ['advies', 'Eerst nagaan of AI hier helpt.']] },
      ],
    },
    {
      kort: 'IA qui vous décharge', title: 'L’IA dans votre PME, toujours vérifiée par une personne | PlatforMaat',
      description: 'Assistants IA et automatisations qui préparent e-mails et documents. Vous voyez toujours qu’il s’agit d’une IA, et une personne valide.',
      h1: 'Une IA qui vous décharge',
      lead: 'L’IA comme assistant, comme automatisation ou intégrée à vos outils. Avec un objectif concret au départ.',
      blokken: [
        { type: 'items', h2: 'Où elle est utile', items: [
          ['Assistant pour vos clients ou votre équipe', 'Avec un nom de fonction et sans visage. Il est toujours indiqué qu’il s’agit d’une IA.'],
          ['Préparer e-mails et documents', 'Lire, trier et préparer un projet. Une personne valide avant tout envoi.'],
          ['Intégrée à vos logiciels', 'Dans les outils que vous utilisez déjà, plutôt qu’un programme de plus.'],
        ] },
        { type: 'lijst', h2: 'Nos règles pour l’IA', items: [
          'Vous savez toujours quand vous utilisez une IA, comme le demande le règlement européen sur l’IA.',
          'Une personne vérifie ce que l’IA lit ou propose.',
          'Pas de voix ni de visage imités sans accord écrit.',
          'Nous vérifions d’abord si l’IA est vraiment la meilleure solution.',
        ] },
        { type: 'links', h2: 'À lire aussi', items: [['gids-ai', 'Ce que l’IA peut faire aujourd’hui dans une PME, et ce qu’elle ne peut pas.'], ['advies', 'Vérifier d’abord si l’IA aide vraiment.']] },
      ],
    },
    {
      kort: 'AI that takes work off your plate', title: 'AI for small businesses, always checked by a person | PlatforMaat',
      description: 'AI assistants and automation that prepare email and documents. You always know it is AI, and a person approves.',
      h1: 'AI that takes work off your plate',
      lead: 'AI as an assistant, as automation or built into tools you already use. Always with a concrete goal.',
      blokken: [
        { type: 'items', h2: 'Where it helps', items: [
          ['Assistant for customers or staff', 'With a job title and no face. It always says it is an AI.'],
          ['Preparing email and documents', 'Reading, sorting and drafting. A person approves before anything goes out.'],
          ['Built into your software', 'Inside the tools you already have, instead of yet another program.'],
        ] },
        { type: 'lijst', h2: 'Our rules for AI', items: [
          'You always know when you are dealing with AI, as the EU AI Act requires.',
          'A person checks what the AI reads or suggests.',
          'No imitated voices or faces without written consent.',
          'We first check whether AI is really the best answer.',
        ] },
        { type: 'links', h2: 'Read more', items: [['gids-ai', 'What AI can and can’t do in a small business today.'], ['advies', 'First check whether AI helps here.']] },
      ],
    }),

  dienst('advies', { nl: 'aanbod/advies-en-ontwerp', fr: 'services/conseil-et-conception', en: 'services/advice-and-design' },
    {
      kort: 'Advies en ontwerp', title: 'Advies, analyse en ontwerp voor je software | PlatforMaat',
      description: 'Eerst begrijpen, dan bouwen: je werkwijze in kaart, een eerlijk haalbaarheidsoordeel, schermontwerpen en een klikbaar prototype.',
      h1: 'Advies, analyse en ontwerp',
      lead: 'Voor we iets bouwen, kijken we samen wat er nu gebeurt en wat je echt nodig hebt. Soms is bouwen niet de beste weg, en dan zeggen we dat.',
      blokken: [
        { type: 'stappen', h2: 'Hoe dat verloopt', items: [
          ['Werkwijze in kaart', 'We volgen hoe het werk binnenkomt, wie het oppakt en waar het blijft hangen.'],
          ['Wat haalbaar is', 'Wat kan met software, koppelingen of AI, en wat beter anders.'],
          ['Ontwerp en prototype', 'Schermen in je huisstijl en een versie waarop je al kunt klikken.'],
        ] },
        { type: 'tekst', h2: 'Wat je in handen krijgt', p: ['Een afgebakend plan en een offerte met vaste prijs. De **proces-scan** (een halve dag samen kijken, met een rapport van drie snelle winsten) kost vanaf € 450 en is verrekenbaar bij een vervolgproject. Zie [Prijzen](prijzen).'] },
      ],
    },
    {
      kort: 'Conseil et conception', title: 'Conseil, analyse et conception de votre logiciel | PlatforMaat',
      description: 'Comprendre avant de développer : vos processus cartographiés, un avis honnête sur la faisabilité, des maquettes d’écrans et un prototype cliquable.',
      h1: 'Conseil, analyse et conception',
      lead: 'Avant de développer quoi que ce soit, nous regardons ensemble ce qui se passe aujourd’hui et ce dont vous avez vraiment besoin. Parfois, développer n’est pas la bonne voie, et nous vous le disons.',
      blokken: [
        { type: 'stappen', h2: 'Comment cela se passe', items: [
          ['Cartographier le travail', 'Nous suivons comment les demandes arrivent, qui les traite et où elles bloquent.'],
          ['Ce qui est faisable', 'Ce que permettent un logiciel, une connexion ou l’IA, et ce qui se règle mieux autrement.'],
          ['Maquettes et prototype', 'Des écrans à vos couleurs et une version sur laquelle vous pouvez déjà cliquer.'],
        ] },
        { type: 'tekst', h2: 'Ce que vous recevez', p: ['Un plan délimité et une offre à prix fixe. Le **scan de processus** (une demi-journée ensemble, avec un rapport de trois gains rapides) coûte à partir de 450 € et est déductible d’un projet ultérieur. Voir [Tarifs](prijzen).'] },
      ],
    },
    {
      kort: 'Advice and design', title: 'Advice, analysis and design for your software | PlatforMaat',
      description: 'Understand first, then build: your workflow mapped, an honest feasibility check, screen designs and a clickable prototype.',
      h1: 'Advice, analysis and design',
      lead: 'Before we build anything, we look together at what happens today and what you actually need. Sometimes building isn’t the answer, and we’ll tell you.',
      blokken: [
        { type: 'stappen', h2: 'How it goes', items: [
          ['Map the work', 'We follow how work comes in, who picks it up and where it gets stuck.'],
          ['What’s feasible', 'What software, integrations or AI can do, and what is better solved another way.'],
          ['Design and prototype', 'Screens in your branding and a version you can already click through.'],
        ] },
        { type: 'tekst', h2: 'What you get', p: ['A scoped plan and a fixed-price quote. The **process scan** (half a day together, with a report of three quick wins) starts at €450 and is credited against a follow-up project. See [Pricing](prijzen).'] },
      ],
    }),

  dienst('onderhoud', { nl: 'aanbod/onderhoud', fr: 'services/maintenance', en: 'services/maintenance' },
    {
      kort: 'Onderhoud', title: 'Hosting en onderhoud in de EU | PlatforMaat',
      description: 'Hosting in de EU vanaf € 29 per maand; met updates, back-ups en kleine wijzigingen vanaf € 59 per maand. Een optie, geen verplichting.',
      h1: 'Onderhoud en doorontwikkeling',
      lead: 'Na de oplevering blijft je software werken en veilig. Dat is een optie, geen verplichting.',
      blokken: [
        { type: 'items', h2: 'Wat erbij hoort', items: [
          ['Hosting in de EU', 'Vanaf € 29 per maand. Provider en regio staan in je offerte.'],
          ['Updates en back-ups', 'Met kleine wijzigingen vanaf € 59 per maand.'],
          ['Helpdesk en uitbreiding', 'Vragen, opleiding en nieuwe stukken, telkens met een vaste prijs.'],
        ] },
        { type: 'tekst', h2: 'Wat als je stopt?', p: ['Je gegevens kun je altijd exporteren. Bij maatwerk dat voor jou gebouwd is, gaat ook de code over, met documentatie en afspraken over toegang. Zo kan een andere ontwikkelaar het overnemen. Meer in de gids over [onderhoud en eigendom](gids-onderhoud).'] },
      ],
    },
    {
      kort: 'Maintenance', title: 'Hébergement et maintenance dans l’UE | PlatforMaat',
      description: 'Hébergement dans l’UE à partir de 29 € par mois ; avec mises à jour, sauvegardes et petites modifications à partir de 59 € par mois. Une option, pas une obligation.',
      h1: 'Maintenance et évolutions',
      lead: 'Après la livraison, votre logiciel reste fonctionnel et sûr. C’est une option, pas une obligation.',
      blokken: [
        { type: 'items', h2: 'Ce qui est compris', items: [
          ['Hébergement dans l’UE', 'À partir de 29 € par mois. Le fournisseur et la région figurent dans votre offre.'],
          ['Mises à jour et sauvegardes', 'Avec petites modifications, à partir de 59 € par mois.'],
          ['Support et évolutions', 'Questions, formation et nouvelles fonctions, chaque fois à prix fixe.'],
        ] },
        { type: 'tekst', h2: 'Et si vous arrêtez ?', p: ['Vous pouvez toujours exporter vos données. Pour un développement réalisé pour vous, le code vous revient aussi, avec la documentation et les accès. Un autre développeur peut ainsi reprendre le travail. Plus d’infos dans le guide [maintenance et propriété](gids-onderhoud).'] },
      ],
    },
    {
      kort: 'Maintenance', title: 'Hosting and maintenance in the EU | PlatforMaat',
      description: 'EU hosting from €29 a month; with updates, backups and small changes from €59 a month. An option, not an obligation.',
      h1: 'Maintenance and further development',
      lead: 'After delivery, your software keeps working and stays secure. It’s an option, not an obligation.',
      blokken: [
        { type: 'items', h2: 'What’s included', items: [
          ['EU hosting', 'From €29 a month. Provider and region are stated in your quote.'],
          ['Updates and backups', 'Including small changes, from €59 a month.'],
          ['Helpdesk and new features', 'Questions, training and new parts, each at a fixed price.'],
        ] },
        { type: 'tekst', h2: 'What if you stop?', p: ['You can always export your data. For software built for you, the code is handed over too, with documentation and access details, so another developer can take over. More in the guide on [maintenance and ownership](gids-onderhoud).'] },
      ],
    }),
];
