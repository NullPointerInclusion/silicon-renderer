import { convertToDataUrl } from "broadutils/data";
import type { Vector2 } from "broadutils/types";
import { nonNullable } from "broadutils/validate";

type TextureSource =
  | string
  | ArrayBuffer
  | ArrayBufferView<ArrayBuffer>
  | Blob
  | ImageData
  | CanvasImageSource;

interface TextureData {
  image: HTMLImageElement;
  imageData: ImageData;
  pixelated: boolean;
}

interface TextureConfig {
  pixelated: boolean;
}

interface CheckerboardConfig {
  rows: number;
  columns?: number;
  cellSize: number;
  colours: [string, string?];
}

const isBlobPart = (value: unknown): value is BlobPart => {
  return (
    typeof value === "string" ||
    value instanceof Blob ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value)
  );
};

const checkerboard = (config: CheckerboardConfig): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const context = nonNullable(canvas.getContext("2d"));

  const { rows, columns = rows, cellSize, colours } = config;

  canvas.width = cellSize * columns;
  canvas.height = cellSize * rows;

  for (let count = 0; count < rows * columns; count++) {
    const row = Math.floor(count / columns);
    const column = count % columns;

    context.fillStyle =
      count % 2
        ? row % 2
          ? colours[0]
          : colours[1] || colours[0]
        : row % 2
          ? colours[1] || colours[0]
          : colours[0];
    context.fillRect(column * cellSize, row * cellSize, cellSize, cellSize);
  }

  return canvas;
};

class Texture {
  private static canvas = document.createElement("canvas");
  private static context = nonNullable(this.canvas.getContext("2d", { willReadFrequently: true }));

  public static BLANK = {} as Texture;
  public static WHITE = {} as Texture;
  public static BLACK = {} as Texture;
  public static RED = {} as Texture;
  public static GREEN = {} as Texture;
  public static BLUE = {} as Texture;
  public static YELLOW = {} as Texture;
  public static MAGENTA = {} as Texture;
  public static CYAN = {} as Texture;
  public static getImageData(image: HTMLImageElement): ImageData {
    const { canvas, context } = this;

    canvas.width = image.width;
    canvas.height = image.height;

    context.imageSmoothingEnabled = false;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return context.getImageData(0, 0, canvas.width, canvas.height);
  }

  protected internalData: TextureData;
  public constructor(image: HTMLImageElement, config: Partial<TextureConfig> = {}) {
    this.internalData = {
      image,
      imageData: Texture.getImageData(image),
      pixelated: config.pixelated ?? false,
    };
  }

  public dimensions(): Vector2 {
    const image = this.image();
    return [image.width, image.height];
  }

  public image(): HTMLImageElement {
    return this.internalData.image;
  }

  public imageData(): ImageData {
    const imageData = this.internalData.imageData;
    return new ImageData(imageData.data, imageData.width, imageData.height, {
      colorSpace: imageData.colorSpace,
    });
  }

  public pixelated(): boolean {
    return this.internalData.pixelated;
  }

  public static async from(
    source: TextureSource,
    config: Partial<TextureConfig> = {},
  ): Promise<Texture> {
    const canvas = document.createElement("canvas");
    const context = nonNullable(canvas.getContext("2d"));
    const image = document.createElement("img");

    if (typeof source === "string") image.src = source;
    else if (isBlobPart(source)) image.src = await convertToDataUrl(source);
    else if (source instanceof ImageData) {
      canvas.width = source.width;
      canvas.height = source.height;
      context.putImageData(source, 0, 0);
      image.src = canvas.toDataURL("image/webp", 1);
      await image.decode();
      return new Texture(image, config);
    } else {
      let width = 0;
      let height = 0;

      if (source instanceof SVGImageElement) {
        const widthUnit = source.width.baseVal.unitType;
        const heightUnit = source.height.baseVal.unitType;

        source.width.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        source.height.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);

        width = source.width.baseVal.valueInSpecifiedUnits;
        height = source.height.baseVal.valueInSpecifiedUnits;

        source.width.baseVal.convertToSpecifiedUnits(widthUnit);
        source.height.baseVal.convertToSpecifiedUnits(heightUnit);
      } else if (source instanceof VideoFrame) {
        width = source.displayWidth;
        height = source.displayHeight;
      } else {
        width = source.width;
        height = source.height;
      }

      canvas.width = width;
      canvas.height = height;
      context.imageSmoothingEnabled = false;
      context.drawImage(source, 0, 0, width, height);
      image.src = canvas.toDataURL("image/webp", 1);
    }

    await image.decode();
    return new Texture(image, config);
  }
}

const configPixelated: TextureConfig = { pixelated: true };
await Promise.all([
  Texture.from(checkerboard({ rows: 8, cellSize: 64, colours: ["#639", "#000"] }), configPixelated),
  Texture.from(checkerboard({ rows: 1, cellSize: 512, colours: ["#fff"] }), configPixelated),
  Texture.from(checkerboard({ rows: 1, cellSize: 512, colours: ["#000"] }), configPixelated),
  Texture.from(checkerboard({ rows: 1, cellSize: 512, colours: ["#f00"] }), configPixelated),
  Texture.from(checkerboard({ rows: 1, cellSize: 512, colours: ["#008000"] }), configPixelated),
  Texture.from(checkerboard({ rows: 1, cellSize: 512, colours: ["#00f"] }), configPixelated),
  Texture.from(checkerboard({ rows: 1, cellSize: 512, colours: ["#ff0"] }), configPixelated),
  Texture.from(checkerboard({ rows: 1, cellSize: 512, colours: ["#f0f"] }), configPixelated),
  Texture.from(checkerboard({ rows: 1, cellSize: 512, colours: ["#0ff"] }), configPixelated),
]).then((textures) => {
  Texture.BLANK = textures[0];
  Texture.WHITE = textures[1];
  Texture.BLACK = textures[2];
  Texture.RED = textures[3];
  Texture.GREEN = textures[4];
  Texture.BLUE = textures[5];
  Texture.YELLOW = textures[6];
  Texture.MAGENTA = textures[7];
  Texture.CYAN = textures[8];
});

export { Texture };
export type { TextureSource };
