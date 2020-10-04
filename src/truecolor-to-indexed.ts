import { PNG } from "pngjs";
import { nearest } from "./nearest-color";

export function trueColorToIndexed(png:PNG, addingPadding:boolean = false) : { pixels: number[], colors: number[] } {

    let pixels:number[] = []
    let colors:number[] = []

    for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
            var idx = (png.width * y + x) << 2;

            const r = png.data[idx]
            const g = png.data[idx + 1]
            const b = png.data[idx + 2]
            
            const i = nearest(r,g,b).indexed
            if (!colors.includes(i)) colors.push(i)
            pixels.push(i)
        }
    }

    if(addingPadding) {
        const pad = pixels.length%8 // make 8n
        for (let i = 0; i < pad; i++) pixels.push(0)
    }
    
    return { pixels, colors}
}