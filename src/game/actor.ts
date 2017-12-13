/// <reference path="game.ts" />

namespace game {

    export class Actor {

        private _sprite: base.Sprite;
        private _bounds: base.Rect;
        private _alive: boolean;
        
        constructor(sprite: base.Sprite) {
            this._sprite = sprite;
            this._sprite.setVisible(false);
            this._alive = false;
            var w = sprite.getWidth();
            var h = sprite.getHeight();
            this._bounds = new base.Rect(-w,-h,w,h);
            game.addActor(this);
        }

        public isAlive(): boolean {
            return this._alive;
        }

        public spawn(position: base.Vec2): void {
            this._sprite.setPosition(position);
            this._sprite.setVisible(true);
            this._alive = true;
        }

        public die(): void {
            this._sprite.setVisible(false);
            this._alive = false;
        }

        public getSprite(): base.Sprite {
            return this._sprite;
        }

        public getBounds() {
            return this._bounds;
        }

        public update(): void {}

    }

}
