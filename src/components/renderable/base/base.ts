import type { Vector2, Vector3 } from "broadutils/types";
import { getEmitter } from "../../shared.ts";
import { radiansToDegrees } from "../../utils.ts";
import type { CachedImage, RenderObjectConfig, RenderObjectData } from "./types.ts";
import { nonNullable } from "broadutils/validate";

const getDrawingTools = (): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } => {
  const canvas = document.createElement("canvas");
  const context = nonNullable(canvas.getContext("2d"));
  return { canvas, context };
};

const getRenderObjectId = (object: RenderObject): string => {
  const constructorName: string = Object.getPrototypeOf(object).constructor.name;
  const randomNumber = Math.floor(1e5 + Math.random() * (1e6 - 1e5));
  return `${constructorName}-${randomNumber}`;
};

class RenderObject {
  protected relativeMatrix: DOMMatrix = new DOMMatrix();
  protected matrix: DOMMatrix = new DOMMatrix();
  protected data: RenderObjectData = {
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

  constructor(config: Partial<RenderObjectConfig & { zIndex: number }> = {}) {
    this.assignROConfig(config);
  }

  private assignROConfig(config: Partial<RenderObjectConfig>): null {
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
      let x: number, y: number, z: number;

      if (Array.isArray(position)) [x, y, z] = [position[0], position[1], position[2] ?? 0];
      else [x, y, z] = [position.x ?? 0, position.y ?? 0, position.z ?? 0];

      matrix.e = x;
      matrix.f = y;
      this.data.zIndex = z;
    }

    return null;
  }

  protected getInternalData(): RenderObjectData {
    return this.data;
  }

  public updateRelativeMatrix(relativeMatrix: DOMMatrix): null {
    this.relativeMatrix = relativeMatrix;
    getEmitter(this).emit("relativematrixupdate", [this, [relativeMatrix, this.matrix]]);
    return null;
  }

  public alpha(value?: number): number {
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

  public anchor(value?: Vector2): Vector2 {
    const data = this.data;
    if (value != null) {
      const anchor: Vector2 = [...data.anchor];
      ((data.anchor[0] = value[0]), (data.anchor[1] = value[1]));
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "anchor", previous: anchor, current: [...data.anchor] },
      ]);
    }

    return data.anchor;
  }

  public height(value?: number): number {
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

  public position(value?: RenderObjectConfig["position"]): Vector3 {
    const { data, matrix } = this;

    if (value != null) {
      const position: Vector3 = [matrix.e, matrix.f, data.zIndex];
      if (Array.isArray(value)) {
        matrix.e = value[0];
        matrix.f = value[1];
        data.zIndex = value[2] ?? data.zIndex;
      } else {
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

  public rotation(value?: number) {
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

  public scale(value?: Vector2): Vector2 {
    const data = this.data;
    if (value != null) {
      const scale: Vector2 = [...data.scale];
      ((data.scale[0] = value[0]), (data.scale[1] = value[1]));
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "scale", previous: scale, current: [...data.scale] },
      ]);
    }

    return data.scale;
  }

  public width(value?: number): number {
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

  public move(dx: number, dy: number): null {
    const { data, matrix } = this;
    this.position([matrix.e + dx, matrix.f + dy, data.zIndex]);
    return null;
  }

  public moveTo(x: number, y: number): null {
    this.position([x, y, this.data.zIndex]);
    return null;
  }

  public rotate(deltaR: number): null {
    this.rotation(this.rotation() + deltaR);
    return null;
  }

  public rotateTo(angle: number): null {
    this.rotation(angle);
    return null;
  }

  public forward(dpos: number): null {
    const { data, matrix } = this;
    this.position([
      matrix.e + Math.cos(data.rotation) * dpos,
      matrix.f + Math.sin(data.rotation) * dpos,
      data.zIndex,
    ]);
    return null;
  }

  public backward(dpos: number): null {
    const { data, matrix } = this;
    this.position([
      matrix.e - Math.cos(data.rotation) * dpos,
      matrix.f - Math.sin(data.rotation) * dpos,
      data.zIndex,
    ]);
    return null;
  }

  protected renderToImage(): CachedImage {
    throw new Error("Method not implemented.");
  }

  public render(context: CanvasRenderingContext2D): null {
    throw new Error("Method not implemented.");
  }
}

export { RenderObject };
