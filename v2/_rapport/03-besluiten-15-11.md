# Besluiten Rayane 15-11-2026 en uitwerking

Geen klantnamen in dit rapport: de repo is publiek.

## 1. Cases en logo's
- **Besluit:** V2 gebruikt verzonnen voorbeelden met het label «voorbeeld». Die worden nooit als echte klant voorgesteld.
- **Bouw (ronde 2):** elk voorbeeld krijgt in `_bron/tekst/<taal>.mjs` de velden `echt: false` en `toestemming: ''` (datum en vorm van de schriftelijke toestemming). De bouw toont een echte naam en een echt logo alleen als `echt: true` én `toestemming` is ingevuld. Anders blijven het label en een neutrale naam staan.
- De lijst van echte namen en logo's op de live site kreeg Rayane in de chat (twee klanten plus het eigen zustermerk).

## 2. Umami (ja, maar pas inbouwen bij livegang van V2)
- **Kan het op Vercel (Frankfurt) met Supabase (Frankfurt)?** Ja, op papier. Umami vraagt PostgreSQL vanaf v12.14 via `DATABASE_URL` (GEZIEN, README van umami-software/umami). Supabase is PostgreSQL. De Supabase-regio eu-central-1 (Frankfurt) en de Vercel-functieregio fra1 bestaan (EIGEN KENNIS, niet nagelezen). Niet getest: of de databankmigraties van Umami via de Supabase-pooler werken. Vermoedelijk is voor de eerste build een directe verbinding nodig (INSCHATTING).
- **Wat het kost (SAMENVATTING van de prijspagina's, 15-11-2026):**
  - Vercel: Hobby $0, Pro $20 per maand per ontwikkelaar. Hobby is volgens mijn kennis alleen voor niet-commercieel gebruik (EIGEN KENNIS, op de fair-use-pagina niet teruggevonden). Volgens 04-websiteplan heb je al Vercel Pro, dus vermoedelijk €0 extra.
  - Supabase: gratis 500 MB en 2 actieve projecten, pauzeert na 1 week zonder activiteit. Pro vanaf $25 per maand.
  - Umami zelf: MIT, gratis. Alternatief zonder eigen beheer: Umami Cloud Hobby, gratis tot 100k gebeurtenissen per maand, servers in de VS en de EU.
- **Veiligheid:** wijzig meteen het standaardaccount (admin/umami) en zet een sterk wachtwoord op het dashboard. Sluit de verwerkersovereenkomsten (DPA) van Vercel en Supabase af (niet gelezen).
- **Advies in één zin:** draai Umami op je bestaande Vercel Pro (fra1) met een gratis Supabase-project in Frankfurt, wat ongeveer €0 extra kost; overschrijd je 500 MB of wil je geen beheer, neem dan Supabase Pro ($25 per maand) of Umami Cloud.

## 3. Juristlijst (toegevoegd)
- **Tellen zonder banner:** mag Umami (cookieloos, geen lokale opslag) in België draaien zonder toestemmingsbanner? Welke AVG-grondslag geldt (gerechtvaardigd belang?), wat moet in de privacyverklaring, en hoe zit het met het IP-adres dat Umami verwerkt? De cookie-checklist van de GBA zegt dat bezoekers tellen «in beginsel» niet vrijgesteld is (zie let-op-juridisch, punt 13).

## 4. Lijst «later»: weg van GitHub Pages voor beveiligingskoppen
Niet nu, alleen de voor- en nadelen (INSCHATTING, niet getest):
| | Blijven op GitHub Pages | Cloudflare Pages | Vercel |
|---|---|---|---|
| Echte koppen (CSP, HSTS, X-Frame-Options) | Nee, alleen CSP via meta | Ja, via een `_headers`-bestand | Ja, via `vercel.json` |
| Kosten | Gratis | De gratis laag volstaat voor een statische site | Pro, dat je al hebt (commercieel gebruik) |
| Werk | Geen | DNS bij Combell aanpassen. De bouw blijft statisch. | Een DNS-record bij Combell. De bouw blijft statisch. Umami kan in hetzelfde account. |
| Risico | Geen koppen, Jekyll-verwerking | Amerikaanse dienst, nieuwe account en DPA | Amerikaanse dienst, alles bij één leverancier |
| Editor /beheer/ | Werkt nu met GitHub | Moet nagekeken worden | Moet nagekeken worden |

Mijn voorkeur als je ooit verhuist: Vercel, omdat Umami daar ook komt en je het account al hebt. Jij beslist. Het is een DNS-wijziging, dus alleen op jouw «ja».
