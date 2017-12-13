/// <reference path="../base.ts" />

namespace base {

    /**
     * Simple audio mixer based on Waud.js
     * 
     * Makes sure that no more than one instance of a sound
     * is getting started per frame. Can impose other limitations.
     */
    export class Mixer {

        private static MAXSOUNDS: number = 16;

        private _music: Music = null;
        private _soundQueue: Sound[] = [];

        private _soundVolume: number;
        private _musicVolume: number;

        constructor() {
            this._soundVolume = 1;
            this._musicVolume = 1;
        }

        public getVolume(): number {
            return Waud.getVolume();
        }

        public setVolume(vol: number): Mixer {
            Waud.setVolume(clamp(vol,0,1));
            return this;
        }

        public getSoundVolume(): number {
            return this._soundVolume;
        }

        public setSoundVolume(vol: number): Mixer {
            this._soundVolume = clamp(vol,0,1);
            return this;
        }

        public setMusicVolume(vol: number): Mixer {
            this._musicVolume = clamp(vol,0,1);
            if(this._music != null) {
                this._music.getWaud().setVolume(this._musicVolume * this._music.getVolume());
            }
            return this;
        }

        public stopAllSounds(): void {
            Waud.stop();
        }

        public playSound(sound: Sound): void {
            if(this._soundQueue.indexOf(sound) === -1) {
                this._soundQueue.push(sound);
            }
            if(this._soundQueue.length > Mixer.MAXSOUNDS) {
                this._soundQueue.shift();
            }
        }

        public playMusic(music: Music): void {
            if(this._music == music) {
                music.getWaud().stop();
            }
            this._music = music;
            this._music.getWaud().setVolume(this._musicVolume * this._music.getVolume());
            this._music.getWaud().play();
        }

        public stopMusic(music: Music = null): void {
            if(this._music == music) {
                this._music.getWaud().stop();
            }
        }

        public stopSound(sound: Sound): void {
            var idx = this._soundQueue.indexOf(sound);
            if(idx >= 0) {
                this._soundQueue.splice(idx,1);
            } else {
                sound.getWaud().stop();
            }
        }

        public update(): void {

            while(this._soundQueue.length) {
                var sound = this._soundQueue.pop();
                sound.getWaud().setVolume(sound.getVolume() * this._soundVolume);
                sound.getWaud().play();
            }

        }

    }

}
