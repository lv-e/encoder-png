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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verbose = void 0;
const color_1 = __importDefault(require("color"));
const fs = __importStar(require("fs"));
const meow_1 = __importDefault(require("meow"));
const pngjs_1 = require("pngjs");
const process_1 = require("process");
const testing = (process.env.NODE_ENV === 'test');
exports.verbose = testing ? true : false;
if (!testing) {
    let cli = meow_1.default(`
        Usage
        $ lv-encoder-png [verbose|help] -i <path-to-target-image> -o <path-to-copy-encoded-file>
    `, { flags: {
            input: { type: 'string', alias: 'i' },
            output: { type: 'string', alias: 'o' }
        } });
    if (cli.input[0] == "help") {
        cli.showHelp();
        process_1.exit();
    }
    else if (cli.input[0] == "verbose") {
        exports.verbose = true;
    }
    fs.createReadStream(cli.flags.input)
        .pipe(new pngjs_1.PNG())
        .on("parsed", function () {
        let indexed = [];
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;
                const r = this.data[idx];
                const g = this.data[idx + 1];
                const b = this.data[idx + 2];
                indexed.push(nearest(r, g, b));
            }
        }
        const pad = indexed.length % 40;
        for (let i = 0; i < pad; i++)
            indexed.push(0);
        let bytes = indexed
            .reverse()
            .map(c => c.toString(2).padStart(5, '0'))
            .join("")
            .split("");
        let reduced = "static unsigned char bytes[] = { ";
        do {
            const p = parseInt(bytes.splice(-8).join(""), 2).toString(16);
            reduced += `0x${p}, `;
        } while (bytes.length);
        reduced += "};";
        console.log(reduced);
    });
}
function nearest(r, g, b) {
    if (r == 0 && g == 0 && b == 0)
        return 0;
    const db32 = [
        { r: 0, g: 0, b: 0 },
        { r: 34, g: 32, b: 52 },
        { r: 69, g: 40, b: 60 },
        { r: 102, g: 57, b: 49 },
        { r: 143, g: 86, b: 59 },
        { r: 223, g: 113, b: 38 },
        { r: 217, g: 160, b: 102 },
        { r: 238, g: 195, b: 154 },
        { r: 251, g: 242, b: 54 },
        { r: 153, g: 229, b: 80 },
        { r: 55, g: 148, b: 110 },
        { r: 75, g: 105, b: 47 },
        { r: 82, g: 75, b: 36 },
        { r: 50, g: 60, b: 57 },
        { r: 63, g: 63, b: 116 },
        { r: 48, g: 96, b: 130 },
        { r: 91, g: 110, b: 225 },
        { r: 99, g: 155, b: 255 },
        { r: 95, g: 205, b: 228 },
        { r: 203, g: 219, b: 252 },
        { r: 255, g: 255, b: 255 },
        { r: 155, g: 173, b: 183 },
        { r: 132, g: 126, b: 135 },
        { r: 105, g: 106, b: 106 },
        { r: 89, g: 86, b: 82 },
        { r: 118, g: 66, b: 138 },
        { r: 172, g: 50, b: 50 },
        { r: 217, g: 87, b: 99 },
        { r: 215, g: 123, b: 186 },
        { r: 143, g: 151, b: 74 },
        { r: 138, g: 111, b: 48 }
    ];
    let minDistance = 9999;
    let selectedColor = 0;
    let color = color_1.default({ r: r, g: g, b: b });
    for (let i = 1; i < db32.length; i++) {
        const indexed = db32[i];
        const iColor = color_1.default({ r: indexed.r, g: indexed.g, b: indexed.b });
        const distance = Math.sqrt((color.hue() * 1.5 - iColor.hue() * 1.5) ^ 2.0
            + (color.lightness() - iColor.lightness()) ^ 2.0
            + (color.saturationv() - iColor.saturationv()) ^ 2.0);
        //const distance = Math.sqrt( (indexedHue - hue) ^ 2.0 )
        if (distance < minDistance) {
            minDistance = distance;
            selectedColor = i;
        }
    }
    return selectedColor;
}
