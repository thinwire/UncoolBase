/// <reference path="../base.ts" />

declare var WaudSound : any;

namespace base {

    /**
     * Simple sound object based on Waud.js
     */
    export class Sound {

        private _data: any;
        private _volume: number;
        private _stereo: number;

        constructor(url: string) {
            this._data = new WaudSound(url, { loop: false, autoolay: false, volume: 1.0 });
            this._volume = 1.0;
            this._stereo = 0;
        }

        public play(): Sound {
            base.getMixer().playSound(this);
            return this;
        }

        public stop(): Sound {
            base.getMixer().stopSound(this);
            return this;
        }

        /**
         * Return volume between 0 and 1
         */
        public getVolume(): number {
            return this._volume;
        }

        /**
         * Set volume (float value between 0 and 1)
         */
        public setVolume(vol: number): Sound {
            this._volume = clamp(vol,0,1);
            return this;
        }

        /**
         * Get stereo bias (-1: left, 0: center, 1: right)
         * TODO: implement this feature!
         */
        public getStereoBias(): number {
            return this._stereo;
        }

        /**
         * Set stereo bias (-1: left, 0: center, 1: right)
         * TODO: implement this feature!
         */
        public setStereoBias(bias: number = 0): Sound {
            this._stereo = clamp(bias,-1,1);
            return this;
        }

        public getWaud(): any {
            return this._data;
        }

    }

}
