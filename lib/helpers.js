/**
 * Takes an Array a and swaps item at index i with item at index j
 * @param a {Object[]}
 * @param i {Object}
 * @param j {Object}
 */
export function exchange(a, i, j) {
    const ai = a[i];
    a[i] = a[j];
    a[j] = ai;
}

/**
 * Default function for comparing if x is less than y
 * @param x {number}
 * @param y {number}
 * @returns {boolean}
 */
export function lessThan(x, y) {
    return x < y;
}

/**
 * Shuffles an array with a pseudo-uniform distribution
 * (pseudo because relies on built-in Math.random() function)
 * @param a {Object[]}
 * Time Complexity: O(n)
 */
export function shuffle(a) {
    const n = a.length;
    for (let i = 0; i < n; i++) {
        const r = generateRandomInteger(0, i);
        exchange(a, i, r);
    }
}

/**
 * generates a random integer between low and high
 * (to the extent that Math.random() is actually random)
 * @param low  {number}
 * @param high {number}
 */
export function generateRandomInteger(low, high) {
    const min = Math.ceil(low);
    const max = Math.floor(high);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}