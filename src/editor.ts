#!/usr/bin/env node
'use strict'

import http from "http";
import meow from "meow";

const IP = "0.0.0.0"

export function editor(port:number){
    
    const server = http.createServer( (request, response) => {
        response.writeHead(200, {'content-type': 'application/json'})
        response.end("now its png")
    })

    server.listen(port, IP)
    console.log(`running server at ${IP}:${port}`)    
}


let cli = meow("",{ flags: {
    port:  { type: 'number', alias: 'p'}
}})

editor(cli.flags.port)