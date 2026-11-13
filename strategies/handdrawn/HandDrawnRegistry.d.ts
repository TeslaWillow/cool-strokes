import { HandDrawnStyle } from '../../types';
import { HandDrawnStyleGenerator } from './types';
export declare class HandDrawnRegistry {
    private static generators;
    /**
     * Registers a new or custom style generator.
     */
    static register(style: HandDrawnStyle | string, generator: HandDrawnStyleGenerator): void;
    /**
     * Retrieves a generator by style name, falling back to 'single' if not found.
     */
    static get(style?: HandDrawnStyle | string): HandDrawnStyleGenerator;
    /**
     * Returns list of all available style names.
     */
    static getAvailableStyles(): string[];
}
