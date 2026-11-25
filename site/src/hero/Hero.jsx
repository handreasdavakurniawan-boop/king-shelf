// The first screen: a lit stained-glass window with someone typing behind it, the title in
// front and a typed page sliding out over the sill. Layers come from the Figma frame
// "A1 v2 (revisi)" (src/hero/art). Scrolling pushes the camera through the title to the writer.
import { useEffect, useRef, useState } from 'react'
import shafts from './art/shafts.svg'
import room from './art/room.svg'
import writer from './art/writer.svg'
import writerBody from './art/writer-body.svg'
import writerHead from './art/writer-head.svg'
import writerArm from './art/writer-arm.svg'
import glass from './art/glass.svg'
import frame from './art/frame.svg'
import sill from './art/sill.svg'
import books from './art/books.svg'
import Clock from './Clock'
import { wallUrl } from './wall'
import { articles } from '../data/articles'
import { keystrokeDelay } from './typewriter'
import { setSound, keyClick, bell } from './sound'

const POEM =
  'The lamp in the upstairs window has not gone out since October. Whoever types up there never asks for supper. ' +
  'Near three the keys stop, and the house holds its breath until they start again.'

// Fixed positions so the scene looks the same on every load (design units, desktop frame).
const DUST = Array.from({ length: 42 }, (_, i) => ({
  left: 300 + ((i * 211) % 860), top: 150 + ((i * 137) % 600), size: 1.6 + (i % 4) * 1.2, opacity: 0.15 + (i % 5) * 0.1,
}))


// The camera push takes the first 1.4 screens of scroll; the rest of the hero holds still
// on the writer so the clippings can be read.
const ZOOM = 1.4

