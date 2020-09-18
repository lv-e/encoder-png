#!/usr/bin/env node
'use strict'

import * as lv from "@lv-game-editor/lv-cli";
import Color from "color";
import * as fs from "fs";
import meow from "meow";
import { PNG } from "pngjs";
import { exit } from "process";
import { indexedToHex } from "./indexed-to-hex";
import { nearest } from "./nearest-color";
import { slug } from "./slug";

let slugify = require('slugify')

const testing = (process.env.NODE_ENV === 'test')
export let verbose = testing ? true : false

if (!testing) {
        
    let cli = meow(`
        Usage
        $ lv-encoder-png [verbose|help] -i <path-to-target-image> -o <path-to-copy-encoded-file>
    `,{ flags: {
        input:  { type: 'string', alias: 'i'},
        output: { type: 'string', alias: 'o'}
    }})

    if (cli.input[0] == "help") {
        cli.showHelp()
        exit()
    } else if (cli.input[0] == "verbose") {
        verbose = true
    }

    fs.createReadStream(cli.flags.input)
        .pipe(new PNG())
        .on("parsed", function () {

            let comparisson = new PNG({
                width: this.width,
                height: this.height,
            })

            let indexed:number[] = []

            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var idx = (this.width * y + x) << 2;

                    const r = this.data[idx]
                    const g = this.data[idx + 1]
                    const b = this.data[idx + 2]
                    
                    const nrts = nearest(r,g,b)
                    indexed.push(nrts.indexed)

                    const rgb = Color(nrts.hex)

                    comparisson.data[idx]       = rgb.red()
                    comparisson.data[idx + 1]   = rgb.green()
                    comparisson.data[idx + 2]   = rgb.blue()
                    comparisson.data[idx + 3]   = 255
                }
            }

            const pad = indexed.length%40
            for (let i = 0; i < pad; i++) indexed.push(0)
            
            const varName = slug(cli.flags.input)            
            let reduced = `static unsigned char ${varName}[] = `
            reduced += indexedToHex(indexed) + ";"
            
            let encoded:lv.encoded = {
                declarations: reduced,
                include_directive: null,
                on_awake: null,
                on_enter: null,
                on_exit: null,
                on_frame: null
            }
            
            fs.writeFileSync(
                cli.flags.output,
                JSON.stringify(encoded, null, "\t")
            )

            comparisson.pack().pipe(fs.createWriteStream("/tmp/out.png"));
        })
}

