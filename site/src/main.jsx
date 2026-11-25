import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Cinzel is painted onto the book covers (covers/drawCover.js); the page itself uses the other three.
import '@fontsource/cinzel/400.css'
import '@fontsource/cinzel/700.css'
import '@fontsource/grenze-gotisch/600.css'
import '@fontsource/jost/400.css'
import '@fontsource/jost/500.css'
import '@fontsource/jost/400-italic.css'
import '@fontsource/special-elite/400.css'
import './styles.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
