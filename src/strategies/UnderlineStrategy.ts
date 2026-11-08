// ./src/strategies/UnderlineStrategy.ts
import { StrokeStrategy, UnderlineOptions } from "../types";

export class UnderlineStrategy implements StrokeStrategy {
  public render(
    target: HTMLElement,
    svg: SVGSVGElement,
    options: UnderlineOptions,
  ): void {
    const { color = "#3b82f6", strokeWidth = 4, gradient } = options;
    const { width, height } = target.getBoundingClientRect();

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.innerHTML = "";

    let strokeAttribute = color;

    if (gradient && gradient.length > 1) {
      const defs = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs",
      );
      const linearGradient = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "linearGradient",
      );
      const gradId = `stroke-grad-${Math.random().toString(36).substring(2, 9)}`;

      linearGradient.setAttribute("id", gradId);
      linearGradient.setAttribute("gradientUnits", "userSpaceOnUse");
      linearGradient.setAttribute("x1", "0");
      linearGradient.setAttribute("y1", "0");
      linearGradient.setAttribute("x2", `${width}`);
      linearGradient.setAttribute("y2", "0");

      gradient.forEach((stopColor, idx) => {
        const stop = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "stop",
        );
        stop.setAttribute("offset", `${(idx / (gradient.length - 1)) * 100}%`);
        stop.setAttribute("stop-color", stopColor);
        linearGradient.appendChild(stop);
      });

      defs.appendChild(linearGradient);
      svg.appendChild(defs);
      strokeAttribute = `url(#${gradId})`;
    }

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    // Posicionar la línea en el borde inferior del elemento
    const yPos = height - strokeWidth / 2;

    line.setAttribute("x1", "0");
    line.setAttribute("y1", `${yPos}`);
    line.setAttribute("x2", `${width}`);
    line.setAttribute("y2", `${yPos}`);
    line.setAttribute("stroke", strokeAttribute);
    line.setAttribute("stroke-width", `${strokeWidth}`);
    line.setAttribute("stroke-linecap", "round");

    svg.appendChild(line);
  }
}
