"use client";

import { useState } from "react";

// Real model anchor points (Stacking_Modeling.pdf). Interpolated piecewise-linearly.
const PTS = [
  { s: 19, dt: 24.84, rider: 32.49, refund: 0.64 },
  { s: 24, dt: 26.33, rider: 32.38, refund: 0.94 },
  { s: 29, dt: 27.54, rider: 32.28, refund: 1.18 },
  { s: 34, dt: 28.56, rider: 32.21, refund: 1.39 },
  { s: 39, dt: 29.53, rider: 32.19, refund: 1.59 },
];
const BASE = PTS[1]; // 24% status quo

function interp(s: number, key: "dt" | "rider" | "refund") {
  if (s <= PTS[0].s) {
    const a = PTS[0], b = PTS[1];
    return a[key] + ((b[key] - a[key]) / (b.s - a.s)) * (s - a.s);
  }
  for (let i = 0; i < PTS.length - 1; i++) {
    const a = PTS[i], b = PTS[i + 1];
    if (s >= a.s && s <= b.s) return a[key] + ((b[key] - a[key]) / (b.s - a.s)) * (s - a.s);
  }
  const a = PTS[PTS.length - 2], b = PTS[PTS.length - 1];
  return a[key] + ((b[key] - a[key]) / (b.s - a.s)) * (s - a.s);
}

function Metric({ label, value, unit, delta, good }: { label: string; value: string; unit: string; delta: string; good: boolean | null }) {
  const color = good === null ? "var(--foreground-muted)" : good ? "#34d399" : "#f43f5e";
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)", borderRadius: "12px", padding: "14px 16px", flex: 1, minWidth: "130px" }}>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--foreground-subtle)", marginBottom: "8px" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--foreground)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{value}</span>
        <span style={{ fontSize: "0.72rem", color: "var(--foreground-subtle)" }}>{unit}</span>
      </div>
      <div style={{ fontSize: "0.72rem", fontWeight: 600, color, marginTop: "4px", fontVariantNumeric: "tabular-nums" }}>{delta}</div>
    </div>
  );
}

export default function StackingExplorer() {
  const [s, setS] = useState(24);

  const dt = interp(s, "dt");
  const rider = interp(s, "rider");
  const refund = interp(s, "refund");
  const riderSave = BASE.rider - rider;      // +ve = saving
  const refundCost = refund - BASE.refund;   // +ve = added cost
  const net = riderSave - refundCost;        // +ve = cheaper than status quo

  const fmt = (n: number, d = 2) => (n >= 0 ? "+" : "") + n.toFixed(d);
  const optimal = s >= 20 && s <= 24;
  const verdict =
    net > 0.02 ? { txt: "Net positive — cheaper than status quo", c: "#34d399", bg: "rgba(52,211,153,0.1)", bd: "rgba(52,211,153,0.4)" }
    : net < -0.02 ? { txt: "Net negative — costs more than it saves", c: "#f43f5e", bg: "rgba(244,63,94,0.1)", bd: "rgba(244,63,94,0.4)" }
    : { txt: "Break-even with status quo", c: "var(--foreground-muted)", bg: "var(--surface)", bd: "var(--border-subtle)" };

  // gauge: map net from -0.5..+0.25 onto 0..100, zero at the right spot
  const lo = -0.5, hi = 0.25;
  const zeroPct = ((0 - lo) / (hi - lo)) * 100;
  const netPct = Math.max(0, Math.min(100, ((net - lo) / (hi - lo)) * 100));

  return (
    <div style={{ marginTop: "22px", background: "var(--surface)", border: "1px solid rgba(var(--accent-rgb),0.25)", borderRadius: "18px", padding: "22px 22px 26px", position: "relative", overflow: "hidden" }} className="card-tier">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ fontSize: "0.66rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--accent)" }}>Interactive · drag to set stacking</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--foreground)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }} className="gradient-heading">{s}%</span>
          {optimal && <span style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.1em", color: "#34d399", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.4)", borderRadius: "6px", padding: "3px 9px" }}>OPTIMAL</span>}
        </div>
      </div>

      {/* slider with optimal band */}
      <div style={{ position: "relative", marginTop: "18px", marginBottom: "8px" }}>
        <div style={{ position: "absolute", left: `${((20 - 15) / (40 - 15)) * 100}%`, width: `${((24 - 20) / (40 - 15)) * 100}%`, top: "-4px", height: "22px", background: "rgba(52,211,153,0.14)", borderRadius: "5px", pointerEvents: "none" }} />
        <input type="range" min={15} max={40} step={1} value={s} onChange={(e) => setS(+e.target.value)}
          aria-label="Overall stacking percentage"
          style={{ width: "100%", accentColor: "var(--accent)", position: "relative", cursor: "pointer" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.66rem", color: "var(--foreground-subtle)", marginTop: "4px", fontVariantNumeric: "tabular-nums" }}>
          <span>15%</span><span style={{ color: "#34d399" }}>20–24% optimal</span><span>40%</span>
        </div>
      </div>

      {/* metrics */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "16px" }}>
        <Metric label="Delivery time" value={dt.toFixed(1)} unit="min" delta={`${fmt(dt - BASE.dt, 1)} vs base`} good={dt <= BASE.dt} />
        <Metric label="Rider cost / order" value={rider.toFixed(2)} unit="" delta={`${fmt(-riderSave)} vs base`} good={riderSave >= 0} />
        <Metric label="Refund cost / order" value={refund.toFixed(2)} unit="" delta={`${fmt(refundCost)} vs base`} good={refundCost <= 0} />
        <Metric label="Net / order" value={fmt(net)} unit="" delta={net >= 0 ? "cheaper" : "costlier"} good={net >= 0} />
      </div>

      {/* net gauge */}
      <div style={{ marginTop: "18px" }}>
        <div style={{ position: "relative", height: "10px", background: "var(--border-subtle)", borderRadius: "6px", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${netPct}%`, background: net >= 0 ? "linear-gradient(90deg, rgba(52,211,153,0.4), #34d399)" : "linear-gradient(90deg, #f43f5e, rgba(244,63,94,0.5))", transition: "width .15s ease" }} />
          <div style={{ position: "absolute", left: `${zeroPct}%`, top: "-3px", bottom: "-3px", width: "2px", background: "var(--foreground)" }} />
        </div>
        <div style={{ fontSize: "0.64rem", color: "var(--foreground-subtle)", marginTop: "5px" }}>Net per-order economics vs 24% baseline · vertical mark = break-even</div>
      </div>

      {/* verdict */}
      <div style={{ marginTop: "16px", padding: "12px 16px", borderRadius: "10px", background: verdict.bg, border: `1px solid ${verdict.bd}`, display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: verdict.c, flexShrink: 0 }} />
        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: verdict.c }}>{verdict.txt}</span>
      </div>
      <p style={{ fontSize: "0.74rem", color: "var(--foreground-subtle)", marginTop: "12px", fontStyle: "italic", lineHeight: 1.5 }}>
        Net = rider-cost saving − refund-cost increase, from models m2/m4 (interpolated between the five tested levels). The delivery-time channel — which feeds further compensation and churn — is shown but not yet priced in, so the real curve sits lower still.
      </p>
    </div>
  );
}
