/// <reference path="../base.ts" />

namespace base {

    /**
     * Repeating timer object.
     */
    export class Timer {

        private _callback: () => void;
        private _interval: number;
        private _elapsed: number;

        constructor(callback: () => void, interval: number = 30) {
            this._callback = callback;
            this._interval = interval;
            this._elapsed = 0;
        }

        public getInterval(): number {
            return this._interval;
        }

        public setInterval(msec: number): Timer {
            this._interval = Math.max(1, msec);
            return this;
        }

        public reset(): Timer {
            this._elapsed = 0;
            return this;
        }

        /**
         * Shorthand for base.addTimer(mytimer)
         */
        public start(): Timer {
            base.addTimer(this);
            return this;
        }

        /**
         * Shorthand for base.removeTimer(mytimer)
         */
        public stop(): Timer {
            base.removeTimer(this);
            return this;
        }

        /**
         * Update timer by a certain number of milliseconds
         */
        public update(elapsed_msec: number): Timer {
            var e = this._elapsed - elapsed_msec;
            while(e > this._interval) {
                this._callback();
                e -= this._interval;
            }
            this._elapsed = e;
            return this;
        }
    }
}
