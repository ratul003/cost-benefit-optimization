"use client";

import { useRef, useState } from "react";

// Drag-to-rotate orthographic surface plot. Parent supplies a z grid (G×G).
export default function Surface3D({
  z, rgb, xLabel = "x", yLabel = "y", zLabel = "z", height = 320,
}: {
  z: number[][]; rgb: [number, number, number]; xLabel?: string; yLabel?: string; zLabel?: string; height?: number;
}) {
  const [yaw, setYaw] = useState(-0.7);
  const [pitch, setPitch] = useState(1.0);
  const drag = useRef<{ x: number; y: number } | null>(null);

  const G = z.length;
  let zmin = Infinity, zmax = -Infinity;
  for (const row of z) for (const v of row) { if (v < zmin) zmin = v; if (v > zmax) zmax = v; }
  const zr = zmax - zmin || 1;

  const W = 360, H = height, cx = W / 2, cy = H / 2 + 30, scale = 150, zScale = 95;
  const cy0 = Math.cos(yaw), sy0 = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);

  const project = (i: number, j: number) => {
    const x = i / (G - 1) - 0.5;
    const y = j / (G - 1) - 0.5;
    const zz = ((z[i][j] - zmin) / zr - 0.5);
    const x1 = x * cy0 - y * sy0;
    const y1 = x * sy0 + y * cy0;
    const z1 = zz;
    const y2 = y1 * cp - z1 * sp;
    const z2 = y1 * sp + z1 * cp;
    return { sx: cx + x1 * scale, sy: cy - z2 * zScale, depth: y2 };
  };

  type Quad = { pts: string; depth: number; t: number };
  const quads: Quad[] = [];
  for (let i = 0; i < G - 1; i++) {
    for (let j = 0; j < G - 1; j++) {
      const a = project(i, j), b = project(i + 1, j), c = project(i + 1, j + 1), d = project(i, j + 1);
      const avgZ = (z[i][j] + z[i + 1][j] + z[i + 1][j + 1] + z[i][j + 1]) / 4;
      quads.push({
        pts: `${a.sx.toFixed(1)},${a.sy.toFixed(1)} ${b.sx.toFixed(1)},${b.sy.toFixed(1)} ${c.sx.toFixed(1)},${c.sy.toFixed(1)} ${d.sx.toFixed(1)},${d.sy.toFixed(1)}`,
        depth: (a.depth + b.depth + c.depth + d.depth) / 4,
        t: (avgZ - zmin) / zr,
      });
    }
  }
  quads.sort((p, q) => p.depth - q.depth);
  const [r, g, bl] = rgb;

  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY }; (e.target as Element).setPointerCapture(e.pointerId); };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
    setYaw((v) => v + dx * 0.01);
    setPitch((v) => Math.max(0.25, Math.min(1.45, v + dy * 0.008)));
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = () => { drag.current = null; };

  return (
    <div style={{ userSelect: "none" }}>
      <svg viewBox={`0 0 ${W} ${H}`} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
        style={{ width: "100%", height: "auto", background: "var(--background)", borderRadius: "12px", border: "1px solid var(--border-subtle)", cursor: "grab", touchAction: "none" }}>
        {quads.map((q, k) => (
          <polygon key={k} points={q.pts}
            fill={`rgba(${r},${g},${bl},${(0.18 + 0.72 * q.t).toFixed(3)})`}
            stroke={`rgba(${r},${g},${bl},0.45)`} strokeWidth={0.4} />
        ))}
        <text x={W - 8} y={H - 8} textAnchor="end" fontSize="9" fill="var(--foreground-subtle)">{xLabel} · {yLabel}</text>
        <text x={8} y={16} fontSize="9" fill="var(--foreground-subtle)">{zLabel}</text>
      </svg>
      <p style={{ fontSize: "0.7rem", color: "var(--foreground-subtle)", marginTop: "8px", textAlign: "center" }}>drag to rotate</p>
    </div>
  );
}
