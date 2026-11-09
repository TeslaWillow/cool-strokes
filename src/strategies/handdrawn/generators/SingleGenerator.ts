// ./src/strategies/handdrawn/generators/SingleGenerator.ts

import { HandDrawnStyleGenerator, HandDrawnRenderContext } from "../types";
import { buildOrganicLinePath } from "../helpers";
import { createSvgElement } from "../../../utils/svg";

export class SingleGenerator implements HandDrawnStyleGenerator {
  public generate(ctx: HandDrawnRenderContext): SVGElement[] {
    const { width, baseY, strokeWidth, roughness, color, rng } = ctx;

    // Slight organic arch: middle dips or rises slightly
    const midArch = (rng() - 0.4) * roughness * 2;
    const samples = Math.max(4, Math.round(width / 40));

    // Endpoints extend slightly past 0 and width for natural stroke overshoot
    const startX = -2;
    const endX = width + 2;
    const pathData = buildOrganicLinePath(
      startX,
      baseY + midArch * 0.2,
      endX,
      baseY + midArch,
      roughness,
      rng,
      samples,
    );

    const path = createSvgElement("path", {
      d: pathData,
      stroke: color,
      "stroke-width": strokeWidth,
      fill: "none",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    });

    return [path];
  }
}

