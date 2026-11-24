// STAGE 1 PREVIEW (temporary): three sample covers + one 3D book to approve the cover design.
// This page is replaced by the real shelf in stage 5.
import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { books } from '../data/books'
import { colorFor } from '../covers/palette'
import { renderCover, toRoman } from '../covers/drawCover'
import Book3D from './Book3D'

const SAMPLE_SLUGS = ['carrie', 'it', 'the-girl-who-loved-tom-gordon', 'black-house', 'the-long-walk']
const samples = SAMPLE_SLUGS.map((s) => books.find((b) => b.slug === s))

function FlatCover({ book, active, onSelect }) {
  const [urls, setUrls] = useState(null)
  useEffect(() => {
    renderCover(book).then((c) =>
      setUrls({ back: c.back.toDataURL(), spine: c.spine.toDataURL(), front: c.front.toDataURL() }),
    )
  }, [book])
  return (
    <button className={`sample ${active ? 'is-active' : ''}`} onClick={onSelect}>
      <div className="wrap">
        {urls ? (
          <>
            <img src={urls.back} alt="" />
            <img src={urls.spine} alt="" className="spine" />
            <img src={urls.front} alt={`Cover of ${book.title}`} />
          </>
        ) : (
          <div className="loading">Menggambar sampul…</div>
        )}
      </div>
      <div className="meta">
        <span className="title">{book.title}</span>
        <span className="tag">No. {book.number} · {colorFor(book.number).name}</span>
      </div>
    </button>
  )
}

export default function CoverPreview() {
  const [current, setCurrent] = useState(samples[0])
  return (
    <main>
      <header>
        <p className="eyebrow">Pratinjau tahap 1 · sementara</p>
        <h1>Contoh sampul</h1>
        <p className="lede">
          Tiga dari 63 buku. Klik salah satu untuk melihatnya sebagai buku 3D, lalu seret untuk memutar.
        </p>
      </header>

      <section className="stage" aria-label="Buku 3D">
        <Canvas camera={{ position: [3.4, 0.8, 4.6], fov: 32 }} shadows dpr={[1, 2]}>
          <color attach="background" args={['#0b1210']} />
          <ambientLight intensity={0.45} color="#fff2dc" />
          <directionalLight position={[3, 6, 5]} intensity={2.4} color="#ffe3b8" castShadow />
          <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#9fc2ff" />
          <Book3D key={current.slug} book={current} />
          <OrbitControls autoRotate autoRotateSpeed={1.2} enablePan={false} minDistance={4} maxDistance={9} />
        </Canvas>
      </section>

      <section className="samples">
        {samples.map((b) => (
          <FlatCover key={b.slug} book={b} active={b === current} onSelect={() => setCurrent(b)} />
        ))}
      </section>

      <section className="catalogue">
        <h2>Daftar rak ({books.length} buku)</h2>
        <p className="lede">Urutan, tahun terbit, jenis, dan nama penulis di sampul. Mohon dicek.</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>No.</th><th>Judul</th><th>Tahun</th><th>Jenis</th><th>Penulis di sampul</th><th>Warna</th></tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.slug}>
                  <td className="num">{toRoman(b.number)}</td>
                  <td>{b.title}</td>
                  <td>{b.year}</td>
                  <td>{b.type}</td>
                  <td>{b.credit}</td>
                  <td>
                    <span className="swatch" style={{ background: colorFor(b.number).cloth }} />
                    {colorFor(b.number).name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
