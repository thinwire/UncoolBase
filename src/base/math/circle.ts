/// <reference path="math.ts" />

namespace base {
    export class Circle {
        public position: Vec2;
        public radius: number;

        constructor(x: number = 0, y: number = 0, radius: number = 0) {
            this.position = new Vec2(x,y);
            this.radius = radius;
        }

        public isPointInside(v: Vec2): boolean {
            return this.isPointInsideXY(v.x,v.y);
        }

        public isPointInsideXY(x: number, y: number): boolean {
            var dx = this.position.x - x;
            var dy = this.position.y - y;
            return Math.sqrt(dx * dx + dy * dy) < this.radius;
        }

        public intersects(c: Circle): boolean {
            var dx = this.position.x - c.position.x;
            var dy = this.position.y - c.position.y;
            var ddx = dx * dx;
            var ddy = dy * dy;
            
            return Math.sqrt(ddx + ddy) < (this.radius + c.radius);
        }
    }
}
