// ./src/types/index.ts

export type StrokeVariant = "highlight" | "underline" | "hand-drawn";

export interface BaseStrokeOptions {
  color?: string;
  strokeWidth?: number;
  className?: string;
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
