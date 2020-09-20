export declare type Bit = (0 | 1);
export declare function compressBitPlane(bits: Bit[]): Bit[];
export declare function encodeLength(l: number): Bit[];
export declare function decodeLength(data: Bit[]): number;
export declare function splitInPlanes(indexedBuffer: number[], width: number, height: number, agressive?: boolean, verbose?: boolean): Bit[][];
