/// <reference path="../main.ts" />

/// <reference path="crosshair.ts" />
/// <reference path="actor.ts" />
/// <reference path="bullet.ts" />
/// <reference path="explosion.ts" />
/// <reference path="player.ts" />

//
// The actual game
//

namespace game {

    export var loader = base.getLoader();
    export var stage = new base.Stage();
    export var game: Game = null;

    export function start() {
        game = new Game();
        game.init();
    }

    export class Game {

        private fxLayer: base.Node;
        private actorLayer: base.Node;
        private uiLayer: base.Node;

        private background: base.Sprite;

        private explosions: Explosion[] = [];

        private actors: base.SafeList<Actor>;
        private player: Player;
        private crosshair: Crosshair;

        private font: base.Font;
        private text: base.Text;

        private particles: base.ParticleSystem;
        private emitter: base.ParticleEmitter;

        constructor() {

            // Add main loop
            base.addLoop(() => {
                this.update();
            });

            // Create explosions
            for(var i = 0; i < 16; ++i) {
                this.explosions[i] = new Explosion();
            }

            // Create list of actors
            this.actors = new base.SafeList<Actor>();

            // Create background
            this.background = new base.Sprite(base.getLoader().getImage("background"));            
            stage.addChild(this.background);

            // Create actor layer
            this.actorLayer = new base.Node();
            stage.addChild(this.actorLayer);

            // Create FX layer
            this.fxLayer = new base.Node();
            stage.addChild(this.fxLayer);

            // Create UI layer
            this.uiLayer = new base.Node();
            stage.addChild(this.uiLayer);

            // Add music...
            //var mus = loader.getMusic("mymusic");
            //mus.play(); // music removed because of copyright

            this.font = loader.getFont("font");
            this.text = new base.Text(this.font,"Score: 0000");
            this.text.setPivotPosition(base.PivotPosition.MIDDLE);
            this.text.setPositionXY(0,-250);
            this.uiLayer.addChild(this.text);
        }

        public init(): void {
            this.player = new Player();
            this.player.spawn(new base.Vec2());

            this.crosshair = new Crosshair();
            this.uiLayer.addChild(this.crosshair);

            this.particles = new base.ParticleSystem(loader.getImage("dot"));
            this.fxLayer.addChild(this.particles);

            this.emitter = new base.ParticleEmitter();
            this.emitter.addSystem(this.particles);
            this.crosshair.addChild(this.emitter);

            this.emitter.setRate(100);
            this.particles.setGravity(new base.Vec2(0,200));
        }

        public addActor(a: Actor): void {
            this.actors.add(a);
            this.actorLayer.addChild(a.getSprite());
        }

        public removeActor(a: Actor): void {
            this.actors.remove(a);
            a.getSprite().removeFromParent();
        }
    
        private update() {

            var mouse = base.getMouse();
            var mousepos = stage.screenToWorld(mouse.getPosition());

            this.emitter.rotate(1);

            if(mouse.isButtonPressed(base.MouseButton.LEFT)) {
                var e = this.explosions.pop();
                e.spawn(mousepos);
                this.fxLayer.addChild(e.getSprite());
                this.explosions.unshift(e);
            }

            this.actors.forEach(a => a.update());
            this.crosshair.update();

            this.background.setScaleXY(1 + Math.cos(base.getTimeLast() * 0.00015) * 0.05);
            this.background.setRotation(Math.sin(base.getTimeCurrent() * 0.00025) * 5);

            stage.draw();
        }

    }

}
