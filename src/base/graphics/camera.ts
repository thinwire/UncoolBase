/// <reference path="../base.ts" />
/// <reference path="stage.ts" />

namespace base {

    export class Camera {
        
        private _position: Vec2;
        private _scaling:  Vec2;
        private _rotation: number;
        private _matrix:   Matrix;
        private _dirty:    boolean;
        private _stage:    Stage;

        constructor(stage: Stage) {
            this._position = new Vec2();
            this._scaling = new Vec2(1,1);
            this._rotation = 0;
            this._matrix = new Matrix();
            this._dirty = true;
            this._stage = stage;
        }

        public getPosition(): Vec2 {
            return this._position;
        }

        public setPosition(p: Vec2): Camera {
            this._position.set(p);
            this._dirty = true;
            this._stage.markAsDirty();
            return this;
        }

        public move(d: Vec2): Camera {
            this._position.add(d);
            this._dirty = true;
            this._stage.markAsDirty();
            return this;
        }

        public getZoom(): number {
            return this._scaling.x;
        }

        public setZoom(z: number): Camera {
            this._scaling.setXY(z,z);
            this._dirty = true;
            this._stage.markAsDirty();
            return this;
        }

        public getRotation(): number {
            return toDegree(this._rotation);
        }

        public setRotation(deg: number): Camera {
            this._rotation = toRadian(wrap(deg,0,360));
            this._dirty = true;
            this._stage.markAsDirty();
            return this;
        }

        public rotate(deg: number): Camera {
            this._rotation = toRadian(wrap(toDegree(this._rotation) + deg,0,360));
            this._dirty = true;
            this._stage.markAsDirty();
            return this;
        }

        public getMatrix(): Matrix {
            if(this._dirty) {
                this._position.invert();
                this._matrix.buildNodeMatrix(this._position,this._scaling,Vec2.ZERO,-this._rotation);
                this._position.invert();
                this._dirty = false;
            }

            return this._matrix;
        }

    }

}
