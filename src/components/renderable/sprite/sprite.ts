import { getEmitter } from "../../shared.ts";
import { Texture } from "../../texture/texture.ts";
import { RenderObject } from "../base/base.ts";
import type { SpriteConfig, SpriteData, SpritePropertyUpdate } from "./types.ts";

const cacheRenewProps = new Set<SpritePropertyUpdate["prop"]>([
  "texture",
  "scale",
  "width",
  "height",
]);

export class Sprite extends RenderObject {
  protected override data: SpriteData = Object.assign(super.getInternalData(), {
    texture: Texture.BLANK,
  });
  public constructor(config: Partial<SpriteConfig> = {}) {
    super(config);
    this.assignSpriteConfig(config);
    this.renderToImage();

    getEmitter(this).addListener("propupdate", (_, { prop }) => {
      const data = this.data;
      cacheRenewProps.has(prop) && (data.cachedImage = null);
      return null;
    });
  }

  private assignSpriteConfig(config: Partial<SpriteConfig>): null {
    const data = this.data;
    data.texture = config.texture ?? data.texture;
    data.width = config.width ?? data.texture.width;
    data.height = config.height ?? data.texture.height;
    return null;
  }

  public texture(value?: Texture): Texture {
    const data = this.data;
    if (value != null && value !== data.texture) {
      const previous = data.texture;
      data.texture = value;
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "texture", previous, current: data.texture },
      ]);
    }
    return data.texture;
  }

  public override renderToImage(): HTMLCanvasElement | HTMLImageElement {
    const data = this.data;
    if (data.cachedImage) return data.cachedImage;

    data.cachedImage = data.texture.image;
    return data.texture.image;
  }

  public override render(context: CanvasRenderingContext2D): null {
    const emitter = getEmitter(this);
    emitter.emit("prerender", [this, context]);

    const { matrix, relativeMatrix } = this;
    const { texture, width, height, scale, anchor, alpha } = this.data;

    const localMatrix = matrix;
    localMatrix.e += anchor[0] * width;
    localMatrix.f += anchor[1] * height;

    context.globalAlpha *= alpha;
    context.imageSmoothingEnabled = !texture.pixelated;
    context.setTransform(relativeMatrix.multiply(localMatrix).scale(scale[0], scale[1]));
    context.drawImage(texture.image, -(anchor[0] * width), -(anchor[1] * height), width, height);

    emitter.emit("postrender", [this, context]);
    return null;
  }
}
