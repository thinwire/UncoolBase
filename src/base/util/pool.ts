namespace base {

    /**
     * Statically-sized pool.
     * TODO: make this something other than butt-slow
     */
    export class Pool<T> {
        private _free: T[];
        private _used: T[];
        private _total: number;
        private _numUsed: number;
        private _numFree: number;
        private _newestUsed: number;
        private _oldestUsed: number;

        constructor(size: number = 256, create: () => T) {
            this._free = [];
            this._used = [];
            this._total = size;
            this._numUsed = 0;
            this._numFree = size;
            for(var i = 0; i < size; ++i) {
                this._free[i] = create();
                this._used[i] = null;
            }
        }

        public alloc(): T {

            // TODO: make this faster

            var p = null;

            if(this._numFree > 0) {
                // Pick from free pile
                this._newestUsed = this._numUsed;
                p = this._used[this._numUsed++] = this._free[--this._numFree];
                this._free[this._numFree] = null;
            } else {
                // Pick from used pile
                p = this._used.shift();
                this._used.push(p);
            }

            return p;
        }

        public free(t: T): void {
            var idx = this._used.indexOf(t);
            if(idx >= 0) {
                var p = this._used[idx];
                this._used.splice(idx,1);
                this._numUsed--;
                this._free[this._numFree++] = p;
            }
        }

        public getTotalCount(): number {
            return this._total;
        }

        public getFreeCount(): number {
            return this._numFree;
        }

        public getUsedCount(): number {
            return this._numUsed;
        }
        
        public getUsed(idx: number): T {
            return this._used[idx];
        }
    }

}
