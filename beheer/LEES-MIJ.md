# Editor (directe modus) voor platformaat.be

Adres: `platformaat.be/beheer`. Inloggen met hetzelfde GitHub-token als vroeger (het staat al in de browser). Het scherm is er in het Nederlands, Frans en Engels (keuzelijst rechtsboven).

## Hoe het werkt
- De HTML-bestanden zijn de bron. Elke bewerkbare tekst en foto heeft eenmalig een marker gekregen (`data-cms="t12"` voor tekst, `data-cms="i3"` voor een foto). De markers zijn onzichtbaar voor bezoekers.
- Je klikt op een tekst of foto (of kiest een tekst in de lijst «Teksten op deze pagina», handig met het toetsenbord), past aan en ziet het meteen.
- **Opslaan** doet eerst een controle: de actuele bron wordt van GitHub gehaald, de wijzigingen worden op tekstniveau doorgerekend en gecontroleerd (de opbouw van elke pagina is ongewijzigd, alleen de gekozen stukken zijn anders). Het scherm «Wat verandert er?» toont het resultaat. Pas na **Zet live** wordt er één commit gemaakt (= live binnen 1 tot 3 minuten).
- Is de site intussen door iemand anders aangepast, dan wordt er niets overschreven: je krijgt een melding of een nieuwe controle.
- **Laatste opslag ongedaan maken** zet de site terug naar vóór de laatste opslag van de editor.
- Een tekst die op meer plekken in de site letterlijk hetzelfde staat (bv. in het menu), kan je in één keer overal aanpassen (vinkje, standaard aan, net als in de oude editor). «Wat verandert er?» toont dan «ook op N andere plekken».

## Wat de editor niet doet
- Geen blokken toevoegen, verplaatsen of verwijderen.
- Niet bewerkbaar: titel en meta-teksten van een pagina, teksten die het script van de site zelf opbouwt (bv. de teksten in het voorbeeldvenster, de statusmelding van het formulier) en de pagina `venster/`.
- Een tekst helemaal wissen kan niet (er moet minstens één letter blijven).

## Terugzetten
- De vorige editor (blokkeneditor) staat ongewijzigd in `beheer/oud/` (`platformaat.be/beheer/oud/`).
- Het hele project terug naar de stand van voor de nieuwe editor: tag `rollback-2026-11-18-voor-nieuwe-editor`.

## Voor wie de HTML wijzigt of opnieuw genereert
- Nieuwe of opnieuw gegenereerde pagina's hebben geen markers. Voer dan uit (vanuit deze map): `node beheer/tools/markeer.mjs` (zet alleen ontbrekende markers bij; bestaande blijven). `node beheer/tools/markeer.mjs --controle` controleert dat zonder iets te schrijven.
- Overschrijft een generator de HTML-bestanden, dan gaan de wijzigingen van de editor verloren. De HTML is nu de bron.

## Toetsen
`node --test beheer/tests/*.test.mjs` (met `ZM_PW_MAP` naar een map met `node_modules/playwright-core`; `ZM_BROWSERS=chromium,webkit` voor beide browsers).
- `kern.test.mjs`: markeren is omkeerbaar en idempotent op alle pagina's, opslaan zonder wijziging laat elke pagina byte voor byte gelijk, 300 willekeurige bewerkingen raken alleen het gekozen stuk, ingetypte HTML kan de opbouw niet veranderen.
- `dom.test.mjs`: voor alle gemarkeerde elementen komen de tekststukken in de browser (DOM) overeen met die in de bron.
- `editor.e2e.test.mjs`: de hele editor in een echte browser tegen een nagebootste GitHub (`mock-github.mjs`): er gaat niets naar echt GitHub.
