// "Antique leather" palette. Books take colours in turn along the shelf,
// so neighbours never share a colour. Each entry is the cloth colour;
// the darker rim and the shadows are derived from it.
export const PALETTE = [
  { name: 'Emerald', cloth: '#1f5244' },
  { name: 'Burgundy', cloth: '#5e1c28' },
  { name: 'Navy', cloth: '#1d2c4f' },
  { name: 'Chestnut', cloth: '#5c3b22' },
  { name: 'Plum', cloth: '#45254a' },
  { name: 'Charcoal', cloth: '#34383b' },
  { name: 'Forest', cloth: '#2c4024' },
  { name: 'Oxblood', cloth: '#4c1519' },
  { name: 'Teal', cloth: '#17484a' },
  { name: 'Ochre', cloth: '#7a5a1e' },
  { name: 'Slate', cloth: '#35485d' },
  { name: 'Mahogany', cloth: '#522a20' },
  { name: 'Olive', cloth: '#4b4b25' },
  { name: 'Indigo', cloth: '#23254a' },
]

export const colorFor = (number) => PALETTE[(number - 1) % PALETTE.length]

// Mix a hex colour toward black (amt < 0) or white (amt > 0), amt in -1..1.
export function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map((c) =>
    Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt),
  )
  return '#' + ch.map((c) => c.toString(16).padStart(2, '0')).join('')
}
