/// <reference path="game.ts" />
/// <reference path="bullet.ts" />

namespace game {

    export class Player extends Actor {

        private _moveBounds: base.Rect;
        private _bullets: Bullet[];

        constructor() {
            super(new base.Sprite(loader.getImage("player")));

            var w = base.getScreen().getWidth();
            var h = base.getScreen().getHeight();

            this._moveBounds = new base.Rect(-w * .5,-h * .5,w,h);
        }

        public update(): void {

            var mouse = base.getMouse();
            var keyboard = base.getKeyboard();
            var mousepos = stage.screenToWorld(mouse.getPosition());

            var dx: number = 0, dy: number = 0, speed: number = 225;
            if(keyboard.isKeyDown(base.Keys.W)) {
                dy -= speed;
            }
            if(keyboard.isKeyDown(base.Keys.S)) {
                dy += speed;
            }
            if(keyboard.isKeyDown(base.Keys.A)) {
                dx -= speed;
            }
            if(keyboard.isKeyDown(base.Keys.D)) {
                dx += speed;
            }

            var delta = base.getTimeDelta();
            var sprite = this.getSprite();
            sprite.moveXY(dx * delta, dy * delta);

            var pos = sprite.getPosition();
            var bounds = this.getBounds();
            bounds.position.setXY(pos.x - sprite.getWidth() * .5, pos.y - sprite.getHeight() * .5);

            this._moveBounds.confine(bounds);
            sprite.setPositionXY(bounds.position.x + sprite.getWidth() * .5, bounds.position.y + sprite.getHeight() * .5);
            
            var rot = base.wrap(base.toDegree(Math.atan2(pos.y - mousepos.y, mousepos.x - pos.x)),0,360);
            var invert = false;
            if(rot > 90) invert = true;
            if(rot > 270) invert = false;
            sprite.setRotation(invert ? 180 - rot : rot);
            sprite.setScaleXY(invert ? -1 : 1, 1);

        }

    }

}
