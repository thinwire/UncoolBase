/// <reference path="../base.ts" />

namespace base {

    /**
     * Simple disposable tween object
     */
    export class Tween {
        private _onComplete: () => void;
        private _onProgress: (bias: number) => void;
        private _ease: (k:number) => number;

        private _duration: number;
        private _elapsed: number;

        constructor(duration_msec: number, 
            ease: (k:number) => number, 
            onProgress: (bias: number) => void,
            onComplete: () => void = () => {}) {

            this._duration = duration_msec;
            this._elapsed = 0;
            this._ease = ease;
            this._onProgress = onProgress;
            this._onComplete = onComplete;
        }

        public start(): void {
            this._elapsed = 0;
            this._onProgress(this._ease(this._elapsed / this._duration));
            base.addTween(this);
        }

        public stop(): void {
            base.removeTween(this);
        }

        public cancel(): void {
            base.removeTween(this);
            this._onProgress(this._ease(0));
            this._elapsed = 0;
        }

        public update(delta_millis: number): void {
            var e = this._elapsed + delta_millis;
            if(e > this._duration) {
                this._onProgress(this._ease(1));
                this._elapsed = 0;
                base.removeTween(this);
                this._onComplete();
            } else {
                this._onProgress(this._ease(e / this._duration));
            }
            this._elapsed = e;
        }
    }
}
