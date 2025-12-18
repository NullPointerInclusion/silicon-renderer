import { EventEmitter } from "./emitter/emitter.ts";
import type { RenderObject } from "./renderable/base/base.ts";
import type { RenderObjectEventMap } from "./renderable/base/types.ts";
import type { Container } from "./renderable/container/container.ts";
import type { ContainerEventMap } from "./renderable/container/types.ts";
import type { Sprite } from "./renderable/sprite/sprite.ts";
import type { SpriteEventMap } from "./renderable/sprite/types.ts";
export declare const getEmitter: {
    (obj: Sprite): EventEmitter<SpriteEventMap>;
    (obj: Container): EventEmitter<ContainerEventMap>;
    (obj: RenderObject): EventEmitter<RenderObjectEventMap>;
};
export declare const zSort: (a: RenderObject, b: RenderObject) => number;
//# sourceMappingURL=shared.d.ts.map