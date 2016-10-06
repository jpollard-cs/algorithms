import { quickSort, pureQuickSort, mergeSort, insertionSort, quickSelect, threeWayQuickSort } from '../lib/sort';


test('mergeSort returns a sorted array', () => {
    let inputArray = [8,9,5,6,8,1,12,100,42];
    const sortedArray = [1,5,6,8,8,9,12,42,100];
    // not a pure implementation
    mergeSort(inputArray, [], 0, inputArray.length - 1);
    expect(inputArray).toEqual(sortedArray);
});

test('quickSort returns a sorted array', () => {
    let inputArray = [8,9,5,6,8,1,12,100,42];
    const sortedArray = [1,5,6,8,8,9,12,42,100];
    quickSort(inputArray);
    expect(inputArray).toEqual(sortedArray);
});

test('pureQuickSort returns a sorted array', () => {
    let inputArray = [8,9,5,6,8,1,12,100,42];
    const sortedArray = [1,5,6,8,8,9,12,42,100];
    expect(pureQuickSort(inputArray)).toEqual(sortedArray);
});

// test('threeWayQuickSort returns a sorted array', () => {
//     let inputArray = [8,3,3,4,3,2,2,8,3,4,4,5,1,8,8,4];
//     let sortedArray = [1,2,2,3,3,3,3,4,4,4,4,5,8,8,8,8];
//     threeWayQuickSort(inputArray);
//     expect(inputArray).toEqual(sortedArray);
// });

test('insertionSort returns a sorted array', () => {
    let inputArray = [8,9,5,6,8,1,12,100,42];
    const sortedArray = [1,5,6,8,8,9,12,42,100];
    insertionSort(inputArray);
    expect(inputArray).toEqual(sortedArray);
});

test('insertionSort returns an array sorted in descending order when provided with appropriate compare function', () => {
    let inputArray = [8,9,5,6,8,1,12,100,42];
    const sortedArray = [100,42,12,9,8,8,6,5,1];
    insertionSort(inputArray, (x, y) => x > y);
    expect(inputArray).toEqual(sortedArray);
});

test('quickSelect returns the kth largest value in the array', () => {
    let inputArray = [8,9,5,6,8,1,12,100,42];
    expect(quickSelect(inputArray, 4)).toBe(8);
    expect(quickSelect(inputArray, 5)).toBe(9);
    expect(quickSelect(inputArray, 7)).toBe(42);
    expect(quickSelect(inputArray, 8)).toBe(100);
    expect(() => quickSelect(inputArray, 11)).toThrowError(/out of bounds/);
});