"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trueColorToIndexed = void 0;
const nearest_color_1 = require("./nearest-color");
function trueColorToIndexed(png, addingPadding = false) {
    let pixels = [];
    let colors = [];
    for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
            var idx = (png.width * y + x) << 2;
            const r = png.data[idx];
            const g = png.data[idx + 1];
            const b = png.data[idx + 2];
            const i = nearest_color_1.nearest(r, g, b).indexed;
            if (!colors.includes(i))
                colors.push(i);
            pixels.push(i);
        }
    }
    if (addingPadding) {
        const pad = pixels.length % 8; // make 8n
        for (let i = 0; i < pad; i++)
            pixels.push(0);
    }
    return { pixels, colors };
}
exports.trueColorToIndexed = trueColorToIndexed;
