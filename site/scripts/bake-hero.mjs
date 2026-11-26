// Bakes the hero's blurred layers into WebP images, so phones and tablets don't have to blur
// full-screen layers live (that ran them out of graphics memory and left parts of the hero blank).
// Run after changing anything in src/hero/art:   node scripts/bake-hero.mjs
// Needs Node 22+ and Chrome; set CHROME=path/to/chrome if it isn't in the usual Windows place.
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const art = fileURLToPath(new URL('../src/hero/art/', import.meta.url))
const full = [0, 0, 1440, 900]
// name: [blur in design px, [file, [left, top, width, height]]...] — same boxes and blur as the CSS used
const LAYERS = {
  beams: [[0, ['shafts', full]], [6, ['shafts', full]]],
  soft: [[6, ['room', full], ['writer', [454.5, 259.5, 481, 420]]]],
  front: [[3, ['glass', full]], [3, ['frame', full]], [3, ['sill', full]]],
  stack: [[4, ['books', full]]],
}

const dataUrl = async (name) => `data:image/svg+xml;base64,${(await readFile(join(art, `${name}.svg`))).toString('base64')}`
const chrome = spawn(process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--remote-debugging-port=9334', `--user-data-dir=${await mkdtemp(join(tmpdir(), 'bake-'))}`, '--no-first-run', 'about:blank',
], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

try {
  let page
  for (let i = 0; i < 50 && !page; i++) {
    await sleep(200)
    page = await fetch('http://127.0.0.1:9334/json/list').then((r) => r.json()).then((t) => t.find((x) => x.type === 'page'), () => null)
  }
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((r) => (ws.onopen = r))
  let id = 0
  const pending = new Map()
  ws.onmessage = (m) => { const d = JSON.parse(m.data); pending.get(d.id)?.(d.result); pending.delete(d.id) }
  const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })) })

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
  await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } })
  const { frameTree } = await send('Page.getFrameTree')

  for (const [name, groups] of Object.entries(LAYERS)) {
    let html = '<body style="margin:0;width:1440px;height:900px;overflow:hidden">'
    for (const [blur, ...images] of groups) {
      html += `<div style="position:absolute;inset:0;filter:blur(${blur}px)">`
      for (const [file, [x, y, w, h]] of images) {
        html += `<img src="${await dataUrl(file)}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px">`
      }
      html += '</div>'
    }
    await send('Page.setDocumentContent', { frameId: frameTree.frame.id, html })
    await send('Runtime.evaluate', { expression: 'Promise.all([...document.images].map((i) => i.decode()))', awaitPromise: true })
    const { data } = await send('Page.captureScreenshot', { format: 'webp', quality: 88 })
    const file = Buffer.from(data, 'base64')
    await writeFile(join(art, `${name}.webp`), file)
    console.log(`${name}.webp ${(file.length / 1024).toFixed(0)} KB`)
  }
  ws.close()
} finally {
  chrome.kill()
}
