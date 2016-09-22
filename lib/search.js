function binarySearch(a, key) {
  let low = 0;
  let high = a.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if      (key < a[mid]) { high = mid - 1; }
    else if (key > a[mid]) { low = mid + 1; } 
    else { return mid; }
  }
  
  return -1;
}
