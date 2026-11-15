# V2 van platformaat.be: eindrapport (15-11-2026)

Labels: **GEMETEN** (door een tool gedraaid) · **GEZIEN IN CODE** · **INSCHATTING**. Er staan geen klantnamen in dit rapport, omdat de repo publiek is.

## 1. Kort
- V2 is volledig drietalig: 38 pagina's per taal (NL, FR, EN), samen 114 pagina's, plus een taalkeuze, een 404-pagina en een sitemap met hreflang. Duits toevoegen kan door `_bron/tekst/de.mjs` te maken, `de` in TALEN te zetten en een `de`-blok in de inhoudsbestanden toe te voegen.
- De live site (main) is **niet** aangeraakt. Alles staat op de tak `v2-kopie`, map `v2/`, op noindex.
- Bekijken: dubbelklik `v2/_bron/bekijk-v2.bat`, dat http://localhost:4810/ opent.

## 2. Wat veranderde tegenover de huidige site
| Vlak | Huidig | V2 |
|---|---|---|
| Talen | Alleen NL | NL, FR (vous, voor Brussel en Wallonië) en EN, elk met een eigen adres, hreflang, vertaalde title en description, en JSON-LD per taal |
| Structuur | 45 losse HTML-bestanden, 6 CSS- en 5 JS-bestanden | Generator (`_bron/bouw.mjs`) met inhoud per pagina in `_bron/inhoud/*.mjs`, 1 CSS- en 1 JS-bestand |
| Ontwerp | Kleuren en afstanden verspreid over 6 stylesheets | Tokens, een afstandsschaal van 4px, zelf gehost lettertype, donkere modus volgens het toestel, de maatlat als eigen element |
| Cases | Echte namen en cijfers | Eigen merk plus verzonnen voorbeelden met label. Velden `echt` en `toestemming`: een echte case verschijnt pas met ingevulde toestemming (de case raamdecoratie staat klaar, maar verborgen) |
| Prijzen | Juist op de prijzenpagina | Zelfde bedragen. Op de startpagina van ronde 1 stond een fout (€ 450 als «eerste deel»), die is rechtgezet naar proces-scan, eerste deel € 3.500 en hosting € 29 |
| Formulier | Stuurt naar een echte route | Testmodus: verstuurt niets en opent het mailprogramma. Honeypot en een minimale invultijd tegen spam |
| Juridisch | Privacy, cookies, bedrijfsgegevens (NL) | Dezelfde inhoud in 3 talen. FR en EN vermelden dat de NL-tekst geldt bij verschil. Cookies: niets opgeslagen, ook geen themakeuze meer |
| Veiligheid | Geen CSP | CSP via meta (alleen eigen bronnen), referrer-beleid. Echte koppen vragen een andere host (zie 03, «later») |
| Niet overgezet | | Het interactieve voorbeeldplatform (`voorbeeld.html`, alleen NL): weggelaten. «Koppelingen met pakketten» is opgegaan in de gids over koppelingen |

## 3. Metingen oud tegenover nieuw (GEMETEN)
Tools: axe-core 4.11.3, Playwright 1.62.1 (Chromium), impeccable 4.8.2 `detect`, hallmark `sloplint` (commit 04977e1). Verzoeken naar buiten waren geblokkeerd.

### Toegankelijkheid
| | Oud (NL, 9 pagina's) | V2 (alle 115 pagina's, NL/FR/EN) |
|---|---|---|
| axe WCAG 2.2 AA, smal (390) en breed (1440) | 1 fout (contrast op 1 pagina) | 0 fouten in 230 metingen |
| axe in donkere modus | niet gemeten | 0 fouten op 24 metingen (12 paginatypes, 3 talen, smal en breed) |
| Horizontaal scrollen op de gsm | 0 | 0 |
| Interne links | niet gemeten | 3.865 links, 0 kapot |

### Toetsenbord (Playwright, Tab-toets)
- De eerste Tab gaat naar de skiplink («Naar de inhoud», «Aller au contenu», «Skip to content»). Enter springt naar `#inhoud`.
- Op elke geteste stap is de focus zichtbaar (rand van minstens 2 px) en staat het element in beeld. Getest: NL-start en FR-dienst breed, EN-start en NL-vragen op de gsm.
- Op de gsm opent het menu met Enter, en de volgende Tab gaat in het menu.
- De volgorde is logisch: logo, menu, taalkeuze, hoofdknop, inhoud, formulier.

### Schermlezer (toegankelijkheidsboom van Chromium, geen echte NVDA- of VoiceOver-test)
- Alle 114 taalpagina's hebben precies één h1, geen overgeslagen kopniveaus, header, main, nav en footer, de juiste `lang` en een label bij elk formulierveld.
- Voorbeeld van wat een schermlezer op /fr/ krijgt: de kop «Des logiciels taillés pour votre entreprise.», de links «Prendre rendez-vous» en «Appeler le 0483 85 13 22», en een regio «Ce que nous réalisons». Volledig in `meting-eind/r2-toetsen.json`.
- **Niet gedaan:** een test met een echte schermlezer (NVDA of VoiceOver) door een mens.

