#!/usr/bin/env node
'use strict'

import { readFileSync } from "fs";
import http from "http";
import meow from "meow";
import url from "url";
import { PNG2Indexed } from "./pn2idx";

const IP = "0.0.0.0"

function loadingHTML(file:string, png:string) {
    return `
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="initial-scale=1.0">
        <title>lvndr png editor</title>
        <style>
            .img-container {
                min-width: 64px;
                min-height: 64px;
            }
            img{
                background-color: #000;
                margin: 6px;
                padding: 6px;
                border: 2px solid #9992CF;
                border-radius: 2px;
            }
        </style>
    </head>
    <body style="display: flex; flex-direction: column; background-color: #3D3B40; width: 100%; height: 100%; overflow: hidden;">

        <span style="flex-grow: 1;"></span>
        <div style="display: flex; flex-direction: row;">
            <span style="flex-grow: 1;"></span>
            <div class="img-container">
                <img id="img_original" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAACGFjVEwAAAAEAAAAAHzNZtAAAAAPUExURQAAAJmSz7ew+ltKeRQUH1b+2hsAAAABdFJOUwBA5thmAAAAGmZjVEwAAAAAAAAAEAAAABAAAAAAAAAAAAAMAGQAANmf7b4AAAAySURBVBjTY2AgBTAzQxksEAYzIyNUhJkFTQBDCwWAkRGNz8TEiMZHFcEQwNCCaSgEAAArUABPmMTTgAAAABpmY1RMAAAAAQAAAA4AAAANAAAAAQAAAAIADABkAQAytTgdAAAAMGZkQVQAAAACGNNjYMAFmFlQuCzMDJQCRkYUHhMThM/MDOFB+MyMjMwYXDTFqEYBABTxAE/8251wAAAAGmZjVEwAAAADAAAADAAAAA0AAAABAAAAAQAMAGQAAINkxtkAAAAzZmRBVAAAAAQY02NgYGBkZIADRiYmRiQ2gofCQVGGagCxgJkZic3ICOGxMCNxmFlQlAEAF68AT3/lKNUAAAAaZmNUTAAAAAUAAAAOAAAADQAAAAEAAAABAAwAZAAAGhqyUgAAADJmZEFUAAAABhjTY2CAA0ZGMMXMDOExMYH4zIyMzBAemI/GRVOMbhQlgJkFhcvCjFMlACf/AE82uXPFAAAAG3RFWHRTb2Z0d2FyZQBBUE5HIEFzc2VtYmxlciAyLjfB49OIAAAAAElFTkSuQmCC"/>
            </div>
            <div class="img-container">
                <img id="img_compressed" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAACGFjVEwAAAAEAAAAAHzNZtAAAAAPUExURQAAAJmSz7ew+ltKeRQUH1b+2hsAAAABdFJOUwBA5thmAAAAGmZjVEwAAAAAAAAAEAAAABAAAAAAAAAAAAAMAGQAANmf7b4AAAAySURBVBjTY2AgBTAzQxksEAYzIyNUhJkFTQBDCwWAkRGNz8TEiMZHFcEQwNCCaSgEAAArUABPmMTTgAAAABpmY1RMAAAAAQAAAA4AAAANAAAAAQAAAAIADABkAQAytTgdAAAAMGZkQVQAAAACGNNjYMAFmFlQuCzMDJQCRkYUHhMThM/MDOFB+MyMjMwYXDTFqEYBABTxAE/8251wAAAAGmZjVEwAAAADAAAADAAAAA0AAAABAAAAAQAMAGQAAINkxtkAAAAzZmRBVAAAAAQY02NgYGBkZIADRiYmRiQ2gofCQVGGagCxgJkZic3ICOGxMCNxmFlQlAEAF68AT3/lKNUAAAAaZmNUTAAAAAUAAAAOAAAADQAAAAEAAAABAAwAZAAAGhqyUgAAADJmZEFUAAAABhjTY2CAA0ZGMMXMDOExMYH4zIyMzBAemI/GRVOMbhQlgJkFhcvCjFMlACf/AE82uXPFAAAAG3RFWHRTb2Z0d2FyZQBBUE5HIEFzc2VtYmxlciAyLjfB49OIAAAAAElFTkSuQmCC">
            </div>
            <span style="flex-grow: 1;"></span>
        </div>
        <span style="flex-grow: 1;"></span>

        <script>

            function loadStats(){

                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300) {

                        const response = JSON.parse(xhr.responseText)
                        let original = document.getElementById("img_original");
                        original.src = \`data:image/png;base64,\${response.original.png}\`

                        let compressed = document.getElementById("img_compressed");
                        compressed.src = \`data:image/png;base64,\${response.compressed.png}\`

                    } else {
                        console.log(JSON.parse(xhr.responseText));
                    }
                };

                xhr.open('GET', '/stats/?file=${file}');
                xhr.send();
            }

            window.onload = loadStats;
        </script>
    </body>
</html>
    `
}

function compressAPI(original:{size:number, png:string}, compressed:{size:number, png:string}) {
    return `
        {
            "compressed":{
                "size": ${compressed.size},
                "png": "${compressed.png}"
            },
            "original":{
                "size": ${original.size},
                "png": "${original.png}"
            }
        }
    `
} 

export function editor(port:number){
    
    const server = http.createServer( (request, response) => {

        if (request.url == null) {
            response.writeHead(400)
            response.end()
            return
        }

        const urlComponents = url.parse(request.url, true)
        const query = urlComponents.query
        const file64:(string|undefined) = query["file"]?.toString()
        
        if (file64 == undefined) {
            response.writeHead(400)
            response.end()
            return
        }

        const file:string = Buffer.from(file64, 'base64').toString('binary').toString()

        if (urlComponents.pathname == "/") {

            const fileData = readFileSync(file, {encoding: 'base64'});
            response.writeHead(200, {
                'content-type': 'text/html;charset=UTF-8',
                'access-control-allow-origin': '*'
            })
            
            response.end(loadingHTML(file64, fileData))
            
            return 
            
        } else if (urlComponents.pathname == "/stats/") {

            if(file == null) {
                response.writeHead(400)
                response.end()
                return
            }
        
            PNG2Indexed(file, data => {
            
                if (data == null) {
                    response.writeHead(500)
                    response.end()
                    return
                }

                response.writeHead(200,
                    {
                        'content-type': 'application/json',
                        'access-control-allow-origin': '*'
                    })
                response.end(compressAPI(
                    {size: data.original.size, png: data.original.png},
                    {size: data.compressed.size, png: data.compressed.png}
                ))
            })
        }
    })

    server.listen(port, IP)
    console.log(`running server at ${IP}:${port}`)    
}


let cli = meow("",{ flags: {
    port:  { type: 'number', alias: 'p'}
}})

editor(cli.flags.port)