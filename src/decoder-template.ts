let decoder_template = `

#ifndef PRIPS_DECODER
#define PRIPS_DECODER

#include <stdio.h>
#include <math.h>

#define PRIPS_FILE_VERSION 		0b01
#define PRIPS_FILE_SIGNATURE 	0b01100

namespace Prips{

	typedef unsigned char Byte;
	typedef unsigned short ui16;
	typedef unsigned int ui32;

	typedef struct PlanesWalker {

		const Byte *const image;

		ui32 byteStart;
		ui32 sizeInBytes;
		
		ui32 cursor;
		ui32 currentByte;
		ui32 buffer;

		ui32 rleBuffer;
		ui32 currentColorBit;

		PlanesWalker(ui32 _byteStart, const Byte *const _image) : byteStart(_byteStart), image(_image){

			buffer = 8;
			cursor = _byteStart;
			currentByte = *(image + cursor);

			sizeInBytes = advance();
			goToNextByte();
			sizeInBytes += cursor;

			pickFirstBit();
			rleBuffer = advance();

		}

		ui32 nextPixelColor(){

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

			//printf("first color is: %d\n\n", currentColorBit);
		}

		inline void goToNextByte(){
			//if(buffer != 0) printf("skipping %d bits\n", buffer);
			currentByte = *(image + ++cursor);
			//printf("next byte is: %d\n", currentByte);
			buffer = 8;
		}

		ui32 advance(){

			ui32 bit = 0;
			ui32 number = 0;
			ui32 count = 0;
			ui32 counting = 1;

			//printf("advancing\n");
			//printf("byte is: %d\n", currentByte);

			do {
				
				bit = (currentByte & 0x80) >> 7;
				//printf("reading: %d buffer has: %d\n", bit, buffer);

				currentByte <<= 1;
				buffer--;

				if(!buffer) goToNextByte();

				if (counting) {
					if(!bit) count++;
					else {
						counting = false;	
						//printf("bits counted %D\n", count);
					}
				} 

				if (!counting) {
					number |= bit;
					if(count-- == 0) break;
					else number <<= 1;
				}
				
			} while (true);

			//printf("found %d\n\n", number);
			return number;
		}

	} PlanesWalker;

	typedef struct File {

		Byte planes;
		Byte available;

		ui16 width;
		ui16 height;

		File(const Byte image[]){

			Byte headerHigh = image[0];
			Byte headerLow  = image[1];

			available = (headerHigh & 0b11111000) >> 3 == PRIPS_FILE_SIGNATURE;
			available = available && (headerLow & 0b11000000) >> 6 == PRIPS_FILE_VERSION;

			if (!available) return;

			planes 	= (Byte) (headerHigh & 0b00000111);	
			width 	= pow(2, 2 + ((Byte) (headerLow & 0b00111000) >> 3));
			height 	= pow(2, 2 + ((Byte) (headerLow & 0b00000111)));
		}

		inline ui32 planesStart(){
			return 2 + planes * 2; // 2 bytes header + (n * colors)
		}

		unsigned short color(ui16 index) {
			return image[2 + index]; // 2 bytes header + (n * colors)
		}

		void drawBitPlanes(ui16 count){
			PlanesWalker *p = new PlanesWalker(planesStart(), (const Byte *const) &image);
			
			for (int y = 0; y < height; y++) {
				for (int x = 0; x < width; x++) {
					printf("%d", p->nextPixelColor());
				}
				printf("\n");
			}
		}

	} File; 
}

#endif

`