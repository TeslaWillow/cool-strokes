// ./src/core/Painter.ts
import { StrokeVariant, AnyStrokeOptions, StrokeStrategy } from "../types";
import { HighlightStrategy } from "../strategies/HighlightStrategy";
import { UnderlineStrategy } from "../strategies/UnderlineStrategy";
import { HandDrawnStrategy } from "../strategies/HandDrawnStrategy";

export interface StrokeController {
  (): void;
  destroy: () => void;
  replay: () => void;
}

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
  ): StrokeController {
    const noop: StrokeController = Object.assign(() => {}, {
      destroy: () => {},
      replay: () => {},
    });

    if (!element) return noop;

    // Guard clause: Asegurar posicionamiento relativo y contexto de apilamiento aislado
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.position === "static") {
      element.style.position = "relative";
    }
    if (computedStyle.isolation !== "isolate") {
      element.style.isolation = "isolate";
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

    const renderStroke = (isResize: boolean = false) => {
      const strategy = this.strategies.get(variant);
      if (!strategy) return;
      // During dynamic window resize, render statically without replaying the full animation
      const effectiveOptions =
        isResize && options.animate ? { ...options, animate: false } : options;
      strategy.render(element, svg, effectiveOptions);
    };

    renderStroke(false);

    (element as any).__redrawStroke = () => renderStroke(true);
    (element as any).__replayStroke = () => renderStroke(false);
    this.observer.observe(element);

    const destroy = () => {
      this.observer.unobserve(element);
      delete (element as any).__redrawStroke;
      delete (element as any).__replayStroke;
      svg.remove();
    };

    const replay = () => {
      renderStroke(false);
    };

    const controller: StrokeController = Object.assign(destroy, {
      destroy,
      replay,
    });

    return controller;
  }
}
