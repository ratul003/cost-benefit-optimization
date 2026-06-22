"use client";

import { useState } from "react";

// ─── Shared data (real model predictions, Stacking_Modeling.pdf) ────────────────
// Overall stacking levels tested around the 24% status quo.
const STACK = [19, 24, 29, 34, 39];
const DT = [24.84, 26.33, 27.54, 28.56, 29.53]; // delivery time, min
const REFUND = [0.64, 0.94, 1.18, 1.39, 1.59]; // refund comp, tk/order
const RIDER = [32.49, 32.38, 32.28, 32.21, 32.19]; // rider cost, tk/order
// Net per-order economics vs the 24% baseline = rider saving − refund cost (tk/order)
const NET = [0.179, 0.0, -0.151, -0.282, -0.459];

const SERIES = [
  { key: "DT", label: "Delivery time", color: "#fb923c", raw: DT, unit: "min" },
  { key: "REF", label: "Refund cost / order", color: "#f43f5e", raw: REFUND, unit: "tk" },
  { key: "RID", label: "Rider cost / order", color: "#34d399", raw: RIDER, unit: "tk" },
];

// ─── Layout helpers ─────────────────────────────────────────────────────────────
const W = 720;
const H = 380;
const M = { t: 28, r: 24, b: 56, l: 52 };
const PW = W - M.l - M.r;
const PH = H - M.t - M.b;

const sx = (s: number) => M.l + ((s - 19) / (39 - 19)) * PW;

function Frame({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <figure style={{ margin: "22px 0 0", width: "100%" }}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border-subtle)",
        borderRadius: "16px", padding: "10px 8px 4px", overflowX: "auto",
      }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: "480px", height: "auto", display: "block" }} role="img">
          {children}
        </svg>
      </div>
      <figcaption style={{ fontSize: "0.78rem", color: "var(--foreground-subtle)", marginTop: "10px", fontStyle: "italic", lineHeight: 1.5 }}>
        {caption}
      </figcaption>
    </figure>
  );
}

function xAxis(activeIdx: number | null) {
  return (
    <>
      {/* optimal window 20–24% */}
      <rect x={sx(20)} y={M.t} width={sx(24) - sx(20)} height={PH} fill="rgba(52,211,153,0.08)" />
      <text x={(sx(20) + sx(24)) / 2} y={M.t + 14} textAnchor="middle" fontSize="10" fill="#34d399" fontWeight="700">OPTIMAL</text>
      {/* status-quo line at 24% */}
      <line x1={sx(24)} y1={M.t} x2={sx(24)} y2={M.t + PH} stroke="var(--foreground-subtle)" strokeWidth="1" strokeDasharray="3 3" />
      <text x={sx(24)} y={H - 30} textAnchor="middle" fontSize="10" fill="var(--foreground-subtle)">status quo</text>
      {STACK.map((s, i) => (
        <text key={s} x={sx(s)} y={H - 16} textAnchor="middle" fontSize="11.5"
          fill={activeIdx === i ? "var(--foreground)" : "var(--foreground-muted)"}
          fontWeight={activeIdx === i ? 700 : 400}>{s}%</text>
      ))}
      <text x={M.l + PW / 2} y={H - 1} textAnchor="middle" fontSize="11" fill="var(--foreground-subtle)" fontWeight="600">
        Overall stacking %
      </text>
    </>
  );
}

