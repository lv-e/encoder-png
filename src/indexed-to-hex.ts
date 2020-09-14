

export function indexedToHex(indexed:number[]) : string {

    let bytes = indexed
        .reverse()
        .map( c => c.toString(2).padStart(5, '0') )
        .join("")
        .split("")

    let reduced = "{"

    do {
        const p = parseInt(bytes.splice(-8).join(""),2)
                    .toString(16)
        reduced += `0x${p},`
    } while (bytes.length);
    
    reduced += "}"
    reduced = reduced.replace(",}", "}")

    return reduced
}