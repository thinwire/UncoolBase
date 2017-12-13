/// <reference path="../base.ts" />
/// <reference path="node.ts" />

namespace base {

    export class ColorLayer extends Node {

        private _color: Color;

        constructor(c: Color = Color.WHITE) {
            super();
            this._color = new Color();
            this._color.set(c);
        }

        public draw(r: Renderer, mtx: Matrix, alpha: number): void {
            r.setMatrix(Matrix.IDENTITY);
            r.setAlpha(alpha);
            r.setDrawMode(this.getDrawMode());
            r.setFillColor(this._color);
            r.drawRectFilled(0,0,r.getWidth(),r.getHeight());
        }

    }

}
