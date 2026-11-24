// Hand-drawn SVG ornaments for the cover template (original artwork, no licence needed).
// Units: front/back face = 600 x 900, spine = 140 x 900. Text is NOT drawn here;
// drawCover.js paints titles on top with canvas so the web font is guaranteed.

import { shade } from './palette'

export const FACE = { w: 600, h: 900 }
export const SPINE = { w: 140, h: 900 }
export const SILVER = '#d8dcdc'
const S = SILVER
const INSET = 46 // distance from the edge to the silver frame line
const LEAF = 'M0 0 C 7 -8, 19 -8, 26 0 C 19 8, 7 8, 0 0 Z'

// ---------- shared background: cloth weave + darker rim + soft vignette ----------
function cloth(w, h, base) {
  const rim = shade(base, -0.5)
  return `
  <defs>
    <pattern id="weave" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="${base}"/>
      <path d="M0 0 L6 6" stroke="rgba(255,255,255,.07)" stroke-width="1"/>
      <path d="M6 0 L0 6" stroke="rgba(0,0,0,.25)" stroke-width="1"/>
    </pattern>
    <radialGradient id="vignette" cx="50%" cy="45%" r="75%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity=".45"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${rim}"/>
  <rect x="14" y="14" width="${w - 28}" height="${h - 28}" fill="url(#weave)"/>
  <rect x="14" y="14" width="${w - 28}" height="${h - 28}" fill="url(#vignette)"/>
  <rect x="14" y="14" width="${w - 28}" height="${h - 28}" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="2"/>`
}

// ---------- building blocks ----------
const halfFlourish = `
  <path d="M10 10 C 48 8, 92 14, 118 38 C 138 58, 128 88, 104 87 C 86 86, 83 66, 97 61 C 107 58, 113 68, 105 73"
        fill="none" stroke="${S}" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M30 26 C 52 24, 70 34, 76 50 C 80 62, 70 70, 62 64 C 56 59, 60 52, 66 54"
        fill="none" stroke="${S}" stroke-width="2.4" stroke-linecap="round"/>
  <path d="${LEAF}" transform="translate(54 13) rotate(-6)" fill="${S}"/>
  <path d="${LEAF}" transform="translate(130 44) rotate(78) scale(.8)" fill="${S}"/>
  <circle cx="105" cy="73" r="3.2" fill="${S}"/>`

// Corner scrollwork, drawn for the top-left corner and mirrored for others.
// The second copy is reflected across the diagonal so the corner is symmetric.
function flourish(x, y, sx, sy) {
  return `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">
    ${halfFlourish}
    <g transform="matrix(0 1 1 0 0 0)">${halfFlourish}</g>
    <path d="M10 10 L 50 50" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
    <path d="${LEAF}" transform="translate(50 50) rotate(45)" fill="${S}"/>
    <circle cx="8" cy="8" r="5" fill="${S}"/>
  </g>`
}

