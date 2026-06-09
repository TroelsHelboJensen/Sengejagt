// Browser-loader (Vite). Læser hver seng-fil i src/data/beds/*.json via
// import.meta.glob og samler dem via toBedList (frasorterer skjulte, bygger
// links, sorterer).
//
// Senge redigeres via admin-siden på /admin (Decap CMS) eller direkte i
// JSON-filerne. Hver seng er sin egen fil i src/data/beds/.
//
// Priser vedligeholdes MANUELT pr. seng i hver bed-fils `priceHistory`
// (dato + pris); nyeste punkt vises på siden. Automatisk scraping er opgivet
// (Jysk blokerer bots, seng.dk/time2sleep er SPA'er).
//
// NB: Jensen J5 = Prestige og J6 = Supreme (samme seng, to navne).

import { toBedList } from './resolve-bed.js'
import requirements from './requirements.json'

export { requirements }

const modules = import.meta.glob('./beds/*.json', { eager: true })

// toBedList frasorterer skjulte senge, tilføjer links og sorterer.
export const beds = toBedList(
  Object.values(modules).map((module) => module.default ?? module),
)
