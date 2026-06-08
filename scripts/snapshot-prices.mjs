// Henter aktuelle priser og tilføjer et snapshot til price-history.json.
// Køres af GitHub Action'en (.github/workflows/update-prices.yml) på skema.
//
// Kør lokalt: node scripts/snapshot-prices.mjs
//
// Ét snapshot pr. dato: køres scriptet flere gange samme dag, overskrives
// dagens snapshot i stedet for at tilføje dubletter.

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { beds } from '../src/data/beds.js'
import { resolveAllPrices } from '../lib/prices.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const historyPath = join(root, 'src', 'data', 'price-history.json')

const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

const results = await resolveAllPrices(beds)
const prices = Object.fromEntries(results.map((r) => [r.id, r.price]))

const history = JSON.parse(await readFile(historyPath, 'utf8'))
const snapshots = history.snapshots ?? []

const last = snapshots[snapshots.length - 1]
if (last?.date === today) {
  last.prices = prices
} else {
  snapshots.push({ date: today, prices })
}

history.snapshots = snapshots
await writeFile(historyPath, JSON.stringify(history, null, 2) + '\n')

const found = results.filter((r) => r.ok).length
console.log(`Snapshot ${today}: ${found}/${beds.length} priser fundet.`)
console.log(JSON.stringify(prices, null, 2))
