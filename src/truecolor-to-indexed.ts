import { PNG } from "pngjs";
import { nearest } from "./nearest-color";

export function trueColorToIndexed(png:PNG) : number[] {

    let indexed:number[] = []
    
    for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
            var idx = (png.width * y + x) << 2;

            const r = png.data[idx]
            const g = png.data[idx + 1]
            const b = png.data[idx + 2]
            
            const nrts = nearest(r,g,b)
            indexed.push(nrts.indexed)
        }
    }

    const pad = indexed.length%8 // make 8n
    for (let i = 0; i < pad; i++) indexed.push(0)
    
    return indexed
}