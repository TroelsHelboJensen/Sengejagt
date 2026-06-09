# Sengejagt 🛏️

Lille React-app til at holde styr på kandidater til en ny **kontinentalseng**.

**Krav til alle modeller:** min. 180×210 cm · kontinental · ingen elevation.

## Features

- Kort pr. sengemodel med pris + evt. tilbuds-note
- Ikon-knapper til pris-/forhandlersider (PriceRunner, Prisjagt, forhandler)
- Filtrering på mærke + sortering på pris (senge uden kendt pris sorteres sidst)
- **Prishistorik pr. seng** — graf + nu/lavest/højest/antal målinger
- **"Set & afprøvet"-sektion** — log over produkter vi har set/prøvet (billede, vurdering 1–10, note, hvor/hvornår)
- **"🔄 Slå priser op"-knap** — henter aktuelle priser og viser dem (gemmer intet)
- **Admin på `/admin`** (Decap CMS) til at redigere senge, "set & afprøvet" og krav
- **Skjul senge fra siden** via admin-feltet "Skjul fra siden" (sengen beholdes i admin)
- Beslutnings-/notespanel pr. seng (noter gemmes lokalt i browseren)

## Modeller på ønskelisten

Hver seng er sin egen fil i `src/data/beds/<id>.json`. **Jensen J5 = Prestige og
J6 = Supreme** (samme seng, to navne) — derfor 4 modeller, ikke 6.

| Model         | Mærke      | Forhandler            |
|---------------|------------|-----------------------|
| LYA           | Temprakon  | Jysk                  |
| C300          | Dunlopillo | Jysk                  |
| Prestige (J5) | Jensen     | time2sleep / seng.dk  |
| Supreme (J6)  | Jensen     | time2sleep / seng.dk  |

## Priser og historik

Priser **vedligeholdes manuelt pr. seng** i hver bed-fils `priceHistory` (dato
+ pris):

```json
"priceHistory": [ { "date": "2026-06-08", "price": 29999 } ]
```

Appen viser seneste kendte pris pr. seng og tegner en graf over historikken.
For at opdatere: åbn sengen i admin (eller rediger filen) og tilføj en ny
række i **Pris-historik** med dagens dato og prisen.

**"Slå priser op"-knappen** på forsiden henter aktuelle priser fra kilderne
(`/api/prices` → `lib/prices.js`) og **viser** dem, så du hurtigt kan slå op —
men den gemmer intet; du indtaster selv tallene pr. seng. Knappen virker kun på
det deployede site (Vercel-funktionen), ikke i lokal `npm run dev`.

> **Hvorfor manuelt?** Automatisk scraping blev afprøvet men viste sig
> upålidelig: Jysk blokerer bots, og seng.dk renderer priser client-side (SPA),
> så et generisk udtræk rammer forkerte tal. Derfor er priser manuelle, og
> opslags-knappen viser kun tal til inspiration frem for at gemme dem blindt.

## Admin-side (Decap CMS)

Hver seng er sin egen fil i **`src/data/beds/<id>.json`** (krav til modeller i
`src/data/requirements.json`). De redigeres enten direkte i filerne eller via en
admin-side på **`/admin`** (Decap CMS), der viser sengene som en liste med en
"Ny Seng"-knap. Admin'en committer ændringerne til repoet, hvorefter Vercel
automatisk genbygger — så en opdatering er live efter ~1 minut.

Loaderne samler filerne: `src/data/beds.js` (browser, via Vites
`import.meta.glob`) og `src/data/beds.node.mjs` (Node — bruges af `api/` — via
`fs`). Begge genbruger pris-link-logikken i `src/data/resolve-bed.js`.

### Tilføj en ny seng (link + screenshot → Claude udfylder)

Automatisk scraping er upålidelig, så i stedet:

1. Opret sengen i admin med kun **`sourceUrl`** (produktside-link) og et
   **`image`** (screenshot af produktsiden). Giv den et `id`.
2. Bed **Claude** udfylde resten: Claude åbner linket og *læser screenshottet*
   (virker selv når siden blokerer bots/er en SPA) og udfylder model, mærke,
   pris, fjeder-specs og anmeldelser.
3. Er det en **ny producent** (mærke der ikke allerede er på en seng), tilføjer
   Claude producentens hjemmeside som et link på produktet.

`sourceUrl` vises på kortet som en **🔗 Produktside**-knap.

**Login** sker med en **GitHub-konto**, og adgang styres af hvem der er
*collaborator* på repoet. OAuth håndteres af `api/auth.js` + `api/callback.js`
(Decap kan ikke bruge Netlifys gratis-login, da vi hoster på Vercel).

### Engangsopsætning

1. **Opret en GitHub OAuth App** — GitHub → Settings → Developer settings →
   OAuth Apps → *New OAuth App*:
   - *Homepage URL:* `https://<dit-domæne>.vercel.app`
   - *Authorization callback URL:* `https://<dit-domæne>.vercel.app/api/callback`
2. **Læg client-id og secret i Vercel** (Project → Settings → Environment Variables):
   - `OAUTH_GITHUB_CLIENT_ID`
   - `OAUTH_GITHUB_CLIENT_SECRET`
3. **Sæt dit domæne** i `public/admin/config.yml` under `backend.base_url`.
4. Deploy. Åbn `https://<dit-domæne>.vercel.app/admin` og log ind med GitHub.

### Rediger lokalt uden OAuth

I `public/admin/config.yml`: sæt `local_backend: true`, kør `npx decap-server` i
ét terminalvindue og `npm run dev` i et andet, og åbn
`http://localhost:5173/admin`.

## Kør lokalt

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # produktionsbuild i dist/
```

## Deploy til Vercel

Repo'et er koblet til Vercel — hver `git push` til `main` udløser et nyt deploy
automatisk. Framework detekteres som Vite (build: `npm run build`, output: `dist`).
