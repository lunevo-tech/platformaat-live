# V2 stand na ronde 1 (15-11-2026)

## Gebouwd
- `index.html`: taalkeuze. `nl/`, `fr/`, `en/`: startpagina per taal, met een eigen adres, hreflang (nl-BE, fr-BE, en, x-default), vertaalde title en description, en JSON-LD per taal.
- Eén stylesheet `css/site.css` met tokens (kleur, 4px-afstandsschaal, typeschaal) en een donkere modus volgens de systeeminstelling. Eén script `js/site.js` (alleen het formulier).
- Lettertype Hanken Grotesk, zelf gehost (OFL, licentie in `fonts/`). Eigen element: een getekende maatlat. Beweging alleen bij het laden en uit bij «minder beweging».
- Formulier in testmodus: verstuurt **niets**, opent alleen je mailprogramma. Honeypot en minimale invultijd tegen spam. CSP via meta.
- Bouwen: `node _bron/bouw.mjs`. Teksten per taal in `_bron/tekst/<taal>.mjs`. Duits later: `de.mjs` toevoegen en `de` in TALEN zetten.
- Bekijken: dubbelklik `_bron/bekijk-v2.bat`, dat http://localhost:4810/ opent.
- De oude kopie staat in `_kopie-huidig/` (niet gepubliceerd, niet gewist).

## Metingen (GEMETEN, zelfde tools en instellingen als in 01)
| | Huidig (startpagina) | V2 ronde 1 (nl, fr en en) |
|---|---|---|
| axe WCAG 2.2 AA, smal en breed | 0 | 0 (ook in de donkere modus) |
| Verzoeken | 18 | 7 |
| Gewicht | 350 kB | 94–95 kB |
| impeccable detect (hele map) | 348 | 36, allemaal «cramped-padding» bij scheidingslijnen tussen secties met 96 px binnenruimte (INSCHATTING: vals alarm) |
| hallmark sloplint fails / reflex / warn | 630 / 391 / 122 | 1 / 1 / 4. Die fail is de ontbrekende «Hallmark-stempel», een werkconventie van de tool zelf en geen ontwerpfout. |
| Talen | alleen nl | nl, fr, en |
Let op: oud = 45 pagina's, nieuw = 4 pagina's. De eindvergelijking per pagina komt na de laatste ronde.

## Nog te doen (volgende rondes)
1. Overige pagina's in 3 talen: diensten (6), prijzen, werkwijze, FAQ, sectoren, kennis/gidsen, besparingscalculator, voorbeeldplatform, 404.
2. Juridisch in 3 talen: privacy, cookies («geen toestemmingscookies»), bedrijfsgegevens/colofon.
3. Sitemap met hreflang-alternates. Menu van ankers naar pagina's.
4. Teksten nalezen met de humanizer- en marketingskills-regels, per taal.
5. Eindvergelijking oud tegenover nieuw per taal met schermafbeeldingen, eindrapport, testmap opruimen.

## Wacht op Rayane
- Echte cases en logo's in V2 of verzonnen voorbeelden (nu: verzonnen, met label).
- Bezoekers tellen: advies Umami (zie 01, punt 4).
- Alles wat publiceert of merget.
