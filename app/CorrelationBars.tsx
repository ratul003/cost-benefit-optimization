"use client";

import { useState } from "react";

type Row = { kpi: string; r: number; p: number; sig: boolean };

const ROWS: Row[] = [
  { kpi: "Delivery time", r: 0.82, p: 0.0008, sig: true },
  { kpi: "Delayed orders %", r: 0.781, p: 0.0035, sig: true },
  { kpi: "Refund cost / order", r: 0.426, p: 0.0019, sig: true },
  { kpi: "Churn", r: -0.133, p: 0.62, sig: false },
  { kpi: "Rider cost / order", r: -0.185, p: 0.0004, sig: true },
  { kpi: "Reorder rate %", r: -0.225, p: 0.33, sig: false },
  { kpi: "Compensation / order", r: -0.27, p: 0.319, sig: false },
  { kpi: "CSAT %", r: -0.775, p: 0.0026, sig: true },
];

const POS = "#f43f5e"; // rises with stacking
const NEG = "#34d399"; // falls with stacking

export default function CorrelationBars() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div style={{ marginTop: "22px", background: "var(--surface)", border: "1px solid var(--border-subtle)", borderRadius: "16px", padding: "20px 20px 14px" }}>
      <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: "440px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--foreground-subtle)", marginBottom: "14px", paddingLeft: "150px" }}>
        <span>← falls with stacking</span><span>rises with stacking →</span>
      </div>

      {ROWS.map((row, i) => {
        const on = hover === i;
        const color = row.r > 0 ? POS : NEG;
        const widthPct = Math.abs(row.r) * 48; // half-track max ~48%
        return (
          <div key={row.kpi} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px 0", cursor: "default" }}>
            <div style={{ width: "150px", flexShrink: 0, fontSize: "0.8rem", fontWeight: on ? 700 : 500, color: on ? "var(--foreground)" : "var(--foreground-muted)", textAlign: "right", transition: "color .15s" }}>
              {row.kpi}
            </div>
            <div style={{ position: "relative", flex: 1, height: "24px" }}>
              {/* center axis */}
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "var(--border)" }} />
              {/* bar */}
              <div style={{
                position: "absolute", top: "4px", height: "16px", borderRadius: "4px",
                background: color, opacity: row.sig ? (on ? 1 : 0.85) : (on ? 0.6 : 0.38),
                ...(row.r > 0 ? { left: "50%", width: `${widthPct}%` } : { right: "50%", width: `${widthPct}%` }),
                transition: "opacity .15s",
                boxShadow: on ? `0 0 14px ${color}66` : "none",
              }} />
              {/* value */}
              <span style={{
                position: "absolute", top: "3px", fontSize: "0.72rem", fontWeight: 700, color, fontVariantNumeric: "tabular-nums",
                ...(row.r > 0 ? { left: `calc(50% + ${widthPct}% + 6px)` } : { right: `calc(50% + ${widthPct}% + 6px)` }),
              }}>
                {row.r > 0 ? "+" : ""}{row.r}{row.sig ? " ✦✦" : ""}
              </span>
            </div>
            <div style={{ width: "70px", flexShrink: 0, fontSize: "0.68rem", color: on ? "var(--foreground-muted)" : "var(--foreground-subtle)", fontVariantNumeric: "tabular-nums", textAlign: "right" }}>
              p={row.p}
            </div>
          </div>
        );
      })}
      </div>
      </div>

      <p style={{ fontSize: "0.72rem", color: "var(--foreground-subtle)", marginTop: "12px", fontStyle: "italic", lineHeight: 1.5 }}>
        Pearson r against stacking %, n = 16 weeks. ✦✦ = significant at p &lt; 0.05. The four large, significant bars (delivery time, delayed %, CSAT, refund) are the cost side; rider cost is the only benefit and it is the weakest significant effect.
      </p>
    </div>
  );
}
