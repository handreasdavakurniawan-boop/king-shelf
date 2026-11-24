// Everything drawn in HTML on top of the 3D shelf: masthead, search, counter.
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { books } from '../data/books'
import { jumpTo } from './layout'

function Search() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const input = useRef()
  const listId = useId()

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return needle ? books.filter((b) => b.title.toLowerCase().includes(needle)).slice(0, 6) : []
  }, [q])

  const pick = (book) => {
    jumpTo(book.slug)
    setQ('')
    setOpen(false)
    input.current?.blur()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter' && results[active]) pick(results[active])
    else if (e.key === 'Escape') { setQ(''); input.current?.blur() }
  }

  return (
    <div className="search">
      {open && q.trim() && (
        <ul id={listId} role="listbox" className="results">
          {results.length === 0 && <li className="empty">No book matches “{q.trim()}”</li>}
          {results.map((b, i) => (
            <li key={b.slug} role="option" aria-selected={i === active}>
              <button
                className={i === active ? 'is-active' : ''}
                onMouseDown={(e) => { e.preventDefault(); pick(b) }}
                onMouseEnter={() => setActive(i)}
              >
                <span>{b.title}</span>
                <small>{b.year}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        ref={input}
        type="search"
        value={q}
        placeholder={`Search ${books.length} titles…`}
        aria-label="Search the shelf"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls={listId}
        onChange={(e) => { setQ(e.target.value); setActive(0); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}

export default function Overlay({ view, reading }) {
  const range = view.first < 0 ? `${view.center + 1}` : `${view.first + 1}–${view.last + 1}`
  const coarse = useMemo(() => window.matchMedia?.('(pointer: coarse)').matches, [])
  // The browse hint goes away for good once the visitor has moved the shelf.
  const [browsed, setBrowsed] = useState(false)
  useEffect(() => { if (view.first > 0) setBrowsed(true) }, [view.first])

  return (
    <div className="overlay">
      <header className="masthead">
        <h2 id="shelf-title">The shelf, A to Z</h2>
        <p>{coarse ? 'Tap' : 'Click'} a spine to take a book down</p>
        <a className="masthead-top" href="#top">↑ Back to the top</a>
      </header>

      <p className={`hint ${browsed || reading ? 'is-hidden' : ''}`} aria-hidden="true">
        {coarse ? 'Swipe to browse' : 'Scroll or drag to browse'} <span>→</span>
      </p>

      <p className={`inspect-hint ${reading ? '' : 'is-hidden'}`} aria-hidden="true">
        {coarse ? 'Drag to turn · Pinch to zoom' : 'Drag to turn · Scroll to zoom'}
      </p>

      <div className={`dock ${reading ? 'is-hidden' : ''}`}>
        <Search />
        <p className="counter" aria-live="polite">
          <span>{range}</span> / {books.length}
        </p>
      </div>
    </div>
  )
}
