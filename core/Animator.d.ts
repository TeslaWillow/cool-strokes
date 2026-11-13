export interface AnimationConfig {
    duration?: number;
    animationDuration?: number;
    delay?: number;
    easing?: string;
}
export declare class Animator {
    static resolveDuration(config: AnimationConfig, fallback?: number): number;
    /**
     * Animates a single SVG path or line element using stroke-dashoffset.
     * As it animates, the stroke physically draws itself along the exact geometry.
     */
    static animateStroke(element: SVGGeometryElement, config?: AnimationConfig): Animation | null;
    /**
     * Animates multiple stroke elements in sequence.
     * Perfect for multi-pass strokes (e.g. double, triple) where the hand draws one line after another.
     */
    static animateSequence(elements: SVGGeometryElement[], config?: AnimationConfig, overlapRatio?: number): void;
    /**
     * Animates multiple stroke elements nearly in parallel with a slight stagger.
     * Perfect for textured brushes where all passes travel together like a wide brush tip.
     */
    static animateStaggered(elements: SVGGeometryElement[], config?: AnimationConfig, staggerMs?: number): void;
    /**
     * Animates a sequence of small dashes (e.g. DashedGenerator) popping/drawing in order.
     */
    static animateDashes(elements: SVGGeometryElement[], config?: AnimationConfig): void;
    /**
     * Animates a highlighter block smoothly sliding from 0% to 100% width.
     */
    static animateHighlight(rect: SVGRectElement, config?: AnimationConfig): Animation | null;
    /**
     * Safely calculates the total length of any SVG geometry element.
     */
    private static getElementLength;
}
