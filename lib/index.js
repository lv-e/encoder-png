#!/usr/bin/env node
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verbose = void 0;
const meow_1 = __importDefault(require("meow"));
const process_1 = require("process");
const testing = (process.env.NODE_ENV === 'test');
exports.verbose = testing ? true : false;
if (!testing) {
    let cli = meow_1.default(`
        Usage
        $ lv-encoder-png [verbose|help] -i <path-to-target-image> -o <path-to-copy-encoded-file>
    `, { flags: {
            input: { type: 'string', alias: 'i' },
            output: { type: 'string', alias: 'o' }
        } });
    if (cli.input[0] == "help") {
        cli.showHelp();
        process_1.exit();
    }
    else if (cli.input[0] == "verbose") {
        exports.verbose = true;
    }
    console.log("vida");
}
