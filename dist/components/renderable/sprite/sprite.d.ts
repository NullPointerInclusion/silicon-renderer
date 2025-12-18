import { Texture } from "../../texture/texture.ts";
import { RenderObject } from "../base/base.ts";
import type { SpriteConfig, SpriteData } from "./types.ts";
export declare class Sprite extends RenderObject {
    protected data: SpriteData;
    constructor(config?: Partial<SpriteConfig>);
    private assignSpriteConfig;
    texture(value?: Texture): Texture;
    renderToImage(): HTMLCanvasElement | HTMLImageElement;
    render(context: CanvasRenderingContext2D): null;
}
//# sourceMappingURL=sprite.d.ts.map