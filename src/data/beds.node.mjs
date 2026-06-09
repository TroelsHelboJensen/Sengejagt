// Node-loader. Samme data som browser-loaderen (beds.js), men læser
// src/data/beds/*.json via fs i stedet for Vites import.meta.glob.
// Bruges af api/prices.js og scripts/snapshot-prices.mjs.

import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolveBed, byOrder } from './resolve-bed.js'

const bedsDir = fileURLToPath(new URL('./beds/', import.meta.url))
const requirementsPath = fileURLToPath(new URL('./requirements.json', import.meta.url))

export const requirements = JSON.parse(readFileSync(requirementsPath, 'utf8'))

export const beds = readdirSync(bedsDir)
  .filter((name) => name.endsWith('.json'))
  .map((name) => JSON.parse(readFileSync(bedsDir + name, 'utf8')))
  .map(resolveBed)
  .sort(byOrder)
