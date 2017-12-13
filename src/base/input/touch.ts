/// <reference path="../base.ts" />

namespace base {

    /**
     * Janky single-coordinate touch abstraction
     */
    export class Touch {

        private _position_cur: base.Vec2;
        private _position_last: base.Vec2;
        private _position_act: base.Vec2;
        private _delta: base.Vec2;
        private _tm_last_touch: number;
        private _tapped_act: boolean;
        private _tapped: boolean;
        private _down: boolean;

        constructor() {
            this._position_act = new base.Vec2();
            this._position_cur = new base.Vec2();
            this._position_last = new base.Vec2();
            this._delta = new base.Vec2();
            this._tm_last_touch = 0;
            this._tapped_act = false;
            this._tapped = false;
            this._down = false;
        }

        public getPosition(): base.Vec2 {
            return this._position_cur;
        }

        public getPositionLast(): base.Vec2 {
            return this._position_last;
        }

        public getDelta(): base.Vec2 {
            return this._delta;
        }

        public getDeltaX(): number {
            return this._delta.x;
        }

        public getDeltaY(): number {
            return this._delta.y;
        }

        public isDown(): boolean {
            return this._down;
        }

        public isTapped(): boolean {
            return this._tapped;
        }

        public update(): void {
            this._position_last.set(this._position_cur);
            this._position_cur.set(this._position_act);
            this._delta.set(this._position_cur);
            this._delta.subtract(this._position_last);
            this._tapped = this._tapped_act;
            this._tapped_act = false;
        }

        public updateTouchPosition(x: number, y: number): void {
            this._position_act.setXY(x,y);
        }

        public touchStart(): void {
            this._position_cur.set(this._position_act);
            this._position_last.set(this._position_cur);
            this._tm_last_touch = base.getTimeCurrent();
            this._tapped_act = false;
            this._down = true;
        }

        public touchEnd(): void {
            var tm = base.getTimeCurrent();
            this._tapped_act = tm - this._tm_last_touch < 500;
            this._down = false;
        }

    }

}
