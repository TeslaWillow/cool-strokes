import { HandDrawnStyleGenerator, HandDrawnRenderContext } from '../types';
export declare class BrushGenerator implements HandDrawnStyleGenerator {
    generate(ctx: HandDrawnRenderContext): SVGElement[];
    animate(elements: SVGElement[], ctx: HandDrawnRenderContext): void;
}
