import { nonNullable } from "broadutils/validate";
class Silicon {
    paper;
    pen;
    config;
    constructor(config = {}) {
        this.paper = config.canvas || document.createElement("canvas");
        this.pen = nonNullable(this.paper.getContext("2d"), "Failed to acquire rendering context.");
        this.config = this.applyConfig(config);
    }
    applyConfig(config) {
        let { width = 640, height = 480, renderScaling = 1 } = config;
        this.paper.width = width;
        this.paper.height = height;
        this.paper.style.setProperty("scale", `${renderScaling}`);
        return {
            width,
            height,
            renderScaling,
            canvas: this.paper,
        };
    }
    get surface() {
        return this.paper;
    }
    render(object) {
        this.pen.reset();
        object.render(this.pen);
        return null;
    }
}
export { Silicon };
export * from "./components/renderable/base/base.js";
export * from "./components/renderable/sprite/sprite.js";
export * from "./components/texture/texture.js";
export * from "./components/utils.js";
//# sourceMappingURL=silicon.js.map