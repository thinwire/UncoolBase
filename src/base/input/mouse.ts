/// <reference path="../base.ts" />

namespace base {

    export enum MouseButton {
        LEFT = 0,
        MIDDLE = 1,
        RIGHT = 2,
        WHEEL_UP = 4,
        WHEEL_DOWN = 5
    }

    export class Mouse {

        private _position_actual: Vec2 = new Vec2();
        private _position_current: Vec2 = new Vec2();
        private _position_last: Vec2 = new Vec2();
        private _position_delta: Vec2 = new Vec2();

        private _buttons_actual: boolean[] = [];
        private _buttons_current: boolean[] = [];
        private _buttons_last: boolean[] = [];

        constructor() {
            for(var i = 0; i < 6; ++i) {
                this._buttons_actual[i] = false;
                this._buttons_current[i] = false;
                this._buttons_last[i] = false;
            }
        }

        public mouseMoved(x: number, y: number): void {
            this._position_actual.x = x;
            this._position_actual.y = y;
        }

        public buttonDown(idx: number): void {
            this._buttons_actual[idx] = true;
        }

        public buttonUp(idx: number): void {
            this._buttons_actual[idx] = false;
        }

        public getX(): number {
            return this._position_current.x;
        }

        public getY(): number {
            return this._position_current.y;
        }

        public getPosition(): Vec2 {
            return this._position_current;
        }

        public getLastX(): number {
            return this._position_last.x;
        }

        public getLastY(): number {
            return this._position_last.y;
        }

        public getLastPosition(): Vec2 {
            return this._position_last;
        }

        public getDeltaX(): number {
            return this._position_delta.x;
        }

        public getDeltaY(): number {
            return this._position_delta.y;
        }

        public getDelta(): Vec2 {
            return this._position_delta;
        }

        public isButtonDown(idx: number): boolean {
            return this._buttons_current[idx];
        }

        public isButtonPressed(idx: number): boolean {
            return this._buttons_current[idx] && !this._buttons_last[idx];
        }

        public isButtonReleased(idx: number): boolean {
            return !this._buttons_current[idx] && this._buttons_last[idx];
        }

        public isButtonHeld(idx: number): boolean {
            return this._buttons_current[idx] && this._buttons_last[idx];
        }

        public update(): void {
            this._position_last.set(this._position_current);
            this._position_current.set(this._position_actual);
            this._position_delta.set(this._position_current).subtract(this._position_last);

            for(var i = 0; i < 6; ++i) {
                this._buttons_last[i] = this._buttons_current[i];
                this._buttons_current[i] = this._buttons_actual[i];
            }

            // Clear mouse wheel
            this._buttons_actual[MouseButton.WHEEL_UP] = false;
            this._buttons_actual[MouseButton.WHEEL_DOWN] = false;
        }

    }

}
