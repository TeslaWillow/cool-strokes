// ./src/strategies/handdrawn/generators/ZigzagGenerator.ts

import { HandDrawnStyleGenerator, HandDrawnRenderContext } from "../types";
import { createSvgElement } from "../../../utils/svg";

export class ZigzagGenerator implements HandDrawnStyleGenerator {
  public generate(ctx: HandDrawnRenderContext): SVGElement[] {
    const { width, baseY, strokeWidth, roughness, color, rng } = ctx;

    const segmentLength = Math.max(16, Math.min(32, width / 12));
    const count = Math.max(4, Math.floor(width / segmentLength));
    const step = width / count;
    const amplitude = Math.max(4, strokeWidth * 1.2 + roughness * 1.5);

    let d = `M 0,${(baseY + (rng() - 0.5) * roughness).toFixed(2)}`;

    for (let i = 1; i <= count; i++) {
      const x = i * step;
      const isPeak = i % 2 === 1;
      const yOffset = (isPeak ? -amplitude : amplitude) * (0.8 + rng() * 0.4);
      const jitterX = (rng() - 0.5) * roughness * 2;
      const targetX = Math.min(width, x + jitterX);
      const targetY = baseY + yOffset;

      d += ` L ${targetX.toFixed(2)},${targetY.toFixed(2)}`;
    }

    const path = createSvgElement("path", {
      d,
      stroke: color,
      "stroke-width": strokeWidth,
      fill: "none",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    });

    return [path];
  }
}

