// ./src/strategies/handdrawn/generators/BrushGenerator.ts

import { HandDrawnStyleGenerator, HandDrawnRenderContext } from "../types";
import { createSvgElement } from "../../../utils/svg";

export class BrushGenerator implements HandDrawnStyleGenerator {
  public generate(ctx: HandDrawnRenderContext): SVGElement[] {
    const { width, baseY, strokeWidth, roughness, color, rng } = ctx;

    const wobble = roughness * 1.2;
    const passes = 3;
    const elements: SVGElement[] = [];

    const steps = Math.max(6, Math.round(width / 18));
    const dx = width / steps;

    for (let p = 0; p < passes; p++) {
      const yOffset = (p - (passes - 1) / 2) * (strokeWidth * 0.25);
      const curBaseY = baseY + yOffset;

      let d = `M -2,${(curBaseY + (rng() - 0.5) * wobble * 0.5).toFixed(2)}`;

      for (let i = 1; i <= steps; i++) {
        const x = Math.min(i * dx, width + 2);
        const y = curBaseY + (rng() - 0.5) * wobble;

        const cp1x = x - dx * 0.7;
        const cp1y = curBaseY + (rng() - 0.5) * wobble * 0.6;
        const cp2x = x - dx * 0.3;
        const cp2y = curBaseY + (rng() - 0.5) * wobble * 0.6;

        d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${x.toFixed(2)},${y.toFixed(2)}`;
      }

      const sw =
        p === 1
          ? strokeWidth * 1.15
          : strokeWidth * (0.75 + rng() * 0.2);

      const path = createSvgElement("path", {
        d,
        stroke: color,
        "stroke-width": sw,
        fill: "none",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      });

      elements.push(path);
    }

    return elements;
  }
}

