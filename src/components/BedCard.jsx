import { useState } from 'react'
import AIAssistant from './AIAssistant.jsx'

// Ikon-knapperne: PriceRunner, Prisjagt og forhandlerens hjemmeside.
const LinkButtons = ({ bed }) => (
  <div className="card__links">
    <a href={bed.links.priceRunner} target="_blank" rel="noopener noreferrer">
      <span aria-hidden>🏷️</span>
      PriceRunner
    </a>
    <a href={bed.links.prisjagt} target="_blank" rel="noopener noreferrer">
      <span aria-hidden>🔍</span>
      Prisjagt
    </a>
    <a href={bed.retailerUrl} target="_blank" rel="noopener noreferrer">
      <span aria-hidden>🏬</span>
      {bed.retailer}
    </a>
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
          {formatPrice(bed.price)}
          {bed.priceSource && (
            <small className="card__source">via {bed.priceSource}</small>
          )}
        </span>
      </header>

      <LinkButtons bed={bed} />

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
