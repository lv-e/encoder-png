#!/usr/bin/env node
'use strict'

import * as fs from "fs";
import http from "http";
import meow from "meow";
import { PNG } from "pngjs";
import url from "url";
import { PNG2Indexed } from "./pn2idx";

const IP = "0.0.0.0"

function loadingHTML(file:string) {
    return `
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="initial-scale=1.0">
        <title>lvndr png editor</title>
        <style>

            @font-face {
                font-family: 'cellphone';
                src: url(data:application/x-font-woff;charset=utf-8;base64,d09GRk9UVE8AABJYAAsAAAAAKuAH0wAAAAAAAAAAAAAAAAAAAAAAAAAAAABDRkYgAAAEiAAADRoAAB/1FOHiFEZGVE0AABHEAAAAHAAAABxLqdJfR0RFRgAAEaQAAAAdAAAAHgAnALJPUy8yAAABYAAAAE0AAABgNUiz8mNtYXAAAAMkAAABTwAAAcInPAmIaGVhZAAAAQgAAAA0AAAANtzdCtZoaGVhAAABPAAAABwAAAAkEQIHrGhtdHgAABHgAAAAdQAAAq6qAAAAbWF4cAAAAVgAAAAGAAAABgCsUABuYW1lAAABsAAAAXMAAASVvSX1KHBvc3QAAAR0AAAAEgAAACD+AwEAeJxjYGRgYGAyNjYvZ1wVz2/zlYGbgwEEds1kUQDRu5U72hgY/jFwMIDFORiYQBQA9g4H8HicY2BkYOBg+MfAyMDJAAIcDEAmKlgNACFtAcYAAFAAAKwAAHicY2BmbWacwAAEjEDIwMCERDOBaQ4QwcLA8P3/uv+/7///zyH9/z9IfVVqRhGDA4OCwhoOhv9A1Rxg9WDNDKwM7AwMCkDICADDTw8ZAAAAeJzlkb9Kw1AUh3836f926iBiEO7gpk1DCkFS0KHSsUsdBKc0pKQ07Q1tINB3EAQnJ0dHH8jB0WcQF0/SoxSydOlkDuF+9+Se8x1uAJyIKwhsHwOXzAJtbJg1lPHMrOMU78wlHItz5jLq4o65giPxyFyFIT6Ya9A1nbkOQ7tmbhA/MTeJP5lbMPQ+GUWpTjsnt2cscIZbZo2qH5h1uHhhLsHCF3MZbXHDXMGFmDBX4YhX5hoq4pu5DkerMjeI75mbxG/MLTi6jhAJRUzeLkWah4kpPMoqrOATKawp59O6oHVCWYRJErvdbpqm5tRL1Mr31Nr01cKc0McRnZxjRpUSAwSIKGIyKSxpJzGkLEZqPvPkIIiiOFTLQA4pNyaBlx/HeOFFtGyoIKTh5F5Ns3M2XZuFHpUGoSuLFlfaltXbb0i5O1GxleQhf5X9XG/Si8zRl7Zp74qKmkzSKUj+HMNBhxWH+E3bu83u6TD9/3HPH1eA1GoAeJxjYGBgZoBgGQZGBhDYA+QxgvksDAuAtAqDApDFwlDHsJBhOcMuhvMM1xjuMrxn+Mbwl+E/ozxjImMF0zEFSYU1//8DVSsA9SwGqtrPcJHhBsN9ho8MP4Cq5JBV/X/4/8D//f/X/l/5f8X/5f+X/V/6f8n/xf9b/7v81/v78EH//b9QlxAEjGwMBJUyMjGzsLKxc3BycfPw8vELCAoJi4iKiUtISknLyMrJKygqKauoqqlraGpp6+jq6RsYGhmbmJqZW1haWdvY2tk7ODo5u7i6uXt4enn7+Pr5BwQGBYeEhoVHREZFx8TGxTPk5hUUVdY1t7d1dHV29/b3TZg4edKUqdNmTJ85e9a8ufNBIZiUxsDQCnFNfj2ITIG6LZ2hZ05GIsylCZk5tVDmCgaGRcsYVsI9kV2cVVJYVl5RWl3DUNXY1ACMCBgAAPLtbKAAeJxjYGYAg38MjAzYAAAYYwEDAAB4nLVZa5AcVRU+PdvTvdszmX0kPZuNA3kSsgQ2IQ9IeESKABGQCCLKS3ATl5BKspvaJKRASy0tCWFMBZc2VH5Q+CjLH0ZEQTQqIg9fPDQCIqiAQlllqYVYYvo5E889597bd3YW0B/WJDO9Pfeeex7f+c45PRbYNliW1b9+bMvm4bUjW7duv3FsdOSCtadcvm1461awCmDBhdFciOZZ0fxCtKAj8u1sRrkjDMr28R7Yty2aXa/ri7Jbz4JaJ+C/Ys3q7K4B9NQK1/fWoFY77uU+8IS4aTAdBuA4mAfL4Ez4IIzCp27avGPzhq0jO7YPbxxZt2F85KaRTfR+/q7xsaHRXVu3jo6Nbhse37J5dNP4yM5d46PLli5dfuacZUPLbty5c/sZS5bs3r176IbhnWPjG4fHdgxtHNs2tGGcTJqjbZpzwdo5ZFT7fQCw9kABOsCGIjjgwo3QBR6UoIzaVqAbeqAX+lDvGeBDFfphJlowC94FNbTjeJgNc2Au2jMfFsAJsBBOhEUwCCfBYjgZToEhWAJL4VS0djmsgJVwGpwOq2A1nIHWnwVnwxp4N5wDH4dzYS2cB+fDBbAO3gMXwkVwMbwXLoH18D64FC6D98Pl8AG4Aj32IbgSroKr4Rq4Fj4M18H16NWPwAbYBB+FL8INsB8+BvfC1+EQ3AffgG/C7fAt+A58G+6HB+AwPAjfhe/B9+FH8AP4ITwMD8E+eBwegUfhMfgJfAGehJ/DL+BpeAKegjvgl/AM/AqOwK/heXgWnoPfwG/h9/ACvAh/gN/BnfAneBlegT/Cq/CadZu1F16Cn8InoNO63apbn4NDIuAd6NTj0BHjeEBmrbMutW6y7rKet/5lJYVCoauwqHBFYVvhQOGxwj86/I51HZs7vtzxXMdrHf+0B+3T7FH7Hvv5IhQXFy8ujhXvKB4qHim+XkycHucyZ8T5kvOMa7nz3GvdW90H3CPuG539nRd17um8t/OVzr90uV29XbO6Fnad3TXSdWvXV7oe73q2601vnrfGW+9t9+72DnnPeq97jdLxpXNKV5Y+WbqndLj0crm3fFb5vPJoeXf51vId5QfKD5afKsfTzpv26Wmfn/a3ytzK+srGyi2VR7r7us/t3tP94+4/d/+7p6PnrJ7NPTf31Hu+2vNQr9N7du947+E+r29N3819D/a9OX3F9Oun3zX9yRnWjFUz9sx4ye/xr/Hv9h/1X/D/Xl1Zvby6sbqrur/6tepf+wv9s/qv67+v/+n+N2bOnnnlzPrM+2eGA9MG1gx8ZuDOgZ8NHBl4cdbsWXNnzT9awVcY2GkQBWHg4lWtCJh+KbiV8FgU1Fzw53iNoDrHq0RBHPhzPfpIcXVKL/WZySvx6YjbId3gz0heuSgkEULEOp83OOKDBEZyZaT3qiNcsZ5lZ/pUscipJMeSoBrhnixwmgFq789DFZuBH+1HaQeVcrkA1sfFjTEtl4LQZHu+J8TQnUSenevSkHdcVqtBt2PSIR1EP9noohBlVhegdUhe/gkeOjIGNLPmAO9t0vLwWBhUWZFE2uLU7YUeLkzAX+BVUC3pY3YIK8ImhLmPc3sy6T3yVUUo5Ud0I5P7MpKQ4Zci2idiMFFTe5FXORoF9jyPYh3t96ODYRCjz7KDfJgwMtovJabCXXhwRmrGdDDeyX2DLmTz0F5b3MYbBCEhSgixGyyiEUTSsQyMJnkStRMLnYpwJt9Qagv5ibHBVRcOA2qhJ8T5mURhRpv10fiacPftLQq/JuxXYVhMJzfws2EcICWyTU6swK48bFjK0SeLxSphVKxRjCvE9xwkYTvKnO8pkFVTw5jGVPkT63xB0TGtcoUfpvI7Q5ED7VSO4ncYUlqMkeV4C+vEXxFmS6TSNzSy03w56mv1H9VAyCJc6I3+ICGZFqFe+S4n1EaxYUgojCJiGhEiP9M4UHsZCTLRMEXF90QXkQhJxOnXFM4WuZPoPTokCQWQVhMCHBOfCcLREeCU0cWVggGEfHuQia0pUpaREGsXpRRjwYUtJwkplKo66VSKkKWGKAoXchUdl0nsoRxcIBMiRmWnXiDgGE2tQCJTAzeRUylz5BbhF5kBnEWY+nVb3kHLj9VtCSUHKKMzSaY6RiYCzJebaaSI3KTzIuml6JhUIaGcQdmoVHELE1qDFWoFm4GylGXFgcnuuLUastaNoBWYerWTA1VakLFPnAZxlRGEFrg4Fcrvk7w8XpGGZEwGiSqhAhvRXifkGhFpNdsFM92RaKICuTyWeNUuyyiylFwq5SNpXGTQTcZFJww4RuhVAQW0TCwjVOOtiMxhXWVIc46iO45KKJV3rJNwbCY/Q2Irjpg4Q7k8lQzdDJi9OStcdn9CkgW4uA5H2oicYTJRNzK6MEkhz/NEBCCSJBzKheYGV9J3bHKreunCQrUhlOgJCY2LPaq4uDXD8pbt5zhQo4FlrnHQpbKNPcjJnqxdp+CFiAheh1wy8UrW45zOqOQY/VAjyKu0QnZCQcGjB1WFkimTU4yMv4pVRlSgIq93i94BcSzzOdO87+RtGYof4hYkb2tUv0QgSeT6SHQHIddbgrKuKU2jFEUSxdVI8qzWXUk6Srjzl3go3V4qj6YbdKCvuqe8pYy472nll9DQ1GWY4SGikCk2wwuMvrMFhWuYUH+B9JkabJdokMg8M7+U2XGSJ1Dsn+pVhJ+xJqvcT4zcj8j1IgfQk61OoZSl6jXfIxaNKGCRDjqza8L1zWwaMo0O3TcocomDUIuXecuUT98m7MEm4Ul8Suzl3bXKl1Tni5HGRU7j/HCV6EYaMxM4FU7i0EjiVtGOalNcdt8yalbt1OghsjwVdcWYlI4c2UhEthPM9COAY+PcFLgUDbHuVfLu9miOOyzb3GIWhRTKWHG0akvSllRqCHDJ3kQc5IiDRIlNxUXE8aJCmeXHqrirXkB5xFVNJFcIWyFDeS9vx3XFVMOLIj7G2CRXRJS9TT+doNMm3OxALSn44QSpPuGGB/J+aLlH6dSa6M0WcnU5xAk5n5sdk8Ooctr5X3RHyJGQdKWfluBJDUEainlyessD7SomygRjoWtjsFeILOOQUtYJzVHQCj1M4jkT/t596US9LmTW6xTPel3oXa8Lj+ItUV7r9TDg92I+dToaMA2WnpnihAQW2gwmy0zofiSEmVFRXZZAoD3XSwJbDXEqKZh4GtLX7hR2ZO9w5BRWYKLquZiKCb/IF9z7J0bCuqo5EFyuJwmjGZ3UiPAUv4BjuDKPCJq40pPfmhiQm3UWy3491I2ZGrxYLJEUSTP71pb9jiqhC6lUnOapFF4oK8XpnsbnKrwVHtDD8+l5WVnoZXyUQNZSkywIm6mi8FxJ2ZilMgUnnH17Qw2NTEWC2g8WxRP4aoaTOQXkbJAXXnqAQNuEUVNsyrQ7zU3Un65GW6JW5DclYBPSKtSI0bjPgnzIo75YJRbrbAhk0xptAuNWCJq4F3opd1YFHb6FI5ottnAUc+53xKUcwyXxJYxnFEeACHkmCA3UsdBkwt27L5vI/RAbfshMPxiUkh3w/5tNHPCmSDqe+ZpTej5+K89zZlDbmTNEKPykGp1E9saqlCdB1uJUSapqJlae52Y6zoskTf8VxvtyjyaNpvSlOY7qiTYGl9LGUd1oqlvVNMgBYzJ2wgSikph2iaZXWNTIHw3kI54pwEmpycoPs1tdyU5Myfep4XtGISpaNOW3s7jwpqwg9XCilcmjt5ZcTAJlk3Kt22pbg6MlJ7d2n8jHHO12ZW93bl6bipNtIk6XAwI9jggVhCYfz1MG9wyRYKm9e+vpRBF7AU3vDI3WbkYZadZc8SjLP0NXV6pfYeu9torbyjsNeo81WUxh2aSKbh495P2fmT49IHUnrheJGupi21pgOV7FyXWdGV4OAWfmxTBtux/y9G7Lzut/Jowc1pmWHU3VnTTapCmebutOYp0o1Umm0DyTBIo0lnOLKHqURBJSs22gaE3ENhp+W6KV4G/nWLwutpzTmvCUAZhdk/xZfCdalSoTfTu8zqZ19HAlxqQh9ZQvzZzN/coKt5+FMpblKMM/q8rxDXm4ehjNo54r619OW6nqEN2Gnr5V02+OXnIcNsYHHIo6cQI4ihxQ88BtL8SZetI6VdHgxls/tdA/RFB/gHBY5TUmbCEq0T19Q/ksyNu7UF6rCc7lKUn8OoSSZ8SDPjkPIVnHClB362WvBrXpUBM/zXVBLwzAXBiEU2E1XAiXwVUwDDvgs3A3HIZH4Al41eqwStZi6xLramuTNW7dYt1jPcyE55bkDFri8ckt8aznlGTBKTEDinWpXGc+tXZLPN87pQY5WOynR4IlHKrinF+FBHQ0P8+iJ2emrDTIH7ylJKOVZ9WcgyNyST6oKEUSkaXYKM/5JqeUj9pTICDTFgpJ5mxhFl+aMUqqr85/IpjUXpei/CcmhxWTgy57V5SUYokLCDuU/osfx/ZPNtIJyYumUa0asXH/AaiZj8QAAHicY2BkYGDgAWIxIGZiYATC1UDMAuYxAAAK9wDaAAAAAAAAAQAAAADV7UW4AAAAALqZBCAAAAAAuyOIhnicnZHbCsAgDEOLrdr9/w9vQgsh6hx7OBRs0psqIhrYQwt6UOIdc0NbyYP5HQreJHt98dbQjugwI9ao9MY6I7J2A3+TeScl/bWYMXdCn5PGFrWwf4ddTzfl2nxn3LFvYO/pL5xu9NbzLxZzjFjgJiI34sIDqwAAAA==) format('woff');
                font-weight: normal;
                font-style: normal;
            }

            * {
                box-sizing: border-box;
                image-rendering: pixelated;
                margin: 0;
                padding: 0;
                border: 0;
                font-size: 100%;
                font: inherit;
                outline: none;
                font-family: cellphone, sans-serif;
                font-size: 8px;
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                overflow: hidden;
            }
            
            .img-container img{
                background-color: #000;
                margin: 6px;
                padding: 6px;
                border: 2px solid #5B4A79;
                border-radius: 2px;
            }

            .img-container img:hover{
                zoom: 2;
            }

            .img-container p {
                background-color: #65636C;
                margin: 6px;
                padding: 2px 6px;
                border: 2px solid #636169;
                border-radius: 2px;
                color: #F5FAFF;
                text-align: left;
            }

            .img-container span {
                color: #C3BFCF;
            }

            .loading {
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAACGFjVEwAAAAEAAAAAHzNZtAAAAAPUExURQAAAJmSz7ew+ltKeRQUH1b+2hsAAAABdFJOUwBA5thmAAAAGmZjVEwAAAAAAAAAEAAAABAAAAAAAAAAAAAMAGQAANmf7b4AAAAySURBVBjTY2AgBTAzQxksEAYzIyNUhJkFTQBDCwWAkRGNz8TEiMZHFcEQwNCCaSgEAAArUABPmMTTgAAAABpmY1RMAAAAAQAAAA4AAAANAAAAAQAAAAIADABkAQAytTgdAAAAMGZkQVQAAAACGNNjYMAFmFlQuCzMDJQCRkYUHhMThM/MDOFB+MyMjMwYXDTFqEYBABTxAE/8251wAAAAGmZjVEwAAAADAAAADAAAAA0AAAABAAAAAQAMAGQAAINkxtkAAAAzZmRBVAAAAAQY02NgYGBkZIADRiYmRiQ2gofCQVGGagCxgJkZic3ICOGxMCNxmFlQlAEAF68AT3/lKNUAAAAaZmNUTAAAAAUAAAAOAAAADQAAAAEAAAABAAwAZAAAGhqyUgAAADJmZEFUAAAABhjTY2CAA0ZGMMXMDOExMYH4zIyMzBAemI/GRVOMbhQlgJkFhcvCjFMlACf/AE82uXPFAAAAG3RFWHRTb2Z0d2FyZQBBUE5HIEFzc2VtYmxlciAyLjfB49OIAAAAAElFTkSuQmCC");
                background-repeat: no-repeat;
                background-position: center;
                height: 32px;
                width: 32px;
            }

            .container {
                display: flex;
                flex-direction: column;
            }
        </style>
    </head>
    <body style="display: flex; flex-direction: column; background-color: #3D3B40; width: 100%; height: 100%; overflow: hidden;">

        <span style="flex-grow: 1;"></span>
        <div style="display: flex; flex-direction: row;">
            <span style="flex-grow: 1;"></span>
            <div class="img-container container" id="container_original">
                <img class="loading" id="img_original" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>
                <p id="size_original">&nbsp;</p>
            </div>
            <div class="container">
                <span style="flex-grow: 1;"></span>
                <img style="padding: 0px 10px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAFqADAAQAAAABAAAAFgAAAAA/6RFgAAAAm0lEQVQ4EdWVSwqAMAxErfSm4srzuBLPqqtXSmBIPxSrm5h2MnmGgGFxnn07nlxy3WfIc/W+qove81hqAClfQK7qvyeGDFKPPI0CIQa9MRnXGnnkEVKEtQ2UvpkYQ4As4DxbAamNlnx+4v/M2JIy+2iHzoWN6Oy5ypv3WJHSKBkrIgwoKI3JuLSARgoEn2F77P6/IITEI0U3jPgFA3dDfTED4SEAAAAASUVORK5CYII="/>
                <span style="flex-grow: 1;"></span>
            </div>
            <div class="img-container container" id="container_compressed">
                <img class="loading" id="img_compressed" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>
                <p id="size_compressed">&nbsp;</p>
            </div>
            <span style="flex-grow: 1;"></span>
        </div>
        <span style="flex-grow: 1;"></span>

        <script>

            function loadImage(type){

                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300) {

                        const response = JSON.parse(xhr.responseText)

                        let imgTag = document.getElementById("img_" + type)
                        imgTag.src = "data:image/png;base64," + response.png
                        imgTag.classList.remove("loading")

                        let spmTag = document.getElementById("size_" + type)
                        let sizeFormatted = (response.size / 1024.0).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits:1 })
                        spmTag.innerHTML = "<span>" + (type == "original" ? "Raw" : "Prips") + "</span><br/>" + sizeFormatted + " Kb"

                    } else {
                        console.log(JSON.parse(xhr.responseText));
                    }
                };

                xhr.open("GET", "stats/" + type + "/?file=${file}");
                xhr.send();
            }

            window.onload = function(){

                let original = document.getElementById("img_original")
                original.onload = e => {
                    let compressed = document.getElementById("img_compressed")
                    compressed.style.minWidth = original.offsetHeight
                    compressed.style.minHeight = original.offsetHeight
                }

                loadImage("original")
                loadImage("compressed")
            }

        </script>
    </body>
</html>
`
}



