// The book's details, shown beside (desktop) or below (phone) the opened 3D book.
import { useEffect, useRef } from 'react'
import { books } from '../data/books'
import { details } from '../data/details'
import { toRoman } from '../covers/drawCover'

const compact = (n) => {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M`
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '')}k` : String(n)
}

function byline(credit) {
  if (credit.startsWith('Selected by')) return credit
  if (credit === 'Richard Bachman') return 'by Richard Bachman (Stephen King)'
  return `by ${credit}`
}

export default function DetailPanel({ slug, onClose, onStep }) {
  const index = books.findIndex((b) => b.slug === slug)
  const book = books[index]
  const info = details[slug] ?? {}
  const prev = books[index - 1]
  const next = books[index + 1]
  const closeBtn = useRef()

  useEffect(() => { closeBtn.current?.focus({ preventScroll: true }) }, [slug])

  return (
    <aside className="detail" role="dialog" aria-modal="false" aria-labelledby="detail-title" key={slug}>
      <button ref={closeBtn} className="detail-close" onClick={onClose} aria-label="Close and return to the shelf">
        ✕
      </button>

      <p className="detail-eyebrow">
        No. {toRoman(book.number)} · {book.type} · {book.year}
      </p>
      <h2 id="detail-title">{book.title}</h2>
      <p className="detail-byline">{byline(book.credit)}</p>

      {info.rating && (
        <p className="detail-rating">
          <span className="stars" aria-hidden="true">★</span>
          <strong>{info.rating.value.toFixed(info.rating.digits ?? 1)}</strong>
          <span className="muted">
            {' '}· {info.rating.source}
            {info.rating.count ? ` · ${compact(info.rating.count)} ratings` : ''}
          </span>
        </p>
      )}

      <p className={`detail-synopsis ${info.synopsis ? '' : 'is-empty'}`}>
        {info.synopsis ?? 'Synopsis coming soon.'}
      </p>

      {info.links?.length > 0 && (
        <div className="detail-links">
          <h3>Find a copy</h3>
          <ul>
            {info.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  <span>{l.format}</span>
                  <small>{l.store} ↗</small>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <nav className="detail-nav" aria-label="Neighbouring books">
        {prev ? (
          <button onClick={() => onStep(prev.slug)}>
            <small>← Previous</small>
            <span>{prev.title}</span>
          </button>
        ) : <span />}
        {next ? (
          <button className="next" onClick={() => onStep(next.slug)}>
            <small>Next →</small>
            <span>{next.title}</span>
          </button>
        ) : <span />}
      </nav>
    </aside>
  )
}
