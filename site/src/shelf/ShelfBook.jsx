// One book standing spine-out on the shelf. When selected it slides out of the row,
// turns to show its front cover, and floats beside the detail panel.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { renderSpine, renderCover } from '../covers/drawCover'
import { colorFor } from '../covers/palette'
import { BOOK } from '../components/Book3D'
import { shelfState } from './layout'
import { inspect } from './inspect'
import { browse } from './browse'
import { bookGeometry, pagesSide, pagesTop, clothMaterial } from './materials'

const LIFT = 0.22 // how far a hovered book rises out of the row
const { damp } = THREE.MathUtils

// How far (in radians) every book leans while the shelf is moving.
// `velocity` is the camera's sideways speed in scene units per second:
// positive = moving right, negative = moving left, 0 = standing still.
// A positive angle tips the top of a book to the LEFT, negative to the right.
// Capped at ±0.15 rad (~9°): long jumps (search, arrows, Next) move the camera at
// 30–40 units/s, which uncapped would tip books ~60° into their neighbours.
const MAX_LEAN = 0.15
export function leanFor(velocity) {
  return Math.max(-MAX_LEAN, Math.min(MAX_LEAN, velocity * 0.03))
}

const toTexture = (canvas, anisotropy = 8) => {
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = anisotropy
  return t
}

const target = new THREE.Vector3()
const TAU = Math.PI * 2
const wrapAngle = (a) => a - TAU * Math.round(a / TAU) // into -π..π

