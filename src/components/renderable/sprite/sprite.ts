import { resize } from "broadutils/canvas";
import { getEmitter, type CanvasWithContext } from "../../shared.ts";
import { Texture } from "../../texture/texture.ts";
import { RenderObject } from "../base/base.ts";
import type { SpriteConfig, SpriteData, SpritePropertyUpdate } from "./types.ts";

export class Sprite extends RenderObject {
  protected override data: SpriteData = Object.assign(super.getInternalData(), {
    texture: Texture.BLANK,
  });
  public constructor(config: Partial<SpriteConfig> = {}) {
    super(config);
    this.assignSpriteConfig(config);
    this.renderToImage();
  }

  private assignSpriteConfig(config: Partial<SpriteConfig>): null {
    const data = this.data;
    data.texture = config.texture ?? data.texture;
    if (!config.dimensions) this.dimensions(data.texture.dimensions());
    return null;
  }

  public texture(value?: Texture): Texture {
    const data = this.data;
    const texture = data.texture;
    data.texture = value ?? texture;

    if (value != null) {
      this.markCacheDirty();
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "texture", previous: texture, current: value },
      ]);
    }

    return data.texture;
  }

  public override renderToImage(): CanvasWithContext {
    const data = this.data;
    if (!data.cacheDirty) return data.cachedImage;

    const canvas = data.cachedImage;
    const context = canvas.context;
    const texture = data.texture;

    context.reset();
    resize(canvas, texture.dimensions());
    context.drawImage(texture.image(), 0, 0);

    this.markCacheClean();
    return canvas;
  }

  public override render(context: CanvasRenderingContext2D): null {
    const emitter = getEmitter(this);
    emitter.emit("prerender", [this, context]);

    const { matrix, relativeMatrix } = this;
    const {
      texture,
      dimensions: [width, height],
      scale,
      anchor,
      alpha,
    } = this.data;

    const localMatrix = matrix;
    localMatrix.e += anchor[0] * width;
    localMatrix.f += anchor[1] * height;

    context.globalAlpha *= alpha;
    context.imageSmoothingEnabled = !texture.pixelated;
    context.setTransform(relativeMatrix.multiply(localMatrix).scale(scale[0], scale[1]));
    context.drawImage(
      this.renderToImage(),
      -(anchor[0] * width),
      -(anchor[1] * height),
      width,
      height,
    );

    localMatrix.e -= anchor[0] * width;
    localMatrix.f -= anchor[1] * height;

    emitter.emit("postrender", [this, context]);
    return null;
  }
}
