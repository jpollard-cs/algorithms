/* 
███████╗ ██████╗ ██████╗ ████████╗██╗███╗   ██╗ ██████╗      █████╗ ██╗      ██████╗  ██████╗ ██████╗ ██╗████████╗██╗  ██╗███╗   ███╗███████╗
██╔════╝██╔═══██╗██╔══██╗╚══██╔══╝██║████╗  ██║██╔════╝     ██╔══██╗██║     ██╔════╝ ██╔═══██╗██╔══██╗██║╚══██╔══╝██║  ██║████╗ ████║██╔════╝
███████╗██║   ██║██████╔╝   ██║   ██║██╔██╗ ██║██║  ███╗    ███████║██║     ██║  ███╗██║   ██║██████╔╝██║   ██║   ███████║██╔████╔██║███████╗
╚════██║██║   ██║██╔══██╗   ██║   ██║██║╚██╗██║██║   ██║    ██╔══██║██║     ██║   ██║██║   ██║██╔══██╗██║   ██║   ██╔══██║██║╚██╔╝██║╚════██║
███████║╚██████╔╝██║  ██║   ██║   ██║██║ ╚████║╚██████╔╝    ██║  ██║███████╗╚██████╔╝╚██████╔╝██║  ██║██║   ██║   ██║  ██║██║ ╚═╝ ██║███████║
╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝     ╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
*/

import { lessThan, exchange, shuffle } from './helpers';

/**
 * pureQuickSort (not in-place implementation, but does not mutate input...
 * also note this implementation is not by the book .. there are various possible performance improvements)
 * for alternative implementation see below
 * also the V8 implementation: https://github.com/v8/v8/blob/master/src/js/array.js#L760
 * above algorithms may have improved space complexity
 * also note like with MergeSort you can use insertion sort for smaller sub-arrays as a performance improvement
 * time complexity: O(n lg n)
 * @param   {number[]} input unsorted input array
 * @returns {number[]}       sorted output array
 */
export function pureQuickSort(input) {
  if (input.length < 2) { return input; }

  const length = input.length;
  const pivotIndex = Math.floor(length / 2);
  const pivot = input[pivotIndex];
  const left = [];
  const right = [];
  const equal = [pivot];

  for (let i = 0; i < length; i++) {
    if (i === pivotIndex) { continue; }
    const x = input[i];
    if (x > pivot) {
      right.push(x);
    } else if (x < pivot) {
      left.push(x);
    } else {
      equal.push(x);
    }
  }

  return [...pureQuickSort(left), ...equal, ...pureQuickSort(right)];
};

/**
 * The real quickSort
 * this is the in-place version which is a big advantage of quickSort
 * over mergeSort (depending on the application, of course) and it is
 * also faster than mergeSort (at least for single-threaded applications)
 * despite having the same time complexity
 * also note that quickSort is not considered "stable"
 * the overhead for small sub-arrays is fairly high so this method could be improved, in practice,
 * by using an insertionSort for sub-arrays of <= than 10 items (~20% performance improvement)
 * Time Complexity: O(n lg n)
 * @param a {Object[]} - input unsorted array
 * @param less {compareFunction} [compareFunction=lessThan] compares to values of the array
 * to determine if they the first element is less than the second
 */
export function quickSort(a, less = lessThan) {

  function sort(low, high) {
    if (high <= low) { return; }
    // for performance improvement - see method notes re: cutoff
    // .. also would require modification to current implementation of insertionSort
    // if (high <= low + CUTOFF - 1) { insertionSort(a, low, high); return; }
    // another performance improvement can be to take the median of 3 random items
    // note below `medianOf3` needs to be implemented
    // const m = medianOf3(a, low, low + (high - low)/2, high);
    // exchange(a, low, m);
    const j = quickSortPartition(a, low, high, less);
    sort(low, j - 1); // sort left
    sort(j + 1, high); // sort right (j + 1 because item at index j already in place)
  }

  // alternative to above sort method
  // note that this method does not take advantage of Tail Call Optimization
  // we are simply optimizing the tail calls so they never can go deeper than lg n depth
  // by favoring the smaller of each array
  function tailRecursiveSort(low, high) {
    while (low < high) {
      const j = quickSortPartition(a, low, high, less);
      if (j - low < high - j) {
        tailRecursiveSort(low, j - 1);
        low = j + 1;
      } else {
        tailRecursiveSort(j + 1, high);
        high = j - 1;
      }
    }
  }

  shuffle(a); // shuffle is needed to guarantee performance of quick sort
  tailRecursiveSort(0, a.length - 1, less);
}

