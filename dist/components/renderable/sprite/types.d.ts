import type { Texture } from "../../texture/texture.ts";
import type { RenderObjectConfig, RenderObjectData, RenderObjectEventMap, RenderObjectPropertyUpdate } from "../base/types.ts";
import type { Sprite } from "./sprite.ts";
export interface SpriteConfig extends RenderObjectConfig {
    texture: Texture;
}
export interface SpriteData extends RenderObjectData {
    texture: Texture;
}
export type SpritePropertyUpdate = RenderObjectPropertyUpdate | {
    prop: "texture";
    previous: Texture;
    current: Texture;
};
export type SpriteEventMap = Omit<RenderObjectEventMap<Sprite>, "propupdate"> & {
    propupdate: [target: Sprite, update: SpritePropertyUpdate];
};
//# sourceMappingURL=types.d.ts.map