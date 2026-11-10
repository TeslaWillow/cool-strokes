// ./src/strategies/handdrawn/generators/TripleGenerator.ts

import { HandDrawnStyleGenerator, HandDrawnRenderContext } from "../types";
import { buildOrganicLinePath } from "../helpers";
import { createSvgElement } from "../../../utils/svg";
import { Animator } from "../../../core/Animator";

export class TripleGenerator implements HandDrawnStyleGenerator {
  public generate(ctx: HandDrawnRenderContext): SVGElement[] {
    const { width, baseY, strokeWidth, roughness, color, rng } = ctx;

    const samples = Math.max(3, Math.round(width / 30));
    const elements: SVGElement[] = [];

    // Line 1: Forward from left to right
    const p1 = buildOrganicLinePath(
      -2,
      baseY - strokeWidth * 0.4,
      width + 2,
      baseY - strokeWidth * 0.2,
      roughness,
      rng,
      samples,
    );

    // Line 2: Flick backwards from right to ~10% from left
    const p2 = buildOrganicLinePath(
      width * 0.95,
      baseY,
      width * 0.1,
      baseY + strokeWidth * 0.4,
      roughness * 1.2,
      rng,
      samples,
    );

    // Line 3: Forward from ~5% to ~90%
    const p3 = buildOrganicLinePath(
      width * 0.05,
      baseY + strokeWidth * 0.8,
      width * 0.9,
      baseY + strokeWidth * 0.6,
      roughness,
      rng,
      samples,
    );

    for (const d of [p1, p2, p3]) {
      elements.push(
        createSvgElement("path", {
          d,
          stroke: color,
          "stroke-width": strokeWidth * 0.85,
          fill: "none",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
        }),
      );
    }

    return elements;
  }

  public animate(elements: SVGElement[], ctx: HandDrawnRenderContext): void {
    const geomElements = elements.filter(
      (el): el is SVGGeometryElement => el instanceof SVGGeometryElement,
    );
    // Sequential drawing with small overlap: Line 1 (forward) -> Line 2 (back) -> Line 3 (forward)
    Animator.animateSequence(geomElements, ctx.options, 0.12);
  }
}
