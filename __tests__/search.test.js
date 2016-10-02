import { binarySearch } from '../lib/search';

test('binarySearch finds first index of search value in input array', () => {
    const inputArray = [8,9,5,6,8,1,12,100,42];
    expect(binarySearch(inputArray, 8)).toBe(4);
    expect(binarySearch(inputArray, 12)).toBe(6);
});

test('binarySearch returns -1 if search value is not found in input array', () => {
    const inputArray = [8,9,5,6,8,1,12,100,42];
    expect(binarySearch(inputArray, 34)).toBe(-1);
});