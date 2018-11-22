//
//      The Uncool Base
// Game development framework
//
// Licence: MIT
//

/// <reference path="lib/screenfull.js" />
/// <reference path="lib/matter.js" />
/// <reference path="lib/waud.js" />
/// <reference path="lib/audiounlock.js" />

/// <reference path="math/math.ts" />
/// <reference path="math/random.ts" />
/// <reference path="math/ease.ts" />
/// <reference path="input/keyboard.ts" />
/// <reference path="input/mouse.ts" />
/// <reference path="input/touch.ts" />
/// <reference path="util/assetlist.ts" />
/// <reference path="util/safelist.ts" />
/// <reference path="util/loader.ts" />
/// <reference path="util/ringbuffer.ts" />
/// <reference path="util/staticlist.ts" />
/// <reference path="util/pool.ts" />
/// <reference path="util/timer.ts" />
/// <reference path="util/tween.ts" />
/// <reference path="util/randomness.ts" />
/// <reference path="sound/mixer.ts" />
/// <reference path="sound/sound.ts" />
/// <reference path="sound/music.ts" />
/// <reference path="graphics/color.ts" />
/// <reference path="graphics/node.ts" />
/// <reference path="graphics/colorlayer.ts" />
/// <reference path="graphics/animation.ts" />
/// <reference path="graphics/renderer.ts" />
/// <reference path="graphics/image.ts" />
/// <reference path="graphics/surface.ts" />
/// <reference path="graphics/sprite.ts" />
/// <reference path="graphics/particlesystem.ts" />
/// <reference path="graphics/text.ts" />
/// <reference path="graphics/stage.ts" />

declare var screenfull: any;
declare var Waud: any;

namespace base {

    enum Status {
        LOAD,
        RUN
    }

    class FixedLoop {
        public interval: number = 0;
        public lastUpdate: number = 0;
        public callback: Function = null;
    }

    //
    // Init system objects
    //

    var gamediv: HTMLDivElement = <HTMLDivElement>(document.getElementById('game'));
    var canvas: HTMLCanvasElement = document.createElement('canvas');
    var status: Status = Status.LOAD;

    var loader     = new Loader();
    var logbuffer  = new Ringbuffer(16);

    var loops      = new SafeList<Function>();
    var loopsFixed = new SafeList<FixedLoop>();
    var timers     = new SafeList<Timer>();
    var tweens     = new SafeList<Tween>();
    var animators  = new SafeList<Animator>();

    var screen     = new Surface(canvas);
    var mixer      = new Mixer();
    var keyboard   = new Keyboard();
    var mouse      = new Mouse();
    var touch      = new Touch();

    var time_current: number = 0;
    var time_last: number = 0;
    var time_delta_millis: number = 0;
    var time_delta: number = 0;

    var screen_w: number = 800;
    var screen_h: number = 600;
    var sizeratio: number = 1.0;

    var triggerFullscreen: boolean = false;
    var triggerMouseCapture: boolean = false;

    loader.onProgress = (msg: string) => {
        log_preload(msg);
    };

    loader.onError = (msg: string) => {
        log_preload(msg);
        log_preload("Opening space inventory...");
        throw new Error("Opening space inventory...");
    };

    //
    // Initialize audio 
    //

    try {
        Waud.init();
    } catch(ignore) {
        console.error("Failed to init Waud.js - sound will not be available");
    }

    //
    // Initialize timer
    //

    requestAnimationFrame(updateTime);

    //
    // Initialize game div
    //

    gamediv.style.width = screen_w + "px";
    gamediv.style.height = screen_h + "px";

    //
    // Draw banner in debug log
    //

    console.log("***        Uncool Bens Jam Base        ***");
    console.log("***  Oldskool spirit - newschool tech  ***");

    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////

    function repaintlog() {
        if(status === Status.LOAD) {
            var content = '';
            for(var i = 0; i < logbuffer.size(); ++i) {
                var s = logbuffer.get(i);
                content += '<span>' + s + '</span><br>';
            }
            gamediv.innerHTML = content;
        }
    }

