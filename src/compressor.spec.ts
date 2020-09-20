import * as fs from "fs";
import { PNG } from "pngjs";
import { Bit, compressBitPlane, decodeLength, encodeLength, splitInPlanes } from "./compressor";
import { trueColorToIndexed } from "./truecolor-to-indexed";

test("length encoding and decoding",  () =>{
    
    let testCases:number[] = [1,2,3,4,5,6,7,8,64,65,1024,35624]
    testCases.forEach( test => {
        const encoded = encodeLength(test)
        encoded.forEach( bit => { if (bit != 0 && bit != 1) fail()} )
        const decoded = decodeLength(encoded)
        expect(decoded).toBe(test)
    })
    
})

test("plane compresssion",  () =>{

    const data:Bit[] = `
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
     .filter( b => b == "1" || b == "0" )
     .map( b => parseInt(b) == 1 ? 1 : 0)

    let compressed = compressBitPlane(data)
    let ratio = compressed.length / data.length
    console.log("compression rate: ", ratio)
    expect(ratio).toBeLessThan(1.0)
})

test("4 colors compression",  () =>{
    return testPNGCompression("test-files/four_colors.png", true)
})

test("6 colors compression",  () =>{
    return testPNGCompression("test-files/6_cor.png", false)
})

test("8 colors compression",  () =>{
    return testPNGCompression("test-files/8col.png", false)
})

function testPNGCompression(file:string, agressive:boolean = true) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(file)
            .pipe(new PNG())
            .on("parsed", function () {
                
                const indexed = trueColorToIndexed(this)
                const planes  = splitInPlanes(indexed, this.width, this.height, agressive, true)
                
                let compressed:number[] = []
                planes.forEach( p => compressed = compressed.concat(compressBitPlane(p)))
                
                const after = compressed.length
                const before = (this.width * this.height * planes.length)
                
                expect(after).toBeLessThan(before)
                resolve()
                
            })
            .on("error", function () {
                reject()
            })
    })
}