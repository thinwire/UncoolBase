/// <reference path="../base.ts" />

namespace base {

    export enum DrawMode {
        ALPHA,
        ADDITIVE,
        MULTIPLY
    }

    export enum PivotPosition {
        TOP_LEFT,
        TOP_CENTER,
        TOP_RIGHT,
        MIDDLE_LEFT,
        MIDDLE,
        MIDDLE_RIGHT,
        BOTTOM_LEFT,
        BOTTOM_CENTER,
        BOTTOM_RIGHT
    }

    export class Node {
        
        // Linkage
        private _parentNode: Node = null;
        private _firstChild: Node = null;
        private _lastChild: Node = null;
        private _nextNode: Node = null;
        private _prevNode: Node = null;
        private _childCount: number = 0;
        private _stage: Stage = null;

        // Properties
        private _position: Vec2 = new Vec2();
        private _scale: Vec2 = new Vec2(1,1);
        private _rotation: number = 0;
        private _size: Vec2 = new Vec2(0,0);
        private _pivot: Vec2 = new Vec2(0,0);
        private _matrix: Matrix = new Matrix();
        private _drawmode: DrawMode = DrawMode.ALPHA;
        private _alpha: number = 1;
        private _visible: boolean = true;
        private _dirty: boolean = true;

        // Methods
        constructor() {
        }

        //
        // Linkage
        //

        public getParent(): Node {
            return this._parentNode;
        }

        public getNextNode(): Node {
            return this._nextNode;
        }

        public getPrevNode(): Node {
            return this._prevNode;
        }

        public getFirstChild(): Node {
            return this._firstChild;
        }

        public getLastChild(): Node {
            return this._lastChild;
        }

        public getChildCount(): number {
            return this._childCount;
        }

        public getChildCountDeep(): number {
            var sum = this._childCount;
            var n = this._firstChild;
            while(n != null) {
                sum += n.getChildCountDeep();
                n = n.getNextNode();
            }
            return sum;
        }

        public removeFromParent(): void {
            if(this._parentNode != null) {
                var p = this._parentNode;
                if(p._firstChild == this) p._firstChild = this._nextNode;
                if(p._lastChild == this) p._lastChild = this._prevNode;
                if(this._nextNode != null) this._nextNode._prevNode = this._prevNode;
                if(this._prevNode != null) this._prevNode._nextNode = this._nextNode;
                p._childCount--;
                this._parentNode = null;
                this._nextNode = null; 
                this._prevNode = null;
                this.setStage(null);
            }
        }

        public addChild(child: Node): void {
            child.removeFromParent();
            child._parentNode = this;
            if(this._childCount == 0) {
                this._firstChild = child;
                this._lastChild = child;
                this._childCount = 1;
            } else {
                child._prevNode = this._lastChild;
                child._nextNode = null;
                this._lastChild._nextNode = child;
                this._lastChild = child;
                this._childCount++;
            }
            child.setStage(this._stage);
        }

        public clearChildren(): void {
            while(this._firstChild != null) {
                this._firstChild.removeFromParent();
            }
        }

        /**
         * Recursively set stage for this node and its children
         */
        public setStage(s: Stage): Node {
            if(this._stage != s) {
                this._stage = s;
                var c = this._firstChild;
                while(c != null) {
                    c.setStage(s);
                    c = c._nextNode;
                }
            }
            return this;
        }

        public getStage(): Stage {
            return this._stage;
        }

        public bringToFront(): void {
            var p = this._parentNode;
            this.removeFromParent();
            p.addChild(this);
        }

        //
        // Graphics node intrinsics
        //

        public isDirty(): boolean {
            return this._dirty;
        }

        private markAsDirty(): void {
            this._dirty = true;
        }

        public isVisible(): boolean {
            return this._visible;
        }

        public setVisible(b: boolean): Node {
            this._visible = b;
            return this;
        }

        public getAlpha(): number {
            return this._alpha;
        }

        public setAlpha(a: number): Node {
            this._alpha = clamp(a,0,1);
            return this;
        }

        public getDrawMode(): DrawMode {
            return this._drawmode;
        }

