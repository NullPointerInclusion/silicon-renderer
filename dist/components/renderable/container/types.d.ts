import type { RenderObject } from "../base/base.ts";
import type { RenderObjectConfig, RenderObjectData, RenderObjectEventMap } from "../base/types.ts";
import type { Container } from "./container.ts";
export interface ContainerConfig extends RenderObjectConfig {
    children: RenderObject[];
}
export interface ContainerData extends RenderObjectData {
    children: RenderObject[];
    shouldSortChildren: boolean;
}
export interface ContainerEventMap<ObjectType = Container> extends RenderObjectEventMap<ObjectType> {
    childrenupdate: [target: Container, update: {
        type: "add" | "remove";
        children: RenderObject[];
    }];
}
//# sourceMappingURL=types.d.ts.map