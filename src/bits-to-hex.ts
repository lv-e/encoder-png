import { Bit } from "./compressor";

export function bitsToHex(bits:Bit[]) : string {

    let reduced = "{"

    do {
        const p = parseInt(bits.splice(0, 8).join(""),2)
                    .toString(16)
        reduced += `0x${p},`
    } while (bits.length);

    reduced += "}"
    reduced = reduced.replace(",}", "}")

    return reduced
}