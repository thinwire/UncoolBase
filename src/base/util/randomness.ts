namespace base {

    export function pickRandom<T>(array: T[]): T {
        var sz = array.length;
        var idx = (Math.random() * sz) | 0;
        return array[idx];
    }

    export function shuffle(array: any[]): void {
        var j, x, i;
        for (i = array.length - 1; i > 0; i--) {
            j = (Math.random() * (i + 1)) | 0;
            x = array[i];
            array[i] = array[j];
            array[j] = x;
        }
    }

    export function rotate(array: any[]): void {
        array.push(array.shift());
    }

    export function rand(min: number, max: number): number {
        return min + (Math.random() * (max - min));
    }
}
