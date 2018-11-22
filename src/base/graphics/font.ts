/// <reference path="../base.ts" />

namespace base {

    export class Glyph {
        public x: number = 0;
        public y: number = 0;
        public w: number = 16;
        public h: number = 16;
        public xoffset: number = 0;
        public yoffset: number = 0;
        public advance: number = 16;
        public kerning = {};
    }

    export class Font {
        private _image: ImageSource;
        private _lineHeight: number;
        private _lineBase: number;
        private _glyphs: {};

        constructor(image: ImageSource) {
            this._image = image;
            this._lineHeight = 12;
            this._lineBase = 0;
            this._glyphs = {};
        }

        public getImage(): ImageSource {
            return this._image;
        }

        public getLineHeight(): number {
            return this._lineHeight;
        }

        public getLineBase(): number {
            return this._lineBase;
        }

        public defineGlyph(
            c: string,
            x: number,
            y: number,
            w: number,
            h: number,
            xoffset: number,
            yoffset: number,
            advance: number): Font {
            
            var g = new Glyph();
            g.x = x;
            g.y = y;
            g.w = w;
            g.h = h;
            g.xoffset = xoffset;
            g.yoffset = yoffset;
            g.advance = advance;

            this._glyphs[c] = g;

            return this;
        }

        public defineKerning(
            c: string,
            next: string,
            kern: number): Font {

            var g = this._glyphs[c];
            if(!g) {
                return null;
            }
            g.kerning[next] = kern;
            return this;
        }

        public getGlyph(c: string): Glyph {
            var g = this._glyphs[c];
            if(!g) return null;
            return g;
        }

        public getKerning(c: string, next: string): number {
            var g = this.getGlyph(c);
            if(!g) return 0;
            var k = g.kerning[next];
            if(!k) return 0;
            return k;
        }

        private parseCommon(xml: any): void {
            var lineHeight = parseInt(xml.getAttribute('lineHeight'));
            var lineBase = parseInt(xml.getAttribute('base'));
            this._lineHeight = lineHeight;
            this._lineBase = lineBase;
        }

        private parseChars(xml: any): void {
            var i = 0;
            var c = xml.childNodes[0];
            while(c != undefined) {
                if(c.nodeName === 'char') {
                    this.parseChar(c);
                }
                c = xml.childNodes[++i];
            }
        }

        private parseChar(xml: any): void {
            var code = parseInt(xml.getAttribute('id'));
            var x = parseInt(xml.getAttribute('x'));
            var y = parseInt(xml.getAttribute('y'));
            var w = parseInt(xml.getAttribute('width'));
            var h = parseInt(xml.getAttribute('height'));
            var xoffset = parseInt(xml.getAttribute('xoffset'));
            var yoffset = parseInt(xml.getAttribute('yoffset'));
            var advance = parseInt(xml.getAttribute('xadvance'));

            this.defineGlyph(
                String.fromCharCode(code),
                x, y,
                w, h,
                xoffset,
                yoffset,
                advance);
        }

        private parseKernings(xml: any): void {
            var i = 0;
            var c = xml.childNodes[0];
            while(c != undefined) {
                if(c.nodeName === 'kerning') {
                    this.parseKern(c);
                }
                c = xml.childNodes[++i];
            }
        }

        private parseKern(xml: any): void {
            var code = parseInt(xml.getAttribute('first'));
            var next = parseInt(xml.getAttribute('second'));
            var kern = parseInt(xml.getAttribute('amount'));

            this.defineKerning(
                String.fromCharCode(code),
                String.fromCharCode(next),
                kern);
        }

        public initFromXML(xml: XMLDocument): Font {

            var c = (<any>xml.firstChild.firstChild);
            while(c != null) {

                if(c.nodeName === 'common') {
                    this.parseCommon(c);
                } else if(c.nodeName === 'chars') {
                    this.parseChars(c);
                } else if(c.nodeName === 'kernings') {
                    this.parseKernings(c);
                }

                c = c.nextSibling;
            }

            return this;
        }

    }
    
}
