// Turning and zooming the opened book (mouse drag / touch drag / wheel / pinch).
// Input only writes numbers into `inspect`; ShelfBook reads them every frame.
import { useEffect } from 'react'

export const inspect = {
  yaw: 0, // turn around the vertical axis (radians, unlimited: full 360° and beyond)
  pitch: 0, // tilt toward / away from the viewer (radians, limited)
  yawVel: 0, // radians per second, for the glide after letting go
  zoom: 1,
  dragging: false,
  moved: false, // true when the last press was a drag, so it must not count as a click
  releasedAt: 0, // performance.now() of the last release
}

export const PITCH_LIMIT = 0.6 // ~35°: never upside down
export const ZOOM_MIN = 0.85
export const ZOOM_MAX = 1.8
const TURN_PER_PX = 0.01
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

export function resetInspect() {
  Object.assign(inspect, { yaw: 0, pitch: 0, yawVel: 0, zoom: 1, dragging: false, moved: false })
}

// Attaches the gestures to `element` while a book is open.
export function useInspectControls(element, active) {
  useEffect(() => {
    if (!active || !element) return
    const pointers = new Map()
    let start = null
    let last = null
    let pinchFrom = null

    const down = (e) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pointers.size === 1) {
        start = { x: e.clientX, y: e.clientY }
        last = { x: e.clientX, y: e.clientY, t: performance.now() }
        inspect.dragging = true
        inspect.moved = false
        inspect.yawVel = 0
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()]
        pinchFrom = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: inspect.zoom }
      }
    }

    const move = (e) => {
      if (!pointers.has(e.pointerId)) return
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (pointers.size === 2 && pinchFrom) {
        const [a, b] = [...pointers.values()]
        const dist = Math.hypot(a.x - b.x, a.y - b.y)
        inspect.zoom = clamp(pinchFrom.zoom * (dist / pinchFrom.dist), ZOOM_MIN, ZOOM_MAX)
        inspect.moved = true
        return
      }
      if (!last) return
      const now = performance.now()
      const dx = e.clientX - last.x
      const dy = e.clientY - last.y
      inspect.yaw += dx * TURN_PER_PX
      inspect.pitch = clamp(inspect.pitch + dy * TURN_PER_PX, -PITCH_LIMIT, PITCH_LIMIT)
      const dt = Math.max(1, now - last.t) / 1000
      inspect.yawVel = (dx * TURN_PER_PX) / dt
      last = { x: e.clientX, y: e.clientY, t: now }
      if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 6) inspect.moved = true
    }

    const up = (e) => {
      pointers.delete(e.pointerId)
      if (pointers.size < 2) pinchFrom = null
      if (pointers.size === 0) {
        // A pause before letting go means "place it here", not "fling it".
        if (last && performance.now() - last.t > 80) inspect.yawVel = 0
        inspect.dragging = false
        inspect.releasedAt = performance.now()
        last = null
      }
    }

    const wheel = (e) => {
      if (e.ctrlKey) return // leave browser zoom alone
      inspect.zoom = clamp(inspect.zoom * Math.exp(-e.deltaY * 0.0015), ZOOM_MIN, ZOOM_MAX)
    }

    element.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    element.addEventListener('wheel', wheel, { passive: true })
    return () => {
      element.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      element.removeEventListener('wheel', wheel)
      inspect.dragging = false
    }
  }, [element, active])
}
