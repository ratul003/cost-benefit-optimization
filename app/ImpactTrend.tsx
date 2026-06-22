"use client";

import { useState } from "react";

// Cumulative % change over the five-month central-team push. Endpoints are the
// reported five-month deltas; the ramp in between is indicative.
const SERIES = [
  { key: "refund", label: "Refund / order", color: "#f43f5e", v: [0, 12, 24, 38, 48, 56] },
  { key: "delayed", label: "Delayed orders", color: "#fb923c", v: [0, 9, 17, 25, 32, 38] },
  { key: "comp", label: "Compensation / order", color: "#fbbf24", v: [0, 4, 7, 11, 14, 17] },
];
const MONTHS = ["M0", "M1", "M2", "M3", "M4", "M5"];

const W = 720, H = 320, M = { t: 26, r: 96, b: 40, l: 44 };
const PW = W - M.l - M.r, PH = H - M.t - M.b;
const sx = (i: number) => M.l + (i / (MONTHS.length - 1)) * PW;
const yMax = 60;
const sy = (v: number) => M.t + (1 - v / yMax) * PH;

export default function ImpactTrend() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <figure style={{ margin: "22px 0 0", width: "100%" }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)", borderRadius: "16px", padding: "10px 8px 4px", overflowX: "auto" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: "480px", height: "auto", display: "block" }} role="img" aria-label="Cost trend during the stacking push">
          {[0, 20, 40, 60].map((g) => (
            <g key={g}>
              <line x1={M.l} y1={sy(g)} x2={M.l + PW} y2={sy(g)} stroke="var(--border-subtle)" strokeWidth="1" />
              <text x={M.l - 8} y={sy(g) + 3.5} textAnchor="end" fontSize="10" fill="var(--foreground-subtle)">+{g}%</text>
            </g>
          ))}
          {MONTHS.map((m, i) => (
            <text key={m} x={sx(i)} y={H - 18} textAnchor="middle" fontSize="11" fill="var(--foreground-muted)">{m}</text>
          ))}
          <text x={M.l + PW / 2} y={H - 3} textAnchor="middle" fontSize="10.5" fill="var(--foreground-subtle)" fontWeight="600">Months into the region-wide push</text>

          {SERIES.map((s) => {
            const pts = s.v.map((v, i) => `${sx(i)},${sy(v)}`).join(" ");
            const dim = active && active !== s.key;
            return (
              <g key={s.key} opacity={dim ? 0.25 : 1} style={{ transition: "opacity .2s" }}
                onMouseEnter={() => setActive(s.key)} onMouseLeave={() => setActive(null)}>
                <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1}>
                  <animate attributeName="stroke-dashoffset" from={1} to={0} dur="1.3s" fill="freeze" />
                </polyline>
                {s.v.map((v, i) => (
                  <circle key={i} cx={sx(i)} cy={sy(v)} r="3.2" fill="var(--background)" stroke={s.color} strokeWidth="2" />
                ))}
                <text x={sx(s.v.length - 1) + 8} y={sy(s.v[s.v.length - 1]) + 3.5} fontSize="11" fontWeight="700" fill={s.color}>+{s.v[s.v.length - 1]}%</text>
                <text x={sx(s.v.length - 1) + 8} y={sy(s.v[s.v.length - 1]) + 16} fontSize="9" fill="var(--foreground-subtle)">{s.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption style={{ fontSize: "0.78rem", color: "var(--foreground-subtle)", marginTop: "10px", fontStyle: "italic", lineHeight: 1.5 }}>
        Cost per order climbing through the central-team push in a dense market. Hover a line to isolate it. Endpoints are the reported five-month deltas: refund +56%, delayed orders +38%, compensation +17%, while rider cost per order barely moved.
      </figcaption>
    </figure>
  );
}
