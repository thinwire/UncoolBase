/// <reference path="game.ts" />

namespace game {

    export class Crosshair extends base.Sprite {

        constructor() {
            super(loader.getImage("crosshair"));
        }

        public update(): void {
            var mouse = base.getMouse();
            var mousepos = stage.screenToWorld(mouse.getPosition());

            this.setPosition(mousepos);
            this.setScaleXY(0.75 + Math.sin(base.getTimeCurrent() * 0.005) * 0.025);
        }

    }

}
