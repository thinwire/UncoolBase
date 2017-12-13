/// <reference path="../base.ts" />

namespace base {

    /**
     * 2D renderer object - maintains JS side state
     * to minimize native API interactions.
     */
    export class Renderer {

        private _surface: Surface;
        private _context: CanvasRenderingContext2D;

        private _drawmode: DrawMode;
        private _matrix: Matrix;
        private _alpha: number;

        private _fillColor: Color;
        private _lineColor: Color;
        private _lineWidth: number;

        constructor(owner: Surface) {
            this._surface = owner;
            this._context = owner.getContext();

            this._drawmode = DrawMode.ALPHA;
            this._matrix = new Matrix();
            this._alpha = 1;

            this._fillColor = new Color(0,0,0,255);
            this._lineColor = new Color(255,255,255,255);
            this._lineWidth = 1;

            this.restore();
        }

        public getSurface(): Surface {
            return this._surface;
        }

        public getContext(): CanvasRenderingContext2D {
            return this._context;
        }

        public getWidth(): number {
            return this._surface.getWidth();
        }

        public getHeight(): number {
            return this._surface.getHeight();
        }

        public restore(): void {
            this.setDrawMode(this._drawmode, true);
            this._context.setTransform(1,0,0,1,0,0);
            this._context.globalAlpha = this._alpha;
            this._context.fillStyle = this._fillColor.asString();
            this._context.strokeStyle = this._lineColor.asString();
            this._context.lineWidth = this._lineWidth;
        }

        public setDrawMode(mode: DrawMode, force: boolean = false): void {
            if(!force && mode === this._drawmode) return;
            switch(mode) {
                case DrawMode.ADDITIVE:
                    this._context.globalCompositeOperation = 'lighter';
                break;
                case DrawMode.MULTIPLY:
                    this._context.globalCompositeOperation = 'multiply';
                break;
                default: // Also includes ALPHA
                    this._context.globalCompositeOperation = 'source-over';
                break;
            }
            this._drawmode = mode;
        }

        public setMatrix(m: Matrix): void {
            if(this._matrix.equals(m)) return;
            this._matrix.set(m);
            this._context.setTransform(m.a,m.b,m.c,m.d,m.tx,m.ty);
        }

        public getMatrix(): Matrix {
            return this._matrix;
        }

        public setAlpha(a: number): void {
            a = clamp(a,0,1);
            if(this._alpha === a) return;
            this._context.globalAlpha = a;
            this._alpha = a;
        }

        public getAlpha(): number {
            return this._alpha;
        }

        public setFillColor(c: Color): void {
            if(this._fillColor.equals(c)) return;
            this._fillColor.set(c);
            this._context.fillStyle = c.asString();
        }

        public getFillColor(): Color {
            return this._fillColor;
        }

        public setLineColor(c: Color): void {
            if(this._lineColor.equals(c)) return;
            this._lineColor.set(c);
            this._context.strokeStyle = c.asString();
        }

        public getLineColor(): Color {
            return this._lineColor;
        }

        public setLineWidth(w: number): void {
            w = clamp(w,0.001,100);
            if(w === this._lineWidth) return;
            this._context.lineWidth = w;
            this._lineWidth = w;
        }

        public getLineWidth(): number {
            return this._lineWidth;
        }

        public drawRectFilled(x: number, y: number, w: number, h: number): void {
            this._context.fillRect(x,y,w,h);
        }

        public drawRectOutline(x: number, y: number, w: number, h: number): void {
            this._context.strokeRect(x,y,w,h);
        }

        public drawImage(img: ImageSource, x: number, y: number, w: number, h: number): void {
            var e = img.getElement();
            var r = img.getSampleRect();
            this._context.drawImage(e,
                r.position.x, r.position.y,
                r.size.x, r.size.y,
                x, y, w, h);
        }

    }

}
