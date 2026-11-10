// ./src/types/index.ts

export type StrokeVariant = "highlight" | "underline" | "hand-drawn";

export type HandDrawnStyle =
  | "single"
  | "double"
  | "triple"
  | "brush"
  | "zigzag"
  | "loopy"
  | "loop-knot"
  | "wavy"
  | "dashed"
  | "scribble"
  | "strike";

export interface BaseStrokeOptions {
  color?: string;
  strokeWidth?: number;
  className?: string;

  /**
   * Whether to animate the stroke drawing in real-time.
   * @default false
   */
  animate?: boolean;

  /**
   * Animation duration in milliseconds.
   * @default 800
   */
  duration?: number;

  /**
   * Alias for `duration`.
   */
  animationDuration?: number;

  /**
   * Delay before the animation starts, in milliseconds.
   * @default 0
   */
  delay?: number;

  /**
   * CSS easing function or cubic-bezier.
   * @default "cubic-bezier(0.4, 0, 0.2, 1)"
   */
  easing?: string;
}

export interface HighlightOptions extends BaseStrokeOptions {
  opacity?: number;
  heightRatio?: number;
}

export interface UnderlineOptions extends BaseStrokeOptions {
  gradient?: string[];
  wavy?: boolean;
}

export interface HandDrawnOptions extends BaseStrokeOptions {
  roughness?: number;
  seed?: number;
  style?: HandDrawnStyle;
}

export type AnyStrokeOptions =
  | HighlightOptions
  | UnderlineOptions
  | HandDrawnOptions;

export interface StrokeStrategy {
  render(
    target: HTMLElement,
    containerSvg: SVGSVGElement,
    options: AnyStrokeOptions,
  ): void;
}
