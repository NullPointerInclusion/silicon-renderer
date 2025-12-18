import type { RenderObject } from "./components/renderable/base/base.ts";
interface SiliconConfig {
    width: number;
    height: number;
    renderScaling: number;
    canvas: HTMLCanvasElement;
}
declare class Silicon {
    private paper;
    private pen;
    private config;
    constructor(config?: Partial<SiliconConfig>);
    private applyConfig;
    get surface(): HTMLCanvasElement;
    render(object: RenderObject): null;
}
export { Silicon };
export type { SiliconConfig };
export * from "./components/renderable/base/base.ts";
export * from "./components/renderable/sprite/sprite.ts";
export * from "./components/texture/texture.ts";
export * from "./components/utils.ts";
//# sourceMappingURL=silicon.d.ts.map