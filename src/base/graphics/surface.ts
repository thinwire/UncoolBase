/// <reference path="../base.ts" />
/// <reference path="imagesource.ts" />
/// <reference path="renderer.ts" />


namespace base {

    /**
     * Wrapper around a HTMLCanvasElement
     * Can be used as an image source when drawing.
     * Intended to be used as either a rendertarget
     * for a Stage or for generating dynamic graphics.
     */
    export class Surface implements ImageSource {

        private _element: HTMLCanvasElement;
        private _context: CanvasRenderingContext2D;
        private _width: number;
        private _height: number;
        private _srect: Rect;
        private _renderer: Renderer;

        constructor(elem: HTMLCanvasElement = null) {
            this._element = elem === null ? window.document.createElement('canvas') : elem;
            this._context = this._element.getContext('2d');
            this._width = this._element.width;
            this._height = this._element.height;
            this._srect = new Rect(0,0,this._width,this._height);
            this._renderer = null;
        }

        public getElement(): HTMLCanvasElement {
            return this._element;
        }

        public getWidth(): number {
            return this._width;
        }

        public getHeight(): number {
            return this._height;
        }

        public setSize(w: number, h: number): void {
            w |= 0;
            h |= 0;
            this._element.style.width = w + 'px';
            this._element.style.height = h + 'px';
            this._element.width = w;
            this._element.height = h;
            this._width = w;
            this._height = h;
            this._srect.position.setXY(0,0);
            this._srect.size.setXY(w,h);
        }

        /**
         * Get access to a Renderer object local to this Surface.
         */
        public getRenderer(): Renderer {
            if(this._renderer == null) {
                this._renderer = new Renderer(this);
            }
            return this._renderer;
        }

        public getContext(): CanvasRenderingContext2D {
            return this._context;
        }

        public getSampleRect(): Rect {
            return this._srect;
        }

        public setSampleRect(x: number, y: number, w: number, h: number): Surface {
            this._srect.position.setXY(x,y);
            this._srect.size.setXY(w,h);
            return this;
        }

    }

}
