// ./src/strategies/handdrawn/HandDrawnRegistry.ts

import { HandDrawnStyle } from "../../types";
import { HandDrawnStyleGenerator } from "./types";
import { SingleGenerator } from "./generators/SingleGenerator";
import { DoubleGenerator } from "./generators/DoubleGenerator";
import { TripleGenerator } from "./generators/TripleGenerator";
import { BrushGenerator } from "./generators/BrushGenerator";
import { ZigzagGenerator } from "./generators/ZigzagGenerator";
import { LoopyGenerator } from "./generators/LoopyGenerator";
import { LoopKnotGenerator } from "./generators/LoopKnotGenerator";
import { DashedGenerator } from "./generators/DashedGenerator";
import { ScribbleGenerator } from "./generators/ScribbleGenerator";
import { WavyGenerator } from "./generators/WavyGenerator";

export class HandDrawnRegistry {
  private static generators: Map<string, HandDrawnStyleGenerator> = new Map();

  static {
    // Register built-in style generators
    this.register("single", new SingleGenerator());
    this.register("double", new DoubleGenerator());
    this.register("triple", new TripleGenerator());
    this.register("brush", new BrushGenerator());
    this.register("zigzag", new ZigzagGenerator());
    this.register("loopy", new LoopyGenerator());
    this.register("loop-knot", new LoopKnotGenerator());
    this.register("dashed", new DashedGenerator());
    this.register("scribble", new ScribbleGenerator());
    this.register("strike", new ScribbleGenerator());
    this.register("wavy", new WavyGenerator());
  }

  /**
   * Registers a new or custom style generator.
   */
  public static register(
    style: HandDrawnStyle | string,
    generator: HandDrawnStyleGenerator,
  ): void {
    this.generators.set(style, generator);
  }

  /**
   * Retrieves a generator by style name, falling back to 'single' if not found.
   */
  public static get(style: HandDrawnStyle | string = "single"): HandDrawnStyleGenerator {
    return this.generators.get(style) ?? this.generators.get("single")!;
  }

  /**
   * Returns list of all available style names.
   */
  public static getAvailableStyles(): string[] {
    return Array.from(this.generators.keys());
  }
}