// Eight-armed star that sits on (and interrupts) the frame line.
function star(x, y, base, s = 1) {
  let arms = ''
  for (let i = 0; i < 8; i++) {
    const long = i % 2 === 0
    const L = long ? 22 : 13
    arms += `<g transform="rotate(${i * 45})">
      <path d="M0 -9 L0 ${-L}" stroke="${S}" stroke-width="${long ? 2.6 : 2}" stroke-linecap="round"/>
      ${long
        ? `<path d="M0 ${-L - 7} L3.5 ${-L} L0 ${-L + 5} L-3.5 ${-L} Z" fill="${S}"/>`
        : `<circle cx="0" cy="${-L - 2}" r="2" fill="${S}"/>`}
    </g>`
  }
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <circle r="15" fill="${base}"/>${arms}
    <circle r="4" fill="${S}"/><circle r="8" fill="none" stroke="${S}" stroke-width="1.6"/>
  </g>`
}

// Long tapered "spike" that fills the gap between two ornaments on a frame side.
function bar(x1, y1, x2, y2) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  if (len < 40) return ''
  const half = len * 0.3
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  return `<g transform="translate(${(x1 + x2) / 2} ${(y1 + y2) / 2}) rotate(${ang})">
    <path d="M${-half} 0 L0 -3.6 L${half} 0 L0 3.6 Z" fill="${S}"/>
    <circle cx="${-half - 6}" cy="0" r="2.2" fill="${S}"/>
    <circle cx="${half + 6}" cy="0" r="2.2" fill="${S}"/>
  </g>`
}

// Bars along one side: `stops` are [position, extent] pairs measured along the side.
function sideBars(stops, toXY) {
  let out = ''
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i][0] + stops[i][1]
    const b = stops[i + 1][0] - stops[i + 1][1]
    out += bar(...toXY(a), ...toXY(b))
  }
  return out
}

// Horizontal title divider; `flip` turns it upside down for the lower one.
function divider(cx, cy, flip = false, s = 1) {
  const half = `
    <path d="M-190 0 L-100 -2.2 L-22 0 L-100 2.2 Z" fill="${S}"/>
    <path d="M-14 -3 C -32 -22, -66 -24, -78 -9 C -86 1, -73 11, -65 3"
          fill="none" stroke="${S}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M-14 4 C -30 14, -50 15, -58 8" fill="none" stroke="${S}" stroke-width="2" stroke-linecap="round"/>
    <path d="${LEAF}" transform="translate(-84 -6) rotate(205) scale(.7)" fill="${S}"/>
    <path d="${LEAF}" transform="translate(-3 -8) rotate(-125) scale(.75)" fill="${S}"/>
    <circle cx="-200" cy="0" r="2.8" fill="${S}"/>`
  return `<g transform="translate(${cx} ${cy}) scale(${s} ${flip ? -s : s})">
    ${half}<g transform="scale(-1 1)">${half}</g>
    <path d="M0 -34 L6 -12 L0 -4 L-6 -12 Z" fill="${S}"/>
    <path d="M0 -1 L9 7 L0 15 L-9 7 Z" fill="${S}"/>
  </g>`
}

// The frame for a front cover; the back cover uses the same frame mirrored.
function frame(base) {
  const { w: W, h: H } = FACE
  const I = INSET
  const F = 140 // how far a corner flourish reaches along each side
  const C = 24 // how far a corner star reaches
  const ys = [300, 600]
  return `
    <rect x="${I}" y="${I}" width="${W - 2 * I}" height="${H - 2 * I}" fill="none" stroke="${S}" stroke-width="2.4"/>
    ${sideBars([[I, F], [W / 2, 26], [W - I, C]], (p) => [p, I])}
    ${sideBars([[I, C], [W / 2, 26], [W - I, F]], (p) => [p, H - I])}
    ${sideBars([[I, F], [ys[0], 26], [ys[1], 26], [H - I, C]], (p) => [I, p])}
    ${sideBars([[I, C], [ys[0], 26], [ys[1], 26], [H - I, F]], (p) => [W - I, p])}
    ${flourish(I, I, 1, 1)}
    ${flourish(W - I, H - I, -1, -1)}
    ${star(W - I, I, base)}${star(I, H - I, base)}
    ${star(W / 2, I, base)}${star(W / 2, H - I, base)}
    ${ys.map((y) => star(I, y, base) + star(W - I, y, base)).join('')}`
}

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`

// ---------- public: one SVG per face ----------
export const TITLE_BOX = { x: 300, top: 352, bottom: 568, width: 420 } // front, between dividers
export const AUTHOR_Y = 650

export function frontSVG(base) {
  return svg(FACE.w, FACE.h, `${cloth(FACE.w, FACE.h, base)}${frame(base)}
    ${divider(300, 322)}${divider(300, 598, true)}`)
}

export function backSVG(base) {
  return svg(FACE.w, FACE.h, `${cloth(FACE.w, FACE.h, base)}
    <g transform="translate(${FACE.w} 0) scale(-1 1)">${frame(base)}</g>
    ${divider(300, 770, false, 0.45)}`)
}

export const SPINE_TITLE = { top: 182, bottom: 690, cx: 70, cy: 436, thickness: 100 }
export const SPINE_AUTHOR_Y = 716
export const NUMERAL_BOX = { x: 24, y: 774, w: 92, h: 92 }

export function spineSVG(base) {
  const { w: W, h: H } = SPINE
  const band = (y) => `
    <rect x="14" y="${y}" width="${W - 28}" height="6" fill="${S}"/>
    <rect x="14" y="${y + 10}" width="${W - 28}" height="2.5" fill="${S}"/>
    <rect x="14" y="${y + 16}" width="${W - 28}" height="6" fill="${S}"/>`
  const n = NUMERAL_BOX
  return svg(W, H, `${cloth(W, H, base)}
    <rect x="24" y="30" width="${W - 48}" height="108" fill="none" stroke="${S}" stroke-width="2"/>
    <ellipse cx="${W / 2}" cy="84" rx="32" ry="42" fill="none" stroke="${S}" stroke-width="2.6"/>
    <ellipse cx="${W / 2}" cy="84" rx="25" ry="35" fill="none" stroke="${S}" stroke-width="1.2"/>
    ${star(W / 2, 84, base, 0.85)}
    ${band(148)}
    ${band(734)}
    <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" fill="none" stroke="${S}" stroke-width="2"/>
    <rect x="${n.x + 6}" y="${n.y + 6}" width="${n.w - 12}" height="${n.h - 12}" fill="none" stroke="${S}" stroke-width="1"/>`)
}
