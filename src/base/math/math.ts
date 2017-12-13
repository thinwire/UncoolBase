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
}
