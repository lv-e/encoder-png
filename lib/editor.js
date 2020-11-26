#!/usr/bin/env node
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editor = void 0;
const http_1 = __importDefault(require("http"));
const meow_1 = __importDefault(require("meow"));
const IP = "0.0.0.0";
function editor(port) {
    const server = http_1.default.createServer((request, response) => {
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end("now its png");
    });
    server.listen(port, IP);
    console.log(`running server at ${IP}:${port}`);
}
exports.editor = editor;
let cli = meow_1.default("", { flags: {
        port: { type: 'number', alias: 'p' }
    } });
editor(cli.flags.port);
