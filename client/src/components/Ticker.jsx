import { useEffect, useState } from 'react'
const base = { 'BTC/USD':67000,'ETH/USD':3400,'XAUUSD':2350,'EUR/USD':1.085,'GBP/USD':1.27,'USD/JPY':155.2 }
export default function Ticker() {
  const [p, setP] = useState(base)
  useEffect(() => { const id = setInterval(() => setP(o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v * (1 + (Math.random() - .5) / 800)]))), 2000); return () => clearInterval(id) }, [])
  return (<div className="bg-coal border-y border-dgold/30 overflow-x-auto">
    <div className="flex gap-8 px-4 py-2 text-sm whitespace-nowrap items-center">
      {Object.entries(p).map(([k, v]) => <span key={k}><b className="text-gold">{k}</b> {v.toFixed(v > 100 ? 2 : 4)}</span>)}
      <span className="text-white/50 text-xs">Simulated demonstration prices, not real exchange quotes.</span>
    </div></div>)
}
