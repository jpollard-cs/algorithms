/* 
███████╗ ██████╗ ██████╗ ████████╗██╗███╗   ██╗ ██████╗      █████╗ ██╗      ██████╗  ██████╗ ██████╗ ██╗████████╗██╗  ██╗███╗   ███╗███████╗
██╔════╝██╔═══██╗██╔══██╗╚══██╔══╝██║████╗  ██║██╔════╝     ██╔══██╗██║     ██╔════╝ ██╔═══██╗██╔══██╗██║╚══██╔══╝██║  ██║████╗ ████║██╔════╝
███████╗██║   ██║██████╔╝   ██║   ██║██╔██╗ ██║██║  ███╗    ███████║██║     ██║  ███╗██║   ██║██████╔╝██║   ██║   ███████║██╔████╔██║███████╗
╚════██║██║   ██║██╔══██╗   ██║   ██║██║╚██╗██║██║   ██║    ██╔══██║██║     ██║   ██║██║   ██║██╔══██╗██║   ██║   ██╔══██║██║╚██╔╝██║╚════██║
███████║╚██████╔╝██║  ██║   ██║   ██║██║ ╚████║╚██████╔╝    ██║  ██║███████╗╚██████╔╝╚██████╔╝██║  ██║██║   ██║   ██║  ██║██║ ╚═╝ ██║███████║
╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝     ╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
*/

/**
 * QuickSort
 *  for alternative implementation
 * (which is more technically correct and probably more efficient)
 * https://www.nczonline.net/blog/2012/11/27/computer-science-in-javascript-quicksort/
 * also the V8 implementation: https://github.com/v8/v8/blob/master/src/js/array.js#L760
 * @param  {Array} input unsorted input array
 * @return {Array}       sourted output array
 */
export function quicksort(input) {
  if (input.length < 2) { return input; }

  const length = input.length;
  const pivotIndex = Math.floor(length / 2);
  const pivot = input[pivotIndex];
  const left = [];
  const right = [];

  for (let i = 0; i < length; i++) {
    if (i === pivotIndex) { continue; }
    const x = input[i];
    if (x >= pivot) {
      right.push(x);
    } else {
      left.push(x);
    }
  }

  return [..._quicksort(left), pivot, ..._quicksort(right)];
};
