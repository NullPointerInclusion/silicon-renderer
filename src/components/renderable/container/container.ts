import { resize } from "broadutils/canvas";
import { nonNullable } from "broadutils/validate";
import { getEmitter, zSort, type CanvasWithContext } from "../../shared.ts";
import { RenderObject } from "../base/base.ts";
import type { ContainerConfig, ContainerData } from "./types.ts";
import type { Vector2 } from "broadutils/types";

class Container extends RenderObject {
  protected override data: ContainerData = Object.assign(super.getInternalData(), {
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
      onchildupdate: (_: RenderObject, { prop }: { prop: string }) => {
        this.markCacheDirty();
        if (prop === "position") this.data.shouldSortChildren = true;
        return null;
      },
    },
  });

  public constructor(config: Partial<ContainerConfig> = {}) {
    super(config);

    const emitter = getEmitter(this);
    const listeners = this.data.listeners;

    emitter.addListener("relativematrixupdate", nonNullable(listeners.onmatrixupdate));
    emitter.addListener("matrixupdate", nonNullable(listeners.onmatrixupdate));

    this.assignContainerConfig(config);
  }

  private assignContainerConfig(config: Partial<ContainerConfig>): null {
    this.data.children = config.children ?? this.data.children;
    return null;
  }

  protected override getInternalData(): ContainerData {
    return this.data;
  }

  public add(...objects: RenderObject[]): null {
    const { data } = this;
    for (const obj of objects) {
      data.children.push(obj);
      getEmitter(obj).addListener("propupdate", data.listeners.onchildupdate);
    }

    data.shouldSortChildren = !!objects.length;
    return null;
  }

  public remove(...objects: RenderObject[]): null {
    const { data } = this;

    const objectSet = new Set(objects);
    const objectsToKeep: RenderObject[] = [];
    const objectsToRemove: RenderObject[] = [];

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

  protected override updateCachedImage(): null {
    const {
      cachedImage,
      cachedImage: { context },
      children,
      dimensions,
      scale,
      shouldSortChildren,
    } = this.data;

    const sDim: Vector2 = [dimensions[0] * scale[0], dimensions[1] * scale[1]];

    context.reset();
    context.scale(scale[0], scale[1]);
    resize(cachedImage, sDim);

    shouldSortChildren && (this.data.shouldSortChildren = !children.sort(zSort));
    for (let i = 0; i < children.length; ++i) {
      context.save();
      children[i]?.render(context);
      context.restore();
    }

    this.markCacheClean();
    return null;
  }

  public override render(context: CanvasRenderingContext2D): null {
    const emitter = getEmitter(this);
    emitter.emit("prerender", [this, context]);

    const { matrix, relativeMatrix } = this;
    const {
      alpha,
      anchor,
      cacheDirty,
      cachedImage,
      dimensions: [width, height],
    } = this.data;

    cacheDirty && this.updateCachedImage();

    const localMatrix = matrix;
    localMatrix.e += anchor[0] * width;
    localMatrix.f += anchor[1] * height;

    context.globalAlpha *= alpha;
    context.setTransform(relativeMatrix.multiply(localMatrix));
    context.drawImage(cachedImage, -(anchor[0] * width), -(anchor[1] * height));

    localMatrix.e -= anchor[0] * width;
    localMatrix.f -= anchor[1] * height;

    emitter.emit("postrender", [this, context]);
    return null;
  }
}

export { Container };
