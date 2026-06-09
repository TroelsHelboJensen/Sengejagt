import { useState } from 'react'

const formatPrice = (price) =>
  price == null
    ? '—'
    : new Intl.NumberFormat('da-DK', {
        style: 'currency',
        currency: 'DKK',
        maximumFractionDigits: 0,
      }).format(price)

// "Slå priser op": ét klik henter aktuelle priser fra kilderne (/api/prices)
// og VISER dem. Gemmer intet — du indtaster selv tallene pr. seng i admin.
// (Scraping er skrøbelig; tomme felter = ingen pris fundet.)
export default function PriceLookup() {
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)

  const lookup = async () => {
    setStatus('loading')
    setError(null)
    try {
      const res = await fetch('/api/prices')
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()
      setResults(data.results ?? [])
      setStatus('done')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="lookup">
      <button
        className="lookup__btn"
        onClick={lookup}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? '⏳ Slår priser op…' : '🔄 Slå priser op'}
      </button>

      {status === 'error' && (
        <p className="lookup__error">
          Kunne ikke hente priser: {error}. (Virker kun på det deployede site —
          ikke i lokal <code>npm run dev</code>.)
        </p>
      )}

      {status === 'done' && (
        <div className="lookup__panel">
          <p className="lookup__hint">
            Aktuelle priser fra kilderne — indtast dem manuelt pr. seng i admin
            under <strong>Pris-historik</strong>. Tomme = ingen pris fundet.
          </p>
          <table className="lookup__table">
            <tbody>
              {results.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td className="lookup__price">{formatPrice(row.price)}</td>
                  <td className="lookup__src">{row.source ?? 'ingen kilde'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
