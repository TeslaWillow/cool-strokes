import { StrokeVariant, AnyStrokeOptions } from '../types';
export interface StrokeController {
    (): void;
    destroy: () => void;
    replay: () => void;
}
export declare class Painter {
    private strategies;
    private observer;
    constructor();
    apply(element: HTMLElement, variant: StrokeVariant, options?: AnyStrokeOptions): StrokeController;
}