export default function ShelfBook({ item, isSelected, onSelect }) {
  const { book, scale, x, height } = item
  const group = useRef()
  const mesh = useRef()
  const swayAmount = useRef(0.12)
  const cloth = colorFor(book.number).cloth

  // Until its spine artwork is painted, a book shows plain cloth colour.
  const spineMat = useMemo(() => new THREE.MeshStandardMaterial({ color: cloth, roughness: 0.7 }), [cloth])
  useEffect(() => {
    let alive = true
    let tex
    renderSpine(book).then((canvas) => {
      if (!alive) return
      tex = toTexture(canvas, 4)
      spineMat.map = tex
      spineMat.color.set('#ffffff')
      spineMat.needsUpdate = true
    })
    return () => {
      alive = false
      tex?.dispose()
    }
  }, [book, spineMat])

  // Full-size front/back artwork is painted the first time the book is opened, then kept.
  const [cover, setCover] = useState(null)
  useEffect(() => {
    if (!isSelected || cover) return
    let alive = true
    renderCover(book).then(({ front, back }) => {
      if (!alive) return
      setCover({
        front: new THREE.MeshStandardMaterial({ map: toTexture(front), roughness: 0.7 }),
        back: new THREE.MeshStandardMaterial({ map: toTexture(back), roughness: 0.7 }),
      })
    })
    return () => { alive = false }
  }, [isSelected, cover, book])
  useEffect(() => () => cover && [cover.front, cover.back].forEach((m) => { m.map.dispose(); m.dispose() }), [cover])

  // Box material slots: +x, -x (spine), +y, -y, +z (front), -z (back)
  const materials = useMemo(() => {
    const c = clothMaterial(cloth)
    return [pagesSide, spineMat, pagesTop, pagesTop, cover?.front ?? c, cover?.back ?? c]
  }, [cloth, spineMat, cover])

  useFrame((state, dt) => {
    const g = group.current
    const m = mesh.current

    if (isSelected) {
      // Place the book in camera space: big enough to read, beside (desktop)
      // or above (phone) the detail panel.
      const { camera, size } = state
      const aspect = size.width / size.height
      const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
      const wide = aspect >= 1
      // Share of the screen the book may take. On phones it must fit the top ~45%
      // above the details sheet (which covers the bottom 52%).
      const fillH = wide ? 0.62 : 0.38
      const fillW = wide ? 0.4 : 0.62
      const fit = Math.max(height / (2 * fillH * tanH), (BOOK.w * scale) / (2 * fillW * tanH * aspect))
      const d = fit / inspect.zoom // zooming in = bringing the book closer
      const halfW = d * tanH * aspect
      const halfH = d * tanH
      // Left of centre on desktop; slides toward the middle as it grows so the
      // zoomed book never leaves the screen's left edge.
      const offset = Math.min(0.42, 0.98 - fillW * inspect.zoom)
      target.set(wide ? -halfW * offset : 0, wide ? 0 : halfH * 0.5, -d)
      camera.localToWorld(target)
      shelfState.readingTarget.copy(target)

      // Pull straight out first (fast z), then glide and turn (slower).
      g.position.z = damp(g.position.z, target.z, 7, dt)
      g.position.x = damp(g.position.x, target.x, 4, dt)
      g.position.y = damp(g.position.y, target.y - height / 2, 4, dt)
      g.rotation.z = damp(g.rotation.z, 0, 6, dt)

      // Drag to turn; after letting go the book glides, then eases back to face front.
      const I = inspect
      const home = Math.round(I.yaw / TAU) * TAU // nearest "front", so it never unwinds full turns
      if (!I.dragging) {
        I.yaw += I.yawVel * dt
        I.yawVel *= Math.exp(-3 * dt)
        if (performance.now() - I.releasedAt > 900 && Math.abs(I.yawVel) < 0.4) {
          I.yaw = damp(I.yaw, home, 2.2, dt)
          I.pitch = damp(I.pitch, 0, 2.2, dt)
        }
      }
      // The gentle idle sway only plays while the book rests facing front.
      const resting = !I.dragging && Math.abs(I.yaw - home) < 0.05 && Math.abs(I.pitch) < 0.05
      swayAmount.current = damp(swayAmount.current, resting ? 0.12 : 0, 2, dt)
      const sway = Math.sin(state.clock.elapsedTime * 0.5) * swayAmount.current
      const follow = I.dragging ? 12 : 4
      m.rotation.y = damp(m.rotation.y, I.yaw + sway, follow, dt)
      m.rotation.x = damp(m.rotation.x, I.pitch, follow, dt)
      return
    }

    // On the shelf (or flying back to it): turn first, then slide home.
    // Fold away any full turns the visitor made so the book doesn't spin them back.
    m.rotation.y = Math.PI / 2 + wrapAngle(m.rotation.y - Math.PI / 2)
    m.rotation.x = damp(m.rotation.x, 0, 6, dt)
    const turned = Math.abs(m.rotation.y - Math.PI / 2) < 0.4
    m.rotation.y = damp(m.rotation.y, Math.PI / 2, 6, dt)
    g.position.x = damp(g.position.x, x, 5, dt)
    g.position.z = damp(g.position.z, turned ? 0 : g.position.z, 6, dt)
    const lifted =
      !shelfState.selected &&
      (shelfState.hovered === book.slug ||
        (shelfState.highlight === book.slug && performance.now() < shelfState.highlightUntil))
    g.position.y = damp(g.position.y, lifted ? LIFT : 0, 8, dt)
    g.rotation.z = damp(g.rotation.z, leanFor(shelfState.velocity || 0), 6, dt)
  })

  return (
    // The group sits at the book's base so leaning pivots on the shelf, not mid-air.
    <group ref={group} position={[x, 0, 0]}>
      <mesh
        ref={mesh}
        geometry={bookGeometry}
        material={materials}
        position={[0, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]} // turn the spine (-x) to face the viewer
        scale={scale}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation()
          // A drag (turning the open book, or swiping the shelf) is not a click.
          if (shelfState.selected ? inspect.moved : browse.moved) return
          if (!isSelected) onSelect(book.slug)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          shelfState.hovered = book.slug
          if (!isSelected) document.documentElement.classList.add('over-book')
        }}
        onPointerOut={() => {
          if (shelfState.hovered === book.slug) shelfState.hovered = null
          document.documentElement.classList.remove('over-book')
        }}
      />
    </group>
  )
}
