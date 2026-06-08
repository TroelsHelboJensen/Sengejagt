import { useState } from 'react'
import AIAssistant from './AIAssistant.jsx'
import PriceHistory from './PriceHistory.jsx'
import { seriesFor } from '../data/history.js'

// Ikon-knapper til pris-/forhandlersider (PriceRunner, Prisjagt, seng.dk …).
const LinkButtons = ({ links }) => (
  <div className="card__links">
    {links.map((link) => (
      <a
        key={link.label}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span aria-hidden>{link.icon}</span>
        {link.label}
      </a>
    ))}
  </div>
)

const formatPrice = (price) =>
  price == null
    ? 'Pris ikke slået op'
    : new Intl.NumberFormat('da-DK', {
        style: 'currency',
        currency: 'DKK',
        maximumFractionDigits: 0,
      }).format(price)

// Rabat i % ud fra normalpris (bed.price) og tilbudspris (bed.salePrice).
const discount = (bed) =>
  bed.price != null && bed.salePrice != null && bed.salePrice < bed.price
    ? Math.round((1 - bed.salePrice / bed.price) * 100)
    : null

// Anmeldelser: rating-chip (hvis kendt), kort vurdering og kilde-links.
const Reviews = ({ reviews }) => (
  <div className="card__reviews">
    {reviews.rating != null && (
      <span className="card__rating">
        ★ {reviews.rating.toString().replace('.', ',')}
        {reviews.count ? ` (${reviews.count}+)` : ''}
      </span>
    )}
    <p className="card__verdict">{reviews.verdict}</p>
    <div className="card__review-links">
      {reviews.sources.map((s) => (
        <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">
          {s.icon} {s.label}
        </a>
      ))}
    </div>
  </div>
)

export default function BedCard({ bed }) {
  const [open, setOpen] = useState(false)

  return (
    <article className="card">
      <header className="card__header">
        <div>
          <h2 className="card__model">{bed.model}</h2>
          <p className="card__brand">{bed.brand}</p>
        </div>
        <span className="card__price">
          {bed.salePrice != null ? (
            <>
              <span className="card__sale">{formatPrice(bed.salePrice)}</span>
              {bed.price != null && (
                <span className="card__list">
                  <s>{formatPrice(bed.price)}</s>
                  {discount(bed) != null && (
                    <em className="card__discount">−{discount(bed)}%</em>
                  )}
                </span>
              )}
            </>
          ) : (
            formatPrice(bed.price)
          )}
          {bed.note && <small className="card__source">{bed.note}</small>}
        </span>
      </header>

      {bed.spring && <p className="card__spec">{bed.spring}</p>}

      <LinkButtons links={bed.links} />

      <PriceHistory series={seriesFor(bed.id)} />

      {bed.reviews && <Reviews reviews={bed.reviews} />}

      <button
        className="card__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? 'Skjul beslutningshjælp' : 'Beslutningshjælp'}
      </button>

      {open && <AIAssistant bed={bed} />}
    </article>
  )
}
