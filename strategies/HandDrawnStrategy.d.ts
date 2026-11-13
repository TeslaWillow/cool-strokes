import { StrokeStrategy, HandDrawnOptions } from '../types';
export declare class HandDrawnStrategy implements StrokeStrategy {
    render(target: HTMLElement, svg: SVGSVGElement, options: HandDrawnOptions): void;
}
export * from './handdrawn/HandDrawnRegistry';
export * from './handdrawn/types';
