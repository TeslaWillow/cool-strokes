import { Painter } from "./core/Painter";
import { StrokeVariant, AnyStrokeOptions } from "./types";

const painterInstance = new Painter();

export function attachStroke(
  element: HTMLElement,
  variant: StrokeVariant,
  options?: AnyStrokeOptions,
): () => void {
  return painterInstance.apply(element, variant, options);
}

export * from "./types";
