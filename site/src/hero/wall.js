// The stone wall behind the hero and the shelf: one tile, two courses high, staggered so the
// joints never line up. Both paint it from the same small canvas (CSS background, 3D texture),
// so scrolling from one to the other stays in the same room.
const STONES = [['#221711', '#271b13', '#1e140e'], ['#2a1d14', '#221711', '#271b13']]
const COURSES = [[150, 110, 140], [90, 180, 130]]
export const TILE_W = 400
export const TILE_H = 156

function stones() {
  return COURSES.flatMap((row, r) => {
    let x = 0
    return row.map((w, i) => {
      const s = { x: x + 2, y: r * 78 + 2, w: w - 4, h: 74, fill: STONES[r][i] }
      x += w
      return s
    })
  })
}

// Drawn small on purpose: stretched over the wall it comes out soft, like the blurred hero wall.
export function drawWall(scale = 0.25) {
  const c = document.createElement('canvas')
  c.width = TILE_W * scale
  c.height = TILE_H * scale
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#1c120d' // the mortar: the page background, as on the hero
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.scale(scale, scale)
  for (const s of stones()) {
    ctx.fillStyle = s.fill
    ctx.beginPath()
    ctx.roundRect(s.x, s.y, s.w, s.h, 9)
    ctx.fill()
  }
  return c
}
