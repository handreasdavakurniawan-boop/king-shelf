// The longcase clock on the wall, from the Figma component "Jam bandul / 02:57".
// It reads 2:57: "Near three the keys stop". Only the pendulum moves (CSS, .pendulum).
const TICKS = Array.from({ length: 60 }, (_, i) => i)

export default function Clock() {
  return (
    <svg className="clock" viewBox="0 0 156 350" aria-hidden="true">
      <defs>
        <linearGradient id="clk-wood" x1="0" x2="1">
          <stop offset="0" stopColor="#24160f" />
          <stop offset="0.45" stopColor="#3d271a" />
          <stop offset="1" stopColor="#1e130d" />
        </linearGradient>
        <radialGradient id="clk-face" cx="0.42" cy="0.38">
          <stop offset="0" stopColor="#f4ead2" />
          <stop offset="1" stopColor="#cdbd99" />
        </radialGradient>
        <radialGradient id="clk-brass" cx="0.35" cy="0.35">
          <stop offset="0" stopColor="#f2c66e" />
          <stop offset="1" stopColor="#9a6a24" />
        </radialGradient>
      </defs>

      {/* hood: pointed finial, arched top around the face */}
      <path d="M78 0 L84 14 H72 Z" fill="#d49a3a" />
      <path d="M8 150 V80 A70 70 0 0 1 148 80 V150 Z" fill="url(#clk-wood)" stroke="#5a3a22" strokeWidth="2" />
      <path d="M18 146 V84 A60 60 0 0 1 138 84 V146 Z" fill="#1a100b" opacity="0.55" />
      <circle cx="78" cy="88" r="54" fill="#5a3a22" />
      <circle cx="78" cy="88" r="50" fill="url(#clk-face)" stroke="#d49a3a" strokeWidth="2.5" />
      {TICKS.map((i) => (
        <line
          key={i} x1="78" y1={i % 5 ? 42 : 41} x2="78" y2={i % 5 ? 45 : 49}
          stroke="#2a1b13" strokeWidth={i % 5 ? 1 : 2.2} transform={`rotate(${i * 6} 78 88)`}
        />
      ))}
      <text x="78" y="62" textAnchor="middle" fontSize="9" fontFamily="Georgia, serif" fill="#2a1b13">XII</text>
      {/* 2:57: hour hand at 88.5°, minute hand at 342° */}
      <line x1="78" y1="88" x2="78" y2="62" stroke="#1c120d" strokeWidth="3.4" strokeLinecap="round" transform="rotate(88.5 78 88)" />
      <line x1="78" y1="92" x2="78" y2="48" stroke="#1c120d" strokeWidth="2" strokeLinecap="round" transform="rotate(342 78 88)" />
      <circle cx="78" cy="88" r="3.5" fill="#d49a3a" />

      {/* trunk with a lancet window onto the pendulum */}
      <rect x="22" y="150" width="112" height="170" fill="url(#clk-wood)" stroke="#5a3a22" strokeWidth="2" />
      <path d="M48 300 V190 A30 30 0 0 1 108 190 V300 Z" fill="#120a06" stroke="#d49a3a" strokeWidth="1.5" strokeOpacity="0.55" />
      <g className="pendulum">
        <line x1="78" y1="168" x2="78" y2="268" stroke="#b78a45" strokeWidth="2" />
        <circle cx="78" cy="276" r="13" fill="url(#clk-brass)" />
      </g>

      {/* base */}
      <rect x="12" y="320" width="132" height="14" rx="2" fill="#3d271a" stroke="#5a3a22" strokeWidth="2" />
      <rect x="18" y="334" width="120" height="14" rx="2" fill="#24160f" />
    </svg>
  )
}
