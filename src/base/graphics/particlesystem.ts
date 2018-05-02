/// <reference path="../base.ts" />

namespace base {

    class Particle {
        public x: number = 0;
        public y: number = 0;
        public s: number = 0;
        public a: number = 0;
        
        public xadd: number = 0;
        public yadd: number = 0;
        public sadd: number = 0;
        public aadd: number = 0;
    }

    export class ParticleEmitter extends Node {
        private _systems: ParticleSystem[];
        private _params: ParticleSpawnParameters;
        private _projected_position: Vec2;
        private _projected_direction: Vec2;

        private _elapsed: number;
        private _interval: number;

        constructor() {
            super();

            this._systems = [];
            this._params = new ParticleSpawnParameters();
            this._params.direction.setXY(1,0);
            this._projected_position = new Vec2();
            this._projected_direction = new Vec2();
            this._interval = 0.1;
            this._elapsed = 0;
        }

        /** Set emission rate, particles per second */
        public setRate(pps: number): ParticleEmitter {
            pps = Math.max(1,pps);
            this._interval = 1.0 / pps;
            return this;
        }

        public getRate(): number {
            return 1.0 / this._interval;
        }

        public setParticleSpeed(speed_min: number, speed_max: number): ParticleEmitter {
            this._params.speed_min = speed_min;
            this._params.speed_max = speed_max;
            return this;
        }

        public setParticleLife(min_millis: number, max_millis: number): ParticleEmitter {
            this._params.life_min = min_millis * .001;
            this._params.life_max = max_millis * .001;
            return this;
        }

        public setParticleScale(initial: number, grow_min: number, grow_max: number): ParticleEmitter {
            this._params.scale_initial = initial;
            this._params.scale_delta_min = grow_min;
            this._params.scale_delta_max = grow_max;
            return this;
        }

        public setParticleSpread(deg: number): ParticleEmitter {
            this._params.spread = deg;
            return this;
        }

        public setParticleAngle(deg: number): ParticleEmitter {
            var r = toRadian(deg);
            this._params.direction.x = Math.cos(r);
            this._params.direction.y = Math.sin(r);
            return this;
        }

        public getParticleAngle(): number {
            return toDegree(Math.atan2(this._params.direction.y, this._params.direction.x));
        }

        public addSystem(system: ParticleSystem): ParticleEmitter {
            if(this._systems.indexOf(system) < 0) {
                this._systems.push(system);
            }
            return this;
        }

        public removeSystem(system: ParticleSystem): ParticleEmitter {
            var idx = this._systems.indexOf(system);
            if(idx >= 0) {
                this._systems.splice(idx,1);
            }
            return this;
        }

        public draw(r: Renderer, mtx: Matrix, alpha: number): void {
            var t = base.getTimeDelta();
            var e = this._elapsed + t;
            var c = 0;
            var worldpos = mtx.project(Vec2.ZERO,this._projected_position);
            this.getStage().screenToWorld(worldpos,worldpos);
            var direction = mtx.project(this._params.direction, this._projected_direction);
            this.getStage().screenToWorld(direction,direction);
            direction.subtract(worldpos);
            direction.normalize();

            while(e > this._interval) {
                ++c;
                e -= this._interval;
            }
            this._elapsed = e;

            if(c > 0) {
                for(var i = 0, l = this._systems.length; i < l; ++i) {
                    var s = this._systems[i];
                    s.spawn(c,worldpos,direction,this._params);
                }
            }
        }

    }

    export class ParticleSpawnParameters {
        public direction: Vec2 = new Vec2(); // direction; normalized value
        public spread: number = 10; // angle in degrees, calculated from direction vector
        public speed_min: number = 100; // pixels per second
        public speed_max: number = 250; // pixels per second
        public life_min: number = 1.0; // time in seconds min
        public life_max: number = 1.5; // time in seconds max
        public scale_initial: number = 1.0;
        public scale_delta_min: number = -0.5; // scaling change per second min
        public scale_delta_max: number =  0.5; // scaling change per second max
    }

    export class ParticleSystem extends Node {

