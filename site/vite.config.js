import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative asset paths: the built site works at any address, including a GitHub Pages
  // project URL like https://<user>.github.io/<repo>/ — whatever the repo ends up being called.
  base: './',
  server: { port: 5173, strictPort: true },
})
