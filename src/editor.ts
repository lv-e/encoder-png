#!/usr/bin/env node
'use strict'

import { Buffer } from "buffer";
import { readFileSync } from "fs";
import http from "http";
import meow from "meow";
import url from "url";

const IP = "0.0.0.0"

export function editor(port:number){
    
    const server = http.createServer( (request, response) => {
        
        if (request.url == null) {
            response.writeHead(400)
            response.end()
            return
        }

        const query = url.parse(request.url, true).query
        const file64:(string|undefined) = query["file"]?.toString()

        if (file64 == undefined) {
            response.writeHead(400)
            response.end()
            return
        }
        
        const file = Buffer.from(file64, 'base64').toString('binary')
        const fileData = readFileSync(file, {encoding: 'base64'});

        response.writeHead(200, {'content-type': 'text/html;charset=UTF-8'})        
        response.end(`<img src="data:image/png;base64, ${fileData}"></img>`)

    })

    server.listen(port, IP)
    console.log(`running server at ${IP}:${port}`)    
}


let cli = meow("",{ flags: {
    port:  { type: 'number', alias: 'p'}
}})

editor(cli.flags.port)