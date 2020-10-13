export declare function replaceAll(subject: string, search: string, replace: string): string;
export declare const decoder_template_declarations = "\n\n#ifndef PRIPS_DECODER\n#define PRIPS_DECODER\n\n#define PRIPS_FILE_VERSION \t\t0b01\n#define PRIPS_FILE_SIGNATURE \t0b01100\n\n#include <math.h>\n#include <stdlib.h>\n\nnamespace Prips{\n\n\ttypedef unsigned char byte;\n\ttypedef unsigned short ui16;\n\ttypedef unsigned int ui32;\n\n\ttypedef struct PlanesWalker {\n\n\t\tui32 byteStart;\n\t\tui32 sizeInBytes;\n\n        const byte *const image;\n\t\t\n\t\tui32 cursor;\n\t\tui32 currentByte;\n\t\tui32 buffer;\n\n\t\tui32 rleBuffer;\n\t\tui32 currentColorBit;\n\n\t\tPlanesWalker(ui32 _byteStart, const byte *const _image) : byteStart(_byteStart), image(_image){\n            rewind();\n\t\t}\n\n        void rewind(){\n\n            buffer = 8;\n\t\t\tcursor = byteStart;\n\t\t\tcurrentByte = *(image + cursor);\n\n\t\t\tsizeInBytes = advance();\n\t\t\tgoToNextByte();\n\t\t\tsizeInBytes += cursor - byteStart;\n\n\t\t\tpickFirstBit();\n\t\t\trleBuffer = advance();\n\n        }\n\n\t\tinline ui32 nextPixelColor(){\n\n\t\t\tif(--rleBuffer == 0){\n\t\t\t\trleBuffer = advance();\n\t\t\t\tcurrentColorBit = !currentColorBit;\n\t\t\t}\n\n\t\t\treturn currentColorBit;\n\t\t}\n\n\t\tinline void pickFirstBit(){\n\t\t\tcurrentColorBit = (currentByte & 0x80) >> 7;\n\t\t\tcurrentByte <<= 1;\n\t\t\tbuffer--;\n\t\t}\n\n\t\tinline void goToNextByte(){\n\t\t\tcurrentByte = *(image + ++cursor);\n\t\t\tbuffer = 8;\n\t\t}\n\n\t\tui32 advance(){\n\n\t\t\tui32 bit = 0;\n\t\t\tui32 number = 0;\n\t\t\tui32 count = 0;\n\t\t\tui32 counting = 1;\n\n\t\t\tdo {\n\t\t\t\t\n\t\t\t\tbit = (currentByte & 0x80);\n\n\t\t\t\tcurrentByte <<= 1;\n\t\t\t\tbuffer--;\n\n\t\t\t\tif(!buffer) goToNextByte();\n\n\t\t\t\tif (counting) {\n\t\t\t\t\tif(!bit) count++;\n\t\t\t\t\telse counting = false;\t\n\t\t\t\t} \n\n\t\t\t\tif (!counting) {\n\t\t\t\t\tnumber |= bit == 0 ? 0 : 1;\n\t\t\t\t\tif(count-- == 0) break;\n\t\t\t\t\telse number <<= 1;\n\t\t\t\t}\n\t\t\t\t\n\t\t\t} while (true);\n\n\t\t\treturn number;\n\t\t}\n\n\t} PlanesWalker;\n\n\ttypedef struct File {\n\n\t\tbyte planes;\n\t\tbyte available;\n\t\tbyte hasAlpha;\n\n\t\tui16 width;\n\t\tui16 height;\n\n        const byte *const image;\n        PlanesWalker *p;\n\n\t\tFile(const byte *const _image) : image(_image){\n\n\t\t\tbyte headerHigh = *(image + 0);\n\t\t\tbyte headerLow  = *(image + 1);\n\n\t\t\tavailable = (headerHigh & 0b11111000) >> 3 == PRIPS_FILE_SIGNATURE;\n\t\t\tavailable = available && (headerLow & 0b11000000) >> 6 == PRIPS_FILE_VERSION;\n\n\t\t\tif (!available) return;\n\n\t\t\tplanes \t= (byte) (headerHigh & 0b00000111);\t\n\t\t\twidth \t= pow(2, 2 + ((byte) (headerLow & 0b00111000) >> 3));\n\t\t\theight \t= pow(2, 2 + ((byte) (headerLow & 0b00000111)));\n\n            p = NULL;\n\t\t}\n\n\t\tinline ui32 planesStart(){\n\t\t\treturn 2 + pow(2, planes); // 2 bytes header + (n * colors)\n\t\t}\n\n\t\tunsigned short color(ui16 index) {\n\t\t\treturn *(image + (2 + index)); // 2 bytes header + (n * colors)\n\t\t}\n\n\t\tbyte* decompress(){\n\t\t\t\n\t\t\tif (!available) return NULL;\n\t\t\tbyte *buffer = (byte*) malloc(height * width * sizeof(byte));\n\t\t\tui32 planePadding = 0;\n\t\t\thasAlpha = false;\n\n\t\t\tfor(ui16 pln = 0; pln < planes; pln++){\n\n\t\t\t\tp = new PlanesWalker(planesStart() + planePadding, (const byte *const) image);\n\t\t\t\tplanePadding += p->sizeInBytes;\n\n\t\t\t\tfor (ui16 y = 0; y < height; y++) {\n\t\t\t\t\tfor (ui16 x = 0; x < width; x++) {\n\t\t\t\t\t\tbyte b = pln ? *(buffer + (x + y * width)) : 0;\n\t\t\t\t\t\tb = (b <<= 1) | p->nextPixelColor();\n\t\t\t\t\t\t*(buffer + (x + y * width)) = b;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tdelete p;\n\t\t\t\tp == NULL;\n\t\t\t}\n\n\t\t\tfor (ui16 y = 0; y < height; y++) {\n\t\t\t\tfor (ui16 x = 0; x < width; x++) {\n\t\t\t\t\tconst byte c = color(*(buffer + (x + y * width)));\n\t\t\t\t\t*(buffer + (x + y * width)) = c;\n\t\t\t\t\tif (c == 0) hasAlpha = true;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\treturn buffer;\n\t\t}\n\n\t} File; \n\n\ttypedef struct Drawable {\n\t\t\n\t\tbyte width;\n\t\tbyte height;\n\t\tbyte hasAlpha;\n\t\tbyte *decompressed;\n\n\t\tDrawable(const byte *const data) {\n\t\t\t\n\t\t\tFile *parser = new File(data);\n\t\t\t\n\t\t\twidth = parser->width;\n\t\t\theight = parser->height;\n\t\t\tdecompressed = parser->decompress();\n\t\t\thasAlpha = parser->hasAlpha;\n\n\t\t\tdelete parser;\n\t\t\tparser = NULL;\n\t\t}\n\n\t\tvoid draw(const byte x, const byte y) {\n\t\t\tlvDisplay.blit(lv::Region( x, y, width, height), decompressed);\n\t\t}\n\n\t\t~Drawable(){\n\t\t\tfree(decompressed);\n\t\t\tdecompressed = NULL;\n\t\t}\n\n\t} Drawable;\n}\n\n#endif\n\nnamespace PNG {\n\tconst unsigned char raw_{{filename}}[] = {{hex}};\n\tPrips::Drawable *{{filename}};\n};\n\n";
export declare const decoder_template_on_enter = "\n\tPNG::{{filename}} = new Prips::Drawable( (const Prips::byte *const) &PNG::raw_{{filename}});\n";
export declare const decoder_template_on_exit = "\n\tdelete PNG::{{filename}};\n\tPNG::{{filename}} = nil;\n";
