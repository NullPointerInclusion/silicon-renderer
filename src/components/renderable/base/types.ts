import type { Vector2, Vector3 } from "broadutils/types";
import type { RenderObject } from "./base.ts";
import type { CanvasWithContext } from "../../shared.ts";

export type CachedImage = HTMLCanvasElement | HTMLImageElement;

export interface RenderObjectConfig {
  id: string;
  alpha: number;
  anchor: Vector2;
  dimensions: Vector2 | Record<"width" | "height", number>;
  position: Vector2 | Vector3 | Partial<Record<"x" | "y" | "z", number>>;
  rotation: number;
  scale: Vector2;
}

export interface RenderObjectData {
  id: string;
  listeners: Record<string, any>;

  alpha: number;
  anchor: Vector2;
  dimensions: Vector2;
  position: Vector3;
  rotation: number;
  scale: Vector2;

  cachedImage: CanvasWithContext;
  cacheDirty: boolean;
}

export type RenderObjectPropertyUpdate =
  | { prop: "alpha"; previous: number; current: number }
  | { prop: "anchor"; previous: Vector2; current: Vector2 }
  | { prop: "dimensions"; previous: Vector2; current: Vector2 }
  | { prop: "position"; previous: Vector3; current: Vector3 }
  | { prop: "rotation"; previous: number; current: number }
  | { prop: "scale"; previous: Vector2; current: Vector2 };

export interface RenderObjectEventMap<ObjectType = RenderObject> {
  relativematrixupdate: [target: ObjectType, [relativeMatrix: DOMMatrix, matrix: DOMMatrix]];
  matrixupdate: [target: ObjectType, matrix: DOMMatrix];
  propupdate: [target: ObjectType, update: RenderObjectPropertyUpdate];
  prerender: [target: ObjectType, context: CanvasRenderingContext2D];
  postrender: [target: ObjectType, context: CanvasRenderingContext2D];
}
