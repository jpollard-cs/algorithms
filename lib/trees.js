import { compareTo, assert } from './helpers';

const BLACK = false;
const RED   = true;

function nodeFactory(key, value, color = BLACK, left = null, right = null) {
  return {
      key,
      value,
      count: 1,
      color: BLACK
  }
}

/**
 * Binary Search Tree - has many uses
 * some of its main advantages over binary or sequential search of an ordered array
 * are that it can perform many operations in time proportional to lg n (based on tree height)
 * including search, insert, min/max, floor/ceiling, rank and select (ordered iteration takes N time)
 * Time Complexity (search, insert, delete): average is 1.39 lg N (not sure about delete), worst case is N
 */
const BinarySearchTree = {
    init: function(rootKey, rootValue, compare = compareTo) {
        this.compareTo = compare;
        this.root = nodeFactory(rootKey, rootValue);
    },
    put: function(key, value) {
        this.checkInit();
        function put(node, key, value) {
            if (node == null) { return nodeFactory(key, value); }
            const cmp = this.compareTo(key, node.key);
            if      (cmp < 0) { node.left  = put(node.left , key, value); }
            else if (cmp > 0) { node.right = put(node.right, key, value); }
            else              { node.value = value; }
            node.count = 1 + this.size(node.left) + this.size(node.right);
            return node;
        }
        this.root = put(this.root, key, value);
    },
    get: function(key) {
        this.checkInit();
        let x = this.root;
        while (x != null) {
            const cmp = this.compareTo(key, x.key);
            if      (cmp < 0) { x = x.left; }
            else if (cmp > 0) { x = x.right; }
            else              { return x.value; }
        }
        return null;
    },
    floor: function(key) {
      function floor(node, key) {
          if (node == null) { return null; }

          const cmp = this.compareTo(key, node.key);
          if (cmp === 0) { return node; } // they're equal so we return the exact value
          if (cmp < 0)   { return floor(node.left, key); } // then the key is less than this node's key

          const t = floor(node.right, key); // otherwise the key is greater than this node's key
          if (t != null) { return t; }
          else           { return node; } // if the right search doesn't return anything (t) then we know the
          // node we already have is the floor!
      }
      const x = floor(this.root, key);
      if (x == null) { return null; }
      return x.key;
    },
    rank: function(k) {
        function rank(key, node) {
            if (node == null) { return 0; }
            const cmp = this.compareTo(key, node.key);
            if (cmp < 0) { return rank(key, node.left); }
            if (cmp > 0) { return 1 + this.size(node.left) + rank(key, node.right); }
            return this.size(node.right);
        }
        return rank(key, this.root);
    },
    removeMin: function() {
      function removeMin(node) {
          if (node.left == null) { return node.right; }
          node.left = removeMin(node.left);
          node.count = 1 + this.size(node.left) + this.size(node.right);
          return node;
      }
      this.root = removeMin(this.root);
    },
    min: function(node) {
      let result = node;
      while (result.left != null) {
          result = result.left;
      }
      return result;
    },
    /**
     * Removes a node using Hibbard Deletion - this is not ideal/robust because after many deletions can lead to tree
     * depth of sqrt(n) - we can address this better with Red Black BSTs
     * @param key
     */
    remove: function(key) {
        this.checkInit();
        function remove(node, key) {
            if (node == null) { return null; }
            const cmp = this.compareTo(key, node.key);
            if      (cmp < 0) { node.left  = remove(node.left , key); } // search for key
            else if (cmp > 0) { node.right = remove(node.right, key); } // search for key
            else {
                if (node.right == null) { return node.left; } // no right child makes our lives easier

                const t = node;
                node = this.min(t.right);
                node.right = this.removeMin(t.right);
                node.left = t.left;
            }
            node.count = 1 + this.size(node.left) + this.size(node.right);
            return node;
        }
        this.root = remove(this.root, key);
    },
    size: function(node) {
      if (node == null) { return 0; }
      return node.count;
    },
    checkInit: function() {
      if (!this.root) {
          throw 'BST Not Initialized!';
      }
    },
    keys: function () {
        function inOrder(node, q) {
            if (node == null) { return; }
            inOrder(node.left, q);
            q.push[node.key];
            inOrder(node.right, q);
        }
        let queue = [];
        inOrder(this.root, queue);
        return queue;
    },
    iterator: function*() {
        this.checkInit();
    }
};

/**
 * Left Leaning Red Black Binary Search Tree
 * Time Complexity (search, insert, delete): average is lg N, worst case is 2 lg N
 */
const LeftLeaningRedBlackBST = {
    init: function(rootKey, rootValue, compare = compareTo) {
        this.compareTo = compare;
        this.root = nodeFactory(rootKey, rootValue);
    },
    get: function(key) {
        this.checkInit();
        let x = this.root;
        while (x != null) {
            const cmp = this.compareTo(key, x.key);
            if      (cmp < 0) { x = x.left; }
            else if (cmp > 0) { x = x.right; }
            else              { return x.value; }
        }
        return null;
    },
    /**
     * Put/Insert
     * Case 1: Insert into a 2-node at the bottom
     *  1.) Do standard BST insert; color new link red
     *  2.) If new red link is a right link, rotate left
     * Case 2: Insert a 3-node at the bottom
     *  1.) Do standard BST insert; color new link red
     *  2.) Rotate to balance the 4-node (if needed)
     *  3.) Flip colors to pass red link up one level
     *  4.) Rotate to make lean left (if needed)
     * Finally:
     *  Repeat Case 1 or Case 2 up the tree (if needed)
     * @param node
     */
    put: function(node) {
        function put(node, key, value) {
            if (node == null) { return nodeFactory(key, value, RED); } // insert at bottom (and color red)
            const cmp = this.compareTo(key, node.key);
            if      (cmp < 0) { node.left  = put(node.left , key, value); }
            else if (cmp > 0) { node.right = put(node.right, key, value); }
            else              { node.value = value; }

            // lean left
            if (this.isRed(node.right) && !this.isRed(node.left))    { node = this.rotateLeft(node); }
            // balance 4-node (next we'll split this)
            if (this.isRed(node.left) && this.isRed(node.left.left)) { node = this.rotateRight(node); }
            // split 4-node (splitting the 4-node we balanced or other scenarios can get us here as well e.g
            // initial insert on right of node with red left node)
            if (this.isRed(node.left) && this.isRed(node.right))     { this.flipColors(node); }

            return node;
        }
    },
    isRed: function(node) {
        return node == null ?  false : node.color === RED;
    },
    /**
     * orients a right-leaning red link to lean left
     * maintains symmetric order and perfect black balance
     * (so we don't increase the height of the tree)
     * @param node
     * @returns {*}
     */
    rotateLeft: function(node) {
        assert(this.isRed(node.right));
        const x = node.right;
        node.right = x.left;
        x.left = node;
        x.color = node.color;
        node.color = RED;
        return x;
    },
    /**
     * orients a left-leaning red link to (temporarily) lean right
     * as with the `rotateLeft` operation this maintains symmetric
     * order and perfect black balance
     * @param node
     * @returns {*}
     */
    rotateRight: function(node) {
        assert(this.isRed(node.left));
        const x = node.left;
        node.left = x.right;
        x.right = node;
        x.color = node.color;
        node.color = RED;
        return x;
    },
    /**
     *
     * @param node
     */
    flipColors: function(node){
        assert(!this.isRed(node));
        assert(this.isRed(node.left));
        assert(this.isRed(node.right));
        node.color = RED;
        node.left.color = BLACK;
        node.right.color = BLACK;
    }
};