function apiResponse(data:{size:number, png:string}) {
    return `
        {
            "size": ${data.size},
            "png": "${data.png}"
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

        if (urlComponents.pathname == "/") {

            response.writeHead(200, {
                'content-type': 'text/html;charset=UTF-8',
                'access-control-allow-origin': '*'
            })
            
            response.end(loadingHTML(file64))
            
            return 
            
        } 
        
        const file:string = Buffer.from(file64, 'base64').toString('binary').toString()
        
        if (urlComponents.pathname == "/stats/compressed/") {

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

                response.writeHead(200, {
                    'content-type': 'application/json',
                    'access-control-allow-origin': '*'
                })
                
                response.end(apiResponse(
                    {size: data.size, png: data.png}
                ))
            })
        } else if (urlComponents.pathname == "/stats/original/") {

            if(file == null) {
                response.writeHead(400)
                response.end()
                return
            }

            const data = fs.readFileSync(file);
            const png = PNG.sync.read(data);
            const sizeOriginal = png.width * png.height * 3 // 3 bpp

            response.writeHead(200, {
                'content-type': 'application/json',
                'access-control-allow-origin': '*'
            })
            
            response.end(apiResponse(
                {size: sizeOriginal, png:data.toString('base64')}
            ))
            
        }
    })

    server.listen(port, IP)
    console.log(`running server at ${IP}:${port}`)    
}


let cli = meow("",{ flags: {
    port:  { type: 'number', alias: 'p'}
}})

editor(cli.flags.port)