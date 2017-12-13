/// <reference path="../base.ts" />

namespace base {

    export class Sprite extends Node {

        private _image: ImageSource;

        constructor(src: ImageSource) {
            super();

            this.setImageSource(src);
        }

        public draw(r: Renderer, mtx: Matrix, alpha: number): void {
            var p = this.getPivot();
            r.setDrawMode(this.getDrawMode());
            r.setAlpha(alpha);
            r.setMatrix(mtx);
            r.drawImage(this._image,-p.x,-p.y,this.getWidth(),this.getHeight());
        }

        public setImageSource(src: ImageSource): void {
            this._image = src;
            this.setSize(src.getSampleRect().size);
            this.setPivotPosition(PivotPosition.MIDDLE);
        }

    }

}
