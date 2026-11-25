import { useCallback, useEffect, useRef, useState } from 'react'
import { books } from '../data/books'
import { jumpTo, shelfState } from './layout'
import ShelfScene from './ShelfScene'
import Overlay from './Overlay'
import DetailPanel from './DetailPanel'
import Hero from '../hero/Hero'
import { useInspectControls, resetInspect } from './inspect'
import { useBrowseControls } from './browse'

// A few motes in the upper half, same look as the hero's dust (fixed so every load matches).
const DUST = Array.from({ length: 18 }, (_, i) => {
  const size = 1.6 + (i % 4) * 1.1
  return { left: `${4 + ((i * 37) % 92)}%`, top: `${5 + ((i * 53) % 90)}%`, width: size, height: size, opacity: 0.12 + (i % 4) * 0.08 }
})

export default function ShelfPage() {
  const [view, setView] = useState({ first: 0, last: 0, center: 0 })
  const [selected, setSelected] = useState(null)
  const [sceneEl, setSceneEl] = useState(null)
  const [shelfOnScreen, setShelfOnScreen] = useState(false)
  const shelfRef = useRef()
  const { center } = view

  // Two screens: the hero, then the shelf. Inside the shelf every gesture moves the books.
  useEffect(() => {
    document.documentElement.classList.add('shelf-page')
    return () => document.documentElement.classList.remove('shelf-page')
  }, [])

  // The 3D scene only renders while some of the shelf is on screen.
  useEffect(() => {
    const el = shelfRef.current
    const io = new IntersectionObserver(([entry]) => setShelfOnScreen(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useBrowseControls(sceneEl, !selected) // swipe / drag / wheel the shelf
  useInspectControls(sceneEl, !!selected) // turn / zoom the opened book

  // Opening a book centres its slot, so closing it drops you back where it lives.
  const open = useCallback((slug) => {
    resetInspect()
    jumpTo(slug, { highlight: false })
    shelfState.selected = slug
    shelfState.hovered = null
    document.documentElement.classList.add('is-reading')
    setSelected(slug)
  }, [])

  const close = useCallback(() => {
    shelfState.selected = null
    document.documentElement.classList.remove('is-reading')
    setSelected(null)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return
      if (selected && e.key === 'Escape') return close()
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
      if (!step || (!selected && !shelfOnScreen)) return
      e.preventDefault()
      const from = selected ? books.findIndex((b) => b.slug === selected) : center
      const next = books[Math.min(books.length - 1, Math.max(0, from + step))]
      if (selected) open(next.slug)
      else jumpTo(next.slug, { highlight: false })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [center, selected, shelfOnScreen, open, close])

  return (
    <>
      <a className="skip-link" href="#shelf">Skip to the shelf</a>
      <main>
        <Hero />
        <section id="shelf" className="shelf" ref={shelfRef} aria-labelledby="shelf-title" tabIndex={-1}>
          <div className="scene" ref={setSceneEl}>
            <ShelfScene
              onView={setView}
              selected={selected}
              onSelect={open}
              onClose={close}
              running={shelfOnScreen || !!selected}
            />
          </div>
          <div className="vignette" aria-hidden="true" />
          <div className="shelf-dust" aria-hidden="true">
            {DUST.map((d, i) => <span key={i} style={d} />)}
          </div>
          <Overlay view={view} reading={!!selected} />
        </section>
      </main>
      {selected && <DetailPanel slug={selected} onClose={close} onStep={open} />}
    </>
  )
}
