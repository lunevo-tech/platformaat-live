// Privacy, cookies en bedrijfsgegevens. Inhoud gebaseerd op de live versie van 27-10-2026.
// FR en EN zijn vertalingen; de Nederlandse tekst geldt bij verschil (zie juristlijst).
const DATUM = { nl: '15 november 2026 (V2, nog niet gepubliceerd)', fr: '15 novembre 2026 (V2, pas encore publiée)', en: '15 November 2026 (V2, not yet published)' };

export default [
  {
    sleutel: 'privacy',
    slug: { nl: 'privacy', fr: 'confidentialite', en: 'privacy' },
    nl: {
      kort: 'Privacy', title: 'Privacyverklaring | PlatforMaat',
      description: 'Welke persoonsgegevens PlatforMaat verwerkt, waarvoor, op welke grond, hoe lang, wie ze ontvangt en welke rechten je hebt.',
      h1: 'Privacy en gegevens',
      lead: 'Welke persoonsgegevens we verwerken, waarvoor, op welke grond, hoe lang, wie ze ontvangt en welke rechten je hebt. We volgen de AVG en de Belgische wetgeving.',
      blokken: [
        { type: 'tekst', h2: 'Wie is verantwoordelijk?', p: ['PlatforMaat, handelsnaam van Rayane Errami, Meetjeslandstraat 44, 2660 Antwerpen, ondernemingsnummer 1004.326.518. Vragen over persoonsgegevens: info@platformaat.be. We zijn niet verplicht een functionaris voor gegevensbescherming aan te stellen.'] },
        { type: 'tabel', h2: 'Welke gegevens, waarvoor en hoe lang?', kop: ['Wanneer', 'Welke gegevens', 'Waarvoor', 'Rechtsgrond', 'Hoe lang'], rijen: [
          ['Je gebruikt het formulier, mailt of belt', 'Naam, e-mailadres, je bericht en wat je zelf vertelt', 'Je vraag beantwoorden en een kennismaking of voorstel voorbereiden', 'Stappen vóór een overeenkomst (art. 6.1.b AVG) en gerechtvaardigd belang (art. 6.1.f AVG)', 'Zonder opdracht: tot 12 maanden na het laatste contact'],
          ['Je plant een afspraak via Cal.com', 'Naam, e-mailadres, tijdstip en wat je invult', 'De afspraak plannen en bevestigen', 'Stappen vóór een overeenkomst (art. 6.1.b AVG)', 'Onze kopie: zoals hierboven. Bij Cal.com: hun beleid'],
          ['Je wordt klant', 'Contact- en ondernemingsgegevens, communicatie, facturen', 'De opdracht uitvoeren, factureren en opvolgen', 'Overeenkomst (art. 6.1.b) en wettelijke plicht (art. 6.1.c AVG)', 'Zolang de opdracht loopt en daarna zolang de wet het voorschrijft'],
          ['Je bezoekt de website', 'IP-adres en tijdstip, tijdelijk bij de host', 'De site veilig en werkend houden', 'Gerechtvaardigd belang (art. 6.1.f AVG)', 'Kort, volgens de host. Niet om je te volgen'],
        ] },
        { type: 'tekst', h2: 'Wie ontvangt je gegevens?', p: [
          '**E-mail en domein:** Combell (België). **Hosting:** GitHub Pages (Microsoft, VS), dat je IP-adres en tijdstip tijdelijk kan registreren. **Formulier:** de mailservice Brevo (Frankrijk) en de host van de formulierroute in de EU. **Afspraken:** Cal.com. **Boekhouding:** onze boekhouder. **Overheden:** alleen als de wet het vraagt.',
          'We verkopen geen gegevens en gebruiken geen advertentie- of analysetrackers. Met onze verwerkers maken we afspraken over beveiliging en gebruik.',
        ] },
        { type: 'tekst', h2: 'Buiten de Europese Economische Ruimte', p: ['We kiezen waar mogelijk aanbieders in de EU. Cal.com en GitHub kunnen gegevens buiten de EER verwerken; hun privacyinformatie legt uit op welke grond. Verder geven we geen gegevens door buiten de EER.'] },
        { type: 'tekst', h2: 'Beveiliging', p: ['De verbinding is versleuteld (https). Het formulier slaat niets op in je browser en de formulierroute bewaart of logt de inhoud van je bericht niet. Toegang tot onze mailbox en systemen is beperkt.'] },
        { type: 'tekst', h2: 'Je rechten', p: ['Je hebt recht op inzage, verbetering, verwijdering, beperking, overdraagbaarheid van gegevens die je zelf gaf, en bezwaar tegen verwerking op grond van gerechtvaardigd belang. Mail naar info@platformaat.be; we antwoorden binnen één maand.', 'Niet tevreden? Neem eerst contact op. Je kunt ook klacht indienen bij de Gegevensbeschermingsautoriteit (Drukpersstraat 35, 1000 Brussel, contact@apd-gba.be).', `Laatst bijgewerkt: ${DATUM.nl}.`] },
      ],
    },
    fr: {
      kort: 'Confidentialité', title: 'Déclaration de confidentialité | PlatforMaat',
      description: 'Quelles données personnelles PlatforMaat traite, pourquoi, sur quelle base, combien de temps, qui les reçoit et quels sont vos droits.',
      h1: 'Confidentialité et données',
      lead: 'Quelles données personnelles nous traitons, pourquoi, sur quelle base, combien de temps, qui les reçoit et quels sont vos droits. Nous respectons le RGPD et la législation belge.',
      blokken: [
        { type: 'tekst', h2: 'Qui est responsable ?', p: ['PlatforMaat, nom commercial de Rayane Errami, Meetjeslandstraat 44, 2660 Anvers, numéro d’entreprise 1004.326.518. Questions sur vos données : info@platformaat.be. Nous ne sommes pas tenus de désigner un délégué à la protection des données.', 'Cette traduction est fournie pour votre confort. En cas de différence, la version néerlandaise fait foi.'] },
        { type: 'tabel', h2: 'Quelles données, pourquoi et combien de temps ?', kop: ['Quand', 'Quelles données', 'Pourquoi', 'Base légale', 'Durée'], rijen: [
          ['Vous utilisez le formulaire, nous écrivez ou appelez', 'Nom, adresse e-mail, votre message et ce que vous nous dites', 'Répondre à votre question et préparer un échange ou une proposition', 'Mesures précontractuelles (art. 6.1.b RGPD) et intérêt légitime (art. 6.1.f RGPD)', 'Sans mission : jusqu’à 12 mois après le dernier contact'],
          ['Vous réservez via Cal.com', 'Nom, adresse e-mail, créneau et ce que vous indiquez', 'Planifier et confirmer le rendez-vous', 'Mesures précontractuelles (art. 6.1.b RGPD)', 'Notre copie : comme ci-dessus. Chez Cal.com : leur politique'],
          ['Vous devenez client', 'Coordonnées, données d’entreprise, échanges, factures', 'Exécuter la mission, facturer et assurer le suivi', 'Contrat (art. 6.1.b) et obligation légale (art. 6.1.c RGPD)', 'Pendant la mission, puis aussi longtemps que la loi l’impose'],
          ['Vous visitez le site', 'Adresse IP et heure, temporairement chez l’hébergeur', 'Garder le site sûr et fonctionnel', 'Intérêt légitime (art. 6.1.f RGPD)', 'Courte, selon l’hébergeur. Pas pour vous suivre'],
        ] },
        { type: 'tekst', h2: 'Qui reçoit vos données ?', p: [
          '**E-mail et domaine :** Combell (Belgique). **Hébergement :** GitHub Pages (Microsoft, États-Unis), qui peut enregistrer temporairement votre adresse IP et l’heure. **Formulaire :** le service d’envoi Brevo (France) et l’hébergeur de la route du formulaire, dans l’UE. **Rendez-vous :** Cal.com. **Comptabilité :** notre comptable. **Autorités :** uniquement si la loi l’exige.',
          'Nous ne vendons aucune donnée et n’utilisons aucun traceur publicitaire ou analytique. Nos sous-traitants s’engagent sur la sécurité et l’usage des données.',
        ] },
        { type: 'tekst', h2: 'En dehors de l’Espace économique européen', p: ['Nous choisissons des fournisseurs dans l’UE autant que possible. Cal.com et GitHub peuvent traiter des données hors de l’EEE ; leurs informations de confidentialité en précisent la base. Nous ne transférons pas d’autres données hors de l’EEE.'] },
        { type: 'tekst', h2: 'Sécurité', p: ['La connexion est chiffrée (https). Le formulaire n’enregistre rien dans votre navigateur et la route du formulaire ne conserve ni ne journalise le contenu de votre message. L’accès à notre messagerie et à nos systèmes est limité.'] },
        { type: 'tekst', h2: 'Vos droits', p: ['Vous avez un droit d’accès, de rectification, d’effacement, de limitation, de portabilité des données que vous avez fournies, et d’opposition au traitement fondé sur l’intérêt légitime. Écrivez à info@platformaat.be ; nous répondons dans un délai d’un mois.', 'Pas satisfait ? Contactez-nous d’abord. Vous pouvez aussi introduire une plainte auprès de l’Autorité de protection des données (rue de la Presse 35, 1000 Bruxelles, contact@apd-gba.be).', `Dernière mise à jour : ${DATUM.fr}.`] },
      ],
    },
    en: {
      kort: 'Privacy', title: 'Privacy notice | PlatforMaat',
      description: 'Which personal data PlatforMaat processes, why, on what legal basis, for how long, who receives it and what your rights are.',
      h1: 'Privacy and data',
      lead: 'Which personal data we process, why, on what basis, for how long, who receives it and what your rights are. We follow the GDPR and Belgian law.',
      blokken: [
        { type: 'tekst', h2: 'Who is responsible?', p: ['PlatforMaat, trade name of Rayane Errami, Meetjeslandstraat 44, 2660 Antwerp, company number 1004.326.518. Questions about personal data: info@platformaat.be. We are not required to appoint a data protection officer.', 'This translation is provided for convenience. If it differs, the Dutch version prevails.'] },
        { type: 'tabel', h2: 'Which data, why and for how long?', kop: ['When', 'Which data', 'Why', 'Legal basis', 'How long'], rijen: [
          ['You use the form, email or call us', 'Name, email address, your message and what you tell us', 'Answer your question and prepare a call or proposal', 'Pre-contract steps (Art. 6(1)(b) GDPR) and legitimate interest (Art. 6(1)(f) GDPR)', 'Without an assignment: up to 12 months after last contact'],
          ['You book via Cal.com', 'Name, email address, time slot and what you enter', 'Schedule and confirm the meeting', 'Pre-contract steps (Art. 6(1)(b) GDPR)', 'Our copy: as above. At Cal.com: their policy'],
          ['You become a client', 'Contact and company details, correspondence, invoices', 'Carry out the work, invoice and follow up', 'Contract (Art. 6(1)(b)) and legal obligation (Art. 6(1)(c) GDPR)', 'While the work runs and as long as the law requires afterwards'],
          ['You visit the website', 'IP address and time, temporarily at the host', 'Keep the site secure and working', 'Legitimate interest (Art. 6(1)(f) GDPR)', 'Briefly, per the host’s settings. Not to track you'],
        ] },
        { type: 'tekst', h2: 'Who receives your data?', p: [
          '**Email and domain:** Combell (Belgium). **Hosting:** GitHub Pages (Microsoft, US), which may briefly log your IP address and time. **Form:** the email service Brevo (France) and the host of the form route in the EU. **Bookings:** Cal.com. **Accounting:** our accountant. **Authorities:** only where the law requires.',
          'We never sell data and use no advertising or analytics trackers. Our processors are bound by agreements on security and use.',
        ] },
        { type: 'tekst', h2: 'Outside the European Economic Area', p: ['Wherever possible we choose EU providers. Cal.com and GitHub may process data outside the EEA; their privacy information explains on what basis. We transfer no other data outside the EEA.'] },
        { type: 'tekst', h2: 'Security', p: ['The connection is encrypted (https). The form stores nothing in your browser and the form route neither keeps nor logs the content of your message. Access to our mailbox and systems is limited.'] },
        { type: 'tekst', h2: 'Your rights', p: ['You have the right of access, rectification, erasure, restriction, portability of data you provided, and to object to processing based on legitimate interest. Email info@platformaat.be; we reply within one month.', 'Not satisfied? Contact us first. You can also complain to the Belgian Data Protection Authority (Rue de la Presse 35, 1000 Brussels, contact@apd-gba.be).', `Last updated: ${DATUM.en}.`] },
      ],
    },
  },
  {
    sleutel: 'cookies',
    slug: { nl: 'cookies', fr: 'cookies', en: 'cookies' },
    nl: {
      kort: 'Cookies', title: 'Cookies | PlatforMaat', description: 'Deze site plaatst geen cookies en bewaart niets in je browser. Daarom is er geen cookiebanner.',
      h1: 'Cookies', lead: 'Deze site plaatst geen cookies en bewaart niets in je browser. Daarom is er geen cookiebanner.',
      blokken: [
        { type: 'tekst', h2: 'Wat we niet doen', p: ['Geen analytics, geen advertentietracking, geen knoppen van sociale netwerken. Licht of donker volgt gewoon de instelling van je toestel; dat wordt nergens opgeslagen.'] },
        { type: 'tekst', h2: 'Als dat verandert', p: ['Voegen we ooit iets toe dat niet strikt nodig is, zoals statistieken, dan passen we eerst deze pagina en de [privacyverklaring](privacy) aan, en vragen we toestemming waar de wet dat vraagt.'] },
        { type: 'tekst', h2: 'Externe websites', p: ['Cal.com opent pas als je op de afspraaklink klikt. Die site kan eigen cookies gebruiken; zie hun informatie.', `Laatst bijgewerkt: ${DATUM.nl}.`] },
      ],
    },
    fr: {
      kort: 'Cookies', title: 'Cookies | PlatforMaat', description: 'Ce site ne dépose aucun cookie et n’enregistre rien dans votre navigateur. C’est pourquoi il n’y a pas de bannière cookies.',
      h1: 'Cookies', lead: 'Ce site ne dépose aucun cookie et n’enregistre rien dans votre navigateur. C’est pourquoi il n’y a pas de bannière cookies.',
      blokken: [
        { type: 'tekst', h2: 'Ce que nous ne faisons pas', p: ['Pas d’outil d’analyse, pas de traçage publicitaire, pas de boutons de réseaux sociaux. Le mode clair ou sombre suit simplement le réglage de votre appareil ; rien n’est enregistré.'] },
        { type: 'tekst', h2: 'Si cela change', p: ['Si nous ajoutons un jour quelque chose qui n’est pas strictement nécessaire, comme des statistiques, nous adapterons d’abord cette page et la [déclaration de confidentialité](privacy), et demanderons votre consentement lorsque la loi l’exige.'] },
        { type: 'tekst', h2: 'Sites externes', p: ['Cal.com ne s’ouvre que si vous cliquez sur le lien de rendez-vous. Ce site peut utiliser ses propres cookies ; consultez ses informations.', `Dernière mise à jour : ${DATUM.fr}.`] },
      ],
    },
    en: {
      kort: 'Cookies', title: 'Cookies | PlatforMaat', description: 'This site sets no cookies and stores nothing in your browser. That’s why there is no cookie banner.',
      h1: 'Cookies', lead: 'This site sets no cookies and stores nothing in your browser. That’s why there is no cookie banner.',
      blokken: [
        { type: 'tekst', h2: 'What we don’t do', p: ['No analytics, no ad tracking, no social media buttons. Light or dark mode simply follows your device setting; nothing is stored.'] },
        { type: 'tekst', h2: 'If that changes', p: ['If we ever add something that isn’t strictly necessary, such as statistics, we will first update this page and the [privacy notice](privacy), and ask for consent where the law requires it.'] },
        { type: 'tekst', h2: 'External websites', p: ['Cal.com only opens when you click the booking link. That site may use its own cookies; see its information.', `Last updated: ${DATUM.en}.`] },
      ],
    },
  },
  {
    sleutel: 'bedrijfsgegevens',
    slug: { nl: 'bedrijfsgegevens', fr: 'mentions-legales', en: 'company-details' },
    nl: {
      kort: 'Bedrijfsgegevens', title: 'Bedrijfsgegevens en colofon | PlatforMaat', description: 'PlatforMaat is de handelsnaam van de eenmanszaak van Rayane Errami. Ondernemingsnummer 1004.326.518, btw BE 1004.326.518.',
      h1: 'Bedrijfsgegevens',
      blokken: [
        { type: 'tabel', h2: 'Gegevens', kop: ['Gegeven', 'Waarde'], rijen: [['Ondernemer', 'Rayane Errami'], ['Handelsnaam', 'PlatforMaat'], ['Rechtsvorm', 'Eenmanszaak (natuurlijk persoon)'], ['Vestigingsadres', 'Meetjeslandstraat 44, 2660 Antwerpen, België'], ['Ondernemingsnummer', '1004.326.518 (KBO, actief)'], ['Btw-nummer', 'BE 1004.326.518'], ['E-mail', 'info@platformaat.be'], ['Telefoon', '+32 483 85 13 22']] },
        { type: 'tekst', h2: 'Goed om te weten', p: [
          'PlatforMaat oefent geen gereglementeerd beroep uit. Een contactaanvraag of kennismaking is geen bestelling: omvang, prijs, planning en voorwaarden staan in het voorstel. Prijzen staan in euro, met of zonder btw uitdrukkelijk vermeld.',
          'Klachten: schrijf naar info@platformaat.be. De teksten, ontwerpen en code van deze site zijn van PlatforMaat. Namen en logo’s van andere ondernemingen staan er alleen met hun schriftelijke toestemming.',
          'We houden de informatie zo juist mogelijk, maar kunnen dat niet garanderen. Belgisch recht is van toepassing; bevoegd zijn de rechtbanken van het arrondissement Antwerpen, onverminderd dwingend recht.',
        ] },
      ],
    },
    fr: {
      kort: 'Mentions légales', title: 'Mentions légales | PlatforMaat', description: 'PlatforMaat est le nom commercial de l’entreprise individuelle de Rayane Errami. Numéro d’entreprise 1004.326.518, TVA BE 1004.326.518.',
      h1: 'Mentions légales',
      blokken: [
        { type: 'tabel', h2: 'Coordonnées', kop: ['Donnée', 'Valeur'], rijen: [['Entrepreneur', 'Rayane Errami'], ['Nom commercial', 'PlatforMaat'], ['Forme juridique', 'Entreprise individuelle (personne physique)'], ['Adresse d’établissement', 'Meetjeslandstraat 44, 2660 Anvers, Belgique'], ['Numéro d’entreprise', '1004.326.518 (BCE, actif)'], ['Numéro de TVA', 'BE 1004.326.518'], ['E-mail', 'info@platformaat.be'], ['Téléphone', '+32 483 85 13 22']] },
        { type: 'tekst', h2: 'Bon à savoir', p: [
          'PlatforMaat n’exerce pas de profession réglementée. Une demande de contact ou un premier échange n’est pas une commande : l’étendue, le prix, le planning et les conditions figurent dans la proposition. Les prix sont exprimés en euros, avec ou sans TVA, toujours de manière explicite.',
          'Réclamations : écrivez à info@platformaat.be. Les textes, la conception et le code de ce site appartiennent à PlatforMaat. Les noms et logos d’autres entreprises n’y figurent qu’avec leur accord écrit.',
          'Nous veillons à l’exactitude des informations sans pouvoir la garantir. Le droit belge s’applique ; les tribunaux de l’arrondissement d’Anvers sont compétents, sans préjudice des dispositions impératives. En cas de différence, la version néerlandaise fait foi.',
        ] },
      ],
    },
    en: {
      kort: 'Company details', title: 'Company details | PlatforMaat', description: 'PlatforMaat is the trade name of Rayane Errami’s sole proprietorship. Company number 1004.326.518, VAT BE 1004.326.518.',
      h1: 'Company details',
      blokken: [
        { type: 'tabel', h2: 'Details', kop: ['Item', 'Value'], rijen: [['Owner', 'Rayane Errami'], ['Trade name', 'PlatforMaat'], ['Legal form', 'Sole proprietorship (natural person)'], ['Registered address', 'Meetjeslandstraat 44, 2660 Antwerp, Belgium'], ['Company number', '1004.326.518 (Crossroads Bank for Enterprises, active)'], ['VAT number', 'BE 1004.326.518'], ['Email', 'info@platformaat.be'], ['Phone', '+32 483 85 13 22']] },
        { type: 'tekst', h2: 'Good to know', p: [
          'PlatforMaat does not practise a regulated profession. A contact request or intro call is not an order: scope, price, timeline and terms are set out in the proposal. Prices are in euro, always stated with or without VAT.',
          'Complaints: write to info@platformaat.be. The text, design and code of this site belong to PlatforMaat. Names and logos of other companies appear only with their written consent.',
          'We keep the information as accurate as we can but cannot guarantee it. Belgian law applies; the courts of the Antwerp district have jurisdiction, without prejudice to mandatory law. If translations differ, the Dutch version prevails.',
        ] },
      ],
    },
  },
];
