# Sengejagt 🛏️

Lille React-app til at holde styr på kandidater til en ny **kontinentalseng**.

**Krav til alle modeller:** min. 180×210 cm · kontinental · ingen elevation.

## Features

- Kort pr. sengemodel med prisinfo
- 3-kolonne ikonknapper: PriceRunner · Prisjagt · forhandler
- Filtrering på mærke
- Sortering på pris (senge uden kendt pris sorteres sidst)
- **"Opdater priser"-knap** der henter aktuelle priser via en serverless-funktion
  (`/api/prices`) og cacher dem lokalt med "sidst opdateret"-dato
- Beslutnings-/notespanel pr. seng (noter gemmes lokalt i browseren)

## Prisopdatering — sådan virker den

`api/prices.js` (Vercel serverless) henter hver pris-sides HTML og udtrækker
en pris via JSON-LD (`Product`/`offers`), med regex-fallback. Laveste fornuftige
pris (≥ 2.000 kr) vælges.

> ⚠️ **Skrøbeligt.** Når PriceRunner/Prisjagt ændrer layout, kan udtrækket
> holde op med at virke. For mere stabil/præcis hentning: udfyld `productUrl`
> på den enkelte seng i `src/data/beds.js` med et direkte produkt-link.

## Modeller på ønskelisten

| Model    | Mærke      | Forhandler  |
|----------|------------|-------------|
| LYA      | Temprakon  | Jysk        |
| C300     | Dunlopillo | Jysk        |
| Prestige | Jensen     | Jensen Beds |
| Supreme  | Jensen     | Jensen Beds |

Priser udfyldes i `src/data/beds.js` (feltet `price`) når de er slået op.

## Kør lokalt

```bash
npm install
npm run dev      # http://localhost:5173 — men /api virker IKKE her
npm run build    # produktionsbuild i dist/
```

For at teste **"Opdater priser"-knappen** lokalt skal serverless-funktionen
også køre — det kræver Vercel CLI:

```bash
npm i -g vercel
vercel dev       # serverer både appen og /api/prices
```

## Deploy til Vercel

Du har terminal nu, så det hurtigste flow:

```bash
git init && git add . && git commit -m "init sengejagt"
# opret et tomt repo på github.com, så:
git remote add origin <repo-url>
git push -u origin main
```

Derefter på [vercel.com](https://vercel.com): log ind med GitHub → **Import** repo'et →
deploy med standardindstillinger (Vite detekteres automatisk).

Alternativt helt uden GitHub: `npm i -g vercel && vercel`.
