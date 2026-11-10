# 🎨 cool-strokes

A lightweight, zero-dependency TypeScript library for adding beautiful, responsive, and animated SVG strokes, highlighters, and hand-drawn annotations to any HTML element.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success.svg)

---

## ✨ Features

- 🖋️ **3 Main Stroke Variants**:
  - `highlight`: Marker-style highlighter placed cleanly behind text.
  - `underline`: Solid color or multi-color linear gradient underline.
  - `hand-drawn`: 10 distinct organic styles (single, double, triple, brush, loopy, knot, zigzag, dashed, scribble, wavy).
- 🎬 **Realistic Stroke Animations**:
  - Parametric SVG path drawing using `getTotalLength` & `stroke-dashoffset`.
  - True 360° circular loops for cursive/loopy styles (no rectangular mask hacks).
  - Configurable duration (in ms), delay, and easing.
- 📐 **Responsive & Self-Healing**:
  - Automatically redraws on window or container resize via `ResizeObserver`.
  - Stacking-context safe (`isolation: isolate`) — highlighters will never disappear behind parent cards or modals.
- 🧩 **Clean Architecture**:
  - Built with Strategy and Registry patterns.
  - Fully extensible via `HandDrawnRegistry.register()`.
- ⚡ **Lightweight & Framework-Agnostic**: Works with Vanilla JS/TS, React, Angular, Vue, Svelte, etc.

---

## 📦 Installation

```bash
npm install cool-strokes
```

Or via pnpm / yarn:

```bash
pnpm add cool-strokes
# or
yarn add cool-strokes
```

---

## 🚀 Quick Start (Vanilla TypeScript / JavaScript)

```ts
import { attachStroke } from "cool-strokes";

const heading = document.querySelector("#title") as HTMLElement;

// Attach an animated hand-drawn loopy underline
const controller = attachStroke(heading, "hand-drawn", {
  style: "loopy",
  color: "#8b5cf6",
  strokeWidth: 3,
  roughness: 1.5,
  seed: 42,
  animate: true,
  duration: 1000,
});

// Replay the animation anytime (e.g. on click or hover)
button.addEventListener("click", () => {
  controller.replay();
});

// Clean up when no longer needed (removes SVG & unobserves element)
controller.destroy(); // or simply controller();
```

---

## ⚛️ React Integration (TypeScript)

### 1. Using a Custom Hook (`useStroke`)

Create a reusable hook `useStroke.ts`:

```tsx
// src/hooks/useStroke.ts
import { useEffect, useRef } from "react";
import {
  attachStroke,
  StrokeVariant,
  AnyStrokeOptions,
  StrokeController,
} from "cool-strokes";

export function useStroke<T extends HTMLElement = HTMLHeadingElement>(
  variant: StrokeVariant,
  options?: AnyStrokeOptions,
) {
  const ref = useRef<T | null>(null);
  const controllerRef = useRef<StrokeController | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    controllerRef.current = attachStroke(ref.current, variant, options);

    return () => {
      controllerRef.current?.destroy();
    };
  }, [variant, JSON.stringify(options)]);

  const replay = () => {
    controllerRef.current?.replay();
  };

  return { ref, replay };
}
```

### 2. Using in a React Component

```tsx
// src/components/TitleShowcase.tsx
import React from "react";
import { useStroke } from "../hooks/useStroke";

export const TitleShowcase: React.FC = () => {
  const { ref: highlightRef, replay: replayHighlight } =
    useStroke<HTMLHeadingElement>("highlight", {
      color: "#fef08a",
      opacity: 0.65,
      animate: true,
      duration: 600,
    });

  const { ref: loopyRef, replay: replayLoopy } = useStroke<HTMLHeadingElement>(
    "hand-drawn",
    {
      style: "loopy",
      color: "#ec4899",
      strokeWidth: 3,
      animate: true,
      duration: 1200,
      seed: 99,
    },
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        padding: "2rem",
      }}
    >
      <div>
        <h2 ref={highlightRef}>Highlighted Text in React</h2>
        <button onClick={replayHighlight}>Replay Highlight</button>
      </div>

      <div>
        <h2 ref={loopyRef}>Loopy Hand-Drawn Stroke</h2>
        <button onClick={replayLoopy}>Replay Loopy</button>
      </div>
    </div>
  );
};
```

