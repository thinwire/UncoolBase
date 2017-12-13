/// <reference path="game.ts" />

namespace game {

    export class Explosion {

        private static animation: base.Animation = null;

        private _animator: base.Animator;
        private _sprite: base.Sprite;
        private _sound: base.Sound;

        constructor() {
            if(Explosion.animation === null) {
                Explosion.animation = new base.Animation(loader.getImage("explosion"),134,134);
                Explosion.animation.addFrameSequence(12);
            }

            this._animator = new base.Animator(Explosion.animation);
            this._sprite = new base.Sprite(this._animator);
            this._animator.onComplete(() => {
                this._animator.reset();
                this._sprite.setVisible(false);
                this._sprite.removeFromParent();
            });
            this._sound = loader.getSound("explosion1");
        }

        public spawn(pos: base.Vec2): void {
            this._sprite.setPosition(pos);
            this._sprite.setScaleXY(1);
            this._sprite.setVisible(true);
            this._animator.reset();
            this._animator.start();
            this._sound.play();
        }

        public getSprite() {
            return this._sprite;
        }

    }

}
