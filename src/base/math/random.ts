/// <reference path="math.ts" />

namespace base {

    /**
     * Rotating double float random number pool.
     * Provides faster random values than Math.random()
     * at the cost of being predictable and attackable.
     */
    export class Random {

        private _data: Float64Array;
        private _size: number;
        private _position: number;

        constructor(size: number = 65536) {
            this._size = size;
            this._data = new Float64Array(size);
            this._position = 0;
            this.init();
        }

        public init(): Random {
            for(var i = 0; i < this._size; ++i) {
                this._data[i] = Math.random();
            }
            return this;
        }

        public next(): number {
            var p = this._position;
            var v = this._data[p];
            this._data[p] = 1.0 - v;
            this._position = (p + 1) % this._size;
            return v;
        }

        public nextInRange(min: number, max: number) {
            var delta = max - min;
            var v = this.next();
            return min + v * delta;
        }
    }
}
