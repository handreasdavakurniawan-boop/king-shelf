// Turns the SVG ornaments + a book's title into three canvases (front, spine, back).
// The same canvases are shown flat in the preview and wrapped onto the 3D book,
// so what you approve on the flat preview is exactly what appears on the shelf.

import { colorFor } from './palette'
import {
  FACE, SPINE, frontSVG, spineSVG, backSVG,
  TITLE_BOX, AUTHOR_Y, SPINE_TITLE, SPINE_AUTHOR_Y, NUMERAL_BOX,
} from './ornaments'

const K = 1.6 // pixels per design unit (front = 960 x 1440 px)
const FONT = 'Cinzel'

let fontsReady
const loadFonts = () =>
  (fontsReady ??= Promise.all([
    document.fonts.load(`700 40px ${FONT}`),
    document.fonts.load(`400 20px ${FONT}`),
  ]))

function svgToImage(svg) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
  })
}

async function paint(svg, size, drawText, k = K) {
  const c = document.createElement('canvas')
  c.width = Math.round(size.w * k)
  c.height = Math.round(size.h * k)
  const ctx = c.getContext('2d')
  ctx.drawImage(await svgToImage(svg), 0, 0, c.width, c.height)
  ctx.save()
  ctx.scale(k, k)
  drawText?.(ctx)
  ctx.restore()
  return c
}

// Silver lettering, slightly debossed (dark shadow just below each glyph).
function silver(ctx, y0, y1) {
  const g = ctx.createLinearGradient(0, y0, 0, y1)
  g.addColorStop(0, '#f2f4f4')
  g.addColorStop(1, '#b3b8ba')
  ctx.fillStyle = g
  ctx.shadowColor = 'rgba(0,0,0,.55)'
  ctx.shadowOffsetY = 1.5
  ctx.shadowBlur = 2
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
}

function wrap(ctx, text, maxWidth) {
  const lines = []
  let line = ''
  for (const word of text.split(' ')) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width <= maxWidth || !line) line = test
    else { lines.push(line); line = word }
  }
  if (line) lines.push(line)
  return lines
}

// Largest font size (from `max` down to `min`) at which the title fits the box.
function fitLines(ctx, text, { maxWidth, maxHeight, max, min, maxLines, weight = 700 }) {
  for (let size = max; size >= min; size -= 2) {
    ctx.font = `${weight} ${size}px ${FONT}`
    const lines = wrap(ctx, text, maxWidth)
    const fits = lines.every((l) => ctx.measureText(l).width <= maxWidth)
    if (fits && lines.length <= maxLines && lines.length * size * 1.18 <= maxHeight) return { size, lines }
  }
  ctx.font = `${weight} ${min}px ${FONT}`
  return { size: min, lines: wrap(ctx, text, maxWidth) }
}

function drawLines(ctx, lines, size, cx, cy) {
  const lh = size * 1.18
  lines.forEach((l, i) => ctx.fillText(l, cx, cy + (i - (lines.length - 1) / 2) * lh))
}

export function toRoman(n) {
  const map = [[50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let out = ''
  for (const [v, s] of map) while (n >= v) { out += s; n -= v }
  return out
}

const cache = new Map()

export function renderCover(book) {
  if (!cache.has(book.slug)) cache.set(book.slug, build(book))
  return cache.get(book.slug)
}

async function build(book) {
  await loadFonts()
  const { cloth } = colorFor(book.number)

  const front = await paint(frontSVG(cloth), FACE, (ctx) => {
    const box = TITLE_BOX
    silver(ctx, box.top, box.bottom)
    const { size, lines } = fitLines(ctx, book.title, {
      maxWidth: box.width, maxHeight: box.bottom - box.top, max: 68, min: 30, maxLines: 4,
    })
    drawLines(ctx, lines, size, box.x, (box.top + box.bottom) / 2)
    // Author line: shrink (and tighten the letter spacing) until it fits the frame.
    const credit = book.credit.toUpperCase()
    let s = 24
    do {
      ctx.font = `400 ${s}px ${FONT}`
      ctx.letterSpacing = `${(s / 4).toFixed(1)}px`
      s -= 1
    } while (ctx.measureText(credit).width > box.width + 30 && s > 14)
    ctx.fillText(credit, box.x, AUTHOR_Y)
  })

  const spine = await paint(spineSVG(cloth), SPINE, spineText(book))
  const back = await paint(backSVG(cloth), FACE)
  return { front, spine, back }
}

// Lighter spine-only texture for the shelf: 63 books are on screen at once,
// so they get a smaller canvas; the full-size set is built only for an opened book.
const spineCache = new Map()
const K_SHELF = 1.2
export function renderSpine(book) {
  if (!spineCache.has(book.slug)) {
    spineCache.set(book.slug, loadFonts().then(() =>
      paint(spineSVG(colorFor(book.number).cloth), SPINE, spineText(book), K_SHELF)))
  }
  return spineCache.get(book.slug)
}

function spineText(book) {
  return (ctx) => {
    const t = SPINE_TITLE
    const length = t.bottom - t.top
    // Spine text runs top-to-bottom, like English-language hardcovers.
    ctx.save()
    ctx.translate(t.cx, t.cy)
    ctx.rotate(Math.PI / 2)
    silver(ctx, -t.thickness / 2, t.thickness / 2)
    const { size, lines } = fitLines(ctx, book.title, {
      maxWidth: length, maxHeight: t.thickness, max: 46, min: 22, maxLines: 2,
    })
    drawLines(ctx, lines, size, 0, 0)
    ctx.restore()

    silver(ctx, SPINE_AUTHOR_Y - 10, SPINE_AUTHOR_Y + 10)
    ctx.font = `400 17px ${FONT}`
    ctx.letterSpacing = '4px'
    const spineName = book.credit.startsWith('Richard Bachman') ? 'BACHMAN' : 'KING'
    let ns = 17
    while (ctx.measureText(spineName).width > SPINE.w - 52 && ns > 11) {
      ns -= 1
      ctx.font = `400 ${ns}px ${FONT}`
      ctx.letterSpacing = `${(ns / 5).toFixed(1)}px`
    }
    ctx.fillText(spineName, SPINE.w / 2 + 2, SPINE_AUTHOR_Y)

    const n = NUMERAL_BOX
    const numeral = toRoman(book.number)
    ctx.letterSpacing = '0px'
    silver(ctx, n.y, n.y + n.h)
    let size2 = 40
    do { ctx.font = `700 ${size2}px ${FONT}`; size2 -= 2 } while (ctx.measureText(numeral).width > n.w - 22)
    ctx.fillText(numeral, n.x + n.w / 2, n.y + n.h / 2 + 2)
  }
}

// Cream page block for the three non-cover sides of the 3D book.
// `vertical` decides which way the fine page lines run.
export function pagesTexture(vertical) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#e9dfc6'
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 256; i += 2) {
    ctx.fillStyle = `rgba(90,70,40,${0.05 + Math.random() * 0.08})`
    vertical ? ctx.fillRect(i, 0, 1, 256) : ctx.fillRect(0, i, 256, 1)
  }
  return c
}
