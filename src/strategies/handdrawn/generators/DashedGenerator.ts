// ./src/strategies/handdrawn/generators/DashedGenerator.ts

import { HandDrawnStyleGenerator, HandDrawnRenderContext } from "../types";
import { createSvgElement } from "../../../utils/svg";

export class DashedGenerator implements HandDrawnStyleGenerator {
  public generate(ctx: HandDrawnRenderContext): SVGElement[] {
    const { width, baseY, strokeWidth, roughness, color, rng } = ctx;

    const dashLength = Math.max(8, strokeWidth * 3.5);
    const gapLength = Math.max(6, strokeWidth * 2.2);
    const totalStep = dashLength + gapLength;
    const dashCount = Math.max(3, Math.floor(width / totalStep));
    const step = width / dashCount;
    const archAmount = Math.max(3, roughness * 2);

    const elements: SVGElement[] = [];

    for (let i = 0; i < dashCount; i++) {
      const t = i / (dashCount - 1 || 1);
      // Slight upward or downward curve across the element
      const arch = -Math.sin(t * Math.PI) * archAmount;

      const x1 = i * step + (rng() - 0.5) * roughness;
      const y1 = baseY + arch + (rng() - 0.5) * roughness;
      const x2 = Math.min(width, x1 + dashLength * (0.85 + rng() * 0.3));
      const y2 = y1 + (rng() - 0.5) * roughness * 1.5;

      const line = createSvgElement("line", {
        x1: x1.toFixed(2),
        y1: y1.toFixed(2),
        x2: x2.toFixed(2),
        y2: y2.toFixed(2),
        stroke: color,
        "stroke-width": strokeWidth,
        "stroke-linecap": "round",
      });

      elements.push(line);
    }

    return elements;
  }
}

