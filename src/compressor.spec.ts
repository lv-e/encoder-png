import * as fs from "fs";
import { PNG } from "pngjs";
import { Bit, bitPlane, compressBitPlane, decodeLength, encodeLength, fileHeader, splitInPlanes } from "./compressor";
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
        0000111111111000
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

test("2 colors compression",  () =>{
    return testPNGCompression("test-files/asset_2.png", true)
})

test("4 colors compression",  () =>{
    // sample image from https://opengameart.org/users/grafxkid
    return testPNGCompression("test-files/grafxkid_4.png", false)
})

test("6 colors compression",  () =>{
    // sample image from https://opengameart.org/users/grafxkid
    return testPNGCompression("test-files/grafxkid_6.png", false)
})

test("8 colors compression",  () =>{
    // sample image from https://opengameart.org/users/grafxkid
    return testPNGCompression("test-files/grafxkid_8.png", false)
})

test("12 colors compression",  () =>{
    // sample image from https://opengameart.org/users/grafxkid
    return testPNGCompression("test-files/grafxkid_12.png", false)
})

function testPNGCompression(file:string, agressive:boolean = true) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(file)
            .pipe(new PNG())
            .on("parsed", function () {
                
                const indexed = trueColorToIndexed(this)
                const planes  = splitInPlanes(indexed.pixels, this.width, this.height, agressive, true)
                
                let compressed:number[] = []
                planes.bits.forEach( p => compressed = compressed.concat(compressBitPlane(p)))
                
                const after = compressed.length
                const before = (this.width * this.height * planes.bits.length)
                
                expect(after).toBeLessThan(before)
                resolve()
                
            })
            .on("error", function () {
                reject()
            })
    })
}

test("file header generation", () =>{

    function colors(count:number) : number[] {
        return Array<number>(count).fill(0).map((v_,i) => i)
    }

    let hdr2 = fileHeader({width:512, height:512, colors:colors(2)})
    
    expect(hdr2).toStrictEqual([ 

        0,1,1,0,0,      // sign
        0,0,1,          // planes

        0,1,            // version
        1,1,1, 1,1,1,   // w & h

        0,0,0,0,0,0,0,0, // color 0
        0,0,0,0,0,0,0,1, // color 1
    ])

    let hdr6 = fileHeader({width:256, height:128, colors:colors(6)})
    expect(hdr6).toStrictEqual([ 
        0,1,1,0,0,
        0,1,1, 

        0,1,
        1,1,0, 1,0,1,
        
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,1,
        0,0,0,0,0,0,1,0,
        0,0,0,0,0,0,1,1,
        0,0,0,0,0,1,0,0,
        0,0,0,0,0,1,0,1,
        0,0,0,0,0,0,0,0, // color padding
        0,0,0,0,0,0,0,0, // color padding
    ])

    let hdr16 = fileHeader({width:128, height:128, colors:colors(16)})
    expect(hdr16).toStrictEqual([ 
        0,1,1,0,0,
        1,0,0, 

        0,1,
        1,0,1, 1,0,1,
        
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,1,
        0,0,0,0,0,0,1,0,
        0,0,0,0,0,0,1,1,
        0,0,0,0,0,1,0,0,
        0,0,0,0,0,1,0,1,
        0,0,0,0,0,1,1,0,
        0,0,0,0,0,1,1,1,
        0,0,0,0,1,0,0,0,
        0,0,0,0,1,0,0,1,
        0,0,0,0,1,0,1,0,
        0,0,0,0,1,0,1,1,
        0,0,0,0,1,1,0,0,
        0,0,0,0,1,1,0,1,
        0,0,0,0,1,1,1,0,
        0,0,0,0,1,1,1,1,
    ])

    let hdr32 = fileHeader({width:8, height:512, colors:colors(32)})
    expect(hdr32.slice(0,16)).toStrictEqual([ 
        0,1,1,0,0,
        1,0,1,

        0,1,
        0,0,1, 1,1,1
    ])
})

test("plane header generation", () =>{

    function pump(bit:Bit, times:number) : Bit[] {
        return Array<Bit>(times).fill(bit)
    }

    let bits = Array<Bit>(1200).fill(1)

    const planeHeaderA = bitPlane(bits)
    
    expect(planeHeaderA).toStrictEqual([

        0, 1,1, // payload of 3 bytes
        0,0,0,0,0, // padding
        
        1, // start with: 1

        0,0,0, 0,0,0,0, 0,0,0, // 10 bits encoded size
        1,0,0, 1,0,1,1, 0,0,0,0, // RLE of 1200 1's
        
        0,0 // padding
    ])


    bits = pump(0, 600).concat(pump(1, 600))

    const planeHeaderB = bitPlane(bits)
    
    expect(planeHeaderB).toStrictEqual([

        0,0, 1,0,1, // payload of 5 bytes
        0,0,0, // padding
        
        0, // starts with 0

        0,0, 0,0,0,0, 0,0,0, // 9 bits encoded size
        1,0, 0,1,0,1, 1,0,0,0, // RLE of 600 1's

        0,0, 0,0,0,0, 0,0,0, // 9 bits encoded size
        1,0, 0,1,0,1, 1,0,0,0, // RLE of 600 1's
        
        0 // padding
    ])
})