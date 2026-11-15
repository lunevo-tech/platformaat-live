// Kennis: overzicht en tien gidsen, in gewone taal. Geen echte klantnamen of klantcijfers (repo publiek).
function gids(sleutel, slug, talen) {
  const p = { sleutel, ouder: 'kennis', slug };
  for (const c of ['nl', 'fr', 'en']) {
    const x = talen[c];
    p[c] = { kort: x.kort, title: `${x.h1} | PlatforMaat`, description: x.lead.replace(/\[(.+?)\]\([a-z0-9-]+\)/g, '$1'), h1: x.h1, lead: x.lead, blokken: x.blokken };
  }
  return p;
}
const S = (h2, ...p) => ({ type: 'tekst', h2, p });
const L = (h2, ...items) => ({ type: 'lijst', h2, items });

const gidsen = [
  gids('gids-maatwerk', { nl: 'kennis/maatwerk-of-standaardsoftware', fr: 'ressources/sur-mesure-ou-standard', en: 'guides/custom-or-off-the-shelf' }, {
    nl: { kort: 'Maatwerk of standaard?', h1: 'Maatwerk of standaardsoftware: hoe kies je?', lead: 'Soms het één, soms het ander, en vaak een combinatie. Zo ga je het zelf na.', blokken: [
      L('Kies standaard als…', 'je werkwijze past bij wat het pakket doet;', 'je geen unieke stappen hebt die je onderscheiden;', 'je snel wilt starten met weinig eigen werk;', 'een abonnement per gebruiker goedkoper blijft dan zelf bouwen.'),
      L('Kies maatwerk als…', 'je medewerkers omwegen maken omdat het pakket tekortschiet;', 'je werkwijze je voordeel geeft en je ze niet wilt opgeven;', 'je gegevens uit verschillende pakketten met de hand samenbrengt;', 'je afhankelijk wordt van een leverancier die prijzen kan wijzigen.'),
      S('De tussenweg', 'Een pakket voor de boekhouding, een eigen toepassing voor wat uniek is, en [koppelingen](gids-koppelingen) ertussen. Vaak de verstandigste combinatie.', 'Schrijf de vijf stappen op die de meeste tijd kosten en kijk of je pakket ze ondersteunt. Ontbreken er veel, dan loont maatwerk of een combinatie.')] },
    fr: { kort: 'Sur-mesure ou standard ?', h1: 'Logiciel sur mesure ou standard : comment choisir ?', lead: 'Parfois l’un, parfois l’autre, et souvent les deux. Voici comment le vérifier vous-même.', blokken: [
      L('Choisissez le standard si…', 'votre façon de travailler correspond à ce que fait le logiciel ;', 'vous n’avez pas d’étapes uniques qui vous distinguent ;', 'vous voulez démarrer vite avec peu de développement ;', 'un abonnement par utilisateur reste moins cher qu’un développement.'),
      L('Choisissez le sur-mesure si…', 'vos collaborateurs contournent le logiciel parce qu’il ne suffit pas ;', 'votre méthode est un avantage que vous ne voulez pas abandonner ;', 'vous rassemblez à la main des données de plusieurs logiciels ;', 'vous dépendez d’un fournisseur qui peut changer ses prix.'),
      S('La voie du milieu', 'Un logiciel pour la comptabilité, une application propre pour ce qui est unique, et des [connexions](gids-koppelingen) entre les deux. C’est souvent la combinaison la plus sensée.', 'Notez les cinq étapes qui prennent le plus de temps et vérifiez si votre logiciel les couvre. S’il en manque beaucoup, le sur-mesure ou une combinaison vaut la peine.')] },
    en: { kort: 'Custom or off-the-shelf?', h1: 'Custom or off-the-shelf software: how to choose', lead: 'Sometimes one, sometimes the other, and often both. Here’s how to check for yourself.', blokken: [
      L('Choose off-the-shelf if…', 'the way you work matches what the package does;', 'you have no unique steps that set you apart;', 'you want to start quickly with little development;', 'a per-user subscription stays cheaper than building.'),
      L('Choose custom if…', 'your staff work around the package because it falls short;', 'your way of working is an advantage you don’t want to give up;', 'you combine data from several tools by hand;', 'you depend on a vendor who can change prices.'),
      S('The middle ground', 'A package for accounting, your own tool for what is unique, and [integrations](gids-koppelingen) in between. Often the most sensible mix.', 'Write down the five steps that take the most time and check whether your package supports them. If many are missing, custom or a mix pays off.')] },
  }),

  gids('gids-kosten', { nl: 'kennis/wat-kost-maatwerksoftware', fr: 'ressources/prix-logiciel-sur-mesure', en: 'guides/cost-of-custom-software' }, {
    nl: { kort: 'Wat kost maatwerk?', h1: 'Wat kost maatwerksoftware?', lead: 'Op [Prijzen](prijzen) staan vanafprijzen. Wat de uiteindelijke prijs bepaalt, en hoe je een eerlijke offerte herkent.', blokken: [
      L('Wat de prijs bepaalt', 'Het aantal schermen en stappen.', 'Hoeveel koppelingen nodig zijn en hoe goed de pakketten dat toelaten.', 'Of er gegevens uit een oud systeem over moeten.', 'Het aantal gebruikers en rechten.', 'Of er AI of rapportering bij komt.'),
      S('Betaalbaar houden', 'We beginnen met een klein, bruikbaar eerste deel. Je ziet de waarde voor je over het volgende deel beslist. Hosting en onderhoud staan apart in de offerte.'),
      L('Een eerlijke offerte…', 'zegt wat erin zit en wat niet;', 'noemt wie eigenaar is van code en gegevens;', 'legt uit wat er bij een wijziging gebeurt;', 'vermeldt hosting, onderhoud en licenties van derden.')] },
    fr: { kort: 'Combien coûte le sur-mesure ?', h1: 'Combien coûte un logiciel sur mesure ?', lead: 'La page [Tarifs](prijzen) donne des prix de départ. Voici ce qui détermine le prix final, et comment reconnaître une offre honnête.', blokken: [
      L('Ce qui détermine le prix', 'Le nombre d’écrans et d’étapes.', 'Le nombre de connexions nécessaires et ce que les logiciels permettent.', 'La reprise éventuelle de données d’un ancien système.', 'Le nombre d’utilisateurs et de droits.', 'L’ajout d’IA ou de rapports.'),
      S('Garder un coût raisonnable', 'Nous commençons par une première partie petite et utilisable. Vous en voyez la valeur avant de décider de la suite. Hébergement et maintenance figurent séparément dans l’offre.'),
      L('Une offre honnête…', 'dit ce qui est compris et ce qui ne l’est pas ;', 'précise à qui appartiennent le code et les données ;', 'explique ce qui se passe en cas de modification ;', 'mentionne l’hébergement, la maintenance et les licences de tiers.')] },
    en: { kort: 'What does custom cost?', h1: 'What does custom software cost?', lead: '[Pricing](prijzen) lists starting prices. Here’s what drives the final price, and how to spot an honest quote.', blokken: [
      L('What drives the price', 'The number of screens and steps.', 'How many integrations are needed and how well the tools allow them.', 'Whether data must move over from an old system.', 'The number of users and permissions.', 'Whether AI or reporting is added.'),
      S('Keeping it affordable', 'We start with a small, usable first part. You see the value before deciding on the next one. Hosting and maintenance are listed separately in the quote.'),
      L('An honest quote…', 'says what’s included and what isn’t;', 'names who owns the code and the data;', 'explains what happens when something changes;', 'lists hosting, maintenance and third-party licences.')] },
  }),

  gids('gids-project', { nl: 'kennis/hoe-verloopt-een-project', fr: 'ressources/deroulement-projet', en: 'guides/how-a-project-runs' }, {
    nl: { kort: 'Een project, stap voor stap', h1: 'Hoe verloopt een maatwerkproject?', lead: 'Wat er in elke stap gebeurt, en wat we van jou vragen.', blokken: [
      { type: 'stappen', h2: 'De stappen', items: [['Kennismaking', 'Wat loopt er mis? We zeggen eerlijk of en hoe we helpen.'], ['Analyse en plan', 'Wat eerst moet en wat kan wachten, met een vaste prijs.'], ['Ontwerp en prototype', 'Klikbare schermen voor er gebouwd wordt.'], ['Bouwen in kleine stappen', 'Een eerste deel dat je al gebruikt.'], ['Oplevering en uitleg', 'Software, gegevens en uitleg; bij maatwerk ook de code.'], ['Onderhoud', 'Updates en uitbreiding, als je dat wilt.']] },
      S('Wat we van jou vragen', 'Iemand die de werkwijze kent en tijd heeft om op prototypes te reageren. Zonder dat gaat het trager en minder goed.')] },
    fr: { kort: 'Un projet, étape par étape', h1: 'Comment se déroule un projet sur mesure ?', lead: 'Ce qui se passe à chaque étape, et ce que nous attendons de vous.', blokken: [
      { type: 'stappen', h2: 'Les étapes', items: [['Premier échange', 'Qu’est-ce qui coince ? Nous disons honnêtement si et comment nous pouvons aider.'], ['Analyse et plan', 'Ce qui vient d’abord et ce qui peut attendre, à prix fixe.'], ['Maquettes et prototype', 'Des écrans cliquables avant tout développement.'], ['Développement par petites étapes', 'Une première partie que vous utilisez déjà.'], ['Livraison et explications', 'Logiciel, données et explications ; pour le sur-mesure, le code aussi.'], ['Maintenance', 'Mises à jour et évolutions, si vous le souhaitez.']] },
      S('Ce que nous attendons de vous', 'Une personne qui connaît le fonctionnement et a le temps de réagir aux prototypes. Sans cela, le projet avance plus lentement et moins bien.')] },
    en: { kort: 'A project, step by step', h1: 'How does a custom software project run?', lead: 'What happens at each step, and what we ask of you.', blokken: [
      { type: 'stappen', h2: 'The steps', items: [['Intro', 'What’s going wrong? We say honestly whether and how we can help.'], ['Analysis and plan', 'What comes first and what can wait, at a fixed price.'], ['Design and prototype', 'Clickable screens before anything is built.'], ['Building in small steps', 'A first part you already use.'], ['Delivery and walkthrough', 'Software, data and explanation; for custom work, the code too.'], ['Maintenance', 'Updates and extensions, if you want them.']] },
      S('What we ask of you', 'Someone who knows how the work runs and has time to respond to prototypes. Without that, things go slower and less well.')] },
  }),

  gids('gids-koppelingen', { nl: 'kennis/koppelingen-tussen-pakketten', fr: 'ressources/connexions-entre-logiciels', en: 'guides/integrations-explained' }, {
    nl: { kort: 'Koppelingen uitgelegd', h1: 'Je pakketten laten samenwerken: koppelingen uitgelegd', lead: 'De meeste bedrijven gebruiken vier tot tien pakketten die niets van elkaar weten. Een koppeling lost dat op.', blokken: [
      S('Wat is een koppeling?', 'Software die gegevens van het ene pakket naar het andere brengt, volgens jouw regels. Een bestelling uit de webshop wordt een factuurvoorstel; een gesloten werkbon verandert de status bij de klant.'),
      L('Hoe het technisch kan', 'Via een interface (API) die het pakket aanbiedt.', 'Via een exportbestand dat op vaste tijden ingelezen wordt.', 'Soms via een bestaande tussenschakel.', 'Lukt het niet, dan zeggen we dat.'),
      S('Waar je op let', 'Elk pakket laat iets anders toe. Verandert de leverancier iets, dan moet de koppeling mee: daarom hoort ze bij [onderhoud](onderhoud). Een migratie naar een nieuw pakket is een eenmalige koppeling, en vaak meer werk dan men denkt.')] },
    fr: { kort: 'Les connexions expliquées', h1: 'Faire collaborer vos logiciels : les connexions expliquées', lead: 'La plupart des entreprises utilisent quatre à dix logiciels qui s’ignorent. Une connexion règle ce problème.', blokken: [
      S('Qu’est-ce qu’une connexion ?', 'Un programme qui transfère des données d’un logiciel à l’autre, selon vos règles. Une commande de la boutique devient une proposition de facture ; un bon clôturé met à jour le statut chez le client.'),
      L('Les possibilités techniques', 'Via une interface (API) proposée par le logiciel.', 'Via un fichier d’export lu à heures fixes.', 'Parfois via un service intermédiaire existant.', 'Si cela ne marche pas, nous le disons.'),
      S('Points d’attention', 'Chaque logiciel permet autre chose. Si l’éditeur change quelque chose, la connexion doit suivre : c’est pourquoi elle fait partie de la [maintenance](onderhoud). Une migration vers un nouveau logiciel est une connexion ponctuelle, souvent plus lourde qu’on ne le pense.')] },
    en: { kort: 'Integrations explained', h1: 'Getting your tools to work together: integrations explained', lead: 'Most companies use four to ten tools that know nothing about each other. An integration fixes that.', blokken: [
      S('What is an integration?', 'Software that moves data from one tool to another, following your rules. A shop order becomes a draft invoice; a closed job sheet updates the customer’s status.'),
      L('How it can work technically', 'Through an interface (API) the tool provides.', 'Through an export file read at set times.', 'Sometimes through an existing middleware service.', 'If none works, we tell you.'),
      S('What to watch', 'Each tool allows something different. When the vendor changes something, the integration must follow, which is why it belongs to [maintenance](onderhoud). Migrating to a new package is a one-off integration, often more work than expected.')] },
  }),

  gids('gids-offerte', { nl: 'kennis/offertes-automatiseren', fr: 'ressources/automatiser-les-devis', en: 'guides/automating-quotes' }, {
    nl: { kort: 'Offertes automatiseren', h1: 'Offertes automatiseren: wat kan en wat niet?', lead: 'Een offerte opmaken bestaat uit herhaalbare stappen. Daar valt het eenvoudigst tijd te winnen.', blokken: [
      S('Waar de tijd naartoe gaat', 'Zelden naar het nadenken over de prijs. Wel naar zoeken en overnemen: prijzen uit een lijst, een marge, teksten uit een oude offerte, de opmaak.'),
      L('Wat je kunt overnemen', 'Prijzen en kortingen uit één bron.', 'Standaardteksten en voorwaarden die je kiest in plaats van typt.', 'Opmaak in je huisstijl.', 'Opvolging: welke offertes wachten op antwoord.'),
      S('Wat een mens blijft doen', 'De inschatting van een bijzonder geval, de afweging bij een grote klant, en de laatste controle voor verzending.', 'Begin met één soort offerte. Schrijf op hoe je ze nu maakt en waar het misloopt. Reken eerst uit wat het je kost met de [besparingscalculator](calculator).')] },
    fr: { kort: 'Automatiser les devis', h1: 'Automatiser les devis : ce qui est possible et ce qui ne l’est pas', lead: 'Rédiger un devis, ce sont des étapes répétitives. C’est là qu’on gagne du temps le plus facilement.', blokken: [
      S('Où passe le temps', 'Rarement à réfléchir au prix. Plutôt à chercher et recopier : des prix d’une liste, une marge, des textes d’un ancien devis, la mise en page.'),
      L('Ce que vous pouvez automatiser', 'Prix et remises issus d’une seule source.', 'Textes et conditions types que l’on choisit au lieu de les taper.', 'Mise en page à vos couleurs.', 'Suivi : quels devis attendent une réponse.'),
      S('Ce qui reste humain', 'L’estimation d’un cas particulier, l’arbitrage pour un gros client et le dernier contrôle avant envoi.', 'Commencez par un seul type de devis. Notez comment vous le faites aujourd’hui et où ça coince. Calculez d’abord ce que cela vous coûte avec le [calculateur](calculator).')] },
    en: { kort: 'Automating quotes', h1: 'Automating quotes: what works and what doesn’t', lead: 'Writing a quote is made of repeatable steps. That’s where time is easiest to win back.', blokken: [
      S('Where the time goes', 'Rarely into thinking about the price. Mostly into looking up and copying: prices from a list, a margin, text from an old quote, the layout.'),
      L('What you can automate', 'Prices and discounts from one source.', 'Standard text and terms you pick instead of type.', 'Layout in your branding.', 'Follow-up: which quotes are awaiting a reply.'),
      S('What stays with a person', 'Judging an unusual case, weighing up a large client, and the final check before sending.', 'Start with one kind of quote. Write down how you make it today and where it goes wrong. First work out what it costs you with the [savings calculator](calculator).')] },
  }),

  gids('gids-platform', { nl: 'kennis/wat-is-een-intern-platform', fr: 'ressources/plateforme-interne', en: 'guides/internal-platform' }, {
    nl: { kort: 'Wat is een intern platform?', h1: 'Wat is een intern platform, en heb je er een nodig?', lead: 'Geen groot ERP en geen website, maar één toepassing voor je eigen team waarin het verspreide werk samenkomt.', blokken: [
      L('Wat het oplevert', 'Alles op één plek in plaats van verspreid.', 'Terugkerende taken die automatisch gebeuren.', 'Nieuwe medewerkers die sneller hun weg vinden.', 'Je past de werkwijze aan zonder op een leverancier te wachten.'),
      S('Wanneer het geen zin heeft', 'Als je met twee mensen werkt en alles in één pakket zit dat goed werkt. Een platform bouwen omdat het kan, is geen reden. Volstaat een pakket, dan zeggen we dat. Zie ook [maatwerk of standaard](gids-maatwerk).')] },
    fr: { kort: 'Qu’est-ce qu’une plateforme interne ?', h1: 'Qu’est-ce qu’une plateforme interne, et en avez-vous besoin ?', lead: 'Ni un gros ERP, ni un site web : une application pour votre équipe où se rassemble le travail aujourd’hui dispersé.', blokken: [
      L('Ce qu’elle apporte', 'Tout au même endroit au lieu d’être éparpillé.', 'Des tâches répétitives automatisées.', 'De nouveaux collaborateurs qui s’y retrouvent plus vite.', 'Vous adaptez votre méthode sans attendre un fournisseur.'),
      S('Quand ce n’est pas utile', 'Si vous êtes deux et que tout tient dans un logiciel qui fonctionne bien. Construire une plateforme parce qu’on le peut n’est pas une raison. Si un logiciel suffit, nous vous le disons. Voir aussi [sur-mesure ou standard](gids-maatwerk).')] },
    en: { kort: 'What is an internal platform?', h1: 'What is an internal platform, and do you need one?', lead: 'Not a big ERP and not a website: one tool for your own team where scattered work comes together.', blokken: [
      L('What it gives you', 'Everything in one place instead of scattered.', 'Recurring tasks that run automatically.', 'New staff who find their way faster.', 'You change how you work without waiting for a vendor.'),
      S('When it makes no sense', 'If you’re a team of two and everything sits in one package that works fine. Building a platform because you can is not a reason. If a package will do, we say so. See also [custom or off-the-shelf](gids-maatwerk).')] },
  }),

  gids('gids-website', { nl: 'kennis/website-platform-of-app', fr: 'ressources/site-plateforme-ou-application', en: 'guides/website-platform-or-app' }, {
    nl: { kort: 'Website, platform of app?', h1: 'Website, platform of app: wat heb je nodig?', lead: 'De woorden lopen door elkaar, maar ze zijn niet hetzelfde. Het hangt af van wie het gebruikt en waarvoor.', blokken: [
      { type: 'items', h2: 'Het verschil', items: [['Bedrijfswebsite', 'Voor wie je wil vinden en beoordelen. Snel, leesbaar op gsm, duidelijk.'], ['Webshop', 'Om online te kopen: betalingen, voorraad, verzending en consumentenregels.'], ['Webplatform of portaal', 'Voor een vaste groep die inlogt: team, klanten of leveranciers.'], ['Mobiele app', 'Voor wie onderweg werkt. Vaak volstaat een webtoepassing op de gsm, goedkoper en zonder app store.']] },
      S('Hoe kies je?', 'Begin bij de vraag: wie gebruikt het en wat moet die kunnen? Vaak is het een combinatie, zoals een goede website plus een klein portaal.')] },
    fr: { kort: 'Site, plateforme ou application ?', h1: 'Site web, plateforme ou application : de quoi avez-vous besoin ?', lead: 'Les mots se mélangent, mais ce n’est pas la même chose. Tout dépend de qui l’utilise et pour quoi faire.', blokken: [
      { type: 'items', h2: 'La différence', items: [['Site d’entreprise', 'Pour ceux qui veulent vous trouver et vous évaluer. Rapide, lisible sur mobile, clair.'], ['Boutique en ligne', 'Pour acheter en ligne : paiements, stock, livraison et règles de consommation.'], ['Plateforme web ou portail', 'Pour un groupe fixe qui se connecte : équipe, clients ou fournisseurs.'], ['Application mobile', 'Pour ceux qui travaillent sur le terrain. Souvent, une application web sur mobile suffit, moins chère et sans app store.']] },
      S('Comment choisir ?', 'Partez de la question : qui l’utilise et que doit-il pouvoir faire ? Souvent, c’est une combinaison, comme un bon site plus un petit portail.')] },
    en: { kort: 'Website, platform or app?', h1: 'Website, platform or app: what do you need?', lead: 'The words get mixed up, but they’re not the same. It depends on who uses it and for what.', blokken: [
      { type: 'items', h2: 'The difference', items: [['Company website', 'For people who want to find and assess you. Fast, readable on a phone, clear.'], ['Online shop', 'For buying online: payments, stock, shipping and consumer rules.'], ['Web platform or portal', 'For a fixed group that logs in: staff, customers or suppliers.'], ['Mobile app', 'For people on the move. A web app on the phone is often enough, cheaper and without an app store.']] },
      S('How to choose', 'Start with the question: who uses it and what must they be able to do? Often it’s a mix, like a good website plus a small portal.')] },
  }),

  gids('gids-onderhoud', { nl: 'kennis/onderhoud-en-eigendom', fr: 'ressources/maintenance-et-propriete', en: 'guides/maintenance-and-ownership' }, {
    nl: { kort: 'Onderhoud en eigendom', h1: 'Na de oplevering: onderhoud, eigendom en stoppen', lead: 'Software is nooit helemaal af. Wat er na de oplevering gebeurt, telt even zwaar als het bouwen.', blokken: [
      L('Van wie is wat?', 'Je gegevens zijn van jou en je kunt ze exporteren.', 'Bij maatwerk voor jou gaat ook de code naar jou.', 'Domeinnaam en teksten staan op jouw naam.', 'Onderdelen van derden blijven van die derde; dat staat in de offerte.'),
      S('Als je stopt, of als wij stoppen', 'Je neemt je gegevens en code mee, met documentatie. Je kunt zelf verder, een andere partij inschakelen of bij ons blijven. Zo verklein je de afhankelijkheid van één persoon. Een vervanger kunnen we niet garanderen, wel dat het overdraagbaar is.')] },
    fr: { kort: 'Maintenance et propriété', h1: 'Après la livraison : maintenance, propriété et arrêt', lead: 'Un logiciel n’est jamais tout à fait fini. Ce qui suit la livraison compte autant que le développement.', blokken: [
      L('À qui appartient quoi ?', 'Vos données sont à vous et exportables.', 'Pour un développement réalisé pour vous, le code vous revient aussi.', 'Nom de domaine et textes sont à votre nom.', 'Les composants de tiers restent à ces tiers ; c’est précisé dans l’offre.'),
      S('Si vous arrêtez, ou si nous arrêtons', 'Vous emportez vos données et votre code, avec la documentation. Vous pouvez continuer seul, faire appel à un autre prestataire ou rester chez nous. Vous réduisez ainsi la dépendance à une seule personne. Nous ne pouvons pas garantir un remplaçant, mais bien que tout est transmissible.')] },
    en: { kort: 'Maintenance and ownership', h1: 'After delivery: maintenance, ownership and stopping', lead: 'Software is never quite finished. What happens after delivery matters as much as building it.', blokken: [
      L('Who owns what?', 'Your data is yours and you can export it.', 'For software built for you, the code is handed over too.', 'Domain name and content are in your name.', 'Third-party components stay with that third party; the quote says so.'),
      S('If you stop, or if we stop', 'You take your data and code with you, with documentation. You can continue yourself, bring in another provider or stay with us. That limits dependence on one person. We can’t guarantee a replacement, but we can make sure it’s transferable.')] },
  }),

  gids('gids-avg', { nl: 'kennis/gegevens-en-avg', fr: 'ressources/donnees-et-rgpd', en: 'guides/data-and-gdpr' }, {
    nl: { kort: 'Gegevens en de AVG', h1: 'Je gegevens en de AVG bij maatwerksoftware', lead: 'Wie software laat bouwen, laat ook gegevens opslaan. Wat we vooraf regelen. Dit is geen juridisch advies.', blokken: [
      S('Van wie en waar?', 'De gegevens zijn van jou en exporteerbaar. Ze staan op hosting in de EU; provider en regio staan in de offerte. Bij elke offerte hoort een verwerkersovereenkomst: waarvoor, hoe beveiligd, hoe lang, en wat bij een probleem.'),
      L('Wat je zelf regelt', 'Weten welke persoonsgegevens je verwerkt en waarom.', 'Een privacytekst voor klanten of medewerkers.', 'Een register van verwerkingen, als dat voor jou geldt.', 'Bewaartermijnen.'),
      S('En bij AI?', 'We leggen uit welke gegevens waar verwerkt worden en of ze buiten de EU gaan. Gevoelige gegevens verwerken we niet zonder duidelijke afspraak. Voor je eigen situatie: een jurist of de Gegevensbeschermingsautoriteit.')] },
    fr: { kort: 'Données et RGPD', h1: 'Vos données et le RGPD dans un projet sur mesure', lead: 'Faire développer un logiciel, c’est aussi faire stocker des données. Ce que nous réglons à l’avance. Ceci n’est pas un avis juridique.', blokken: [
      S('À qui et où ?', 'Les données sont à vous et exportables. Elles sont hébergées dans l’UE ; fournisseur et région figurent dans l’offre. Chaque offre s’accompagne d’un contrat de sous-traitance : finalité, sécurité, durée et procédure en cas d’incident.'),
      L('Ce que vous réglez vous-même', 'Savoir quelles données personnelles vous traitez et pourquoi.', 'Une politique de confidentialité pour vos clients ou collaborateurs.', 'Un registre des traitements, si cela vous concerne.', 'Les durées de conservation.'),
      S('Et avec l’IA ?', 'Nous expliquons quelles données sont traitées où et si elles quittent l’UE. Nous ne traitons pas de données sensibles sans accord clair. Pour votre situation précise : un juriste ou l’Autorité de protection des données.')] },
    en: { kort: 'Data and the GDPR', h1: 'Your data and the GDPR in custom software', lead: 'Having software built also means having data stored. What we arrange up front. This isn’t legal advice.', blokken: [
      S('Whose and where?', 'The data is yours and exportable. It’s hosted in the EU; provider and region are in the quote. Every quote comes with a data processing agreement: purpose, security, retention and what happens if something goes wrong.'),
      L('What you arrange yourself', 'Knowing which personal data you process and why.', 'A privacy notice for customers or staff.', 'A record of processing, if it applies to you.', 'Retention periods.'),
      S('And with AI?', 'We explain which data is processed where and whether it leaves the EU. We don’t process sensitive data without a clear agreement. For your own situation: a lawyer or the Data Protection Authority.')] },
  }),

  gids('gids-ai', { nl: 'kennis/ai-in-een-kmo', fr: 'ressources/ia-dans-une-pme', en: 'guides/ai-in-a-small-business' }, {
    nl: { kort: 'AI in een kmo', h1: 'AI in een kmo: wat helpt echt?', lead: 'Veel van wat je ziet is demo, geen dagelijks werk. Toch kan AI nu al saaie taken overnemen, als je de juiste kiest.', blokken: [
      L('Waar AI goed werkt', 'Documenten lezen en de belangrijkste gegevens eruit halen.', 'Een antwoord voorbereiden dat een medewerker nakijkt.', 'Een eerste versie van een tekst of vertaling.', 'Zoeken in je eigen documenten.'),
      S('Waar minder', 'Bij beslissingen met grote gevolgen en bij werk dat zonder controle juist moet zijn. Een AI kan zelfverzekerd fout zitten. Daarom controleert altijd een mens.'),
      S('Waar je begint', 'Kies één terugkerende taak waarbij een fout niet erg is en snel te controleren valt, zoals bestelmails voorbereiden. Meet of het echt tijd wint. Lees ook [AI bij PlatforMaat](ai).')] },
    fr: { kort: 'L’IA dans une PME', h1: 'L’IA dans une PME : qu’est-ce qui aide vraiment ?', lead: 'Beaucoup de ce qu’on voit relève de la démo, pas du travail quotidien. L’IA peut pourtant déjà reprendre des tâches ennuyeuses, si on choisit les bonnes.', blokken: [
      L('Où l’IA fonctionne bien', 'Lire des documents et en extraire l’essentiel.', 'Préparer une réponse qu’un collaborateur relit.', 'Une première version d’un texte ou d’une traduction.', 'Chercher dans vos propres documents.'),
      S('Où c’est moins le cas', 'Pour des décisions lourdes de conséquences et pour un travail qui doit être exact sans contrôle. Une IA peut se tromper avec assurance. C’est pourquoi une personne vérifie toujours.'),
      S('Par où commencer', 'Choisissez une tâche répétitive où une erreur n’est pas grave et se vérifie vite, comme la préparation d’e-mails de commande. Mesurez si cela fait vraiment gagner du temps. Voir aussi [l’IA chez PlatforMaat](ai).')] },
    en: { kort: 'AI in a small business', h1: 'AI in a small business: what really helps?', lead: 'Much of what you see is demo, not daily work. Still, AI can already take over dull tasks, if you pick the right ones.', blokken: [
      L('Where AI works well', 'Reading documents and pulling out the key data.', 'Drafting a reply that a staff member checks.', 'A first draft of a text or translation.', 'Searching your own documents.'),
      S('Where it works less well', 'For decisions with big consequences and for work that must be right without checking. An AI can be confidently wrong, which is why a person always checks.'),
      S('Where to start', 'Pick one recurring task where a mistake isn’t serious and is quick to check, such as preparing order emails. Measure whether it really saves time. See also [AI at PlatforMaat](ai).')] },
  }),
];

