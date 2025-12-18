import { nonNullable } from "broadutils/validate";
const checkerboard = (config) => {
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
    static canvas = document.createElement("canvas");
    static context = nonNullable(this.canvas.getContext("2d", { willReadFrequently: true }));
    static BLANK = {};
    static WHITE = {};
    static BLACK = {};
    static RED = {};
    static GREEN = {};
    static BLUE = {};
    static YELLOW = {};
    static MAGENTA = {};
    static CYAN = {};
    static getImageData(image) {
        const { canvas, context } = this;
        canvas.width = image.width;
        canvas.height = image.height;
        context.imageSmoothingEnabled = false;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        return context.getImageData(0, 0, canvas.width, canvas.height);
    }
    image;
    data;
    pixelated;
    constructor(image, config = {}) {
        this.image = image;
        this.data = Texture.getImageData(image);
        this.pixelated = config.pixelated ?? false;
    }
    get width() {
        return this.image.width;
    }
    get height() {
        return this.image.height;
    }
    static async from(source, config = {}) {
        const canvas = document.createElement("canvas");
        const context = nonNullable(canvas.getContext("2d"));
        const image = document.createElement("img");
        if (typeof source === "string")
            image.src = source;
        else if (source instanceof ArrayBuffer ||
            ArrayBuffer.isView(source) ||
            source instanceof Blob) {
            image.src = URL.createObjectURL(new Blob([source]));
            await image.decode(); // decode the image immediately so that we can revoke the url
            URL.revokeObjectURL(image.src);
        }
        else {
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
            }
            else if (source instanceof VideoFrame) {
                width = source.displayWidth;
                height = source.displayHeight;
            }
            else {
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
const configPixelated = { pixelated: true };
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
//# sourceMappingURL=texture.js.map