        public setDrawMode(mode: DrawMode): Node {
            this._drawmode = mode;
            return this;
        }

        public setSizeXY(w: number, h: number): Node {
            this._size.setXY(w,h);
            this.markAsDirty();
            return this;
        }

        public setSize(sz: Vec2): Node {
            this._size.set(sz);
            this.markAsDirty();
            return this;
        }

        public getWidth(): number {
            return this._size.x;
        }

        public getHeight(): number {
            return this._size.y;
        }

        public getSize(): Vec2 {
            return this._size;
        }

        public getPosition(): Vec2 {
            return this._position;
        }

        public getX(): number {
            return this._position.x;
        }
        
        public getY(): number {
            return this._position.y;
        }

        public setPosition(p: Vec2): Node {
            this._position.set(p);
            this.markAsDirty();
            return this;
        }

        public setPositionXY(x: number, y: number): Node {
            this._position.setXY(x,y);
            this.markAsDirty();
            return this;
        }

        public move(d: Vec2): Node {
            this._position.add(d);
            this.markAsDirty();
            return this;
        }

        public moveXY(dx: number, dy: number): Node {
            this._position.addXY(dx,dy);
            this.markAsDirty();
            return this;
        }

        public getPivot(): Vec2 {
            return this._pivot;
        }

        public setPivotPosition(p: PivotPosition): Node {
            switch(p) {
                case PivotPosition.TOP_LEFT:
                    this._pivot.setXY(0,0);
                break;
                case PivotPosition.TOP_CENTER:
                    this._pivot.setXY(this._size.x * .5,0);
                break;
                case PivotPosition.TOP_RIGHT:
                    this._pivot.setXY(this._size.x,0);
                break;
                case PivotPosition.MIDDLE_LEFT:
                    this._pivot.setXY(0,this._size.y * .5);
                break;
                case PivotPosition.MIDDLE:
                    this._pivot.setXY(this._size.x * .5,this._size.y * .5);
                break;
                case PivotPosition.MIDDLE_RIGHT:
                    this._pivot.setXY(this._size.x,this._size.y * .5);
                break;
                case PivotPosition.BOTTOM_LEFT:
                    this._pivot.setXY(0,this._size.y);
                break;
                case PivotPosition.BOTTOM_CENTER:
                    this._pivot.setXY(this._size.x * .5,this._size.y);
                break;
                case PivotPosition.BOTTOM_RIGHT:
                    this._pivot.setXY(this._size.x,this._size.y);
                break;
            }
            this._dirty = true;
            return this;
        }

        public setPivot(p: Vec2): Node {
            this._pivot.set(p);
            this._dirty = true;
            return this;
        }

        public setPivotXY(x: number, y: number): Node {
            this._pivot.setXY(x,y);
            this._dirty = true;
            return this;
        }

        public getScale(): Vec2 {
            return this._scale;
        }

        public setScale(s: Vec2): Node {
            this._scale.set(s);
            this.markAsDirty();
            return this;
        }

        public setScaleXY(x: number, y: number = x): Node {
            this._scale.setXY(x,y);
            this.markAsDirty();
            return this;
        }

        public scale(s: Vec2): Node {
            this._scale.multiply(s);
            this.markAsDirty();
            return this;
        }

        public scaleXY(sx: number, sy: number = sx): Node {
            this._scale.multiplyXY(sx,sy);
            this.markAsDirty();
            return this;
        }

        public getRotation(): number {
            return toDegree(this._rotation);
        }

        public setRotation(deg: number): Node {
            this._rotation = toRadian(wrap(deg,0,360));
            this.markAsDirty();
            return this;
        }

        public rotate(deg: number): Node {
            this._rotation = toRadian(wrap(toDegree(this._rotation) + deg,0,360));
            this.markAsDirty();
            return this;
        }

        public getMatrix(): Matrix {
            if(this._dirty) {
                this._matrix.buildNodeMatrix(this._position,this._scale,this._pivot,this._rotation);
                this._dirty = false;    // Remove dirty flag
            }
            return this._matrix;
        }

        //
        // Virtuals
        //

        public draw(r: Renderer, mtx: Matrix, alpha: number): void {
            // NOP
        }

    }

}
