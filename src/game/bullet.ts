/// <reference path="game.ts" />
/// <reference path="actor.ts" />

namespace game {

    export class Bullet extends Actor {

        private _sound: base.Sound;
        private _direction: base.Vec2;
        private _speed: number;
        private _temp: base.Vec2;
        
        constructor() {
            super(new base.Sprite(base.getLoader().getImage("laser")));
            this._sound = base.getLoader().getSound("laser");
            this._direction = new base.Vec2();
            this._speed = 100;
            this._temp = new base.Vec2();
        }
        
        public setDirection(d: base.Vec2): void {
            this._direction.set(d).normalize();
        }

        public setSpeed(spd: number): void {
            this._speed = spd;
        }

        public update(): void {            
            if(this.isAlive()) {
                this._temp.set(this._direction).multiplyXY(this._speed);
                this.getSprite().move(this._temp);
            }

        }

    }

}
