import { Painter, StrokeController } from "./core/Painter";
import { StrokeVariant, AnyStrokeOptions } from "./types";

const painterInstance = new Painter();

export function attachStroke(
  element: HTMLElement,
  variant: StrokeVariant,
  options?: AnyStrokeOptions,
): StrokeController {
  return painterInstance.apply(element, variant, options);
}

export { Animator } from "./core/Animator";
export { HandDrawnRegistry } from "./strategies/HandDrawnStrategy";
export * from "./types";
export type { StrokeController };