function quickSortPartition(a, low, high, less = lessThan) {
  let i = low;
  let j = high + 1; // +1 to simplify code where we decrement j
  const pivotValue = a[low];
  while (true) {
    while (less(a[++i], pivotValue)) { // find item on left to swap
      if (i === high) { break; }
    }

    while (less(pivotValue, a[--j])) { // find item on right to swap
      if (j === low) { break; }
    }

    if (i >= j) { break; } // check if pointers cross
    exchange(a, i, j); // if we get here, swap
  }

  exchange(a, low, j); // swap with partitioning item
  // because everything to the left of i is now <= a[low]
  // and everything to the right of j is now >= a[low]
  return j; // return index of item now known to be in place
}

/**
 * MergeSort - note this version mutates input
 * [TIME COMPLEXITY]: O(n lg n) due to N compares
 * at each level with lg n depth
 * NOTE that compares at each level are split
 * in half, but the number of merges at each
 * level also doubles which is why each level
 * consistently has N compares
 * Note this is not a pure implementation
 * @param a    {number[]}  Array to be sorted
 * @param aux  {number[]}  Auxiliary array
 * @param low  {number} start index
 * @param high {number} end index
 */
export function mergeSort(a, aux = [], low, high) {
  if (high <= low) { return; }
  // if (high <= low + CUTOFF - 1) { Insertion.sort(a, low, high); } => to improve efficiency of mergeSort for small sub-arrays
  const mid = Math.floor(low + (high - low) / 2);
  // we're basically doing no work until
  // we get down to two elements at which point
  // our merges start rolling up - by the time we
  // get back to this stack both halves of our array
  // will be sorted and ready for the final merge
  mergeSort(a, aux, low, mid);
  mergeSort(a, aux, mid + 1, high);
  if (!(a[mid + 1] < a[mid])) { return; } // then it's already sorted!
  merge(a, aux, low, mid, high);
}

function merge(a, aux, low, mid, high) {
  // copy
  for (let k = low; k <= high; k++) { // we can also swap a with aux to avoid this loop, but we'll keep this simple
    aux[k] = a[k];
  }

  // merge
  let i = low;
  let j = mid + 1;
  for (let k = low; k <= high; k++) {
    if      (i > mid)         { a[k] = aux[j++]; } // if i is exhausted use j (note a[k] is assigned to aux[j] before j is incremented)
    else if (j > high)        { a[k] = aux[i++]; } // if j is exhausted use i
    else if (aux[j] < aux[i]) { a[k] = aux[j++]; } // take j if less than i
    else                      { a[k] = aux[i++]; } // otherwise take i
  }
}

/**
 * Insertion sort
 * can be efficient for very small arrays
 * so can be used to make merge sort and quick sort a bit more efficient)
 * time complexity: O(n^2)
 * @param a    {Object[]}    input array
 * @param less {compareFunction} [compareFunction=lessThan] compares to values of the array
 * to determine if they the first element is less than the second
 */
export function insertionSort(a, less = lessThan) {
  const n = a.length;
  for (let i = 0; i < n; i++) {
    for (let j = i; j > 0; j--) {
      if (less(a[j], a[j - 1])) {
        exchange(a, j, j - 1);
      } else {
        break;
      }
    }
  }
}

/**
 * Finds the kth largest number in the input array
 * (modified version of quickSort partition function)
 * Time Complexity: O(n) with worst case of quadratic time like
 * @param a {number[]}
 * @param k {number}
 * @param less {compareFunction} [compareFunction=lessThan] compares to values of the array
 * to determine if they the first element is less than the second
 */
export function quickSelect(a, k, less = lessThan) {
  if (k < 0 || k >= a.length) { throw 'k is out of bounds'; }
  shuffle(a);
  let low = 0;
  let high = a.length - 1;
  while (high > low) {
    const j = quickSortPartition(a, low, high, less);
    if      (j < k) { low = j + 1; }  // then set lower bound on right side of j
    else if (j > k) { high = j - 1; } // then set upper bound on left side of j
    else            { return a[k]; }
  }

  return a[low];
}
