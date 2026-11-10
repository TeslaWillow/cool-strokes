// ./src/core/Animator.ts

export interface AnimationConfig {
  duration?: number;
  animationDuration?: number;
  delay?: number;
  easing?: string;
}

export class Animator {
  public static resolveDuration(config: AnimationConfig, fallback: number = 800): number {
    return config.duration ?? config.animationDuration ?? fallback;
  }

  /**
   * Animates a single SVG path or line element using stroke-dashoffset.
   * As it animates, the stroke physically draws itself along the exact geometry.
   */
  public static animateStroke(
    element: SVGGeometryElement,
    config: AnimationConfig = {},
  ): Animation | null {
    if (typeof element.animate !== "function") return null;

    const length = this.getElementLength(element);
    if (length <= 0) return null;

    const duration = this.resolveDuration(config, 800);
    const delay = config.delay ?? 0;
    const easing = config.easing ?? "cubic-bezier(0.4, 0, 0.2, 1)";

    // Set initial state immediately to prevent flicker
    element.style.strokeDasharray = `${length} ${length}`;
    element.style.strokeDashoffset = `${length}`;

    const animation = element.animate(
      [
        { strokeDashoffset: `${length}` },
        { strokeDashoffset: "0" },
      ],
      {
        duration,
        delay,
        easing,
        fill: "forwards",
      },
    );

    animation.onfinish = () => {
      element.style.strokeDashoffset = "0";
    };

    return animation;
  }

  /**
   * Animates multiple stroke elements in sequence.
   * Perfect for multi-pass strokes (e.g. double, triple) where the hand draws one line after another.
   */
  public static animateSequence(
    elements: SVGGeometryElement[],
    config: AnimationConfig = {},
    overlapRatio: number = 0.15,
  ): void {
    if (!elements.length) return;
    if (typeof elements[0].animate !== "function") return;

    const totalDuration = this.resolveDuration(config, 900);
    const baseDelay = config.delay ?? 0;
    const easing = config.easing ?? "cubic-bezier(0.4, 0, 0.2, 1)";

    const count = elements.length;
    // Distribute time across elements with slight overlap for fluid hand motion
    const segmentDuration = totalDuration / (count - (count - 1) * overlapRatio);

    elements.forEach((el, index) => {
      const length = this.getElementLength(el);
      if (length <= 0) return;

      el.style.strokeDasharray = `${length} ${length}`;
      el.style.strokeDashoffset = `${length}`;

      const elDelay = baseDelay + index * segmentDuration * (1 - overlapRatio);

      const anim = el.animate(
        [
          { strokeDashoffset: `${length}` },
          { strokeDashoffset: "0" },
        ],
        {
          duration: segmentDuration,
          delay: elDelay,
          easing,
          fill: "forwards",
        },
      );

      anim.onfinish = () => {
        el.style.strokeDashoffset = "0";
      };
    });
  }

  /**
   * Animates multiple stroke elements nearly in parallel with a slight stagger.
   * Perfect for textured brushes where all passes travel together like a wide brush tip.
   */
  public static animateStaggered(
    elements: SVGGeometryElement[],
    config: AnimationConfig = {},
    staggerMs: number = 35,
  ): void {
    if (!elements.length) return;
    if (typeof elements[0].animate !== "function") return;

    const duration = this.resolveDuration(config, 800);
    const baseDelay = config.delay ?? 0;
    const easing = config.easing ?? "cubic-bezier(0.4, 0, 0.2, 1)";

    elements.forEach((el, index) => {
      const length = this.getElementLength(el);
      if (length <= 0) return;

      el.style.strokeDasharray = `${length} ${length}`;
      el.style.strokeDashoffset = `${length}`;

      const anim = el.animate(
        [
          { strokeDashoffset: `${length}` },
          { strokeDashoffset: "0" },
        ],
        {
          duration,
          delay: baseDelay + index * staggerMs,
          easing,
          fill: "forwards",
        },
      );

      anim.onfinish = () => {
        el.style.strokeDashoffset = "0";
      };
    });
  }

  /**
   * Animates a sequence of small dashes (e.g. DashedGenerator) popping/drawing in order.
   */
  public static animateDashes(
    elements: SVGGeometryElement[],
    config: AnimationConfig = {},
  ): void {
    if (!elements.length) return;
    if (typeof elements[0].animate !== "function") return;

    const totalDuration = this.resolveDuration(config, 750);
    const baseDelay = config.delay ?? 0;
    const count = elements.length;
    const dashDuration = Math.max(120, totalDuration / count * 2);

    elements.forEach((el, index) => {
      const length = this.getElementLength(el);
      el.style.strokeDasharray = `${length} ${length}`;
      el.style.strokeDashoffset = `${length}`;

      const delay = baseDelay + (index / count) * (totalDuration - dashDuration * 0.5);

      const anim = el.animate(
        [
          { strokeDashoffset: `${length}`, opacity: "0.2" },
          { strokeDashoffset: "0", opacity: "1" },
        ],
        {
          duration: dashDuration,
          delay,
          easing: "ease-out",
          fill: "forwards",
        },
      );

      anim.onfinish = () => {
        el.style.strokeDashoffset = "0";
        el.style.opacity = "1";
      };
    });
  }

  /**
   * Animates a highlighter block smoothly sliding from 0% to 100% width.
   */
  public static animateHighlight(
    rect: SVGRectElement,
    config: AnimationConfig = {},
  ): Animation | null {
    if (typeof rect.animate !== "function") return null;

    const duration = this.resolveDuration(config, 650);
    const delay = config.delay ?? 0;
    const easing = config.easing ?? "cubic-bezier(0.16, 1, 0.3, 1)";

    // Clip from right (100% hidden) to 0% (fully revealed)
    rect.style.clipPath = "inset(0 100% 0 0 round 4px)";

    const animation = rect.animate(
      [
        { clipPath: "inset(0 100% 0 0 round 4px)" },
        { clipPath: "inset(0 0% 0 0 round 4px)" },
      ],
      {
        duration,
        delay,
        easing,
        fill: "forwards",
      },
    );

    animation.onfinish = () => {
      rect.style.clipPath = "none";
    };

    return animation;
  }

  /**
   * Safely calculates the total length of any SVG geometry element.
   */
  private static getElementLength(element: SVGGeometryElement): number {
    try {
      if (typeof element.getTotalLength === "function") {
        const len = element.getTotalLength();
        if (len > 0) return len;
      }
    } catch {
      // Fallback below
    }

    // Fallback for lines or cases where getTotalLength is not yet available
    if (element.tagName.toLowerCase() === "line") {
      const x1 = parseFloat(element.getAttribute("x1") || "0");
      const y1 = parseFloat(element.getAttribute("y1") || "0");
      const x2 = parseFloat(element.getAttribute("x2") || "0");
      const y2 = parseFloat(element.getAttribute("y2") || "0");
      return Math.hypot(x2 - x1, y2 - y1);
    }

    const bbox = element.getBoundingClientRect();
    return bbox.width || 100;
  }
}

