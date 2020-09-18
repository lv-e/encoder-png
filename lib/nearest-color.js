"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearest = void 0;
const color_1 = __importDefault(require("color"));
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
        { r: 254, g: 254, b: 254 },
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
        const distance = Math.sqrt(((color.x() - iColor.x()) ^ 2.0)
            + ((color.y() - iColor.y()) ^ 2.0)
            + ((color.z() - iColor.z()) ^ 2.0));
        if (distance < minDistance) {
            minDistance = distance;
            selectedColor = i;
        }
    }
    return selectedColor;
}
exports.nearest = nearest;
