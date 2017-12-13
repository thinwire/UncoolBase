/// <reference path="../base.ts" />
/// <reference path="font.ts" />

namespace base {

    class RenderCoord {
        // Source image coordinates
        public sx: number;
        public sy: number;
        public sw: number;
        public sh: number;

        // Destination offsets
        public dx: number;
        public dy: number;
        public dw: number;
        public dh: number;
    }

    export class Text extends Node {

        private _font:   Font;
        private _text:   string;
        private _render: StaticList<RenderCoord>;
        private _length: number;
        private _bounds: Rect;

        constructor(font: Font, text: string = "") {
            super();
            this._font = font;
            this._text = text;
            this._render = new StaticList<RenderCoord>(text.length, () => new RenderCoord());
            this._length = 0;
            this._bounds = new Rect();
            this.rebuild();
        }

        public setFont(f: Font): Text {
            this._font = f;
            this.rebuild();
            return this;
        }

        public setText(str: string): Text {
            this._text = str;
            this.rebuild();
            return this;
        }

        public getBounds(): Rect {
            return this._bounds;
        }

        public getText(): string {
            return this._text;
        }

        private rebuild(): void {
            var s = this._text;
            var l = this._length = s.length;
            this._render.clear();
            
            this._bounds.position.setXY(0,0);
            this._bounds.size.y = this._font.getLineHeight();
            var yy = 0;
            var xx = 0;
            for(var i = 0; i < l; ++i) {
                var c = s.charAt(i);
                var g = this._font.getGlyph(c);
                if(g && g.w > 0 && g.h > 0) {
                    var r = this._render.getNext();
                    var k = 0;
                    if(i < l - 1) {
                        k = this._font.getKerning(c, s.charAt(i + 1));
                    }
                    r.sx = g.x;
                    r.sy = g.y;
                    r.sw = g.w;
                    r.sh = g.h;
                    r.dx = xx + g.xoffset;
                    r.dy = yy + g.yoffset;
                    r.dw = g.w;
                    r.dh = g.h;
                    
                    xx += g.advance + k;
                } else {
                    xx += g.advance + k;
                }
            }
            this._bounds.size.x = xx;
            this.setSize(this._bounds.size);
        }

        public draw(r: Renderer, mtx: Matrix, alpha: number) {
            r.setMatrix(mtx);
            r.setDrawMode(this.getDrawMode());
            r.setAlpha(alpha);

            var ctx = r.getContext();
            var e = this._font.getImage().getElement();
            var p = this.getPivot();

            for(var i = 0, l = this._render.size(); i < l; ++i) {
                var g = this._render.get(i);
                
                ctx.drawImage(e,g.sx,g.sy,g.sw,g.sh,g.dx - p.x,g.dy - p.y,g.dw,g.dh);

            }

        }

    }

}
