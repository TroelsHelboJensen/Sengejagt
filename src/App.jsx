import { useEffect, useMemo, useState } from 'react'
import { beds, requirements } from './data/beds.js'
import BedCard from './components/BedCard.jsx'

const ALL_BRANDS = 'Alle mærker'
const PRICE_STORE = 'sengejagt:prices'

// Prisopdatering er midlertidigt slået fra (backend-udtrækket er endnu
// ikke verificeret mod de rigtige sider). Sæt til true for at aktivere.
const PRICE_UPDATE_ENABLED = false

export default function App() {
  const [brand, setBrand] = useState(ALL_BRANDS)
  const [sort, setSort] = useState('none')

  // Hentede priser (overlay oven på de statiske bed-data) + metadata.
  const [priceData, setPriceData] = useState({})
  const [lastUpdated, setLastUpdated] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [message, setMessage] = useState('')

  // Indlæs cachede priser fra forrige opdatering.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PRICE_STORE) ?? 'null')
      if (saved) {
        setPriceData(saved.prices ?? {})
        setLastUpdated(saved.updatedAt ?? null)
      }
    } catch {
      // ignorér korrupt cache
    }
  }, [])

  const updatePrices = async () => {
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/prices')
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()

      const prices = {}
      for (const r of data.results ?? []) {
        if (r.ok && r.price != null) {
          prices[r.id] = { price: r.price, source: r.source }
        }
      }

      setPriceData(prices)
      setLastUpdated(data.updatedAt)
      localStorage.setItem(
        PRICE_STORE,
        JSON.stringify({ prices, updatedAt: data.updatedAt }),
      )

      const found = Object.keys(prices).length
      setStatus('idle')
      setMessage(`Opdaterede ${found} af ${beds.length} priser.`)
    } catch (err) {
      setStatus('error')
      setMessage(
        `Kunne ikke hente priser (${err.message}). ` +
          'Kører du lokalt, så brug "vercel dev" — Vite alene serverer ikke /api.',
      )
    }
  }

  const brands = useMemo(
    () => [ALL_BRANDS, ...new Set(beds.map((b) => b.brand))],
    [],
  )

  // Flet hentede priser ind i bed-data.
  const merged = useMemo(
    () =>
      beds.map((b) => ({
        ...b,
        price: priceData[b.id]?.price ?? b.price,
        priceSource: priceData[b.id]?.source ?? null,
      })),
    [priceData],
  )

  const visible = useMemo(() => {
    const filtered =
      brand === ALL_BRANDS ? merged : merged.filter((b) => b.brand === brand)

    if (sort === 'none') {
      return filtered
    }

    // Senge uden kendt pris sorteres altid sidst.
    return [...filtered].sort((a, b) => {
      if (a.price == null) {
        return 1
      }
      if (b.price == null) {
        return -1
      }
      return sort === 'asc' ? a.price - b.price : b.price - a.price
    })
  }, [merged, brand, sort])

  const updatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleString('da-DK', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : 'aldrig'

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

        <div className="app__update">
          <button
            className="app__update-btn"
            onClick={updatePrices}
            disabled={!PRICE_UPDATE_ENABLED || status === 'loading'}
            title={
              PRICE_UPDATE_ENABLED ? undefined : 'Prisopdatering kommer snart'
            }
          >
            {status === 'loading' ? 'Opdaterer…' : '↻ Opdater priser'}
          </button>
          <span className="app__updated">
            {PRICE_UPDATE_ENABLED
              ? `Sidst opdateret: ${updatedLabel}`
              : 'Prisopdatering kommer snart'}
          </span>
        </div>
      </div>

      {message && (
        <p className={`app__msg ${status === 'error' ? 'app__msg--err' : ''}`}>
          {message}
        </p>
      )}

      <main className="app__grid">
        {visible.map((bed) => (
          <BedCard key={bed.id} bed={bed} />
        ))}
      </main>
    </div>
  )
}
