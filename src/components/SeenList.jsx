import { seen } from '../data/seen.js'

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat('da-DK', { dateStyle: 'medium' }).format(
        new Date(date),
      )
    : null

// Egen sektion på forsiden: produkter vi har set/prøvet + vores indtryk.
// Skjules helt hvis der ingen poster er endnu.
export default function SeenList() {
  if (!seen.length) {
    return null
  }

  return (
    <section className="seen">
      <h2 className="seen__title">👀 Set &amp; afprøvet</h2>
      <div className="seen__grid">
        {seen.map((item) => {
          const meta = [item.hvor, formatDate(item.hvornaar)]
            .filter(Boolean)
            .join(' · ')
          return (
            <article
              key={`${item.produkt}-${item.hvornaar ?? ''}`}
              className="card seen__card"
            >
              {item.billede && (
                <img
                  className="seen__img"
                  src={item.billede}
                  alt={item.produkt}
                  loading="lazy"
                />
              )}
              <header className="card__header">
                <div>
                  <h3 className="card__model">{item.produkt}</h3>
                  {item.maerke && <p className="card__brand">{item.maerke}</p>}
                </div>
                {item.vurdering != null && (
                  <span className="card__rating">{item.vurdering}/10</span>
                )}
              </header>

              {item.synes && <p className="card__verdict">{item.synes}</p>}

              {meta && <p className="seen__meta">{meta}</p>}
            </article>
          )
        })}
      </div>
    </section>
  )
}
