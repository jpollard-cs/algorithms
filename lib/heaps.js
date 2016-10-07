import { exchange, lessThan } from './helpers';

// priority queues have many applications, including efficient detection of particle collisions O(n lg n)
// https://www.youtube.com/watch?v=irbshkdVFao&index=37&list=PLxc4gS-_A5VDXUIOPkJkwQKYiT2T1t0I8
export const MaxPriorityQueue = {
    init: function(less = lessThan) {
        this.pq = []; // to simplify we'll avoid setting capacity here
        this.N = 0;
        this.lessThan = less;
    },
    isEmpty: function() {
        return this.N === 0;
    },
    /**
     * Swim - promotes child to appropriate position
     * when a child becomes larger than its parent's key
     * (Peter Principle - node promoted to highest level of incompetence)
     * @param k
     */
    swim: function(k) {
        const parentIndex = Math.floor(k/2);
        while (k > 1 && this.less(parentIndex, k)) {
            this.exch(k, parentIndex);
            k = parentIndex;
        }
    },
    /**
     * Insert adds a node at the end then swims it up
     * @param x
     */
    insert: function(x) {
        this.pq[++this.N] = x;
        this.swim(this.N);
    },
    /**
     * Sink - parent's key becomes smaller than one (or both) of it's children
     * (Power struggle - better subordinate promoted)
     * @param k
     */
    sink: function(k) {
        while (2*k <= this.N) {
            let j = 2*k;
            // children of node at k are at 2k and 2k + 1
            // so we need to figure out which is bigger because larger one gets promoted
            // so long as it's bigger than k
            if (j < this.N && this.less(j, j+1)) { j++; }
            if (!this.less(k, j))                { break;}
            this.exch(k, j);
            k = j;
        }
    },
    delMax: function() {
        const max = this.pq[1];
        this.exch(1, this.N--); // exchange bottom node with root then decrement N
        this.sink(1); // then do a sink which will automatically promote the right nodes
        // and put our heap back in order

        this.pq.splice(this.N+1, 1); // we exchanged the bottom node with the max/root node
        // so now we need to delete it (N + 1 because we already decremented N in preparation
        // for deletion) - since we moved it to the end of the array we don't need
        // any further balancing

        return max;
    },
    less: function(i, j) {
      return this.lessThan(this.pq[i], this.pq[j]);
    },
    exch: function(i, j) {
        exchange(this.pq, i, j);
    },
    sort: function() {
        for (let k = Math.floor(this.N/2); k >= 1; k--) {
            this.sink(k);
        }

        while (this.N > 1) {
            this.exch(1, this.N);
            this.sink(1, --this.N);
        }
    }

};
