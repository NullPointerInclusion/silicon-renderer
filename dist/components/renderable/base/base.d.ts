import type { Vector2, Vector3 } from "broadutils/types";
import type { CachedImage, RenderObjectConfig, RenderObjectData } from "./types.ts";
declare class RenderObject {
    protected relativeMatrix: DOMMatrix;
    protected matrix: DOMMatrix;
    protected data: RenderObjectData;
    constructor(config?: Partial<RenderObjectConfig & {
        zIndex: number;
    }>);
    private assignROConfig;
    protected getInternalData(): RenderObjectData;
    updateRelativeMatrix(relativeMatrix: DOMMatrix): null;
    alpha(value?: number): number;
    anchor(value?: Vector2): Vector2;
    height(value?: number): number;
    position(value?: RenderObjectConfig["position"]): Vector3;
    rotation(value?: number): number;
    scale(value?: Vector2): Vector2;
    width(value?: number): number;
    move(dx: number, dy: number): null;
    moveTo(x: number, y: number): null;
    rotate(deltaR: number): null;
    rotateTo(angle: number): null;
    forward(dpos: number): null;
    backward(dpos: number): null;
    protected renderToImage(): CachedImage;
    render(context: CanvasRenderingContext2D): null;
}
export { RenderObject };
//# sourceMappingURL=base.d.ts.map