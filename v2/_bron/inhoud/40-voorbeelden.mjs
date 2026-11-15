// Voorbeelden en cases.
// Regels (besluit Rayane 15-11-2026):
//  - echt: false  → verzonnen voorbeeld, altijd met het label «Voorbeeld, geen echte klant» en een neutrale naam.
//  - echt: true   → echte klant. Verschijnt ALLEEN als `toestemming` ingevuld is (datum + vorm van de
//                   schriftelijke goedkeuring van tekst en cijfers). Zonder toestemming: niet getoond.
//  - Geen klantnamen in deze broncode zolang er geen toestemming is (de repo is publiek).
const CASES = (taal) => [
  {
    // Eigen zustermerk van de eigenaar, geen klant.
    echt: true, toestemming: 'eigen merk', labelEcht: { nl: 'Eigen merk', fr: 'Notre propre marque', en: 'Our own brand' }[taal],
    echteNaam: { nl: 'Zichtbaar Media: een intern platform', fr: 'Zichtbaar Media : une plateforme interne', en: 'Zichtbaar Media: an internal platform' }[taal],
    p: {
      nl: ['Het zustermerk dat bedrijven vindbaar maakt via Google. Alles stond verspreid over verschillende plekken.', 'Nu komt alles samen in één intern platform, en terugkerende taken lopen automatisch.'],
      fr: ['La marque sœur qui rend les entreprises visibles sur Google. Tout était dispersé à plusieurs endroits.', 'Aujourd’hui, tout est réuni dans une plateforme interne et les tâches répétitives sont automatisées.'],
      en: ['The sister brand that helps companies get found on Google. Everything was spread across different places.', 'Now it all comes together in one internal platform, and recurring tasks run automatically.'],
    }[taal],
    rijen: { nl: [['Gebouwd', 'Intern platform'], ['Resultaat', 'Minder zoeken, meer automatisch']], fr: [['Réalisé', 'Plateforme interne'], ['Résultat', 'Moins de recherches, plus d’automatisation']], en: [['Built', 'Internal platform'], ['Result', 'Less searching, more automation']] }[taal],
  },
  {
    // Echte case (raamdecoratie). Naam, tekst en cijfers pas invullen na schriftelijke goedkeuring van de klant.
    echt: true, toestemming: '', echteNaam: '', p: [], rijen: null,
  },
  {
    echt: false,
    naam: { nl: 'Een pizzeria met website en kassa', fr: 'Une pizzeria avec site web et caisse', en: 'A pizzeria with website and till' }[taal],
    p: {
      nl: ['Menu, prijzen en openingsuren stonden apart op de website, aan de kassa en op papier, en liepen uit de pas.', 'Een website gekoppeld aan een eenvoudige kassa op maat: je past een prijs één keer aan en ze klopt overal.'],
      fr: ['Menu, prix et horaires étaient gérés séparément sur le site, à la caisse et sur papier, et finissaient par ne plus correspondre.', 'Un site relié à une caisse simple sur mesure : vous modifiez un prix une seule fois et il est juste partout.'],
      en: ['Menu, prices and opening hours were kept separately on the website, at the till and on paper, and drifted apart.', 'A website linked to a simple custom till: change a price once and it’s right everywhere.'],
    }[taal],
    rijen: { nl: [['Gebouwd', 'Website en kassa'], ['Principe', 'Eén bron voor menu en prijzen']], fr: [['Réalisé', 'Site et caisse'], ['Principe', 'Une seule source pour menu et prix']], en: [['Built', 'Website and till'], ['Principle', 'One source for menu and prices']] }[taal],
  },
  {
    echt: false,
    naam: { nl: 'Een installatiebedrijf met acht technici', fr: 'Une entreprise d’installation avec huit techniciens', en: 'An installation company with eight technicians' }[taal],
    p: {
      nl: ['Offertes werden in Excel gemaakt en per mail rondgestuurd. Een offertetool haalt prijzen uit één lijst en zet de pdf klaar.'],
      fr: ['Les devis étaient faits dans Excel et envoyés par e-mail. Un outil de devis reprend les prix d’une seule liste et prépare le PDF.'],
      en: ['Quotes were built in Excel and emailed around. A quoting tool pulls prices from one list and prepares the PDF.'],
    }[taal],
    rijen: { nl: [['Eerste stap', 'Offertetool'], ['Daarna', 'Koppeling met de boekhouding']], fr: [['Première étape', 'Outil de devis'], ['Ensuite', 'Lien avec la comptabilité']], en: [['First step', 'Quoting tool'], ['Next', 'Link with accounting']] }[taal],
  },
];

