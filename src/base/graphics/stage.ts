/// <reference path="../base.ts" />
/// <reference path="camera.ts" />

namespace base {

    class DrawNode {
        public node: Node = null;
        public matrix: Matrix = new Matrix();
        public alpha: number = 1;
    }

    /**
     * Base container for 2D graphics. Handles recursive
     * drawing of Nodes of all types.
     */
    export class Stage {

        private _output: Surface;
        private _root: Node = new Node();
        private _camera: Camera = new Camera(this);
        private _drawOrder = new StaticList<DrawNode>(128,() => new DrawNode());
        private _matrix: Matrix = new Matrix();
        private _invMatrix: Matrix = new Matrix();
        private _tempvector: Vec2 = new Vec2();
        private _dirty: boolean = true;

        public constructor(output: Surface = null) {
            if(output === null) {
                output = base.getScreen();
            }
            this._output = output;
            this._root.setStage(this);
        }

        public markAsDirty(): Stage {
            this._dirty = true;
            return this;
        }

        public isDirty(): boolean {
            return this._dirty;
        }

        public getOutput(): Surface {
            return this._output;
        }

        public setOutput(out: Surface): Stage {
            this._output = (out == null ? base.getScreen() : out);
            return this;
        }

        public getCamera(): Camera {
            return this._camera;
        }

        public addChild(node: Node): Stage {
            this._root.addChild(node);
            return this;
        }

        public clearChildren(): Stage {
            this._root.clearChildren();
            return this;
        }

        public getChildCount(): number {
            return this._root.getChildCount();
        }

        public getChildCountDeep(): number {
            return this._root.getChildCountDeep();
        }

        private getDrawables(node: Node, matrix: Matrix, alpha: number) {
            var n = node.getFirstChild();
            while(n != null) {
                if(n.isVisible()) {
                    var d = this._drawOrder.getNext();
                    d.node = n;
                    d.matrix.set(matrix).multiply(n.getMatrix());
                    d.alpha = d.node.getAlpha() * alpha;
                    this.getDrawables(n,d.matrix,d.alpha);
                }
                n = n.getNextNode();
            }
        }

        public draw(): void {
            this.updateMatrix();
            this._drawOrder.clear();
            this.getDrawables(this._root, this._matrix, 1.0);

            var r = this._output.getRenderer();
            for(var i = 0, l = this._drawOrder.size(); i < l; ++i) {
                var d = this._drawOrder.get(i);
                d.node.draw(r,d.matrix,d.alpha);
            }

        }

        private updateMatrix() {
            if(this._dirty) {
                this._matrix
                    .identity()
                    .translateXY(this._output.getWidth() * .5, this._output.getHeight() * .5)
                    .multiply(this._camera.getMatrix());
                this._invMatrix.set(this._matrix).invert();
            }
        }

        //
        // Coordinate conversion
        //

        public screenToWorld(coordinates: Vec2, target: Vec2 = this._tempvector): Vec2 {
            this.updateMatrix();
            return this._invMatrix.project(coordinates,target);
        }

        public worldToScreen(coordinates: Vec2, target: Vec2 = this._tempvector): Vec2 {
            this.updateMatrix();
            return this._matrix.project(coordinates,target);
        }

    }

}
