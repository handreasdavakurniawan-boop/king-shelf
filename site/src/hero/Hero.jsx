// The first screen: a lit stained-glass window with someone typing behind it, the title in
// front and a typed page sliding out over the sill. Layers come from the Figma frame
// "A1 v2 (revisi)" (src/hero/art). Scrolling pushes the camera through the title to the writer.
import { useEffect, useRef, useState } from 'react'
import shafts from './art/shafts.svg'
import room from './art/room.svg'
import writer from './art/writer.svg'
import glass from './art/glass.svg'
import frame from './art/frame.svg'
import sill from './art/sill.svg'
import books from './art/books.svg'
import { keystrokeDelay } from './typewriter'

const POEM =
  'The lamp in the upstairs window has not gone out since October. Whoever types up there never asks for supper. ' +
  'Near three the keys stop, and the house holds its breath until they start again.'

// Fixed positions so the scene looks the same on every load (design units, desktop frame).
const DUST = Array.from({ length: 42 }, (_, i) => ({
  left: 300 + ((i * 211) % 860), top: 150 + ((i * 137) % 600), size: 1.6 + (i % 4) * 1.2, opacity: 0.15 + (i % 5) * 0.1,
}))

// One stone-wall tile, two courses high, staggered so the joints never line up.
const STONES = [['#221711', '#271b13', '#1e140e'], ['#2a1d14', '#221711', '#271b13']]
const COURSES = [[150, 110, 140], [90, 180, 130]]
const WALL = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='156'>${COURSES.map((row, r) => {
    let x = 0
    return row.map((w, i) => { const s = `<rect x='${x + 2}' y='${r * 78 + 2}' width='${w - 4}' height='74' rx='9' fill='${STONES[r][i]}'/>`; x += w; return s }).join('')
  }).join('')}</svg>`,
)}")`

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Hero() {
  const ref = useRef()
  const [typed, setTyped] = useState(0)

  // Fit the design frame to the screen and track how far the zoom has gone (0..1).
  useEffect(() => {
    const el = ref.current
    let raf = 0
    const update = () => {
      raf = 0
      const vw = window.innerWidth
      const vh = window.innerHeight
      const portrait = vw < vh
      el.classList.toggle('is-portrait', portrait)
      el.style.setProperty('--s', Math.min(vw / (portrait ? 390 : 1440), vh / (portrait ? 844 : 900)))
      const r = el.getBoundingClientRect()
      const p = reducedMotion() ? 0 : Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)))
      el.style.setProperty('--p', p.toFixed(4))
    }
    const queue = () => { raf ||= requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  }, [])

  // Type the poem once the window has lit up.
  useEffect(() => {
    if (reducedMotion()) return setTyped(POEM.length)
    let i = 0
    let t = setTimeout(function strike() {
      setTyped(++i)
      if (i < POEM.length) t = setTimeout(strike, keystrokeDelay(POEM[i]))
    }, 1800)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="hero-title">
      <div className="hero-stick">
        <div className="hero-wall" style={{ backgroundImage: WALL }} aria-hidden="true" />

        <div className="hero-stage" aria-hidden="true">
          <div className="hero-zoom">
            <div className="h-scene">
              <div className="halo" />
              <img className="l-far" src={shafts} alt="" />
              <img className="l-far l-room" src={room} alt="" />
              <img className="l-far l-writer" src={writer} alt="" />
              <img className="l-mid l-glass" src={glass} alt="" />
              <img className="l-mid" src={frame} alt="" />
              <img className="l-mid" src={sill} alt="" />
            </div>
            <div className="h-books">
              <img src={books} alt="" />
              <span className="candle-glow" />
            </div>
            <div className="h-dust">
              {DUST.map((d, i) => <span key={i} style={{ left: d.left, top: d.top, width: d.size, height: d.size, opacity: d.opacity }} />)}
            </div>
          </div>
        </div>

        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-dim" aria-hidden="true" />

        <div className="hero-stage">
          <div className="paper">
            <p className="poem">
              <span className="sr-only">{POEM}</span>
              <span aria-hidden="true">{POEM.slice(0, typed)}<i className="caret" /></span>
            </p>
          </div>
          <h1 className="hero-title" id="hero-title">
            <span className="t-the">The</span> <span className="t-king">King</span> <span className="t-shelf">Shelf</span>
          </h1>
        </div>
      </div>
    </section>
  )
}
