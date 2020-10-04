import { PNG } from "pngjs";
export declare function trueColorToIndexed(png: PNG, addingPadding?: boolean): {
    pixels: number[];
    colors: number[];
};
