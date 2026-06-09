// Browser-loader (Vite). Læser hver seng-fil i src/data/beds/*.json via
// import.meta.glob og genskaber pris-links. Node-kontekster (api/, scripts/)
// bruger i stedet beds.node.mjs, da import.meta.glob er Vite-specifik.
//
// Senge redigeres via admin-siden på /admin (Decap CMS) eller direkte i
// JSON-filerne. Hver seng er sin egen fil i src/data/beds/.
//
// Priser vedligeholdes MANUELT pr. seng i hver bed-fils `priceHistory`
// (dato + pris). Nyeste punkt vises på siden. "Slå priser op"-knappen kan
// hente aktuelle priser til inspiration, men gemmer intet — automatisk
// scraping er opgivet (Jysk blokerer bots, seng.dk/time2sleep er SPA'er).
//
// NB: Jensen J5 = Prestige og J6 = Supreme (samme seng, to navne).

import { resolveBed, byOrder } from './resolve-bed.js'
import requirements from './requirements.json'

export { requirements }

const modules = import.meta.glob('./beds/*.json', { eager: true })

// Senge med `hidden: true` er skjult fra det offentlige site (men beholdes i
// admin). Resten vises, sorteret efter `order`.
export const beds = Object.values(modules)
  .map((module) => module.default ?? module)
  .filter((bed) => !bed.hidden)
  .map(resolveBed)
  .sort(byOrder)
