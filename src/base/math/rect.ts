/// <reference path="math.ts" />

namespace base {
    export class Rect {
        public position: Vec2;
        public size: Vec2;

        constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
            this.position = new Vec2(x,y);
            this.size = new Vec2(w,h);
        }

        /**
         * Test if a point is inside this rectangle
         */
        public isPointInside(v: Vec2): boolean {
            return this.isPointInsideXY(v.x,v.y);
        }

        public isPointInsideXY(x: number, y: number): boolean {
            var x0 = this.position.x;
            var x1 = x0 + this.size.x;
            var y0 = this.position.y;
            var y1 = y0 + this.size.y;
            if(x0 > x1) { var t = x0; x0 = x1; x1 = t; }
            if(y0 > y1) { var t = y0; y0 = y1; y1 = t; }

            return x >= x0 && x < x1 && y >= y0 && y < y1;
        }

        /**
         * Test if this rectangle intersects another rectangle
         */
        public intersectsRect(r: Rect): boolean {
            var x0 = this.position.x;
            var x1 = x0 + this.size.x;
            var y0 = this.position.y;
            var y1 = y0 + this.size.y;
            if(x0 > x1) { var t = x0; x0 = x1; x1 = t; }
            if(y0 > y1) { var t = y0; y0 = y1; y1 = t; }

            var x2 = r.position.x;
            var y2 = r.position.y;
            var x3 = x2 + r.size.x;
            var y3 = y2 + r.size.y;
            if(x2 > x3) { var t = x2; x2 = x3; x3 = t; }
            if(y2 > y3) { var t = y2; y2 = y3; y3 = t; }

            var xtest: boolean = !(x0 > x3 || x1 < x2);
            var ytest: boolean = !(y0 > y3 || y1 < y2);

            return xtest && ytest;
        }

        public getRandomPoint(): Vec2 {
            var v = new Vec2();
            v.x = this.position.x + Math.random() * this.size.x;
            v.y = this.position.y + Math.random() * this.size.y;
            return v;
        }

        /**
         * Modify a Rect object so that it's contained inside this Rect.
         * @return true if parameter Rect was modified
         */
        public confine(r: Rect): boolean {
            var cx = this.confineX(r);
            return this.confineY(r) || cx;
        }

        /**
         * Modify a Rect object's X positionc omponent so that it's contained inside this Rect.
         * @return true if parameter Rect was modified
         */
        public confineX(r: Rect): boolean {
            var x = r.position.x;
            r.position.x = clamp(x,this.position.x,this.position.x + this.size.x - r.size.x);
            return x != r.position.x;
        }

        /**
         * Modify a Rect object's Y position component so that it's contained inside this Rect.
         * @return true if parameter Rect was modified
         */
        public confineY(r: Rect): boolean {
            var y = r.position.y;
            r.position.y = clamp(y,this.position.y,this.position.y + this.size.y - r.size.y);
            return y != r.position.y;
        }

    }

}
