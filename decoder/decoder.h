#ifndef PRIPS_DECODER
#define PRIPS_DECODER

#include <stdlib.h>

#if VERBOSE
#define LOG(message, args...)     printf(message, ## args)
#else
#define LOG(message, args...)
#endif

#define PRIPS_FILE_VERSION 		0b01
#define PRIPS_FILE_SIGNATURE 	0b01100

#include <math.h>

namespace Prips{

	typedef unsigned char Byte;
	typedef unsigned short ui16;
	typedef unsigned int ui32;

	typedef struct PlanesWalker {

		ui32 byteStart;
        const Byte *const image;
		ui32 sizeInBytes;
		
		ui32 cursor;
		ui32 currentByte;
		ui32 buffer;

		ui32 rleBuffer;
		ui32 currentColorBit;

		PlanesWalker(ui32 _byteStart, const Byte *const _image) : byteStart(_byteStart), image(_image){
            rewind();
		}

        void rewind(){

            buffer = 8;
			cursor = byteStart;
			currentByte = *(image + cursor);

			sizeInBytes = advance();
			goToNextByte();
			sizeInBytes += cursor;

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

		Byte planes;
		Byte available;

		ui16 width;
		ui16 height;

        const Byte *const image;
        PlanesWalker *p;

		File(const Byte *const _image) : image(_image){

			Byte headerHigh = *(image + 0);
			Byte headerLow  = *(image + 1);

			available = (headerHigh & 0b11111000) >> 3 == PRIPS_FILE_SIGNATURE;
			available = available && (headerLow & 0b11000000) >> 6 == PRIPS_FILE_VERSION;

			if (!available) return;

			planes 	= (Byte) (headerHigh & 0b00000111);	
			width 	= pow(2, 2 + ((Byte) (headerLow & 0b00111000) >> 3));
			height 	= pow(2, 2 + ((Byte) (headerLow & 0b00000111)));

            p = new PlanesWalker(planesStart(), (const Byte *const) image);
		}

		~File(){
			delete p;
		}

		inline ui32 planesStart(){
			return 2 + planes * 2; // 2 bytes header + (n * colors)
		}

		unsigned short color(ui16 index) {
			return *(image + 2 + index); // 2 bytes header + (n * colors)
		}

		Byte* decompress(){
			
			if (!available) return NULL;

            ui32 colorA = color(0);
            ui32 colorB = color(1);
            
			Byte *buffer = (Byte*) malloc(height * width * sizeof(Byte));

			for (int y = 0; y < height; y++) {
				for (int x = 0; x < width; x++) {
					*(buffer + x + y * width) = p->nextPixelColor() ? colorA : colorB;
				}
			}

			return buffer;
		}

	} File; 
}

#endif