### Traag mobiel netwerk (CDP-emulatie, gsm 390 px, CPU 4x trager, mediaan van 3 metingen)
| Netwerk | Pagina | FCP | LCP | Volledig geladen | Gewicht |
|---|---|---|---|---|---|
| Slow 4G (150 ms, 1,6 Mbit/s) | Oud start | 1500 ms | 1500 ms | 2260 ms | 355 kB |
| | V2 start NL / FR / EN | 844 / 812 / 760 ms | idem | 1218 / 1177 / 1118 ms | 100–101 kB |
| | Oud prijzen | 1200 ms | 1200 ms | 1206 ms | 139 kB |
| | V2 prijzen NL | 728 ms | 728 ms | 966 ms | 66 kB |
| 3G (300 ms, 750 kbit/s) | Oud start | 2436 ms | 2436 ms | 4640 ms | 355 kB |
| | V2 start NL / FR / EN | 1384 / 1452 / 1340 ms | idem | 2136 / 2209 / 2084 ms | 100–101 kB |
| | Oud prijzen | 2396 ms | 2396 ms | 2451 ms | 139 kB |
| | V2 prijzen NL | 1464 ms | 1464 ms | 1938 ms | 66 kB |
INSCHATTING: de lokale server comprimeert niet. Live met gzip liggen beide lager, maar de verhouding blijft: V2 is op de startpagina ongeveer 45 % sneller tot de eerste inhoud.

### Ontwerpcontrole
| | Oud | V2 (alle pagina's) |
|---|---|---|
| impeccable `detect` | 348 bevindingen van 13 soorten | 714 bevindingen van 1 soort: «cramped-padding» bij scheidingslijnen tussen secties met 96 px binnenruimte. Het aantal groeit mee met het aantal pagina's. INSCHATTING: vals alarm. Zijstrepen, gloed, rasterachtergrond, dichtgeknepen letters en te kleine tekst zijn weg. |
| hallmark `sloplint` fails / reflex / warn | 630 / 391 / 122 (52 bestanden) | 79 / 2 / 121 (117 bestanden). 76 van de fails zijn «VAT BE …» in hoofdletters: een btw-nummer, vals alarm. Eén is de ontbrekende Hallmark-stempel (een werkconventie van de tool). Twee gaan over de 404-pagina, waarvan de lint de stylesheet niet kan volgen. De 116 warns zijn «te veel woorden per pagina» (max 450), een smaakregel van Hallmark. |

Schermafbeeldingen oud tegenover nieuw per taal staan in `eind-fotos/`, smal en breed.

## 4. Gebruikte tools (allemaal verdict «Gebruiken» in de repo-catalogus)
| Tool | Hoe gebruikt | Veiligheidsinstellingen |
|---|---|---|
| impeccable 4.8.2 | `detect --json`, met `npm --ignore-scripts` in een testmap | DO_NOT_TRACK=1, IMPECCABLE_NO_TELEMETRY=1, IMPECCABLE_NO_UPDATE_CHECK=1, geen hooks, geen `install` |
| hallmark, commit 04977e1 | Alleen `sloplint.mjs` (statisch) | `install.mjs` nagelezen en niet uitgevoerd, geen hook, vaste commit |
| Playwright 1.62.1 | Schermafbeeldingen, toetsenbord, toegankelijkheidsboom, netwerkemulatie | Bestaande Chromium, geen download, scripts uit, verkeer naar buiten geblokkeerd |
| axe-core 4.11.3 | WCAG 2.0, 2.1 en 2.2 A/AA | Vaste versie, lokaal |
| gitleaks 8.30.1 | Geheimen zoeken vóór elke push | Was al geïnstalleerd |
| humanizer, marketingskills, claude-seo, agent-skills, mattpocock | Regels gelezen en met de hand toegepast (korte zinnen, geen clichés, één hoofdactie, hreflang/JSON-LD), niet geïnstalleerd | Niets geïnstalleerd |
De testmap `02-platformaat\v2-testmap` is na de laatste meting gewist.

## 5. Wat ik NIET controleerde
- Een echte schermlezer (NVDA of VoiceOver) en een test met mensen uit de doelgroep.
- De laadtijd op de echte server en het echte netwerk: de metingen zijn lokaal, met emulatie.
- Of de FR- en EN-teksten door een moedertaalspreker nagelezen zijn: ik schreef ze zelf, natuurlijk en niet letterlijk, maar zonder tweede lezer.
- De juridische juistheid van privacy, cookies en colofon in 3 talen (geen jurist).
- De editor `/beheer/` werkt niet met V2: die is gebouwd voor de huidige platte HTML.
- De 404-pagina gebruikt vaste paden naar `/v2/`. Wordt V2 later de hoofdsite, dan moet dat `/` worden.

## 6. Wat op jouw «ja» wacht
1. **Publiceren of mergen** van V2. Een merge naar main staat binnen ±1 minuut live, ook op platformaat.be/v2/.
2. **Echte cases:** `toestemming` invullen per klant na een schriftelijke goedkeuring van tekst en cijfers. De case raamdecoratie staat klaar, maar verborgen.
3. **Umami** (Vercel fra1 + gratis Supabase Frankfurt) pas bij livegang. Daarna privacy en cookies aanpassen.
4. **Verhuizing van hosting** voor echte beveiligingskoppen (lijst «later», zie 03).
5. **Jurist:** tellen zonder banner, en of de FR- en EN-vertaling van de juridische teksten volstaat.
6. **Formulier live zetten:** de route (Brevo/Scaleway) aansluiten in plaats van de testmodus.
7. **Nalezing** van FR en EN door een moedertaalspreker (advies).
