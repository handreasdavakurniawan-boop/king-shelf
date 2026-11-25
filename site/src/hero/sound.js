// Everything audible on the page, made in the browser with Web Audio (no audio files):
// typewriter keys, the carriage bell, and an original estampie-style tune in D Dorian
// over a drone, played in a small stone-room echo. Silent until setSound(true), which
// must come from a click: browsers block sound before the visitor interacts.

let ctx, master, music, sfx, noise, timer
let on = false

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12)

// [midi note, length in eighth notes]; 6/8 dance, two eight-bar phrases (A then B).
const TUNE = [
  [69, 2], [67, 1], [65, 2], [64, 1], [62, 3], [65, 2], [67, 1], [69, 2], [72, 1], [71, 2], [69, 1], [67, 3], [69, 3],
  [69, 2], [67, 1], [65, 2], [64, 1], [62, 2], [64, 1], [65, 2], [67, 1], [64, 2], [62, 1], [60, 2], [64, 1], [62, 6],
  [74, 2], [72, 1], [69, 2], [72, 1], [74, 3], [69, 3], [72, 2], [69, 1], [67, 2], [69, 1], [65, 3], [64, 3],
  [74, 2], [72, 1], [69, 2], [67, 1], [65, 2], [67, 1], [69, 2], [65, 1], [64, 2], [62, 1], [60, 2], [64, 1], [62, 6],
]
const EIGHTH = 0.2 // seconds

function setup() {
  ctx = new AudioContext()
  master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  // stone-room echo: an impulse response of fading noise
  const verb = ctx.createConvolver()
  const len = Math.floor(ctx.sampleRate * 2.2)
  const ir = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3
  }
  verb.buffer = ir
  const wet = ctx.createGain()
  wet.gain.value = 0.3
  verb.connect(wet).connect(master)

  music = ctx.createGain()
  music.gain.value = 0.45
  sfx = ctx.createGain()
  sfx.gain.value = 0.7
  for (const bus of [music, sfx]) { bus.connect(master); bus.connect(verb) }

  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const n = noise.getChannelData(0)
  for (let i = 0; i < n.length; i++) n[i] = Math.random() * 2 - 1

  // drone on D and A, like a hurdy-gurdy, breathing slowly
  const droneGain = ctx.createGain()
  droneGain.gain.value = 0.035
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 650
  lp.connect(droneGain).connect(music)
  for (const m of [50, 57]) {
    const o = ctx.createOscillator()
    o.type = 'sawtooth'
    o.frequency.value = hz(m)
    o.connect(lp)
    o.start()
  }
  const lfo = ctx.createOscillator()
  const depth = ctx.createGain()
  lfo.frequency.value = 0.15
  depth.gain.value = 0.012
  lfo.connect(depth).connect(droneGain.gain)
  lfo.start()

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) ctx.suspend()
    else if (on) ctx.resume()
  })
}

function envelope(t, peak, decay) {
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + 0.004)
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay)
  return g
}

// lute-like pluck: a triangle wave with a quiet octave, dying away
function pluck(t, midi, length) {
  const decay = Math.max(0.5, length * 1.4)
  const g = envelope(t, 0.2, decay)
  g.connect(music)
  for (const [mult, level] of [[1, 1], [2, 0.3]]) {
    const o = ctx.createOscillator()
    const l = ctx.createGain()
    o.type = mult === 1 ? 'triangle' : 'sine'
    o.frequency.value = hz(midi) * mult
    l.gain.value = level
    o.connect(l).connect(g)
    o.start(t)
    o.stop(t + decay + 0.05)
  }
}

function burst(t, { filter, freq, q = 1, peak, decay, bus }) {
  const src = ctx.createBufferSource()
  src.buffer = noise
  src.playbackRate.value = 0.8 + Math.random() * 0.4
  const f = ctx.createBiquadFilter()
  f.type = filter
  f.frequency.value = freq
  f.Q.value = q
  const g = envelope(t, peak, decay)
  src.connect(f).connect(g).connect(bus)
  src.start(t, Math.random() * 0.5)
  src.stop(t + decay + 0.05)
}

// a tabor (frame drum) on each dotted quarter, stronger on the downbeat
function drum(t, strong) {
  burst(t, { filter: 'lowpass', freq: 170, peak: strong ? 0.5 : 0.28, decay: 0.18, bus: music })
}

let next = 0
let note = 0
let beat = 0
function schedule() {
  while (next < ctx.currentTime + 0.3) {
    const [midi, len] = TUNE[note]
    pluck(next, midi, len * EIGHTH)
    for (let k = 0; k < len; k++) if ((beat + k) % 3 === 0) drum(next + k * EIGHTH, (beat + k) % 6 === 0)
    beat = (beat + len) % 6
    next += len * EIGHTH
    note = (note + 1) % TUNE.length
  }
}

export function setSound(value) {
  on = value
  if (on) {
    if (!ctx) setup()
    ctx.resume()
    master.gain.setTargetAtTime(0.8, ctx.currentTime, 0.15)
    next = ctx.currentTime + 0.15 // carry on from where the tune was, not from the top
    clearInterval(timer)
    timer = setInterval(schedule, 100)
  } else if (ctx) {
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.1)
    clearInterval(timer)
    setTimeout(() => !on && ctx.suspend(), 600)
  }
}

// one typebar hitting the platen: a bright click plus a soft thump
export function keyClick() {
  if (!on) return
  const t = ctx.currentTime
  burst(t, { filter: 'bandpass', freq: 2200 + Math.random() * 1200, q: 1.4, peak: 0.35 + Math.random() * 0.2, decay: 0.035, bus: sfx })
  burst(t, { filter: 'lowpass', freq: 260, peak: 0.3, decay: 0.06, bus: sfx })
}

// the end-of-line bell
export function bell() {
  if (!on) return
  const t = ctx.currentTime
  const g = envelope(t, 0.18, 1.6)
  g.connect(sfx)
  for (const f of [2093, 3140]) {
    const o = ctx.createOscillator()
    o.frequency.value = f
    o.connect(g)
    o.start(t)
    o.stop(t + 1.7)
  }
}
