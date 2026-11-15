# V2 van platformaat.be: meting van de huidige versie en plan (15-11-2026)

Labels: **GEMETEN** (door een tool gedraaid) · **GEZIEN IN CODE** (bestanden gelezen) · **INSCHATTING**.
Deze map begint met `_`, zodat GitHub Pages (Jekyll) ze niet publiceert, ook niet na een merge (INSCHATTING op basis van het standaardgedrag van Jekyll; niet getest).

## 0. Waar staat wat
- Huidige site: `lunevo-tech/platformaat-live`, tak `main`, niet aangeraakt. Terugdraai-tag `rollback-2026-11-15-voor-v2`.
- V2: tak `v2-kopie`, map `v2/` (kopie van main 03e4fac, alle pagina's `noindex,nofollow`).
- Testmap met de tools: `02-platformaat\v2-testmap` (wordt na de metingen opgeruimd).

## 1. Gaat een merge automatisch online? Ja
- **GEMETEN:** platformaat.be wijst via de DNS bij Combell (ns1.combell.eu) rechtstreeks naar GitHub Pages (185.199.108-110.153). Antwoordkop `Server: GitHub.com`. Er zit **geen Cloudflare** tussen.
- **GEMETEN:** Pages bouwt uit `main`, map `/`, type «legacy» (Jekyll), met de automatische workflow `pages-build-deployment`.
- Gevolg: **elke merge naar main staat binnen ongeveer een minuut online**, ook de map `v2/` (dan te zien op platformaat.be/v2/). Daarom merge ik nooit zonder jouw «ja».

## 2. Meting van de huidige versie (= V2-kopie)
Tools: axe-core 4.11.3 (regels WCAG 2.0/2.1/2.2 A+AA), Playwright 1.62.1 met Chromium, impeccable 4.8.2 `detect`, hallmark `sloplint` (commit 04977e1). Smal = 390×844, breed = 1440×900. Alle verzoeken naar buiten werden geblokkeerd.

### Talen
- **GEMETEN:** alleen Nederlands. `/fr/` en `/en/` geven 404. Geen hreflang op één van de 45 pagina's. `lang="nl-BE"`.
- Dus: de FR- en EN-meting van de huidige versie is «bestaat niet».

### Toegankelijkheid (axe, 9 pagina's × 2 schermbreedtes)
- **GEMETEN:** 0 overtredingen op 8 pagina's. 1 contrastfout op `diensten/ai.html` (smal en breed). Geen horizontaal scrollen op smal scherm.
- axe vindt maar een deel van de problemen: toetsenbord, focusvolgorde en schermlezers zijn niet automatisch getest.

### Snelheid en gewicht
| Pagina | Verzoeken | Gewicht (kB) | Afbeeldingen (kB) | Lettertypes |
|---|---|---|---|---|
| Startpagina | 18 | 350 | 219 | 0 (systeemletters) |
| Werk | 16 | 334 | 218 | 0 |
| Diensten, prijzen, sector, FAQ, gids, bedrijfsgegevens | 13–14 | 134–155 | 20 | 0 |
- **GEMETEN:** de startpagina laadt 6 CSS- en 5 JS-bestanden (134 kB ongecomprimeerd). Twee logo-PNG's van 119 en 128 kB zijn samen goed voor meer dan de helft van het gewicht. Live: HTML 18 kB, met gzip 6 kB, eerste byte na 0,11 s, `Cache-Control: max-age=600`.
- **INSCHATTING:** de site is al licht. De winst zit in de logo's (SVG of AVIF/WebP) en in één CSS- en één JS-bestand in plaats van elf.

### Ontwerp
- **GEMETEN, impeccable:** 348 bevindingen (net als bij v46: de live site is dus v46 plus de editor, niet v47). Top: zijstrepen 74, sterk dichtgeknepen letterafstand 57, veelgebruikt lettertype 46, «codex»-rasterachtergrond 46, donkere gloed 44, te kleine UI-tekst 30, krappe binnenruimte 26.
- **GEMETEN, hallmark (statisch, zonder render):** 630 fails, 391 reflexen, 122 waarschuwingen over 52 bestanden. Top: kleurwaarden buiten de tokens (48: 421×), afstanden buiten een 4px-schaal (24b: 364×), middenpunt-reeksen (63: 65×), zuiver wit (7a: 46×), kopwoorden zonder `overflow-wrap` (50: 30×), gespatieerde mini-labels (67: 28×), «eyebrow»-labels boven koppen (54: 25×), h1 langer dan 7 woorden (58: 53×).
- **GEZIEN IN CODE:** kleuren en afstanden staan verspreid over 6 stylesheets (styles, themes, pages, scenes, rustig, werk), met lagen van eerdere versies. Dat verklaart het grootste deel van de hallmark-fails.

### SEO (technisch)
- **GEZIEN IN CODE:** elke pagina heeft een description, canonical en JSON-LD. Er is een sitemap en `robots.txt`. Er ontbreken hreflang en vertaalde pagina's.

### Vertrouwen, contact en juridisch
- **GEZIEN IN CODE:** de pagina's case-la-mia, case-vekemans en case-zichtbaar-media en de logo's dragen echte namen. Het contactformulier (`contact37.js`) stuurt naar een Scaleway-functie (fr-par), dus een echt adres. De afspraken lopen via cal.com. Het ondernemingsnummer staat in de footer. Er zijn een privacy- en een cookiepagina.

### Veiligheid
- **GEMETEN:** geen beveiligingskoppen (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy). GitHub Pages laat geen eigen koppen toe. Alleen een CSP via `<meta>` en een referrer-meta zijn mogelijk.
- Echte koppen vragen een andere host of Cloudflare ervoor. Dat is een DNS-wijziging, dus jouw beslissing.

## 3. Plan per vlak
| Vlak | Wat beter kan | Tool (verdict) |
|---|---|---|
| Ontwerp en merk | Eén stylesheet met tokens (kleur, afstand op een 4px-schaal, typeschaal). Zelf gehost lettertype (Fontsource-woff2). Geen zijstrepen, gloed of rasterachtergrond. Logo en kleur van PlatforMaat blijven. Eén accent voor de hoofdactie. | impeccable, hallmark (Gebruiken), awesome-design-systems als naslag, onderzoek 15 |
| Teksten en overtuiging | Kortere h1 (≤ 7 woorden), geen eyebrow-labels, concrete zinnen per sector. FR en EN apart geschreven. | humanizer-regels, marketingskills (copywriting, page-cro) met de hand toegepast (Gebruiken) |
| Structuur en navigatie | `/nl/`, `/fr/`, `/en/` met dezelfde paginaboom. Taalkeuze in de kop van elke pagina. Plaats voor `/de/` later. Minder pagina's in het hoofdmenu. | agent-skills/mattpocock-werkwijze (Gebruiken) |
| Mobiel | Tikdoelen ≥ 44 px, telefoonnummer en hoofdknop altijd bereikbaar, geen horizontaal scrollen | Playwright-schermafbeeldingen (Gebruiken) |
| Snelheid | 1 CSS + 1 JS, logo's als SVG, AVIF/WebP, lettertype met preload en `font-display: swap` | Playwright-meting |
| Toegankelijkheid | WCAG 2.2 AA: contrast, focus zichtbaar, skiplink, landmarks, `lang` per taal, `prefers-reduced-motion` | axe-core (Gebruiken) |
| SEO | hreflang (nl-BE, fr-BE, en, x-default), vertaalde title en description, sitemap met alternates, JSON-LD per taal | claude-seo-regels, alleen lokaal (Gebruiken, proef) |
| Vertrouwen | In V2 geen echte klantnamen. Cases worden verzonnen voorbeelden met het label «voorbeeld», tot jij anders beslist. Ondernemingsnummer, adres, vaste prijzen en «wat als ik uitval» blijven zichtbaar. | onderzoek 04 en 15 |
| Contact | Formulier met maximaal 4 velden. In V2 verstuurt het **niets** (testmodus met melding). Telefoon en afspraak als alternatief. | — |
| Juridisch | Privacyverklaring, cookieverklaring («geen toestemmingscookies») en colofon met ondernemingsnummer, in 3 talen | let-op-juridisch (GBA-lijn) |
| Veiligheid | CSP via meta, `rel="noopener"`, honeypot plus tijdcontrole tegen spam in het formulier, gitleaks op de tak | gitleaks (Gebruiken) |
| Meten | Nu niets in V2. Keuze Umami of Cloudflare Web Analytics: zie 4. | — |
| Beweging | Eén korte animatie bij het laden en bij muis of tik, nooit pas na scrollen, uit bij reduced motion. Een HyperFrames-video pas later. | CSS, gsap-skills alleen als CSS niet volstaat |

## 4. Bezoekers tellen: Umami of Cloudflare Web Analytics
| | Umami | Cloudflare Web Analytics |
|---|---|---|
| Licentie | MIT, open source (catalogus: Later) | Gesloten dienst, gratis (niet in de catalogus) |
| Cookies of lokale opslag | Geen cookies volgens de eigen FAQ (SAMENVATTING) | «geen client-side state zoals cookies of localStorage», geen fingerprinting (SAMENVATTING, cloudflare.com) |
| Waar staan de gegevens | Zelf hosten (eigen server plus PostgreSQL) of Umami Cloud: gratis «Hobby» tot 100k gebeurtenissen per maand, servers in de VS en de EU (SAMENVATTING, umami.is/pricing; of je de EU kunt kiezen, staat er niet) | Cloudflare, een Amerikaans bedrijf. Omdat de site niet via Cloudflare loopt, laadt een script van static.cloudflareinsights.com en gaan de gegevens naar cloudflareinsights.com. |
| Wat ik niet las | Hoe Umami met IP-adressen omgaat; de voorwaarden en DPA van Umami Cloud | De DPA en de bewaring van IP-adressen bij Cloudflare |
| GBA-lijn | Cookieloos tellen zonder banner blijft volgens onze eigen let-op-lijst [jurist]. Dat geldt voor allebei. | idem |

**Advies in één zin:** kies Umami (Cloud met EU-servers, of later zelf gehost), omdat het open source is, nagekeken kan worden en zonder Amerikaanse derde kan draaien; Cloudflare WA alleen als je ooit toch Cloudflare voor de hele site neemt. Jij beslist. Er komt niets in V2 vóór je «ja».

## 5. Wat ik NIET controleerde
- Echte laadtijd via een mobiel netwerk: de lokale tijden (40–240 ms) zijn niet representatief. Lighthouse en PageSpeed heb ik niet gedraaid.
- Toetsenbord en schermlezer met de hand.
- Hallmark met render (`--render`), en impeccable `critique`/`audit` als skill: die vragen een installatie als skill met hooks, wat niet afgesproken is. Ik pas hun regels met de hand toe.
- De juridische juistheid van de teksten (geen jurist).
