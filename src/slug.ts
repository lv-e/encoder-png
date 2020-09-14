
import path from "path";
import slugify from "slugify";

export function slug(fullpath:string) : string {

    const fileName = path
        .basename(fullpath, ".png")
    
    const varName = slugify( fileName, {
        replacement: "_",
        strict: true
    })

    return varName
}