// Tabbing into a clipping before the zoom has finished jumps to where the clippings show.
const showNotes = (e) => {
  const hero = e.currentTarget.closest('.hero')
  if (reducedMotion() || hero.classList.contains('is-pinned')) return
  window.scrollTo({ top: hero.getBoundingClientRect().top + window.scrollY + ZOOM * window.innerHeight + 2, behavior: 'instant' })
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Hero() {
  const ref = useRef()
  const armRef = useRef()
  const [typed, setTyped] = useState(0)

  // Fit the design frame to the screen and track how far the zoom has gone (0..1).
  // The zoom follows the scroll position with a short ease instead of jumping to it:
  // a mouse wheel moves the page ~100px per notch, which would otherwise zoom in steps.
  useEffect(() => {
    const el = ref.current
    let raf = 0
    let target = 0
    let current = 0
    let last = 0
    const measure = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const portrait = vw < vh
      el.classList.toggle('is-portrait', portrait)
      el.style.setProperty('--s', Math.min(vw / (portrait ? 390 : 1440), vh / (portrait ? 844 : 900)))
      const r = el.getBoundingClientRect()
      target = reducedMotion() ? 0 : Math.min(1, Math.max(0, -r.top / (ZOOM * vh)))
    }
    const setP = () => {
      el.style.setProperty('--p', current.toFixed(4))
      el.classList.toggle('is-pinned', current > 0.85) // the clippings only take clicks once they're shown
    }
    const tick = (now) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
      last = now
      current += (target - current) * (1 - Math.exp(-dt * 12))
      if (Math.abs(target - current) < 0.0005) current = target
      setP()
      if (current === target) { raf = 0; last = 0 } else raf = requestAnimationFrame(tick)
    }
    const queue = () => { measure(); raf ||= requestAnimationFrame(tick) }
    const update = () => { measure(); current = target; setP() }
    update()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  }, [])

  // The writer types the poem once the window has lit up, then keeps typing in short bursts
  // (with the odd end-of-line bell) for as long as the hero is on screen.
  useEffect(() => {
    if (reducedMotion()) return setTyped(POEM.length)
    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(ref.current)
    let tap
    const strike = (ch) => {
      if (document.hidden) return // a background tab doesn't draw, so taps would only pile up
      tap?.cancel()
      if (ch !== ' ') tap = armRef.current?.animate([{ rotate: '0deg' }, { rotate: '2.2deg', offset: 0.35 }, { rotate: '0deg' }], { duration: 130, easing: 'ease-out' })
      if (visible) keyClick() // the poem keeps typing off screen, silently
    }
    let i = 0
    let t
    const poem = () => {
      strike(POEM[i])
      setTyped(++i)
      t = setTimeout(i < POEM.length ? poem : idle, i < POEM.length ? keystrokeDelay(POEM[i]) : 2500)
    }
    const idle = () => {
      if (!visible) return (t = setTimeout(idle, 1000))
      let keys = 6 + Math.floor(Math.random() * 14)
      const key = () => {
        strike('x')
        if (--keys > 0) t = setTimeout(key, keystrokeDelay('x'))
        else {
          if (Math.random() < 0.35) bell()
          t = setTimeout(idle, 1500 + Math.random() * 2500)
        }
      }
      key()
    }
    t = setTimeout(poem, 1800)
    return () => { clearTimeout(t); io.disconnect() }
  }, [])

  // Sound stays off until the visitor asks for it (browsers block it before a click anyway).
  const [sound, setSoundOn] = useState(false)
  const toggleSound = () => { setSound(!sound); setSoundOn(!sound) }
  useEffect(() => () => setSound(false), [])

  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="hero-title">
      <div className="hero-stick">
        <div className="hero-wall" style={{ backgroundImage: wallUrl }} aria-hidden="true" />

        <div className="hero-stage" aria-hidden="true">
          <div className="hero-zoom">
            <div className="h-scene">
              <div className="halo" />
              {/* The far room twice: sharp underneath, a blurred copy on top that fades out as you
                  zoom. Only opacity changes per scroll frame, so the blur is never re-rendered. */}
              {/* Only the sharp copy has a moving writer (head, typing arm); under the blur it can't be seen. */}
              <div className="far-sharp">
                <img src={shafts} alt="" />
                <img className="l-room" src={room} alt="" />
                <div className="writer">
                  <img className="w-body" src={writerBody} alt="" />
                  <img className="w-head" src={writerHead} alt="" />
                  <img className="w-arm" src={writerArm} alt="" ref={armRef} />
                </div>
              </div>
              <div className="far-soft">
                <img src={shafts} alt="" />
                <img className="l-room" src={room} alt="" />
                <img className="l-writer" src={writer} alt="" />
              </div>
              <img className="l-mid l-glass" src={glass} alt="" />
              <img className="l-mid" src={frame} alt="" />
              <img className="l-mid" src={sill} alt="" />
            </div>
            <div className="h-clock"><Clock /></div>
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

      {/* pinned over the zoomed-in writer (sticky, same spot as .hero-stick) */}
      <aside className="hero-notes" aria-labelledby="notes-title" onFocus={showNotes}>
        <div className="notes-inner">
          <h2 className="notes-title" id="notes-title">Pinned above the desk</h2>
          <ul className="notes">
            {articles.map((a) => (
              <li className="note" key={a.href}>
                <p className="note-label">{a.label}</p>
                <h3>{a.headline}</h3>
                <p className="note-teaser">{a.teaser}</p>
                <a href={a.href} target="_blank" rel="noopener noreferrer">
                  Read the full story<span className="sr-only">: {a.headline} (opens in a new tab)</span>
                  <span aria-hidden="true"> ↗</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="notes-swipe" aria-hidden="true">Swipe for more →</p>
        </div>
      </aside>

      {/* fixed, so it stays reachable on the shelf while the music plays */}
      <button type="button" className="sound-toggle" aria-pressed={sound} aria-label="Sound" title={sound ? 'Sound on' : 'Sound off'} onClick={toggleSound}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
          {sound
            ? <><path d="M15.5 9a4 4 0 0 1 0 6" /><path d="M18 6.5a7.5 7.5 0 0 1 0 11" /></>
            : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
        </svg>
      </button>
    </section>
  )
}
