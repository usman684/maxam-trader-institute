export default function Logo({ size = 40, text = true }) {
  return (<div className="flex items-center gap-3">
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="MAXAM logo">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFD700"/><stop offset="1" stopColor="#B8860B"/></linearGradient></defs>
      <polygon points="50,4 91,27 91,73 50,96 9,73 9,27" fill="#050505" stroke="url(#g)" strokeWidth="4"/>
      <path d="M26 72V30l24 26 24-26v42" fill="none" stroke="url(#g)" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
    {text && <div className="leading-tight"><div className="font-display font-bold gold-text tracking-wide">MAXAM</div><div className="text-[10px] text-white/70">TRADER INSTITUTE</div></div>}
  </div>)
}
