import { useMemo, useState } from 'react'
import { beds, requirements } from './data/beds.js'
import { latestPrices, latestSnapshotDate } from './data/history.js'
import BedCard from './components/BedCard.jsx'
import SeenList from './components/SeenList.jsx'

const ALL_BRANDS = 'Alle mærker'

export default function App() {
  const [brand, setBrand] = useState(ALL_BRANDS)
  const [sort, setSort] = useState('none')

  const brands = useMemo(
    () => [ALL_BRANDS, ...new Set(beds.map((b) => b.brand))],
    [],
  )

  // Vist pris = seneste kendte pris fra prishistorikken.
  const historyPrices = useMemo(() => latestPrices(), [])
  const updated = latestSnapshotDate()

  const merged = useMemo(
    () => beds.map((b) => ({ ...b, price: historyPrices[b.id] ?? null })),
    [historyPrices],
  )

  const visible = useMemo(() => {
    const filtered =
      brand === ALL_BRANDS ? merged : merged.filter((b) => b.brand === brand)

    if (sort === 'none') {
      return filtered
    }

    // Sortér efter den pris man faktisk betaler (tilbud hvis det findes).
    // Senge uden kendt pris sorteres altid sidst.
    const effective = (bed) => bed.salePrice ?? bed.price
    return [...filtered].sort((a, b) => {
      if (effective(a) == null) {
        return 1
      }
      if (effective(b) == null) {
        return -1
      }
      return sort === 'asc'
        ? effective(a) - effective(b)
        : effective(b) - effective(a)
    })
  }, [merged, brand, sort])

  return (
    <div className="app">
      <header className="app__header">
        <h1>🛏️ Sengejagt</h1>
        <p className="app__req">
          {requirements.type} · min. {requirements.minWidth}×
          {requirements.minLength} cm · ingen elevation
        </p>
      </header>

      <div className="app__controls">
        <label>
          Mærke
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sortér efter pris
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="none">Ingen</option>
            <option value="asc">Lavest først</option>
            <option value="desc">Højest først</option>
          </select>
        </label>

        <span className="app__updated">
          Priser sidst opdateret: {updated ?? 'aldrig'}
        </span>
      </div>

      <main className="app__grid">
        {visible.map((bed) => (
          <BedCard key={bed.id} bed={bed} />
        ))}
      </main>

      <SeenList />
    </div>
  )
}