const overzicht = {
  sleutel: 'kennis',
  slug: { nl: 'kennis', fr: 'ressources', en: 'guides' },
  nl: { kort: 'Kennis', title: 'Kennis: gidsen over software op maat | PlatforMaat', description: 'Gidsen in gewone taal: maatwerk of standaard, wat het kost, koppelingen, AI, de AVG, onderhoud en eigendom.', h1: 'Gidsen in gewone taal', lead: 'Wat kan, wat niet, en waar je begint.', blokken: [{ type: 'links', h2: 'Gidsen', items: gidsen.map((g) => [g.sleutel, g.nl.description]) }, { type: 'links', h2: 'Ook handig', items: [['calculator', 'Reken uit wat handwerk je kost.'], ['faq', 'Korte antwoorden.'], ['sectoren', 'Per sector.']] }] },
  fr: { kort: 'Ressources', title: 'Ressources : guides sur le logiciel sur mesure | PlatforMaat', description: 'Des guides en langage clair : sur-mesure ou standard, coûts, connexions, IA, RGPD, maintenance et propriété.', h1: 'Des guides en langage clair', lead: 'Ce qui est possible, ce qui ne l’est pas, et par où commencer.', blokken: [{ type: 'links', h2: 'Guides', items: gidsen.map((g) => [g.sleutel, g.fr.description]) }, { type: 'links', h2: 'Utile aussi', items: [['calculator', 'Calculez le coût du travail manuel.'], ['faq', 'Réponses courtes.'], ['sectoren', 'Par secteur.']] }] },
  en: { kort: 'Guides', title: 'Guides: custom software in plain language | PlatforMaat', description: 'Plain-language guides: custom or off-the-shelf, cost, integrations, AI, the GDPR, maintenance and ownership.', h1: 'Guides in plain language', lead: 'What works, what doesn’t, and where to start.', blokken: [{ type: 'links', h2: 'Guides', items: gidsen.map((g) => [g.sleutel, g.en.description]) }, { type: 'links', h2: 'Also useful', items: [['calculator', 'Work out what manual work costs.'], ['faq', 'Short answers.'], ['sectoren', 'By industry.']] }] },
};

export default [overzicht, ...gidsen];
