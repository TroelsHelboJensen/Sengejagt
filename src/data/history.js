import historyData from './price-history.json'

const snapshots = historyData.snapshots ?? []

// Seneste kendte (ikke-null) pris pr. seng, set hen over alle snapshots.
export function latestPrices() {
  const result = {}
  for (const snap of snapshots) {
    for (const [id, price] of Object.entries(snap.prices ?? {})) {
      if (price != null) {
        result[id] = price
      }
    }
  }
  return result
}

// Tidsserie for én seng: kun datapunkter hvor prisen er kendt.
export function seriesFor(id) {
  return snapshots
    .filter((snap) => snap.prices?.[id] != null)
    .map((snap) => ({ date: snap.date, price: snap.prices[id] }))
}
