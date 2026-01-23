import { resize } from "broadutils/canvas";
import type { Vector2 } from "broadutils/types";
import { getEmitter } from "../../shared.ts";
import { Texture } from "../../texture/texture.ts";
import { RenderObject } from "../base/base.ts";
import type { SpriteConfig, SpriteData } from "./types.ts";

export class Sprite extends RenderObject {
  protected override data: SpriteData = Object.assign(super.getInternalData(), {
    texture: Texture.BLANK,
  });
  public constructor(config: Partial<SpriteConfig> = {}) {
    super(config);
    this.assignSpriteConfig(config);
    this.updateCachedImage();
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

  protected override updateCachedImage(): null {
    const { cachedImage, scale, texture } = this.data;

    const canvas = cachedImage;
    const context = canvas.context;

    const tDim = texture.dimensions();
    const sDim: Vector2 = [tDim[0] * scale[0], tDim[1] * scale[1]];

    context.reset();
    resize(canvas, sDim);

    context.imageSmoothingEnabled = !texture.pixelated();
    context.drawImage(texture.image(), 0, 0, sDim[0], sDim[1]);
    this.markCacheClean();

    return null;
  }

  public override render(context: CanvasRenderingContext2D): null {
    const emitter = getEmitter(this);
    emitter.emit("prerender", [this, context]);

    const { matrix, relativeMatrix } = this;
    const {
      alpha,
      anchor,
      cacheDirty,
      cachedImage,
      dimensions: [width, height],
      texture,
    } = this.data;

    cacheDirty && this.updateCachedImage();

    const localMatrix = matrix;
    localMatrix.e += anchor[0] * width;
    localMatrix.f += anchor[1] * height;

    context.globalAlpha *= alpha;
    context.imageSmoothingEnabled = !texture.pixelated;
    context.setTransform(relativeMatrix.multiply(localMatrix));
    context.drawImage(cachedImage, -(anchor[0] * width), -(anchor[1] * height));

    localMatrix.e -= anchor[0] * width;
    localMatrix.f -= anchor[1] * height;

    emitter.emit("postrender", [this, context]);
    return null;
  }
}
