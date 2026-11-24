import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { renderCover, pagesTexture } from '../covers/drawCover'

// Book size in scene units. Thickness follows the spine artwork's proportions
// (140 x 900) so the spine texture is never stretched.
export const BOOK = { w: 2, h: 3, d: 3 * (140 / 900) }

const toTexture = (canvas) => {
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

export default function Book3D({ book, ...props }) {
  const [tex, setTex] = useState(null)
  const pages = useMemo(
    () => ({ side: toTexture(pagesTexture(true)), top: toTexture(pagesTexture(false)) }),
    [],
  )

  useEffect(() => {
    let alive = true
    let made
    renderCover(book).then(({ front, spine, back }) => {
      if (!alive) return
      made = { front: toTexture(front), spine: toTexture(spine), back: toTexture(back) }
      setTex(made)
    })
    return () => {
      alive = false
      made && Object.values(made).forEach((t) => t.dispose())
    }
  }, [book])

  if (!tex) return null
  // BoxGeometry material slots: +x, -x, +y, -y, +z, -z
  // Spine on -x, front cover facing +z (towards the camera), back on -z.
  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={[BOOK.w, BOOK.h, BOOK.d]} />
      <meshStandardMaterial attach="material-0" map={pages.side} roughness={0.95} />
      <meshStandardMaterial attach="material-1" map={tex.spine} roughness={0.7} />
      <meshStandardMaterial attach="material-2" map={pages.top} roughness={0.95} />
      <meshStandardMaterial attach="material-3" map={pages.top} roughness={0.95} />
      <meshStandardMaterial attach="material-4" map={tex.front} roughness={0.7} />
      <meshStandardMaterial attach="material-5" map={tex.back} roughness={0.7} />
    </mesh>
  )
}
