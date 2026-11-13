export declare const SVG_NS = "http://www.w3.org/2000/svg";
export declare function createSvgElement<K extends keyof SVGElementTagNameMap>(qualifiedName: K, attributes?: Record<string, string | number>): SVGElementTagNameMap[K];
