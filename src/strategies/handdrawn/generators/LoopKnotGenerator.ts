// ./src/strategies/handdrawn/generators/LoopKnotGenerator.ts

import { HandDrawnStyleGenerator, HandDrawnRenderContext } from "../types";
import { createSvgElement } from "../../../utils/svg";

export class LoopKnotGenerator implements HandDrawnStyleGenerator {
  public generate(ctx: HandDrawnRenderContext): SVGElement[] {
    const { width, baseY, strokeWidth, roughness, color, rng } = ctx;

    const midX = width * (0.48 + (rng() - 0.5) * 0.06);
    const loopRadius = Math.max(8, strokeWidth * 2.2 + roughness * 1.2);
    const archHeight = Math.max(6, strokeWidth * 1.5);

    // Arch left segment: from 0 up towards loop
    let d = `M 0,${(baseY + (rng() - 0.5) * roughness).toFixed(2)}`;

    // Curve up to near center loop entry
    const entryX = midX - loopRadius;
    const entryY = baseY - archHeight;
    d += ` Q ${(midX * 0.5).toFixed(2)},${(baseY - archHeight * 1.2).toFixed(2)} ${entryX.toFixed(2)},${entryY.toFixed(2)}`;

    // Central loop knot: loop clockwise or counterclockwise down and around
    const loopTopY = baseY - archHeight - loopRadius * 0.5;
    const loopBottomY = baseY + loopRadius * 0.8;
    const loopRightX = midX + loopRadius * 0.7;

    // Into loop, cross over
    d += ` C ${(midX).toFixed(2)},${(loopTopY).toFixed(2)} ${(loopRightX).toFixed(2)},${(loopTopY).toFixed(2)} ${(midX + loopRadius * 0.2).toFixed(2)},${(baseY).toFixed(2)}`;
    d += ` C ${(midX - loopRadius * 0.5).toFixed(2)},${(loopBottomY).toFixed(2)} ${(midX + loopRadius * 0.8).toFixed(2)},${(loopBottomY).toFixed(2)} ${(midX + loopRadius).toFixed(2)},${(entryY).toFixed(2)}`;

    // Arch right segment: from loop exit to right end
    d += ` Q ${(midX + (width - midX) * 0.5).toFixed(2)},${(baseY - archHeight * 1.2).toFixed(2)} ${width.toFixed(2)},${(baseY + (rng() - 0.5) * roughness).toFixed(2)}`;

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

