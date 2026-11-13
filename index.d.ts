import { StrokeController } from './core/Painter';
import { StrokeVariant, AnyStrokeOptions } from './types';
export declare function attachStroke(element: HTMLElement, variant: StrokeVariant, options?: AnyStrokeOptions): StrokeController;
export { Animator } from './core/Animator';
export { HandDrawnRegistry } from './strategies/HandDrawnStrategy';
export * from './types';
export type { StrokeController };
