"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { target: number; suffix: string; label: string; fmt?: (n: number) => string };

const STATS: Stat[] = [
  { target: 1_000_000, suffix: "+", label: "Orders governed", fmt: (n) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : `${Math.round(n / 1000)}K`) },
  { target: 65, suffix: "", label: "Cities, each with its own band" },
  { target: 20_000, suffix: "+", label: "Active riders", fmt: (n) => `${Math.round(n / 1000)}K` },
  { target: 7, suffix: "-day", label: "Refresh cadence, always current" },
];

function useCountUp(target: number, run: boolean, dur = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0, start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, dur]);
  return n;
}

function Card({ stat, run }: { stat: Stat; run: boolean }) {
  const n = useCountUp(stat.target, run);
  const shown = stat.fmt ? stat.fmt(n) : Math.round(n).toLocaleString();
  return (
    <div className="stat-glow card-tier" style={{ background: "var(--surface)", border: "1px solid rgba(var(--accent-rgb),0.25)", borderRadius: "16px", padding: "24px 18px", textAlign: "center", flex: 1, minWidth: "150px" }}>
      <div className="gradient-heading" style={{ fontSize: "2.1rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05, fontVariantNumeric: "tabular-nums" }}>
        {shown}{stat.suffix}
      </div>
      <div style={{ fontSize: "0.76rem", color: "var(--foreground-muted)", marginTop: "8px", lineHeight: 1.5 }}>{stat.label}</div>
    </div>
  );
}

export default function ScaleBand() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setRun(true)), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "22px" }}>
      {STATS.map((s) => <Card key={s.label} stat={s} run={run} />)}
    </div>
  );
}
