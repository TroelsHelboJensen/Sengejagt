// Delt transform: en rå seng (fra JSON) → en seng med færdige links.
// Bruges af browser-loaderen (beds.js), så logikken kun findes ét sted.
//
// Et `priceQuery` genererer automatisk PriceRunner- + Prisjagt-søgelinks,
// som lægges foran sengens evt. eksplicitte forhandler-links.

const priceRunner = (query) => ({
  label: 'PriceRunner',
  icon: '🏷️',
  url: `https://www.pricerunner.dk/search?q=${encodeURIComponent(query)}`,
})

const prisjagt = (query) => ({
  label: 'Prisjagt',
  icon: '🔍',
  url: `https://www.prisjagt.dk/search?search=${encodeURIComponent(query)}`,
})

export function resolveBed(bed) {
  const searchLinks = bed.priceQuery
    ? [priceRunner(bed.priceQuery), prisjagt(bed.priceQuery)]
    : []
  // Kilde-/produktside-linket vises som en knap, hvis det er udfyldt.
  const sourceLink = bed.sourceUrl
    ? [{ label: 'Produktside', icon: '🔗', url: bed.sourceUrl }]
    : []
  return {
    ...bed,
    links: [...searchLinks, ...(bed.links ?? []), ...sourceLink],
  }
}

// Stabil visnings-rækkefølge: efter `order` (lavest først), senge uden sidst.
export function byOrder(a, b) {
  return (a.order ?? 999) - (b.order ?? 999)
}

// Rå seng-liste → de senge der skal VISES offentligt: skjulte (`hidden`)
// frasorteres, resten får færdige links og sorteres.
// NB: admin (Decap) læser JSON-filerne direkte og viser stadig ALLE senge.
export function toBedList(rawBeds) {
  return rawBeds
    .filter((bed) => !bed.hidden)
    .map(resolveBed)
    .sort(byOrder)
}
