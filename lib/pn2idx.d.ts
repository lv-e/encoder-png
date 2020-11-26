#!/usr/bin/env node
export declare function PNG2Indexed(file: string, completion: (data: null | {
    original: {
        size: number;
        png: string;
    };
    compressed: {
        size: number;
        png: string;
    };
}) => void): void;
