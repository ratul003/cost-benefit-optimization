"use client";

import { useState } from "react";

type Stage = { icon: React.ReactNode; title: string; sub: string };

const I = (paths: React.ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths}</svg>
);

const STAGES: Stage[] = [
  { icon: I(<><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>), title: "BigQuery warehouse", sub: "fulfillment data lake" },
  { icon: I(<><path d="M4 4h16v4H4z" /><path d="M4 10h16v4H4z" /><path d="M4 16h16v4H4z" /></>), title: "6 SQL extracts", sub: "orders, riders, cost, refunds" },
  { icon: I(<><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></>), title: "Weekly panel in R", sub: "27 signals, centered + scaled" },
  { icon: I(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>), title: "Models + cost-benefit", sub: "crossover per market" },
  { icon: I(<><path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7z" /></>), title: "Per-city stacking band", sub: "the setting, not a slide" },
  { icon: I(<><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>), title: "Tableau + dispatch", sub: "monitored, configured live" },
];

export default function PipelineFlow() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div style={{ marginTop: "22px" }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: "6px", overflowX: "auto", padding: "4px 2px 14px" }}>
        {STAGES.map((s, i) => (
          <div key={s.title} style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            <div onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="card-hover"
              style={{
                width: "150px", minHeight: "112px", background: "var(--surface)",
                border: `1px solid ${hover === i ? "rgba(var(--accent-rgb),0.5)" : "var(--border-subtle)"}`,
                borderRadius: "13px", padding: "14px 13px", transition: "border-color .2s",
              }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.28)", color: "var(--accent)", marginBottom: "10px",
              }}>{s.icon}</div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--foreground)", lineHeight: 1.25, marginBottom: "3px" }}>{s.title}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--foreground-subtle)", lineHeight: 1.4 }}>{s.sub}</div>
            </div>
            {i < STAGES.length - 1 && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-subtle)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
          </div>
        ))}
      </div>
      {/* weekly refresh loop */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px", padding: "11px 16px",
        background: "rgba(var(--accent-rgb),0.06)", border: "1px solid rgba(var(--accent-rgb),0.22)",
        borderRadius: "11px", marginTop: "2px",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
        </svg>
        <span style={{ fontSize: "0.84rem", color: "var(--foreground-muted)", fontWeight: 500 }}>
          The loop runs weekly, so every city&apos;s band stays current as demand, density, and rider supply shift.
        </span>
      </div>
    </div>
  );
}
