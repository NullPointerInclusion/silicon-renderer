type TextureSource = string | ArrayBuffer | ArrayBufferView<ArrayBuffer> | Blob | CanvasImageSource;
interface TextureConfig {
    pixelated: boolean;
}
declare class Texture {
    private static canvas;
    private static context;
    static BLANK: Texture;
    static WHITE: Texture;
    static BLACK: Texture;
    static RED: Texture;
    static GREEN: Texture;
    static BLUE: Texture;
    static YELLOW: Texture;
    static MAGENTA: Texture;
    static CYAN: Texture;
    static getImageData(image: HTMLImageElement): ImageData;
    image: HTMLImageElement;
    data: ImageData;
    pixelated: boolean;
    constructor(image: HTMLImageElement, config?: Partial<TextureConfig>);
    get width(): number;
    get height(): number;
    static from(source: TextureSource, config?: Partial<TextureConfig>): Promise<Texture>;
}
export { Texture };
export type { TextureSource };
//# sourceMappingURL=texture.d.ts.map