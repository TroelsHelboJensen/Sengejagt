// Lille prishistorik-graf (inline SVG, ingen afhængigheder).
// `series` er en sorteret liste af { date, price }.

const W = 240
const H = 48
const PAD = 4

const fmt = (price) =>
  new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
    maximumFractionDigits: 0,
  }).format(price)

export default function PriceHistory({ series }) {
  if (!series || series.length === 0) {
    return <p className="history__empty">Ingen prishistorik endnu.</p>
  }

  const prices = series.map((p) => p.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const latest = prices[prices.length - 1]
  const span = max - min || 1

  // Med kun ét datapunkt tegnes ingen linje — bare nøgletallene.
  const points =
    series.length > 1
      ? series
          .map((p, i) => {
            const x = PAD + (i / (series.length - 1)) * (W - 2 * PAD)
            const y = H - PAD - ((p.price - min) / span) * (H - 2 * PAD)
            return `${x.toFixed(1)},${y.toFixed(1)}`
          })
          .join(' ')
      : null

  return (
    <div className="history">
      {points && (
        <svg
          className="history__chart"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label="Prisudvikling"
        >
          <polyline
            points={points}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
          />
        </svg>
      )}
      <dl className="history__stats">
        <div>
          <dt>Nu</dt>
          <dd>{fmt(latest)}</dd>
        </div>
        <div>
          <dt>Lavest</dt>
          <dd>{fmt(min)}</dd>
        </div>
        <div>
          <dt>Højest</dt>
          <dd>{fmt(max)}</dd>
        </div>
        <div>
          <dt>Målinger</dt>
          <dd>{series.length}</dd>
        </div>
      </dl>
    </div>
  )
}
