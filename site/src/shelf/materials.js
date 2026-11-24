// Geometry, materials and procedural textures shared by every book on the shelf.
// Sharing them means 63 books cost about as much GPU memory as a handful.
import * as THREE from 'three'
import { BOOK } from '../components/Book3D'
import { pagesTexture } from '../covers/drawCover'

const toTexture = (canvas) => {
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export const bookGeometry = new THREE.BoxGeometry(BOOK.w, BOOK.h, BOOK.d)

export const pagesSide = new THREE.MeshStandardMaterial({ map: toTexture(pagesTexture(true)), roughness: 0.95 })
export const pagesTop = new THREE.MeshStandardMaterial({ map: toTexture(pagesTexture(false)), roughness: 0.95 })

const clothCache = new Map()
export function clothMaterial(hex) {
  if (!clothCache.has(hex)) clothCache.set(hex, new THREE.MeshStandardMaterial({ color: hex, roughness: 0.75 }))
  return clothCache.get(hex)
}

// Dark walnut plank: long streaks of grain with a little wobble.
function woodCanvas() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 128
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#3a2517'
  ctx.fillRect(0, 0, c.width, c.height)
  for (let i = 0; i < 160; i++) {
    const y = Math.random() * c.height
    const dark = Math.random() < 0.7
    ctx.strokeStyle = dark ? `rgba(18,9,4,${0.15 + Math.random() * 0.3})` : `rgba(150,100,60,${0.05 + Math.random() * 0.1})`
    ctx.lineWidth = 0.5 + Math.random() * 1.5
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x <= c.width; x += 64) ctx.lineTo(x, y + Math.sin(x / 90 + i) * 2.5)
    ctx.stroke()
  }
  return c
}

export function woodMaterial(length) {
  const t = toTexture(woodCanvas())
  t.wrapS = THREE.RepeatWrapping
  t.repeat.set(length / 4, 1)
  t.anisotropy = 8
  return new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 })
}