// ─── Chart 1: indexed prediction curves ─────────────────────────────────────────
export function PredictionCurves() {
  const [active, setActive] = useState<number | null>(null);
  // index each series to its baseline (24%) value = 100
  const idx = SERIES.map((s) => s.raw.map((v) => (v / s.raw[1]) * 100));
  const yMin = 60, yMax = 180;
  const sy = (v: number) => M.t + (1 - (v - yMin) / (yMax - yMin)) * PH;
  const grid = [75, 100, 125, 150, 175];

  return (
    <Frame caption="Model predictions indexed to the 24% status quo (=100). Refund cost climbs steeply with stacking while rider cost barely moves — the saving the experiment chased never materialises. Bands: optimal 20–24% window. Source: four multi-linear regressions, Jan–Dec 2022.">
      {grid.map((g) => (
        <g key={g}>
          <line x1={M.l} y1={sy(g)} x2={M.l + PW} y2={sy(g)} stroke="var(--border-subtle)" strokeWidth="1" />
          <text x={M.l - 8} y={sy(g) + 3.5} textAnchor="end" fontSize="10" fill="var(--foreground-subtle)">{g}</text>
        </g>
      ))}
      <line x1={M.l} y1={sy(100)} x2={M.l + PW} y2={sy(100)} stroke="var(--foreground-subtle)" strokeWidth="1" strokeDasharray="2 4" />
      {xAxis(active)}
      {SERIES.map((s, si) => {
        const pts = idx[si].map((v, i) => `${sx(STACK[i])},${sy(v)}`).join(" ");
        return (
          <g key={s.key}>
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
            {idx[si].map((v, i) => (
              <circle key={i} cx={sx(STACK[i])} cy={sy(v)} r={active === i ? 5 : 3.5}
                fill="var(--background)" stroke={s.color} strokeWidth="2"
                onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} style={{ cursor: "pointer" }} />
            ))}
          </g>
        );
      })}
      {/* legend */}
      {SERIES.map((s, i) => (
        <g key={s.key} transform={`translate(${M.l + 6 + i * 168}, ${M.t - 12})`}>
          <line x1={0} y1={0} x2={20} y2={0} stroke={s.color} strokeWidth="2.6" />
          <text x={26} y={3.5} fontSize="11" fill="var(--foreground-muted)">{s.label}</text>
        </g>
      ))}
      {/* active tooltip values */}
      {active !== null && SERIES.map((s, si) => (
        <text key={s.key} x={sx(STACK[active])} y={sy(idx[si][active]) - 9} textAnchor="middle"
          fontSize="10.5" fontWeight="700" fill={s.color}>
          {s.raw[active]}{s.unit === "min" ? "" : ""}
        </text>
      ))}
    </Frame>
  );
}

// ─── Chart 2: net cost-benefit crossover ────────────────────────────────────────
export function CrossoverChart() {
  const [active, setActive] = useState<number | null>(null);
  const yMin = -0.55, yMax = 0.3;
  const sy = (v: number) => M.t + (1 - (v - yMin) / (yMax - yMin)) * PH;
  const grid = [0.2, 0.0, -0.2, -0.4];
  const zero = sy(0);
  const pts = NET.map((v, i) => `${sx(STACK[i])},${sy(v)}`).join(" ");
  // area polygon to zero line
  const area = `${sx(STACK[0])},${zero} ${pts} ${sx(STACK[STACK.length - 1])},${zero}`;

  return (
    <Frame caption="Net fully-loaded economics per order vs the 24% baseline (rider-cost saving minus refund-cost increase). Above zero = cheaper than status quo. Every step up in stacking is net-negative; the only profitable move is downward toward ~19–20%. Delivery-time-driven compensation and churn — not shown — push the real curve down further.">
      <defs>
        <linearGradient id="posg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(52,211,153,0.35)" />
          <stop offset="100%" stopColor="rgba(52,211,153,0)" />
        </linearGradient>
      </defs>
      {grid.map((g) => (
        <g key={g}>
          <line x1={M.l} y1={sy(g)} x2={M.l + PW} y2={sy(g)} stroke="var(--border-subtle)" strokeWidth="1" />
          <text x={M.l - 8} y={sy(g) + 3.5} textAnchor="end" fontSize="10" fill="var(--foreground-subtle)">{g > 0 ? `+${g.toFixed(1)}` : g.toFixed(1)}</text>
        </g>
      ))}
      {/* zero baseline emphasized */}
      <line x1={M.l} y1={zero} x2={M.l + PW} y2={zero} stroke="var(--foreground-muted)" strokeWidth="1.4" />
      <polygon points={area} fill="url(#posg)" opacity="0.9" />
      {xAxis(active)}
      <polyline points={pts} fill="none" stroke="#34d399" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      {NET.map((v, i) => (
        <g key={i}>
          <circle cx={sx(STACK[i])} cy={sy(v)} r={active === i ? 5.5 : 4}
            fill={v >= 0 ? "#34d399" : "#f43f5e"} stroke="var(--background)" strokeWidth="1.5"
            onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} style={{ cursor: "pointer" }} />
          <text x={sx(STACK[i])} y={sy(v) + (v >= 0 ? -11 : 17)} textAnchor="middle"
            fontSize="10.5" fontWeight="700" fill={v >= 0 ? "#34d399" : "#f43f5e"}>
            {v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
          </text>
        </g>
      ))}
      <text x={M.l + 4} y={M.t - 12} fontSize="11" fill="var(--foreground-muted)">Net tk / order vs 24% baseline</text>
    </Frame>
  );
}
