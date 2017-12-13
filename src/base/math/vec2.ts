/// <reference path="math.ts" />

namespace base {
    export class Vec2 {

        public static ZERO: Vec2 = new Vec2(0,0);

        public x: number;
        public y: number;

        constructor(x: number = 0, y: number = 0) {
            this.x = x;
            this.y = y;
        }

        public length(): number {
            var dx = this.x * this.x;
            var dy = this.y * this.y;
            return Math.sqrt(dx + dy);
        }

        public normalize(): Vec2 {
            var l = 1.0 / this.length();
            this.x *= l;
            this.y *= l;
            return this;
        }

        public invert(): Vec2 {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        }

        public invertX(): Vec2 {
            this.x = -this.x;
            return this;
        }

        public invertY(): Vec2 {
            this.y = -this.y;
            return this;
        }

        public set(v: Vec2): Vec2 {
            this.x = v.x;
            this.y = v.y;
            return this;
        }

        public setXY(x: number, y: number): Vec2 {
            this.x = x;
            this.y = y;
            return this;
        }

        public clamp(min: Vec2, max: Vec2): Vec2 {
            return this.clampXY(min.x,max.x,min.y,max.y);
        }

        public clampX(xmin: number, xmax: number): Vec2 {
            if(this.x < xmin) this.x = xmin;
            if(this.x > xmax) this.x = xmax;
            return this;
        }

        public clampY(ymin: number, ymax: number): Vec2 {
            if(this.y < ymin) this.y = ymin;
            if(this.y > ymax) this.y = ymax;
            return this;
        }

        public clampXY(xmin: number, xmax: number, ymin: number, ymax: number): Vec2 {
            this.clampX(xmin,xmax);
            this.clampY(ymin,ymax);
            return this;
        }

        public add(v: Vec2): Vec2 {
            this.x += v.x;
            this.y += v.y;
            return this;
        }

        public addXY(x: number, y: number): Vec2 {
            this.x += x;
            this.y += y;
            return this;
        }

        public subtract(v: Vec2): Vec2 {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        }

        public subtractXY(x: number, y: number): Vec2 {
            this.x -= x;
            this.y -= y;
            return this;
        }

        public multiply(v: Vec2): Vec2 {
            this.x *= v.x;
            this.y *= v.y;
            return this;
        }

        public multiplyXY(x: number, y: number = x): Vec2 {
            this.x *= x;
            this.y *= y;
            return this;
        }
    }
}
