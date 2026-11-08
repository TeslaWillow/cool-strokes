// ./src/strategies/HandDrawnStrategy.ts

import { StrokeStrategy, HandDrawnOptions } from "../types";

/**
 * Seeded PRNG (mulberry32) for deterministic hand-drawn strokes.
 */
function createRng(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates a wobbly path string that simulates a brush stroke
 * going from left to right at a given y baseline.
 */
function buildBrushPath(
  width: number,
  baseY: number,
  wobble: number,
  rng: () => number,
): string {
  // More points = smoother, ~1 control point every 15-25px
  const steps = Math.max(6, Math.round(width / 18));
  const dx = width / steps;

  // Start with slight offset
  let d = `M ${-2},${baseY + (rng() - 0.5) * wobble * 0.5}`;

  for (let i = 1; i <= steps; i++) {
    const x = Math.min(i * dx, width + 2);
    const y = baseY + (rng() - 0.5) * wobble;

    // Smooth cubic bezier: control points stay close to the baseline
    const cp1x = x - dx * 0.7;
    const cp1y = baseY + (rng() - 0.5) * wobble * 0.6;
    const cp2x = x - dx * 0.3;
    const cp2y = baseY + (rng() - 0.5) * wobble * 0.6;

    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
  }

  return d;
}

export class HandDrawnStrategy implements StrokeStrategy {
  public render(
    target: HTMLElement,
    svg: SVGSVGElement,
    options: HandDrawnOptions,
  ): void {
    const { color = "#10b981", strokeWidth = 3, roughness = 2, seed } = options;

    const { width, height } = target.getBoundingClientRect();

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.innerHTML = "";

    const rng = seed != null ? createRng(seed) : Math.random;
    const baseY = height - strokeWidth * 0.5 - 1;

    // Wobble amplitude — subtle, proportional to roughness
    const wobble = roughness * 1.2;

    // 2-3 overlapping passes with slight vertical offset simulate brush texture
    const passes = 3;

    for (let p = 0; p < passes; p++) {
      // Each pass is offset slightly vertically to fill out the brush width
      const yOffset = (p - (passes - 1) / 2) * (strokeWidth * 0.25);
      const pathData = buildBrushPath(width, baseY + yOffset, wobble, rng);

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.setAttribute("d", pathData);
      path.setAttribute("stroke", color);
      // Middle pass slightly thicker for body, outer passes thinner for rough edges
      const sw =
        p === 1 ? strokeWidth * 1.1 : strokeWidth * (0.7 + rng() * 0.2);
      path.setAttribute("stroke-width", `${sw}`);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");

      svg.appendChild(path);
    }
  }
}
