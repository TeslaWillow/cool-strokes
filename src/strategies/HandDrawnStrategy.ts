// ./src/strategies/HandDrawnStrategy.ts

import { StrokeStrategy, HandDrawnOptions } from "../types";
import { createRng } from "../utils/rng";
import { HandDrawnRegistry } from "./handdrawn/HandDrawnRegistry";
import { HandDrawnRenderContext } from "./handdrawn/types";

export class HandDrawnStrategy implements StrokeStrategy {
  public render(
    target: HTMLElement,
    svg: SVGSVGElement,
    options: HandDrawnOptions,
  ): void {
    const {
      color = "#10b981",
      strokeWidth = 3,
      roughness = 2,
      seed,
      style = "single",
    } = options;

    const { width, height } = target.getBoundingClientRect();

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.innerHTML = "";

    const rng = createRng(seed);
    const baseY = height - strokeWidth * 0.5 - 1;

    const context: HandDrawnRenderContext = {
      width,
      height,
      baseY,
      color,
      strokeWidth,
      roughness,
      rng,
      options,
    };

    const generator = HandDrawnRegistry.get(style);
    const elements = generator.generate(context);

    for (const el of elements) {
      svg.appendChild(el);
    }
  }
}

export * from "./handdrawn/HandDrawnRegistry";
export * from "./handdrawn/types";
