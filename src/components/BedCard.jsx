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
          {bed.note && <small className="card__source">{bed.note}</small>}
        </span>
      </header>

      <LinkButtons links={bed.links} />

      <PriceHistory series={seriesFor(bed.id)} />

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
