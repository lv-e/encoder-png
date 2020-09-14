"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slug = void 0;
const path_1 = __importDefault(require("path"));
const slugify_1 = __importDefault(require("slugify"));
function slug(fullpath) {
    const fileName = path_1.default
        .basename(fullpath, ".png");
    const varName = slugify_1.default(fileName, {
        replacement: "_",
        strict: true
    });
    return varName;
}
exports.slug = slug;
