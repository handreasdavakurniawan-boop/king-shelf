// The 3D shelf: plank, wall, a warm lamp that travels with the viewer,
// and a camera rig that turns vertical page scroll into sideways movement.
import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { layout, SHELF_LENGTH, shelfState } from './layout'
import { woodMaterial } from './materials'
import { inspect } from './inspect'
import { browse, stepBrowse } from './browse'
import ShelfBook from './ShelfBook'

const MIN_HALF_VIEW = 1.6 // on narrow (phone) screens, keep at least this much shelf on each side
const BOOK_H = 3

function Rig({ onView }) {
  const { camera, size } = useThree()
  const s = useRef({ x: null, last: -1, dolly: 1 })

  useFrame((_, dt) => {
    const aspect = size.width / size.height
    const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    // Far enough that the tallest book fills ~60% of the screen height (room for
    // the masthead above and the search dock below), farther still on narrow screens.
    const dist = Math.max(BOOK_H / (0.6 * 2 * tanH), MIN_HALF_VIEW / (tanH * aspect))
    const half = dist * tanH * aspect // half the visible shelf width

    // Camera travels from "first book at the left edge" to "last book at the right edge".
    const margin = 0.6
    const x0 = Math.min(-margin + half, SHELF_LENGTH / 2)
    const x1 = Math.max(SHELF_LENGTH + margin - half, x0)
    shelfState.x0 = x0
    shelfState.x1 = x1
    shelfState.pxToUnits = (2 * half) / size.width

    // Follow the browse target (swipe, wheel, glide, search, arrows), kept inside the shelf.
    if (shelfState.camTarget === null) shelfState.camTarget = x0
    stepBrowse(dt)
    const target = Math.min(x1, Math.max(x0, shelfState.camTarget))

    const st = s.current
    if (st.x === null) st.x = target
    const prev = st.x
    // Snappy while a finger/mouse holds the shelf, softer for glides and jumps.
    st.x = THREE.MathUtils.damp(st.x, target, browse.dragging ? 16 : 6, dt)
    shelfState.camX = st.x
    shelfState.velocity = dt > 0 ? (st.x - prev) / dt : 0

    // While a book is open the camera eases back, making room for the book in front.
    st.dolly = THREE.MathUtils.damp(st.dolly, shelfState.selected ? 1.3 : 1, 4, dt)
    camera.position.set(st.x, 2.1, dist * st.dolly)
    camera.lookAt(st.x, 1.6, 0)
    camera.updateMatrixWorld() // books place themselves in camera space this frame

    // Which books are (mostly) on screen, plus the one nearest the centre.
    let first = -1
    let last = -1
    let center = 0
    let best = Infinity
    layout.forEach((l, i) => {
      const d = Math.abs(l.x - st.x)
      if (d < best) { best = d; center = i }
      if (d < half - l.thickness / 2) { if (first < 0) first = i; last = i }
    })
    const key = `${first}-${last}-${center}`
    if (key !== st.last) { st.last = key; onView({ first, last, center }) }
  })
  return null
}

function Lamp() {
  const ref = useRef()
  useFrame(({ camera }, dt) => {
    const l = ref.current
    l.position.set(camera.position.x + 0.6, 6, 4)
    l.target.position.set(camera.position.x, 1.2, 0)
    l.target.updateMatrixWorld()
    l.intensity = THREE.MathUtils.damp(l.intensity, shelfState.selected ? 45 : 95, 4, dt)
  })
  return (
    <spotLight
      ref={ref}
      angle={0.6}
      penumbra={0.9}
      intensity={95}
      decay={2}
      color="#ffd9a3"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0004}
    />
  )
}

// A narrow light from just above the viewer that only comes on for the opened book.
function ReadingLight() {
  const ref = useRef()
  useFrame(({ camera }, dt) => {
    const l = ref.current
    l.position.set(camera.position.x + 1.2, camera.position.y + 2.2, camera.position.z - 1)
    l.target.position.copy(shelfState.readingTarget)
    l.target.updateMatrixWorld()
    l.intensity = THREE.MathUtils.damp(l.intensity, shelfState.selected ? 110 : 0, 4, dt)
  })
  return <spotLight ref={ref} intensity={0} angle={0.32} penumbra={0.7} decay={2} color="#fff1d6" />
}

function Furniture() {
  const length = SHELF_LENGTH + 12
  const wood = useMemo(() => woodMaterial(length), [length])
  return (
    <>
      <mesh position={[SHELF_LENGTH / 2, -0.09, 0.15]} material={wood} receiveShadow>
        <boxGeometry args={[length, 0.18, 2.7]} />
      </mesh>
      <mesh position={[SHELF_LENGTH / 2, 4, -1.25]} receiveShadow>
        <planeGeometry args={[length + 30, 14]} />
        <meshStandardMaterial color="#14201c" roughness={1} />
      </mesh>
    </>
  )
}

export default function ShelfScene({ onView, selected, onSelect, onClose, running = true }) {
  return (
    <Canvas
      // Paused while the shelf is scrolled out of sight (the hero is on screen).
      frameloop={running ? 'always' : 'never'}
      shadows
      dpr={[1, 2]}
      camera={{ fov: 28, position: [0, 1.9, 8] }}
      onPointerMissed={() => selected && !inspect.moved && onClose()}
    >
      <color attach="background" args={['#0b1210']} />
      <ambientLight intensity={0.3} color="#ffeccc" />
      <directionalLight position={[0, 2.5, 9]} intensity={0.55} color="#fff3df" />
      <Lamp />
      <ReadingLight />
      <Rig onView={onView} />
      <Furniture />
      {layout.map((item) => (
        <ShelfBook
          key={item.book.slug}
          item={item}
          isSelected={selected === item.book.slug}
          onSelect={onSelect}
        />
      ))}
    </Canvas>
  )
}
