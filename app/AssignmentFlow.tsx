"use client";

import { useState } from "react";

type Mode = "single" | "stacked";

const NODES = {
  R: { x: 64, y: 234, label: "Rider", sub: "notified" },
  V: { x: 232, y: 82, label: "Vendor", sub: "pickup" },
  C1: { x: 424, y: 206, label: "Customer 1", sub: "drop-off" },
  C2: { x: 566, y: 104, label: "Customer 2", sub: "drop-off" },
};

const PATH = {
  single: `M${NODES.R.x},${NODES.R.y} L${NODES.V.x},${NODES.V.y} L${NODES.C1.x},${NODES.C1.y}`,
  stacked: `M${NODES.R.x},${NODES.R.y} L${NODES.V.x},${NODES.V.y} L${NODES.C1.x},${NODES.C1.y} L${NODES.C2.x},${NODES.C2.y}`,
};

const STAGES = ["Notified", "Accepted", "Picked up", "Near drop-off", "Delivered"];

function Pin({ x, y, label, sub, color, dim }: { x: number; y: number; label: string; sub: string; color: string; dim?: boolean }) {
  return (
    <g opacity={dim ? 0.28 : 1} style={{ transition: "opacity .3s" }}>
      <circle cx={x} cy={y} r="13" fill="var(--background)" stroke={color} strokeWidth="2.5" />
      <circle cx={x} cy={y} r="4.5" fill={color} />
      <text x={x} y={y + 30} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--foreground)">{label}</text>
      <text x={x} y={y + 44} textAnchor="middle" fontSize="9.5" fill="var(--foreground-subtle)" textTransform="uppercase">{sub}</text>
    </g>
  );
}

export default function AssignmentFlow() {
  const [mode, setMode] = useState<Mode>("stacked");
  const stacked = mode === "stacked";
  const accent = "var(--accent)";

  return (
    <div style={{ marginTop: "22px" }}>
      {/* toggle */}
      <div style={{ display: "inline-flex", background: "var(--surface)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "4px", gap: "4px", marginBottom: "14px" }}>
        {(["single", "stacked"] as Mode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)} style={{
            border: "none", cursor: "pointer", borderRadius: "7px", padding: "7px 16px",
            fontSize: "0.8rem", fontWeight: 700, transition: "all .2s",
            background: mode === m ? "rgba(var(--accent-rgb),0.16)" : "transparent",
            color: mode === m ? "var(--accent)" : "var(--foreground-muted)",
          }}>{m === "single" ? "Single delivery" : "Stacked (2 orders)"}</button>
        ))}
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)", borderRadius: "16px", padding: "12px 8px 6px", overflowX: "auto" }}>
        {/* stage rail */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "4px 10px 10px", alignItems: "center" }}>
          {STAGES.map((st, i) => (
            <span key={st} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.66rem", fontWeight: 600, color: "var(--foreground-muted)", background: "rgba(var(--accent-rgb),0.07)", border: "1px solid var(--border-subtle)", borderRadius: "6px", padding: "3px 9px" }}>{st}</span>
              {i < STAGES.length - 1 && <span style={{ color: "var(--foreground-subtle)", fontSize: "0.7rem" }}>→</span>}
            </span>
          ))}
        </div>

        <svg viewBox="0 0 640 300" style={{ width: "100%", minWidth: "480px", height: "auto", display: "block" }} role="img" aria-label="Rider assignment route">
          <defs>
            <marker id="arrow" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={`rgba(var(--accent-rgb),0.6)`} />
            </marker>
          </defs>

          {/* route */}
          <path d={PATH.single} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeOpacity="0.9" markerMid="url(#arrow)" />
          <path d={`M${NODES.C1.x},${NODES.C1.y} L${NODES.C2.x},${NODES.C2.y}`} fill="none"
            stroke={stacked ? "var(--accent)" : "var(--border)"} strokeWidth="2.5"
            strokeDasharray={stacked ? "0" : "5 5"} strokeOpacity={stacked ? 0.9 : 0.4} style={{ transition: "all .3s" }} />

          {/* leg labels */}
          <text x={(NODES.R.x + NODES.V.x) / 2 - 6} y={(NODES.R.y + NODES.V.y) / 2 - 8} fontSize="10" fill="var(--foreground-subtle)" textAnchor="middle">pickup leg</text>
          <text x={(NODES.V.x + NODES.C1.x) / 2 + 4} y={(NODES.V.y + NODES.C1.y) / 2 - 8} fontSize="10" fill="var(--foreground-subtle)" textAnchor="middle">drop-off 1</text>
          {stacked && <text x={(NODES.C1.x + NODES.C2.x) / 2} y={(NODES.C1.y + NODES.C2.y) / 2 - 8} fontSize="10" fill="var(--accent-light)" textAnchor="middle">+ drop-off 2</text>}

          {/* pins */}
          <Pin {...NODES.R} color="var(--accent)" />
          <Pin {...NODES.V} color="var(--accent-light)" />
          <Pin {...NODES.C1} color="#34d399" />
          <Pin {...NODES.C2} color={stacked ? "#34d399" : "var(--foreground-subtle)"} dim={!stacked} />

          {/* animated rider dot */}
          <circle r="6" fill="#fff" stroke="var(--accent)" strokeWidth="2">
            <animateMotion key={mode} dur={stacked ? "3.6s" : "2.6s"} repeatCount="indefinite" path={stacked ? PATH.stacked : PATH.single} rotate="0" />
          </circle>
        </svg>
      </div>

      {/* annotation */}
      <div style={{ marginTop: "14px", padding: "16px 18px", borderRadius: "12px", background: stacked ? "rgba(var(--accent-rgb),0.06)" : "var(--surface)", border: `1px solid ${stacked ? "rgba(var(--accent-rgb),0.28)" : "var(--border-subtle)"}`, transition: "all .3s" }}>
        {stacked ? (
          <p style={{ fontSize: "0.9rem", color: "var(--foreground)", lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: "var(--accent)" }}>Stacked:</strong> one shared pickup at the vendor, then two drop-offs in sequence. The second order rides for free on the pickup leg — that is the <strong>~25% rider-cost saving</strong>. But Customer&nbsp;1&apos;s drop-off now sits in front of Customer&nbsp;2, so <strong>C2 waits longer</strong> — and delivery time climbs with every extra stop.
          </p>
        ) : (
          <p style={{ fontSize: "0.9rem", color: "var(--foreground-muted)", lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: "var(--foreground)" }}>Single:</strong> one pickup, one drop-off, shortest possible delivery time — but the rider pays the full pickup cost for this one order. No economies of scale.
          </p>
        )}
      </div>
    </div>
  );
}
