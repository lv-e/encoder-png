#!/usr/bin/env node
'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PNG2Indexed = void 0;
const color_1 = __importDefault(require("color"));
const fs = __importStar(require("fs"));
const pngjs_1 = require("pngjs");
const bits_to_hex_1 = require("./bits-to-hex");
const compressor_1 = require("./compressor");
const nearest_color_1 = require("./nearest-color");
const truecolor_to_indexed_1 = require("./truecolor-to-indexed");
function PNG2Indexed(file, completion) {
    if (file == undefined) {
        completion(null);
        return;
    }
    fs.createReadStream(file)
        .pipe(new pngjs_1.PNG())
        .on("parsed", function () {
        let compressed = [];
        let png = this;
        const indexed = truecolor_to_indexed_1.trueColorToIndexed(png);
        const planes = compressor_1.splitInPlanes(indexed.pixels, png.width, png.height, false, false);
        compressed = compressed.concat(compressor_1.fileHeader({
            width: png.width,
            height: png.height,
            colors: planes.choosenColors
        }));
        planes.bits.forEach(plane => compressed = compressed.concat(compressor_1.bitPlane(plane)));
        const file = bits_to_hex_1.bitsToHex(compressed);
        const size = file.length;
        // generate png 64
        let comparisson = new pngjs_1.PNG({
            width: png.width,
            height: png.height,
        });
        for (var y = 0; y < png.height; y++) {
            for (var x = 0; x < png.width; x++) {
                var idx = (png.width * y + x) << 2;
                const r = png.data[idx];
                const g = png.data[idx + 1];
                const b = png.data[idx + 2];
                const nrts = nearest_color_1.nearest(r, g, b);
                const rgb = color_1.default(nrts.hex);
                comparisson.data[idx] = rgb.red();
                comparisson.data[idx + 1] = rgb.green();
                comparisson.data[idx + 2] = rgb.blue();
                comparisson.data[idx + 3] = 255;
            }
        }
        let chunks = [];
        comparisson.pack();
        comparisson.on('data', chunk => chunks.push(chunk));
        comparisson.on('end', function () {
            let result = Buffer.concat(chunks);
            const png64 = result.toString('base64');
            completion({ size, png: png64 });
        });
        comparisson.on("error", function () {
            completion(null);
        });
    })
        .on("error", function () {
        completion(null);
    });
}
exports.PNG2Indexed = PNG2Indexed;
