// ./src/strategies/handdrawn/generators/ScribbleGenerator.ts

import { HandDrawnStyleGenerator, HandDrawnRenderContext } from "../types";
import { createSvgElement } from "../../../utils/svg";

export class ScribbleGenerator implements HandDrawnStyleGenerator {
  public generate(ctx: HandDrawnRenderContext): SVGElement[] {
    const { width, baseY, strokeWidth, roughness, color, rng } = ctx;

    const turns = 4;
    const ySpread = Math.max(3, strokeWidth * 0.9 + roughness);
    let d = `M 0,${(baseY - ySpread * 0.5).toFixed(2)}`;

    for (let i = 1; i <= turns; i++) {
      const isRight = i % 2 === 1;
      const targetX = isRight
        ? width * (0.85 + rng() * 0.15)
        : width * (0.05 + rng() * 0.15);
      const targetY = baseY + (i / turns - 0.5) * ySpread + (rng() - 0.5) * roughness;

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

