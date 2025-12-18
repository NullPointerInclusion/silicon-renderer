import { getEmitter } from "../../shared.js";
import { radiansToDegrees } from "../../utils.js";
import { nonNullable } from "broadutils/validate";
const getDrawingTools = () => {
    const canvas = document.createElement("canvas");
    const context = nonNullable(canvas.getContext("2d"));
    return { canvas, context };
};
const getRenderObjectId = (object) => {
    const constructorName = Object.getPrototypeOf(object).constructor.name;
    const randomNumber = Math.floor(1e5 + Math.random() * (1e6 - 1e5));
    return `${constructorName}-${randomNumber}`;
};
class RenderObject {
    relativeMatrix = new DOMMatrix();
    matrix = new DOMMatrix();
    data = {
        id: "",
        alpha: 1,
        anchor: [0, 0],
        rotation: 0,
        scale: [1, 1],
        width: 0,
        height: 0,
        zIndex: 0,
        listeners: {},
        cachedImage: null,
        ...getDrawingTools(),
    };
    constructor(config = {}) {
        this.assignROConfig(config);
    }
    assignROConfig(config) {
        const { data, matrix } = this;
        data.id = config.id ?? getRenderObjectId(this);
        data.alpha = config.alpha ?? data.alpha;
        data.anchor = config.anchor ?? data.anchor;
        data.height = config.height ?? data.height;
        data.rotation = config.rotation ?? data.rotation;
        data.scale = config.scale ?? data.scale;
        data.width = config.width ?? data.width;
        if (config.position) {
            const position = config.position;
            let x, y, z;
            if (Array.isArray(position))
                [x, y, z] = [position[0], position[1], position[2] ?? 0];
            else
                [x, y, z] = [position.x ?? 0, position.y ?? 0, position.z ?? 0];
            matrix.e = x;
            matrix.f = y;
            this.data.zIndex = z;
        }
        return null;
    }
    getInternalData() {
        return this.data;
    }
    updateRelativeMatrix(relativeMatrix) {
        this.relativeMatrix = relativeMatrix;
        getEmitter(this).emit("relativematrixupdate", [this, [relativeMatrix, this.matrix]]);
        return null;
    }
    alpha(value) {
        const data = this.data;
        if (value != null) {
            const alpha = data.alpha;
            data.alpha = value;
            getEmitter(this).emit("propupdate", [
                this,
                { prop: "alpha", previous: alpha, current: data.alpha },
            ]);
        }
        return data.alpha;
    }
    anchor(value) {
        const data = this.data;
        if (value != null) {
            const anchor = [...data.anchor];
            ((data.anchor[0] = value[0]), (data.anchor[1] = value[1]));
            getEmitter(this).emit("propupdate", [
                this,
                { prop: "anchor", previous: anchor, current: [...data.anchor] },
            ]);
        }
        return data.anchor;
    }
    height(value) {
        const data = this.data;
        if (value != null) {
            const height = data.height;
            data.height = value;
            getEmitter(this).emit("propupdate", [
                this,
                { prop: "height", previous: height, current: data.height },
            ]);
        }
        return data.height;
    }
    position(value) {
        const { data, matrix } = this;
        if (value != null) {
            const position = [matrix.e, matrix.f, data.zIndex];
            if (Array.isArray(value)) {
                matrix.e = value[0];
                matrix.f = value[1];
                data.zIndex = value[2] ?? data.zIndex;
            }
            else {
                matrix.e = value.x ?? matrix.e;
                matrix.f = value.y ?? matrix.f;
                data.zIndex = value.z ?? data.zIndex;
            }
            getEmitter(this).emit("matrixupdate", [this, this.matrix]);
            getEmitter(this).emit("propupdate", [
                this,
                { prop: "position", previous: position, current: [matrix.e, matrix.f, data.zIndex] },
            ]);
        }
        return [matrix.e, matrix.f, data.zIndex];
    }
    rotation(value) {
        const { data, matrix } = this;
        if (value != null) {
            const rotation = data.rotation;
            const diff = value - rotation;
            data.rotation = value % (Math.PI * 2);
            matrix.rotateSelf(radiansToDegrees(diff));
            getEmitter(this).emit("matrixupdate", [this, this.matrix]);
            getEmitter(this).emit("propupdate", [
                this,
                { prop: "rotation", previous: rotation, current: data.rotation },
            ]);
        }
        return data.rotation;
    }
    scale(value) {
        const data = this.data;
        if (value != null) {
            const scale = [...data.scale];
            ((data.scale[0] = value[0]), (data.scale[1] = value[1]));
            getEmitter(this).emit("propupdate", [
                this,
                { prop: "scale", previous: scale, current: [...data.scale] },
            ]);
        }
        return data.scale;
    }
    width(value) {
        const data = this.data;
        if (value != null) {
            const width = data.width;
            data.width = value;
            getEmitter(this).emit("propupdate", [
                this,
                { prop: "width", previous: width, current: data.width },
            ]);
        }
        return data.width;
    }
    move(dx, dy) {
        const { data, matrix } = this;
        this.position([matrix.e + dx, matrix.f + dy, data.zIndex]);
        return null;
    }
    moveTo(x, y) {
        this.position([x, y, this.data.zIndex]);
        return null;
    }
    rotate(deltaR) {
        this.rotation(this.rotation() + deltaR);
        return null;
    }
    rotateTo(angle) {
        this.rotation(angle);
        return null;
    }
    forward(dpos) {
        const { data, matrix } = this;
        this.position([
            matrix.e + Math.cos(data.rotation) * dpos,
            matrix.f + Math.sin(data.rotation) * dpos,
            data.zIndex,
        ]);
        return null;
    }
    backward(dpos) {
        const { data, matrix } = this;
        this.position([
            matrix.e - Math.cos(data.rotation) * dpos,
            matrix.f - Math.sin(data.rotation) * dpos,
            data.zIndex,
        ]);
        return null;
    }
    renderToImage() {
        throw new Error("Method not implemented.");
    }
    render(context) {
        throw new Error("Method not implemented.");
    }
}
export { RenderObject };
//# sourceMappingURL=base.js.map