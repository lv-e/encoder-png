
export type Bit = (0|1)

export function number2Bits(n:number, size:(number|null) = null) : Bit[] {
    let bits = n.toString(2).split("").map( b => b == "0" ? 0 : 1)
    if (size != null) while(bits.length < size) bits.unshift(0)
    return bits
}

export function bits2Int(bits:Bit[]) : number {
    return parseInt(bits.join(""), 2)
}

export function compressBitPlane(bits:Bit[]) : Bit[] {

    let compressed:Bit[] = [bits[0]]
    let current = -1
    let counter = 0

    bits.forEach( bit => {
        
        if(bit == current) {
            counter += 1
            return
        }

        if(current != -1) {
            compressed = compressed.concat(encodeLength(counter))
            current = current == 0 ? 1 : 0
        } else current = bits[0]
        
        counter = 1
    })

    compressed = compressed.concat(encodeLength(counter))
    return compressed
}

export function bitPlane(bits:Bit[]) : Bit[] {

    /*
        00000 | encoded plane size in BYTES:
        00001 | > 000000000  => 9+1 bits long number
        10010 | > 1100101101 => 813 bytes long plane
            N | padding until close byte
        ...   | compressed bits + padding
            N | padding until close byte
    */

    let compressed = compressBitPlane(bits)
    let padding = compressed.length % 8
    if (padding != 0) compressed = compressed.concat(Array<Bit>(8 - padding).fill(0))

    let size = encodeLength(compressed.length / 8)
    padding = size.length % 8
    if (padding != 0) size = size.concat(Array<Bit>(8 - padding).fill(0))

    console.log(`l size: ${size.length}  c size: ${compressed.length}`)

    return size.concat(compressed)
}

export function fileHeader(data:{width:number, height:number, colors:number[]}) : Bit[] {
    
/*
  sample | name        | values
 --------+-------------+-------------------------= 1 byte =---------------------
   01100 | sign        | always 01100
     011 | 1bpp planes | 000: don't use planes;
         |             | 001: 1p/2colors, 010: 2p/4colors;
         |             | 011: 3p/8colors, 100: 4p/16colors.  
         |             | 
---------+-------------+------------------------= 1 byte =----------------------
      01 | version     | current value is 01
     001 | width       | 2 ^ (w+2) = 8px  (from 4px to 512px).
     010 | height      | 2 ^ (h+2) = 16px (from 4px to 512px).    
         |             | 
---------+-------------+------------------------= n colors * bytes =------------
 0000010 | color       | 2 * #planes color definitions as DB32 index number
*/

    if((Math.log(data.width) / Math.log(2.0))%1 != 0) throw new Error("WRONG IMAGE WIDTH!");
    if((Math.log(data.height) / Math.log(2.0))%1 != 0) throw new Error("WRONG IMAGE HEIGHT!");
    
    const widthExp  = Math.ceil(Math.log(data.width) / Math.log(2.0))   - 2
    const heightExp = Math.ceil(Math.log(data.height) / Math.log(2.0))  - 2

    // ( 1 byte )
    let buffer:Bit[] = Array<Bit>()
        .concat([0,1,1,0,0])

    const colorCount = data.colors.length
    if (colorCount      <= 2)  buffer = buffer.concat([0,0,1])
    else if (colorCount <= 4)  buffer = buffer.concat([0,1,0])
    else if (colorCount <= 8)  buffer = buffer.concat([0,1,1])
    else if (colorCount <= 16) buffer = buffer.concat([1,0,0])
    else buffer = buffer.concat([0, 0, 0])

    // ( 1 byte )
    buffer = buffer.concat([0,1]) // version: 1
        .concat(number2Bits(widthExp, 3))
        .concat(number2Bits(heightExp, 3))
    
    // ( n bytes )
    data.colors.forEach( c => 
        buffer = buffer.concat( number2Bits(c, 8) )
    )

    return buffer
}

export function encodeLength(l:number) : Bit[] {
    if ( l == 1) return [1];
    let binary = number2Bits(l)
    let start = Array<Bit>(binary.length - 1).fill(0)
    return start.concat(binary)
}

export function decodeLength(data:Bit[]) : number {
    
    let cursor = 0
    let buffer:Bit[] = []

    if (data == [1]) 
        return 1
    
    do {
        if (data[cursor] == 0) cursor++
        else break
    } while (true)

    for(let i = cursor; i < cursor*2 + 1; i++) {
        const bit = data[i]
        buffer.push(bit)
    }
    
    return bits2Int(buffer)
}

export function splitInPlanes(indexedBuffer:number[], 
                                width:number, height:number,
                                agressive:boolean = true,
                                verbose:boolean = false) {
    
    let colors:number[] = []
    indexedBuffer.forEach( c => {
        if(!colors.includes(c)) colors.push(c)
    })
    
    let planes = Math.ceil(Math.log(colors.length) / Math.log(2.0))
    let bits:Bit[][] = []

    let bestScore       = 999999
    let cpuLimiter      = 1024
    let maxLoops        = Math.min(cpuLimiter, (agressive ? factorial(colors.length) : 1))
    let permutations    = maxLoops > 1 ? perm(colors) : [colors]
    let choosenColors   = colors

    for(let p = 0; p < maxLoops; p++) {

        let attempt:Bit[][] = [];
        const attemptColors = permutations[p]

        for (let plane = 0; plane < planes; plane++) {
            attempt[plane] = []
        }
    
        for (let i = 0; i < width * height; i++) {
            
            let pixelColor = attemptColors.indexOf(indexedBuffer[i]) 
            let binStream:Bit[] = number2Bits(pixelColor, planes)
            
            for (let plane = 0; plane < planes; plane++) {
                attempt[plane].push(binStream[plane])
            }
        }

        let score = 0

        if(agressive || verbose) {
            for (let plane = 0; plane < planes; plane++) {
                score += (compressBitPlane(attempt[plane]).length) / 8 / 1024
            }
        }
        
        if (score < bestScore) {
            bestScore = score
            bits = attempt
            choosenColors = attemptColors
        }
    }

    if(verbose) {
        let raw = (indexedBuffer.length * planes) / 8.0 / 1024.0
        console.log(
            `\n⌈ colors: ${colors.length}`,
            `\n⎮ ratio: ${(bestScore/raw).toFixed(2)}`,
            `\n⎮ compressed: ${bestScore.toFixed(2)} Kbs`,
            `\n⌊ raw indexed: ${raw.toFixed(2)}Kbs`)
    }

    return {bits, choosenColors}
}


function perm(xs:Array<number>) {

    let ret:number[][] = [];
  
    for (let i = 0; i < xs.length; i = i + 1) {
      let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));
  
      if(!rest.length) {
        ret.push([xs[i]])
      } else {
        for(let j = 0; j < rest.length; j = j + 1) {
          ret.push([xs[i]].concat(rest[j]))
        }
      }
    }

    return ret;
}


function factorial(n:number) {

    let x = n;
    if (n == 0 || n == 1) return 1

    while (n > 1) { 
        n -= 1
        x *= n
    }

    return x
}