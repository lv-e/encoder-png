"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexedToHex = void 0;
const using_octas = false;
function indexedToHex(indexed) {
    let bits = indexed
        .reverse()
        .map(c => c.toString(2).padStart(using_octas ? 5 : 8, '0'))
        .join("")
        .split("");
    let reduced = "{";
    do {
        const p = parseInt(bits.splice(-8).join(""), 2)
            .toString(16);
        reduced += `0x${p},`;
    } while (bits.length);
    reduced += "}";
    reduced = reduced.replace(",}", "}");
    return reduced;
}
exports.indexedToHex = indexedToHex;
