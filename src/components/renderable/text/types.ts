import type { Vector2 } from "broadutils";
import type {
  RenderObjectConfig,
  RenderObjectData,
  RenderObjectEventMap,
  RenderObjectPropertyUpdate,
} from "../base/types.ts";
import type { Text } from "./text.ts";

export interface TextConfig extends RenderObjectConfig {
  content: string;
  fontFamily: string;
  fontSize: string | number;
  fontWeight: number | "light" | "normal" | "bold";
  padding: number | Vector2 | TextData["padding"];
}

export interface TextData extends RenderObjectData {
  content: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  padding: [number, number, number, number];
}

export type TextPropertyUpdate =
  | RenderObjectPropertyUpdate
  | { prop: "content"; previous: string; current: string }
  | { prop: "fontFamily"; previous: string; current: string }
  | { prop: "fontSize"; previous: string; current: string }
  | { prop: "fontWeight"; previous: number; current: number };

export type TextEventMap = Omit<RenderObjectEventMap<Text>, "propupdate"> & {
  propupdate: [target: Text, update: TextPropertyUpdate];
};
