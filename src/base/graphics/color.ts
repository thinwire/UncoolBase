/// <reference path="../base.ts" />

namespace base {

    export class Color {

        public static BLACK = new Color(0,0,0,255);
        public static WHITE = new Color(255,255,255,255);
        public static TRANSPARENT = new Color(0,0,0,0);
        public static RED = new Color(255,0,0,255);
        public static GREEN = new Color(0,255,0,255);
        public static BLUE = new Color(0,0,255,255);
        public static CYAN = new Color(0,255,255,255);
        public static MAGENTA = new Color(255,0,255,255);
        public static YELLOW = new Color(255,255,0,255);

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////
        //////////////////////////////////////////////////

        private _r: number;
        private _g: number;
        private _b: number;
        private _a: number;

        private _string: string;
        private _dirty: boolean;

        constructor(
            r: number = 255,
            g: number = 255,
            b: number = 255,
            a: number = 255) {

            this._r = clamp(r,0,255);
            this._g = clamp(g,0,255);
            this._b = clamp(b,0,255);
            this._a = clamp(a,0,255);
            this._dirty = true;
            this.asString();
        }

        public setR(r: number): Color {
            this._r = clamp(r,0,255);
            this._dirty = true;
            return this;
        }

        public setG(g: number): Color {
            this._g = clamp(g,0,255);
            this._dirty = true;
            return this;
        }

        public setB(b: number): Color {
            this._b = clamp(b,0,255);
            this._dirty = true;
            return this;
        }

        public setA(a: number): Color {
            this._a = clamp(a,0,255);
            this._dirty = true;
            return this;
        }

        public set(c: Color): Color {
            this._r = c._r;
            this._g = c._g;
            this._b = c._b;
            this._a = c._a;
            if(c._dirty) {
                this._dirty = true;
            } else {
                this._string = c._string;
                this._dirty = false;
            }
            return this;
        }

        public setRGBA(r: number, g: number, b: number, a: number): Color {
            this._r = clamp(r,0,255);
            this._g = clamp(g,0,255);
            this._b = clamp(b,0,255);
            this._a = clamp(a,0,255);
            this._dirty = true;
            return this;
        }

        public getR(): number {
            return this._r;
        }

        public getG(): number {
            return this._g;
        }

        public getB(): number {
            return this._b;
        }

        public getA(): number {
            return this._a;
        }

        public asString(): string {
            if(this._dirty) {
                this._string = 'rgba(' + (this._r | 0) + ',' + (this._g | 0) + ',' + (this._b | 0) + ',' + (this._a / 255.0) + ')';
                this._dirty = false;
            }
            return this._string;
        }

        public equals(c: Color): boolean {
            return this._r === c._r
                && this._g === c._g
                && this._b === c._b
                && this._a === c._a;
        }

    }

}
