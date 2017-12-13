//
// Ringbuffer implementation
//

namespace base {
    export class Ringbuffer<T> {
        private _data: T[];
        private _size: number;
        private _items: number;
        private _pos: number;

        constructor(maxsize: number = 16) {
            this._data = [];
            for(var i = 0; i < maxsize; ++i) {
                this._data[i] = null;
            }
            this._size = maxsize;
            this._items = 0;
            this._pos = 0;
        }

        public size(): number {
            return this._items;
        }

        public add(item: T): void {
            var idx = (this._pos + this._items) % this._size;
            this._data[idx] = item;

            if(this._items == this._size - 1) {
                this._pos = (this._pos + 1) % this._size;
            } else {
                this._items++;
            }
        }

        public clear(): void {
            for(var i = 0; i < this._size; ++i) {
                this._data[i] = null;
            }
            this._items = 0;
            this._pos = 0;
        }

        public get(idx: number): T {
            var p = (this._pos + (idx % this._items)) % this._size;
            return this._data[p];
        }
    }
}
