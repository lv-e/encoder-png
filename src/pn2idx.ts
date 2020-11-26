#!/usr/bin/env node
'use strict'

import Color from "color";
import * as fs from "fs";
import { PNG } from "pngjs";
import { bitsToHex } from "./bits-to-hex";
import { Bit, bitPlane, fileHeader, splitInPlanes } from "./compressor";
import { nearest } from "./nearest-color";
import { trueColorToIndexed } from "./truecolor-to-indexed";

export function PNG2Indexed(file:string, completion:(data:null | {size:number, png:string}) => void){

    if (file == undefined) {
        completion(null)
        return
    }

    let data = fs.readFileSync(file);
    let png = PNG.sync.read(data);
    let compressed:Bit[] = []
    
    // discover size
        
    const indexed = trueColorToIndexed(png)
    const planes  = splitInPlanes(indexed.pixels, png.width, png.height, false, false)
    
    compressed = compressed.concat( fileHeader({
        width: png.width,
        height: png.height,
        colors: planes.choosenColors
    }))

    planes.bits.forEach( plane => compressed = compressed.concat(bitPlane(plane)))
    const compressedSize = bitsToHex(compressed).length

    // generate png 64

    let comparisson = new PNG({
        width: png.width,
        height: png.height,
    })

    for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
            var idx = (png.width * y + x) << 2;

            const r = png.data[idx]
            const g = png.data[idx + 1]
            const b = png.data[idx + 2]
            
            const nrts = nearest(r,g,b)
            const rgb = Color(nrts.hex)

            comparisson.data[idx]       = rgb.red()
            comparisson.data[idx + 1]   = rgb.green()
            comparisson.data[idx + 2]   = rgb.blue()
            comparisson.data[idx + 3]   = 255
        }
    }

    let chunks:any[] = [];
    comparisson.pack();
    
    comparisson.on('data', chunk => chunks.push(chunk));
    
    comparisson.on('end', function() {
        let result = Buffer.concat(chunks);
        const png64 = result.toString('base64')
        completion( {size:compressedSize, png:png64})
    });

    comparisson.on("error", function(){
        completion(null)
    })
    
}