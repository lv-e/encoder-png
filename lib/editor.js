#!/usr/bin/env node
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editor = void 0;
const buffer_1 = require("buffer");
const fs_1 = require("fs");
const http_1 = __importDefault(require("http"));
const meow_1 = __importDefault(require("meow"));
const url_1 = __importDefault(require("url"));
const pn2idx_1 = require("./pn2idx");
const IP = "0.0.0.0";
function editor(port) {
    const server = http_1.default.createServer((request, response) => {
        var _a;
        if (request.url == null) {
            response.writeHead(400);
            response.end();
            return;
        }
        const query = url_1.default.parse(request.url, true).query;
        const file64 = (_a = query["file"]) === null || _a === void 0 ? void 0 : _a.toString();
        if (file64 == undefined) {
            response.writeHead(400);
            response.end();
            return;
        }
        const file = buffer_1.Buffer.from(file64, 'base64').toString('binary').toString();
        const fileData = fs_1.readFileSync(file, { encoding: 'base64' });
        if (file == null) {
            response.writeHead(400);
            response.end();
            return;
        }
        pn2idx_1.PNG2Indexed(file, data => {
            if (data == null) {
                response.writeHead(500);
                response.end();
                return;
            }
            response.writeHead(200, { 'content-type': 'text/html;charset=UTF-8' });
            response.end(`
                <img src="data:image/png;base64, ${fileData}"></img>
                <img src="data:image/png;base64, ${data.png}"></img>
            `);
        });
    });
    server.listen(port, IP);
    console.log(`running server at ${IP}:${port}`);
}
exports.editor = editor;
let cli = meow_1.default("", { flags: {
        port: { type: 'number', alias: 'p' }
    } });
editor(cli.flags.port);
