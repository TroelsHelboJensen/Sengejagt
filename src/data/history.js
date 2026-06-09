// Pris-historik udledes nu fra hver sengs egen `priceHistory` (i bed-filerne),
// så priser kan opdateres pr. seng direkte i admin. API'et er uændret, så
// App.jsx og BedCard.jsx ikke skal røres.

import { beds } from './beds.js'

const historyOf = (bed) =>
  (bed?.priceHistory ?? []).filter((point) => point && point.price != null)

// Tidsserie for én seng: kun datapunkter hvor prisen er kendt, ældste først.
export function seriesFor(id) {
  const bed = beds.find((b) => b.id === id)
  return historyOf(bed)
    .map((point) => ({ date: point.date, price: point.price }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

// Seneste kendte pris pr. seng.
export function latestPrices() {
  const result = {}
  for (const bed of beds) {
    const series = seriesFor(bed.id)
    if (series.length) {
      result[bed.id] = series[series.length - 1].price
    }
  }
  return result
}

// Nyeste dato på tværs af alle senges pris-historik (eller null).
export function latestSnapshotDate() {
  let latest = null
  for (const bed of beds) {
    for (const point of historyOf(bed)) {
      if (latest == null ||
        point.date > latest) {
        latest = point.date
      }
    }
  }
  return latest
}
