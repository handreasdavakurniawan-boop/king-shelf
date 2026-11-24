// The first screen: what this shelf is, three facts, and five real covers standing
// face-out on a ledge. The covers come from the same generator as the 3D books,
// so a cover drawn here is already cached when its book is opened on the shelf.
import { useEffect, useState } from 'react'
import { books } from '../data/books'
import { details } from '../data/details'
import { colorFor } from '../covers/palette'
import { renderCover } from '../covers/drawCover'
import { pickFeatured } from './featured'

const years = books.map((b) => b.year)
const FIRST = Math.min(...years)
const LATEST = Math.max(...years)
const NOVELS = books.filter((b) => b.type === 'Novel').length
const featured = pickFeatured(books, details)
// Centre slot largest, then each step outward a little smaller and further back.
const SCALE = [0.74, 0.86, 1, 0.86, 0.74]
const DEPTH = [1, 2, 3, 2, 1]

function FaceOut({ book, index, onOpen }) {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    let alive = true
    let url
    renderCover(book).then(({ front }) =>
      front.toBlob((blob) => {
        if (!alive || !blob) return
        url = URL.createObjectURL(blob)
        setSrc(url)
      }, 'image/jpeg', 0.88),
    )
    return () => {
      alive = false
      if (url) URL.revokeObjectURL(url)
    }
  }, [book])

  return (
    <li className="face" style={{ '--i': index, '--s': SCALE[index] ?? 0.74, zIndex: DEPTH[index] ?? 1 }}>
      <button type="button" onClick={() => onOpen(book.slug)} aria-label={`Open ${book.title}, ${book.year}`}>
        {/* Until the cover is painted, its cloth colour holds the exact same shape. */}
        <span className="face-cloth" style={{ background: colorFor(book.number).cloth }}>
          {src && <img src={src} alt="" width="960" height="1440" decoding="async" />}
        </span>
      </button>
    </li>
  )
}

export default function Hero({ onOpen }) {
  const openRandom = () => onOpen(books[Math.floor(Math.random() * books.length)].slug)

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="hero-eyebrow">A private library · {FIRST}–{LATEST}</p>
        <h1 id="hero-title">The King Shelf</h1>
        <p className="hero-lede">
          {books.length} Stephen King books, bound alike in cloth and silver and shelved A&nbsp;to&nbsp;Z.
          Take one down to read what it is about and where to find a copy.
        </p>

        <dl className="hero-facts">
          <div><dt>Titles</dt><dd>{books.length}</dd></div>
          <div><dt>Novels</dt><dd>{NOVELS}</dd></div>
          <div><dt>Years in print</dt><dd>{LATEST - FIRST}</dd></div>
        </dl>

        <div className="hero-actions">
          <a className="btn btn-primary" href="#shelf">
            Browse the shelf <span className="btn-arrow" aria-hidden="true">↓</span>
          </a>
          <button type="button" className="btn btn-ghost" onClick={openRandom}>
            Open a random book
          </button>
        </div>
      </div>

      <div className="hero-display">
        <ul className="ledge" aria-label="Five books from the shelf">
          {featured.map((book, i) => (
            <FaceOut key={book.slug} book={book} index={i} onOpen={onOpen} />
          ))}
        </ul>
        <div className="ledge-board" aria-hidden="true" />
      </div>
    </section>
  )
}
