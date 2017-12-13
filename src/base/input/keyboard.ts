/// <reference path="../base.ts" />

namespace base {
    
    export enum Keys {
        LEFT = 37,
        RIGHT =  39,
        UP = 38,
        DOWN = 40,

        SPACE = 32,
        SHIFT = 16,
        CTRL = 17,
        ENTER = 13,
        ESC = 27,

        A = 65,
        B = 66,
        C = 67,
        D = 68,
        E = 69,
        F = 70,
        G = 71,
        H = 72,
        I = 73,
        J = 74,
        K = 75,
        L = 76,
        M = 77,
        N = 78,
        O = 79,
        P = 80,
        Q = 81,
        R = 82,
        S = 83,
        T = 84,
        U = 85,
        V = 86,
        W = 87,
        X = 88,
        Y = 89,
        Z = 90
    }

    export class Keyboard {

        private _actual: boolean[] = [];
        private _current: boolean[] = [];
        private _last: boolean[] = [];
        private _nativeHandlers: Function[] = [];

        constructor() {
            for(var i = 0; i < 386; ++i) {
                this._actual[i] = false;
                this._current[i] = false;
                this._last[i] = false;
            }
        }

        public addNativeHandler(fn: (e: KeyboardEvent) => void) {
            this._nativeHandlers.push(fn);
        }

        public _executeNativeHandlers(e: KeyboardEvent): void {
            for(var i = 0; i < this._nativeHandlers.length; ++i) {
                this._nativeHandlers[i].call(null,e);
            }
        }

        /**
         * Report a key as being down
         */
        public keyDown(sym: number): void {
            this._actual[sym] = true;
        }

        /**
         * Report a key as being up
         */
        public keyUp(sym: number): void {
            this._actual[sym] = false;
        }

        public isKeyDown(sym: number): boolean {
            return this._current[sym];
        }

        public isKeyPressed(sym: number): boolean {
            return this._current[sym] && !this._last[sym];
        }

        public isKeyReleased(sym: number): boolean {
            return !this._current[sym] && this._last[sym];
        }

        public isKeyHeld(sym: number): boolean {
            return this._current[sym] && this._last[sym];
        }

        public update(): void {
            for(var i: number = 0; i < 386; ++i) {
                this._last[i] = this._current[i];
                this._current[i] = this._actual[i];
            }
        }
    }
}
