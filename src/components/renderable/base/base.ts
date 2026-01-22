import type { Vector2, Vector3 } from "broadutils/types";
import { getCanvasWithContext, getEmitter, type CanvasWithContext } from "../../shared.ts";
import { radiansToDegrees } from "../../utils.ts";
import type { RenderObjectConfig, RenderObjectData } from "./types.ts";

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
    listeners: {},

    alpha: 1,
    anchor: [0, 0],
    dimensions: [0, 0],
    position: [0, 0, 0],
    rotation: 0,
    scale: [1, 1],

    cachedImage: getCanvasWithContext(),
    cacheDirty: true,
  };

  constructor(config: Partial<RenderObjectConfig> = {}) {
    this.assignROConfig(config);
  }

  private assignROConfig(config: Partial<RenderObjectConfig>): null {
    const { data, matrix } = this;
    data.id = config.id ?? getRenderObjectId(this);

    data.alpha = config.alpha ?? data.alpha;
    data.anchor = config.anchor ?? data.anchor;
    data.rotation = config.rotation ?? data.rotation;
    data.scale = config.scale ?? data.scale;

    if (config.dimensions) {
      const dimensions = config.dimensions;
      let width: number, height: number;

      if (Array.isArray(dimensions)) [width, height] = [dimensions[0], dimensions[1]];
      else [width, height] = [dimensions.width ?? 0, dimensions.height ?? 0];

      data.dimensions[0] = width;
      data.dimensions[1] = height;
    }

    if (config.position) {
      const position = config.position;
      let x: number, y: number, z: number;

      if (Array.isArray(position)) [x, y, z] = [position[0], position[1], position[2] ?? 0];
      else [x, y, z] = [position.x ?? 0, position.y ?? 0, position.z ?? 0];

      data.position[0] = matrix.e = x;
      data.position[1] = matrix.f = y;
      data.position[2] = z;
    }

    return null;
  }

  protected getInternalData(): RenderObjectData {
    return this.data;
  }

  protected markCacheClean(): null {
    this.data.cacheDirty = false;
    return null;
  }

  public markCacheDirty(): null {
    this.data.cacheDirty = true;
    return null;
  }

  public updateRelativeMatrix(relativeMatrix: DOMMatrix): null {
    this.relativeMatrix = relativeMatrix;
    getEmitter(this).emit("relativematrixupdate", [this, [relativeMatrix, this.matrix]]);
    return null;
  }

  public alpha(value?: number): number {
    const data = this.data;
    const alpha = data.alpha;
    data.alpha = value ?? alpha;

    value != null &&
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "alpha", previous: alpha, current: value },
      ]);

    return data.alpha;
  }

  public anchor(value: Vector2 = this.data.anchor): Vector2 {
    const data = this.data;
    const anchor: Vector2 = [...data.anchor];
    const changed = anchor[0] !== value[0] || anchor[1] !== value[1];

    if (changed) {
      data.anchor[0] = value[0];
      data.anchor[1] = value[1];
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "anchor", previous: anchor, current: [...data.anchor] },
      ]);
    }

    return [...data.anchor];
  }

  public dimensions(value: Vector2 = this.data.dimensions): Vector2 {
    const data = this.data;
    const dimensions: Vector2 = [...data.dimensions];
    const changed = dimensions[0] !== value[0] || dimensions[1] !== value[1];

    if (changed) {
      data.dimensions[0] = value[0];
      data.dimensions[1] = value[1];
      this.markCacheDirty();
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "dimensions", previous: dimensions, current: [...data.dimensions] },
      ]);
    }

    return [...data.dimensions];
  }

  public height(value?: number): number {
    if (value == null) return this.data.dimensions[1];
    return this.dimensions([this.data.dimensions[0], value])[1];
  }

  public position(value?: RenderObjectConfig["position"]): Vector3 {
    const { data, matrix } = this;
    const position: Vector3 = data.position;

    if (value != null) {
      const prevPosition: Vector3 = [...position];
      if (Array.isArray(value)) {
        position[0] = matrix.e = value[0];
        position[1] = matrix.f = value[1];
        position[2] = value[2] ?? position[2];
      } else {
        position[0] = matrix.e = value.x ?? matrix.e;
        position[1] = matrix.f = value.y ?? matrix.f;
        position[2] = value.z ?? position[2];
      }

      getEmitter(this).emit("matrixupdate", [this, this.matrix]);
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "position", previous: prevPosition, current: [...position] },
      ]);
    }

    return [...position];
  }

  public rotation(value?: number) {
    const { data, matrix } = this;
    const rotation = data.rotation;

    data.rotation = value ?? rotation;
    data.rotation %= Math.PI * 2;

    const diff = data.rotation - rotation;
    if (diff) {
      matrix.rotateSelf(radiansToDegrees(diff));
      getEmitter(this).emit("matrixupdate", [this, this.matrix]);
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "rotation", previous: rotation, current: data.rotation },
      ]);
    }

    return data.rotation;
  }

  public scale(value: Vector2 = this.data.scale): Vector2 {
    const data = this.data;
    const scale: Vector2 = [...data.scale];
    const changed = scale[0] !== value[0] || scale[1] !== value[1];

    if (changed) {
      data.scale[0] = value[0];
      data.scale[1] = value[1];
      getEmitter(this).emit("propupdate", [
        this,
        { prop: "scale", previous: scale, current: [...data.scale] },
      ]);
    }

    return [...data.scale];
  }

  public width(value?: number): number {
    if (value == null) return this.data.dimensions[0];
    return this.dimensions([value, this.data.dimensions[1]])[0];
  }

  public move(dx: number, dy: number): null {
    const matrix = this.matrix;
    this.position([matrix.e + dx, matrix.f + dy]);
    return null;
  }

  public moveTo(x: number, y: number): null {
    this.position([x, y]);
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
    ]);
    return null;
  }

  public backward(dpos: number): null {
    const { data, matrix } = this;
    this.position([
      matrix.e - Math.cos(data.rotation) * dpos,
      matrix.f - Math.sin(data.rotation) * dpos,
    ]);
    return null;
  }

  protected renderToImage(): CanvasWithContext {
    throw new Error("Method not implemented.");
  }

  protected updateCachedImage(): null {
    throw new Error("Method not implemented.");
  }

  public render(context: CanvasRenderingContext2D): null {
    throw new Error("Method not implemented.");
  }
}

export { RenderObject };
