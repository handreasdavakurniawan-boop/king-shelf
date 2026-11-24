// Where every book stands on the shelf (scene units, x grows to the right).
import { Vector3 } from 'three'
import { books } from '../data/books'
import { BOOK } from '../components/Book3D'

export const GAP = 0.035 // air between two neighbouring books

// Stable pseudo-random 0..1 from a string, so a book always gets the same size.
function hash(str) {
  let h = 2166136261
  for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return ((h >>> 0) % 1000) / 1000
}

export const layout = (() => {
  let x = 0
  return books.map((book) => {
    // Books are scaled as a whole (never stretched) so the artwork keeps its shape.
    const scale = 0.88 + hash(book.slug) * 0.12
    const thickness = BOOK.d * scale
    const item = { book, scale, thickness, height: BOOK.h * scale, x: x + thickness / 2 }
    x += thickness + GAP
    return item
  })
})()

export const SHELF_LENGTH = layout.at(-1).x + layout.at(-1).thickness / 2

// Shared, non-React state read every frame by the 3D scene.
export const shelfState = {
  selected: null, // slug of the opened book
  readingTarget: new Vector3(), // where the opened book floats (for the reading light)
  hovered: null, // slug under the pointer
  highlight: null, // slug briefly lifted after a search jump
  highlightUntil: 0,
  x0: 0, // leftmost camera x (first book at the left edge)
  x1: 0, // rightmost camera x (last book at the right edge)
  camX: 0, // where the camera is now
  camTarget: null, // where the camera is heading (set by swipes, wheel, search…)
  glide: 0, // sideways speed after a fling, units per second
  pxToUnits: 0.01, // how far one screen pixel is on the shelf
}

// Send the camera to a book (it travels there smoothly).
export function jumpTo(slug, { highlight = true } = {}) {
  const item = layout.find((l) => l.book.slug === slug)
  if (!item) return
  const { x0, x1 } = shelfState
  // Before the shelf has drawn its first frame (e.g. a jump from the hero) the bounds
  // are still 0..0; the camera rig clamps the target itself once it knows them.
  shelfState.camTarget = x1 > x0 ? Math.min(x1, Math.max(x0, item.x)) : item.x
  shelfState.glide = 0
  if (highlight) {
    shelfState.highlight = slug
    shelfState.highlightUntil = performance.now() + 2400
  }
}
