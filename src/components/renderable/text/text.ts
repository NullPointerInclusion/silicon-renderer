import { getEmitter, type CanvasWithContext } from "../../shared.ts";
import { RenderObject } from "../base/base.ts";
import type { TextConfig, TextData, TextPropertyUpdate } from "./types.ts";

export class Text extends RenderObject {
  protected override data: TextData = Object.assign(super.getInternalData(), {
    content: "",
    fontFamily: "sans-serif",
    fontSize: "1rem",
    fontWeight: 500,
    padding: [0, 0, 0, 0] as TextData["padding"],
  });
  public constructor(config: Partial<TextConfig> = {}) {
    super(config);
    this.assignTextConfig(config);
    this.renderToImage();
  }

  private assignTextConfig(config: Partial<TextConfig>): null {
    const data = this.data;
    const fontSize = config.fontSize ?? data.fontSize;

    data.content = String(config.content ?? data.content);
    data.fontFamily = config.fontFamily ?? data.fontFamily;
    data.fontSize = `${fontSize}${typeof fontSize === "number" ? "px" : ""}`;
    switch (config.fontWeight) {
      case "light":
      case "normal":
      case "bold": {
        data.fontWeight = { light: 300, normal: 500, bold: 700 }[config.fontWeight];
        break;
      }
      default: {
        data.fontWeight = config.fontWeight ?? data.fontWeight;
        break;
      }
    }

    if (config.padding) {
      const padding = config.padding;
      if (typeof padding === "number") data.padding.fill(padding);
      else {
        data.padding[0] = padding[0];
        data.padding[1] = padding[1];
        data.padding[2] = padding[2] ?? padding[0];
        data.padding[3] = padding[3] ?? padding[1];
      }
    }

    return null;
  }

  public content(value?: string): string {
    const data = this.data;
    const content = data.content;
    data.content = value ?? content;

    if (value != null) {
      this.markCacheDirty();
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "content", previous: content, current: value },
      ]);
    }

    return data.content;
  }

  public fontFamily(value?: string): string {
    const data = this.data;
    const fontFamily = data.fontFamily;
    data.fontFamily = value ?? fontFamily;

    if (value != null) {
      this.markCacheDirty();
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "fontFamily", previous: fontFamily, current: value },
      ]);
    }

    return data.fontFamily;
  }

  public fontSize(value?: string): string {
    const data = this.data;
    const fontSize = data.fontSize;
    data.fontSize = value ?? fontSize;

    if (value != null) {
      this.markCacheDirty();
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "fontSize", previous: fontSize, current: value },
      ]);
    }

    return data.fontSize;
  }

  public fontWeight(value?: number): number {
    const data = this.data;
    const fontWeight = data.fontWeight;
    data.fontWeight = value ?? fontWeight;

    if (value != null) {
      this.markCacheDirty();
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "fontWeight", previous: fontWeight, current: value },
      ]);
    }

    return data.fontWeight;
  }

  public override renderToImage(): CanvasWithContext {
    const data = this.data;
    if (!data.cacheDirty) return data.cachedImage;
    return data.cachedImage;
  }

  public override render(context: CanvasRenderingContext2D): null {
    const emitter = getEmitter(this);
    emitter.emit("prerender", [this, context]);

    const { matrix, relativeMatrix } = this;
    const {
      dimensions: [width, height],
      scale,
      anchor,
      alpha,
    } = this.data;

    const localMatrix = matrix;
    localMatrix.e += anchor[0] * width;
    localMatrix.f += anchor[1] * height;

    context.globalAlpha *= alpha;
    context.setTransform(relativeMatrix.multiply(localMatrix).scale(scale[0], scale[1]));
    // pending implementation

    emitter.emit("postrender", [this, context]);
    return null;
  }
}
