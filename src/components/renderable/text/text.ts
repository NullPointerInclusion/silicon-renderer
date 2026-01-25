import { applyContextSnapshot, type ContextSnapshot } from "broadutils/canvas";
import { getEmitter, type CanvasWithContext } from "../../shared.ts";
import { RenderObject } from "../base/base.ts";
import type { TextConfig, TextData, TextPropertyUpdate } from "./types.ts";

export class Text extends RenderObject {
  protected override data: TextData = Object.assign(super.getInternalData(), {
    content: "",
    fillColour: "#000",
    fontFamily: "sans-serif",
    fontSize: "1rem",
    fontWeight: 500,
    strokeColour: "#fff",
    strokeWidth: 0,
  });
  public constructor(config: Partial<TextConfig> = {}) {
    super(config);
    this.assignTextConfig(config);
  }

  private assignTextConfig(config: Partial<TextConfig>): null {
    const data = this.data;
    const fontSize = config.fontSize ?? data.fontSize;

    data.content = String(config.content ?? data.content);
    data.fontFamily = config.fontFamily ?? data.fontFamily;
    data.fontSize = `${fontSize}${typeof fontSize === "number" ? "px" : ""}`;
    data.fillColour = config.fillColour ?? data.fillColour;
    data.strokeColour = config.strokeColour ?? data.strokeColour;
    data.strokeWidth = config.strokeWidth ?? data.strokeWidth;
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

    return null;
  }

  protected getRenderContextSnapshot(): Partial<ContextSnapshot> {
    const { fillColour, fontFamily, fontSize, fontWeight, strokeColour, strokeWidth } = this.data;
    return {
      font: `${fontWeight} ${fontSize} ${fontFamily}`,
      fillStyle: fillColour,
      strokeStyle: strokeColour,
      lineWidth: strokeWidth,
    };
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

  public fillColour(value?: string): string {
    const data = this.data;
    const fillColour = data.fillColour;
    data.fillColour = value ?? fillColour;

    if (value != null) {
      this.markCacheDirty();
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "fillColour", previous: fillColour, current: value },
      ]);
    }

    return data.fillColour;
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

  public strokeColour(value?: string): string {
    const data = this.data;
    const strokeColour = data.strokeColour;
    data.strokeColour = value ?? strokeColour;

    if (value != null) {
      this.markCacheDirty();
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "strokeColour", previous: strokeColour, current: value },
      ]);
    }

    return data.strokeColour;
  }

  public strokeWidth(value?: number): number {
    const data = this.data;
    const strokeWidth = data.strokeWidth;
    data.strokeWidth = value ?? strokeWidth;

    if (value != null) {
      this.markCacheDirty();
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "strokeWidth", previous: strokeWidth, current: value },
      ]);
    }

    return data.strokeWidth;
  }

  public override render(context: CanvasRenderingContext2D): null {
    const emitter = getEmitter(this);
    emitter.emit("prerender", [this, context]);

    const { matrix, relativeMatrix } = this;
    const {
      alpha,
      anchor,
      content,
      dimensions: [width, height],
      scale,
    } = this.data;

    const localMatrix = matrix;
    localMatrix.e += anchor[0] * width;
    localMatrix.f += anchor[1] * height;

    context.globalAlpha *= alpha;
    context.setTransform(relativeMatrix.multiply(localMatrix).scale(scale[0], scale[1]));
    applyContextSnapshot(context, this.getRenderContextSnapshot());
    context.fillText(content, 0, height, width);
    context.strokeText(content, 0, height, width);

    emitter.emit("postrender", [this, context]);
    return null;
  }
}
