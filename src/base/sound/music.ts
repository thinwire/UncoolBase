/// <reference path="../base.ts" />

namespace base {

    export class Music {

        private _data: any; // WaudSound object
        private _volume: number;

        constructor(waud: any) {
            this._data = waud;
            this._volume = 1.0;
        }

        public play(): void {
            base.getMixer().playMusic(this);
        }

        public stop(): void {
            base.getMixer().stopMusic(this);
        }

        public getVolume(): number {
            return this._volume;
        }

        public setVolume(vol: number): Music {
            this._volume = vol;
            return this;
        }

        /** Get access to the Waud audio object */
        public getWaud(): any {
            return this._data;
        }

    }

}
