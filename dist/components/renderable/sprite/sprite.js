import { getEmitter } from "../../shared.js";
import { Texture } from "../../texture/texture.js";
import { RenderObject } from "../base/base.js";
const cacheRenewProps = new Set([
    "texture",
    "scale",
    "width",
    "height",
]);
export class Sprite extends RenderObject {
    data = Object.assign(super.getInternalData(), {
        texture: Texture.BLANK,
    });
    constructor(config = {}) {
        super(config);
        this.assignSpriteConfig(config);
        this.renderToImage();
        getEmitter(this).addListener("propupdate", (_, { prop }) => {
            const data = this.data;
            cacheRenewProps.has(prop) && (data.cachedImage = null);
            return null;
        });
    }
    assignSpriteConfig(config) {
        const data = this.data;
        data.texture = config.texture ?? data.texture;
        data.width = config.width ?? data.texture.width;
        data.height = config.height ?? data.texture.height;
        return null;
    }
    texture(value) {
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
    renderToImage() {
        const data = this.data;
        if (data.cachedImage)
            return data.cachedImage;
        data.cachedImage = data.texture.image;
        return data.texture.image;
    }
    render(context) {
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
//# sourceMappingURL=sprite.js.map