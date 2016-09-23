/* 
███████╗ ██████╗ ██████╗ ████████╗██╗███╗   ██╗ ██████╗      █████╗ ██╗      ██████╗  ██████╗ ██████╗ ██╗████████╗██╗  ██╗███╗   ███╗███████╗
██╔════╝██╔═══██╗██╔══██╗╚══██╔══╝██║████╗  ██║██╔════╝     ██╔══██╗██║     ██╔════╝ ██╔═══██╗██╔══██╗██║╚══██╔══╝██║  ██║████╗ ████║██╔════╝
███████╗██║   ██║██████╔╝   ██║   ██║██╔██╗ ██║██║  ███╗    ███████║██║     ██║  ███╗██║   ██║██████╔╝██║   ██║   ███████║██╔████╔██║███████╗
╚════██║██║   ██║██╔══██╗   ██║   ██║██║╚██╗██║██║   ██║    ██╔══██║██║     ██║   ██║██║   ██║██╔══██╗██║   ██║   ██╔══██║██║╚██╔╝██║╚════██║
███████║╚██████╔╝██║  ██║   ██║   ██║██║ ╚████║╚██████╔╝    ██║  ██║███████╗╚██████╔╝╚██████╔╝██║  ██║██║   ██║   ██║  ██║██║ ╚═╝ ██║███████║
╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝     ╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
*/

/**
 * QuickSort (https://jsbin.com/yalico/edit?js,console)
 * for alternative implementation
 * https://www.nczonline.net/blog/2012/11/27/computer-science-in-javascript-quicksort/
 * also the V8 implementation: https://github.com/v8/v8/blob/master/src/js/array.js#L760
 * above algorithms may have improved space complexity
 * time complexity: O(n log n)
 * @param   {Array} input unsorted input array
 * @returns {Array}       sorted output array
 */
export function quicksort(input) {
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
