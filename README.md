# Sengejagt 🛏️

Lille React-app til at holde styr på kandidater til en ny **kontinentalseng**.

**Krav til alle modeller:** min. 180×210 cm · kontinental · ingen elevation.

## Features

- Kort pr. sengemodel med pris + evt. tilbuds-note
- Ikon-knapper til pris-/forhandlersider (PriceRunner, Prisjagt, forhandler, seng.dk, Erling C.)
- Filtrering på mærke
- Sortering på pris (senge uden kendt pris sorteres sidst)
- **Prishistorik pr. seng** — graf + nu/lavest/højest/antal målinger
- Beslutnings-/notespanel pr. seng (noter gemmes lokalt i browseren)

## Modeller på ønskelisten

| Model    | Mærke      | Forhandler        |
|----------|------------|-------------------|
| LYA      | Temprakon  | Jysk              |
| C300     | Dunlopillo | Jysk              |
| Prestige | Jensen     | Delfin Sengecenter|
| Supreme  | Jensen     | Delfin Sengecenter|
| J5       | Jensen     | seng.dk           |
| J6       | Jensen     | seng.dk           |

## Priser og historik

Priser **vedligeholdes manuelt** i `src/data/price-history.json` — ét snapshot
pr. måling:

```json
{ "snapshots": [ { "date": "2026-06-08", "prices": { "lya": 29999, ... } } ] }
```

Appen viser seneste kendte pris pr. seng og tegner en graf over snapshots.
For at opdatere: tilføj et nyt objekt i `snapshots` med dagens dato og de
aktuelle priser, commit og push.

> **Hvorfor manuelt?** Automatisk scraping blev afprøvet (`lib/prices.js`,
> `api/prices.js`, `scripts/snapshot-prices.mjs` + GitHub Action) men viste sig
> upålidelig: Jysk blokerer bots, og seng.dk renderer priser client-side (SPA),
> så et generisk udtræk rammer forkerte tal. Koden er bevaret og Action'en kan
> køres manuelt, men det ugentlige skema er slået fra indtil udtrækket er gjort
> pålideligt (fx via produkt-specifikke selektorer).

## Kør lokalt

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # produktionsbuild i dist/
```

## Deploy til Vercel

Repo'et er koblet til Vercel — hver `git push` til `main` udløser et nyt deploy
automatisk. Framework detekteres som Vite (build: `npm run build`, output: `dist`).
