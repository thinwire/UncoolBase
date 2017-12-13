/// <reference path="math.ts" />

namespace base {

    /** Linear interpolation */
    export function lerp(bias: number, from: number, to: number): number {
        return (to - from) * bias + from;
    }

    export function parabola(bias: number, min: number, max: number): number {
		var c = max - min;
		var a = -4 * c;
		var x = bias - 0.5;
		return (a * (x * x) + c) + min;
    }

}
