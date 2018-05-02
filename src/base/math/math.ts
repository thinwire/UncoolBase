//
// Math routines
//

/// <reference path="circle.ts" />
/// <reference path="rect.ts" />
/// <reference path="random.ts" />
/// <reference path="vec2.ts" />
/// <reference path="matrix.ts" />
/// <reference path="ease.ts" />
/// <reference path="interpolation.ts" />

namespace base {

    export function sign(x: number): number {
        if(x == 0) return 0;
        return x < 0 ? -1 : 1;
    }

    export function sineWave(low: number, high: number, freq: number, time: number = base.getTimeCurrent()): number {
        var tm = time * (Math.PI * 2 * 0.001);
        var phase = Math.sin(tm * freq);
        var range = (high - low) * .5;
        return phase * range + range + low;
    }

    /**
     * Linearily move towards zero from value by amount
     */
    export function toZero(value: number, amount: number): number {
        if((Math.abs(value) - amount) < 0) return 0;
        if(value > 0) value -= amount;
        else value += amount;
        return value;
    }

    export function clamp(value: number, min: number, max: number): number {
        if(value < min) return min;
        if(value > max) return max;
        return value;
    }

    export function wrap(value: number, min: number, max: number): number {
        if (min == max) {
            return min;
        }
        var v0 = value - min;
        var d = max - min;
        var v1 = v0 - (((v0 / d) | 0) * d);
        return min + v1 + (v1 < .0 ? d : .0);
    }

    export function toRadian(deg: number): number {
        return deg * 0.01745329251994329;
    }

    export function toDegree(rad: number): number {
        return rad * 57.2957795130832892;
    }

    function lineDot(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): number {
        var abx = bx - ax;
        var aby = by - ay;
        var bcx = cx - bx;
        var bcy = cy - by;
        return abx * bcx + aby * bcy;
    }

    function lineCross(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): number {
        var abx = bx - ax;
        var aby = by - ay;
        var acx = cx - ax;
        var acy = cy - ay;
        return abx * acy - aby * acx;
    }

    function lineLength(ax: number, ay: number, bx: number, by: number): number {
        var dx = bx - ax;
        var dy = by - ay;
        return Math.sqrt(dx * dx + dy * dy);
    }

    export function distanceToLineSegment(p: Vec2, lineP0: Vec2, lineP1: Vec2): number {
        return distanceToLineSegmentXY(p.x,p.y,lineP0.x,lineP0.y,lineP1.x,lineP1.y);
    }

    export function distanceToLineSegmentXY(cx: number, cy: number, ax: number, ay: number, bx: number, by: number): number {

        var dist = lineCross(ax,ay,bx,by,cx,cy) / lineLength(ax,ay,bx,by);
        var d1 = lineDot(ax,ay,bx,by,cx,cy);
        var d2 = lineDot(bx,by,ax,ay,cx,cy);

        if(d1 > 0) return lineLength(bx,by,cx,cy);
        if(d2 > 0) return lineLength(ax,ay,cx,cy);
        return Math.abs(dist);

    }
}
