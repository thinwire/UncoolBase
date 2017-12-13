/// <reference path="../base.ts" />

namespace base {

    /**
     * Internal container structure used for lists that can be
     * modified during iteration.
     */
    export class SafeList<T> {

        private _data: T[];
        private _items: number;
        private _iterator: number;
        private _locked: boolean;

        private _addQueue: T[];
        private _killQueue: T[];
        private _clear: boolean;

        constructor() {
            this._data = [];
            this._items = 0;
            this._iterator = 0;
            this._locked = false;

            this._addQueue = [];
            this._killQueue = [];
            this._clear = false;
        }

        public add(item: T): void {
            if(this._data.indexOf(item) >= 0) return;

            if(this._locked) {
                if(this._addQueue.indexOf(item) < 0) {
                    this._addQueue.push(item);
                }
            } else {
                this._data.push(item);
                this._items++;
            }
        }

        public remove(item: T): void {
            if(this._locked) {
                this._killQueue.push(item);
            } else {
                var idx = this._data.indexOf(item);
                if(idx >= 0) {
                    this._data.splice(idx,1);
                    this._items--;
                }
            }
        }

        public forEach(fn: (item: T) => void): void {
            this._locked = true;
            for(this._iterator = 0; this._iterator < this._items; ++this._iterator) {
                var data = this._data[this._iterator];
                fn(data);
            }
            this._locked = false;

            while(this._killQueue.length) {
                var item = this._killQueue.pop();
                var idx = this._data.indexOf(item);
                if(idx >= 0) {
                    this._data.splice(idx,1);
                    this._items--;
                }   
            }

            while(this._addQueue.length) {
                this._data.push(this._addQueue.shift());
                this._items++;
            }

            if(this._clear) {
                this.clear();
            }

        }

        public clear(): void {
            if(this._locked) {
                this._clear = true;
            } else {
                while(this._data.length) {
                    this._data.pop();
                }
                this._items = 0;
            }
            
        }

    }

}
