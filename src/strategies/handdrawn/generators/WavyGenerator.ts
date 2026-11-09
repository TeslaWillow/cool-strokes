// ./src/strategies/handdrawn/generators/WavyGenerator.ts

import { HandDrawnStyleGenerator, HandDrawnRenderContext } from "../types";
import { createSvgElement } from "../../../utils/svg";

export class WavyGenerator implements HandDrawnStyleGenerator {
  public generate(ctx: HandDrawnRenderContext): SVGElement[] {
    const { width, baseY, strokeWidth, roughness, color, rng } = ctx;

    const waveLength = Math.max(20, Math.min(40, width / 8));
    const waves = Math.max(3, Math.floor(width / waveLength));
    const step = width / waves;
    const amplitude = Math.max(3, strokeWidth * 0.9 + roughness);

    let d = `M 0,${(baseY + (rng() - 0.5) * roughness).toFixed(2)}`;

    for (let i = 0; i < waves; i++) {
      const startX = i * step;
      const endX = (i + 1) * step;
      const cp1x = startX + step * 0.25;
      const cp1y = baseY - amplitude * (0.8 + rng() * 0.4);
      const cp2x = startX + step * 0.75;
      const cp2y = baseY + amplitude * (0.8 + rng() * 0.4);

      d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${endX.toFixed(2)},${(baseY + (rng() - 0.5) * roughness).toFixed(2)}`;
    }

    const path = createSvgElement("path", {
      d,
      stroke: color,
      "stroke-width": strokeWidth,
      fill: "none",
      "stroke-linecap": "round",
    });

    return [path];
  }
}

