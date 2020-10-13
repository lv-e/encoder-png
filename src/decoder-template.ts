
export function replaceAll(subject:string, search:string, replace:string) : string {
    return subject.split(search).join(replace);
}

export const decoder_template_declarations = `

#ifndef PRIPS_DECODER
#define PRIPS_DECODER

#define PRIPS_FILE_VERSION 		0b01
#define PRIPS_FILE_SIGNATURE 	0b01100

#include <math.h>
#include <stdlib.h>

namespace Prips{

	typedef unsigned char byte;
	typedef unsigned short ui16;
	typedef unsigned int ui32;

	typedef struct PlanesWalker {

		ui32 byteStart;
		ui32 sizeInBytes;

        const byte *const image;
		
		ui32 cursor;
		ui32 currentByte;
		ui32 buffer;

		ui32 rleBuffer;
		ui32 currentColorBit;

		PlanesWalker(ui32 _byteStart, const byte *const _image) : byteStart(_byteStart), image(_image){
            rewind();
		}

        void rewind(){

            buffer = 8;
			cursor = byteStart;
			currentByte = *(image + cursor);

			sizeInBytes = advance();
			goToNextByte();
			sizeInBytes += cursor - byteStart;

			pickFirstBit();
			rleBuffer = advance();

        }

		inline ui32 nextPixelColor(){

			if(--rleBuffer == 0){
				rleBuffer = advance();
				currentColorBit = !currentColorBit;
			}

			return currentColorBit;
		}

		inline void pickFirstBit(){
			currentColorBit = (currentByte & 0x80) >> 7;
			currentByte <<= 1;
			buffer--;
		}

		inline void goToNextByte(){
			currentByte = *(image + ++cursor);
			buffer = 8;
		}

		ui32 advance(){

			ui32 bit = 0;
			ui32 number = 0;
			ui32 count = 0;
			ui32 counting = 1;

			do {
				
				bit = (currentByte & 0x80);

				currentByte <<= 1;
				buffer--;

				if(!buffer) goToNextByte();

				if (counting) {
					if(!bit) count++;
					else counting = false;	
				} 

				if (!counting) {
					number |= bit == 0 ? 0 : 1;
					if(count-- == 0) break;
					else number <<= 1;
				}
				
			} while (true);

			return number;
		}

	} PlanesWalker;

	typedef struct File {

		byte planes;
		byte available;
		byte hasAlpha;

		ui16 width;
		ui16 height;

        const byte *const image;
        PlanesWalker *p;

		File(const byte *const _image) : image(_image){

			byte headerHigh = *(image + 0);
			byte headerLow  = *(image + 1);

			available = (headerHigh & 0b11111000) >> 3 == PRIPS_FILE_SIGNATURE;
			available = available && (headerLow & 0b11000000) >> 6 == PRIPS_FILE_VERSION;

			if (!available) return;

			planes 	= (byte) (headerHigh & 0b00000111);	
			width 	= pow(2, 2 + ((byte) (headerLow & 0b00111000) >> 3));
			height 	= pow(2, 2 + ((byte) (headerLow & 0b00000111)));

            p = NULL;
		}

		inline ui32 planesStart(){
			return 2 + pow(2, planes); // 2 bytes header + (n * colors)
		}

		unsigned short color(ui16 index) {
			return *(image + (2 + index)); // 2 bytes header + (n * colors)
		}

		byte* decompress(){
			
			if (!available) return NULL;
			byte *buffer = (byte*) malloc(height * width * sizeof(byte));
			ui32 planePadding = 0;
			hasAlpha = false;

			for(ui16 pln = 0; pln < planes; pln++){

				p = new PlanesWalker(planesStart() + planePadding, (const byte *const) image);
				planePadding += p->sizeInBytes;

				for (ui16 y = 0; y < height; y++) {
					for (ui16 x = 0; x < width; x++) {
						byte b = pln ? *(buffer + (x + y * width)) : 0;
						b = (b <<= 1) | p->nextPixelColor();
						*(buffer + (x + y * width)) = b;
					}
				}

				delete p;
				p == NULL;
			}

			for (ui16 y = 0; y < height; y++) {
				for (ui16 x = 0; x < width; x++) {
					const byte c = color(*(buffer + (x + y * width)));
					*(buffer + (x + y * width)) = c;
					if (c == 0) hasAlpha = true;
				}
			}

			return buffer;
		}

	} File; 

	typedef struct Drawable {
		
		byte width;
		byte height;
		byte hasAlpha;
		byte *decompressed;

		Drawable(const byte *const data) {
			
			File *parser = new File(data);
			
			width = parser->width;
			height = parser->height;
			decompressed = parser->decompress();
			hasAlpha = parser->hasAlpha;

			delete parser;
			parser = NULL;
		}

		void draw(const byte x, const byte y) {
			lvDisplay.blit(lv::Region( x, y, width, height), decompressed);
		}

		~Drawable(){
			free(decompressed);
			decompressed = NULL;
		}

	} Drawable;
}

#endif

namespace PNG {
	const unsigned char raw_{{filename}}[] = {{hex}};
	Prips::Drawable *{{filename}};
};

`
export const decoder_template_on_enter = `
	PNG::{{filename}} = new Prips::Drawable( (const Prips::byte *const) &PNG::raw_{{filename}});
`

export const decoder_template_on_exit = `
	delete PNG::{{filename}};
	PNG::{{filename}} = nil;
`