import ShelfPage from './shelf/ShelfPage'
import CoverPreview from './components/CoverPreview'

// The cover sample sheet stays reachable at /?covers for design checks.
export default function App() {
  return new URLSearchParams(window.location.search).has('covers') ? <CoverPreview /> : <ShelfPage />
}
