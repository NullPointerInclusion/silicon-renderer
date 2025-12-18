import { resize } from "broadutils/canvas";
import { nonNullable } from "broadutils/validate";
import { getEmitter, zSort } from "../../shared.js";
import { RenderObject } from "../base/base.js";
class Container extends RenderObject {
    data = Object.assign(super.getInternalData(), {
        children: [],
        shouldSortChildren: true,
        listeners: {
            onmatrixupdate: () => {
                const children = this.data.children;
                const matrix = this.relativeMatrix.multiply(this.matrix);
                for (let i = 0; i < children.length; ++i) {
                    children[i]?.updateRelativeMatrix(matrix);
                }
                return null;
            },
            onchildupdate: (_, { prop }) => {
                const data = this.data;
                data.cachedImage = null;
                if (prop === "position")
                    data.shouldSortChildren = true;
                return null;
            },
        },
    });
    constructor(config = {}) {
        super(config);
        const emitter = getEmitter(this);
        const listeners = this.data.listeners;
        emitter.addListener("relativematrixupdate", nonNullable(listeners.onmatrixupdate));
        emitter.addListener("matrixupdate", nonNullable(listeners.onmatrixupdate));
        this.assignContainerConfig(config);
    }
    assignContainerConfig(config) {
        this.data.children = config.children ?? this.data.children;
        return null;
    }
    getInternalData() {
        return this.data;
    }
    add(...objects) {
        const { data } = this;
        for (const obj of objects) {
            data.children.push(obj);
            getEmitter(obj).addListener("propupdate", data.listeners.onchildupdate);
        }
        data.shouldSortChildren = !!objects.length;
        return null;
    }
    remove(...objects) {
        const { data } = this;
        const objectSet = new Set(objects);
        const objectsToKeep = [];
        const objectsToRemove = [];
        for (let i = 0; i < data.children.length; ++i) {
            const object = data.children[i];
            object && (objectSet.has(object) ? objectsToRemove : objectsToKeep).push(object);
        }
        for (const obj of objectsToRemove) {
            getEmitter(obj).removeListener("propupdate", data.listeners.onchildupdate);
        }
        data.children.length = 0;
        data.children.push(...objectsToKeep);
        data.shouldSortChildren = !!objects.length;
        return null;
    }
    renderToImage() {
        const { data } = this;
        if (data.cachedImage)
            return data.cachedImage;
        const { canvas, context } = data;
        resize(canvas, [data.width, data.height]);
        context.reset();
        data.shouldSortChildren && (data.shouldSortChildren = !data.children.sort(zSort));
        for (let i = 0; i < data.children.length; ++i) {
            context.save();
            data.children[i]?.render(context);
            context.restore();
        }
        data.cachedImage = canvas;
        return data.cachedImage;
    }
    render(context) {
        const emitter = getEmitter(this);
        emitter.emit("prerender", [this, context]);
        const { matrix, relativeMatrix } = this;
        const { width, height, scale, anchor, alpha } = this.data;
        const localMatrix = matrix;
        localMatrix.e += anchor[0] * width;
        localMatrix.f += anchor[1] * height;
        context.globalAlpha *= alpha;
        context.setTransform(relativeMatrix.multiply(localMatrix).scale(scale[0], scale[1]));
        context.drawImage(this.renderToImage(), -(anchor[0] * width), -(anchor[1] * height), width, height);
        emitter.emit("postrender", [this, context]);
        return null;
    }
}
export { Container };
//# sourceMappingURL=container.js.map