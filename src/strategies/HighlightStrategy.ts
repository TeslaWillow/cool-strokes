// ./src/strategies/HighlightStrategy.ts

import { StrokeStrategy, HighlightOptions } from "../types";
import { Animator } from "../core/Animator";

export class HighlightStrategy implements StrokeStrategy {
  public render(
    target: HTMLElement,
    svg: SVGSVGElement,
    options: HighlightOptions,
  ): void {
    const { opacity = 0.35, color = "#fcff46ff", heightRatio = 0.45, animate = false } = options;
    const { width, height } = target.getBoundingClientRect();

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.innerHTML = "";

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const rectHeight = height * heightRatio;

    rect.setAttribute("x", "0");
    rect.setAttribute("y", `${height - rectHeight}`);
    rect.setAttribute("width", `${width}`);
    rect.setAttribute("height", `${rectHeight}`);
    rect.setAttribute("fill", color);
    rect.setAttribute("fill-opacity", `${opacity}`);
    rect.setAttribute("rx", "4");

    svg.appendChild(rect);

    if (animate) {
      Animator.animateHighlight(rect, options);
    }
  }
}
