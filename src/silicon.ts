import { nonNullable } from "broadutils/validate";
import type { RenderObject } from "./components/renderable/base/base.ts";

interface SiliconConfig {
  width: number;
  height: number;
  renderScaling: number;
  canvas: HTMLCanvasElement;
}

class Silicon {
  private paper: HTMLCanvasElement;
  private pen: CanvasRenderingContext2D;
  private config: SiliconConfig;

  constructor(config: Partial<SiliconConfig> = {}) {
    this.paper = config.canvas || document.createElement("canvas");
    this.pen = nonNullable(this.paper.getContext("2d"), "Failed to acquire rendering context.");
    this.config = this.applyConfig(config);
  }

  private applyConfig(config: Partial<SiliconConfig>): SiliconConfig {
    let { width = 640, height = 480, renderScaling = 1 } = config;

    this.paper.width = width;
    this.paper.height = height;
    this.paper.style.setProperty("scale", `${renderScaling}`);

    return {
      width,
      height,
      renderScaling,
      canvas: this.paper,
    };
  }

  public get surface(): HTMLCanvasElement {
    return this.paper;
  }

  public render(object: RenderObject): null {
    this.pen.reset();
    object.render(this.pen);
    return null;
  }
}

export { Silicon };
export type { SiliconConfig };

export * from "./components/renderable/base/base.ts";
export * from "./components/renderable/sprite/sprite.ts";
export * from "./components/texture/texture.ts";
export * from "./components/utils.ts";
