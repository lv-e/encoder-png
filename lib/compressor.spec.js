"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const pngjs_1 = require("pngjs");
const compressor_1 = require("./compressor");
const truecolor_to_indexed_1 = require("./truecolor-to-indexed");
test("length encoding and decoding", () => {
    let testCases = [1, 2, 3, 4, 5, 6, 7, 8, 64, 65, 1024, 35624];
    testCases.forEach(test => {
        const encoded = compressor_1.encodeLength(test);
        encoded.forEach(bit => { if (bit != 0 && bit != 1)
            fail(); });
        const decoded = compressor_1.decodeLength(encoded);
        expect(decoded).toBe(test);
    });
});
test("plane compresssion", () => {
    const data = `
        0000000000000000
        0000000000000000
        0000000000000000
        0000000000000000
        0001000111000100
        0001000000000100
        0001000000000100
        0000111111111000
        0000000000000000
        0000000000000000
    `.split("")
        .filter(b => b == "1" || b == "0")
        .map(b => parseInt(b) == 1 ? 1 : 0);
    let compressed = compressor_1.compressBitPlane(data);
    let ratio = compressed.length / data.length;
    console.log("compression rate: ", ratio);
    expect(ratio).toBeLessThan(1.0);
});
test("4 colors compression", () => {
    return testPNGCompression("test-files/four_colors.png", true);
});
test("6 colors compression", () => {
    return testPNGCompression("test-files/6_cor.png", false);
});
test("8 colors compression", () => {
    return testPNGCompression("test-files/8col.png", false);
});
function testPNGCompression(file, agressive = true) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(file)
            .pipe(new pngjs_1.PNG())
            .on("parsed", function () {
            const indexed = truecolor_to_indexed_1.trueColorToIndexed(this);
            const planes = compressor_1.splitInPlanes(indexed, this.width, this.height, agressive, true);
            let compressed = [];
            planes.forEach(p => compressed = compressed.concat(compressor_1.compressBitPlane(p)));
            const after = compressed.length;
            const before = (this.width * this.height * planes.length);
            expect(after).toBeLessThan(before);
            resolve();
        })
            .on("error", function () {
            reject();
        });
    });
}
