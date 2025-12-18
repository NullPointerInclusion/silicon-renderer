import type { Vector2, Vector3 } from "broadutils/types";
import type { RenderObject } from "./base.ts";
export type CachedImage = HTMLCanvasElement | HTMLImageElement;
export interface RenderObjectConfig {
    id: string;
    alpha: number;
    anchor: Vector2;
    height: number;
    position: Vector2 | Vector3 | Partial<Record<"x" | "y" | "z", number>>;
    rotation: number;
    scale: Vector2;
    width: number;
}
export interface RenderObjectData {
    id: string;
    alpha: number;
    anchor: Vector2;
    height: number;
    rotation: number;
    scale: Vector2;
    width: number;
    zIndex: number;
    listeners: Record<string, any>;
    cachedImage: CachedImage | null;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
}
export type RenderObjectPropertyUpdate = {
    prop: "alpha";
    previous: number;
    current: number;
} | {
    prop: "anchor";
    previous: Vector2;
    current: Vector2;
} | {
    prop: "height";
    previous: number;
    current: number;
} | {
    prop: "position";
    previous: Vector3;
    current: Vector3;
} | {
    prop: "rotation";
    previous: number;
    current: number;
} | {
    prop: "scale";
    previous: Vector2;
    current: Vector2;
} | {
    prop: "width";
    previous: number;
    current: number;
};
export interface RenderObjectEventMap<ObjectType = RenderObject> {
    relativematrixupdate: [target: ObjectType, [relativeMatrix: DOMMatrix, matrix: DOMMatrix]];
    matrixupdate: [target: ObjectType, matrix: DOMMatrix];
    propupdate: [target: ObjectType, update: RenderObjectPropertyUpdate];
    prerender: [target: ObjectType, context: CanvasRenderingContext2D];
    postrender: [target: ObjectType, context: CanvasRenderingContext2D];
}
//# sourceMappingURL=types.d.ts.map