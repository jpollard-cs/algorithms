/*
  ██████╗ ██████╗  █████╗ ██████╗ ██╗  ██╗     █████╗ ██╗      ██████╗  ██████╗ ██████╗ ██╗████████╗██╗  ██╗███╗   ███╗███████╗
 ██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██║  ██║    ██╔══██╗██║     ██╔════╝ ██╔═══██╗██╔══██╗██║╚══██╔══╝██║  ██║████╗ ████║██╔════╝
 ██║  ███╗██████╔╝███████║██████╔╝███████║    ███████║██║     ██║  ███╗██║   ██║██████╔╝██║   ██║   ███████║██╔████╔██║███████╗
 ██║   ██║██╔══██╗██╔══██║██╔═══╝ ██╔══██║    ██╔══██║██║     ██║   ██║██║   ██║██╔══██╗██║   ██║   ██╔══██║██║╚██╔╝██║╚════██║
 ╚██████╔╝██║  ██║██║  ██║██║     ██║  ██║    ██║  ██║███████╗╚██████╔╝╚██████╔╝██║  ██║██║   ██║   ██║  ██║██║ ╚═╝ ██║███████║
  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝    ╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
 */

/**
 * Weighted Quick Union With Path Halving
 * the amortized time per union, find,
 * and connected operation has inverse Ackermann complexity.
 * based on implementation which can be found here: http://algs4.cs.princeton.edu/15uf/WeightedQuickUnionPathHalvingUF.java.html
 * additional details can be found here: http://algs4.cs.princeton.edu/15uf/
 * @type {{init: WeightedQuickUnionPathHalvingUF.init, count: WeightedQuickUnionPathHalvingUF.count, root: WeightedQuickUnionPathHalvingUF.root, connected: WeightedQuickUnionPathHalvingUF.connected, union: WeightedQuickUnionPathHalvingUF.union}}
 */
export const WeightedQuickUnionPathHalvingUF = {
    /**
     * initializes quick find by setting the id of each object to itself
     * (N array accesses)
     * @param n {number} number of nodes
     */
    init: function(n) {
        this.id = [];
        this.size = []; // this is really "rank"
        this.numComponents = n;
        for (let i = 0; i < n; i++) {
            // set id of each object to itself (n array accesses)
            this.id[i] = i;
            this.size[i] = 1;
        }
    },
    /**
     * returns the number of components (connected nodes)
     * @returns {*|number}
     */
    count: function() {
        return this.numComponents;
    },
    /**
     * gets the root index of a node
     * (depth of i array accesses)
     * @param i {number}
     * @returns {number}
     */
    root: function(i) {
        let index = i;
        while (index !== this.id[index]) {
            // path compression - point every other node in the tree to its grandparent
            this.id[index] = this.id[this.id[index]];
            index = this.id[index];
        }
        return index;
    },
    /**
     * checks whether p and q are in the same component
     * (depth of p and q array accesses)
     * @param p {number}  node at index p
     * @param q {number}  node at index q
     * @returns {boolean} returns true if p and q are in the same component
     * otherwise returns false
     */
    connected: function(p, q) {
        return this.root(p) === this.root(q)
    },
    /**
     * changes the root of p to point to the root of q
     * (depth of p and q array accesses)
     * @param p {number}  node at index p
     * @param q {number}  node at index q
     */
    union: function(p, q) {
        const i = this.root(p); // i is the root of p
        const j = this.root(q); // j is the root of q
        if (this.size[i] < this.size[j]) { this.id[i] = j; this.size[j] += this.size[i]; }
        else                             { this.id[j] = i; this.size[i] += this.size[j]; }
        if(i !== j) { this.numComponents--; }
    }
};

/**
 * Returns an initialized WeightedQuickUnionPathHalvingUF instance with n nodes
 * @param n
 * @returns {WeightedQuickUnionPathHalvingUF}
 * @constructor
 */
export function UnionFindFactory(n) {
    const uf = Object.create(WeightedQuickUnionPathHalvingUF);
    uf.init(n);
    return uf;
}