"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitsToHex = void 0;
function bitsToHex(bits) {
    let reduced = "{";
    do {
        const p = parseInt(bits.splice(0, 8).join(""), 2)
            .toString(16);
        reduced += `0x${p},`;
    } while (bits.length);
    reduced += "}";
    reduced = reduced.replace(",}", "}");
    return reduced;
}
exports.bitsToHex = bitsToHex;
