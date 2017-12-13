/// <reference path="../base.ts" />
/// <reference path="imagesource.ts" />

namespace base {

    /**
     * Describes a single frame of animation
     */
    export class AnimationFrame {
        x: number;
        y: number;
        w: number;
        h: number;
    }

    /**
     * 2D texture animation
     */
    export class Animation {

        private _source: ImageSource;
        private _frames: AnimationFrame[];
        private _frameWidth: number;
        private _frameHeight: number;
        private _frameCount: number;

        constructor(source: ImageSource, frameWidth: number, frameHeight: number) {
            this._source = source;
            this._frames = [];
            this._frameWidth = frameWidth;
            this._frameHeight = frameHeight;
            this._frameCount = 0;
        }

        public getSource(): ImageSource {
            return this._source;
        }

        public getFrameWidth(): number {
            return this._frameWidth;
        }

        public getFrameHeight(): number {
            return this._frameHeight;
        }

        public getFrameCount(): number {
            return this._frameCount;
        }

        public getFrame(idx: number): AnimationFrame {
            return this._frames[idx % this._frameCount];
        }

        public addFrame(
            x: number,
            y: number,
            w: number = this._frameWidth,
            h: number = this._frameHeight): Animation {
                var f = new AnimationFrame();
                f.x = x;
                f.y = y;
                f.w = w;
                f.h = h;
                this._frames.push(f);
                this._frameCount++;
            return this;
        }

        public addFrameIndex(
            idx: number,
            frameW = this._frameWidth,
            frameH = this._frameHeight,
            startX: number = 0,
            startY: number = 0): Animation {

            var imageW = this._source.getWidth();
            var imageH = this._source.getHeight();

            var x = (startX + (idx * frameW)) % imageW;
            var y = startY + ((startX + (idx * frameW)) / imageW) | 0;

            this.addFrame(x,y);

            return this;
        }

        public addFrameSequence(
            num: number,
            startX: number = 0,
            startY: number = 0,
            frameW: number = this._frameWidth,
            frameH: number = this._frameHeight): Animation {

            var imageW = this._source.getWidth();
            var imageH = this._source.getHeight();
            var x = startX;
            var y = startY;
            for(var i = 0; i < num; ++i) {
                this.addFrame(x,y,frameW,frameH);
                x += frameW;
                if(x > imageW) {
                    x -= imageW;
                    y += frameH;
                }
            }
            return this;
        }

    }

    /**
     * Animator can be used as an image source for
     * sprites, etc.
     */
    export class Animator implements ImageSource {

        private _animation: Animation;
        private _currentFrame: number;
        private _srect: Rect;
        private _looping: boolean;
        private _animSpeed: number;
        private _elapsed: number;

        private _oncomplete = new SafeList<Function>();

        constructor(anim: Animation) {
            this._animation = anim;
            this._srect = new Rect();
            this._currentFrame = 0;
            this._looping = false;
            this._animSpeed = 16;
            this._elapsed = 0;
            this.setFrame(0);
        }

        public sync(anim: Animator): void {
            this._elapsed = anim._elapsed;
        }

        public getElement(): HTMLImageElement {
            return <HTMLImageElement>(this._animation.getSource().getElement());
        }

        public getWidth(): number {
            return this._animation.getFrameWidth();
        }

        public getHeight(): number {
            return this._animation.getFrameHeight();
        }

        public getSampleRect(): Rect {
            return this._srect;
        }

        public setFrame(idx: number): Animator {
            if(this._looping) {
                this._currentFrame = idx % this._animation.getFrameCount();
            } else {
                this._currentFrame = clamp(idx,0,this._animation.getFrameCount() - 1);
            }

            var f = this._animation.getFrame(this._currentFrame);
            this._srect.position.setXY(f.x,f.y);
            this._srect.size.setXY(f.w,f.h);

            return this;
        }

        public getFrame(): number {
            return this._currentFrame;
        }

        public setLooping(b: boolean): Animator {
            this._looping = b;
            return this;
        }

        public isLooping(): boolean {
            return this._looping;
        }

        public setAnimationSpeed(fps: number): Animator {
            this._animSpeed = fps;
            return this;
        }

        public getAnimationSpeed(): number {
            return this._animSpeed;
        }

        public start(): Animator {
            base.addAnimator(this);
            return this;
        }

        public stop(): Animator {
            base.removeAnimator(this);
            return this;
        }

        public reset(): Animator {
            this.setFrame(0);
            return this;
        }

        public onComplete(callback: Function): Animator {
            this._oncomplete.add(callback);
            return this;
        }

        public clearOnComplete(): Animator {
            this._oncomplete.clear();
            return this;
        }

        public update(delta: number): void {
            if(this._animSpeed == 0) return;

            var ftime = 1.0 / this._animSpeed;
            var e = this._elapsed + delta;
            while(e >= ftime) {
                this.setFrame(this._currentFrame + 1);
                e -= ftime;
            }
            this._elapsed = e;

            if(!this._looping) {
                if(this._currentFrame === this._animation.getFrameCount() - 1) {
                    this._oncomplete.forEach(fn => fn());
                    base.removeAnimator(this);
                }

            }

        }

    }

}