    function initInput(): void {

        var updateTouchXY = (e: TouchEvent) => {
            if(e.touches.length == 0) {
                return;
            } 
            
            var t = e.touches[0];
            var bounds = canvas.getBoundingClientRect();
            var touchx = (t.clientX - (bounds.left | 0)) / sizeratio;
            var touchy = (t.clientY - (bounds.top | 0)) / sizeratio;
            touch.updateTouchPosition(touchx,touchy);
        };

        var updateMouseXY = (e: MouseEvent) => {
            var bounds = canvas.getBoundingClientRect();
            var mouseX = (e.clientX - (bounds.left | 0)) / sizeratio;
            var mouseY = (e.clientY - (bounds.top | 0)) / sizeratio;
            mouse.mouseMoved(mouseX,mouseY);
        };

        var cancel = (e: Event) => {
            e.stopPropagation();
            e.preventDefault();
        };

        var reservedKey = (code: number) => {
            switch(code) {
                case 18:
                case 115:
                case 116:
                case 122:
                case 123:

                return true;
            }
            return false;
        };

        window.onkeydown = (e) => {
            if(triggerFullscreen) {
                requestFullscreenActual();
            }
            if(triggerMouseCapture) {
                requestMouseCaptureActual();
            }

            keyboard.keyDown(e.keyCode);
            keyboard._executeNativeHandlers(e);
            if(!reservedKey(e.keyCode)) {
                cancel(e);
            }
        };

        window.onkeyup = (e) => {
            keyboard.keyUp(e.keyCode);
            keyboard._executeNativeHandlers(e);
            if(!reservedKey(e.keyCode)) {
                cancel(e);
            }
        };

        window.onmousedown = (e) => {
            if(triggerFullscreen) {
                requestFullscreenActual();
            }
            if(triggerMouseCapture) {
                requestMouseCaptureActual();
            }

            updateMouseXY(e);
            mouse.buttonDown(e.button);
            cancel(e);
        };

        window.oncontextmenu = (e) => {
            updateMouseXY(e);
            mouse.buttonDown(e.button);
            cancel(e);
        };

        window.onmouseup = (e) => {
            updateMouseXY(e);
            mouse.buttonUp(e.button);
            cancel(e);
        };

        window.onmousemove = (e) => {
            updateMouseXY(e);
            cancel(e);
        };

        window.onmousewheel = (e: any) => {
            updateMouseXY(e);
            mouse.buttonDown(e.wheelDelta > 0 ? MouseButton.WHEEL_UP : MouseButton.WHEEL_DOWN);
            cancel(e);
        };

        window.ontouchstart = (e) => {
            updateTouchXY(e);
            touch.touchStart();
            e.stopPropagation();
        }

        window.ontouchmove = (e) => {
            updateTouchXY(e);
            e.stopPropagation();
        }

        window.ontouchend = (e) => {
            updateTouchXY(e);
            touch.touchEnd();
            e.stopPropagation();
        }

        // iOS 10 Safari zoom prevention
        document.addEventListener('gesturestart', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });

    }

    function updateTime(timestamp: number): void {
        time_delta_millis = timestamp - time_current;
        time_last = time_current;
        time_current = timestamp;
        if(time_delta_millis > 667) {
            time_delta_millis = 0;
        }
        time_delta = time_delta_millis * 0.001;
    }

    function updateFixedLoops(): void {
        var tm = time_current;
        loopsFixed.forEach((item) => {
            // Allow a maximum of 25 updates skipped - if so, then we just update once.
            if(tm - item.lastUpdate > item.interval * 25) {
                item.lastUpdate = tm;
                item.callback(item.interval * 0.001);
            } else {
                while(tm - item.lastUpdate > item.interval) {
                    item.callback(item.interval * 0.001);
                    item.lastUpdate += item.interval;
                }
            }
        });
    }

    function mainLoop(time: number): void {
        updateTime(time);

        keyboard.update();
        mouse.update();
        touch.update();

        timers.forEach(t => t.update(time_delta_millis));
        tweens.forEach(t => t.update(time_delta_millis));
        animators.forEach(a => a.update(time_delta));

        updateFixedLoops();
        loops.forEach(loop => loop());

        mixer.update();

        requestAnimationFrame(mainLoop);
    }

    export var onResize = (): void => {};

    function run() {
        status = Status.RUN;
        gamediv.innerHTML = '';
        gamediv.appendChild(canvas);
        setScreenSize(screen_w,screen_h);
        gamediv.style.width = "100%";
        gamediv.style.height = "100%";
        canvas.style.left = "50%";
        canvas.style.top = "50%";
        canvas.style.transform = "translate(-50%,-50%)";
        canvas.style.position = "absolute";

        var resize = () => {
            onResize();

            var width = window.innerWidth;
            var height = window.innerHeight;

            var wratio = width / screen_w;
            var hratio = height / screen_h;
            sizeratio = Math.min(wratio,hratio);

            canvas.style.width = ((screen_w * sizeratio) | 0) + "px";
            canvas.style.height = ((screen_h * sizeratio) | 0) + "px";
        };
        window.onresize = resize;
        resize();

        requestAnimationFrame(mainLoop);
    }

    function requestFullscreenActual(): boolean {
        triggerFullscreen = false;
        try {
            screenfull.request(canvas);
            return true;
        } catch(ignore) {
            console.error("Failed to request fullscreen mode through screenfull.js");
        }
        return false;
    }

    function requestMouseCaptureActual(): boolean {
        triggerMouseCapture = false;
        (<any>canvas).requestPointerLock();
        return true;
    }

    export function start(
        assetList: AssetList = null,
        onSuccess: () => void = () => {}): void {

        initInput();

        if(assetList != null) {
            loader.onComplete = () => {
                if(!loader.hasFailed()) {
                    run();
                    onSuccess();
                }
            };
            loader.load(assetList);
            log_preload("Loading " + assetList.size() + " items...");
        } else {
            run();
            onSuccess();
        }
    }

    export function log_preload(msg: string): void {
        console.log(msg);
        if(status === Status.LOAD) {
            logbuffer.add(msg);
            repaintlog();
        }
    }

    /**
     * Return current timestamp in milliseconds
     */
    export function getTimeCurrent(): number {
        return time_current;
    }

    /**
     * Return the timestamp of the previous frame in milliseconds
     */
    export function getTimeLast(): number {
        return time_last;
    }

    /**
     * Return the time in seconds between the current and the previous frame
     */
    export function getTimeDelta(): number {
        return time_delta;
    }

    /**
     * Return time in milliseconds between the current and previous frame
     * (you're almost certainly looking for the version that returns time in seconds)
     */
    export function getTimeDeltaMillis(): number {
        return time_delta_millis;
    }

    export function getScreen(): Surface {
        return screen;
    }

    export function getMixer(): Mixer {
        return mixer;
    }

    export function getKeyboard(): Keyboard {
        return keyboard;
    }

    export function getMouse(): Mouse {
        return mouse;
    }

    export function getTouch(): Touch {
        return touch;
    }

    /**
     * Set game window size. Do not call getScreen().setSize(),
     * since that will not update the container div for the canvas,
     * but just the canvas itself.
     */
    export function setScreenSize(w: number, h: number): void {
        screen_w = w | 0;
        screen_h = h | 0;
        gamediv.style.width = screen_w + "px";
        gamediv.style.height = screen_h + "px";
        screen.setSize(screen_w,screen_h);
    }

    export function getLoader(): Loader {
        return loader;
    }

    export function addLoop(loop: Function): void {
        loops.add(loop);
    }

    export function addLoopFixed(loop: Function, fps: number): void {
        var l = new FixedLoop();
        l.callback = loop;
        l.interval = 1000.0 / fps;  // interval time is in milliseconds
        l.lastUpdate = time_current;
        loopsFixed.add(l)
    }

    export function removeLoop(loop: Function): void {
        loops.remove(loop);
    }

    export function removeLoopFixed(loop: Function): void {
        loopsFixed.forEach((item) => {
            if(item.callback == loop) {
                loopsFixed.remove(item);
            }
        });
    }

    export function addTimer(timer: Timer): void {
        timers.add(timer);
    }

    export function removeTimer(timer: Timer): void {
        timers.remove(timer);
    }

    export function addTween(tween: Tween): void {
        tweens.add(tween);
    }

    export function removeTween(tween: Tween): void {
        tweens.remove(tween);
    }

    export function addAnimator(animator: Animator): void {
        animators.add(animator);
    }

    export function removeAnimator(animator: Animator): void {
        animators.remove(animator);
    }

    export function requestMouseCapture(): void {
        triggerMouseCapture = true;
    }
    
    export function exitMouseCaputre(): void {
        try {
            (<any>document).exitPointerLock();
        } catch(ignore) {
            console.log("Cannot exit pointer lock");
        }
    }

    export function requestFullscreen(): void {
        triggerFullscreen = true;
    }

    export function exitFullscreen(): boolean {
        try {
            screenfull.exit();
            return true;
        } catch(ignore) {
            console.error("Failed to exit fullscreen mode through screenfull.js");
        }
        return false;
    }

}
