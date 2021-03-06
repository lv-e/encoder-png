#!/usr/bin/env node
'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFile = exports.verbose = void 0;
const color_1 = __importDefault(require("color"));
const fs = __importStar(require("fs"));
const meow_1 = __importDefault(require("meow"));
const pngjs_1 = require("pngjs");
const process_1 = require("process");
const bits_to_hex_1 = require("./bits-to-hex");
const compressor_1 = require("./compressor");
const decoder_template_1 = require("./decoder-template");
const indexed_to_hex_1 = require("./indexed-to-hex");
const nearest_color_1 = require("./nearest-color");
const slug_1 = require("./slug");
const truecolor_to_indexed_1 = require("./truecolor-to-indexed");
const path = require("path");
let slugify = require('slugify');
const testing = (process.env.NODE_ENV === 'test');
exports.verbose = testing ? true : false;
if (!testing) {
    let cli = meow_1.default(`
        Usage
        $ lv-encoder-png [verbose|help] -i <path-to-target-image> -o <path-to-copy-encoded-file>
    `, { flags: {
            input: { type: 'string', alias: 'i' },
            output: { type: 'string', alias: 'o' },
            compress: { type: 'boolean', alias: 'c' },
            agressive: { type: 'boolean', alias: 'a' }
        } });
    if (cli.input[0] == "help") {
        cli.showHelp();
        process_1.exit();
    }
    else if (cli.input[0] == "verbose") {
        exports.verbose = true;
    }
    fs.createReadStream(cli.flags.input)
        .pipe(new pngjs_1.PNG())
        .on("parsed", function () {
        let declarations;
        let on_enter = "";
        let on_exit = "";
        if (cli.flags.compress) {
            let compressed = [];
            const indexed = truecolor_to_indexed_1.trueColorToIndexed(this);
            const planes = compressor_1.splitInPlanes(indexed.pixels, this.width, this.height, cli.flags.agressive, exports.verbose);
            compressed = compressed.concat(compressor_1.fileHeader({
                width: this.width,
                height: this.height,
                colors: planes.choosenColors
            }));
            planes.bits.forEach(plane => compressed = compressed.concat(compressor_1.bitPlane(plane)));
            const varName = slug_1.slug(cli.flags.input);
            declarations = decoder_template_1.decoder_template_declarations;
            declarations = decoder_template_1.replaceAll(declarations, "{{filename}}", varName);
            declarations = decoder_template_1.replaceAll(declarations, "{{hex}}", bits_to_hex_1.bitsToHex(compressed));
            on_enter = decoder_template_1.decoder_template_on_enter;
            on_enter = decoder_template_1.replaceAll(on_enter, "{{filename}}", varName);
            on_exit = decoder_template_1.decoder_template_on_exit;
            on_exit = decoder_template_1.replaceAll(on_exit, "{{filename}}", varName);
        }
        else {
            let comparisson = new pngjs_1.PNG({
                width: this.width,
                height: this.height,
            });
            let indexed = [];
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var idx = (this.width * y + x) << 2;
                    const r = this.data[idx];
                    const g = this.data[idx + 1];
                    const b = this.data[idx + 2];
                    const nrts = nearest_color_1.nearest(r, g, b);
                    indexed.push(nrts.indexed);
                    const rgb = color_1.default(nrts.hex);
                    comparisson.data[idx] = rgb.red();
                    comparisson.data[idx + 1] = rgb.green();
                    comparisson.data[idx + 2] = rgb.blue();
                    comparisson.data[idx + 3] = 255;
                }
            }
            const pad = indexed.length % 40;
            for (let i = 0; i < pad; i++)
                indexed.push(0);
            const varName = slug_1.slug(cli.flags.input);
            declarations = `const unsigned char ${varName}[] = `;
            declarations += indexed_to_hex_1.indexedToHex(indexed) + ";";
            comparisson.pack().pipe(fs.createWriteStream("/tmp/out.png"));
        }
        let encoded = {
            declarations: declarations,
            include_directive: null,
            on_awake: null,
            on_enter: on_enter,
            on_exit: on_exit,
            on_frame: null
        };
        saveFile(JSON.stringify(encoded, null, "\t"), cli.flags.output);
    });
}
function saveFile(jsonString, path) {
    createSubdirs(path);
    fs.writeFileSync(path, jsonString);
}
exports.saveFile = saveFile;
function createSubdirs(filePath) {
    const dir = path.dirname(filePath);
    if (fs.existsSync(dir))
        return true;
    createSubdirs(dir);
    fs.mkdirSync(dir);
}
