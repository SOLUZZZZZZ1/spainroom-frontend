export default function LogoSpainRoom({ className = "", size = 100, label = "SpainRoom" }) {
  return (
    <div className={className} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size * 0.62} viewBox="0 0 200 124" aria-label={label} role="img">
        <path d="M10 70 L100 10 L190 70 V114 H10 Z" fill="none" stroke="#0b65d8" strokeWidth="10" />
        <path
          d="M100 55 c-10 -15 -35 -10 -35 8 c0 22 35 37 35 37 c0 0 35 -15 35 -37 c0 -18 -25 -23 -35 -8 Z"
          fill="#0b65d8"
        />
        <rect x="85" y="80" width="30" height="34" rx="4" fill="#0b65d8" opacity="0.15" />
      </svg>
      <span style={{ fontWeight: 900, letterSpacing: 0.5 }}>SPAINROOM</span>
    </div>
  );
}
