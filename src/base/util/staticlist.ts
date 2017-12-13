namespace base {

    /**
     * List that retains and returns instances of
     * a specified class or structure. Useful in 
     * things like retained display list records, etc.
     * 
     * This list will allocate objects as needed.
     * The objects will be reused once the list is cleared.
     */
    export class StaticList<T> {

        private _data: T[];
        private _size: number;
        private _items: number;

        private _fn_create: () => T;
        private _fn_init: (obj:T) => void;

        constructor(initialSize: number = 16, 
        create: () => T = ():T => { return <T>({}); }, 
        clear: (obj:T) => void = () => {}) {
            this._data = [];
            this._size = Math.max(4,initialSize) | 0;
            this._items = 0;
            this._fn_create = create;
            this._fn_init = clear;
            for(var i = 0; i < this._size; ++i) {
                this._data[i] = create();
            }
        }

        public getNext(): T {
            if(this._items == this._size) {
                var incr = Math.max(2,this._size >> 1) | 0;
                this._size += incr;
                while(incr--) {
                    this._data.push(this._fn_create());
                }
            }
            var obj = this._data[this._items++];
            this._fn_init(obj);
            return obj;
        }

        public get(idx: number): T {
            if(idx > this._items || idx < 0) return null;
            return this._data[idx];
        }

        public size(): number {
            return this._items;
        }

        public clear(): void {
            this._items = 0;
        }
    }
}
