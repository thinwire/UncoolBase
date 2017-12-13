/// <reference path="math.ts" />

namespace base {

    /**
     * Clipped 3x3 matrix for 2D affine transforms
     */
    export class Matrix {

        public static IDENTITY: Matrix = new Matrix();

        public a: number;
        public b: number;
        public c: number;
        public d: number;
        public tx: number;
        public ty: number;

        constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }

        public set(m: Matrix): Matrix {
            this.a = m.a;
            this.b = m.b;
            this.c = m.c;
            this.d = m.d;
            this.tx = m.tx;
            this.ty = m.ty;
            return this;
        }

        public clone(): Matrix {
            return new Matrix(this.a,this.b,this.c,this.d,this.tx,this.ty);
        }

        public prepend(m: Matrix): Matrix {
            var a = m.a * this.a + m.c * this.b;
            var b = m.b * this.a + m.d * this.b;
            var c = m.a * this.c + m.c * this.d;
            var d = m.b * this.c + m.d * this.d;
            var tx = m.a * this.tx + m.c * this.ty + m.tx;
            var ty = m.b * this.tx + m.d * this.ty + m.ty;

            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;

            return this;
        }

        public multiply(m: Matrix): Matrix {
            var a = this.a * m.a + this.c * m.b;
            var b = this.b * m.a + this.d * m.b;
            var c = this.a * m.c + this.c * m.d;
            var d = this.b * m.c + this.d * m.d;
            var tx = this.a * m.tx + this.c * m.ty + this.tx;
            var ty = this.b * m.tx + this.d * m.ty + this.ty;

            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;

            return this;
        }

        public scale(s: Vec2): Matrix {
            return this.scaleXY(s.x,s.y);
        }

        public scaleXY(sx: number, sy: number): Matrix {
            this.a *= sx;
            this.b *= sx;
            this.c *= sy;
            this.d *= sy;
            return this;
        }
        
        /**
         * Rotate matrix around Z axis by z radians
         */
        public rotate(z: number): Matrix {

            var ca = Math.cos(z);
            var sa = Math.sin(z);

            var ta = this.a;
            var tb = this.b;
            var tc = this.c;
            var td = this.d;

            this.a = (ta * ca) - (tc * sa);
            this.b = (tb * ca) - (td * sa);
            this.c = (ta * sa) + (tc * ca);
            this.d = (tb * sa) + (td * ca);

            return this;
        }

        public translate(d: Vec2): Matrix {
            return this.translateXY(d.x,d.y);
        }

        public translateXY(dx: number, dy: number): Matrix {
            var x = this.tx + this.a * dx + this.c * dy;
            var y = this.ty + this.b * dx + this.d * dy;
            this.tx = x;
            this.ty = y;
            return this;
        }

        public identity(): Matrix {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;
            return this;
        }

        public determinant(): number {
            var xx = this.a;
            var xy = this.b;
            var xz = .0;

            var yx = this.c;
            var yy = this.d;
            var yz = .0;

            var zx = this.tx;
            var zy = this.ty;
            var zz = 1.0;

            var determinant = + xx * (yy * zz - zy * yz)
                              - xy * (yx * zz - yz * zx)
                              + xz * (yx * zy - yy * zx);

            return determinant;
        }

        public normalize(): Matrix {
            
            var lx = 1.0 / Math.sqrt(this.a * this.a + this.b * this.b);
            var ly = 1.0 / Math.sqrt(this.c * this.c + this.d * this.d);
            var lt = 1.0 / Math.sqrt(this.tx * this.tx + this.ty * this.ty);

            this.a *= lx;
            this.b *= lx;
            this.c *= ly;
            this.d *= ly;
            this.tx *= lt;
            this.ty *= lt;

            return this;
        }

        public invert(): Matrix {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            var tx1 = this.tx;
            var ty1 = this.ty;
            var n = 1.0 / (a1 * d1 - b1 * c1);

            this.a = d1 * n;
            this.b = -b1 * n;
            this.c = -c1 * n;
            this.d = a1 * n;
            this.tx = (c1 * ty1 - d1 * tx1) * n;
            this.ty = -(a1 * ty1 - b1 * tx1) * n;

            return this;
        }

        public projectXY(x: number, y: number, target: Vec2 = new Vec2()): Vec2 {
            target.x = x * this.a +
                       y * this.c +
                           this.tx;
            target.y = x * this.b +
                       y * this.d +
                           this.ty;
            return target;
        }

        public project(p: Vec2, target: Vec2 = new Vec2()): Vec2 {
            var tx = p.x * this.a +
                     p.y * this.c +
                           this.tx;
            var ty = p.x * this.b +
                     p.y * this.d +
                           this.ty;
            target.x = tx;
            target.y = ty;
            return target;
        }

        public equals(m: Matrix): boolean {
            return this.a  === m.a
                && this.b  === m.b
                && this.c  === m.c
                && this.d  === m.d
                && this.tx === m.tx
                && this.ty === m.ty;
        }

        /**
         * Optimized version of matrix build function
         * used by Node and Camera...
         */
        public buildNodeMatrix(pos: Vec2, scale: Vec2, pivot: Vec2, rot: number): Matrix {
            var ca: number = Math.cos(rot);
            var sa: number = Math.sin(rot);
            var a: number = (scale.x * ca);
            var b: number = -(scale.y * sa);
            var c: number = (scale.x * sa);
            var d: number = (scale.y * ca);
            var dx: number = 0;
            var dy: number = 0;
            var tx: number = pos.x + (a * dx + c * dy);
            var ty: number = pos.y + (b * dx + d * dy);

            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;

            return this;
        }

    }

}