---

## 🅰️ Angular Integration (TypeScript)

### 1. Custom Directive (`StrokeDirective`)

Create a standalone Angular directive:

```ts
// src/app/directives/stroke.directive.ts
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
} from "@angular/core";
import {
  attachStroke,
  StrokeVariant,
  AnyStrokeOptions,
  StrokeController,
} from "cool-strokes";

@Directive({
  selector: "[appStroke]",
  standalone: true,
  exportAs: "appStroke",
})
export class StrokeDirective implements OnChanges, OnDestroy {
  private el = inject(ElementRef);
  private controller?: StrokeController;

  @Input("appStroke") variant: StrokeVariant = "hand-drawn";
  @Input() strokeOptions?: AnyStrokeOptions;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["variant"] || changes["strokeOptions"]) {
      this.initStroke();
    }
  }

  public replay(): void {
    this.controller?.replay();
  }

  private initStroke(): void {
    this.controller?.destroy();

    const target = this.el.nativeElement as HTMLElement;
    if (target) {
      this.controller = attachStroke(target, this.variant, this.strokeOptions);
    }
  }

  ngOnDestroy(): void {
    this.controller?.destroy();
  }
}
```

### 2. Using in an Angular Component

```ts
// src/app/showcase/showcase.component.ts
import { Component } from "@angular/core";
import { StrokeDirective } from "../directives/stroke.directive";
import { HandDrawnOptions, UnderlineOptions } from "cool-strokes";

@Component({
  selector: "app-showcase",
  standalone: true,
  imports: [StrokeDirective],
  template: `
    <div class="container">
      <!-- Gradient Underline -->
      <h2
        [appStroke]="'underline'"
        [strokeOptions]="gradientOptions"
        #grad="appStroke"
      >
        Gradient Underline in Angular
      </h2>
      <button (click)="grad.replay()">Replay Gradient</button>

      <!-- Hand-Drawn Knot Flourish -->
      <h2
        [appStroke]="'hand-drawn'"
        [strokeOptions]="knotOptions"
        #knot="appStroke"
      >
        Decorative Knot Underline
      </h2>
      <button (click)="knot.replay()">Replay Knot</button>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 2rem;
      }
      button {
        width: fit-content;
        cursor: pointer;
      }
    `,
  ],
})
export class ShowcaseComponent {
  gradientOptions: UnderlineOptions = {
    gradient: ["#ec4899", "#8b5cf6", "#3b82f6"],
    strokeWidth: 5,
    animate: true,
    duration: 800,
  };

  knotOptions: HandDrawnOptions = {
    style: "loop-knot",
    color: "#10b981",
    strokeWidth: 3,
    roughness: 2,
    seed: 33,
    animate: true,
    duration: 1000,
  };
}
```

---

## 📖 API Reference

### `attachStroke(element, variant, options?): StrokeController`

- **`element`**: Target `HTMLElement` (e.g. `<h1>`, `<h2>`, `<span>`, `<p>`).
- **`variant`**: `"highlight"` | `"underline"` | `"hand-drawn"`.
- **`options`**: Variant-specific options (detailed below).
- **Returns**: A `StrokeController` function with `.destroy()` and `.replay()` methods.

```ts
interface StrokeController {
  (): void; // Calling the controller directly executes destroy()
  destroy: () => void; // Cleans up the SVG and unobserves ResizeObserver
  replay: () => void; // Restarts the animation from the beginning
}
```

---

### Common Options (`BaseStrokeOptions`)

All variants inherit these options:

| Property            | Type      | Default                          | Description                                      |
| :------------------ | :-------- | :------------------------------- | :----------------------------------------------- |
| `color`             | `string`  | Variant default                  | Stroke or fill color (hex, rgb, hsl, css color). |
| `strokeWidth`       | `number`  | Variant default                  | Thickness of the stroke in pixels.               |
| `className`         | `string`  | `undefined`                      | Custom CSS class attached to the root SVG.       |
| `animate`           | `boolean` | `false`                          | Enables natural drawing animation.               |
| `duration`          | `number`  | `800`                            | Animation duration in milliseconds (ms).         |
| `animationDuration` | `number`  | `800`                            | Alias for `duration`.                            |
| `delay`             | `number`  | `0`                              | Delay before animation starts (in ms).           |
| `easing`            | `string`  | `"cubic-bezier(0.4, 0, 0.2, 1)"` | CSS transition timing function.                  |

