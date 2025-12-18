import { RenderObject } from "../base/base.ts";
import type { ContainerConfig, ContainerData } from "./types.ts";
declare class Container extends RenderObject {
    protected data: ContainerData;
    constructor(config?: Partial<ContainerConfig>);
    private assignContainerConfig;
    protected getInternalData(): ContainerData;
    add(...objects: RenderObject[]): null;
    remove(...objects: RenderObject[]): null;
    renderToImage(): HTMLCanvasElement | HTMLImageElement;
    render(context: CanvasRenderingContext2D): null;
}
export { Container };
//# sourceMappingURL=container.d.ts.map