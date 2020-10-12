"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitInPlanes = exports.decodeLength = exports.encodeLength = exports.fileHeader = exports.bitPlane = exports.compressBitPlane = exports.bits2Int = exports.number2Bits = void 0;
function number2Bits(n, size = null) {
    let bits = n.toString(2).split("").map(b => b == "0" ? 0 : 1);
    if (size != null)
        while (bits.length < size)
            bits.unshift(0);
    return bits;
}
exports.number2Bits = number2Bits;
function bits2Int(bits) {
    return parseInt(bits.join(""), 2);
}
exports.bits2Int = bits2Int;
function compressBitPlane(bits) {
    let compressed = [bits[0]];
    let current = -1;
    let counter = 0;
    bits.forEach(bit => {
        if (bit == current) {
            counter += 1;
            return;
        }
        if (current != -1) {
            compressed = compressed.concat(encodeLength(counter));
            current = current == 0 ? 1 : 0;
        }
        else
            current = bits[0];
        counter = 1;
    });
    compressed = compressed.concat(encodeLength(counter));
    return compressed;
}
exports.compressBitPlane = compressBitPlane;
function bitPlane(bits) {
    /*
        00000 | encoded plane size in BYTES:
        00001 | > 000000000  => 9+1 bits long number
        10010 | > 1100101101 => 813 bytes long plane
            N | padding until close byte
        ...   | compressed bits + padding
            N | padding until close byte
    */
    let compressed = compressBitPlane(bits);
    let padding = compressed.length % 8;
    if (padding != 0)
        compressed = compressed.concat(Array(8 - padding).fill(0));
    let size = encodeLength(compressed.length / 8);
    padding = size.length % 8;
    if (padding != 0)
        size = size.concat(Array(8 - padding).fill(0));
    console.log(`l size: ${size.length}  c size: ${compressed.length}`);
    return size.concat(compressed);
}
exports.bitPlane = bitPlane;
function fileHeader(data) {
    /*
      sample | name        | values
     --------+-------------+-------------------------= 1 byte =---------------------
       01100 | sign        | always 01100
         011 | 1bpp planes | 000: don't use planes;
             |             | 001: 1p/2colors, 010: 2p/4colors;
             |             | 011: 3p/8colors, 100: 4p/16colors.
             |             | 101: 5p/32colors.
    ---------+-------------+------------------------= 1 byte =----------------------
          01 | version     | current value is 01
         001 | width       | 2 ^ (w+2) = 8px  (from 4px to 512px).
         010 | height      | 2 ^ (h+2) = 16px (from 4px to 512px).
             |             |
    ---------+-------------+------------------------= n colors * bytes =------------
     0000010 | color       | 2 * #planes color definitions as DB32 index number
    */
    if ((Math.log(data.width) / Math.log(2.0)) % 1 != 0)
        throw new Error("WRONG IMAGE WIDTH!");
    if ((Math.log(data.height) / Math.log(2.0)) % 1 != 0)
        throw new Error("WRONG IMAGE HEIGHT!");
    const widthExp = Math.ceil(Math.log(data.width) / Math.log(2.0)) - 2;
    const heightExp = Math.ceil(Math.log(data.height) / Math.log(2.0)) - 2;
    // ( 1 byte )
    let buffer = Array()
        .concat([0, 1, 1, 0, 0]);
    const colorCount = data.colors.length;
    if (colorCount <= 2)
        buffer = buffer.concat([0, 0, 1]);
    else if (colorCount <= 4)
        buffer = buffer.concat([0, 1, 0]);
    else if (colorCount <= 8)
        buffer = buffer.concat([0, 1, 1]);
    else if (colorCount <= 16)
        buffer = buffer.concat([1, 0, 0]);
    else if (colorCount <= 32)
        buffer = buffer.concat([1, 0, 1]);
    else
        throw new Error("MORE THAN 32 colors!");
    // ( 1 byte )
    buffer = buffer.concat([0, 1]) // version: 1
        .concat(number2Bits(widthExp, 3))
        .concat(number2Bits(heightExp, 3));
    // ( n bytes )
    let colorPadding = Math.pow(2, Math.ceil(Math.log(data.colors.length) / Math.log(2))) - data.colors.length;
    let colors = colorPadding > 0 ? data.colors.concat(Array(colorPadding).fill(0)) : data.colors;
    colors.forEach((c, i) => {
        console.log(i, c);
        buffer = buffer.concat(number2Bits(c, 8));
    });
    return buffer;
}
exports.fileHeader = fileHeader;
function encodeLength(l) {
    if (l == 1)
        return [1];
    let binary = number2Bits(l);
    let start = Array(binary.length - 1).fill(0);
    return start.concat(binary);
}
exports.encodeLength = encodeLength;
function decodeLength(data) {
    let cursor = 0;
    let buffer = [];
    if (data == [1])
        return 1;
    do {
        if (data[cursor] == 0)
            cursor++;
        else
            break;
    } while (true);
    for (let i = cursor; i < cursor * 2 + 1; i++) {
        const bit = data[i];
        buffer.push(bit);
    }
    return bits2Int(buffer);
}
exports.decodeLength = decodeLength;
function splitInPlanes(indexedBuffer, width, height, agressive = true, verbose = false) {
    let colors = [];
    indexedBuffer.forEach(c => {
        if (!colors.includes(c))
            colors.push(c);
    });
    let planes = Math.ceil(Math.log(colors.length) / Math.log(2.0));
    let bits = [];
    let bestScore = 999999;
    let cpuLimiter = 64;
    let maxLoops = agressive ? cpuLimiter : 1;
    let permutations = maxLoops > 1 ? perm(colors, maxLoops) : [colors];
    let choosenColors = colors;
    for (let p = 0; p < maxLoops && p < permutations.length; p++) {
        let attempt = [];
        const attemptColors = permutations[p];
        for (let plane = 0; plane < planes; plane++) {
            attempt[plane] = [];
        }
        for (let i = 0; i < width * height; i++) {
            let pixelColor = attemptColors.indexOf(indexedBuffer[i]);
            let binStream = number2Bits(pixelColor, planes);
            for (let plane = 0; plane < planes; plane++) {
                attempt[plane].push(binStream[plane]);
            }
        }
        let score = 0;
        if (agressive || verbose) {
            for (let plane = 0; plane < planes; plane++) {
                score += (compressBitPlane(attempt[plane]).length) / 8 / 1024;
            }
        }
        if (score < bestScore) {
            bestScore = score;
            bits = attempt;
            choosenColors = attemptColors;
        }
    }
    if (verbose) {
        let raw = (indexedBuffer.length * planes) / 8.0 / 1024.0;
        console.log(`\n⌈ colors: ${colors.length}`, `\n⎮ ratio: ${(bestScore / raw).toFixed(2)}`, `\n⎮ compressed: ${bestScore.toFixed(2)} Kbs`, `\n⌊ raw indexed: ${raw.toFixed(2)}Kbs`);
    }
    return { bits, choosenColors };
}
exports.splitInPlanes = splitInPlanes;
function perm(xs, limit) {
    let ret = [];
    for (let i = 0; i < limit && i < factorial(xs.length); i++) {
        let suffled = shuffle(xs);
        ret.push(suffled);
    }
    return ret;
}
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
function factorial(n) {
    let x = n;
    if (n == 0 || n == 1)
        return 1;
    while (n > 1) {
        n -= 1;
        x *= n;
    }
    return x;
}
