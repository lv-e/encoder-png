import { PNG } from "pngjs"

export type Bit = (0|1)

export function number2Bits(n:number) : Bit[] {
    return n.toString(2).split("").map( b => b == "0" ? 0 : 1)
}

export function bits2Int(bits:Bit[]) : number {
    return parseInt(bits.join(""), 2)
}

export function compressBitPlane(bits:Bit[]) : Bit[] {

    let compressed:Bit[] = [0]
    let current = 0
    let counter = 0

    bits.forEach( bit => {
        if(bit == current) {
            counter += 1
        } else {
            compressed = compressed.concat(encodeLength(counter))
            current = current == 0 ? 1 : 0
            counter = 0
        }
    })

    compressed = compressed.concat(encodeLength(counter))
    return compressed
}

export function header( indexed:number[], png:PNG) : Bit[] {
    
    /*
        sample | name        | values
        -------|-------------|--------------------------------------------------------
            0001 | width       | 2 ^ (w+1) = 4px (from 4px to 512px)
            0010 | height      | 2 ^ (h+1) = 8px
            01 | 1bpp planes | 00: don't use planes; 01: 1p/2colors, 10: 2p/4colors, 11: 3p/8colors
    */

    const widthExp  = Math.ceil(Math.log(png.width) / Math.log(2.0))
    const heightExp = Math.ceil(Math.log(png.width) / Math.log(2.0))

    const colourCount = indexed.filter((value:number, index:number, self:number[]) => {
        return self.indexOf(value) === index;
    }).length

    let buffer:Bit[] = 
        number2Bits(widthExp)
        .concat(number2Bits(heightExp))
 
    if (colourCount <= 2) buffer = buffer.concat([0,1])
    else if (colourCount <= 4) buffer = buffer.concat([1,0])
    else if (colourCount <= 8) buffer = buffer.concat([1,1])
    else buffer.concat([0])

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
                                verbose:boolean = false) : Bit[][] {
    
    let colors:number[] = []
    indexedBuffer.forEach( c => {
        if(!colors.includes(c)) colors.push(c)
    })
    
    if(verbose) console.log("colour count: ", colors.length)
    
    let planes = Math.ceil(Math.log(colors.length) / Math.log(2.0))
    let response:Bit[][] = []

    let bestScore       = 999999
    let permutations    = perm(colors)
    let cpuLimiter      = 1024
    let maxLoops        = Math.min(cpuLimiter, (agressive ? permutations.length : 1))
    
    for(let p = 0; p < maxLoops; p++) {

        let attempt:Bit[][] = [];
        const attemptColors = permutations[p]

        for (let plane = 0; plane < planes; plane++) {
            attempt[plane] = []
        }
    
        for (let i = 0; i < width * height; i++) {
            
            let pixelColor = attemptColors.indexOf(indexedBuffer[i]) 
            let binStream:Bit[] = pixelColor.toString(2).split("").map( e => parseInt(e) == 1 ? 1 : 0)
            
            const pad = binStream.length%planes
            for (let i = 0; i < pad; i++) binStream.push(0)
    
            for (let plane = 0; plane < planes; plane++) {
                attempt[plane].push(binStream[plane])
            }
        }

        let score = 0
        for (let plane = 0; plane < planes; plane++) {
            score += (compressBitPlane(attempt[plane]).length) / 8 / 1024
        }
        
        if (score < bestScore) {
            bestScore = score
            response = attempt
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

    return response
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