---

### 1. `highlight` Options (`HighlightOptions`)

| Property      | Type     | Default       | Description                                                    |
| :------------ | :------- | :------------ | :------------------------------------------------------------- |
| `color`       | `string` | `"#fcff46ff"` | Highlighter color.                                             |
| `opacity`     | `number` | `0.35`        | Fill opacity between `0` and `1`.                              |
| `heightRatio` | `number` | `0.45`        | Fraction of element height covered (e.g. `0.45` = bottom 45%). |

---

### 2. `underline` Options (`UnderlineOptions`)

| Property      | Type       | Default     | Description                                                                            |
| :------------ | :--------- | :---------- | :------------------------------------------------------------------------------------- |
| `color`       | `string`   | `"#3b82f6"` | Underline solid color.                                                                 |
| `strokeWidth` | `number`   | `4`         | Thickness in pixels.                                                                   |
| `gradient`    | `string[]` | `undefined` | Array of color stops for a horizontal linear gradient (e.g. `["#f43f5e", "#8b5cf6"]`). |

---

### 3. `hand-drawn` Options (`HandDrawnOptions`)

| Property      | Type             | Default     | Description                                                                            |
| :------------ | :--------------- | :---------- | :------------------------------------------------------------------------------------- |
| `style`       | `HandDrawnStyle` | `"single"`  | The hand-drawn style to render.                                                        |
| `color`       | `string`         | `"#10b981"` | Stroke color.                                                                          |
| `strokeWidth` | `number`         | `3`         | Stroke thickness.                                                                      |
| `roughness`   | `number`         | `2`         | Degree of hand jitter/wobble.                                                          |
| `seed`        | `number`         | `undefined` | Integer seed (Mulberry32 PRNG) for deterministic, reproducible strokes across renders. |

#### Available Hand-Drawn Styles (`HandDrawnStyle`):

- `"single"`: Classic organic single-pass curved pen stroke.
- `"double"`: Two organic parallel lines with slight natural offset.
- `"triple"`: Quick 3-way flourish (forward $\rightarrow$ back $\rightarrow$ forward).
- `"brush"`: Multi-pass textured stroke with marker body and rough edge passes.
- `"zigzag"`: Sharp, energetic sawtooth underline.
- `"loopy"`: Consecutive cursive loop curls (real 360° loops).
- `"loop-knot"`: Elegant arched stroke with a central decorative loop knot.
- `"dashed"`: Organic hand-dashed line along a gentle curve.
- `"scribble"` / `"strike"`: Fast horizontal back-and-forth sketch scribble.
- `"wavy"`: Smooth, undulating sinusoidal wave.

---

## 🔌 Custom Styles & Extensibility (Open/Closed Principle)

You can register your own custom hand-drawn generators without modifying the library source code:

```ts
import {
  HandDrawnRegistry,
  HandDrawnStyleGenerator,
  HandDrawnRenderContext,
} from "cool-strokes";

class StarDottedGenerator implements HandDrawnStyleGenerator {
  generate(context: HandDrawnRenderContext): SVGElement[] {
    const { width, baseY, color } = context;
    // Create any custom SVG geometry:
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    circle.setAttribute("cx", `${width / 2}`);
    circle.setAttribute("cy", `${baseY}`);
    circle.setAttribute("r", "5");
    circle.setAttribute("fill", color);
    return [circle];
  }
}

// Register the custom style:
HandDrawnRegistry.register("star-dot", new StarDottedGenerator());

// Use it immediately:
attachStroke(element, "hand-drawn", { style: "star-dot" as any });
```

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Run TypeScript type check
npx tsc --noEmit

# Build production library (ESM, CJS, and .d.ts)
npx vite build
```

---

## 📄 License

MIT
