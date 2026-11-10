// ./src/strategies/handdrawn/types.ts

import { PRNG } from "../../utils/rng";
import { HandDrawnOptions } from "../../types";

export interface HandDrawnRenderContext {
  width: number;
  height: number;
  baseY: number;
  color: string;
  strokeWidth: number;
  roughness: number;
  rng: PRNG;
  options: HandDrawnOptions;
}

export interface HandDrawnStyleGenerator {
  generate(context: HandDrawnRenderContext): SVGElement[];
  animate?(elements: SVGElement[], context: HandDrawnRenderContext): void;
}
