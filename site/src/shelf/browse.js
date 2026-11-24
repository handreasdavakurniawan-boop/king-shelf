// Browsing the shelf sideways: finger swipe, mouse/touchpad drag, mouse wheel and
// two-finger touchpad swipe all move the same "where the camera should be" number.
// After letting go the shelf glides on with the finger's speed and slows to a stop.
import { useEffect } from 'react'
import { shelfState } from './layout'

export const browse = {
  dragging: false,
  moved: false, // last press turned into a drag → it must not open a book
}

const FRICTION = 3.2 // higher = glide stops sooner
const DRAG_THRESHOLD = 6 // px before a press counts as a drag

// Called by the camera rig every frame: apply the glide and keep inside the shelf.
export function stepBrowse(dt) {
  const s = shelfState
  if (s.camTarget === null) return
  if (!browse.dragging && shelfState.glide) {
    s.camTarget += shelfState.glide * dt
    shelfState.glide *= Math.exp(-FRICTION * dt)
    if (Math.abs(shelfState.glide) < 0.01) shelfState.glide = 0
  }
  if (s.camTarget < s.x0 || s.camTarget > s.x1) {
    s.camTarget = Math.min(s.x1, Math.max(s.x0, s.camTarget))
    shelfState.glide = 0
  }
}

export function useBrowseControls(element, enabled) {
  useEffect(() => {
    if (!enabled || !element) return
    let pointerId = null
    let startX = 0
    let last = null

    const down = (e) => {
      if (pointerId !== null) return // ignore a second finger
      pointerId = e.pointerId
      startX = e.clientX
      last = { x: e.clientX, t: performance.now() }
      browse.dragging = true
      browse.moved = false
      shelfState.glide = 0
      if (shelfState.camTarget === null) shelfState.camTarget = shelfState.camX
    }

    const move = (e) => {
      if (e.pointerId !== pointerId || !last) return
      const now = performance.now()
      // Dragging the shelf left moves the camera right, like sliding a photo strip.
      const du = -(e.clientX - last.x) * shelfState.pxToUnits
      shelfState.camTarget += du
      const dt = Math.max(1, now - last.t) / 1000
      shelfState.glide = du / dt
      last = { x: e.clientX, t: now }
      if (Math.abs(e.clientX - startX) > DRAG_THRESHOLD) browse.moved = true
    }

    const up = (e) => {
      if (e.pointerId !== pointerId) return
      // Holding still before letting go means "stop here", not "fling".
      if (last && performance.now() - last.t > 80) shelfState.glide = 0
      browse.dragging = false
      pointerId = null
      last = null
    }

    const wheel = (e) => {
      if (e.ctrlKey) return // pinch-zoom of the browser page
      // Only a shelf that fills the screen takes the wheel; half-scrolled, the page scrolls.
      if (Math.abs(element.getBoundingClientRect().top) > 4) return
      const lineScale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1
      const vertical = Math.abs(e.deltaY) >= Math.abs(e.deltaX)
      // Whichever axis moved more wins: mouse wheels send Y, touchpad side-swipes send X.
      const delta = (vertical ? e.deltaY : e.deltaX) * lineScale
      if (shelfState.camTarget === null) shelfState.camTarget = shelfState.camX
      // Wheeling up at the very first book hands the wheel back to the page: up to the hero.
      if (vertical && delta < 0 && shelfState.camTarget <= shelfState.x0 + 0.01) return
      e.preventDefault()
      shelfState.camTarget += delta * shelfState.pxToUnits
      shelfState.glide = 0
    }

    element.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    element.addEventListener('wheel', wheel, { passive: false })
    return () => {
      element.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      element.removeEventListener('wheel', wheel)
      browse.dragging = false
    }
  }, [element, enabled])
}
