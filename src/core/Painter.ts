// ./src/core/Painter.ts
import { StrokeVariant, AnyStrokeOptions, StrokeStrategy } from "../types";
import { HighlightStrategy } from "../strategies/HighlightStrategy";
import { UnderlineStrategy } from "../strategies/UnderlineStrategy";
import { HandDrawnStrategy } from "../strategies/HandDrawnStrategy";

export class Painter {
  private strategies: Map<StrokeVariant, StrokeStrategy> = new Map();
  private observer: ResizeObserver;

  constructor() {
    this.strategies.set("highlight", new HighlightStrategy());
    this.strategies.set("underline", new UnderlineStrategy());
    this.strategies.set("hand-drawn", new HandDrawnStrategy());

    this.observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        const redraw = (target as any).__redrawStroke;
        if (typeof redraw === "function") {
          redraw();
        }
      }
    });
  }

  public apply(
    element: HTMLElement,
    variant: StrokeVariant,
    options: AnyStrokeOptions = {},
  ): () => void {
    if (!element) return () => {};

    // Guard clause: Asegurar posicionamiento relativo del contenedor
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.position === "static") {
      element.style.position = "relative";
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";
    svg.style.overflow = "visible";

    // Si es highlight, colocar detrás del texto; si es underline, por encima o según variante
    svg.style.zIndex = variant === "highlight" ? "-1" : "1";

    element.appendChild(svg);

    const renderStroke = () => {
      const strategy = this.strategies.get(variant);
      if (!strategy) return;
      strategy.render(element, svg, options);
    };

    renderStroke();

    (element as any).__redrawStroke = renderStroke;
    this.observer.observe(element);

    // Retorna función de cleanup (para unmounts en React, Vue, Svelte, etc.)
    return () => {
      this.observer.unobserve(element);
      delete (element as any).__redrawStroke;
      svg.remove();
    };
  }
}
