/// <reference path="../base.ts" />
/// <reference path="imagesource.ts" />

namespace base {

    /**
     * Wrapper around HTMLImageElement,
     * used as draw source
     */
    export class Image implements ImageSource {
        
        private _element: HTMLImageElement;
        private _width: number;
        private _height: number;
        private _srect: Rect;

        constructor(elem: HTMLImageElement) {
            this._element = elem;
            this._width = elem.width;
            this._height = elem.height;
            this._srect = new Rect(0,0,this._width,this._height);
        }

        public getElement(): HTMLImageElement {
            return this._element;
        }

        public getWidth(): number {
            return this._width;
        }

        public getHeight(): number {
            return this._height;
        }

        public getSampleRect(): Rect {
            return this._srect;
        }

    }

}