        private _image: ImageSource;
        private _pool: Pool<Particle>;
        private _reap: Particle[];
        private _gravity: Vec2;
        private _scroll: Vec2;
        private _random: Random;
        private _inverse: Matrix;
        private _tpos: Vec2;

        constructor(img: ImageSource, count: number = 256) {
            super();

            this._image = img;
            this._pool = new Pool<Particle>(count, () => new Particle());
            this._reap = [];
            this._gravity = new Vec2();
            this._scroll = new Vec2();
            this._random = new Random();
            this._inverse = new Matrix();
            this._tpos = new Vec2();
        }

        private sanitize(params: ParticleSpawnParameters): void {
            params.life_min = Math.max(params.life_min, 0.01);
            params.life_max = Math.max(params.life_max, 0.015);
        }

        // TODO: position is WORLD POSITION
        public spawn(num: number, position: Vec2, direction: Vec2, params: ParticleSpawnParameters) {
            this.sanitize(params);

            // XXX: slow...
            this._inverse.set(this.getMatrix());
            var n: Node = this.getParent();
            while(n != null) {
                this._inverse.prepend(n.getMatrix());
                n = n.getParent();
            }
            this._inverse.invert();
            this._inverse.project(position, this._tpos);

            var base_angle = toDegree(Math.atan2(direction.y,direction.x));
            var half_spread = params.spread * .5;

            params.direction.normalize();
            for(var i = 0; i < num; ++i) {
                var p = this._pool.alloc();
                var speed = this._random.nextInRange(params.speed_min,params.speed_max);
                var life = this._random.nextInRange(params.life_min,params.life_max);
                var scale = this._random.nextInRange(params.scale_delta_min,params.scale_delta_max);
                var angle = this._random.nextInRange(base_angle - half_spread,base_angle + half_spread);
                angle = toRadian(angle);
                p.x = this._tpos.x;
                p.y = this._tpos.y;
                p.s = params.scale_initial;
                p.a = 1;
                p.xadd = Math.cos(angle) * speed;
                p.yadd = Math.sin(angle) * speed;
                p.aadd = -1.0 / life;
                p.sadd = scale;
            }
        }

        public getGravity(): Vec2 {
            return this._gravity;
        }

        public setGravity(g: Vec2): ParticleSystem {
            this._gravity.set(g);
            return this;
        }

        public getScroll(): Vec2 {
            return this._scroll;
        }

        public setScroll(s: Vec2): ParticleSystem {
            this._scroll.set(s);
            return this;
        }

        private update(): void {
            var delta = base.getTimeDelta();
            var g = this._gravity;
            var s = this._scroll;
            var gxadd = g.x * delta;
            var gyadd = g.y * delta;
            var sxadd = s.x * delta;
            var syadd = s.y * delta;
            for(var i = 0, l = this._pool.getUsedCount(); i < l; ++i) {
                var p = this._pool.getUsed(i);
                p.x += p.xadd * delta + sxadd;
                p.y += p.yadd * delta + syadd;
                p.s += p.sadd * delta;
                p.a += p.aadd * delta;
                p.xadd += gxadd;
                p.yadd += gyadd;
                if(p.a < 0) {
                    this._reap.push(p);
                }
            }

            while(this._reap.length) {
                this._pool.free(this._reap.pop());
            }
        }

        public draw(r: Renderer, mtx: Matrix, alpha: number) {
            this.update(); // TODO: make sure update() is only called once per frame

            r.setDrawMode(this.getDrawMode());
            r.setMatrix(mtx);
            r.setAlpha(alpha);

            var ctx = r.getContext();
            var sr = this._image.getSampleRect();
            var e = this._image.getElement();

            var sx = sr.position.x;
            var sy = sr.position.y;
            var sw = sr.size.x;
            var sh = sr.size.y;

            var pw = sw * .5;
            var ph = sw * .5;

            for(var i = 0, l = this._pool.getUsedCount(); i < l; ++i) {
                var p = this._pool.getUsed(i);
                ctx.globalAlpha = p.a * alpha;
                ctx.drawImage(e,sx,sy,sw,sh,p.x - pw * p.s, p.y - pw * p.s,sw * p.s,sh * p.s);
            }

            ctx.globalAlpha = alpha;
        }

    }

}
