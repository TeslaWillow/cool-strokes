// ./src/strategies/handdrawn/generators/DoubleGenerator.ts

import { HandDrawnStyleGenerator, HandDrawnRenderContext } from "../types";
import { buildOrganicLinePath } from "../helpers";
import { createSvgElement } from "../../../utils/svg";

export class DoubleGenerator implements HandDrawnStyleGenerator {
  public generate(ctx: HandDrawnRenderContext): SVGElement[] {
    const { width, baseY, strokeWidth, roughness, color, rng } = ctx;

    const gap = Math.max(3, strokeWidth * 0.9);
    const samples = Math.max(4, Math.round(width / 35));

    // First (top) line
    const y1 = baseY - gap * 0.5;
    const startX1 = -1 + (rng() - 0.5) * 4;
    const endX1 = width + (rng() - 0.5) * 4;
    const path1Data = buildOrganicLinePath(
      startX1,
      y1,
      endX1,
      y1 + (rng() - 0.5) * roughness,
      roughness,
      rng,
      samples,
    );

    // Second (bottom) line, slightly offset in length and tilt
    const y2 = baseY + gap * 0.5;
    const startX2 = 2 + (rng() - 0.5) * 4;
    const endX2 = width - 2 + (rng() - 0.5) * 6;
    const path2Data = buildOrganicLinePath(
      startX2,
      y2,
      endX2,
      y2 + (rng() - 0.5) * roughness,
      roughness,
      rng,
      samples,
    );

    const path1 = createSvgElement("path", {
      d: path1Data,
      stroke: color,
      "stroke-width": strokeWidth * 0.9,
      fill: "none",
      "stroke-linecap": "round",
    });

    const path2 = createSvgElement("path", {
      d: path2Data,
      stroke: color,
      "stroke-width": strokeWidth * 0.95,
      fill: "none",
      "stroke-linecap": "round",
    });

    return [path1, path2];
  }
}

