import { EventEmitter } from "./emitter/emitter.ts";
import type { RenderObject } from "./renderable/base/base.ts";
import type { RenderObjectEventMap } from "./renderable/base/types.ts";
import type { Container } from "./renderable/container/container.ts";
import type { ContainerEventMap } from "./renderable/container/types.ts";
import type { Sprite } from "./renderable/sprite/sprite.ts";
import type { SpriteEventMap } from "./renderable/sprite/types.ts";

const emitterMap = new WeakMap();
export const getEmitter: {
  (obj: Sprite): EventEmitter<SpriteEventMap>;
  (obj: Container): EventEmitter<ContainerEventMap>;
  (obj: RenderObject): EventEmitter<RenderObjectEventMap>;
} = (obj: object): EventEmitter<any> => {
  if (!emitterMap.has(obj)) {
    emitterMap.set(obj, new EventEmitter<{}>());
  }
  return emitterMap.get(obj) as EventEmitter<{}>;
};

export const zSort = (a: RenderObject, b: RenderObject): number => {
  return a.position()[2] - b.position()[2];
};