const lijst = [
  {
    sleutel: 'voorbeelden',
    slug: { nl: 'voorbeelden', fr: 'exemples', en: 'examples' },
    nl: {
      kort: 'Voorbeelden', title: 'Voorbeelden van ons werk | PlatforMaat',
      description: 'Wat we bouwen, getoond met ons eigen merk en verzonnen voorbeelden. Echte klanten tonen we alleen met hun schriftelijke toestemming.',
      h1: 'Voorbeelden van ons werk',
      lead: 'Echte klanten tonen we pas als ze de tekst en de cijfers schriftelijk goedkeurden. Tot dan zie je ons eigen merk en verzonnen voorbeelden, duidelijk gelabeld.',
      blokken: [{ type: 'cases', h2: 'Wat er misliep en wat nu beter loopt', items: CASES('nl') }, { type: 'links', h2: 'Probeer zelf', items: [['calculator', 'Reken uit wat een terugkerende taak je kost.'], ['sectoren', 'Problemen die we per sector tegenkomen.']] }],
    },
    fr: {
      kort: 'Exemples', title: 'Exemples de réalisations | PlatforMaat',
      description: 'Ce que nous réalisons, montré avec notre propre marque et des exemples inventés. Nous ne montrons de vrais clients qu’avec leur accord écrit.',
      h1: 'Exemples de réalisations',
      lead: 'Nous ne montrons un vrai client qu’après son accord écrit sur le texte et les chiffres. En attendant, vous voyez notre propre marque et des exemples inventés, clairement indiqués.',
      blokken: [{ type: 'cases', h2: 'Ce qui coinçait et ce qui fonctionne mieux', items: CASES('fr') }, { type: 'links', h2: 'Essayez vous-même', items: [['calculator', 'Calculez ce que vous coûte une tâche répétitive.'], ['sectoren', 'Les problèmes rencontrés par secteur.']] }],
    },
    en: {
      kort: 'Examples', title: 'Examples of our work | PlatforMaat',
      description: 'What we build, shown through our own brand and made-up examples. We only show real clients with their written consent.',
      h1: 'Examples of our work',
      lead: 'We only show a real client once they have approved the text and figures in writing. Until then you see our own brand and made-up examples, clearly labelled.',
      blokken: [{ type: 'cases', h2: 'What was stuck and what works better now', items: CASES('en') }, { type: 'links', h2: 'Try it yourself', items: [['calculator', 'Work out what a recurring task costs you.'], ['sectoren', 'Problems we see in each industry.']] }],
    },
  },
];

// Besparingscalculator: rekent in de browser, verstuurt niets.
const CALC = {
  nl: { velden: [['keer', 'Hoe vaak per week doe je die taak?', 10], ['min', 'Hoeveel minuten kost dat telkens?', 15], ['uur', 'Wat kost een uur werk van die persoon (€, met bijkomende kosten)?', 45], ['weken', 'In hoeveel weken per jaar?', 46], ['pct', 'Hoeveel procent kun je volgens jou schrappen?', 60]],
    uit: 'Nu: {uren} uur en {kost} per jaar. Als je {pct} % schrapt, win je ongeveer {winst} per jaar.', noot: 'Een schatting, geen belofte. De kost van een oplossing en de tijd om ze in gebruik te nemen tellen ook mee.' },
  fr: { velden: [['keer', 'Combien de fois par semaine faites-vous cette tâche ?', 10], ['min', 'Combien de minutes à chaque fois ?', 15], ['uur', 'Combien coûte une heure de travail de cette personne (€, charges comprises) ?', 45], ['weken', 'Pendant combien de semaines par an ?', 46], ['pct', 'Quel pourcentage pourriez-vous supprimer, selon vous ?', 60]],
    uit: 'Aujourd’hui : {uren} heures et {kost} par an. En supprimant {pct} %, vous gagnez environ {winst} par an.', noot: 'Une estimation, pas une promesse. Le coût d’une solution et le temps de mise en route comptent aussi.' },
  en: { velden: [['keer', 'How many times a week do you do this task?', 10], ['min', 'How many minutes does it take each time?', 15], ['uur', 'What does an hour of that person’s work cost (€, including overheads)?', 45], ['weken', 'How many weeks a year?', 46], ['pct', 'What percentage could you cut, in your estimate?', 60]],
    uit: 'Today: {uren} hours and {kost} a year. Cut {pct}% and you save about {winst} a year.', noot: 'An estimate, not a promise. The cost of a solution and the time to adopt it count too.' },
};

export const calculator = {
  sleutel: 'calculator',
  slug: { nl: 'besparingscalculator', fr: 'calculateur-economies', en: 'savings-calculator' },
  nl: { kort: 'Besparingscalculator', title: 'Besparingscalculator: wat kost handwerk per jaar? | PlatforMaat', description: 'Reken uit wat een terugkerende taak, zoals offertes opmaken of gegevens overtikken, je onderneming per jaar kost. Alles blijft in je browser.', h1: 'Wat kost handwerk je per jaar?', lead: 'Kies één taak die steeds terugkomt. De ingevulde getallen zijn een voorbeeld; vervang ze door die van jou. Er wordt niets verstuurd.', blokken: [{ type: 'calculator', h2: 'Je berekening', ...CALC.nl }, { type: 'links', h2: 'Meer lezen', items: [['gids-offerte', 'Offertes automatiseren.'], ['gids-kosten', 'Wat maatwerk kost.']] }] },
  fr: { kort: 'Calculateur d’économies', title: 'Calculateur : combien vous coûte le travail manuel par an ? | PlatforMaat', description: 'Calculez ce que coûte par an une tâche répétitive, comme rédiger des devis ou ressaisir des données. Tout reste dans votre navigateur.', h1: 'Combien vous coûte le travail manuel par an ?', lead: 'Choisissez une tâche qui revient sans cesse. Les chiffres remplis sont un exemple ; remplacez-les par les vôtres. Rien n’est envoyé.', blokken: [{ type: 'calculator', h2: 'Votre calcul', ...CALC.fr }, { type: 'links', h2: 'Pour aller plus loin', items: [['gids-offerte', 'Automatiser les devis.'], ['gids-kosten', 'Ce que coûte le sur-mesure.']] }] },
  en: { kort: 'Savings calculator', title: 'Savings calculator: what does manual work cost a year? | PlatforMaat', description: 'Work out what a recurring task, such as writing quotes or retyping data, costs your company each year. Everything stays in your browser.', h1: 'What does manual work cost you a year?', lead: 'Pick one task that keeps coming back. The numbers filled in are an example; replace them with yours. Nothing is sent.', blokken: [{ type: 'calculator', h2: 'Your calculation', ...CALC.en }, { type: 'links', h2: 'Read more', items: [['gids-offerte', 'Automating quotes.'], ['gids-kosten', 'What custom software costs.']] }] },
};

export default [...lijst, calculator];
