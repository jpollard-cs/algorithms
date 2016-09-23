/* 
███████╗ ██████╗ ██████╗ ████████╗██╗███╗   ██╗ ██████╗      █████╗ ██╗      ██████╗  ██████╗ ██████╗ ██╗████████╗██╗  ██╗███╗   ███╗███████╗
██╔════╝██╔═══██╗██╔══██╗╚══██╔══╝██║████╗  ██║██╔════╝     ██╔══██╗██║     ██╔════╝ ██╔═══██╗██╔══██╗██║╚══██╔══╝██║  ██║████╗ ████║██╔════╝
███████╗██║   ██║██████╔╝   ██║   ██║██╔██╗ ██║██║  ███╗    ███████║██║     ██║  ███╗██║   ██║██████╔╝██║   ██║   ███████║██╔████╔██║███████╗
╚════██║██║   ██║██╔══██╗   ██║   ██║██║╚██╗██║██║   ██║    ██╔══██║██║     ██║   ██║██║   ██║██╔══██╗██║   ██║   ██╔══██║██║╚██╔╝██║╚════██║
███████║╚██████╔╝██║  ██║   ██║   ██║██║ ╚████║╚██████╔╝    ██║  ██║███████╗╚██████╔╝╚██████╔╝██║  ██║██║   ██║   ██║  ██║██║ ╚═╝ ██║███████║
╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝     ╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
*/

/**
 * QuickSort (not in-place implementation)
 * for alternative implementation
 * https://www.nczonline.net/blog/2012/11/27/computer-science-in-javascript-quicksort/
 * also the V8 implementation: https://github.com/v8/v8/blob/master/src/js/array.js#L760
 * above algorithms may have improved space complexity
 * also note that a random pivot will yield better performance
 * also note like with MergeSort you can use insertion sort for smaller sub-arrays as a performance improvement
 * performance can also be improved by taking the median of three random pivots then using that number as the pivot
 * to avoid potential quadratic worst-case scenario
 * time complexity: O(n lg n)
 * @param   {Array} input unsorted input array
 * @returns {Array}       sorted output array
 */
export function quickSort(input, compareTo) {
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

  return [...quicksort(left), ...equal, ...quicksort(right)];
};

/**
 * MergeSort - note this version mutates input
 * [TIME COMPLEXITY]: O(n lg n) due to N compares
 * at each level with lg n depth
 * NOTE that compares at each level are split
 * in half, but the number of merges at each
 * level also doubles which is why each level
 * consistently has N compares
 * [SPACE COMPLEXITY]:
 * @param a    {Array}  Array to be sorted
 * @param aux  {Array}  Auxiliary array
 * @param low  {number} start index
 * @param high {number} end index
 */
function mergeSort(a, aux = [], low, high) {
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