// ./src/strategies/handdrawn/generators/LoopyGenerator.ts

import { HandDrawnStyleGenerator, HandDrawnRenderContext } from "../types";
import { createSvgElement } from "../../../utils/svg";

export class LoopyGenerator implements HandDrawnStyleGenerator {
  public generate(ctx: HandDrawnRenderContext): SVGElement[] {
    const { width, baseY, strokeWidth, roughness, color, rng } = ctx;

    // Loop radius & spacing
    const loopWidth = Math.max(20, Math.min(36, width / 8));
    const count = Math.max(3, Math.floor(width / loopWidth));
    const step = width / count;
    const loopHeight = Math.max(10, strokeWidth * 2.8 + roughness * 1.5);

    let d = `M 0,${(baseY + (rng() - 0.5) * roughness).toFixed(2)}`;

    for (let i = 0; i < count; i++) {
      const startX = i * step;
      const endX = (i + 1) * step;

      // Loop up and forwards, cross over itself, and land on next baseline
      const cp1x = startX + step * 0.7;
      const cp1y = baseY - loopHeight * (1 + (rng() - 0.5) * 0.2);

      const cp2x = endX - step * 0.1;
      const cp2y = baseY - loopHeight * (1 + (rng() - 0.5) * 0.2);

      const loopBottomX = startX + step * 0.35;
      const loopBottomY = baseY + loopHeight * 0.35;

      // Bezier 1: rise up and loop around
      d += ` C ${(startX + step * 0.3).toFixed(2)},${(baseY - loopHeight * 0.9).toFixed(2)} ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${(startX + step * 0.75).toFixed(2)},${(baseY - loopHeight * 0.4).toFixed(2)}`;

      // Bezier 2: loop backwards/downward across itself
      d += ` C ${(startX + step * 0.8).toFixed(2)},${(baseY + loopHeight * 0.2).toFixed(2)} ${loopBottomX.toFixed(2)},${loopBottomY.toFixed(2)} ${(startX + step * 0.45).toFixed(2)},${(baseY).toFixed(2)}`;

      // Bezier 3: reconnect forward to next loop base
      d += ` C ${(startX + step * 0.6).toFixed(2)},${(baseY - loopHeight * 0.2).toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${endX.toFixed(2)},${(baseY + (rng() - 0.5) * roughness).toFixed(2)}`;
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
