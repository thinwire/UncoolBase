/// <reference path="../base.ts" />

namespace base {

    export interface ImageSource {

        getElement(): HTMLImageElement | HTMLCanvasElement;

        getSampleRect(): Rect;

        getWidth(): number;

        getHeight(): number;

    }

}
